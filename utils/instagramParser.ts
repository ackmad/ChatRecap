import { Message } from '../types';

// Instagram JSON structure (from data download)
interface InstagramMessage {
  sender_name: string;
  timestamp_ms: number;
  content?: string;
  photos?: Array<{ uri: string }>;
  videos?: Array<{ uri: string }>;
  audio_files?: Array<{ uri: string }>;
  share?: { link: string };
  reactions?: Array<{ reaction: string; actor: string }>;
  is_unsent?: boolean;
  type?: string;
}

interface InstagramConversation {
  participants: Array<{ name: string }>;
  messages: InstagramMessage[];
  title?: string;
  is_still_participant?: boolean;
  thread_type?: string;
  thread_path?: string;
}

/**
 * Parse Instagram JSON export to Message format
 * Instagram export format: message_1.json, message_2.json, etc.
 */
export const parseInstagramJSON = (jsonContent: string): Message[] => {
  try {
    const data: InstagramConversation = JSON.parse(jsonContent);
    
    if (!data.messages || !Array.isArray(data.messages)) {
      throw new Error('Invalid Instagram JSON format: messages array not found');
    }

    const messages: Message[] = [];

    for (const msg of data.messages) {
      // Skip unsent messages
      if (msg.is_unsent) continue;

      // Get sender name (Instagram uses UTF-8 escaped format, need to decode)
      const sender = decodeInstagramText(msg.sender_name);
      
      // Get timestamp
      const date = new Date(msg.timestamp_ms);

      // Build content
      let content = '';

      if (msg.content) {
        content = decodeInstagramText(msg.content);
      } else if (msg.photos && msg.photos.length > 0) {
        content = '📷 [Foto]';
      } else if (msg.videos && msg.videos.length > 0) {
        content = '🎥 [Video]';
      } else if (msg.audio_files && msg.audio_files.length > 0) {
        content = '🎵 [Audio]';
      } else if (msg.share) {
        content = `🔗 [Shared: ${msg.share.link}]`;
      } else {
        content = '[Message without content]';
      }

      // Add reactions if any
      if (msg.reactions && msg.reactions.length > 0) {
        const reactionText = msg.reactions
          .map(r => `${decodeInstagramText(r.actor)}: ${r.reaction}`)
          .join(', ');
        content += ` [Reactions: ${reactionText}]`;
      }

      messages.push({
        sender,
        content,
        date,
        platform: 'instagram',
      });
    }

    // Instagram messages are usually newest first, so reverse to get chronological order
    return messages.reverse();

  } catch (error) {
    console.error('Error parsing Instagram JSON:', error);
    throw new Error(`Gagal membaca file Instagram: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Decode Instagram's escaped UTF-8 text
 * Instagram exports text in escaped format like: "Halo\u00e9"
 */
const decodeInstagramText = (text: string): string => {
  try {
    // Instagram uses Latin-1 encoding, need to convert
    return text
      .split('')
      .map(char => {
        const code = char.charCodeAt(0);
        // If it's in Latin-1 range (128-255), convert to proper UTF-8
        if (code >= 128 && code <= 255) {
          return String.fromCharCode(code);
        }
        return char;
      })
      .join('');
  } catch {
    return text;
  }
};

/**
 * Merge WhatsApp and Instagram messages chronologically
 */
export const mergeMessages = (waMessages: Message[], igMessages: Message[]): Message[] => {
  const combined = [...waMessages, ...igMessages];
  
  // Sort by date (oldest first)
  combined.sort((a, b) => a.date.getTime() - b.date.getTime());
  
  return combined;
};

/**
 * Get conversation metadata from both sources
 */
export const getConversationMetadata = (waMessages: Message[], igMessages: Message[]) => {
  const allMessages = mergeMessages(waMessages, igMessages);
  
  const uniqueSenders = new Set(allMessages.map(m => m.sender));
  const totalMessages = allMessages.length;
  
  const waCount = waMessages.length;
  const igCount = igMessages.length;
  
  const firstMessage = allMessages[0];
  const lastMessage = allMessages[allMessages.length - 1];
  
  const durationMs = lastMessage.date.getTime() - firstMessage.date.getTime();
  const durationDays = Math.floor(durationMs / (1000 * 60 * 60 * 24));
  
  return {
    totalMessages,
    whatsappMessages: waCount,
    instagramMessages: igCount,
    participants: Array.from(uniqueSenders),
    startDate: firstMessage.date,
    endDate: lastMessage.date,
    durationDays,
    platforms: [
      waCount > 0 && 'WhatsApp',
      igCount > 0 && 'Instagram'
    ].filter(Boolean) as string[]
  };
};
