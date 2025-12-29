/**
 * IOCQuery
 * Represents a single IOC lookup made by the system.
 */
export interface IOCQuery {
  /** Unique identifier for this query */
  id: string;

  /** The IOC value (IP, domain, URL, or hash) */
  ioc: string;

  /** Type of IOC */
  type: 'ip' | 'domain' | 'url' | 'hash';

  /** Calculated threat score (example: 0–100) */
  score?: number;

  /** Final verdict after analysis */
  verdict: 'benign' | 'suspicious' | 'malicious';

  /** When this query was created */
  created_at: Date;
}
