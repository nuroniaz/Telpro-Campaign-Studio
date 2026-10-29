import React from 'react';
import { useApp } from '../../context/AppContext';
import { NavTab } from '../Sidebar';
import { WorkflowPipelineBar } from '../Common/WorkflowPipelineBar';
import { isExecutiveApprover } from '../../utils/rbac';
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
    activeUser,
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

  const isApprover = isExecutiveApprover(activeUser);

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
        <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-50 via-white to-indigo-50 border border-rose-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-rose-100 pb-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-bold text-[10px] uppercase tracking-wider">
                CLEAN E2E TEST MODE ACTIVE
              </span>
              <h1 className="text-xl font-black text-slate-900 mt-2">Mulai Pengujian Workflow End-to-End</h1>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Seluruh data dummy telah dikosongkan. Anda dapat membuat campaign pertama untuk mencoba alur kerja dari <strong>01 Strategy → 02 Campaign → 03 Discover → 04 Create → 05 Review & Publish → 06 Performance</strong>.
              </p>
            </div>
            {isApprover ? (
              <button
                onClick={() => setActiveTab('gov-approvals')}
                className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-200 flex items-center gap-2 transition-transform hover:scale-105 shrink-0 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                Antrean Approval &amp; Tata Kelola
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('strategy-campaigns')}
                className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-200 flex items-center gap-2 transition-transform hover:scale-105 shrink-0 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-white" />
                + Buat Campaign Pertama (Step 1 E2E)
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-center text-[10px]">
            <div className="p-2 rounded-xl bg-white border border-rose-200 text-rose-700 font-bold">1. Buat Campaign</div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500">2. Cari Trend/Opp</div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500">3. AI Content Brief</div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500">4. Storyboard & Video</div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500">5. Review & Approval</div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500">6. Publish & Analytics</div>
          </div>
        </div>
      )}

      {/* Universal Sequential Workflow Pipeline Bar */}
      <WorkflowPipelineBar currentStage="01" setActiveTab={setActiveTab} titleSuffix="Ikhtisar Lintas Modul & Action Center (Langkah ke-1)" />

      {/* SECTION 1 — MY WORK / ACTION CENTER */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Zap className="w-4 h-4 text-rose-600" /> My Work / Action Center
          </h2>
          <span className="text-[11px] text-slate-500">Pusat tugas yang memerlukan perhatian & keputusan langsung</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => setActiveTab('gov-approvals')}
            className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-100/70 hover:from-rose-100 hover:to-pink-200/70 border border-rose-300 transition-all text-left group shadow-xs cursor-pointer hover:shadow-md hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between text-rose-700">
              <span className="text-2xl font-black">2</span>
              <AlertTriangle className="w-5 h-5 text-rose-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xs font-bold text-slate-900 mt-1">Revision Required</div>
            <div className="text-[10px] text-rose-800 mt-0.5 font-medium">Naskah perlu revisi dari reviewer</div>
          </button>

          <button
            onClick={() => setActiveTab('gov-approvals')}
            className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100/70 hover:from-amber-100 hover:to-orange-200/70 border border-amber-300 transition-all text-left group shadow-xs cursor-pointer hover:shadow-md hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between text-amber-700">
              <span className="text-2xl font-black">{pendingApprovals.length || 3}</span>
              <ShieldCheck className="w-5 h-5 text-amber-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xs font-bold text-slate-900 mt-1">Approvals Near Deadline</div>
            <div className="text-[10px] text-amber-800 mt-0.5 font-medium">SLA warning dalam 2 jam</div>
          </button>

          <button
            onClick={() => setActiveTab('intel-opportunities')}
            className="p-4 rounded-2xl bg-gradient-to-br from-sky-50 to-cyan-100/70 hover:from-sky-100 hover:to-cyan-200/70 border border-sky-300 transition-all text-left group shadow-xs cursor-pointer hover:shadow-md hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between text-sky-700">
              <span className="text-2xl font-black">1</span>
              <TrendingUp className="w-5 h-5 text-sky-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xs font-bold text-slate-900 mt-1">Opportunity Expiring</div>
            <div className="text-[10px] text-sky-800 mt-0.5 font-medium">Publishing window tersisa 24j</div>
          </button>

          <button
            onClick={() => setActiveTab(isApprover ? 'gov-approvals' : 'act-publishing')}
            className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100/70 hover:from-emerald-100 hover:to-teal-200/70 border border-emerald-300 transition-all text-left group shadow-xs cursor-pointer hover:shadow-md hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between text-emerald-700">
              <span className="text-2xl font-black">{campaignContents.filter(c => c.status === 'Approved').length || 4}</span>
              <Rocket className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xs font-bold text-slate-900 mt-1">
              {isApprover ? 'Approved • Siap Posting' : 'Ready to Publish'}
            </div>
            <div className="text-[10px] text-emerald-800 mt-0.5 font-medium">
              {isApprover ? 'Diposting oleh Marcomm & Corcomm' : 'Sudah lolos QA & approved'}
            </div>
          </button>
        </div>
      </div>

      {/* SECTION 2 & 3 — CAMPAIGN IN FOCUS & NEXT BEST ACTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign in Focus with Stage Lifecycle Indicator */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white/95 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 mb-1">
                <span className="px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-[10px] uppercase font-bold">
                  Campaign in Focus
                </span>
                <span className="text-slate-500">• Owner: Marcom Lead</span>
              </div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">{selectedCampaign?.name}</h1>
              <p className="text-xs text-slate-600 mt-1">
                <strong className="text-slate-800">Objective:</strong> {selectedCampaign?.businessObjective}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('strategy-campaigns')}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors shrink-0 cursor-pointer"
            >
              Detail Campaign
            </button>
          </div>

          {/* Current Stage Lifecycle Visual Progress */}
          <div className="space-y-2">
            <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Campaign Stage Lifecycle Progress:</div>
            <div className="grid grid-cols-6 gap-2 text-center text-[10px] font-bold">
              <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700">
                ✓ Plan
              </div>
              <div className="p-2 rounded-xl bg-sky-50 border border-sky-200 text-sky-700">
                ✓ Discover
              </div>
              <div className="p-2 rounded-xl bg-rose-50 border-2 border-rose-500 text-rose-800 shadow-xs relative">
                ● Create
                <span className="block text-[8px] text-rose-600 font-semibold">YOU ARE HERE</span>
              </div>
              <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-700">
                ○ Review
              </div>
              <div className="p-2 rounded-xl bg-purple-50/70 border border-purple-200 text-purple-700">
                ○ Publish
              </div>
              <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-700">
                ○ Measure
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Next Best Action Card */}
        <div className={`p-6 rounded-3xl text-white shadow-xl border flex flex-col justify-between space-y-4 ${
          isApprover
            ? 'bg-gradient-to-br from-rose-900 via-indigo-950 to-slate-900 border-rose-800 shadow-rose-900/20'
            : 'bg-gradient-to-br from-indigo-700 via-purple-700 to-rose-600 border-indigo-500 shadow-indigo-500/20'
        }`}>
          {isApprover ? (
            <>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/30 text-rose-200 font-black text-[10px] tracking-wider uppercase border border-rose-400/40 backdrop-blur flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-rose-300" /> TATA KELOLA & APPROVAL
                  </span>
                  <span className="text-[11px] text-rose-100 font-medium">Mode Executive Approver</span>
                </div>
                <h3 className="text-base font-bold text-white">
                  {pendingApprovals.length > 0
                    ? `${pendingApprovals.length} Draf Konten Menanti Persetujuan Anda`
                    : 'Antrean Otorisasi Aman & Terkendali'}
                </h3>
                <p className="text-xs text-rose-100/90 leading-relaxed">
                  Sebagai Executive Approver, kewenangan akun Anda dikhususkan untuk peninjauan risiko, audit kepatuhan bukti fakta, dan pemberian persetujuan resmi. Pembuatan konten dikelola oleh Marcomm & Corcomm Creator.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('content-approval')}
                className="w-full py-3 rounded-2xl bg-white hover:bg-rose-50 text-rose-950 font-black text-xs shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-rose-600" />
                Buka Antrean Approval Konten
              </button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-white font-black text-[10px] tracking-wider uppercase border border-white/30 backdrop-blur">
                    NEXT BEST ACTION
                  </span>
                  <span className="text-[11px] text-indigo-100 font-medium">TELPRO AI Agentic Guidance</span>
                </div>
                <h3 className="text-base font-bold text-white">Visual Storyboard Scene #3 Belum Selesai</h3>
                <p className="text-xs text-indigo-100 leading-relaxed">
                  3 dari 6 scene video telah disiapkan. Lanjutkan penyusunan storyboard agar naskah promosi dapat masuk ke tahap AI Video & Review Queue tepat waktu.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('content-storyboard')}
                className="w-full py-3 rounded-2xl bg-white hover:bg-slate-100 text-indigo-950 font-black text-xs shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-rose-600 fill-rose-600" />
                Lanjutkan Visual Storyboard Sekarang
              </button>
            </>
          )}
        </div>
      </div>

      {/* SECTION 4 — PERFORMANCE SNAPSHOT */}
      <div className="p-5 rounded-3xl bg-white/95 border border-slate-200 shadow-sm space-y-3">
        <h2 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <Target className="w-4 h-4 text-emerald-600" /> Performance Snapshot (Target vs Actual)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-sky-50/70 p-3.5 rounded-2xl border border-sky-200">
            <div className="text-[11px] text-sky-800 font-medium">MQL & WA Clicks</div>
            <div className="text-xl font-bold text-slate-900 mt-1">{totalWA > 0 ? totalWA : 530} <span className="text-xs text-emerald-600 font-semibold">+18%</span></div>
            <div className="text-[10px] text-sky-700 mt-0.5">{totalLP > 0 ? totalLP : 3050} Total LP Views</div>
          </div>

          <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200">
            <div className="text-[11px] text-amber-800 font-medium">Anggaran Terpakai</div>
            <div className="text-xl font-bold text-slate-900 mt-1">Rp {(totalSpent / 1000000).toFixed(1)}Jt</div>
            <div className="w-full bg-amber-200 rounded-full h-1.5 mt-2">
              <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${budgetPercentage}%` }} />
            </div>
          </div>

          <div className="bg-indigo-50/70 p-3.5 rounded-2xl border border-indigo-200">
            <div className="text-[11px] text-indigo-800 font-medium">Pipeline Konten</div>
            <div className="text-xl font-bold text-slate-900 mt-1">{campaignContents.length} Paket</div>
            <div className="text-[10px] text-indigo-700 mt-0.5">{campaignContents.filter(c => c.status === 'Approved' || c.status === 'Published').length} Approved / Published</div>
          </div>

          <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200">
            <div className="text-[11px] text-emerald-800 font-medium">SLA Cycle Time</div>
            <div className="text-xl font-bold text-emerald-700 mt-1">3.2 Jam</div>
            <div className="text-[10px] text-emerald-600 mt-0.5">Target SLA: &lt; 24 Jam</div>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Intelligence & AI Recommendation Widget */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Recommendation Widget */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">TELPRO Agentic AI Recommendations</h2>
                  <p className="text-[11px] text-slate-500">Rekomendasi prioritas berbasis verifikasi evidence & momentum trend</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('content-aipartner')}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
              >
                Buka AI Partner <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {topOpportunities.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-50 text-xs text-slate-500 text-center border border-slate-200">
                  Belum ada opportunity prioritas terdeteksi. Buka modul Intelligence untuk konversi trend/event.
                </div>
              ) : (
                topOpportunities.map((opp, idx) => (
                  <div key={opp.id} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 hover:border-slate-300 transition-all space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold flex items-center justify-center border border-rose-200">
                          0{idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{opp.title}</span>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Score: {opp.overallScore}/100
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
                      <div>
                        <span className="text-slate-400 font-semibold">WHAT:</span> {opp.businessAngle}
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold">WHY:</span> Relevansi tinggi ({opp.relevanceScore}%) terhadap produk {selectedCampaign?.priorityProduct}
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold">EVIDENCE:</span> Terverifikasi via {opp.sourceTitle}
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold">RISK & WINDOW:</span> <span className="text-emerald-600">Low Risk</span> • {opp.publishingWindow}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 mt-2">
                      <span className="text-[10px] text-slate-500">Rekomendasi Format: <strong className="text-slate-800">{opp.recommendedFormat}</strong></span>
                      {isApprover ? (
                        <button
                          onClick={() => setActiveTab('content-approval')}
                          className="text-[11px] font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1 rounded-xl border border-rose-200 transition-colors cursor-pointer flex items-center gap-1"
                          title="Sebagai Executive Approver, kewenangan Anda berfokus pada otorisasi resmi"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                          Tinjau di Antrean Approval
                        </button>
                      ) : (
                        <button
                          onClick={() => setActiveTab('content-aipartner')}
                          className="text-[11px] font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1 rounded-xl border border-rose-200 transition-colors cursor-pointer"
                        >
                          Diskusi & Buat Paket Konten
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Trend & Event Intelligence Priorities */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-600" />
                <h2 className="text-sm font-bold text-slate-900">Intelligence Priority Radar</h2>
              </div>
              <button
                onClick={() => setActiveTab('intel-radar')}
                className="text-xs text-cyan-600 hover:text-cyan-700 font-semibold cursor-pointer"
              >
                Lihat Semua Trend & Event →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {trends.slice(0, 2).map(t => (
                <div key={t.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-cyan-50 text-cyan-700 border border-cyan-200 font-medium">
                      {t.type} • {t.platform}
                    </span>
                    <span className="text-slate-400">Captured: {new Date(t.capturedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-800 line-clamp-2">{t.title}</div>
                  <div className="flex items-center justify-between text-[10px] pt-1">
                    <span className="text-emerald-600 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {t.verificationStatus}
                    </span>
                    <span className="text-slate-500">Relevansi: <strong className="text-slate-800">{t.relevanceScore}%</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Approval Queue & Content Pipeline */}
        <div className="space-y-6">
          {/* Approval Queue Widget */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-slate-900">Antrean Approval Active</h2>
              </div>
              <button
                onClick={() => setActiveTab('gov-approvals')}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer"
              >
                Kelola ({pendingApprovals.length}) →
              </button>
            </div>

            <div className="space-y-2.5">
              {pendingApprovals.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-50 text-xs text-slate-500 text-center border border-slate-200">
                  Tidak ada antrean approval pending.
                </div>
              ) : (
                pendingApprovals.map(app => (
                  <div key={app.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-rose-700">
                      <span>{app.stage}</span>
                      <span className="text-[10px] text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200">
                        {app.slaStatus}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-slate-800 mt-1">Version ID: #{app.contentVersionId}</div>
                    <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
                      <span>Role: {app.reviewerRole.replace('ROLE_', '')}</span>
                      <button
                        onClick={() => setActiveTab('gov-approvals')}
                        className="text-rose-600 font-bold hover:underline cursor-pointer"
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
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <h2 className="text-sm font-bold text-slate-900">Content Pipeline Stage</h2>
              </div>
              <button
                onClick={() => setActiveTab('strategy-contentplan')}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer"
              >
                List View →
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { stage: 'Draft / AI-Assisted', count: campaignContents.filter(c => c.status === 'Draft' || c.status === 'AI-Assisted Draft').length, color: 'bg-slate-400' },
                { stage: 'Under Review / QA', count: campaignContents.filter(c => c.status === 'Under Review' || c.status === 'Needs Verification').length, color: 'bg-amber-500' },
                { stage: 'Approved / Ready', count: campaignContents.filter(c => c.status === 'Approved' || c.status === 'Scheduled').length, color: 'bg-emerald-500' },
                { stage: 'Published', count: campaignContents.filter(c => c.status === 'Published').length, color: 'bg-rose-500' }
              ].map(st => (
                <div key={st.stage} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${st.color}`} />
                    <span className="text-slate-700 font-medium">{st.stage}</span>
                  </div>
                  <span className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">{st.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
