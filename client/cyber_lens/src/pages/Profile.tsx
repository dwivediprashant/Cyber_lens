import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

export default function Profile() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center">
      <section className="bg-neutral-900 rounded-2xl shadow-2xl pt-8 pb-8 px-0 w-full max-w-2xl min-w-[420px] min-h-[420px] flex flex-col justify-center items-center mx-4 my-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center mb-4">
            {/* Placeholder for profile image */}
            <span className="text-3xl text-cyan-400 font-bold">
              {user.email ? user.email[0].toUpperCase() : "U"}
            </span>
          </div>
          <h2 className="text-2xl font-semibold mb-1">
            {user.email ? user.email.split("@")[0] : "U"}
          </h2>
          <div className="mb-12 w-full flex justify-center mt-8">
            <table className="w-[520px] border border-cyan-700 rounded-lg overflow-hidden text-left bg-neutral-950">
              <tbody>
                <tr className="border-b border-cyan-700">
                  <td className="px-4 py-3 text-cyan-400 font-semibold w-1/3">
                    Email
                  </td>
                  <td className="px-4 py-3 text-cyan-200 break-all">
                    {user.email}
                  </td>
                </tr>
                <tr className="border-b border-cyan-700">
                  <td className="px-4 py-3 text-cyan-400 font-semibold">
                    Role
                  </td>
                  <td className="px-4 py-3 text-cyan-300">User</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-cyan-400 font-semibold">
                    Member Since
                  </td>
                  <td className="px-4 py-3 text-cyan-200">Jan 2026</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-6 text-cyan-400 text-center">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <Link
                to="/"
                className="px-2 py-2 bg-black text-white rounded-lg font-semibold flex items-center justify-center text-base border border-black hover:bg-neutral-800 hover:text-cyan-400 transition-colors shadow"
              >
                Home
              </Link>
              <Link
                to="/history"
                className="px-2 py-2 bg-black text-white rounded-lg font-semibold flex items-center justify-center text-base border border-black hover:bg-neutral-800 hover:text-cyan-400 transition-colors shadow"
              >
                History
              </Link>
              <Link
                to="/news"
                className="px-2 py-2 bg-black text-white rounded-lg font-semibold flex items-center justify-center text-base border border-black hover:bg-neutral-800 hover:text-cyan-400 transition-colors shadow"
              >
                News
              </Link>
              <Link
                to="/analytics"
                className="px-2 py-2 bg-black text-white rounded-lg font-semibold flex items-center justify-center text-base border border-black hover:bg-neutral-800 hover:text-cyan-400 transition-colors shadow"
              >
                Analytics
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
