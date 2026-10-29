import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ContentItem, PostPublishStage, PostPublishData } from '../../types';
import {
  Rocket,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Share2,
  Layers,
  MessageSquare,
  Calendar,
  ArrowRight,
  ArrowUpRight,
  Download,
  Filter,
  Instagram,
  Eye,
  Users,
  Target,
  Clock,
  Bookmark,
  Zap,
  ChevronRight,
  RefreshCw,
  FileCheck2,
  FileSpreadsheet,
  Megaphone,
  Check,
  Building2
} from 'lucide-react';

interface PostPublishWorkflowViewProps {
  onNavigateToSchedule?: () => void;
}

export const PostPublishWorkflowView: React.FC<PostPublishWorkflowViewProps> = ({ onNavigateToSchedule }) => {
  const {
    contents,
    activeUser,
    decideOptimization,
    recordContentForReport,
    evaluateMonthlyStrategy,
    feedBackToPlanning
  } = useApp();

  // Active view tab inside Post-Publish flow
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<
    'monitoring' | 'optimization' | 'report' | 'monthly_eval'
  >('monitoring');

  // Account filter: All, @telprodico (Marcomm), @telkomproperty (Corcomm)
  const [accountFilter, setAccountFilter] = useState<'all' | '@telprodico' | '@telkomproperty'>(() => {
    if (activeUser.role === 'ROLE_CORCOMM_CREATOR') return '@telkomproperty';
    if (activeUser.role === 'ROLE_MARCOM_CREATOR') return '@telprodico';
    return 'all';
  });

  // Modal / Form state for Amplification
  const [amplifyingContent, setAmplifyingContent] = useState<ContentItem | null>(null);
  const [tacticStory, setTacticStory] = useState(true);
  const [tacticBoost, setTacticBoost] = useState(true);
  const [tacticBuzz, setTacticBuzz] = useState(false);
  const [amplificationBudget, setAmplificationBudget] = useState(750000);
  const [amplificationNotes, setAmplificationNotes] = useState('Tingkatkan eksposur ke kalangan General Affair & Procurement kawasan industri.');

  // Modal / Form state for Best Practice
  const [bestPracticeContent, setBestPracticeContent] = useState<ContentItem | null>(null);
  const [bestPracticeNotes, setBestPracticeNotes] = useState('Formula edukasi carousel teknis dengan studi kasus nyata terbukti menghasilkan rasio save 14.2% dan 18 inbound leads dalam 48 jam.');

  // Modal / Form state for Monthly Evaluation
  const [evaluatingContent, setEvaluatingContent] = useState<ContentItem | null>(null);
  const [strategyDecision, setStrategyDecision] = useState<'KEEP_CURRENT' | 'TWEAK_STRATEGY'>('TWEAK_STRATEGY');
  const [strategyTweakNotes, setStrategyTweakNotes] = useState('Tingkatkan porsi Carousel teknis dari 2x menjadi 4x per bulan. Geser slot tayang Kamis ke pukul 11:00 WIB saat B2B inquiry memuncak.');
  const [nextMonthAction, setNextMonthAction] = useState('Buat seri artikel 4-part: Panduan Audit Efisiensi Energi Gedung B2B.');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter published contents
  const publishedContents = contents.filter(c => c.status === 'PUBLISHED' || c.postPublish !== undefined);

  const filteredContents = publishedContents.filter(c => {
    if (accountFilter === 'all') return true;
    const account = c.postPublish?.targetAccount || (c.contentOwner === 'Corcomm' ? '@telkomproperty' : '@telprodico');
    return account === accountFilter;
  });

  // Group by stages according to Whimsical Diagram
  const monitoringItems = filteredContents.filter(c => !c.postPublish?.stage || c.postPublish?.stage === 'MONITORING');
  const amplifiedItems = filteredContents.filter(c => c.postPublish?.stage === 'AMPLIFICATION');
  const bestPracticeItems = filteredContents.filter(c => c.postPublish?.stage === 'BEST_PRACTICE');
  const recordedItems = filteredContents.filter(c => c.postPublish?.stage === 'RECORDED_FOR_REPORT');
  const evaluatedItems = filteredContents.filter(c => c.postPublish?.stage === 'MONTHLY_EVALUATION' || c.postPublish?.stage === 'CLOSED_LOOP_COMPLETED');

  // Handle Amplification Submit
  const handleConfirmAmplification = () => {
    if (!amplifyingContent) return;
    decideOptimization(
      amplifyingContent.id,
      true,
      {
        storyRepost: tacticStory,
        boostAds: tacticBoost,
        buzzComments: tacticBuzz,
        budgetEstimate: amplificationBudget,
        notes: amplificationNotes,
        startedAt: new Date().toISOString()
      }
    );
    showToast(`🚀 Amplifikasi berhasil diaktifkan untuk "${amplifyingContent.title.slice(0, 30)}..."!`);
    setAmplifyingContent(null);
    setActiveWorkflowStep('optimization');
  };

  // Handle Best Practice Submit
  const handleConfirmBestPractice = () => {
    if (!bestPracticeContent) return;
    decideOptimization(bestPracticeContent.id, false, undefined, bestPracticeNotes);
    showToast(`⭐ Konten "${bestPracticeContent.title.slice(0, 30)}..." berhasil didokumentasikan sebagai Best Practice!`);
    setBestPracticeContent(null);
    setActiveWorkflowStep('optimization');
  };

  // Handle Monthly Strategy Evaluation Submit
  const handleConfirmMonthlyEvaluation = () => {
    if (!evaluatingContent) return;
    evaluateMonthlyStrategy(evaluatingContent.id, strategyDecision, strategyTweakNotes, nextMonthAction);
    showToast(`📝 Hasil evaluasi bulanan berhasil dicatat & diumpankan ke perencanaan bulan depan!`);
    setEvaluatingContent(null);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Visual Closed-Loop Pipeline Banner (Whimsical Diagram Architecture) */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30 font-black text-[10px] tracking-wider uppercase flex items-center gap-1">
              <RefreshCw className="w-3 h-3 text-rose-400" /> CLOSED-LOOP WORKFLOW
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-mono text-[10px]">
              Whimsical Standard Flow
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 font-mono text-[10px]">
              Tujuan: Inbound Leads &amp; Reputasi (Bukan Penjualan)
            </span>
          </div>

          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <TrendingUp className="w-6 h-6 text-pink-400" />
            Siklus Pasca-Tayang &amp; Evaluasi Kolaborasi Bulanan
          </h1>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            Alur tata kelola konten pasca-publikasi: <strong>Monitoring Kinerja ➔ Keputusan Optimasi (Amplifikasi vs. Best Practice) ➔ Pencatatan Laporan ➔ Rapat Evaluasi Bulanan ➔ Perubahan Strategi ➔ Umpan Balik Perencanaan Bulan Depan</strong>.
          </p>
        </div>

        {/* Visual Workflow Steps Navigator */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mt-6 pt-4 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => setActiveWorkflowStep('monitoring')}
            className={`p-3 rounded-2xl text-left transition-all cursor-pointer border ${
              activeWorkflowStep === 'monitoring'
                ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-md ring-1 ring-indigo-400'
                : 'bg-slate-900/50 hover:bg-slate-800/60 border-slate-800 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
              <span>Langkah 1</span>
              <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 text-[9px] font-mono">
                {monitoringItems.length} Konten
              </span>
            </div>
            <div className="font-extrabold text-xs text-white">Monitoring Metrik</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Reach, Leads, Engagement</div>
          </button>

          <button
            type="button"
            onClick={() => setActiveWorkflowStep('optimization')}
            className={`p-3 rounded-2xl text-left transition-all cursor-pointer border ${
              activeWorkflowStep === 'optimization'
                ? 'bg-pink-600/30 border-pink-400 text-white shadow-md ring-1 ring-pink-400'
                : 'bg-slate-900/50 hover:bg-slate-800/60 border-slate-800 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
              <span>Langkah 2</span>
              <span className="px-1.5 py-0.2 rounded bg-pink-500/20 text-pink-300 text-[9px] font-mono">
                {amplifiedItems.length + bestPracticeItems.length} Tindakan
              </span>
            </div>
            <div className="font-extrabold text-xs text-white">Optimasi &amp; Best Practice</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Story, Ads vs Dokumentasi</div>
          </button>

          <button
            type="button"
            onClick={() => setActiveWorkflowStep('report')}
            className={`p-3 rounded-2xl text-left transition-all cursor-pointer border ${
              activeWorkflowStep === 'report'
                ? 'bg-emerald-600/30 border-emerald-400 text-white shadow-md ring-1 ring-emerald-400'
                : 'bg-slate-900/50 hover:bg-slate-800/60 border-slate-800 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
              <span>Langkah 3</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono">
                {recordedItems.length} Rekap
              </span>
            </div>
            <div className="font-extrabold text-xs text-white">Record for Report</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Kompilasi Data Laporan</div>
          </button>

          <button
            type="button"
            onClick={() => setActiveWorkflowStep('monthly_eval')}
            className={`p-3 rounded-2xl text-left transition-all cursor-pointer border ${
              activeWorkflowStep === 'monthly_eval'
                ? 'bg-amber-600/30 border-amber-400 text-white shadow-md ring-1 ring-amber-400'
                : 'bg-slate-900/50 hover:bg-slate-800/60 border-slate-800 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
              <span>Langkah 4</span>
              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono">
                {evaluatedItems.length} Evaluasi
              </span>
            </div>
            <div className="font-extrabold text-xs text-white">Evaluasi Kolaborasi Bulanan</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Strategy Change ➔ Next Month</div>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-sm animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Account & Context Filter Bar */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-bold flex items-center gap-1.5 mr-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" /> Filter Akun:
          </span>

          <button
            type="button"
            onClick={() => setAccountFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              accountFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Semua Akun ({publishedContents.length})
          </button>

          <button
            type="button"
            onClick={() => setAccountFilter('@telprodico')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              accountFilter === '@telprodico'
                ? 'bg-teal-700 text-white shadow-xs ring-1 ring-teal-500'
                : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200'
            }`}
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>@telprodico (Marcomm Leads)</span>
          </button>

          <button
            type="button"
            onClick={() => setAccountFilter('@telkomproperty')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              accountFilter === '@telkomproperty'
                ? 'bg-blue-700 text-white shadow-xs ring-1 ring-blue-500'
                : 'bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200'
            }`}
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>@telkomproperty (Corcomm PR)</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-500 font-medium">
          Menampilkan <strong className="text-slate-800">{filteredContents.length} konten terbit</strong> dalam siklus
        </div>
      </div>

      {/* =========================================================================
          STEP 1: MONITORING: IMPRESSIONS, ENGAGEMENTS & REACH (H+1 s/d H+7)
      ========================================================================= */}
      {activeWorkflowStep === 'monitoring' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Eye className="w-4 h-4 text-indigo-600" />
                Tahap 1: Monitoring Kinerja Pasca-Tayang (H+1 s/d H+7)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Konten yang baru dipublikasikan dipantau metrik performanya untuk menentukan apakah <em>perlu optimasi</em> atau <em>cukup &amp; sukses didokumentasikan</em>.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-200 font-bold shrink-0">
              {monitoringItems.length} Konten Menunggu Evaluasi
            </span>
          </div>

          {monitoringItems.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <div className="font-bold text-slate-800 text-sm">Semua Konten Telah Dievaluasi!</div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Tidak ada konten terbit yang masih menggantung di tahap monitoring awal. Lanjutkan ke langkah <strong>Optimasi &amp; Best Practice</strong> atau <strong>Evaluasi Kolaborasi Bulanan</strong>.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {monitoringItems.map((cnt) => {
                const metrics = cnt.postPublish?.metrics || {
                  impressions: 14200,
                  reach: 9800,
                  engagementRate: 4.6,
                  inboundLeads: 12,
                  linkClicks: 94,
                  saveRate: 7.2,
                  shares: 38,
                  comments: 19
                };
                const account = cnt.postPublish?.targetAccount || (cnt.contentOwner === 'Corcomm' ? '@telkomproperty' : '@telprodico');
                const isDico = account === '@telprodico';

                return (
                  <div
                    key={cnt.id}
                    className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-indigo-300 shadow-sm space-y-4 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold font-mono border ${
                            isDico
                              ? 'bg-teal-50 text-teal-800 border-teal-200'
                              : 'bg-blue-50 text-blue-800 border-blue-200'
                          }`}>
                            {account}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded-md">
                            {cnt.format}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            ID: {cnt.id}
                          </span>
                        </div>
                        <h4 className="font-black text-slate-900 text-sm">{cnt.title}</h4>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Tayang: {cnt.publishedAt ? new Date(cnt.publishedAt).toLocaleDateString('id-ID') : 'Hari ini'}
                        </span>
                      </div>
                    </div>

                    {/* Performance Metric Badges (Leads Focus) */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <div>
                        <div className="text-[10px] text-slate-500 font-medium">Jangkauan (Reach)</div>
                        <div className="font-mono font-black text-sm text-slate-900">{metrics.reach.toLocaleString()}</div>
                        <div className="text-[9px] text-slate-400 font-mono">{metrics.impressions.toLocaleString()} Impr.</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 font-medium">Engagement Rate</div>
                        <div className="font-mono font-black text-sm text-indigo-600">{metrics.engagementRate}%</div>
                        <div className="text-[9px] text-slate-400 font-mono">{metrics.comments} Komentar • {metrics.shares} Shares</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 font-medium">
                          {isDico ? 'Inbound Leads Masuk' : 'Stakeholder Inquiries'}
                        </div>
                        <div className="font-mono font-black text-sm text-emerald-600">
                          {metrics.inboundLeads} {isDico ? 'Leads' : 'Inquiries'}
                        </div>
                        <div className="text-[9px] text-emerald-700 font-bold">Via Form Bio &amp; WA</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 font-medium">Rasio Simpan (Save)</div>
                        <div className="font-mono font-black text-sm text-amber-600">{metrics.saveRate}%</div>
                        <div className="text-[9px] text-slate-400 font-mono">{metrics.linkClicks} Klik Tautan</div>
                      </div>
                    </div>

                    {/* Decision Diamond Prompt: Optimization Needed? (YES / NO) */}
                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                          <Zap className="w-4 h-4 text-amber-600" />
                          Keputusan Alur: Optimization Needed?
                        </div>
                        <p className="text-[11px] text-amber-900/80">
                          Apakah konten ini membutuhkan dorongan amplifikasi (Story, Ads, Buzz) atau performanya sudah cukup kuat untuk didokumentasikan?
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* YES -> Amplification */}
                        <button
                          type="button"
                          onClick={() => {
                            setAmplifyingContent(cnt);
                            setAmplificationNotes(`Amplifikasi untuk topik "${cnt.title.slice(0, 30)}..." guna meningkatkan perolehan leads prospek B2B.`);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                        >
                          <Megaphone className="w-3.5 h-3.5" />
                          <span>YES: Perlu Amplifikasi</span>
                        </button>

                        {/* NO -> Documentation Best Practice */}
                        <button
                          type="button"
                          onClick={() => {
                            setBestPracticeContent(cnt);
                            setBestPracticeNotes(`Formula konten "${cnt.title}" terbukti menghasilkan ${metrics.inboundLeads} leads dengan rasio save ${metrics.saveRate}%. Simpan sebagai template best practice.`);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>NO: Dokumentasi Best Practice</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          STEP 2: OPTIMIZATION NEEDED? (AMPLIFICATION vs BEST PRACTICE)
      ========================================================================= */}
      {activeWorkflowStep === 'optimization' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Section A: Amplified Contents (YES Pathway) */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-pink-600" />
                  Jalur YES: Amplifikasi Sedang Berjalan (Story, Boost Ads, Buzz Comments)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Konten yang dioptimasi untuk mendongkrak perolehan leads &amp; engagement
                </p>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-xl bg-pink-50 text-pink-700 font-bold border border-pink-200">
                {amplifiedItems.length} Konten Aktif
              </span>
            </div>

            {amplifiedItems.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 rounded-2xl bg-slate-50 border border-slate-100">
                Belum ada konten dalam jalur amplifikasi. Konten dari Tahap Monitoring yang memilih "YES" akan muncul di sini.
              </div>
            ) : (
              <div className="space-y-3">
                {amplifiedItems.map((cnt) => (
                  <div
                    key={cnt.id}
                    className="p-4 rounded-2xl bg-pink-50/40 border border-pink-200 hover:border-pink-300 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-800 text-[10px] font-bold">
                          {cnt.postPublish?.targetAccount || '@telprodico'}
                        </span>
                        <span className="font-extrabold text-slate-900 text-xs">
                          {cnt.title}
                        </span>
                      </div>

                      {/* Tactics list */}
                      <div className="flex flex-wrap items-center gap-2 text-[10px] pt-0.5">
                        <span className="text-slate-500 font-medium">Taktik Aktif:</span>
                        {cnt.postPublish?.amplificationTactics?.storyRepost && (
                          <span className="px-2 py-0.2 rounded bg-indigo-100 text-indigo-800 font-semibold">
                            ✓ Story Repost &amp; Poll
                          </span>
                        )}
                        {cnt.postPublish?.amplificationTactics?.boostAds && (
                          <span className="px-2 py-0.2 rounded bg-emerald-100 text-emerald-800 font-semibold">
                            ✓ Meta Boost Ads B2B
                          </span>
                        )}
                        {cnt.postPublish?.amplificationTactics?.buzzComments && (
                          <span className="px-2 py-0.2 rounded bg-amber-100 text-amber-800 font-semibold">
                            ✓ Buzz Internal Comments
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-600 italic mt-1">
                        "{cnt.postPublish?.amplificationTactics?.notes || 'Optimasi jangkauan audiens tertarget.'}"
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          recordContentForReport(cnt.id);
                          showToast(`📊 Konten "${cnt.title.slice(0, 25)}..." dicatat ke Laporan Bulanan!`);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Record for Report</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section B: Best Practice Documentation (NO Pathway) */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-indigo-600" />
                  Jalur NO: Dokumentasi Best Practice (Formula Sukses Tersimpan)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Konten dengan performa alami prima yang dijadikan acuan standar pembuatan konten berikutnya
                </p>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                {bestPracticeItems.length} Best Practice
              </span>
            </div>

            {bestPracticeItems.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 rounded-2xl bg-slate-50 border border-slate-100">
                Belum ada konten yang ditandai sebagai Best Practice. Konten dari Tahap Monitoring yang memilih "NO" akan terdokumentasi di sini.
              </div>
            ) : (
              <div className="space-y-3">
                {bestPracticeItems.map((cnt) => (
                  <div
                    key={cnt.id}
                    className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-200 hover:border-indigo-300 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                          {cnt.postPublish?.targetAccount || '@telprodico'}
                        </span>
                        <span className="font-extrabold text-slate-900 text-xs">
                          {cnt.title}
                        </span>
                        <span className="px-2 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold uppercase">
                          ⭐ High Converting Formula
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 font-medium">
                        Catatan Formula: <span className="text-slate-600 font-normal">{cnt.postPublish?.bestPracticeNotes}</span>
                      </p>

                      <div className="text-[10px] text-slate-500 flex items-center gap-2">
                        <span>Format: <strong>{cnt.format}</strong></span>
                        <span>•</span>
                        <span>Leads: <strong className="text-emerald-700">{cnt.postPublish?.metrics?.inboundLeads || 14} Leads Masuk</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          recordContentForReport(cnt.id);
                          showToast(`📊 Best practice "${cnt.title.slice(0, 25)}..." dicatat ke Laporan Bulanan!`);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Record for Report</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 3: RECORD FOR REPORT (Kompilasi Data Bulanan)
      ========================================================================= */}
      {activeWorkflowStep === 'report' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                Tahap 3: Rekap untuk Laporan (Record for Report)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kompilasi seluruh konten yang telah melalui optimasi maupun best practice untuk dibawa ke rapat evaluasi bulanan Marcomm &amp; Corcomm.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                showToast("📥 Berkas Rekap Bulanan (PDF/Excel) berhasil di-generate untuk Rapat Kolaborasi!");
              }}
              className="px-4 py-2 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Lembar Rekap Bulanan</span>
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Daftar Konten Siap Evaluasi Kolaborasi ({recordedItems.length} Konten):
              </h4>
              <span className="text-[10px] text-slate-400">Siap untuk Rapat Corcomm &amp; Marcomm</span>
            </div>

            {recordedItems.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 rounded-2xl bg-slate-50 border border-slate-100">
                Belum ada konten yang direkam ke laporan. Tekan tombol <strong>"Record for Report"</strong> di Tahap 2 untuk merekam konten.
              </div>
            ) : (
              <div className="space-y-3">
                {recordedItems.map((cnt) => (
                  <div
                    key={cnt.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[10px] font-bold">
                          {cnt.postPublish?.targetAccount || '@telprodico'}
                        </span>
                        <span className="font-extrabold text-slate-900 text-xs">{cnt.title}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-3">
                        <span>Format: <strong>{cnt.format}</strong></span>
                        <span>Leads: <strong className="text-emerald-700">{cnt.postPublish?.metrics?.inboundLeads || 12}</strong></span>
                        <span>Status: <strong className="text-indigo-700">Terekam untuk Rapat</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setEvaluatingContent(cnt);
                          setActiveWorkflowStep('monthly_eval');
                        }}
                        className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Evaluasi Strategi (Rapat)</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 4: MONTHLY COLLABORATION EVALUATION & STRATEGY CHANGE DECISION
      ========================================================================= */}
      {activeWorkflowStep === 'monthly_eval' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Executive Evaluation Header */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-amber-950 text-white border border-indigo-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 font-black text-[10px] tracking-wider uppercase">
                TAHAP 4 &amp; 5: FORUM EVALUASI BERSAMA
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Penyelenggara: Marcomm &amp; Corcomm Kantor Pusat
              </span>
            </div>

            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              Monthly Collaboration Evaluation • Rapat Evaluasi Bulanan
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              Agenda evaluasi bersama antara Marcomm (@telprodico) dan Corcomm (@telkomproperty) untuk meninjau efektivitas perolehan leads dan sentimen reputasi. Output forum ini menentukan apakah ada <strong>perubahan strategi (Strategy Change?)</strong> sebelum masuk ke perencanaan bulan berikutnya.
            </p>
          </div>

          {/* Interactive Strategy Change Decision Card */}
          {evaluatingContent ? (
            <div className="p-6 rounded-3xl bg-white border-2 border-amber-400 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                    Sedang Mengevaluasi Konten Terbit:
                  </div>
                  <h4 className="font-black text-slate-900 text-sm">{evaluatingContent.title}</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setEvaluatingContent(null)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600"
                >
                  Batal
                </button>
              </div>

              {/* Decision Diamond: Strategy Change? (YES / NO) */}
              <div className="space-y-3">
                <label className="block text-xs font-extrabold text-slate-800">
                  Keputusan Rapat: Strategy Change? (Perlukah Mengubah Strategi Konten?)
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option NO -> Keep Current */}
                  <label
                    className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                      strategyDecision === 'KEEP_CURRENT'
                        ? 'bg-emerald-50/60 border-emerald-500 shadow-sm ring-1 ring-emerald-400'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="strategy_decision"
                      value="KEEP_CURRENT"
                      checked={strategyDecision === 'KEEP_CURRENT'}
                      onChange={() => setStrategyDecision('KEEP_CURRENT')}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-extrabold text-xs text-emerald-950 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        NO: Keep Current (Pertahankan Formula)
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">
                        Pilar dan formula konten saat ini terbukti sangat efektif mencapai target leads &amp; reputasi. Tidak perlu mengubah strategi dasar.
                      </p>
                    </div>
                  </label>

                  {/* Option YES -> Tweak Strategy */}
                  <label
                    className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                      strategyDecision === 'TWEAK_STRATEGY'
                        ? 'bg-amber-50/60 border-amber-500 shadow-sm ring-1 ring-amber-400'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="strategy_decision"
                      value="TWEAK_STRATEGY"
                      checked={strategyDecision === 'TWEAK_STRATEGY'}
                      onChange={() => setStrategyDecision('TWEAK_STRATEGY')}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-extrabold text-xs text-amber-950 flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-amber-600" />
                        YES: Tweak Strategy (Penyesuaian Strategi)
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">
                        Perlu penyesuaian sudut pandang (angle), alokasi format visual, jam tayang B2B, atau penajaman CTA formulir konsultasi.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Form fields if Tweak Strategy */}
                {strategyDecision === 'TWEAK_STRATEGY' && (
                  <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-amber-900 uppercase tracking-wider mb-1">
                        Catatan Penyesuaian Strategi (Tweak Strategy Notes):
                      </label>
                      <textarea
                        rows={2}
                        value={strategyTweakNotes}
                        onChange={(e) => setStrategyTweakNotes(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-amber-300 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Misal: Perbanyak format Carousel edukatif, ubah jam posting ke Selasa pukul 10:00..."
                      />
                    </div>
                  </div>
                )}

                {/* Next Month Action Feed */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Umpan Balik untuk Perencanaan Bulan Depan (Planning For Next Month):
                  </label>
                  <input
                    type="text"
                    value={nextMonthAction}
                    onChange={(e) => setNextMonthAction(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:bg-white"
                    placeholder="Judul topik atau agenda prioritas untuk rapat editorial berikutnya..."
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleConfirmMonthlyEvaluation}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Simpan Evaluasi &amp; Tutup Siklus Konten</span>
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {/* Evaluated Archive and Loop Back to Start */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-emerald-600" />
                  Siklus Ditutup: Konten yang Telah Menyelesaikan Evaluasi ({evaluatedItems.length})
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Hasil dari konten ini langsung diumpankan kembali ke <strong>Meeting Perencanaan Editorial (Editorial Planning)</strong> bulan berikutnya.
                </p>
              </div>

              {onNavigateToSchedule && (
                <button
                  type="button"
                  onClick={onNavigateToSchedule}
                  className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer shrink-0"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Buka Content Planner Bulan Depan ➔</span>
                </button>
              )}
            </div>

            {evaluatedItems.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 rounded-2xl bg-slate-50 border border-slate-100">
                Belum ada konten yang menyelesaikan sesi evaluasi bulanan. Pilih konten di Tahap 3 (Record for Report) untuk memulai evaluasi.
              </div>
            ) : (
              <div className="space-y-3">
                {evaluatedItems.map((cnt) => (
                  <div
                    key={cnt.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[10px] font-bold">
                          {cnt.postPublish?.targetAccount || '@telprodico'}
                        </span>
                        <span className="font-extrabold text-slate-900 text-xs">{cnt.title}</span>
                      </div>

                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        cnt.postPublish?.monthlyEvaluation?.strategyDecision === 'KEEP_CURRENT'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {cnt.postPublish?.monthlyEvaluation?.strategyDecision === 'KEEP_CURRENT'
                          ? '✓ Keep Current'
                          : '⚡ Tweak Strategy Applied'}
                      </span>
                    </div>

                    {cnt.postPublish?.monthlyEvaluation?.tweakNotes && (
                      <p className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200 italic">
                        "{cnt.postPublish.monthlyEvaluation.tweakNotes}"
                      </p>
                    )}

                    <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                      <span>Evaluasi oleh: <strong>{cnt.postPublish?.monthlyEvaluation?.evaluatedBy || 'Marcomm & Corcomm Lead'}</strong></span>
                      <span className="text-emerald-700 font-bold">Umpan Balik: {cnt.postPublish?.monthlyEvaluation?.nextMonthAction || 'Diagendakan di Editorial Planning'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: AMPLIFICATION FORM (YES PATHWAY)
      ========================================================================= */}
      {amplifyingContent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-pink-600 font-black text-sm">
                <Megaphone className="w-5 h-5" />
                <span>Aktivasi Amplifikasi Konten (Jalur YES)</span>
              </div>
              <button
                type="button"
                onClick={() => setAmplifyingContent(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Tutup
              </button>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Target Konten:</div>
              <div className="font-extrabold text-slate-900 text-xs">{amplifyingContent.title}</div>
            </div>

            {/* Checkbox Options for Amplification */}
            <div className="space-y-2.5 text-xs">
              <label className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tacticStory}
                  onChange={(e) => setTacticStory(e.target.checked)}
                  className="rounded text-pink-600 focus:ring-pink-500"
                />
                <div>
                  <div className="font-bold text-slate-900">Instagram Story Repost</div>
                  <div className="text-[11px] text-slate-500">Tayangkan ulang cuplikan di Story dengan Stiker Link / Poll B2B.</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tacticBoost}
                  onChange={(e) => setTacticBoost(e.target.checked)}
                  className="rounded text-pink-600 focus:ring-pink-500"
                />
                <div>
                  <div className="font-bold text-slate-900">Meta Boost Ads (Tertarget B2B)</div>
                  <div className="text-[11px] text-slate-500">Dorong iklan berbayar dengan target General Affair, IT Head, dan Procurement.</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tacticBuzz}
                  onChange={(e) => setTacticBuzz(e.target.checked)}
                  className="rounded text-pink-600 focus:ring-pink-500"
                />
                <div>
                  <div className="font-bold text-slate-900">Buzz Comments (Pancingan Diskusi Internal)</div>
                  <div className="text-[11px] text-slate-500">Komentar pancingan profesional oleh tim internal untuk memicu algoritma interaksi.</div>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Catatan Arahan Amplifikasi:
              </label>
              <textarea
                rows={2}
                value={amplificationNotes}
                onChange={(e) => setAmplificationNotes(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:bg-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAmplifyingContent(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmAmplification}
                className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Megaphone className="w-3.5 h-3.5" />
                <span>Aktifkan Amplifikasi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: BEST PRACTICE DOCUMENTATION (NO PATHWAY)
      ========================================================================= */}
      {bestPracticeContent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-indigo-600 font-black text-sm">
                <Bookmark className="w-5 h-5" />
                <span>Dokumentasi Best Practice (Jalur NO)</span>
              </div>
              <button
                type="button"
                onClick={() => setBestPracticeContent(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Tutup
              </button>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Konten Terpilih:</div>
              <div className="font-extrabold text-slate-900 text-xs">{bestPracticeContent.title}</div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Catatan Formula &amp; Alasan Keberhasilan (Best Practice Notes):
              </label>
              <textarea
                rows={4}
                value={bestPracticeNotes}
                onChange={(e) => setBestPracticeNotes(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:bg-white leading-relaxed"
                placeholder="Tuliskan formula naskah, struktur visual, atau hook 3 detik yang membuat konten ini berhasil..."
              />
            </div>

            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-900 text-[11px] font-medium border border-indigo-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Konten ini akan tersimpan sebagai rujukan resmi saat tim menyusun naskah di Studio AI.</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setBestPracticeContent(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmBestPractice}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Simpan Best Practice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
