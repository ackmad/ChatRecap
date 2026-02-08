import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { Message, AnalysisResult } from "../types";
import {
  SYSTEM_INSTRUCTION_CHAT,
  SYSTEM_INSTRUCTION_ANALYSIS,
  GEMINI_MODEL_TEXT
} from "../constants";

// =====================================================
// API KEY ROTATION & USAGE TRACKING
// =====================================================
const getApiKeys = (): string[] => {
  const keysString = import.meta.env.VITE_GEMINI_API_KEYS || "";
  const singleKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (keysString) {
    return keysString
      .split(",")
      .map((k: string) => k.trim())
      .filter((k: string) => k.length > 0);
  } else if (singleKey) {
    return [singleKey];
  }
  return [];
};

const API_KEYS = getApiKeys();

interface TokenUsage {
  promptTokens: number;
  responseTokens: number;
  totalTokens: number;
}

// =====================================================
// HELPERS
// =====================================================
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Format chat with Smart Sampling (Start - Mid - End)
const formatChatForPrompt = (messages: Message[]): string => {
  const MAX_MESSAGES = 12000; // Increased limit for detailed analysis in one go

  if (messages.length <= MAX_MESSAGES) {
    return messages.map(m => `[${m.date.toISOString()}] ${m.sender}: ${m.content}`).join('\n');
  }

  // Smart Sampling Strategy: Start (Context), Middle (Peak), End (Recent)
  const chunkSize = Math.floor(MAX_MESSAGES / 3);

  const start = messages.slice(0, chunkSize);
  const midStart = Math.floor(messages.length / 2) - Math.floor(chunkSize / 2);
  const middle = messages.slice(midStart, midStart + chunkSize);
  const end = messages.slice(-chunkSize);

  return [
    ...start.map(m => `[${m.date.toISOString()}] ${m.sender}: ${m.content}`),
    `\n... [SAMPEL BAGIAN TENGAH DILEWATI (Total ${messages.length} pesan)] ...\n`,
    ...middle.map(m => `[${m.date.toISOString()}] ${m.sender}: ${m.content}`),
    `\n... [SAMPEL BAGIAN AKHIR] ...\n`,
    ...end.map(m => `[${m.date.toISOString()}] ${m.sender}: ${m.content}`)
  ].join('\n');
};

const formatChatLines = (messages: Message[]): string => {
  return messages.map(m => `[${m.date.toISOString()}] ${m.sender}: ${m.content}`).join('\n');
};

const cleanJsonOutput = (text: string): string => {
  let cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  return cleaned;
};

const buildModel = (genAI: GoogleGenerativeAI, systemInstruction: string) => {
  return genAI.getGenerativeModel({
    model: GEMINI_MODEL_TEXT,
    systemInstruction: systemInstruction,
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192,
    },
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH }
    ],
  });
};

const callGeminiWithRetry = async (model: any, prompt: string, retries: number = 3): Promise<{ text: string, usage: TokenUsage }> => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const usageMetadata = response.usageMetadata || {};
      const usage: TokenUsage = {
        promptTokens: usageMetadata.promptTokenCount || 0,
        responseTokens: usageMetadata.candidatesTokenCount || 0,
        totalTokens: usageMetadata.totalTokenCount || 0
      };

      return { text, usage };
    } catch (error: any) {
      const errMsg = error?.message || "";
      if (errMsg.includes("429") || errMsg.includes("quota") || errMsg.includes("RESOURCE_EXHAUSTED")) {
        await sleep(2000 * (attempt + 1));
      }
      attempt++;
      if (attempt >= retries) throw error;
      await sleep(1000);
    }
  }
  throw new Error("Gemini retry failed");
};

// =====================================================
// MAIN ANALYSIS FUNCTION (SINGLE REQUEST SMART SAMPLING)
// =====================================================
export const analyzeChatWithGemini = async (
  messages: Message[],
  onStatusUpdate: (status: string) => void
): Promise<AnalysisResult> => {

  if (API_KEYS.length === 0) {
    throw new Error("API Key tidak ditemukan. Pastikan VITE_GEMINI_API_KEYS ada di file .env");
  }

  onStatusUpdate("📄 Menyiapkan sampel data chat (agar hemat token & cepat)...");

  // Use Smart Sampling Strategy (Start - Mid - End)
  const chatContext = formatChatForPrompt(messages);

  const prompt = `
Tolong analisis chat berikut dan kembalikan output HANYA DALAM FORMAT JSON. 
Jangan ada teks pengantar. Langsung data.

TRANSKRIP CHAT (SAMPEL START - MID - END):
${chatContext}
`.trim();

  let lastError: any = null;
  let usageStats: TokenUsage = { promptTokens: 0, responseTokens: 0, totalTokens: 0 };

  // =====================================================
  // LOOP API KEY (SINGLE STEP ONLY)
  // =====================================================
  for (let keyIndex = 0; keyIndex < API_KEYS.length; keyIndex++) {
    const currentKey = API_KEYS[keyIndex];

    try {
      onStatusUpdate(`🔌 Menggunakan API Key #${keyIndex + 1}...`);

      const genAI = new GoogleGenerativeAI(currentKey);
      const model = buildModel(genAI, SYSTEM_INSTRUCTION_ANALYSIS);

      onStatusUpdate(`🧠 Menganalisa pola chat (Single Smart Request)...`);

      // Single Request with Retry
      const result = await callGeminiWithRetry(model, prompt, 3);

      usageStats = result.usage;
      const successKeyIndex = keyIndex + 1;

      console.log(`📊 [Analysis] Success using API Key #${successKeyIndex}`);
      console.log(`   Tokens: Prompt=${usageStats.promptTokens}, Response=${usageStats.responseTokens}, Total=${usageStats.totalTokens}`);

      onStatusUpdate("📥 Menerima respon AI...");
      const cleanedJson = cleanJsonOutput(result.text);

      onStatusUpdate("🔍 Validasi struktur data...");
      const parsed = JSON.parse(cleanedJson) as AnalysisResult;

      onStatusUpdate(`✅ Analisis Selesai! (${usageStats.totalTokens} tokens)`);

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
      console.warn(`⚠️ API Key ${keyIndex + 1} gagal:`, error.message);
      lastError = error;

      const errMsg = error?.message || "";

      const isQuotaError =
        errMsg.includes("429") ||
        errMsg.includes("quota") ||
        errMsg.includes("RESOURCE_EXHAUSTED");

      const isKeyError =
        errMsg.includes("403") ||
        errMsg.includes("API key") ||
        errMsg.includes("key not valid") ||
        errMsg.includes("leaked");

      if (isQuotaError || isKeyError) {
        onStatusUpdate(`⚠️ API ${keyIndex + 1} limit/invalid. Pindah ke key selanjutnya...`);
        await sleep(1500);
        continue;
      }

      onStatusUpdate(`❌ Error pada API ${keyIndex + 1}: ${errMsg}`);
      break;
    }
  }

  console.error("Semua API Key gagal:", lastError);

  onStatusUpdate("❌ TOKEN / QUOTA habis.");

  throw {
    userMsg: "TOKEN/QUOTA sudah habis. Tolong beritahu developer untuk upgrade billing / ganti API key.",
    technicalMsg: lastError?.message || "All keys exhausted."
  };
};

