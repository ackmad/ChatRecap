import { Message, ChatData, ParticipantStats, SilencePeriod, DailyStats } from "../types";

export const parseWhatsAppChat = (text: string): ChatData => {
  const lines = text.split('\n');
  const messages: Message[] = [];
  const participants = new Set<string>();

  // Regex updated to support multiple formats
  const regex = /^\[?(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}[, ]+\d{1,2}[:.]\d{2}(?:[:.]\d{2})?(?: ?[AP]M)?)\]?(?: -|:)? (.+?): (.+)/;

  // To track media roughly
  let mediaCount = 0;

  for (const line of lines) {
    if (line.includes('Messages and calls are end-to-end encrypted') ||
      line.includes('created group') ||
      line.includes('added') ||
      line.includes('left') ||
      !line.trim()) {
      continue;
    }

    const match = line.match(regex);

    if (match) {
      const dateString = match[1];
      const sender = match[2];
      const content = match[3];

      // Check for media indicators
      if (content.includes('Media omitted') || content.includes('image omitted') || content.includes('sticker omitted')) {
        mediaCount++;
      }

      let validDate: Date = new Date();
      let parseSuccess = false;

      try {
        const numMatches = dateString.match(/\d+/g);
        if (numMatches && numMatches.length >= 5) {
          const nums = numMatches.map(Number);
          let day = nums[0];
          let month = nums[1];
          let year = nums[2];
          let hour = nums[3];
          let minute = nums[4];
          let second = nums[5] || 0;

          if (year < 100) year += 2000;
          if (dateString.toUpperCase().includes('PM') && hour < 12) hour += 12;
          if (dateString.toUpperCase().includes('AM') && hour === 12) hour = 0;

          const d = new Date(year, month - 1, day, hour, minute, second);
          if (!isNaN(d.getTime())) {
            validDate = d;
            parseSuccess = true;
          }
        }

        if (!parseSuccess) {
          const normalizedStr = dateString.replace(/\./g, ':').replace(/,/g, '');
          const d = new Date(normalizedStr);
          if (!isNaN(d.getTime())) {
            validDate = d;
            parseSuccess = true;
          }
        }
      } catch (e) {
        console.warn("Date parse error for line:", line);
      }

      participants.add(sender);
      messages.push({ date: validDate, sender: sender, content: content.trim() });
    } else {
      if (messages.length > 0) {
        messages[messages.length - 1].content += `\n${line.trim()}`;
      }
    }
  }

  const sortedMessages = messages.sort((a, b) => a.date.getTime() - b.date.getTime());
  const participantList = Array.from(participants);

  // --- Advanced Stats Initialization ---
  const participantStats: Record<string, ParticipantStats> = {};
  participantList.forEach(p => {
    participantStats[p] = {
      name: p,
      messageCount: 0,
      wordCount: 0,
      averageLength: 0,
      avgReplyTimeMinutes: 0,
      initiationCount: 0,
      emojiUsage: {},
      vocabulary: {},
      topEmojis: [],
      topWords: [],
      ghostingCount: 0,
      longestGhostingDurationMinutes: 0,
      fastestReplyMinutes: 999999,
      activeHours: new Array(24).fill(0),
      typingStyle: 'balanced'
    };
  });

  const hourlyCount = new Array(24).fill(0);
  const dailyCount: Record<string, number> = {};
  const dailyBreakdown: Record<string, Record<string, number>> = {};
  const replyTimes: Record<string, number[]> = {};
  const silencePeriods: SilencePeriod[] = [];

  let lastMessage: Message | null = null;
  const SILENCE_THRESHOLD_HOURS = 24 * 3; // 3 days for ghosting

  // Basic Stop Words (Indonesian & English mix)
  const STOP_WORDS = new Set(['yang', 'dan', 'di', 'ke', 'dari', 'ini', 'itu', 'aku', 'kamu', 'dia', 'kita', 'mereka', 'apa', 'siapa', 'kapan', 'dimana', 'kenapa', 'bagaimana', 'ya', 'tidak', 'bukan', 'jangan', 'sudah', 'telah', 'sedang', 'akan', 'bisa', 'boleh', 'harus', 'mau', 'ingin', 'tapi', 'namun', 'jika', 'kalau', 'the', 'and', 'to', 'of', 'a', 'in', 'is', 'it', 'you', 'that', 'he', 'she', 'was', 'for', 'on', 'are', 'with', 'as', 'I', 'his', 'they', 'be', 'at', 'one', 'have', 'this', 'from', 'or', 'had', 'by', 'not', 'word', 'but', 'what', 'some', 'we', 'can', 'out', 'other', 'were', 'all', 'there', 'when', 'up', 'use', 'your', 'how', 'said', 'an', 'each', 'she']);

  // Emoji Regex
  const EMOJI_REGEX = /[\u{1F300}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;

  sortedMessages.forEach((msg) => {
    const stats = participantStats[msg.sender];
    if (!stats) return;

    // 1. Basic Counts
    stats.messageCount++;
    const words = msg.content.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 2);
    stats.wordCount += words.length;

    // 2. Vocabulary & Typing Style
    words.forEach(w => {
      if (!STOP_WORDS.has(w)) {
        stats.vocabulary![w] = (stats.vocabulary![w] || 0) + 1;
      }
    });

    // 3. Emojis
    const emojis = msg.content.match(EMOJI_REGEX);
    if (emojis) {
      emojis.forEach(e => {
        stats.emojiUsage![e] = (stats.emojiUsage![e] || 0) + 1;
      });
    }

    // 4. Hourly Distribution (Global & Per User)
    const hour = msg.date.getHours();
    hourlyCount[hour]++;
    stats.activeHours![hour]++;

    // 5. Daily Distribution
    const dateKey = msg.date.toISOString().split('T')[0];
    dailyCount[dateKey] = (dailyCount[dateKey] || 0) + 1;
    if (!dailyBreakdown[dateKey]) dailyBreakdown[dateKey] = {};
    dailyBreakdown[dateKey][msg.sender] = (dailyBreakdown[dateKey][msg.sender] || 0) + 1;

    // 6. Reply Times & Ghosting
    if (lastMessage) {
      const timeDiffMs = msg.date.getTime() - lastMessage.date.getTime();
      const timeDiffMinutes = timeDiffMs / (1000 * 60);

      // If sender changed, it's a reply
      if (msg.sender !== lastMessage.sender) {
        if (!replyTimes[msg.sender]) replyTimes[msg.sender] = [];
        replyTimes[msg.sender].push(timeDiffMinutes);

        // Track fastest
        if (timeDiffMinutes < (stats.fastestReplyMinutes || 999999)) {
          stats.fastestReplyMinutes = timeDiffMinutes;
        }

        // Ghosting Check (Deep Silence)
        if (timeDiffMinutes > (SILENCE_THRESHOLD_HOURS * 60)) {
          // The PREVIOUS sender was "Ghosted" by the CURRENT sender (who took too long to reply)
          // OR the NEW sender broke the silence after dragging their feet?
          // Usually: A sent msg. B took 3 days to reply. B ghosted A.
          stats.ghostingCount = (stats.ghostingCount || 0) + 1;
          if (timeDiffMinutes > (stats.longestGhostingDurationMinutes || 0)) {
            stats.longestGhostingDurationMinutes = timeDiffMinutes;
          }
        }
      }
    }
    lastMessage = msg;
  });

  // Finalize Stats
  participantList.forEach(p => {
    const stats = participantStats[p];

    // Avg Reply Time
    const times = replyTimes[p] || [];
    const sum = times.reduce((a, b) => a + b, 0);
    stats.avgReplyTimeMinutes = times.length ? Math.round(sum / times.length) : 0;

    // Average Message Length
    stats.averageLength = stats.messageCount ? Math.round(stats.wordCount / stats.messageCount) : 0;
    stats.typingStyle = stats.averageLength < 5 ? 'short' : (stats.averageLength > 20 ? 'long' : 'balanced');

    // Sort Top Emojis
    stats.topEmojis = Object.entries(stats.emojiUsage!)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(e => e[0]); // Just the emoji chars

    // Sort Top Words
    stats.topWords = Object.entries(stats.vocabulary!)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(w => w[0]);
  });

  // ... (Balance Score and finding Busiest day logic remains similar)
  // Calculate Balance Score (0-100)
  let balanceScore = 50;
  if (participantList.length === 2 && sortedMessages.length > 0) {
    const p1 = participantList[0];
    const p2 = participantList[1];
    const count1 = participantStats[p1]?.messageCount || 0;
    const count2 = participantStats[p2]?.messageCount || 0;
    // Simple ratio
    const total = count1 + count2;
    if (total > 0) {
      const min = Math.min(count1, count2);
      const max = Math.max(count1, count2);
      balanceScore = Math.round((min / max) * 100);
    }
  }

  // Find busiest day
  const sortedDays = Object.entries(dailyCount).sort((a, b) => b[1] - a[1]);
  const busiestDay = sortedDays.length > 0 ? { date: sortedDays[0][0], count: sortedDays[0][1] } : { date: '', count: 0 };
  const busiestHour = hourlyCount.indexOf(Math.max(...hourlyCount));

  // Format Data for Charts
  const hourlyDistribution = hourlyCount.map((count, hour) => ({ hour, count }));
  const dailyDistributionArray = Object.keys(dailyCount).sort().map(date => ({
    date,
    count: dailyCount[date],
    breakdown: dailyBreakdown[date] || {}
  }));

  // Duration String Logic (Reused)
  let durationString = "0 hari";
  let activeDays = Object.keys(dailyCount).length;
  let avgMessagesPerDay = 0;
  // ... (keeping existing duration logic if needed, or simplified)
  if (sortedMessages.length > 1) {
    const start = sortedMessages[0].date;
    const end = sortedMessages[sortedMessages.length - 1].date;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 0) avgMessagesPerDay = Math.round(sortedMessages.length / diffDays);

    if (diffDays > 365) {
      const y = Math.floor(diffDays / 365);
      const m = Math.floor((diffDays % 365) / 30);
      durationString = `${y} tahun ${m > 0 ? `${m} bulan` : ''}`;
    } else if (diffDays > 30) {
      durationString = `${Math.floor(diffDays / 30)} bulan ${diffDays % 30} hari`;
    } else {
      durationString = `${diffDays} hari`;
    }
  }

  return {
    participants: participantList,
    messages: sortedMessages,
    totalMessages: sortedMessages.length,
    dateRange: {
      start: sortedMessages.length > 0 ? sortedMessages[0].date : null,
      end: sortedMessages.length > 0 ? sortedMessages[sortedMessages.length - 1].date : null,
    },
    durationString,
    activeDays,
    avgMessagesPerDay,
    mediaCount,
    busiestDay,
    busiestHour,
    hourlyDistribution,
    dailyDistribution: dailyDistributionArray,
    participantStats,
    silencePeriods,
    balanceScore
  };
};