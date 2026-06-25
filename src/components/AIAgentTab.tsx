"use client";

import { useState, useEffect, useCallback } from "react";

interface AIAgentConfig {
  status: string;
  nomor_wa: string;
  pesan_sapaan: string;
  jam_buka: string;
  jam_tutup: string;
  hari_operasional: string[];
  auto_reply_offline: string;
  soul_md: string;
  profile_md: string;
}

const HARI = ["sen", "sel", "rab", "kam", "jum", "sab", "min"];
const HARI_LABEL: Record<string, string> = {
  sen: "Sen", sel: "Sel", rab: "Rab", kam: "Kam",
  jum: "Jum", sab: "Sab", min: "Min",
};

// ===== STYLES =====
const S = {
  card: {
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    overflow: "hidden",
  } as React.CSSProperties,
  cardBody: {
    padding: 28,
  } as React.CSSProperties,
  title: {
    fontSize: "1.05rem",
    fontWeight: 700,
    color: "#0d1526",
    marginBottom: 2,
  } as React.CSSProperties,
  subtitle: {
    fontSize: "0.82rem",
    color: "#94a3b8",
    marginBottom: 24,
    marginTop: 0,
  } as React.CSSProperties,
  formGroup: {
    marginBottom: 16,
  } as React.CSSProperties,
  label: {
    fontSize: "0.82rem",
    fontWeight: 600,
    color: "#334155",
    display: "block",
    marginBottom: 6,
  } as React.CSSProperties,
  input: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #e2e8f0",
    fontSize: "0.88rem",
    outline: "none",
    background: "#fff",
    color: "#0d1526",
    boxSizing: "border-box" as const,
  } as React.CSSProperties,
  select: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #e2e8f0",
    fontSize: "0.88rem",
    outline: "none",
    background: "#fff",
    color: "#0d1526",
    boxSizing: "border-box" as const,
    cursor: "pointer",
  } as React.CSSProperties,
  textarea: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #e2e8f0",
    fontSize: "0.82rem",
    outline: "none",
    background: "#fff",
    color: "#0d1526",
    resize: "vertical" as const,
    fontFamily: "'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace",
    lineHeight: 1.6,
    boxSizing: "border-box" as const,
  } as React.CSSProperties,
  labelHint: {
    fontSize: "0.72rem",
    color: "#94a3b8",
    marginTop: 4,
  } as React.CSSProperties,
  infoBox: {
    background: "#eef2ff",
    border: "1px solid #c7d2fe",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  } as React.CSSProperties,
  infoTitle: {
    fontSize: "0.95rem",
    fontWeight: 700,
    color: "#4338ca",
    marginBottom: 12,
  } as React.CSSProperties,
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  } as React.CSSProperties,
  infoCol: {} as React.CSSProperties,
  infoColTitle: {
    fontSize: "0.82rem",
    fontWeight: 600,
    color: "#4f46e5",
    marginBottom: 6,
  } as React.CSSProperties,
  infoColText: {
    fontSize: "0.78rem",
    color: "#64748b",
    lineHeight: 1.55,
  } as React.CSSProperties,
  infoFooter: {
    marginTop: 14,
    paddingTop: 12,
    borderTop: "1px solid #c7d2fe",
    fontSize: "0.82rem",
    color: "#4338ca",
    fontWeight: 600,
  } as React.CSSProperties,
  btn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "12px 24px",
    borderRadius: 99,
    fontWeight: 600,
    fontSize: "0.88rem",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s",
    width: "100%",
    background: "linear-gradient(135deg, #3b7ddd, #4facfe)",
    color: "#fff",
    boxSizing: "border-box" as const,
  } as React.CSSProperties,
  btnDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  } as React.CSSProperties,
  alertSuccess: {
    padding: "12px 16px",
    borderRadius: 10,
    background: "#dcfce7",
    color: "#16a34a",
    fontSize: "0.85rem",
    fontWeight: 500,
    marginBottom: 16,
  } as React.CSSProperties,
  alertError: {
    padding: "12px 16px",
    borderRadius: 10,
    background: "#fee2e2",
    color: "#dc2626",
    fontSize: "0.85rem",
    fontWeight: 500,
    marginBottom: 16,
  } as React.CSSProperties,
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  } as React.CSSProperties,
  checkboxGroup: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 8,
    marginTop: 4,
  } as React.CSSProperties,
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    cursor: "pointer",
    fontSize: "0.82rem",
    color: "#334155",
  } as React.CSSProperties,
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 80,
  } as React.CSSProperties,
  spinner: {
    width: 40,
    height: 40,
    border: "3px solid #e2e8f0",
    borderTopColor: "#3b7ddd",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  } as React.CSSProperties,
};

