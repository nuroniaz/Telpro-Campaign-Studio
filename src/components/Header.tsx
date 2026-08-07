import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { NavTab } from './Sidebar';
import { 
  Building2, 
  ChevronDown, 
  Bell, 
  Search, 
  ShieldCheck, 
  Radio, 
  Sparkles,
  Layers,
  UserCheck,
  Trash2,
  RotateCcw,
  ArrowRight
} from 'lucide-react';

interface HeaderProps {
  setActiveTab?: (tab: NavTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ setActiveTab }) => {
  const {
    campaigns,
    selectedCampaignId,
    setSelectedCampaignId,
    activeUser,
    setActiveUserRole,
    users,
    approvals,
    integrations,
    clearAllDummyData,
    restoreDemoData
  } = useApp();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);

  const pendingApprovals = approvals.filter(a => a.decision === 'Pending');
  const connectedIntegrations = integrations.filter(i => i.status === 'CONNECTED').length;

  const roleColors: Record<UserRole, string> = {
    'ROLE_MARCOM_CREATOR': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    'ROLE_ANALYST_QA': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    'ROLE_PUBLISHER': 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    'ROLE_MANAGER_MARKETING': 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    'ROLE_VP_MARKETING': 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    'ROLE_VP_CORSEC': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    'ROLE_FINAL_APPROVER': 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    'ROLE_MANAGEMENT_VIEWER': 'bg-slate-500/20 text-slate-300 border-slate-500/40',
    'ROLE_SYSTEM_ADMIN': 'bg-red-500/20 text-red-300 border-red-500/40'
  };

  const currentCampaign = campaigns.find(c => c.id === selectedCampaignId) || campaigns[0];

  return (
    <div className="flex flex-col z-40">
      {/* Global Explicit Demo / Simulation Mode Banner (Redesign V2 - Section 18 & UXD-06) */}
      <div className="bg-amber-950/90 text-amber-200 border-b border-amber-800/80 px-4 py-1 text-[11px] font-semibold flex items-center justify-between shadow-inner">
        <div className="flex items-center gap-2 min-w-0">
          <span className="px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 font-bold text-[9px] uppercase tracking-wider shrink-0">
            {campaigns.length === 0 ? 'CLEAN E2E TEST MODE' : 'DEMO MODE'}
          </span>
          <span className="truncate">
            {campaigns.length === 0 
              ? 'Semua data dummy telah dikosongkan. Anda dapat menguji seluruh workflow dari awal secara End-to-End.'
              : 'Sebagian data pada versi ini digunakan untuk simulasi workflow. Anda dapat mengosongkannya untuk test E2E.'}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[10px] shrink-0">
          {campaigns.length > 0 ? (
            <button
              onClick={() => {
                if (window.confirm('Kosongkan semua data dummy? Seluruh campaign, trend, dan konten akan di-reset menjadi kosong untuk pengujian E2E dari awal.')) {
                  clearAllDummyData();
                }
              }}
              className="px-2.5 py-0.5 rounded bg-rose-900/80 hover:bg-rose-800 border border-rose-700/80 text-rose-100 font-bold flex items-center gap-1 transition-colors shadow-sm"
              title="Kosongkan Data Dummy untuk Mulai Pengujian End-to-End"
            >
              <Trash2 className="w-3 h-3 text-rose-300" />
              Kosongkan Data Dummy
            </button>
          ) : (
            <button
              onClick={() => restoreDemoData()}
              className="px-2.5 py-0.5 rounded bg-emerald-800 hover:bg-emerald-700 border border-emerald-600 text-emerald-100 font-bold flex items-center gap-1 transition-colors shadow-sm animate-pulse"
              title="Isi Kembali Data Contoh Demo"
            >
              <RotateCcw className="w-3 h-3 text-emerald-300" />
              Pulihkan Data Demo
            </button>
          )}
        </div>
      </div>

      {/* Main Header Bar */}
      <header id="app-global-header" className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-white px-5 py-2.5 flex items-center justify-between gap-4 shadow-lg">
        {/* Left: Brand & Campaign Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 via-pink-600 to-indigo-600 flex items-center justify-center font-bold text-lg shadow-md shadow-rose-900/30 ring-1 ring-white/20">
              T
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold tracking-wide text-sm bg-gradient-to-r from-white via-slate-100 to-rose-200 bg-clip-text text-transparent">
                Telpro <span className="text-rose-400 font-extrabold text-xs">Campaign Studio</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Campaign Intelligence & Execution OS</div>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800 hidden md:block mx-1" />

          {/* Campaign Switcher Dropdown */}
          <div className="relative hidden md:flex items-center gap-2">
            <label id="campaign-switcher-label" htmlFor="campaign-select" className="text-xs text-slate-400 flex items-center gap-1 shrink-0 font-medium">
              <Layers className="w-3.5 h-3.5 text-rose-400" />
              Campaign:
            </label>
            <select
              id="campaign-select"
              value={selectedCampaignId}
              onChange={(e) => setSelectedCampaignId(e.target.value)}
              className="bg-slate-950 border border-slate-700/80 hover:border-rose-500/50 text-slate-200 text-xs rounded-lg px-3 py-1.5 pr-8 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium cursor-pointer transition-colors max-w-[220px] truncate"
            >
              {campaigns.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-sm mx-2">
          <button
            id="global-search-trigger-btn"
            onClick={() => setShowSearchModal(true)}
            className="w-full bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 px-3.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors shadow-inner"
          >
            <span className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="truncate">Cari Campaign, Trend, Opportunity...</span>
            </span>
            <kbd className="bg-slate-800 text-slate-400 text-[10px] px-1.5 py-0.5 rounded font-mono border border-slate-700 shrink-0 ml-2">⌘K</kbd>
          </button>
        </div>

        {/* Right Actions: Integration Pill, SLA Notifs, Role Switcher */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Integration Status Badge */}
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] bg-slate-950 border border-emerald-900/50 text-emerald-400 px-2.5 py-1 rounded-full">
            <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
            <span>{connectedIntegrations}/{integrations.length} Live Sync</span>
          </div>

          {/* SLA Notifications Button */}
          <div className="relative">
            <button
              id="sla-notification-bell-btn"
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 relative transition-colors"
              title="Antrean Approval & SLA Warning"
            >
              <Bell className="w-4 h-4" />
              {pendingApprovals.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {pendingApprovals.length}
                </span>
              )}
            </button>

            {/* Notif Dropdown */}
            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 text-xs z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                  <span className="font-bold text-slate-100 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-rose-400" />
                    Peringatan SLA & Antrean Review ({pendingApprovals.length})
                  </span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {pendingApprovals.length === 0 ? (
                    <p className="text-slate-400 text-center py-4">Semua antrean approval bersih!</p>
                  ) : (
                    pendingApprovals.map(a => (
                      <button
                        key={a.id}
                        onClick={() => {
                          if (setActiveTab) setActiveTab('gov-approvals');
                          setShowNotifDropdown(false);
                        }}
                        className="w-full text-left p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-700/80 hover:bg-slate-900 transition-all group cursor-pointer block"
                      >
                        <div className="flex items-center justify-between font-semibold text-rose-300 text-[11px]">
                          <span>{a.stage}</span>
                          <span className="text-[10px] text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/50">
                            Due: {new Date(a.dueAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-300 text-[11px] mt-1 font-medium group-hover:text-white transition-colors">
                          Content Version #{a.contentVersionId}
                        </p>
                        <div className="flex items-center justify-between mt-1 text-[10px]">
                          <span className="text-slate-500">Role: {a.reviewerRole}</span>
                          <span className="text-rose-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                            Proses <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>

                {pendingApprovals.length > 0 && (
                  <div className="pt-2.5 mt-2 border-t border-slate-800">
                    <button
                      onClick={() => {
                        if (setActiveTab) setActiveTab('gov-approvals');
                        setShowNotifDropdown(false);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow flex items-center justify-center gap-1.5 transition-all"
                    >
                      <span>🚀 Buka Halaman Approval Queue ({pendingApprovals.length})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Role Switcher */}
          <div className="relative">
            <button
              id="user-role-switcher-btn"
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-xl transition-all shadow-inner"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-[10px] font-bold text-white">
                {activeUser.name.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold text-slate-100 max-w-[120px] truncate">{activeUser.name}</div>
                <div className={`text-[9px] px-1.5 py-0.2 rounded border inline-block mt-0.5 ${roleColors[activeUser.role]}`}>
                  {activeUser.role.replace('ROLE_', '')}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Role Dropdown */}
            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 border-b border-slate-800 text-[11px]">
                  <div className="text-slate-400 font-medium">Pilih Role Akses Pengguna (Simulasi RBAC):</div>
                  <div className="text-slate-200 font-bold mt-0.5">{activeUser.name} ({activeUser.title})</div>
                </div>
                <div className="py-1 space-y-1 max-h-80 overflow-y-auto custom-scrollbar">
                  {users.map(u => (
                    <button
                      key={u.id}
                      onClick={() => {
                        setActiveUserRole(u.role);
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        activeUser.role === u.role ? 'bg-rose-950/70 border border-rose-800 text-rose-200 font-semibold' : 'hover:bg-slate-800/80 text-slate-300'
                      }`}
                    >
                      <div className="pr-2">
                        <div className="font-medium text-slate-100 flex items-center gap-1.5">
                          {u.name}
                          <span className={`text-[9px] px-1.5 py-0.2 rounded border font-mono ${roleColors[u.role]}`}>
                            {u.role.replace('ROLE_', '')}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-normal">{u.title} • {u.businessUnit}</div>
                      </div>
                      {activeUser.role === u.role && <UserCheck className="w-4 h-4 text-rose-400 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Campaign Sub-Context Bar (Spacious 2nd Tier - Redesign V2 Section 6.2 & 6.3) */}
      <div className="bg-slate-950/80 border-b border-slate-800/80 px-5 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Campaign Objective Context */}
        <div className="flex items-center gap-2 text-slate-300 min-w-0 max-w-xl">
          <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] shrink-0">Objective:</span>
          <span className="font-medium text-rose-200 truncate" title={currentCampaign?.businessObjective}>
            {currentCampaign?.businessObjective || 'Awareness & Engagement'}
          </span>
        </div>

        {/* Stage Lifecycle Progress Steps */}
        <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1 rounded-xl border border-slate-800 text-[10px] font-bold">
          <span className="text-emerald-400">✓ Plan</span>
          <span className="text-slate-600">→</span>
          <span className="text-emerald-400">✓ Discover</span>
          <span className="text-slate-600">→</span>
          <span className="text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800 flex items-center gap-1">
            ● Create
          </span>
          <span className="text-slate-600">→</span>
          <span className="text-slate-400">○ Review</span>
          <span className="text-slate-600">→</span>
          <span className="text-slate-400">○ Publish</span>
          <span className="text-slate-600">→</span>
          <span className="text-slate-400">○ Measure</span>
        </div>
      </div>

      {/* Global Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl p-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-3">
              <Search className="w-4 h-4 text-rose-400" />
              <input
                type="text"
                autoFocus
                placeholder="Cari campaign, trend, event, evidence, atau naskah konten..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-slate-100 text-sm focus:outline-none placeholder-slate-500"
              />
              <button
                onClick={() => setShowSearchModal(false)}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-lg"
              >
                ESC
              </button>
            </div>
            <div className="text-xs text-slate-400 py-6 text-center">
              {searchQuery ? `Hasil pencarian untuk "${searchQuery}": Ditemukan 3 item relevan di modul Campaign & Intelligence.` : 'Ketik kata kunci untuk memulai pencarian di seluruh canonical data store.'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
