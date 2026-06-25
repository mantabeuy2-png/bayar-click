import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// ============================================================
// GET /api/ai-agent/config  — Ambil config AI Agent user
// ============================================================
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    
    if (authErr || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("ai_agent_configs")
      .select("*")
      .eq("user_id", user.id)
      .single();

    // Return defaults if no config yet
    if (!data) {
      return NextResponse.json({
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
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("GET /api/ai-agent/config error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ============================================================
// POST /api/ai-agent/config  — Simpan config AI Agent user
// ============================================================
export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    
    if (authErr || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      status,
      nomor_wa,
      pesan_sapaan,
      jam_buka,
      jam_tutup,
      hari_operasional,
      auto_reply_offline,
      soul_md,
      profile_md,
    } = body;

    // Validate if provided
    if (soul_md && soul_md.length > 50000) {
      return NextResponse.json({ error: "SOUL.md terlalu panjang (max 50.000 karakter)" }, { status: 400 });
    }
    if (profile_md && profile_md.length > 50000) {
      return NextResponse.json({ error: "PROFILE.md terlalu panjang (max 50.000 karakter)" }, { status: 400 });
    }

    const payload: Record<string, unknown> = {
      user_id: user.id,
      updated_at: new Date().toISOString(),
    };
    if (status !== undefined) payload.status = status;
    if (nomor_wa !== undefined) payload.nomor_wa = nomor_wa;
    if (pesan_sapaan !== undefined) payload.pesan_sapaan = pesan_sapaan;
    if (jam_buka !== undefined) payload.jam_buka = jam_buka;
    if (jam_tutup !== undefined) payload.jam_tutup = jam_tutup;
    if (hari_operasional !== undefined) payload.hari_operasional = hari_operasional;
    if (auto_reply_offline !== undefined) payload.auto_reply_offline = auto_reply_offline;
    if (soul_md !== undefined) payload.soul_md = soul_md;
    if (profile_md !== undefined) payload.profile_md = profile_md;

    const { data, error } = await supabase
      .from("ai_agent_configs")
      .upsert(payload, { onConflict: "user_id" })
      .select()
      .single();

    if (error) {
      console.error("POST /api/ai-agent/config error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("POST /api/ai-agent/config error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
