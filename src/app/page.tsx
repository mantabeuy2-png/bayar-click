"use client";

import { useState } from "react";

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* ===== NAV ===== */}
      <nav className="nav">
        <div className="container nav-inner">
          <a href="/" className="nav-logo">Bayar<span>.click</span></a>
          <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? "✕" : "☰"}
          </button>
          <div className={`nav-links ${menuOpen ? "open" : ""}`}>
            <a href="#fitur" className="nav-link">Fitur</a>
            <a href="#harga" className="nav-link">Harga</a>
            <a href="/dokumentasi" className="nav-link">Dokumentasi</a>
            <a href="/masuk" className="nav-link">Masuk</a>
            <a href="/daftar" className="nav-cta">Mulai Gratis →</a>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="container">
          <div className="hero-badge">⚡ Tanpa potongan tambahan</div>
          <h1>
            QRIS Statismu,<br />
            <span className="hl">Jadi Alat Jualan Online.</span>
          </h1>
          <p className="subtitle">
            Upload QRIS merchantmu, dapatkan payment link profesional, dashboard transaksi,
            dan konfirmasi manual — tanpa potongan, tanpa ribet.
          </p>
          <div className="hero-actions">
            <a href="/daftar" className="btn btn-primary">🚀 Mulai Gratis</a>
            <a href="#fitur" className="btn btn-ghost">📱 Lihat Fitur</a>
          </div>
          <div className="trust-strip">
            <div>
              <div className="trust-number">3</div>
              <div className="trust-label">Langkah Simpel</div>
            </div>
            <div>
              <div className="trust-number">0%</div>
              <div className="trust-label">Potongan Biaya</div>
            </div>
            <div>
              <div className="trust-number">&lt;1m</div>
              <div className="trust-label">Link Jadi</div>
            </div>
            <div>
              <div className="trust-number">👆</div>
              <div className="trust-label">Konfirmasi Manual</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CARA KERJA ===== */}
      <section className="section" id="cara-kerja">
        <div className="container text-center">
          <h2>Cara Kerjanya</h2>
          <p className="subtitle subtitle-center">3 langkah aja — nggak perlu coding, nggak perlu daftar payment gateway.</p>
          <div className="feature-grid" style={{ marginTop: 32 }}>
            {[
              { icon: "📤", title: "Upload QRIS", desc: "Upload gambar QRIS merchant yang kamu punya." },
              { icon: "🔗", title: "Buat Link Bayar", desc: "Buat link pembayaran profesional. Atur nominal atau bebas." },
              { icon: "👆", title: "Konfirmasi Manual", desc: "Cek saldo masuk, klik konfirmasi — selesai." },
            ].map((item, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon" style={{ background: i % 2 === 0 ? "var(--color-brand-light)" : "var(--color-accent-light)" }}>
                  {item.icon}
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== USE CASES ===== */}
      <section className="section" style={{ background: "var(--color-slate-50)" }}>
        <div className="container text-center">
          <h2>Buat siapa aja?</h2>
          <p className="subtitle subtitle-center">Bayar cocok buat berbagai kebutuhan.</p>
          <div className="feature-grid" style={{ marginTop: 32 }}>
            {[
              { icon: "🏪", title: "UMKM & Toko", desc: "Terima pembayaran online pake QRIS yang udah ada." },
              { icon: "🏛️", title: "Organisasi", desc: "Iuran komunitas, tahu siapa yang sudah bayar." },
              { icon: "💒", title: "Masjid & Gereja", desc: "Donasi digital tanpa ribet daftar payment gateway." },
              { icon: "👰", title: "Event", desc: "Angpau digital untuk tamu undangan." },
              { icon: "📲", title: "Jualan Online", desc: "Share link bayar di WA, Instagram, TikTok." },
              { icon: "🏠", title: "Iuran RT/RW", desc: "Kumpulkan iuran bulanan dengan mudah." },
            ].map((item, i) => (
              <div key={i} className="feature-card" style={{ textAlign: "center" }}>
                <div className="feature-icon" style={{ margin: "0 auto 16px" }}>
                  {item.icon}
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HARGA ===== */}
      <section className="section" id="harga">
        <div className="container text-center">
          <h2>Harga sederhana. Nggak ada biaya ngumpet.</h2>
          <p className="subtitle subtitle-center">Mulai gratis. Upgrade kapan aja kamu butuh.</p>
          <div className="pricing-grid">
            {[
              {
                name: "Free",
                amount: "0",
                desc: "Coba-coba dulu",
                popular: false,
                features: [
                  "1 merchant QRIS",
                  "50 transaksi/bulan",
                  "Payment link unlimited",
                  "Dashboard transaksi",
                  "Konfirmasi manual",
                ]
              },
              {
                name: "Starter",
                amount: "29rb",
                desc: "Buat jualan serius",
                popular: true,
                features: [
                  "3 merchant QRIS",
                  "500 transaksi/bulan",
                  "Payment link unlimited",
                  "Dashboard transaksi",
                  "Konfirmasi manual",
                ]
              },
              {
                name: "Pro",
                amount: "79rb",
                desc: "Buat bisnis berkembang",
                popular: false,
                features: [
                  "10 merchant QRIS",
                  "5.000 transaksi/bulan",
                  "Payment link unlimited",
                  "Dashboard transaksi",
                  "Konfirmasi manual",
                ]
              },
              {
                name: "Business",
                amount: "199rb",
                desc: "Scale up unlimited",
                popular: false,
                features: [
                  "Merchant QRIS unlimited",
                  "Transaksi unlimited",
                  "Payment link unlimited",
                  "Dashboard transaksi",
                  "Konfirmasi manual",
                ]
              },
            ].map((plan, i) => (
              <div key={i} className={`price-card ${plan.popular ? "featured" : ""}`}>
                {plan.popular && <div className="price-popular">POPULER</div>}
                <div className="price-name">{plan.name}</div>
                <div className="price-amount">Rp {plan.amount}<span>/bln</span></div>
                <div className="price-desc">{plan.desc}</div>
                <ul className="price-features">
                  {plan.features.map((f, j) => <li key={j}>{f}</li>)}
                </ul>
                <a href="/daftar" className={`btn ${plan.popular ? "btn-primary" : "btn-ghost"}`}>Pilih {plan.name}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section>
        <div className="container">
          <div className="final-cta">
            <h2>Siap ubah QR statismu jadi mesin duit?</h2>
            <p>Gratis mulai. Nggak perlu kartu kredit. Nggak perlu payment gateway.</p>
            <div className="hero-actions" style={{ justifyContent: "center" }}>
              <a href="/daftar" className="btn btn-primary" style={{ fontSize: "1rem", padding: "16px 36px" }}>
                🚀 Mulai Gratis Sekarang
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <p>© 2026 Bayar.click — QRIS Platform untuk Indonesia</p>
      </footer>
    </>
  );
}
