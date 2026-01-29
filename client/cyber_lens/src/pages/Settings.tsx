import React, { useState } from "react";
import { httpJson } from "../utils/httpClient";

const Settings: React.FC = () => {
  // State for Change Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMessage, setPwdMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // State for Delete Account
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteRequested, setDeleteRequested] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMessage(null);

    // Validation
    if (newPassword !== confirmPassword) {
      setPwdMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    if (newPassword === currentPassword) {
      setPwdMessage({
        type: "error",
        text: "New password must be different from current password",
      });
      return;
    }

    if (newPassword.length < 8) {
      setPwdMessage({
        type: "error",
        text: "New password must be at least 8 characters long",
      });
      return;
    }

    setPwdLoading(true);
    try {
      await httpJson("/auth/change-password", {
        method: "POST",
        auth: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setPwdMessage({
        type: "success",
        text: "Password updated successfully",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPwdMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to update password",
      });
    } finally {
      setPwdLoading(false);
    }
  };

  const handleRequestDelete = async () => {
    setDeleteLoading(true);
    try {
      await httpJson("/auth/request-delete", {
        method: "POST",
        auth: true,
        headers: { "Content-Type": "application/json" },
      });
      setDeleteRequested(true);
      setShowDeleteModal(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to request deletion");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Account Settings</h1>
          <p className="text-neutral-400">
            Manage your security and preferences
          </p>
        </header>

        {/* Change Password Section */}
        <section className="border border-neutral-800 bg-neutral-900 p-8 mb-10 shadow-lg">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-cyan-500/10 rounded-lg">
              <svg
                className="w-6 h-6 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold">Change Password</h2>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-300">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-300">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                  placeholder="Min. 8 characters"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-300">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all"
                  placeholder="Re-enter new password"
                  required
                />
              </div>
            </div>

            {pwdMessage && (
              <div
                className={`p-4 text-sm flex items-center gap-3 ${
                  pwdMessage.type === "success"
                    ? "bg-green-950/20 border border-green-800/50 text-green-400"
                    : "bg-red-950/20 border border-red-800/50 text-red-400"
                }`}
              >
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {pwdMessage.type === "success" ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  )}
                </svg>
                {pwdMessage.text}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={pwdLoading}
                className="inline-flex items-center justify-center px-8 py-3 bg-cyan-500 text-neutral-950 font-bold hover:bg-cyan-400 active:bg-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-xs"
              >
                {pwdLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-4 w-4 text-neutral-900"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Updating Password...
                  </>
                ) : (
                  "Update Security Credentials"
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Danger Zone */}
        <section className="border border-red-900/40 bg-red-950/5 p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <svg
                className="w-6 h-6 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-red-500">Danger Zone</h2>
          </div>

          <div className="space-y-6">
            <div className="bg-neutral-900/50 p-6 border border-neutral-800">
              <h3 className="text-lg font-medium text-neutral-200 mb-2">
                Delete Account
              </h3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                Permanently remove your account and all associated data. This
                action is irreversible. All lookup history and settings will be
                wiped.
              </p>

              {deleteRequested ? (
                <div className="p-4 bg-cyan-950/30 border border-cyan-800/50 text-cyan-400 text-sm flex items-start gap-4">
                  <svg
                    className="w-6 h-6 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <h4 className="font-bold mb-1 uppercase tracking-tight">
                      Verification Required
                    </h4>
                    <p className="opacity-90 leading-tight">
                      A magic link has been sent to your inbox. Please click the
                      link within 15 minutes to confirm account deletion.
                    </p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="inline-flex items-center justify-center px-6 py-3 border border-red-800 text-red-500 font-semibold hover:bg-red-500 hover:text-white transition-all text-sm uppercase tracking-wider"
                >
                  Terminate Account Access
                </button>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-neutral-900 border border-neutral-800 max-w-md w-full p-8 shadow-2xl transform animate-in zoom-in-95 duration-200">
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

            <h3 className="text-2xl font-bold mb-2 text-center text-neutral-100">
              Confirm Deletion
            </h3>
            <p className="text-neutral-400 mb-8 text-sm text-center leading-relaxed">
              To prevent accidents, we require email verification. Click below
              to receive a one-time magic link. Your account stays active until
              you confirm via the email.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleRequestDelete}
                disabled={deleteLoading}
                className="w-full px-6 py-4 bg-red-600 text-white font-bold hover:bg-red-500 transition-all disabled:opacity-50 uppercase tracking-widest text-xs"
              >
                {deleteLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Executing Request...
                  </span>
                ) : (
                  "Dispatch Verification Link"
                )}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-full px-6 py-4 bg-transparent border border-neutral-700 text-neutral-400 font-bold hover:bg-neutral-800 hover:text-neutral-200 transition-all uppercase tracking-widest text-xs"
              >
                Abort Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
