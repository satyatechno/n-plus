import { useCallback } from 'react';

import { verifyAuth } from '@src/services/geoblockService';
import { useLocationStore } from '@src/zustand/locationStore';

/**
 * useGeoblockCheck - Abstraction hook for IP-based geoblocking
 *
 * Decouples ViewModels from the concrete TVSS service implementation.
 * Applies Dependency Inversion (SOLID-D): high-level modules (ViewModels)
 * depend on this abstraction, not on geoblockService directly.
 *
 * Mirrors checkGeoblockLivestream() from the Broadcast SDK web:
 *   this.checkGeoblockLivestream().then(play).catch(showGeoBlockOverlay)
 */
export const useGeoblockCheck = () => {
  const { setLocationBlocked } = useLocationStore();

  /**
   * checkAndSetGeoblock
   *
   * @param tvssDomain Ex: "notusaauth.univision.com"
   * @returns Promise<void>
   */
  const checkAndSetGeoblock = useCallback(
    async (tvssDomain: string): Promise<void> => {
      try {
        const isBlocked = await verifyAuth(tvssDomain);
        setLocationBlocked(isBlocked);
      } catch {
        // Typically block on error to be safe, or leave unchanged based on rules
        setLocationBlocked(true);
      }
    },
    [setLocationBlocked]
  );

  return { checkAndSetGeoblock };
};
