import React from 'react';
import { Heart, TrendingUp, MessageCircle, Calendar, User, Sparkles, Zap, Ghost, Activity, Flame, BarChart3, Quote, ThumbsUp, Brain, Keyboard, Smile, Wand2 } from 'lucide-react';

export type TemplateType = 'stats' | 'active-day' | 'who-talks' | 'late-night' | 'peak-moment' | 'top-words' | 'toxic-meter' | 'reply-speed' | 'ghosting' | 'topic-ranking' | 'quote-year' | 'care-meter' | 'overthinking' | 'typing-style' | 'emoji-personality' | 'ai-prediction' | 'total-recap';
export type ThemeType = 'pastel' | 'gradient' | 'dark' | 'minimal';

export interface StoryTemplateProps {
    template: TemplateType;
    theme: ThemeType;
    data: {
        // ... (data properties remain the same)
        // Old properties
        title?: string;
        mood?: string;
        moodPercentage?: number;
        topics?: Array<{ name: string; percentage: number }>;
        aura?: { name: string; color: string; description: string };
        quote?: string;
        timeline?: Array<{ phase: string; description: string }>;
        personality?: { type: string; traits: string[] };
        relationshipType?: string;

        // New properties
        totalMessages?: number;
        totalWords?: number;
        totalChars?: number;
        dateRange?: string;
        mostActiveDay?: string;
        messagesOnThatDay?: number;
        peakHour?: string;
        participant1?: string;
        participant2?: string;
        percentage1?: number;
        percentage2?: number;
        lateNightHours?: string;
        lateNightMessages?: number;
        mostLateNightDay?: string;
        peakPeriod?: string;
        peakMessages?: number;
        peakTopic?: string;
        topWords?: string[];
        topWord?: string;
        topEmojis?: string[];
        toxicScore?: number;
        toxicLevel?: string;
        toxicExamples?: Array<{ text: string; time: string }>;
        toxicInsight?: string;
        avgReplyTime1?: string;
        avgReplyTime2?: string;
        fastestReply1?: string;
        fastestReply2?: string;
        replyBadge1?: string;
        replyBadge2?: string;
        activeHours1?: string[];
        activeHours2?: string[];
        replyInsight?: string;
        ghostingCount1?: number;
        ghostingCount2?: number;
        longestGhosting1?: string;
        longestGhosting2?: string;
        comebackMessage?: string;
        ghostingKing?: string;
        ghostingInsight?: string;
        topTopics?: Array<{ topic: string; count: number; emoji: string }>;
        topicInsight?: string;
        mostDebatedTopic?: string;
        bestQuote?: string;
        quoteAuthor?: string;
        quoteDate?: string;
        quoteContext?: string;
        runnerUpQuotes?: Array<{ text: string; author: string }>;
        careScore1?: number;
        careScore2?: number;
        careExamples1?: Array<{ text: string; time: string }>;
        careExamples2?: Array<{ text: string; time: string }>;
        careWinner?: string;
        careInsight?: string;
        overthinkingScore1?: number;
        overthinkingScore2?: number;
        overthinkingExamples?: Array<{ text: string; author: string }>;
        overthinkingKing?: string;
        overthinkingInsight?: string;
        typingStyle1?: string;
        typingStyle2?: string;
        avgMessageLength1?: number;
        avgMessageLength2?: number;
        typingSpeed1?: string;
        typingSpeed2?: string;
        styleInsight?: string;
        topEmoji1?: string;
        topEmoji2?: string;
        emojiCount1?: number;
        emojiCount2?: number;
        personality1?: string;
        personality2?: string;
        emojiInsight?: string;
        relationshipScore?: number;
        futurePredict?: string;
        strengthPoints?: string[];
        improvementPoints?: string[];
        totalRecapDuration?: string;
        totalRecapActiveDays?: number;
        totalRecapStartDate?: string;
        totalRecapEndDate?: string;
        totalRecapInsight?: string;
        prediction2026?: string;
        aiConfidence?: number;
    };
    privacyMode?: {
        hideNames?: boolean;
        blurSensitive?: boolean;
        hideDates?: boolean;
        safeQuote?: boolean;
    };
}

