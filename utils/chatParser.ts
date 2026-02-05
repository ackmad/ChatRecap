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

  // --- Advanced Stats Calculation ---

  const participantStats: Record<string, ParticipantStats> = {};
  participantList.forEach(p => {
    participantStats[p] = {
      name: p,
      messageCount: 0,
      wordCount: 0,
      avgReplyTimeMinutes: 0,
      initiationCount: 0
    };
  });

  const hourlyCount = new Array(24).fill(0);
  const dailyCount: Record<string, number> = {};
  const dailyBreakdown: Record<string, Record<string, number>> = {}; // New: Breakdown per day
  const replyTimes: Record<string, number[]> = {};
  const silencePeriods: SilencePeriod[] = [];

  let lastMessage: Message | null = null;
  const SILENCE_THRESHOLD_DAYS = 4; // Adjusted to capture shorter significant gaps

  sortedMessages.forEach((msg) => {
    // 1. Basic Counts
    if (participantStats[msg.sender]) {
      participantStats[msg.sender].messageCount++;
      participantStats[msg.sender].wordCount += msg.content.split(/\s+/).length;
    }

    // 2. Hourly Distribution
    hourlyCount[msg.date.getHours()]++;

    // 3. Daily Distribution
    const dateKey = msg.date.toISOString().split('T')[0];
    dailyCount[dateKey] = (dailyCount[dateKey] || 0) + 1;
    
    // Daily Breakdown Logic
    if (!dailyBreakdown[dateKey]) {
        dailyBreakdown[dateKey] = {};
    }
    dailyBreakdown[dateKey][msg.sender] = (dailyBreakdown[dateKey][msg.sender] || 0) + 1;

    // 4. Initiations, Reply Times & Silence Tracking
    if (lastMessage) {
      const timeDiffMs = msg.date.getTime() - lastMessage.date.getTime();
      const timeDiffMinutes = timeDiffMs / (1000 * 60);
      const timeDiffDays = timeDiffMs / (1000 * 60 * 60 * 24);

      // Silence Detection
      if (timeDiffDays >= SILENCE_THRESHOLD_DAYS) {
        silencePeriods.push({
            startDate: lastMessage.date,
            endDate: msg.date,
            durationDays: Math.round(timeDiffDays),
            breaker: msg.sender
        });
      }

      // Initiation: If > 6 hours gap, consider it a new conversation start
      if (timeDiffMinutes > 360) { // 6 hours
        if (participantStats[msg.sender]) {
            participantStats[msg.sender].initiationCount++;
        }
      } 
      // Reply Time: If different sender and time < 6 hours
      else if (msg.sender !== lastMessage.sender) {
        if (!replyTimes[msg.sender]) replyTimes[msg.sender] = [];
        replyTimes[msg.sender].push(timeDiffMinutes);
      }
    } else {
      // First message is an initiation
      if (participantStats[msg.sender]) {
        participantStats[msg.sender].initiationCount++;
      }
    }

    lastMessage = msg;
  });

  // Finalize Stats
  participantList.forEach(p => {
    const times = replyTimes[p] || [];
    const sum = times.reduce((a, b) => a + b, 0);
    participantStats[p].avgReplyTimeMinutes = times.length ? Math.round(sum / times.length) : 0;
  });

  // Calculate Balance Score (0-100)
  let balanceScore = 50;
  if (participantList.length === 2 && sortedMessages.length > 0) {
      const p1 = participantList[0];
      const p2 = participantList[1];
      const count1 = participantStats[p1]?.messageCount || 0;
      const count2 = participantStats[p2]?.messageCount || 0;
      const total = count1 + count2;
      
      if (total > 0) {
          const ratio = Math.min(count1, count2) / Math.max(count1, count2);
          balanceScore = Math.round(ratio * 100);
      }
  }

  // Find busiest
  const sortedDays = Object.entries(dailyCount).sort((a, b) => b[1] - a[1]);
  const busiestDay = sortedDays.length > 0 ? { date: sortedDays[0][0], count: sortedDays[0][1] } : { date: '', count: 0 };
  
  const busiestHour = hourlyCount.indexOf(Math.max(...hourlyCount));

  // Format Data for Charts
  const hourlyDistribution = hourlyCount.map((count, hour) => ({ hour, count }));
  const dailyDistributionArray: DailyStats[] = Object.keys(dailyCount).sort().map(date => ({
      date,
      count: dailyCount[date],
      breakdown: dailyBreakdown[date] || {}
  }));

  // Duration & Averages
  let durationString = "0 hari";
  let activeDays = Object.keys(dailyCount).length;
  let avgMessagesPerDay = 0;

  if (sortedMessages.length > 1) {
    const start = sortedMessages[0].date;
    const end = sortedMessages[sortedMessages.length - 1].date;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
        avgMessagesPerDay = Math.round(sortedMessages.length / diffDays);
    }

    if (diffDays > 365) {
        const years = Math.floor(diffDays / 365);
        const remainingDays = diffDays % 365;
        const months = Math.floor(remainingDays / 30);
        durationString = `${years} tahun ${months > 0 ? `${months} bulan` : ''}`;
    } else if (diffDays > 30) {
        const months = Math.floor(diffDays / 30);
        durationString = `${months} bulan ${diffDays % 30} hari`;
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