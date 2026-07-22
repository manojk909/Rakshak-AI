'use client';
import dynamic from 'next/dynamic';
import { useState, forwardRef } from 'react';
import { useGraphData } from '@/hooks/useGraphData';

const CytoscapeComponent = dynamic(
  () => import('react-cytoscapejs').then((mod) => {
    // react-cytoscapejs doesn't support forwardRef; wrap it so Next dynamic() is happy
    const Cyto = mod.default || mod;
    const Wrapped = forwardRef((props: any, _ref: any) => <Cyto {...props} />);
    Wrapped.displayName = 'CytoscapeWrapper';
    return Wrapped;
  }),
  { ssr: false }
);

const STYLESHEET: any[] = [
  { selector: 'node', style: { label: '', width: 16, height: 16, 'background-color': '#94a3b8' } },
  { selector: 'node[node_type = "fraud_compound"]', style: { width: 40, height: 40, 'background-color': '#ef4444' } },
  { selector: 'node[node_type = "suspect_phone"]', style: { width: 25, height: 25, 'background-color': '#f59e0b' } },
  { selector: 'node[node_type = "mule_account"]', style: { width: 22, height: 22, 'background-color': '#3b82f6' } },
  { selector: 'node[node_type = "ip_address"]', style: { width: 18, height: 18, 'background-color': '#8b5cf6' } },
  {
    selector: 'node[pagerank_score > 0.05]',
    style: { label: 'data(label)', color: '#e2e8f0', 'font-size': 8, 'text-valign': 'top', 'text-margin-y': -4 },
  },
  {
    // Cross-jurisdiction: dashed outer ring
    selector: 'node[?is_cross_jurisdiction]',
    style: { 'border-width': 3, 'border-style': 'dashed', 'border-color': '#ccff00' },
  },
  {
    selector: 'edge',
    style: {
      'line-color': '#475569', 'curve-style': 'bezier', 'target-arrow-shape': 'triangle',
      'target-arrow-color': '#475569', 'arrow-scale': 0.6,
      width: 'mapData(amount_inr, 0, 1500000, 1, 4)',
    },
  },
];

export default function FraudNetworkGraph() {
  const { graph, intelligence, analyzing, analyze } = useGraphData();
  const [selected, setSelected] = useState<any>(null);

  const elements = graph ? [...graph.nodes, ...graph.edges] : [];

  return (
    <div className="h-full flex">
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
          <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/70">
            Link Analysis: {intelligence?.operation_name || 'OPERATION PHANTOM'}
          </p>
          <div className="flex gap-2">
            <button
              onClick={analyze}
              disabled={analyzing}
              className="text-[10px] font-mono bg-[#ccff00] text-black font-bold hover:bg-[#ccff00]/90 disabled:opacity-50 rounded px-3 py-1 transition-colors"
            >
              {analyzing ? 'ANALYZING…' : 'RUN ANALYSIS'}
            </button>
            <button className="text-[10px] font-mono border border-white/20 hover:border-white/40 rounded px-3 py-1 text-white/70 transition-colors">
              Open Graph DB
            </button>
          </div>
        </div>
        <div className="flex-1 relative">
          {elements.length > 0 && (
            <CytoscapeComponent
              elements={elements as any}
              stylesheet={STYLESHEET}
              layout={{ name: 'cose', animate: false, nodeRepulsion: () => 8000 } as any}
              style={{ width: '100%', height: '100%' }}
              cy={(cy: any) => {
                cy.off('tap', 'node');
                cy.on('tap', 'node', (e: any) => setSelected(e.target.data()));
              }}
            />
          )}
          {/* Legend Overlay */}
          <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur border border-white/10 rounded-lg p-3 text-[10px] text-white/70 space-y-2 pointer-events-none">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>Fraud Compound (size 40)</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div>Suspect Phone (size 25)</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>Mule Account (size 22)</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#8b5cf6]"></div>IP Address (size 18)</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-dashed border-[#ccff00] rounded-full"></div>Cross-Jurisdiction</div>
          </div>
        </div>
      </div>

      {/* Node / intelligence details panel */}
      <div className="w-[240px] border-l border-white/10 p-3 overflow-y-auto panel-scroll text-xs">
        {selected ? (
          <>
            <p className="font-bold text-white/80">{selected.label}</p>
            <p className="font-mono text-[10px] text-white/50 mt-1 uppercase">{selected.node_type}</p>
            <div className="mt-3 space-y-1.5 text-white/50">
              <p>City: <span className="text-white/80">{selected.city || '—'}</span></p>
              <p>PageRank: <span className="text-white/80">{Number(selected.pagerank_score || 0).toFixed(4)}</span></p>
              {selected.is_cross_jurisdiction && (
                <div className="mt-2 border border-[#ccff00]/40 bg-[#ccff00]/10 rounded p-2">
                  <p className="text-[#ccff00] font-mono text-[10px] font-bold">⚠ CROSS-JURISDICTION RING</p>
                  <p className="text-white/70 mt-1">Linked states: {(selected.linked_states || []).join(', ')}</p>
                </div>
              )}
            </div>
          </>
        ) : intelligence ? (
          <>
            <p className="font-bold text-white/80">{intelligence.operation_name}</p>
            <div className="mt-2 space-y-1.5 text-white/50">
              <p>Ring type: <span className="text-white/80">{intelligence.ring_type}</span></p>
              <p>Priority: <span className="text-red-400 font-bold">{intelligence.investigation_priority}</span></p>
              <p>Exposure: <span className="text-white/80">₹{((intelligence.financial_exposure_inr || 0) / 10_000_000).toFixed(1)} Cr</span></p>
              <p>Cross-border: <span className="text-white/80">{intelligence.cross_border_indicators ? 'Yes' : 'No'}</span></p>
              <p className="leading-snug mt-2">{intelligence.primary_hub_analysis}</p>
              <p className="font-mono text-[10px] mt-2">Agencies: {(intelligence.recommended_agencies || []).join(', ')}</p>
            </div>
          </>
        ) : (
          <p className="text-white/40">Tap a node for details, or run analysis for an AI intelligence report.</p>
        )}
      </div>
    </div>
  );
}
