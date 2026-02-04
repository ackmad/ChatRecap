import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, MessageSquare, ArrowRight, ShieldCheck, RefreshCw, Send, Sparkles, Clock, Calendar, MessageCircle, Heart, User, BookOpen, Feather, Cpu, Layers, ArrowLeft, Coffee, Sun, Moon, Minus, Plus, Hourglass, Tag, Scale, AlertCircle, Quote, ChevronLeft, ChevronRight, Info, BarChart2, TrendingUp, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import ReactMarkdown from 'react-markdown';
import { parseWhatsAppChat } from './utils/chatParser';
import { analyzeChatWithGemini, createChatSession } from './services/geminiService';
import { AppState, ChatData, AnalysisResult, ChatMessage } from './types';
import { Layout } from './components/Layout';
import { Button } from './components/Button';
import { Chat } from "@google/genai";

// --- Components ---

const TypewriterText = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
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
    }, 10);
    return () => clearInterval(timer);
  }, [text, onComplete, isComplete]);

  return (
    <div className={`markdown-content leading-relaxed ${!isComplete ? 'typing-cursor' : ''}`}>
      <ReactMarkdown
        components={{
            strong: ({node, ...props}) => <span className="font-bold text-stone-900 dark:text-stone-100" {...props} />,
            em: ({node, ...props}) => <span className="italic text-stone-700 dark:text-stone-300" {...props} />,
            p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
        }}
      >
        {displayedText}
      </ReactMarkdown>
    </div>
  );
};

const Footer = ({ setAppState }: { setAppState: (state: AppState) => void }) => (
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="py-12 text-center text-xs text-txt-sub dark:text-stone-500 border-t border-stone-100 dark:border-stone-800 w-full mt-8">
        <div className="flex justify-center gap-6 mb-4 font-medium">
            <button onClick={() => setAppState(AppState.ABOUT_WEBSITE)} className="hover:text-pastel-primary transition-colors">Tentang Website</button>
            <span className="opacity-30">|</span>
            <button onClick={() => setAppState(AppState.ABOUT_CREATOR)} className="hover:text-pastel-primary transition-colors">Tentang Pembuat</button>
        </div>
        <p className="opacity-70 font-heading tracking-wider">Dibuat oleh ACKMAD ELFAN PURNAMA - SEJAK 2026</p>
    </motion.div>
);

const ThemeToggle = ({ isDarkMode, toggleTheme }: { isDarkMode: boolean, toggleTheme: () => void }) => (
    <button onClick={toggleTheme} className="p-2 rounded-full bg-white/50 dark:bg-stone-800/50 hover:bg-white dark:hover:bg-stone-700 transition-all text-txt-main dark:text-stone-300 border border-stone-200 dark:border-stone-700 shadow-sm">
        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
    </button>
);

