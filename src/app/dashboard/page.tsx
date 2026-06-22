"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseClientClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

type Tab = "overview" | "merchants" | "payment-links" | "transactions" | "webhooks" | "api-keys" | "settings";
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
    merchant_qr_data: "",
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [merchants, setMerchants] = useState<any[]>([]);
  const [paymentLinks, setPaymentLinks] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);
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

  useEffect(() => {
    fetchMerchants();
    fetchPaymentLinks();
  }, []);

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
        qr_data: modalData.merchant_qr_data || null,
      });

      if (error) {
        setSaveError(error.message);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    setModalMode(null);
    setModalData({ name: "", description: "", amount: "", merchant_name: "", merchant_qris_url: "", merchant_qr_data: "" });
    fetchMerchants();
    fetchPaymentLinks();
  };

  const handleLogout = async () => {
    const supabase = createSupabaseClientClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "merchants", label: "Merchant QRIS", icon: "🏪" },
    { id: "payment-links", label: "Payment Links", icon: "🔗" },
    { id: "transactions", label: "Transaksi", icon: "💳" },
    { id: "webhooks", label: "Webhooks", icon: "🔔" },
    { id: "api-keys", label: "API Keys", icon: "🔑" },
    { id: "settings", label: "Settings", icon: "⚙️" },
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
              {activeTab === "webhooks" && "Webhook integration"}
              {activeTab === "api-keys" && "API key management"}
              {activeTab === "settings" && "Pengaturan akun"}
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
          </div>
        )}

        {activeTab === "transactions" && (
          <div style={{
            background: "#fff",
            borderRadius: 14,
            border: "1px solid #e2e8f0",
            padding: 24,
          }}>
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
          </div>
        )}

        {activeTab === "webhooks" && (
          <div style={{
            background: "#fff",
            borderRadius: 14,
            border: "1px solid #e2e8f0",
            padding: 24,
          }}>
            <div style={{
              padding: 60,
              textAlign: "center",
              color: "#94a3b8",
              fontSize: "0.88rem",
              border: "2px dashed #e2e8f0",
              borderRadius: 12,
            }}>
              🔔 Belum ada webhook. Integrasikan Bayar dengan tools kamu!
            </div>
          </div>
        )}

        {activeTab === "api-keys" && (
          <div style={{
            background: "#fff",
            borderRadius: 14,
            border: "1px solid #e2e8f0",
            padding: 24,
          }}>
            <div style={{
              padding: 60,
              textAlign: "center",
              color: "#94a3b8",
              fontSize: "0.88rem",
              border: "2px dashed #e2e8f0",
              borderRadius: 12,
            }}>
              🔑 Belum ada API key. Buat API key untuk integrasi!
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div style={{
            background: "#fff",
            borderRadius: 14,
            border: "1px solid #e2e8f0",
            padding: 24,
          }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#0d1526", marginBottom: 16 }}>
              Pengaturan Akun
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 400 }}>
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#334155", display: "block", marginBottom: 4 }}>Nama</label>
                <input type="text" defaultValue={userName} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: "0.88rem" }} />
              </div>
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#334155", display: "block", marginBottom: 4 }}>Email</label>
                <input type="email" defaultValue={userEmail} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: "0.88rem" }} />
              </div>
              <button className="btn btn-primary" style={{ width: "fit-content", marginTop: 8 }}>
                Simpan
              </button>
            </div>
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
                      Kode QRIS / NMID <span style={{ color: "#3b7ddd", fontWeight: 400 }}>(prioritas)</span>
                    </label>
                    <input
                      value={modalData.merchant_qr_data}
                      onChange={(e) => setModalData({ ...modalData, merchant_qr_data: e.target.value })}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: "0.88rem", outline: "none" }}
                      placeholder="00020101021226630012ID... atau NMID/MPAN"
                    />
                    <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: "4px 0 0" }}>
                      Paste kode QRIS biar sistem bisa generate QR dinamis otomatis
                    </p>
                  </div>
                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#334155", display: "block", marginBottom: 4 }}>
                      Gambar QRIS <span style={{ color: "#94a3b8", fontWeight: 400 }}>(alternatif)</span>
                    </label>
                    <input
                      value={modalData.merchant_qris_url}
                      onChange={(e) => setModalData({ ...modalData, merchant_qris_url: e.target.value })}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: "0.88rem", outline: "none" }}
                      placeholder="https://example.com/qris.jpg"
                    />
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
