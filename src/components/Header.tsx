import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { NavTab } from './Sidebar';
import { SparkLogo } from './Common/SparkLogo';
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
  ArrowRight,
  Zap,
  LogOut,
  MapPin,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  X
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
    switchUser,
    approvals,
    integrations,
    clearAllDummyData,
    restoreDemoData,
    logout,
    regionalSubmissions
  } = useApp();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showIntegrationDropdown, setShowIntegrationDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);

  const isRegionalUser = activeUser.role === 'ROLE_REGIONAL_CREATOR';
  const isSystemAdmin = activeUser.role === 'ROLE_SYSTEM_ADMIN';
  const userRegion = activeUser.regionalUnit || 'Regional 1';

  // Only show approvals assigned to the active user's role (admins see all)
  const pendingApprovals = approvals.filter(a => {
    if (a.decision !== 'Pending') return false;
    if (isSystemAdmin) return true;
    return a.reviewerRole === activeUser.role;
  });

  // Regional-specific alerts: check for submissions needing revision or fast-track urgent
  const regionalNeedsRevision = (regionalSubmissions || []).filter(
    s => (s.regional === userRegion || s.picRegional === activeUser.name) && s.currentStatus === 'NEEDS_REVISION'
  );
  const regionalUrgentTrack = (regionalSubmissions || []).filter(
    s => (s.regional === userRegion || s.picRegional === activeUser.name) && s.submissionTrack === 'FAST_TRACK_URGENT' && s.currentStatus === 'SUBMITTED'
  );

  const notifCount = isRegionalUser ? regionalNeedsRevision.length : pendingApprovals.length;

  // Compute urgent alert banner message for the header
  let urgentAlert: {
    isUrgent: boolean;
    title: string;
    description: string;
    actionLabel: string;
    targetTab?: NavTab;
  } = {
    isUrgent: false,
    title: 'Status Aman',
    description: 'Seluruh alur kerja & SLA terpantau sesuai jadwal',
    actionLabel: 'Cek Lonceng'
  };

  if (isRegionalUser) {
    if (regionalNeedsRevision.length > 0) {
      urgentAlert = {
        isUrgent: true,
        title: 'Revisi Diperlukan',
        description: `${regionalNeedsRevision.length} usulan konten butuh perbaikan`,
        actionLabel: 'Tinjau',
        targetTab: 'content-schedule'
      };
    } else if (regionalUrgentTrack.length > 0) {
      urgentAlert = {
        isUrgent: true,
        title: 'Prioritas Regional',
        description: `${regionalUrgentTrack.length} usulan prioritas dalam proses`,
        actionLabel: 'Lihat Status',
        targetTab: 'content-schedule'
      };
    } else {
      urgentAlert = {
        isUrgent: false,
        title: 'Usulan Konten Aman',
        description: `${userRegion} aman, tidak ada revisi`,
        actionLabel: 'Buka Notifikasi'
      };
    }
  } else {
    // Central roles (QA, Manager, VP Corsec, Plt. Dirut, Admin, Corcomm, Marcomm)
    if (pendingApprovals.length > 0) {
      urgentAlert = {
        isUrgent: true,
        title: `Peringatan SLA (${pendingApprovals.length})`,
        description: `${pendingApprovals.length} draf konten menunggu persetujuan`,
        actionLabel: 'Buka Antrean',
        targetTab: 'gov-approvals'
      };
    } else {
      urgentAlert = {
        isUrgent: false,
        title: 'Antrean Bersih',
        description: 'Semua draf dan persetujuan selesai tepat waktu',
        actionLabel: 'Buka Notifikasi'
      };
    }
  }

  const connectedIntegrations = integrations.filter(i => i.status === 'CONNECTED').length;

  const roleColors: Record<UserRole, string> = {
    'ROLE_REGIONAL_CREATOR': 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold',
    'ROLE_MARCOM_CREATOR': 'bg-teal-100 text-teal-800 border-teal-300 font-bold',
    'ROLE_CORCOMM_CREATOR': 'bg-blue-100 text-blue-800 border-blue-300 font-bold',
    'ROLE_JOINT_REVIEWER': 'bg-indigo-100 text-indigo-800 border-indigo-300 font-bold',
    'ROLE_VP_CORSEC': 'bg-purple-100 text-purple-800 border-purple-300 font-bold',
    'ROLE_FINAL_APPROVER': 'bg-pink-100 text-pink-800 border-pink-300 font-bold',
    'ROLE_PERFORMANCE_ANALYST': 'bg-cyan-100 text-cyan-800 border-cyan-300 font-bold',
    'ROLE_ANALYST_QA': 'bg-cyan-100 text-cyan-800 border-cyan-300 font-bold',
    'ROLE_PUBLISHER': 'bg-purple-100 text-purple-800 border-purple-300 font-bold',
    'ROLE_MANAGER_MARKETING': 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
    'ROLE_VP_MARKETING': 'bg-rose-100 text-rose-800 border-rose-300 font-bold',
    'ROLE_MANAGEMENT_VIEWER': 'bg-slate-200 text-slate-800 border-slate-300 font-bold',
    'ROLE_SYSTEM_ADMIN': 'bg-red-100 text-red-800 border-red-300 font-bold'
  };

  const formatRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'ROLE_MARCOM_CREATOR':
        return 'Marcomm (@telprodico)';
      case 'ROLE_CORCOMM_CREATOR':
        return 'Corcomm (@telkomproperty)';
      case 'ROLE_VP_CORSEC':
        return 'VP Corsec';
      case 'ROLE_FINAL_APPROVER':
        return 'Plt. Dirut';
      case 'ROLE_SYSTEM_ADMIN':
        return 'Tim IT & Teknis';
      case 'ROLE_REGIONAL_CREATOR':
        return 'Regional Creator';
      default:
        return role.replace('ROLE_', '');
    }
  };

  const currentCampaign = campaigns.find(c => c.id === selectedCampaignId) || campaigns[0];

  return (
    <div className="flex flex-col z-40">
      {/* Vibrant Top Rainbow Accent Strip */}
      <div className="h-1 w-full bg-gradient-to-r from-red-600 via-rose-500 via-amber-400 via-emerald-500 via-sky-400 to-indigo-600" />

      {/* Global Explicit Demo / Simulation Mode Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-pink-50 text-amber-950 border-b border-amber-200 px-4 py-1.5 text-[11px] font-medium flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2 min-w-0">
          <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-[9px] uppercase tracking-wider shrink-0 shadow-xs">
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
              className="px-2.5 py-0.5 rounded-lg bg-rose-100 hover:bg-rose-200 border border-rose-300 text-rose-800 font-bold flex items-center gap-1 transition-colors shadow-xs"
              title="Kosongkan Data Dummy untuk Mulai Pengujian End-to-End"
            >
              <Trash2 className="w-3 h-3 text-rose-600" />
              Kosongkan Data Dummy
            </button>
          ) : (
            <button
              onClick={() => restoreDemoData()}
              className="px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold flex items-center gap-1 transition-colors shadow-xs animate-pulse"
              title="Isi Kembali Data Contoh Demo"
            >
              <RotateCcw className="w-3 h-3 text-white" />
              Pulihkan Data Demo
            </button>
          )}
          {setActiveTab && (
            <button
              onClick={() => setActiveTab('sys-stresstest')}
              className="px-2.5 py-0.5 rounded-lg bg-indigo-100/80 hover:bg-indigo-200/90 border border-indigo-300 text-indigo-900 font-bold flex items-center gap-1 transition-colors shadow-xs"
              title="Stress Test & Diagnostik Beban Platform SPARK"
            >
              <Zap className="w-3 h-3 text-indigo-600 animate-bounce" />
              Stress Test Platform
            </button>
          )}
        </div>
      </div>

      {/* Main Header Bar */}
      <header id="app-global-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200/90 text-slate-900 px-5 py-2.5 flex items-center justify-between gap-4 shadow-xs">
        {/* Left: Brand & Role-Adaptive Context Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            className="group relative flex items-center gap-2 cursor-pointer"
            onClick={() => setActiveTab && setActiveTab('dash-overview')}
            title="SPARK: Strategy, Production, Approval, Repository & Knowledge"
          >
            <SparkLogo size="sm" variant="light" showSubtitles={false} />

            {/* Subtitle / Acronym Tooltip on hover */}
            <div className="absolute top-full left-0 mt-2 hidden group-hover:block z-50 bg-slate-900 text-white text-[11px] p-3 rounded-2xl shadow-xl w-72 pointer-events-none transition-all border border-slate-800">
              <div className="font-black text-rose-400 tracking-wide">SPARK PLATFORM</div>
              <div className="text-slate-200 font-semibold mt-0.5">Strategy, Production, Approval, Repository &amp; Knowledge</div>
              <div className="text-slate-400 text-[10px] mt-1">Integrated Content Workflow, Governance &amp; Knowledge Platform</div>
            </div>
          </div>

          {/* Role-Adaptive Context Switcher: Only show Campaign dropdown for central team */}
          {!isRegionalUser && (
            <>
              <div className="h-7 w-px bg-slate-200 hidden md:block mx-1" />
              <div className="relative hidden md:flex items-center gap-2">
                <label id="campaign-switcher-label" htmlFor="campaign-select" className="text-xs text-slate-500 flex items-center gap-1 shrink-0 font-medium">
                  <Layers className="w-3.5 h-3.5 text-rose-600" />
                  Campaign:
                </label>
                <select
                  id="campaign-select"
                  value={selectedCampaignId}
                  onChange={(e) => setSelectedCampaignId(e.target.value)}
                  className="bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-800 text-xs rounded-lg px-3 py-1.5 pr-8 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium cursor-pointer transition-colors max-w-[220px] truncate"
                >
                  {campaigns.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>

        {/* Center: Search Bar & Status Usulan/Peringatan Side-by-Side (Opsi A) */}
        <div className="hidden md:flex items-center gap-2.5 flex-1 max-w-2xl mx-2.5 min-w-0 justify-center">
          {/* Global Search Bar */}
          <div className="w-40 lg:w-52 shrink-0">
            <button
              id="global-search-trigger-btn"
              type="button"
              onClick={() => setShowSearchModal(true)}
              className="w-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 transition-colors shadow-2xs cursor-pointer group"
              title="Pencarian Cepat Global"
            >
              <Search className="w-3.5 h-3.5 text-rose-600 shrink-0 group-hover:scale-105 transition-transform" />
              <span className="truncate text-slate-600 font-medium text-[11px]">Cari konten...</span>
            </button>
          </div>

          {/* Urgent Warning Message Box (Integrated with Bell System) */}
          <div className="flex-initial min-w-0 max-w-sm">
            <button
              type="button"
              id="urgent-alert-header-banner"
              onClick={() => {
                if (urgentAlert.isUrgent && urgentAlert.targetTab && setActiveTab) {
                  setActiveTab(urgentAlert.targetTab);
                } else {
                  setShowNotifDropdown(!showNotifDropdown);
                  setShowIntegrationDropdown(false);
                  setShowRoleDropdown(false);
                }
              }}
              className={`w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl border text-xs text-left transition-all cursor-pointer shadow-2xs group ${
                urgentAlert.isUrgent
                  ? 'bg-rose-50 border-rose-200 hover:bg-rose-100/80 hover:border-rose-300 text-rose-950'
                  : 'bg-emerald-50/70 border-emerald-200/80 hover:bg-emerald-100/70 text-emerald-950'
              }`}
              title={urgentAlert.isUrgent ? 'Peringatan Mendesak - Klik untuk meninjau' : 'Status Terpantau Aman - Terhubung langsung ke Notifikasi Lonceng'}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <span className={`p-0.5 rounded shrink-0 ${
                  urgentAlert.isUrgent 
                    ? 'text-rose-600 animate-pulse' 
                    : 'text-emerald-600'
                }`}>
                  {urgentAlert.isUrgent ? (
                    <AlertTriangle className="w-3.5 h-3.5" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                </span>

                <span className={`font-extrabold uppercase tracking-wide text-[9.5px] px-1.5 py-0.5 rounded shrink-0 whitespace-nowrap ${
                  urgentAlert.isUrgent
                    ? 'bg-rose-200 text-rose-900'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {urgentAlert.title}
                </span>
                <span className="text-slate-600 font-medium whitespace-nowrap text-[11px]">
                  {urgentAlert.description}
                </span>
              </div>

              {urgentAlert.isUrgent ? (
                <div className="flex items-center gap-0.5 shrink-0 text-[10px] font-bold text-rose-700 group-hover:underline ml-1">
                  <span>{urgentAlert.actionLabel}</span>
                  <ArrowRight className="w-3 h-3 text-rose-600 group-hover:translate-x-0.5 transition-transform" />
                </div>
              ) : (
                <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0 opacity-60 ml-1" />
              )}
            </button>
          </div>
        </div>

        {/* Right Actions: Integration Popover, SLA Notifs, Role Switcher */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Integration Status Badge with Interactive Popover: Hidden for Regional Creator */}
          {!isRegionalUser && (
            <div className="relative hidden lg:block">
              <button
                id="header-live-sync-btn"
                onClick={() => {
                  setShowIntegrationDropdown(!showIntegrationDropdown);
                  setShowNotifDropdown(false);
                  setShowRoleDropdown(false);
                }}
                className={`flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer border ${
                  connectedIntegrations === integrations.length
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                    : 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100'
                }`}
                title="Klik untuk melihat status koneksi kanal dan sistem"
              >
                <Radio className={`w-3 h-3 ${connectedIntegrations === integrations.length ? 'text-emerald-600 animate-pulse' : 'text-amber-600'}`} />
                <span>{connectedIntegrations}/{integrations.length} Live Sync</span>
                <ChevronDown className="w-3 h-3 opacity-60 ml-0.5" />
              </button>

              {/* Integration Popover */}
              {showIntegrationDropdown && (
                <div className="absolute right-0 mt-2 w-84 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 text-xs z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
                    <div>
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Radio className="w-3.5 h-3.5 text-emerald-600" />
                        Status Integrasi Kanal &amp; Sistem
                      </span>
                      <span className="text-[10px] text-slate-500 block">Konektivitas publish otomatis &amp; sinkronisasi</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {connectedIntegrations}/{integrations.length} Aktif
                    </span>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {integrations.map((item) => (
                      <div
                        key={item.id}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2"
                      >
                        <div>
                          <div className="font-bold text-slate-800 text-[11px] flex items-center gap-1">
                            <span>{item.provider}</span>
                            <span className="text-[9px] font-normal text-slate-500">({item.capability})</span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            Last sync: {new Date(item.lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>

                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 shrink-0 ${
                          item.status === 'CONNECTED'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : item.status === 'SIMULATED'
                            ? 'bg-sky-100 text-sky-800 border-sky-200'
                            : 'bg-amber-100 text-amber-800 border-amber-200'
                        }`}>
                          {item.status === 'CONNECTED' ? (
                            <>
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                              <span>Aktif</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-2.5 h-2.5 text-amber-600" />
                              <span>{item.status}</span>
                            </>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>

                  {setActiveTab && (
                    <div className="pt-3 mt-3 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setActiveTab('sys-integrations');
                          setShowIntegrationDropdown(false);
                        }}
                        className="w-full py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>Kelola Konfigurasi Integrasi</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* SLA & Urgent Notifications Button (Lonceng Tetap Ada) */}
          <div className="relative">
            <button
              id="sla-notification-bell-btn"
              onClick={() => {
                setShowNotifDropdown(!showNotifDropdown);
                setShowIntegrationDropdown(false);
                setShowRoleDropdown(false);
              }}
              className={`p-2 rounded-xl border relative transition-colors cursor-pointer ${
                notifCount > 0
                  ? 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-700'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
              title={isRegionalUser ? `Notifikasi Usulan Konten (${notifCount})` : `Antrean Approval & SLA Warning (${notifCount})`}
            >
              <Bell className={`w-4 h-4 ${notifCount > 0 ? 'text-rose-600' : ''}`} />
              {notifCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {notifCount}
                </span>
              )}
            </button>

            {/* Notif Dropdown */}
            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-84 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 text-xs z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    {isRegionalUser ? (
                      <>
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        Peringatan &amp; Status Usulan Konten ({userRegion})
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-rose-600" />
                        Peringatan SLA &amp; Antrean Review ({pendingApprovals.length})
                      </>
                    )}
                  </span>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {isRegionalUser ? (
                    regionalNeedsRevision.length === 0 ? (
                      <div className="text-center py-5">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1.5 opacity-80" />
                        <p className="font-bold text-slate-700 text-xs">Semua Usulan Kegiatan Aman!</p>
                        <p className="text-slate-400 text-[10px] mt-0.5">Tidak ada usulan yang membutuhkan revisi dari Corcomm/Marcomm.</p>
                      </div>
                    ) : (
                      regionalNeedsRevision.map(sub => (
                        <button
                          key={sub.id}
                          onClick={() => {
                            if (setActiveTab) setActiveTab('content-schedule');
                            setShowNotifDropdown(false);
                          }}
                          className="w-full text-left p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 hover:border-amber-300 hover:bg-amber-100/70 transition-all group cursor-pointer block"
                        >
                          <div className="flex items-center justify-between font-semibold text-amber-900 text-[11px]">
                            <span className="flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              Revisi Diperlukan
                            </span>
                            <span className="text-[10px] text-amber-800 bg-amber-200/70 px-1.5 py-0.5 rounded font-bold">
                              {sub.regional}
                            </span>
                          </div>
                          <p className="text-slate-800 text-[11px] mt-1 font-bold">
                            {sub.topic}
                          </p>
                          <p className="text-amber-900/80 text-[10px] mt-0.5 line-clamp-2 bg-white/60 p-1.5 rounded-lg border border-amber-200/50">
                            <strong>Catatan:</strong> {sub.revisionNotes || 'Mohon lengkapi dokumentasi foto dan data pendukung.'}
                          </p>
                          <div className="mt-1 text-right text-[10px] text-rose-600 font-bold group-hover:underline flex items-center justify-end gap-0.5">
                            Perbaiki Usulan Sekarang <ArrowRight className="w-3 h-3" />
                          </div>
                        </button>
                      ))
                    )
                  ) : (
                    pendingApprovals.length === 0 ? (
                      <div className="text-center py-5">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1.5 opacity-80" />
                        <p className="font-bold text-slate-700 text-xs">Semua Antrean Bersih!</p>
                        <p className="text-slate-400 text-[10px] mt-0.5">Tidak ada draf konten yang tertunda atau melanggar SLA.</p>
                      </div>
                    ) : (
                      pendingApprovals.map(a => (
                        <button
                          key={a.id}
                          onClick={() => {
                            if (setActiveTab) setActiveTab('gov-approvals');
                            setShowNotifDropdown(false);
                          }}
                          className="w-full text-left p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-rose-300 hover:bg-rose-50/50 transition-all group cursor-pointer block"
                        >
                          <div className="flex items-center justify-between font-semibold text-rose-700 text-[11px]">
                            <span>{a.stage}</span>
                            <span className="text-[10px] text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200">
                              Due: {new Date(a.dueAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-slate-700 text-[11px] mt-1 font-medium group-hover:text-slate-900 transition-colors">
                            Content Version #{a.contentVersionId}
                          </p>
                          <div className="flex items-center justify-between mt-1 text-[10px]">
                            <span className="text-slate-500">Role: {a.reviewerRole}</span>
                            <span className="text-rose-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                              Proses <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </button>
                      ))
                    )
                  )}
                </div>

                {isRegionalUser ? (
                  regionalNeedsRevision.length > 0 && (
                    <div className="pt-2.5 mt-2 border-t border-slate-100">
                      <button
                        onClick={() => {
                          if (setActiveTab) setActiveTab('content-schedule');
                          setShowNotifDropdown(false);
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <span>📝 Buka Daftar Usulan Konten ({regionalNeedsRevision.length})</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )
                ) : (
                  pendingApprovals.length > 0 && (
                    <div className="pt-2.5 mt-2 border-t border-slate-100">
                      <button
                        onClick={() => {
                          if (setActiveTab) setActiveTab('gov-approvals');
                          setShowNotifDropdown(false);
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <span>🚀 Buka Halaman Approval Queue ({pendingApprovals.length})</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* User Role Switcher */}
          <div className="relative">
            <button
              id="user-role-switcher-btn"
              onClick={() => {
                setShowRoleDropdown(!showRoleDropdown);
                setShowNotifDropdown(false);
                setShowIntegrationDropdown(false);
              }}
              className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-[10px] font-bold text-white">
                {activeUser.name.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold text-slate-800 max-w-[120px] truncate">{activeUser.name}</div>
                <div className={`text-[9px] px-1.5 py-0.2 rounded border inline-block mt-0.5 ${roleColors[activeUser.role]}`}>
                  {formatRoleLabel(activeUser.role)}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {/* Profile Dropdown */}
            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-3.5 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center font-bold text-white text-sm shrink-0">
                    {activeUser.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">{activeUser.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{activeUser.email}</div>
                  </div>
                </div>

                <div className="py-2.5 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[11px]">Peran:</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${roleColors[activeUser.role]}`}>
                      {formatRoleLabel(activeUser.role)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[11px]">Divisi / Regional:</span>
                    <span className="font-semibold text-slate-700 text-[11px] truncate max-w-[150px]">{activeUser.businessUnit}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[11px]">Jabatan:</span>
                    <span className="font-semibold text-slate-700 text-[11px] truncate max-w-[150px]">{activeUser.title}</span>
                  </div>
                </div>

                {/* Quick Switch for Approver & Creator Testing */}
                <div className="py-2.5 border-t border-slate-100 space-y-1.5">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Simulasi Ganti Akun / Approver:
                  </div>
                  <div className="space-y-1">
                    {[
                      { id: 'usr-reg-1', label: 'Regional Creator (Regional 1 - Sumatra)', roleDesc: 'Tahap 0 • Pengusul Lapangan' },
                      { id: 'usr-2', label: 'Marcomm Creator (@telprodico)', roleDesc: 'Tahap 1 • Kurasi & Produksi' },
                      { id: 'usr-4', label: 'Corcomm Creator (@telkomproperty)', roleDesc: 'Tahap 1 • Co-Governance Review' },
                      { id: 'usr-6', label: 'VP Corporate Secretary (VP Corsec)', roleDesc: 'Tingkat 2 • Holding Governance' },
                      { id: 'usr-7', label: 'Plt. Direktur Utama (Final Approver)', roleDesc: 'Tingkat 3 • Final Sign-Off' }
                    ].map(u => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full text-left p-1.5 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                          activeUser.id === u.id
                            ? 'bg-rose-50 text-rose-900 font-bold border border-rose-200'
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div className="min-w-0 pr-1">
                          <div className="truncate font-semibold text-[11px]">{u.label}</div>
                          <div className="text-[9px] text-slate-400">{u.roleDesc}</div>
                        </div>
                        {activeUser.id === u.id && (
                          <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setShowRoleDropdown(false);
                      logout();
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-rose-200 shadow-2xs"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-600" />
                    <span>Keluar (Log Out)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Campaign Sub-Context Bar - Only for Central Office / Non-Regional roles */}
      {!isRegionalUser && (
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          {/* Campaign Objective Context */}
          <div className="flex items-center gap-2 min-w-0 max-w-xl">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] shrink-0">Objective:</span>
            <span className="font-medium text-rose-700 truncate" title={currentCampaign?.businessObjective}>
              {currentCampaign?.businessObjective || 'Awareness & Engagement'}
            </span>
          </div>

          {/* Stage Lifecycle Progress Steps */}
          <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-xl border border-slate-200 text-[10px] font-bold shadow-xs">
            <span className="text-emerald-600">✓ Plan</span>
            <span className="text-slate-300">→</span>
            <span className="text-emerald-600">✓ Discover</span>
            <span className="text-slate-300">→</span>
            <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 flex items-center gap-1">
              ● Create
            </span>
            <span className="text-slate-300">→</span>
            <span className="text-slate-500">○ Review</span>
            <span className="text-slate-300">→</span>
            <span className="text-slate-500">○ Publish</span>
            <span className="text-slate-300">→</span>
            <span className="text-slate-500">○ Measure</span>
          </div>
        </div>
      )}

      {/* Global Search Modal */}
      {showSearchModal && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-start justify-center pt-20 p-4"
          onClick={() => setShowSearchModal(false)}
        >
          <div 
            className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl p-4 shadow-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-3">
              <Search className="w-4 h-4 text-rose-600 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Cari campaign, trend, event, evidence, atau naskah konten..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-slate-900 text-sm focus:outline-none placeholder-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowSearchModal(false)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
                title="Keluar / Tutup Pencarian (Esc)"
                aria-label="Tutup pencarian"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-slate-500 py-6 text-center">
              {searchQuery ? `Hasil pencarian untuk "${searchQuery}": Ditemukan 3 item relevan di modul Campaign & Intelligence.` : 'Ketik kata kunci untuk memulai pencarian di seluruh basis data resmi.'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
