import Parser from "rss-parser";
import type { PoolClient } from "pg";
import pool from "../db";
import { detectIocType } from "../utils/iocUtils";
import type { IocType } from "../constants/provider.interface";

type FeedConfig = {
  name: string;
  feedUrl: string;
  siteUrl?: string;
};

type RssItem = {
  title?: string;
  link?: string;
  pubDate?: string;
  isoDate?: string;
  content?: string;
  contentSnippet?: string;
  summary?: string;
  description?: string;
  ["content:encoded"]?: string;
};

type RssFeed = {
  items: RssItem[];
};

type ParsedArticle = {
  title: string;
  summary?: string;
  url: string;
  publishedAt?: Date;
  content?: string;
};

type ExtractedIoc = { type: IocType; value: string };

export type ScrapeStats = {
  feedsAttempted: number;
  feedsSucceeded: number;
  articlesProcessed: number;
  articlesInserted: number;
  iocsInserted: number;
};

const DEFAULT_NEWS_FEEDS: FeedConfig[] = [
  {
    name: "The Hacker News",
    feedUrl: "https://feeds.feedburner.com/TheHackersNews",
    siteUrl: "https://thehackernews.com",
  },
  {
    name: "Krebs on Security",
    feedUrl: "https://krebsonsecurity.com/feed/",
    siteUrl: "https://krebsonsecurity.com",
  },
  {
    name: "BleepingComputer",
    feedUrl: "https://www.bleepingcomputer.com/feed/",
    siteUrl: "https://www.bleepingcomputer.com",
  },
  {
    name: "CISA Alerts",
    feedUrl: "https://www.cisa.gov/uscert/ncas/alerts.xml",
    siteUrl: "https://www.cisa.gov",
  },
];

const URL_REGEX = /\bhttps?:\/\/[^\s"'<>]+/gi;
const IPV4_REGEX =
  /\b(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\b/gi;
const IPV6_REGEX = /\b(?:[a-f0-9]{1,4}:){2,7}[a-f0-9]{1,4}\b/gi;
const DOMAIN_REGEX = /\b(?:[a-z0-9-]+\.)+[a-z]{2,}\b/gi;
const HASH_REGEX = /\b(?:[a-f0-9]{32}|[a-f0-9]{40}|[a-f0-9]{64})\b/gi;

function parsePublishedDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, " ");
}

