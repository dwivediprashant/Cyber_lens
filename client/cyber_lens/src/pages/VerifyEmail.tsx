import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { httpJson } from "../utils/httpClient";

const VerifyEmail: React.FC = () => {
  const [status, setStatus] = useState<
    "loading" | "success" | "already" | "error" | "missing"
  >("loading");
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (!token) {
      setStatus("missing");
      setMessage("Verification token is missing from the URL.");
      return;
    }
    setStatus("loading");
    httpJson<{ status: string; message?: string }>(
      `/auth/verify-email?token=${encodeURIComponent(token)}`,
    )
      .then((res) => {
        if (res.status === "success") {
          setStatus("success");
          setMessage("Your email has been verified successfully.");
          setTimeout(() => navigate("/login"), 2000);
        } else if (res.status === "already-verified") {
          setStatus("already");
          setMessage("Your email is already verified.");
          setTimeout(() => navigate("/login"), 2000);
        } else {
          setStatus("error");
          setMessage(res.message || "Invalid or expired verification token.");
        }
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.message || "Invalid or expired verification token.");
      });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-100 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="border border-neutral-800 bg-neutral-900 rounded-xl shadow-xl p-8 sm:p-10 text-center">
          <h1 className="text-3xl font-bold mb-4">Email Verification</h1>
          {status === "loading" && (
            <div className="my-8">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full mb-4"></div>
              <p>Verifying your email...</p>
            </div>
          )}
          {status === "success" && (
            <div className="my-8">
              <p className="text-green-400 text-lg font-semibold mb-2">
                {message}
              </p>
              <p className="text-neutral-400">Redirecting to login...</p>
            </div>
          )}
          {status === "already" && (
            <div className="my-8">
              <p className="text-cyan-400 text-lg font-semibold mb-2">
                {message}
              </p>
              <p className="text-neutral-400">Redirecting to login...</p>
            </div>
          )}
          {status === "error" && (
            <div className="my-8">
              <p className="text-red-400 text-lg font-semibold mb-2">
                {message}
              </p>
              <a
                href="/login"
                className="text-cyan-300 hover:text-cyan-200 underline"
              >
                Go to Login
              </a>
            </div>
          )}
          {status === "missing" && (
            <div className="my-8">
              <p className="text-red-400 text-lg font-semibold mb-2">
                {message}
              </p>
              <a
                href="/login"
                className="text-cyan-300 hover:text-cyan-200 underline"
              >
                Go to Login
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
