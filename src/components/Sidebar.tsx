import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ROLE_PERMISSIONS } from '../utils/rbac';
import {
  LayoutDashboard,
  Target,
  FileCheck,
  Compass,
  FileText,
  ShieldCheck,
  Rocket,
  BarChart3,
  Settings,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  Eye,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  BookmarkCheck,
  Database,
  History,
  Briefcase,
  Cpu,
  Hash,
  LayoutGrid,
  Radio,
  Music,
  Search,
  Zap,
  LogIn,
  LogOut,
  Megaphone,
  Lock,
  MapPin,
  Award,
  Building2,
  Inbox
} from 'lucide-react';

export type NavTab =
  | 'login-apps'
  | 'content-schedule'
  | 'content-ai'
  | 'content-approval'
  | 'content-publish'
  | 'content-postpublish'
  | 'ref-trends'
  | 'ref-ads'
  | 'ref-geo'
  | 'analytics-internal'
  | 'home-dashboard'
  | 'strategy-context'
  | 'strategy-monthly'
  | 'strategy-campaigns'
  | 'strategy-contentplan'
  | 'strategy-budget'
  | 'intel-dashboard'
  | 'intel-topics'
  | 'intel-radar'
  | 'intel-audio'
  | 'intel-hashtags'
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
  | 'sys-audit'
  | 'sys-stresstest';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { activeUser, logout } = useApp();
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const userPerms = ROLE_PERMISSIONS[activeUser.role] || ROLE_PERMISSIONS['ROLE_MARCOM_CREATOR'];

  const toggleGroup = (groupKey: string) => {
    setCollapsedGroups(prev => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  // Dynamically tailor navigation groups based on activeUser.role
  const getNavGroupsForRole = () => {
    // 1. Regional Creator: Opsi B - Struktur Minimalis & Ringkas
    if (activeUser.role === 'ROLE_REGIONAL_CREATOR') {
      return [
        {
          key: '01-regional-content',
          title: 'KONTEN REGIONAL',
          icon: MapPin,
          iconBg: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
          titleColor: 'text-emerald-950 font-black',
          activeItemStyle: 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-300 shadow-xs',
          items: [
            { id: 'content-schedule' as NavTab, label: 'Kelola Usulan Konten', icon: Inbox, isHighlight: true },
            { id: 'act-calendar' as NavTab, label: 'Kalender Tayang', icon: Calendar }
          ]
        },
        {
          key: '02-reference',
          title: 'RISET & INSPIRASI',
          icon: Compass,
          iconBg: 'bg-sky-100 text-sky-700 border border-sky-200',
          titleColor: 'text-sky-950 font-black',
          activeItemStyle: 'bg-sky-50 text-sky-700 font-bold border border-sky-200 shadow-xs',
          items: [
            { id: 'ref-trends' as NavTab, label: 'Trend Finder (10 Sektor)', icon: Compass, isHighlight: true }
          ]
        },
        {
          key: '03-analytics',
          title: 'PERFORMA',
          icon: BarChart3,
          iconBg: 'bg-teal-100 text-teal-700 border border-teal-200',
          titleColor: 'text-teal-950 font-black',
          activeItemStyle: 'bg-teal-50 text-teal-800 font-bold border border-teal-200 shadow-xs',
          items: [
            { id: 'analytics-internal' as NavTab, label: 'Kinerja Konten Regional', icon: BarChart3 }
          ]
        }
      ];
    }

    // 2. Approver Roles: VP Corsec, Plt. Direktur Utama (Final Approver)
    if (activeUser.role === 'ROLE_VP_CORSEC' || activeUser.role === 'ROLE_FINAL_APPROVER' || activeUser.role === 'ROLE_JOINT_REVIEWER') {
      const approvalTitle =
        activeUser.role === 'ROLE_VP_CORSEC'
          ? 'Otorisasi VP Corsec (Tahap 2)'
          : activeUser.role === 'ROLE_FINAL_APPROVER'
          ? 'Otorisasi Plt. Dirut (Final Sign-off)'
          : 'Antrean Review Konten';

      return [
        {
          key: '01-approval',
          title: '1. GOVERNANCE & PERSETUJUAN',
          icon: ShieldCheck,
          iconBg: 'bg-rose-100 text-rose-700 border border-rose-300',
          titleColor: 'text-rose-950 font-black',
          activeItemStyle: 'bg-rose-50 text-rose-800 font-bold border border-rose-300 shadow-xs',
          items: [
            { id: 'content-approval' as NavTab, label: approvalTitle, icon: ShieldCheck, isHighlight: true },
            { id: 'content-schedule' as NavTab, label: 'Monitoring Kalender Tayang', icon: Calendar }
          ]
        },
        {
          key: '02-analytics',
          title: '2. RISIKO & KEPATUHAN SLA',
          icon: BarChart3,
          iconBg: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
          titleColor: 'text-indigo-950 font-black',
          activeItemStyle: 'bg-indigo-50 text-indigo-800 font-bold border border-indigo-200 shadow-xs',
          items: [
            { id: 'analytics-internal' as NavTab, label: 'Dashboard Analitik & Risiko SLA', icon: Lock },
            { id: 'ref-trends' as NavTab, label: 'Trend Finder & Bukti Fakta', icon: Compass }
          ]
        }
      ];
    }

    // 3. Performance Analyst
    if (activeUser.role === 'ROLE_PERFORMANCE_ANALYST' || activeUser.role === 'ROLE_ANALYST_QA') {
      return [
        {
          key: '01-analytics',
          title: '1. ANALITICS & METRIK',
          icon: BarChart3,
          iconBg: 'bg-cyan-100 text-cyan-800 border border-cyan-300',
          titleColor: 'text-cyan-950 font-black',
          activeItemStyle: 'bg-cyan-50 text-cyan-800 font-bold border border-cyan-300 shadow-xs',
          items: [
            { id: 'analytics-internal' as NavTab, label: 'Analitics Konten (Internal)', icon: Lock, isHighlight: true },
            { id: 'ref-geo' as NavTab, label: 'Generative Engine Optimization', icon: Cpu }
          ]
        },
        {
          key: '02-reference',
          title: '2. INTELIJEN PASAR',
          icon: Compass,
          iconBg: 'bg-sky-100 text-sky-700 border border-sky-200',
          titleColor: 'text-sky-950 font-black',
          activeItemStyle: 'bg-sky-50 text-sky-700 font-bold border border-sky-200 shadow-xs',
          items: [
            { id: 'ref-trends' as NavTab, label: 'Trend Finder (10 Sektor)', icon: Compass },
            { id: 'content-schedule' as NavTab, label: 'Riwayat Jadwal Publikasi', icon: Calendar }
          ]
        }
      ];
    }

    // 4. System Admin
    if (activeUser.role === 'ROLE_SYSTEM_ADMIN') {
      return [
        {
          key: '01-system',
          title: '1. TATA KELOLA SISTEM',
          icon: Settings,
          iconBg: 'bg-red-100 text-red-800 border border-red-300',
          titleColor: 'text-red-950 font-black',
          activeItemStyle: 'bg-red-50 text-red-800 font-bold border border-red-300 shadow-xs',
          items: [
            { id: 'sys-integrations' as NavTab, label: 'Pengaturan Integrasi & SSO', icon: Settings, isHighlight: true },
            { id: 'sys-audit' as NavTab, label: 'Audit Trail & Log Keamanan', icon: ShieldCheck },
            { id: 'sys-stresstest' as NavTab, label: 'Stress Test Platform SLA', icon: Zap }
          ]
        },
        {
          key: '02-monitoring',
          title: '2. MONITOR OPERASIONAL',
          icon: BarChart3,
          iconBg: 'bg-slate-100 text-slate-700 border border-slate-200',
          titleColor: 'text-slate-900 font-black',
          activeItemStyle: 'bg-slate-50 text-slate-700 font-bold border border-slate-200 shadow-xs',
          items: [
            { id: 'analytics-internal' as NavTab, label: 'Status Operasional Sistem', icon: BarChart3 }
          ]
        }
      ];
    }

    // 5. Corcomm Creator (Co-Governance & Corporate Narrative)
    if (activeUser.role === 'ROLE_CORCOMM_CREATOR') {
      return [
        {
          key: '01-corcomm',
          title: '1. CO-GOVERNANCE & KONTEN PR',
          icon: Building2,
          iconBg: 'bg-blue-100 text-blue-700 border border-blue-200',
          titleColor: 'text-blue-950 font-black',
          activeItemStyle: 'bg-blue-50 text-blue-800 font-bold border border-blue-200 shadow-xs',
          items: [
            { id: 'content-schedule' as NavTab, label: 'Content Planner & Co-Governance', icon: Calendar, isHighlight: true },
            { id: 'content-ai' as NavTab, label: 'Studio Pembuatan Konten AI', icon: Sparkles },
            { id: 'content-approval' as NavTab, label: 'Review Kepatuhan & Brand Safety', icon: ShieldCheck },
            { id: 'content-postpublish' as NavTab, label: 'Pasca-Tayang & Evaluasi', icon: TrendingUp }
          ]
        },
        {
          key: '02-reference',
          title: '2. MONITORING REPUTASI & ISU',
          icon: Compass,
          iconBg: 'bg-sky-100 text-sky-700 border border-sky-200',
          titleColor: 'text-sky-950 font-black',
          activeItemStyle: 'bg-sky-50 text-sky-700 font-bold border border-sky-200 shadow-xs',
          items: [
            { id: 'ref-trends' as NavTab, label: 'Trend Finder & Isu Industri', icon: Compass }
          ]
        },
        {
          key: '03-analytics-corcomm',
          title: '3. ANALITIK REPUTASI',
          icon: BarChart3,
          iconBg: 'bg-blue-100 text-blue-700 border border-blue-200',
          titleColor: 'text-blue-950 font-black',
          activeItemStyle: 'bg-blue-50 text-blue-800 font-bold border border-blue-200 shadow-xs',
          items: [
            { id: 'analytics-internal' as NavTab, label: 'Performa Akun @telkomproperty', icon: BarChart3, isHighlight: true }
          ]
        }
      ];
    }

    // 6. Marcomm Creator (B2B Lead Generation & Product Growth @telprodico)
    return [
      {
        key: '01-create',
        title: '1. CONTENT PLANNER & STUDIO',
        icon: Sparkles,
        iconBg: 'bg-teal-100 text-teal-700 border border-teal-200',
        titleColor: 'text-teal-950 font-black',
        activeItemStyle: 'bg-teal-50 text-teal-800 font-bold border border-teal-200 shadow-xs',
        items: [
          {
            id: 'content-schedule' as NavTab,
            label: 'Content Planner & Kalender B2B',
            icon: Calendar,
            isHighlight: true
          },
          { id: 'content-ai' as NavTab, label: 'Buat Konten AI & Generator Copy', icon: Sparkles },
          { id: 'content-approval' as NavTab, label: 'Review Bersama & Verifikasi', icon: ShieldCheck },
          { id: 'content-publish' as NavTab, label: 'Publikasi Konten', icon: Rocket }
        ]
      },
      {
        key: '02-regional-curation',
        title: '2. KURASI USULAN DAERAH',
        icon: Inbox,
        iconBg: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
        titleColor: 'text-emerald-950 font-black',
        activeItemStyle: 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-300 shadow-xs',
        items: [
          {
            id: 'content-schedule' as NavTab,
            label: 'Inbox Usulan Komersial (@telprodico)',
            icon: Inbox,
            isHighlight: true
          },
          { id: 'ref-trends' as NavTab, label: 'Trend Finder (10 Sektor B2B)', icon: Compass }
        ]
      },
      {
        key: '03-analytics',
        title: '3. PERFORMA & LEADS B2B',
        icon: BarChart3,
        iconBg: 'bg-teal-100 text-teal-700 border border-teal-200',
        titleColor: 'text-teal-950 font-black',
        activeItemStyle: 'bg-teal-50 text-teal-800 font-bold border border-teal-200 shadow-xs',
        items: [
          { id: 'analytics-internal' as NavTab, label: 'Analisis Engagement & Leads Tracker', icon: BarChart3, isHighlight: true },
          { id: 'content-postpublish' as NavTab, label: 'Evaluasi Pasca-Tayang & ROI', icon: TrendingUp },
          { id: 'ref-ads' as NavTab, label: 'Ads (Referensi Iklan B2B)', icon: Megaphone }
        ]
      }
    ];
  };

  const navGroups = getNavGroupsForRole();

  return (
    <aside id="app-navigation-sidebar" className="w-64 bg-white/95 backdrop-blur border-r border-slate-200 text-slate-700 flex flex-col shrink-0 select-none overflow-y-auto custom-scrollbar shadow-sm">
      {/* Active Role Status Indicator - Hidden for Regional Creator to keep sidebar clean & elevated */}
      {activeUser.role !== 'ROLE_REGIONAL_CREATOR' && (
        <div className="p-3 border-b border-slate-200 bg-gradient-to-r from-slate-50 via-rose-50/20 to-slate-50 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
            <span>Otoritas Role Aktif:</span>
            <span className="font-mono text-rose-600 font-bold">{activeUser.role.replace('ROLE_', '')}</span>
          </div>

          <div className="text-xs font-semibold text-slate-800 flex items-center justify-between gap-1.5">
            {userPerms.allowedActions.isReadOnly ? (
              <span className="flex items-center gap-1 text-amber-700 text-[10px] bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-medium">
                <Eye className="w-3 h-3 shrink-0" /> Akses View-Only
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-700 text-[10px] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded truncate font-medium">
                <CheckCircle2 className="w-3 h-3 shrink-0 text-emerald-600" /> {userPerms.roleName}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="p-3 space-y-2 flex-1">
        {navGroups.map(group => {
          const isCollapsed = collapsedGroups[group.key] ?? false;
          const GroupIcon = group.icon;

          return (
            <div key={group.key} className="mb-2">
              <button
                onClick={() => toggleGroup(group.key)}
                className="w-full text-left flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-slate-100 transition-colors text-[11px] font-bold tracking-wider"
              >
                <div className="flex items-center gap-2 text-left min-w-0">
                  <span className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 ${group.iconBg}`}>
                    <GroupIcon className="w-3 h-3" />
                  </span>
                  <span className={`truncate text-xs ${group.titleColor}`}>{group.title}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-1">
                  <ChevronRight className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-90'}`} />
                </div>
              </button>

              {!isCollapsed && (
                <div className="mt-1 ml-2.5 pl-2.5 border-l-2 border-slate-200 space-y-0.5">
                  {group.items.map(item => {
                    const ItemIcon = item.icon;
                    const isActive = activeTab === item.id;
                    const isHighlight = (item as any).isHighlight;

                    return (
                      <button
                        key={item.id}
                        id={`nav-item-${item.id}`}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                          isActive
                            ? group.activeItemStyle
                            : isHighlight
                            ? 'bg-rose-50/70 hover:bg-rose-100/80 text-rose-700 border border-rose-200 font-semibold'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <ItemIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-current font-bold' : isHighlight ? 'text-rose-600' : 'text-slate-400'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {isHighlight && (
                          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom User Session & Logout Footer */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/90 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
              {activeUser.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-800 truncate">{activeUser.name}</div>
              <div className="text-[10px] text-slate-500 truncate">{activeUser.businessUnit}</div>
            </div>
          </div>
        </div>

        {/* Action buttons: Stress Test & Keluar */}
        <div className="space-y-1 pt-1">
          {activeUser.role === 'ROLE_SYSTEM_ADMIN' && (
            <button
              onClick={() => setActiveTab('sys-stresstest')}
              className={`w-full px-2 py-1.5 rounded-xl text-[11px] flex items-center justify-between text-indigo-900 bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-200 font-bold transition-colors cursor-pointer ${
                activeTab === 'sys-stresstest' ? 'ring-2 ring-indigo-400 bg-indigo-100' : ''
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-indigo-600" />
                <span>Stress Test Platform</span>
              </div>
              <span className="text-[9px] bg-indigo-200/70 text-indigo-800 px-1.5 py-0.2 rounded font-mono">SLA</span>
            </button>
          )}

          <button
            type="button"
            onClick={logout}
            className="w-full py-1.5 px-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-[0.99]"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-600" />
            <span>Keluar (Log Out)</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
