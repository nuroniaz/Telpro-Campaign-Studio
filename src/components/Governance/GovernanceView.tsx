import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Approval, DecisionType, BudgetItem } from '../../types';
import { NavTab } from '../Sidebar';
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
  Plus
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
    selectedCampaign
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Governance, Quality & Approval Matrix
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Workflow approval bertingkat, pemeriksaan klaim evidence, risk assessment, SLA, & single budget ledger</p>
        </div>
      </div>

      {/* Tab 1: Approval Matrix Queue */}
      {govTab === 'approvals' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Antrean Review & Approval Active ({pendingApprovals.length} Pending)</h2>
            <div className="text-xs text-slate-400">Active Reviewer Role: <strong className="text-rose-400 font-mono">{activeUser.role}</strong></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {approvals.map(app => {
              const version = contentVersions.find(v => v.id === app.contentVersionId);
              const content = contents.find(c => c.id === app.contentId);

              return (
                <div key={app.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-semibold border border-rose-800">
                      Stage: {app.stage}
                    </span>
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      app.decision === 'Pending' ? 'bg-amber-950 text-amber-300' :
                      app.decision === 'Approve' || app.decision === 'Pass' ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
                    }`}>
                      {app.decision}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-white">{content?.title || 'Paket Konten TELPRO 2026'}</div>

                  <div className="p-3 rounded-2xl bg-slate-950 text-xs space-y-1.5 border border-slate-800">
                    <div><strong className="text-slate-400">Hook:</strong> "{version?.hook}"</div>
                    <div><strong className="text-slate-400">Audio Usage:</strong> {version?.selectedAudio} ({version?.audioRightsStatus})</div>
                    <div><strong className="text-slate-400">SLA Due Date:</strong> <span className="text-amber-400">{new Date(app.dueAt).toLocaleString()}</span></div>
                  </div>

                  {app.comment && (
                    <div className="text-[11px] text-slate-300 bg-slate-800/60 p-2 rounded-xl border border-slate-700/60">
                      <strong>Comment ({app.reviewerName}):</strong> {app.comment}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">Target Role: {app.reviewerRole.replace('ROLE_', '')}</span>
                    {app.decision === 'Pending' && (
                      <button
                        onClick={() => {
                          setSelectedApproval(app);
                          setDecisionType(app.stage.includes('Check') || app.stage.includes('QA') ? 'Pass' : 'Approve');
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
                      >
                        Proses Decision
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
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in zoom-in-95 text-xs">
            <h3 className="font-bold text-white border-b border-slate-800 pb-3">Proses Decision: {selectedApproval.stage}</h3>

            <form onSubmit={handleExecuteDecision} className="space-y-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Pilih Keputusan *</label>
                <select
                  value={decisionChoice}
                  onChange={e => setDecisionType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                >
                  <option value="Pass">Pass (Lolos QA / Fact Check)</option>
                  <option value="Approve">Approve (Setujui)</option>
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
                  placeholder="Masukkan catatan pendukung keputusan..."
                  value={decisionComment}
                  onChange={e => setDecisionComment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedApproval(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Eksekusi Keputusan
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