function trimBoundaries(value: string): string {
  return value.replace(/^[\s"'`([{<]+|[\s"'`)\]}>]+$/g, "");
}

function normalizeIocValue(rawValue: string, type: IocType): string {
  let normalized = trimBoundaries(rawValue.trim().toLowerCase());

  if (!normalized) return normalized;

  if (type === "url") {
    normalized = normalized.replace(/^https?:\/\//, "").replace(/\/+$/, "");
  }

  if (type === "domain") {
    normalized = normalized.replace(/^https?:\/\//, "");
    normalized = normalized.split("/")[0] ?? normalized;
  }

  if (type === "ip") {
    normalized = normalized.replace(/^\[|\]$/g, "");
  }

  return normalized;
}

function extractIocsFromText(text: string): ExtractedIoc[] {
  const plainText = stripHtml(text);
  const candidates = new Set<string>();

  const collectMatches = (regex: RegExp): void => {
    regex.lastIndex = 0;
    for (const match of plainText.matchAll(regex)) {
      candidates.add(trimBoundaries(match[0]));
    }
  };

  collectMatches(URL_REGEX);
  collectMatches(IPV4_REGEX);
  collectMatches(IPV6_REGEX);
  collectMatches(DOMAIN_REGEX);
  collectMatches(HASH_REGEX);

  const seen = new Set<string>();
  const extracted: ExtractedIoc[] = [];

  for (const candidate of candidates) {
    const detection = detectIocType(candidate);
    if (!detection.type) continue;

    const normalized = normalizeIocValue(candidate, detection.type);
    if (!normalized) continue;

    const key = `${detection.type}:${normalized}`;
    if (seen.has(key)) continue;

    seen.add(key);
    extracted.push({ type: detection.type, value: normalized });
  }

  return extracted;
}

class NewsScraper {
  private parser: Parser<RssFeed, RssItem>;

  constructor(private readonly feeds: FeedConfig[] = DEFAULT_NEWS_FEEDS) {
    this.parser = new Parser<RssFeed, RssItem>();
  }

  async run(): Promise<ScrapeStats> {
    const stats: ScrapeStats = {
      feedsAttempted: 0,
      feedsSucceeded: 0,
      articlesProcessed: 0,
      articlesInserted: 0,
      iocsInserted: 0,
    };

    const client = await pool.connect();

    try {
      for (const feed of this.feeds) {
        stats.feedsAttempted += 1;

        try {
          const parsedFeed = await this.parser.parseURL(feed.feedUrl);
          const sourceId = await this.upsertSource(client, feed);
          const items = parsedFeed.items ?? [];

          stats.feedsSucceeded += 1;

          for (const item of items) {
            const article = this.mapItemToArticle(item);
            if (!article) continue;

            await client.query("BEGIN");

            try {
              const { articleId, inserted } = await this.saveArticle(
                client,
                sourceId,
                article,
              );

              const iocs = extractIocsFromText(
                [article.title, article.summary, article.content, article.url]
                  .filter(Boolean)
                  .join(" "),
              );

              const insertedIocs = await this.persistIocs(
                client,
                articleId,
                iocs,
              );

              await client.query("COMMIT");

              stats.articlesProcessed += 1;
              stats.iocsInserted += insertedIocs;
              if (inserted) stats.articlesInserted += 1;
            } catch (error) {
              await client.query("ROLLBACK");
              console.error(
                `News scraper: failed to process article ${article.url}`,
                error,
              );
              continue;
            }
          }
        } catch (error) {
          console.error(
            `News scraper: failed to process feed ${feed.feedUrl}`,
            error,
          );
        }
      }
    } finally {
      client.release();
    }

    return stats;
  }

  private async upsertSource(
    client: PoolClient,
    feed: FeedConfig,
  ): Promise<string> {
    const result = await client.query<{ id: string }>(
      `
      INSERT INTO news_sources (name, feed_url, site_url)
      VALUES ($1, $2, $3)
      ON CONFLICT (feed_url)
      DO UPDATE SET
        name = EXCLUDED.name,
        site_url = COALESCE(EXCLUDED.site_url, news_sources.site_url),
        updated_at = CURRENT_TIMESTAMP
      RETURNING id
      `,
      [feed.name, feed.feedUrl, feed.siteUrl ?? null],
    );

    if (!result.rows[0]?.id) {
      throw new Error(`Failed to upsert news source for feed ${feed.feedUrl}`);
    }

    return result.rows[0].id;
  }

  private mapItemToArticle(item: RssItem): ParsedArticle | null {
    const url = item.link?.trim();
    if (!url) return null;

    const title = item.title?.trim() || "Untitled news item";
    const summary =
      item.contentSnippet?.trim() ||
      item.summary?.trim() ||
      item.description?.trim() ||
      item.content?.trim();

    const contentPieces = [
      item.title,
      item.contentSnippet,
      item.content,
      item.summary,
      item.description,
      item["content:encoded"],
    ]
      .filter(Boolean)
      .join(" ");

    return {
      title,
      summary,
      url,
      publishedAt: parsePublishedDate(item.isoDate ?? item.pubDate),
      content: contentPieces,
    };
  }

  private async saveArticle(
    client: PoolClient,
    sourceId: string,
    article: ParsedArticle,
  ): Promise<{ articleId: string; inserted: boolean }> {
    const result = await client.query<{ id: string; inserted: boolean }>(
      `
      INSERT INTO news_articles (source_id, title, summary, url, published_at)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (url) DO UPDATE SET
        title = EXCLUDED.title,
        summary = COALESCE(EXCLUDED.summary, news_articles.summary),
        published_at = COALESCE(EXCLUDED.published_at, news_articles.published_at)
      RETURNING id, (xmax = 0) AS inserted
      `,
      [
        sourceId,
        article.title,
        article.summary ?? null,
        article.url,
        article.publishedAt ?? null,
      ],
    );

    if (!result.rows[0]) {
      throw new Error(`Failed to upsert news article for url: ${article.url}`);
    }

    return {
      articleId: result.rows[0].id,
      inserted: result.rows[0].inserted,
    };
  }

  private async persistIocs(
    client: PoolClient,
    articleId: string,
    iocs: ExtractedIoc[],
  ): Promise<number> {
    let inserted = 0;

    for (const ioc of iocs) {
      const result = await client.query(
        `
        INSERT INTO news_iocs (article_id, ioc_type, ioc_value)
        VALUES ($1, $2, $3)
        ON CONFLICT (article_id, ioc_type, ioc_value) DO NOTHING
        `,
        [articleId, ioc.type, ioc.value],
      );

      inserted += result.rowCount ?? 0;
    }

    return inserted;
  }
}

export async function runNewsScraper(
  feeds: FeedConfig[] = DEFAULT_NEWS_FEEDS,
): Promise<ScrapeStats> {
  const scraper = new NewsScraper(feeds);
  return scraper.run();
}

export { NewsScraper, DEFAULT_NEWS_FEEDS };
