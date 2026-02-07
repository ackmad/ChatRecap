import React from 'react';
import { Heart, TrendingUp, MessageCircle, Calendar, User, Sparkles, Zap, Ghost, Activity, Flame, BarChart3, Quote, ThumbsUp, Brain, Keyboard, Smile, Wand2 } from 'lucide-react';

export type TemplateType = 'stats' | 'active-day' | 'who-talks' | 'late-night' | 'peak-moment' | 'top-words' | 'toxic-meter' | 'reply-speed' | 'ghosting' | 'topic-ranking' | 'quote-year' | 'care-meter' | 'overthinking' | 'typing-style' | 'emoji-personality' | 'ai-prediction';
export type ThemeType = 'pastel' | 'gradient' | 'dark' | 'minimal';

export interface StoryTemplateProps {
    template: TemplateType;
    theme: ThemeType;
    data: {
        // Old properties (for backward compatibility)
        title?: string;
        mood?: string;
        moodPercentage?: number;
        topics?: Array<{ name: string; percentage: number }>;
        aura?: { name: string; color: string; description: string };
        quote?: string;
        timeline?: Array<{ phase: string; description: string }>;
        personality?: { type: string; traits: string[] };
        relationshipType?: string;

        // New properties for new templates
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

        // Toxic Meter Template
        toxicScore?: number;
        toxicLevel?: string;
        toxicExamples?: Array<{ text: string; time: string }>;
        toxicInsight?: string;

        // Reply Speed Template
        avgReplyTime1?: string;
        avgReplyTime2?: string;
        fastestReply1?: string;
        fastestReply2?: string;
        replyBadge1?: string;
        replyBadge2?: string;
        activeHours1?: string[];
        activeHours2?: string[];
        replyInsight?: string;

        // Ghosting Detector Template
        ghostingCount1?: number;
        ghostingCount2?: number;
        longestGhosting1?: string;
        longestGhosting2?: string;
        comebackMessage?: string;
        ghostingKing?: string;
        ghostingInsight?: string;

        // Topic Ranking Template
        topTopics?: Array<{ topic: string; count: number; emoji: string }>;
        topicInsight?: string;
        mostDebatedTopic?: string;

        // Quote of the Year Template
        bestQuote?: string;
        quoteAuthor?: string;
        quoteDate?: string;
        quoteContext?: string;
        runnerUpQuotes?: Array<{ text: string; author: string }>;

        // Care Meter Template
        careScore1?: number;
        careScore2?: number;
        careExamples1?: Array<{ text: string; time: string }>;
        careExamples2?: Array<{ text: string; time: string }>;
        careWinner?: string;
        careInsight?: string;

        // Overthinking Detector Template
        overthinkingScore1?: number;
        overthinkingScore2?: number;
        overthinkingExamples?: Array<{ text: string; author: string }>;
        overthinkingKing?: string;
        overthinkingInsight?: string;

        // Typing Style Template
        typingStyle1?: string;
        typingStyle2?: string;
        avgMessageLength1?: number;
        avgMessageLength2?: number;
        typingSpeed1?: string;
        typingSpeed2?: string;
        styleInsight?: string;

        // Emoji Personality Template
        topEmoji1?: string;
        topEmoji2?: string;
        emojiCount1?: number;
        emojiCount2?: number;
        personality1?: string;
        personality2?: string;
        emojiInsight?: string;

        // AI Prediction Template
        relationshipScore?: number;
        futurePredict?: string;
        strengthPoints?: string[];
        improvementPoints?: string[];
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
            textLight: '#6B7280',
            card: 'rgba(255, 255, 255, 0.8)'
        },
        gradient: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            primary: '#FFFFFF',
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
            textLight: '#6B7280',
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

    // Render different templates
    const renderTemplate = () => {
        switch (template) {
            case 'stats':
                return renderStatsTemplate();
            case 'active-day':
                return renderActiveDayTemplate();
            case 'who-talks':
                return renderWhoTalksTemplate();
            case 'late-night':
                return renderLateNightTemplate();
            case 'peak-moment':
                return renderPeakMomentTemplate();
            case 'top-words':
                return renderTopWordsTemplate();
            case 'toxic-meter':
                return renderToxicMeterTemplate();
            case 'reply-speed':
                return renderReplySpeedTemplate();
            case 'ghosting':
                return renderGhostingTemplate();
            case 'topic-ranking':
                return renderTopicRankingTemplate();
            case 'quote-year':
                return renderQuoteYearTemplate();
            case 'care-meter':
                return renderCareMeterTemplate();
            case 'overthinking':
                return renderOverthinkingTemplate();
            case 'typing-style':
                return renderTypingStyleTemplate();
            case 'emoji-personality':
                return renderEmojiPersonalityTemplate();
            case 'ai-prediction':
                return renderAIPredictionTemplate();
            default:
                return renderStatsTemplate();
        }
    };

