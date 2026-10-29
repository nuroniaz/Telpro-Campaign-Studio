import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ContentItem, GovernanceComment } from '../../types';
import {
  canExecuteJointReview,
  canApproveVpCorsec,
  canFinalApprove,
  hasUserPermission,
  isExecutiveApprover
} from '../../utils/rbac';
import {
  ShieldCheck,
  Check,
  X,
  AlertTriangle,
  Clock,
  UserCheck,
  Award,
  ChevronRight,
  MessageSquare,
  FileCheck2,
  Lock,
  Sparkles,
  Layers,
  ArrowUpRight,
  Zap,
  CheckCircle2,
  ThumbsUp,
  Send,
  Eye,
  Quote,
  SendHorizontal
} from 'lucide-react';

interface ApprovalGovernanceViewProps {
  onNavigateToPublish?: () => void;
}

export const ApprovalGovernanceView: React.FC<ApprovalGovernanceViewProps> = ({
  onNavigateToPublish
}) => {
  const {
    contents,
    activeUser,
    executeJointReview,
    executeVpCorsecApproval,
    executeFinalApproval,
    addGovernanceComment,
    auditLogs
  } = useApp();

  const [selectedContentId, setSelectedContentId] = useState<string | null>(
    contents.find(c => c.status === 'IN REVIEW' || c.status === 'Ready for Review')?.id || contents[0]?.id || null
  );

  // Joint review checklist state
  const [checklist, setChecklist] = useState({
    brandSafety: true,
    factCheck: true,
    claimCheck: true,
    corporateTone: true
  });

  const [revisionNote, setRevisionNote] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showDifferenceGuide, setShowDifferenceGuide] = useState(false);
  const [queueFilter, setQueueFilter] = useState<'all' | 'priority' | 'approved'>('all');
  const [showFullTechDetails, setShowFullTechDetails] = useState(false);

  // VP Corsec Audit Form State
  const [vpCategory, setVpCategory] = useState<string>('Brand Safety & Reputasi Holding');
  const [vpUrgency, setVpUrgency] = useState<GovernanceComment['urgency']>('Wajib Penyesuaian');
  const [vpAuditNote, setVpAuditNote] = useState<string>('');

  // Plt. Dirut Directive State (Ultra-Simple)
  const DIRUT_PRESET_CHIPS = [
    '👍 Narasi tajam & pas, lanjutkan!',
    '🎯 Pertajam benefit efisiensi B2B',
    '📈 Kuatkan highlight angka kinerja',
    '💡 Sederhanakan bahasa naskah',
    '⏱️ Jadwalkan di prime time jam kerja'
  ];
  const [selectedDirutChip, setSelectedDirutChip] = useState<string>(DIRUT_PRESET_CHIPS[0]);
  const [dirutMemo, setDirutMemo] = useState<string>('');

  // Creator / General Response State
  const [creatorReply, setCreatorReply] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const isApprover = isExecutiveApprover(activeUser);

  // Permissions check for active user
  const canDoJoint = canExecuteJointReview(activeUser);
  const canDoVp = canApproveVpCorsec(activeUser);
  const canDoFinal = canFinalApprove(activeUser);

  // Items awaiting approval
  const inReviewItems = contents.filter(
    c => c.status === 'IN REVIEW' || c.status === 'Ready for Review' || c.status === 'PLANNED'
  );
  const approvedItems = contents.filter(
    c => c.status === 'APPROVED' || c.status === 'SCHEDULED' || c.status === 'PUBLISHED'
  );

  // Items that specifically need this user's decision
  const myPendingItems = contents.filter(c => {
    if (activeUser.role === 'ROLE_VP_CORSEC') {
      return (c.status === 'IN REVIEW' || c.status === 'Ready for Review' || c.status === 'PLANNED') && !c.vpCorsecApproved;
    }
    if (activeUser.role === 'ROLE_FINAL_APPROVER') {
      return (c.status === 'IN REVIEW' || c.status === 'Ready for Review' || c.status === 'PLANNED') && c.vpCorsecApproved && !c.finalApproved;
    }
    return c.status === 'IN REVIEW' || c.status === 'Ready for Review';
  });

  const displayedQueue = queueFilter === 'priority'
    ? myPendingItems
    : queueFilter === 'approved'
    ? approvedItems
    : inReviewItems;

  const selectedContent = contents.find(c => c.id === selectedContentId) || displayedQueue[0] || contents[0];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-3.5 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-xl border border-slate-700 flex items-center gap-2 animate-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold text-[10px] tracking-wider uppercase border border-rose-200">
              Governance & Compliance
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-slate-500 text-xs font-semibold">
              3-Tier Validation Pipeline
            </span>
          </div>
          <h2 className="text-lg font-black text-slate-900 mt-1 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-rose-600" />
            Approval & Validasi Konten SPARK
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Sistem otorisasi berjenjang: Review Bersama (Marcomm &amp; Corcomm Kantor Pusat), Otorisasi VP Corporate Secretary (VP Corsec), dan Otorisasi Akhir oleh Plt. Direktur Utama (Plt. Dirut).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDifferenceGuide(!showDifferenceGuide)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              showDifferenceGuide
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{showDifferenceGuide ? 'Tutup Panduan Peran' : 'Panduan: VP Corsec vs Plt. Dirut'}</span>
          </button>

          <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>{inReviewItems.length} Menunggu Review</span>
          </div>
        </div>
      </div>

      {/* Interactive Role Comparison Guide */}
      {showDifferenceGuide && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-800/50 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between border-b border-indigo-800/60 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">Matriks Tata Kelola: Perbedaan Approver VP Corsec vs Plt. Dirut</h3>
                <p className="text-[11px] text-indigo-200">Prinsip pemisahan kewenangan (Separation of Duties) dalam 3-Tier Validation Pipeline TELPRO</p>
              </div>
            </div>
            <button
              onClick={() => setShowDifferenceGuide(false)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* VP Corsec Card */}
            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/30 text-amber-300 border border-amber-400/40 text-[10px] font-bold uppercase">
                  Tingkat 2 • Intermediate Gatekeeper
                </span>
                <span className="text-[10px] text-amber-200/70 font-mono">Status: Cleared</span>
              </div>
              <h4 className="text-base font-bold text-amber-200 flex items-center gap-1.5">
                <span>VP Corporate Secretary (VP Corsec)</span>
              </h4>
              <ul className="space-y-1.5 text-amber-100/90 text-[11px]">
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">•</span>
                  <span><strong>Fokus Audit:</strong> Reputasi holding BUMN, aspek hukum &amp; HAKI, disclaimer klaim garansi/SLA.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">•</span>
                  <span><strong>Posisi Alur:</strong> Meninjau draf setelah diverifikasi oleh Review Bersama (Marcomm + Corcomm).</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">•</span>
                  <span><strong>Konsekuensi:</strong> Draf dinyatakan <em>Governance-Cleared</em> dan diteruskan ke Plt. Dirut (belum boleh tayang ke publik).</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">•</span>
                  <span><strong>Format Diskusi:</strong> Audit kepatuhan formal, kategorisasi telaah (Brand Safety, Legal, SLA claim), dan telaah pasal mendalam.</span>
                </li>
              </ul>
            </div>

            {/* Plt. Dirut Card */}
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold uppercase">
                  Tingkat 3 • Executive Final Sign-Off
                </span>
                <span className="text-[10px] text-emerald-200/70 font-mono">Status: FINAL APPROVED</span>
              </div>
              <h4 className="text-base font-bold text-emerald-200 flex items-center gap-1.5">
                <span>Plt. Direktur Utama (Final Approver)</span>
              </h4>
              <ul className="space-y-1.5 text-emerald-100/90 text-[11px]">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Fokus Audit:</strong> Arah strategis korporasi, dampak bisnis makro, alokasi anggaran, dan hak veto mutlak.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Posisi Alur:</strong> Tahap puncak; bertindak setelah materi diverifikasi dan disetujui VP Corsec.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Konsekuensi:</strong> Konten berstatus <strong>APPROVED</strong> dan otomatis mengalir ke meja posting tim Marcomm &amp; Corcomm untuk diterbitkan (Approver tidak perlu posting).</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Format Diskusi:</strong> <em>Ultra-sederhana</em> (1-Tap preset chips arahan &amp; 1 baris memo singkat) tanpa formulir pasal yang membebani pimpinan.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Executive Approver Notice Banner */}
      {isApprover && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/90 via-slate-900 to-indigo-950/90 text-white border border-amber-500/40 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-amber-200">Mode Ringkas Eksekutif (Approver &amp; Monitoring)</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                  Posting oleh Marcomm &amp; Corcomm
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Sebagai Pimpinan, Anda cukup membaca <strong>Highlight Summary</strong> untuk otorisasi cepat. Draf awal &amp; eksekusi posting dilakukan mandiri oleh tim teknis.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-xs font-black text-amber-300">
              ⚡ {myPendingItems.length} Menunggu Keputusan Anda
            </span>
          </div>
        </div>
      )}

      {/* Main Grid: Left side queue, Right side review console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Review Queue List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                Antrean Otorisasi ({displayedQueue.length})
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Pilih item</span>
            </div>

            {/* Queue Filter Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 text-[11px] font-bold">
              <button
                onClick={() => setQueueFilter('all')}
                className={`py-1.5 px-2 rounded-lg transition-all text-center cursor-pointer ${
                  queueFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Semua ({inReviewItems.length})
              </button>
              <button
                onClick={() => setQueueFilter('priority')}
                className={`py-1.5 px-2 rounded-lg transition-all text-center cursor-pointer ${
                  queueFilter === 'priority' ? 'bg-amber-500 text-slate-950 font-black shadow-xs' : 'text-amber-700 hover:text-amber-900'
                }`}
              >
                Prioritas ({myPendingItems.length})
              </button>
              <button
                onClick={() => setQueueFilter('approved')}
                className={`py-1.5 px-2 rounded-lg transition-all text-center cursor-pointer ${
                  queueFilter === 'approved' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-700 hover:text-emerald-900'
                }`}
              >
                Disetujui ({approvedItems.length})
              </button>
            </div>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar pr-1">
            {displayedQueue.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500 space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
                <p className="font-bold text-slate-700">Tidak ada antrean dalam filter ini</p>
                <p className="text-[10px] text-slate-400">Seluruh tugas dalam kategori ini telah diproses.</p>
              </div>
            ) : (
              displayedQueue.map((item) => {
                const isSelected = item.id === selectedContent?.id;
                const needsMyAction = myPendingItems.some(p => p.id === item.id);

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedContentId(item.id);
                      setRevisionNote('');
                    }}
                    className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-2 relative ${
                      isSelected
                        ? 'bg-rose-50/70 border-rose-400 shadow-sm ring-2 ring-rose-200'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {needsMyAction && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                      </span>
                    )}

                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {item.channel || item.platform}
                      </span>

                      {/* Status Badges */}
                      {item.finalApproved ? (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                          ✓ Siap Posting
                        </span>
                      ) : item.vpCorsecApproved ? (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200">
                          ⚡ Butuh Plt. Dirut
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                          ⏳ Butuh VP Corsec
                        </span>
                      )}
                    </div>

                    <h4 className="font-extrabold text-slate-900 text-xs line-clamp-2 leading-snug">
                      {item.topicIdea || item.title}
                    </h4>

                    {/* Key Message 1-line snippet for fast scanning */}
                    {item.keyMessage && (
                      <p className="text-[11px] text-slate-500 italic line-clamp-1 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                        "{item.keyMessage}"
                      </p>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 pt-1.5">
                      <span>Owner: <strong className="text-slate-700">{item.contentOwner || 'Marcomm'}</strong></span>
                      <span className="font-mono">{item.targetPublishDate || 'TBD'}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Governance Review Console (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {selectedContent ? (
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
              {/* Content Header Info */}
              <div className="border-b border-slate-100 pb-4 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-bold">
                      {selectedContent.channel || selectedContent.platform} • {selectedContent.contentFormat || selectedContent.format}
                    </span>
                    <span className="text-xs font-mono text-slate-400">ID: {selectedContent.id}</span>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase border ${
                    selectedContent.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                    selectedContent.status === 'REVISION' ? 'bg-rose-100 text-rose-800 border-rose-200' :
                    'bg-amber-100 text-amber-800 border-amber-200'
                  }`}>
                    Status: {selectedContent.status}
                  </span>
                </div>

                <h3 className="text-base font-black text-slate-900">
                  {selectedContent.topicIdea || selectedContent.title}
                </h3>

                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-200 leading-relaxed">
                  <strong>Pesan Kunci:</strong> "{selectedContent.keyMessage || 'Layanan konektivitas terandal untuk industri nasional berstandar SLA 99.98%.'}"
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                  <div className="p-2 rounded-xl bg-slate-50 border">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Pilar Konten</span>
                    <span className="font-bold text-slate-800 text-[11px]">{selectedContent.contentPillar || 'Product Excellence'}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Objektif</span>
                    <span className="font-bold text-slate-800 text-[11px]">{selectedContent.primaryObjective || selectedContent.objective}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Content Owner</span>
                    <span className="font-bold text-slate-800 text-[11px]">{selectedContent.contentOwner || 'Marcomm'}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">PIC Penanggungjawab</span>
                    <span className="font-bold text-slate-800 text-[11px]">{selectedContent.picName || selectedContent.pic}</span>
                  </div>
                </div>
              </div>

              {/* =========================================================================
                  EXECUTIVE HIGHLIGHT SUMMARY (TL;DR 10-DETIK UNTUK APPROVER)
                  Dirancang khusus agar Pimpinan dapat memutuskan dalam 10 detik tanpa beban
              ========================================================================= */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-700/60 shadow-lg space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-800/60 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40">
                      <Zap className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                          Highlight Summary Eksekutif
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono text-[9px]">
                          10-Second TL;DR
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        Ringkasan instan untuk pimpinan sibuk: Intisari pesan, kelayakan hukum &amp; pelaksana posting
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                      📢 Pelaksana Posting: Marcomm &amp; Corcomm
                    </span>
                    <button
                      onClick={() => setShowFullTechDetails(!showFullTechDetails)}
                      className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-[10px] font-semibold transition-all border border-white/10 cursor-pointer flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3 text-indigo-300" />
                      <span>{showFullTechDetails ? 'Tutup Detail Teknis' : 'Lihat Detail Teknis'}</span>
                    </button>
                  </div>
                </div>

                {/* 3 Compact High-Priority Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {/* Pillar 1: Core Message */}
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                      <Sparkles className="w-3 h-3" />
                      <span>1. Intisari Pesan &amp; Solusi</span>
                    </div>
                    <div className="font-bold text-white text-xs leading-snug">
                      "{selectedContent.keyMessage || selectedContent.topicIdea || selectedContent.title}"
                    </div>
                    <div className="text-[10px] text-slate-300 pt-1 border-t border-white/10">
                      Target Audiens: <strong className="text-white">{selectedContent.targetAudience || 'B2B Enterprise, Tenant Kawasan & Stakeholder BUMN'}</strong>
                    </div>
                  </div>

                  {/* Pillar 2: Pre-vetted Compliance & Brand Safety */}
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                      <ShieldCheck className="w-3 h-3" />
                      <span>2. Status Kepatuhan &amp; Bukti</span>
                    </div>
                    <div className="space-y-1.5 text-[11px] text-emerald-200">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span><strong>Brand Safety:</strong> 100% Aman (Holding Telkom)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span><strong>Klaim Fakta:</strong> Terverifikasi SLA 99.98%</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span><strong>Hak Cipta:</strong> Lisensi Aset &amp; HAKI Aman</span>
                      </div>
                    </div>
                  </div>

                  {/* Pillar 3: Logistics & Target Channels */}
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-sky-400 tracking-wider">
                      <Clock className="w-3 h-3" />
                      <span>3. Eksekusi &amp; Kanal Tayang</span>
                    </div>
                    <div className="text-white font-bold text-xs">
                      {selectedContent.channel || selectedContent.platform} ({selectedContent.contentFormat || selectedContent.format})
                    </div>
                    <div className="text-[10px] text-slate-300">
                      Jadwal Tayang: <strong className="text-white">{selectedContent.targetPublishDate || 'Sesuai Kalender'}</strong>
                    </div>
                    <div className="text-[10px] text-sky-200 pt-1 border-t border-white/10">
                      PIC Posting: <strong className="text-white">{selectedContent.picName || selectedContent.pic || 'Marcomm Lead (@telprodico)'}</strong>
                    </div>
                  </div>
                </div>

                {/* 1-Click Fast Decision Bar for Busy Approvers */}
                <div className="pt-2 border-t border-indigo-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-[11px] text-indigo-200 max-w-md">
                    {canDoVp && !selectedContent.vpCorsecApproved && (
                      <span>⚡ <strong>Tingkat 2 (VP Corsec):</strong> Berikan otorisasi tata kelola untuk meneruskan draf ke Plt. Dirut.</span>
                    )}
                    {canDoFinal && selectedContent.vpCorsecApproved && !selectedContent.finalApproved && (
                      <span>👑 <strong>Tingkat 3 (Plt. Dirut):</strong> Berikan otorisasi final agar Marcomm &amp; Corcomm dapat memposting ke publik.</span>
                    )}
                    {canDoFinal && !selectedContent.vpCorsecApproved && (
                      <span className="text-amber-300">⚠️ Menunggu verifikasi Tingkat 2 (VP Corsec) sebelum otorisasi final.</span>
                    )}
                    {selectedContent.finalApproved && (
                      <span className="text-emerald-300">✅ Konten telah disetujui penuh. Menunggu jadwal posting oleh Marcomm &amp; Corcomm.</span>
                    )}
                    {!canDoVp && !canDoFinal && (
                      <span>ℹ️ Anda masuk sebagai <strong>{activeUser.title}</strong>. Panel ini disinkronkan langsung dengan akun approver.</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Fast Actions for VP Corsec */}
                    {canDoVp && !selectedContent.vpCorsecApproved && (
                      <>
                        <button
                          onClick={() => {
                            executeVpCorsecApproval(selectedContent.id, false, vpAuditNote || 'Perlu penyesuaian kepatuhan tata kelola.', vpCategory, vpUrgency);
                            showToast('❌ Catatan revisi VP Corsec terkirim ke Creator.');
                            setVpAuditNote('');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer border border-white/20 transition-all"
                        >
                          Minta Revisi
                        </button>
                        <button
                          onClick={() => {
                            executeVpCorsecApproval(selectedContent.id, true, vpAuditNote || 'Ringkasan disetujui atas nama Corporate Secretary. Governance Cleared.', vpCategory, 'Minor Redaksional');
                            showToast('⚡ Otorisasi Cepat VP Corsec Berhasil! Draf diteruskan ke Plt. Dirut.');
                            setVpAuditNote('');
                          }}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all hover:scale-[1.02]"
                        >
                          <Award className="w-4 h-4" />
                          <span>⚡ 1-Click Otorisasi VP Corsec</span>
                        </button>
                      </>
                    )}

                    {/* Fast Actions for Plt. Dirut */}
                    {canDoFinal && !selectedContent.finalApproved && (
                      <>
                        <button
                          onClick={() => {
                            executeFinalApproval(selectedContent.id, false, dirutMemo || selectedDirutChip, selectedDirutChip);
                            showToast('✏️ Catatan arahan Plt. Dirut diteruskan ke Marcomm & Corcomm.');
                            setDirutMemo('');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer border border-white/20 transition-all"
                        >
                          Tolak / Revisi
                        </button>
                        <button
                          disabled={!selectedContent.vpCorsecApproved}
                          onClick={() => {
                            executeFinalApproval(selectedContent.id, true, dirutMemo || selectedDirutChip || 'Disetujui penuh untuk publikasi live.', selectedDirutChip || '👍 Disetujui Penuh');
                            showToast('🎉 Konten Resmi Disetujui Penuh oleh Plt. Dirut! Tim Marcomm & Corcomm siap posting.');
                            setDirutMemo('');
                          }}
                          className={`px-4 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-md transition-all ${
                            selectedContent.vpCorsecApproved
                              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer hover:scale-[1.02]'
                              : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          <UserCheck className="w-4 h-4" />
                          <span>⚡ 1-Click Final Approval (Plt. Dirut)</span>
                        </button>
                      </>
                    )}

                    {selectedContent.finalApproved && (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Otorisasi Selesai • Dialirkan ke Marcomm/Corcomm</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* RUANG DISKUSI, TELAAH & DISPOSISI TATA KELOLA (DIFFERENTIATED FOR VP CORSEC VS PLT. DIRUT) */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5 animate-in fade-in">
                {/* Header with clear design explanation */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-black text-slate-900">
                        Ruang Diskusi, Telaah &amp; Disposisi Tata Kelola
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        Tier-Differentiated Flow
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Perbedaan alur: <strong>VP Corsec</strong> menelaah aspek kepatuhan &amp; legal secara mendalam, sedangkan <strong>Plt. Dirut</strong> memberikan arahan &amp; disposisi strategis yang cepat, sederhana, dan bebas beban birokrasi teknis.
                    </p>
                  </div>

                  {/* Active Role Indicator */}
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className="text-[10px] text-slate-400 font-semibold">Tampilan aktif:</span>
                    <span className={`px-2.5 py-1 rounded-xl text-xs font-bold ${
                      activeUser.role === 'ROLE_FINAL_APPROVER'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : activeUser.role === 'ROLE_VP_CORSEC'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                    }`}>
                      {activeUser.role === 'ROLE_FINAL_APPROVER'
                        ? '👑 Plt. Dirut (Mode Simpel)'
                        : activeUser.role === 'ROLE_VP_CORSEC'
                        ? '⚖️ VP Corsec (Mode Audit)'
                        : '📢 Tim Pelaksana / Creator'}
                    </span>
                  </div>
                </div>

                {/* DYNAMIC ACTION CONSOLE BASED ON ROLE */}
                {activeUser.role === 'ROLE_FINAL_APPROVER' ? (
                  /* ULTRA-SIMPLE PLT. DIRUT DIRECTIVE CONSOLE */
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-slate-50 to-indigo-50/40 border-2 border-emerald-300/80 shadow-2xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                          👑
                        </div>
                        <div>
                          <span className="text-xs font-black text-slate-900 block">
                            Disposisi &amp; Arahan Cepat Plt. Direktur Utama
                          </span>
                          <span className="text-[11px] text-emerald-700 font-medium">
                            Mode Pimpinan: Tidak perlu membaca pasal atau form audit. Pilih arahan cepat atau ketik 1 baris memo ringkas.
                          </span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300 self-start sm:self-center">
                        ⚡ 1-Tap Executive Directive
                      </span>
                    </div>

                    {/* 1-Tap Quick Strategic Chips */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Pilihan Arahan Strategis Cepat (Klik untuk memilih):</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {DIRUT_PRESET_CHIPS.map(chip => (
                          <button
                            key={chip}
                            type="button"
                            onClick={() => setSelectedDirutChip(chip)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                              selectedDirutChip === chip
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm scale-[1.02]'
                                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Single-Line Custom Memo (Frictionless) */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-700">
                        Memo Singkat / Catatan Tambahan (Opsional):
                      </label>
                      <input
                        type="text"
                        value={dirutMemo}
                        onChange={e => setDirutMemo(e.target.value)}
                        placeholder={`Disposisi aktif: "${selectedDirutChip}". Ketik di sini jika ada instruksi tambahan...`}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 font-medium"
                      />
                    </div>

                    {/* Executive Decision Buttons */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-emerald-200/60">
                      <div className="text-[11px] text-slate-500">
                        Persetujuan Plt. Dirut akan langsung memicu status APPROVED dan notifikasi siap posting ke Marcomm &amp; Corcomm.
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            executeFinalApproval(selectedContent.id, false, dirutMemo || selectedDirutChip, selectedDirutChip);
                            showToast('✏️ Arahan penyesuaian Plt. Dirut telah dikirimkan ke tim Creator.');
                            setDirutMemo('');
                          }}
                          className="px-3.5 py-2 rounded-xl bg-white hover:bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold cursor-pointer transition-all hover:border-amber-400"
                        >
                          ✏️ Minta Penyesuaian Ringkas
                        </button>
                        <button
                          type="button"
                          disabled={!selectedContent.vpCorsecApproved}
                          onClick={() => {
                            executeFinalApproval(selectedContent.id, true, dirutMemo || selectedDirutChip || 'Disetujui penuh untuk publikasi live.', selectedDirutChip || '👍 Disetujui Penuh');
                            showToast('🎉 Disposisi Disetujui Penuh! Marcomm & Corcomm siap posting.');
                            setDirutMemo('');
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md ${
                            selectedContent.vpCorsecApproved
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer hover:scale-[1.02]'
                              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          <UserCheck className="w-4 h-4" />
                          <span>⚡ Disposisi: Setujui Penuh (Plt. Dirut)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : activeUser.role === 'ROLE_VP_CORSEC' ? (
                  /* FORMAL VP CORSEC GOVERNANCE AUDIT CONSOLE */
                  <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/60 border-2 border-amber-300/80 shadow-2xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                          ⚖️
                        </div>
                        <div>
                          <span className="text-xs font-black text-slate-900 block">
                            Telaah Kritis &amp; Audit Tata Kelola (VP Corporate Secretary)
                          </span>
                          <span className="text-[11px] text-amber-800 font-medium">
                            Verifikasi formal aspek kepatuhan holding BUMN, legal/HAKI, dan keabsahan klaim SLA teknis.
                          </span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-xl bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-300 self-start sm:self-center">
                        Formal Governance Audit
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Category Pill Selection */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-700">
                          Kategori Telaah Tata Kelola:
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            'Brand Safety & Reputasi Holding',
                            'Aspek Hukum, HAKI & Disclaimer',
                            'Audit Klaim SLA & Fakta Teknis',
                            'Penyelarasan Kebijakan BUMN'
                          ].map(cat => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setVpCategory(cat)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border ${
                                vpCategory === cat
                                  ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Urgency Selector */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-700">
                          Tingkat Urgensi / Rekomendasi Telaah:
                        </label>
                        <div className="flex gap-2">
                          {[
                            { val: 'Minor Redaksional', label: '🟢 Minor Redaksional', desc: 'Dapat lanjut' },
                            { val: 'Wajib Penyesuaian', label: '🟡 Wajib Penyesuaian', desc: 'Revisi wajib' },
                            { val: 'Blocker Kepatuhan', label: '🔴 Blocker Kepatuhan', desc: 'Risiko reputasi' }
                          ].map(item => (
                            <button
                              key={item.val}
                              type="button"
                              onClick={() => setVpUrgency(item.val as any)}
                              className={`flex-1 p-2 rounded-xl text-left transition-all cursor-pointer border ${
                                vpUrgency === item.val
                                  ? 'bg-white border-amber-500 shadow-xs ring-2 ring-amber-400/20'
                                  : 'bg-white/70 border-slate-200 hover:bg-white text-slate-500'
                              }`}
                            >
                              <div className="text-[11px] font-bold text-slate-900">{item.label}</div>
                              <div className="text-[9px] text-slate-400 mt-0.5">{item.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Detailed Audit Notes Textarea */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-700">
                        Catatan Telaah Audit Kepatuhan (Wajib jika ada klausul/pasal yang perlu diperbaiki):
                      </label>
                      <textarea
                        rows={3}
                        value={vpAuditNote}
                        onChange={e => setVpAuditNote(e.target.value)}
                        placeholder="Tuliskan telaah hukum, referensi klausul disclaimer (*), kepatuhan logo holding Telkom, atau arahan koreksi teknis sebelum diajukan ke meja Dirut..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 font-medium"
                      />
                    </div>

                    {/* VP Action Buttons */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-amber-200">
                      <div className="text-[11px] text-amber-900">
                        Otorisasi VP Corsec (Cleared) akan meloloskan materi ke antrean keputusan Plt. Dirut.
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            executeVpCorsecApproval(selectedContent.id, false, vpAuditNote || 'Perlu penyesuaian kepatuhan tata kelola.', vpCategory, vpUrgency);
                            showToast('❌ Catatan telaah tata kelola VP Corsec terkirim ke Creator.');
                            setVpAuditNote('');
                          }}
                          className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold cursor-pointer transition-all"
                        >
                          ⚠️ Kembalikan ke Tim dengan Catatan
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            executeVpCorsecApproval(selectedContent.id, true, vpAuditNote || 'Tata kelola cleared sesuai reputasi holding.', vpCategory, vpUrgency);
                            showToast('✅ Otorisasi VP Corsec Diberikan! Diteruskan ke Plt. Dirut.');
                            setVpAuditNote('');
                          }}
                          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-md cursor-pointer hover:scale-[1.02]"
                        >
                          <Award className="w-4 h-4" />
                          <span>✓ Simpan Telaah &amp; Otorisasi Cleared</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* CREATOR / MARCOMM / CORCOMM RESPONSE CONSOLE */
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                          📢
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">
                            Tanggapan &amp; Klarifikasi Tim Pelaksana (Marcomm / Corcomm)
                          </span>
                          <span className="text-[10px] text-slate-500">
                            Kirimkan jawaban atas catatan telaah VP Corsec atau konfirmasi perbaikan sebelum diverifikasi ulang.
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200">
                        Tim Pelaksana
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={creatorReply}
                        onChange={e => setCreatorReply(e.target.value)}
                        placeholder="Tuliskan konfirmasi perbaikan naskah, lampiran bukti baru, atau klarifikasi ke approver..."
                        className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        disabled={!creatorReply.trim()}
                        onClick={() => {
                          if (!creatorReply.trim()) return;
                          addGovernanceComment(selectedContent.id, {
                            authorName: activeUser.name,
                            authorRole: activeUser.role,
                            authorTitle: activeUser.title,
                            content: creatorReply.trim(),
                            type: 'creator_response'
                          });
                          showToast('💬 Tanggapan terkirim ke riwayat diskusi approver.');
                          setCreatorReply('');
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                          creatorReply.trim()
                            ? 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer shadow-2xs'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Kirim Tanggapan</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* TIMELINE / RIWAYAT DISKUSI & DISPOSISI */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Riwayat Diskusi, Telaah &amp; Disposisi ({selectedContent.governanceComments?.length || 0})</span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Audit trail tersimpan permanen dalam SPARK Governance Log
                    </span>
                  </div>

                  {selectedContent.governanceComments && selectedContent.governanceComments.length > 0 ? (
                    <div className="space-y-2.5">
                      {selectedContent.governanceComments.map((cmt, idx) => {
                        const isDirut = cmt.type === 'dirut_directive' || cmt.authorRole === 'ROLE_FINAL_APPROVER';
                        const isVp = cmt.type === 'vp_corsec_audit' || cmt.authorRole === 'ROLE_VP_CORSEC';

                        return (
                          <div
                            key={cmt.id || idx}
                            className={`p-3.5 rounded-2xl border transition-all ${
                              isDirut
                                ? 'bg-gradient-to-r from-emerald-50/70 via-indigo-50/30 to-slate-50 border-emerald-300 shadow-2xs'
                                : isVp
                                ? 'bg-amber-50/50 border-amber-200'
                                : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                  isDirut
                                    ? 'bg-emerald-600 text-white shadow-2xs'
                                    : isVp
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-slate-700 text-white'
                                }`}>
                                  {isDirut ? '👑 Disposisi Plt. Dirut' : isVp ? '⚖️ Telaah VP Corsec' : '📢 Respon Tim Pelaksana'}
                                </span>

                                {isDirut && cmt.directiveChip && (
                                  <span className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                                    {cmt.directiveChip}
                                  </span>
                                )}

                                {isVp && cmt.category && (
                                  <span className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-300">
                                    {cmt.category}
                                  </span>
                                )}

                                {isVp && cmt.urgency && (
                                  <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold ${
                                    cmt.urgency === 'Minor Redaksional'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : cmt.urgency === 'Wajib Penyesuaian'
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-rose-100 text-rose-800'
                                  }`}>
                                    {cmt.urgency}
                                  </span>
                                )}
                              </div>

                              <span className="text-[10px] text-slate-400 font-mono">
                                {new Date(cmt.createdAt).toLocaleString('id-ID', {
                                  dateStyle: 'short',
                                  timeStyle: 'short'
                                })}
                              </span>
                            </div>

                            {/* Message Content */}
                            {isDirut ? (
                              <div className="pl-3 border-l-2 border-emerald-500 py-0.5">
                                <p className="text-xs font-bold text-slate-900 leading-relaxed italic">
                                  "{cmt.content}"
                                </p>
                              </div>
                            ) : (
                              <p className="text-xs text-slate-800 leading-relaxed">
                                {cmt.content}
                              </p>
                            )}

                            <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-500">
                              <span className="font-bold text-slate-700">{cmt.authorName}</span>
                              {cmt.authorTitle && <span>• {cmt.authorTitle}</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400">
                      Belum ada riwayat telaah atau disposisi untuk konten ini.
                    </div>
                  )}
                </div>
              </div>

              {/* Collapsible / Standard 3-Tier Technical Governance Pipeline */}
              {(!isApprover || showFullTechDetails) && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    Detail Alur Otorisasi 3 Tingkat &amp; Dokumen Pembuktian
                  </h4>
                  {isApprover && (
                    <button
                      onClick={() => setShowFullTechDetails(false)}
                      className="text-[11px] text-slate-400 hover:text-slate-600 font-semibold"
                    >
                      Sembunyikan Detail
                    </button>
                  )}
                </div>

                {/* LEVEL 1: JOINT REVIEW (MARCOMM + CORCOMM) */}
                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-black flex items-center justify-center">
                        1
                      </div>
                      <div>
                        <span className="text-xs font-black text-indigo-950 block">
                          Tingkat 1: Review Berlapis (Marcomm &amp; Corcomm Kantor Pusat)
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Evaluasi ganda keselarasan brand safety, klaim teknis, akurasi data &amp; corporate tone
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] font-mono">
                      <span className={`px-2 py-0.5 rounded-full font-bold ${
                        selectedContent.marcommReviewStatus === 'REVIEWED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        Marcomm: {selectedContent.marcommReviewStatus || 'Pending'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full font-bold ${
                        selectedContent.corcommReviewStatus === 'REVIEWED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        Corcomm: {selectedContent.corcommReviewStatus || 'Pending'}
                      </span>
                    </div>
                  </div>

                  {/* 4-Point Checklist */}
                  <div className="p-3 rounded-xl bg-white border border-indigo-100 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Checklist Standar Kepatuhan Konten:
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checklist.brandSafety}
                          onChange={(e) => setChecklist({ ...checklist, brandSafety: e.target.checked })}
                          className="rounded text-indigo-600"
                        />
                        <span>🛡️ Brand Safety &amp; Reputasi</span>
                      </label>
                      <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checklist.factCheck}
                          onChange={(e) => setChecklist({ ...checklist, factCheck: e.target.checked })}
                          className="rounded text-indigo-600"
                        />
                        <span>🔍 Fact Check &amp; Bukti Valid</span>
                      </label>
                      <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checklist.claimCheck}
                          onChange={(e) => setChecklist({ ...checklist, claimCheck: e.target.checked })}
                          className="rounded text-indigo-600"
                        />
                        <span>⚡ Klaim Teknis Sesuai SLA</span>
                      </label>
                      <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checklist.corporateTone}
                          onChange={(e) => setChecklist({ ...checklist, corporateTone: e.target.checked })}
                          className="rounded text-indigo-600"
                        />
                        <span>🎯 Tone B2B &amp; Panduan Telpro</span>
                      </label>
                    </div>
                  </div>

                  {/* Action Buttons for Reviewer */}
                  {canDoJoint && (
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => {
                          executeJointReview(selectedContent.id, {
                            marcommApproved: false,
                            corcommApproved: false,
                            jointChecklist: checklist,
                            revisionNote: revisionNote || 'Perbaiki klaim teknis dan tone naskah.'
                          });
                          showToast('✏️ Catatan revisi dikirimkan ke Creator.');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold cursor-pointer"
                      >
                        Minta Revisi
                      </button>

                      <button
                        onClick={() => {
                          executeJointReview(selectedContent.id, {
                            marcommApproved: true,
                            corcommApproved: true,
                            jointChecklist: checklist,
                            revisionNote: 'Lolos review standar bersama Marcomm & Corcomm Kantor Pusat.'
                          });
                          showToast('✅ Review berhasil diverifikasi & diteruskan ke VP Corsec!');
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Verifikasi Review (Marcomm/Corcomm)</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* LEVEL 2: VP CORSEC APPROVER */}
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-amber-600 text-white text-xs font-black flex items-center justify-center">
                        2
                      </div>
                      <div>
                        <span className="text-xs font-black text-amber-950 block">
                          Tingkat 2: Otorisasi VP Corporate Secretary (VP Corsec)
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Tinjauan reputasi holding BUMN, legal governance, audit klaim teknis &amp; kepatuhan regulasi
                        </span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      selectedContent.vpCorsecApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {selectedContent.vpCorsecApproved ? 'VP Corsec Cleared' : 'Menunggu Otorisasi VP Corsec'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-100/60 text-[11px] text-amber-900 border border-amber-200/80 flex items-center justify-between">
                    <span>
                      {selectedContent.vpCorsecApproved
                        ? '✅ Draf dinyatakan Governance-Cleared. Materi otomatis diteruskan ke meja Plt. Dirut.'
                        : 'ℹ️ Persetujuan VP Corsec merupakan syarat sebelum otorisasi final Direksi. Materi belum tayang ke publik.'}
                    </span>
                    {!canDoVp && (
                      <span className="text-[10px] text-amber-700 font-semibold bg-white/70 px-2 py-0.5 rounded-md">
                        Khusus akun VP Corsec
                      </span>
                    )}
                  </div>

                  {canDoVp && (
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => {
                          executeVpCorsecApproval(selectedContent.id, false, vpAuditNote || 'Perlu penyesuaian kepatuhan tata kelola.', vpCategory, vpUrgency);
                          showToast('❌ Otorisasi VP Corsec ditolak dengan catatan audit.');
                          setVpAuditNote('');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold cursor-pointer"
                      >
                        Minta Revisi VP
                      </button>

                      <button
                        onClick={() => {
                          executeVpCorsecApproval(selectedContent.id, true, vpAuditNote || 'Disetujui atas nama Corporate Secretary. Governance Cleared.', vpCategory, vpUrgency);
                          showToast('✅ Konten disetujui oleh VP Corsec & diteruskan ke Plt. Dirut!');
                          setVpAuditNote('');
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Otorisasi VP Corsec (Cleared)</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* LEVEL 3: EXECUTIVE / FINAL APPROVER */}
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs font-black flex items-center justify-center">
                        3
                      </div>
                      <div>
                        <span className="text-xs font-black text-emerald-950 block">
                          Tingkat 3: Otorisasi Akhir Plt. Direktur Utama (Plt. Dirut)
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Hak veto puncak dan otorisasi strategis (Final Sign-off) untuk status FINAL APPROVED &amp; publikasi resmi
                        </span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      selectedContent.finalApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {selectedContent.finalApproved ? 'FINAL APPROVED (PLT. DIRUT)' : 'Menunggu Otorisasi Plt. Dirut'}
                    </span>
                  </div>

                  {/* Prerequisite and status banner */}
                  <div className={`p-2.5 rounded-xl text-[11px] border flex items-center justify-between ${
                    !selectedContent.vpCorsecApproved
                      ? 'bg-amber-50 text-amber-900 border-amber-200'
                      : selectedContent.finalApproved
                      ? 'bg-emerald-100/70 text-emerald-900 border-emerald-300'
                      : 'bg-indigo-50 text-indigo-900 border-indigo-200'
                  }`}>
                    <span>
                      {!selectedContent.vpCorsecApproved
                        ? '⚠️ Menunggu verifikasi Tingkat 2 (VP Corsec) terlebih dahulu sebelum otorisasi final.'
                        : selectedContent.finalApproved
                        ? '🎉 Konten telah disetujui penuh oleh Plt. Dirut. Seluruh kanal publik siap menerima publikasi.'
                        : 'Siap untuk otorisasi puncak Plt. Dirut (Governance Tingkat 2 telah lolos).'}
                    </span>
                    {!canDoFinal && (
                      <span className="text-[10px] text-slate-600 font-semibold bg-white/70 px-2 py-0.5 rounded-md shrink-0 ml-2">
                        Khusus akun Plt. Dirut
                      </span>
                    )}
                  </div>

                  {canDoFinal && (
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => {
                          executeFinalApproval(selectedContent.id, false, dirutMemo || selectedDirutChip, selectedDirutChip);
                          showToast('✏️ Plt. Dirut memberikan arahan penyesuaian.');
                          setDirutMemo('');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold cursor-pointer"
                      >
                        Tolak / Revisi Akhir
                      </button>

                      <button
                        onClick={() => {
                          executeFinalApproval(selectedContent.id, true, dirutMemo || selectedDirutChip || 'Disetujui penuh untuk publikasi live.', selectedDirutChip || '👍 Disetujui Penuh');
                          showToast('🎉 Konten disetujui penuh oleh Plt. Dirut! Siap dipublish.');
                          setDirutMemo('');
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>Beri Otorisasi Final (Plt. Dirut)</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              )}

              {/* Ready to Publish / Post Status Banner */}
              {selectedContent.status === 'APPROVED' && (
                isApprover ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-emerald-950 block">
                          Otorisasi Tata Kelola Telah Selesai (Final Approved)
                        </span>
                        <span className="text-[11px] text-emerald-700">
                          Materi telah dialirkan ke antrean posting tim Marcomm (@telprodico) dan Corcomm (@telkomproperty) untuk dijadwalkan &amp; dipublikasikan.
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300">
                      <span>✓ Tugas Approver Selesai</span>
                    </div>
                  </div>
                ) : onNavigateToPublish && (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-black text-rose-950 block">
                        Konten Ini Telah Lolos Seluruh Tahap Approval Pimpinan!
                      </span>
                      <span className="text-[11px] text-rose-700">
                        Sebagai tim pelaksana (Marcomm/Corcomm), Anda memiliki kewenangan untuk memposting materi ini ke kanal resmi.
                      </span>
                    </div>

                    <button
                      onClick={onNavigateToPublish}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0"
                    >
                      <span>Buka Menu Publish</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center text-xs text-slate-500">
              Pilih salah satu item konten dari kolom antrean di sebelah kiri untuk meninjau governance.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
