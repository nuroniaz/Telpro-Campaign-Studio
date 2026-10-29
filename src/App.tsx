import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { LoginAppsView } from './components/Auth/LoginAppsView';
import { LoginPage } from './components/Auth/LoginPage';
import { BuatKontenView } from './components/BuatKonten/BuatKontenView';
import { ReferensiKontenView } from './components/ReferensiKonten/ReferensiKontenView';
import { AnalyticsInternalView } from './components/AnalyticsInternal/AnalyticsInternalView';
import { SystemView } from './components/System/SystemView';
import { AiPartnerChatModal } from './components/Common/AiPartnerChatModal';
import { Bot, Sparkles } from 'lucide-react';
import { UserRole } from './types';

// Optimal default landing tab for each role once logged in
const getDefaultLandingTab = (role: UserRole): NavTab => {
  switch (role) {
    case 'ROLE_REGIONAL_CREATOR':
      return 'content-schedule'; // Submisi usulan kegiatan & inbox wilayah
    case 'ROLE_JOINT_REVIEWER':
    case 'ROLE_VP_CORSEC':
    case 'ROLE_FINAL_APPROVER':
      return 'content-approval'; // Approval Governance Desk
    case 'ROLE_PERFORMANCE_ANALYST':
    case 'ROLE_ANALYST_QA':
      return 'analytics-internal'; // Analitik & Metrik Konten
    case 'ROLE_SYSTEM_ADMIN':
      return 'sys-integrations'; // Tata Kelola Sistem & SSO
    case 'ROLE_MARCOM_CREATOR':
    case 'ROLE_CORCOMM_CREATOR':
    default:
      return 'content-schedule'; // Jadwal & Content Planner 4-Seksi
  }
};

function MainLayout() {
  const { activeUser, isAuthenticated, isAiPartnerModalOpen, setIsAiPartnerModalOpen } = useApp();
  const [activeTab, setActiveTab] = useState<NavTab>(() => getDefaultLandingTab(activeUser.role));

  const handleLoginSuccess = (role: UserRole) => {
    setActiveTab(getDefaultLandingTab(role));
  };

  // If user is not authenticated, display LoginPage as first screen
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  const renderContent = () => {
    // 1. Log In Apps (Sesi & Switch Role dalam aplikasi)
    if (activeTab === 'login-apps' || activeTab.startsWith('login-')) {
      return <LoginAppsView setActiveTab={setActiveTab} />;
    }

    // 2. Buat Konten (Jadwal, Buat Konten AI, Approval, Publish)
    if (
      activeTab === 'content-schedule' ||
      activeTab === 'content-ai' ||
      activeTab === 'content-approval' ||
      activeTab === 'content-publish' ||
      activeTab.startsWith('content-') ||
      activeTab.startsWith('strategy-') ||
      activeTab.startsWith('gov-') ||
      activeTab.startsWith('act-')
    ) {
      return <BuatKontenView activeTab={activeTab} setActiveTab={setActiveTab} />;
    }

    // 3. Referensi Konten (Trend Finder 10 Sektor, Ads, Generate Engine Optimization)
    if (
      activeTab === 'ref-trends' ||
      activeTab === 'ref-ads' ||
      activeTab === 'ref-geo' ||
      activeTab.startsWith('ref-') ||
      activeTab.startsWith('intel-')
    ) {
      return <ReferensiKontenView activeTab={activeTab} setActiveTab={setActiveTab} />;
    }

    // 4. Analitics Konten (Hanya Untuk Internal)
    if (
      activeTab === 'analytics-internal' ||
      activeTab.startsWith('analytics-') ||
      activeTab.startsWith('perf-') ||
      activeTab === 'home-dashboard'
    ) {
      return <AnalyticsInternalView activeTab={activeTab} setActiveTab={setActiveTab} />;
    }

    // System Diagnostic & Stress Testing
    if (activeTab.startsWith('sys-')) {
      return <SystemView activeTab={activeTab} setActiveTab={setActiveTab} />;
    }

    return <LoginAppsView setActiveTab={setActiveTab} />;
  };

  return (
    <div
      id="app-root-container"
      className="h-screen w-screen flex flex-col bg-[#eef2f7] text-slate-800 overflow-hidden font-sans relative"
    >
      <Header setActiveTab={setActiveTab} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main
          id="app-main-content-viewport"
          className="flex-1 overflow-y-auto bg-[#eef2f7] custom-scrollbar p-4 md:p-6 pb-24"
        >
          {renderContent()}
        </main>
      </div>

      {/* Floating Pintasan Tombol AI Partner */}
      {!isAiPartnerModalOpen && (
        <button
          type="button"
          onClick={() => setIsAiPartnerModalOpen(true)}
          className="fixed bottom-5 right-5 z-40 px-4 py-3 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-extrabold text-xs flex items-center gap-2.5 shadow-xl shadow-rose-500/30 hover:scale-105 transition-all cursor-pointer ring-2 ring-white group animate-in fade-in"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Bot className="w-3.5 h-3.5 text-white group-hover:rotate-12 transition-transform" />
          </div>
          <span className="hidden sm:inline">Agentic AI Partner</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
        </button>
      )}

      {/* Agentic AI Partner Chat Pop-up Modal */}
      <AiPartnerChatModal
        isOpen={isAiPartnerModalOpen}
        onClose={() => setIsAiPartnerModalOpen(false)}
        activeTab={activeTab}
        onCampaignCreated={(newCampId) => {
          setActiveTab('content-ai');
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
