import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { httpJson } from "../utils/httpClient";

type NewsDetail = {
  id: string;
  title: string;
  summary: string | null;
  published_at: string | null;
  source: string;
  url: string;
  iocs: { type: string; value: string }[];
};

function toExternalUrl(value: string): string {
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }
  return `https://${value}`;
}

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDetail() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await httpJson<NewsDetail>(`/news/${id}`);
        setArticle({
          ...data,
          published_at: data.published_at
            ? data.published_at.split("T")[0]
            : null,
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load article details.");
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center">
        <p className="text-neutral-500">Loading article...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/news"
            className="text-cyan-400 hover:text-cyan-300 mb-6 inline-block"
          >
            ← Back to News
          </Link>
          <div className="p-4 border border-red-900/50 bg-red-900/10 rounded text-red-200">
            {error || "Article not found."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/news"
          className="text-cyan-400 hover:text-cyan-300 mb-6 inline-block text-sm font-medium transition-colors"
        >
          ← Back to News
        </Link>

        <article className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 sm:p-10 shadow-xl">
          {/* Header */}
          <header className="mb-8 border-b border-neutral-800 pb-6">
            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-neutral-400">
              <span className="px-2 py-1 bg-neutral-800 rounded text-neutral-300 font-medium">
                {article.source}
              </span>
              {article.published_at && (
                <>
                  <span>•</span>
                  <span>{article.published_at}</span>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold leading-tight text-white mb-6">
              {article.title}
            </h1>

            {article.url && (
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                Read original source
              </a>
            )}
          </header>

          {/* Content */}
          <div className="prose prose-invert max-w-none mb-10 text-neutral-300 leading-relaxed whitespace-pre-wrap">
            {article.summary || "No summary available."}
          </div>

          {/* IOCs Section */}
          {article.iocs.length > 0 && (
            <section className="bg-neutral-950/50 rounded-md border border-neutral-800 overflow-hidden">
              <div className="px-4 py-3 border-b border-neutral-800 bg-neutral-800/20">
                <h2 className="text-lg font-semibold text-white">
                  Indicators of Compromise (IOCs)
                </h2>
              </div>

              <div className="divide-y divide-neutral-800">
                {article.iocs.map((ioc, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center px-4 py-3 gap-2"
                  >
                    <span className="text-xs font-mono uppercase text-neutral-500 w-24 shrink-0">
                      {ioc.type}
                    </span>

                    {ioc.type === "url" ? (
                      <a
                        href={toExternalUrl(ioc.value)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-mono text-cyan-400 hover:text-cyan-300 break-all"
                      >
                        {ioc.value}
                      </a>
                    ) : (
                      <code className="text-sm font-mono text-cyan-300 break-all select-all">
                        {ioc.value}
                      </code>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </article>
      </div>
    </div>
  );
}
