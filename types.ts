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
  participantStats: {
    [key: string]: {
      messageCount: number;
      wordCount: number;
      averageLength: number;
      name?: string;
      avgReplyTimeMinutes?: number;
      initiationCount?: number;
    };
  };
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