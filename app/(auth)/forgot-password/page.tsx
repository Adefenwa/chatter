"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleReset = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-2">
            Check your email
          </h2>
          <p className="text-white/50 text-sm">
            We sent a password reset link to{" "}
            <span className="text-white">{email}</span>
          </p>
          <Link
            href="/login"
            className="block mt-6 text-blue-400 text-sm hover:underline"
          >
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-1">
          Reset your password
        </h2>
        <p className="text-white/50 text-sm mb-6">
          Enter your email and we will send you a reset link.
        </p>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <label className="text-sm text-white/70">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          className="w-full mt-1 mb-4 px-4 py-2 bg-white/10 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <Link
          href="/login"
          className="block text-center text-sm text-white/40 hover:text-white mt-4 transition"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}
