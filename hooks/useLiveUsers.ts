import { useEffect, useState } from 'react';
import { LiveStats, UserActivityStatus, AppState } from '../types';

export const useLiveUsers = (currentAppState: AppState) => {
  const [stats, setStats] = useState<LiveStats>({
    activeUsers: 1,
    totalAnalyses: 0,
    averageMessages: 0,
    online: 1,
    uploading: 0,
    analyzing: 0,
    reading: 0,
    chatting: 0
  });

  useEffect(() => {
    let status: UserActivityStatus = 'idle';

    // Mapping AppState ke status
    switch (currentAppState) {
      case AppState.LANDING:
      case AppState.ABOUT_WEBSITE:
      case AppState.ABOUT_CREATOR:
        status = 'idle';
        break;
      case AppState.UPLOAD:
      case AppState.INSTRUCTIONS:
        status = 'uploading';
        break;
      case AppState.PROCESSING:
        status = 'analyzing';
        break;
      case AppState.INSIGHTS:
        status = 'reading';
        break;
      case AppState.CHAT:
        status = 'chatting';
        break;
      default:
        status = 'idle';
    }

    console.log('Current user status:', status);
    // Bisa digunakan untuk tracking lokal atau integrasi future jika diperlukan

  }, [currentAppState]);

  return stats;
};