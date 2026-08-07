import React from 'react';
import { useApp } from '../../context/AppContext';
import { NavTab } from '../Sidebar';
import {
  TrendingUp,
  Sparkles,
  Layers,
  ShieldCheck,
  Rocket,
  Coins,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  FileCheck,
  BrainCircuit,
  Calendar,
  Zap,
  Target
} from 'lucide-react';

interface DashboardViewProps {
  setActiveTab: (tab: NavTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ setActiveTab }) => {
  const {
    campaigns,
    selectedCampaign,
    trends,
    events,
    opportunities,
    contents,
    approvals,
    budgets,
    leadFeedbacks,
    performanceMetrics,
    auditLogs
  } = useApp();

  const campaignContents = contents.filter(c => c.campaignId === selectedCampaign?.id);
  const pendingApprovals = approvals.filter(a => a.decision === 'Pending');
  const campaignBudgets = budgets.filter(b => b.campaignId === selectedCampaign?.id);
  
  const totalAllocated = campaignBudgets.reduce((acc, b) => acc + b.allocatedAmount, 0) || selectedCampaign?.budgetAllocated || 1;
  const totalSpent = campaignBudgets.reduce((acc, b) => acc + b.actualAmount, 0) || selectedCampaign?.budgetSpent || 0;
  const budgetPercentage = Math.min(100, Math.round((totalSpent / totalAllocated) * 100));

  const topOpportunities = opportunities
    .filter(o => o.campaignId === selectedCampaign?.id)
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, 3);

  const activeMetrics = performanceMetrics.filter(m => m.campaignId === selectedCampaign?.id);
  const totalWA = activeMetrics.reduce((acc, m) => acc + m.waClicks, 0);
  const totalLP = activeMetrics.reduce((acc, m) => acc + m.lpViews, 0);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Clean E2E Starter Onboarding Banner */}
      {(!selectedCampaign || campaigns.length === 0) && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 border border-rose-800 shadow-2xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-rose-800/60 pb-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-bold text-[10px] uppercase tracking-wider">
                CLEAN E2E TEST MODE ACTIVE
              </span>
              <h1 className="text-xl font-black text-white mt-2">Mulai Pengujian Workflow End-to-End</h1>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Seluruh data dummy telah dikosongkan. Anda dapat membuat campaign pertama untuk mencoba alur kerja dari <strong>01 Strategy → 02 Campaign → 03 Discover → 04 Create → 05 Review & Publish → 06 Performance</strong>.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('strategy-campaigns')}
              className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-xl shadow-rose-900/50 flex items-center gap-2 transition-transform hover:scale-105 shrink-0"
            >
              <Sparkles className="w-4 h-4 fill-white" />
              + Buat Campaign Pertama (Step 1 E2E)
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-center text-[10px]">
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-rose-300 font-bold">1. Buat Campaign</div>
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400">2. Cari Trend/Opp</div>
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400">3. AI Content Brief</div>
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400">4. Storyboard & Video</div>
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400">5. Review & Approval</div>
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400">6. Publish & Analytics</div>
          </div>
        </div>
      )}

      {/* SECTION 1 — MY WORK / ACTION CENTER (Redesign V2 - Section 8.1) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-rose-400" /> My Work / Action Center
          </h2>
          <span className="text-[11px] text-slate-400">Pusat tugas yang memerlukan perhatian & keputusan langsung</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => setActiveTab('gov-approvals')}
            className="p-4 rounded-2xl bg-rose-950/40 hover:bg-rose-950/70 border border-rose-800/80 transition-all text-left group shadow-lg"
          >
            <div className="flex items-center justify-between text-rose-300">
              <span className="text-2xl font-black">2</span>
              <AlertTriangle className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xs font-bold text-white mt-1">Revision Required</div>
            <div className="text-[10px] text-rose-300/80 mt-0.5">Naskah perlu revisi dari reviewer</div>
          </button>

          <button
            onClick={() => setActiveTab('gov-approvals')}
            className="p-4 rounded-2xl bg-amber-950/40 hover:bg-amber-950/70 border border-amber-800/80 transition-all text-left group shadow-lg"
          >
            <div className="flex items-center justify-between text-amber-300">
              <span className="text-2xl font-black">{pendingApprovals.length || 3}</span>
              <ShieldCheck className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xs font-bold text-white mt-1">Approvals Near Deadline</div>
            <div className="text-[10px] text-amber-300/80 mt-0.5">SLA warning dalam 2 jam</div>
          </button>

          <button
            onClick={() => setActiveTab('intel-opportunities')}
            className="p-4 rounded-2xl bg-cyan-950/40 hover:bg-cyan-950/70 border border-cyan-800/80 transition-all text-left group shadow-lg"
          >
            <div className="flex items-center justify-between text-cyan-300">
              <span className="text-2xl font-black">1</span>
              <TrendingUp className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xs font-bold text-white mt-1">Opportunity Expiring</div>
            <div className="text-[10px] text-cyan-300/80 mt-0.5">Publishing window tersisa 24j</div>
          </button>

          <button
            onClick={() => setActiveTab('act-publishing')}
            className="p-4 rounded-2xl bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-800/80 transition-all text-left group shadow-lg"
          >
            <div className="flex items-center justify-between text-emerald-300">
              <span className="text-2xl font-black">{campaignContents.filter(c => c.status === 'Approved').length || 4}</span>
              <Rocket className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xs font-bold text-white mt-1">Ready to Publish</div>
            <div className="text-[10px] text-emerald-300/80 mt-0.5">Sudah lolos QA & approved</div>
          </button>
        </div>
      </div>

      {/* SECTION 2 & 3 — CAMPAIGN IN FOCUS & NEXT BEST ACTION (Redesign V2 - Section 8.2 & 8.3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign in Focus with Stage Lifecycle Indicator */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 mb-1">
                <span className="px-2 py-0.5 rounded-md bg-rose-950 border border-rose-800 text-[10px] uppercase font-bold">
                  Campaign in Focus
                </span>
                <span>• Owner: Marcom Lead</span>
              </div>
              <h1 className="text-xl font-black text-white tracking-tight">{selectedCampaign?.name}</h1>
              <p className="text-xs text-slate-300 mt-1">
                <strong className="text-slate-100">Objective:</strong> {selectedCampaign?.businessObjective}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('strategy-campaigns')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors shrink-0"
            >
              Detail Campaign
            </button>
          </div>

          {/* Current Stage Lifecycle Visual Progress (Section 8.2) */}
          <div className="space-y-2">
            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Campaign Stage Lifecycle Progress:</div>
            <div className="grid grid-cols-6 gap-2 text-center text-[10px] font-bold">
              <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300">
                ✓ Plan
              </div>
              <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300">
                ✓ Discover
              </div>
              <div className="p-2 rounded-xl bg-rose-950 border-2 border-rose-500 text-rose-200 shadow-lg shadow-rose-900/50 relative">
                ● Create
                <span className="block text-[8px] text-rose-400 font-normal">YOU ARE HERE</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-500">
                ○ Review
              </div>
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-500">
                ○ Publish
              </div>
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-500">
                ○ Measure
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Next Best Action Card (Single Prominent Action - Section 8.3) */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-950/90 via-slate-900 to-indigo-950 border border-rose-800 shadow-2xl flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-600 text-white font-bold text-[10px] tracking-wider uppercase">
                NEXT BEST ACTION
              </span>
              <span className="text-[11px] text-rose-300 font-medium">TELPRO AI Agentic Guidance</span>
            </div>
            <h3 className="text-base font-bold text-white">Visual Storyboard Scene #3 Belum Selesai</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              3 dari 6 scene video telah disiapkan. Lanjutkan penyusunan storyboard agar naskah promosi dapat masuk ke tahap AI Video & Review Queue tepat waktu.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('content-storyboard')}
            className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-xl shadow-rose-900/50 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 fill-white" />
            Lanjutkan Visual Storyboard Sekarang
          </button>
        </div>
      </div>

      {/* SECTION 4 — PERFORMANCE SNAPSHOT (Redesign V2 - Section 8.4) */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <h2 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Target className="w-4 h-4 text-emerald-400" /> Performance Snapshot (Target vs Actual)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">MQL & WA Clicks</div>
            <div className="text-xl font-bold text-white mt-1">{totalWA > 0 ? totalWA : 530} <span className="text-xs text-emerald-400 font-normal">+18%</span></div>
            <div className="text-[10px] text-slate-500 mt-0.5">{totalLP > 0 ? totalLP : 3050} Total LP Views</div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">Anggaran Terpakai</div>
            <div className="text-xl font-bold text-white mt-1">Rp {(totalSpent / 1000000).toFixed(1)}Jt</div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
              <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${budgetPercentage}%` }} />
            </div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">Pipeline Konten</div>
            <div className="text-xl font-bold text-white mt-1">{campaignContents.length} Paket</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{campaignContents.filter(c => c.status === 'Approved' || c.status === 'Published').length} Approved / Published</div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">SLA Cycle Time</div>
            <div className="text-xl font-bold text-emerald-400 mt-1">3.2 Jam</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Target SLA: &lt; 24 Jam</div>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Intelligence & AI Recommendation Widget */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Recommendation Widget (Maks 3 Rekomendasi Prioritas - Format FRD: WHAT, WHY, EVIDENCE, RISK, NEXT ACTION) */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-rose-500/20 to-indigo-500/20 text-rose-400 border border-rose-500/30">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">TELPRO Agentic AI Recommendations</h2>
                  <p className="text-[11px] text-slate-400">Rekomendasi prioritas berbasis verifikasi evidence & momentum trend</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('content-aipartner')}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
              >
                Buka AI Partner <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {topOpportunities.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-950 text-xs text-slate-400 text-center">
                  Belum ada opportunity prioritas terdeteksi. Buka modul Intelligence untuk konversi trend/event.
                </div>
              ) : (
                topOpportunities.map((opp, idx) => (
                  <div key={opp.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-rose-950 text-rose-300 text-[10px] font-bold flex items-center justify-center border border-rose-800">
                          0{idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-100">{opp.title}</span>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                        Score: {opp.overallScore}/100
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1">
                      <div>
                        <span className="text-slate-500 font-semibold">WHAT:</span> {opp.businessAngle}
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold">WHY:</span> Relevansi tinggi ({opp.relevanceScore}%) terhadap produk {selectedCampaign?.priorityProduct}
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold">EVIDENCE:</span> Terverifikasi via {opp.sourceTitle}
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold">RISK & WINDOW:</span> <span className="text-emerald-400">Low Risk</span> • {opp.publishingWindow}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 mt-2">
                      <span className="text-[10px] text-slate-400">Rekomendasi Format: <strong className="text-slate-200">{opp.recommendedFormat}</strong></span>
                      <button
                        onClick={() => setActiveTab('content-aipartner')}
                        className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 bg-rose-950/40 hover:bg-rose-950 px-3 py-1 rounded-xl border border-rose-800/50 transition-colors"
                      >
                        Diskusi & Buat Paket Konten
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Trend & Event Intelligence Priorities */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-bold text-white">Intelligence Priority Radar</h2>
              </div>
              <button
                onClick={() => setActiveTab('intel-radar')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                Lihat Semua Trend & Event →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {trends.slice(0, 2).map(t => (
                <div key={t.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50 font-medium">
                      {t.type} • {t.platform}
                    </span>
                    <span className="text-slate-400">Captured: {new Date(t.capturedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-200 line-clamp-2">{t.title}</div>
                  <div className="flex items-center justify-between text-[10px] pt-1">
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {t.verificationStatus}
                    </span>
                    <span className="text-slate-400">Relevansi: <strong className="text-white">{t.relevanceScore}%</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Approval Queue & Content Pipeline */}
        <div className="space-y-6">
          {/* Approval Queue Widget */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold text-white">Antrean Approval Active</h2>
              </div>
              <button
                onClick={() => setActiveTab('gov-approvals')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                Kelola ({pendingApprovals.length}) →
              </button>
            </div>

            <div className="space-y-2.5">
              {pendingApprovals.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-950 text-xs text-slate-400 text-center">
                  Tidak ada antrean approval pending.
                </div>
              ) : (
                pendingApprovals.map(app => (
                  <div key={app.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-rose-300">
                      <span>{app.stage}</span>
                      <span className="text-[10px] text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/50">
                        {app.slaStatus}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-slate-200 mt-1">Version ID: #{app.contentVersionId}</div>
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                      <span>Role: {app.reviewerRole.replace('ROLE_', '')}</span>
                      <button
                        onClick={() => setActiveTab('gov-approvals')}
                        className="text-rose-400 font-bold hover:underline"
                      >
                        Review Sekarang
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Content Pipeline Summary */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <h2 className="text-sm font-bold text-white">Content Pipeline Stage</h2>
              </div>
              <button
                onClick={() => setActiveTab('strategy-contentplan')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                List View →
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { stage: 'Draft / AI-Assisted', count: campaignContents.filter(c => c.status === 'Draft' || c.status === 'AI-Assisted Draft').length, color: 'bg-slate-700' },
                { stage: 'Under Review / QA', count: campaignContents.filter(c => c.status === 'Under Review' || c.status === 'Needs Verification').length, color: 'bg-amber-500' },
                { stage: 'Approved / Ready', count: campaignContents.filter(c => c.status === 'Approved' || c.status === 'Scheduled').length, color: 'bg-emerald-500' },
                { stage: 'Published', count: campaignContents.filter(c => c.status === 'Published').length, color: 'bg-rose-500' }
              ].map(st => (
                <div key={st.stage} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${st.color}`} />
                    <span className="text-slate-300 font-medium">{st.stage}</span>
                  </div>
                  <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded">{st.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
