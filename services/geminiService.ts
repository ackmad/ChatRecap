import { GoogleGenerativeAI, SchemaType, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { Message, AnalysisResult } from "../types";
import { SYSTEM_INSTRUCTION_CHAT, SYSTEM_INSTRUCTION_ANALYSIS, GEMINI_MODEL_TEXT } from "../constants";

// --- FORMATTER HELPER ---
const formatChatForPrompt = (messages: Message[]): string => {
  // Reduced limit to ensure speed and prevent timeouts
  const MAX_MESSAGES = 3000; 
  
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
    "\n... [BAGIAN TENGAH CHAT DILEWATI UTK EFISIENSI] ...\n",
    ...middle.map(m => `[${m.date.toISOString()}] ${m.sender}: ${m.content}`),
    "\n... [BAGIAN AKHIR CHAT] ...\n",
    ...end.map(m => `[${m.date.toISOString()}] ${m.sender}: ${m.content}`)
  ].join('\n');
};

const cleanJsonOutput = (text: string): string => {
    // 1. Remove Markdown code blocks (regex yang lebih agresif)
    let cleaned = text.replace(/```json/gi, '').replace(/```/g, '');
    
    // 2. Find the first '{' and last '}' to ensure we only get the object
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }

    return cleaned.trim();
};

