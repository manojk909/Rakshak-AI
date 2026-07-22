'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ensureSession, getLiveThreats } from '@/lib/api';
import { DEMO_THREATS } from '@/lib/demoData';
import type { FraudCase } from '@/lib/types';

/** Polls /api/scam/threats/live every 15s. Falls back to demo data if API is down. */
export function useLiveThreats(limit = 20) {
  const [threats, setThreats] = useState<FraudCase[]>([]);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  const fetchThreats = useCallback(async () => {
    try {
      await ensureSession();
      const data = await getLiveThreats(limit);
      if (mounted.current) {
        setThreats(data);
        setIsDemoMode(false);
      }
    } catch {
      if (mounted.current) {
        setThreats(DEMO_THREATS);
        setIsDemoMode(true);
      }
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    mounted.current = true;
    fetchThreats();
    const interval = setInterval(fetchThreats, 15000);
    return () => {
      mounted.current = false;
      clearInterval(interval);
    };
  }, [fetchThreats]);

  return { threats, isDemoMode, loading, refresh: fetchThreats };
}
