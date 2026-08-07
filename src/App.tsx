import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardView } from './components/Home/DashboardView';
import { StrategyView } from './components/Strategy/StrategyView';
import { IntelligenceView } from './components/Intelligence/IntelligenceView';
import { ContentProductionView } from './components/Content/ContentProductionView';
import { GovernanceView } from './components/Governance/GovernanceView';
import { ActivationView } from './components/Activation/ActivationView';
import { PerformanceLearningView } from './components/Performance/PerformanceLearningView';
import { SystemView } from './components/System/SystemView';

function MainLayout() {
  const [activeTab, setActiveTab] = useState<NavTab>('home-dashboard');

  const renderContent = () => {
    if (activeTab.startsWith('home-')) {
      return <DashboardView setActiveTab={setActiveTab} />;
    }
    if (activeTab.startsWith('strategy-')) {
      return <StrategyView activeTab={activeTab} setActiveTab={setActiveTab} />;
    }
    if (activeTab.startsWith('intel-')) {
      return <IntelligenceView activeTab={activeTab} setActiveTab={setActiveTab} />;
    }
    if (activeTab.startsWith('content-')) {
      return <ContentProductionView activeTab={activeTab} setActiveTab={setActiveTab} />;
    }
    if (activeTab.startsWith('gov-')) {
      return <GovernanceView activeTab={activeTab} setActiveTab={setActiveTab} />;
    }
    if (activeTab.startsWith('act-')) {
      return <ActivationView activeTab={activeTab} setActiveTab={setActiveTab} />;
    }
    if (activeTab.startsWith('perf-')) {
      return <PerformanceLearningView activeTab={activeTab} setActiveTab={setActiveTab} />;
    }
    if (activeTab.startsWith('sys-')) {
      return <SystemView activeTab={activeTab} setActiveTab={setActiveTab} />;
    }
    return <DashboardView setActiveTab={setActiveTab} />;
  };

  return (
    <div
      id="app-root-container"
      className="h-screen w-screen flex flex-col bg-[#0A0A0A] text-slate-100 overflow-hidden font-sans"
    >
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main
          id="app-main-content-viewport"
          className="flex-1 overflow-y-auto bg-[#0A0A0A] custom-scrollbar p-4 md:p-6"
        >
          {renderContent()}
        </main>
      </div>
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
