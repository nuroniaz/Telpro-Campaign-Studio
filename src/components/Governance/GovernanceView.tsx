import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Approval, DecisionType, BudgetItem, APPROVAL_HIERARCHY } from '../../types';
import { NavTab } from '../Sidebar';
import { RbacBanner } from '../Common/RbacBanner';
import { hasPermission } from '../../utils/rbac';
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
  Share2
} from 'lucide-react';

interface GovernanceViewProps {
  activeTab?: NavTab;
  setActiveTab?: (tab: NavTab) => void;
}

export const GovernanceView: React.FC<GovernanceViewProps> = ({ activeTab }) => {
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Governance, Quality & Approval Matrix
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Workflow approval bertingkat, pemeriksaan klaim evidence, risk assessment, SLA, & single budget ledger</p>
          </div>
        </div>
        <RbacBanner moduleName="Governance & Approval" requiredAction="canApproveGovernance" requiredRole="ROLE_VP_APPROVER / ROLE_FACT_CHECKER / ROLE_LEGAL_COMPLIANCE" />
      </div>

      {/* Tab 1: Approval Matrix Queue */}
      {govTab === 'approvals' && (
        <div className="space-y-4 animate-in fade-in">
          {/* 7-Tier Sequential Approval Hierarchy Pipeline Banner */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-rose-400" />
                  Alur Approver Berjenjang (7 Stage Governance Hierarchy)
                </h3>
                <p className="text-[11px] text-slate-400">Persetujuan wajib diproses secara berurutan berjenjang dari Creator hingga Publisher.</p>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2.5 py-1 rounded-full font-bold self-start sm:self-auto">
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
                        ? 'bg-rose-950/80 border-rose-500 text-white ring-2 ring-rose-500/60 shadow-lg scale-[1.02]'
                        : 'bg-slate-950 hover:bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                    title={`Klik untuk beralih ke role ${step.label}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-rose-300 font-mono text-[9px]">STEP 0{step.step}</span>
                      {isActiveRole && (
                        <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                      )}
                    </div>
                    <div className="font-bold text-slate-100 truncate">{step.label.replace(/^\d+\.\s*/, '')}</div>
                    <div className="text-[9px] text-slate-500 font-mono truncate">{step.roleLabel}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <h2 className="text-sm font-bold text-white">Antrean Review & Approval Active ({pendingApprovals.length} Pending)</h2>
            <div className="text-xs text-slate-400">Active Reviewer Role: <strong className="text-rose-400 font-mono">{activeUser.role}</strong></div>
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
                  className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-rose-500/60 transition-all cursor-pointer space-y-3 shadow-xl group relative overflow-hidden"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-semibold border border-rose-800/80 flex items-center gap-1">
                      <Layers className="w-3 h-3 text-rose-400" />
                      Stage: {app.stage}
                    </span>
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      app.decision === 'Pending' ? 'bg-amber-950 text-amber-300 border border-amber-800/50' :
                      app.decision === 'Approve' || app.decision === 'Pass' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50' : 'bg-rose-950 text-rose-300 border border-rose-800/50'
                    }`}>
                      {app.decision}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors flex items-center justify-between gap-2">
                    <span>{content?.title || 'Paket Konten TELPRO 2026'}</span>
                    <span className="text-[10px] text-slate-500 font-mono">#{app.contentVersionId}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950 text-xs space-y-1.5 border border-slate-800">
                    <div><strong className="text-slate-400">Hook:</strong> "{version?.hook}"</div>
                    <div><strong className="text-slate-400">Audio Usage:</strong> {version?.selectedAudio} ({version?.audioRightsStatus})</div>
                    <div><strong className="text-slate-400">SLA Due Date:</strong> <span className="text-amber-400 font-medium">{new Date(app.dueAt).toLocaleString()}</span></div>
                  </div>

                  {app.comment && (
                    <div className="text-[11px] text-slate-300 bg-slate-800/60 p-2 rounded-xl border border-slate-700/60">
                      <strong>Comment ({app.reviewerName}):</strong> {app.comment}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-500">Target Role: <strong className="text-slate-200 font-mono">{app.reviewerRole.replace('ROLE_', '')}</strong></span>
                      {isTargetRole ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 text-[10px] font-bold">
                          ✓ Akses Sesuai
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60 text-[10px] font-medium">
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
                        className={`px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer ${
                          isTargetRole
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
                            : 'bg-gradient-to-r from-rose-950 to-amber-950 hover:from-rose-900 hover:to-amber-900 text-amber-200 border border-rose-700/80'
                        }`}
                      >
                        {isTargetRole ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Proses Decision</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5 text-amber-400" />
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
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl animate-in fade-in text-xs">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <FileCheck className="w-4 h-4 text-cyan-400" />
            Fact & Evidence Verification Matrix
          </h2>

          <div className="space-y-3">
            {evidences.map(evd => (
              <div key={evd.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-white text-xs">{evd.sourceTitle}</div>
                  <p className="text-slate-300 mt-0.5">"{evd.claimText}"</p>
                  <span className="text-[10px] text-slate-500 font-medium">Klasifikasi: {evd.sourceType}</span>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold shrink-0">
                  {evd.verificationStatus}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Brand & Creative QA */}
      {govTab === 'brandqa' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl animate-in fade-in text-xs">
          <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3">Brand Checklist & Creative QA Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-white block">Visual & Logo Compliance:</span>
              <p className="text-slate-300">Logo TELPRO Wajib ditempatkan di sudut kanan atas materi carousel/video dengan margin minimal 16px.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-white block">Audio Licensing Rules:</span>
              <p className="text-slate-300">Penggunaan audio harus memiliki status "Verified for Intended Use". Audio bertanda restricted dilarang lolos QA.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Risk Assessment */}
      {govTab === 'risk' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl animate-in fade-in text-xs">
          <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3">Risk Assessment Dimensions</h2>
          <p className="text-slate-300">Seluruh materi dengan status Risk = Blocked dilarang masuk ke tahap Final Approval.</p>
        </div>
      )}

      {/* Tab 5: SLA & Reminders */}
      {govTab === 'sla' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl animate-in fade-in text-xs">
          <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3">SLA Tracking & Overdue Alert System</h2>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="font-bold text-white">Standar SLA Review:</span> Max 24 jam per tahap approval matrix.
          </div>
        </div>
      )}

      {/* Tab 6: Budget Ledger */}
      {govTab === 'budget' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl animate-in fade-in text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white">Single Budget Ledger ({budgets.length} Items)</h2>
              <p className="text-xs text-slate-400">Master budget tunggal: Monthly Ceiling → Campaign Allocation → Commitment → Actual</p>
            </div>
            <button
              onClick={() => setShowAddBudgetModal(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1 shadow-md"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Item Anggaran
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Aktivitas / Kegiatan</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Alokasi (Rp)</th>
                  <th className="p-3">Aktual (Rp)</th>
                  <th className="p-3">Variansi (Rp)</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {budgets.map(b => (
                  <tr key={b.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-white">{b.activityName}</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-slate-800">{b.category}</span></td>
                    <td className="p-3 font-bold text-slate-200">Rp {b.allocatedAmount.toLocaleString()}</td>
                    <td className="p-3 text-amber-400">Rp {b.actualAmount.toLocaleString()}</td>
                    <td className="p-3 text-emerald-400">Rp {b.varianceAmount.toLocaleString()}</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-semibold">{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Decision Execution */}
      {selectedApproval && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4 animate-in zoom-in-95 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Staging Approver & Decision Engine
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Stage Aktif: <strong className="text-rose-400">{selectedApproval.stage}</strong> • #{selectedApproval.contentVersionId}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApproval(null)}
                className="text-slate-400 hover:text-white text-sm font-bold p-1 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Staging Stepper Flow (7 Tier Sequential Hierarchy) */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
              <div className="text-[11px] font-bold text-slate-300 flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span>Alur Staging Approver Berjenjang (7 Stage Hierarchy)</span>
                <span className="text-[10px] text-rose-400 font-semibold">Sequential Governance</span>
              </div>

              <div className="space-y-1.5 max-h-52 overflow-y-auto custom-scrollbar pr-1">
                {APPROVAL_HIERARCHY.map((step) => {
                  const isCurrentStage = selectedApproval.stage === step.stage || selectedApproval.reviewerRole === step.role;

                  // Determine if step is prior to current step
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
                          ? 'bg-rose-950/70 border-rose-500 text-white ring-1 ring-rose-500/50 shadow-md font-bold'
                          : isPassed
                          ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                          : 'bg-slate-900/60 border-slate-800/80 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full text-[9px] flex items-center justify-center font-extrabold shrink-0 ${
                          isCurrentStage ? 'bg-rose-500 text-white shadow' : isPassed ? 'bg-emerald-500/30 text-emerald-300' : 'bg-slate-800 text-slate-500'
                        }`}>
                          {step.step}
                        </span>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-100 truncate">{step.label}</div>
                          <div className="text-[9px] text-slate-400 font-mono truncate">{step.roleLabel}</div>
                        </div>
                      </div>

                      <div className="shrink-0 ml-2">
                        {isCurrentStage ? (
                          <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/80 text-[9px] font-bold flex items-center gap-1 shadow-sm">
                            <Clock className="w-3 h-3 text-amber-400 animate-pulse" />
                            Tahap Aktif
                          </span>
                        ) : isPassed ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 text-[9px] font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            Lolos
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-500 text-[9px]">
                            Menunggu Staging
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
              <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-800/80 space-y-2">
                <div className="flex items-center justify-between text-amber-300 font-bold text-xs">
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Otoritas Role Aktif: <span className="font-mono text-rose-300">{activeUser.role.replace('ROLE_', '')}</span>
                  </span>
                  <span className="text-[10px] text-amber-400 font-medium">Perlu {selectedApproval.reviewerRole.replace('ROLE_', '')}</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Untuk menyetujui tahap <strong>{selectedApproval.stage}</strong> ini, Anda dapat beralih role secara otomatis dengan menekan tombol di bawah:
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveUserRole(selectedApproval.reviewerRole);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow transition-all hover:scale-[1.01] cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>⚡ Beralih Otomatis ke Role {selectedApproval.reviewerRole.replace('ROLE_', '')}</span>
                </button>
              </div>
            )}

            <form onSubmit={handleExecuteDecision} className="space-y-3 pt-1">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Keputusan Staging Approver *</label>
                <select
                  value={decisionChoice}
                  onChange={e => setDecisionType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="Pass">Pass (Lolos QA / Fact Check)</option>
                  <option value="Approve">Approve & Sign-off Final</option>
                  <option value="Revision Required">Revision Required (Minta Revisi)</option>
                  <option value="Reject">Reject (Tolak)</option>
                  <option value="Hold">Hold (Tahan)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Catatan Reviewer / Alasan *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Masukkan catatan pendukung keputusan final..."
                  value={decisionComment}
                  onChange={e => setDecisionComment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedApproval(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-900/40 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Eksekusi Keputusan Staging</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Budget */}
      {showAddBudgetModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="font-bold text-white border-b border-slate-800 pb-3">Tambah Item Budget Ledger</h3>

            <form onSubmit={handleCreateBudget} className="space-y-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Nama Kegiatan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Production Shoot Video Reels..."
                  value={budgetActivity}
                  onChange={e => setBudgetActivity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Kategori *</label>
                <select
                  value={budgetCategory}
                  onChange={e => setBudgetCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                >
                  <option value="Paid Ads">Paid Ads</option>
                  <option value="Production">Production</option>
                  <option value="Talent">Talent</option>
                  <option value="Event">Event</option>
                  <option value="Vendor">Vendor</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Alokasi Anggaran (Rp) *</label>
                <input
                  type="number"
                  required
                  value={budgetAllocated}
                  onChange={e => setBudgetAllocated(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddBudgetModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
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
