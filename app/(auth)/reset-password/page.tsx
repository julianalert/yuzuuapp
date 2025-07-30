"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }
    if (!supabase) {
      setError("Supabase is not configured");
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message || "Failed to reset password");
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push("/signin");
      }, 2000);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Reset password</h1>
      </div>
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-700">Your password has been reset. Redirecting to sign in...</p>
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label
              className="mb-1 block text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              New password
            </label>
            <input
              id="password"
              className="form-input w-full py-2"
              type="password"
              placeholder="Enter your new password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={loading || success}
            />
          </div>
        </div>
        <div className="mt-6">
          <button
            className="btn w-full bg-linear-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-sm hover:bg-[length:100%_150%] disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading || success}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      </form>
    </>
  );
}
