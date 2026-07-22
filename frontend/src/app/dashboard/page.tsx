'use client';
import { useState } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import KPICards from '@/components/dashboard/KPICards';
import DetectionMetrics from '@/components/dashboard/DetectionMetrics';
import LiveThreatStream from '@/components/dashboard/LiveThreatStream';
import LiveIncidentMap from '@/components/dashboard/LiveIncidentMap';
import PatrolPriority from '@/components/dashboard/PatrolPriority';
import AIThreatAnalysis from '@/components/dashboard/AIThreatAnalysis';
import AgencyCoordination from '@/components/dashboard/AgencyCoordination';
import { useLiveThreats } from '@/hooks/useLiveThreats';
import { Map, Activity } from 'lucide-react';

const TABS = [
  { id: 'situational', label: 'Situational Awareness', icon: Map, desc: 'Live Map · Patrol · KPIs' },
  { id: 'operations', label: 'Operations Center', icon: Activity, desc: 'Threats · Analysis · Agencies' },
] as const;

type TabId = typeof TABS[number]['id'];

export default function DashboardPage() {
  const { threats, isDemoMode, refresh } = useLiveThreats(20);
  const [mapFocus, setMapFocus] = useState<{ lat: number; lng: number } | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('situational');

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a] text-white overflow-hidden">
      <DashboardHeader isDemoMode={isDemoMode} />

      {/* Tab Switcher */}
      <div className="shrink-0 border-b border-white/10 bg-black/30 px-5 flex items-center gap-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-5 py-3 text-sm font-medium transition-all relative ${
                isActive
                  ? 'text-[#ccff00]'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-grotesk font-semibold">{tab.label}</span>
              <span className={`hidden md:inline text-[10px] font-mono ${isActive ? 'text-[#ccff00]/60' : 'text-white/30'}`}>
                {tab.desc}
              </span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ccff00]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'situational' ? (
          /* ═══ TAB 1: Situational Awareness ═══ */
          /* Layout: Left panel (KPIs + Patrol) | Right half (Large Map) */
          <div className="h-full flex overflow-hidden">
            {/* Left Panel — KPIs + Metrics + Patrol Priority */}
            <aside className="w-[340px] shrink-0 border-r border-white/10 flex flex-col overflow-hidden">
              <div className="p-3 space-y-3 overflow-y-auto panel-scroll flex-1">
                <KPICards />
                <DetectionMetrics />
                <PatrolPriority onSelect={(lat, lng) => setMapFocus({ lat, lng })} />
              </div>
            </aside>

            {/* Right — Large Map (takes all remaining space) */}
            <section className="flex-1 relative">
              <LiveIncidentMap focus={mapFocus} />
            </section>
          </div>
        ) : (
          /* ═══ TAB 2: Operations Center ═══ */
          /* Layout: Left (Live Threat Stream) | Right (AI Analysis + Agency Coordination) */
          <div className="h-full flex overflow-hidden">
            {/* Left — Live Threat Feed (full height) */}
            <aside className="w-[380px] shrink-0 border-r border-white/10 overflow-hidden flex flex-col">
              <div className="p-3 overflow-y-auto panel-scroll flex-1">
                <LiveThreatStream threats={threats} onAction={refresh} />
              </div>
            </aside>

            {/* Right — AI Analysis (top) + Agency Coordination (bottom) */}
            <section className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto panel-scroll p-4 border-b border-white/10">
                <AIThreatAnalysis threats={threats} />
              </div>
              <div className="h-[320px] shrink-0 overflow-y-auto panel-scroll">
                <AgencyCoordination />
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
