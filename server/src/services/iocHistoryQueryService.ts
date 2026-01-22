import pool from "../db";

export interface HistoryQueryParams {
  ownerType: string;
  ownerId: string;
  limit: number;
  offset: number;
  search?: string;
}

export async function queryHistory({
  ownerType,
  ownerId,
  limit,
  offset,
  search,
}: HistoryQueryParams) {
  const params: Array<string | number> = [ownerType, ownerId];
  const searchClause = search
    ? "AND (ioc_value ILIKE $3 OR ioc_type ILIKE $3 OR verdict ILIKE $3 OR to_char(created_at, 'DD/MM/YYYY HH24:MI') ILIKE $3)"
    : "";

  if (search) {
    params.push(`%${search}%`);
  }

  params.push(limit, offset);

  const limitIndex = search ? 4 : 3;
  const offsetIndex = search ? 5 : 4;

  const { rows } = await pool.query(
    `
    SELECT
      ioc_value,
      ioc_type,
      verdict,
      created_at as timestamp,
      score
    FROM ioc_history
    WHERE owner_type = $1
      AND owner_id = $2
      ${searchClause}
    ORDER BY created_at DESC
    LIMIT $${limitIndex} OFFSET $${offsetIndex}
    `,
    params,
  );

  return rows;
}
