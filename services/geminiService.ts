import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { Message, AnalysisResult } from "../types";
import {
  SYSTEM_INSTRUCTION_CHAT,
  SYSTEM_INSTRUCTION_ANALYSIS,
  GEMINI_MODELS,
  ReadingStrategy,
  READING_STRATEGY_CONFIG
} from "../constants";

// =====================================================
// API KEY ROTATION & USAGE TRACKING
// =====================================================
let RUNTIME_API_KEYS: string[] = [];

const getApiKeys = (): string[] => {
  // Prioritize runtime keys (from user settings)
  if (RUNTIME_API_KEYS.length > 0) {
    return RUNTIME_API_KEYS;
  }

  // Fallback to .env keys
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

// Allow runtime API key updates
export const setRuntimeApiKeys = (keys: string[]) => {
  RUNTIME_API_KEYS = keys.filter(k => k.trim().length > 0);
  console.log(`✅ Runtime API Keys updated: ${RUNTIME_API_KEYS.length} keys`);
};

export const getRuntimeApiKeys = (): string[] => {
  return RUNTIME_API_KEYS;
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

// Format chat with configurable Reading Strategy
const formatChatForPrompt = (messages: Message[], strategy: ReadingStrategy = 'smart-sampling'): string => {
  const config = READING_STRATEGY_CONFIG[strategy];
  const MAX_MESSAGES = config.maxMessages;

  // Helper to format a single message with platform tag if available
  const formatMsg = (m: Message) => {
    const platformTag = m.platform === 'whatsapp' ? '[WA]' : m.platform === 'instagram' ? '[IG]' : '';
    return `[${m.date.toISOString()}]${platformTag ? `[${m.platform === 'whatsapp' ? 'WA' : 'IG'}]` : ''} ${m.sender}: ${m.content}`;
  };

  // FULL: Return everything
  if (strategy === 'full' || messages.length <= MAX_MESSAGES) {
    return messages.map(formatMsg).join('\n');
  }

  // EXTREME LIGHT: Only very beginning and very end
  if (strategy === 'extreme-light') {
    const chunkSize = Math.floor(MAX_MESSAGES / 2);
    const start = messages.slice(0, chunkSize);
    const end = messages.slice(-chunkSize);
    
    return [
      ...start.map(formatMsg),
      `\n... [DILEWATI ${messages.length - MAX_MESSAGES} pesan] ...\n`,
      ...end.map(formatMsg)
    ].join('\n');
  }

  // KEY MOMENTS: Detect important moments (sentiment changes, long gaps, etc)
  if (strategy === 'key-moments') {
    const keyMoments = detectKeyMoments(messages, MAX_MESSAGES);
    return keyMoments.map(formatMsg).join('\n');
  }

  // SMART SAMPLING: Start - Mid - End (default behavior)
  const chunkSize = Math.floor(MAX_MESSAGES / 3);
  const start = messages.slice(0, chunkSize);
  const midStart = Math.floor(messages.length / 2) - Math.floor(chunkSize / 2);
  const middle = messages.slice(midStart, midStart + chunkSize);
  const end = messages.slice(-chunkSize);

  return [
    ...start.map(formatMsg),
    `\n... [SAMPEL BAGIAN TENGAH - Total ${messages.length} pesan] ...\n`,
    ...middle.map(formatMsg),
    `\n... [SAMPEL BAGIAN AKHIR] ...\n`,
    ...end.map(formatMsg)
  ].join('\n');
};

// Detect key moments in chat (for key-moments strategy)
const detectKeyMoments = (messages: Message[], targetCount: number): Message[] => {
  if (messages.length <= targetCount) return messages;

  const keyMessages: Message[] = [];
  const step = Math.floor(messages.length / targetCount);

  // Always include first and last
  keyMessages.push(messages[0]);

  // Sample evenly throughout conversation
  for (let i = step; i < messages.length - step; i += step) {
    keyMessages.push(messages[i]);
  }

  keyMessages.push(messages[messages.length - 1]);

  // Add messages with high engagement indicators
  const engagementMessages = messages.filter(m => {
    const content = m.content.toLowerCase();
    const hasQuestionMark = content.includes('?');
    const hasExclamation = content.includes('!');
    const isLong = m.content.length > 100;
    const hasEmoji = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]/u.test(m.content);
    
    return (hasQuestionMark || hasExclamation || isLong || hasEmoji) && keyMessages.indexOf(m) === -1;
  });

  // Add some engagement messages if we have room
  const remainingSlots = targetCount - keyMessages.length;
  if (remainingSlots > 0 && engagementMessages.length > 0) {
    const engagementStep = Math.floor(engagementMessages.length / remainingSlots);
    for (let i = 0; i < remainingSlots && i * engagementStep < engagementMessages.length; i++) {
      keyMessages.push(engagementMessages[i * engagementStep]);
    }
  }

  // Sort by date
  keyMessages.sort((a, b) => a.date.getTime() - b.date.getTime());

  return keyMessages;
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

const buildModel = (genAI: GoogleGenerativeAI, systemInstruction: string, modelName: string) => {
  return genAI.getGenerativeModel({
    model: modelName,
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
// MAIN ANALYSIS FUNCTION WITH MODEL + API KEY FALLBACK + READING STRATEGY
// =====================================================
export const analyzeChatWithGemini = async (
  messages: Message[],
  onStatusUpdate: (status: string) => void,
  strategy: ReadingStrategy = 'smart-sampling',
  customApiKeys?: string[]
): Promise<AnalysisResult> => {

  // Use custom API keys if provided, otherwise use default
  const apiKeys = customApiKeys && customApiKeys.length > 0 ? customApiKeys : getApiKeys();

  if (apiKeys.length === 0) {
    throw new Error("API Key tidak ditemukan. Pastikan VITE_GEMINI_API_KEYS ada di file .env atau masukkan API Key manual di Settings.");
  }

  const strategyConfig = READING_STRATEGY_CONFIG[strategy];
  onStatusUpdate(`📄 Menyiapkan data chat (${strategyConfig.description})...`);

  // Use selected reading strategy
  const chatContext = formatChatForPrompt(messages, strategy);

  // Detect multi-platform (if any message has a platform tag)
  const hasWA = messages.some(m => m.platform === 'whatsapp');
  const hasIG = messages.some(m => m.platform === 'instagram');
  const isMultiPlatform = hasWA && hasIG;

  const platformContext = isMultiPlatform
    ? `KONTEKS MULTI-PLATFORM: Chat ini adalah GABUNGAN dari WhatsApp [WA] dan Instagram DM [IG].
Kedua percakapan sudah digabung dan diurutkan secara kronologis berdasarkan waktu nyata.
Tag [WA] = pesan dari WhatsApp, [IG] = pesan dari Instagram DM.
Anggap ini SATU hubungan yang sama orang-orangnya, hanya beda platform. Analisis timeline-nya sebagai kesatuan percakapan.`
    : hasIG
    ? 'KONTEKS: Chat ini berasal dari Instagram DM export.'
    : 'KONTEKS: Chat ini berasal dari WhatsApp export.';

  const prompt = `
Tolong analisis chat berikut dan kembalikan output HANYA DALAM FORMAT JSON. 
Jangan ada teks pengantar. Langsung data.

${platformContext}

STRATEGI PEMBACAAN: ${strategy.toUpperCase()}
${strategy !== 'full' ? `(Ini adalah sampel dari ${messages.length} total pesan)` : ''}

TRANSKRIP CHAT:
${chatContext}
`.trim();

  let lastError: any = null;
  let usageStats: TokenUsage = { promptTokens: 0, responseTokens: 0, totalTokens: 0 };

  // =====================================================
  // NESTED LOOP: API KEY -> MODEL FALLBACK
  // =====================================================
  for (let keyIndex = 0; keyIndex < apiKeys.length; keyIndex++) {
    const currentKey = apiKeys[keyIndex];
    const genAI = new GoogleGenerativeAI(currentKey);

    onStatusUpdate(`🔑 Menggunakan API Key #${keyIndex + 1} (${apiKeys.length} keys tersedia)...`);

    // Try all models for this API key
    for (let modelIndex = 0; modelIndex < GEMINI_MODELS.length; modelIndex++) {
      const currentModel = GEMINI_MODELS[modelIndex];

      try {
        onStatusUpdate(`🤖 Mencoba model: ${currentModel} (API #${keyIndex + 1})...`);

        const model = buildModel(genAI, SYSTEM_INSTRUCTION_ANALYSIS, currentModel);

        onStatusUpdate(`🧠 Menganalisa pola chat (${strategy})...`);

        // Single Request with Retry
        const result = await callGeminiWithRetry(model, prompt, 3);

        usageStats = result.usage;

        console.log(`✅ [Analysis] Success!`);
        console.log(`   Strategy: ${strategy}`);
        console.log(`   API Key: #${keyIndex + 1}`);
        console.log(`   Model: ${currentModel}`);
        console.log(`   Tokens: Prompt=${usageStats.promptTokens}, Response=${usageStats.responseTokens}, Total=${usageStats.totalTokens}`);

        onStatusUpdate("📥 Menerima respon AI...");
        const cleanedJson = cleanJsonOutput(result.text);

        onStatusUpdate("🔍 Validasi struktur data...");
        const parsed = JSON.parse(cleanedJson) as AnalysisResult;

        onStatusUpdate(`✅ Analisis Selesai! (${usageStats.totalTokens} tokens, model: ${currentModel})`);

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
        const errMsg = error?.message || "";
        console.warn(`⚠️ Model ${currentModel} (API #${keyIndex + 1}) gagal:`, errMsg);
        lastError = error;

        const isQuotaError =
          errMsg.includes("429") ||
          errMsg.includes("quota") ||
          errMsg.includes("RESOURCE_EXHAUSTED");

        const isModelNotFound = 
          errMsg.includes("404") ||
          errMsg.includes("not found") ||
          errMsg.includes("does not exist");

        const isKeyError =
          errMsg.includes("403") ||
          errMsg.includes("API key") ||
          errMsg.includes("key not valid") ||
          errMsg.includes("leaked");

        // If quota/model error, try next model
        if (isQuotaError || isModelNotFound) {
          onStatusUpdate(`⚠️ Model ${currentModel} tidak tersedia/quota habis. Coba model lain...`);
          await sleep(500);
          continue; // Try next model
        }

        // If API key error, skip to next API key
        if (isKeyError) {
          onStatusUpdate(`⚠️ API Key #${keyIndex + 1} invalid. Pindah ke API key selanjutnya...`);
          break; // Break model loop, go to next API key
        }

        // Other errors - try next model
        onStatusUpdate(`⚠️ Error pada model ${currentModel}. Mencoba model lain...`);
        await sleep(500);
        continue;
      }
    }

    // All models failed for this API key, try next API key
    onStatusUpdate(`❌ Semua model gagal untuk API Key #${keyIndex + 1}. Mencoba API key berikutnya...`);
    await sleep(1500);
  }

  console.error("❌ Semua kombinasi API Key + Model gagal:", lastError);

  onStatusUpdate("❌ TOKEN / QUOTA habis untuk semua model dan API key.");

  throw {
    userMsg: "TOKEN/QUOTA sudah habis untuk semua model. Tolong beritahu developer untuk upgrade billing / ganti API key.",
    technicalMsg: lastError?.message || "All keys and models exhausted."
  };
};

// =====================================================
// CHAT SESSION (RANDOM KEY + FIRST AVAILABLE MODEL)
// =====================================================
export const createChatSession = (messages: Message[]) => {
  const apiKeys = getApiKeys();
  if (apiKeys.length === 0) {
    throw new Error("API Key tidak ditemukan.");
  }

  const randomIndex = Math.floor(Math.random() * apiKeys.length);
  const key = apiKeys[randomIndex];

  const genAI = new GoogleGenerativeAI(key);

  // SMART SAMPLING (Start-Mid-End)
  const chatContext = formatChatForPrompt(messages);

  // Use first available model (will fallback in sendChatMessageWithRetry if needed)
  const model = genAI.getGenerativeModel({
    model: GEMINI_MODELS[0],
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
// SEND CHAT MESSAGE WITH MODEL + API KEY FALLBACK
// =====================================================
export const sendChatMessageWithRetry = async (
  messages: Message[],
  conversationHistory: { role: string; text: string }[],
  userMessage: string
): Promise<string> => {
  const apiKeys = getApiKeys();

  if (apiKeys.length === 0) {
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

  // =====================================================
  // NESTED LOOP: API KEY -> MODEL FALLBACK
  // =====================================================
  for (let keyIndex = 0; keyIndex < apiKeys.length; keyIndex++) {
    const currentKey = apiKeys[keyIndex];
    const genAI = new GoogleGenerativeAI(currentKey);

    console.log(`🔑 Chat: Mencoba API Key #${keyIndex + 1}...`);

    // Try all models for this API key
    for (let modelIndex = 0; modelIndex < GEMINI_MODELS.length; modelIndex++) {
      const currentModel = GEMINI_MODELS[modelIndex];

      try {
        console.log(`🤖 Chat: Mencoba model ${currentModel} (API #${keyIndex + 1})...`);

        const model = genAI.getGenerativeModel({
          model: currentModel,
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

        console.log(`✅ Chat sukses dengan model ${currentModel} (API Key #${keyIndex + 1})`);
        return text;

      } catch (error: any) {
        lastError = error;
        const errMsg = error.message || "";
        console.warn(`⚠️ Model ${currentModel} (API #${keyIndex + 1}) gagal:`, errMsg);

        const isQuotaError =
          errMsg.includes("429") ||
          errMsg.includes("503") ||
          errMsg.includes("quota") ||
          errMsg.includes("RESOURCE_EXHAUSTED");

        const isModelNotFound = 
          errMsg.includes("404") ||
          errMsg.includes("not found") ||
          errMsg.includes("does not exist");

        const isKeyError =
          errMsg.includes("403") ||
          errMsg.includes("API key") ||
          errMsg.includes("key not valid") ||
          errMsg.includes("leaked");

        // If quota/model error, try next model
        if (isQuotaError || isModelNotFound) {
          console.log(`🔄 Model ${currentModel} tidak tersedia. Coba model lain...`);
          await sleep(500);
          continue; // Try next model
        }

        // If API key error, skip to next API key
        if (isKeyError) {
          console.log(`🔄 API Key #${keyIndex + 1} invalid. Pindah ke API key selanjutnya...`);
          break; // Break model loop, go to next API key
        }

        // Other errors - try next model
        console.log(`🔄 Error pada model ${currentModel}. Mencoba model lain...`);
        await sleep(500);
        continue;
      }
    }

    // All models failed for this API key, try next API key
    console.log(`❌ Semua model gagal untuk API Key #${keyIndex + 1}. Mencoba API key berikutnya...`);
    await sleep(1000);
  }

  console.error("❌ Semua API Key + Model telah dicoba dan gagal untuk chat.");
  throw lastError || new Error("Semua API key dan model gagal.");
};
