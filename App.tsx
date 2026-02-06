import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, MessageSquare, ArrowRight, ShieldCheck, RefreshCw, Send, Sparkles, Clock, Calendar, MessageCircle, Heart, User, BookOpen, Feather, Cpu, Layers, ArrowLeft, Coffee, Sun, Moon, Minus, Plus, Hourglass, Tag, Scale, AlertCircle, Quote, ChevronLeft, ChevronRight, Info, BarChart2, TrendingUp, Music, Bot, Lock, CheckCircle, HelpCircle, File, Smartphone, Users, Eye, Brain, Terminal, XCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import ReactMarkdown from 'react-markdown';
import { parseWhatsAppChat } from './utils/chatParser';
import { analyzeChatWithGemini, createChatSession } from './services/geminiService';
import { AppState, ChatData, AnalysisResult, ChatMessage, Message, RelationshipType } from './types';
import { Layout } from './components/Layout';
import { Button } from './components/Button';
import { ChatSession } from "@google/generative-ai";
import { APP_VERSION } from './constants';

// --- Improved Adaptive Copywriting & Theme System ---
const getThemeConfig = (type?: RelationshipType) => {
    // Default Fallback
    const defaultConfig = {
        gradient: "from-stone-50 to-stone-100 dark:from-stone-950 dark:to-neutral-900",
        accent: "text-stone-500",
        bgAccent: "bg-stone-100 dark:bg-stone-800",
        borderAccent: "border-stone-200 dark:border-stone-700",
        stroke: "#A8A29E",
        fillChart: "#E7E5E4",
        labels: {
            rhythm: "Ritme Percakapan",
            phases: "Fase Hubungan",
            balance: "Keseimbangan",
            reflection: "Refleksi Akhir"
        }
    };

    switch (type) {
        // 1. FRIENDSHIP BOYS (Blue/Slate - Cool Tone)
        case 'friendship_boys':
            return {
                gradient: "from-blue-50 via-slate-50 to-cyan-50 dark:from-slate-950 dark:via-blue-950 dark:to-cyan-950",
                accent: "text-blue-500 dark:text-blue-400",
                bgAccent: "bg-blue-100 dark:bg-blue-900/40",
                borderAccent: "border-blue-200 dark:border-blue-800",
                stroke: "#60A5FA", // Blue 400
                fillChart: "#DBEAFE",
                labels: { rhythm: "Grafik Nongkrong", phases: "Era Persahabatan", balance: "Kontribusi Bacot", reflection: "Bro Code Summary" }
            };

        // 2. FRIENDSHIP MIXED / GENERAL (Purple/Lilac)
        case 'friendship_mixed':
        case 'bestie':
            return {
                gradient: "from-fuchsia-50 via-purple-50 to-violet-50 dark:from-fuchsia-950 dark:via-purple-950 dark:to-violet-950",
                accent: "text-purple-500 dark:text-purple-400",
                bgAccent: "bg-purple-100 dark:bg-purple-900/40",
                borderAccent: "border-purple-200 dark:border-purple-800",
                stroke: "#C084FC", // Purple 400
                fillChart: "#F3E8FF",
                labels: { rhythm: "Dinamika Pertemanan", phases: "Timeline Kebersamaan", balance: "Keseimbangan Interaksi", reflection: "Refleksi Teman Baik" }
            };

        // 3. FRIENDSHIP GIRLS (Peach/Pink)
        case 'friendship_girls':
            return {
                gradient: "from-rose-50 via-pink-50 to-orange-50 dark:from-rose-950 dark:via-pink-950 dark:to-orange-950",
                accent: "text-pink-500 dark:text-pink-400",
                bgAccent: "bg-pink-100 dark:bg-pink-900/40",
                borderAccent: "border-pink-200 dark:border-pink-800",
                stroke: "#F472B6", // Pink 400
                fillChart: "#FCE7F3",
                labels: { rhythm: "Sesi Curhat & Update", phases: "Chapter Bestie", balance: "Siapa Paling Rame?", reflection: "Catatan Persahabatan" }
            };

        // 4. FAMILY (Green/Emerald/Sage)
        case 'family':
            return {
                gradient: "from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-950 dark:via-green-950 dark:to-teal-950",
                accent: "text-emerald-600 dark:text-emerald-400",
                bgAccent: "bg-emerald-100 dark:bg-emerald-900/40",
                borderAccent: "border-emerald-200 dark:border-emerald-800",
                stroke: "#34D399", // Emerald 400
                fillChart: "#D1FAE5",
                labels: { rhythm: "Kabar Keluarga", phases: "Momen Penting Keluarga", balance: "Siapa Paling Aktif?", reflection: "Pesan Keluarga" }
            };

        // 5. ROMANTIC (Red/Rose - Warm)
        case 'romantic':
        case 'crush':
            return {
                gradient: "from-red-50 via-rose-50 to-orange-50 dark:from-red-950 dark:via-rose-950 dark:to-orange-950",
                accent: "text-rose-500 dark:text-rose-400",
                bgAccent: "bg-rose-100 dark:bg-rose-900/40",
                borderAccent: "border-rose-200 dark:border-rose-800",
                stroke: "#FB7185", // Rose 400
                fillChart: "#FFE4E6",
                labels: { rhythm: "Detak Jantung Percakapan", phases: "Babak Cerita Kita", balance: "Harmoni Cinta", reflection: "Surat Kecil untuk Kalian" }
            };

        // 6. WORK / STRANGER / SCHOOL (Neutral/Indigo)
        case 'work':
        case 'stranger':
        case 'school':
            return {
                gradient: "from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-950 dark:via-gray-950 dark:to-zinc-950",
                accent: "text-slate-600 dark:text-slate-400",
                bgAccent: "bg-slate-100 dark:bg-slate-800",
                borderAccent: "border-slate-200 dark:border-slate-700",
                stroke: "#94A3B8", // Slate 400
                fillChart: "#E2E8F0",
                labels: { rhythm: "Frekuensi Komunikasi", phases: "Timeline Interaksi", balance: "Distribusi Pesan", reflection: "Ringkasan Formal" }
            };

        // 7. TOXIC / BROKEN / LONG DISTANCE (Muted/Desaturated)
        case 'broken':
        case 'toxic':
        case 'long_distance':
            return {
                gradient: "from-stone-50 via-neutral-50 to-gray-50 dark:from-stone-950 dark:via-neutral-950 dark:to-gray-950",
                accent: "text-stone-500 dark:text-stone-400",
                bgAccent: "bg-stone-100 dark:bg-stone-800",
                borderAccent: "border-stone-200 dark:border-stone-700",
                stroke: "#A8A29E", // Stone 400
                fillChart: "#E7E5E4",
                labels: { rhythm: "Gejolak Hubungan", phases: "Fase Pasang Surut", balance: "Ketimpangan", reflection: "Closure & Refleksi" }
            };

        default:
            return defaultConfig;
    }
};

// --- Custom Chart Tooltip ---
const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const dateStr = new Date(label).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        const breakdown = data.breakdown || {};
        // Sort breakdown to find top sender
        const sortedSenders = Object.entries(breakdown).sort((a: any, b: any) => b[1] - a[1]);
        const topSender = sortedSenders.length > 0 ? sortedSenders[0] : null;

        return (
            <div className="bg-white/95 dark:bg-stone-900/95 p-4 rounded-xl shadow-xl border border-stone-100 dark:border-stone-700 backdrop-blur-sm min-w-[200px] z-50">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-stone-100 dark:border-stone-700">
                    <Calendar size={14} className="text-stone-400" />
                    <p className="text-xs font-bold text-stone-600 dark:text-stone-300">{dateStr}</p>
                </div>
                <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-2xl font-bold text-stone-800 dark:text-white">{data.count}</span>
                    <span className="text-xs text-stone-500 font-medium">pesan total</span>
                </div>

                {topSender && (
                    <div className="text-xs bg-stone-50 dark:bg-stone-800 rounded-lg p-2">
                        <span className="text-stone-400 block text-[10px] uppercase tracking-wider mb-1">Paling Aktif</span>
                        <span className="font-bold text-stone-700 dark:text-stone-200">{(topSender as any)[0]}</span>
                        <span className="text-stone-400 ml-1">({(topSender as any)[1]} pesan)</span>
                    </div>
                )}
            </div>
        );
    }
    return null;
};

