export default function DokumentasiPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#090b12",
      color: "#eef2f9",
      fontFamily: "system-ui, sans-serif",
    }}>
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

      <div style={{ textAlign: "center", padding: "60px 24px 40px", maxWidth: 700, margin: "0 auto" }}>
        <h1 style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: "clamp(2rem, 5vw, 3rem)",
          fontWeight: 900,
          margin: "0 0 12px",
          letterSpacing: "-2px",
        }}>
          <span style={{ background: "linear-gradient(135deg, #4facfe, #00f2fe)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Cara Pakai Bayar.click
          </span>
        </h1>
        <p style={{ fontSize: "1rem", color: "#6a8098", margin: "0 auto", maxWidth: 500 }}>
          Panduan lengkap bikin payment link QRIS dengan konfirmasi manual.
        </p>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px 80px", display: "flex", flexDirection: "column", gap: 24 }}>

        <div style={{ background: "#0f1219", borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", padding: 28 }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 12px", color: "#fff" }}>🚀 Cara Mulai</h2>
          <ol style={{ color: "#6a8098", fontSize: "0.88rem", lineHeight: 1.9, margin: 0, paddingLeft: 20 }}>
            <li>Daftar akun gratis di <a href="/daftar" style={{ color: "#4facfe" }}>bayar.click/daftar</a></li>
            <li>Upload QRIS merchantmu (gambar QRIS dari GoPay, BCA, DANA, dll)</li>
            <li>Buat payment link — atur nominal atau biarkan bebas</li>
            <li>Share link ke pelanggan via WA, Instagram, TikTok</li>
            <li>Cek saldo masuk di rekeningmu, lalu klik <strong>Konfirmasi</strong> di dashboard</li>
          </ol>
        </div>

        <div style={{ background: "#0f1219", borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", padding: 28 }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 12px", color: "#fff" }}>📤 Upload QRIS</h2>
          <p style={{ color: "#6a8098", fontSize: "0.88rem", lineHeight: 1.7, margin: "0 0 12px" }}>
            Upload gambar QRIS ke image hosting (seperti imgur.com), lalu paste link-nya di dashboard.
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
            <div style={{ color: "#6a8098" }}>// Contoh link QRIS</div>
            <div>https://i.imgur.com/abc123.png</div>
          </div>
        </div>

        <div style={{ background: "#0f1219", borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", padding: 28 }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 12px", color: "#fff" }}>🔗 Payment Link</h2>
          <p style={{ color: "#6a8098", fontSize: "0.88rem", lineHeight: 1.7, margin: "0 0 12px" }}>
            Setiap payment link punya URL unik: <code style={{ background: "rgba(255,255,255,0.06)", padding: "2px 8px", borderRadius: 4 }}>bayar.click/p/xxxxxx</code>
          </p>
          <ul style={{ color: "#6a8098", fontSize: "0.88rem", lineHeight: 1.9, margin: 0, paddingLeft: 20 }}>
            <li><strong>Nominal fix:</strong> isi jumlah, customer bayar sesuai angka</li>
            <li><strong>Bebas:</strong> kosongkan nominal, customer bisa bayar berapapun</li>
            <li>Halaman bayar mobile-friendly, cocok dibuka dari HP</li>
          </ul>
        </div>

        <div style={{ background: "#0f1219", borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", padding: 28 }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 12px", color: "#fff" }}>👆 Konfirmasi Manual</h2>
          <p style={{ color: "#6a8098", fontSize: "0.88rem", lineHeight: 1.7, margin: "0 0 12px" }}>
            Saat ada customer bayar, transaksi muncul di tab <strong>Transaksi</strong> dengan status <strong>Pending</strong>.
          </p>
          <div style={{
            background: "#141822",
            borderRadius: 10,
            padding: 16,
            fontSize: "0.82rem",
            color: "#e2e8f0",
            lineHeight: 1.8,
            border: "1px solid rgba(255,255,255,0.05)"
          }}>
            <div style={{ color: "#6a8098", marginBottom: 8 }}>// Alur konfirmasi</div>
            <div>1. Customer bayar ke QRIS-mu</div>
            <div>2. Customer klik "Saya Sudah Bayar"</div>
            <div>3. Kamu cek saldo masuk di rekening</div>
            <div>4. Klik "Konfirmasi ✅" di dashboard</div>
            <div>5. Status berubah jadi LUNAS</div>
          </div>
        </div>

        <div style={{ background: "#0f1219", borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", padding: 28 }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0 0 12px", color: "#fff" }}>📊 Dashboard</h2>
          <p style={{ color: "#6a8098", fontSize: "0.88rem", lineHeight: 1.7, margin: 0 }}>
            7 tab utama: Overview, Merchant QRIS, Payment Links, Transaksi, Webhooks, API Keys, Settings.
          </p>
        </div>

      </div>
    </div>
  );
}