const StoryViewer = ({ analysis, onClose }: { analysis: AnalysisResult, onClose: () => void }) => {
    const [index, setIndex] = useState(0);
    
    // Dynamic Slides Generation based on Chat Content (Added safety checks)
    const slides = [
        { type: 'intro', title: analysis.storyTitle, content: analysis.summary ? analysis.summary.split('.')[0] + '.' : '' },
        { type: 'phases', title: "Perjalanan Waktu", content: `Kalian melewati ${analysis.phases?.length || 0} fase berbeda.` },
        ...(analysis.keyMoments || []).slice(0, 3).map(m => ({ type: 'moment', title: "Sebuah Momen", content: m })),
        { type: 'topic', title: "Sering Dibahas", content: (analysis.dominantTopics || []).slice(0,3).map(t => t.name).join(', ') },
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
                         {/* Dynamic Icon based on slide type */}
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

                {/* Touch Navigation Areas */}
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
  const [error, setError] = useState<string | null>(null);
  const [showStory, setShowStory] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [chatFontSize, setChatFontSize] = useState(14); 
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== "text/plain") { setError("Mohon unggah file berekstensi .txt"); return; }

    setAppState(AppState.PROCESSING);
    setError(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      try {
        const parsedData = parseWhatsAppChat(text);
        if (parsedData.totalMessages === 0) throw new Error("Tidak ada pesan yang terbaca.");
        setChatData(parsedData);
        const result = await analyzeChatWithGemini(parsedData.messages);
        setAnalysis(result);
        setChatSession(createChatSession(parsedData.messages));
        setAppState(AppState.INSIGHTS);
        setShowStory(true);
      } catch (err: any) {
        setError(err.message || "Gagal memproses file.");
        setAppState(AppState.UPLOAD);
      }
    };
    reader.readAsText(file);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || !chatSession) return;
    const currentMsg = userInput;
    setUserInput('');
    setConversation(prev => [...prev, { role: 'user', text: currentMsg }]);
    setIsTyping(true);
    try {
      const result = await chatSession.sendMessage({ message: currentMsg });
      const text = result.text || "Maaf, saya tidak dapat menjawab saat ini.";
      setConversation(prev => [...prev, { role: 'model', text }]);
    } catch (e) {
      setConversation(prev => [...prev, { role: 'model', text: "Terjadi kesalahan koneksi." }]);
    } finally { setIsTyping(false); }
  };

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [conversation, isTyping]);

  const PageWrapper = ({ children, title }: { children: React.ReactNode, title?: string }) => (
      <Layout title={title}>
          <div className="absolute top-4 right-4 z-50"><ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} /></div>
          {children}
          <Footer setAppState={setAppState} />
      </Layout>
  );

  // --- Views ---
  
  const renderLanding = () => (
    <PageWrapper>
      <div className="text-center space-y-8 max-w-2xl relative z-10">
        <div className="w-24 h-24 bg-pastel-card/50 dark:bg-pastel-darkCard backdrop-blur-md rounded-full mx-auto flex items-center justify-center mb-6 shadow-xl animate-pulse-slow"><Sparkles className="w-12 h-12 text-pastel-primary" /></div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-bold text-txt-main dark:text-stone-100 font-heading">Pahami Cerita di Balik<br /><span className="text-pastel-primary">Setiap Pesan</span></motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg md:text-xl text-txt-sub dark:text-stone-400 font-light">Unggah chat WhatsApp Anda dan biarkan AI membantu Anda merefleksikan pola komunikasi dan emosi.</motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="pt-8">
          <Button onClick={() => setAppState(AppState.INSTRUCTIONS)} className="group text-lg px-8 py-4"><span className="flex items-center gap-3">Mulai Refleksi <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span></Button>
        </motion.div>
      </div>
    </PageWrapper>
  );

  const renderInstructions = () => (
     <PageWrapper title="Cara Kerja">
      <div className="grid md:grid-cols-3 gap-6 w-full mb-10">
        {[
          { icon: FileText, title: "Export Chat", desc: "Buka WhatsApp > Info Kontak > Export Chat > Tanpa Media." },
          { icon: Upload, title: "Unggah File", desc: "Upload file .txt yang dihasilkan ke sini." },
          { icon: MessageSquare, title: "Refleksi", desc: "Dapatkan insight dan ngobrol dengan AI tentang chat tersebut." }
        ].map((item, idx) => (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} key={idx} className="bg-white/80 dark:bg-stone-800/80 backdrop-blur-sm p-8 rounded-3xl border border-white dark:border-stone-700 text-center">
            <div className="w-14 h-14 bg-pastel-secondary dark:bg-stone-700 rounded-2xl flex items-center justify-center mx-auto mb-6 text-pastel-secondaryText dark:text-green-400"><item.icon size={28} /></div>
            <h3 className="font-bold text-txt-main dark:text-stone-200 mb-3 text-lg">{item.title}</h3>
            <p className="text-sm text-txt-sub dark:text-stone-400">{item.desc}</p>
          </motion.div>
        ))}
      </div>
      <Button onClick={() => setAppState(AppState.UPLOAD)}>Saya Mengerti, Lanjut</Button>
    </PageWrapper>
  );

  const renderUpload = () => (
    <PageWrapper title="Unggah Chat">
      <div className="w-full max-w-xl bg-white/60 dark:bg-stone-800/60 backdrop-blur-md rounded-[2rem] border-2 border-dashed border-stone-200 dark:border-stone-700 hover:border-pastel-primary transition-all p-12 text-center relative group">
        <input type="file" accept=".txt" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"/>
        <div className="bg-stone-50 dark:bg-stone-700 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform"><Upload className="text-stone-400 group-hover:text-pastel-primary" size={40} /></div>
        <h3 className="text-xl font-bold text-txt-main dark:text-stone-200 mb-2">Pilih File .txt WhatsApp</h3>
        <p className="text-txt-sub dark:text-stone-400 text-sm">Drag & drop atau klik untuk memilih</p>
      </div>
      {error && <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-100">{error}</div>}
    </PageWrapper>
  );

  const renderProcessing = () => (
    <PageWrapper>
      <div className="text-center space-y-8">
        <div className="relative w-32 h-32 mx-auto">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }} className="w-full h-full border-[6px] border-pastel-secondary dark:border-stone-700 border-t-pastel-primary rounded-full opacity-80" />
          <div className="absolute inset-0 flex items-center justify-center"><motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}><Sparkles className="text-pastel-primary opacity-80" size={40} /></motion.div></div>
        </div>
        <h2 className="text-2xl font-bold text-txt-main dark:text-stone-200">Sedang Membaca Cerita...</h2>
      </div>
    </PageWrapper>
  );

  const renderInsights = () => {
    if (!chatData || !analysis) return null;

    const startDate = chatData.dateRange.start?.toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'});
    const endDate = chatData.dateRange.end?.toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'});

    return (
      <div className="min-h-screen bg-gradient-to-b from-pastel-bgStart to-pastel-bgEnd dark:from-pastel-darkBgStart dark:to-pastel-darkBgEnd pb-20 font-sans relative">
        <div className="absolute inset-0 pointer-events-none z-0 bg-noise opacity-30 mix-blend-overlay fixed"></div>
        <div className="absolute top-4 right-4 z-50"><ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} /></div>

        {showStory && <StoryViewer analysis={analysis} onClose={() => setShowStory(false)} />}

        {/* --- BAGIAN 1: PEMBUKA (Header Emosional & Overview) --- */}
        <div className="pt-20 pb-12 px-4 relative z-10">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center">
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
                        <div key={i} className="bg-white/60 dark:bg-stone-800/60 p-4 rounded-2xl border border-stone-100 dark:border-stone-700 text-center">
                            <s.icon className="w-4 h-4 mx-auto mb-2 text-pastel-primary" />
                            <div className="text-xs text-txt-sub dark:text-stone-500 uppercase tracking-wider">{s.label}</div>
                            <div className="font-bold text-stone-700 dark:text-stone-200 text-sm mt-1">{s.val}</div>
                        </div>
                    ))}
                </div>
                
                <div className="mt-8">
                     <button onClick={() => setShowStory(true)} className="inline-flex items-center gap-2 px-6 py-2.5 bg-pastel-primary text-white rounded-full font-bold shadow-lg hover:bg-pastel-primaryHover transition-all text-sm">
                        <Sparkles size={16} /> Buka Story Highlight
                    </button>
                </div>
            </motion.div>
        </div>

        <div className="max-w-4xl mx-auto px-4 space-y-20 relative z-10">
            
            {/* --- BAGIAN 2: POLA BESAR (Visual Charts & Phases) --- */}
            <section>
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-txt-main dark:text-stone-200 font-heading">Ritme Perjalanan</h2>
                    <p className="text-sm text-txt-sub dark:text-stone-400">Setiap hubungan punya detak jantungnya sendiri.</p>
                </div>
                
                {/* Rhythm Chart */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white/60 dark:bg-stone-800/60 p-6 rounded-3xl border border-white dark:border-stone-700 h-64 mb-8">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chatData.dailyDistribution}>
                            <defs>
                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#B8A9E6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#B8A9E6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: isDarkMode ? '#292524' : '#fff' }} />
                            <Area type="monotone" dataKey="count" stroke="#B8A9E6" fillOpacity={1} fill="url(#colorCount)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Phases Timeline */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                     <div className="flex items-center gap-2 mb-4 ml-2">
                        <Layers size={18} className="text-pastel-primary" />
                        <h3 className="font-bold text-txt-main dark:text-stone-200">Fase Hubungan</h3>
                    </div>
                    <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                        <div className="flex gap-4 min-w-max">
                            {analysis.phases?.map((phase, i) => (
                                <div key={i} className={`w-72 p-6 rounded-3xl flex flex-col justify-between border ${
                                    phase.mood === 'warm' ? 'bg-orange-50/50 border-orange-100 dark:bg-orange-900/20 dark:border-orange-800' :
                                    phase.mood === 'cold' ? 'bg-blue-50/50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800' :
                                    phase.mood === 'tense' ? 'bg-red-50/50 border-red-100 dark:bg-red-900/20 dark:border-red-800' :
                                    'bg-stone-50/50 border-stone-100 dark:bg-stone-800/50 dark:border-stone-700'
                                }`}>
                                    <div>
                                        <div className="text-[10px] font-bold uppercase tracking-wider opacity-60 mb-2">{phase.period}</div>
                                        <h4 className="text-lg font-bold mb-2 text-stone-800 dark:text-stone-200">{phase.name}</h4>
                                        <p className="text-sm opacity-80 leading-relaxed text-stone-600 dark:text-stone-400">{phase.description}</p>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/5 text-xs font-medium flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${
                                             phase.mood === 'warm' ? 'bg-orange-400' :
                                             phase.mood === 'cold' ? 'bg-blue-400' :
                                             phase.mood === 'tense' ? 'bg-red-400' : 'bg-stone-400'
                                        }`}></span>
                                        <span className="capitalize opacity-70">{phase.mood}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* --- BAGIAN 3: DETAIL HUBUNGAN (Styles & Patterns) --- */}
            <section className="grid md:grid-cols-2 gap-6">
                 {/* Silence & Gaps */}
                 <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white/60 dark:bg-stone-800/60 p-6 rounded-3xl border border-white dark:border-stone-700">
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
                                        <div className="opacity-50">{silence.startDate.toLocaleDateString()}</div>
                                    </div>
                                    <div className="text-[10px] text-right">
                                        <div className="opacity-50">Comeback:</div>
                                        <div className="font-bold text-blue-600 dark:text-blue-400">{silence.breaker}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-center py-8 opacity-60">Tidak ada jeda panjang yang signifikan.</p>
                    )}
                 </motion.div>

                 {/* Balance Meter */}
                 <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white/60 dark:bg-stone-800/60 p-6 rounded-3xl border border-white dark:border-stone-700 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                        <Scale className="text-green-400" />
                        <h3 className="text-lg font-bold text-txt-main dark:text-stone-200">Keseimbangan</h3>
                    </div>
                    <p className="text-xs text-txt-sub dark:text-stone-500 mb-8">Siapa yang lebih sering mengirim pesan?</p>
                    
                    <div className="relative mb-6 px-4">
                        <div className="h-4 bg-stone-100 dark:bg-stone-700 rounded-full w-full relative overflow-hidden">
                             <div className="absolute inset-0 bg-gradient-to-r from-pastel-primary/50 to-pastel-secondary/50"></div>
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
             <section className="bg-white/60 dark:bg-stone-800/60 p-8 rounded-3xl border border-white dark:border-stone-700">
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
                                        className={`absolute bottom-0 w-full ${
                                            m.mood.includes('Hangat') || m.mood.includes('Senang') ? 'bg-orange-300' :
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
                     <div className="bg-white/60 dark:bg-stone-800/60 p-6 rounded-3xl border border-white dark:border-stone-700">
                        <div className="flex items-center gap-3 mb-6">
                            <Clock className="text-pastel-primary" />
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
                     <div className="bg-white/60 dark:bg-stone-800/60 p-6 rounded-3xl border border-white dark:border-stone-700">
                        <div className="flex items-center gap-3 mb-6">
                            <Tag className="text-yellow-400" />
                            <h3 className="text-lg font-bold text-txt-main dark:text-stone-200">Topik Dominan</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {analysis.dominantTopics?.map((t, i) => (
                                <motion.span whileHover={{ scale: 1.05 }} key={i} className={`px-4 py-2 rounded-xl text-xs font-medium cursor-default border ${
                                    t.category === 'deep' ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-100 text-purple-600' :
                                    t.category === 'fun' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 text-yellow-600' :
                                    t.category === 'conflict' ? 'bg-red-50 dark:bg-red-900/20 border-red-100 text-red-600' :
                                    'bg-stone-50 dark:bg-stone-700 border-stone-200 text-stone-600'
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
                                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-pastel-primary border-2 border-white dark:border-stone-800"></div>
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

                         {/* Evidence Snippet (Static Example for now) */}
                         <div className="bg-stone-50 dark:bg-stone-800 p-6 rounded-3xl border border-stone-200 dark:border-stone-700">
                             <div className="flex items-center gap-2 mb-4 opacity-50">
                                <MessageSquare size={14} />
                                <h4 className="font-bold text-xs">Cuplikan Chat</h4>
                            </div>
                            <div className="space-y-2">
                                <div className="bg-white dark:bg-stone-700 p-3 rounded-lg rounded-tl-none text-xs text-stone-600 dark:text-stone-300 shadow-sm max-w-[80%]">
                                    <span className="blur-[2px] hover:blur-none transition-all cursor-pointer">Contoh pesan yang dianalisis...</span>
                                </div>
                                <div className="bg-pastel-primary/20 dark:bg-purple-900/30 p-3 rounded-lg rounded-tr-none text-xs text-stone-600 dark:text-stone-300 shadow-sm max-w-[80%] ml-auto">
                                    <span className="blur-[2px] hover:blur-none transition-all cursor-pointer">Balasan yang menunjukkan emosi...</span>
                                </div>
                            </div>
                         </div>
                    </div>
                 </div>
            </section>

            {/* --- BAGIAN 6: PENUTUP --- */}
            <motion.section initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-white/80 dark:bg-stone-800/80 backdrop-blur-md p-10 rounded-[3rem] text-center shadow-xl border border-white dark:border-stone-700 relative overflow-hidden mt-20">
                <div className="relative z-10 max-w-2xl mx-auto">
                    <Feather className="w-10 h-10 text-emerald-400 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold mb-4 font-heading text-txt-main dark:text-stone-200">Refleksi Akhir</h3>
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
      </div>
    );
  };

  // Chat View (kept minimal to focus on insights)
  const renderChat = () => (
    <div className="flex flex-col h-screen bg-pastel-bgEnd dark:bg-pastel-darkBgEnd font-sans">
       <div className="bg-white/80 dark:bg-stone-800/80 backdrop-blur-md border-b border-stone-100 dark:border-stone-700 p-4 flex justify-between items-center z-20">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pastel-card dark:bg-stone-700 rounded-full flex items-center justify-center"><Sparkles size={20} className="text-stone-600 dark:text-stone-300"/></div>
                <div><h2 className="font-bold text-txt-main dark:text-stone-200">Ruang Refleksi</h2><p className="text-[10px] text-txt-sub dark:text-stone-400">Diskusi Objektif</p></div>
            </div>
            <div className="flex gap-2">
                 <div className="flex bg-stone-100 dark:bg-stone-700 rounded-lg p-1"><button onClick={() => setChatFontSize(s => Math.max(12, s-1))} className="p-1"><Minus size={14}/></button><button onClick={() => setChatFontSize(s => Math.min(24, s+1))} className="p-1"><Plus size={14}/></button></div>
                 <Button variant="secondary" onClick={() => setAppState(AppState.INSIGHTS)} className="!px-3 !py-2 text-xs !rounded-lg">Kembali</Button>
            </div>
       </div>
       <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {conversation.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div style={{ fontSize: `${chatFontSize}px` }} className={`max-w-[85%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-pastel-secondary dark:bg-stone-700 text-stone-800 dark:text-stone-100 rounded-br-none' : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 rounded-bl-none shadow-sm'}`}>
                        {msg.role === 'model' ? <TypewriterText text={msg.text} /> : msg.text}
                    </div>
                </div>
            ))}
            {isTyping && <div className="text-xs text-stone-400 ml-4 animate-pulse">AI sedang menulis...</div>}
            <div ref={chatEndRef} />
       </div>
       <div className="p-4 bg-white dark:bg-stone-800 border-t border-stone-100 dark:border-stone-700">
            <div className="flex gap-2 relative">
                <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Tanya tentang chat ini..." className="flex-1 bg-stone-100 dark:bg-stone-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-pastel-primary/50 transition-all text-stone-800 dark:text-stone-100 placeholder-stone-400"/>
                <Button onClick={handleSendMessage} disabled={!userInput.trim() || isTyping} className="!p-3 !rounded-xl"><Send size={20} /></Button>
            </div>
       </div>
    </div>
  );

  return (
    <AnimatePresence mode="wait">
      <motion.div key={appState} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen">
        {appState === AppState.LANDING && renderLanding()}
        {appState === AppState.ABOUT_WEBSITE && renderAboutAboutWebsite()}
        {appState === AppState.ABOUT_CREATOR && renderAboutCreator()}
        {appState === AppState.INSTRUCTIONS && renderInstructions()}
        {appState === AppState.UPLOAD && renderUpload()}
        {appState === AppState.PROCESSING && renderProcessing()}
        {appState === AppState.INSIGHTS && renderInsights()}
        {appState === AppState.CHAT && renderChat()}
      </motion.div>
    </AnimatePresence>
  );
};

// Helper for brevity (About pages refactored above but logic is same)
const renderAboutAboutWebsite = () => (
    <Layout title="Tentang Website">
        <div className="max-w-2xl text-center space-y-6">
            <p className="text-lg text-txt-sub dark:text-stone-400">Tempat untuk membaca cerita, bukan sekadar statistik.</p>
             <div className="grid gap-4 text-left">
                <div className="p-4 bg-white/60 dark:bg-stone-800/60 rounded-2xl"><h3 className="font-bold mb-2 text-stone-800 dark:text-stone-200">✨ Filosofi</h3><p className="text-sm text-stone-600 dark:text-stone-400">Melihat kembali percakapan dengan tenang dan jujur.</p></div>
                <div className="p-4 bg-white/60 dark:bg-stone-800/60 rounded-2xl"><h3 className="font-bold mb-2 text-stone-800 dark:text-stone-200">🛡️ Privasi</h3><p className="text-sm text-stone-600 dark:text-stone-400">Data diproses di browser Anda. Tidak ada yang disimpan di server.</p></div>
            </div>
            <Button variant="ghost" onClick={() => window.location.reload()}>Kembali</Button>
        </div>
    </Layout>
);

const renderAboutCreator = () => (
    <Layout title="Tentang Pembuat">
         <div className="max-w-xl text-center">
            <div className="w-20 h-20 bg-stone-200 dark:bg-stone-700 rounded-full mx-auto mb-4 flex items-center justify-center"><User size={32}/></div>
            <h2 className="text-xl font-bold mb-2 text-stone-800 dark:text-stone-200">Ackmad Elfan Purnama</h2>
            <p className="text-sm text-stone-500 mb-6">Pencinta cerita & detail kecil.</p>
            <div className="p-6 bg-white/60 dark:bg-stone-800/60 rounded-3xl text-sm italic text-stone-600 dark:text-stone-400 leading-relaxed mb-6">
                "Website ini dibuat bukan untuk menghakimi hubungan, tapi untuk menemani merenung."
            </div>
            <Button variant="ghost" onClick={() => window.location.reload()}>Kembali</Button>
        </div>
    </Layout>
);

export default App;