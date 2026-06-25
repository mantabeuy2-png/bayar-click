"use client";

import { useState, useEffect, useCallback } from "react";

interface AIAgentConfig {
  status: string;
  nomor_wa: string;
  pesan_sapaan: string;
  jam_buka: string;
  jam_tutup: string;
  hari_operasional: string[];
  auto_reply_offline: string;
  soul_md: string;
  profile_md: string;
}

const HARI = ["sen", "sel", "rab", "kam", "jum", "sab", "min"];
const HARI_LABEL: Record<string, string> = {
  sen: "Sen", sel: "Sel", rab: "Rab", kam: "Kam",
  jum: "Jum", sab: "Sab", min: "Min",
};

export default function AIAgentTab() {
  const [config, setConfig] = useState<AIAgentConfig>({
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // Load config
  const loadConfig = useCallback(async () => {
    try {
      const res = await fetch("/api/ai-agent");
      if (res.ok) {
        const data = await res.json();
        setConfig((prev) => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.error("Gagal load AI Agent config:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  // Save config
  const handleSave = async () => {
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await fetch("/api/ai-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        setSaveMsg("✅ Konfigurasi berhasil disimpan!");
      } else {
        const err = await res.json();
        setSaveMsg(`❌ Gagal: ${err.error || "Unknown error"}`);
      }
    } catch {
      setSaveMsg("❌ Gagal menyimpan. Coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  const toggleHari = (h: string) => {
    setConfig((prev) => ({
      ...prev,
      hari_operasional: prev.hari_operasional.includes(h)
        ? prev.hari_operasional.filter((x) => x !== h)
        : [...prev.hari_operasional, h],
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-sm border border-base-300">
      <div className="card-body">
        <h2 className="card-title text-lg mb-1">⚙️ AI Agent — Asisten WhatsApp</h2>
        <p className="text-sm text-gray-500 -mt-2 mb-4">
          Konfigurasi AI Agent untuk auto-reply WhatsApp pelanggan.
        </p>

        {/* STATUS */}
        <div className="form-control w-full mb-3">
          <label className="label"><span className="label-text font-semibold">Status</span></label>
          <select
            className="select select-bordered w-full"
            value={config.status}
            onChange={(e) => setConfig({ ...config, status: e.target.value })}
          >
            <option value="off">Off</option>
            <option value="on">On</option>
          </select>
        </div>

        {/* NOMOR WA */}
        <div className="form-control w-full mb-3">
          <label className="label"><span className="label-text font-semibold">Nomor WA</span></label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="628xxxxxxxxxx"
            value={config.nomor_wa}
            onChange={(e) => setConfig({ ...config, nomor_wa: e.target.value })}
          />
        </div>

        {/* PESAN SAPAAN */}
        <div className="form-control w-full mb-3">
          <label className="label"><span className="label-text font-semibold">Pesan Sapaan</span></label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={config.pesan_sapaan}
            onChange={(e) => setConfig({ ...config, pesan_sapaan: e.target.value })}
          />
        </div>

        {/* JAM OPERASIONAL */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="form-control">
            <label className="label"><span className="label-text font-semibold">Jam Buka</span></label>
            <input
              type="time"
              className="input input-bordered w-full"
              value={config.jam_buka}
              onChange={(e) => setConfig({ ...config, jam_buka: e.target.value })}
            />
          </div>
          <div className="form-control">
            <label className="label"><span className="label-text font-semibold">Jam Tutup</span></label>
            <input
              type="time"
              className="input input-bordered w-full"
              value={config.jam_tutup}
              onChange={(e) => setConfig({ ...config, jam_tutup: e.target.value })}
            />
          </div>
        </div>

        {/* HARI OPERASIONAL */}
        <div className="form-control w-full mb-3">
          <label className="label"><span className="label-text font-semibold">Hari Operasional</span></label>
          <div className="flex flex-wrap gap-2">
            {HARI.map((h) => (
              <label key={h} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary checkbox-sm"
                  checked={config.hari_operasional.includes(h)}
                  onChange={() => toggleHari(h)}
                />
                <span className="text-sm">{HARI_LABEL[h]}</span>
              </label>
            ))}
          </div>
        </div>

        {/* AUTO-REPLY OFFLINE */}
        <div className="form-control w-full mb-3">
          <label className="label"><span className="label-text font-semibold">Auto-reply Offline</span></label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={config.auto_reply_offline}
            onChange={(e) => setConfig({ ...config, auto_reply_offline: e.target.value })}
          />
        </div>

        {/* ===== SOUL.md & PROFILE.md INFO PANEL ===== */}
        <div className="alert bg-indigo-50 border border-indigo-200 rounded-xl p-5 my-4">
          <div className="flex items-start gap-3 w-full">
            <span className="text-2xl">📖</span>
            <div className="w-full">
              <h3 className="font-semibold text-indigo-700 text-base mb-3">
                Panduan Mengisi SOUL.md &amp; PROFILE.md
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-indigo-600 text-sm mb-1">🧠 SOUL.md — &quot;Jiwa&quot; AI Agent</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    File Markdown yang mendefinisikan <strong>kepribadian, identitas, nilai-nilai, gaya komunikasi, dan batasan</strong> AI Agent. 
                    Ini adalah &quot;jiwa&quot; dari AI — siapa dia, bagaimana dia bicara, dan apa yang dia yakini.
                  </p>
                  <p className="text-xs text-gray-400 mt-2">📌 Isi: identitas AI, tone bicara, aturan, topik, batasan etika.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-indigo-600 text-sm mb-1">👤 PROFILE.md — &quot;Memori&quot; Bisnis</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    File Markdown yang berisi <strong>informasi tentang bisnis, pemilik, target customer, produk/layanan, preferensi, 
                    dan konteks</strong> yang perlu diketahui AI saat berinteraksi.
                  </p>
                  <p className="text-xs text-gray-400 mt-2">📌 Isi: nama bisnis, produk, target pasar, jam operasional, FAQ.</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-indigo-200">
                <p className="text-sm text-indigo-700">
                  <strong>💡 Cara pakai:</strong> Isi kedua field dengan format Markdown (.md). 
                  Semakin detail, AI Agent semakin natural. Klik <strong>Simpan</strong> setelah selesai.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SOUL.md */}
        <div className="form-control w-full mb-4">
          <label className="label" htmlFor="soul_md">
            <span className="label-text font-semibold text-base">🧠 SOUL.md</span>
            <span className="label-text-alt text-gray-400">Kepribadian AI Agent</span>
          </label>
          <textarea
            id="soul_md"
            className="textarea textarea-bordered h-52 font-mono text-sm leading-relaxed"
            placeholder={`# SOUL.md — Kepribadian AI Agent\n\n## Identitas\nAnda adalah [Nama AI], [deskripsi peran].\n\nMisi Anda adalah [tujuan utama AI].\n\n## Kepribadian Inti\n- [Sifat 1]\n- [Sifat 2]\n\n## Gaya Berkomunikasi\n- [Aturan komunikasi 1]\n\n## Batasan\n- [Hal yang tidak boleh dilakukan]`}
            value={config.soul_md}
            onChange={(e) => setConfig({ ...config, soul_md: e.target.value })}
          />
          <label className="label">
            <span className="label-text-alt text-gray-400">Definisikan identitas, nilai, gaya komunikasi, dan panduan perilaku AI.</span>
            <span className="label-text-alt text-gray-400">Format: Markdown</span>
          </label>
        </div>

        {/* PROFILE.md */}
        <div className="form-control w-full mb-6">
          <label className="label" htmlFor="profile_md">
            <span className="label-text font-semibold text-base">👤 PROFILE.md</span>
            <span className="label-text-alt text-gray-400">Profil Bisnis / Pengguna</span>
          </label>
          <textarea
            id="profile_md"
            className="textarea textarea-bordered h-44 font-mono text-sm leading-relaxed"
            placeholder={`# PROFILE.md — Profil Bisnis\n\n## Identity\n- **Nama:** [Nama Bisnis/Pemilik]\n- **Bisnis:** [Jenis bisnis]\n\n## Konteks\n- **Target customer:** [Siapa target]\n- **Produk/layanan:** [Apa yang dijual]\n- **Preferensi:** [Yang disukai/tidak]`}
            value={config.profile_md}
            onChange={(e) => setConfig({ ...config, profile_md: e.target.value })}
          />
          <label className="label">
            <span className="label-text-alt text-gray-400">Informasi user, bisnis, preferensi &amp; konteks yang perlu diketahui AI.</span>
            <span className="label-text-alt text-gray-400">Format: Markdown</span>
          </label>
        </div>

        {/* SAVE */}
        {saveMsg && (
          <div className={`alert ${saveMsg.startsWith("✅") ? "alert-success" : "alert-error"} mb-3`}>
            <span>{saveMsg}</span>
          </div>
        )}
        <button
          className="btn btn-primary w-full"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? <span className="loading loading-spinner loading-sm" /> : null}
          {saving ? " Menyimpan..." : "💾 Simpan"}
        </button>
      </div>
    </div>
  );
}
