import { NextRequest, NextResponse } from "next/server";
import { sendText, toJid, autoReplyTemplate } from "@/lib/waha";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

/**
 * POST /api/whatsapp/webhook
 * WAHA webhook endpoint — receives incoming WhatsApp messages
 * 
 * Docs: https://waha.devlike.pro/docs/how-to/webhooks/
 */
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    // WAHA webhook format: { event, session, payload: { from, to, body, ... } }
    const event = payload.event;
    const msg = payload.payload;

    if (!msg || !msg.from || !msg.body) {
      return NextResponse.json({ received: true });
    }

    const from = msg.from;  // e.g. 6281234567890@c.us
    const text = msg.body?.trim() || "";
    const chatId = msg.chatId || from;
    const pushName = msg._data?.notifyName || msg.pushName || "";

    // ─── Store incoming message to DB ─────────────────────────
    try {
      await supabase.from("whatsapp_messages").insert({
        from_jid: from,
        chat_id: chatId,
        body: text,
        push_name: pushName,
        direction: "incoming",
        raw_payload: payload,
      });
    } catch (dbErr) {
      console.warn("Failed to store incoming WA msg:", dbErr);
    }

    // ─── Auto-reply logic ──────────────────────────────────────
    const lowerText = text.toLowerCase();

    // Check if auto-reply is enabled (from DB config)
    const { data: config } = await supabase
      .from("whatsapp_config")
      .select("*")
      .eq("key", "auto_reply_enabled")
      .single()
      .catch(() => ({ data: null }));

    if (config?.value === "true" || config?.value === true) {
      // Don't auto-reply to groups, only direct messages
      if (chatId.endsWith("@c.us")) {
        const replyText = autoReplyTemplate(pushName);
        await sendText(toJid(from), replyText);
      }
    }

    // ─── Keyword-based auto responses ──────────────────────────
    // Payment confirmation keyword
    if (lowerText.includes("sudah bayar") || lowerText.includes("sudah transfer") || lowerText.includes("paid")) {
      await sendText(toJid(from), 
        `✅ Terima kasih atas konfirmasi pembayaran Anda, Kak ${pushName || ""}!\n\nTim kami akan memverifikasi pembayaran Anda segera.\n\nJika ada pertanyaan, silakan balas chat ini.`
      );
    }

    // Help / contact keyword
    if (lowerText === "help" || lowerText === "bantuan" || lowerText === "cs") {
      await sendText(toJid(from),
        `👋 *Pusat Bantuan bayar.click*\n\nBerikut yang bisa kami bantu:\n\n1. Cara membuat payment link\n2. Integrasi API\n3. Cek status pembayaran\n4. Hubungi admin\n\nSilakan ketik nomor (1-4) atau jelaskan kebutuhan Anda.`
      );
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("WAHA webhook error:", err);
    // Always return 200 so WAHA doesn't retry
    return NextResponse.json(
      { error: err.message, received: true },
      { status: 200 }
    );
  }
}
