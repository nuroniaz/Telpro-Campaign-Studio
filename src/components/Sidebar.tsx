import React, { useState } from 'react';
import {
  LayoutDashboard,
  Target,
  Compass,
  Sparkles,
  ShieldCheck,
  Rocket,
  BarChart3,
  Settings,
  ChevronRight,
  TrendingUp,
  Calendar,
  Layers,
  FileCheck,
  Megaphone,
  Database,
  Briefcase,
  History,
  Coins,
  Cpu,
  BookmarkCheck,
  BrainCircuit,
  FileText
} from 'lucide-react';

export type NavTab =
  | 'home-dashboard'
  | 'strategy-context'
  | 'strategy-monthly'
  | 'strategy-campaigns'
  | 'strategy-contentplan'
  | 'intel-radar'
  | 'intel-hashtags'
  | 'intel-audio'
  | 'intel-events'
  | 'intel-opportunities'
  | 'intel-evidence'
  | 'content-aipartner'
  | 'content-studio'
  | 'content-discoverability'
  | 'content-creativetrend'
  | 'content-production'
  | 'content-assets'
  | 'gov-factcheck'
  | 'gov-brandqa'
  | 'gov-risk'
  | 'gov-approvals'
  | 'gov-sla'
  | 'gov-budget'
  | 'act-publishing'
  | 'act-calendar'
  | 'act-ads'
  | 'act-acquisition'
  | 'perf-content'
  | 'perf-ads'
  | 'perf-diagnosis'
  | 'perf-learning'
  | 'perf-memory'
  | 'perf-report'
  | 'sys-profile'
  | 'sys-integrations'
  | 'sys-audit';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupKey: string) => {
    setCollapsedGroups(prev => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  const navGroups = [
    {
      key: '01-home',
      title: '01. HOME',
      icon: LayoutDashboard,
      items: [
        { id: 'home-dashboard' as NavTab, label: 'Dashboard Snapshot', icon: LayoutDashboard }
      ]
    },
    {
      key: '02-strategy',
      title: '02. STRATEGY & PLANNING',
      icon: Target,
      items: [
        { id: 'strategy-context' as NavTab, label: 'Business & Brand Context', icon: Briefcase },
        { id: 'strategy-monthly' as NavTab, label: 'Setup Bulanan', icon: Calendar },
        { id: 'strategy-campaigns' as NavTab, label: 'Rencana Campaign', icon: Layers },
        { id: 'strategy-contentplan' as NavTab, label: 'Rencana Konten', icon: FileText }
      ]
    },
    {
      key: '03-intelligence',
      title: '03. INTELLIGENCE',
      icon: Compass,
      badge: 'Live Radar',
      items: [
        { id: 'intel-radar' as NavTab, label: 'Trend Radar', icon: TrendingUp },
        { id: 'intel-hashtags' as NavTab, label: 'Trending Hashtag', icon: Target },
        { id: 'intel-audio' as NavTab, label: 'Trending Audio (Rights)', icon: Sparkles },
        { id: 'intel-events' as NavTab, label: 'Event Calendar & Revalidation', icon: Calendar },
        { id: 'intel-opportunities' as NavTab, label: 'Opportunity Board', icon: BookmarkCheck },
        { id: 'intel-evidence' as NavTab, label: 'Evidence & Sources', icon: FileCheck }
      ]
    },
    {
      key: '04-content',
      title: '04. CONTENT & PRODUCTION',
      icon: Sparkles,
      badge: 'Agentic AI',
      items: [
        { id: 'content-aipartner' as NavTab, label: 'TELPRO AI Content Partner', icon: BrainCircuit },
        { id: 'content-studio' as NavTab, label: 'Creative Studio', icon: Sparkles },
        { id: 'content-discoverability' as NavTab, label: 'Discoverability Optimizer', icon: Target },
        { id: 'content-creativetrend' as NavTab, label: 'Creative Trend Optimizer', icon: Cpu },
        { id: 'content-production' as NavTab, label: 'Production Plan & Shot List', icon: Layers },
        { id: 'content-assets' as NavTab, label: 'Asset Library & Drive Sync', icon: Database }
      ]
    },
    {
      key: '05-governance',
      title: '05. GOVERNANCE',
      icon: ShieldCheck,
      items: [
        { id: 'gov-factcheck' as NavTab, label: 'Fact & Evidence Check', icon: FileCheck },
        { id: 'gov-brandqa' as NavTab, label: 'Brand & Creative QA', icon: ShieldCheck },
        { id: 'gov-risk' as NavTab, label: 'Risk Assessment', icon: ShieldCheck },
        { id: 'gov-approvals' as NavTab, label: 'Review & Approval Matrix', icon: BookmarkCheck },
        { id: 'gov-sla' as NavTab, label: 'SLA & Reminder Alerts', icon: History },
        { id: 'gov-budget' as NavTab, label: 'Anggaran & Biaya (Ledger)', icon: Coins }
      ]
    },
    {
      key: '06-activation',
      title: '06. ACTIVATION',
      icon: Rocket,
      items: [
        { id: 'act-publishing' as NavTab, label: 'Publishing Queue', icon: Rocket },
        { id: 'act-calendar' as NavTab, label: 'Content Calendar', icon: Calendar },
        { id: 'act-ads' as NavTab, label: 'Weekly Ads / Paid Media', icon: Megaphone },
        { id: 'act-acquisition' as NavTab, label: 'Acquisition & Funnel', icon: TrendingUp }
      ]
    },
    {
      key: '07-performance',
      title: '07. PERFORMANCE & LEARNING',
      icon: BarChart3,
      items: [
        { id: 'perf-content' as NavTab, label: 'Kinerja Konten', icon: BarChart3 },
        { id: 'perf-ads' as NavTab, label: 'Paid Media Performance', icon: TrendingUp },
        { id: 'perf-diagnosis' as NavTab, label: 'Campaign Diagnosis', icon: BrainCircuit },
        { id: 'perf-learning' as NavTab, label: 'Learning & Next Action', icon: BookmarkCheck },
        { id: 'perf-memory' as NavTab, label: 'Content Memory (Vector Store)', icon: Database },
        { id: 'perf-report' as NavTab, label: 'Management Report (PDF)', icon: FileText }
      ]
    },
    {
      key: '08-system',
      title: '08. SYSTEM',
      icon: Settings,
      items: [
        { id: 'sys-profile' as NavTab, label: 'Business & Brand Profile', icon: Briefcase },
        { id: 'sys-integrations' as NavTab, label: 'Integrations Manager', icon: Cpu },
        { id: 'sys-audit' as NavTab, label: 'Immutable Audit Trail', icon: History }
      ]
    }
  ];

  return (
    <aside id="app-navigation-sidebar" className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col shrink-0 select-none overflow-y-auto custom-scrollbar">
      <div className="p-3 space-y-1">
        {navGroups.map(group => {
          const isCollapsed = collapsedGroups[group.key];
          const GroupIcon = group.icon;

          return (
            <div key={group.key} className="mb-2">
              <button
                onClick={() => toggleGroup(group.key)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 transition-colors text-[11px] font-bold tracking-wider"
              >
                <div className="flex items-center gap-2">
                  <GroupIcon className="w-3.5 h-3.5 text-rose-400" />
                  <span>{group.title}</span>
                </div>
                <div className="flex items-center gap-1">
                  {group.badge && (
                    <span className="text-[9px] bg-rose-950/80 text-rose-300 px-1.5 py-0.2 rounded border border-rose-800/60 font-medium">
                      {group.badge}
                    </span>
                  )}
                  <ChevronRight className={`w-3 h-3 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-90'}`} />
                </div>
              </button>

              {!isCollapsed && (
                <div className="mt-1 ml-2 pl-2 border-l border-slate-800 space-y-0.5">
                  {group.items.map(item => {
                    const ItemIcon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                      <button
                        key={item.id}
                        id={`nav-item-${item.id}`}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-2 transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-rose-600/30 to-indigo-600/20 text-rose-200 font-semibold border border-rose-500/40 shadow-sm'
                            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                        }`}
                      >
                        <ItemIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-rose-400' : 'text-slate-500'}`} />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
