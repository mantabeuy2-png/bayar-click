export default function DokumentasiPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#090b12",
      color: "#eef2f9",
      fontFamily: "system-ui, sans-serif",
    }}>
      {/* Nav */}
      <nav style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "0 24px",
        height: 54,
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        position: "sticky",
        top: 0,
        background: "rgba(9,11,18,0.97)",
        backdropFilter: "blur(14px)",
        zIndex: 100,
      }}>
        <a href="/" style={{ fontWeight: 800, fontSize: "1.2rem", color: "#eef2f9", textDecoration: "none" }}>
          Bayar<span style={{ color: "#4facfe" }}>.click</span>
        </a>
        <div style={{ flex: 1 }} />
        <a href="/" style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.82rem", fontWeight: 600, textDecoration: "none" }}>
          ← Kembali
        </a>
      </nav>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "60px 24px 40px", maxWidth: 700, margin: "0 auto" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "4px 14px",
          borderRadius: 99,
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#6a8098",
          fontSize: "0.78rem",
          fontWeight: 700,
          marginBottom: 20,
        }}>
          📖 Documentation v1.0
        </div>
        <h1 style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: "clamp(2rem, 5vw, 3rem)",
          fontWeight: 900,
          margin: "0 0 12px",
          letterSpacing: "-2px",
        }}>
          <span style={{ background: "linear-gradient(135deg, #4facfe, #00f2fe)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Developer Documentation
          </span>
        </h1>
        <p style={{ fontSize: "1rem", color: "#6a8098", margin: "0 auto", maxWidth: 500 }}>
          Integrasikan QRIS payment ke project kamu dalam hitungan menit.
        </p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 80px", display: "flex", flexDirection: "column", gap: 24 }}>

        {/* Quick Start */}
        <div style={{ background: "#0f1219", borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", padding: 28 }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 12px", color: "#fff" }}>🚀 Quick Start</h2>
          <p style={{ color: "#6a8098", fontSize: "0.88rem", lineHeight: 1.7, margin: 0 }}>
            Dengan API Bayar, kamu bisa membuat payment link, memeriksa status transaksi, dan menerima webhook — semuanya lewat REST API yang sederhana.
          </p>
        </div>

        {/* Authentication */}
        <div style={{ background: "#0f1219", borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", padding: 28 }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 12px", color: "#fff" }}>🔐 Authentication</h2>
          <p style={{ color: "#6a8098", fontSize: "0.88rem", lineHeight: 1.7, margin: "0 0 16px" }}>
            Setiap request API membutuhkan API key yang dikirim lewat header <code style={{ background: "rgba(255,255,255,0.06)", padding: "2px 8px", borderRadius: 4, fontSize: "0.82rem" }}>Authorization: Bearer YOUR_API_KEY</code>
          </p>
          <div style={{
            background: "#141822",
            borderRadius: 10,
            padding: 16,
            fontFamily: "monospace",
            fontSize: "0.78rem",
            color: "#e2e8f0",
            lineHeight: 1.8,
            border: "1px solid rgba(255,255,255,0.05)"
          }}>
            <div style={{ color: "#6a8098", marginBottom: 8 }}>// Example Request</div>
            <div><span style={{ color: "#22d3ee" }}>curl</span> -X GET <span style={{ color: "#34d399" }}>"https://api.bayar.click/v1/merchants"</span> \</div>
            <div>  -H <span style={{ color: "#34d399" }}>"Authorization: Bearer bayar_sk_xxx"</span></div>
          </div>
        </div>

        {/* API Endpoints */}
        <div style={{ background: "#0f1219", borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", padding: 28 }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 12px", color: "#fff" }}>📡 API Endpoints</h2>
          <p style={{ color: "#6a8098", fontSize: "0.88rem", lineHeight: 1.7, margin: "0 0 16px" }}>
            Base URL: <code style={{ background: "rgba(255,255,255,0.06)", padding: "2px 8px", borderRadius: 4, fontSize: "0.82rem" }}>https://api.bayar.click/v1</code>
          </p>

          {[
            { method: "POST", path: "/payment-links", desc: "Buat payment link baru" },
            { method: "GET", path: "/payment-links/:id", desc: "Detail payment link" },
            { method: "GET", path: "/payment-links/:id/qr", desc: "Download QR code image" },
            { method: "GET", path: "/transactions", desc: "List transaksi" },
            { method: "GET", path: "/transactions/:id", desc: "Detail transaksi" },
            { method: "POST", path: "/transactions/:id/confirm", desc: "Konfirmasi manual" },
            { method: "GET", path: "/merchants", desc: "List merchant QRIS" },
            { method: "POST", path: "/merchants", desc: "Tambah merchant QRIS" },
            { method: "GET", path: "/credits", desc: "Cek saldo kredit" },
          ].map((ep, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 0",
              borderBottom: i < 8 ? "1px solid rgba(255,255,255,0.04)" : "none",
            }}>
              <span style={{
                padding: "2px 10px",
                borderRadius: 4,
                fontSize: "0.72rem",
                fontWeight: 700,
                background: ep.method === "POST" ? "rgba(16,185,129,0.15)" : "rgba(79,172,254,0.15)",
                color: ep.method === "POST" ? "#10b981" : "#4facfe",
                flexShrink: 0,
              }}>
                {ep.method}
              </span>
              <code style={{ fontSize: "0.82rem", color: "#eef2f9", flexShrink: 0 }}>{ep.path}</code>
              <span style={{ fontSize: "0.82rem", color: "#6a8098", flex: 1 }}>{ep.desc}</span>
            </div>
          ))}
        </div>

        {/* Webhook */}
        <div style={{ background: "#0f1219", borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", padding: 28 }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 12px", color: "#fff" }}>🔔 Webhooks</h2>
          <p style={{ color: "#6a8098", fontSize: "0.88rem", lineHeight: 1.7, margin: "0 0 16px" }}>
            Daftarkan URL webhook-mu. Kami akan mengirim POST request setiap kali ada event transaksi.
          </p>
          <div style={{
            background: "#141822",
            borderRadius: 10,
            padding: 16,
            fontFamily: "monospace",
            fontSize: "0.78rem",
            color: "#e2e8f0",
            lineHeight: 1.8,
            border: "1px solid rgba(255,255,255,0.05)"
          }}>
            <div style={{ color: "#6a8098", marginBottom: 8 }}>// Webhook Payload (POST)</div>
            <div><span style={{ color: "#f472b6" }}>{`{`}</span></div>
            <div>  <span style={{ color: "#a78bfa" }}>"event"</span>: <span style={{ color: "#34d399" }}>"transaction.paid"</span>,</div>
            <div>  <span style={{ color: "#a78bfa" }}>"transaction_id"</span>: <span style={{ color: "#34d399" }}>"uuid"</span>,</div>
            <div>  <span style={{ color: "#a78bfa" }}>"amount"</span>: <span style={{ color: "#f472b6" }}>50000</span>,</div>
            <div>  <span style={{ color: "#a78bfa" }}>"status"</span>: <span style={{ color: "#34d399" }}>"paid"</span>,</div>
            <div>  <span style={{ color: "#a78bfa" }}>"paid_at"</span>: <span style={{ color: "#34d399" }}>"2026-06-22T15:00:00Z"</span></div>
            <div><span style={{ color: "#f472b6" }}>{`}`}</span></div>
          </div>
        </div>

        {/* n8n Integration */}
        <div style={{
          background: "linear-gradient(135deg, rgba(234,88,12,0.08), rgba(249,115,22,0.04))",
          borderRadius: 14,
          border: "1px solid rgba(234,88,12,0.2)",
          padding: 28,
        }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 12px", color: "#fff" }}>🧠 n8n Integration</h2>
          <p style={{ color: "#6a8098", fontSize: "0.88rem", lineHeight: 1.7, margin: "0 0 16px" }}>
            Hubungkan Bayar dengan n8n untuk automation tanpa batas. Setiap transaksi masuk, langsung trigger workflow n8n-mu.
          </p>
          <div style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}>
            {["🔄 Update Google Sheets", "📤 Kirim Email Invoice", "🤖 Kirim WhatsApp", "📝 Catat ke Airtable", "📊 Update Notion Database"].map((item, i) => (
              <div key={i} style={{
                padding: "8px 16px",
                borderRadius: 8,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
                fontSize: "0.82rem",
                color: "#cbd5e1",
              }}>
                {item}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20 }}>
            <a href="/daftar" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 22px",
              borderRadius: 99,
              background: "linear-gradient(135deg, #ea580c, #f97316)",
              color: "#fff",
              fontSize: "0.85rem",
              fontWeight: 600,
              textDecoration: "none",
            }}>
              🚀 Mulai Integrasi
            </a>
          </div>
        </div>

        {/* n8n Workflow Template */}
        <div style={{ background: "#0f1219", borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", padding: 28 }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 12px", color: "#fff" }}>
            📋 n8n Workflow Template — WhatsApp Notifikasi
          </h2>
          <p style={{ color: "#6a8098", fontSize: "0.88rem", lineHeight: 1.7, margin: "0 0 16px" }}>
            Contoh workflow: Pas ada transaksi sukses, kirim WhatsApp notifikasi ke pelanggan.
          </p>
          <div style={{
            background: "#141822",
            borderRadius: 10,
            padding: 16,
            fontFamily: "monospace",
            fontSize: "0.75rem",
            color: "#e2e8f0",
            lineHeight: 1.8,
            border: "1px solid rgba(255,255,255,0.05)",
            overflowX: "auto",
          }}>
            <div style={{ color: "#6a8098", marginBottom: 8 }}>// Step 1: n8n Webhook - Tangkap dari Bayar</div>
            <div><span style={{ color: "#22d3ee" }}>Webhook</span> → <span style={{ color: "#f472b6" }}>Receive</span> POST from Bayar</div>
            <div style={{ color: "#6a8098", margin: "8px 0" }}>// Step 2: Filter - Cek status paid</div>
            <div><span style={{ color: "#a78bfa" }}>IF</span> body.status === <span style={{ color: "#34d399" }}>"paid"</span></div>
            <div style={{ color: "#6a8098", margin: "8px 0" }}>// Step 3: Format pesan WhatsApp</div>
            <div><span style={{ color: "#22d3ee" }}>Set</span> <span style={{ color: "#a78bfa" }}>message</span> = <span style={{ color: "#34d399" }}>{"\"Pembayaran Rp${$json.body.amount} berhasil! ✅\""}</span></div>
            <div style={{ color: "#6a8098", margin: "8px 0" }}>// Step 4: Kirim WhatsApp via WhatsApp Business API</div>
            <div><span style={{ color: "#22d3ee" }}>HTTP Request</span> → POST to WhatsApp API</div>
          </div>
        </div>

      </div>
    </div>
  );
}
