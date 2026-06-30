/**
 * WAHA WhatsApp HTTP API Client
 * Docs: https://waha.devlike.pro/docs/how-to/send-messages/
 * WAHA v2026.6.1+ — all features FREE (Plus → Core)
 */

const WAHA_URL = process.env.WAHA_URL || "http://localhost:3000";
const WAHA_API_KEY = process.env.WAHA_API_KEY || "";
const WAHA_SESSION = process.env.WAHA_SESSION || "default";

interface WahaResponse {
  id?: string;
  status?: string;
  error?: string;
  message?: string;
}

type SendTextResponse = {
  id: string;
  from: string;
  to: string;
  body: string;
  timestamp: number;
  [key: string]: any;
};

async function wahaFetch<T = WahaResponse>(
  path: string,
  body?: Record<string, any>
): Promise<T> {
  const res = await fetch(`${WAHA_URL}/api${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": WAHA_API_KEY,
      Accept: "application/json",
    },
    body: body ? JSON.stringify({ session: WAHA_SESSION, ...body }) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      `WAHA error ${res.status}: ${(err as any).message || res.statusText}`
    );
  }

  return res.json();
}

// ─── Send Text Message ─────────────────────────────────────────────

export async function sendText(
  chatId: string,
  text: string,
  opts?: {
    reply_to?: string;
    mentions?: string[];
    linkPreview?: boolean;
    linkPreviewHighQuality?: boolean;
  }
): Promise<SendTextResponse> {
  return wahaFetch<SendTextResponse>("/sendText", {
    chatId,
    text,
    ...(opts || {}),
  });
}

// ─── Send Image ────────────────────────────────────────────────────

export async function sendImage(
  chatId: string,
  imageUrl: string,
  caption?: string,
  filename?: string
): Promise<SendTextResponse> {
  return wahaFetch("/sendImage", {
    chatId,
    file: {
      mimetype: "image/jpeg",
      url: imageUrl,
      filename: filename || "image.jpg",
    },
    caption: caption || "",
  });
}

// ─── Send to Multiple Chats (Blast) ─────────────────────────────────

export async function blastMessage(
  chatIds: string[],
  text: string
): Promise<{ success: string[]; failed: { chatId: string; error: string }[] }> {
  const results = await Promise.allSettled(
    chatIds.map((chatId) => sendText(chatId, text))
  );

  const success: string[] = [];
  const failed: { chatId: string; error: string }[] = [];

  results.forEach((r, i) => {
    if (r.status === "fulfilled") {
      success.push(chatIds[i]);
    } else {
      failed.push({ chatId: chatIds[i], error: r.reason?.message || "Unknown" });
    }
  });

  return { success, failed };
}

// ─── Check Session Status ──────────────────────────────────────────

export async function getSessions(): Promise<any[]> {
  const res = await fetch(`${WAHA_URL}/api/sessions`, {
    headers: {
      "X-Api-Key": WAHA_API_KEY,
      Accept: "application/json",
    },
  });
  if (!res.ok) throw new Error(`WAHA sessions error: ${res.status}`);
  return res.json();
}

// ─── Payment Notification Template ─────────────────────────────────

export function paymentNotificationTemplate(data: {
  amount: number;
  customerName?: string;
  status: "paid" | "pending" | "failed";
  paymentLink?: string;
}): string {
  const { amount, customerName, status, paymentLink } = data;
  const emoji = status === "paid" ? "✅" : status === "failed" ? "❌" : "⏳";

  return [
    `${emoji} *Bayar.click — Notifikasi Pembayaran*`,
    ``,
    `💰 Jumlah: *Rp ${amount.toLocaleString("id-ID")}*`,
    `📋 Status: ${status.toUpperCase()}`,
    customerName ? `👤 Pelanggan: ${customerName}` : "",
    paymentLink ? `🔗 Link: ${paymentLink}` : "",
    ``,
    `_Dikirim otomatis oleh bayar.click_`,
  ]
    .filter(Boolean)
    .join("\n");
}

// ─── Auto-Reply Template ───────────────────────────────────────────

export function autoReplyTemplate(name?: string): string {
  const greeting = name ? `Halo Kak *${name}*!` : "Halo!";
  return [
    `${greeting} 🙏`,
    ``,
    `Terima kasih sudah menghubungi *bayar.click*.`,
    ``,
    `Kami siap membantu Anda dengan:`,
    `• Pembayaran via QRIS`,
    `• Payment link custom`,
    `• Dashboard transaksi`,
    `• Integrasi API`,
    ``,
    `Silakan ketik pertanyaan atau kebutuhan Anda, kami akan merespon secepatnya.`,
    ``,
    `_— Tim bayar.click_`,
  ].join("\n");
}

// ─── Helpers ───────────────────────────────────────────────────────

export function toJid(phoneNumber: string): string {
  // Strip +, spaces, dashes
  const cleaned = phoneNumber.replace(/[+\s\-\(\)]/g, "");
  return cleaned.includes("@") ? cleaned : `${cleaned}@c.us`;
}