export const StoryTemplateNew: React.FC<StoryTemplateProps> = ({
    template,
    theme,
    data,
    privacyMode = {}
}) => {
    // Theme configurations
    const themes = {
        pastel: {
            background: 'linear-gradient(135deg, #FFE5EC 0%, #FFF0F5 50%, #E5F3FF 100%)',
            primary: '#FF6B9D',
            accent: '#C084FC',
            text: '#1F2937',
            textLight: '#4B5563',
            card: 'rgba(255, 255, 255, 0.85)'
        },
        gradient: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            primary: '#667eea',
            accent: '#FDE68A',
            text: '#FFFFFF',
            textLight: '#E5E7EB',
            card: 'rgba(255, 255, 255, 0.2)'
        },
        dark: {
            background: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
            primary: '#A78BFA',
            accent: '#EC4899',
            text: '#FFFFFF',
            textLight: '#D1D5DB',
            card: 'rgba(255, 255, 255, 0.1)'
        },
        minimal: {
            background: 'linear-gradient(135deg, #FAFAFA 0%, #FFFFFF 100%)',
            primary: '#000000',
            accent: '#6B7280',
            text: '#000000',
            textLight: '#4B5563',
            card: 'rgba(0, 0, 0, 0.05)'
        }
    };

    const currentTheme = themes[theme];

    const containerStyle: React.CSSProperties = {
        width: '1080px',
        height: '1920px',
        background: currentTheme.background,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
        boxSizing: 'border-box'
    };

    // --- REUSABLE FOOTER COMPONENT (UPDATED: Smaller & Correct Text) ---
    const RenderFooter = () => (
        <div style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: '60px', // Margin top for story lines
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 20 // Higher z-index to stay on top
        }}>
            <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px', // Smaller gap
                padding: '12px 28px', // Smaller padding
                background: currentTheme.card,
                borderRadius: '100px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}>
                <Sparkles size={24} color={currentTheme.primary} /> {/* Smaller icon */}
                <span style={{
                    fontSize: '20px', // Smaller font
                    fontWeight: '800',
                    color: currentTheme.text,
                    letterSpacing: '1px'
                }}>
                    ichatrecap.vercel.app
                </span>
                <span style={{
                    fontSize: '16px', // Smaller font
                    color: currentTheme.textLight,
                    marginLeft: '6px',
                    fontWeight: '600'
                }}>
                    ✓ AI Verified
                </span>
            </div>
        </div>
    );

    // --- REUSABLE HEADER COMPONENT ---
    const RenderHeader = ({ title, subtitle }: { title: React.ReactNode, subtitle?: string }) => {
        const name1 = privacyMode?.hideNames ? '***' : (data.participant1 || 'User 1');
        const name2 = privacyMode?.hideNames ? '***' : (data.participant2 || 'User 2');

        return (
            <div style={{
                padding: '180px 90px 40px', // Increased top padding to accommodate top watermark
                position: 'relative',
                zIndex: 10
            }}>
                <div style={{ marginBottom: '24px' }}>
                    <div style={{
                        fontSize: '48px',
                        fontWeight: '900',
                        color: currentTheme.text,
                        marginBottom: '16px'
                    }}>
                        {name1} {data.relationshipType === 'group' ? '& Friends' : `× ${name2}`}
                    </div>
                    <div style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        color: currentTheme.primary,
                        textTransform: 'uppercase',
                        letterSpacing: '4px'
                    }}>
                        Chat Wrapped 2026
                    </div>
                </div>
                <h1 style={{
                    fontSize: '110px',
                    fontWeight: '900',
                    color: currentTheme.text,
                    lineHeight: '1.05',
                    margin: '0',
                    letterSpacing: '-3px'
                }}>
                    {title}
                </h1>
                {subtitle && (
                    <p style={{
                        fontSize: '42px',
                        color: currentTheme.textLight,
                        marginTop: '24px',
                        maxWidth: '800px',
                        lineHeight: '1.4'
                    }}>
                        {subtitle}
                    </p>
                )}
            </div>
        );
    };


    // Render different templates
    const renderTemplate = () => {
        switch (template) {
            case 'stats': return renderStatsTemplate();
            case 'active-day': return renderActiveDayTemplate();
            case 'who-talks': return renderWhoTalksTemplate();
            case 'late-night': return renderLateNightTemplate();
            case 'peak-moment': return renderPeakMomentTemplate();
            case 'top-words': return renderTopWordsTemplate();
            case 'toxic-meter': return renderToxicMeterTemplate();
            case 'reply-speed': return renderReplySpeedTemplate();
            case 'ghosting': return renderGhostingTemplate();
            case 'topic-ranking': return renderTopicRankingTemplate();
            case 'quote-year': return renderQuoteYearTemplate();
            case 'care-meter': return renderCareMeterTemplate();
            case 'overthinking': return renderOverthinkingTemplate();
            case 'typing-style': return renderTypingStyleTemplate();
            case 'emoji-personality': return renderEmojiPersonalityTemplate();
            case 'ai-prediction':
                return renderAIPredictionTemplate();
            case 'total-recap':
                return renderTotalRecapTemplate();
            default:
                return renderStatsTemplate();
        }
    };

    const renderStatsTemplate = () => (
        <div style={containerStyle}>
            <div style={{ position: 'absolute', top: '-200px', right: '-200px', width: '800px', height: '800px', borderRadius: '50%', background: `radial-gradient(circle, ${currentTheme.accent} 0%, transparent 70%)`, opacity: 0.3, zIndex: 0 }} />

            <RenderHeader title={<>Chat<br />Stats</>} />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 90px', position: 'relative', zIndex: 1, marginTop: '20px' }}>
                <div style={{ fontSize: '250px', marginBottom: '40px', lineHeight: '1' }}>📊</div>
                <div style={{
                    fontSize: '200px',
                    fontWeight: '900',
                    color: currentTheme.primary,
                    marginBottom: '30px',
                    lineHeight: '1',
                    letterSpacing: '-5px'
                }}>
                    {data.totalMessages || 2543}
                </div>
                <h2 style={{ fontSize: '80px', fontWeight: '800', color: currentTheme.text, margin: '0 0 30px 0', lineHeight: '1.2' }}>Total Pesan</h2>
                <p style={{ fontSize: '42px', color: currentTheme.textLight, textAlign: 'center', maxWidth: '800px', lineHeight: '1.5', margin: '0' }}>
                    Statistik lengkap aktivitas chat kalian sepanjang masa.
                </p>
            </div>
            <RenderFooter />
        </div>
    );

    const renderActiveDayTemplate = () => (
        <div style={containerStyle}>
            <div style={{ position: 'absolute', top: '-150px', left: '-150px', width: '700px', height: '700px', borderRadius: '50%', background: `radial-gradient(circle, ${currentTheme.accent} 0%, transparent 70%)`, opacity: 0.3, zIndex: 0 }} />

            <RenderHeader title={<>Most Active<br />Day</>} />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 90px', marginTop: '20px', zIndex: 1 }}>
                <div style={{ fontSize: '250px', marginBottom: '40px', lineHeight: '1' }}>📅</div>
                <div style={{
                    fontSize: '140px', // Slightly smaller to fit
                    fontWeight: '900',
                    color: currentTheme.primary,
                    marginBottom: '30px',
                    lineHeight: '1.1',
                    textAlign: 'center',
                    wordBreak: 'break-word'
                }}>
                    {data.mostActiveDay || '17'}
                </div>
                <h2 style={{ fontSize: '70px', fontWeight: '800', color: currentTheme.text, margin: '0 0 30px 0', lineHeight: '1.2' }}>Paling Ramai</h2>
                <p style={{ fontSize: '42px', color: currentTheme.textLight, textAlign: 'center', maxWidth: '800px', lineHeight: '1.5', margin: '0' }}>
                    Hari dimana kalian ngobrol tanpa henti sampai lupa waktu.
                </p>
            </div>
            <RenderFooter />
        </div>
    );

    const renderWhoTalksTemplate = () => {
        const name1 = privacyMode?.hideNames ? '***' : (data.participant1 || 'Elfan');
        const name2 = privacyMode?.hideNames ? '***' : (data.participant2 || 'Savira');
        const perc1 = data.percentage1 || 65;
        const perc2 = data.percentage2 || 35;
        const winner = perc1 > perc2 ? name1 : name2;
        const loser = perc1 > perc2 ? name2 : name1;
        const winnerPerc = Math.max(perc1, perc2);

        return (
            <div style={containerStyle}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '800px', borderRadius: '50%', background: `radial-gradient(circle, ${currentTheme.accent} 0%, transparent 70%)`, opacity: 0.3, zIndex: 0 }} />

                <div style={{ padding: '140px 90px 40px', position: 'relative', zIndex: 1 }}>
                    <div style={{ marginBottom: '24px', fontSize: '48px', fontWeight: '900', color: currentTheme.text }}>
                        {name1} × {name2}
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: '700', color: currentTheme.primary, textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '32px' }}>
                        Chat Wrapped 2026
                    </div>
                    <h1 style={{ fontSize: '100px', fontWeight: '900', color: currentTheme.text, lineHeight: '1', letterSpacing: '-3px' }}>
                        Who Talks<br />More?
                    </h1>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 90px', marginTop: '20px', zIndex: 1 }}>
                    <div style={{
                        fontSize: '220px',
                        fontWeight: '900',
                        color: currentTheme.primary,
                        marginBottom: '20px',
                        lineHeight: '1'
                    }}>
                        {winnerPerc}%
                    </div>
                    <h2 style={{ fontSize: '56px', fontWeight: '800', color: currentTheme.text, marginBottom: '60px', textAlign: 'center' }}>
                        {winner} paling mendominasi!
                    </h2>

                    {/* AI Insight Card */}
                    <div style={{ background: currentTheme.card, padding: '50px 60px', borderRadius: '40px', maxWidth: '900px', backdropFilter: 'blur(30px)', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', marginBottom: '60px' }}>
                        <p style={{ fontSize: '36px', color: currentTheme.textLight, textAlign: 'center', lineHeight: '1.6', margin: '0 0 24px 0', fontWeight: '700' }}>
                            💡 Menurut AI
                        </p>
                        <p style={{
                            fontSize: '32px',
                            color: currentTheme.textLight,
                            textAlign: 'center',
                            lineHeight: '1.6',
                            margin: '0',
                            overflowWrap: 'break-word',
                            letterSpacing: '0.5px'
                        }}>
                            "{winner} tuh tipe yang lebih banyak cerita, tapi {loser} juga pendengar setia kok 👂"
                        </p>
                    </div>

                    {/* Stats Comparison */}
                    <div style={{ display: 'flex', gap: '32px', width: '100%', justifyContent: 'center', paddingBottom: '100px' }}> {/* Added padding bottom to prevent overlap with footer */}
                        <div style={{ background: currentTheme.card, padding: '32px 48px', borderRadius: '32px', backdropFilter: 'blur(20px)', textAlign: 'center', flex: 1 }}>
                            <div style={{ fontSize: '64px', fontWeight: '900', color: currentTheme.primary, marginBottom: '16px' }}>{perc1}%</div>
                            <div style={{ fontSize: '28px', color: currentTheme.textLight, fontWeight: '700' }}>{name1}</div>
                        </div>
                        <div style={{ background: currentTheme.card, padding: '32px 48px', borderRadius: '32px', backdropFilter: 'blur(20px)', textAlign: 'center', flex: 1 }}>
                            <div style={{ fontSize: '64px', fontWeight: '900', color: currentTheme.accent, marginBottom: '16px' }}>{perc2}%</div>
                            <div style={{ fontSize: '28px', color: currentTheme.textLight, fontWeight: '700' }}>{name2}</div>
                        </div>
                    </div>
                </div>
                <RenderFooter />
            </div>
        );
    };

    const renderLateNightTemplate = () => (
        <div style={containerStyle}>
            <div style={{ position: 'absolute', top: '-200px', right: '-200px', width: '700px', height: '700px', borderRadius: '50%', background: `radial-gradient(circle, ${currentTheme.accent} 0%, transparent 70%)`, opacity: 0.3, zIndex: 0 }} />

            <RenderHeader title={<>Late Night<br />Talks</>} />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 90px', marginTop: '60px', zIndex: 1 }}>
                <div style={{ fontSize: '250px', marginBottom: '60px', lineHeight: '1' }}>🌙</div>
                <div style={{
                    fontSize: '200px',
                    fontWeight: '900',
                    color: currentTheme.primary,
                    marginBottom: '40px',
                    lineHeight: '1'
                }}>
                    00:30
                </div>
                <h2 style={{ fontSize: '80px', fontWeight: '800', color: currentTheme.text, margin: '0 0 40px 0', lineHeight: '1.2' }}>Mode Overthinking</h2>
                <p style={{ fontSize: '42px', color: currentTheme.textLight, textAlign: 'center', maxWidth: '800px', lineHeight: '1.5', margin: '0' }}>
                    Jam-jam rawan baper dan ngomongin masa depan.
                </p>
            </div>
            <RenderFooter />
        </div>
    );

    const renderPeakMomentTemplate = () => (
        <div style={containerStyle}>
            <div style={{ position: 'absolute', bottom: '-200px', left: '-200px', width: '800px', height: '800px', borderRadius: '50%', background: `radial-gradient(circle, ${currentTheme.accent} 0%, transparent 70%)`, opacity: 0.3, zIndex: 0 }} />

            <RenderHeader title={<>Peak<br />Moment</>} />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 90px', marginTop: '60px', zIndex: 1 }}>
                <div style={{ fontSize: '250px', marginBottom: '60px', lineHeight: '1' }}>⚡</div>
                <div style={{
                    fontSize: '200px',
                    fontWeight: '900',
                    color: currentTheme.primary,
                    marginBottom: '40px',
                    lineHeight: '1'
                }}>
                    {data.peakMessages || 847}
                </div>
                <h2 style={{ fontSize: '80px', fontWeight: '800', color: currentTheme.text, margin: '0 0 40px 0', lineHeight: '1.2' }}>Pesan Terbanyak</h2>
                <p style={{ fontSize: '42px', color: currentTheme.textLight, textAlign: 'center', maxWidth: '800px', lineHeight: '1.5', margin: '0' }}>
                    Puncak intensitas chat kalian dalam satu waktu.
                </p>
            </div>
            <RenderFooter />
        </div>
    );

    const renderTopWordsTemplate = () => (
        <div style={containerStyle}>
            <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', width: '900px', height: '900px', borderRadius: '50%', background: `radial-gradient(circle, ${currentTheme.accent} 0%, transparent 70%)`, opacity: 0.25, zIndex: 0 }} />

            <RenderHeader title={<>Top<br />Words</>} />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 90px', marginTop: '60px', zIndex: 1 }}>
                <div style={{ fontSize: '250px', marginBottom: '60px', lineHeight: '1' }}>💭</div>
                <div style={{
                    fontSize: '180px',
                    fontWeight: '900',
                    color: currentTheme.primary,
                    marginBottom: '40px',
                    lineHeight: '1',
                    textAlign: 'center',
                    wordBreak: 'break-word'
                }}>
                    {data.topWord || 'Haha'}
                </div>
                <h2 style={{ fontSize: '80px', fontWeight: '800', color: currentTheme.text, margin: '0 0 40px 0', lineHeight: '1.2' }}>Kata Favorit</h2>
                <p style={{ fontSize: '42px', color: currentTheme.textLight, textAlign: 'center', maxWidth: '800px', lineHeight: '1.5', margin: '0' }}>
                    Kata yang paling sering kalian ketik tanpa sadar.
                </p>
            </div>
            <RenderFooter />
        </div>
    );

    const renderToxicMeterTemplate = () => {
        const name1 = privacyMode?.hideNames ? '***' : (data.participant1 || 'Elfan');
        const name2 = privacyMode?.hideNames ? '***' : (data.participant2 || 'Savira');
        const toxicScore = data.toxicScore || 45;
        const toxicLevel = data.toxicLevel || 'Chaos Lucu';
        const insight = data.toxicInsight || 'Kalian bukan toxic, kalian cuma terlalu jujur 😭';

        return (
            <div style={containerStyle}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '900px', height: '900px', borderRadius: '50%', background: 'radial-gradient(circle, #FF6B6B 0%, transparent 70%)', opacity: 0.25, zIndex: 0 }} />

                <div style={{ padding: '140px 90px 40px', position: 'relative', zIndex: 1 }}>
                    <div style={{ marginBottom: '24px', fontSize: '48px', fontWeight: '900', color: currentTheme.text }}>
                        {name1} × {name2}
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: '700', color: currentTheme.primary, textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '32px' }}>
                        Chat Wrapped 2026
                    </div>
                    <h1 style={{ fontSize: '100px', fontWeight: '900', color: currentTheme.text, lineHeight: '1', letterSpacing: '-3px' }}>
                        Toxic Level<br />Meter
                    </h1>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 90px', marginTop: '20px', zIndex: 1 }}>
                    <div style={{ fontSize: '160px', marginBottom: '40px', lineHeight: '1' }}>🔥</div>
                    <div style={{
                        fontSize: '240px',
                        fontWeight: '900',
                        color: '#FF6B6B',
                        marginBottom: '20px',
                        lineHeight: '1'
                    }}>
                        {toxicScore}%
                    </div>
                    <h2 style={{ fontSize: '64px', fontWeight: '800', color: currentTheme.text, marginBottom: '60px', textAlign: 'center' }}>
                        {toxicLevel}
                    </h2>

                    <div style={{ background: currentTheme.card, padding: '50px 60px', borderRadius: '40px', maxWidth: '900px', backdropFilter: 'blur(30px)', border: `4px solid ${currentTheme.primary}20`, marginBottom: '60px' }}>
                        <p style={{ fontSize: '36px', color: currentTheme.textLight, textAlign: 'center', lineHeight: '1.6', margin: '0 0 24px 0', fontWeight: '700' }}>
                            💡 Menurut AI
                        </p>
                        <p style={{
                            fontSize: '34px',
                            color: currentTheme.textLight,
                            textAlign: 'center',
                            lineHeight: '1.6',
                            margin: '0',
                            overflowWrap: 'break-word',
                            wordWrap: 'break-word',
                            letterSpacing: '0.5px'
                        }}>
                            "{insight}"
                        </p>
                    </div>

                    <div style={{ width: '100%', maxWidth: '900px', paddingBottom: '100px' }}> {/* Added padding bottom */}
                        {data.toxicExamples?.slice(0, 3).map((example, i) => (
                            <div key={i} style={{ background: currentTheme.card, padding: '32px 40px', borderRadius: '24px', marginBottom: '20px', backdropFilter: 'blur(20px)', borderLeft: `6px solid ${currentTheme.primary}` }}>
                                <p style={{ fontSize: '28px', color: currentTheme.text, margin: '0 0 16px 0', lineHeight: '1.4' }}>"{example.text}"</p>
                                <span style={{ fontSize: '24px', color: currentTheme.textLight, fontWeight: '600' }}>{example.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <RenderFooter />
            </div>
        );
    };

    const renderReplySpeedTemplate = () => {
        const name1 = privacyMode?.hideNames ? '***' : (data.participant1 || 'Elfan');
        const name2 = privacyMode?.hideNames ? '***' : (data.participant2 || 'Savira');
        const insight = data.replyInsight || 'Yang satu langsung bales, yang satu mikir dulu biar gak salah jawab 😭';

        return (
            <div style={containerStyle}>
                <div style={{ position: 'absolute', top: '-200px', right: '-200px', width: '800px', height: '800px', borderRadius: '50%', background: `radial-gradient(circle, ${currentTheme.accent} 0%, transparent 70%)`, opacity: 0.3, zIndex: 0 }} />

                <div style={{ padding: '140px 90px 40px', position: 'relative', zIndex: 1 }}>
                    <div style={{ marginBottom: '24px', fontSize: '48px', fontWeight: '900', color: currentTheme.text }}>
                        {name1} vs {name2}
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: '700', color: currentTheme.primary, textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '32px' }}>
                        Chat Wrapped 2026
                    </div>
                    <h1 style={{ fontSize: '100px', fontWeight: '900', color: currentTheme.text, lineHeight: '1', letterSpacing: '-3px' }}>
                        Reply Speed<br />Battle
                    </h1>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 90px', marginTop: '20px', zIndex: 1 }}>
                    <div style={{ fontSize: '160px', marginBottom: '60px', lineHeight: '1' }}>⚡</div>

                    <div style={{ display: 'flex', gap: '32px', width: '100%', maxWidth: '950px', marginBottom: '60px' }}>
                        {/* User 1 Card */}
                        <div style={{ flex: 1, background: currentTheme.card, padding: '50px 30px', borderRadius: '40px', backdropFilter: 'blur(30px)', border: `5px solid ${currentTheme.primary}`, textAlign: 'center' }}>
                            <div style={{ fontSize: '36px', fontWeight: '800', color: currentTheme.text, marginBottom: '30px' }}>{name1}</div>
                            <div style={{
                                fontSize: '72px',
                                fontWeight: '900',
                                color: currentTheme.primary,
                                marginBottom: '20px'
                            }}>
                                {data.avgReplyTime1 || '2 min'}
                            </div>
                            <div style={{ fontSize: '28px', color: currentTheme.textLight, marginBottom: '30px', fontWeight: '600' }}>Rata-rata balas</div>
                            <div style={{ background: currentTheme.primary + '20', padding: '16px 32px', borderRadius: '24px', fontSize: '28px', fontWeight: '700', color: currentTheme.primary, marginBottom: '20px', display: 'inline-block' }}>
                                {data.replyBadge1 || 'Si Ngebut ⚡'}
                            </div>
                            <div style={{ fontSize: '24px', color: currentTheme.textLight, marginTop: '20px' }}>
                                Tercepat: <strong>{data.fastestReply1 || '15 detik'}</strong>
                            </div>
                        </div>

                        {/* User 2 Card */}
                        <div style={{ flex: 1, background: currentTheme.card, padding: '50px 30px', borderRadius: '40px', backdropFilter: 'blur(30px)', border: `5px solid ${currentTheme.accent}`, textAlign: 'center' }}>
                            <div style={{ fontSize: '36px', fontWeight: '800', color: currentTheme.text, marginBottom: '30px' }}>{name2}</div>
                            <div style={{
                                fontSize: '72px',
                                fontWeight: '900',
                                color: currentTheme.accent,
                                marginBottom: '20px'
                            }}>
                                {data.avgReplyTime2 || '1 jam'}
                            </div>
                            <div style={{ fontSize: '28px', color: currentTheme.textLight, marginBottom: '30px', fontWeight: '600' }}>Rata-rata balas</div>
                            <div style={{ background: currentTheme.accent + '20', padding: '16px 32px', borderRadius: '24px', fontSize: '28px', fontWeight: '700', color: currentTheme.accent, marginBottom: '20px', display: 'inline-block' }}>
                                {data.replyBadge2 || 'Si Slow 🐌'}
                            </div>
                            <div style={{ fontSize: '24px', color: currentTheme.textLight, marginTop: '20px' }}>
                                Tercepat: <strong>{data.fastestReply2 || '45 detik'}</strong>
                            </div>
                        </div>
                    </div>

                    <div style={{ background: currentTheme.card, padding: '40px 50px', borderRadius: '32px', maxWidth: '900px', backdropFilter: 'blur(20px)', border: `4px solid ${currentTheme.primary}20`, marginBottom: '100px' }}> {/* Added bottom margin */}
                        <p style={{ fontSize: '32px', color: currentTheme.textLight, textAlign: 'center', lineHeight: '1.6', margin: '0 0 16px 0', fontWeight: '700' }}>
                            💡 Menurut AI
                        </p>
                        <p style={{
                            fontSize: '32px',
                            color: currentTheme.textLight,
                            textAlign: 'center',
                            lineHeight: '1.6',
                            margin: '0',
                            overflowWrap: 'break-word',
                            letterSpacing: '0.5px'
                        }}>
                            "{insight}"
                        </p>
                    </div>
                </div>
                <RenderFooter />
            </div>
        );
    };

    const renderGhostingTemplate = () => {
        const name1 = privacyMode?.hideNames ? '***' : (data.participant1 || 'Elfan');
        const name2 = privacyMode?.hideNames ? '***' : (data.participant2 || 'Savira');
        const ghostingKing = data.ghostingKing || name1;

        return (
            <div style={containerStyle}>
                <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', width: '900px', height: '900px', borderRadius: '50%', background: 'radial-gradient(circle, #9333EA 0%, transparent 70%)', opacity: 0.25, zIndex: 0 }} />

                <div style={{ padding: '140px 90px 40px', position: 'relative', zIndex: 1 }}>
                    <div style={{ marginBottom: '24px', fontSize: '48px', fontWeight: '900', color: currentTheme.text }}>
                        {name1} × {name2}
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: '700', color: currentTheme.primary, textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '32px' }}>
                        Chat Wrapped 2026
                    </div>
                    <h1 style={{ fontSize: '100px', fontWeight: '900', color: currentTheme.text, lineHeight: '1', letterSpacing: '-3px' }}>
                        Ghosting<br />Detector
                    </h1>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 90px', marginTop: '20px', zIndex: 1 }}>
                    <div style={{ fontSize: '180px', marginBottom: '50px', lineHeight: '1' }}>👻</div>

                    <div style={{
                        fontSize: '72px',
                        fontWeight: '900',
                        color: '#9333EA',
                        marginBottom: '20px',
                        lineHeight: '1',
                        textAlign: 'center'
                    }}>
                        {ghostingKing}
                    </div>
                    <h2 style={{ fontSize: '48px', fontWeight: '800', color: currentTheme.text, marginBottom: '60px', textAlign: 'center' }}>
                        Raja Ghosting 👑
                    </h2>

                    <div style={{ display: 'flex', gap: '32px', width: '100%', maxWidth: '900px', justifyContent: 'center' }}>
                        <div style={{ flex: 1, background: currentTheme.card, padding: '40px', borderRadius: '32px', backdropFilter: 'blur(20px)', textAlign: 'center' }}>
                            <div style={{ fontSize: '72px', fontWeight: '900', color: currentTheme.primary, marginBottom: '16px' }}>{data.ghostingCount1 || 12}×</div>
                            <div style={{ fontSize: '28px', color: currentTheme.textLight, fontWeight: '700', marginBottom: '16px' }}>{name1}</div>
                            <div style={{ fontSize: '24px', color: currentTheme.textLight }}>Terlama: {data.longestGhosting1 || '2 hari'}</div>
                        </div>
                        <div style={{ flex: 1, background: currentTheme.card, padding: '40px', borderRadius: '32px', backdropFilter: 'blur(20px)', textAlign: 'center' }}>
                            <div style={{ fontSize: '72px', fontWeight: '900', color: currentTheme.accent, marginBottom: '16px' }}>{data.ghostingCount2 || 7}×</div>
                            <div style={{ fontSize: '28px', color: currentTheme.textLight, fontWeight: '700', marginBottom: '16px' }}>{name2}</div>
                            <div style={{ fontSize: '24px', color: currentTheme.textLight }}>Terlama: {data.longestGhosting2 || '1 hari'}</div>
                        </div>
                    </div>

                    {data.comebackMessage && (
                        <div style={{ background: currentTheme.card, padding: '40px 50px', borderRadius: '32px', marginTop: '60px', maxWidth: '900px', backdropFilter: 'blur(20px)', borderLeft: `8px solid ${currentTheme.primary}`, marginBottom: '100px' }}> {/* Added bottom margin */}
                            <p style={{ fontSize: '24px', color: currentTheme.textLight, margin: '0 0 16px 0', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px' }}>Most Iconic Comeback</p>
                            <p style={{
                                fontSize: '32px',
                                color: currentTheme.text,
                                margin: '0',
                                lineHeight: '1.6',
                                fontStyle: 'italic',
                                overflowWrap: 'break-word',
                                letterSpacing: '0.5px'
                            }}>
                                "{data.comebackMessage}"
                            </p>
                        </div>
                    )}
                </div>
                <RenderFooter />
            </div>
        );
    };

    const renderTopicRankingTemplate = () => {
        const name1 = privacyMode?.hideNames ? '***' : (data.participant1 || 'Elfan');
        const name2 = privacyMode?.hideNames ? '***' : (data.participant2 || 'Savira');

        return (
            <div style={containerStyle}>
                <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', width: '900px', height: '900px', borderRadius: '50%', background: `radial-gradient(circle, ${currentTheme.primary} 0%, transparent 70%)`, opacity: 0.2, zIndex: 0 }} />

                <div style={{ padding: '140px 90px 40px', position: 'relative', zIndex: 1 }}>
                    <div style={{ marginBottom: '24px', fontSize: '48px', fontWeight: '900', color: currentTheme.text }}>{name1} × {name2}</div>
                    <div style={{ fontSize: '28px', fontWeight: '700', color: currentTheme.textLight, textTransform: 'uppercase', letterSpacing: '4px', marginBottom: '32px' }}>Chat Wrapped 2026</div>
                    <h1 style={{ fontSize: '110px', fontWeight: '900', color: currentTheme.text, lineHeight: '1', letterSpacing: '-4px' }}>
                        Topic<br />Ranking
                    </h1>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 90px', position: 'relative', zIndex: 1, marginTop: '20px' }}>
                    <div style={{ width: '100%', maxWidth: '950px', marginBottom: '60px' }}>
                        {data.topTopics?.slice(0, 5).map((topic, i) => (
                            <div key={i} style={{ background: currentTheme.card, padding: '40px 50px', borderRadius: '40px', marginBottom: '24px', backdropFilter: 'blur(30px)', display: 'flex', alignItems: 'center', gap: '40px', border: i === 0 ? `6px solid ${currentTheme.primary}` : 'none' }}>
                                <div style={{ fontSize: '64px', fontWeight: '900', color: currentTheme.primary, minWidth: '80px' }}>#{i + 1}</div>
                                <div style={{ fontSize: '80px', lineHeight: '1' }}>{topic.emoji}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '42px', fontWeight: '800', color: currentTheme.text, marginBottom: '8px' }}>{topic.topic}</div>
                                    <div style={{ fontSize: '28px', color: currentTheme.textLight, fontWeight: '600' }}>{topic.count} pesan</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ background: currentTheme.card, padding: '50px 60px', borderRadius: '40px', maxWidth: '950px', backdropFilter: 'blur(30px)', border: `4px solid ${currentTheme.primary}20`, marginBottom: '100px' }}> {/* Added bottom margin */}
                        <p style={{ fontSize: '36px', color: currentTheme.textLight, textAlign: 'center', lineHeight: '1.6', margin: '0 0 24px 0', fontWeight: '700' }}>💡 Menurut AI</p>
                        <p style={{
                            fontSize: '32px',
                            color: currentTheme.textLight,
                            textAlign: 'center',
                            lineHeight: '1.6',
                            margin: '0',
                            fontWeight: '500',
                            overflowWrap: 'break-word',
                            letterSpacing: '0.5px'
                        }}>
                            "{data.topicInsight}"
                        </p>
                    </div>
                </div>
                <RenderFooter />
            </div>
        );
    };

    const renderQuoteYearTemplate = () => {
        const quote = privacyMode?.safeQuote ? '***' : (data.bestQuote || 'Gapapa salah, yang penting bareng');
        const author = privacyMode?.hideNames ? '***' : (data.quoteAuthor || 'User');

        return (
            <div style={containerStyle}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '900px', height: '900px', borderRadius: '50%', background: 'radial-gradient(circle, #FFD700 0%, transparent 70%)', opacity: 0.25, zIndex: 0 }} />

                <RenderHeader title={<>Quote of<br />the Year</>} />

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 90px', position: 'relative', zIndex: 1, marginTop: '40px' }}>
                    <div style={{ fontSize: '200px', marginBottom: '60px', lineHeight: '1' }}>💬</div>

                    {/* Main Quote Card */}
                    <div style={{
                        background: currentTheme.card,
                        padding: '80px 60px',
                        borderRadius: '50px',
                        width: '100%',
                        maxWidth: '950px',
                        backdropFilter: 'blur(30px)',
                        border: `6px solid ${currentTheme.primary}`,
                        position: 'relative',
                        marginBottom: '60px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <div style={{ fontSize: '180px', color: currentTheme.primary, position: 'absolute', top: '20px', left: '40px', opacity: 0.3, lineHeight: '1' }}>"</div>

                        <p style={{
                            fontSize: '64px',
                            fontWeight: '800',
                            color: currentTheme.text,
                            textAlign: 'center',
                            lineHeight: '1.4',
                            margin: '0 0 40px 0',
                            position: 'relative',
                            zIndex: 1,
                            wordWrap: 'break-word',
                            whiteSpace: 'pre-wrap'
                        }}>
                            {quote}
                        </p>

                        <div style={{ textAlign: 'center', fontSize: '42px', color: currentTheme.textLight, fontWeight: '700', marginTop: 'auto' }}>
                            — {author}
                        </div>

                        {data.quoteDate && (
                            <div style={{ textAlign: 'center', fontSize: '28px', color: currentTheme.textLight, marginTop: '20px' }}>
                                {data.quoteDate}
                            </div>
                        )}
                    </div>

                    {/* Runner Ups Area */}
                    {data.runnerUpQuotes && data.runnerUpQuotes.length > 0 && (
                        <div style={{ width: '100%', maxWidth: '950px', marginTop: '20px', paddingBottom: '100px' }}> {/* Added padding bottom */}
                            <p style={{
                                fontSize: '32px',
                                color: currentTheme.textLight,
                                textAlign: 'center',
                                marginBottom: '24px',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                                display: 'block'
                            }}>
                                Runner Ups
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {data.runnerUpQuotes.slice(0, 2).map((q, i) => (
                                    <div key={i} style={{
                                        background: currentTheme.card,
                                        padding: '32px 40px',
                                        borderRadius: '30px',
                                        backdropFilter: 'blur(20px)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start'
                                    }}>
                                        <p style={{
                                            fontSize: '32px',
                                            color: currentTheme.text,
                                            margin: '0 0 16px 0',
                                            lineHeight: '1.4',
                                            width: '100%'
                                        }}>
                                            "{q.text}"
                                        </p>
                                        <span style={{ fontSize: '24px', color: currentTheme.textLight, fontWeight: '600' }}>
                                            — {privacyMode?.hideNames ? '***' : q.author}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <RenderFooter />
            </div>
        );
    };

    const renderCareMeterTemplate = () => {
        const name1 = privacyMode?.hideNames ? '***' : (data.participant1 || 'Elfan');
        const name2 = privacyMode?.hideNames ? '***' : (data.participant2 || 'Savira');

        return (
            <div style={containerStyle}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '900px', height: '900px', borderRadius: '50%', background: 'radial-gradient(circle, #FF69B4 0%, transparent 70%)', opacity: 0.25, zIndex: 0 }} />

                <RenderHeader title={<>Care<br />Meter</>} />

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 90px', position: 'relative', zIndex: 1, marginTop: '40px' }}>
                    <div style={{ fontSize: '180px', marginBottom: '60px', lineHeight: '1' }}>❤️</div>

                    <div style={{ display: 'flex', gap: '32px', width: '100%', maxWidth: '900px', marginBottom: '50px' }}>
                        <div style={{ flex: 1, background: currentTheme.card, padding: '40px', borderRadius: '32px', backdropFilter: 'blur(20px)', border: `4px solid ${currentTheme.primary}`, textAlign: 'center' }}>
                            <div style={{ fontSize: '32px', fontWeight: '800', marginBottom: '24px' }}>{name1}</div>
                            <div style={{ fontSize: '80px', fontWeight: '900', color: currentTheme.primary, marginBottom: '16px' }}>{data.careScore1 || 78}%</div>
                            <div style={{ fontSize: '20px', color: currentTheme.textLight }}>Perhatian Score</div>
                        </div>
                        <div style={{ flex: 1, background: currentTheme.card, padding: '40px', borderRadius: '32px', backdropFilter: 'blur(20px)', border: `4px solid ${currentTheme.accent}`, textAlign: 'center' }}>
                            <div style={{ fontSize: '32px', fontWeight: '800', marginBottom: '24px' }}>{name2}</div>
                            <div style={{ fontSize: '80px', fontWeight: '900', color: currentTheme.accent, marginBottom: '16px' }}>{data.careScore2 || 92}%</div>
                            <div style={{ fontSize: '20px', color: currentTheme.textLight }}>Perhatian Score</div>
                        </div>
                    </div>

                    <div style={{ fontSize: '36px', fontWeight: '800', color: currentTheme.text, marginBottom: '50px', textAlign: 'center' }}>
                        Paling Perhatian: <span style={{ color: currentTheme.primary, fontSize: '42px' }}>{data.careWinner || name2}</span> 🏆
                    </div>

                    <div style={{ background: currentTheme.card, padding: '40px 50px', borderRadius: '32px', maxWidth: '900px', backdropFilter: 'blur(30px)', border: `4px solid ${currentTheme.primary}20`, marginBottom: '100px' }}> {/* Added bottom margin */}
                        <p style={{ fontSize: '32px', color: currentTheme.textLight, textAlign: 'center', lineHeight: '1.6', margin: '0 0 20px 0', fontWeight: '700' }}>💡 Menurut AI</p>
                        <p style={{
                            fontSize: '32px',
                            color: currentTheme.textLight,
                            textAlign: 'center',
                            lineHeight: '1.6',
                            margin: '0',
                            overflowWrap: 'break-word',
                            letterSpacing: '0.5px'
                        }}>
                            "{data.careInsight}"
                        </p>
                    </div>
                </div>
                <RenderFooter />
            </div>
        );
    };

    const renderOverthinkingTemplate = () => {
        const name1 = privacyMode?.hideNames ? '***' : (data.participant1 || 'Elfan');
        const name2 = privacyMode?.hideNames ? '***' : (data.participant2 || 'Savira');
        const king = data.overthinkingKing || name2;

        return (
            <div style={containerStyle}>
                <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '800px', borderRadius: '50%', background: 'radial-gradient(circle, #8A2BE2 0%, transparent 70%)', opacity: 0.25, zIndex: 0 }} />

                <RenderHeader title={<>Overthinking<br />Detector</>} />

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 90px', position: 'relative', zIndex: 1, marginTop: '40px' }}>
                    <div style={{ fontSize: '180px', marginBottom: '50px', lineHeight: '1' }}>🤔</div>
                    <div style={{ fontSize: '28px', textTransform: 'uppercase', letterSpacing: '4px', color: currentTheme.textLight, marginBottom: '16px' }}>THE OVERTHINKER IS</div>
                    <div style={{
                        fontSize: '100px',
                        fontWeight: '900',
                        color: '#8A2BE2',
                        marginBottom: '60px'
                    }}>
                        {king}
                    </div>

                    <div style={{ display: 'flex', width: '100%', maxWidth: '800px', marginBottom: '60px', gap: '40px' }}>
                        <div style={{ flex: 1, textAlign: 'center' }}>
                            <div style={{ fontSize: '28px', fontWeight: '700', marginBottom: '10px' }}>{name1}</div>
                            <div style={{ fontSize: '64px', fontWeight: '900', color: currentTheme.primary }}>{data.overthinkingScore1}%</div>
                        </div>
                        <div style={{ flex: 1, textAlign: 'center' }}>
                            <div style={{ fontSize: '28px', fontWeight: '700', marginBottom: '10px' }}>{name2}</div>
                            <div style={{ fontSize: '64px', fontWeight: '900', color: currentTheme.accent }}>{data.overthinkingScore2}%</div>
                        </div>
                    </div>

                    <div style={{ width: '100%', maxWidth: '900px', paddingBottom: '100px' }}> {/* Added padding bottom */}
                        <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px', color: currentTheme.textLight, textTransform: 'uppercase' }}>BUKTI OVERTHINKING:</div>
                        {data.overthinkingExamples?.slice(0, 3).map((ex, i) => (
                            <div key={i} style={{ background: currentTheme.card, padding: '32px 40px', borderRadius: '24px', marginBottom: '20px', backdropFilter: 'blur(20px)', borderLeft: `6px solid ${currentTheme.primary}` }}>
                                <p style={{
                                    fontSize: '28px',
                                    color: currentTheme.text,
                                    margin: '0',
                                    lineHeight: '1.4',
                                    fontStyle: 'italic',
                                    overflowWrap: 'break-word',
                                    letterSpacing: '0.5px'
                                }}>
                                    "{ex.text}"
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
                <RenderFooter />
            </div>
        );
    };

    const renderTypingStyleTemplate = () => {
        const name1 = privacyMode?.hideNames ? '***' : (data.participant1 || 'Elfan');
        const name2 = privacyMode?.hideNames ? '***' : (data.participant2 || 'Savira');

        return (
            <div style={containerStyle}>
                <div style={{ position: 'absolute', top: '20%', left: '20%', width: '500px', height: '500px', borderRadius: '50%', background: `radial-gradient(circle, ${currentTheme.primary} 0%, transparent 70%)`, opacity: 0.25, zIndex: 0 }} />
                <div style={{ position: 'absolute', bottom: '20%', right: '20%', width: '500px', height: '500px', borderRadius: '50%', background: `radial-gradient(circle, ${currentTheme.accent} 0%, transparent 70%)`, opacity: 0.25, zIndex: 0 }} />

                <RenderHeader title={<>Typing<br />Style</>} />

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 90px', position: 'relative', zIndex: 1, marginTop: '20px' }}>
                    <div style={{ fontSize: '180px', marginBottom: '40px', lineHeight: '1' }}>⌨️</div>

                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '900px', gap: '40px' }}>
                        <div style={{ background: currentTheme.card, padding: '40px 50px', borderRadius: '32px', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', gap: '40px', borderLeft: `10px solid ${currentTheme.primary}` }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '42px', fontWeight: '800', marginBottom: '12px', color: currentTheme.text }}>{name1}</div>
                                <div style={{ fontSize: '24px', color: currentTheme.textLight, marginBottom: '8px' }}>Style:</div>
                                <div style={{ fontSize: '36px', fontWeight: '700', color: currentTheme.primary }}>{data.typingStyle1}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '64px', fontWeight: '900', color: currentTheme.text }}>{data.avgMessageLength1}</div>
                                <div style={{ fontSize: '20px', color: currentTheme.textLight }}>words/msg</div>
                            </div>
                        </div>

                        <div style={{ background: currentTheme.card, padding: '40px 50px', borderRadius: '32px', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', gap: '40px', borderLeft: `10px solid ${currentTheme.accent}` }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '42px', fontWeight: '800', marginBottom: '12px', color: currentTheme.text }}>{name2}</div>
                                <div style={{ fontSize: '24px', color: currentTheme.textLight, marginBottom: '8px' }}>Style:</div>
                                <div style={{ fontSize: '36px', fontWeight: '700', color: currentTheme.accent }}>{data.typingStyle2}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '64px', fontWeight: '900', color: currentTheme.text }}>{data.avgMessageLength2}</div>
                                <div style={{ fontSize: '20px', color: currentTheme.textLight }}>words/msg</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', width: '100%', maxWidth: '900px', marginTop: '50px', gap: '32px', paddingBottom: '100px' }}> {/* Added padding bottom */}
                        <div style={{ flex: 1, background: 'rgba(255,255,255,0.2)', padding: '30px', borderRadius: '24px', textAlign: 'center' }}>
                            <div style={{ fontSize: '24px', marginBottom: '10px' }}>Speed {name1}</div>
                            <div style={{ fontSize: '40px', fontWeight: '800' }}>{data.typingSpeed1 || '⚡ Cepat'}</div>
                        </div>
                        <div style={{ flex: 1, background: 'rgba(255,255,255,0.2)', padding: '30px', borderRadius: '24px', textAlign: 'center' }}>
                            <div style={{ fontSize: '24px', marginBottom: '10px' }}>Speed {name2}</div>
                            <div style={{ fontSize: '40px', fontWeight: '800' }}>{data.typingSpeed2 || '🚶 Santai'}</div>
                        </div>
                    </div>
                </div>
                <RenderFooter />
            </div>
        );
    };

    const renderEmojiPersonalityTemplate = () => {
        const name1 = privacyMode?.hideNames ? '***' : (data.participant1 || 'Elfan');
        const name2 = privacyMode?.hideNames ? '***' : (data.participant2 || 'Savira');

        return (
            <div style={containerStyle}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '900px', height: '900px', borderRadius: '50%', background: `radial-gradient(circle, #FFD700 0%, transparent 70%)`, opacity: 0.25, zIndex: 0 }} />

                <RenderHeader title={<>Emoji<br />Personality</>} />

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 90px', position: 'relative', zIndex: 1, marginTop: '20px' }}>
                    <div style={{ fontSize: '180px', marginBottom: '60px', lineHeight: '1' }}>😊</div>

                    <div style={{ display: 'flex', gap: '40px', width: '100%', marginBottom: '60px' }}>
                        <div style={{ flex: 1, background: currentTheme.card, padding: '50px 30px', borderRadius: '40px', backdropFilter: 'blur(20px)', textAlign: 'center', borderTop: `10px solid ${currentTheme.primary}` }}>
                            <div style={{ fontSize: '42px', fontWeight: '900', marginBottom: '30px', color: currentTheme.text }}>{name1}</div>
                            <div style={{ fontSize: '160px', marginBottom: '30px', lineHeight: 1 }}>{data.topEmoji1}</div>
                            <div style={{ fontSize: '48px', fontWeight: '900', color: currentTheme.primary, marginBottom: '16px', lineHeight: '1.2' }}>{data.personality1}</div>
                            <div style={{ fontSize: '32px', color: currentTheme.textLight, fontWeight: '500' }}>Used: {data.emojiCount1}x</div>
                        </div>

                        <div style={{ flex: 1, background: currentTheme.card, padding: '50px 30px', borderRadius: '40px', backdropFilter: 'blur(20px)', textAlign: 'center', borderTop: `10px solid ${currentTheme.accent}` }}>
                            <div style={{ fontSize: '42px', fontWeight: '900', marginBottom: '30px', color: currentTheme.text }}>{name2}</div>
                            <div style={{ fontSize: '160px', marginBottom: '30px', lineHeight: 1 }}>{data.topEmoji2}</div>
                            <div style={{ fontSize: '48px', fontWeight: '900', color: currentTheme.accent, marginBottom: '16px', lineHeight: '1.2' }}>{data.personality2}</div>
                            <div style={{ fontSize: '32px', color: currentTheme.textLight, fontWeight: '500' }}>Used: {data.emojiCount2}x</div>
                        </div>
                    </div>

                    <div style={{ background: currentTheme.card, padding: '40px 60px', borderRadius: '40px', maxWidth: '950px', backdropFilter: 'blur(20px)', border: `4px solid ${currentTheme.primary}20`, marginBottom: '100px' }}> {/* Added bottom margin */}
                        <p style={{ fontSize: '36px', color: currentTheme.textLight, textAlign: 'center', lineHeight: '1.6', margin: '0 0 20px 0', fontWeight: '700' }}>💡 Menurut AI</p>
                        <p style={{
                            fontSize: '32px',
                            color: currentTheme.textLight,
                            textAlign: 'center',
                            lineHeight: '1.6',
                            margin: '0',
                            fontWeight: '500',
                            overflowWrap: 'break-word',
                            letterSpacing: '0.5px'
                        }}>
                            "{data.emojiInsight}"
                        </p>
                    </div>
                </div>
                <RenderFooter />
            </div>
        );
    };



    const renderTotalRecapTemplate = () => (
        <div style={containerStyle}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '900px', height: '900px', borderRadius: '50%', background: `radial-gradient(circle, ${currentTheme.primary} 0%, transparent 70%)`, opacity: 0.25, zIndex: 0 }} />

            <RenderHeader title={<>Total<br />Recap</>} />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 90px', position: 'relative', zIndex: 1, marginTop: '20px' }}>
                <div style={{ fontSize: '160px', marginBottom: '40px', lineHeight: '1' }}>📅</div>

                <div style={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* Total Messages */}
                    <div style={{ background: currentTheme.card, padding: '40px 50px', borderRadius: '40px', backdropFilter: 'blur(20px)', border: `4px solid ${currentTheme.primary}`, textAlign: 'center' }}>
                        <div style={{ fontSize: '28px', color: currentTheme.textLight, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '700' }}>Total Pesan</div>
                        <div style={{ fontSize: '100px', fontWeight: '900', color: currentTheme.primary, lineHeight: '1' }}>
                            {data.totalMessages?.toLocaleString('id-ID') || 0}
                        </div>
                    </div>

                    {/* Total Duration */}
                    <div style={{ background: currentTheme.card, padding: '40px 50px', borderRadius: '40px', backdropFilter: 'blur(20px)', border: `4px solid ${currentTheme.accent}`, textAlign: 'center' }}>
                        <div style={{ fontSize: '28px', color: currentTheme.textLight, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '700' }}>Durasi Chat</div>
                        <div style={{ fontSize: '100px', fontWeight: '900', color: currentTheme.accent, lineHeight: '1' }}>
                            {data.totalRecapDuration || '0 Hari'}
                        </div>
                    </div>

                    {/* Date Range */}
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <div style={{ fontSize: '32px', color: currentTheme.text, fontWeight: '700' }}>
                            {data.totalRecapStartDate} — {data.totalRecapEndDate}
                        </div>
                        <div style={{ fontSize: '24px', color: currentTheme.textLight, marginTop: '10px' }}>
                            {data.totalRecapActiveDays ? `${data.totalRecapActiveDays} hari aktif chattingan` : ''}
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '60px', paddingBottom: '100px', maxWidth: '800px' }}>
                    <p style={{
                        fontSize: '32px',
                        color: currentTheme.textLight,
                        textAlign: 'center',
                        lineHeight: '1.6',
                        margin: '0',
                        overflowWrap: 'break-word',
                        letterSpacing: '0.5px'
                    }}>
                        "{data.totalRecapInsight || 'Perjalanan panjang yang penuh cerita!'}"
                    </p>
                </div>
            </div>
            <RenderFooter />
        </div>
    );

    const renderAIPredictionTemplate = () => (
        <div style={containerStyle}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '900px', height: '900px', borderRadius: '50%', background: `radial-gradient(circle, #4B0082 0%, transparent 70%)`, opacity: 0.25, zIndex: 0 }} />

            <RenderHeader title={<>2026<br />Prediction</>} />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 80px', position: 'relative', zIndex: 1, marginTop: '20px' }}>
                <div style={{ fontSize: '140px', marginBottom: '30px', lineHeight: '1' }}>🔮</div>

                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: currentTheme.textLight, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '3px' }}>Relationship Strength</div>
                    <div style={{
                        fontSize: '140px',
                        fontWeight: '900',
                        color: '#FFA500',
                        lineHeight: '1'
                    }}>
                        {data.relationshipScore}%
                    </div>
                </div>

                <div style={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
                    <div style={{ background: currentTheme.card, padding: '30px 40px', borderRadius: '24px', backdropFilter: 'blur(20px)', borderLeft: `8px solid #4CAF50` }}>
                        <div style={{ fontSize: '24px', fontWeight: '700', color: '#4CAF50', marginBottom: '12px', textTransform: 'uppercase' }}>Kekuatan Kalian</div>
                        <ul style={{ paddingLeft: '24px', margin: 0 }}>
                            {data.strengthPoints?.map((p, i) => (
                                <li key={i} style={{ fontSize: '26px', color: currentTheme.text, marginBottom: '8px', lineHeight: '1.4' }}>{p}</li>
                            ))}
                        </ul>
                    </div>

                    <div style={{ background: currentTheme.card, padding: '30px 40px', borderRadius: '24px', backdropFilter: 'blur(20px)', borderLeft: `8px solid #FF5722` }}>
                        <div style={{ fontSize: '24px', fontWeight: '700', color: '#FF5722', marginBottom: '12px', textTransform: 'uppercase' }}>Perlu Diperbaiki</div>
                        <ul style={{ paddingLeft: '24px', margin: 0 }}>
                            {data.improvementPoints?.map((p, i) => (
                                <li key={i} style={{ fontSize: '26px', color: currentTheme.text, marginBottom: '8px', lineHeight: '1.4' }}>{p}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div style={{ background: currentTheme.card, padding: '30px 40px', borderRadius: '24px', maxWidth: '900px', backdropFilter: 'blur(20px)', border: `4px solid ${currentTheme.primary}20`, marginBottom: '120px' }}> {/* Added bottom margin */}
                    <p style={{ fontSize: '28px', color: currentTheme.textLight, textAlign: 'center', lineHeight: '1.6', margin: '0 0 16px 0', fontWeight: '700' }}>💡 Ramalan AI 2026</p>
                    <p style={{
                        fontSize: '28px',
                        color: currentTheme.textLight,
                        textAlign: 'center',
                        lineHeight: '1.5',
                        margin: '0',
                        overflowWrap: 'break-word',
                        letterSpacing: '0.5px'
                    }}>
                        "{data.prediction2026}"
                    </p>
                    <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '20px', color: currentTheme.textLight, opacity: 0.7 }}>Confidence Level: {data.aiConfidence}%</div>
                </div>
            </div>
            <RenderFooter />
        </div>
    );

    return renderTemplate();
};