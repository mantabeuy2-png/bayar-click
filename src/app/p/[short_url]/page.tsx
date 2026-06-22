"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createSupabaseClientClient } from "@/lib/supabase/client";
import QRCode from "qrcode";

export default function PaymentPage() {
  const params = useParams();
  const shortUrl = params?.short_url as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentLink, setPaymentLink] = useState<any>(null);
  const [merchant, setMerchant] = useState<any>(null);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [payerName, setPayerName] = useState("");
  const [payerNote, setPayerNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!shortUrl) return;

    const fetchData = async () => {
      const supabase = createSupabaseClientClient();

      // 1. Get payment link by short_url
      const { data: pl, error: plErr } = await supabase
        .from("payment_links")
        .select("*")
        .eq("short_url", shortUrl)
        .single();

      if (plErr || !pl) {
        setError("Link pembayaran tidak ditemukan.");
        setLoading(false);
        return;
      }

      setPaymentLink(pl);

      // 2. Get merchant
      const { data: m } = await supabase
        .from("merchants")
        .select("*")
        .eq("id", pl.merchant_id)
        .single();

      if (m) setMerchant(m);

      // 3. Generate QR code
      const qrSource = m?.qr_data || m?.qr_image_url || "";
      if (qrSource) {
        try {
          // If it's a URL pointing to an image, use it directly
          if (qrSource.startsWith("http")) {
            setQrDataUrl(qrSource);
          } else {
            // It's a QRIS code string — generate QR code image
            const dataUrl = await QRCode.toDataURL(qrSource, {
              width: 400,
              margin: 2,
              color: { dark: "#0d1526", light: "#ffffff" },
            });
            setQrDataUrl(dataUrl);
          }
        } catch {
          setQrDataUrl("");
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [shortUrl]);

  const handlePaid = async () => {
    setSubmitting(true);
    setSubmitError("");

    const supabase = createSupabaseClientClient();
    const { error: txErr } = await supabase.from("transactions").insert({
      payment_link_id: paymentLink?.id,
      merchant_id: merchant?.id,
      external_id: `PAID-${shortUrl}-${Date.now()}`,
      amount: paymentLink?.amount || 0,
      status: "pending",
      payer_name: payerName || null,
      payer_note: payerNote || null,
      validation_method: "manual",
    });

    if (txErr) {
      setSubmitError("Gagal mengirim laporan. Coba lagi.");
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
        fontSize: "1rem",
        color: "#64748b"
      }}>
        ⏳ Memuat halaman pembayaran...
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
        padding: 20,
      }}>
        <div style={{
          width: "100%",
          maxWidth: 420,
          background: "#fff",
          borderRadius: 20,
          padding: 40,
          border: "1px solid #e2e8f0",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>✅</div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#0d1526", marginBottom: 8 }}>
            Laporan Terkirim!
          </h2>
          <p style={{ fontSize: "0.88rem", color: "#64748b", lineHeight: 1.6 }}>
            Laporan pembayaran kamu udah dikirim ke penjual.
            Mereka akan konfirmasi manual setelah dana masuk.
          </p>
          <p style={{ fontSize: "0.82rem", color: "#94a3b8", marginTop: 16 }}>
            Simpan bukti transfer sebagai referensi.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
        padding: 20,
      }}>
        <div style={{
          width: "100%",
          maxWidth: 400,
          background: "#fff",
          borderRadius: 20,
          padding: 40,
          border: "1px solid #e2e8f0",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>❌</div>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0d1526", marginBottom: 8 }}>
            Link Tidak Valid
          </h2>
          <p style={{ fontSize: "0.88rem", color: "#64748b" }}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  const amount = paymentLink?.amount;
  const amountDisplay = amount
    ? `Rp${Number(amount).toLocaleString("id-ID")}`
    : "Bebas";

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
      padding: 20
    }}>
      <div style={{
        width: "100%",
        maxWidth: 420,
        background: "#fff",
        borderRadius: 20,
        padding: 40,
        border: "1px solid #e2e8f0",
        boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
        textAlign: "center"
      }}>
        <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#0d1526", marginBottom: 24 }}>
          Bayar<span style={{ color: "#3b7ddd" }}>.click</span>
        </div>

        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "4px 14px",
          borderRadius: 99,
          background: "#fef3c7",
          color: "#92400e",
          fontSize: "0.75rem",
          fontWeight: 600,
          marginBottom: 20
        }}>
          ⏳ Menunggu Pembayaran
        </div>

        <h1 style={{
          fontSize: "1.4rem",
          fontWeight: 700,
          color: "#0d1526",
          marginBottom: 4
        }}>
          {paymentLink?.title || `Pembayaran #${shortUrl}`}
        </h1>

        {paymentLink?.description && (
          <p style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: 8 }}>
            {paymentLink.description}
          </p>
        )}

        {/* QR Code */}
        <div style={{
          width: 220,
          height: 220,
          margin: "20px auto",
          borderRadius: 16,
          border: qrDataUrl ? "none" : "2px dashed #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}>
          {qrDataUrl ? (
            qrDataUrl.startsWith("data:image") ? (
              <img src={qrDataUrl} alt="QRIS" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            ) : (
              <img src={qrDataUrl} alt="QRIS" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: 8 }} />
            )
          ) : (
            <span style={{ fontSize: "3rem", color: "#94a3b8" }}>📱</span>
          )}
        </div>

        {!qrDataUrl && (
          <p style={{ fontSize: "0.78rem", color: "#94a3b8", marginBottom: 16 }}>
            Belum ada QRIS — hubungi penjual
          </p>
        )}

        <div style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: 4 }}>
          Total Pembayaran
        </div>
        <div style={{
          fontSize: "2.2rem",
          fontWeight: 800,
          color: "#0d1526",
          letterSpacing: "-0.02em"
        }}>
          {amountDisplay}
        </div>

        {merchant && (
          <div style={{
            marginTop: 16,
            fontSize: "0.82rem",
            color: "#64748b"
          }}>
            Kepada: <strong>{merchant.name}</strong>
          </div>
        )}

          {submitError && (
            <div style={{
              padding: "10px 14px",
              background: "#fef2f2",
              borderRadius: 10,
              color: "#dc2626",
              fontSize: "0.8rem",
              marginBottom: 16,
              marginTop: 16,
            }}>
              {submitError}
            </div>
          )}

          <div style={{
            marginTop: 24,
            padding: 16,
            background: "#f8fafc",
            borderRadius: 12,
            textAlign: "left",
            fontSize: "0.82rem",
            color: "#475569",
            lineHeight: 1.7
          }}>
            <div style={{ fontWeight: 600, marginBottom: 8, color: "#334155" }}>📌 Cara Bayar:</div>
            1. Buka aplikasi GoPay / BCA / DANA / OVO<br />
            2. Pilih Scan QR / Bayar QRIS<br />
            3. Scan kode QR di atas<br />
            4. Transfer sesuai nominal<br />
            5. Klik "Saya Sudah Bayar" di bawah
          </div>

          {/* Report payment form */}
          <div style={{
            marginTop: 20,
            padding: 16,
            background: "#f0fdf4",
            borderRadius: 12,
            border: "1px solid #bbf7d0",
          }}>
            <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#166534", marginBottom: 12 }}>
              ✅ Sudah bayar? Lapor di sini
            </div>
            <input
              value={payerName}
              onChange={(e) => setPayerName(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #bbf7d0",
                fontSize: "0.85rem",
                outline: "none",
                marginBottom: 8,
                boxSizing: "border-box",
              }}
              placeholder="Nama kamu (opsional)"
            />
            <textarea
              value={payerNote}
              onChange={(e) => setPayerNote(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #bbf7d0",
                fontSize: "0.85rem",
                outline: "none",
                minHeight: 60,
                resize: "vertical",
                marginBottom: 12,
                boxSizing: "border-box",
              }}
              placeholder="Catatan (opsional)"
            />
            <button
              onClick={handlePaid}
              disabled={submitting}
              style={{
                width: "100%",
                padding: "12px 28px",
                borderRadius: 99,
                border: "none",
                background: submitting ? "#86efac" : "#16a34a",
                color: "#fff",
                fontSize: "0.88rem",
                fontWeight: 600,
                cursor: submitting ? "not-allowed" : "pointer",
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? "Mengirim..." : "Saya Sudah Bayar ✅"}
            </button>
          </div>
        </div>
    </div>
  );
}
