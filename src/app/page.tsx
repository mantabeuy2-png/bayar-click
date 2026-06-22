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
              <div className="trust-label">1-Klik Konfirmasi</div>
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
              <div key={i} className="feature-card" style={{ textAlign: "center" }}>
                <div className="feature-icon" style={{ margin: "0 auto 16px", background: "var(--color-brand-light)" }}>
                  {item.icon}
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SEMUA YANG KAMU BUTUHKAN ===== */}
      <section className="section" id="fitur">
        <div className="container text-center">
          <h2>Semua yang kamu butuhin, dalam satu platform.</h2>
          <p className="subtitle subtitle-center">Nggak perlu 5 aplikasi berbeda. Cukup QR merchantmu + Bayar.</p>
          <div className="feature-grid">
            {[
              { icon: "🔗", title: "Payment Link", desc: "Link bayar yang bisa di-share lewat WA, email, atau medsos." },
              { icon: "📊", title: "Dashboard", desc: "Pantau transaksi masuk. Konfirmasi manual dalam 1 klik." },
              { icon: "📤", title: "Upload QRIS", desc: "Upload QRIS merchantmu — tampil persis seperti aslinya." },
              { icon: "💬", title: "Lapor Bayar", desc: "Customer bisa lapor setelah bayar, dengan nama & catatan." },
              { icon: "📱", title: "Mobile Friendly", desc: "Halaman bayar ringan, cocok dibuka dari HP." },
              { icon: "🔒", title: "Aman", desc: "Login dengan email/password atau Google OAuth." },
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
              { icon: "🎨", title: "Kreator", desc: "Tip jar & donasi untuk fans yang mau support." },
              { icon: "🏛️", title: "Organisasi", desc: "Iuran komunitas, tahu siapa yang udah bayar." },
              { icon: "📲", title: "Jualan Online", desc: "Share link bayar di WA, Instagram, TikTok." },
              { icon: "💒", title: "Masjid & Gereja", desc: "Donasi digital tanpa ribet daftar payment gateway." },
              { icon: "👰", title: "Event", desc: "Angpau digital untuk tamu undangan." },
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
                features: ["1 merchant QRIS", "50 transaksi/bulan", "Payment link", "Dashboard dasar", "Manual confirm"]
              },
              {
                name: "Starter",
                amount: "29rb",
                desc: "Buat jualan serius",
                popular: true,
                features: ["3 merchant QRIS", "500 transaksi/bulan", "Payment link unlimited", "Dashboard lengkap", "Manual confirm gratis"]
              },
              {
                name: "Pro",
                amount: "79rb",
                desc: "Buat bisnis berkembang",
                popular: false,
                features: ["10 merchant QRIS", "5.000 transaksi/bulan", "Custom domain", "Export CSV", "Prioritas support"]
              },
              {
                name: "Business",
                amount: "199rb",
                desc: "Scale up unlimited",
                popular: false,
                features: ["Unlimited merchant", "Unlimited transaksi", "White-label domain", "Dedicated support", "SLA 99.9%"]
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

      {/* ===== DETAIL SECTION 1: Donasi ===== */}
      <section className="section" style={{ background: "var(--color-slate-50)" }}>
        <div className="container">
          <div className="detail-section anim-fade-up">
            <div className="detail-text">
              <h2>Donasi, iuran, patungan — 1 menit jadi.</h2>
              <p>Punya QR merchant? Buat link pembayaran profesional dalam 1 menit. Share ke WhatsApp — selesai. Tidak perlu website, tidak perlu daftar payment gateway.</p>
              <ul className="detail-list">
                <li>Link donasi & patungan</li>
                <li>Iuran organisasi — tahu siapa yang sudah bayar</li>
                <li>Angpau digital untuk pernikahan & acara</li>
                <li>Tip jar untuk kreator</li>
                <li>Halaman bayar mobile-friendly</li>
              </ul>
              <a href="/daftar" className="btn btn-primary" style={{ marginTop: 20 }}>Buat Link Pembayaran</a>
            </div>
            <div className="detail-visual">
              <div style={{
                background: "linear-gradient(135deg, var(--color-brand-light), var(--color-accent-light))",
                borderRadius: "var(--radius-card)",
                padding: 40,
                textAlign: "center",
                border: "1px solid var(--color-slate-100)"
              }}>
                <div style={{ fontSize: "3rem", marginBottom: 12 }}>📊</div>
                <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--color-navy-900)" }}>Donasi Progress Bar</div>
                <div style={{
                  marginTop: 16,
                  background: "#fff",
                  borderRadius: 99,
                  height: 24,
                  overflow: "hidden",
                  border: "1px solid var(--color-slate-200)"
                }}>
                  <div style={{
                    width: "73%",
                    height: "100%",
                    background: "linear-gradient(90deg, var(--color-brand), var(--color-accent))",
                    borderRadius: 99,
                    transition: "width 0.5s"
                  }} />
                </div>
                <div style={{ marginTop: 8, fontSize: "0.85rem", color: "var(--color-slate-400)" }}>
                  Rp 7.320.000 terkumpul dari Rp 10.000.000
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DETAIL SECTION 2: n8n ===== */}
      <section className="section">
        <div className="container">
          <div className="detail-section reverse anim-fade-up">
            <div className="detail-text">
              <h2>Automate semuanya dengan n8n.</h2>
              <p>Pas pembayaran masuk, kamu nggak perlu manual kirim konfirmasi atau update spreadsheet. Biarkan n8n yang kerja — langsung terintegrasi dengan tools kesayanganmu.</p>
              <ul className="detail-list">
                <li>Kirim WhatsApp otomatis ke pelanggan</li>
                <li>Update Google Sheets setiap transaksi baru</li>
                <li>Catat otomatis ke Notion, Airtable, atau database-mu</li>
                <li>Kirim invoice lewat email</li>
                <li>Trigger workflow fulfillment — semua serba otomatis</li>
              </ul>
              <a href="/dokumentasi" className="btn btn-accent" style={{ marginTop: 20 }}>🧠 Lihat Template n8n</a>
            </div>
            <div className="detail-visual">
              <div style={{
                background: "#0d1526",
                borderRadius: "var(--radius-card)",
                padding: 32,
                textAlign: "center",
                border: "1px solid rgba(255,255,255,0.1)"
              }}>
                <div style={{ display: "flex", gap: 12, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
                  {["💰 Bayar", "⚡ n8n", "📊 Sheets", "📧 Email", "🤖 WA"].map((label, i) => (
                    <div key={i} style={{
                      padding: "8px 16px",
                      borderRadius: 8,
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      background: i === 0 ? "var(--color-brand)" : i === 1 ? "#ea580c" : "rgba(255,255,255,0.1)",
                      color: "#fff"
                    }}>
                      {label}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 20, color: "rgba(255,255,255,0.5)", fontSize: "0.82rem" }}>
                  ↘ Pembayaran masuk → otomatis trigger workflow n8n → update semua tools-mu
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DETAIL SECTION 3: API ===== */}
      <section className="section" style={{ background: "var(--color-slate-50)" }}>
        <div className="container">
          <div className="detail-section anim-fade-up">
            <div className="detail-text">
              <h2>API-first. Developer friendly.</h2>
              <p>Semua fitur Bayar bisa diakses lewat REST API yang sederhana. Cocok buat developer yang mau integrasi pembayaran ke project mereka.</p>
              <ul className="detail-list">
                <li>Buat payment link via API</li>
                <li>Webhook untuk tiap event transaksi</li>
                <li>Manajemen API key dengan permission scope</li>
                <li>Rate limiting & security built-in</li>
                <li>Dokumentasi lengkap + contoh kode</li>
              </ul>
              <a href="/dokumentasi" className="btn btn-ghost" style={{ marginTop: 20 }}>📖 Baca Dokumentasi</a>
            </div>
            <div className="detail-visual">
              <div style={{
                background: "#1e293b",
                borderRadius: "var(--radius-card)",
                padding: 24,
                fontFamily: "monospace",
                fontSize: "0.78rem",
                color: "#e2e8f0",
                lineHeight: 1.8,
                border: "1px solid rgba(255,255,255,0.1)"
              }}>
                <div style={{ color: "#94a3b8", marginBottom: 12 }}>POST /api/v1/payment-links</div>
                <div><span style={{ color: "#22d3ee" }}>{`{`}</span></div>
                <div>  <span style={{ color: "#a78bfa" }}>"merchant_id"</span>: <span style={{ color: "#34d399" }}>"uuid"</span>,</div>
                <div>  <span style={{ color: "#a78bfa" }}>"title"</span>: <span style={{ color: "#34d399" }}>"Donasi Website"</span>,</div>
                <div>  <span style={{ color: "#a78bfa" }}>"amount"</span>: <span style={{ color: "#f472b6" }}>50000</span>,</div>
                <div>  <span style={{ color: "#a78bfa" }}>"expiry_at"</span>: <span style={{ color: "#34d399" }}>"2026-07-22T00:00:00Z"</span></div>
                <div><span style={{ color: "#22d3ee" }}>{`}`}</span></div>
                <div style={{ color: "#94a3b8", marginTop: 12 }}>// Response:</div>
                <div><span style={{ color: "#22d3ee" }}>{`{`}</span></div>
                <div>  <span style={{ color: "#a78bfa" }}>"short_url"</span>: <span style={{ color: "#34d399" }}>"https://bayar.click/p/abc12345"</span>,</div>
                <div>  <span style={{ color: "#a78bfa" }}>"qr_image"</span>: <span style={{ color: "#34d399" }}>"https://..."</span></div>
                <div><span style={{ color: "#22d3ee" }}>{`}`}</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DETAIL SECTION 4: Auto-Validate ===== */}
      <section className="section">
        <div className="container">
          <div className="detail-section reverse anim-fade-up">
            <div className="detail-text">
              <h2>Konfirmasi otomatis. Gak perlu klik-klik lagi.</h2>
              <p>Untuk provider GoPay & BCA, kami mendeteksi pembayaran masuk secara otomatis. Pelanggan bayar — langsung terkonfirmasi di dashboard. Untuk provider lain, konfirmasi manual bisa dilakukan dengan satu klik — gratis.</p>
              <ul className="detail-list">
                <li><strong>Auto-validate:</strong> GoPay, BCA — tanpa klik apapun (1 credit/transaksi)</li>
                <li><strong>Manual confirm:</strong> Semua QRIS lain — gratis & gampang</li>
                <li><strong>n8n watcher:</strong> Alternatif auto-deteksi dengan email/SMS notifikasi</li>
                <li>Provider auto-validate akan terus bertambah</li>
              </ul>
              <a href="/daftar" className="btn btn-accent" style={{ marginTop: 20 }}>🔥 Coba Gratis</a>
            </div>
            <div className="detail-visual">
              <div style={{
                background: "linear-gradient(135deg, var(--color-accent-light), #f0fdf4)",
                borderRadius: "var(--radius-card)",
                padding: 32,
                textAlign: "center",
                border: "1px solid var(--color-accent)"
              }}>
                <div style={{ fontSize: "3rem", marginBottom: 12 }}>⚡</div>
                <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--color-navy-900)" }}>Auto-Validation</div>
                <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "center" }}>
                  <span style={{ padding: "4px 12px", borderRadius: 99, background: "#059669", color: "#fff", fontSize: "0.75rem", fontWeight: 600 }}>GoPay</span>
                  <span style={{ padding: "4px 12px", borderRadius: 99, background: "#1d4ed8", color: "#fff", fontSize: "0.75rem", fontWeight: 600 }}>BCA</span>
                  <span style={{ padding: "4px 12px", borderRadius: 99, background: "#6b7280", color: "#fff", fontSize: "0.75rem", fontWeight: 600 }}>DANA 🚧</span>
                  <span style={{ padding: "4px 12px", borderRadius: 99, background: "#6b7280", color: "#fff", fontSize: "0.75rem", fontWeight: 600 }}>OVO 🚧</span>
                </div>
                <div style={{ marginTop: 16, fontSize: "0.85rem", color: "var(--color-slate-400)" }}>
                  Auto terdeteksi ✅ — nggak perlu refresh
                </div>
              </div>
            </div>
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
              <a href="/p/demo" className="btn btn-ghost" style={{ fontSize: "1rem", padding: "16px 36px", background: "rgba(255,255,255,0.1)", color: "#94a3b8", borderColor: "rgba(255,255,255,0.15)" }}>
                📱 Lihat Demo
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
