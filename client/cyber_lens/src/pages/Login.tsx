import React, { useState } from "react";

interface FormErrors {
  email?: string;
  password?: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      console.log("Login attempt:", { email, password });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg lg:max-w-xl">
        {/* Card */}
        <div className="border border-neutral-800 bg-neutral-900 rounded-xl shadow-xl p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-5">
              <i className="fa-solid fa-lock text-white text-2xl" />
              <span className="text-2xl font-bold text-slate-100">
                Cyber <span className="text-cyan-500">Lens</span>
              </span>
            </div>
            <h1 className="text-4xl font-semibold tracking-tight mb-3">
              Log in to CyberLens
            </h1>
            <p className="text-base text-neutral-400">
              Access your threat intelligence dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-base font-medium text-neutral-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                className={`w-full px-4 py-3 text-base bg-neutral-950 border ${
                  errors.email ? "border-red-500" : "border-neutral-800"
                } placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors`}
                placeholder="you@example.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-base font-medium text-neutral-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password)
                    setErrors({ ...errors, password: undefined });
                }}
                className={`w-full px-4 py-3 text-base bg-neutral-950 border ${
                  errors.password ? "border-red-500" : "border-neutral-800"
                } placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors`}
                placeholder="••••••••"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 text-base font-medium bg-cyan-500 text-neutral-950 hover:bg-cyan-400 disabled:bg-neutral-700 disabled:text-neutral-500 transition-colors"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <a
              href="/"
              className="text-base font-medium text-cyan-300 hover:text-cyan-200 transition-colors"
            >
              Continue without signing in
            </a>

            <p className="mt-2 text-base text-neutral-400">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>

        {/* Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-neutral-500">
            CyberLens can be used without creating an account
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
