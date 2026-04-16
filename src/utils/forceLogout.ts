import useAuthStore from '@src/zustand/auth/authStore';
import { AnalyticsService } from '@src/services/analytics/AnalyticsService';

export const forceLogout = async () => {
  const { clearAuth } = useAuthStore.getState();

  AnalyticsService.logAppsFlyerEvent('logout_successfull', {});

  clearAuth();
};
