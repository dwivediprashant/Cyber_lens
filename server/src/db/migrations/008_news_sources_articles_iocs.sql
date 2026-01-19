-- Schema for cybersecurity news ingestion (sources, articles, and IOCs)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS news_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  feed_url TEXT NOT NULL UNIQUE,
  site_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES news_sources(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  summary TEXT,
  url TEXT NOT NULL UNIQUE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_news_articles_source_id ON news_articles(source_id);
CREATE INDEX IF NOT EXISTS idx_news_articles_published_at ON news_articles(published_at);
CREATE INDEX IF NOT EXISTS idx_news_articles_created_at ON news_articles(created_at);

CREATE TABLE IF NOT EXISTS news_iocs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES news_articles(id) ON DELETE CASCADE,
  ioc_type VARCHAR(20) NOT NULL,
  ioc_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  UNIQUE(article_id, ioc_type, ioc_value)
);

CREATE INDEX IF NOT EXISTS idx_news_iocs_article_id ON news_iocs(article_id);
CREATE INDEX IF NOT EXISTS idx_news_iocs_value ON news_iocs(ioc_value);
