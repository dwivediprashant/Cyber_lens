/**
 * ProviderResult
 * Stores the response from a threat intelligence provider
 * for a specific IOC query.
 */
export interface ProviderResult {
  /** Unique identifier */
  id: string;

  /** References IOCQuery.id */
  query_id: string;

  /** Name of the provider (e.g., virus_total) */
  provider_name: string;

  /** Short processed result from the provider */
  result: string;

  /** Full raw response stored as JSON string */
  raw_response?: string;

  /** When this provider result was saved */
  created_at: Date;
}
