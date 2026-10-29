import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Approval, DecisionType, BudgetItem, APPROVAL_HIERARCHY } from '../../types';
import { NavTab } from '../Sidebar';
import { RbacBanner } from '../Common/RbacBanner';
import { WorkflowPipelineBar } from '../Common/WorkflowPipelineBar';
import { hasPermission } from '../../utils/rbac';
import { InteractiveVideoPlayer } from '../Content/InteractiveVideoPlayer';
import {
  ShieldCheck,
  FileCheck,
  Coins,
  History,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  UserCheck,
  Layers,
  Plus,
  Lock,
  ArrowRight,
  Eye,
  Play,
  Volume2,
  ExternalLink,
  FileText,
  Sparkles,
  Smartphone,
  Share2,
  Upload,
  Video,
  Film
} from 'lucide-react';

interface GovernanceViewProps {
  activeTab?: NavTab;
  setActiveTab?: (tab: NavTab) => void;
}

export const GovernanceView: React.FC<GovernanceViewProps> = ({ activeTab, setActiveTab }) => {
  const {
    approvals,
    updateApprovalDecision,
    contents,
    contentVersions,
    evidences,
    budgets,
    addBudgetItem,
    activeUser,
    setActiveUserRole,
    selectedCampaign,
    storyboards,
    videoProjects
  } = useApp();

  let govTab: 'approvals' | 'factcheck' | 'brandqa' | 'risk' | 'sla' | 'budget' = 'approvals';
  if (activeTab === 'gov-factcheck') govTab = 'factcheck';
  else if (activeTab === 'gov-brandqa') govTab = 'brandqa';
  else if (activeTab === 'gov-risk') govTab = 'risk';
  else if (activeTab === 'gov-sla') govTab = 'sla';
  else if (activeTab === 'gov-budget') govTab = 'budget';
  else if (activeTab === 'gov-approvals') govTab = 'approvals';

  // Decision Modal state
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  const [decisionChoice, setDecisionType] = useState<DecisionType>('Pass');
  const [decisionComment, setDecisionComment] = useState('');
  const [previewTab, setPreviewTab] = useState<'mockup' | 'script' | 'storyboard'>('mockup');
  const [selectedSceneIndex, setSelectedSceneIndex] = useState<number | null>(null);
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);
  const [customVideoFileName, setCustomVideoFileName] = useState<string | null>(null);

  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setCustomVideoUrl(objectUrl);
      setCustomVideoFileName(file.name);
    }
  };

  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
  const [budgetActivity, setBudgetActivity] = useState('');
  const [budgetAllocated, setBudgetAllocated] = useState('25000000');
  const [budgetCategory, setBudgetCategory] = useState<BudgetItem['category']>('Paid Ads');

  const pendingApprovals = approvals.filter(a => a.decision === 'Pending');

  const handleExecuteDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApproval) return;

    updateApprovalDecision(selectedApproval.id, decisionChoice, decisionComment);
    setSelectedApproval(null);
    setDecisionComment('');
  };

  const handleCreateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!budgetActivity) return;

    const newItem: BudgetItem = {
      id: `bdg-${Date.now().toString().slice(-4)}`,
      campaignId: selectedCampaign?.id || 'cmp-2026-01',
      activityName: budgetActivity,
      category: budgetCategory,
      allocatedAmount: Number(budgetAllocated) || 25000000,
      committedAmount: 0,
      actualAmount: 0,
      varianceAmount: Number(budgetAllocated) || 25000000,
      status: 'Approved'
    };

    addBudgetItem(newItem);
    setShowAddBudgetModal(false);
    setBudgetActivity('');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              04. Review, Approval Berjenjang, & QA
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Workflow approval bertingkat (7-tier hierarchy), pemeriksaan klaim evidence, brand QA, risk assessment, & SLA tracking</p>
          </div>
        </div>
        <RbacBanner moduleName="Governance & Approval" requiredAction="canApproveGovernance" requiredRole="ROLE_VP_APPROVER / ROLE_FACT_CHECKER / ROLE_LEGAL_COMPLIANCE" />

        {/* Universal Sequential Workflow Bar */}
        <WorkflowPipelineBar currentStage="04" setActiveTab={setActiveTab} titleSuffix="Review, Approval Berjenjang, & QA (Langkah ke-4)" />
      </div>

      {/* Tab 1: Approval Matrix Queue */}
      {govTab === 'approvals' && (
        <div className="space-y-4 animate-in fade-in">
          {/* 7-Tier Sequential Approval Hierarchy Pipeline Banner */}
          <div className="p-5 rounded-3xl bg-white/95 border border-slate-200 space-y-4 shadow-sm backdrop-blur">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  Alur Approver Berjenjang (7 Stage Governance Hierarchy)
                </h3>
                <p className="text-[11px] text-slate-500">Persetujuan wajib diproses secara berurutan berjenjang dari Creator hingga Publisher.</p>
              </div>
              <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-bold self-start sm:self-auto">
                ✓ Sequential Strict RBAC
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-1">
              {APPROVAL_HIERARCHY.map((step) => {
                const isActiveRole = activeUser.role === step.role;

                return (
                  <div
                    key={step.step}
                    onClick={() => setActiveUserRole(step.role)}
                    className={`p-2.5 rounded-2xl border text-[10px] space-y-1 transition-all cursor-pointer relative group ${
                      isActiveRole
                        ? 'bg-gradient-to-br from-rose-50 to-pink-100/80 border-rose-400 text-rose-950 ring-2 ring-rose-400 shadow-md scale-[1.02]'
                        : 'bg-slate-50 hover:bg-slate-100/90 border-slate-200 text-slate-700 hover:border-slate-300 shadow-2xs'
                    }`}
                    title={`Klik untuk beralih ke role ${step.label}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-rose-600 font-mono text-[9px]">STEP 0{step.step}</span>
                      {isActiveRole && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      )}
                    </div>
                    <div className="font-bold text-slate-900 truncate">{step.label.replace(/^\d+\.\s*/, '')}</div>
                    <div className="text-[9px] text-slate-500 font-mono truncate">{step.roleLabel}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <h2 className="text-sm font-bold text-slate-800">Antrean Review & Approval Active ({pendingApprovals.length} Pending)</h2>
            <div className="text-xs text-slate-500">Active Reviewer Role: <strong className="text-rose-600 font-mono">{activeUser.role}</strong></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {approvals.map(app => {
              const version = contentVersions.find(v => v.id === app.contentVersionId);
              const content = contents.find(c => c.id === app.contentId);
              const isTargetRole = activeUser.role === app.reviewerRole || activeUser.role === 'ROLE_SYSTEM_ADMIN';

              return (
                <div
                  key={app.id}
                  onClick={() => {
                    setSelectedApproval(app);
                    setDecisionType(app.stage.includes('Check') || app.stage.includes('QA') ? 'Pass' : 'Approve');
                  }}
                  className="p-5 rounded-3xl bg-white/95 border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer space-y-3 shadow-sm group relative overflow-hidden"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-800 font-semibold border border-amber-200 flex items-center gap-1">
                      <Layers className="w-3 h-3 text-amber-600" />
                      Stage: {app.stage}
                    </span>
                    <span className={`px-2 py-0.5 rounded-lg font-bold border ${
                      app.decision === 'Pending' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                      app.decision === 'Approve' || app.decision === 'Pass' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}>
                      {app.decision}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-slate-900 group-hover:text-amber-700 transition-colors flex items-center justify-between gap-2">
                    <span>{content?.title || 'Paket Konten TELPRO 2026'}</span>
                    <span className="text-[10px] text-slate-400 font-mono">#{app.contentVersionId}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 text-xs space-y-1.5 border border-slate-200 text-slate-700">
                    <div><strong className="text-slate-500 font-medium">Hook:</strong> "{version?.hook}"</div>
                    <div><strong className="text-slate-500 font-medium">Audio Usage:</strong> {version?.selectedAudio} ({version?.audioRightsStatus})</div>
                    <div><strong className="text-slate-500 font-medium">SLA Due Date:</strong> <span className="text-amber-700 font-bold">{new Date(app.dueAt).toLocaleString()}</span></div>
                  </div>

                  {app.comment && (
                    <div className="text-[11px] text-slate-700 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200">
                      <strong>Comment ({app.reviewerName}):</strong> {app.comment}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-500">Target Role: <strong className="text-slate-800 font-mono">{app.reviewerRole.replace('ROLE_', '')}</strong></span>
                      {isTargetRole ? (
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                          ✓ Akses Sesuai
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-medium">
                          ⚠️ Perlu {app.reviewerRole.replace('ROLE_', '')}
                        </span>
                      )}
                    </div>

                    {app.decision === 'Pending' && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedApproval(app);
                          setDecisionType(app.stage.includes('Check') || app.stage.includes('QA') ? 'Pass' : 'Approve');
                        }}
                        className={`px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                          isTargetRole
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                            : 'bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white'
                        }`}
                      >
                        {isTargetRole ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Proses Decision</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5 text-white" />
                            <span>Proses ({app.reviewerRole.replace('ROLE_', '')})</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Fact & Evidence Check */}
      {govTab === 'factcheck' && (
        <div className="p-6 rounded-3xl bg-white/95 border border-slate-200 space-y-4 shadow-sm animate-in fade-in text-xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileCheck className="w-4 h-4 text-cyan-600" />
            Fact & Evidence Verification Matrix
          </h2>

          <div className="space-y-3">
            {evidences.map(evd => (
              <div key={evd.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-slate-900 text-xs">{evd.sourceTitle}</div>
                  <p className="text-slate-600 mt-0.5">"{evd.claimText}"</p>
                  <span className="text-[10px] text-slate-500 font-medium">Klasifikasi: {evd.sourceType}</span>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold shrink-0">
                  {evd.verificationStatus}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Brand & Creative QA */}
      {govTab === 'brandqa' && (
        <div className="p-6 rounded-3xl bg-white/95 border border-slate-200 space-y-4 shadow-sm animate-in fade-in text-xs">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Brand Checklist & Creative QA Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block">Visual & Logo Compliance:</span>
              <p className="text-slate-600">Logo TELPRO Wajib ditempatkan di sudut kanan atas materi carousel/video dengan margin minimal 16px.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block">Audio Licensing Rules:</span>
              <p className="text-slate-600">Penggunaan audio harus memiliki status "Verified for Intended Use". Audio bertanda restricted dilarang lolos QA.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Risk Assessment */}
      {govTab === 'risk' && (
        <div className="p-6 rounded-3xl bg-white/95 border border-slate-200 space-y-4 shadow-sm animate-in fade-in text-xs">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Risk Assessment Dimensions</h2>
          <p className="text-slate-600">Seluruh materi dengan status Risk = Blocked dilarang masuk ke tahap Final Approval.</p>
        </div>
      )}

      {/* Tab 5: SLA & Reminders */}
      {govTab === 'sla' && (
        <div className="p-6 rounded-3xl bg-white/95 border border-slate-200 space-y-4 shadow-sm animate-in fade-in text-xs">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">SLA Tracking & Overdue Alert System</h2>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700">
            <span className="font-bold text-slate-900">Standar SLA Review:</span> Max 24 jam per tahap approval matrix.
          </div>
        </div>
      )}

      {/* Tab 6: Budget Ledger */}
      {govTab === 'budget' && (
        <div className="p-6 rounded-3xl bg-white/95 border border-slate-200 space-y-4 shadow-sm animate-in fade-in text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Single Budget Ledger ({budgets.length} Items)</h2>
              <p className="text-xs text-slate-500">Master budget tunggal: Monthly Ceiling → Campaign Allocation → Commitment → Actual</p>
            </div>
            <button
              onClick={() => setShowAddBudgetModal(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Item Anggaran
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Aktivitas / Kegiatan</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Alokasi (Rp)</th>
                  <th className="p-3">Aktual (Rp)</th>
                  <th className="p-3">Variansi (Rp)</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {budgets.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-semibold text-slate-900">{b.activityName}</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">{b.category}</span></td>
                    <td className="p-3 font-bold text-slate-800">Rp {b.allocatedAmount.toLocaleString()}</td>
                    <td className="p-3 text-amber-700 font-semibold">Rp {b.actualAmount.toLocaleString()}</td>
                    <td className="p-3 text-emerald-700 font-semibold">Rp {b.varianceAmount.toLocaleString()}</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Decision Execution with Content Preview Inspector */}
      {selectedApproval && (() => {
        const appContent = contents.find(c => c.id === selectedApproval.contentId);
        const appVersion = contentVersions.find(v => v.id === selectedApproval.contentVersionId) || contentVersions.find(v => v.contentId === selectedApproval.contentId);
        const appStoryboard = storyboards.find(s => s.contentVersionId === selectedApproval.contentVersionId);
        const appVideoProject = videoProjects.find(vp => vp.contentId === selectedApproval.contentId) || videoProjects[0];

        const activeScene = (selectedSceneIndex !== null && appVideoProject?.scenes?.[selectedSceneIndex]) ? appVideoProject.scenes[selectedSceneIndex] : appVideoProject?.scenes?.[0];
        const currentVideoClipUrl = customVideoUrl || activeScene?.videoClipUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
        const currentThumbnailUrl = activeScene?.thumbnailUrl || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80';

        return (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
            <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-5xl p-5 sm:p-6 shadow-2xl space-y-4 animate-in zoom-in-95 text-xs max-h-[92vh] overflow-y-auto text-slate-800">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                      Staging Approver Review & Decision Engine
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-mono font-bold">
                        Stage: {selectedApproval.stage}
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Konten ID: <strong className="text-slate-800">{appContent?.title || selectedApproval.contentId}</strong> • Version: <strong className="text-amber-700">#{selectedApproval.contentVersionId}</strong>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedApproval(null)}
                  className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Main 2-Column Grid: Left (Live Content Preview) | Right (Approver Hierarchy & Form) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* LEFT COLUMN: Content Preview & Inspector (col-span-7) */}
                <div className="lg:col-span-7 space-y-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Content Header Info */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200 font-bold text-[10px] flex items-center gap-1">
                          <Smartphone className="w-3 h-3 text-indigo-600" />
                          {appContent?.platform || 'Instagram Reels'}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 border border-purple-200 font-medium text-[10px]">
                          {appContent?.format || 'Video Reel (9:16)'}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 text-[10px]">
                          Pillar: {appContent?.contentPillar || 'Product Showcase'}
                        </span>
                      </div>
                      <div className="text-[10px] text-emerald-800 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        <Sparkles className="w-3 h-3 text-emerald-600" /> Live Preview Mode
                      </div>
                    </div>

                    {/* Preview Tabs Selection */}
                    <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2">
                      <button
                        type="button"
                        onClick={() => setPreviewTab('mockup')}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          previewTab === 'mockup'
                            ? 'bg-rose-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                        }`}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        📱 Mockup Tampilan
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewTab('script')}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          previewTab === 'script'
                            ? 'bg-rose-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        📝 Script & Evidence
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewTab('storyboard')}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          previewTab === 'storyboard'
                            ? 'bg-rose-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                        }`}
                      >
                        <Layers className="w-3.5 h-3.5" />
                        🎬 Storyboard ({appStoryboard?.scenes?.length || 0})
                      </button>
                    </div>

                    {/* TAB 1: Social Media Mockup Card */}
                    {previewTab === 'mockup' && (
                      <div className="space-y-3 animate-in fade-in">
                        <div className="max-w-sm mx-auto bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-lg space-y-0">
                          {/* Profile Header Mockup */}
                          <div className="p-3 bg-slate-50 flex items-center justify-between border-b border-slate-200">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 p-0.5">
                                <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-bold text-[10px] text-rose-600">
                                  TP
                                </div>
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 text-[11px] flex items-center gap-1">
                                  telkomproperty
                                  <CheckCircle2 className="w-3 h-3 text-cyan-600 fill-cyan-100" />
                                </div>
                                <div className="text-[9px] text-slate-500">Telkom Property Official</div>
                              </div>
                            </div>
                            <span className="text-[10px] text-slate-600 font-semibold px-2 py-0.5 bg-slate-100 rounded-full border border-slate-200">
                              Sponsor
                            </span>
                          </div>

                          {/* Interactive Media Video Player Area */}
                          <div className="p-2 space-y-2 bg-slate-50 border-b border-slate-200">
                            {/* Scene & Video Upload Control Bar */}
                            <div className="flex flex-wrap items-center justify-between gap-1.5 p-1.5 bg-white rounded-xl border border-slate-200 text-[10px]">
                              <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar max-w-[200px] sm:max-w-[260px]">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedSceneIndex(null);
                                    setCustomVideoUrl(null);
                                    setCustomVideoFileName(null);
                                  }}
                                  className={`px-2 py-0.5 rounded font-bold shrink-0 transition-all cursor-pointer ${
                                    selectedSceneIndex === null && !customVideoUrl
                                      ? 'bg-rose-600 text-white shadow-xs'
                                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                                  }`}
                                >
                                  Full Video
                                </button>

                                {appVideoProject?.scenes?.map((sc, idx) => (
                                  <button
                                    key={sc.id || idx}
                                    type="button"
                                    onClick={() => {
                                      setSelectedSceneIndex(idx);
                                      setCustomVideoUrl(null);
                                      setCustomVideoFileName(null);
                                    }}
                                    className={`px-2 py-0.5 rounded font-bold shrink-0 transition-all cursor-pointer ${
                                      selectedSceneIndex === idx && !customVideoUrl
                                        ? 'bg-rose-600 text-white shadow-xs'
                                        : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                                    }`}
                                  >
                                    Sc-{sc.sceneNumber}
                                  </button>
                                ))}
                              </div>

                              {/* Upload Video File Button */}
                              <label className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold cursor-pointer transition-all shrink-0">
                                <Upload className="w-3 h-3 text-indigo-600" />
                                <span className="text-[9px]">{customVideoFileName ? 'Ganti Video' : 'Upload Video'}</span>
                                <input
                                  type="file"
                                  accept="video/*"
                                  onChange={handleVideoFileUpload}
                                  className="hidden"
                                />
                              </label>
                            </div>

                            {/* Live Interactive Video Player */}
                            <InteractiveVideoPlayer
                              videoClipUrl={currentVideoClipUrl}
                              thumbnailUrl={currentThumbnailUrl}
                              title={
                                customVideoFileName
                                  ? customVideoFileName
                                  : activeScene
                                  ? `Scene ${activeScene.sceneNumber}: ${activeScene.prompt.substring(0, 30)}...`
                                  : appVideoProject?.title || appContent?.title
                              }
                              duration={
                                selectedSceneIndex !== null && appVideoProject?.scenes?.[selectedSceneIndex]
                                  ? appVideoProject.scenes[selectedSceneIndex].duration
                                  : appVideoProject?.targetDuration || 18
                              }
                              aspectRatio={appContent?.format?.includes('Reels') || appVideoProject?.aspectRatio === '9:16' ? '9:16' : '16:9'}
                              badgeText={
                                customVideoUrl
                                  ? "📁 Uploaded File"
                                  : selectedSceneIndex !== null
                                  ? `Veo AI • Scene ${appVideoProject?.scenes?.[selectedSceneIndex]?.sceneNumber}`
                                  : "Master Video 4K"
                              }
                              voiceOverText={appVersion?.scriptHook}
                              className="w-full aspect-[9/16] max-h-[360px]"
                            />

                            {/* Source Info Bar */}
                            <div className="flex items-center justify-between text-[9px] text-slate-500 px-1">
                              <span className="flex items-center gap-1 text-slate-600 font-medium truncate max-w-[220px]">
                                <Video className="w-3 h-3 text-rose-600 shrink-0" />
                                <span className="truncate">Source: <strong className="text-slate-800">{customVideoFileName || (selectedSceneIndex !== null ? `Scene ${selectedSceneIndex + 1} Clip` : appVideoProject?.title || 'Veo AI Stream')}</strong></span>
                              </span>
                              {customVideoUrl && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCustomVideoUrl(null);
                                    setCustomVideoFileName(null);
                                  }}
                                  className="text-rose-600 hover:underline font-bold text-[9px] shrink-0"
                                >
                                  Reset
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Caption & Copy Section */}
                          <div className="p-3.5 space-y-2 text-[11px] bg-white">
                            <div>
                              <strong className="text-rose-600 font-semibold block text-[10px] uppercase tracking-wider">Hook Narasi:</strong>
                              <p className="text-slate-900 font-bold text-xs mt-0.5">
                                "{appVersion?.scriptHook || 'Pergudangan Tradisional Bikin Biaya Membengkak? Ini Solusinya!'}"
                              </p>
                            </div>

                            <div>
                              <strong className="text-slate-500 font-semibold block text-[10px]">Body Copy / Naskah:</strong>
                              <p className="text-slate-700 line-clamp-3 text-[11px] leading-relaxed mt-0.5">
                                {appVersion?.scriptBody || 'Tingkatkan efisiensi penyimpanan logistik bisnis Anda hingga 40% dengan Smart Warehouse Telkom Property. Dilengkapi pemantauan IoT 24/7 dan keandalan jaringan standar nasional.'}
                              </p>
                            </div>

                            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                              <span className="text-emerald-900 font-bold text-[10px] block">Call To Action (CTA) & Official Contact:</span>
                              <p className="text-emerald-800 font-medium text-[10px] bg-emerald-100/70 p-2 rounded-lg border border-emerald-300 leading-normal">
                                {appVersion?.callToAction || 'Call Center: 1500 473 | WA: +62811 150 4739 (chat only) | Email: info@telpro.co.id | Graha TelkomProperty, Jl. Kebon Sirih No. 10-12, Jakarta Pusat, 10110'}
                              </p>
                            </div>

                            <div className="text-[10px] text-cyan-700 font-mono">
                              #TelkomProperty #SmartWarehouse #LogistikIndonesia #B2B2026
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 2: Script & Evidence Compliance Details */}
                    {previewTab === 'script' && (
                      <div className="space-y-3 animate-in fade-in text-[11px]">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                          <span className="text-rose-700 font-bold text-[10px] uppercase">Hook 3-Detik Pertama (Verbal & Visual):</span>
                          <p className="text-slate-900 font-semibold p-2 bg-white rounded-lg border border-slate-200">
                            {appVersion?.scriptHook || 'Smart Warehouse Telkom Property: Efisiensi Maksimal Perusahaan.'}
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                          <span className="text-slate-600 font-bold text-[10px] uppercase">Naskah Lengkap (Body Script):</span>
                          <p className="text-slate-800 p-2.5 bg-white rounded-lg border border-slate-200 leading-relaxed whitespace-pre-wrap">
                            {appVersion?.scriptBody || 'Di era efisiensi 2026, pengelolaan pergudangan memerlukan integrasi pintar. Telkom Property menghadirkan fasilitas Smart Warehouse dengan sensor suhu otomatis, proteksi jaringan fiber optik, dan pengawasan security 24/7. Hubungi kami untuk penawaran khusus perusahaan Anda.'}
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                          <span className="text-emerald-700 font-bold text-[10px] uppercase">Link Verifikasi Bukti Klaim (Fact Verification):</span>
                          <div className="space-y-1">
                            <a href="#evidence" onClick={(e) => e.preventDefault()} className="flex items-center justify-between p-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-cyan-700 transition-colors">
                              <span className="flex items-center gap-1.5">
                                <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                                Sertifikasi ISO 27001 Security Warehouse TELPRO.pdf
                              </span>
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                            </a>
                            <a href="#evidence" onClick={(e) => e.preventDefault()} className="flex items-center justify-between p-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-cyan-700 transition-colors">
                              <span className="flex items-center gap-1.5">
                                <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                                Data Penghematan Energi IoT Logistik 2025.xlsx
                              </span>
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 3: Storyboard & Scenes Grid */}
                    {previewTab === 'storyboard' && (
                      <div className="space-y-2 animate-in fade-in">
                        {appStoryboard && appStoryboard.scenes && appStoryboard.scenes.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                            {appStoryboard.scenes.map((sc, idx) => (
                              <div key={sc.id || idx} className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1">
                                <div className="flex items-center justify-between text-[10px] font-bold text-rose-700 border-b border-slate-100 pb-1">
                                  <span>Scene {sc.sceneNumber || idx + 1} ({sc.durationSeconds || 5}s)</span>
                                  <span className="text-slate-500">{sc.shotType || 'Medium Shot'}</span>
                                </div>
                                <p className="text-[10px] text-slate-700 font-medium line-clamp-2">
                                  <strong>Visual:</strong> {sc.visualPrompt || sc.actionDescription || 'Pemandangan gudang pintar.'}
                                </p>
                                <p className="text-[9px] text-cyan-700 italic">
                                  "{sc.narrationText || 'Voiceover narasi scene...'}"
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                            <Layers className="w-6 h-6 text-slate-400 mx-auto" />
                            <p className="text-slate-700 font-semibold text-xs">Draft Storyboard Belum Dibuat</p>
                            <p className="text-[10px] text-slate-500">Approver dapat meninjau naskah & brief utama pada tab Script & Copy.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Inspector Footer Notice */}
                  <div className="pt-3 border-t border-slate-200 text-[10px] text-slate-500 flex items-center justify-between">
                    <span>Target Audience: <strong className="text-slate-800">B2B Logistics & Supply Chain Director</strong></span>
                    <span className="text-rose-600 font-semibold">Ready for Stage Decision</span>
                  </div>
                </div>

                {/* RIGHT COLUMN: Governance Stepper & Decision Form (col-span-5) */}
                <div className="lg:col-span-5 space-y-4">
                  {/* Staging Stepper Flow (7 Tier Sequential Hierarchy) */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <div className="text-[11px] font-bold text-slate-800 flex items-center justify-between border-b border-slate-200 pb-2">
                      <span>Alur Approver Berjenjang (7 Stage)</span>
                      <span className="text-[10px] text-rose-600 font-semibold">Governance Pipeline</span>
                    </div>

                    <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                      {APPROVAL_HIERARCHY.map((step) => {
                        const isCurrentStage = selectedApproval.stage === step.stage || selectedApproval.reviewerRole === step.role;

                        const currentIdx = APPROVAL_HIERARCHY.findIndex(
                          h => h.stage === selectedApproval.stage || h.role === selectedApproval.reviewerRole
                        );

                        let currentIdxResolved = currentIdx;
                        if (currentIdxResolved === -1) {
                          if (selectedApproval.stage.includes('Fact')) currentIdxResolved = 1;
                          else if (selectedApproval.stage.includes('Brand') || selectedApproval.stage.includes('Manager')) currentIdxResolved = 2;
                          else if (selectedApproval.stage.includes('VP Marketing')) currentIdxResolved = 3;
                          else if (selectedApproval.stage.includes('VP Corsec')) currentIdxResolved = 4;
                          else if (selectedApproval.stage.includes('Final') || selectedApproval.stage.includes('Direktur')) currentIdxResolved = 5;
                        }

                        const isPassed = step.step - 1 < currentIdxResolved;

                        return (
                          <div
                            key={step.step}
                            className={`p-2 rounded-xl border text-[10px] flex items-center justify-between transition-all ${
                              isCurrentStage
                                ? 'bg-rose-50 border-rose-300 text-rose-950 ring-1 ring-rose-400 shadow-xs font-bold'
                                : isPassed
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                                : 'bg-white border-slate-200 text-slate-600'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className={`w-5 h-5 rounded-full text-[9px] flex items-center justify-center font-extrabold shrink-0 ${
                                isCurrentStage ? 'bg-rose-500 text-white shadow' : isPassed ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-200 text-slate-600'
                              }`}>
                                {step.step}
                              </span>
                              <div className="min-w-0">
                                <div className="font-bold text-slate-900 truncate">{step.label}</div>
                                <div className="text-[9px] text-slate-500 font-mono truncate">{step.roleLabel}</div>
                              </div>
                            </div>

                            <div className="shrink-0 ml-2">
                              {isCurrentStage ? (
                                <span className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-bold flex items-center gap-1 shadow-2xs">
                                  <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
                                  Stage Aktif
                                </span>
                              ) : isPassed ? (
                                <span className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200 text-[9px] font-semibold flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  Lolos
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-500 text-[9px]">
                                  Menunggu
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Role Switcher banner if role doesn't match */}
                  {activeUser.role !== selectedApproval.reviewerRole && activeUser.role !== 'ROLE_SYSTEM_ADMIN' && (
                    <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                      <div className="flex items-center justify-between text-amber-900 font-bold text-xs">
                        <span className="flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                          Role Aktif: <span className="font-mono text-rose-700">{activeUser.role.replace('ROLE_', '')}</span>
                        </span>
                        <span className="text-[10px] text-amber-700 font-medium">Perlu {selectedApproval.reviewerRole.replace('ROLE_', '')}</span>
                      </div>
                      <p className="text-[10px] text-slate-700">
                        Untuk menyetujui tahap <strong>{selectedApproval.stage}</strong> ini, klik tombol di bawah untuk beralih role:
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveUserRole(selectedApproval.reviewerRole);
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all hover:scale-[1.01] cursor-pointer"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>⚡ Beralih Otomatis ke Role {selectedApproval.reviewerRole.replace('ROLE_', '')}</span>
                      </button>
                    </div>
                  )}

                  <form onSubmit={handleExecuteDecision} className="space-y-3 pt-1">
                    <div>
                      <label className="text-slate-700 font-semibold block mb-1">Keputusan Staging Approver *</label>
                      <select
                        value={decisionChoice}
                        onChange={e => setDecisionType(e.target.value as any)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="Pass">Pass (Lolos QA / Fact Check)</option>
                        <option value="Approve">Approve & Sign-off Final</option>
                        <option value="Revision Required">Revision Required (Minta Revisi)</option>
                        <option value="Reject">Reject (Tolak)</option>
                        <option value="Hold">Hold (Tahan)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-700 font-semibold block mb-1">Catatan Reviewer / Alasan *</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Masukkan catatan pendukung keputusan review..."
                        value={decisionComment}
                        onChange={e => setDecisionComment(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => setSelectedApproval(null)}
                        className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Eksekusi Keputusan Staging</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Bottom Sequential Workflow Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border border-emerald-200 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm mt-6">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
            <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
            LANGKAH WORKFLOW BERJENJANG BERIKUTNYA:
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            Pemeriksaan Governance, Legal QA, dan Approval (04) telah tuntas. Selanjutnya pantau analytics performa, ROI campaign, dan AI Learning Memory di <strong>06. Performance & Analytics</strong>.
          </p>
        </div>
        {setActiveTab && (
          <button
            type="button"
            onClick={() => setActiveTab('perf-overview')}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer shrink-0"
          >
            Lanjut ke 06. Performance & Report ➔
          </button>
        )}
      </div>

      {/* Modal: Add Budget */}
      {showAddBudgetModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 text-xs text-slate-800">
            <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3">Tambah Item Budget Ledger</h3>

            <form onSubmit={handleCreateBudget} className="space-y-3">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Nama Kegiatan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Production Shoot Video Reels..."
                  value={budgetActivity}
                  onChange={e => setBudgetActivity(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Kategori *</label>
                <select
                  value={budgetCategory}
                  onChange={e => setBudgetCategory(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Paid Ads">Paid Ads</option>
                  <option value="Production">Production</option>
                  <option value="Talent">Talent</option>
                  <option value="Event">Event</option>
                  <option value="Vendor">Vendor</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Alokasi Anggaran (Rp) *</label>
                <input
                  type="number"
                  required
                  value={budgetAllocated}
                  onChange={e => setBudgetAllocated(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddBudgetModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-sm"
                >
                  Simpan Anggaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
