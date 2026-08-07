import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Trend, EventItem, Opportunity, Evidence, AudioRightsStatus } from '../../types';
import { NavTab } from '../Sidebar';
import { RbacBanner } from '../Common/RbacBanner';
import { hasPermission } from '../../utils/rbac';
import {
  Compass,
  TrendingUp,
  Target,
  Sparkles,
  Calendar,
  BookmarkCheck,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Music,
  ExternalLink,
  RotateCcw
} from 'lucide-react';

interface IntelligenceViewProps {
  activeTab?: NavTab;
  setActiveTab?: (tab: NavTab) => void;
}

export const IntelligenceView: React.FC<IntelligenceViewProps> = ({ activeTab, setActiveTab }) => {
  const {
    trends,
    addTrend,
    events,
    addEvent,
    revalidateEvent,
    opportunities,
    createOpportunity,
    evidences,
    addEvidence,
    addContentWithVersion,
    activeUser,
    selectedCampaign
  } = useApp();

  let intelTab: 'radar' | 'hashtags' | 'audio' | 'events' | 'opportunities' | 'evidence' = 'radar';
  if (activeTab === 'intel-hashtags') intelTab = 'hashtags';
  else if (activeTab === 'intel-audio') intelTab = 'audio';
  else if (activeTab === 'intel-events') intelTab = 'events';
  else if (activeTab === 'intel-opportunities') intelTab = 'opportunities';
  else if (activeTab === 'intel-evidence') intelTab = 'evidence';
  else if (activeTab === 'intel-radar') intelTab = 'radar';

  // Convert Trend to Opportunity Modal state
  const [selectedTrendForOpp, setSelectedTrendForOpp] = useState<Trend | null>(null);
  const [oppAngle, setOppAngle] = useState('');

  const handleCreateOppFromTrend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrendForOpp) return;

    const newOpp: Opportunity = {
      id: `opp-${Date.now().toString().slice(-4)}`,
      campaignId: selectedCampaign?.id || 'cmp-2026-01',
      title: `Opportunity: ${selectedTrendForOpp.title}`,
      sourceType: 'Trend',
      sourceTitle: selectedTrendForOpp.title,
      businessAngle: oppAngle || `Edukasi pasar mengenai ${selectedTrendForOpp.title}`,
      audience: selectedCampaign?.audience || 'Decision Maker B2B',
      relevanceScore: selectedTrendForOpp.relevanceScore,
      momentumScore: 90,
      overallScore: Math.round((selectedTrendForOpp.relevanceScore + 90) / 2),
      action: 'Produce Now',
      status: 'In Content Development',
      publishingWindow: selectedTrendForOpp.publishingWindow,
      recommendedFormat: selectedTrendForOpp.type === 'Audio' ? 'Reels/Shorts' : 'Carousel'
    };

    createOpportunity(newOpp);
    setSelectedTrendForOpp(null);
    setOppAngle('');
    if (setActiveTab) setActiveTab('intel-opportunities');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-400" />
              Intelligence Layer (Trend Radar & Evidence Engine)
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Identifikasi signal pasar, trending hashtag, audio rights, event revalidation, & evidence pack terverifikasi</p>
          </div>
        </div>
        <RbacBanner moduleName="Intelligence Layer" requiredAction="canAddTrend" requiredRole="ROLE_STRATEGY_LEAD / ROLE_MARCOM_CREATOR / ROLE_FACT_CHECKER / ROLE_SYSTEM_ADMIN" />
      </div>

      {/* Tab 1: Trend Radar */}
      {intelTab === 'radar' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
              Live Signal Radar ({trends.length} Detected Signals)
            </h2>
            <span className="text-xs text-slate-400">Filtering Focus: {selectedCampaign?.name}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trends.map(trd => (
              <div key={trd.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3 shadow-xl">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-semibold border border-cyan-800">
                    {trd.type} • {trd.platform}
                  </span>
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {trd.verificationStatus}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-white line-clamp-2">{trd.title}</h3>

                <div className="p-2.5 rounded-2xl bg-slate-950 text-[11px] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Source:</span>
                    <span className="text-slate-300 font-medium truncate max-w-[180px]">{trd.source}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Confidence Score:</span>
                    <span className="text-emerald-400 font-bold">{trd.confidence}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Business Relevance:</span>
                    <span className="text-indigo-400 font-bold">{trd.relevanceScore}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Publishing Window:</span>
                    <span className="text-amber-300 font-medium">{trd.publishingWindow}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    trd.riskLevel === 'Low' ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
                  }`}>
                    Risk: {trd.riskLevel}
                  </span>
                  <button
                    onClick={() => setSelectedTrendForOpp(trd)}
                    className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-cyan-950/60 hover:bg-cyan-900 px-3 py-1.5 rounded-xl border border-cyan-800/50 transition-colors"
                  >
                    Konversi ke Opportunity <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Trending Hashtag */}
      {intelTab === 'hashtags' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white">Trending Hashtag Intelligence & Rationale</h2>
              <p className="text-xs text-slate-400">Rekomendasi hashtag berbasis relevance, saturation, dan brand fit (Bukan sekadar populer)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { tag: '#SmartLogisticsID', rec: 'USE', relevance: 92, rationale: 'Sangat sesuai produk TELPRO Smart Warehouse, relevansi audiens B2B 92%' },
              { tag: '#SupplyChainIndonesia', rec: 'USE', relevance: 88, rationale: 'Hashtag industri utama dengan kompetisi terukur' },
              { tag: '#SolusiBisnisDigital', rec: 'TEST', relevance: 75, rationale: 'Saturasi sedang, diuji untuk jangkauan UMKM' },
              { tag: '#ViralIndonesia2026', rec: 'AVOID', relevance: 12, rationale: '🚫 Dilarang: Saturasi sampah tinggi, risiko brand safety, tidak relevan' }
            ].map(h => (
              <div key={h.tag} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-extrabold text-white flex items-center gap-2">
                    {h.tag}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      h.rec === 'USE' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      h.rec === 'TEST' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      RECOMMENDATION: {h.rec}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{h.rationale}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 block">Relevansi</span>
                  <span className="text-xs font-bold text-cyan-400">{h.relevance}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Trending Audio (Rights Safety) */}
      {intelTab === 'audio' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Music className="w-4 h-4 text-purple-400" />
                Trending Audio & Commercial Rights Guardrail
              </h2>
              <p className="text-xs text-slate-400">Aturan Keamanan: Audio tanpa verifikasi hak cipta komersial dilarang lolos QA</p>
            </div>
          </div>

          <div className="space-y-3">
            {trends.filter(t => t.type === 'Audio').map(aud => (
              <div key={aud.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{aud.title}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      aud.audioRightsStatus === 'Verified for Intended Use'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : 'bg-rose-950 text-rose-300 border-rose-800'
                    }`}>
                      {aud.audioRightsStatus}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Source: <strong className="text-slate-200">{aud.source}</strong> • Momentum: <strong className="text-cyan-400">{aud.momentum}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {aud.audioRightsStatus === 'Verified for Intended Use' ? (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" /> Safe for Commercial Campaign
                    </span>
                  ) : (
                    <div className="text-right">
                      <span className="text-xs text-rose-400 font-semibold block">⚠️ Restricted / Needs License Review</span>
                      <span className="text-[10px] text-slate-500">AI Dilarang memberi label Safe</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Event Calendar */}
      {intelTab === 'events' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white">Event Calendar & Revalidation Engine</h2>
              <p className="text-xs text-slate-400">Jadwal revalidasi berkala: H-30, H-14, H-7, H-1, Hari-H untuk menjaga akurasi konten</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map(evt => (
              <div key={evt.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-semibold border border-indigo-800">
                    {evt.category}
                  </span>
                  <span className="text-slate-400">Version: v{evt.version}</span>
                </div>

                <h3 className="text-sm font-bold text-white">{evt.name}</h3>

                <div className="text-xs space-y-1 text-slate-300">
                  <div>📅 Tanggal: <strong className="text-white">{evt.dateStart} s/d {evt.dateEnd}</strong></div>
                  <div>📍 Lokasi: <strong className="text-white">{evt.venue}, {evt.city}</strong></div>
                  <div>🏢 Organizer: {evt.organizer}</div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Revalidation: {evt.revalidationStatus}
                  </span>
                  <button
                    onClick={() => revalidateEvent(evt.id)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 bg-indigo-950/60 px-2.5 py-1 rounded-xl border border-indigo-800/50"
                  >
                    <RotateCcw className="w-3 h-3" /> Revalidate Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Opportunity Board */}
      {intelTab === 'opportunities' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white">Opportunity Board ({opportunities.length})</h2>
              <p className="text-xs text-slate-400">Hasil konversi intelligence ke opsi sudut pandang bisnis yang siap diproduksi</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {opportunities.map(opp => (
              <div key={opp.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-semibold border border-rose-800">
                    Action: {opp.action}
                  </span>
                  <span className="text-emerald-400 font-bold text-xs">Score: {opp.overallScore}/100</span>
                </div>

                <h3 className="text-xs font-bold text-white">{opp.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed"><strong className="text-slate-400">Business Angle:</strong> {opp.businessAngle}</p>

                <div className="pt-2 border-t border-slate-800 space-y-2 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Format: <strong className="text-slate-200">{opp.recommendedFormat}</strong></span>
                    <span className="text-amber-300 font-medium">{opp.publishingWindow}</span>
                  </div>

                  <button
                    onClick={() => {
                      const newContentId = `cnt-${Date.now()}`;
                      const newVersionId = `ver-${Date.now()}-1`;
                      addContentWithVersion({
                        id: newContentId,
                        campaignId: selectedCampaign?.id || opp.campaignId || 'cmp-e2e',
                        opportunityId: opp.id,
                        title: opp.title,
                        objective: `B2B Campaign Activation from Opportunity ${opp.title}`,
                        audience: opp.audience,
                        platform: 'LinkedIn',
                        format: (opp.recommendedFormat as any) || 'Carousel',
                        status: 'AI-Assisted Draft',
                        pic: activeUser.name,
                        currentVersionId: newVersionId
                      }, {
                        id: newVersionId,
                        contentId: newContentId,
                        versionNumber: 1,
                        brief: opp.businessAngle,
                        hook: `Hook: ${opp.title}`,
                        caption: `Draft Konten hasil konversi Opportunity ${opp.title}. Angle: ${opp.businessAngle}`,
                        script: `Script & Visual Flow untuk ${opp.title}`,
                        cta: 'Hubungi Sales TELPRO / Kunjungi telpro.id',
                        selectedKeywords: ['TELPRO', 'Business Growth'],
                        selectedHashtags: ['#TELPRO2026'],
                        createdBy: activeUser.name,
                        createdAt: new Date().toISOString(),
                        aiAssisted: true,
                        evidenceIds: [],
                        riskLevel: 'Low'
                      });
                      alert(`✅ Opportunity "${opp.title}" BERHASIL DISIMPAN KE PIPELINE KONTEN CAMPAIGN! Silakan cek di menu 04. CONTENT & PRODUCTION.`);
                    }}
                    className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-md transition-transform hover:scale-[1.02]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    🚀 Konversi & Simpan ke Pipeline Konten
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Evidence & Sources */}
      {intelTab === 'evidence' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white">Evidence Pack & Claim-to-Source Mapping</h2>
              <p className="text-xs text-slate-400">Prinsip Utama: No source, no fact. Setiap klaim publikasi wajib terhubung ke sumber bukti valid.</p>
            </div>
          </div>

          <div className="space-y-3">
            {evidences.map(evd => (
              <div key={evd.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-semibold border border-indigo-800">
                    {evd.sourceType}
                  </span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Confidence: {evd.confidenceScore}%
                  </span>
                </div>

                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>{evd.sourceTitle}</span>
                  <a href={evd.sourceUrl} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline flex items-center gap-0.5">
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 text-xs text-slate-200 border border-slate-800/80">
                  <strong className="text-rose-400 font-semibold block mb-0.5">Verified Claim Text:</strong>
                  "{evd.claimText}"
                </div>

                {evd.reviewerNote && (
                  <div className="text-[10px] text-slate-400 italic">
                    Note Reviewer QA: {evd.reviewerNote} (Terakhir diverifikasi: {new Date(evd.lastVerifiedAt).toLocaleDateString()})
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Convert Trend to Opportunity */}
      {selectedTrendForOpp && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">Konversi Trend ke Content Opportunity</h3>

            <div className="p-3 rounded-2xl bg-slate-950 text-xs space-y-1">
              <div className="text-slate-400">Trend Signal:</div>
              <div className="font-bold text-white">{selectedTrendForOpp.title}</div>
            </div>

            <form onSubmit={handleCreateOppFromTrend} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Sudut Pandang Bisnis (Business Angle) *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Bagaimana trend ini dikaitkan dengan keunggulan solusi TELPRO?"
                  value={oppAngle}
                  onChange={e => setOppAngle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedTrendForOpp(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-lg shadow-cyan-900/30"
                >
                  Buat Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
