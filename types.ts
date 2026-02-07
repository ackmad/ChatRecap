// src/types.ts

export enum AppState {
  LANDING = 'landing',
  INSTRUCTIONS = 'instructions', // Digabung ke renderStudio di App.tsx
  UPLOAD = 'upload',
  PROCESSING = 'processing',
  INSIGHTS = 'insights',
  CHAT = 'chat',
  ABOUT_WEBSITE = 'about_website',
  ABOUT_CREATOR = 'about_creator'
}

export type RelationshipType =
  | 'friendship_boys'
  | 'friendship_girls'
  | 'friendship_mixed'
  | 'bestie'
  | 'family'
  | 'romantic'
  | 'crush'
  | 'work'
  | 'school'
  | 'stranger'
  | 'toxic'
  | 'broken'
  | 'long_distance'
  | 'other';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Message {
  date: Date;
  sender: string;
  content: string;
}

export interface ChatData {
  participants: string[];
  totalMessages: number;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  durationString: string;
  messages: Message[];
  participantStats: Record<string, ParticipantStats>;
  dailyDistribution: { date: string; count: number; breakdown: any }[];
  hourlyDistribution: { hour: number; count: number }[];
  balanceScore: number; // 0-100 (50 is balanced)
  silencePeriods: {
    startDate: Date;
    endDate: Date;
    durationDays: number;
    breaker: string;
  }[];
  activeDays?: number;
  avgMessagesPerDay?: number;
  mediaCount?: number;
  busiestDay?: { date: string; count: number };
  busiestHour?: number;
}

export interface AnalysisResult {
  storyTitle: string;
  summary: string;
  relationshipType: RelationshipType;
  emotionalTone: string;
  aiConfidence: 'high' | 'medium' | 'low';

  phases: {
    name: string;
    description: string;
    mood: 'warm' | 'cold' | 'tense' | 'neutral' | 'happy' | 'sad';
    period: string;
  }[];

  dominantTopics: {
    name: string;
    category: 'fun' | 'deep' | 'conflict' | 'neutral';
  }[];

  keyMoments: {
    title: string;
    description: string;
    date: string;
    mood: string;
  }[];

  memorableLines: {
    text: string;
    sender: string;
    context: string;
    mood: string;
  }[];

  conflictTriggers: string[];

  toneAnalysis: {
    label: string;
    percentage: number;
  }[];

  monthlyMoods: {
    month: string;
    mood: string;
    intensity: number;
  }[];

  hourlyMoods: {
    timeRange: string;
    mood: string;
    description: string;
  }[];

  communicationStyle: {
    mostExpressive: string;
    quickestReplier: string;
    description: string;
  };

  reflection: string;
  emotions: {
    emotion: string;
    intensity: number;
    description: string;
  }[];

  // For Story Generator
  mood?: string;
  topics?: {
    name: string;
    percentage: number;
  }[];

  // Viral Template Data
  participants?: { name: string; role?: string }[];

  // Toxic Meter
  toxicScore?: number;
  toxicLevel?: string;
  toxicExamples?: { text: string; time: string }[];
  toxicInsight?: string;

  // Reply Speed
  avgReplyTime1?: string;
  avgReplyTime2?: string;
  fastestReply1?: string;
  fastestReply2?: string;
  replyBadge1?: string;
  replyBadge2?: string;
  activeHours1?: string[];
  activeHours2?: string[];
  replyInsight?: string;

  // Ghosting
  ghostingCount1?: number;
  ghostingCount2?: number;
  longestGhosting1?: string;
  longestGhosting2?: string;
  comebackMessage?: string;
  ghostingKing?: string;
  ghostingInsight?: string;

  // Topic Ranking
  topTopics?: { topic: string; count: number; emoji: string }[];
  topicInsight?: string;
  mostDebatedTopic?: string;

  // Quote of Year
  bestQuote?: string;
  quoteAuthor?: string;
  quoteDate?: string;
  quoteContext?: string;
  runnerUpQuotes?: { text: string; author: string }[];

  // Care Meter
  careScore1?: number;
  careScore2?: number;
  careExamples1?: { text: string; time: string }[];
  careExamples2?: { text: string; time: string }[];
  careWinner?: string;
  careInsight?: string;

  // Overthinking
  overthinkingScore1?: number;
  overthinkingScore2?: number;
  overthinkingExamples?: { text: string; author: string }[];
  overthinkingKing?: string;
  overthinkingInsight?: string;

  // Typing Style
  typingStyle1?: string;
  typingStyle2?: string;
  avgMessageLength1?: number;
  avgMessageLength2?: number;
  typingSpeed1?: string;
  typingSpeed2?: string;
  styleInsight?: string;

  // Emoji Personality
  topEmoji1?: string;
  topEmoji2?: string;
  emojiCount1?: number;
  emojiCount2?: number;
  personality1?: string;
  personality2?: string;
  emojiInsight?: string;

  // AI Prediction
  relationshipScore?: number;
  futurePredict?: string;
  strengthPoints?: string[];
  improvementPoints?: string[];
  prediction2026?: string;
  aiConfidenceScore?: number;
}

// Live Activity Types
export interface LiveStats {
  activeUsers: number;
  totalAnalyses: number;
  averageMessages: number;
  online?: number;
  uploading?: number;
  analyzing?: number;
  chatting?: number;
  reading?: number;
}

export type UserActivityStatus = 'active' | 'idle' | 'offline' | 'uploading' | 'analyzing' | 'reading' | 'chatting';


// Chat Parser Types
export interface ParticipantStats {
  messageCount: number;
  wordCount: number;
  averageLength: number;
  name?: string;
  avgReplyTimeMinutes?: number;
  initiationCount?: number;
  emojiUsage?: Record<string, number>;
  topEmojis?: string[];
  vocabulary?: Record<string, number>; // Word frequency
  topWords?: string[];
  ghostingCount?: number;
  longestGhostingDurationMinutes?: number;
  fastestReplyMinutes?: number;
  typingStyle?: 'short' | 'long' | 'balanced';
  activeHours?: number[]; // Array of 24 integers
}

export interface SilencePeriod {
  startDate: Date;
  endDate: Date;
  durationDays: number;
  breaker: string;
}

export interface DailyStats {
  date: string;
  count: number;
  breakdown: any;
}