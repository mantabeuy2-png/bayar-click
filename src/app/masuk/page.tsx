"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { createSupabaseClientClient } from "@/lib/supabase/client";

function MasukForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createSupabaseClientClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  };

  const handleGoogleLogin = async () => {
    const supabase = createSupabaseClientClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${redirect}`,
      },
    });
    if (error) setError(error.message);
  };

  return (
    <>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <a href="/" style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0d1526", textDecoration: "none" }}>
          Bayar<span style={{ color: "#3b7ddd" }}>.click</span>
        </a>
        <h1 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#0d1526", marginTop: 24, marginBottom: 6 }}>
          Masuk
        </h1>
        <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
          Belum punya akun? <a href="/daftar" style={{ color: "#3b7ddd", fontWeight: 600 }}>Daftar</a>
        </p>
      </div>

      {error && (
        <div style={{
          padding: "12px 16px",
          background: "#fef2f2",
          borderRadius: 10,
          color: "#dc2626",
          fontSize: "0.82rem",
          marginBottom: 16,
          textAlign: "center",
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: 6, display: "block" }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 10,
              border: "1px solid #e2e8f0",
              fontSize: "0.9rem",
              outline: "none",
            }}
            placeholder="nama@email.com"
          />
        </div>
        <div>
          <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: 6, display: "block" }}>
            Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 40px 12px 14px",
                borderRadius: 10,
                border: "1px solid #e2e8f0",
                fontSize: "0.9rem",
                outline: "none",
              }}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#94a3b8",
                padding: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "14px 28px",
            borderRadius: 99,
            border: "none",
            background: "linear-gradient(135deg, #3b7ddd, #4facfe)",
            color: "#fff",
            fontSize: "0.92rem",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            marginTop: 8,
          }}
        >
          {loading ? "Memproses..." : "Masuk →"}
        </button>
      </form>

      <div style={{ marginTop: 20, textAlign: "center" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
        }}>
          <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
          <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>atau</span>
          <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
        </div>
        <button
          onClick={handleGoogleLogin}
          style={{
            padding: "12px 24px",
            borderRadius: 10,
            border: "1px solid #e2e8f0",
            background: "#fff",
            fontSize: "0.85rem",
            fontWeight: 500,
            color: "#475569",
            cursor: "pointer",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#4285F4" }}>G</span> Masuk dengan Google
        </button>
      </div>
    </>
  );
}

export default function MasukPage() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f8fafc",
      padding: 20
    }}>
      <div style={{
        width: "100%",
        maxWidth: 400,
        background: "#fff",
        borderRadius: 16,
        padding: 40,
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 24px rgba(0,0,0,0.04)"
      }}>
        <Suspense fallback={<div style={{ textAlign: "center", color: "#94a3b8" }}>⏳ Memuat...</div>}>
          <MasukForm />
        </Suspense>
      </div>
    </div>
  );
}
