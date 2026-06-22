"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseClientClient } from "@/lib/supabase/client";

export default function DaftarPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createSupabaseClientClient();

    // 1. Sign up
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // 2. Check if email confirmation is required
    if (data?.user?.identities?.length === 0) {
      setError("Email sudah terdaftar. Silakan login.");
      setLoading(false);
      return;
    }

    // Check if user needs email confirmation
    if (data?.user?.confirmation_sent_at) {
      setSuccess(true);
      setLoading(false);
      return;
    }

    // If no confirmation needed (disabled in Supabase), go straight to dashboard
    router.push("/dashboard");
    router.refresh();
  };

  const handleGoogleRegister = async () => {
    const supabase = createSupabaseClientClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });
    if (error) setError(error.message);
  };

  if (success) {
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
          textAlign: "center"
        }}>
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>📬</div>
          <h1 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#0d1526", marginBottom: 8 }}>
            Cek Email Kamu
          </h1>
          <p style={{ fontSize: "0.88rem", color: "#64748b", lineHeight: 1.6 }}>
            Kami udah kirim link konfirmasi ke <strong>{email}</strong>. Klik link itu untuk aktifkan akun kamu.
          </p>
          <a href="/masuk" className="btn btn-primary" style={{ marginTop: 20 }}>
            Ke Halaman Login
          </a>
        </div>
      </div>
    );
  }

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
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <a href="/" style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0d1526", textDecoration: "none" }}>
            Bayar<span style={{ color: "#3b7ddd" }}>.click</span>
          </a>
          <h1 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#0d1526", marginTop: 24, marginBottom: 6 }}>
            Daftar Gratis
          </h1>
          <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
            Udah punya akun? <a href="/masuk" style={{ color: "#3b7ddd", fontWeight: 600 }}>Masuk</a>
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

        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: 6, display: "block" }}>
              Nama Lengkap
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 10,
                border: "1px solid #e2e8f0",
                fontSize: "0.9rem",
                outline: "none"
              }}
              placeholder="Nama kamu"
            />
          </div>
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
                outline: "none"
              }}
              placeholder="nama@email.com"
            />
          </div>
          <div>
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#334155", marginBottom: 6, display: "block" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 10,
                border: "1px solid #e2e8f0",
                fontSize: "0.9rem",
                outline: "none"
              }}
              placeholder="Minimal 6 karakter"
            />
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
              marginTop: 8
            }}
          >
            {loading ? "Memproses..." : "Buat Akun Gratis →"}
          </button>
          <p style={{ fontSize: "0.75rem", color: "#94a3b8", textAlign: "center", marginTop: 4 }}>
            Dengan mendaftar, kamu setuju dengan <a href="#" style={{ color: "#3b7ddd" }}>Syarat & Ketentuan</a>
          </p>
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
            onClick={handleGoogleRegister}
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
            <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#4285F4" }}>G</span> Daftar dengan Google
          </button>
        </div>
      </div>
    </div>
  );
}
