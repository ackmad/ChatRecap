import { GoogleGenAI, Type } from "@google/genai";
import { Message, AnalysisResult } from "../types";
import { SYSTEM_INSTRUCTION_ANALYSIS, SYSTEM_INSTRUCTION_CHAT, GEMINI_MODEL_TEXT } from "../constants";

// Helper to format chat for AI context with smarter sampling
const formatChatForPrompt = (messages: Message[]): string => {
  // If messages are too long, take start, middle, and end chunks to represent the whole journey
  const MAX_MESSAGES = 1800;
  
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
    "\n... [BAGIAN TENGAH CHAT] ...\n",
    ...middle.map(m => `[${m.date.toISOString()}] ${m.sender}: ${m.content}`),
    "\n... [BAGIAN AKHIR CHAT] ...\n",
    ...end.map(m => `[${m.date.toISOString()}] ${m.sender}: ${m.content}`)
  ].join('\n');
};

export const analyzeChatWithGemini = async (messages: Message[]): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const chatContext = formatChatForPrompt(messages);

const prompt = `
Anda adalah "Refleksi Partner" yang netral, hangat, dan puitis. Tugas Anda adalah merangkum riwayat chat menjadi sebuah "Album Kenangan Digital".
Jangan menghakimi. Jangan menyimpulkan perasaan cinta/benci secara sepihak. Fokus pada pola komunikasi dan perubahan dinamika.

DATA YANG WAJIB DIANALISIS (OUTPUT JSON):

1. **Summary & Title**: Buat judul kreatif untuk riwayat chat ini (misal: "Kisah Tentang Kopi & Senja") dan ringkasan naratif 6-10 baris yang menceritakan perjalanan dari awal sampai akhir.
2. **Emotional Tone**: Jelaskan nada emosional keseluruhan.
3. **Phases (Fase Hubungan)**: Bagi menjadi 3-5 fase logis (contoh: "Awal Kenalan", "Masa Intens", "Fase Hening").
4. **Dominant Topics**: 5-10 Topik yang paling sering muncul.
5. **Tone Analysis**: Persentase nada (Santai, Serius, Bercanda, Hati-hati, dll).
6. **Key Moments**: 3-5 momen penting dengan tanggal perkiraan.
7. **Memorable Lines**: Kutipan chat yang lucu, menyentuh, atau unik.
8. **Conflict Triggers**: Kata-kata yang sering muncul saat suasana menegang (jika ada).
9. **Monthly Moods**: Analisis mood dominan per bulan (jika chat panjang) atau per minggu.
10. **Hourly Moods**: Analisis mood berdasarkan jam (Pagi, Siang, Malam, Tengah Malam).
11. **Communication Style**: Siapa yang lebih ekspresif? Siapa yang balas cepat? Deskripsikan dengan netral.
12. **AI Confidence**: Seberapa yakin Anda dengan analisis ini berdasarkan kelengkapan data (High/Medium/Low).

TRANSKRIP CHAT:
${chatContext}
`;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_ANALYSIS, 
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                storyTitle: { type: Type.STRING },
                summary: { type: Type.STRING },
                emotionalTone: { type: Type.STRING },
                emotions: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            emotion: { type: Type.STRING },
                            intensity: { type: Type.INTEGER },
                            description: { type: Type.STRING }
                        }
                    }
                },
                keyMoments: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            description: { type: Type.STRING },
                            mood: { type: Type.STRING, enum: ['happy', 'sad', 'neutral', 'tense', 'warm'] },
                            date: { type: Type.STRING }
                        }
                    }
                },
                phases: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            description: { type: Type.STRING },
                            mood: { type: Type.STRING, enum: ['warm', 'neutral', 'cold', 'tense', 'excited'] },
                            period: { type: Type.STRING }
                        }
                    }
                },
                dominantTopics: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            category: { type: Type.STRING, enum: ['fun', 'deep', 'daily', 'conflict'] }
                        }
                    }
                },
                toneAnalysis: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            label: { type: Type.STRING },
                            percentage: { type: Type.INTEGER }
                        }
                    }
                },
                memorableLines: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            text: { type: Type.STRING },
                            sender: { type: Type.STRING },
                            context: { type: Type.STRING },
                            mood: { type: Type.STRING }
                        }
                    }
                },
                conflictTriggers: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                },
                monthlyMoods: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            month: { type: Type.STRING },
                            mood: { type: Type.STRING },
                            intensity: { type: Type.INTEGER }
                        }
                    }
                },
                hourlyMoods: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            timeRange: { type: Type.STRING },
                            mood: { type: Type.STRING },
                            description: { type: Type.STRING }
                        }
                    }
                },
                communicationStyle: {
                    type: Type.OBJECT,
                    properties: {
                        mostExpressive: { type: Type.STRING },
                        quickestReplier: { type: Type.STRING },
                        description: { type: Type.STRING }
                    }
                },
                reflection: { type: Type.STRING },
                aiConfidence: { type: Type.STRING, enum: ['high', 'medium', 'low'] }
            },
            required: [
                "storyTitle", "summary", "emotionalTone", "phases", 
                "dominantTopics", "memorableLines", "aiConfidence", 
                "monthlyMoods", "keyMoments", "toneAnalysis", "conflictTriggers", "hourlyMoods"
            ]
        }
      },
    });

    if (response.text) {
      const parsed = JSON.parse(response.text) as AnalysisResult;
      // Robustness: Ensure all arrays are present to avoid "map of undefined"
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
    } else {
      throw new Error("No response text from Gemini");
    }
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

export const createChatSession = (messages: Message[]) => {
    if (!process.env.API_KEY) {
        throw new Error("API Key not found");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const chatContext = formatChatForPrompt(messages);

    const chat = ai.chats.create({
        model: GEMINI_MODEL_TEXT,
        config: {
            systemInstruction: `${SYSTEM_INSTRUCTION_CHAT}\n\nKONTEKS CHAT:\n${chatContext}`
        }
    });

    return chat;
};