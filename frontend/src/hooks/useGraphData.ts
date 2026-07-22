'use client';
import { useCallback, useEffect, useState } from 'react';
import { ensureSession, getNetwork, runGraphAnalysis } from '@/lib/api';
import { DEMO_GRAPH } from '@/lib/demoData';
import type { GraphResponse } from '@/lib/types';

export function useGraphData() {
  const [graph, setGraph] = useState<GraphResponse | null>(null);
  const [intelligence, setIntelligence] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const fetchGraph = useCallback(async () => {
    try {
      await ensureSession();
      setGraph(await getNetwork());
      setIsDemoMode(false);
    } catch {
      setGraph(DEMO_GRAPH);
      setIsDemoMode(true);
    }
  }, []);

  const analyze = useCallback(async () => {
    setAnalyzing(true);
    try {
      const result = await runGraphAnalysis();
      setIntelligence(result.gemini_intelligence);
      await fetchGraph();
    } catch {
      setIntelligence({
        ring_type: 'hub_spoke', operation_name: 'OPERATION PHANTOM',
        primary_hub_analysis: 'Central fraud compound coordinating suspect phone clusters across 3 states.',
        financial_exposure_inr: 23_000_000, cross_border_indicators: true,
        investigation_priority: 'critical', recommended_agencies: ['I4C', 'FIU_IND'],
        jurisdiction_flags: ['Delhi', 'Maharashtra', 'Karnataka'], evidence_strength: 'strong',
      });
    } finally {
      setAnalyzing(false);
    }
  }, [fetchGraph]);

  useEffect(() => {
    fetchGraph();
  }, [fetchGraph]);

  return { graph, intelligence, analyzing, analyze, isDemoMode, refresh: fetchGraph };
}
