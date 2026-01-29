import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { httpJson } from "../utils/httpClient";

const VerifyAction: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying",
  );
  const [message, setMessage] = useState("Verifying your security token...");
  const [verificationAttempted, setVerificationAttempted] = useState(false);

  useEffect(() => {
    // Prevent multiple verification attempts
    if (verificationAttempted) {
      return;
    }

    const token = searchParams.get("token");
    const type = searchParams.get("type");

    if (!token || !type) {
      setStatus("error");
      setMessage("Invalid security link or missing verification data.");
      setVerificationAttempted(true);
      return;
    }

    const performVerification = async () => {
      try {
        if (type === "delete_account") {
          await httpJson("/auth/verify-delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });
          setStatus("success");
          setMessage(
            "Your account has been successfully deleted. You are now being logged out.",
          );

          // Clear authentication tokens from localStorage
          localStorage.removeItem("accessToken");
          localStorage.removeItem("userEmail");
          localStorage.removeItem("anonymous-client-id");

          // Dispatch auth state change event to update navbar and other components
          window.dispatchEvent(new Event("auth-state-changed"));

          setTimeout(() => navigate("/"), 3000);
        } else {
          setStatus("error");
          setMessage("Unrecognized verification sequence.");
        }
      } catch (err) {
        setStatus("error");
        setMessage(
          err instanceof Error ? err.message : "Security verification failed.",
        );
      }
      setVerificationAttempted(true);
    };

    performVerification();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="border border-neutral-800 bg-neutral-900 p-10 text-center shadow-2xl">
          {status === "verifying" && (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-6"></div>
              <h2 className="text-xl font-medium text-neutral-300">
                {message}
              </h2>
            </div>
          )}

          {status === "success" && (
            <div className="animate-in zoom-in-95 duration-500">
              <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold mb-4 text-neutral-100">
                Action Confirmed
              </h1>
              <p className="text-neutral-400 mb-8 leading-relaxed">{message}</p>
              <p className="text-xs text-neutral-500">
                Redirecting to home page in 5 seconds...
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-4 text-red-500">
                Verification Error
              </h1>
              <p className="text-neutral-300 mb-8 leading-relaxed font-medium">
                {message}
              </p>
              <button
                onClick={() => navigate("/")}
                className="w-full py-4 bg-neutral-800 text-neutral-200 font-bold hover:bg-neutral-700 transition-colors uppercase tracking-widest text-xs"
              >
                Return to Safety
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyAction;
