"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseClientClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

type Tab = "overview" | "merchants" | "payment-links" | "transactions" | "whatsapp" | "ai-agent";
type ModalMode = "payment-link" | "merchant" | null;

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [modalData, setModalData] = useState({
    name: "",
    description: "",
    amount: "",
    merchant_name: "",
    merchant_qris_url: "",
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [merchants, setMerchants] = useState<any[]>([]);
  const [paymentLinks, setPaymentLinks] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);
  // AI Agent
  const [aiSoul, setAiSoul] = useState("");
  const [aiProfile, setAiProfile] = useState("");
  const [aiSaving, setAiSaving] = useState(false);
  const [aiMsg, setAiMsg] = useState("");
  const [aiError, setAiError] = useState(false);
  // WhatsApp
  const [waTo, setWaTo] = useState("");
  const [waMsg, setWaMsg] = useState("");
  const [waSending, setWaSending] = useState(false);
  const [waResult, setWaResult] = useState("");
  const [waBlastNumbers, setWaBlastNumbers] = useState("");
  const [waBlastMsg, setWaBlastMsg] = useState("");
  const [waBlastResult, setWaBlastResult] = useState("");
  const router = useRouter();

  useEffect(() => {
    const supabase = createSupabaseClientClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/masuk");
        return;
      }
      setUser(user);
      setLoading(false);
    });
  }, [router]);

  const fetchMerchants = async () => {
    setFetching(true);
    const supabase = createSupabaseClientClient();
    const { data } = await supabase.from("merchants").select("*").order("created_at", { ascending: false });
    if (data) setMerchants(data);
    setFetching(false);
  };

  const fetchPaymentLinks = async () => {
    const supabase = createSupabaseClientClient();
    const { data } = await supabase.from("payment_links").select("*").order("created_at", { ascending: false });
    if (data) setPaymentLinks(data);
  };

  const fetchTransactions = async () => {
    const supabase = createSupabaseClientClient();
    const { data } = await supabase.from("transactions").select("*").order("created_at", { ascending: false });
    if (data) setTransactions(data);
  };

  useEffect(() => {
    fetchMerchants();
    fetchPaymentLinks();
    fetchTransactions();
    fetchTransactions();
  }, []);

  const confirmTransaction = async (txId: string) => {
    const supabase = createSupabaseClientClient();
    await supabase.from("transactions").update({ status: "paid", paid_at: new Date().toISOString(), confirmed_by: user?.id }).eq("id", txId);
    fetchTransactions();
  };

  const rejectTransaction = async (txId: string) => {
    const supabase = createSupabaseClientClient();
    await supabase.from("transactions").update({ status: "failed" }).eq("id", txId);
    fetchTransactions();
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");

    const supabase = createSupabaseClientClient();

    if (modalMode === "payment-link") {
      const { error } = await supabase.from("payment_links").insert({
        merchant_id: merchants?.[0]?.id || null,
        title: modalData.name,
        description: modalData.description,
        amount: modalData.amount ? parseFloat(modalData.amount) : null,
        short_url: Math.random().toString(36).substring(2, 8),
      });

      if (error) {
        setSaveError(error.message);
        setSaving(false);
        return;
      }
    }

    if (modalMode === "merchant") {
      const { error } = await supabase.from("merchants").insert({
        name: modalData.merchant_name,
        user_id: user?.id,
        account_name: modalData.merchant_name,
        provider: "other",
        qr_image_url: modalData.merchant_qris_url || null,
      });

      if (error) {
        setSaveError(error.message);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    setModalMode(null);
    setModalData({ name: "", description: "", amount: "", merchant_name: "", merchant_qris_url: "" });
    fetchMerchants();
    fetchPaymentLinks();
    fetchTransactions();
  };

  const handleLogout = async () => {
    const supabase = createSupabaseClientClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  // WhatsApp — send single message
  const sendWaMessage = async () => {
    if (!waTo || !waMsg) return;
    setWaSending(true); setWaResult("");
    try {
      const res = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId: waTo, text: waMsg }),
      });
      const data = await res.json();
      setWaResult(data.success ? "✅ Pesan terkirim!" : `❌ Gagal: ${data.error}`);
    } catch (e: any) {
      setWaResult(`❌ Error: ${e.message}`);
    }
    setWaSending(false);
  };

  // WhatsApp — blast message
  const sendWaBlast = async () => {
    if (!waBlastNumbers || !waBlastMsg) return;
    setWaSending(true); setWaBlastResult("");
    try {
      const chatIds = waBlastNumbers.split(/[\n,;]+/).map(s => s.trim()).filter(Boolean);
      const res = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "blast", chatIds, text: waBlastMsg }),
      });
      const data = await res.json();
      if (data.success) {
        const r = data.result;
        setWaBlastResult(`✅ Terkirim: ${r.success.length}, Gagal: ${r.failed.length}`);
      } else {
        setWaBlastResult(`❌ Gagal: ${data.error}`);
      }
    } catch (e: any) {
      setWaBlastResult(`❌ Error: ${e.message}`);
    }
    setWaSending(false);
  };

  // AI Agent — load & save
  const loadAIConfig = async () => {
    if (!user?.id) return;
    const supabase = createSupabaseClientClient();
    const { data } = await supabase.from("ai_agent_configs").select("soul_md, profile_md").eq("user_id", user.id).single();
    if (data) {
      setAiSoul(data.soul_md || "");
      setAiProfile(data.profile_md || "");
    }
  };

  const saveAIConfig = async () => {
    setAiSaving(true);
    setAiMsg(""); setAiError(false);
    const supabase = createSupabaseClientClient();
    const { error } = await supabase.from("ai_agent_configs").upsert({
      user_id: user!.id,
      soul_md: aiSoul,
      profile_md: aiProfile,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });
    if (error) {
      setAiMsg("❌ Gagal: " + error.message);
      setAiError(true);
    } else {
      setAiMsg("✅ Konfigurasi berhasil disimpan!");
      setAiError(false);
    }
    setAiSaving(false);
  };

  useEffect(() => {
    if (activeTab === "ai-agent" && user) loadAIConfig();
  }, [activeTab, user]);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "merchants", label: "Merchant QRIS", icon: "🏪" },
    { id: "payment-links", label: "Payment Links", icon: "🔗" },
    { id: "transactions", label: "Transaksi", icon: "💳" },
    { id: "whatsapp", label: "WhatsApp", icon: "💬" },
    { id: "ai-agent", label: "AI Agent", icon: "🤖" },
  ];

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
        fontSize: "1rem",
        color: "#64748b",
      }}>
        ⏳ Memuat...
      </div>
    );
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const userEmail = user?.email || "";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      {/* ===== SIDEBAR ===== */}
      <aside style={{
        width: 240,
        background: "#fff",
        borderRight: "1px solid #e2e8f0",
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}>
        <a href="/" style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0d1526", textDecoration: "none", marginBottom: 32, paddingLeft: 8 }}>
          Bayar<span style={{ color: "#3b7ddd" }}>.click</span>
        </a>

        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 10,
                border: "none",
                background: activeTab === tab.id ? "#f1f5f9" : "transparent",
                color: activeTab === tab.id ? "#0d1526" : "#64748b",
                fontSize: "0.88rem",
                fontWeight: activeTab === tab.id ? 600 : 500,
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
                transition: "all 0.1s",
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div style={{ marginTop: "auto", borderTop: "1px solid #e2e8f0", paddingTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px" }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #3b7ddd, #4facfe)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "0.8rem",
              fontWeight: 700,
            }}>
              {userInitial}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#0d1526", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {userName}
              </div>
              <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>Free Plan</div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1rem",
                padding: 4,
                color: "#94a3b8"
              }}
              title="Keluar"
            >
              🚪
            </button>
          </div>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main style={{ flex: 1, padding: 32, overflowY: "auto" }}>
        {/* DEPLOY TEST BANNER */}
        <div style={{ background: "#fef3c7", border: "2px solid #f59e0b", borderRadius: 12, padding: "12px 20px", marginBottom: 20, fontWeight: 700, color: "#92400e" }}>
          🚀 DEPLOY VERIFIED — {new Date().toISOString()}
        </div>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0d1526", margin: 0 }}>
              {tabs.find(t => t.id === activeTab)?.label}
            </h1>
            <p style={{ fontSize: "0.85rem", color: "#64748b", margin: "4px 0 0" }}>
              {activeTab === "overview" && "Ringkasan aktivitas pembayaran kamu"}
              {activeTab === "merchants" && "Kelola merchant QRIS kamu"}
              {activeTab === "payment-links" && "Buat dan kelola link pembayaran"}
              {activeTab === "transactions" && "Semua transaksi pembayaran"}
              {activeTab === "ai-agent" && "Konfigurasi AI Agent WhatsApp — SOUL.md & PROFILE.md"}
              {activeTab === "whatsapp" && "Kirim pesan WhatsApp ke pelanggan & blast message"}
            </p>
          </div>
          {(activeTab === "payment-links" || activeTab === "merchants") && (
            <button
              className="btn btn-primary"
              style={{ padding: "10px 22px", fontSize: "0.85rem" }}
              onClick={() => setModalMode(activeTab === "payment-links" ? "payment-link" : "merchant")}
            >
              + Tambah Baru
            </button>
          )}
        </div>

        {/* ===== OVERVIEW ===== */}
        {activeTab === "overview" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
              {[
                { label: "Total Transaksi", value: "0", icon: "💳", color: "#3b7ddd" },
                { label: "Berhasil", value: "0", icon: "✅", color: "#10b981" },
                { label: "Pendapatan", value: "Rp 0", icon: "💰", color: "#f59e0b" },
                { label: "Sisa Kredit", value: "10", icon: "⚡", color: "#8b5cf6" },
              ].map((stat, i) => (
                <div key={i} style={{
                  background: "#fff",
                  borderRadius: 14,
                  padding: "20px 18px",
                  border: "1px solid #e2e8f0",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: 500 }}>{stat.label}</div>
                      <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0d1526", marginTop: 4 }}>
                        {stat.value}
                      </div>
                    </div>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: `${stat.color}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.1rem",
                    }}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              background: "#fff",
              borderRadius: 14,
              border: "1px solid #e2e8f0",
              padding: 24,
            }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#0d1526", marginBottom: 16 }}>
                Transaksi Terbaru
              </h3>
              <div style={{
                padding: 40,
                textAlign: "center",
                color: "#94a3b8",
                fontSize: "0.88rem",
                border: "2px dashed #e2e8f0",
                borderRadius: 12,
              }}>
                📭 Belum ada transaksi. Buat payment link pertama kamu!
              </div>
            </div>
          </>
        )}

        {activeTab === "merchants" && (
          <div style={{
            background: "#fff",
            borderRadius: 14,
            border: "1px solid #e2e8f0",
            padding: 24,
          }}>
            {fetching ? (
              <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>⏳ Memuat...</div>
            ) : merchants.length === 0 ? (
              <div style={{
                padding: 60,
                textAlign: "center",
                color: "#94a3b8",
                fontSize: "0.88rem",
                border: "2px dashed #e2e8f0",
                borderRadius: 12,
              }}>
                🏪 Belum ada merchant QRIS. Upload QRIS merchant kamu untuk mulai!
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {merchants.map((m) => (
                  <div key={m.id} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "14px 16px",
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                  }}>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: "#f1f5f9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem",
                    }}>🏪</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, color: "#0d1526", fontSize: "0.9rem" }}>{m.name}</div>
                      <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: 2 }}>
                        {m.qr_data ? "✅ QRIS code" : m.qr_image_url ? "🖼️ QR image" : "❌ No QR"} · {m.status}
                      </div>
                    </div>
                    <div style={{
                      padding: "4px 12px",
                      borderRadius: 99,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      background: m.status === "active" ? "#dcfce7" : "#fef3c7",
                      color: m.status === "active" ? "#16a34a" : "#d97706",
                    }}>
                      {m.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "payment-links" && (
          <div style={{
            background: "#fff",
            borderRadius: 14,
            border: "1px solid #e2e8f0",
            padding: 24,
          }}>
            {paymentLinks.length === 0 ? (
              <div style={{
                padding: 60,
                textAlign: "center",
                color: "#94a3b8",
                fontSize: "0.88rem",
                border: "2px dashed #e2e8f0",
                borderRadius: 12,
              }}>
                🔗 Belum ada payment link. Klik "Tambah Baru" untuk membuat!
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {paymentLinks.map((pl) => (
                  <div key={pl.id} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "14px 16px",
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                  }}>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: "#eff6ff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem",
                    }}>🔗</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, color: "#0d1526", fontSize: "0.9rem" }}>{pl.title}</div>
                      <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: 2 }}>
                        {pl.amount ? `Rp ${Number(pl.amount).toLocaleString()}` : "Bebas"} · /p/{pl.short_url}
                      </div>
                    </div>
                    <a
                      href={`/p/${pl.short_url}`}
                      target="_blank"
                      style={{
                        padding: "6px 14px",
                        borderRadius: 99,
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        background: "#3b7ddd",
                        color: "#fff",
                        textDecoration: "none",
                      }}
                    >
                      Buka
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "transactions" && (
          <div style={{
            background: "#fff",
            borderRadius: 14,
            border: "1px solid #e2e8f0",
            padding: 24,
          }}>
            {transactions.length === 0 ? (
              <div style={{
                padding: 60,
                textAlign: "center",
                color: "#94a3b8",
                fontSize: "0.88rem",
                border: "2px dashed #e2e8f0",
                borderRadius: 12,
              }}>
                💳 Belum ada transaksi.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {transactions.map((tx) => (
                  <div key={tx.id} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "12px 16px",
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                  }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: tx.status === "paid" ? "#dcfce7" : tx.status === "pending" ? "#fef3c7" : "#fee2e2",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem",
                    }}>
                      {tx.status === "paid" ? "✅" : tx.status === "pending" ? "⏳" : "❌"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#0d1526" }}>
                        Rp {Number(tx.amount).toLocaleString("id-ID")}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                        {tx.payer_name || "Anonim"} · {new Date(tx.created_at).toLocaleString("id-ID")}
                      </div>
                    </div>
                    {tx.status === "pending" && (
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => confirmTransaction(tx.id)} style={{
                          padding: "6px 14px", borderRadius: 99, border: "none",
                          background: "#16a34a", color: "#fff", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer",
                        }}>Konfirmasi ✅</button>
                        <button onClick={() => rejectTransaction(tx.id)} style={{
                          padding: "6px 14px", borderRadius: 99, border: "1px solid #e2e8f0",
                          background: "#fff", color: "#dc2626", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer",
                        }}>Tolak ❌</button>
                      </div>
                    )}
                    {tx.status === "paid" && (
                      <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#16a34a" }}>LUNAS</span>
                    )}
                    {tx.status === "failed" && (
                      <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#dc2626" }}>DITOLAK</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* WHATSAPP TAB */}
        {activeTab === "whatsapp" && (
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", padding: 28 }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0d1526", marginBottom: 4 }}>💬 WhatsApp CS</h2>
            <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: 24 }}>
              Kirim pesan WhatsApp langsung ke pelanggan. Pastikan WAHA sudah berjalan di server.
            </p>

            {/* Send Single Message */}
            <div style={{ marginBottom: 32, paddingBottom: 24, borderBottom: "1px solid #e2e8f0" }}>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#334155", marginBottom: 16 }}>📩 Kirim Pesan</h3>
              <div style={{ display: "grid", gap: 12, maxWidth: 480 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#475569", marginBottom: 4 }}>Nomor HP</label>
                  <input
                    type="text"
                    value={waTo}
                    onChange={(e) => setWaTo(e.target.value)}
                    placeholder="6281234567890"
                    style={{
                      width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #cbd5e1",
                      fontSize: "0.85rem", outline: "none", boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#475569", marginBottom: 4 }}>Pesan</label>
                  <textarea
                    value={waMsg}
                    onChange={(e) => setWaMsg(e.target.value)}
                    placeholder="Tulis pesan di sini..."
                    rows={4}
                    style={{
                      width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #cbd5e1",
                      fontSize: "0.85rem", resize: "vertical", outline: "none", boxSizing: "border-box",
                    }}
                  />
                </div>
                <button
                  className="btn btn-primary"
                  onClick={sendWaMessage}
                  disabled={waSending || !waTo || !waMsg}
                  style={{ padding: "10px 24px", fontSize: "0.85rem", alignSelf: "flex-start" }}
                >
                  {waSending ? "⏳ Mengirim..." : "🚀 Kirim"}
                </button>
                {waResult && (
                  <div style={{ fontSize: "0.82rem", color: waResult.includes("✅") ? "#16a34a" : "#dc2626", fontWeight: 600 }}>{waResult}</div>
                )}
              </div>
            </div>

            {/* Blast Message */}
            <div>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#334155", marginBottom: 16 }}>📢 Blast Message</h3>
              <div style={{ display: "grid", gap: 12, maxWidth: 480 }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#475569", marginBottom: 4 }}>Nomor HP (pisah koma atau baris baru)</label>
                  <textarea
                    value={waBlastNumbers}
                    onChange={(e) => setWaBlastNumbers(e.target.value)}
                    placeholder={"6281234567890\n6289876543210"}
                    rows={4}
                    style={{
                      width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #cbd5e1",
                      fontSize: "0.85rem", resize: "vertical", outline: "none", boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#475569", marginBottom: 4 }}>Pesan Blast</label>
                  <textarea
                    value={waBlastMsg}
                    onChange={(e) => setWaBlastMsg(e.target.value)}
                    placeholder="Tulis pesan blast di sini..."
                    rows={4}
                    style={{
                      width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #cbd5e1",
                      fontSize: "0.85rem", resize: "vertical", outline: "none", boxSizing: "border-box",
                    }}
                  />
                </div>
                <button
                  className="btn btn-primary"
                  onClick={sendWaBlast}
                  disabled={waSending || !waBlastNumbers || !waBlastMsg}
                  style={{ padding: "10px 24px", fontSize: "0.85rem", alignSelf: "flex-start" }}
                >
                  {waSending ? "⏳ Mengirim..." : "📢 Kirim Blast"}
                </button>
                {waBlastResult && (
                  <div style={{ fontSize: "0.82rem", color: waBlastResult.includes("✅") ? "#16a34a" : "#dc2626", fontWeight: 600 }}>{waBlastResult}</div>
                )}
              </div>
            </div>

            {/* Info WAHA */}
            <div style={{ marginTop: 32, padding: 16, background: "#f0f9ff", borderRadius: 10, border: "1px solid #bae6fd" }}>
              <p style={{ fontSize: "0.78rem", color: "#0369a1", margin: 0 }}>
                ⚡ <strong>WAHA WhatsApp API</strong> — Pastikan WAHA sudah running di server (Docker).<br />
                Endpoint API: <code>{process.env.WAHA_URL || "http://localhost:3000"}</code><br />
                Webhook: <code>/api/whatsapp/webhook</code>
              </p>
            </div>
          </div>
        )}

        {/* AI AGENT TAB */}
        {activeTab === "ai-agent" && (
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", padding: 28 }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0d1526", marginBottom: 4 }}>🤖 AI Agent — Asisten WhatsApp</h2>
            <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: 24 }}>
              Konfigurasi kepribadian (SOUL.md) dan profil bisnis (PROFILE.md) untuk AI Agent WhatsApp kamu.
            </p>

            {/* SOUL.md */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, color: "#334155", marginBottom: 8 }}>
                🧠 SOUL.md <span style={{ fontWeight: 400, color: "#94a3b8", marginLeft: 6 }}>— Kepribadian AI</span>
              </label>
              <textarea
                style={{
                  width: "100%", minHeight: 280, padding: "12px 14px",
                  borderRadius: 10, border: "2px solid #6366f1",
                  fontSize: "0.82rem", fontFamily: "'SF Mono', 'Fira Code', Menlo, Consolas, monospace",
                  lineHeight: 1.6, outline: "none", resize: "vertical",
                  background: "#fafafe", color: "#0d1526", boxSizing: "border-box",
                }}
                placeholder={`# SOUL.md — Kepribadian AI Agent\n\n## Identitas\nAnda adalah [Nama AI], [deskripsi peran].\n\n## Kepribadian Inti\n- [Sifat 1]\n- [Sifat 2]\n\n## Gaya Berkomunikasi\n- [Aturan komunikasi 1]\n\n## Batasan\n- [Hal yang tidak boleh dilakukan]`}
                value={aiSoul}
                onChange={(e) => setAiSoul(e.target.value)}
              />
              <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: 4 }}>Format Markdown. Definisi: identitas, nilai, gaya komunikasi, batasan AI.</div>
            </div>

            {/* PROFILE.md */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 600, color: "#334155", marginBottom: 8 }}>
                👤 PROFILE.md <span style={{ fontWeight: 400, color: "#94a3b8", marginLeft: 6 }}>— Profil Bisnis</span>
              </label>
              <textarea
                style={{
                  width: "100%", minHeight: 240, padding: "12px 14px",
                  borderRadius: 10, border: "2px solid #8b5cf6",
                  fontSize: "0.82rem", fontFamily: "'SF Mono', 'Fira Code', Menlo, Consolas, monospace",
                  lineHeight: 1.6, outline: "none", resize: "vertical",
                  background: "#fafafe", color: "#0d1526", boxSizing: "border-box",
                }}
                placeholder={`# PROFILE.md — Profil Bisnis\n\n## Identity\n- **Nama:** [Nama Bisnis/Pemilik]\n- **Bisnis:** [Jenis bisnis]\n\n## Konteks\n- **Target customer:** [Siapa target]\n- **Produk/layanan:** [Apa yang dijual]`}
                value={aiProfile}
                onChange={(e) => setAiProfile(e.target.value)}
              />
              <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: 4 }}>Format Markdown. Informasi bisnis, owner, target, produk.</div>
            </div>

            {/* Save */}
            {aiMsg && (
              <div style={{
                padding: "12px 16px", borderRadius: 10, marginBottom: 16,
                background: aiError ? "#fee2e2" : "#dcfce7",
                color: aiError ? "#dc2626" : "#16a34a",
                fontSize: "0.85rem", fontWeight: 500,
              }}>{aiMsg}</div>
            )}
            <button
              onClick={saveAIConfig}
              disabled={aiSaving}
              style={{
                width: "100%", padding: "12px 28px", borderRadius: 99,
                fontWeight: 600, fontSize: "0.88rem", border: "none", cursor: "pointer",
                background: aiSaving ? "#94a3b8" : "linear-gradient(135deg, #3b7ddd, #4facfe)",
                color: "#fff", opacity: aiSaving ? 0.7 : 1,
              }}
            >
              {aiSaving ? "⏳ Menyimpan..." : "💾 Simpan Konfigurasi"}
            </button>

            {/* Panduan */}
            <details style={{ marginTop: 20, cursor: "pointer" }}>
              <summary style={{ fontSize: "0.82rem", fontWeight: 600, color: "#64748b" }}>📖 Cara mengisi</summary>
              <div style={{ marginTop: 10, fontSize: "0.8rem", color: "#64748b", lineHeight: 1.7 }}>
                <p><strong>🧠 SOUL.md</strong> — definisi "jiwa" AI: identitas, nilai, gaya komunikasi, topik keahlian, dan batasan.</p>
                <p><strong>👤 PROFILE.md</strong> — informasi bisnis: nama toko, pemilik, produk, target customer, FAQ, preferensi.</p>
              </div>
            </details>
          </div>
        )}

        {/* MODAL */}
        {modalMode && (
          <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
            onClick={() => setModalMode(null)}
          >
            <div style={{
              background: "#fff",
              borderRadius: 16,
              padding: 32,
              width: "100%",
              maxWidth: 480,
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0d1526", margin: 0 }}>
                  {modalMode === "payment-link" ? "Buat Payment Link" : "Tambah Merchant QRIS"}
                </h3>
                <button onClick={() => setModalMode(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "#94a3b8", padding: 4 }}>✕</button>
              </div>

              {saveError && (
                <div style={{ padding: "10px 14px", background: "#fef2f2", borderRadius: 10, color: "#dc2626", fontSize: "0.82rem", marginBottom: 16 }}>
                  {saveError}
                </div>
              )}

              {modalMode === "payment-link" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#334155", display: "block", marginBottom: 4 }}>Nama Produk / Tagihan</label>
                    <input
                      value={modalData.name}
                      onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: "0.88rem", outline: "none" }}
                      placeholder="Contoh: Donasi Website"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#334155", display: "block", marginBottom: 4 }}>Deskripsi (opsional)</label>
                    <textarea
                      value={modalData.description}
                      onChange={(e) => setModalData({ ...modalData, description: e.target.value })}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: "0.88rem", outline: "none", minHeight: 80, resize: "vertical" }}
                      placeholder="Deskripsi singkat"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#334155", display: "block", marginBottom: 4 }}>Jumlah (opsional, kosongkan jika bebas)</label>
                    <input
                      type="number"
                      value={modalData.amount}
                      onChange={(e) => setModalData({ ...modalData, amount: e.target.value })}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: "0.88rem", outline: "none" }}
                      placeholder="Rp 50.000"
                    />
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#334155", display: "block", marginBottom: 4 }}>Nama Merchant</label>
                    <input
                      value={modalData.merchant_name}
                      onChange={(e) => setModalData({ ...modalData, merchant_name: e.target.value })}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: "0.88rem", outline: "none" }}
                      placeholder="Nama toko / usaha"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#334155", display: "block", marginBottom: 4 }}>
                      Gambar QRIS
                    </label>
                    <input
                      value={modalData.merchant_qris_url}
                      onChange={(e) => setModalData({ ...modalData, merchant_qris_url: e.target.value })}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: "0.88rem", outline: "none" }}
                      placeholder="https://example.com/qris.jpg"
                    />
                    <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: "4px 0 0" }}>
                      Upload QRIS ke imgur/image host, paste link-nya di sini
                    </p>
                  </div>
                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#334155", display: "block", marginBottom: 4 }}>Deskripsi (opsional)</label>
                    <textarea
                      value={modalData.description}
                      onChange={(e) => setModalData({ ...modalData, description: e.target.value })}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: "0.88rem", outline: "none", minHeight: 80, resize: "vertical" }}
                      placeholder="Catatan merchant"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: "12px 28px",
                  borderRadius: 99,
                  border: "none",
                  background: "linear-gradient(135deg, #3b7ddd, #4facfe)",
                  color: "#fff",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.7 : 1,
                  width: "100%",
                  marginTop: 20,
                }}
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
