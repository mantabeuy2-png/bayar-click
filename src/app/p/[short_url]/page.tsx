"use client";

import { useParams } from "next/navigation";

export default function PaymentPage() {
  const params = useParams();
  const shortUrl = params?.short_url as string;

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
          marginBottom: 8
        }}>
          Pembayaran #{shortUrl || "—"}
        </h1>

        <div style={{
          width: 200,
          height: 200,
          margin: "24px auto",
          background: "#f8fafc",
          borderRadius: 16,
          border: "2px dashed #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "3rem",
          color: "#94a3b8"
        }}>
          📱
        </div>

        <div style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: 4 }}>
          Total Pembayaran
        </div>
        <div style={{
          fontSize: "2.2rem",
          fontWeight: 800,
          color: "#0d1526",
          letterSpacing: "-0.02em"
        }}>
          Rp50.000
        </div>

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
          4. Konfirmasi pembayaran
        </div>

        <button
          style={{
            marginTop: 20,
            padding: "12px 28px",
            borderRadius: 99,
            border: "1px solid #e2e8f0",
            background: "#fff",
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "#475569",
            cursor: "pointer",
            width: "100%"
          }}
        >
          🔄 Cek Status Pembayaran
        </button>

        <div style={{ marginTop: 24, fontSize: "0.72rem", color: "#94a3b8" }}>
          Powered by <strong>Bayar.click</strong>
        </div>
      </div>
    </div>
  );
}
