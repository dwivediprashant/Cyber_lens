import { Request, Response } from "express";
import { fetchNewsDetail, fetchNewsList } from "../services/newsService";
import { runNewsScraper } from "../services/newsScraper";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

function extractQueryValue(raw?: unknown): string | undefined {
  if (typeof raw === "string") return raw;
  if (Array.isArray(raw) && typeof raw[0] === "string") return raw[0];
  return undefined;
}

function parseLimit(raw?: unknown): number {
  const value = extractQueryValue(raw);

  if (value) {
    const parsed = parseInt(value, 10);
    if (!Number.isNaN(parsed) && parsed > 0) {
      return Math.min(parsed, MAX_LIMIT);
    }
  }

  return DEFAULT_LIMIT;
}

function parseOffset(raw?: unknown): number {
  const value = extractQueryValue(raw);

  if (value) {
    const parsed = parseInt(value, 10);
    if (!Number.isNaN(parsed) && parsed >= 0) {
      return parsed;
    }
  }

  return 0;
}

export async function newsListController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const stats = await runNewsScraper();
    console.log("News scraper stats:", stats);

    const limit = parseLimit(req.query.limit);
    const offset = parseOffset(req.query.offset);

    const result = await fetchNewsList(limit, offset);
    res.json(result);
  } catch (error) {
    console.error("Failed to fetch news list", error);
    res.status(500).json({ error: "Failed to fetch news" });
  }
}

export async function newsDetailController(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const articleId =
      typeof req.params.id === "string" ? req.params.id : undefined;

    if (!articleId) {
      res.status(404).json({ error: "News article not found" });
      return;
    }

    const article = await fetchNewsDetail(articleId);

    if (!article) {
      res.status(404).json({ error: "News article not found" });
      return;
    }

    res.json(article);
  } catch (error) {
    console.error(`Failed to fetch news article ${req.params.id}`, error);
    res.status(500).json({ error: "Failed to fetch news article" });
  }
}
