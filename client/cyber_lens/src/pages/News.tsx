import { useEffect, useMemo, useState } from "react";
import { httpJson } from "../utils/httpClient";

type NewsItem = {
  title: string;
  summary: string;
  source: string;
  published_at: string;
  id: string;
};

type PaginatedResponse<T> = {
  items: T[];
  total: number;
};

export default function News() {
  const ITEMS_PER_PAGE = 9;

  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");
  // const [_, setLoading] = useState(false);

  const [rows, setRows] = useState<NewsItem[]>([]);

  useEffect(() => {
    async function fetchNews() {
      try {
        const { items } = await httpJson<PaginatedResponse<NewsItem>>("/news");

        console.log("data", items);

        const mapped: NewsItem[] = items.map((item) => ({
          ...item,
          published_at: item.published_at.split("T")[0],
        }));

        setRows(mapped);
      } catch (err) {
        console.error(err);
      }
      // finally {
      //   setLoading(false);
      // }
    }
    fetchNews();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  const filteredNews = useMemo(() => {
    return rows.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.summary.toLowerCase().includes(query.toLowerCase()),
    );
  }, [rows, query]);

  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);

  const paginatedNews = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredNews.slice(start, end);
  }, [filteredNews, currentPage]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header + Search */}
        <header className="mb-8 border-b border-neutral-800 pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                Cyber Threat News
              </h1>
              <p className="text-sm text-neutral-400 mt-2">
                Structured security bulletins and intelligence updates
              </p>
            </div>

            {/* Search Filter */}
            <div className="w-full sm:w-80">
              <div className="flex">
                <input
                  type="search"
                  placeholder="Search news…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm bg-neutral-900 border border-neutral-800 border-r-0 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button className="px-4 ml-2 py-2 text-sm font-medium bg-cyan-500 text-neutral-950 hover:bg-cyan-400 transition-colors">
                  Search
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* News Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedNews.map((item, idx) => (
            <article
              key={idx}
              className="relative flex flex-col border border-neutral-800 bg-neutral-900 hover:bg-neutral-800/70 transition-colors"
            >
              <div className="flex flex-col flex-1 p-4">
                {/* Meta */}
                <div className="mb-3 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium ring-1`}
                  >
                    {item.source}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {item.published_at}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold leading-snug mb-2">
                  {item.title}
                </h3>

                {/* Summary */}
                <p className="text-sm text-neutral-300 leading-relaxed line-clamp-4">
                  {item.summary}
                </p>

                {/* Action */}
                <a
                  href={`/news/${item.id}`}
                  className="mt-auto pt-4 text-sm font-medium text-cyan-400 hover:underline cursor-pointer block"
                >
                  View details →
                </a>
              </div>
            </article>
          ))}

          {filteredNews.length === 0 && (
            <div className="col-span-full text-center text-sm text-neutral-500 py-12">
              No news items match your search.
            </div>
          )}
        </section>

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 text-sm border border-neutral-700 disabled:opacity-40"
            >
              Prev
            </button>

            <span className="text-sm text-neutral-400">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 text-sm border border-neutral-700 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-xs text-neutral-500">
          All updates follow a unified bulletin format for consistent analyst
          review.
        </div>
      </div>
    </div>
  );
}
