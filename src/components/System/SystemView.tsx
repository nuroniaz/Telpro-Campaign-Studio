import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NavTab } from '../Sidebar';
import { RbacBanner } from '../Common/RbacBanner';
import { StressTestRunner } from './StressTestRunner';
import {
  Settings,
  Briefcase,
  Cpu,
  History,
  CheckCircle2,
  Radio,
  RadioTower,
  ShieldCheck,
  Search,
  Users,
  Zap,
  Activity
} from 'lucide-react';

interface SystemViewProps {
  activeTab?: NavTab;
  setActiveTab?: (tab: NavTab) => void;
}

export const SystemView: React.FC<SystemViewProps> = ({ activeTab, setActiveTab }) => {
  const {
    integrations,
    auditLogs,
    users,
    activeUser
  } = useApp();

  const [internalTab, setInternalTab] = useState<'profile' | 'integrations' | 'audit' | 'stresstest' | null>(null);

  // Determine current active subtab
  let currentTab: 'profile' | 'integrations' | 'audit' | 'stresstest' = 'integrations';
  if (internalTab) {
    currentTab = internalTab;
  } else if (activeTab === 'sys-profile') {
    currentTab = 'profile';
  } else if (activeTab === 'sys-audit') {
    currentTab = 'audit';
  } else if (activeTab === 'sys-stresstest') {
    currentTab = 'stresstest';
  } else if (activeTab === 'sys-integrations') {
    currentTab = 'integrations';
  }

  const handleTabClick = (tab: 'profile' | 'integrations' | 'audit' | 'stresstest') => {
    setInternalTab(tab);
    if (setActiveTab) {
      if (tab === 'profile') setActiveTab('sys-profile');
      else if (tab === 'integrations') setActiveTab('sys-integrations');
      else if (tab === 'audit') setActiveTab('sys-audit');
      else if (tab === 'stresstest') setActiveTab('sys-stresstest');
    }
  };

  const [auditFilter, setAuditFilter] = useState('');

  const filteredLogs = auditLogs.filter(l =>
    l.action.toLowerCase().includes(auditFilter.toLowerCase()) ||
    l.actorName.toLowerCase().includes(auditFilter.toLowerCase()) ||
    l.entityName.toLowerCase().includes(auditFilter.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300 text-xs">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-slate-600" />
              Sistem, Integrasi, Audit Trail & Stress Test Platform
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Pengujian beban performa konkurensi, konektor integrasi API external, profil TELPRO, & audit log immutable
            </p>
          </div>
        </div>
        <RbacBanner moduleName="System Administration" requiredAction="canManageSystem" requiredRole="ROLE_SYSTEM_ADMIN" />
      </div>

      {/* Sub-tab Navigation Pill Switcher */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => handleTabClick('integrations')}
          className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
            currentTab === 'integrations'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-indigo-400" />
          <span>Konektor Integrasi ({integrations.length})</span>
        </button>

        <button
          onClick={() => handleTabClick('stresstest')}
          className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer relative ${
            currentTab === 'stresstest'
              ? 'bg-gradient-to-r from-indigo-700 to-rose-700 text-white shadow-md'
              : 'bg-indigo-50/70 text-indigo-900 hover:bg-indigo-100 border border-indigo-200'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
          <span>Stress Test & Diagnostik Beban</span>
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
        </button>

        <button
          onClick={() => handleTabClick('audit')}
          className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
            currentTab === 'audit'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Audit Trail Immutable ({auditLogs.length})</span>
        </button>

        <button
          onClick={() => handleTabClick('profile')}
          className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
            currentTab === 'profile'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5 text-slate-500" />
          <span>Profil Organisasi TELPRO</span>
        </button>
      </div>

      {/* Tab: Stress Test Suite */}
      {currentTab === 'stresstest' && (
        <StressTestRunner />
      )}

      {/* Tab: Business Profile */}
      {currentTab === 'profile' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">PT Telkom Property (TELPRO) Organizational Context</h2>
          <div className="space-y-2 text-slate-700">
            <div><strong className="text-slate-500">Entitas:</strong> PT Telkom Property (TELPRO)</div>
            <div><strong className="text-slate-500">Induk Usaha:</strong> Telkom Indonesia Group</div>
            <div><strong className="text-slate-500">Fokus Produk:</strong> Smart Logistics, B2B Dedicated Fiber, Data Center Edge, & Managed Cloud Services</div>
          </div>
        </div>
      )}

      {/* Tab 2: Integrations Manager */}
      {currentTab === 'integrations' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">External Integration Connectors ({integrations.length})</h2>
              <p className="text-slate-500 text-[11px] mt-0.5">Status koneksi real-time ke Google Drive, Meta Ads, Google Ads, LinkedIn, & WhatsApp API</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map(int => (
              <div key={int.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">{int.provider}</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                    int.status === 'CONNECTED' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                    int.status === 'SIMULATED' ? 'bg-cyan-50 text-cyan-800 border-cyan-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {int.status}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">Kapabilitas: {int.capability}</p>
                <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200 flex justify-between">
                  <span>Environment: {int.environment}</span>
                  <span>Sync Terakhir: {new Date(int.lastSync).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Immutable Audit Trail */}
      {currentTab === 'audit' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Immutable Production Audit Trail Log ({auditLogs.length} Records)
              </h2>
              <p className="text-slate-500 text-[11px] mt-0.5">Seluruh perubahan material, apply AI, & keputusan approval tercatat permanen server-side</p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter aksi, actor, atau entitas..."
                value={auditFilter}
                onChange={e => setAuditFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs rounded-xl pl-8 pr-3 py-1.5 focus:outline-none focus:border-rose-400 focus:bg-white"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Waktu (UTC)</th>
                  <th className="p-3">Actor / Pengguna</th>
                  <th className="p-3">Aksi (Action)</th>
                  <th className="p-3">Entitas</th>
                  <th className="p-3">Perubahan State (After State)</th>
                  <th className="p-3">Sistem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 font-mono text-[11px]">
                    <td className="p-3 text-slate-500 shrink-0">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="p-3 font-semibold text-rose-700">{log.actorName}</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-slate-100 text-rose-800 font-bold border border-slate-200">{log.action}</span></td>
                    <td className="p-3 text-slate-600">{log.entityName} #{log.entityId}</td>
                    <td className="p-3 font-sans text-slate-700 max-w-xs">{log.afterState}</td>
                    <td className="p-3 font-sans text-slate-500">{log.sourceSystem}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
