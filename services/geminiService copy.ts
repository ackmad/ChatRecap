// import { GoogleGenAI, Type, HarmCategory, HarmBlockThreshold } from "@google/genai";
import * as GenAI from "@google/generative-ai";
import { Message, AnalysisResult } from "../types";
import { SYSTEM_INSTRUCTION_CHAT, GEMINI_MODEL_TEXT } from "../constants";

// Helper to format chat for AI context with smarter sampling
const formatChatForPrompt = (messages: Message[]): string => {
    // Reduced limit to ensure speed and prevent timeouts
    const MAX_MESSAGES = 2500;

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

export const analyzeChatWithGemini = async (
    messages: Message[],
    onStatusUpdate: (status: string) => void
): Promise<AnalysisResult> => {

    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // Ambil dari Vite

    if (!API_KEY) {
        throw new Error("API Key tidak ditemukan. Pastikan VITE_GEMINI_API_KEY ada di file .env");
    }
    onStatusUpdate("🔄 Menginisialisasi Client Google GenAI...");
    const genAI = new GenAI.GoogleGenerativeAI({ apiKey: API_KEY });

    onStatusUpdate("📄 Mempersiapkan konteks chat (Tokenizing)...");
    const chatContext = formatChatForPrompt(messages);

    // --- PROMPT YANG DIPERBAIKI (Reflektif, Netral, & Struktur JSON Ketat) ---
    const prompt = `
Kamu adalah asisten reflektif bernama **"Refleksi Partner"**.
Tugasmu adalah menganalisis chat dan merangkumnya menjadi sebuah "Recap / Album Kenangan" yang jujur, netral, dan tenang.

Kamu harus membaca percakapan apa adanya, bukan menebak atau melebih-lebihkan perasaan.

==================================================
PRINSIP WAJIB (ANTI-HALUSINASI)
==================================================
- Analisis hanya berdasarkan isi chat yang tertulis.
- Jangan mengarang cerita, emosi, atau konflik yang tidak jelas di teks.
- Jangan membuat kesimpulan besar hanya dari percakapan singkat.
- Jangan memvalidasi perasaan secara berlebihan.
- Jangan menghakimi siapa pun.
- Jika chat terasa biasa, datar, atau hanya obrolan ringan, katakan dengan jujur.
- Jika chat terasa emosional, jelaskan alasannya berdasarkan bukti chat.
- Boleh menggunakan gaya bahasa puitis HANYA jika isi chat benar-benar romantis atau emosional kuat.
- Jika data tidak cukup untuk memastikan suatu hal, tulis "tidak cukup bukti".

==================================================
TUGAS UTAMA 1: DETEKSI JENIS HUBUNGAN (SANGAT PENTING)
==================================================
Tentukan jenis hubungan secara spesifik berdasarkan isi chat:

1. **romantic**: Pasangan, suami-istri, pacaran jelas.
2. **crush**: PDKT, gebetan, flirting, belum jadian tapi ada rasa.
3. **friendship_boys**: Tongkrongan cowok (bro code, game, bola, santai, kasar-bercanda).
4. **friendship_girls**: Bestie cewek (curhat, skincare, update life, support system).
5. **friendship_mixed**: Teman beda gender tapi murni teman (platonic, kuliah, kerja kelompok, atau bestie cowok-cewek).
6. **bestie**: Sahabat sangat dekat (gender apa saja), sudah seperti keluarga sendiri.
7. **family**: Orang tua, kakak-adik, grup keluarga besar.
8. **work**: Kolega, bos, urusan profesional, formal, kaku.
9. **school**: Teman sekelas, bahas tugas, ujian, dosen/guru.
10. **long_distance**: Pasangan LDR (banyak call/vidcall, rindu).
11. **broken**: Mantan, chat putus, galau, closure, atau bertengkar hebat berujung pisah.
12. **toxic**: Penuh caci maki, manipulatif, gaslighting, tidak sehat.
13. **stranger**: Transaksi jual beli, kurir, orang baru kenal, sangat formal.
14. **other**: Tidak masuk kategori di atas.

==================================================
TUGAS UTAMA 2: SESUAIKAN NADA BICARA
==================================================
- **romantic/crush/ldr**: Hangat, lembut, sedikit puitis tapi realistis.
- **friendship/bestie**: Santai, asik, gunakan "lo-gue" jika cocok, friendly.
- **friendship_boys**: Maskulin santai, to the point, bro-style.
- **family**: Hangat, sopan, peduli.
- **work/school/stranger**: Netral, objektif, profesional.
- **toxic/broken**: Empatik, hati-hati, reflektif, sedikit melankolis tapi tidak cengeng.

==================================================
FORMAT OUTPUT
==================================================
Kamu WAJIB mengeluarkan output dalam format JSON valid.
Jangan tambahkan teks, markdown (seperti \`\`\`json), atau penjelasan apa pun di luar blok JSON.
Hanya kembalikan raw JSON string.

TRANSKRIP CHAT:
${chatContext}
`;

    try {
        onStatusUpdate(`📡 Mengirim request ke model (${GEMINI_MODEL_TEXT})...`);

        // Inisialisasi model dulu (safetySettings DI LUAR generationConfig)
        const model = genAI.getGenerativeModel({
            model: GEMINI_MODEL_TEXT,
            systemInstruction: SYSTEM_INSTRUCTION_CHAT,
            generationConfig: {
                // hanya config output
                responseMimeType: "application/json",
                responseSchema: {
                    type: GenAI.SchemaType.OBJECT,
                    properties: {
                        storyTitle: { type: GenAI.SchemaType.STRING, description: "Judul singkat dan menarik" },
                        summary: { type: GenAI.SchemaType.STRING, description: "Ringkasan naratif 1-2 paragraf" },
                        relationshipType: {
                            type: GenAI.SchemaType.STRING,
                            enum: [
                                'romantic', 'crush', 'friendship_boys', 'friendship_girls',
                                'friendship_mixed', 'bestie', 'family', 'work',
                                'school', 'long_distance', 'broken', 'toxic',
                                'stranger', 'other'
                            ]
                        },
                        emotionalTone: { type: GenAI.SchemaType.STRING, description: "Nada emosi keseluruhan (contoh: Santai, Tegang)" },
                        emotions: {
                            type: GenAI.SchemaType.ARRAY,
                            items: {
                                type: GenAI.SchemaType.OBJECT,
                                properties: {
                                    emotion: { type: GenAI.SchemaType.STRING },
                                    intensity: { type: GenAI.SchemaType.INTEGER },
                                    description: { type: GenAI.SchemaType.STRING }
                                }
                            }
                        },
                        keyMoments: {
                            type: GenAI.SchemaType.ARRAY,
                            items: {
                                type: GenAI.SchemaType.OBJECT,
                                properties: {
                                    title: { type: GenAI.SchemaType.STRING },
                                    description: { type: GenAI.SchemaType.STRING },
                                    mood: { type: GenAI.SchemaType.STRING, enum: ['happy', 'sad', 'neutral', 'tense', 'warm'] },
                                    date: { type: GenAI.SchemaType.STRING }
                                }
                            }
                        },
                        phases: {
                            type: GenAI.SchemaType.ARRAY,
                            items: {
                                type: GenAI.SchemaType.OBJECT,
                                properties: {
                                    name: { type: GenAI.SchemaType.STRING },
                                    description: { type: GenAI.SchemaType.STRING },
                                    mood: { type: GenAI.SchemaType.STRING, enum: ['warm', 'neutral', 'cold', 'tense', 'excited'] },
                                    period: { type: GenAI.SchemaType.STRING }
                                }
                            }
                        },
                        dominantTopics: {
                            type: GenAI.SchemaType.ARRAY,
                            items: {
                                type: GenAI.SchemaType.OBJECT,
                                properties: {
                                    name: { type: GenAI.SchemaType.STRING },
                                    category: { type: GenAI.SchemaType.STRING, enum: ['fun', 'deep', 'daily', 'conflict'] }
                                }
                            }
                        },
                        toneAnalysis: {
                            type: GenAI.SchemaType.ARRAY,
                            items: {
                                type: GenAI.SchemaType.OBJECT,
                                properties: {
                                    label: { type: GenAI.SchemaType.STRING },
                                    percentage: { type: GenAI.SchemaType.INTEGER }
                                }
                            }
                        },
                        memorableLines: {
                            type: GenAI.SchemaType.ARRAY,
                            items: {
                                type: GenAI.SchemaType.OBJECT,
                                properties: {
                                    text: { type: GenAI.SchemaType.STRING },
                                    sender: { type: GenAI.SchemaType.STRING },
                                    context: { type: GenAI.SchemaType.STRING },
                                    mood: { type: GenAI.SchemaType.STRING }
                                }
                            }
                        },
                        conflictTriggers: {
                            type: GenAI.SchemaType.ARRAY,
                            items: {
                                type: GenAI.SchemaType.STRING
                            }
                        },
                        monthlyMoods: {
                            type: GenAI.SchemaType.ARRAY,
                            items: {
                                type: GenAI.SchemaType.OBJECT,
                                properties: {
                                    month: { type: GenAI.SchemaType.STRING },
                                    mood: { type: GenAI.SchemaType.STRING },
                                    intensity: { type: GenAI.SchemaType.INTEGER }
                                }
                            }
                        },
                        hourlyMoods: {
                            type: GenAI.SchemaType.ARRAY,
                            items: {
                                type: GenAI.SchemaType.OBJECT,
                                properties: {
                                    timeRange: { type: GenAI.SchemaType.STRING },
                                    mood: { type: GenAI.SchemaType.STRING },
                                    description: { type: GenAI.SchemaType.STRING }
                                }
                            }
                        },
                        communicationStyle: {
                            type: GenAI.SchemaType.OBJECT,
                            properties: {
                                mostExpressive: { type: GenAI.SchemaType.STRING },
                                quickestReplier: { type: GenAI.SchemaType.STRING },
                                description: { type: GenAI.SchemaType.STRING }
                            }
                        },
                        reflection: { type: GenAI.SchemaType.STRING, description: "Pesan penutup bijak" },
                        aiConfidence: { type: GenAI.SchemaType.STRING, enum: ['high', 'medium', 'low'] }
                    },
                    required: [
                        "storyTitle", "summary", "relationshipType", "emotionalTone", "phases",
                        "dominantTopics", "memorableLines", "aiConfidence",
                        "monthlyMoods", "keyMoments", "toneAnalysis", "conflictTriggers", "hourlyMoods"
                    ]
                }
            },
            // safety settings di luar generationConfig
            safetySettings: [
                { category: GenAI.HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: GenAI.HarmBlockThreshold.BLOCK_ONLY_HIGH },
                { category: GenAI.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: GenAI.HarmBlockThreshold.BLOCK_ONLY_HIGH },
                { category: GenAI.HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: GenAI.HarmBlockThreshold.BLOCK_ONLY_HIGH },
                { category: GenAI.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: GenAI.HarmBlockThreshold.BLOCK_ONLY_HIGH },
            ],
        });

        // Baru generate content
        const result = await model.generateContent(prompt);
        const response = result.response;

        onStatusUpdate("📥 Menerima respon dari server...");

        // response.text() adalah function di SDK baru
        const text = response.text();
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
                // Memberikan sebagian text raw untuk debugging jika parsing gagal total
                throw new Error(`Gagal membaca hasil analisis (Invalid JSON). Pastikan chat tidak mengandung karakter aneh.`);
            }
        } else {
            console.warn("Empty response text. Candidates:", response.candidates);
            if (response.candidates && response.candidates.length > 0 && response.candidates[0].finishReason) {
                const reason = response.candidates[0].finishReason;
                onStatusUpdate(`⚠️ Analisis berhenti: ${reason}`);
                throw new Error(`AI menolak memproses chat (Alasan: ${reason}). Cek apakah chat mengandung konten sensitif.`);
            }
            throw new Error("Tidak ada respon dari AI. Server mungkin sibuk.");
        }
    } catch (error: any) {
        console.error("Gemini Analysis Error:", error);

        let userMsg = "Terjadi kesalahan sistem.";
        let technicalMsg = error.message;

        if (error.message?.includes('400')) {
            userMsg = "Request ditolak (400). Chat mungkin terlalu panjang atau format salah.";
        } else if (error.message?.includes('401') || error.message?.includes('API Key')) {
            userMsg = "Kunci API tidak valid atau tidak ditemukan.";
        } else if (error.message?.includes('429')) {
            userMsg = "Terlalu banyak permintaan (Rate Limit). Tunggu sebentar.";
        } else if (error.message?.includes('500')) {
            userMsg = "Server AI Google sedang down (500).";
        } else if (error.message?.includes('503')) {
            userMsg = "Layanan AI sedang overload (503).";
        }

        onStatusUpdate(`❌ Error: ${technicalMsg}`);

        // Throw error object with both user friendly and technical details
        throw { userMsg, technicalMsg };
    }
};

export const createChatSession = (messages: Message[]) => {
    // Ambil API key dari Vite (sama dengan fungsi analyzeChatWithGemini)
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    if (!API_KEY) {
        throw new Error("API Key tidak ditemukan. Pastikan VITE_GEMINI_API_KEY ada di file .env");
    }

    const genAI = new GenAI.GoogleGenerativeAI({ apiKey: API_KEY });
    const chatContext = formatChatForPrompt(messages);

    // Kembalikan model yang sudah diinisialisasi dengan systemInstruction berisi konteks chat.
    // Caller dapat memanggil model.generateContent(prompt) untuk menghasilkan respon.
    const model = genAI.getGenerativeModel({
        model: GEMINI_MODEL_TEXT,
        systemInstruction: `${SYSTEM_INSTRUCTION_CHAT}\n\nKONTEKS CHAT:\n${chatContext}`,
        generationConfig: {
            responseMimeType: "application/json"
        }
    });

    return model;
};