const TypewriterText = ({ text, onComplete, speed = 10 }: { text: string; onComplete?: () => void; speed?: number }) => {
    const [displayedText, setDisplayedText] = useState('');
    const indexRef = useRef(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (indexRef.current >= text.length && text === displayedText) return;
        if (text !== displayedText && indexRef.current === 0) {
            setDisplayedText('');
            setIsComplete(false);
        }
    }, [text]);

    useEffect(() => {
        if (isComplete) return;
        const timer = setInterval(() => {
            if (indexRef.current < text.length) {
                setDisplayedText((prev) => prev + text.charAt(indexRef.current));
                indexRef.current += 1;
            } else {
                clearInterval(timer);
                setIsComplete(true);
                if (onComplete) onComplete();
            }
        }, speed);
        return () => clearInterval(timer);
    }, [text, onComplete, isComplete, speed]);

    return (
        <div className={`markdown-content leading-relaxed ${!isComplete ? 'typing-cursor' : ''}`}>
            <ReactMarkdown
                components={{
                    strong: ({ node, ...props }) => <span className="font-bold text-stone-900 dark:text-stone-100" {...props} />,
                    em: ({ node, ...props }) => <span className="italic text-stone-700 dark:text-stone-300" {...props} />,
                    p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                }}
            >
                {displayedText}
            </ReactMarkdown>
        </div>
    );
};

const Footer = ({ setAppState }: { setAppState: (state: AppState) => void }) => (
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mt-auto py-8 text-center text-xs text-txt-sub dark:text-stone-500 border-t border-stone-100 dark:border-stone-800 w-full bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm">
        <div className="flex justify-center gap-6 mb-4 font-medium">
            <button onClick={() => setAppState(AppState.ABOUT_WEBSITE)} className="hover:text-pastel-primary transition-colors">Tentang Website</button>
            <span className="opacity-30">|</span>
            <button onClick={() => setAppState(AppState.ABOUT_CREATOR)} className="hover:text-pastel-primary transition-colors">Tentang Pembuat</button>
            <span className="opacity-30">|</span>
            <button className="hover:text-pastel-primary transition-colors">Privacy Policy</button>
        </div>
        <div className="flex flex-col items-center gap-2">
            <p className="opacity-70 font-heading tracking-wider">Dibuat oleh ACKMAD ELFAN PURNAMA - SEJAK 2026</p>
            <span className="px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-[10px] font-mono opacity-60">{APP_VERSION}</span>
        </div>
    </motion.div>
);

const ThemeToggle = ({ isDarkMode, toggleTheme }: { isDarkMode: boolean, toggleTheme: () => void }) => (
    <button onClick={toggleTheme} className="p-2 rounded-full bg-white/50 dark:bg-stone-800/50 hover:bg-white dark:hover:bg-stone-700 transition-all text-txt-main dark:text-stone-300 border border-stone-200 dark:border-stone-700 shadow-sm z-50">
        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
    </button>
);

