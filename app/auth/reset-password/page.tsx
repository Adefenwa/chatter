"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleUpdate = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setDone(true);
    setTimeout(() => router.push("/"), 2000);
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-2">
            Password updated
          </h2>
          <p className="text-white/50 text-sm">
            Redirecting you to the feed...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-1">Set new password</h2>
        <p className="text-white/50 text-sm mb-6">
          Choose a strong password for your account.
        </p>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <label className="text-sm text-white/70">New Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min. 8 characters"
          className="w-full mt-1 mb-4 px-4 py-2 bg-white/10 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleUpdate}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
}