    const renderStatsTemplate = () => (
        <div style={containerStyle}>
            <div style={{
                position: 'absolute',
                top: '-150px',
                right: '-150px',
                width: '500px',
                height: '500px',
                borderRadius: '50%',
                background: currentTheme.accent,
                opacity: 0.1,
                filter: 'blur(80px)',
                zIndex: 0
            }} />

            <div style={{
                height: '280px',
                padding: '100px 90px 0',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ marginBottom: '24px' }}>
                    <span style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: currentTheme.primary,
                        textTransform: 'uppercase',
                        letterSpacing: '3px'
                    }}>
                        YOUR CHAT WRAPPED
                    </span>
                </div>
                <h1 style={{
                    fontSize: '72px',
                    fontWeight: '900',
                    color: currentTheme.text,
                    lineHeight: '1.1',
                    margin: '0',
                    letterSpacing: '-2px'
                }}>
                    Chat<br />Stats
                </h1>
            </div>

            <div style={{
                height: '1240px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0 90px',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ fontSize: '180px', marginBottom: '50px', lineHeight: '1' }}>
                    📊
                </div>

                <div style={{
                    fontSize: '140px',
                    fontWeight: '900',
                    background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.accent} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '30px',
                    lineHeight: '1'
                }}>
                    {data.totalMessages || 2543}
                </div>

                <h2 style={{
                    fontSize: '56px',
                    fontWeight: '800',
                    color: currentTheme.text,
                    marginBottom: '30px',
                    margin: '0 0 30px 0',
                    lineHeight: '1.2'
                }}>
                    Total Pesan
                </h2>

                <p style={{
                    fontSize: '28px',
                    color: currentTheme.textLight,
                    textAlign: 'center',
                    maxWidth: '700px',
                    lineHeight: '1.6',
                    margin: '0'
                }}>
                    Statistik lengkap aktivitas chat kalian
                </p>
            </div>

            <div style={{
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 90px 100px',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '20px 40px',
                    background: currentTheme.card,
                    borderRadius: '100px',
                    backdropFilter: 'blur(20px)'
                }}>
                    <Sparkles size={24} color={currentTheme.primary} />
                    <span style={{
                        fontSize: '22px',
                        fontWeight: '700',
                        color: currentTheme.text
                    }}>
                        RecapChat.App
                    </span>
                </div>
            </div>
        </div>
    );

    const renderActiveDayTemplate = () => (
        <div style={containerStyle}>
            <div style={{
                position: 'absolute',
                top: '-150px',
                left: '-150px',
                width: '500px',
                height: '500px',
                borderRadius: '50%',
                background: currentTheme.accent,
                opacity: 0.1,
                filter: 'blur(80px)',
                zIndex: 0
            }} />

            <div style={{
                height: '280px',
                padding: '100px 90px 0',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ marginBottom: '24px' }}>
                    <span style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: currentTheme.primary,
                        textTransform: 'uppercase',
                        letterSpacing: '3px'
                    }}>
                        YOUR CHAT WRAPPED
                    </span>
                </div>
                <h1 style={{
                    fontSize: '72px',
                    fontWeight: '900',
                    color: currentTheme.text,
                    lineHeight: '1.1',
                    margin: '0',
                    letterSpacing: '-2px'
                }}>
                    Most Active<br />Day
                </h1>
            </div>

            <div style={{
                height: '1240px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0 90px',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ fontSize: '180px', marginBottom: '50px', lineHeight: '1' }}>
                    📅
                </div>

                <div style={{
                    fontSize: '140px',
                    fontWeight: '900',
                    background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.accent} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '30px',
                    lineHeight: '1'
                }}>
                    {data.mostActiveDay || '17'}
                </div>

                <h2 style={{
                    fontSize: '56px',
                    fontWeight: '800',
                    color: currentTheme.text,
                    marginBottom: '30px',
                    margin: '0 0 30px 0',
                    lineHeight: '1.2'
                }}>
                    Juli 2025
                </h2>

                <p style={{
                    fontSize: '28px',
                    color: currentTheme.textLight,
                    textAlign: 'center',
                    maxWidth: '700px',
                    lineHeight: '1.6',
                    margin: '0'
                }}>
                    Hari paling ramai ngobrol kalian
                </p>
            </div>

            <div style={{
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 90px 100px',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '20px 40px',
                    background: currentTheme.card,
                    borderRadius: '100px',
                    backdropFilter: 'blur(20px)'
                }}>
                    <Sparkles size={24} color={currentTheme.primary} />
                    <span style={{
                        fontSize: '22px',
                        fontWeight: '700',
                        color: currentTheme.text
                    }}>
                        RecapChat.App
                    </span>
                </div>
            </div>
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
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '600px',
                    height: '600px',
                    borderRadius: '50%',
                    background: currentTheme.accent,
                    opacity: 0.1,
                    filter: 'blur(100px)',
                    zIndex: 0
                }} />

                <div style={{
                    height: '280px',
                    padding: '100px 90px 0',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{ marginBottom: '16px' }}>
                        <span style={{
                            fontSize: '32px',
                            fontWeight: '900',
                            color: currentTheme.text,
                            letterSpacing: '-1px'
                        }}>
                            {name1} × {name2}
                        </span>
                    </div>
                    <div style={{ marginBottom: '24px' }}>
                        <span style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: currentTheme.primary,
                            textTransform: 'uppercase',
                            letterSpacing: '2px'
                        }}>
                            Chat Wrapped 2026
                        </span>
                    </div>
                    <h1 style={{
                        fontSize: '64px',
                        fontWeight: '900',
                        color: currentTheme.text,
                        lineHeight: '1.1',
                        margin: '0',
                        letterSpacing: '-2px'
                    }}>
                        Who Talks<br />More?
                    </h1>
                </div>

                <div style={{
                    height: '1240px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '0 90px',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{ fontSize: '120px', marginBottom: '40px', lineHeight: '1' }}>
                        💬
                    </div>

                    <div style={{
                        fontSize: '140px',
                        fontWeight: '900',
                        background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.accent} 100%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '20px',
                        lineHeight: '1'
                    }}>
                        {winnerPerc}%
                    </div>

                    <h2 style={{
                        fontSize: '48px',
                        fontWeight: '800',
                        color: currentTheme.text,
                        marginBottom: '20px',
                        margin: '0 0 20px 0',
                        lineHeight: '1.2'
                    }}>
                        {winner} paling sering ngomong
                    </h2>

                    <div style={{
                        background: currentTheme.card,
                        padding: '24px 32px',
                        borderRadius: '20px',
                        marginTop: '40px',
                        maxWidth: '700px',
                        backdropFilter: 'blur(20px)'
                    }}>
                        <p style={{
                            fontSize: '20px',
                            color: currentTheme.textLight,
                            textAlign: 'center',
                            lineHeight: '1.6',
                            margin: '0 0 16px 0',
                            fontWeight: '600'
                        }}>
                            💡 Menurut AI
                        </p>
                        <p style={{
                            fontSize: '18px',
                            color: currentTheme.textLight,
                            textAlign: 'center',
                            lineHeight: '1.6',
                            margin: '0'
                        }}>
                            "{winner} tuh tipe yang lebih banyak cerita, tapi {loser} juga aktif dengerin kok 👂"
                        </p>
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: '16px',
                        marginTop: '40px',
                        width: '100%',
                        justifyContent: 'center'
                    }}>
                        <div style={{
                            background: currentTheme.card,
                            padding: '20px 28px',
                            borderRadius: '16px',
                            backdropFilter: 'blur(20px)',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                fontSize: '32px',
                                fontWeight: '900',
                                color: currentTheme.primary,
                                marginBottom: '8px'
                            }}>
                                {perc1}%
                            </div>
                            <div style={{
                                fontSize: '16px',
                                color: currentTheme.textLight,
                                fontWeight: '600'
                            }}>
                                {name1}
                            </div>
                        </div>
                        <div style={{
                            background: currentTheme.card,
                            padding: '20px 28px',
                            borderRadius: '16px',
                            backdropFilter: 'blur(20px)',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                fontSize: '32px',
                                fontWeight: '900',
                                color: currentTheme.accent,
                                marginBottom: '8px'
                            }}>
                                {perc2}%
                            </div>
                            <div style={{
                                fontSize: '16px',
                                color: currentTheme.textLight,
                                fontWeight: '600'
                            }}>
                                {name2}
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 90px 100px',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '20px 40px',
                        background: currentTheme.card,
                        borderRadius: '100px',
                        backdropFilter: 'blur(20px)'
                    }}>
                        <Sparkles size={24} color={currentTheme.primary} />
                        <span style={{
                            fontSize: '22px',
                            fontWeight: '700',
                            color: currentTheme.text
                        }}>
                            RecapChat.App
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    const renderLateNightTemplate = () => (
        <div style={containerStyle}>
            <div style={{
                position: 'absolute',
                top: '-100px',
                right: '-100px',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: currentTheme.accent,
                opacity: 0.15,
                filter: 'blur(80px)',
                zIndex: 0
            }} />

            <div style={{
                height: '280px',
                padding: '100px 90px 0',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ marginBottom: '24px' }}>
                    <span style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: currentTheme.primary,
                        textTransform: 'uppercase',
                        letterSpacing: '3px'
                    }}>
                        YOUR CHAT WRAPPED
                    </span>
                </div>
                <h1 style={{
                    fontSize: '72px',
                    fontWeight: '900',
                    color: currentTheme.text,
                    lineHeight: '1.1',
                    margin: '0',
                    letterSpacing: '-2px'
                }}>
                    Late Night<br />Talks
                </h1>
            </div>

            <div style={{
                height: '1240px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0 90px',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ fontSize: '180px', marginBottom: '50px', lineHeight: '1' }}>
                    🌙
                </div>

                <div style={{
                    fontSize: '140px',
                    fontWeight: '900',
                    background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.accent} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '30px',
                    lineHeight: '1'
                }}>
                    00:30
                </div>

                <h2 style={{
                    fontSize: '56px',
                    fontWeight: '800',
                    color: currentTheme.text,
                    marginBottom: '30px',
                    margin: '0 0 30px 0',
                    lineHeight: '1.2'
                }}>
                    Mode Overthinking
                </h2>

                <p style={{
                    fontSize: '28px',
                    color: currentTheme.textLight,
                    textAlign: 'center',
                    maxWidth: '700px',
                    lineHeight: '1.6',
                    margin: '0'
                }}>
                    Chat tengah malam kalian
                </p>
            </div>

            <div style={{
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 90px 100px',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '20px 40px',
                    background: currentTheme.card,
                    borderRadius: '100px',
                    backdropFilter: 'blur(20px)'
                }}>
                    <Sparkles size={24} color={currentTheme.primary} />
                    <span style={{
                        fontSize: '22px',
                        fontWeight: '700',
                        color: currentTheme.text
                    }}>
                        RecapChat.App
                    </span>
                </div>
            </div>
        </div>
    );

    const renderPeakMomentTemplate = () => (
        <div style={containerStyle}>
            <div style={{
                position: 'absolute',
                bottom: '-150px',
                left: '-150px',
                width: '500px',
                height: '500px',
                borderRadius: '50%',
                background: currentTheme.accent,
                opacity: 0.1,
                filter: 'blur(80px)',
                zIndex: 0
            }} />

            <div style={{
                height: '280px',
                padding: '100px 90px 0',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ marginBottom: '24px' }}>
                    <span style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: currentTheme.primary,
                        textTransform: 'uppercase',
                        letterSpacing: '3px'
                    }}>
                        YOUR CHAT WRAPPED
                    </span>
                </div>
                <h1 style={{
                    fontSize: '72px',
                    fontWeight: '900',
                    color: currentTheme.text,
                    lineHeight: '1.1',
                    margin: '0',
                    letterSpacing: '-2px'
                }}>
                    Peak<br />Moment
                </h1>
            </div>

            <div style={{
                height: '1240px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0 90px',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ fontSize: '180px', marginBottom: '50px', lineHeight: '1' }}>
                    ⚡
                </div>

                <div style={{
                    fontSize: '140px',
                    fontWeight: '900',
                    background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.accent} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '30px',
                    lineHeight: '1'
                }}>
                    {data.peakMessages || 847}
                </div>

                <h2 style={{
                    fontSize: '56px',
                    fontWeight: '800',
                    color: currentTheme.text,
                    marginBottom: '30px',
                    margin: '0 0 30px 0',
                    lineHeight: '1.2'
                }}>
                    Pesan Terbanyak
                </h2>

                <p style={{
                    fontSize: '28px',
                    color: currentTheme.textLight,
                    textAlign: 'center',
                    maxWidth: '700px',
                    lineHeight: '1.6',
                    margin: '0'
                }}>
                    Puncak intensitas chat kalian
                </p>
            </div>

            <div style={{
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 90px 100px',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '20px 40px',
                    background: currentTheme.card,
                    borderRadius: '100px',
                    backdropFilter: 'blur(20px)'
                }}>
                    <Sparkles size={24} color={currentTheme.primary} />
                    <span style={{
                        fontSize: '22px',
                        fontWeight: '700',
                        color: currentTheme.text
                    }}>
                        RecapChat.App
                    </span>
                </div>
            </div>
        </div>
    );

    const renderTopWordsTemplate = () => (
        <div style={containerStyle}>
            <div style={{
                position: 'absolute',
                top: '40%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '700px',
                height: '700px',
                borderRadius: '50%',
                background: currentTheme.accent,
                opacity: 0.08,
                filter: 'blur(100px)',
                zIndex: 0
            }} />

            <div style={{
                height: '280px',
                padding: '100px 90px 0',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ marginBottom: '24px' }}>
                    <span style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: currentTheme.primary,
                        textTransform: 'uppercase',
                        letterSpacing: '3px'
                    }}>
                        YOUR CHAT WRAPPED
                    </span>
                </div>
                <h1 style={{
                    fontSize: '72px',
                    fontWeight: '900',
                    color: currentTheme.text,
                    lineHeight: '1.1',
                    margin: '0',
                    letterSpacing: '-2px'
                }}>
                    Top<br />Words
                </h1>
            </div>

            <div style={{
                height: '1240px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0 90px',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ fontSize: '180px', marginBottom: '50px', lineHeight: '1' }}>
                    💭
                </div>

                <div style={{
                    fontSize: '140px',
                    fontWeight: '900',
                    background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.accent} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '30px',
                    lineHeight: '1'
                }}>
                    {data.topWord || 'Haha'}
                </div>

                <h2 style={{
                    fontSize: '56px',
                    fontWeight: '800',
                    color: currentTheme.text,
                    marginBottom: '30px',
                    margin: '0 0 30px 0',
                    lineHeight: '1.2'
                }}>
                    Kata Favorit
                </h2>

                <p style={{
                    fontSize: '28px',
                    color: currentTheme.textLight,
                    textAlign: 'center',
                    maxWidth: '700px',
                    lineHeight: '1.6',
                    margin: '0'
                }}>
                    Kata yang paling sering muncul
                </p>
            </div>

            <div style={{
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 90px 100px',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '20px 40px',
                    background: currentTheme.card,
                    borderRadius: '100px',
                    backdropFilter: 'blur(20px)'
                }}>
                    <Sparkles size={24} color={currentTheme.primary} />
                    <span style={{
                        fontSize: '22px',
                        fontWeight: '700',
                        color: currentTheme.text
                    }}>
                        RecapChat.App
                    </span>
                </div>
            </div>
        </div>
    );


    const renderToxicMeterTemplate = () => {
        const name1 = privacyMode?.hideNames ? '***' : (data.participant1 || 'Elfan');
        const name2 = privacyMode?.hideNames ? '***' : (data.participant2 || 'Savira');
        const relationship = data.relationshipType || 'Sahabat';
        const toxicScore = data.toxicScore || 45;
        const toxicLevel = data.toxicLevel || 'Chaos Lucu';
        const insight = data.toxicInsight || 'Kalian bukan toxic, kalian cuma terlalu jujur 😭';

        return (
            <div style={containerStyle}>
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '700px',
                    height: '700px',
                    borderRadius: '50%',
                    background: '#FF6B6B',
                    opacity: 0.08,
                    filter: 'blur(120px)',
                    zIndex: 0
                }} />

                {/* Header */}
                <div style={{
                    height: '280px',
                    padding: '100px 90px 0',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{ marginBottom: '12px' }}>
                        <span style={{
                            fontSize: '36px',
                            fontWeight: '900',
                            color: currentTheme.text,
                            letterSpacing: '-1px'
                        }}>
                            {name1} × {name2}
                        </span>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                        <span style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: currentTheme.textLight,
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>
                            {relationship}
                        </span>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <span style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: currentTheme.primary,
                            textTransform: 'uppercase',
                            letterSpacing: '2px'
                        }}>
                            Chat Wrapped 2026
                        </span>
                    </div>
                    <h1 style={{
                        fontSize: '60px',
                        fontWeight: '900',
                        color: currentTheme.text,
                        lineHeight: '1.1',
                        margin: '0',
                        letterSpacing: '-2px'
                    }}>
                        Toxic Level<br />Meter
                    </h1>
                </div>

                {/* Content */}
                <div style={{
                    height: '1240px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '0 90px',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{ fontSize: '100px', marginBottom: '30px', lineHeight: '1' }}>
                        🔥
                    </div>

                    {/* Toxic Score */}
                    <div style={{
                        fontSize: '160px',
                        fontWeight: '900',
                        background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '20px',
                        lineHeight: '1'
                    }}>
                        {toxicScore}%
                    </div>

                    {/* Level Label */}
                    <h2 style={{
                        fontSize: '44px',
                        fontWeight: '800',
                        color: currentTheme.text,
                        marginBottom: '20px',
                        margin: '0 0 20px 0',
                        lineHeight: '1.2'
                    }}>
                        {toxicLevel}
                    </h2>

                    {/* AI Insight */}
                    <div style={{
                        background: currentTheme.card,
                        padding: '24px 32px',
                        borderRadius: '20px',
                        marginTop: '30px',
                        maxWidth: '750px',
                        backdropFilter: 'blur(20px)',
                        border: `2px solid ${currentTheme.primary}20`
                    }}>
                        <p style={{
                            fontSize: '18px',
                            color: currentTheme.textLight,
                            textAlign: 'center',
                            lineHeight: '1.6',
                            margin: '0 0 12px 0',
                            fontWeight: '600'
                        }}>
                            💡 Menurut AI
                        </p>
                        <p style={{
                            fontSize: '17px',
                            color: currentTheme.textLight,
                            textAlign: 'center',
                            lineHeight: '1.6',
                            margin: '0'
                        }}>
                            "{insight}"
                        </p>
                    </div>

                    {/* Evidence Examples */}
                    <div style={{
                        marginTop: '35px',
                        width: '100%',
                        maxWidth: '750px'
                    }}>
                        {data.toxicExamples?.slice(0, 3).map((example, i) => (
                            <div key={i} style={{
                                background: currentTheme.card,
                                padding: '16px 20px',
                                borderRadius: '14px',
                                marginBottom: '10px',
                                backdropFilter: 'blur(20px)',
                                borderLeft: `3px solid ${currentTheme.primary}`
                            }}>
                                <p style={{
                                    fontSize: '15px',
                                    color: currentTheme.text,
                                    margin: '0 0 8px 0',
                                    lineHeight: '1.5'
                                }}>
                                    "{example.text}"
                                </p>
                                <span style={{
                                    fontSize: '12px',
                                    color: currentTheme.textLight,
                                    fontWeight: '600'
                                }}>
                                    {example.time}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 90px 100px',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '20px 40px',
                        background: currentTheme.card,
                        borderRadius: '100px',
                        backdropFilter: 'blur(20px)'
                    }}>
                        <Sparkles size={24} color={currentTheme.primary} />
                        <span style={{
                            fontSize: '22px',
                            fontWeight: '700',
                            color: currentTheme.text
                        }}>
                            RecapChat.App
                        </span>
                        <span style={{
                            fontSize: '13px',
                            color: currentTheme.textLight,
                            marginLeft: '8px',
                            fontWeight: '600'
                        }}>
                            ✓ AI Verified
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    // ============================================================================
    // 2. REPLY SPEED TEMPLATE
    // ============================================================================
    const renderReplySpeedTemplate = () => {
        const name1 = privacyMode?.hideNames ? '***' : (data.participant1 || 'Elfan');
        const name2 = privacyMode?.hideNames ? '***' : (data.participant2 || 'Savira');
        const relationship = data.relationshipType || 'Sahabat';
        const insight = data.replyInsight || 'Yang satu langsung bales, yang satu mikir dulu biar gak salah jawab 😭';

        return (
            <div style={containerStyle}>
                <div style={{
                    position: 'absolute',
                    top: '-100px',
                    right: '-100px',
                    width: '500px',
                    height: '500px',
                    borderRadius: '50%',
                    background: currentTheme.accent,
                    opacity: 0.1,
                    filter: 'blur(100px)',
                    zIndex: 0
                }} />

                {/* Header */}
                <div style={{
                    height: '280px',
                    padding: '100px 90px 0',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{ marginBottom: '12px' }}>
                        <span style={{
                            fontSize: '36px',
                            fontWeight: '900',
                            color: currentTheme.text,
                            letterSpacing: '-1px'
                        }}>
                            {name1} vs {name2}
                        </span>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                        <span style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: currentTheme.textLight,
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>
                            {relationship}
                        </span>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <span style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: currentTheme.primary,
                            textTransform: 'uppercase',
                            letterSpacing: '2px'
                        }}>
                            Chat Wrapped 2026
                        </span>
                    </div>
                    <h1 style={{
                        fontSize: '60px',
                        fontWeight: '900',
                        color: currentTheme.text,
                        lineHeight: '1.1',
                        margin: '0',
                        letterSpacing: '-2px'
                    }}>
                        Reply Speed<br />Battle
                    </h1>
                </div>

                {/* Content */}
                <div style={{
                    height: '1240px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '0 90px',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{ fontSize: '100px', marginBottom: '40px', lineHeight: '1' }}>
                        ⚡
                    </div>

                    {/* Comparison Cards */}
                    <div style={{
                        display: 'flex',
                        gap: '20px',
                        width: '100%',
                        maxWidth: '800px',
                        marginBottom: '30px'
                    }}>
                        {/* User 1 Card */}
                        <div style={{
                            flex: 1,
                            background: currentTheme.card,
                            padding: '30px 24px',
                            borderRadius: '20px',
                            backdropFilter: 'blur(20px)',
                            border: `3px solid ${currentTheme.primary}`,
                            textAlign: 'center'
                        }}>
                            <div style={{
                                fontSize: '20px',
                                fontWeight: '800',
                                color: currentTheme.text,
                                marginBottom: '20px'
                            }}>
                                {name1}
                            </div>
                            <div style={{
                                fontSize: '48px',
                                fontWeight: '900',
                                background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.accent} 100%)`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                marginBottom: '12px'
                            }}>
                                {data.avgReplyTime1 || '2 min'}
                            </div>
                            <div style={{
                                fontSize: '14px',
                                color: currentTheme.textLight,
                                marginBottom: '16px',
                                fontWeight: '600'
                            }}>
                                Rata-rata balas
                            </div>
                            <div style={{
                                background: currentTheme.primary + '20',
                                padding: '8px 16px',
                                borderRadius: '12px',
                                fontSize: '13px',
                                fontWeight: '700',
                                color: currentTheme.primary,
                                marginBottom: '12px'
                            }}>
                                {data.replyBadge1 || 'Si Ngebut ⚡'}
                            </div>
                            <div style={{
                                fontSize: '12px',
                                color: currentTheme.textLight,
                                marginTop: '12px'
                            }}>
                                Tercepat: {data.fastestReply1 || '15 detik'}
                            </div>
                        </div>

                        {/* User 2 Card */}
                        <div style={{
                            flex: 1,
                            background: currentTheme.card,
                            padding: '30px 24px',
                            borderRadius: '20px',
                            backdropFilter: 'blur(20px)',
                            border: `3px solid ${currentTheme.accent}`,
                            textAlign: 'center'
                        }}>
                            <div style={{
                                fontSize: '20px',
                                fontWeight: '800',
                                color: currentTheme.text,
                                marginBottom: '20px'
                            }}>
                                {name2}
                            </div>
                            <div style={{
                                fontSize: '48px',
                                fontWeight: '900',
                                background: `linear-gradient(135deg, ${currentTheme.accent} 0%, ${currentTheme.primary} 100%)`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                marginBottom: '12px'
                            }}>
                                {data.avgReplyTime2 || '1 jam'}
                            </div>
                            <div style={{
                                fontSize: '14px',
                                color: currentTheme.textLight,
                                marginBottom: '16px',
                                fontWeight: '600'
                            }}>
                                Rata-rata balas
                            </div>
                            <div style={{
                                background: currentTheme.accent + '20',
                                padding: '8px 16px',
                                borderRadius: '12px',
                                fontSize: '13px',
                                fontWeight: '700',
                                color: currentTheme.accent,
                                marginBottom: '12px'
                            }}>
                                {data.replyBadge2 || 'Si Slow Response 🐌'}
                            </div>
                            <div style={{
                                fontSize: '12px',
                                color: currentTheme.textLight,
                                marginTop: '12px'
                            }}>
                                Tercepat: {data.fastestReply2 || '45 detik'}
                            </div>
                        </div>
                    </div>

                    {/* AI Insight */}
                    <div style={{
                        background: currentTheme.card,
                        padding: '24px 32px',
                        borderRadius: '20px',
                        marginTop: '20px',
                        maxWidth: '750px',
                        backdropFilter: 'blur(20px)',
                        border: `2px solid ${currentTheme.primary}20`
                    }}>
                        <p style={{
                            fontSize: '18px',
                            color: currentTheme.textLight,
                            textAlign: 'center',
                            lineHeight: '1.6',
                            margin: '0 0 12px 0',
                            fontWeight: '600'
                        }}>
                            💡 Menurut AI
                        </p>
                        <p style={{
                            fontSize: '17px',
                            color: currentTheme.textLight,
                            textAlign: 'center',
                            lineHeight: '1.6',
                            margin: '0'
                        }}>
                            "{insight}"
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 90px 100px',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '20px 40px',
                        background: currentTheme.card,
                        borderRadius: '100px',
                        backdropFilter: 'blur(20px)'
                    }}>
                        <Sparkles size={24} color={currentTheme.primary} />
                        <span style={{
                            fontSize: '22px',
                            fontWeight: '700',
                            color: currentTheme.text
                        }}>
                            RecapChat.App
                        </span>
                        <span style={{
                            fontSize: '13px',
                            color: currentTheme.textLight,
                            marginLeft: '8px',
                            fontWeight: '600'
                        }}>
                            ✓ AI Verified
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    // ============================================================================
    // 3. GHOSTING DETECTOR TEMPLATE
    // ============================================================================
    const renderGhostingTemplate = () => {
        const name1 = privacyMode?.hideNames ? '***' : (data.participant1 || 'Elfan');
        const name2 = privacyMode?.hideNames ? '***' : (data.participant2 || 'Savira');
        const relationship = data.relationshipType || 'Sahabat';
        const ghostingKing = data.ghostingKing || name1;
        const insight = data.ghostingInsight || 'Dia gak ghosting kok… cuma loadingnya lama.';

        return (
            <div style={containerStyle}>
                <div style={{
                    position: 'absolute',
                    top: '40%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '600px',
                    height: '600px',
                    borderRadius: '50%',
                    background: '#9333EA',
                    opacity: 0.08,
                    filter: 'blur(120px)',
                    zIndex: 0
                }} />

                {/* Header */}
                <div style={{
                    height: '280px',
                    padding: '100px 90px 0',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{ marginBottom: '12px' }}>
                        <span style={{
                            fontSize: '36px',
                            fontWeight: '900',
                            color: currentTheme.text,
                            letterSpacing: '-1px'
                        }}>
                            {name1} × {name2}
                        </span>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                        <span style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: currentTheme.textLight,
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>
                            {relationship}
                        </span>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <span style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: currentTheme.primary,
                            textTransform: 'uppercase',
                            letterSpacing: '2px'
                        }}>
                            Chat Wrapped 2026
                        </span>
                    </div>
                    <h1 style={{
                        fontSize: '60px',
                        fontWeight: '900',
                        color: currentTheme.text,
                        lineHeight: '1.1',
                        margin: '0',
                        letterSpacing: '-2px'
                    }}>
                        Ghosting<br />Detector
                    </h1>
                </div>

                {/* Content */}
                <div style={{
                    height: '1240px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '0 90px',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{ fontSize: '120px', marginBottom: '40px', lineHeight: '1' }}>
                        👻
                    </div>

                    {/* Ghosting King */}
                    <div style={{
                        fontSize: '52px',
                        fontWeight: '900',
                        background: 'linear-gradient(135deg, #9333EA 0%, #C084FC 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '16px',
                        lineHeight: '1',
                        textAlign: 'center'
                    }}>
                        {ghostingKing}
                    </div>

                    <h2 style={{
                        fontSize: '36px',
                        fontWeight: '800',
                        color: currentTheme.text,
                        marginBottom: '30px',
                        margin: '0 0 30px 0',
                        lineHeight: '1.2'
                    }}>
                        Raja Ghosting 👑
                    </h2>

                    {/* Stats Cards */}
                    <div style={{
                        display: 'flex',
                        gap: '16px',
                        marginTop: '20px',
                        width: '100%',
                        maxWidth: '750px',
                        justifyContent: 'center'
                    }}>
                        <div style={{
                            flex: 1,
                            background: currentTheme.card,
                            padding: '20px 24px',
                            borderRadius: '16px',
                            backdropFilter: 'blur(20px)',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                fontSize: '40px',
                                fontWeight: '900',
                                color: currentTheme.primary,
                                marginBottom: '8px'
                            }}>
                                {data.ghostingCount1 || 12}×
                            </div>
                            <div style={{
                                fontSize: '14px',
                                color: currentTheme.textLight,
                                fontWeight: '600',
                                marginBottom: '8px'
                            }}>
                                {name1}
                            </div>
                            <div style={{
                                fontSize: '12px',
                                color: currentTheme.textLight
                            }}>
                                Terlama: {data.longestGhosting1 || '2 hari'}
                            </div>
                        </div>
                        <div style={{
                            flex: 1,
                            background: currentTheme.card,
                            padding: '20px 24px',
                            borderRadius: '16px',
                            backdropFilter: 'blur(20px)',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                fontSize: '40px',
                                fontWeight: '900',
                                color: currentTheme.accent,
                                marginBottom: '8px'
                            }}>
                                {data.ghostingCount2 || 7}×
                            </div>
                            <div style={{
                                fontSize: '14px',
                                color: currentTheme.textLight,
                                fontWeight: '600',
                                marginBottom: '8px'
                            }}>
                                {name2}
                            </div>
                            <div style={{
                                fontSize: '12px',
                                color: currentTheme.textLight
                            }}>
                                Terlama: {data.longestGhosting2 || '1 hari'}
                            </div>
                        </div>
                    </div>

                    {/* Comeback Message */}
                    {data.comebackMessage && (
                        <div style={{
                            background: currentTheme.card,
                            padding: '20px 24px',
                            borderRadius: '16px',
                            marginTop: '30px',
                            maxWidth: '750px',
                            backdropFilter: 'blur(20px)',
                            borderLeft: `3px solid ${currentTheme.primary}`
                        }}>
                            <p style={{
                                fontSize: '13px',
                                color: currentTheme.textLight,
                                margin: '0 0 8px 0',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}>
                                Most Iconic Comeback
                            </p>
                            <p style={{
                                fontSize: '16px',
                                color: currentTheme.text,
                                margin: '0',
                                lineHeight: '1.5'
                            }}>
                                "{data.comebackMessage}"
                            </p>
                        </div>
                    )}

                    {/* AI Insight */}
                    <div style={{
                        background: currentTheme.card,
                        padding: '24px 32px',
                        borderRadius: '20px',
                        marginTop: '30px',
                        maxWidth: '750px',
                        backdropFilter: 'blur(20px)',
                        border: `2px solid ${currentTheme.primary}20`
                    }}>
                        <p style={{
                            fontSize: '18px',
                            color: currentTheme.textLight,
                            textAlign: 'center',
                            lineHeight: '1.6',
                            margin: '0 0 12px 0',
                            fontWeight: '600'
                        }}>
                            💡 Menurut AI
                        </p>
                        <p style={{
                            fontSize: '17px',
                            color: currentTheme.textLight,
                            textAlign: 'center',
                            lineHeight: '1.6',
                            margin: '0'
                        }}>
                            "{insight}"
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 90px 100px',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '20px 40px',
                        background: currentTheme.card,
                        borderRadius: '100px',
                        backdropFilter: 'blur(20px)'
                    }}>
                        <Sparkles size={24} color={currentTheme.primary} />
                        <span style={{
                            fontSize: '22px',
                            fontWeight: '700',
                            color: currentTheme.text
                        }}>
                            RecapChat.App
                        </span>
                        <span style={{
                            fontSize: '13px',
                            color: currentTheme.textLight,
                            marginLeft: '8px',
                            fontWeight: '600'
                        }}>
                            ✓ AI Verified
                        </span>
                    </div>
                </div>
            </div>
        );
    };


    /**
     * 7 REMAINING VIRAL TEMPLATE FUNCTIONS
     * Copy all functions below and paste in StoryTemplateNew.tsx before "return renderTemplate();"
     */

    // ============================================================================
    // 4. TOPIC RANKING TEMPLATE
    // ============================================================================
    const renderTopicRankingTemplate = () => {
        const name1 = privacyMode?.hideNames ? '***' : (data.participant1 || 'Elfan');
        const name2 = privacyMode?.hideNames ? '***' : (data.participant2 || 'Savira');
        const relationship = data.relationshipType || 'Sahabat';
        const insight = data.topicInsight || 'Kalian lebih sering ngomongin makanan daripada rencana masa depan 😅';

        return (
            <div style={{ ...containerStyle, display: 'flex', flexDirection: 'column' }}>
                <div style={{
                    position: 'absolute',
                    top: '30%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '600px',
                    height: '600px',
                    borderRadius: '50%',
                    background: currentTheme.primary,
                    opacity: 0.08,
                    filter: 'blur(120px)',
                    zIndex: 0
                }} />

                {/* Header */}
                <div style={{
                    padding: '100px 90px 40px',
                    position: 'relative',
                    zIndex: 1,
                    flexShrink: 0
                }}>
                    <div style={{ marginBottom: '16px' }}>
                        <span style={{
                            fontSize: '48px', // Increased
                            fontWeight: '900',
                            color: currentTheme.text,
                            letterSpacing: '-1.5px',
                            lineHeight: '1.2'
                        }}>
                            {name1} × {name2}
                        </span>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                        <span style={{
                            fontSize: '20px', // Increased
                            fontWeight: '700',
                            color: currentTheme.textLight,
                            textTransform: 'uppercase',
                            letterSpacing: '2px'
                        }}>
                            {relationship}
                        </span>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <span style={{
                            fontSize: '24px', // Increased
                            fontWeight: '700',
                            color: currentTheme.primary,
                            textTransform: 'uppercase',
                            letterSpacing: '3px'
                        }}>
                            Chat Wrapped 2026
                        </span>
                    </div>
                    <h1 style={{
                        fontSize: '90px', // Increased
                        fontWeight: '900',
                        color: currentTheme.text,
                        lineHeight: '1.05',
                        margin: '0',
                        letterSpacing: '-3px'
                    }}>
                        Topic<br />Ranking
                    </h1>
                </div>

                {/* Content */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '0 90px',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{ fontSize: '140px', marginBottom: '50px', lineHeight: '1' }}>
                        📊
                    </div>

                    {/* Top 5 Topics */}
                    <div style={{
                        width: '100%',
                        maxWidth: '900px', // Increased width
                        marginBottom: '40px'
                    }}>
                        {data.topTopics?.slice(0, 5).map((topic, i) => (
                            <div key={i} style={{
                                background: currentTheme.card,
                                padding: '28px 32px', // Increased padding
                                borderRadius: '24px',
                                marginBottom: '16px',
                                backdropFilter: 'blur(20px)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '24px', // Increased gap
                                border: i === 0 ? `4px solid ${currentTheme.primary}` : 'none'
                            }}>
                                <div style={{
                                    fontSize: '40px', // Increased
                                    fontWeight: '900',
                                    color: currentTheme.primary,
                                    minWidth: '50px'
                                }}>
                                    #{i + 1}
                                </div>
                                <div style={{
                                    fontSize: '56px', // Increased
                                    lineHeight: '1'
                                }}>
                                    {topic.emoji}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        fontSize: '28px', // Increased
                                        fontWeight: '800',
                                        color: currentTheme.text,
                                        marginBottom: '6px'
                                    }}>
                                        {topic.topic}
                                    </div>
                                    <div style={{
                                        fontSize: '20px', // Increased
                                        color: currentTheme.textLight,
                                        fontWeight: '600'
                                    }}>
                                        {topic.count} pesan
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* AI Insight */}
                    <div style={{
                        background: currentTheme.card,
                        padding: '36px 48px', // Increased
                        borderRadius: '28px',
                        marginTop: '20px',
                        maxWidth: '850px',
                        backdropFilter: 'blur(20px)',
                        border: `3px solid ${currentTheme.primary}20`
                    }}>
                        <p style={{
                            fontSize: '24px', // Increased
                            color: currentTheme.textLight,
                            textAlign: 'center',
                            lineHeight: '1.6',
                            margin: '0 0 16px 0',
                            fontWeight: '700'
                        }}>
                            💡 Menurut AI
                        </p>
                        <p style={{
                            fontSize: '24px', // Increased
                            color: currentTheme.textLight,
                            textAlign: 'center',
                            lineHeight: '1.5',
                            margin: '0',
                            fontWeight: '500'
                        }}>
                            "{insight}"
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    height: '200px',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 90px 100px',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '20px 40px',
                        background: currentTheme.card,
                        borderRadius: '100px',
                        backdropFilter: 'blur(20px)'
                    }}>
                        <Sparkles size={24} color={currentTheme.primary} />
                        <span style={{
                            fontSize: '22px',
                            fontWeight: '700',
                            color: currentTheme.text
                        }}>
                            RecapChat.App
                        </span>
                        <span style={{
                            fontSize: '13px',
                            color: currentTheme.textLight,
                            marginLeft: '8px',
                            fontWeight: '600'
                        }}>
                            ✓ AI Verified
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    // ============================================================================
    // 5. QUOTE OF THE YEAR TEMPLATE
    // ============================================================================
    const renderQuoteYearTemplate = () => {
        const name1 = privacyMode?.hideNames ? '***' : (data.participant1 || 'Elfan');
        const name2 = privacyMode?.hideNames ? '***' : (data.participant2 || 'Savira');
        const relationship = data.relationshipType || 'Sahabat';
        const quote = privacyMode?.safeQuote ? '***' : (data.bestQuote || 'Gapapa salah, yang penting bareng');
        const author = privacyMode?.hideNames ? '***' : (data.quoteAuthor || name1);

        return (
            <div style={{ ...containerStyle, display: 'flex', flexDirection: 'column' }}>
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '700px',
                    height: '700px',
                    borderRadius: '50%',
                    background: '#FFD700',
                    opacity: 0.08,
                    filter: 'blur(120px)',
                    zIndex: 0
                }} />

                {/* Header */}
                <div style={{
                    padding: '100px 90px 40px',
                    position: 'relative',
                    zIndex: 1,
                    flexShrink: 0
                }}>
                    <div style={{ marginBottom: '16px' }}>
                        <span style={{
                            fontSize: '48px', // Increased
                            fontWeight: '900',
                            color: currentTheme.text,
                            letterSpacing: '-1.5px',
                            lineHeight: '1.2'
                        }}>
                            {name1} × {name2}
                        </span>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                        <span style={{
                            fontSize: '20px', // Increased
                            fontWeight: '700',
                            color: currentTheme.textLight,
                            textTransform: 'uppercase',
                            letterSpacing: '2px'
                        }}>
                            {relationship}
                        </span>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <span style={{
                            fontSize: '24px', // Increased
                            fontWeight: '700',
                            color: currentTheme.primary,
                            textTransform: 'uppercase',
                            letterSpacing: '3px'
                        }}>
                            Chat Wrapped 2026
                        </span>
                    </div>
                    <h1 style={{
                        fontSize: '90px', // Increased
                        fontWeight: '900',
                        color: currentTheme.text,
                        lineHeight: '1.05',
                        margin: '0',
                        letterSpacing: '-3px'
                    }}>
                        Quote of<br />the Year
                    </h1>
                </div>

                {/* Content */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '0 90px',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{ fontSize: '140px', marginBottom: '50px', lineHeight: '1' }}>
                        💬
                    </div>

                    {/* Main Quote */}
                    <div style={{
                        background: currentTheme.card,
                        padding: '60px 48px', // Increased
                        borderRadius: '32px',
                        maxWidth: '900px', // Increased
                        backdropFilter: 'blur(20px)',
                        border: `4px solid ${currentTheme.primary}`,
                        position: 'relative',
                        marginBottom: '40px'
                    }}>
                        <div style={{
                            fontSize: '120px', // Increased
                            color: currentTheme.primary,
                            position: 'absolute',
                            top: '20px',
                            left: '30px',
                            opacity: 0.3,
                            lineHeight: '1'
                        }}>
                            "
                        </div>
                        <p style={{
                            fontSize: '48px', // Increased HUGE
                            fontWeight: '800',
                            color: currentTheme.text,
                            textAlign: 'center',
                            lineHeight: '1.3',
                            margin: '0 0 32px 0',
                            position: 'relative',
                            zIndex: 1
                        }}>
                            {quote}
                        </p>
                        <div style={{
                            textAlign: 'center',
                            fontSize: '32px', // Increased
                            color: currentTheme.textLight,
                            fontWeight: '700'
                        }}>
                            — {author}
                        </div>
                        {data.quoteDate && (
                            <div style={{
                                textAlign: 'center',
                                fontSize: '20px', // Increased
                                color: currentTheme.textLight,
                                marginTop: '12px'
                            }}>
                                {data.quoteDate}
                            </div>
                        )}
                    </div>

                    {/* Context */}
                    {data.quoteContext && (
                        <div style={{
                            background: currentTheme.card,
                            padding: '24px 32px',
                            borderRadius: '24px',
                            maxWidth: '850px',
                            backdropFilter: 'blur(20px)',
                            marginBottom: '24px'
                        }}>
                            <p style={{
                                fontSize: '20px', // Increased
                                color: currentTheme.textLight,
                                textAlign: 'center',
                                margin: '0',
                                fontWeight: '600'
                            }}>
                                📍 {data.quoteContext}
                            </p>
                        </div>
                    )}

                    {/* Runner Ups */}
                    {data.runnerUpQuotes && data.runnerUpQuotes.length > 0 && (
                        <div style={{
                            width: '100%',
                            maxWidth: '900px',
                            marginTop: '20px'
                        }}>
                            <p style={{
                                fontSize: '24px', // Increased
                                color: currentTheme.textLight,
                                textAlign: 'center',
                                marginBottom: '16px',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}>
                                Runner Ups
                            </p>
                            {data.runnerUpQuotes.slice(0, 2).map((quote, i) => (
                                <div key={i} style={{
                                    background: currentTheme.card,
                                    padding: '24px 32px',
                                    borderRadius: '20px',
                                    marginBottom: '12px',
                                    backdropFilter: 'blur(20px)'
                                }}>
                                    <p style={{
                                        fontSize: '24px', // Increased
                                        color: currentTheme.text,
                                        margin: '0 0 8px 0',
                                        lineHeight: '1.4'
                                    }}>
                                        "{quote.text}"
                                    </p>
                                    <span style={{
                                        fontSize: '18px', // Increased
                                        color: currentTheme.textLight,
                                        fontWeight: '600'
                                    }}>
                                        — {privacyMode?.hideNames ? '***' : quote.author}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 90px 100px',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '20px 40px',
                        background: currentTheme.card,
                        borderRadius: '100px',
                        backdropFilter: 'blur(20px)'
                    }}>
                        <Sparkles size={24} color={currentTheme.primary} />
                        <span style={{
                            fontSize: '22px',
                            fontWeight: '700',
                            color: currentTheme.text
                        }}>
                            RecapChat.App
                        </span>
                        <span style={{
                            fontSize: '13px',
                            color: currentTheme.textLight,
                            marginLeft: '8px',
                            fontWeight: '600'
                        }}>
                            ✓ AI Verified
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    // File ini terlalu panjang, akan dilanjutkan di file berikutnya...

    // ============================================================================
    // 6. CARE METER TEMPLATE
    // ============================================================================
    const renderCareMeterTemplate = () => {
        const name1 = privacyMode?.hideNames ? '***' : (data.participant1 || 'Elfan');
        const name2 = privacyMode?.hideNames ? '***' : (data.participant2 || 'Savira');
        const relationship = data.relationshipType || 'Sahabat';
        const insight = data.careInsight || 'Kalian saling perhatian, tapi yang satu lebih ekspresif ❤️';

        return (
            <div style={containerStyle}>
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '700px',
                    height: '700px',
                    borderRadius: '50%',
                    background: '#FF69B4',
                    opacity: 0.08,
                    filter: 'blur(120px)',
                    zIndex: 0
                }} />

                {/* Header */}
                <div style={{
                    height: '280px',
                    padding: '100px 90px 0',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{ marginBottom: '12px' }}>
                        <span style={{
                            fontSize: '36px',
                            fontWeight: '900',
                            color: currentTheme.text,
                            letterSpacing: '-1px'
                        }}>
                            {name1} vs {name2}
                        </span>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                        <span style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: currentTheme.textLight,
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>
                            {relationship}
                        </span>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <span style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: currentTheme.primary,
                            textTransform: 'uppercase',
                            letterSpacing: '2px'
                        }}>
                            Chat Wrapped 2026
                        </span>
                    </div>
                    <h1 style={{
                        fontSize: '60px',
                        fontWeight: '900',
                        color: currentTheme.text,
                        lineHeight: '1.1',
                        margin: '0',
                        letterSpacing: '-2px'
                    }}>
                        Care<br />Meter
                    </h1>
                </div>

                {/* Content */}
                <div style={{
                    height: '1240px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '0 90px',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{ fontSize: '100px', marginBottom: '40px', lineHeight: '1' }}>
                        ❤️
                    </div>

                    {/* Meter Comparison */}
                    <div style={{
                        display: 'flex',
                        gap: '20px',
                        width: '100%',
                        maxWidth: '800px',
                        marginBottom: '30px'
                    }}>
                        {/* User 1 */}
                        <div style={{
                            flex: 1,
                            background: currentTheme.card,
                            padding: '24px',
                            borderRadius: '20px',
                            backdropFilter: 'blur(20px)',
                            border: `3px solid ${currentTheme.primary}`,
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '20px', fontWeight: '800', marginBottom: '16px' }}>{name1}</div>
                            <div style={{
                                fontSize: '48px',
                                fontWeight: '900',
                                color: currentTheme.primary,
                                marginBottom: '8px'
                            }}>
                                {data.careScore1 || 78}%
                            </div>
                            <div style={{ fontSize: '12px', color: currentTheme.textLight, marginBottom: '16px' }}>Perhatian Score</div>

                            {/* Examples */}
                            <div style={{ textAlign: 'left' }}>
                                {data.careExamples1?.slice(0, 2).map((ex, i) => (
                                    <div key={i} style={{
                                        fontSize: '13px',
                                        marginBottom: '8px',
                                        padding: '8px',
                                        background: 'rgba(255,255,255,0.5)',
                                        borderRadius: '8px'
                                    }}>
                                        "{ex.text}"
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* User 2 */}
                        <div style={{
                            flex: 1,
                            background: currentTheme.card,
                            padding: '24px',
                            borderRadius: '20px',
                            backdropFilter: 'blur(20px)',
                            border: `3px solid ${currentTheme.accent}`,
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '20px', fontWeight: '800', marginBottom: '16px' }}>{name2}</div>
                            <div style={{
                                fontSize: '48px',
                                fontWeight: '900',
                                color: currentTheme.accent,
                                marginBottom: '8px'
                            }}>
                                {data.careScore2 || 92}%
                            </div>
                            <div style={{ fontSize: '12px', color: currentTheme.textLight, marginBottom: '16px' }}>Perhatian Score</div>

                            {/* Examples */}
                            <div style={{ textAlign: 'left' }}>
                                {data.careExamples2?.slice(0, 2).map((ex, i) => (
                                    <div key={i} style={{
                                        fontSize: '13px',
                                        marginBottom: '8px',
                                        padding: '8px',
                                        background: 'rgba(255,255,255,0.5)',
                                        borderRadius: '8px'
                                    }}>
                                        "{ex.text}"
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Winner */}
                    <div style={{
                        fontSize: '24px',
                        fontWeight: '800',
                        color: currentTheme.text,
                        marginBottom: '30px',
                        textAlign: 'center'
                    }}>
                        Paling Perhatian: <span style={{ color: currentTheme.primary }}>{data.careWinner || name2}</span> 🏆
                    </div>

                    {/* AI Insight */}
                    <div style={{
                        background: currentTheme.card,
                        padding: '24px 32px',
                        borderRadius: '20px',
                        marginTop: '20px',
                        maxWidth: '750px',
                        backdropFilter: 'blur(20px)',
                        border: `2px solid ${currentTheme.primary}20`
                    }}>
                        <p style={{
                            fontSize: '18px',
                            color: currentTheme.textLight,
                            textAlign: 'center',
                            lineHeight: '1.6',
                            margin: '0 0 12px 0',
                            fontWeight: '600'
                        }}>
                            💡 Menurut AI
                        </p>
                        <p style={{
                            fontSize: '17px',
                            color: currentTheme.textLight,
                            textAlign: 'center',
                            lineHeight: '1.6',
                            margin: '0'
                        }}>
                            "{insight}"
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 90px 100px',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '20px 40px',
                        background: currentTheme.card,
                        borderRadius: '100px',
                        backdropFilter: 'blur(20px)'
                    }}>
                        <Sparkles size={24} color={currentTheme.primary} />
                        <span style={{
                            fontSize: '22px',
                            fontWeight: '700',
                            color: currentTheme.text
                        }}>
                            RecapChat.App
                        </span>
                        <span style={{
                            fontSize: '13px',
                            color: currentTheme.textLight,
                            marginLeft: '8px',
                            fontWeight: '600'
                        }}>
                            ✓ AI Verified
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    // ============================================================================
    // 7. OVERTHINKING DETECTOR TEMPLATE
    // ============================================================================
    const renderOverthinkingTemplate = () => {
        const name1 = privacyMode?.hideNames ? '***' : (data.participant1 || 'Elfan');
        const name2 = privacyMode?.hideNames ? '***' : (data.participant2 || 'Savira');
        const relationship = data.relationshipType || 'Sahabat';
        const king = data.overthinkingKing || name2;
        const insight = data.overthinkingInsight || 'Kadang "oke" ya cuma oke, gak ada maksud lain 😅';

        return (
            <div style={containerStyle}>
                <div style={{
                    position: 'absolute',
                    top: '40%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '600px',
                    height: '600px',
                    borderRadius: '50%',
                    background: '#8A2BE2',
                    opacity: 0.08,
                    filter: 'blur(120px)',
                    zIndex: 0
                }} />

                {/* Header */}
                <div style={{
                    height: '280px',
                    padding: '100px 90px 0',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{ marginBottom: '12px' }}>
                        <span style={{
                            fontSize: '36px',
                            fontWeight: '900',
                            color: currentTheme.text,
                            letterSpacing: '-1px'
                        }}>
                            {name1} × {name2}
                        </span>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                        <span style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: currentTheme.textLight,
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>
                            {relationship}
                        </span>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <span style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: currentTheme.primary,
                            textTransform: 'uppercase',
                            letterSpacing: '2px'
                        }}>
                            Chat Wrapped 2026
                        </span>
                    </div>
                    <h1 style={{
                        fontSize: '60px',
                        fontWeight: '900',
                        color: currentTheme.text,
                        lineHeight: '1.1',
                        margin: '0',
                        letterSpacing: '-2px'
                    }}>
                        Overthinking<br />Detector
                    </h1>
                </div>

                {/* Content */}
                <div style={{
                    height: '1240px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '0 90px',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{ fontSize: '100px', marginBottom: '30px', lineHeight: '1' }}>
                        🤔
                    </div>

                    <div style={{
                        fontSize: '18px',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        color: currentTheme.textLight,
                        marginBottom: '10px'
                    }}>
                        THE OVERTHINKER IS
                    </div>

                    <div style={{
                        fontSize: '64px',
                        fontWeight: '900',
                        background: 'linear-gradient(135deg, #8A2BE2 0%, #FF69B4 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '40px'
                    }}>
                        {king}
                    </div>

                    {/* Scores */}
                    <div style={{
                        display: 'flex',
                        width: '100%',
                        maxWidth: '600px',
                        marginBottom: '40px',
                        gap: '20px'
                    }}>
                        <div style={{ flex: 1, textAlign: 'center' }}>
                            <div style={{ fontSize: '16px', fontWeight: '700' }}>{name1}</div>
                            <div style={{ fontSize: '32px', fontWeight: '900', color: currentTheme.primary }}>{data.overthinkingScore1}%</div>
                        </div>
                        <div style={{ flex: 1, textAlign: 'center' }}>
                            <div style={{ fontSize: '16px', fontWeight: '700' }}>{name2}</div>
                            <div style={{ fontSize: '32px', fontWeight: '900', color: currentTheme.accent }}>{data.overthinkingScore2}%</div>
                        </div>
                    </div>

                    {/* Evidence List */}
                    <div style={{
                        width: '100%',
                        maxWidth: '750px'
                    }}>
                        <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px', color: currentTheme.textLight }}>BUKTI OVERTHINKING:</div>
                        {data.overthinkingExamples?.slice(0, 3).map((ex, i) => (
                            <div key={i} style={{
                                background: currentTheme.card,
                                padding: '16px 20px',
                                borderRadius: '14px',
                                marginBottom: '10px',
                                backdropFilter: 'blur(20px)',
                                borderLeft: `3px solid ${currentTheme.primary}`
                            }}>
                                <p style={{
                                    fontSize: '16px',
                                    color: currentTheme.text,
                                    margin: '0 0 6px 0',
                                    lineHeight: '1.4',
                                    fontStyle: 'italic'
                                }}>
                                    "{ex.text}"
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* AI Insight */}
                    <div style={{
                        background: currentTheme.card,
                        padding: '24px 32px',
                        borderRadius: '20px',
                        marginTop: '30px',
                        maxWidth: '750px',
                        backdropFilter: 'blur(20px)',
                        border: `2px solid ${currentTheme.primary}20`
                    }}>
                        <p style={{
                            fontSize: '18px',
                            color: currentTheme.textLight,
                            textAlign: 'center',
                            lineHeight: '1.6',
                            margin: '0 0 12px 0',
                            fontWeight: '600'
                        }}>
                            💡 Menurut AI
                        </p>
                        <p style={{
                            fontSize: '17px',
                            color: currentTheme.textLight,
                            textAlign: 'center',
                            lineHeight: '1.6',
                            margin: '0'
                        }}>
                            "{insight}"
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 90px 100px',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '20px 40px',
                        background: currentTheme.card,
                        borderRadius: '100px',
                        backdropFilter: 'blur(20px)'
                    }}>
                        <Sparkles size={24} color={currentTheme.primary} />
                        <span style={{
                            fontSize: '22px',
                            fontWeight: '700',
                            color: currentTheme.text
                        }}>
                            RecapChat.App
                        </span>
                        <span style={{
                            fontSize: '13px',
                            color: currentTheme.textLight,
                            marginLeft: '8px',
                            fontWeight: '600'
                        }}>
                            ✓ AI Verified
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    // ============================================================================
    // 8. TYPING STYLE TEMPLATE
    // ============================================================================
    const renderTypingStyleTemplate = () => {
        const name1 = privacyMode?.hideNames ? '***' : (data.participant1 || 'Elfan');
        const name2 = privacyMode?.hideNames ? '***' : (data.participant2 || 'Savira');
        const relationship = data.relationshipType || 'Sahabat';
        const insight = data.styleInsight || 'Yang satu to the point, yang satu suka cerita panjang 😄';

        return (
            <div style={containerStyle}>
                {/* Background elements */}
                <div style={{
                    position: 'absolute',
                    top: '20%',
                    left: '20%',
                    width: '400px',
                    height: '400px',
                    borderRadius: '50%',
                    background: currentTheme.primary,
                    opacity: 0.05,
                    filter: 'blur(100px)',
                    zIndex: 0
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '20%',
                    right: '20%',
                    width: '400px',
                    height: '400px',
                    borderRadius: '50%',
                    background: currentTheme.accent,
                    opacity: 0.05,
                    filter: 'blur(100px)',
                    zIndex: 0
                }} />

                {/* Header */}
                <div style={{
                    height: '280px',
                    padding: '100px 90px 0',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{ marginBottom: '12px' }}>
                        <span style={{
                            fontSize: '36px',
                            fontWeight: '900',
                            color: currentTheme.text,
                            letterSpacing: '-1px'
                        }}>
                            {name1} vs {name2}
                        </span>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                        <span style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: currentTheme.textLight,
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>
                            {relationship}
                        </span>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <span style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: currentTheme.primary,
                            textTransform: 'uppercase',
                            letterSpacing: '2px'
                        }}>
                            Chat Wrapped 2026
                        </span>
                    </div>
                    <h1 style={{
                        fontSize: '60px',
                        fontWeight: '900',
                        color: currentTheme.text,
                        lineHeight: '1.1',
                        margin: '0',
                        letterSpacing: '-2px'
                    }}>
                        Typing<br />Style
                    </h1>
                </div>

                {/* Content */}
                <div style={{
                    height: '1240px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '0 90px',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{ fontSize: '100px', marginBottom: '40px', lineHeight: '1' }}>
                        ⌨️
                    </div>

                    {/* Style Comparison */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        maxWidth: '800px',
                        gap: '24px'
                    }}>
                        {/* User 1 */}
                        <div style={{
                            background: currentTheme.card,
                            padding: '24px 32px',
                            borderRadius: '20px',
                            backdropFilter: 'blur(20px)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '24px',
                            borderLeft: `5px solid ${currentTheme.primary}`
                        }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', color: currentTheme.text }}>{name1}</div>
                                <div style={{ fontSize: '16px', color: currentTheme.textLight, marginBottom: '4px' }}>Style:</div>
                                <div style={{ fontSize: '20px', fontWeight: '700', color: currentTheme.primary }}>{data.typingStyle1}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '32px', fontWeight: '900', color: currentTheme.text }}>{data.avgMessageLength1}</div>
                                <div style={{ fontSize: '12px', color: currentTheme.textLight }}>words/msg</div>
                            </div>
                        </div>

                        {/* User 2 */}
                        <div style={{
                            background: currentTheme.card,
                            padding: '24px 32px',
                            borderRadius: '20px',
                            backdropFilter: 'blur(20px)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '24px',
                            borderLeft: `5px solid ${currentTheme.accent}`
                        }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', color: currentTheme.text }}>{name2}</div>
                                <div style={{ fontSize: '16px', color: currentTheme.textLight, marginBottom: '4px' }}>Style:</div>
                                <div style={{ fontSize: '20px', fontWeight: '700', color: currentTheme.accent }}>{data.typingStyle2}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '32px', fontWeight: '900', color: currentTheme.text }}>{data.avgMessageLength2}</div>
                                <div style={{ fontSize: '12px', color: currentTheme.textLight }}>words/msg</div>
                            </div>
                        </div>
                    </div>

                    {/* Speed Comparison */}
                    <div style={{
                        display: 'flex',
                        width: '100%',
                        maxWidth: '800px',
                        marginTop: '30px',
                        gap: '20px'
                    }}>
                        <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
                            <div style={{ fontSize: '14px', marginBottom: '4px' }}>Speed {name1}</div>
                            <div style={{ fontSize: '20px', fontWeight: '800' }}>{data.typingSpeed1 || '⚡ Cepat'}</div>
                        </div>
                        <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
                            <div style={{ fontSize: '14px', marginBottom: '4px' }}>Speed {name2}</div>
                            <div style={{ fontSize: '20px', fontWeight: '800' }}>{data.typingSpeed2 || '🚶 Santai'}</div>
                        </div>
                    </div>

                    {/* AI Insight */}
                    <div style={{
                        background: currentTheme.card,
                        padding: '24px 32px',
                        borderRadius: '20px',
                        marginTop: '40px',
                        maxWidth: '750px',
                        backdropFilter: 'blur(20px)',
                        border: `2px solid ${currentTheme.primary}20`
                    }}>
                        <p style={{
                            fontSize: '18px',
                            color: currentTheme.textLight,
                            textAlign: 'center',
                            lineHeight: '1.6',
                            margin: '0 0 12px 0',
                            fontWeight: '600'
                        }}>
                            💡 Menurut AI
                        </p>
                        <p style={{
                            fontSize: '17px',
                            color: currentTheme.textLight,
                            textAlign: 'center',
                            lineHeight: '1.6',
                            margin: '0'
                        }}>
                            "{insight}"
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 90px 100px',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '20px 40px',
                        background: currentTheme.card,
                        borderRadius: '100px',
                        backdropFilter: 'blur(20px)'
                    }}>
                        <Sparkles size={24} color={currentTheme.primary} />
                        <span style={{
                            fontSize: '22px',
                            fontWeight: '700',
                            color: currentTheme.text
                        }}>
                            RecapChat.App
                        </span>
                        <span style={{
                            fontSize: '13px',
                            color: currentTheme.textLight,
                            marginLeft: '8px',
                            fontWeight: '600'
                        }}>
                            ✓ AI Verified
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    // ============================================================================
    // 9. EMOJI PERSONALITY TEMPLATE
    // ============================================================================
    const renderEmojiPersonalityTemplate = () => {
        const name1 = privacyMode?.hideNames ? '***' : (data.participant1 || 'Elfan');
        const name2 = privacyMode?.hideNames ? '***' : (data.participant2 || 'Savira');
        const relationship = data.relationshipType || 'Sahabat';
        const insight = data.emojiInsight || 'Emoji kalian cerminan kepribadian: satu lucu, satu penuh cinta 💕';

        return (
            <div style={{ ...containerStyle, display: 'flex', flexDirection: 'column' }}>
                {/* Background elements */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '700px',
                    height: '700px',
                    borderRadius: '50%',
                    background: '#FFD700',
                    opacity: 0.1,
                    filter: 'blur(120px)',
                    zIndex: 0
                }} />

                {/* Header */}
                <div style={{
                    padding: '100px 90px 40px',
                    position: 'relative',
                    zIndex: 1,
                    flexShrink: 0
                }}>
                    <div style={{ marginBottom: '16px' }}>
                        <span style={{
                            fontSize: '48px', // Was 36px
                            fontWeight: '900',
                            color: currentTheme.text,
                            letterSpacing: '-1.5px',
                            lineHeight: '1.2'
                        }}>
                            {name1} × {name2}
                        </span>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                        <span style={{
                            fontSize: '20px', // Was 14px
                            fontWeight: '700',
                            color: currentTheme.textLight,
                            textTransform: 'uppercase',
                            letterSpacing: '2px'
                        }}>
                            {relationship}
                        </span>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <span style={{
                            fontSize: '24px', // Was 16px
                            fontWeight: '700',
                            color: currentTheme.primary,
                            textTransform: 'uppercase',
                            letterSpacing: '3px'
                        }}>
                            Chat Wrapped 2026
                        </span>
                    </div>
                    <h1 style={{
                        fontSize: '90px', // Was 60px
                        fontWeight: '900',
                        color: currentTheme.text,
                        lineHeight: '1.05',
                        margin: '0',
                        letterSpacing: '-3px'
                    }}>
                        Emoji<br />Personality
                    </h1>
                </div>

                {/* Content */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '0 90px',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{ fontSize: '140px', marginBottom: '50px', lineHeight: '1' }}> {/* Was 100px */}
                        😊
                    </div>

                    {/* Cards */}
                    <div style={{
                        display: 'flex',
                        gap: '32px', // Increased gap
                        width: '100%',
                        marginBottom: '50px'
                    }}>
                        {/* User 1 */}
                        <div style={{
                            flex: 1,
                            background: currentTheme.card,
                            padding: '40px 30px', // Increased padding
                            borderRadius: '32px',
                            backdropFilter: 'blur(20px)',
                            textAlign: 'center',
                            borderTop: `8px solid ${currentTheme.primary}`
                        }}>
                            <div style={{ fontSize: '32px', fontWeight: '900', marginBottom: '24px', color: currentTheme.text }}>{name1}</div> {/* Was 20px */}
                            <div style={{ fontSize: '110px', marginBottom: '20px', lineHeight: 1 }}>{data.topEmoji1}</div> {/* Was 80px */}
                            <div style={{
                                fontSize: '32px', // Was 24px
                                fontWeight: '900',
                                color: currentTheme.primary,
                                marginBottom: '12px',
                                lineHeight: '1.2'
                            }}>
                                {data.personality1}
                            </div>
                            <div style={{ fontSize: '20px', color: currentTheme.textLight, fontWeight: '500' }}> {/* Was 14px */}
                                Frequency: {data.emojiCount1}x
                            </div>
                        </div>

                        {/* User 2 */}
                        <div style={{
                            flex: 1,
                            background: currentTheme.card,
                            padding: '40px 30px',
                            borderRadius: '32px',
                            backdropFilter: 'blur(20px)',
                            textAlign: 'center',
                            borderTop: `8px solid ${currentTheme.accent}`
                        }}>
                            <div style={{ fontSize: '32px', fontWeight: '900', marginBottom: '24px', color: currentTheme.text }}>{name2}</div>
                            <div style={{ fontSize: '110px', marginBottom: '20px', lineHeight: 1 }}>{data.topEmoji2}</div>
                            <div style={{
                                fontSize: '32px',
                                fontWeight: '900',
                                color: currentTheme.accent,
                                marginBottom: '12px',
                                lineHeight: '1.2'
                            }}>
                                {data.personality2}
                            </div>
                            <div style={{ fontSize: '20px', color: currentTheme.textLight, fontWeight: '500' }}>
                                Frequency: {data.emojiCount2}x
                            </div>
                        </div>
                    </div>

                    {/* AI Insight */}
                    <div style={{
                        background: currentTheme.card,
                        padding: '36px 48px', // Increased
                        borderRadius: '28px',
                        marginTop: '20px',
                        maxWidth: '850px',
                        backdropFilter: 'blur(20px)',
                        border: `3px solid ${currentTheme.primary}20`
                    }}>
                        <p style={{
                            fontSize: '24px', // Was 18px
                            color: currentTheme.textLight,
                            textAlign: 'center',
                            lineHeight: '1.6',
                            margin: '0 0 16px 0',
                            fontWeight: '700'
                        }}>
                            💡 Menurut AI
                        </p>
                        <p style={{
                            fontSize: '24px', // Was 17px
                            color: currentTheme.textLight,
                            textAlign: 'center',
                            lineHeight: '1.5',
                            margin: '0',
                            fontWeight: '500'
                        }}>
                            "{insight}"
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    height: '200px',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 90px 100px',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '20px 40px',
                        background: currentTheme.card,
                        borderRadius: '100px',
                        backdropFilter: 'blur(20px)'
                    }}>
                        <Sparkles size={24} color={currentTheme.primary} />
                        <span style={{
                            fontSize: '22px',
                            fontWeight: '700',
                            color: currentTheme.text
                        }}>
                            RecapChat.App
                        </span>
                        <span style={{
                            fontSize: '13px',
                            color: currentTheme.textLight,
                            marginLeft: '8px',
                            fontWeight: '600'
                        }}>
                            ✓ AI Verified
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    // ============================================================================
    // 10. AI PREDICTION TEMPLATE
    // ============================================================================
    const renderAIPredictionTemplate = () => {
        const name1 = privacyMode?.hideNames ? '***' : (data.participant1 || 'Elfan');
        const name2 = privacyMode?.hideNames ? '***' : (data.participant2 || 'Savira');
        const relationship = data.relationshipType || 'Sahabat';
        const insight = data.prediction2026 || 'Hubungan kalian bakal makin kuat. Ada milestone besar di pertengahan tahun! 🎉';

        return (
            <div style={containerStyle}>
                {/* Background elements */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '700px',
                    height: '700px',
                    borderRadius: '50%',
                    background: '#4B0082',
                    opacity: 0.1,
                    filter: 'blur(120px)',
                    zIndex: 0
                }} />

                {/* Header */}
                <div style={{
                    height: '280px',
                    padding: '100px 90px 0',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{ marginBottom: '12px' }}>
                        <span style={{
                            fontSize: '36px',
                            fontWeight: '900',
                            color: currentTheme.text,
                            letterSpacing: '-1px'
                        }}>
                            {name1} × {name2}
                        </span>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                        <span style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: currentTheme.textLight,
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>
                            {relationship}
                        </span>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <span style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: currentTheme.primary,
                            textTransform: 'uppercase',
                            letterSpacing: '2px'
                        }}>
                            Chat Wrapped 2026
                        </span>
                    </div>
                    <h1 style={{
                        fontSize: '60px',
                        fontWeight: '900',
                        color: currentTheme.text,
                        lineHeight: '1.1',
                        margin: '0',
                        letterSpacing: '-2px'
                    }}>
                        2026<br />Prediction
                    </h1>
                </div>

                {/* Content */}
                <div style={{
                    height: '1240px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '0 90px',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{ fontSize: '100px', marginBottom: '40px', lineHeight: '1' }}>
                        🔮
                    </div>

                    {/* Relationship Score */}
                    <div style={{
                        textAlign: 'center',
                        marginBottom: '40px'
                    }}>
                        <div style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            color: currentTheme.textLight,
                            marginBottom: '8px',
                            textTransform: 'uppercase',
                            letterSpacing: '2px'
                        }}>
                            Relationship Strength
                        </div>
                        <div style={{
                            fontSize: '120px',
                            fontWeight: '900',
                            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', // Gold
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            lineHeight: '1'
                        }}>
                            {data.relationshipScore}%
                        </div>
                    </div>

                    {/* Prediction Points */}
                    <div style={{
                        width: '100%',
                        maxWidth: '800px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        marginBottom: '40px'
                    }}>
                        <div style={{
                            background: currentTheme.card,
                            padding: '24px 32px',
                            borderRadius: '20px',
                            backdropFilter: 'blur(20px)',
                            borderLeft: `5px solid #4CAF50` // Green
                        }}>
                            <div style={{ fontSize: '14px', fontWeight: '700', color: '#4CAF50', marginBottom: '8px', textTransform: 'uppercase' }}>Kekuatan Kalian</div>
                            <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                {data.strengthPoints?.map((p, i) => (
                                    <li key={i} style={{ fontSize: '16px', color: currentTheme.text, marginBottom: '4px' }}>{p}</li>
                                ))}
                            </ul>
                        </div>

                        <div style={{
                            background: currentTheme.card,
                            padding: '24px 32px',
                            borderRadius: '20px',
                            backdropFilter: 'blur(20px)',
                            borderLeft: `5px solid #FF5722` // Orange
                        }}>
                            <div style={{ fontSize: '14px', fontWeight: '700', color: '#FF5722', marginBottom: '8px', textTransform: 'uppercase' }}>Perlu Diperbaiki</div>
                            <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                {data.improvementPoints?.map((p, i) => (
                                    <li key={i} style={{ fontSize: '16px', color: currentTheme.text, marginBottom: '4px' }}>{p}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* AI Insight */}
                    <div style={{
                        background: currentTheme.card,
                        padding: '24px 32px',
                        borderRadius: '20px',
                        marginTop: '20px',
                        maxWidth: '750px',
                        backdropFilter: 'blur(20px)',
                        border: `2px solid ${currentTheme.primary}20`
                    }}>
                        <p style={{
                            fontSize: '18px',
                            color: currentTheme.textLight,
                            textAlign: 'center',
                            lineHeight: '1.6',
                            margin: '0 0 12px 0',
                            fontWeight: '600'
                        }}>
                            💡 Ramalan AI 2026
                        </p>
                        <p style={{
                            fontSize: '17px',
                            color: currentTheme.textLight,
                            textAlign: 'center',
                            lineHeight: '1.6',
                            margin: '0'
                        }}>
                            "{insight}"
                        </p>
                        <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '12px', color: currentTheme.textLight, opacity: 0.7 }}>
                            Confidence Level: {data.aiConfidence}%
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 90px 100px',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '20px 40px',
                        background: currentTheme.card,
                        borderRadius: '100px',
                        backdropFilter: 'blur(20px)'
                    }}>
                        <Sparkles size={24} color={currentTheme.primary} />
                        <span style={{
                            fontSize: '22px',
                            fontWeight: '700',
                            color: currentTheme.text
                        }}>
                            RecapChat.App
                        </span>
                        <span style={{
                            fontSize: '13px',
                            color: currentTheme.textLight,
                            marginLeft: '8px',
                            fontWeight: '600'
                        }}>
                            ✓ AI Verified
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    return renderTemplate();
};
