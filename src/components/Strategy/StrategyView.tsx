import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Campaign, ContentItem } from '../../types';
import { Target, Layers, FileText, Calendar, Plus, Briefcase, CheckCircle2, ShieldAlert, Sparkles, Filter } from 'lucide-react';
import { NavTab } from '../Sidebar';

interface StrategyViewProps {
  activeTab?: NavTab;
  setActiveTab?: (tab: NavTab) => void;
}

export const StrategyView: React.FC<StrategyViewProps> = ({ activeTab }) => {
  const { campaigns, addCampaign, contents, selectedCampaign } = useApp();

  let subTab: 'context' | 'monthly' | 'campaigns' | 'contentplan' = 'context';
  if (activeTab === 'strategy-monthly') subTab = 'monthly';
  else if (activeTab === 'strategy-campaigns') subTab = 'campaigns';
  else if (activeTab === 'strategy-contentplan') subTab = 'contentplan';
  else if (activeTab === 'strategy-context') subTab = 'context';

  const [showNewCampaignModal, setShowShowNewCampaignModal] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newBusinessObj, setNewBusinessObj] = useState('');
  const [newMarketingObj, setNewMarketingObj] = useState('');
  const [newCommObj, setNewCommObj] = useState('');
  const [newAudience, setNewAudience] = useState('');
  const [newProduct, setNewProduct] = useState('');
  const [newBudget, setNewBudget] = useState('100000000');

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaignName) return;

    const newCamp: Campaign = {
      id: `cmp-2026-${Date.now().toString().slice(-4)}`,
      name: newCampaignName,
      periodStart: '2026-08-15',
      periodEnd: '2026-10-15',
      businessObjective: newBusinessObj || 'Meningkatkan penetrasi produk B2B TELPRO',
      marketingObjective: newMarketingObj || 'Menghasilkan 100 MQL & WA Inquiries',
      communicationObjective: newCommObj || 'Edukasi solusi terpadu efisiensi operasional',
      audience: newAudience || 'C-Level & Decision Maker B2B Enterprise',
      status: 'Planned',
      budgetAllocated: Number(newBudget) || 100000000,
      budgetSpent: 0,
      owner: 'Nuroniah (Marcom Lead)',
      priorityProduct: newProduct || 'TELPRO Smart Solutions',
      keyMessage: 'Kendali Presisi & Efisiensi Berkelanjutan bersama TELPRO',
      funnelStage: 'Consideration'
    };

    addCampaign(newCamp);
    setShowShowNewCampaignModal(false);
    setNewCampaignName('');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-rose-500" />
            Strategy & Campaign Planning
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Pengelolaan profil brand, target bulanan, rencana campaign, & content calendar canonical</p>
        </div>
      </div>

      {/* Tab 1: Business & Brand Context */}
      {subTab === 'context' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-rose-400" />
              TELPRO Corporate & Brand Profile 2026
            </h2>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 font-semibold block">Tone of Voice:</span>
                <span className="text-slate-200 font-medium">Profesional, Lugas, Berwibawa, Mengedepankan Data & Kepastian Operasional (Authoritative & Solution-Oriented)</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 font-semibold block">Preferred Terminology:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {['Infrastruktur Terdedikasi', 'Presisi Logistik', 'SLA 99.9%', 'Ekosistem TELPRO', 'Transformasi Digital Berkelanjutan'].map(term => (
                    <span key={term} className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/50 text-[10px]">
                      {term}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 font-semibold block">Prohibited Terminology & Claims:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {['Termurah di Indonesia (Gunakan: Efisiensi Biaya Optimal)', 'Satu-satunya di Pasar (Gunakan: Pemimpin Pasar Terintegrasi)', 'Internet Murahan'].map(term => (
                    <span key={term} className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/50 text-[10px]">
                      🚫 {term}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 font-semibold block">Mandatory Disclaimer:</span>
                <p className="text-slate-300 italic text-[11px] mt-1">
                  "Seluruh klaim efisiensi dan jaminan Service Level Agreement (SLA) berdasar pada ketentuan kontrak resmi dan pengujian infrastruktur terverifikasi PT Telkom Prasetia (TELPRO)."
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Brand Safety & Compliance Rules
            </h2>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 font-semibold block">Aturan Komparasi Kompetitor:</span>
                <p className="text-slate-300 mt-1">Tidak diperbolehkan menyebutkan merk/brand kompetitor secara langsung dalam materi publikasi resmi. Gunakan istilah generic "Sistem Gudang Konvensional" atau "Layanan Shared Bandwidth Biasa".</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 font-semibold block">Hak Cipta Musik & Trending Audio:</span>
                <p className="text-slate-300 mt-1">Setiap audio yang digunakan dalam konten reels/video komersial Wajib bertanda "Verified for Intended Use" di Asset Library TELPRO.</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 font-semibold block">Klaim Berbasis Data (No Source No Fact):</span>
                <p className="text-slate-300 mt-1">Semua angka persentase efisiensi wajib menautkan ID Evidence pada Laporan Studi Terverifikasi di modul Evidence Pack.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Monthly Setup */}
      {subTab === 'monthly' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white">Monthly Setup Baseline (Agustus 2026)</h2>
              <p className="text-xs text-slate-400">Pemisahan eksplisit Business, Marketing, & Communication Objectives</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold text-xs">
              Approved Baseline v2026.8
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-rose-400 font-bold uppercase tracking-wider text-[10px]">01. Business Objective</span>
              <p className="text-slate-200 font-medium">Meningkatkan total pendapatan sewa solusi B2B Smart Logistics & Konektivitas Terdedikasi sebesar 20% MoM di Q3 2026.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-indigo-400 font-bold uppercase tracking-wider text-[10px]">02. Marketing Objective</span>
              <p className="text-slate-200 font-medium">Akuisisi 250 Marketing Qualified Leads (MQL), 800 WA Chat Inquiries, dan 120.000 Landing Page Views terverifikasi.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-cyan-400 font-bold uppercase tracking-wider text-[10px]">03. Communication Objective</span>
              <p className="text-slate-200 font-medium">Membangun persepsi TELPRO sebagai penyedia infrastruktur logistik & konektivitas paling andal bergaransi SLA 99.9%.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-800">
            <div>
              <span className="text-slate-400 font-semibold block mb-1">Pagu Anggaran Pemasaran Bulanan (Monthly Ceiling):</span>
              <div className="text-lg font-extrabold text-white">Rp 450.000.000</div>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block mb-1">Primary KPI Tracker:</span>
              <div className="text-sm font-bold text-emerald-400">Cost Per Lead (CPL) &lt; Rp 175.000 • WA Conversion Rate &gt; 12%</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Campaign Plan */}
      {subTab === 'campaigns' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Daftar Campaign Aktif & Rencana ({campaigns.length})</h2>
            <button
              id="create-new-campaign-btn"
              onClick={() => setShowShowNewCampaignModal(true)}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-rose-900/30 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" /> Buat Campaign Baru
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.map(cmp => (
              <div
                key={cmp.id}
                className={`p-5 rounded-3xl bg-slate-900 border transition-all ${
                  cmp.id === selectedCampaign?.id ? 'border-rose-500/80 shadow-rose-950/20 shadow-2xl bg-slate-900/90' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] mb-2">
                  <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-semibold border border-rose-800/50">
                    {cmp.status}
                  </span>
                  <span className="text-slate-400">{cmp.periodStart} - {cmp.periodEnd}</span>
                </div>

                <h3 className="text-sm font-bold text-white mb-2 line-clamp-2">{cmp.name}</h3>
                
                <div className="space-y-2 text-[11px] text-slate-300 mb-4">
                  <div>
                    <span className="text-slate-500 font-semibold block">Produk Prioritas:</span>
                    <span className="text-slate-200 font-medium">{cmp.priorityProduct}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">Target Audience:</span>
                    <span className="text-slate-300">{cmp.audience}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Alokasi Budget:</span>
                    <span className="font-bold text-slate-200">Rp {(cmp.budgetAllocated / 1000000).toFixed(0)} Juta</span>
                  </div>
                  <button
                    onClick={() => useApp().setSelectedCampaignId(cmp.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs ${
                      cmp.id === selectedCampaign?.id
                        ? 'bg-rose-600 text-white shadow'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {cmp.id === selectedCampaign?.id ? 'Active Focus' : 'Pilih Campaign'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Content Plan */}
      {subTab === 'contentplan' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white">Canonical Content Plan ({contents.length})</h2>
              <p className="text-xs text-slate-400">Jadwal seluruh paket konten terintegrasi dengan status approval & readiness</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 flex items-center gap-1"><Filter className="w-3.5 h-3.5" /> Filter Platform:</span>
              <select className="bg-slate-950 text-slate-200 border border-slate-800 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none">
                <option value="all">Semua Platform</option>
                <option value="linkedin">LinkedIn</option>
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Judul Konten</th>
                  <th className="p-3">Platform</th>
                  <th className="p-3">Format</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">PIC</th>
                  <th className="p-3">Version</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {contents.map(cnt => (
                  <tr key={cnt.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-semibold text-slate-100 max-w-xs">{cnt.title}</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">{cnt.platform}</span></td>
                    <td className="p-3">{cnt.format}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                        cnt.status === 'Approved' || cnt.status === 'Published'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : cnt.status === 'Revision Required'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {cnt.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">{cnt.pic}</td>
                    <td className="p-3 text-rose-400 font-mono font-bold">#{cnt.currentVersionId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Create Campaign */}
      {showNewCampaignModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl p-6 shadow-2xl animate-in zoom-in-95 space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Buat Campaign Baru TELPRO 2026</h3>

            <form onSubmit={handleCreateCampaign} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Nama Campaign *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: TELPRO Cloud Edge Connectivity 2026"
                  value={newCampaignName}
                  onChange={e => setNewCampaignName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Produk Utama Prioritas *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dedicated Fiber 1Gbps / Smart Warehouse IoT"
                  value={newProduct}
                  onChange={e => setNewProduct(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Business Objective *</label>
                <textarea
                  rows={2}
                  placeholder="Tujuan bisnis utama yang ingin dicapai..."
                  value={newBusinessObj}
                  onChange={e => setNewBusinessObj(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Target Audience *</label>
                <input
                  type="text"
                  placeholder="CFO, COO, Head of IT Enterprise..."
                  value={newAudience}
                  onChange={e => setNewAudience(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Alokasi Anggaran (Rp) *</label>
                <input
                  type="number"
                  value={newBudget}
                  onChange={e => setNewBudget(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowShowNewCampaignModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-900/30"
                >
                  Simpan Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
