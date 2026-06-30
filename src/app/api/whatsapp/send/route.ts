import { NextRequest, NextResponse } from "next/server";
import { sendText, toJid, autoReplyTemplate, blastMessage, paymentNotificationTemplate } from "@/lib/waha";

/**
 * POST /api/whatsapp/send
 * Body: { chatId, text, type?, data? }
 * 
 * type: "text" | "payment" | "auto-reply" | "blast"
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type = "text", chatId, text, data } = body;

    if (!chatId && type !== "blast") {
      return NextResponse.json(
        { error: "chatId is required" },
        { status: 400 }
      );
    }

    const jid = type !== "blast" ? toJid(chatId) : "";

    switch (type) {
      case "auto-reply": {
        const result = await sendText(jid, autoReplyTemplate(data?.name));
        return NextResponse.json({ success: true, result });
      }

      case "payment": {
        const msg = paymentNotificationTemplate({
          amount: data?.amount || 0,
          customerName: data?.customerName,
          status: data?.status || "paid",
          paymentLink: data?.paymentLink,
        });
        const result = await sendText(jid, msg);
        return NextResponse.json({ success: true, result });
      }

      case "blast": {
        const { chatIds, text: blastText } = body;
        if (!chatIds?.length || !blastText) {
          return NextResponse.json(
            { error: "chatIds[] and text required for blast" },
            { status: 400 }
          );
        }
        const result = await blastMessage(
          chatIds.map((id: string) => toJid(id)),
          blastText
        );
        return NextResponse.json({ success: true, result });
      }

      default: {
        if (!text) {
          return NextResponse.json(
            { error: "text is required for type 'text'" },
            { status: 400 }
          );
        }
        const result = await sendText(jid, text);
        return NextResponse.json({ success: true, result });
      }
    }
  } catch (err: any) {
    console.error("WAHA send error:", err);
    return NextResponse.json(
      { error: err.message || "Internal error" },
      { status: 500 }
    );
  }
}
