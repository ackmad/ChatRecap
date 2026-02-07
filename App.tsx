import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Upload, FileText, MessageSquare, ArrowRight, ShieldCheck, RefreshCw, Send, Sparkles, Clock, Calendar, MessageCircle, Heart, User, BookOpen, Feather, Cpu, Layers, ArrowLeft, Coffee, Sun, Moon, Minus, Plus, Hourglass, Tag, Scale, AlertCircle, Quote, ChevronLeft, ChevronRight, Info, BarChart2, TrendingUp, Music, Bot, Lock, CheckCircle, HelpCircle, File, Smartphone, Users, Eye, Brain, Terminal, XCircle, AlertTriangle, Download, Share2, Image as ImageIcon, Grid, Layout as LayoutIcon, Type, X, Zap, Search, Menu, ChevronDown } from 'lucide-react';
import { useRoomPresence } from './hooks/useRoomPresence';
import { RoomPresenceBar } from './components/RoomPresenceBar';
import { PresenceToast } from './components/PresenceToast';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import ReactMarkdown from 'react-markdown';
import { parseWhatsAppChat } from './utils/chatParser';
import { analyzeChatWithGemini, createChatSession, sendChatMessageWithRetry } from './services/geminiService';
import { AppState, ChatData, AnalysisResult, ChatMessage, Message, RelationshipType } from './types';
import { Layout } from './components/Layout';
import { Button } from './components/Button';
import { AdvancedStoryGenerator } from './components/AdvancedStoryGenerator';
import { PDFGenerator } from './components/PDFGenerator';
import { ChatSession } from "@google/generative-ai";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="w-full mt-auto py-8 text-center text-xs text-txt-sub dark:text-stone-500 border-t border-stone-100 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
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

    // Get Active API & Status from logs
    const activeApi = logs.slice().reverse().find(l => l.includes("API"))?.match(/API \d+/)?.[0] || "API Checking...";
    const currentStatus = logs.length > 0 ? logs[logs.length - 1] : "Memulai sistem...";

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

                {/* Active API Badge */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mb-8 bg-white/80 dark:bg-stone-800/80 backdrop-blur px-4 py-1.5 rounded-full border border-stone-200 dark:border-stone-700 shadow-sm flex items-center gap-2"
                >
                    <Cpu size={14} className="text-pastel-primary animate-pulse" />
                    <span className="text-xs font-bold text-stone-600 dark:text-stone-300 tracking-wide uppercase">{activeApi} ACTIVE</span>
                </motion.div>

                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="mb-6 relative"
                >
                    <div className="w-24 h-24 bg-white dark:bg-stone-800 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-stone-700">
                        <Bot size={48} className="text-pastel-primary" />
                    </div>
                </motion.div>

                <h2 className="text-xl font-heading font-bold text-stone-700 dark:text-stone-200 mb-2 min-h-[3.5rem] flex items-center justify-center">
                    {currentStatus}
                </h2>

                <p className="text-stone-500 dark:text-stone-400 text-sm mb-6">Jangan menutup halaman ini.</p>

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
                                <span className={log.includes('Error') || log.includes('TOKEN') || log.includes('Gagal') ? 'text-red-400' : 'text-emerald-300'}>
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

// --- PDF Generator Modal ---
const PDFGeneratorModal = ({ analysis, chatData, onClose }: { analysis: AnalysisResult, chatData: ChatData, onClose: () => void }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [pdfFormat, setPdfFormat] = useState<'summary' | 'full' | 'story'>('full');
    const pdfRef = useRef<HTMLDivElement>(null);

    const generatePDF = async (type: 'summary' | 'full' | 'story') => {
        if (!pdfRef.current) return;
        setPdfFormat(type);
        setIsGenerating(true);
        try {
            // Wait for render/layout update
            await new Promise(r => setTimeout(r, 500));

            const canvas = await html2canvas(pdfRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const imgWidth = 210;
            const pageHeight = 297;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`RecapChat-${type}-${new Date().toISOString().split('T')[0]}.pdf`);
            onClose();
        } catch (e) {
            console.error(e);
            alert("Gagal membuat PDF. Coba lagi.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-stone-900 rounded-3xl w-full max-w-4xl p-8 relative overflow-hidden flex flex-col md:flex-row gap-8 max-h-[90vh]">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-stone-100 dark:bg-stone-800 rounded-full text-stone-500 hover:text-stone-800"><XCircle size={20} /></button>

                {/* Options Panel */}
                <div className="flex-1 space-y-6 overflow-y-auto">
                    <div>
                        <h2 className="text-2xl font-heading font-bold text-stone-800 dark:text-white mb-2">Simpan Sebagai Arsip</h2>
                        <p className="text-stone-500 dark:text-stone-400 text-sm">Pilih format dokumen yang kamu butuhkan.</p>
                    </div>

                    <div className="grid gap-4">
                        <button onClick={() => generatePDF('summary')} className="flex items-start gap-4 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 hover:border-pastel-primary hover:bg-pastel-primary/5 transition-all text-left group">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform"><FileText size={24} /></div>
                            <div>
                                <h3 className="font-bold text-stone-800 dark:text-stone-200">PDF Ringkas (Summary)</h3>
                                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">1-2 Halaman. Berisi highlight mood, topik, dan quote terbaik.</p>
                            </div>
                        </button>

                        <button onClick={() => generatePDF('full')} className="flex items-start gap-4 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 hover:border-pastel-primary hover:bg-pastel-primary/5 transition-all text-left group">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform"><Layers size={24} /></div>
                            <div>
                                <h3 className="font-bold text-stone-800 dark:text-stone-200">Full Report (Lengkap)</h3>
                                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">Semua analisis lengkap: timeline, grafik detak jantung, emosi per jam, dan detail lainnya.</p>
                            </div>
                        </button>
                    </div>

                    <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
                        <p className="text-[10px] text-stone-400 mb-2">Preview PDF generated content:</p>
                        {isGenerating && <div className="text-sm text-pastel-primary animate-pulse">Sedang menyusun halaman PDF ({pdfFormat})...</div>}
                    </div>
                </div>

                {/* Hidden Render Container for PDF */}
                <div className="hidden md:block w-[400px] border border-stone-100 dark:border-stone-800 rounded-xl overflow-hidden bg-stone-50 relative">
                    <div className="absolute inset-0 overflow-y-auto scrollbar-thin p-4 opacity-50 pointer-events-none transform scale-50 origin-top-left w-[200%] h-[200%]">
                        {/* Actual content to capture */}
                        <div ref={pdfRef} className="w-[794px] min-h-[1123px] bg-white p-[50px] text-stone-900 relative shadow-xl mx-auto">
                            {/* Watermark */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-45 text-9xl font-bold opacity-[0.03] pointer-events-none">RECAP CHAT</div>

                            {/* Header */}
                            <div className="flex justify-between items-end border-b-2 border-stone-900 pb-6 mb-10">
                                <div>
                                    <div className="text-xs font-bold text-stone-400 uppercase tracking-[0.3em] mb-2">OFFICIAL RECAP</div>
                                    <h1 className="text-4xl font-heading font-bold text-stone-900 leading-tight">{analysis.storyTitle}</h1>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-stone-500">{new Date().toLocaleDateString()}</div>
                                    <div className="text-xs text-stone-400">recapchat.xyz</div>
                                </div>
                            </div>

                            {/* Content Grid */}
                            <div className="grid grid-cols-2 gap-10 mb-10">
                                <div>
                                    <h3 className="text-xs font-bold font-mono uppercase text-stone-400 mb-2">HUBUNGAN</h3>
                                    <p className="text-xl font-medium">{chatData.participants ? chatData.participants.join(' & ') : 'Chat Analysis'}</p>
                                    <div className="mt-4 flex gap-2">
                                        <span className="px-3 py-1 bg-stone-100 rounded text-xs font-bold uppercase">{analysis.relationshipType}</span>
                                        <span className="px-3 py-1 bg-stone-100 rounded text-xs font-bold uppercase">{analysis.aiConfidence} Confidence</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold font-mono uppercase text-stone-400 mb-2">SUMMARY</h3>
                                    <p className="text-sm leading-relaxed text-stone-600 text-justify">{analysis.summary}</p>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="bg-stone-50 p-6 rounded-xl border border-stone-100 mb-10 flex justify-between">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-stone-800">{chatData.totalMessages.toLocaleString()}</div>
                                    <div className="text-[10px] text-stone-400 uppercase tracking-wider">Total Pesan</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-stone-800">{chatData.durationString.split(' ')[0]}</div>
                                    <div className="text-[10px] text-stone-400 uppercase tracking-wider">Hari</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-stone-800">{analysis.phases?.length || 0}</div>
                                    <div className="text-[10px] text-stone-400 uppercase tracking-wider">Fase</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-stone-800">{analysis.emotions?.length || 0}</div>
                                    <div className="text-[10px] text-stone-400 uppercase tracking-wider">Emosi</div>
                                </div>
                            </div>

                            {/* CONDITIONAL RENDER: Full Report Only */}
                            {pdfFormat === 'full' && (
                                <>
                                    <div className="mb-10">
                                        <h3 className="text-sm font-bold border-b border-stone-200 pb-2 mb-4 uppercase tracking-wider">Timeline Perjalanan</h3>
                                        <div className="space-y-4">
                                            {analysis.phases?.map((p, i) => (
                                                <div key={i} className="flex gap-4">
                                                    <div className="w-24 text-xs font-bold text-stone-400 text-right pt-1">{p.period}</div>
                                                    <div className="flex-1 pb-4 border-l border-stone-200 pl-4 relative">
                                                        <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-stone-300"></div>
                                                        <h4 className="font-bold text-sm text-stone-800">{p.name}</h4>
                                                        <p className="text-xs text-stone-600 mt-1">{p.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mb-10">
                                        <h3 className="text-sm font-bold border-b border-stone-200 pb-2 mb-4 uppercase tracking-wider">Analisis Emosional</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            {analysis.emotions?.slice(0, 6).map((e, i) => (
                                                <div key={i} className="bg-stone-50 p-3 rounded-lg flex justify-between items-center">
                                                    <span className="text-sm font-medium">{e.emotion}</span>
                                                    <div className="flex gap-1">
                                                        {[...Array(5)].map((_, idx) => (
                                                            <div key={idx} className={`w-1.5 h-1.5 rounded-full ${idx < (e.intensity / 2) ? 'bg-stone-800' : 'bg-stone-200'}`}></div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Footer */}
                            <div className="mt-auto pt-10 border-t-2 border-stone-900 border-dashed text-center">
                                <p className="text-lg font-serif italic text-stone-600 mb-4">"{analysis.reflection}"</p>
                                <div className="text-[10px] text-stone-400 uppercase tracking-widest">
                                    Generated by RecapChat.xyz • Private & Secure Analysis
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Story Generator Modal ---
const StoryGeneratorModal = ({ analysis, chatData, onClose }: { analysis: AnalysisResult, chatData: ChatData, onClose: () => void }) => {
    const [theme, setTheme] = useState<'pastel' | 'dark' | 'mint'>('pastel');
    const [template, setTemplate] = useState<'classic' | 'mood' | 'quote'>('classic');
    const [isExporting, setIsExporting] = useState(false);
    const storyRef = useRef<HTMLDivElement>(null);

    const themes = {
        pastel: "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-stone-800",
        dark: "bg-stone-900 text-stone-100",
        mint: "bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 text-stone-800"
    };

    const downloadStory = async () => {
        if (!storyRef.current) return;
        setIsExporting(true);
        try {
            const canvas = await html2canvas(storyRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: null
            });
            const link = document.createElement('a');
            link.download = `RecapStory-${new Date().getTime()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (err) {
            console.error(err);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col md:flex-row shadow-2xl overflow-hidden">
            {/* Left Controls */}
            <div className="w-full md:w-1/3 bg-white dark:bg-stone-900 p-6 md:p-8 flex flex-col gap-6 border-r border-stone-200 dark:border-stone-800 overflow-y-auto">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold font-heading text-stone-800 dark:text-white">Story Generator</h2>
                    <button onClick={onClose} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full"><XCircle size={20} /></button>
                </div>

                <div className="space-y-4">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Pilih Template</label>
                    <div className="grid grid-cols-3 gap-2">
                        {['Classic', 'Mood', 'Quote'].map((t) => (
                            <button
                                key={t}
                                onClick={() => setTemplate(t.toLowerCase() as any)}
                                className={`p-3 rounded-xl border ${template === t.toLowerCase() ? 'border-pastel-primary bg-pastel-primary/10' : 'border-stone-200 dark:border-stone-700'} text-xs font-bold transition-all`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Vibe Warna</label>
                    <div className="flex gap-3">
                        <button onClick={() => setTheme('pastel')} className={`w-10 h-10 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 border-2 ${theme === 'pastel' ? 'border-stone-900 scale-110' : 'border-transparent'}`}></button>
                        <button onClick={() => setTheme('mint')} className={`w-10 h-10 rounded-full bg-gradient-to-br from-emerald-100 to-cyan-100 border-2 ${theme === 'mint' ? 'border-stone-900 scale-110' : 'border-transparent'}`}></button>
                        <button onClick={() => setTheme('dark')} className={`w-10 h-10 rounded-full bg-stone-900 border-2 ${theme === 'dark' ? 'border-white scale-110' : 'border-transparent'}`}></button>
                    </div>
                </div>

                <div className="mt-auto">
                    <Button onClick={downloadStory} disabled={isExporting} className="w-full py-4 text-lg shadow-xl shadow-purple-500/20">
                        {isExporting ? 'Generating...' : 'Download Story Image 📸'}
                    </Button>
                    <p className="text-[10px] text-center text-stone-400 mt-4">1080x1920 • Siap post ke IG/WA</p>
                </div>
            </div>

            {/* Right Preview */}
            <div className="flex-1 bg-stone-100 dark:bg-black flex items-center justify-center p-8 overflow-hidden relative">
                <div className="scale-[0.4] md:scale-[0.6] origin-center shadow-2xl rounded-[3rem] overflow-hidden border-8 border-stone-800">
                    <div
                        ref={storyRef}
                        className={`w-[1080px] h-[1920px] ${themes[theme]} relative flex flex-col p-16`}
                    >
                        {/* Story Header */}
                        <div className="flex items-center gap-4 mb-20 opacity-80">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                                <Sparkles size={32} className="text-current" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold tracking-tight">Recap Chat Story</h3>
                                <p className="text-xl opacity-70">Generated from WhatsApp</p>
                            </div>
                        </div>

                        {/* Content Card */}
                        <div className="flex-1 flex flex-col justify-center relative">
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-[100px]"></div>
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px]"></div>

                            <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl p-16 rounded-[4rem] border border-white/20 shadow-xl text-center relative z-10">
                                {template === 'classic' && (
                                    <>
                                        <div className="inline-block px-6 py-2 rounded-full bg-white/30 border border-white/20 mb-8 mx-auto text-xl font-bold tracking-widest uppercase">
                                            {analysis.relationshipType} Recap
                                        </div>
                                        <h1 className="text-7xl font-heading font-bold mb-8 leading-tight">
                                            "{analysis.storyTitle}"
                                        </h1>
                                        <div className="w-32 h-2 bg-current opacity-20 mx-auto rounded-full mb-8"></div>
                                        <p className="text-3xl font-light leading-relaxed opacity-90 max-w-4xl mx-auto">
                                            {analysis.summary.split('.')[0]}.
                                        </p>
                                    </>
                                )}

                                {template === 'mood' && (
                                    <>
                                        <h2 className="text-5xl font-bold mb-12">Mood Meter 🌡️</h2>
                                        <div className="space-y-8">
                                            {analysis.emotions?.slice(0, 4).map((e, i) => (
                                                <div key={i} className="text-left">
                                                    <div className="flex justify-between text-2xl font-bold mb-2">
                                                        <span>{e.emotion}</span>
                                                        <span>{e.intensity}/10</span>
                                                    </div>
                                                    <div className="h-6 bg-white/20 rounded-full overflow-hidden">
                                                        <div style={{ width: `${e.intensity * 10}%` }} className="h-full bg-current opacity-80"></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {template === 'quote' && (
                                    <>
                                        <Quote size={80} className="mx-auto mb-10 opacity-50" />
                                        <p className="text-5xl font-serif italic leading-snug mb-10">
                                            "{analysis.memorableLines?.[0]?.text || "Chat ini penuh makna."}"
                                        </p>
                                        <div className="flex items-center justify-center gap-4">
                                            <div className="h-px w-20 bg-current opacity-50"></div>
                                            <span className="text-2xl font-bold uppercase tracking-widest">{analysis.memorableLines?.[0]?.sender || "Unknown"}</span>
                                            <div className="h-px w-20 bg-current opacity-50"></div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-auto pt-20 text-center relative z-10">
                            <p className="text-2xl font-bold mb-2">Try yours at recapchat.xyz</p>
                            <div className="flex justify-center gap-4 text-lg opacity-60">
                                <span className="flex items-center gap-2"><Lock size={20} /> Private Mode</span>
                                <span>•</span>
                                <span>No Data Stored</span>
                            </div>
                        </div>
                    </div>
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

    // --- REALTIME ANALYTICS SETUP ---
    // Calculate current page category for Analytics
    const pageName = useMemo(() => {
        switch (appState) {
            case AppState.LANDING:
            case AppState.ABOUT_WEBSITE:
            case AppState.ABOUT_CREATOR:
                return 'landing';
            case AppState.UPLOAD:
            case AppState.INSTRUCTIONS:
            case AppState.PROCESSING:
                return 'creating';
            case AppState.INSIGHTS:
            case AppState.CHAT:
                return 'reading';
            default:
                return 'landing';
        }
    }, [appState]);

    // Single Hook Call for Global Analytics
    const { globalStats, presenceState, isConnected } = useRoomPresence(null, {}, pageName as any);

    // Alias variables for UI compatibility
    const globalPresence = presenceState; // For landing page badge
    const updateMyStatus = (_status?: string) => { }; // No-op since server is global-only


    // 4. Scroll Detection to update status
    useEffect(() => {
        if (appState !== AppState.INSIGHTS) return;

        let scrollTimeout: NodeJS.Timeout;
        const handleScroll = () => {
            updateMyStatus('scrolling');
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => updateMyStatus('reading'), 1000);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [appState, updateMyStatus]);
    const [showStatsPopup, setShowStatsPopup] = useState(false);
    const [showPDFGenerator, setShowPDFGenerator] = useState(false);
    const [showStoryGenerator, setShowStoryGenerator] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [chatFontSize, setChatFontSize] = useState(14);
    const [chatSession, setChatSession] = useState<ChatSession | null>(null);
    const [conversation, setConversation] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
    const [aiStatusLogs, setAiStatusLogs] = useState<string[]>([]);
    const [showDonationPopup, setShowDonationPopup] = useState(false);

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

    // Show donation popup on first visit
    useEffect(() => {
        const hasSeenDonation = localStorage.getItem('hasSeenDonation');
        if (!hasSeenDonation && appState === AppState.LANDING) {
            setTimeout(() => setShowDonationPopup(true), 2000);
        }
    }, [appState]);

    const closeDonationPopup = (dontShowAgain: boolean = false) => {
        setShowDonationPopup(false);
        if (dontShowAgain) {
            localStorage.setItem('hasSeenDonation', 'true');
        }
    };

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
        if (!userInput.trim()) return;

        // Check if we have chatData
        if (!chatData || !chatData.messages || chatData.messages.length === 0) {
            setConversation(prev => [...prev, {
                role: 'model',
                text: "Maaf, data chat belum tersedia. Silakan upload file chat terlebih dahulu."
            }]);
            return;
        }

        const currentMsg = userInput;
        setUserInput('');
        setConversation(prev => [...prev, { role: 'user', text: currentMsg }]);
        setIsTyping(true);

        try {
            // Use retry function with API key rotation
            const text = await sendChatMessageWithRetry(
                chatData.messages,
                conversation,
                currentMsg
            );
            setConversation(prev => [...prev, { role: 'model', text }]);
        } catch (e: any) {
            console.error('Chat error:', e);

            let errorMsg = "Terjadi kesalahan. Silakan coba lagi.";
            const errMessage = e?.message || e?.toString() || "";

            // Identifikasi jenis error
            if (errMessage.includes('429') || errMessage.includes('quota') || errMessage.includes('RESOURCE_EXHAUSTED')) {
                errorMsg = "⚠️ Semua API sedang sibuk atau quota habis. Silakan tunggu beberapa saat dan coba lagi.";
            } else if (errMessage.includes('403') || errMessage.includes('API key') || errMessage.includes('key not valid') || errMessage.includes('leaked')) {
                errorMsg = "🔑 Semua API key tidak valid atau dilaporkan bocor. Silakan hubungi developer untuk mengganti API key.";
            } else if (errMessage.includes('400') || errMessage.includes('invalid')) {
                errorMsg = "❌ Permintaan tidak valid. Coba dengan pertanyaan yang lebih sederhana.";
            } else if (errMessage.includes('network') || errMessage.includes('fetch')) {
                errorMsg = "🌐 Koneksi internet bermasalah. Periksa koneksi Anda dan coba lagi.";
            } else if (errMessage.includes('blocked') || errMessage.includes('safety')) {
                errorMsg = "🛡️ Pertanyaan Anda diblokir oleh filter keamanan. Coba dengan kata-kata yang berbeda.";
            }

            setConversation(prev => [...prev, { role: 'model', text: errorMsg }]);
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
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-stone-950 dark:via-purple-950/20 dark:to-stone-900 flex flex-col relative overflow-hidden transition-colors duration-500">

            {/* Fixed Top-Right Theme Toggle */}
            <div className="fixed top-24 right-8 z-[60]">
                <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            </div>

            {/* Fixed Top-Left Online Indicator */}
            <div className="fixed top-24 left-8 z-[60]">
                <div className="relative group">
                    <button
                        onClick={() => setShowStatsPopup(!showStatsPopup)}
                        onMouseEnter={() => setShowStatsPopup(true)}
                        onMouseLeave={() => setShowStatsPopup(false)}
                        className="p-2 rounded-full bg-white/50 dark:bg-stone-800/50 hover:bg-white dark:hover:bg-stone-700 transition-all text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 shadow-sm flex items-center justify-center relative backdrop-blur-md"
                    >
                        <Users size={18} className={isConnected && globalPresence.onlineCount > 0 ? "text-green-500" : "text-stone-400"} />
                        {isConnected && globalPresence.onlineCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 text-[8px] text-white justify-center items-center flex">{globalPresence.onlineCount}</span>
                            </span>
                        )}
                    </button>

                    <AnimatePresence>
                        {showStatsPopup && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute top-full left-0 mt-3 w-56 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 p-5 z-50 transform origin-top-left"
                            >
                                <div className="flex items-center justify-between mb-4 border-b border-stone-100 dark:border-stone-800 pb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="relative">
                                            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                                        </div>
                                        <span className="text-xs font-bold text-stone-700 dark:text-stone-200 uppercase tracking-wider">Live Users</span>
                                    </div>
                                    <span className="text-[10px] font-mono text-stone-400">{isConnected ? 'ONLINE' : 'OFFLINE'}</span>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-stone-600 dark:text-stone-400 flex items-center gap-2"><Sparkles size={12} className="text-purple-400" /> Landing Page</span>
                                        <span className="text-xs font-bold font-mono bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded text-stone-600 dark:text-stone-300">{globalStats.landing}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-stone-600 dark:text-stone-400 flex items-center gap-2"><Zap size={12} className="text-amber-400" /> Creating Recap</span>
                                        <span className="text-xs font-bold font-mono bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded text-stone-600 dark:text-stone-300">{globalStats.creating}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-stone-600 dark:text-stone-400 flex items-center gap-2"><BookOpen size={12} className="text-pink-400" /> Reading Result</span>
                                        <span className="text-xs font-bold font-mono bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded text-stone-600 dark:text-stone-300">{globalStats.result}</span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex justify-between items-center">
                                    <span className="text-[10px] text-stone-400 font-medium">Total Online</span>
                                    <span className="text-sm font-bold text-green-600 dark:text-green-400 font-mono">{globalStats.total}</span>
                                </div>

                                {/* Arrow */}
                                <div className="absolute -top-1.5 left-3 w-3 h-3 bg-white dark:bg-stone-900 border-t border-l border-stone-200 dark:border-stone-800 transform rotate-45"></div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Navbar Fixed */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 px-6 py-4 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles className="text-pastel-primary" size={24} />
                        <span className="font-bold text-lg text-stone-800 dark:text-stone-100">Recap Chat</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600 dark:text-stone-400">
                        <button onClick={() => setAppState(AppState.LANDING)} className="hover:text-pastel-primary transition-colors">Home</button>
                        <a href="#fitur" className="hover:text-pastel-primary transition-colors">Fitur</a>
                        <a href="#cara-kerja" className="hover:text-pastel-primary transition-colors">Cara Kerja</a>
                        <button onClick={() => setAppState(AppState.ABOUT_WEBSITE)} className="hover:text-pastel-primary transition-colors">Tentang Website</button>
                        <button onClick={() => setAppState(AppState.ABOUT_CREATOR)} className="hover:text-pastel-primary transition-colors">Tentang Pembuat</button>
                    </div>
                    <div className="flex items-center gap-3">

                        <Button onClick={() => setAppState(AppState.UPLOAD)} className="!px-6 !py-2 text-sm">Mulai Rekap</Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section - JANGAN DIUBAH TEKSNYA */}
            <section className="relative min-h-screen flex flex-col justify-center items-center px-4 text-center z-10 max-w-5xl mx-auto">
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
                        📌 Lihat Contoh Rekap
                    </button>
                </motion.div>
            </section>

            {/* Section 1: Masalah yang Dialami Banyak Orang (Relatable Section) */}
            <section className="py-20 px-4 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-4 font-heading">Kadang kita gak lupa… kita cuma capek scroll.</h2>
                        <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto leading-relaxed">Chat panjang itu bukan masalah, tapi kalau harus cari satu pesan penting dari ratusan bubble… itu baru menyiksa. Recap Chat hadir buat bantu kamu merapikan semuanya dalam sekali upload.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: "📱", text: "Scroll ribuan chat cuma buat cari satu kalimat." },
                            { icon: "🔍", text: "Penasaran topik apa yang paling sering muncul." },
                            { icon: "🤔", text: "Pengen ngerti pola komunikasi tapi bingung mulai dari mana." },
                            { icon: "💭", text: "Mau refleksi, tapi chat terlalu berantakan." }
                        ].map((item, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white dark:bg-stone-800 p-6 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-700 flex items-start gap-4">
                                <div className="text-3xl shrink-0">{item.icon}</div>
                                <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">{item.text}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 3: Kenapa Recap Chat Berbeda? (Value Proposition) */}
            <section className="py-20 px-4 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-4 font-heading">Bukan cuma rangkuman. Ini refleksi.</h2>
                        <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto leading-relaxed">Recap Chat bukan sekadar meringkas chat. Website ini dibuat untuk membantu kamu melihat percakapan dari sudut pandang yang lebih jernih — tanpa menghakimi, tanpa mengarang, dan tanpa drama berlebihan.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: Scale, title: "Netral & Realistis", desc: "AI tidak memaksakan cerita yang tidak ada di chat.", gradient: "from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10" },
                            { icon: BookOpen, title: "Bisa Dibaca Seperti Album Kenangan", desc: "Bukan data kaku, tapi recap yang terasa hidup.", gradient: "from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10" },
                            { icon: Eye, title: "Visual Nyaman", desc: "Tampilan soft, rapi, dan enak dilihat.", gradient: "from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10" },
                            { icon: MessageSquare, title: "Bisa Tanya AI Langsung", desc: "Kamu bisa eksplor percakapan lebih dalam kapan pun.", gradient: "from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10" }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -5 }}
                                className={`bg-gradient-to-br ${item.gradient} backdrop-blur-md p-6 rounded-3xl border border-white/40 dark:border-stone-700/40 shadow-lg hover:shadow-xl transition-all`}
                            >
                                <item.icon className="text-stone-700 dark:text-stone-300 mb-4" size={32} />
                                <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-2">{item.title}</h3>
                                <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 4: Fitur Utama (8 Fitur Lengkap) */}
            <section id="fitur" className="py-20 px-4 bg-white/80 dark:bg-stone-950/80">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-4 font-heading">Fitur yang bikin chat kamu jadi lebih bermakna.</h2>
                        <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">Bukan cuma baca ulang chat. Tapi memahami isinya.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: FileText, title: "Chat Summary", desc: "Ringkasan percakapan dari awal sampai akhir dengan gaya natural.", color: "purple" },
                            { icon: Clock, title: "Timeline Percakapan", desc: "Lihat fase hubungan dari waktu ke waktu.", color: "blue" },
                            { icon: Heart, title: "Analisis Emosi", desc: "Deteksi mood dominan dan perubahan suasana.", color: "pink" },
                            { icon: Tag, title: "Topik Dominan", desc: "Ketahui hal-hal yang paling sering dibahas.", color: "green" },
                            { icon: Sparkles, title: "Key Moments", desc: "Tandai momen penting yang terasa berkesan atau berubah drastis.", color: "yellow" },
                            { icon: BarChart2, title: "Communication Style", desc: "Analisis siapa yang lebih aktif, lebih ekspresif, atau lebih sering memulai.", color: "indigo" },
                            { icon: Quote, title: "Memorable Lines", desc: "Kalimat-kalimat unik yang bikin ketawa atau bikin inget.", color: "rose" },
                            { icon: Brain, title: "Ask AI Mode", desc: "Tanya AI tentang chat kamu secara bebas dan lebih personal.", color: "orange" }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                whileHover={{ scale: 1.03 }}
                                className="bg-white dark:bg-stone-800 p-6 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-700 group hover:shadow-lg transition-all"
                            >
                                <div className={`w-12 h-12 rounded-2xl bg-${feature.color}-100 dark:bg-${feature.color}-900/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className={`text-${feature.color}-600 dark:text-${feature.color}-400`} size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-2">{feature.title}</h3>
                                <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 2: Cara Kerja Recap Chat (Step-by-Step) */}
            <section id="cara-kerja" className="py-20 px-4 bg-white/80 dark:bg-stone-950/80">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 font-heading mb-4">Cara kerja Recap Chat itu simpel banget.</h2>
                        <p className="text-lg text-stone-600 dark:text-stone-400">Cuma 4 langkah. Tanpa ribet. Tanpa drama.</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8 relative">
                        {/* Garis penghubung */}
                        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-pastel-primary/20 via-pastel-primary to-pastel-primary/20 -translate-y-1/2 z-0"></div>

                        {[
                            { num: "01", icon: Smartphone, title: "Export Chat WhatsApp", desc: "Ambil file chat langsung dari WhatsApp kamu." },
                            { num: "02", icon: Upload, title: "Upload File ke Recap Chat", desc: "Masukkan file .txt chat ke sistem." },
                            { num: "03", icon: Brain, title: "AI Menganalisis Percakapan", desc: "AI membaca pola, emosi, timeline, dan topik." },
                            { num: "04", icon: Sparkles, title: "Hasil Recap Langsung Muncul", desc: "Kamu bisa lihat recap lengkap + tanya AI lebih dalam." }
                        ].map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className="bg-white dark:bg-stone-800 p-8 rounded-3xl shadow-lg border border-stone-100 dark:border-stone-700 relative z-10 group hover:shadow-xl hover:-translate-y-1 transition-all"
                            >
                                <div className="flex items-start gap-6">
                                    <div className="text-6xl font-bold text-pastel-primary/20 dark:text-pastel-primary/10 font-heading shrink-0">{step.num}</div>
                                    <div className="flex-1">
                                        <div className="w-14 h-14 rounded-2xl bg-pastel-secondary dark:bg-stone-700 flex items-center justify-center text-pastel-secondaryText mb-4 group-hover:scale-110 transition-transform">
                                            <step.icon size={28} />
                                        </div>
                                        <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-3">{step.title}</h3>
                                        <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">{step.desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 5: Highlight Fitur Tanya AI (Main Attraction) */}
            <section className="py-20 px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-orange-950/20">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-4 font-heading">Kamu bisa nanya AI apa pun tentang chat itu.</h2>
                        <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto leading-relaxed">Kadang kita gak butuh rangkuman doang. Kita butuh jawaban. Recap Chat bisa jadi teman refleksi yang netral, santai, dan gak menghakimi.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        {/* Left: Example Questions */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-6">Contoh pertanyaan yang bisa kamu tanyakan:</h3>
                            {[
                                "Topik apa yang paling sering kita bahas?",
                                "Apakah hubungan ini terlihat sehat?",
                                "Siapa yang lebih sering mulai chat duluan?",
                                "Apa momen yang paling penting?",
                                "Kenapa vibe chat ini terasa berubah?"
                            ].map((q, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-start gap-3 bg-white/60 dark:bg-stone-800/60 backdrop-blur-sm p-4 rounded-2xl border border-stone-200 dark:border-stone-700 hover:border-pastel-primary transition-colors"
                                >
                                    <MessageCircle className="text-pastel-primary shrink-0 mt-0.5" size={20} />
                                    <p className="text-sm text-stone-700 dark:text-stone-300 font-medium">{q}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Right: Chat Preview */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-white dark:bg-stone-800 p-6 rounded-3xl shadow-xl border border-stone-200 dark:border-stone-700"
                        >
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-200 dark:border-stone-700">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pastel-primary to-pink-400 flex items-center justify-center">
                                    <Bot className="text-white" size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-stone-800 dark:text-stone-100">Recap AI</h4>
                                    <p className="text-xs text-stone-500">Siap menjawab pertanyaan kamu</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* User Bubble */}
                                <div className="flex justify-end">
                                    <div className="bg-pastel-primary text-white px-4 py-3 rounded-2xl rounded-tr-sm max-w-[80%]">
                                        <p className="text-sm">Siapa yang lebih sering mulai chat?</p>
                                    </div>
                                </div>

                                {/* AI Bubble */}
                                <div className="flex justify-start">
                                    <div className="bg-stone-100 dark:bg-stone-700 px-4 py-3 rounded-2xl rounded-tl-sm max-w-[85%]">
                                        <p className="text-sm text-stone-700 dark:text-stone-300">Berdasarkan analisis chat, kamu lebih sering memulai percakapan (62%). Dia lebih sering merespons setelah beberapa jam.</p>
                                    </div>
                                </div>

                                {/* Typing Indicator */}
                                <div className="flex justify-start">
                                    <div className="bg-stone-100 dark:bg-stone-700 px-4 py-3 rounded-2xl rounded-tl-sm">
                                        <div className="flex gap-1">
                                            <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0 }} className="w-2 h-2 rounded-full bg-stone-400"></motion.div>
                                            <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-2 h-2 rounded-full bg-stone-400"></motion.div>
                                            <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="w-2 h-2 rounded-full bg-stone-400"></motion.div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Section 6: Preview Hasil Rekap (Demo) */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 font-heading mb-4">Contoh hasil recap yang akan kamu dapat.</h2>
                        <p className="text-lg text-stone-600 dark:text-stone-400">Semua ditampilkan rapi dalam bentuk dashboard yang nyaman dibaca.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: "Highlight Penting", emoji: "✨", desc: "Momen-momen kunci dalam percakapan", color: "from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20" },
                            { title: "Topik Dominan", emoji: "💬", desc: "Apa yang paling sering dibahas", color: "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20" },
                            { title: "Mood Percakapan", emoji: "😊", desc: "Vibe chat: hangat, dingin, atau netral", color: "from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20" },
                            { title: "Kesimpulan Singkat", emoji: "📝", desc: "Rangkuman keseluruhan chat", color: "from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20" }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`bg-gradient-to-br ${item.color} p-8 rounded-3xl border border-stone-100 dark:border-stone-700 text-center hover:scale-105 transition-transform`}
                            >
                                <div className="text-5xl mb-4">{item.emoji}</div>
                                <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-2">{item.title}</h3>
                                <p className="text-sm text-stone-600 dark:text-stone-400">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 7: Privacy & Safety Guarantee (Paling Penting) */}
            <section className="py-20 px-4 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-cyan-950/20">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <ShieldCheck size={64} className="text-emerald-500 mx-auto mb-6" />
                        <h2 className="text-3xl md:text-5xl font-bold text-stone-800 dark:text-stone-100 mb-6 font-heading">Privasi kamu bukan fitur. Itu prinsip.</h2>
                        <p className="text-lg text-stone-600 dark:text-stone-300 mb-8 leading-relaxed max-w-3xl mx-auto">
                            Recap Chat tidak menyimpan chat kamu ke database. Tidak ada yang dibaca manusia. Tidak ada yang dipublikasikan. Semua hanya diproses untuk analisis — lalu selesai.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                        {[
                            { icon: Lock, title: "Tidak menyimpan chat ke database", desc: "Chat kamu hanya ada di memori sementara selama proses analisis." },
                            { icon: Eye, title: "Tidak mempublikasikan chat user", desc: "Tidak ada satu pun chat yang bisa dilihat orang lain atau developer." },
                            { icon: Users, title: "Tidak mengumpulkan identitas pribadi", desc: "Kami tidak tahu siapa kamu. Tidak ada login, tidak ada tracking." },
                            { icon: FileText, title: "File hanya dipakai untuk proses analisis", desc: "Setelah analisis selesai, file tidak disimpan permanen." },
                            { icon: CheckCircle, title: "Transparan dan bisa dipercaya", desc: "Semua proses dilakukan di sisi client dengan API yang aman." }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                className="bg-white/90 dark:bg-stone-800/90 backdrop-blur-sm p-6 rounded-2xl border border-emerald-200 dark:border-emerald-900/30 shadow-sm hover:shadow-lg transition-all"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                                        <item.icon className="text-emerald-600 dark:text-emerald-400" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-2 text-sm">{item.title}</h3>
                                        <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="bg-white/60 dark:bg-stone-800/60 backdrop-blur-sm p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800/30 text-center"
                    >
                        <p className="text-sm text-stone-600 dark:text-stone-400 italic">
                            <strong className="text-stone-800 dark:text-stone-200">Catatan:</strong> Kamu tetap punya kontrol penuh atas file kamu sendiri. Recap Chat hanya alat bantu, bukan penyimpan data.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Testimoni */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-stone-800 dark:text-stone-100 font-heading mb-4">Kata Mereka</h2>
                        <p className="text-stone-600 dark:text-stone-400">User yang sudah coba Recap Chat</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { quote: "Gila sih, chat 2 bulan bisa jadi ringkasan 1 halaman. Akhirnya ngerti kenapa hubungan gue berubah.", name: "Rina, 21" },
                            { quote: "Akhirnya nemu inti masalah dari chat yang bikin pusing. AI-nya jujur banget, gak lebay.", name: "Budi, 24" },
                            { quote: "Kayak punya asisten yang ngerangkum drama hidup gue. Serius berguna banget!", name: "Sari, 19" }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white dark:bg-stone-800 p-8 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-700"
                            >
                                <Quote className="text-pastel-primary mb-4" size={32} />
                                <p className="text-stone-600 dark:text-stone-400 mb-6 leading-relaxed italic">"{item.quote}"</p>
                                <p className="text-sm font-bold text-stone-800 dark:text-stone-100">— {item.name}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20 px-4 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-stone-800 dark:text-stone-100 font-heading mb-4">FAQ</h2>
                        <p className="text-stone-600 dark:text-stone-400">Pertanyaan yang sering ditanyakan</p>
                    </div>
                    <div className="space-y-4">
                        {[
                            { q: "Apakah chat saya disimpan?", a: "Tidak. Chat kamu hanya diproses sementara dan otomatis hilang setelah sesi selesai." },
                            { q: "Apakah AI bisa ngarang?", a: "Tidak. AI hanya menganalisis berdasarkan isi chat yang kamu upload. Tidak ada data yang dibuat-buat." },
                            { q: "Format file apa yang didukung?", a: "Saat ini hanya mendukung file export WhatsApp dalam format .txt" },
                            { q: "Kenapa hasil rangkuman kadang beda?", a: "AI menganalisis berdasarkan konteks dan pola. Hasil bisa sedikit berbeda tergantung interpretasi." },
                            { q: "Apakah bisa dipakai untuk chat grup?", a: "Ya, bisa. Tapi hasil terbaik untuk chat personal (1 on 1)." },
                            { q: "Apakah bisa download hasil rekap?", a: "Ya! Kamu bisa download hasil rekap dalam format PDF atau share ke story." }
                        ].map((item, i) => (
                            <motion.details
                                key={i}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="bg-white dark:bg-stone-800 p-6 rounded-2xl border border-stone-100 dark:border-stone-700 group"
                            >
                                <summary className="font-bold text-stone-800 dark:text-stone-100 cursor-pointer flex items-center justify-between">
                                    {item.q}
                                    <ChevronRight className="group-open:rotate-90 transition-transform" size={20} />
                                </summary>
                                <p className="text-sm text-stone-600 dark:text-stone-400 mt-4 leading-relaxed">{item.a}</p>
                            </motion.details>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section (Ajakan Terakhir) */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 p-12 md:p-16 rounded-[3rem] shadow-xl border border-purple-200 dark:border-purple-800/30 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-pastel-primary/20 rounded-full blur-3xl"></div>
                    <Sparkles className="text-pastel-primary mx-auto mb-6" size={64} />
                    <h2 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-6 font-heading">Kalau chat kamu panjang… jangan kamu yang capek.</h2>
                    <p className="text-lg text-stone-600 dark:text-stone-300 mb-8 max-w-2xl mx-auto">Upload sekarang, biar Recap Chat yang bantu rangkum, baca, dan jelasin semuanya.</p>
                    <Button onClick={() => setAppState(AppState.UPLOAD)} className="px-12 py-5 text-xl shadow-2xl">
                        Mulai Recap Sekarang 🚀
                    </Button>
                </div>
            </section>

            <Footer setAppState={setAppState} />



            {/* Donation Popup */}
            <AnimatePresence>
                {showDonationPopup && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => closeDonationPopup(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-stone-800 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-stone-200 dark:border-stone-700 relative"
                        >
                            <button
                                onClick={() => closeDonationPopup(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-full transition-colors"
                            >
                                <XCircle size={20} className="text-stone-400" />
                            </button>

                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Heart className="text-pastel-primary" size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-3 font-heading">Boleh aku minta dukungan kecil? 💜</h3>
                                <p className="text-stone-600 dark:text-stone-400 leading-relaxed text-sm">
                                    Recap Chat dibuat dengan niat baik supaya orang bisa membaca ulang chat dengan cara yang lebih rapi dan bermakna. Kalau kamu merasa website ini membantu, kamu bisa dukung pengembangnya lewat donasi kecil buat biaya AI dan pengembangan fitur.
                                </p>
                            </div>

                            <div className="space-y-3 mb-6">
                                <Button
                                    onClick={() => {
                                        window.open('https://saweria.co/ackmadelfan', '_blank');
                                        closeDonationPopup(false);
                                    }}
                                    className="w-full py-4 text-base"
                                >
                                    ✨ Dukung Developer
                                </Button>
                                <button
                                    onClick={() => closeDonationPopup(false)}
                                    className="w-full py-3 text-sm text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors font-medium"
                                >
                                    Nanti dulu
                                </button>
                            </div>

                            <button
                                onClick={() => closeDonationPopup(true)}
                                className="text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors mx-auto block"
                            >
                                Jangan tampilkan lagi
                            </button>

                            <p className="text-[10px] text-stone-400 text-center mt-4 italic">
                                Donasi bukan kewajiban. Website tetap bisa kamu pakai seperti biasa.
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    const renderStudio = () => (
        <Layout title="Mulai Analisis Chat Kamu" className="flex flex-col min-h-screen">
            {/* Fixed Back Button & Theme Toggle */}
            <div className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between max-w-4xl mx-auto">
                <Button variant="ghost" onClick={() => setAppState(AppState.LANDING)} className="!px-4 !py-2 text-sm flex items-center gap-2 bg-white/80 dark:bg-stone-800/80 backdrop-blur-md shadow-sm">
                    <ArrowLeft size={16} />
                    Kembali
                </Button>
                <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            </div>

            <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col items-center mt-16">
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
                <div className="fixed top-4 right-4 z-50"><ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} /></div>

                {/* Fixed Top-Left Online Indicator */}
                <div className="fixed top-4 left-4 z-50">
                    <div className="relative group">
                        <button
                            onClick={() => setShowStatsPopup(!showStatsPopup)}
                            onMouseEnter={() => setShowStatsPopup(true)}
                            onMouseLeave={() => setShowStatsPopup(false)}
                            className="p-2 rounded-full bg-white/50 dark:bg-stone-800/50 hover:bg-white dark:hover:bg-stone-700 transition-all text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 shadow-sm flex items-center justify-center relative backdrop-blur-md"
                        >
                            <Users size={18} className={isConnected && globalPresence.onlineCount > 0 ? "text-green-500" : "text-stone-400"} />
                            {isConnected && globalPresence.onlineCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 text-[8px] text-white justify-center items-center flex">{globalPresence.onlineCount}</span>
                                </span>
                            )}
                        </button>

                        <AnimatePresence>
                            {showStatsPopup && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute top-full left-0 mt-3 w-56 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 p-5 z-50 transform origin-top-left"
                                >
                                    <div className="flex items-center justify-between mb-4 border-b border-stone-100 dark:border-stone-800 pb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="relative">
                                                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                                            </div>
                                            <span className="text-xs font-bold text-stone-700 dark:text-stone-200 uppercase tracking-wider">Live Users</span>
                                        </div>
                                        <span className="text-[10px] font-mono text-stone-400">{isConnected ? 'ONLINE' : 'OFFLINE'}</span>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-stone-600 dark:text-stone-400 flex items-center gap-2"><Sparkles size={12} className="text-purple-400" /> Landing Page</span>
                                            <span className="text-xs font-bold font-mono bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded text-stone-600 dark:text-stone-300">{globalStats.landing}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-stone-600 dark:text-stone-400 flex items-center gap-2"><Zap size={12} className="text-amber-400" /> Creating Recap</span>
                                            <span className="text-xs font-bold font-mono bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded text-stone-600 dark:text-stone-300">{globalStats.creating}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-stone-600 dark:text-stone-400 flex items-center gap-2"><BookOpen size={12} className="text-pink-400" /> Reading Result</span>
                                            <span className="text-xs font-bold font-mono bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded text-stone-600 dark:text-stone-300">{globalStats.result}</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex justify-between items-center">
                                        <span className="text-[10px] text-stone-400 font-medium">Total Online</span>
                                        <span className="text-sm font-bold text-green-600 dark:text-green-400 font-mono">{globalStats.total}</span>
                                    </div>

                                    {/* Arrow */}
                                    <div className="absolute -top-1.5 left-3 w-3 h-3 bg-white dark:bg-stone-900 border-t border-l border-stone-200 dark:border-stone-800 transform rotate-45"></div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Realtime Toast Notifications for Join/Leave */}
                <PresenceToast />

                {showStory && <StoryViewer analysis={analysis} onClose={() => setShowStory(false)} />}
                {showPDFGenerator && <PDFGenerator chatData={chatData} analysis={analysis} onClose={() => { setShowPDFGenerator(false); updateMyStatus('reading'); }} theme={isDarkMode ? 'dark' : 'pastel'} />}
                {showStoryGenerator && (
                    <AdvancedStoryGenerator
                        analysisResult={analysis}
                        chatData={chatData!}
                        onBack={() => { setShowStoryGenerator(false); updateMyStatus('reading'); }}
                        isDarkMode={isDarkMode}
                    />
                )}

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

                        <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4">
                            <button onClick={() => { setShowPDFGenerator(true); updateMyStatus('generating'); }} className="inline-flex items-center gap-3 px-8 py-3 rounded-full font-bold shadow-xl transition-all text-sm bg-stone-900 text-white dark:bg-white dark:text-stone-900 hover:scale-105 active:scale-95 group">
                                <Download size={18} className="group-hover:-translate-y-1 transition-transform" />
                                <span>Download Recap PDF</span>
                            </button>

                            <div className="flex gap-2">
                                <button onClick={() => setShowStoryGenerator(true)} className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-bold shadow-md transition-all text-sm bg-white/80 dark:bg-stone-800/80 backdrop-blur-sm border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-white hover:border-pastel-primary group">
                                    <Share2 size={16} className="group-hover:rotate-12 transition-transform" /> Share to Story
                                </button>
                                <button onClick={() => setShowStory(true)} className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-bold shadow-md transition-all text-sm bg-white/80 dark:bg-stone-800/80 backdrop-blur-sm border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-white hover:border-pastel-primary group">
                                    <Sparkles size={16} className="text-amber-400 group-hover:scale-125 transition-transform" /> Highlight
                                </button>
                            </div>
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
        <div className="flex flex-col h-screen bg-gradient-to-br from-pastel-bgEnd to-pastel-lavender dark:from-stone-950 dark:via-stone-900 dark:to-stone-950 font-sans transition-colors duration-300">
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
        <>
            <Layout title="Tentang Recap Chat" className="flex flex-col min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 dark:from-stone-950 dark:via-purple-950/10 dark:to-stone-900">
                {/* Fixed Back Button & Theme Toggle */}
                <div className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between max-w-5xl mx-auto">
                    <Button variant="ghost" onClick={() => setAppState(AppState.LANDING)} className="!px-4 !py-2 text-sm flex items-center gap-2 bg-white/80 dark:bg-stone-800/80 backdrop-blur-md shadow-sm">
                        <ArrowLeft size={16} />
                        Kembali
                    </Button>
                    <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                </div>

                <div className="max-w-5xl mx-auto space-y-20 flex-1 py-20 px-4 mt-16">
                    {/* Section 1: Hero / Intro */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Sparkles className="text-pastel-primary" size={48} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-stone-800 dark:text-stone-100 mb-6 font-heading">Tentang Recap Chat</h1>
                        <p className="text-xl text-stone-600 dark:text-stone-300 leading-relaxed max-w-3xl mx-auto">
                            Recap Chat adalah ruang digital untuk membantu kamu <strong className="text-pastel-primary">membaca ulang percakapan WhatsApp</strong> dengan cara yang lebih rapi, jelas, dan bermakna. Bukan sekadar merangkum, tapi memahami.
                        </p>
                    </motion.div>

                    {/* Section 2: Kenapa Website Ini Dibuat? */}
                    <div>
                        <h2 className="text-3xl font-bold text-stone-800 dark:text-stone-100 mb-8 text-center font-heading">Kenapa Website Ini Dibuat?</h2>
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-8 md:p-10 rounded-3xl border border-blue-100 dark:border-blue-900/30">
                            <p className="text-lg text-stone-700 dark:text-stone-300 leading-relaxed mb-6">
                                Kadang kita punya chat yang panjang banget. Ratusan, bahkan ribuan pesan. Dan kadang kita butuh <strong>baca ulang</strong> untuk:
                            </p>
                            <div className="grid md:grid-cols-2 gap-4">
                                {[
                                    "Cari momen penting yang hampir terlupakan",
                                    "Pahami pola komunikasi dalam hubungan",
                                    "Refleksi tentang percakapan yang sudah terjadi",
                                    "Cari tahu topik apa yang paling sering dibahas"
                                ].map((item, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-start gap-3 bg-white/60 dark:bg-stone-800/60 p-4 rounded-2xl">
                                        <CheckCircle className="text-blue-500 shrink-0 mt-0.5" size={20} />
                                        <p className="text-sm text-stone-700 dark:text-stone-300">{item}</p>
                                    </motion.div>
                                ))}
                            </div>
                            <p className="text-stone-600 dark:text-stone-400 mt-6 italic text-sm">
                                Recap Chat hadir buat bantu kamu melakukan semua itu tanpa harus scroll ribuan chat secara manual.
                            </p>
                        </div>
                    </div>

                    {/* Section 3: Manfaat Utama */}
                    <div>
                        <h2 className="text-3xl font-bold text-stone-800 dark:text-stone-100 mb-8 text-center font-heading">Manfaat Utama untuk Kamu</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { icon: Clock, title: "Hemat Waktu", desc: "Gak perlu scroll ribuan chat. Langsung lihat ringkasan penting.", color: "from-purple-100 to-purple-50 dark:from-purple-900/20 dark:to-purple-950/10" },
                                { icon: Eye, title: "Lihat Pola yang Gak Kelihatan", desc: "Pahami dinamika percakapan dari sudut pandang yang lebih jernih.", color: "from-pink-100 to-pink-50 dark:from-pink-900/20 dark:to-pink-950/10" },
                                { icon: Heart, title: "Refleksi Lebih Dalam", desc: "Baca ulang chat bukan cuma buat nostalgia, tapi juga buat belajar.", color: "from-orange-100 to-orange-50 dark:from-orange-900/20 dark:to-orange-950/10" }
                            ].map((item, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className={`bg-gradient-to-br ${item.color} p-6 rounded-3xl border border-white/40 dark:border-stone-700/40 text-center`}>
                                    <div className="w-14 h-14 bg-white dark:bg-stone-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <item.icon className="text-pastel-primary" size={28} />
                                    </div>
                                    <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-2">{item.title}</h3>
                                    <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Section 4: Fitur Utama (8 Fitur) */}
                    <div>
                        <h2 className="text-3xl font-bold text-stone-800 dark:text-stone-100 mb-8 text-center font-heading">Fitur Utama yang Bisa Kamu Pakai</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { icon: FileText, title: "Chat Summary", desc: "Ringkasan percakapan dari awal sampai akhir dengan gaya natural dan mudah dipahami." },
                                { icon: Calendar, title: "Timeline Percakapan", desc: "Lihat fase hubungan dari waktu ke waktu. Kapan mulai hangat, kapan mulai dingin." },
                                { icon: Heart, title: "Analisis Emosi", desc: "Deteksi mood dominan dan perubahan suasana sepanjang percakapan." },
                                { icon: Tag, title: "Topik Dominan", desc: "Ketahui hal-hal yang paling sering dibahas dalam chat kamu." },
                                { icon: Sparkles, title: "Key Moments", desc: "Tandai momen penting yang terasa berkesan atau berubah drastis." },
                                { icon: BarChart2, title: "Communication Style", desc: "Analisis siapa yang lebih aktif, lebih ekspresif, atau lebih sering memulai chat." },
                                { icon: Quote, title: "Memorable Lines", desc: "Kalimat-kalimat unik yang bikin ketawa, bikin sedih, atau bikin inget." },
                                { icon: Brain, title: "Ask AI Mode", desc: "Tanya AI tentang chat kamu secara bebas dan lebih personal." }
                            ].map((item, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-white/60 dark:bg-stone-800/60 p-6 rounded-2xl border border-stone-100 dark:border-stone-700 flex gap-4 hover:shadow-lg transition-shadow">
                                    <div className="w-12 h-12 bg-pastel-secondary dark:bg-stone-700 rounded-xl flex items-center justify-center shrink-0">
                                        <item.icon className="text-pastel-primary" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-stone-800 dark:text-stone-200 mb-1">{item.title}</h3>
                                        <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Section 5: Cara Kerja (Step by Step Flow) */}
                    <div>
                        <h2 className="text-3xl font-bold text-stone-800 dark:text-stone-100 mb-8 text-center font-heading">Cara Kerja Recap Chat</h2>
                        <p className="text-center text-stone-600 dark:text-stone-400 mb-10 max-w-2xl mx-auto">Prosesnya simpel dan cepat. Kamu gak perlu login, gak perlu install aplikasi. Langsung pakai.</p>

                        <div className="relative">
                            {/* Progress Line */}
                            <div className="hidden md:block absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-pastel-primary/20 via-pastel-primary to-pastel-primary/20"></div>

                            <div className="grid md:grid-cols-4 gap-6 relative z-10">
                                {[
                                    { num: "01", icon: Smartphone, title: "Export Chat WhatsApp", desc: "Ambil file chat dari WhatsApp (tanpa media lebih cepat)" },
                                    { num: "02", icon: Upload, title: "Upload File ke Website", desc: "Masukkan file .txt chat ke sistem Recap Chat" },
                                    { num: "03", icon: Cpu, title: "AI Menganalisis", desc: "AI membaca pola, emosi, timeline, dan topik secara otomatis" },
                                    { num: "04", icon: Eye, title: "Lihat Hasil + Tanya AI", desc: "Baca recap lengkap dan tanya AI lebih dalam" }
                                ].map((step, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="bg-white dark:bg-stone-800 p-6 rounded-3xl border border-stone-100 dark:border-stone-700 text-center relative">
                                        <div className="w-12 h-12 bg-pastel-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">{step.num}</div>
                                        <div className="w-14 h-14 bg-pastel-secondary dark:bg-stone-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <step.icon className="text-pastel-primary" size={28} />
                                        </div>
                                        <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-2 text-sm">{step.title}</h3>
                                        <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">{step.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 bg-white/60 dark:bg-stone-800/60 p-6 rounded-2xl border border-stone-100 dark:border-stone-700">
                            <p className="text-sm text-stone-600 dark:text-stone-400 italic text-center">
                                <strong className="text-stone-800 dark:text-stone-200">Catatan:</strong> Semua proses dilakukan secara otomatis menggunakan AI. Tidak ada manusia yang membaca chat kamu.
                            </p>
                        </div>
                    </div>

                    {/* Section 6: Privasi & Keamanan (PALING PENTING) */}
                    <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-cyan-950/20 p-10 md:p-12 rounded-3xl border-2 border-emerald-200 dark:border-emerald-800/30">
                        <div className="text-center mb-10">
                            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShieldCheck className="text-emerald-600 dark:text-emerald-400" size={48} />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100 mb-4 font-heading">Privasi & Keamanan Data Kamu</h2>
                            <p className="text-lg text-stone-600 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed">
                                Ini bagian paling penting. <strong className="text-emerald-600 dark:text-emerald-400">Chat kamu adalah urusan kamu.</strong> Website ini cuma alat bantu, bukan penyimpan data.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            {[
                                { icon: Lock, title: "Tidak Menyimpan ke Database", desc: "File chat kamu TIDAK disimpan di server atau database manapun. Setelah proses selesai, data hilang." },
                                { icon: Users, title: "Tidak Ada yang Baca Chat Kamu", desc: "Tidak ada manusia (termasuk developer) yang bisa atau akan membaca isi chat kamu. Semua proses otomatis oleh AI." },
                                { icon: Eye, title: "Tidak Mempublikasikan Data", desc: "Chat kamu tidak akan pernah dipublikasikan, dibagikan, atau dijadikan contoh untuk orang lain." },
                                { icon: RefreshCw, title: "Refresh = Hilang Total", desc: "Kalau kamu refresh halaman, semua data chat langsung hilang dari memori. Tidak ada jejak." },
                                { icon: FileText, title: "Hanya untuk Proses Analisis", desc: "File kamu hanya dipakai untuk proses analisis sementara. Tidak ada penyimpanan permanen." },
                                { icon: CheckCircle, title: "Tidak Jadi Dataset AI", desc: "Chat kamu tidak akan dipakai untuk melatih AI atau dijadikan dataset untuk keperluan lain." }
                            ].map((item, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-white/90 dark:bg-stone-800/90 backdrop-blur-sm p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/30 flex gap-4">
                                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center shrink-0">
                                        <item.icon className="text-emerald-600 dark:text-emerald-400" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-1 text-sm">{item.title}</h3>
                                        <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="bg-white/70 dark:bg-stone-800/70 backdrop-blur-sm p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800/30">
                            <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed text-center">
                                <strong className="text-emerald-600 dark:text-emerald-400">Jaminan:</strong> Kamu tetap punya kontrol penuh atas file kamu sendiri. Recap Chat hanya alat bantu untuk membaca, bukan untuk menyimpan atau menyebarkan.
                            </p>
                        </div>
                    </div>

                    {/* Section 7: Komitmen Developer */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-8 md:p-10 rounded-3xl border border-purple-100 dark:border-purple-900/30">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center shrink-0">
                                <Heart className="text-purple-600 dark:text-purple-400" size={28} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-2 font-heading">Komitmen Developer</h2>
                                <p className="text-stone-600 dark:text-stone-400 text-sm">Prinsip yang dipegang dalam membuat website ini</p>
                            </div>
                        </div>
                        <div className="space-y-3 text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                            <p className="flex items-start gap-2">
                                <CheckCircle className="text-purple-500 shrink-0 mt-0.5" size={16} />
                                Website ini dibuat dengan <strong>niat baik</strong> untuk membantu orang memahami percakapan mereka dengan lebih baik.
                            </p>
                            <p className="flex items-start gap-2">
                                <CheckCircle className="text-purple-500 shrink-0 mt-0.5" size={16} />
                                Developer <strong>tidak akan pernah</strong> mengakses, membaca, atau menyimpan chat user untuk kepentingan apapun.
                            </p>
                            <p className="flex items-start gap-2">
                                <CheckCircle className="text-purple-500 shrink-0 mt-0.5" size={16} />
                                Privasi user adalah <strong>prioritas utama</strong>, bukan fitur tambahan.
                            </p>
                            <p className="flex items-start gap-2">
                                <CheckCircle className="text-purple-500 shrink-0 mt-0.5" size={16} />
                                Website ini akan terus dikembangkan dengan <strong>transparansi</strong> dan <strong>kejujuran</strong>.
                            </p>
                        </div>
                    </div>

                    {/* Section 8: FAQ */}
                    <div>
                        <h2 className="text-3xl font-bold text-stone-800 dark:text-stone-100 mb-8 text-center font-heading">Pertanyaan yang Sering Ditanyakan</h2>
                        <div className="space-y-4">
                            {[
                                { q: "Apakah chat saya benar-benar aman?", a: "Ya. Chat kamu tidak disimpan di database, tidak dibaca manusia, dan tidak dipublikasikan. Setelah proses selesai, data hilang dari memori." },
                                { q: "Apakah saya perlu login atau daftar akun?", a: "Tidak perlu. Website ini bisa langsung dipakai tanpa login, tanpa daftar, tanpa install aplikasi." },
                                { q: "Apakah AI bisa salah dalam menganalisis?", a: "Bisa. AI menganalisis berdasarkan pola dan konteks yang ada. Hasil analisis bukan kebenaran mutlak, tapi perspektif tambahan untuk membantu kamu memahami chat." },
                                { q: "Apakah bisa untuk chat grup?", a: "Bisa, tapi hasil terbaik untuk chat personal (1 on 1). Chat grup dengan banyak orang bisa lebih kompleks dan hasilnya mungkin kurang detail." },
                                { q: "Berapa lama proses analisis?", a: "Tergantung panjang chat. Biasanya 30 detik - 2 menit. Semakin panjang chat, semakin lama prosesnya." },
                                { q: "Apakah website ini gratis?", a: "Untuk sekarang bisa digunakan gratis. Tapi mungkin ke depan akan ada batas penggunaan untuk menjaga biaya AI." },
                                { q: "Bagaimana cara export chat WhatsApp?", a: "Buka chat → Klik titik tiga di pojok kanan atas → Pilih 'Ekspor chat' → Pilih 'Tanpa Media' → Simpan file .txt → Upload ke Recap Chat." }
                            ].map((item, i) => (
                                <motion.details key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="bg-white dark:bg-stone-800 p-6 rounded-2xl border border-stone-100 dark:border-stone-700 group cursor-pointer">
                                    <summary className="font-bold text-stone-800 dark:text-stone-100 flex items-center justify-between">
                                        <span className="text-sm md:text-base">{item.q}</span>
                                        <ChevronRight className="group-open:rotate-90 transition-transform shrink-0 ml-2" size={20} />
                                    </summary>
                                    <p className="text-sm text-stone-600 dark:text-stone-400 mt-4 leading-relaxed">{item.a}</p>
                                </motion.details>
                            ))}
                        </div>
                    </div>

                    {/* Section 9: Apa yang TIDAK Dilakukan */}
                    <div className="bg-amber-50/50 dark:bg-amber-900/10 p-8 rounded-3xl border border-amber-100 dark:border-amber-900/30">
                        <div className="flex items-center gap-3 mb-6">
                            <AlertCircle className="text-amber-500" size={32} />
                            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 font-heading">Apa yang TIDAK Dilakukan Website Ini?</h2>
                        </div>
                        <div className="space-y-3 text-sm text-stone-700 dark:text-stone-300">
                            <p className="flex items-start gap-2"><XCircle size={16} className="text-amber-500 shrink-0 mt-0.5" /> AI tidak membaca chat secara "mistis" atau supernatural</p>
                            <p className="flex items-start gap-2"><XCircle size={16} className="text-amber-500 shrink-0 mt-0.5" /> AI tidak menebak isi chat yang hilang atau tidak ada</p>
                            <p className="flex items-start gap-2"><XCircle size={16} className="text-amber-500 shrink-0 mt-0.5" /> AI tidak membuat fakta baru atau mengarang cerita</p>
                            <p className="flex items-start gap-2"><XCircle size={16} className="text-amber-500 shrink-0 mt-0.5" /> Hasil analisis bergantung sepenuhnya pada isi chat yang diberikan</p>
                            <p className="flex items-start gap-2"><XCircle size={16} className="text-amber-500 shrink-0 mt-0.5" /> Website ini bukan alat untuk "stalking" atau mengawasi orang lain</p>
                        </div>
                    </div>

                    {/* Section 10: CTA Penutup */}
                    <div className="text-center bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-orange-900/20 p-10 md:p-12 rounded-3xl border border-purple-200 dark:border-purple-800/30 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-pastel-primary/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-300/10 rounded-full blur-3xl"></div>
                        <div className="relative z-10">
                            <Sparkles className="text-pastel-primary mx-auto mb-6" size={56} />
                            <h2 className="text-2xl md:text-3xl font-bold text-stone-800 dark:text-stone-100 mb-4 font-heading">Siap Coba Recap Chat?</h2>
                            <p className="text-lg text-stone-600 dark:text-stone-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                                Kalau kamu udah paham cara kerjanya dan yakin chat kamu aman, sekarang saatnya coba langsung. Upload chat kamu dan lihat hasilnya.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <Button onClick={() => setAppState(AppState.UPLOAD)} className="px-10 py-4 text-lg">
                                    Mulai Recap Sekarang 🚀
                                </Button>
                                <Button variant="ghost" onClick={() => setAppState(AppState.LANDING)} className="text-sm">
                                    Baca Cara Kerja di Landing Page
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <Button variant="ghost" onClick={() => setAppState(AppState.LANDING)} className="text-sm">
                            ← Kembali ke Beranda
                        </Button>
                    </div>
                </div>
            </Layout>
            <Footer setAppState={setAppState} />
        </>
    );

    const renderAboutCreator = () => (
        <>
            <Layout title="Tentang Pembuat" className="flex flex-col min-h-screen bg-gradient-to-br from-white via-pink-50/30 to-purple-50/30 dark:from-stone-950 dark:via-pink-950/10 dark:to-stone-900">
                {/* Fixed Back Button & Theme Toggle */}
                <div className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between max-w-3xl mx-auto">
                    <Button variant="ghost" onClick={() => setAppState(AppState.LANDING)} className="!px-4 !py-2 text-sm flex items-center gap-2 bg-white/80 dark:bg-stone-800/80 backdrop-blur-md shadow-sm">
                        <ArrowLeft size={16} />
                        Kembali
                    </Button>
                    <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                </div>
                <div className="max-w-3xl mx-auto flex-1 py-20 px-4 space-y-16 mt-16">
                    {/* Header Section */}
                    <div className="text-center">
                        <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full mb-6 flex items-center justify-center overflow-hidden border-4 border-white dark:border-stone-700 shadow-xl mx-auto">
                            <User size={64} className="text-stone-400 dark:text-stone-500" />
                        </div>
                        <h1 className="text-4xl font-bold mb-2 text-stone-800 dark:text-stone-100 font-heading">Ackmad Elfan Purnama</h1>
                        <p className="text-stone-500 dark:text-stone-400 mb-4">Siswa SMK jurusan Rekayasa Perangkat Lunak (RPL)</p>
                        <div className="inline-block px-4 py-1.5 rounded-full bg-pastel-secondary dark:bg-stone-800 text-pastel-secondaryText dark:text-stone-300 text-sm font-medium">
                            ✨ Creator of Recap Chat
                        </div>
                    </div>

                    {/* Quote Pembuka */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-8 md:p-12 rounded-3xl border border-purple-100 dark:border-purple-800/30 text-center">
                        <Quote className="text-pastel-primary mx-auto mb-6" size={48} />
                        <p className="text-xl text-stone-700 dark:text-stone-300 italic font-serif leading-relaxed">
                            "Website ini dibuat oleh seseorang yang percaya bahwa teknologi bisa membantu manusia memahami hal-hal yang sulit dijelaskan lewat kata-kata."
                        </p>
                    </div>

                    {/* Cerita Singkat Pembuat */}
                    <div className="bg-white/60 dark:bg-stone-800/60 p-8 rounded-3xl border border-stone-100 dark:border-stone-700">
                        <div className="flex items-center gap-3 mb-6">
                            <BookOpen className="text-pastel-primary" size={28} />
                            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 font-heading">Cerita Singkat</h2>
                        </div>
                        <div className="space-y-4 text-stone-600 dark:text-stone-400 leading-relaxed">
                            <p>
                                Halo! Saya Ackmad Elfan Purnama, seorang siswa SMK yang suka bikin project yang bermanfaat. Saya bikin Recap Chat karena saya sadar… <strong>chat WhatsApp itu kadang jadi tempat cerita hidup, tapi kita sering lupa detailnya karena kepanjangan.</strong>
                            </p>
                            <p>
                                Saya suka coding, suka desain UI yang minimalis, dan suka bikin tool yang vibe-nya chill tapi tetap berguna. Recap Chat adalah salah satu project yang saya buat dengan harapan bisa membantu orang-orang memahami percakapan mereka dengan cara yang lebih jelas.
                            </p>
                        </div>
                    </div>

                    {/* Alasan Membuat Recap Chat */}
                    <div>
                        <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6 text-center font-heading">Kenapa Saya Membuat Recap Chat?</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { emoji: "🤔", title: "Sering lihat orang overthinking", desc: "Banyak orang overthinking karena chat yang panjang dan susah dipahami" },
                                { emoji: "😓", title: "Chat panjang bikin capek", desc: "Baca ulang chat ribuan pesan itu capek banget, padahal cuma butuh inti-nya" },
                                { emoji: "💡", title: "Ingin bikin tool berguna", desc: "Saya pengen bikin tool yang simpel tapi beneran berguna untuk kehidupan sehari-hari" }
                            ].map((item, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white/60 dark:bg-stone-800/60 p-6 rounded-2xl border border-stone-100 dark:border-stone-700 text-center">
                                    <div className="text-5xl mb-4">{item.emoji}</div>
                                    <h3 className="font-bold text-stone-800 dark:text-stone-200 mb-2">{item.title}</h3>
                                    <p className="text-sm text-stone-600 dark:text-stone-400">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Value yang Saya Pegang */}
                    <div>
                        <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6 text-center font-heading">Prinsip yang Saya Pegang</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { icon: ShieldCheck, title: "Privasi Nomor Satu", desc: "Data user harus dijaga. Tidak boleh disimpan sembarangan.", color: "emerald" },
                                { icon: CheckCircle, title: "Data Asli, Bukan Ngarang", desc: "AI harus jujur. Tidak boleh membuat-buat fakta atau mengarang cerita.", color: "blue" },
                                { icon: Eye, title: "Tampilan Harus Nyaman", desc: "UI/UX yang baik bukan cuma keren, tapi nyaman dan mudah digunakan.", color: "purple" }
                            ].map((item, i) => (
                                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white/60 dark:bg-stone-800/60 p-6 rounded-2xl border border-stone-100 dark:border-stone-700 text-center hover:shadow-lg transition-shadow">
                                    <div className={`w-14 h-14 bg-${item.color}-100 dark:bg-${item.color}-900/20 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                                        <item.icon className={`text-${item.color}-600 dark:text-${item.color}-400`} size={28} />
                                    </div>
                                    <h3 className="font-bold text-stone-800 dark:text-stone-200 mb-2">{item.title}</h3>
                                    <p className="text-sm text-stone-600 dark:text-stone-400">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Fun Facts */}
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 p-8 rounded-3xl border border-yellow-100 dark:border-yellow-900/30">
                        <div className="flex items-center gap-3 mb-6">
                            <Sparkles className="text-yellow-500" size={28} />
                            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 font-heading">Fun Facts About Me</h2>
                        </div>
                        <div className="space-y-3 text-stone-700 dark:text-stone-300">
                            <p className="flex items-start gap-2">✨ Saya suka desain UI minimalis dengan warna pastel</p>
                            <p className="flex items-start gap-2">✨ Saya suka bikin project yang vibe-nya chill dan nyaman</p>
                            <p className="flex items-start gap-2">✨ Saya pengen bikin tool yang beneran dipakai orang, bukan cuma project iseng</p>
                            <p className="flex items-start gap-2">✨ Saya percaya bahwa detail kecil itu penting dalam desain</p>
                            <p className="flex items-start gap-2">✨ Saya suka belajar hal baru, terutama tentang AI dan web development</p>
                        </div>
                    </div>

                    {/* Section Donasi */}
                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 p-8 md:p-12 rounded-3xl border border-pink-100 dark:border-pink-800/30 text-center">
                        <Coffee className="text-pastel-primary mx-auto mb-6" size={48} />
                        <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-4 font-heading">Support Pengembangan Recap Chat</h2>
                        <p className="text-stone-600 dark:text-stone-400 mb-8 leading-relaxed max-w-xl mx-auto">
                            Kalau kamu merasa Recap Chat berguna, kamu bisa support saya lewat donasi. Ini bakal bantu buat server, maintenance, dan pengembangan fitur baru. Terima kasih banyak! 🙏
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="https://saweria.co/ackmadelfan" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold shadow-lg transition-all bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:scale-105 active:scale-95">
                                <Coffee size={20} /> Support via Saweria
                            </a>
                            <button className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold shadow-md transition-all bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700">
                                <Share2 size={20} /> Share ke Teman
                            </button>
                        </div>
                    </div>

                    {/* Kontak / Sosial Media */}
                    <div>
                        <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6 text-center font-heading">Connect With Me</h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            {[
                                { icon: MessageCircle, label: "Instagram", value: "@ackmadelfan", link: "https://instagram.com/ackmadelfan" },
                                { icon: Terminal, label: "GitHub", value: "ackmad", link: "https://github.com/ackmad" },
                                { icon: MessageSquare, label: "Email", value: "contact@ackmad.dev", link: "mailto:contact@ackmad.dev" }
                            ].map((item, i) => (
                                <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className="bg-white/60 dark:bg-stone-800/60 p-6 rounded-2xl border border-stone-100 dark:border-stone-700 text-center hover:border-pastel-primary hover:shadow-lg transition-all group">
                                    <item.icon className="text-pastel-primary mx-auto mb-3 group-hover:scale-110 transition-transform" size={32} />
                                    <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">{item.label}</p>
                                    <p className="font-bold text-stone-800 dark:text-stone-200">{item.value}</p>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Closing */}
                    <div className="text-center space-y-6">
                        <p className="text-stone-600 dark:text-stone-400 italic">Terima kasih sudah menggunakan Recap Chat. Semoga bermanfaat! ✨</p>
                        <Button variant="ghost" onClick={() => setAppState(AppState.LANDING)} className="text-sm">← Kembali ke Beranda</Button>
                    </div>
                </div>
            </Layout>
            <Footer setAppState={setAppState} />
        </>
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