// --- Cute Loading & Status Component ---
const LoadingScreen = ({
    isAnalysisComplete,
    onTransitionDone,
    logs,
    errorDetails
}: {
    isAnalysisComplete: boolean,
    onTransitionDone: () => void,
    logs: string[],
    errorDetails: { userMsg: string, technicalMsg: string } | null
}) => {
    const [progress, setProgress] = useState(0);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showTechDetails, setShowTechDetails] = useState(false);

    // Auto scroll logs
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    useEffect(() => {
        let interval: any;
        if (progress < 90 && !isAnalysisComplete && !errorDetails) {
            interval = setInterval(() => {
                setProgress(prev => prev + (Math.random() * 1.5));
            }, 200);
        } else if (isAnalysisComplete && progress < 100) {
            interval = setInterval(() => {
                setProgress(prev => Math.min(100, prev + 5));
            }, 50);
        }
        return () => clearInterval(interval);
    }, [progress, isAnalysisComplete, errorDetails]);

    useEffect(() => {
        if (progress >= 100) {
            setTimeout(() => {
                setIsFadingOut(true);
                setTimeout(onTransitionDone, 1000);
            }, 800);
        }
    }, [progress, onTransitionDone]);

    if (errorDetails) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-950 p-6">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-stone-800 p-8 rounded-3xl shadow-xl max-w-lg w-full border border-red-100 dark:border-red-900/30 text-center">
                    <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                        <XCircle size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-2">Ups, ada kendala.</h2>
                    <p className="text-stone-600 dark:text-stone-400 mb-6">{errorDetails.userMsg}</p>

                    <div className="text-left mb-6">
                        <button onClick={() => setShowTechDetails(!showTechDetails)} className="text-xs flex items-center gap-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors mb-2">
                            <Info size={12} /> {showTechDetails ? "Sembunyikan Detail Teknis" : "Lihat Detail Error (Untuk Developer)"}
                        </button>
                        {showTechDetails && (
                            <div className="bg-stone-100 dark:bg-black/30 p-3 rounded-lg border border-stone-200 dark:border-stone-700">
                                <code className="text-[10px] text-red-600 dark:text-red-400 font-mono break-all block">
                                    {errorDetails.technicalMsg}
                                </code>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 justify-center">
                        <Button variant="ghost" onClick={() => window.location.reload()}>Kembali</Button>
                        <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-pastel-lavender to-pastel-peach dark:from-stone-950 dark:to-neutral-900 transition-colors duration-1000 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
            <div className="relative z-10 text-center w-full max-w-md px-8 flex flex-col items-center">
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="mb-8 relative"
                >
                    <div className="w-24 h-24 bg-white dark:bg-stone-800 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-stone-700">
                        <Bot size={48} className="text-pastel-primary" />
                    </div>
                </motion.div>

                <h2 className="text-2xl font-heading font-bold text-stone-700 dark:text-stone-200 mb-2">AI Sedang Bekerja...</h2>
                <p className="text-stone-500 dark:text-stone-400 text-sm mb-6">Jangan tutup halaman ini ya.</p>

                <div className="relative w-full h-4 bg-white/40 dark:bg-stone-900/40 rounded-full overflow-hidden shadow-inner mb-2">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full h-full -translate-x-full animate-[shimmer_2s_infinite]"></div>
                    <motion.div
                        className="h-full bg-gradient-to-r from-pastel-primary to-pastel-primaryHover rounded-full relative"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                    />
                </div>
                <div className="flex justify-end w-full mb-8">
                    <span className="text-xs font-bold text-pastel-primary">{Math.floor(progress)}%</span>
                </div>

                {/* System Log Indicator */}
                <div className="w-full bg-black/80 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-2xl text-left overflow-hidden flex flex-col">
                    <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
                        <Terminal size={14} className="text-emerald-400" />
                        <span className="text-[10px] font-bold text-stone-300 uppercase tracking-wider">System Log</span>
                        <div className="ml-auto flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                            <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        </div>
                    </div>
                    <div ref={scrollRef} className="h-24 overflow-y-auto font-mono text-[10px] space-y-1 pr-2 scrollbar-thin scrollbar-thumb-stone-600">
                        {logs.length === 0 && <span className="text-stone-500 animate-pulse">Waiting for process...</span>}
                        {logs.map((log, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex gap-2"
                            >
                                <span className="text-stone-500">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                                <span className={log.includes('Error') || log.includes('Gagal') ? 'text-red-400' : 'text-emerald-300'}>
                                    {log.startsWith('>') ? log.substring(1) : log}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

// --- Story Viewer Component ---
const StoryViewer = ({ analysis, onClose }: { analysis: AnalysisResult, onClose: () => void }) => {
    const [index, setIndex] = useState(0);
    const slides = [
        { type: 'intro', title: analysis.storyTitle, content: analysis.summary ? analysis.summary.split('.')[0] + '.' : '' },
        { type: 'phases', title: "Perjalanan Waktu", content: `Kalian melewati ${analysis.phases?.length || 0} fase berbeda.` },
        ...(analysis.keyMoments || []).slice(0, 3).map(m => ({ type: 'moment', title: "Sebuah Momen", content: m })),
        { type: 'topic', title: "Sering Dibahas", content: (analysis.dominantTopics || []).slice(0, 3).map(t => t.name).join(', ') },
        { type: 'reflection', title: "Refleksi", content: analysis.reflection ? analysis.reflection.split('.')[0] + '.' : '' }
    ];

    const handleNext = () => { if (index < slides.length - 1) setIndex(index + 1); else onClose(); };
    const handlePrev = () => { if (index > 0) setIndex(index - 1); };

    return (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl flex items-center justify-center p-0 md:p-4">
            <div className="w-full h-full md:max-w-md md:h-[90vh] md:rounded-[2rem] bg-stone-900 overflow-hidden relative shadow-2xl border-0 md:border border-stone-800 flex flex-col">
                {/* Progress Bar */}
                <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
                    {slides.map((_, i) => (
                        <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: i <= index ? '100%' : '0%' }} className="h-full bg-white transition-all duration-300" />
                        </div>
                    ))}
                </div>
                <button onClick={onClose} className="absolute top-8 right-4 z-20 text-white/70 hover:text-white p-2">✕</button>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col items-center justify-center text-center p-8 text-white relative z-0"
                    >
                        <div className="mb-8">
                            {slides[index].type === 'intro' && <Sparkles className="w-16 h-16 text-yellow-300 animate-pulse" />}
                            {slides[index].type === 'phases' && <Hourglass className="w-16 h-16 text-blue-300" />}
                            {slides[index].type === 'moment' && <Calendar className="w-16 h-16 text-pink-300" />}
                            {slides[index].type === 'topic' && <MessageCircle className="w-16 h-16 text-green-300" />}
                            {slides[index].type === 'reflection' && <Feather className="w-16 h-16 text-purple-300" />}
                        </div>

                        <h2 className="text-2xl font-bold mb-6 font-heading px-4">{slides[index].type === 'moment' ? (slides[index].content as any).title : slides[index].title}</h2>

                        {slides[index].type === 'moment' ? (
                            <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm mx-2">
                                <p className="text-lg leading-relaxed mb-2">"{(slides[index].content as any).description}"</p>
                                <p className="text-xs opacity-60 uppercase tracking-widest mt-4">{(slides[index].content as any).date}</p>
                            </div>
                        ) : (
                            <p className="text-xl leading-relaxed font-light px-2 opacity-90">{slides[index].content as string}</p>
                        )}

                        {slides[index].type === 'reflection' && (
                            <Button className="mt-12 bg-white text-black hover:bg-stone-200" onClick={onClose}>Lihat Album Lengkap</Button>
                        )}
                    </motion.div>
                </AnimatePresence>

                <div className="absolute inset-0 flex z-10">
                    <div className="w-1/3 h-full" onClick={handlePrev}></div>
                    <div className="w-2/3 h-full" onClick={handleNext}></div>
                </div>
            </div>
        </div>
    );
};

// --- Main App Component ---

const App: React.FC = () => {
    const [appState, setAppState] = useState<AppState>(AppState.LANDING);
    const [chatData, setChatData] = useState<ChatData | null>(null);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [errorDetails, setErrorDetails] = useState<{ userMsg: string, technicalMsg: string } | null>(null);
    const [showStory, setShowStory] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [chatFontSize, setChatFontSize] = useState(14);
    const [chatSession, setChatSession] = useState<ChatSession | null>(null);
    const [conversation, setConversation] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
    const [aiStatusLogs, setAiStatusLogs] = useState<string[]>([]);

    const chatEndRef = useRef<HTMLDivElement>(null);
    const [evidenceMessages, setEvidenceMessages] = useState<Message[]>([]);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            document.body.style.backgroundColor = '#0c0a09'; // stone-950
        } else {
            document.documentElement.classList.remove('dark');
            document.body.style.backgroundColor = '#FFFDFB'; // pastel-bgStart
        }
    }, [isDarkMode]);

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    // Helper to add logs safely
    const addStatusLog = (log: string) => {
        setAiStatusLogs(prev => [...prev, log]);
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (file.type !== "text/plain") {
            setErrorDetails({ userMsg: "Format file salah.", technicalMsg: "Expected text/plain, got " + file.type });
            return;
        }

        setAppState(AppState.PROCESSING);
        setIsAnalysisComplete(false);
        setErrorDetails(null);
        setAiStatusLogs([]); // Reset logs

        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target?.result as string;
            try {
                addStatusLog("📂 Membaca file chat lokal...");
                const parsedData = parseWhatsAppChat(text);

                if (parsedData.totalMessages === 0) {
                    throw { userMsg: "File chat kosong atau format tidak dikenali.", technicalMsg: "Parsed 0 messages. Regex mismatch." };
                }
                addStatusLog(`✅ Chat terbaca: ${parsedData.totalMessages} pesan`);
                setChatData(parsedData);

                // Pick random messages for evidence snippet
                if (parsedData.messages.length > 5) {
                    const startIdx = Math.floor(Math.random() * (parsedData.messages.length - 5));
                    setEvidenceMessages(parsedData.messages.slice(startIdx, startIdx + 3));
                }

                // Perform analysis on client-side using API Key with Status Callback
                const result = await analyzeChatWithGemini(parsedData.messages, addStatusLog);

                setAnalysis(result);
                setChatSession(createChatSession(parsedData.messages));

                setIsAnalysisComplete(true);
            } catch (err: any) {
                console.error(err);
                // If error thrown is our structured error
                if (err.userMsg) {
                    setErrorDetails(err);
                } else {
                    setErrorDetails({
                        userMsg: "Gagal memproses data.",
                        technicalMsg: err.message || JSON.stringify(err)
                    });
                }
                // Keep user on PROCESSING state to show error UI
            }
        };
        reader.readAsText(file);
    };

    const onLoadingTransitionDone = () => {
        setAppState(AppState.INSIGHTS);
        setShowStory(true);
    };

    const handleSendMessage = async () => {
        if (!userInput.trim() || !chatSession) return;
        const currentMsg = userInput;
        setUserInput('');
        setConversation(prev => [...prev, { role: 'user', text: currentMsg }]);
        setIsTyping(true);
        try {
            const result = await chatSession.sendMessage(currentMsg);
            const text = result.response.text();
            setConversation(prev => [...prev, { role: 'model', text }]);
        } catch (e) {
            setConversation(prev => [...prev, { role: 'model', text: "Terjadi kesalahan koneksi." }]);
        } finally { setIsTyping(false); }
    };

    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [conversation, isTyping]);

    const PageWrapper = ({ children, title }: { children: React.ReactNode, title?: string }) => (
        <Layout title={title} className="flex flex-col min-h-screen">
            <div className="absolute top-4 right-4 z-50"><ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} /></div>
            <div className="flex-1 w-full flex flex-col items-center">
                {children}
            </div>
            <Footer setAppState={setAppState} />
        </Layout>
    );

    // --- Views ---

    const renderLanding = () => (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950 flex flex-col relative overflow-hidden transition-colors duration-500">
            <div className="absolute top-4 right-4 z-50"><ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} /></div>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 text-center z-10 max-w-5xl mx-auto">
                {/* Floating Elements */}
                <motion.div animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="absolute top-20 left-10 text-pastel-primary opacity-50 hidden md:block"><MessageCircle size={48} /></motion.div>
                <motion.div animate={{ y: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }} className="absolute bottom-20 right-10 text-pastel-card opacity-50 hidden md:block"><Heart size={48} /></motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 inline-block">
                    <span className="px-4 py-1.5 rounded-full bg-white/60 dark:bg-stone-800/60 border border-pastel-primary/30 text-pastel-primary text-sm font-bold shadow-sm backdrop-blur-sm">
                        ✨ Ruang Refleksi Digital
                    </span>
                </motion.div>

                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-bold text-stone-800 dark:text-stone-100 font-heading mb-6 leading-tight">
                    Chat kamu kepanjangan?<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-pastel-primary to-pink-400">Biar Recap Chat yang rangkum.</span>
                </motion.h1>

                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-xl text-stone-500 dark:text-stone-400 font-light max-w-2xl mx-auto mb-4 leading-relaxed">
                    Recap Chat membantu kamu membaca ulang percakapan WhatsApp dengan cara yang lebih rapi, jelas, dan mendalam. Upload file chat, lihat rangkuman topik, timeline, emosi, dan pola komunikasi — lalu tanya AI apa pun tentang isi percakapannya.
                </motion.p>

                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="text-sm font-medium text-stone-400 dark:text-stone-500 mb-10">
                    Bukan menebak. Bukan ngarang. Semua berdasarkan isi chat kamu sendiri.
                </motion.p>

                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="flex flex-col md:flex-row gap-4 justify-center items-center">
                    <Button onClick={() => setAppState(AppState.UPLOAD)} className="px-10 py-5 text-xl shadow-xl shadow-pastel-primary/30 hover:shadow-pastel-primary/50 relative overflow-hidden group">
                        <span className="relative z-10 flex items-center gap-3">🚀 Mulai Recap Sekarang <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" /></span>
                    </Button>
                    <button onClick={() => setAppState(AppState.ABOUT_WEBSITE)} className="text-stone-500 dark:text-stone-400 hover:text-pastel-primary transition-colors text-sm font-bold flex items-center gap-2">
                        📌 Lihat Cara Kerja
                    </button>
                </motion.div>
            </section>

            {/* Problem Section */}
            <section className="py-20 px-4 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-stone-800 dark:text-stone-100 mb-6 font-heading">Kadang kita gak lupa…<br />kita cuma capek scroll.</h2>
                    <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed max-w-2xl mx-auto">
                        Pernah gak sih kamu pengen ngerti hubungan kamu sama seseorang sebenarnya kayak gimana, tapi chat-nya udah ribuan? Mau cari momen penting, tapi scroll terus capek. Mau inget kapan mulai berubah, tapi udah tenggelam di tumpukan chat.
                        <br /><br />
                        Recap Chat dibuat buat itu. Biar kamu gak perlu baca semuanya dari awal, tapi tetap bisa memahami isi percakapannya dengan cara yang jelas.
                    </p>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 bg-white/80 dark:bg-stone-950/80">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-stone-800 dark:text-stone-100 mb-12 font-heading">Recap Chat bukan sekadar rangkuman.<br /><span className="text-pastel-primary">Ini peta percakapan.</span></h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { title: "📊 Ringkasan Topik Percakapan", desc: "Lihat chat kalian paling sering bahas apa: sekolah, kerja, candaan, konflik, atau hal random lainnya." },
                            { title: "🕒 Timeline Chat yang Jelas", desc: "Kamu bisa lihat kapan chat rame banget, kapan mulai jarang, dan kapan percakapan berubah." },
                            { title: "😊 Analisis Emosi & Mood", desc: "Bukan lebay, tapi cukup untuk memberi gambaran: chat kalian dominan hangat, tegang, awkward, atau netral." },
                            { title: "⚖️ Balance Chat", desc: "Siapa yang lebih sering mulai chat duluan? Siapa yang paling banyak ngomong? Siapa yang lebih cepat membalas?" },
                            { title: "🧠 Tanya AI Lebih Dalam", desc: "Kamu bebas tanya apa pun, misalnya: 'Kenapa di fase ini chat jadi dingin?', 'Topik apa yang bikin suasana berubah?', dll." }
                        ].map((feature, i) => (
                            <motion.div whileHover={{ scale: 1.02 }} key={i} className={`p-8 rounded-3xl flex flex-col items-center text-center shadow-sm border border-stone-100 dark:border-stone-700 bg-white dark:bg-stone-800`}>
                                <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-3">{feature.title}</h3>
                                <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Example Questions Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-stone-800 dark:text-stone-100 mb-10 font-heading">Kamu bisa nanya apa aja. Serius.</h2>

                    <div className="flex flex-wrap justify-center gap-4 mb-10">
                        {[
                            "💬 “Di fase mana chat ini mulai berubah?”",
                            "💬 “Topik apa yang paling sering muncul?”",
                            "💬 “Kenapa setelah tanggal itu chat jadi dingin?”",
                            "💬 “Siapa yang lebih sering effort duluan?”",
                            "💬 “Ada momen yang terasa awkward gak?”",
                            "💬 “Apa yang paling sering bikin salah paham?”"
                        ].map((q, i) => (
                            <div key={i} className="bg-white dark:bg-stone-800 px-6 py-3 rounded-full shadow-sm text-stone-600 dark:text-stone-300 border border-stone-100 dark:border-stone-700 text-sm italic">
                                {q}
                            </div>
                        ))}
                    </div>

                    <p className="text-stone-500 dark:text-stone-400 text-sm">AI akan menjawab berdasarkan isi chat kamu.<br />Bukan menebak-nebak. Bukan mengarang.</p>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 px-4 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-stone-800 dark:text-stone-100 font-heading">Cuma 3 langkah. Gak ribet.</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Smartphone, title: "1) Export chat WhatsApp", desc: "User export chat WhatsApp dalam format .txt (tanpa media agar proses lebih cepat)." },
                            { icon: Upload, title: "2) Upload ke Recap Chat", desc: "User upload file chat ke website melalui drag & drop atau klik upload." },
                            { icon: BookOpen, title: "3) Lihat recap + tanya AI", desc: "Website menampilkan ringkasan chat dalam bentuk data visual, lalu user bisa tanya AI secara bebas." }
                        ].map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="bg-white dark:bg-stone-800 p-8 rounded-3xl shadow-lg shadow-purple-100/50 dark:shadow-none border border-stone-100 dark:border-stone-700 text-center group hover:-translate-y-2 transition-transform duration-300"
                            >
                                <div className="w-16 h-16 mx-auto bg-pastel-secondary dark:bg-stone-700 rounded-2xl flex items-center justify-center text-pastel-secondaryText mb-6 group-hover:scale-110 transition-transform">
                                    <step.icon size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-3">{step.title}</h3>
                                <p className="text-stone-500 dark:text-stone-400 text-sm">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust & Privacy Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto bg-gradient-to-r from-white to-purple-50 dark:from-stone-800 dark:to-stone-800/80 p-10 md:p-16 rounded-[3rem] shadow-xl border border-white dark:border-stone-700 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-pastel-primary/10 rounded-full blur-3xl pointer-events-none"></div>

                    <ShieldCheck size={64} className="text-emerald-400 mx-auto mb-6" />
                    <h2 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-6 font-heading">Privasi itu serius. Dan Recap Chat paham itu.</h2>
                    <p className="text-lg text-stone-600 dark:text-stone-300 mb-8 leading-relaxed max-w-2xl mx-auto">
                        Chat itu adalah data pribadi dan tidak boleh diperlakukan sembarangan.
                        Recap Chat dibuat dengan prinsip bahwa file kamu hanya dipakai untuk analisis sementara, bukan disimpan untuk jangka panjang.
                    </p>

                    <div className="flex flex-col gap-3 max-w-md mx-auto mb-8 text-left">
                        <div className="flex items-center gap-3 text-stone-600 dark:text-stone-300 text-sm"><CheckCircle size={16} className="text-emerald-500" /> File chat tidak disimpan permanen</div>
                        <div className="flex items-center gap-3 text-stone-600 dark:text-stone-300 text-sm"><CheckCircle size={16} className="text-emerald-500" /> Tidak ada database untuk menyimpan isi chat</div>
                        <div className="flex items-center gap-3 text-stone-600 dark:text-stone-300 text-sm"><CheckCircle size={16} className="text-emerald-500" /> Data hanya aktif selama sesi berlangsung</div>
                        <div className="flex items-center gap-3 text-stone-600 dark:text-stone-300 text-sm"><CheckCircle size={16} className="text-emerald-500" /> Setelah sesi selesai, data otomatis hilang</div>
                        <div className="flex items-center gap-3 text-stone-600 dark:text-stone-300 text-sm"><CheckCircle size={16} className="text-emerald-500" /> User bisa menghapus sesi kapan saja</div>
                    </div>

                    <p className="text-stone-500 text-sm font-medium">Recap Chat tidak menyimpan cerita kamu. Recap Chat hanya membantu kamu memahaminya.</p>
                </div>
            </section>

            {/* Closing CTA */}
            <section className="py-20 px-4 text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-stone-800 dark:text-stone-100 mb-6 font-heading">Siap lihat isi chat kamu dari sudut pandang yang lebih jelas?</h2>
                    <p className="text-xl text-stone-600 dark:text-stone-400 mb-10 leading-relaxed">
                        Lihat rangkuman topik, timeline, emosi, dan pola komunikasi — lalu tanya AI apa pun tentang isi percakapannya.
                    </p>
                    <Button onClick={() => setAppState(AppState.UPLOAD)} className="px-10 py-4 text-lg shadow-xl">
                        ✨ Mulai Recap Sekarang
                    </Button>
                </div>
            </section>

            <Footer setAppState={setAppState} />

            {/* Sticky CTA */}
            <motion.div initial={{ y: 100 }} animate={{ y: 0 }} transition={{ delay: 2 }} className="fixed bottom-6 right-6 z-40">
                <Button onClick={() => setAppState(AppState.UPLOAD)} className="shadow-2xl !px-6 !py-3 !rounded-full text-sm">
                    Mulai Recap Sekarang
                </Button>
            </motion.div>
        </div>
    );

    const renderStudio = () => (
        <Layout title="Mulai Analisis Chat Kamu" className="flex flex-col min-h-screen">
            <div className="absolute top-4 right-4 z-50"><ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} /></div>

            <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col items-center">
                <div className="text-center mb-10">
                    <p className="text-stone-500 dark:text-stone-400">Upload file chat WhatsApp, lalu Recap Chat akan menyusun rangkuman dan insight dari percakapan tersebut.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 w-full">
                    {/* Left: Tutorial Wizard */}
                    <div className="bg-white/70 dark:bg-stone-800/70 backdrop-blur-md p-8 rounded-3xl border border-white dark:border-stone-700 shadow-sm h-fit">
                        <div className="flex items-center gap-3 mb-6">
                            <BookOpen className="text-pastel-primary" />
                            <h3 className="font-bold text-lg text-stone-800 dark:text-stone-200">Cara Export Chat</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-4 border-b border-stone-200 dark:border-stone-700 pb-4">
                                <div className="flex-1 text-center">
                                    <h4 className="font-bold text-stone-800 dark:text-stone-200 text-sm mb-2">Android / iOS</h4>
                                    <ol className="text-left text-sm text-stone-600 dark:text-stone-400 space-y-2 list-decimal pl-4">
                                        <li>Buka chat di WhatsApp.</li>
                                        <li>Klik nama kontak / titik tiga di pojok kanan.</li>
                                        <li>Pilih <strong>More &gt; Export Chat</strong>.</li>
                                        <li>Pilih <strong>Without Media</strong> (Penting!).</li>
                                        <li>Simpan file .txt ke HP/Laptop kamu.</li>
                                    </ol>
                                </div>
                            </div>
                            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-900/30 flex gap-3">
                                <Info className="text-amber-500 shrink-0" size={20} />
                                <p className="text-xs text-amber-700 dark:text-amber-400">Tips: pilih export <strong>tanpa media</strong> supaya proses lebih cepat.</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Upload Area */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-white/70 dark:bg-stone-800/70 backdrop-blur-md p-8 rounded-3xl border border-white dark:border-stone-700 shadow-sm flex-1 flex flex-col justify-center text-center relative group hover:border-pastel-primary transition-all">
                            <input type="file" accept=".txt" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                            <div className="w-20 h-20 bg-stone-100 dark:bg-stone-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-inner">
                                <Upload className="text-stone-400 group-hover:text-pastel-primary" size={32} />
                            </div>
                            <h3 className="font-bold text-stone-800 dark:text-stone-200 mb-1">📂 Drop file chat kamu di sini</h3>
                            <p className="text-xs text-stone-500 mb-6">atau klik untuk upload (.txt)</p>

                            <div className="flex items-center justify-center gap-2 text-[10px] text-stone-400 uppercase tracking-widest font-bold">
                                ✨ Scan & Buat Recap
                            </div>
                        </div>

                        {errorDetails && errorDetails.userMsg && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-100 dark:border-red-900/30 text-center">
                                {errorDetails.userMsg}
                            </motion.div>
                        )}

                        <p className="text-[10px] text-stone-400 text-center">Chat kamu hanya diproses sementara selama sesi ini. Tidak disimpan permanen.</p>
                    </div>
                </div>
            </div>
            <Footer setAppState={setAppState} />
        </Layout>
    );

    const renderInsights = () => {
        if (!chatData || !analysis) return null;

        const startDate = chatData.dateRange.start?.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
        const endDate = chatData.dateRange.end?.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

        // Get Adaptive Theme based on Relationship Type
        const theme = getThemeConfig(analysis.relationshipType);

        return (
            <div className={`min-h-screen bg-gradient-to-b ${theme.gradient} pb-20 font-sans relative transition-colors duration-1000`}>
                <div className="absolute inset-0 pointer-events-none z-0 bg-noise opacity-30 mix-blend-overlay fixed"></div>
                <div className="absolute top-4 right-4 z-50"><ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} /></div>

                {showStory && <StoryViewer analysis={analysis} onClose={() => setShowStory(false)} />}

                {/* --- BAGIAN 1: PEMBUKA (Header Emosional & Overview) --- */}
                <div className="pt-20 pb-12 px-4 relative z-10">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center">

                        {/* Adaptive Participant Header */}
                        <div className="mb-6 flex justify-center">
                            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/50 dark:bg-black/20 rounded-full backdrop-blur-sm border border-white/30 dark:border-white/10 shadow-sm">
                                <Users size={16} className={theme.accent} />
                                <span className="text-sm font-medium text-stone-600 dark:text-stone-300">
                                    Percakapan antara <strong className="text-stone-800 dark:text-stone-100">{chatData.participants[0] || "Kamu"}</strong> & <strong className="text-stone-800 dark:text-stone-100">{chatData.participants[1] || "Dia"}</strong>
                                </span>
                            </div>
                        </div>

                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs font-bold text-txt-sub dark:text-stone-400 mb-6 cursor-help" title={`Confidence: ${analysis.aiConfidence}`}>
                            <div className={`w-2 h-2 rounded-full ${analysis.aiConfidence === 'high' ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                            AI Confidence: {analysis.aiConfidence.toUpperCase()}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-txt-main dark:text-stone-100 mb-4 tracking-tight leading-snug font-heading">{analysis.storyTitle}</h1>
                        <p className="text-lg text-txt-sub dark:text-stone-400 max-w-2xl mx-auto font-light leading-relaxed mb-8">"{analysis.summary}"</p>

                        {/* Basic Stats Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
                            {[
                                { label: "Mulai", val: startDate, icon: Calendar },
                                { label: "Sampai", val: endDate, icon: ArrowRight },
                                { label: "Durasi", val: chatData.durationString, icon: Clock },
                                { label: "Total Pesan", val: chatData.totalMessages.toLocaleString(), icon: MessageCircle },
                            ].map((s, i) => (
                                <div key={i} className={`bg-white/60 dark:bg-stone-800/60 p-4 rounded-2xl border ${theme.borderAccent} text-center`}>
                                    <s.icon className={`w-4 h-4 mx-auto mb-2 ${theme.accent}`} />
                                    <div className="text-xs text-txt-sub dark:text-stone-500 uppercase tracking-wider">{s.label}</div>
                                    <div className="font-bold text-stone-700 dark:text-stone-200 text-sm mt-1">{s.val}</div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8">
                            <button onClick={() => setShowStory(true)} className={`inline-flex items-center gap-2 px-6 py-2.5 text-white rounded-full font-bold shadow-lg transition-all text-sm ${theme.bgAccent} ${theme.accent} bg-opacity-100`}>
                                {/* Button styling hack: using bgAccent usually gives light bg, override with manual colors or use theme specific buttons */}
                                <div className={`absolute inset-0 rounded-full opacity-20 ${theme.bgAccent}`}></div>
                                <span className="relative z-10 flex items-center gap-2 text-stone-800 dark:text-stone-200"><Sparkles size={16} /> Buka Story Highlight</span>
                            </button>
                        </div>
                    </motion.div>
                </div>

                <div className="max-w-4xl mx-auto px-4 space-y-20 relative z-10">

                    {/* --- BAGIAN 2: POLA BESAR (Visual Charts & Phases) --- */}
                    <section>
                        <div className="text-center mb-10">
                            <h2 className="text-2xl font-bold text-txt-main dark:text-stone-200 font-heading">{theme.labels.rhythm}</h2>
                            <p className="text-sm text-txt-sub dark:text-stone-400">Setiap hubungan punya detak jantungnya sendiri.</p>
                        </div>

                        {/* Rhythm Chart with Improved Tooltip */}
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`bg-white/60 dark:bg-stone-800/60 p-6 rounded-3xl border ${theme.borderAccent} h-72 mb-12`}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chatData.dailyDistribution}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={theme.stroke} stopOpacity={0.3} />
                                            <stop offset="95%" stopColor={theme.stroke} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    {/* Updated Custom Tooltip */}
                                    <Tooltip content={<CustomChartTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="count"
                                        stroke={theme.stroke}
                                        fillOpacity={1}
                                        fill="url(#colorCount)"
                                        strokeWidth={2}
                                        activeDot={{ r: 6, fill: theme.stroke, stroke: 'white', strokeWidth: 2 }}
                                    />
                                    <XAxis dataKey="date" hide />
                                </AreaChart>
                            </ResponsiveContainer>
                        </motion.div>

                        {/* Redesigned Phases Timeline (Vertical) */}
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mx-auto">
                            <div className="text-center mb-8">
                                <h3 className="font-bold text-lg text-txt-main dark:text-stone-200">{theme.labels.phases}</h3>
                            </div>

                            <div className="relative pl-8 border-l-2 border-dashed border-stone-200 dark:border-stone-700 space-y-10">
                                {analysis.phases?.map((phase, i) => (
                                    <div key={i} className="relative">
                                        {/* Dot */}
                                        <div className={`absolute -left-[41px] top-1 w-6 h-6 rounded-full border-4 border-white dark:border-stone-900 ${phase.mood === 'warm' ? 'bg-orange-400' :
                                            phase.mood === 'cold' ? 'bg-blue-400' :
                                                phase.mood === 'tense' ? 'bg-red-400' : 'bg-stone-400'
                                            } shadow-sm z-10`}></div>

                                        <div className={`bg-white/70 dark:bg-stone-800/70 p-6 rounded-2xl border ${theme.borderAccent} shadow-sm hover:shadow-md transition-shadow`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-lg text-stone-800 dark:text-stone-200">{phase.name}</h4>
                                                <span className="text-[10px] font-bold uppercase tracking-wider bg-white dark:bg-stone-900 px-2 py-1 rounded text-stone-500 border border-stone-100 dark:border-stone-700">{phase.period}</span>
                                            </div>
                                            <p className="text-sm opacity-80 leading-relaxed text-stone-600 dark:text-stone-400 mb-3">{phase.description}</p>
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${phase.mood === 'warm' ? 'bg-orange-400' :
                                                    phase.mood === 'cold' ? 'bg-blue-400' :
                                                        phase.mood === 'tense' ? 'bg-red-400' : 'bg-stone-400'
                                                    }`}></span>
                                                <span className="text-xs font-medium capitalize opacity-60 text-stone-600 dark:text-stone-300">{phase.mood}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </section>

                    {/* --- BAGIAN 3: DETAIL HUBUNGAN (Styles & Patterns) --- */}
                    <section className="grid md:grid-cols-2 gap-6">
                        {/* Silence & Gaps */}
                        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className={`bg-white/60 dark:bg-stone-800/60 p-6 rounded-3xl border ${theme.borderAccent}`}>
                            <div className="flex items-center gap-3 mb-6">
                                <Hourglass className="text-blue-400" />
                                <h3 className="text-lg font-bold text-txt-main dark:text-stone-200">Jeda & Keheningan</h3>
                            </div>
                            {chatData.silencePeriods.length > 0 ? (
                                <div className="space-y-4">
                                    {chatData.silencePeriods.slice(0, 3).map((silence, i) => (
                                        <div key={i} className="flex items-center gap-4 p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl">
                                            <div className="font-bold text-xl text-blue-500 w-12 text-center">{silence.durationDays}h</div>
                                            <div className="flex-1 text-xs">
                                                <div className="text-stone-600 dark:text-stone-300">Hening selama {silence.durationDays} hari</div>
                                                <div className="opacity-50 text-stone-500">{silence.startDate.toLocaleDateString()}</div>
                                            </div>
                                            <div className="text-[10px] text-right">
                                                <div className="opacity-50 text-stone-500">Comeback:</div>
                                                <div className="font-bold text-blue-600 dark:text-blue-400">{silence.breaker}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-center py-8 opacity-60 text-stone-500">Tidak ada jeda panjang yang signifikan.</p>
                            )}
                        </motion.div>

                        {/* Balance Meter */}
                        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className={`bg-white/60 dark:bg-stone-800/60 p-6 rounded-3xl border ${theme.borderAccent} flex flex-col justify-center`}>
                            <div className="flex items-center gap-3 mb-2">
                                <Scale className="text-green-400" />
                                <h3 className="text-lg font-bold text-txt-main dark:text-stone-200">{theme.labels.balance}</h3>
                            </div>
                            <p className="text-xs text-txt-sub dark:text-stone-500 mb-8">Siapa yang lebih sering mengirim pesan?</p>

                            <div className="relative mb-6 px-4">
                                <div className="h-4 bg-stone-100 dark:bg-stone-700 rounded-full w-full relative overflow-hidden">
                                    <div className={`absolute inset-0 bg-gradient-to-r ${theme.gradient} opacity-50`}></div>
                                </div>
                                {/* Marker */}
                                <motion.div
                                    initial={{ left: '50%' }}
                                    whileInView={{ left: `${chatData.balanceScore}%` }}
                                    transition={{ type: 'spring', stiffness: 50, delay: 0.2 }}
                                    className="absolute -top-1 w-6 h-6 bg-white dark:bg-stone-200 border-2 border-stone-300 dark:border-stone-600 shadow-md rounded-full transform -translate-x-1/2 z-10"
                                />
                            </div>
                            <div className="flex justify-between text-sm font-bold text-txt-main dark:text-stone-200 px-2">
                                <span>{chatData.participants[0]}</span>
                                <span>{chatData.participants[1]}</span>
                            </div>
                            <div className="flex justify-between text-xs text-txt-sub dark:text-stone-400 px-2 mt-1">
                                <span>{chatData.participantStats[chatData.participants[0]]?.messageCount} pesan</span>
                                <span>{chatData.participantStats[chatData.participants[1]]?.messageCount} pesan</span>
                            </div>
                        </motion.div>
                    </section>

                    {/* Communication Style Tags */}
                    <section className={`bg-white/60 dark:bg-stone-800/60 p-8 rounded-3xl border ${theme.borderAccent}`}>
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                            <div className="flex-1">
                                <h3 className="text-lg font-bold mb-2 font-heading text-txt-main dark:text-stone-200">Gaya Komunikasi</h3>
                                <p className="text-sm text-txt-sub dark:text-stone-400 leading-relaxed mb-4">"{analysis.communicationStyle?.description || "Setiap orang punya cara unik untuk terhubung."}"</p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300 text-xs rounded-full border border-purple-100 dark:border-purple-800">
                                        🎭 Paling Ekspresif: <strong>{analysis.communicationStyle?.mostExpressive}</strong>
                                    </span>
                                    <span className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-300 text-xs rounded-full border border-green-100 dark:border-green-800">
                                        ⚡ Balas Cepat: <strong>{analysis.communicationStyle?.quickestReplier}</strong>
                                    </span>
                                </div>
                            </div>
                            <div className="w-full md:w-1/3 space-y-3">
                                {analysis.toneAnalysis?.slice(0, 3).map((tone, i) => (
                                    <div key={i} className="text-xs">
                                        <div className="flex justify-between mb-1 text-stone-600 dark:text-stone-300">
                                            <span>{tone.label}</span>
                                            <span>{tone.percentage}%</span>
                                        </div>
                                        <div className="h-1.5 bg-stone-100 dark:bg-stone-700 rounded-full overflow-hidden">
                                            <motion.div initial={{ width: 0 }} whileInView={{ width: `${tone.percentage}%` }} className="h-full bg-stone-400 dark:bg-stone-500" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* --- BAGIAN 4: EMOSI & ISI CHAT --- */}
                    <section>
                        <div className="text-center mb-10">
                            <h2 className="text-2xl font-bold text-txt-main dark:text-stone-200 font-heading">Warna Emosi</h2>
                            <p className="text-sm text-txt-sub dark:text-stone-400">Bagaimana perasaan berubah seiring waktu dan jam.</p>
                        </div>

                        {/* Monthly Mood Timeline */}
                        <div className="mb-8 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                            <div className="flex gap-2 min-w-max">
                                {analysis.monthlyMoods?.map((m, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2">
                                        <div className={`w-12 h-24 rounded-full relative bg-stone-100 dark:bg-stone-800 overflow-hidden border border-white dark:border-stone-700`}>
                                            <motion.div
                                                initial={{ height: 0 }}
                                                whileInView={{ height: `${m.intensity * 10}%` }}
                                                className={`absolute bottom-0 w-full ${m.mood.includes('Hangat') || m.mood.includes('Senang') ? 'bg-orange-300' :
                                                    m.mood.includes('Sedih') || m.mood.includes('Dingin') ? 'bg-blue-300' :
                                                        m.mood.includes('Tegang') ? 'bg-red-300' : 'bg-stone-300'
                                                    }`}
                                            />
                                        </div>
                                        <div className="text-[10px] text-center w-16 text-txt-sub dark:text-stone-500 font-medium leading-tight">{m.month}</div>
                                        <div className="text-[10px] font-bold text-stone-600 dark:text-stone-400">{m.mood}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Hourly Moods */}
                            <div className={`bg-white/60 dark:bg-stone-800/60 p-6 rounded-3xl border ${theme.borderAccent}`}>
                                <div className="flex items-center gap-3 mb-6">
                                    <Clock className={theme.accent} />
                                    <h3 className="text-lg font-bold text-txt-main dark:text-stone-200">Jam Emosional</h3>
                                </div>
                                <div className="space-y-4">
                                    {analysis.hourlyMoods?.map((h, i) => (
                                        <div key={i} className="flex justify-between items-center text-sm border-b border-stone-100 dark:border-stone-700 pb-2 last:border-0">
                                            <span className="font-medium text-stone-500 dark:text-stone-400 w-24">{h.timeRange}</span>
                                            <div className="flex-1 text-right">
                                                <span className="font-bold text-stone-700 dark:text-stone-200 block">{h.mood}</span>
                                                <span className="text-xs text-stone-400 dark:text-stone-500">{h.description}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Topic Cloud */}
                            <div className={`bg-white/60 dark:bg-stone-800/60 p-6 rounded-3xl border ${theme.borderAccent}`}>
                                <div className="flex items-center gap-3 mb-6">
                                    <Tag className="text-yellow-400" />
                                    <h3 className="text-lg font-bold text-txt-main dark:text-stone-200">Topik Dominan</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {analysis.dominantTopics?.map((t, i) => (
                                        <motion.span whileHover={{ scale: 1.05 }} key={i} className={`px-4 py-2 rounded-xl text-xs font-medium cursor-default border ${t.category === 'deep' ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-100 text-purple-600 dark:text-purple-300' :
                                            t.category === 'fun' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 text-yellow-600 dark:text-yellow-300' :
                                                t.category === 'conflict' ? 'bg-red-50 dark:bg-red-900/20 border-red-100 text-red-600 dark:text-red-300' :
                                                    'bg-stone-50 dark:bg-stone-700 border-stone-200 dark:border-stone-600 text-stone-600 dark:text-stone-300'
                                            }`}>
                                            {t.name}
                                        </motion.span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* --- BAGIAN 5: MOMEN SPESIFIK (Nostalgia) --- */}
                    <section>
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Key Moments */}
                            <div>
                                <h3 className="text-xl font-bold mb-6 font-heading text-txt-main dark:text-stone-200">Momen Kunci</h3>
                                <div className="space-y-6 pl-4 border-l-2 border-stone-200 dark:border-stone-700">
                                    {analysis.keyMoments?.map((m, i) => (
                                        <div key={i} className="relative pl-6">
                                            <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white dark:border-stone-800 ${theme.bgAccent}`}></div>
                                            <div className="text-xs font-bold text-stone-400 mb-1">{m.date}</div>
                                            <h4 className="font-bold text-stone-800 dark:text-stone-200">{m.title}</h4>
                                            <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 leading-relaxed bg-white/50 dark:bg-stone-800/50 p-3 rounded-lg">{m.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Conflict Triggers */}
                                {analysis.conflictTriggers?.length > 0 && (
                                    <div className="bg-red-50/50 dark:bg-red-900/10 p-6 rounded-3xl border border-red-100 dark:border-red-900/30">
                                        <div className="flex items-center gap-2 mb-4">
                                            <AlertCircle size={16} className="text-red-400" />
                                            <h4 className="font-bold text-red-800 dark:text-red-200 text-sm">Sinyal Ketegangan</h4>
                                        </div>
                                        <p className="text-xs text-red-600 dark:text-red-300 mb-3">Kata-kata ini sering muncul saat suasana berubah:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {analysis.conflictTriggers?.map((w, i) => <span key={i} className="px-2 py-1 bg-white dark:bg-stone-800 rounded-md text-[10px] text-red-500 border border-red-100 dark:border-red-900">{w}</span>)}
                                        </div>
                                    </div>
                                )}

                                {/* Memorable Lines */}
                                <div className="bg-orange-50/50 dark:bg-orange-900/10 p-6 rounded-3xl border border-orange-100 dark:border-orange-900/30">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Quote size={16} className="text-orange-400" />
                                        <h4 className="font-bold text-orange-800 dark:text-orange-200 text-sm">Kutipan Berkesan</h4>
                                    </div>
                                    <div className="space-y-4">
                                        {analysis.memorableLines?.map((l, i) => (
                                            <div key={i}>
                                                <p className="italic text-sm text-stone-700 dark:text-stone-300 mb-1">"{l.text}"</p>
                                                <p className="text-[10px] font-bold text-stone-400 uppercase">— {l.sender}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* REAL Evidence Snippet */}
                                {evidenceMessages.length > 0 && (
                                    <div className="bg-stone-50 dark:bg-stone-800 p-6 rounded-3xl border border-stone-200 dark:border-stone-700">
                                        <div className="flex items-center gap-2 mb-4 opacity-70">
                                            <MessageSquare size={14} className="text-stone-500 dark:text-stone-400" />
                                            <h4 className="font-bold text-xs text-stone-600 dark:text-stone-300">Cuplikan Asli Chat</h4>
                                        </div>
                                        <div className="space-y-2">
                                            {evidenceMessages.map((msg, i) => (
                                                <div key={i} className={`p-3 rounded-xl text-xs max-w-[85%] shadow-sm border border-stone-100 dark:border-stone-700 ${i % 2 === 0
                                                    ? 'bg-white dark:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-tl-none mr-auto'
                                                    : `bg-opacity-20 ${theme.bgAccent} text-stone-600 dark:text-stone-300 rounded-tr-none ml-auto`
                                                    }`}>
                                                    <p className="mb-1 font-bold opacity-50 text-[10px]">{msg.sender}</p>
                                                    <p>{msg.content.length > 100 ? msg.content.substring(0, 100) + '...' : msg.content}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* --- BAGIAN 6: PENUTUP --- */}
                    <motion.section initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className={`bg-white/80 dark:bg-stone-800/80 backdrop-blur-md p-10 rounded-[3rem] text-center shadow-xl border ${theme.borderAccent} relative overflow-hidden mt-20`}>
                        <div className="relative z-10 max-w-2xl mx-auto">
                            <Feather className={`w-10 h-10 ${theme.accent} mx-auto mb-6`} />
                            <h3 className="text-2xl font-bold mb-4 font-heading text-txt-main dark:text-stone-200">{theme.labels.reflection}</h3>
                            <p className="text-lg font-serif italic leading-relaxed text-txt-quote dark:text-stone-300 mb-8">"{analysis.reflection}"</p>

                            <p className="text-xs text-stone-400 mb-8">Percakapan tidak selalu berakhir dengan jelas. Tapi setiap kata yang pernah dikirim tetap menjadi bagian dari cerita yang pernah ada.</p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button variant="secondary" onClick={() => setAppState(AppState.CHAT)} className="shadow-md">
                                    <span className="flex items-center gap-2"><MessageCircle size={18} /> Diskusi Lebih Dalam</span>
                                </Button>
                                <Button variant="primary" onClick={() => window.location.reload()}>
                                    <span className="flex items-center gap-2"><RefreshCw size={18} /> Analisis Chat Lain</span>
                                </Button>
                            </div>
                        </div>
                    </motion.section>

                </div>

                <Footer setAppState={setAppState} />
            </div>
        );
    };

    const renderChat = () => (
        <div className="flex flex-col h-screen bg-pastel-bgEnd dark:bg-stone-950 font-sans transition-colors duration-300">
            <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-100 dark:border-stone-800 p-4 flex justify-between items-center z-20">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pastel-card dark:bg-stone-800 rounded-full flex items-center justify-center"><Sparkles size={20} className="text-stone-600 dark:text-stone-300" /></div>
                    <div><h2 className="font-bold text-txt-main dark:text-stone-200">Ruang Refleksi</h2><p className="text-[10px] text-txt-sub dark:text-stone-400">Diskusi Objektif</p></div>
                </div>
                <div className="flex gap-2">
                    <div className="flex bg-stone-100 dark:bg-stone-800 rounded-lg p-1"><button onClick={() => setChatFontSize(s => Math.max(12, s - 1))} className="p-1 text-stone-600 dark:text-stone-400"><Minus size={14} /></button><button onClick={() => setChatFontSize(s => Math.min(24, s + 1))} className="p-1 text-stone-600 dark:text-stone-400"><Plus size={14} /></button></div>
                    <Button variant="secondary" onClick={() => setAppState(AppState.INSIGHTS)} className="!px-3 !py-2 text-xs !rounded-lg">Kembali</Button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {conversation.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div style={{ fontSize: `${chatFontSize}px` }} className={`max-w-[85%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-pastel-secondary dark:bg-stone-800 text-stone-800 dark:text-stone-100 rounded-br-none' : 'bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-800 rounded-bl-none shadow-sm'}`}>
                            {msg.role === 'model' ? <TypewriterText text={msg.text} /> : msg.text}
                        </div>
                    </div>
                ))}
                {isTyping && <div className="text-xs text-stone-400 ml-4 animate-pulse">AI sedang menulis...</div>}
                <div ref={chatEndRef} />
            </div>
            <div className="p-4 bg-white dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800">
                <div className="flex gap-2 relative">
                    <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Tanya tentang chat ini..." className="flex-1 bg-stone-100 dark:bg-stone-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-pastel-primary/50 transition-all text-stone-800 dark:text-stone-100 placeholder-stone-400" />
                    <Button onClick={handleSendMessage} disabled={!userInput.trim() || isTyping} className="!p-3 !rounded-xl"><Send size={20} /></Button>
                </div>
            </div>
        </div>
    );

    // Helper for About pages
    const renderAboutAboutWebsite = () => (
        <Layout title="Tentang Recap Chat" className="flex flex-col min-h-screen">
            <div className="absolute top-4 right-4 z-50"><ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} /></div>
            <div className="max-w-3xl text-center space-y-8 flex-1 flex flex-col justify-center py-10">
                <p className="text-xl text-stone-600 dark:text-stone-300 leading-relaxed font-light">Recap Chat adalah website yang membantu kamu merangkum dan memahami percakapan WhatsApp dengan cara yang lebih jelas, rapi, dan mendalam.</p>

                <div className="grid md:grid-cols-2 gap-6 text-left">
                    <div className="p-6 bg-white/60 dark:bg-stone-800/60 rounded-3xl border border-stone-100 dark:border-stone-700">
                        <h3 className="font-bold mb-3 text-stone-800 dark:text-stone-200 flex items-center gap-2"><FileText size={18} /> Apa Itu Recap Chat?</h3>
                        <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                            Recap Chat dibuat untuk percakapan yang terlalu panjang untuk dibaca ulang. Website ini membaca isi chat yang kamu upload, lalu menyusunnya menjadi ringkasan yang lebih enak dipahami, mulai dari tema obrolan, perubahan suasana, sampai momen-momen yang paling menonjol.
                        </p>
                    </div>
                    <div className="p-6 bg-white/60 dark:bg-stone-800/60 rounded-3xl border border-stone-100 dark:border-stone-700">
                        <h3 className="font-bold mb-3 text-stone-800 dark:text-stone-200 flex items-center gap-2"><Eye size={18} /> Apa yang Ditampilkan?</h3>
                        <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                            Setelah upload, kamu akan melihat ringkasan terstruktur: kapan percakapan dimulai, grafik intensitas chat, topik dominan, mood yang muncul, dan momen penting. Semua ditampilkan dengan visual yang lembut dan nyaman.
                        </p>
                    </div>
                    <div className="p-6 bg-white/60 dark:bg-stone-800/60 rounded-3xl border border-stone-100 dark:border-stone-700">
                        <h3 className="font-bold mb-3 text-stone-800 dark:text-stone-200 flex items-center gap-2"><Brain size={18} /> Fitur Tanya AI</h3>
                        <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                            Kamu bisa bertanya apa saja tentang percakapan tersebut. AI akan menjawab dengan jujur berdasarkan bukti dari chat yang dianalisis, tanpa mengada-ada atau membuat kesimpulan berlebihan.
                        </p>
                    </div>
                    <div className="p-6 bg-white/60 dark:bg-stone-800/60 rounded-3xl border border-stone-100 dark:border-stone-700">
                        <h3 className="font-bold mb-3 text-stone-800 dark:text-stone-200 flex items-center gap-2"><ShieldCheck size={18} /> Prinsip & Privasi</h3>
                        <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                            <strong>Jujur. Rapi. Tidak menghakimi.</strong><br />
                            Website ini tidak menyimpan file chat kamu secara permanen. Data hanya aktif selama sesi analisis dan otomatis dihapus setelah selesai.
                        </p>
                    </div>
                </div>

                <div className="mt-8">
                    <p className="text-sm font-bold text-stone-500 mb-6">Recap Chat bukan tempat menyimpan chat. Recap Chat adalah tempat memahami chat.</p>
                    <Button onClick={() => setAppState(AppState.UPLOAD)}>Siap mulai recap chat kamu?</Button>
                </div>

                <Button variant="ghost" onClick={() => setAppState(AppState.LANDING)} className="text-xs">Kembali ke Beranda</Button>
            </div>
            <Footer setAppState={setAppState} />
        </Layout>
    );

    const renderAboutCreator = () => (
        <Layout title="Tentang Pembuat" className="flex flex-col min-h-screen">
            <div className="absolute top-4 right-4 z-50"><ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} /></div>
            <div className="max-w-2xl text-center flex-1 flex flex-col justify-center py-10 space-y-8">
                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-stone-200 dark:bg-stone-700 rounded-full mb-4 flex items-center justify-center overflow-hidden border-4 border-white dark:border-stone-600 shadow-md">
                        <User size={40} className="text-stone-400" />
                    </div>
                    <h2 className="text-2xl font-bold mb-1 text-stone-800 dark:text-stone-200">Ackmad Elfan Purnama</h2>
                    <p className="text-stone-500 text-sm">Siswa SMK jurusan Rekayasa Perangkat Lunak (RPL)</p>
                </div>

                <p className="text-lg text-stone-600 dark:text-stone-300 italic font-serif">
                    "Website ini dibuat oleh seseorang yang percaya bahwa teknologi bisa membantu manusia memahami hal-hal yang sulit dijelaskan lewat kata-kata."
                </p>

                <div className="space-y-6 text-left bg-white/50 dark:bg-stone-800/50 p-8 rounded-[2rem] border border-stone-100 dark:border-stone-700">
                    <div>
                        <h3 className="font-bold text-stone-800 dark:text-stone-200 mb-2">Kenapa saya membuat Recap Chat?</h3>
                        <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                            Masalah ini sering dialami banyak orang: chat terlalu panjang dan sulit dipahami. Banyak orang ingin melihat kembali isi percakapan mereka secara lebih jelas, tapi tidak punya waktu untuk membaca semuanya. Saya membuat Recap Chat untuk merangkum itu semua secara otomatis.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold text-stone-800 dark:text-stone-200 mb-2">Saya tipe orang yang suka detail.</h3>
                        <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                            Saya percaya UI/UX yang baik bukan hanya soal tampilan keren, tapi soal kenyamanan. Saya ingin Recap Chat terasa lembut, tenang, dan mudah digunakan, sehingga user tidak merasa terburu-buru.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold text-stone-800 dark:text-stone-200 mb-2">Visi & Gaya</h3>
                        <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                            Saya ingin Recap Chat menjadi website yang benar-benar berguna. UI yang soft, UX yang nyaman, dengan warna pastel lembut dan animasi halus.
                        </p>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-sm text-stone-500 mb-6">Terima kasih sudah menggunakan Recap Chat.</p>
                    <Button variant="ghost" onClick={() => setAppState(AppState.LANDING)}>Kembali ke Beranda</Button>
                </div>
            </div>
            <Footer setAppState={setAppState} />
        </Layout>
    );

    return (
        <AnimatePresence mode="wait">
            <motion.div key={appState} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen">
                {appState === AppState.LANDING && renderLanding()}
                {appState === AppState.ABOUT_WEBSITE && renderAboutAboutWebsite()}
                {appState === AppState.ABOUT_CREATOR && renderAboutCreator()}
                {/* Merged Instructions and Upload into Studio */}
                {appState === AppState.INSTRUCTIONS && renderStudio()}
                {appState === AppState.UPLOAD && renderStudio()}
                {appState === AppState.PROCESSING &&
                    <LoadingScreen
                        isAnalysisComplete={isAnalysisComplete}
                        onTransitionDone={onLoadingTransitionDone}
                        logs={aiStatusLogs}
                        errorDetails={errorDetails}
                    />
                }
                {appState === AppState.INSIGHTS && renderInsights()}
                {appState === AppState.CHAT && renderChat()}
            </motion.div>
        </AnimatePresence>
    );
};

export default App;