import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '@/constants/storageKeys';
import type { PremiumProductId, PremiumStatus } from '@/types/premium';
import { PREMIUM_PRODUCTS } from '@/types/premium';

const DEFAULT_STATUS: PremiumStatus = {
  isPremium: false,
  activeProductId: null,
  expirationDate: null,
};

function computeExpirationDate(productId: PremiumProductId): string {
  const days = PREMIUM_PRODUCTS[productId].durationDays;
  const expires = new Date();
  expires.setDate(expires.getDate() + days);
  return expires.toISOString();
}

function normalizeStatus(raw: Partial<PremiumStatus> | null): PremiumStatus {
  if (!raw) return { ...DEFAULT_STATUS };

  const isPremium = Boolean(raw.isPremium);
  const activeProductId =
    raw.activeProductId === 'premium_weekly' || raw.activeProductId === 'premium_yearly'
      ? raw.activeProductId
      : null;
  const expirationDate = typeof raw.expirationDate === 'string' ? raw.expirationDate : null;

  if (isPremium && expirationDate) {
    const expired = new Date(expirationDate).getTime() <= Date.now();
    if (expired) return { ...DEFAULT_STATUS };
  }

  if (isPremium && !expirationDate) {
    return { ...DEFAULT_STATUS };
  }

  return {
    isPremium,
    activeProductId,
    expirationDate,
  };
}

async function readStatus(): Promise<PremiumStatus> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.premiumStatusSimulated);
    if (!raw) return { ...DEFAULT_STATUS };
    return normalizeStatus(JSON.parse(raw) as Partial<PremiumStatus>);
  } catch {
    return { ...DEFAULT_STATUS };
  }
}

async function writeStatus(status: PremiumStatus): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.premiumStatusSimulated, JSON.stringify(status));
}

export interface UsePremiumStatusReturn {
  isPremium: boolean;
  activeProductId: PremiumProductId | null;
  expirationDate: string | null;
  isReady: boolean;
  simulatePurchase: (productId: PremiumProductId) => Promise<void>;
  simulateCancel: () => Promise<void>;
  /** Dev only — bascule rapidement entre premium et gratuit. */
  simulateTogglePremium: () => Promise<void>;
}

// TODO: remplacer entièrement cette implémentation par react-native-purchases
// (RevenueCat) quand le backend/paiement réel sera mis en place — garder la
// même interface UsePremiumStatusReturn pour que les composants consommateurs
// n'aient rien à changer.

export function usePremiumStatus(): UsePremiumStatusReturn {
  const [status, setStatus] = useState<PremiumStatus>(DEFAULT_STATUS);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    void readStatus().then((stored) => {
      if (!mounted) return;
      setStatus(stored);
      setIsReady(true);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const simulatePurchase = useCallback(async (productId: PremiumProductId) => {
    const next: PremiumStatus = {
      isPremium: true,
      activeProductId: productId,
      expirationDate: computeExpirationDate(productId),
    };
    await writeStatus(next);
    setStatus(next);
  }, []);

  const simulateCancel = useCallback(async () => {
    await writeStatus({ ...DEFAULT_STATUS });
    setStatus({ ...DEFAULT_STATUS });
  }, []);

  const simulateTogglePremium = useCallback(async () => {
    const current = await readStatus();
    if (current.isPremium) {
      await writeStatus({ ...DEFAULT_STATUS });
      setStatus({ ...DEFAULT_STATUS });
      return;
    }
    await simulatePurchase('premium_yearly');
  }, [simulatePurchase]);

  return {
    isPremium: status.isPremium,
    activeProductId: status.activeProductId,
    expirationDate: status.expirationDate,
    isReady,
    simulatePurchase,
    simulateCancel,
    simulateTogglePremium,
  };
}
