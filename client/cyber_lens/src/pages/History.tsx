import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

type Row = {
  ioc: string;
  verdict?: "Malicious" | "Clean" | "Suspicious";
  timestamp: string;
  score?: number;
};

export default function History() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch(`${API_BASE}/history`, {
          credentials: "include", // safe even if unused
          headers: {
            "X-Client-ID": "26121325-8615-4c56-a122-5bb85a91c648"
          }
        });
  
        if (!res.ok) {
          throw new Error("Failed to fetch history");
        }
  
        const data = await res.json();
  
        const mapped: Row[] = data.map((r: any) => ({
          ioc: r.ioc_value,
          verdict: r.verdict ?? undefined,
          timestamp: new Date(r.created_at).toLocaleString(),
          score: r.score ?? undefined,
        }));

  
        setRows(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  
    loadHistory();
  }, []);


  const badgeClass = (v: string) =>
    v === "Malicious"
      ? "bg-red-600/10 text-red-400 ring-red-600/30"
      : v === "Clean"
      ? "bg-emerald-600/10 text-emerald-400 ring-emerald-600/30"
      : v === "Suspicious"
      ? "bg-amber-500/10 text-amber-400 ring-amber-500/30"
      : "bg-neutral-600/10 text-neutral-400 ring-neutral-600/30";
  
  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-400 flex items-center justify-center">
        Loading history...
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-400 flex items-center justify-center">
        No scan history yet.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Scan History
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              Previously analyzed Indicators of Compromise (IOCs).
            </p>
          </div>

          {/* Search + Export */}
          <div className="flex w-full md:w-auto flex-col sm:flex-row gap-3 sm:items-center">
            <input
              type="search"
              placeholder="Search IOC, note…"
              className="w-full sm:w-64 px-3 py-2 text-sm bg-neutral-900 border border-neutral-800 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />

            <button className="w-full sm:w-auto px-4 py-2 text-sm font-medium bg-cyan-500 text-neutral-950 hover:bg-cyan-400 transition-colors">
              Export
            </button>
          </div>
        </div>

        {/* Mobile cards */}
        <div className="space-y-4 md:hidden">
          {rows.map((row, idx) => (
            <div
              key={idx}
              className="border border-neutral-800 bg-neutral-900 p-4"
            >
              <div className="flex justify-between items-start gap-3">
                <div className="font-mono text-sm text-neutral-100 truncate">
                  {row.ioc}
                </div>
                <span
                  className={`px-2 py-0.5 text-xs font-medium ring-1 ${badgeClass(
                    row.verdict
                  )}`}
                >
                  {row.verdict || "Unknown"}
                </span>
              </div>

              <div className="mt-2 text-sm text-neutral-300">
                {row.score ?? "—"}
              </div>


              <div className="mt-3 text-xs text-neutral-400">
                {row.timestamp}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <div className="overflow-x-auto border border-neutral-700 bg-neutral-950">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-neutral-900 text-neutral-300">
                <tr>
                  <th className="border border-neutral-700 px-4 py-3 text-left font-medium">
                    IOC
                  </th>
                  <th className="border border-neutral-700 px-4 py-3 text-left font-medium">
                    Verdict
                  </th>
                  <th className="border border-neutral-700 px-4 py-3 text-left font-medium">
                    Timestamp
                  </th>
                  <th className="border border-neutral-700 px-4 py-3 text-left font-medium">
                    Score
                  </th>
                </tr>
              </thead>

              <tbody>
              {rows.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-neutral-900 transition-colors"
                  >
                    <td className="border border-neutral-800 px-4 py-3 font-mono text-neutral-100 truncate max-w-lg">
                      {row.ioc || "—"}
                    </td>

                    <td className="border border-neutral-800 px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-2 px-2.5 py-1 text-xs font-medium ring-1 ${badgeClass(
                          row.verdict
                        )}`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            row.verdict === "Malicious"
                              ? "bg-red-400"
                              : row.verdict === "Clean"
                              ? "bg-emerald-400"
                              : row.verdict === "Suspicious"
                              ? "bg-amber-400"
                              : "bg-neutral-400"
                          }`}
                        />
                        {row.verdict || "Unknown"}
                      </span>
                    </td>

                    <td className="border border-neutral-800 px-4 py-3 text-neutral-400 whitespace-nowrap">
                      {row.timestamp || "—"}
                    </td>

                    <td className="border border-neutral-800 px-4 py-3 text-neutral-300 truncate max-w-xs">
                      {row.score ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 text-xs text-neutral-500">
            Showing {rows.length} recent scans — optimized for analyst
            review.
          </div>
        </div>
      </div>
    </div>
  );
}
