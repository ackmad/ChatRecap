import { GoogleGenerativeAI, SchemaType, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { Message, AnalysisResult } from "../types";
import { SYSTEM_INSTRUCTION_CHAT, SYSTEM_INSTRUCTION_ANALYSIS, GEMINI_MODEL_TEXT } from "../constants";

// --- LOAD BALANCING HELPER (ROTASI KEY) ---
const getApiKeys = (): string[] => {
  // Ambil keys dari VITE_GEMINI_API_KEYS (format: key1,key2,key3)
  const keysString = import.meta.env.VITE_GEMINI_API_KEYS || "";

  // Fallback ke VITE_GEMINI_API_KEY (jika user lupa ganti nama variabel)
  const singleKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (keysString) {
    // Pisahkan berdasarkan koma dan hapus spasi kosong
    return keysString.split(',').map((k: string) => k.trim()).filter((k: string) => k.length > 0);
  } else if (singleKey) {
    return [singleKey];
  }
  return [];
};

const API_KEYS = getApiKeys();

// --- FORMATTER HELPER ---
const formatChatForPrompt = (messages: Message[]): string => {
  const MAX_MESSAGES = 2000;

  if (messages.length <= MAX_MESSAGES) {
    return messages.map(m => `[${m.date.toISOString()}] ${m.sender}: ${m.content}`).join('\n');
  }

  const chunkSize = Math.floor(MAX_MESSAGES / 3);
  const start = messages.slice(0, chunkSize);
  const middleStartIdx = Math.floor(messages.length / 2) - Math.floor(chunkSize / 2);
  const middle = messages.slice(middleStartIdx, middleStartIdx + chunkSize);
  const end = messages.slice(-chunkSize);

  return [
    ...start.map(m => `[${m.date.toISOString()}] ${m.sender}: ${m.content}`),
    "\n... [BAGIAN TENGAH DILEWATI UTK EFISIENSI] ...\n",
    ...middle.map(m => `[${m.date.toISOString()}] ${m.sender}: ${m.content}`),
    "\n... [BAGIAN AKHIR] ...\n",
    ...end.map(m => `[${m.date.toISOString()}] ${m.sender}: ${m.content}`)
  ].join('\n');
};

const cleanJsonOutput = (text: string): string => {
  console.log("RAW AI RESPONSE (Sebelum Clean):", text);

  let cleaned = text.replace(/```json/gi, '').replace(/```/g, '');
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  } else {
    console.warn("Warning: Tidak ditemukan format JSON {} yang valid.");
    return text;
  }

  return cleaned.trim();
};

// --- FUNGSI UTAMA ANALISIS (DENGAN ROTASI KEY) ---
export const analyzeChatWithGemini = async (
  messages: Message[],
  onStatusUpdate: (status: string) => void
): Promise<AnalysisResult> => {

  if (API_KEYS.length === 0) {
    throw new Error("API Key tidak ditemukan. Pastikan VITE_GEMINI_API_KEYS ada di file .env");
  }

  onStatusUpdate("📄 Mempersiapkan data chat...");
  const chatContext = formatChatForPrompt(messages);

  const prompt = `
Tolong analisis chat berikut dan kembalikan output HANYA DALAM FORMAT JSON. 
Jangan ada teks pengantar.

TRANSKRIP CHAT:
${chatContext}
`;

  let lastError: any = null;

  // --- LOOPING UNTUK MENCOBA SETIAP KEY ---
  for (let i = 0; i < API_KEYS.length; i++) {
    const currentKey = API_KEYS[i];
    const keyIndex = i + 1; // Untuk log (Server 1, Server 2, dst)

    try {
      onStatusUpdate(`🔌 Menggunakan API ${keyIndex} (Mencoba menghubungkan...)`);

      const genAI = new GoogleGenerativeAI(currentKey);

      const model = genAI.getGenerativeModel({
        model: GEMINI_MODEL_TEXT,
        systemInstruction: SYSTEM_INSTRUCTION_ANALYSIS,
        generationConfig: {
          responseMimeType: "application/json",
        },
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH }
        ]
      });

      onStatusUpdate(`🧠 API ${keyIndex} sedang membaca & menganalisis chat...`);

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      onStatusUpdate("📥 Menerima respon dari AI...");

      if (!text) {
        throw new Error("Respon AI kosong.");
      }

      onStatusUpdate("🧹 Membersihkan data JSON...");
      const cleanedText = cleanJsonOutput(text);

      onStatusUpdate("🔍 Membaca structure data...");
      const parsed = JSON.parse(cleanedText) as AnalysisResult;

      onStatusUpdate("✅ Analisis Selesai!");

      // Jika BERHASIL, langsung return (hentikan loop)
      return {
        ...parsed,
        phases: parsed.phases || [],
        dominantTopics: parsed.dominantTopics || [],
        keyMoments: parsed.keyMoments || [],
        memorableLines: parsed.memorableLines || [],
        toneAnalysis: parsed.toneAnalysis || [],
        conflictTriggers: parsed.conflictTriggers || [],
        monthlyMoods: parsed.monthlyMoods || [],
        hourlyMoods: parsed.hourlyMoods || [],
        emotions: parsed.emotions || [],
      };

    } catch (error: any) {
      console.warn(`⚠️ API ${keyIndex} Gagal:`, error.message);
      lastError = error;

      // Cek jenis error: Apakah karena Limit (429) atau Server Penuh (503)?
      if (error.message?.includes('429') || error.message?.includes('503') || error.message?.includes('quota')) {
        onStatusUpdate(`⚠️ API ${keyIndex} Limit/Sibuk. Mengganti ke API selanjutnya...`);
        // Lanjut ke loop berikutnya (key selanjutnya)
        continue;
      } else if (error.message?.includes('JSON')) {
        // Jika error JSON Parse, berarti AI jawab ngawur, tidak perlu ganti key, tapi lempar error ke user
        onStatusUpdate("❌ Format jawaban AI rusak.");
        throw new Error(`Format jawaban AI rusak. Cek Console (F12).`);
      } else {
        // Jika error lain (misal 400 Bad Request), lempar error (jangan loop)
        onStatusUpdate(`❌ Terjadi error pada API ${keyIndex}: ${error.message}`);
        break;
      }
    }
  }

  // Jika loop selesai tapi tidak ada yang berhasil
  console.error("Semua API Key gagal:", lastError);

  onStatusUpdate("❌ TOKEN sudah habis.");

  // Custom Error Object sesuai permintaan user
  throw {
    userMsg: "TOKEN sudah habis tolong beritahu developer dan mengganti API nya.",
    technicalMsg: lastError?.message || "All keys exhausted."
  };
};

// --- FUNGSI CHAT SESSION (Ambil Key Pertama/Random) ---
export const createChatSession = (messages: Message[]) => {
  // Ambil satu key saja untuk chat session (bisa ambil index 0)
  const key = API_KEYS[0];

  if (!key) {
    throw new Error("API Key tidak ditemukan.");
  }

  const genAI = new GoogleGenerativeAI(key);
  const chatContext = formatChatForPrompt(messages);

  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL_TEXT,
    systemInstruction: SYSTEM_INSTRUCTION_CHAT
  });

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: `Ini adalah data chat history kami:\n${chatContext}` }],
      },
      {
        role: "model",
        parts: [{ text: "Oke, saya siap ngobrol tentang chat ini." }],
      }
    ],
  });

  return chat;
};