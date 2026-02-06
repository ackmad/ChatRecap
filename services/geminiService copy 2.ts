import { GoogleGenerativeAI, SchemaType, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { Message, AnalysisResult } from "../types";
import { SYSTEM_INSTRUCTION_CHAT, SYSTEM_INSTRUCTION_ANALYSIS, GEMINI_MODEL_TEXT } from "../constants";

// --- FORMATTER HELPER ---
const formatChatForPrompt = (messages: Message[]): string => {
  const MAX_MESSAGES = 2000; // Turunkan sedikit biar aman
  
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
    console.log("RAW AI RESPONSE (Sebelum Clean):", text); // Debugging

    // 1. Hapus Markdown ```json dan ```
    let cleaned = text.replace(/```json/gi, '').replace(/```/g, '');
    
    // 2. Cari kurung kurawal pertama { dan terakhir }
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    } else {
        // Jika tidak ada kurung kurawal, return text aslinya biar ketahuan error di parsing nanti
        console.warn("Warning: Tidak ditemukan format JSON {} yang valid.");
        return text; 
    }

    return cleaned.trim();
};

// --- FUNGSI UTAMA ANALISIS ---
export const analyzeChatWithGemini = async (
    messages: Message[], 
    onStatusUpdate: (status: string) => void
): Promise<AnalysisResult> => {
  
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  if (!API_KEY) {
    throw new Error("API Key tidak ditemukan. Pastikan VITE_GEMINI_API_KEY ada di file .env");
  }

  onStatusUpdate("🔄 Menginisialisasi AI...");
  const genAI = new GoogleGenerativeAI(API_KEY);

  onStatusUpdate("📄 Mempersiapkan data chat...");
  const chatContext = formatChatForPrompt(messages);

  const prompt = `
Tolong analisis chat berikut dan kembalikan output HANYA DALAM FORMAT JSON. 
Jangan ada teks pengantar.

TRANSKRIP CHAT:
${chatContext}
`;

  try {
    onStatusUpdate(`📡 Mengirim data ke AI (${GEMINI_MODEL_TEXT})...`);
    
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL_TEXT, // Pastikan ini 'gemini-1.5-flash' di constants.ts
      systemInstruction: SYSTEM_INSTRUCTION_ANALYSIS, 
      generationConfig: {
          responseMimeType: "application/json", // Paksa JSON mode
      },
      safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH }
      ]
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    onStatusUpdate("📥 Menerima respon...");

    if (!text) {
        throw new Error("Respon AI kosong.");
    }

    onStatusUpdate("🧹 Membersihkan data JSON...");
    const cleanedText = cleanJsonOutput(text);

    onStatusUpdate("🔍 Membaca data...");
    try {
        const parsed = JSON.parse(cleanedText) as AnalysisResult;
        
        onStatusUpdate("✅ Analisis Selesai!");
        // Pastikan array tidak undefined agar tidak crash di frontend
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
    } catch (e) {
        console.error("JSON PARSE ERROR. Text yang gagal:", cleanedText);
        // Error khusus agar user tau isinya apa
        throw new Error(`Format jawaban AI rusak. Cek Console (F12) untuk melihat "RAW AI RESPONSE".`);
    }

  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    
    let userMsg = "Terjadi kesalahan sistem.";
    let technicalMsg = error.message;

    if (error.message?.includes('400')) userMsg = "Chat terlalu panjang atau format tidak didukung.";
    else if (error.message?.includes('429')) userMsg = "Server sibuk (Rate Limit). Tunggu sebentar.";
    else if (error.message?.includes('503')) userMsg = "Layanan AI sedang penuh.";
    else if (error.message?.includes('Format jawaban AI rusak')) userMsg = "AI memberikan jawaban ngawur (Bukan JSON).";

    onStatusUpdate(`❌ Error: ${technicalMsg}`);
    throw { userMsg, technicalMsg };
  }
};

// --- FUNGSI CHAT SESSION ---
export const createChatSession = (messages: Message[]) => {
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    if (!API_KEY) {
        throw new Error("API Key tidak ditemukan.");
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
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