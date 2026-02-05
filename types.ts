export interface Message {
  date: Date;
  sender: string;
  content: string;
}

export interface ParticipantStats {
  name: string;
  messageCount: number;
  wordCount: number;
  avgReplyTimeMinutes: number;
  initiationCount: number;
}

export interface SilencePeriod {
  startDate: Date;
  endDate: Date;
  durationDays: number;
  breaker: string; // Who broke the silence
}

export interface DailyStats {
  date: string;
  count: number;
  breakdown: Record<string, number>; // New: Specific counts per person for this day
}

export interface ChatData {
  participants: string[];
  messages: Message[];
  totalMessages: number;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  durationString: string;
  activeDays: number;
  avgMessagesPerDay: number;
  mediaCount: number;
  busiestDay: { date: string; count: number };
  busiestHour: number; // 0-23
  hourlyDistribution: { hour: number; count: number }[];
  dailyDistribution: DailyStats[]; // Updated
  participantStats: Record<string, ParticipantStats>;
  silencePeriods: SilencePeriod[];
  balanceScore: number; // 0-100 (50 is perfect balance)
}

export interface KeyMoment {
  title: string;
  description: string;
  mood: 'happy' | 'sad' | 'neutral' | 'tense' | 'warm';
  date: string; // Approximate date string
}

export interface EmotionBubble {
  emotion: string;
  intensity: number; // 1-10
  description: string;
}

export interface RelationshipPhase {
  name: string;
  description: string;
  mood: 'warm' | 'neutral' | 'cold' | 'tense' | 'excited';
  period: string;
}

export interface Topic {
  name: string;
  category: 'fun' | 'deep' | 'daily' | 'conflict';
}

export interface MemorableLine {
  text: string;
  sender: string;
  context: string;
  mood: string;
}

export interface MonthlyMood {
  month: string; // "Januari 2024"
  mood: string;
  intensity: number;
}

export interface HourlyMood {
  timeRange: string; // "06:00 - 12:00"
  mood: string;
  description: string;
}

// Updated Relationship Types for better theming
export type RelationshipType = 
  | 'romantic' 
  | 'crush'
  | 'friendship_boys' // Cowok & Cowok
  | 'friendship_girls' // Cewek & Cewek
  | 'friendship_mixed' // Cowok & Cewek (Friendzone/Biasa)
  | 'bestie'
  | 'family' 
  | 'work' 
  | 'school'
  | 'long_distance'
  | 'broken'
  | 'toxic'
  | 'stranger'
  | 'other';

export interface AnalysisResult {
  summary: string;
  storyTitle: string;
  relationshipType: RelationshipType; 
  emotionalTone: string;
  emotions: EmotionBubble[];
  keyMoments: KeyMoment[];
  reflection: string;
  phases: RelationshipPhase[];
  dominantTopics: Topic[];
  toneAnalysis: { label: string; percentage: number }[];
  conflictTriggers: string[];
  memorableLines: MemorableLine[];
  monthlyMoods: MonthlyMood[];
  hourlyMoods: HourlyMood[];
  communicationStyle: {
     mostExpressive: string;
     quickestReplier: string;
     description: string;
  };
  aiConfidence: 'high' | 'medium' | 'low';
}

export enum AppState {
  LANDING = 'LANDING',
  INSTRUCTIONS = 'INSTRUCTIONS',
  UPLOAD = 'UPLOAD',
  PROCESSING = 'PROCESSING',
  INSIGHTS = 'INSIGHTS',
  CHAT = 'CHAT',
  ABOUT_WEBSITE = 'ABOUT_WEBSITE',
  ABOUT_CREATOR = 'ABOUT_CREATOR',
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface LiveStats {
  online: number;
  uploading: number;
  analyzing: number;
  reading: number;
  chatting: number;
}

export type UserActivityStatus = 'idle' | 'uploading' | 'analyzing' | 'reading' | 'chatting';