// --- FUNGSI UTAMA ANALISIS ---
export const analyzeChatWithGemini = async (
    messages: Message[], 
    onStatusUpdate: (status: string) => void
): Promise<AnalysisResult> => {
  
  // Ambil API Key dari Vite
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  if (!API_KEY) {
    throw new Error("API Key tidak ditemukan. Pastikan VITE_GEMINI_API_KEY ada di file .env");
  }

  onStatusUpdate("🔄 Menginisialisasi AI...");
  const genAI = new GoogleGenerativeAI(API_KEY);

  onStatusUpdate("📄 Mempersiapkan konteks chat...");
  const chatContext = formatChatForPrompt(messages);

  const prompt = `
TRANSKRIP CHAT UNTUK DIANALISIS:
${chatContext}
`;

  try {
    onStatusUpdate(`📡 Mengirim request ke model (${GEMINI_MODEL_TEXT})...`);
    
    // Konfigurasi Model
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL_TEXT,
      systemInstruction: SYSTEM_INSTRUCTION_ANALYSIS, 
      generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
              type: SchemaType.OBJECT,
              properties: {
                  storyTitle: { type: SchemaType.STRING },
                  summary: { type: SchemaType.STRING },
                  relationshipType: { type: SchemaType.STRING }, 
                  emotionalTone: { type: SchemaType.STRING },
                  emotions: {
                      type: SchemaType.ARRAY,
                      items: {
                          type: SchemaType.OBJECT,
                          properties: {
                              emotion: { type: SchemaType.STRING },
                              intensity: { type: SchemaType.INTEGER },
                              description: { type: SchemaType.STRING }
                          }
                      }
                  },
                  keyMoments: {
                      type: SchemaType.ARRAY,
                      items: {
                          type: SchemaType.OBJECT,
                          properties: {
                              title: { type: SchemaType.STRING },
                              description: { type: SchemaType.STRING },
                              mood: { type: SchemaType.STRING },
                              date: { type: SchemaType.STRING }
                          }
                      }
                  },
                  phases: {
                      type: SchemaType.ARRAY,
                      items: {
                          type: SchemaType.OBJECT,
                          properties: {
                              name: { type: SchemaType.STRING },
                              description: { type: SchemaType.STRING },
                              mood: { type: SchemaType.STRING },
                              period: { type: SchemaType.STRING }
                          }
                      }
                  },
                  dominantTopics: {
                      type: SchemaType.ARRAY,
                      items: {
                          type: SchemaType.OBJECT,
                          properties: {
                              name: { type: SchemaType.STRING },
                              category: { type: SchemaType.STRING }
                          }
                      }
                  },
                  toneAnalysis: {
                      type: SchemaType.ARRAY,
                      items: {
                          type: SchemaType.OBJECT,
                          properties: {
                              label: { type: SchemaType.STRING },
                              percentage: { type: SchemaType.INTEGER }
                          }
                      }
                  },
                  memorableLines: {
                      type: SchemaType.ARRAY,
                      items: {
                          type: SchemaType.OBJECT,
                          properties: {
                              text: { type: SchemaType.STRING },
                              sender: { type: SchemaType.STRING },
                              context: { type: SchemaType.STRING },
                              mood: { type: SchemaType.STRING }
                          }
                      }
                  },
                  conflictTriggers: {
                      type: SchemaType.ARRAY,
                      items: { type: SchemaType.STRING }
                  },
                  monthlyMoods: {
                      type: SchemaType.ARRAY,
                      items: {
                          type: SchemaType.OBJECT,
                          properties: {
                              month: { type: SchemaType.STRING },
                              mood: { type: SchemaType.STRING },
                              intensity: { type: SchemaType.INTEGER }
                          }
                      }
                  },
                  hourlyMoods: {
                      type: SchemaType.ARRAY,
                      items: {
                          type: SchemaType.OBJECT,
                          properties: {
                              timeRange: { type: SchemaType.STRING },
                              mood: { type: SchemaType.STRING },
                              description: { type: SchemaType.STRING }
                          }
                      }
                  },
                  communicationStyle: {
                      type: SchemaType.OBJECT,
                      properties: {
                          mostExpressive: { type: SchemaType.STRING },
                          quickestReplier: { type: SchemaType.STRING },
                          description: { type: SchemaType.STRING }
                      }
                  },
                  reflection: { type: SchemaType.STRING },
                  aiConfidence: { type: SchemaType.STRING }
              },
              required: [
                  "storyTitle", "summary", "relationshipType", "emotionalTone", "phases", 
                  "dominantTopics", "memorableLines", "aiConfidence", "keyMoments"
              ]
          }
      },
      // Safety settings dipisah (sejajar generationConfig)
      safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH }
      ]
    });

    // Generate Content
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    onStatusUpdate("📥 Menerima respon dari server...");

    if (text) {
      onStatusUpdate("🧹 Membersihkan format output JSON...");
      const cleanedText = cleanJsonOutput(text);

      onStatusUpdate("🔍 Parsing data JSON...");
      try {
        const parsed = JSON.parse(cleanedText) as AnalysisResult;
        
        onStatusUpdate("✅ Analisis berhasil!");
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
        console.error("Failed to parse JSON. Raw text:", text);
        onStatusUpdate("❌ Gagal membaca format data AI.");
        throw new Error(`Gagal membaca hasil analisis (Invalid JSON). Pastikan chat tidak mengandung karakter aneh.`);
      }
    } else {
        throw new Error("Tidak ada respon dari AI. Server mungkin sibuk.");
    }
  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    
    let userMsg = "Terjadi kesalahan sistem.";
    let technicalMsg = error.message;

    if (error.message?.includes('400')) userMsg = "Request ditolak (400). Chat mungkin terlalu panjang.";
    else if (error.message?.includes('401') || error.message?.includes('API Key')) userMsg = "Kunci API tidak valid.";
    else if (error.message?.includes('429')) userMsg = "Terlalu banyak permintaan (Rate Limit). Tunggu sebentar.";
    else if (error.message?.includes('500')) userMsg = "Server AI Google sedang down (500).";
    else if (error.message?.includes('503')) userMsg = "Layanan AI sedang overload (503).";

    onStatusUpdate(`❌ Error: ${technicalMsg}`);
    throw { userMsg, technicalMsg };
  }
};

// --- FUNGSI CHAT SESSION ---
export const createChatSession = (messages: Message[]) => {
    // Ambil API key dari Vite
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    if (!API_KEY) {
        throw new Error("API Key tidak ditemukan. Pastikan VITE_GEMINI_API_KEY ada di file .env");
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const chatContext = formatChatForPrompt(messages);

    const model = genAI.getGenerativeModel({ 
        model: GEMINI_MODEL_TEXT,
        systemInstruction: SYSTEM_INSTRUCTION_CHAT
    });

    // Return ChatSession object, BUKAN model
    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: `Ini adalah data chat history kami:\n${chatContext}` }],
            },
            {
                role: "model",
                parts: [{ text: "Baik, saya sudah membaca data chat tersebut. Silakan tanya apa saja, saya akan menjawab berdasarkan konteks tersebut dengan gaya santai." }],
            }
        ],
    });

    return chat;
};