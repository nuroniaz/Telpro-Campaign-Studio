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

  const [platformFilter, setPlatformFilter] = useState('all');

  let actTab: 'publishing' | 'calendar' | 'ads' | 'acquisition' = 'publishing';
  if (activeTab === 'act-calendar') actTab = 'calendar';
  else if (activeTab === 'act-ads') actTab = 'ads';
  else if (activeTab === 'act-acquisition') actTab = 'acquisition';
  else if (activeTab === 'act-publishing') actTab = 'publishing';

  const campaignContents = contents.filter(c => {
    if (selectedCampaign?.id && c.campaignId !== selectedCampaign.id) return false;
    if (platformFilter !== 'all') {
      const pf = platformFilter.toLowerCase();
      const cp = (c.platform || '').toLowerCase();
      if (pf === 'article') {
        if (!cp.includes('article') && !cp.includes('blog') && !cp.includes('web')) return false;
      } else if (!cp.includes(pf)) {
        return false;
      }
    }
    return true;
  });
  const eligibleToPublish = campaignContents.filter(c => c.status === 'Approved');

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Rocket className="w-5 h-5 text-rose-500" />
              Activation, Publishing & Paid Media Planner
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Eksekusi publikasi resmi terbukti approved, jadwal kampanye iklan berbayar, & pengukuran akuisisi funnel</p>
          </div>
        </div>
        <RbacBanner moduleName="Activation & Publishing" requiredAction="canPublishContent" requiredRole="ROLE_PUBLISHER / ROLE_SYSTEM_ADMIN" />
      </div>

      {/* Tab 1: Publishing Queue */}
      {actTab === 'publishing' && (
        <div className="space-y-4 animate-in fade-in text-xs">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">Eligibility Criteria & Publishing Queue</h2>
                {activeUser.role === 'ROLE_PUBLISHER' || activeUser.role === 'ROLE_SYSTEM_ADMIN' ? (
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                    ✓ Role Executer: {activeUser.role.replace('ROLE_', '')}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-medium" title="Ubah role ke ROLE_PUBLISHER di Header untuk menguji eksekusi publishing">
                    ℹ️ Otoritas Publikasi: ROLE_PUBLISHER (Anda: {activeUser.role.replace('ROLE_', '')})
                  </span>
                )}
              </div>
              <p className="text-slate-500 text-[11px] mt-0.5">Konten Wajib: Status Approved + Asset Ready + Evidence Complete + Tracking Ready</p>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              <select
                value={platformFilter}
                onChange={e => setPlatformFilter(e.target.value)}
                className="bg-slate-50 text-slate-800 border border-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-rose-500"
              >
                <option value="all">Semua Platform</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="linkedin">LinkedIn</option>
                <option value="article">Article / Blog</option>
                <option value="tiktok">TikTok</option>
                <option value="youtube">YouTube</option>
              </select>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                {eligibleToPublish.length} Siap Terbit
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {campaignContents.map(cnt => (
              <div key={cnt.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{cnt.title}</span>
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] border ${
                      cnt.status === 'Published' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                      cnt.status === 'Approved' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {cnt.status}
                    </span>
                  </div>
                  <p className="text-slate-500">Platform Target: <strong className="text-slate-700">{cnt.platform}</strong> ({cnt.format}) • PIC: {cnt.pic}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {cnt.status === 'Published' ? (
                    <a href={cnt.publishedUrl} target="_blank" rel="noreferrer" className="text-rose-600 font-bold hover:underline flex items-center gap-1">
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
                          ? 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-md cursor-pointer'
                          : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-70'
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
                    <span className="text-slate-400 font-semibold italic">Menunggu Governance Approval</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Content Calendar */}
      {actTab === 'calendar' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm animate-in fade-in text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-rose-500" />
                Jadwal Konten Utama (Master Calendar)
              </h2>
              <p className="text-slate-500 text-[11px] mt-0.5">Jadwal publikasi terintegrasi dengan basis data resmi TELPRO 2026 ({campaignContents.length} Konten)</p>
            </div>
            
            <div className="flex items-center gap-2">
              <select
                value={platformFilter}
                onChange={e => setPlatformFilter(e.target.value)}
                className="bg-slate-50 text-slate-800 border border-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-rose-500"
              >
                <option value="all">Semua Platform</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="linkedin">LinkedIn</option>
                <option value="article">Article / Blog</option>
                <option value="tiktok">TikTok</option>
                <option value="youtube">YouTube</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {campaignContents.length === 0 ? (
              <div className="col-span-2 p-8 text-center text-slate-500 italic bg-slate-50 rounded-2xl border border-slate-200">
                Tidak ada konten yang cocok dengan filter platform ini.
              </div>
            ) : (
              campaignContents.map(cnt => (
                <div key={cnt.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 font-semibold border border-rose-200">
                      {cnt.platform} • {cnt.format}
                    </span>
                    <span className={`px-2 py-0.5 rounded font-bold border ${
                      cnt.status === 'Published' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-200 text-slate-700 border-slate-300'
                    }`}>
                      {cnt.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-xs line-clamp-2">{cnt.title}</h3>
                  <div className="text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-200">
                    <span>PIC: <strong className="text-slate-700">{cnt.pic}</strong></span>
                    <span className="font-mono text-rose-600 font-bold">#{cnt.currentVersionId}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Weekly Ads / Paid Media */}
      {actTab === 'ads' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm animate-in fade-in text-xs">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Weekly Ads Candidate Scoring & Paid Media Setup</h2>
          <p className="text-slate-600">Kandidat iklan dengan skor tinggi berdasarkan intent lead, kejelasan CTA, & performa organik awal.</p>
        </div>
      )}

      {/* Tab 4: Acquisition & Funnel */}
      {actTab === 'acquisition' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm animate-in fade-in text-xs">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">Acquisition Funnel & Lead Feedback ({leadFeedbacks.length} Leads)</h2>
            <p className="text-slate-500 text-[11px] mt-0.5">Funnel: LP Click → LP View → WA Click → Chat Initiated → Contact Feedback → Lead Feedback</p>
          </div>

          <div className="space-y-3">
            {leadFeedbacks.map(ld => (
              <div key={ld.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                    Status: {ld.status}
                  </span>
                  <span className="text-slate-500">{new Date(ld.receivedAt).toLocaleString()}</span>
                </div>

                <div className="font-bold text-slate-900 text-xs">{ld.contactName} ({ld.companyName})</div>
                <div className="p-2.5 rounded-xl bg-white text-slate-700 border border-slate-200">
                  "{ld.customerInquiry}"
                </div>
                <div className="text-[10px] text-slate-500">Channel: <strong className="text-cyan-700">{ld.channel}</strong> ({ld.source})</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
