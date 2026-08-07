import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NavTab } from '../Sidebar';
import { RbacBanner } from '../Common/RbacBanner';
import { hasPermission } from '../../utils/rbac';
import {
  Rocket,
  Calendar,
  Megaphone,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  MessageSquare,
  Users,
  Lock
} from 'lucide-react';

interface ActivationViewProps {
  activeTab?: NavTab;
  setActiveTab?: (tab: NavTab) => void;
}

export const ActivationView: React.FC<ActivationViewProps> = ({ activeTab }) => {
  const {
    contents,
    publishContent,
    leadFeedbacks,
    activeUser,
    selectedCampaign
  } = useApp();

  let actTab: 'publishing' | 'calendar' | 'ads' | 'acquisition' = 'publishing';
  if (activeTab === 'act-calendar') actTab = 'calendar';
  else if (activeTab === 'act-ads') actTab = 'ads';
  else if (activeTab === 'act-acquisition') actTab = 'acquisition';
  else if (activeTab === 'act-publishing') actTab = 'publishing';

  const campaignContents = contents.filter(c => c.campaignId === selectedCampaign?.id);
  const eligibleToPublish = campaignContents.filter(c => c.status === 'Approved');

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Rocket className="w-5 h-5 text-rose-500" />
              Activation, Publishing & Paid Media Planner
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Eksekusi publikasi resmi terbukti approved, jadwal kampanye iklan berbayar, & pengukuran akuisisi funnel</p>
          </div>
        </div>
        <RbacBanner moduleName="Activation & Publishing" requiredAction="canPublishContent" requiredRole="ROLE_PUBLISHER / ROLE_SYSTEM_ADMIN" />
      </div>

      {/* Tab 1: Publishing Queue */}
      {actTab === 'publishing' && (
        <div className="space-y-4 animate-in fade-in text-xs">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">Eligibility Criteria & Publishing Queue</h2>
                {activeUser.role === 'ROLE_PUBLISHER' || activeUser.role === 'ROLE_SYSTEM_ADMIN' ? (
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                    ✓ Role Executer: {activeUser.role.replace('ROLE_', '')}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-medium" title="Ubah role ke ROLE_PUBLISHER di Header untuk menguji eksekusi publishing">
                    ℹ️ Otoritas Publikasi: ROLE_PUBLISHER (Anda: {activeUser.role.replace('ROLE_', '')})
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-[11px] mt-0.5">Konten Wajib: Status Approved + Asset Ready + Evidence Complete + Tracking Ready</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 font-bold border border-emerald-800 shrink-0">
              {eligibleToPublish.length} Siap Terbit
            </span>
          </div>

          <div className="space-y-3">
            {campaignContents.map(cnt => (
              <div key={cnt.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{cnt.title}</span>
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      cnt.status === 'Published' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                      cnt.status === 'Approved' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {cnt.status}
                    </span>
                  </div>
                  <p className="text-slate-400">Platform Target: <strong className="text-slate-200">{cnt.platform}</strong> ({cnt.format}) • PIC: {cnt.pic}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {cnt.status === 'Published' ? (
                    <a href={cnt.publishedUrl} target="_blank" rel="noreferrer" className="text-rose-400 font-bold hover:underline flex items-center gap-1">
                      Lihat Post Live <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : cnt.status === 'Approved' ? (
                    <button
                      disabled={!hasPermission(activeUser.role, 'canPublishContent')}
                      onClick={() => {
                        if (hasPermission(activeUser.role, 'canPublishContent')) {
                          publishContent(cnt.id);
                        }
                      }}
                      title={hasPermission(activeUser.role, 'canPublishContent') ? 'Terbitkan Sekarang' : `Akses Terbatas: Hanya ROLE_PUBLISHER yang dapat menerbitkan konten (Role Anda: ${activeUser.role.replace('ROLE_', '')})`}
                      className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                        hasPermission(activeUser.role, 'canPublishContent')
                          ? 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-lg shadow-rose-900/30 cursor-pointer'
                          : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-70'
                      }`}
                    >
                      {hasPermission(activeUser.role, 'canPublishContent') ? (
                        'Terbitkan Sekarang (Publish Live)'
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Publikasi (Hanya ROLE_PUBLISHER)</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="text-slate-500 font-semibold italic">Menunggu Governance Approval</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Content Calendar */}
      {actTab === 'calendar' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl animate-in fade-in text-xs">
          <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3">Content Calendar Canonical View</h2>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300">
            Jadwal publikasi minggu ini terhubung dengan kanonisitas database TELPRO 2026.
          </div>
        </div>
      )}

      {/* Tab 3: Weekly Ads / Paid Media */}
      {actTab === 'ads' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl animate-in fade-in text-xs">
          <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3">Weekly Ads Candidate Scoring & Paid Media Setup</h2>
          <p className="text-slate-300">Kandidat iklan dengan skor tinggi berdasarkan intent lead, kejelasan CTA, & performa organik awal.</p>
        </div>
      )}

      {/* Tab 4: Acquisition & Funnel */}
      {actTab === 'acquisition' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl animate-in fade-in text-xs">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white">Acquisition Funnel & Lead Feedback ({leadFeedbacks.length} Leads)</h2>
            <p className="text-slate-400 text-[11px] mt-0.5">Funnel: LP Click → LP View → WA Click → Chat Initiated → Contact Feedback → Lead Feedback</p>
          </div>

          <div className="space-y-3">
            {leadFeedbacks.map(ld => (
              <div key={ld.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-semibold border border-emerald-800">
                    Status: {ld.status}
                  </span>
                  <span className="text-slate-400">{new Date(ld.receivedAt).toLocaleString()}</span>
                </div>

                <div className="font-bold text-white text-xs">{ld.contactName} ({ld.companyName})</div>
                <div className="p-2.5 rounded-xl bg-slate-900 text-slate-200 border border-slate-800">
                  "{ld.customerInquiry}"
                </div>
                <div className="text-[10px] text-slate-400">Channel: <strong className="text-cyan-400">{ld.channel}</strong> ({ld.source})</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
