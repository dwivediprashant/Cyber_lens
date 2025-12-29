/**
 * NewsItem
 * Represents a cybersecurity news article.
 */
export interface NewsItem {
  /** Unique identifier */
  id: string;

  /** Article title */
  title: string;

  /** Short summary of the article */
  summary?: string;

  /** Original article URL */
  link: string;

  /** When the article was published */
  published_at?: Date;

  /** IOCs extracted from the article */
  extracted_iocs?: string[];

  /** When this record was created */
  created_at: Date;
}