// =====================================================
// CHAT SESSION (RANDOM KEY)
// =====================================================
export const createChatSession = (messages: Message[]) => {
  if (API_KEYS.length === 0) {
    throw new Error("API Key tidak ditemukan.");
  }

  const randomIndex = Math.floor(Math.random() * API_KEYS.length);
  const key = API_KEYS[randomIndex];

  const genAI = new GoogleGenerativeAI(key);

  // SMART SAMPLING (Start-Mid-End)
  const chatContext = formatChatForPrompt(messages);

  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL_TEXT,
    systemInstruction: SYSTEM_INSTRUCTION_CHAT,
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192,
    },
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH }
    ]
  });

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: `Ini adalah data chat history kami (Start-Mid-End Sample):\n${chatContext}` }],
      },
      {
        role: "model",
        parts: [{ text: "Oke, saya siap ngobrol. Saya sudah membaca pola dari awal sampai akhir." }],
      }
    ],
  });

  return chat;
};

// =====================================================
// SEND CHAT MESSAGE WITH RETRY (ROTASI KEY + LIMIT CONTEXT)
// =====================================================
export const sendChatMessageWithRetry = async (
  messages: Message[],
  conversationHistory: { role: string; text: string }[],
  userMessage: string
): Promise<string> => {

  if (API_KEYS.length === 0) {
    throw new Error("API Key tidak ditemukan.");
  }

  // SMART SAMPLING
  const chatContext = formatChatForPrompt(messages);

  let lastError: any = null;

  const history = [
    {
      role: "user",
      parts: [{ text: `Ini adalah data chat history kami (Start-Mid-End Sample):\n${chatContext}` }],
    },
    {
      role: "model",
      parts: [{ text: "Oke, saya siap ngobrol. Saya sudah membaca pola dari awal sampai akhir." }],
    },
    ...conversationHistory.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    })),
  ];

  for (let i = 0; i < API_KEYS.length; i++) {
    const currentKey = API_KEYS[i];
    const keyIndex = i + 1;

    try {
      console.log(`🔑 Chat: Mencoba API Key #${keyIndex}...`);

      const genAI = new GoogleGenerativeAI(currentKey);
      const model = genAI.getGenerativeModel({
        model: GEMINI_MODEL_TEXT,
        systemInstruction: SYSTEM_INSTRUCTION_CHAT,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH }
        ]
      });

      const chat = model.startChat({ history });
      const result = await chat.sendMessage(userMessage);
      const text = result.response.text();

      console.log(`✅ Chat sukses dengan API Key #${keyIndex}`);
      return text;

    } catch (error: any) {
      lastError = error;
      const errMsg = error.message || "";
      console.warn(`⚠️ API Key #${keyIndex} gagal:`, errMsg);

      const isQuotaError =
        errMsg.includes("429") ||
        errMsg.includes("503") ||
        errMsg.includes("quota") ||
        errMsg.includes("RESOURCE_EXHAUSTED");

      const isKeyError =
        errMsg.includes("403") ||
        errMsg.includes("API key") ||
        errMsg.includes("key not valid") ||
        errMsg.includes("leaked");

      if (isQuotaError || isKeyError) {
        console.log(`🔄 API #${keyIndex} bermasalah, rotasi ke key berikutnya...`);
        // Tunggu sebentar sebelum pindah biar ga spam
        await sleep(500);
        continue;
      }

      // Jika error lain yang bukan quota/key (misal network error atau input bad request), 
      // bisa coba key lain juga atau langsung throw. 
      // Untuk amannya kita coba key selanjutnya saja.
      console.log(`🔄 Mencoba recovery dengan key selanjutnya...`);
      continue;
    }
  }

  console.error("❌ Semua API Key telah dicoba dan gagal untuk chat.");
  throw lastError || new Error("Semua API key gagal.");
};
