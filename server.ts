import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client server-side
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API Route: Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "TELPRO Campaign Studio 2026 API",
    geminiConfigured: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY",
    timestamp: new Date().toISOString()
  });
});

// API Route: AI Chat / Discussion
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, campaignContext, opportunityContext, history } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback response if API key is not yet set up
      return res.json({
        answer: `[SIMULATED AI PARTNER] Terima kasih atas pertanyaan Anda: "${message}". AI Studio Gemini API Key belum terkonfigurasi pada environment. Konfigurasikan GEMINI_API_KEY di menu Secrets.`,
        sources: ["TELPRO Brand Guideline 2026 v2.1", "Internal Market Insight #TR-2026-08"],
        confidence: "high",
        assumptions: ["Skenario pengujian lokal tanpa live Gemini key"],
        risks: ["Rekomendasi bersifat simulasi hingga API Key disetel"],
        missing_data: [],
        suggested_actions: [
          { type: "Apply to Brief", label: "Gunakan Angle Produk B2B Smart Logistics" },
          { type: "Apply Caption", label: "Terapkan Caption Hook 'Transformasi Gudang Modern'" },
          { type: "Create Storyboard", label: "Buat Draft Visual Storyboard 30s" }
        ]
      });
    }

    const systemInstruction = `
Anda adalah TELPRO AI Content Partner — Asisten Agentic AI Strategis & Kreatif untuk TELPRO Campaign Studio 2026 (PT Telkom Prasetia / TELPRO).
Tugas Anda adalah membantu tim Marcom & Marketing merencanakan campaign, menganalisis trend/event, membuat draft konten (brief, hook, caption, script, storyboard, hashtag, audio, CTA), memverifikasi klaim dengan evidence, serta mengkritisi ide yang berisiko (AI Challenge Mode).

Prinsip Utama:
1. No source, no fact. Selalu sebutkan sumber evidence dan tingkat kepercayaan (high/medium/low).
2. Tampilkan jika ada risiko brand safety, hak cipta audio, atau klaim berlebihan.
3. Berikan saran aksi nyata (Apply to Brief, Apply Caption, Create Script, dll).

Konteks Campaign Saat Ini:
${JSON.stringify(campaignContext || {})}

Konteks Opportunity Saat Ini:
${JSON.stringify(opportunityContext || {})}

Responlah dengan format JSON terstruktur persis seperti berikut:
{
  "answer": "Penjelasan detail dan komprehensif dalam Bahasa Indonesia yang profesional dan lugas",
  "sources": ["Daftar sumber fakta/evidence yang digunakan"],
  "confidence": "high" | "medium" | "low",
  "assumptions": ["Asumsi yang dibuat"],
  "risks": ["Risiko brand/reputasi/audio/klaim"],
  "missing_data": ["Informasi yang masih kurang jika ada"],
  "suggested_actions": [
    { "type": "Apply to Brief | Apply Caption | Use Hook | Create Script | Create Storyboard | Apply Hashtag Set", "label": "Label Tombol Aksi" }
  ]
}
`;

    const prompt = `Riwayat percakapan sebelumnya:
${JSON.stringify(history || [])}

Pesan Pengguna: ${message}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json"
      }
    });

    const responseText = response.text || "{}";
    try {
      const parsed = JSON.parse(responseText);
      return res.json(parsed);
    } catch {
      return res.json({
        answer: responseText,
        sources: ["TELPRO Internal Knowledge Base 2026"],
        confidence: "medium",
        assumptions: [],
        risks: [],
        missing_data: [],
        suggested_actions: [
          { type: "Apply Caption", label: "Terapkan Hasil AI ke Draft" }
        ]
      });
    }
  } catch (err: any) {
    console.error("Error in /api/ai/chat:", err);
    res.status(500).json({
      error: "Gagal memproses permintaan AI Content Partner",
      details: err.message
    });
  }
});

// API Route: Generate Angle & Content Package
app.post("/api/ai/generate-package", async (req, res) => {
  try {
    const { topic, channel, targetAudience, keyMessage } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        brief: `Content Brief: ${topic} untuk target ${targetAudience || 'B2B Enterprise'} di platform ${channel || 'LinkedIn'}.`,
        hook: "Apakah efisiensi operasional bisnis Anda terhambat oleh sistem logistik lama?",
        caption: `Transformasikan efisiensi perusahaan Anda dengan ekosistem solusi TELPRO 2026.\n\nDapatkan visibilitas real-time, penghematan biaya operasional hingga 35%, serta integrasi seamless dalam satu platform terpadu.\n\n#TELPRO2026 #SmartLogistics #B2BInnovation #TelkomGroup`,
        script: "Scene 1: Visual pemandangan gudang sibuk dengan grafik masalah delay. Voice Over: 'Tantangan logistik modern butuh jawaban cerdas.'\nScene 2: Tampilan Dashboard TELPRO Smart Logistics. Voice Over: 'TELPRO memberikan kontrol presisi real-time.'\nScene 3: CTA Logo TELPRO dan kontak sales.",
        cta: "Jadwalkan Konsultasi Gratis dengan Expert TELPRO",
        suggestedKeywords: ["Smart Logistics", "B2B Enterprise", "Telkom Solution", "Warehouse Automation"],
        suggestedHashtags: ["#TELPRO2026", "#SmartLogistics", "#B2BEnterprise", "#InovasiDigital"],
        recommendedAudio: "Corporate Tech Uplifting 120BPM (Verified Commercial License)",
        confidenceScore: 92
      });
    }

    const prompt = `Buatkan Paket Konten Marketing Lengkap untuk TELPRO Campaign Studio 2026.
Topik: ${topic}
Channel: ${channel}
Target Audience: ${targetAudience}
Key Message: ${keyMessage}

Hasilkan JSON dengan format:
{
  "brief": "Brief singkat 2-3 kalimat",
  "hook": "Hook kalimat pembuka yang menggugah (1 kalimat)",
  "caption": "Draft caption lengkap dengan paragraf dan CTA",
  "script": "Naskah video / storyboard singkat per scene",
  "cta": "Call to action yang tajam",
  "suggestedKeywords": ["keyword1", "keyword2", "keyword3"],
  "suggestedHashtags": ["#hashtag1", "#hashtag2", "#hashtag3"],
  "recommendedAudio": "Nama gaya audio/music bed",
  "confidenceScore": 95
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (err: any) {
    console.error("Error in /api/ai/generate-package:", err);
    res.status(500).json({ error: "Gagal membuat paket konten AI", details: err.message });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TELPRO Campaign Studio Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
