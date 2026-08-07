import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ROLE_PERMISSIONS } from '../utils/rbac';
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
  FileText,
  Lock,
  CheckCircle2,
  Eye
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
  | 'content-storyboard'
  | 'content-aivideo'
  | 'content-timeline'
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
  const { activeUser } = useApp();
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const userPerms = ROLE_PERMISSIONS[activeUser.role] || ROLE_PERMISSIONS['ROLE_MARCOM_CREATOR'];

  const toggleGroup = (groupKey: string) => {
    setCollapsedGroups(prev => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  const navGroups = [
    {
      key: '01-home',
      title: '01. BERANDA',
      icon: LayoutDashboard,
      roles: ['ROLE_MARCOM_CREATOR', 'ROLE_ANALYST_QA', 'ROLE_PUBLISHER', 'ROLE_MANAGER_MARKETING', 'ROLE_VP_MARKETING', 'ROLE_VP_CORSEC', 'ROLE_FINAL_APPROVER', 'ROLE_MANAGEMENT_VIEWER', 'ROLE_SYSTEM_ADMIN'],
      items: [
        { id: 'home-dashboard' as NavTab, label: 'My Work & Action Center', icon: LayoutDashboard }
      ]
    },
    {
      key: '02-campaign',
      title: '02. CAMPAIGN',
      icon: Target,
      roles: ['ROLE_MARCOM_CREATOR', 'ROLE_MANAGER_MARKETING', 'ROLE_VP_MARKETING', 'ROLE_VP_CORSEC', 'ROLE_FINAL_APPROVER', 'ROLE_MANAGEMENT_VIEWER', 'ROLE_SYSTEM_ADMIN'],
      items: [
        { id: 'strategy-campaigns' as NavTab, label: 'Overview & Campaigns', icon: Layers },
        { id: 'strategy-context' as NavTab, label: 'Strategy & Business Setup', icon: Briefcase },
        { id: 'strategy-contentplan' as NavTab, label: 'Content Plan (List/Board/Calendar)', icon: FileText },
        { id: 'gov-budget' as NavTab, label: 'Anggaran & Biaya (Budget)', icon: Coins }
      ]
    },
    {
      key: '03-discover',
      title: '03. DISCOVER',
      icon: Compass,
      roles: ['ROLE_MARCOM_CREATOR', 'ROLE_ANALYST_QA', 'ROLE_MANAGER_MARKETING', 'ROLE_VP_MARKETING', 'ROLE_SYSTEM_ADMIN'],
      items: [
        { id: 'intel-radar' as NavTab, label: 'Trends (Topic, Keyword, Hashtag, Audio)', icon: TrendingUp },
        { id: 'intel-events' as NavTab, label: 'Events & Revalidation', icon: Calendar },
        { id: 'intel-opportunities' as NavTab, label: 'Opportunity Board', icon: BookmarkCheck },
        { id: 'intel-evidence' as NavTab, label: 'Evidence & Verification Sources', icon: FileCheck }
      ]
    },
    {
      key: '04-create',
      title: '04. CREATE',
      icon: Sparkles,
      roles: ['ROLE_MARCOM_CREATOR', 'ROLE_ANALYST_QA', 'ROLE_MANAGER_MARKETING', 'ROLE_SYSTEM_ADMIN'],
      items: [
        { id: 'content-aipartner' as NavTab, label: 'AI Content Partner', icon: BrainCircuit },
        { id: 'content-studio' as NavTab, label: 'Creative Studio (Brief & Script)', icon: Sparkles },
        { id: 'content-storyboard' as NavTab, label: 'Visual Storyboard Generator', icon: FileText },
        { id: 'content-aivideo' as NavTab, label: 'AI Video Studio', icon: Cpu },
        { id: 'content-timeline' as NavTab, label: 'Video Timeline & Composer', icon: Layers },
        { id: 'content-production' as NavTab, label: 'Production Plan & Shot List', icon: Layers },
        { id: 'content-assets' as NavTab, label: 'Asset Library & Drive Sync', icon: Database },
        { id: 'content-discoverability' as NavTab, label: 'Optimization (Discoverability & Trends)', icon: Target }
      ]
    },
    {
      key: '05-review',
      title: '05. REVIEW & PUBLISH',
      icon: ShieldCheck,
      roles: ['ROLE_MARCOM_CREATOR', 'ROLE_ANALYST_QA', 'ROLE_PUBLISHER', 'ROLE_MANAGER_MARKETING', 'ROLE_VP_MARKETING', 'ROLE_VP_CORSEC', 'ROLE_FINAL_APPROVER', 'ROLE_SYSTEM_ADMIN'],
      items: [
        { id: 'gov-approvals' as NavTab, label: 'My Review Queue & Approval Package', icon: BookmarkCheck },
        { id: 'gov-factcheck' as NavTab, label: 'Fact & Evidence Verification', icon: FileCheck },
        { id: 'gov-brandqa' as NavTab, label: 'Brand & Risk QA', icon: ShieldCheck },
        { id: 'act-publishing' as NavTab, label: 'Schedule & Publishing Queue', icon: Rocket },
        { id: 'act-calendar' as NavTab, label: 'Publishing Calendar', icon: Calendar }
      ]
    },
    {
      key: '06-performance',
      title: '06. PERFORMANCE',
      icon: BarChart3,
      roles: ['ROLE_MARCOM_CREATOR', 'ROLE_ANALYST_QA', 'ROLE_PUBLISHER', 'ROLE_MANAGER_MARKETING', 'ROLE_VP_MARKETING', 'ROLE_VP_CORSEC', 'ROLE_FINAL_APPROVER', 'ROLE_MANAGEMENT_VIEWER', 'ROLE_SYSTEM_ADMIN'],
      items: [
        { id: 'perf-content' as NavTab, label: 'Kinerja Konten & Overview', icon: BarChart3 },
        { id: 'perf-ads' as NavTab, label: 'Paid Media Performance', icon: TrendingUp },
        { id: 'act-acquisition' as NavTab, label: 'Acquisition & Funnel', icon: Target },
        { id: 'perf-diagnosis' as NavTab, label: 'Diagnose & Learn', icon: BrainCircuit },
        { id: 'perf-report' as NavTab, label: 'Management Report (PDF)', icon: FileText }
      ]
    },
    {
      key: '07-admin',
      title: '07. ADMIN',
      icon: Settings,
      roles: ['ROLE_SYSTEM_ADMIN'],
      items: [
        { id: 'sys-profile' as NavTab, label: 'Brand & Business Settings', icon: Briefcase },
        { id: 'sys-integrations' as NavTab, label: 'Integrations Manager', icon: Cpu },
        { id: 'sys-audit' as NavTab, label: 'Audit Aktivitas', icon: History }
      ]
    }
  ];

  return (
    <aside id="app-navigation-sidebar" className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col shrink-0 select-none overflow-y-auto custom-scrollbar">
      {/* Active Role Status Indicator */}
      <div className="p-3 border-b border-slate-800/80 bg-slate-950/60">
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium mb-1">
          <span>Otoritas Role Aktif:</span>
          <span className="font-mono text-rose-400 font-bold">{activeUser.role.replace('ROLE_', '')}</span>
        </div>
        <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
          {userPerms.allowedActions.isReadOnly ? (
            <span className="flex items-center gap-1 text-amber-400 text-[11px] bg-amber-950/80 border border-amber-800/60 px-2 py-0.5 rounded">
              <Eye className="w-3 h-3 shrink-0" /> Akses View-Only (Management)
            </span>
          ) : (
            <span className="flex items-center gap-1 text-emerald-400 text-[11px] bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded truncate">
              <CheckCircle2 className="w-3 h-3 shrink-0 text-emerald-400" /> {userPerms.roleName}
            </span>
          )}
        </div>
      </div>

      <div className="p-3 space-y-1">
        {navGroups.map(group => {
          const isCollapsed = collapsedGroups[group.key];
          const GroupIcon = group.icon;
          const isPrimary = userPerms.primaryModules.includes(group.title) || activeUser.role === 'ROLE_SYSTEM_ADMIN';
          const isViewerOnly = userPerms.allowedActions.isReadOnly || (!isPrimary && activeUser.role !== 'ROLE_SYSTEM_ADMIN');

          return (
            <div key={group.key} className="mb-2">
              <button
                onClick={() => toggleGroup(group.key)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 transition-colors text-[11px] font-bold tracking-wider"
              >
                <div className="flex items-center gap-2">
                  <GroupIcon className={`w-3.5 h-3.5 ${isPrimary ? 'text-rose-400' : 'text-slate-500'}`} />
                  <span className={isPrimary ? 'text-slate-200 font-extrabold' : 'text-slate-400'}>{group.title}</span>
                </div>
                <div className="flex items-center gap-1">
                  {isPrimary && activeUser.role !== 'ROLE_SYSTEM_ADMIN' && activeUser.role !== 'ROLE_MANAGEMENT_VIEWER' && (
                    <span className="text-[9px] bg-rose-950/90 text-rose-300 px-1.5 py-0.2 rounded border border-rose-800/80 font-bold">
                      UTAMA
                    </span>
                  )}
                  {isViewerOnly && (
                    <span className="text-[9px] bg-slate-950 text-slate-400 px-1 py-0.2 rounded border border-slate-800 flex items-center gap-0.5" title="Akses Read-Only untuk Role ini">
                      <Lock className="w-2.5 h-2.5 text-slate-500" /> View
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
                        className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-rose-600/30 to-indigo-600/20 text-rose-200 font-semibold border border-rose-500/40 shadow-sm'
                            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <ItemIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-rose-400' : 'text-slate-500'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>
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
