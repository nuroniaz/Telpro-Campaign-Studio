import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NavTab } from '../Sidebar';
import { RbacBanner } from '../Common/RbacBanner';
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
  Users
} from 'lucide-react';

interface SystemViewProps {
  activeTab?: NavTab;
  setActiveTab?: (tab: NavTab) => void;
}

export const SystemView: React.FC<SystemViewProps> = ({ activeTab }) => {
  const {
    integrations,
    auditLogs,
    users,
    activeUser
  } = useApp();

  let sysTab: 'profile' | 'integrations' | 'audit' = 'integrations';
  if (activeTab === 'sys-profile') sysTab = 'profile';
  else if (activeTab === 'sys-audit') sysTab = 'audit';
  else if (activeTab === 'sys-integrations') sysTab = 'integrations';

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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-slate-400" />
              System Administration, Integrations & Audit Trail
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Pengelolaan koneksi integrasi external API, profil perusahaan, & log audit immutable</p>
          </div>
        </div>
        <RbacBanner moduleName="System Administration" requiredAction="canManageSystem" requiredRole="ROLE_SYSTEM_ADMIN" />
      </div>

      {/* Tab 1: Business Profile */}
      {sysTab === 'profile' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3">PT Telkom Prasetia (TELPRO) Organizational Context</h2>
          <div className="space-y-2 text-slate-300">
            <div><strong className="text-slate-400">Entitas:</strong> PT Telkom Prasetia (TELPRO)</div>
            <div><strong className="text-slate-400">Induk Usaha:</strong> Telkom Indonesia Group</div>
            <div><strong className="text-slate-400">Fokus Produk:</strong> Smart Logistics, B2B Dedicated Fiber, Data Center Edge, & Managed Cloud Services</div>
          </div>
        </div>
      )}

      {/* Tab 2: Integrations Manager */}
      {sysTab === 'integrations' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white">External Integration Connectors ({integrations.length})</h2>
              <p className="text-slate-400 text-[11px] mt-0.5">Status koneksi real-time ke Google Drive, Meta Ads, Google Ads, LinkedIn, & WhatsApp API</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map(int => (
              <div key={int.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{int.provider}</span>
                  <span className={`px-2.5 py-0.5 rounded font-bold text-[10px] border ${
                    int.status === 'CONNECTED' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' :
                    int.status === 'SIMULATED' ? 'bg-cyan-950 text-cyan-300 border-cyan-800' : 'bg-amber-950 text-amber-300 border-amber-800'
                  }`}>
                    {int.status}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px]">Kapabilitas: {int.capability}</p>
                <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-900 flex justify-between">
                  <span>Environment: {int.environment}</span>
                  <span>Sync Terakhir: {new Date(int.lastSync).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Immutable Audit Trail */}
      {sysTab === 'audit' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Immutable Production Audit Trail Log ({auditLogs.length} Records)
              </h2>
              <p className="text-slate-400 text-[11px] mt-0.5">Seluruh perubahan material, apply AI, & keputusan approval tercatat permanen server-side</p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter aksi, actor, atau entitas..."
                value={auditFilter}
                onChange={e => setAuditFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl pl-8 pr-3 py-1.5 focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Waktu (UTC)</th>
                  <th className="p-3">Actor / Pengguna</th>
                  <th className="p-3">Aksi (Action)</th>
                  <th className="p-3">Entitas</th>
                  <th className="p-3">Perubahan State (After State)</th>
                  <th className="p-3">Sistem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-800/40 font-mono text-[11px]">
                    <td className="p-3 text-slate-400 shrink-0">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="p-3 font-semibold text-rose-300">{log.actorName}</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-slate-800 text-rose-200 font-bold">{log.action}</span></td>
                    <td className="p-3 text-slate-400">{log.entityName} #{log.entityId}</td>
                    <td className="p-3 font-sans text-slate-300 max-w-xs">{log.afterState}</td>
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