export default function AIAgentTab() {
  const [config, setConfig] = useState<AIAgentConfig>({
    status: "off",
    nomor_wa: "",
    pesan_sapaan: "Halo! Ada yang bisa dibantu?",
    jam_buka: "08:00",
    jam_tutup: "17:00",
    hari_operasional: ["sen", "sel", "rab", "kam", "jum"],
    auto_reply_offline: "Maaf, kami sedang offline. Terima kasih! 🙏",
    soul_md: "",
    profile_md: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [saveError, setSaveError] = useState(false);

  const loadConfig = useCallback(async () => {
    try {
      const res = await fetch("/api/ai-agent");
      if (res.ok) {
        const data = await res.json();
        setConfig((prev) => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.error("Gagal load AI Agent config:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg("");
    setSaveError(false);
    try {
      const res = await fetch("/api/ai-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        setSaveMsg("✅ Konfigurasi berhasil disimpan!");
        setSaveError(false);
      } else {
        const err = await res.json();
        setSaveMsg(`❌ Gagal: ${err.error || "Unknown error"}`);
        setSaveError(true);
      }
    } catch {
      setSaveMsg("❌ Gagal menyimpan. Coba lagi.");
      setSaveError(true);
    } finally {
      setSaving(false);
    }
  };

  const toggleHari = (h: string) => {
    setConfig((prev) => ({
      ...prev,
      hari_operasional: prev.hari_operasional.includes(h)
        ? prev.hari_operasional.filter((x) => x !== h)
        : [...prev.hari_operasional, h],
    }));
  };

  if (loading) {
    return (
      <div style={S.loadingContainer}>
        <div style={S.spinner} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={S.card}>
      <div style={S.cardBody}>
        <h2 style={S.title}>⚙️ AI Agent — Asisten WhatsApp</h2>
        <p style={S.subtitle}>
          Konfigurasi AI Agent untuk auto-reply WhatsApp pelanggan.
        </p>

        {/* STATUS */}
        <div style={S.formGroup}>
          <label style={S.label}>Status</label>
          <select
            style={S.select}
            value={config.status}
            onChange={(e) => setConfig({ ...config, status: e.target.value })}
          >
            <option value="off">Off</option>
            <option value="on">On</option>
          </select>
        </div>

        {/* NOMOR WA */}
        <div style={S.formGroup}>
          <label style={S.label}>Nomor WA</label>
          <input
            type="text"
            style={S.input}
            placeholder="628xxxxxxxxxx"
            value={config.nomor_wa}
            onChange={(e) => setConfig({ ...config, nomor_wa: e.target.value })}
          />
        </div>

        {/* PESAN SAPAAN */}
        <div style={S.formGroup}>
          <label style={S.label}>Pesan Sapaan</label>
          <input
            type="text"
            style={S.input}
            value={config.pesan_sapaan}
            onChange={(e) => setConfig({ ...config, pesan_sapaan: e.target.value })}
          />
        </div>

        {/* JAM OPERASIONAL */}
        <div style={S.grid2}>
          <div style={S.formGroup}>
            <label style={S.label}>Jam Buka</label>
            <input
              type="time"
              style={S.input}
              value={config.jam_buka}
              onChange={(e) => setConfig({ ...config, jam_buka: e.target.value })}
            />
          </div>
          <div style={S.formGroup}>
            <label style={S.label}>Jam Tutup</label>
            <input
              type="time"
              style={S.input}
              value={config.jam_tutup}
              onChange={(e) => setConfig({ ...config, jam_tutup: e.target.value })}
            />
          </div>
        </div>

        {/* HARI OPERASIONAL */}
        <div style={S.formGroup}>
          <label style={S.label}>Hari Operasional</label>
          <div style={S.checkboxGroup}>
            {HARI.map((h) => (
              <label key={h} style={S.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={config.hari_operasional.includes(h)}
                  onChange={() => toggleHari(h)}
                  style={{ accentColor: "#3b7ddd", width: 16, height: 16 }}
                />
                {HARI_LABEL[h]}
              </label>
            ))}
          </div>
        </div>

        {/* AUTO-REPLY OFFLINE */}
        <div style={S.formGroup}>
          <label style={S.label}>Auto-reply Offline</label>
          <input
            type="text"
            style={S.input}
            value={config.auto_reply_offline}
            onChange={(e) => setConfig({ ...config, auto_reply_offline: e.target.value })}
          />
        </div>

        {/* INFO PANEL — compact */}
        <div style={{ ...S.infoBox, padding: 14, marginBottom: 20 }}>
          <details>
            <summary style={{ cursor: "pointer", fontWeight: 600, color: "#4338ca", fontSize: "0.88rem" }}>
              📖 Panduan SOUL.md &amp; PROFILE.md (klik untuk buka)
            </summary>
            <div style={{ marginTop: 12, fontSize: "0.8rem", color: "#64748b", lineHeight: 1.6 }}>
              <p><strong>🧠 SOUL.md</strong> — kepribadian AI: identitas, tone bicara, nilai, aturan, batasan.</p>
              <p><strong>👤 PROFILE.md</strong> — profil bisnis: nama, produk, target customer, FAQ, preferensi.</p>
              <p style={{ marginTop: 8 }}>💡 Format Markdown. Semakin detail, AI makin natural.</p>
            </div>
          </details>
        </div>

        {/* SOUL.md — BIG & PROMINENT */}
        <div style={{ ...S.formGroup, marginBottom: 20 }}>
          <label style={{ ...S.label, fontSize: "0.9rem", marginBottom: 8 }}>
            🧠 SOUL.md
            <span style={{ fontWeight: 400, color: "#94a3b8", marginLeft: 8 }}>— Kepribadian & Panduan AI Agent</span>
          </label>
          <textarea
            style={{
              ...S.textarea,
              minHeight: 280,
              fontSize: "0.8rem",
              border: "2px solid #6366f1",
              background: "#fafafe",
            }}
            placeholder={`# SOUL.md — Kepribadian AI Agent\n\n## Identitas\nAnda adalah [Nama AI], [deskripsi peran].\n\nMisi Anda adalah [tujuan utama AI].\n\n## Kepribadian Inti\n- [Sifat 1]\n- [Sifat 2]\n\n## Gaya Berkomunikasi\n- [Aturan komunikasi 1]\n\n## Batasan\n- [Hal yang tidak boleh dilakukan]`}
            value={config.soul_md}
            onChange={(e) => setConfig({ ...config, soul_md: e.target.value })}
          />
        </div>

        {/* PROFILE.md — BIG & PROMINENT */}
        <div style={{ ...S.formGroup, marginBottom: 24 }}>
          <label style={{ ...S.label, fontSize: "0.9rem", marginBottom: 8 }}>
            👤 PROFILE.md
            <span style={{ fontWeight: 400, color: "#94a3b8", marginLeft: 8 }}>— Profil Bisnis & Konteks Pengguna</span>
          </label>
          <textarea
            style={{
              ...S.textarea,
              minHeight: 240,
              fontSize: "0.8rem",
              border: "2px solid #8b5cf6",
              background: "#fafafe",
            }}
            placeholder={`# PROFILE.md — Profil Bisnis\n\n## Identity\n- **Nama:** [Nama Bisnis/Pemilik]\n- **Bisnis:** [Jenis bisnis]\n\n## Konteks\n- **Target customer:** [Siapa target]\n- **Produk/layanan:** [Apa yang dijual]\n- **Preferensi:** [Yang disukai/tidak]`}
            value={config.profile_md}
            onChange={(e) => setConfig({ ...config, profile_md: e.target.value })}
          />
        </div>

        {/* SAVE MESSAGE */}
        {saveMsg && (
          <div style={saveError ? S.alertError : S.alertSuccess}>
            {saveMsg}
          </div>
        )}

        {/* SAVE BUTTON */}
        <button
          style={saving ? { ...S.btn, ...S.btnDisabled } : S.btn}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <>
              <div style={{
                width: 18, height: 18,
                border: "2px solid rgba(255,255,255,0.3)",
                borderTopColor: "#fff",
                borderRadius: "50%",
                animation: "spin 0.6s linear infinite",
              }} />
              Menyimpan...
            </>
          ) : (
            "💾 Simpan"
          )}
        </button>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
