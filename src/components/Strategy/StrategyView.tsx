import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Campaign, ContentItem, BudgetItem } from '../../types';
import { Target, Layers, FileText, Calendar, Plus, Briefcase, CheckCircle2, ShieldAlert, Sparkles, Filter, Lock, Edit3, Save, X, Trash2, Search, RotateCcw, Eye, ExternalLink, Compass, ShieldCheck, Rocket, Building2, Phone, Mail, MessageSquare, Coins, TrendingUp } from 'lucide-react';
import { NavTab } from '../Sidebar';
import { RbacBanner } from '../Common/RbacBanner';
import { WorkflowPipelineBar } from '../Common/WorkflowPipelineBar';
import { hasPermission } from '../../utils/rbac';

interface StrategyViewProps {
  activeTab?: NavTab;
  setActiveTab?: (tab: NavTab) => void;
}

export const StrategyView: React.FC<StrategyViewProps> = ({ activeTab, setActiveTab }) => {
  const { campaigns, addCampaign, contents, contentVersions, addContentWithVersion, updateVersionCta, updateVersionDetails, selectedCampaign, activeUser, setIsAiPartnerModalOpen, setSelectedCampaignId, budgets, addBudgetItem } = useApp();
  const canCreate = hasPermission(activeUser.role, 'canCreateCampaign');

  // Manual Version Content Editor State
  const [editingVersionId, setEditingVersionId] = useState<string | null>(null);
  const [editHook, setEditHook] = useState('');
  const [editCaption, setEditCaption] = useState('');
  const [editScript, setEditScript] = useState('');
  const [editCta, setEditCta] = useState('');
  const [editKeywords, setEditKeywords] = useState('');
  const [editHashtags, setEditHashtags] = useState('');

  const [platformFilter, setPlatformFilter] = useState('all');
  const [campaignFilter, setCampaignFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive Content Plan States
  const [selectedDetailContent, setSelectedDetailContent] = useState<ContentItem | null>(null);
  const [isAddContentModalOpen, setIsAddContentModalOpen] = useState(false);
  const [newContentTitle, setNewContentTitle] = useState('');
  const [newContentCampaignId, setNewContentCampaignId] = useState(campaigns[0]?.id || 'cmp-2026-01');
  const [newContentPlatform, setNewContentPlatform] = useState('Instagram');
  const [newContentFormat, setNewContentFormat] = useState('Reels/Shorts');
  const [newContentPic, setNewContentPic] = useState(activeUser.name || 'Marcom Team');
  const [newContentCaption, setNewContentCaption] = useState('');

  let subTab: 'context' | 'monthly' | 'campaigns' | 'contentplan' | 'budget' = 'campaigns';
  if (activeTab === 'strategy-monthly') subTab = 'monthly';
  else if (activeTab === 'strategy-campaigns') subTab = 'campaigns';
  else if (activeTab === 'strategy-contentplan') subTab = 'contentplan';
  else if (activeTab === 'strategy-context') subTab = 'context';
  else if (activeTab === 'strategy-budget' || activeTab === 'gov-budget') subTab = 'budget';

  // State Brand Profile
  const [brandProfile, setBrandProfile] = useState(() => {
    const saved = localStorage.getItem('telpro_brand_profile');
    return saved ? JSON.parse(saved) : {
      toneOfVoice: 'Profesional, Lugas, Berwibawa, Mengedepankan Data & Kepastian Operasional (Authoritative & Solution-Oriented)',
      preferredTerms: ['Infrastruktur Terdedikasi', 'Presisi Logistik', 'SLA 99.9%', 'Ekosistem TELPRO', 'Transformasi Digital Berkelanjutan'],
      prohibitedTerms: ['Termurah di Indonesia (Gunakan: Efisiensi Biaya Optimal)', 'Satu-satunya di Pasar (Gunakan: Pemimpin Pasar Terintegrasi)', 'Internet Murahan'],
      disclaimer: 'Seluruh klaim efisiensi dan jaminan Service Level Agreement (SLA) berdasar pada ketentuan kontrak resmi dan pengujian infrastruktur terverifikasi PT Telkom Property (TELPRO).'
    };
  });
  const [showEditBrandProfile, setShowEditBrandProfile] = useState(false);
  const [editTone, setEditTone] = useState(brandProfile.toneOfVoice);
  const [editPreferred, setEditPreferred] = useState(brandProfile.preferredTerms.join(', '));
  const [editProhibited, setEditProhibited] = useState(brandProfile.prohibitedTerms.join(', '));
  const [editDisclaimer, setEditDisclaimer] = useState(brandProfile.disclaimer);

  const handleSaveBrandProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      toneOfVoice: editTone,
      preferredTerms: editPreferred.split(',').map((s: string) => s.trim()).filter(Boolean),
      prohibitedTerms: editProhibited.split(',').map((s: string) => s.trim()).filter(Boolean),
      disclaimer: editDisclaimer
    };
    setBrandProfile(updated);
    localStorage.setItem('telpro_brand_profile', JSON.stringify(updated));
    setShowEditBrandProfile(false);
  };

  // State Compliance Rules
  const [complianceRules, setComplianceRules] = useState(() => {
    const saved = localStorage.getItem('telpro_compliance_rules');
    return saved ? JSON.parse(saved) : {
      competitorRule: 'Tidak diperbolehkan menyebutkan merk/brand kompetitor secara langsung dalam materi publikasi resmi. Gunakan istilah generic "Sistem Gudang Konvensional" atau "Layanan Shared Bandwidth Biasa".',
      audioCopyrightRule: 'Setiap audio yang digunakan dalam konten reels/video komersial Wajib bertanda "Verified for Intended Use" di Asset Library TELPRO.',
      dataClaimRule: 'Semua angka persentase efisiensi wajib menautkan ID Evidence pada Laporan Studi Terverifikasi di modul Evidence Pack.'
    };
  });
  const [showEditCompliance, setShowEditCompliance] = useState(false);
  const [editCompetitorRule, setEditCompetitorRule] = useState(complianceRules.competitorRule);
  const [editAudioRule, setEditAudioRule] = useState(complianceRules.audioCopyrightRule);
  const [editDataClaimRule, setEditDataClaimRule] = useState(complianceRules.dataClaimRule);

  const handleSaveCompliance = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      competitorRule: editCompetitorRule,
      audioCopyrightRule: editAudioRule,
      dataClaimRule: editDataClaimRule
    };
    setComplianceRules(updated);
    localStorage.setItem('telpro_compliance_rules', JSON.stringify(updated));
    setShowEditCompliance(false);
  };

  // State Monthly Baseline Setup
  const [monthlySetup, setMonthlySetup] = useState(() => {
    const saved = localStorage.getItem('telpro_monthly_setup');
    return saved ? JSON.parse(saved) : {
      periodMonth: 'Agustus 2026',
      businessObjective: 'Meningkatkan total pendapatan sewa solusi B2B Smart Logistics & Konektivitas Terdedikasi sebesar 20% MoM di Q3 2026.',
      marketingObjective: 'Akuisisi 250 Marketing Qualified Leads (MQL), 800 WA Chat Inquiries, dan 120.000 Landing Page Views terverifikasi.',
      communicationObjective: 'Membangun persepsi TELPRO sebagai penyedia infrastruktur logistik & konektivitas paling andal bergaransi SLA 99.9%.',
      monthlyCeiling: 450000000,
      kpiTracker: 'Cost Per Lead (CPL) < Rp 175.000 • WA Conversion Rate > 12%'
    };
  });
  const [showEditMonthly, setShowEditMonthly] = useState(false);
  const [editMonth, setEditMonth] = useState(monthlySetup.periodMonth);
  const [editBizObj, setEditBizObj] = useState(monthlySetup.businessObjective);
  const [editMktObj, setEditMktObj] = useState(monthlySetup.marketingObjective);
  const [editCommObj, setEditCommObj] = useState(monthlySetup.communicationObjective);
  const [editCeiling, setEditCeiling] = useState(monthlySetup.monthlyCeiling);
  const [editKpi, setEditKpi] = useState(monthlySetup.kpiTracker);

  const handleSaveMonthly = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      periodMonth: editMonth,
      businessObjective: editBizObj,
      marketingObjective: editMktObj,
      communicationObjective: editCommObj,
      monthlyCeiling: Number(editCeiling),
      kpiTracker: editKpi
    };
    setMonthlySetup(updated);
    localStorage.setItem('telpro_monthly_setup', JSON.stringify(updated));
    setShowEditMonthly(false);
  };

  // State Campaign Creation & Editing
  const [showNewCampaignModal, setShowShowNewCampaignModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  const [campaignForm, setCampaignForm] = useState({
    name: '',
    product: '',
    businessObj: '',
    marketingObj: '',
    commObj: '',
    audience: '',
    budget: '100000000',
    start: '2026-08-15',
    end: '2026-10-15',
    status: 'Planned' as Campaign['status'],
    keyMessage: 'Kendali Presisi & Efisiensi Berkelanjutan bersama TELPRO'
  });

  const openNewCampaignModal = () => {
    setCampaignForm({
      name: '',
      product: 'TELPRO Smart Solutions',
      businessObj: 'Meningkatkan penetrasi produk B2B TELPRO',
      marketingObj: 'Menghasilkan 100 MQL & WA Inquiries',
      commObj: 'Edukasi solusi terpadu efisiensi operasional',
      audience: 'C-Level & Decision Maker B2B Enterprise',
      budget: '100000000',
      start: '2026-08-15',
      end: '2026-10-15',
      status: 'Planned',
      keyMessage: 'Kendali Presisi & Efisiensi Berkelanjutan bersama TELPRO'
    });
    setEditingCampaign(null);
    setShowShowNewCampaignModal(true);
  };

  const openEditCampaignModal = (cmp: Campaign) => {
    setEditingCampaign(cmp);
    setCampaignForm({
      name: cmp.name,
      product: cmp.priorityProduct,
      businessObj: cmp.businessObjective,
      marketingObj: cmp.marketingObjective,
      commObj: cmp.communicationObjective,
      audience: cmp.audience,
      budget: cmp.budgetAllocated.toString(),
      start: cmp.periodStart,
      end: cmp.periodEnd,
      status: cmp.status,
      keyMessage: cmp.keyMessage || 'Kendali Presisi TELPRO 2026'
    });
    setShowShowNewCampaignModal(true);
  };

  const handleSaveCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignForm.name) return;

    if (editingCampaign) {
      const updatedCampaigns = campaigns.map(c => c.id === editingCampaign.id ? {
        ...c,
        name: campaignForm.name,
        priorityProduct: campaignForm.product,
        businessObjective: campaignForm.businessObj,
        marketingObjective: campaignForm.marketingObj,
        communicationObjective: campaignForm.commObj,
        audience: campaignForm.audience,
        budgetAllocated: Number(campaignForm.budget) || 100000000,
        periodStart: campaignForm.start,
        periodEnd: campaignForm.end,
        status: campaignForm.status,
        keyMessage: campaignForm.keyMessage
      } : c);
      localStorage.setItem('telpro_campaigns', JSON.stringify(updatedCampaigns));
      window.location.reload();
    } else {
      const newCamp: Campaign = {
        id: `cmp-2026-${Date.now().toString().slice(-4)}`,
        name: campaignForm.name,
        periodStart: campaignForm.start,
        periodEnd: campaignForm.end,
        businessObjective: campaignForm.businessObj,
        marketingObjective: campaignForm.marketingObj,
        communicationObjective: campaignForm.commObj,
        audience: campaignForm.audience,
        status: campaignForm.status,
        budgetAllocated: Number(campaignForm.budget) || 100000000,
        budgetSpent: 0,
        owner: `${activeUser.name} (${activeUser.role.replace('ROLE_', '')})`,
        priorityProduct: campaignForm.product,
        keyMessage: campaignForm.keyMessage,
        funnelStage: 'Consideration'
      };
      addCampaign(newCamp);
    }

    setShowShowNewCampaignModal(false);
  };

  // State Budget Ledger
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
  const [budgetActivity, setBudgetActivity] = useState('');
  const [budgetAllocated, setBudgetAllocated] = useState('25000000');
  const [budgetCategory, setBudgetCategory] = useState<BudgetItem['category']>('Paid Ads');
  const [budgetCampaignId, setBudgetCampaignId] = useState(selectedCampaign?.id || campaigns[0]?.id || 'cmp-2026-01');

  const handleCreateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!budgetActivity) return;

    const newItem: BudgetItem = {
      id: `bdg-${Date.now().toString().slice(-4)}`,
      campaignId: budgetCampaignId,
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

  const totalAllocatedAll = budgets.reduce((acc, b) => acc + b.allocatedAmount, 0);
  const totalActualAll = budgets.reduce((acc, b) => acc + b.actualAmount, 0);
  const totalVarianceAll = budgets.reduce((acc, b) => acc + b.varianceAmount, 0);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-rose-500" />
              02. Strategy & Campaign Planning
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Pengelolaan profil brand, target bulanan, rencana campaign, jadwal konten utama, & alokasi anggaran biaya (Budget Ledger)</p>
          </div>
        </div>
        <RbacBanner moduleName="Strategy & Planning" requiredAction="canCreateCampaign" requiredRole="ROLE_STRATEGY_LEAD / ROLE_SYSTEM_ADMIN" />
        
        {/* Universal Sequential Workflow Bar */}
        <WorkflowPipelineBar
          currentStage="02"
          setActiveTab={setActiveTab}
          titleSuffix={subTab === 'budget' ? 'Alokasi Anggaran & Master Budget Ledger (Langkah ke-2)' : 'Formulasi Campaign, Audience, & Budget (Langkah ke-2)'}
        />
      </div>

      {/* Tab 1: Business & Brand Context */}
      {subTab === 'context' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in">
          {/* Card 1: Brand Profile */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-rose-400" />
                TELPRO Corporate & Brand Profile
              </h2>
              <button
                type="button"
                onClick={() => {
                  setEditTone(brandProfile.toneOfVoice);
                  setEditPreferred(brandProfile.preferredTerms.join(', '));
                  setEditProhibited(brandProfile.prohibitedTerms.join(', '));
                  setEditDisclaimer(brandProfile.disclaimer);
                  setShowEditBrandProfile(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-1.5 transition-all border border-rose-200 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Profile
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-semibold block">Tone of Voice:</span>
                <span className="text-slate-900 font-semibold">{brandProfile.toneOfVoice}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-semibold block">Preferred Terminology:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {brandProfile.preferredTerms.map((term: string) => (
                    <span key={term} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200/50 text-[10px]">
                      {term}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-semibold block">Prohibited Terminology & Claims:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {brandProfile.prohibitedTerms.map((term: string) => (
                    <span key={term} className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200/50 text-[10px]">
                      🚫 {term}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-semibold block">Mandatory Disclaimer:</span>
                <p className="text-slate-700 italic text-[11px] mt-1">
                  "{brandProfile.disclaimer}"
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Brand Safety */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                Brand Safety & Compliance Rules
              </h2>
              <button
                type="button"
                onClick={() => {
                  setEditCompetitorRule(complianceRules.competitorRule);
                  setEditAudioRule(complianceRules.audioCopyrightRule);
                  setEditDataClaimRule(complianceRules.dataClaimRule);
                  setShowEditCompliance(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold flex items-center gap-1.5 transition-all border border-amber-200 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Rules
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-semibold block">Aturan Komparasi Kompetitor:</span>
                <p className="text-slate-700 mt-1">{complianceRules.competitorRule}</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-semibold block">Copyright Musik & Trending Audio:</span>
                <p className="text-slate-700 mt-1">{complianceRules.audioCopyrightRule}</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-semibold block">Klaim Berbasis Data (No Source No Fact):</span>
                <p className="text-slate-700 mt-1">{complianceRules.dataClaimRule}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Monthly Setup */}
      {subTab === 'monthly' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-6 shadow-sm animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Monthly Setup Baseline ({monthlySetup.periodMonth})</h2>
              <p className="text-xs text-slate-400">Pemisahan eksplisit Business, Marketing, & Communication Objectives</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-xs">
                Approved Baseline
              </span>
              <button
                type="button"
                onClick={() => {
                  setEditMonth(monthlySetup.periodMonth);
                  setEditBizObj(monthlySetup.businessObjective);
                  setEditMktObj(monthlySetup.marketingObjective);
                  setEditCommObj(monthlySetup.communicationObjective);
                  setEditCeiling(monthlySetup.monthlyCeiling);
                  setEditKpi(monthlySetup.kpiTracker);
                  setShowEditMonthly(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1.5 border border-indigo-200 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Monthly Target
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-rose-400 font-bold uppercase tracking-wider text-[10px]">01. Business Objective</span>
              <p className="text-slate-900 font-medium">{monthlySetup.businessObjective}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-indigo-400 font-bold uppercase tracking-wider text-[10px]">02. Marketing Objective</span>
              <p className="text-slate-900 font-medium">{monthlySetup.marketingObjective}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-cyan-400 font-bold uppercase tracking-wider text-[10px]">03. Communication Objective</span>
              <p className="text-slate-900 font-medium">{monthlySetup.communicationObjective}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-200">
            <div>
              <span className="text-slate-400 font-semibold block mb-1">Pagu Anggaran Pemasaran Bulanan (Monthly Ceiling):</span>
              <div className="text-lg font-extrabold text-slate-900">Rp {monthlySetup.monthlyCeiling.toLocaleString()}</div>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block mb-1">Primary KPI Tracker:</span>
              <div className="text-sm font-bold text-emerald-400">{monthlySetup.kpiTracker}</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Campaign Plan */}
      {subTab === 'campaigns' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Daftar Campaign Aktif & Rencana ({campaigns.length})</h2>
            <button
              id="create-new-campaign-btn"
              disabled={!canCreate}
              onClick={openNewCampaignModal}
              title={canCreate ? 'Buat Campaign Baru' : `Akses Terbatas: Role Anda (${activeUser.role.replace('ROLE_', '')}) tidak memiliki hak membuat campaign.`}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition-all ${
                canCreate
                  ? 'bg-rose-600 hover:bg-rose-500 text-white cursor-pointer hover:scale-105 shadow-rose-900/20'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-70'
              }`}
            >
              {canCreate ? <Plus className="w-4 h-4" /> : <Lock className="w-4 h-4 text-slate-400" />}
              {canCreate ? 'Buat Campaign Baru' : 'Buat Campaign (Akses Terbatas)'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.map(cmp => (
              <div
                key={cmp.id}
                onClick={() => setSelectedCampaignId(cmp.id)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer hover:scale-[1.01] ${
                  cmp.id === selectedCampaign?.id ? 'border-rose-500 shadow-md bg-rose-50/40 ring-1 ring-rose-500' : 'border-slate-200 hover:border-slate-300 bg-white shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] mb-2">
                  <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 font-semibold border border-rose-800/50">
                    {cmp.status}
                  </span>
                  <span className="text-slate-400">{cmp.periodStart} - {cmp.periodEnd}</span>
                </div>

                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2">{cmp.name}</h3>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditCampaignModal(cmp);
                    }}
                    title="Edit Detail Campaign"
                    className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 shrink-0"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                <div className="space-y-2 text-[11px] text-slate-700 mb-4">
                  <div>
                    <span className="text-slate-500 font-semibold block">Produk Prioritas:</span>
                    <span className="text-slate-900 font-semibold">{cmp.priorityProduct}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold block">Target Audience:</span>
                    <span className="text-slate-700">{cmp.audience}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Alokasi Budget:</span>
                    <span className="font-bold text-slate-900">Rp {(cmp.budgetAllocated / 1000000).toFixed(0)} Juta</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCampaignId(cmp.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs cursor-pointer ${
                      cmp.id === selectedCampaign?.id
                        ? 'bg-rose-600 text-white shadow'
                        : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-700'
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
      {subTab === 'contentplan' && (() => {
        const filteredContents = contents.filter(cnt => {
          // Platform Filter
          if (platformFilter !== 'all') {
            const pf = platformFilter.toLowerCase();
            const cp = (cnt.platform || '').toLowerCase();
            if (pf === 'article') {
              if (!cp.includes('article') && !cp.includes('blog') && !cp.includes('web') && !cp.includes('search')) return false;
            } else if (!cp.includes(pf)) {
              return false;
            }
          }

          // Campaign Filter
          if (campaignFilter !== 'all' && cnt.campaignId !== campaignFilter) {
            return false;
          }

          // Status Filter
          if (statusFilter !== 'all' && cnt.status !== statusFilter) {
            return false;
          }

          // Search Filter
          if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const titleMatch = (cnt.title || '').toLowerCase().includes(q);
            const picMatch = (cnt.pic || '').toLowerCase().includes(q);
            const platMatch = (cnt.platform || '').toLowerCase().includes(q);
            if (!titleMatch && !picMatch && !platMatch) return false;
          }

          return true;
        });

        const isFiltered = platformFilter !== 'all' || campaignFilter !== 'all' || statusFilter !== 'all' || searchQuery.trim() !== '';

        return (
          <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm animate-in fade-in">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div className="flex items-center justify-between lg:justify-start gap-3 w-full lg:w-auto">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-rose-500" />
                    Rencana Konten Utama ({filteredContents.length} dari {contents.length} Konten)
                  </h2>
                  <p className="text-xs text-slate-400">Jadwal seluruh paket konten terintegrasi dengan status approval & readiness</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddContentModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-rose-950/40 transition-all shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" /> + Buat Konten
                </button>
              </div>

              {/* Filter Controls Bar */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Search Input */}
                <div className="relative flex-1 sm:w-48 min-w-[140px]">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari judul / PIC..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 border border-slate-200 text-xs rounded-xl pl-8 pr-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-rose-500 focus:bg-white placeholder:text-slate-400"
                  />
                </div>

                {/* Filter Campaign */}
                <select
                  value={campaignFilter}
                  onChange={e => setCampaignFilter(e.target.value)}
                  className="bg-slate-50 text-slate-900 border border-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-rose-500 focus:bg-white"
                >
                  <option value="all">Semua Campaign</option>
                  {campaigns.map(cmp => (
                    <option key={cmp.id} value={cmp.id}>{cmp.name}</option>
                  ))}
                </select>

                {/* Filter Platform */}
                <select
                  value={platformFilter}
                  onChange={e => setPlatformFilter(e.target.value)}
                  className="bg-slate-50 text-slate-900 border border-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-rose-500 focus:bg-white"
                >
                  <option value="all">Semua Platform</option>
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="article">Article / Blog / Web</option>
                  <option value="tiktok">TikTok</option>
                  <option value="youtube">YouTube</option>
                </select>

                {/* Filter Status */}
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="bg-slate-50 text-slate-900 border border-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-rose-500 focus:bg-white"
                >
                  <option value="all">Semua Status</option>
                  <option value="Approved">Approved</option>
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Revision Required">Revision Required</option>
                </select>

                {/* Reset Filters */}
                {isFiltered && (
                  <button
                    type="button"
                    onClick={() => {
                      setPlatformFilter('all');
                      setCampaignFilter('all');
                      setStatusFilter('all');
                      setSearchQuery('');
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1 border border-rose-200 transition-colors"
                    title="Reset Semua Filter"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Judul Konten</th>
                    <th className="p-3">Campaign</th>
                    <th className="p-3">Platform</th>
                    <th className="p-3">Format</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">PIC</th>
                    <th className="p-3">Version</th>
                    <th className="p-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {filteredContents.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400 space-y-2">
                        <p className="font-semibold text-slate-700">Tidak ada konten yang sesuai dengan filter saat ini.</p>
                        <p className="text-[11px] text-slate-500">Coba ubah kriteria pencarian, platform, campaign, atau klik 'Reset'.</p>
                        <button
                          type="button"
                          onClick={() => {
                            setPlatformFilter('all');
                            setCampaignFilter('all');
                            setStatusFilter('all');
                            setSearchQuery('');
                          }}
                          className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                        >
                          <RotateCcw className="w-3 h-3" /> Reset Filter
                        </button>
                      </td>
                    </tr>
                  ) : (
                    filteredContents.map(cnt => {
                      const cmp = campaigns.find(c => c.id === cnt.campaignId);
                      return (
                        <tr
                          key={cnt.id}
                          className="hover:bg-slate-50 transition-colors cursor-pointer group"
                          onClick={() => setSelectedDetailContent(cnt)}
                        >
                          <td className="p-3 font-semibold text-slate-100 max-w-xs group-hover:text-rose-300 transition-colors">
                            {cnt.title}
                          </td>
                          <td className="p-3 text-slate-400 max-w-[140px] truncate" title={cmp?.name || '-'}>
                            {cmp ? cmp.name : '-'}
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-medium text-slate-700">
                              {cnt.platform}
                            </span>
                          </td>
                          <td className="p-3">{cnt.format}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                              cnt.status === 'Approved' || cnt.status === 'Published'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : cnt.status === 'Revision Required'
                                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}>
                              {cnt.status}
                            </span>
                          </td>
                          <td className="p-3 text-slate-400">{cnt.pic}</td>
                          <td className="p-3 text-rose-400 font-mono font-bold">#{cnt.currentVersionId}</td>
                          <td className="p-3 text-right" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setSelectedDetailContent(cnt)}
                                className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold flex items-center gap-1 border border-slate-200 transition-colors"
                                title="Lihat Pratinjau Detail"
                              >
                                <Eye className="w-3 h-3 text-rose-400" /> Detail
                              </button>
                              {setActiveTab && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => setActiveTab('intel-opportunities')}
                                    className="px-2 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 text-[11px] font-semibold flex items-center gap-1 border border-cyan-800 transition-colors"
                                    title="Langkah ke-3: Cari Trend & Signal Relevan"
                                  >
                                    <Compass className="w-3 h-3 text-cyan-400" /> 03. Ide & Tren
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setActiveTab('content-studio')}
                                    className="px-2 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 text-[11px] font-semibold flex items-center gap-1 border border-rose-800 transition-colors"
                                    title="Langkah ke-4: Draft Naskah di AI Studio"
                                  >
                                    <Sparkles className="w-3 h-3 text-rose-400" /> 04. Studio
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal Detail & Navigasi Konten */}
            {selectedDetailContent && (() => {
              const cmp = campaigns.find(c => c.id === selectedDetailContent.campaignId);
              const ver = contentVersions.find(v => v.id === selectedDetailContent.currentVersionId) || contentVersions.find(v => v.contentId === selectedDetailContent.id);

              return (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
                  <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 max-w-2xl w-full space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                    <button
                      onClick={() => setSelectedDetailContent(null)}
                      className="absolute top-5 right-5 p-2 text-slate-500 hover:text-slate-800 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-start gap-3 border-b border-slate-200 pb-4 pr-8">
                      <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-800/80 text-rose-400 shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {selectedDetailContent.platform} • {selectedDetailContent.format}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 mt-1">{selectedDetailContent.title}</h3>
                        <p className="text-xs text-slate-400">
                          Campaign: <strong className="text-slate-900 font-bold">{cmp?.name || '-'}</strong> • PIC: <strong className="text-slate-900 font-bold">{selectedDetailContent.pic}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                        <span className="text-slate-500 text-[10px] uppercase font-bold block">Status Approval</span>
                        <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                          selectedDetailContent.status === 'Approved' || selectedDetailContent.status === 'Published'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {selectedDetailContent.status}
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                        <span className="text-slate-500 text-[10px] uppercase font-bold block">Current Version</span>
                        <span className="text-rose-400 font-mono font-bold text-sm block mt-0.5">#{selectedDetailContent.currentVersionId}</span>
                      </div>
                    </div>

                    {ver && (
                      <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                        {/* Header Control for Manual Edit */}
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                          <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                            <FileText className="w-4 h-4 text-rose-400" /> Detail Isian & Naskah Konten
                          </span>
                          {editingVersionId !== ver.id ? (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingVersionId(ver.id);
                                setEditHook(ver.hook || '');
                                setEditCaption(ver.caption || '');
                                setEditScript(ver.script || '');
                                setEditCta(ver.cta || 'Call Center: 1500 473 | WA: +62811 150 4739 (chat only) | Email: info@telpro.co.id | Graha TelkomProperty, Jln Kebon Sirih No. 10-12, Jakarta Pusat, 10110');
                                setEditKeywords(ver.selectedKeywords ? ver.selectedKeywords.join(', ') : '');
                                setEditHashtags(ver.selectedHashtags ? ver.selectedHashtags.join(', ') : '');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" /> ✏️ Edit Manual Seluruh Konten
                            </button>
                          ) : (
                            <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-800 flex items-center gap-1 animate-pulse">
                              <Sparkles className="w-3.5 h-3.5" /> Mode Edit Manual Aktif
                            </span>
                          )}
                        </div>

                        {/* MODE EDIT MANUAL FULL */}
                        {editingVersionId === ver.id ? (
                          <div className="space-y-3.5 p-3 rounded-2xl bg-rose-50/50 border border-rose-200">
                            {/* Hook */}
                            <div className="space-y-1">
                              <label className="text-rose-300 font-bold text-[10px] uppercase block flex items-center gap-1">
                                <Edit3 className="w-3 h-3" /> Hook Kalimat Pembuka *
                              </label>
                              <textarea
                                rows={2}
                                value={editHook}
                                onChange={e => setEditHook(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-rose-300 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs leading-relaxed"
                                placeholder="Tuliskan hook kalimat pembuka..."
                              />
                            </div>

                            {/* Caption */}
                            <div className="space-y-1">
                              <label className="text-slate-800 font-bold text-[10px] uppercase block flex items-center gap-1">
                                <Edit3 className="w-3 h-3 text-rose-400" /> Caption / Copywriting *
                              </label>
                              <textarea
                                rows={6}
                                value={editCaption}
                                onChange={e => setEditCaption(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs leading-relaxed"
                                placeholder="Tuliskan caption / copywriting..."
                              />
                            </div>

                            {/* Script */}
                            <div className="space-y-1">
                              <label className="text-amber-300 font-bold text-[10px] uppercase block flex items-center gap-1">
                                <Edit3 className="w-3 h-3" /> Script Video / Visual Flow Storyboard
                              </label>
                              <textarea
                                rows={4}
                                value={editScript}
                                onChange={e => setEditScript(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-amber-200 font-mono focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs leading-relaxed"
                                placeholder="Tuliskan script video atau visual flow..."
                              />
                            </div>

                            {/* CTA */}
                            <div className="space-y-2 p-3 rounded-2xl bg-emerald-950/30 border border-emerald-900/60">
                              <label className="text-emerald-300 font-bold text-[10px] uppercase block flex items-center gap-1">
                                <Building2 className="w-3.5 h-3.5 text-rose-400" /> Call to Action (CTA) & Official Contact *
                              </label>
                              <textarea
                                rows={3}
                                value={editCta}
                                onChange={e => setEditCta(e.target.value)}
                                className="w-full bg-slate-50 border border-emerald-200 rounded-xl px-3 py-2 text-emerald-800 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs leading-relaxed"
                                placeholder="Isikan CTA & Kontak Resmi TELPRO..."
                              />
                              {/* Quick Presets */}
                              <div className="space-y-1 p-2 rounded-xl bg-slate-50 border border-slate-200 text-[10px]">
                                <span className="text-slate-400 font-bold block">Quick Preset Kontak Resmi TELPRO:</span>
                                <div className="flex flex-wrap gap-1">
                                  <button
                                    type="button"
                                    onClick={() => setEditCta('Call Center: 1500 473 | WA: +62811 150 4739 (chat only) | Email: info@telpro.co.id | Graha TelkomProperty, Jln Kebon Sirih No. 10-12, Jakarta Pusat, 10110')}
                                    className="px-2 py-1 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 text-[10px] font-semibold transition-colors"
                                  >
                                    📞 Preset Lengkap Contact Us (HQ Kebon Sirih)
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditCta('Call Center: 1500 473 | WA: +62811 150 4739 (chat only) | telpro.co.id')}
                                    className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-[10px] font-semibold transition-colors"
                                  >
                                    💬 Call Center & WA Chat
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Keywords & Hashtags */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              <div className="space-y-1">
                                <label className="text-slate-400 font-bold text-[10px] uppercase block">Keywords (Dipisah Koma)</label>
                                <input
                                  type="text"
                                  value={editKeywords}
                                  onChange={e => setEditKeywords(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs"
                                  placeholder="e.g. TELPRO, Smart Space, B2B"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-slate-400 font-bold text-[10px] uppercase block">Hashtags (Dipisah Koma)</label>
                                <input
                                  type="text"
                                  value={editHashtags}
                                  onChange={e => setEditHashtags(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs font-mono"
                                  placeholder="e.g. #TELPRO, #SmartSpace"
                                />
                              </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                              <button
                                type="button"
                                onClick={() => setEditingVersionId(null)}
                                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition-colors"
                              >
                                Batal
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const kwArray = editKeywords.split(',').map(s => s.trim()).filter(Boolean);
                                  const htArray = editHashtags.split(',').map(s => s.trim()).filter(Boolean);
                                  updateVersionDetails(ver.id, {
                                    hook: editHook,
                                    caption: editCaption,
                                    script: editScript,
                                    cta: editCta,
                                    selectedKeywords: kwArray,
                                    selectedHashtags: htArray
                                  });
                                  setEditingVersionId(null);
                                  alert('✅ Seluruh elemen naskah berhasil diperbarui secara manual!');
                                }}
                                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
                              >
                                <Save className="w-4 h-4" /> Simpan Semua Perubahan
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* READ / DISPLAY MODE WITH INDIVIDUAL QUICK EDIT BUTTONS */
                          <>
                            {/* Hook Text */}
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Hook Text (Kalimat Pembuka)</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingVersionId(ver.id);
                                    setEditHook(ver.hook || '');
                                    setEditCaption(ver.caption || '');
                                    setEditScript(ver.script || '');
                                    setEditCta(ver.cta || '');
                                    setEditKeywords(ver.selectedKeywords ? ver.selectedKeywords.join(', ') : '');
                                    setEditHashtags(ver.selectedHashtags ? ver.selectedHashtags.join(', ') : '');
                                  }}
                                  className="text-rose-400 hover:text-rose-300 font-bold text-[10px] flex items-center gap-1 hover:underline cursor-pointer"
                                >
                                  <Edit3 className="w-3 h-3" /> Edit
                                </button>
                              </div>
                              <p className="text-rose-300 font-medium bg-rose-950/40 p-2.5 rounded-xl border border-rose-900/50 leading-relaxed">
                                {ver.hook || '- Belum diisi -'}
                              </p>
                            </div>

                            {/* Caption */}
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Caption / Copywriting</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingVersionId(ver.id);
                                    setEditHook(ver.hook || '');
                                    setEditCaption(ver.caption || '');
                                    setEditScript(ver.script || '');
                                    setEditCta(ver.cta || '');
                                    setEditKeywords(ver.selectedKeywords ? ver.selectedKeywords.join(', ') : '');
                                    setEditHashtags(ver.selectedHashtags ? ver.selectedHashtags.join(', ') : '');
                                  }}
                                  className="text-rose-400 hover:text-rose-300 font-bold text-[10px] flex items-center gap-1 hover:underline cursor-pointer"
                                >
                                  <Edit3 className="w-3 h-3" /> Edit
                                </button>
                              </div>
                              <p className="text-slate-800 whitespace-pre-wrap bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed font-mono text-[11px]">
                                {ver.caption || '- Belum diisi -'}
                              </p>
                            </div>

                            {/* Script Video */}
                            {ver.script && (
                              <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-amber-400 font-bold text-[10px] uppercase tracking-wider">Script Video / Visual Storyboard</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingVersionId(ver.id);
                                      setEditHook(ver.hook || '');
                                      setEditCaption(ver.caption || '');
                                      setEditScript(ver.script || '');
                                      setEditCta(ver.cta || '');
                                      setEditKeywords(ver.selectedKeywords ? ver.selectedKeywords.join(', ') : '');
                                      setEditHashtags(ver.selectedHashtags ? ver.selectedHashtags.join(', ') : '');
                                    }}
                                    className="text-rose-400 hover:text-rose-300 font-bold text-[10px] flex items-center gap-1 hover:underline cursor-pointer"
                                  >
                                    <Edit3 className="w-3 h-3" /> Edit
                                  </button>
                                </div>
                                <p className="text-amber-200/90 whitespace-pre-wrap bg-amber-950/20 p-2.5 rounded-xl border border-amber-900/40 leading-relaxed font-mono text-[11px]">
                                  {ver.script}
                                </p>
                              </div>
                            )}

                            {/* CTA & Contact */}
                            <div className="space-y-1.5 p-3 rounded-2xl bg-emerald-950/20 border border-emerald-900/50">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-800 font-bold block text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                                  <Building2 className="w-3.5 h-3.5 text-rose-400" /> CALL TO ACTION (CTA) & OFFICIAL CONTACT
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingVersionId(ver.id);
                                    setEditHook(ver.hook || '');
                                    setEditCaption(ver.caption || '');
                                    setEditScript(ver.script || '');
                                    setEditCta(ver.cta || '');
                                    setEditKeywords(ver.selectedKeywords ? ver.selectedKeywords.join(', ') : '');
                                    setEditHashtags(ver.selectedHashtags ? ver.selectedHashtags.join(', ') : '');
                                  }}
                                  className="px-2.5 py-1 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                                >
                                  <Edit3 className="w-3 h-3" /> Edit CTA
                                </button>
                              </div>
                              <div className="text-emerald-300 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-900/60 text-xs font-semibold leading-relaxed whitespace-pre-wrap">
                                {ver.cta}
                              </div>
                            </div>

                            {/* Keywords & Hashtags */}
                            {(ver.selectedKeywords?.length > 0 || ver.selectedHashtags?.length > 0) && (
                              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200">
                                <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                                  {ver.selectedKeywords?.map((kw, idx) => (
                                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                                      {kw}
                                    </span>
                                  ))}
                                  {ver.selectedHashtags?.map((ht, idx) => (
                                    <span key={idx} className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 font-mono">
                                      {ht}
                                    </span>
                                  ))}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingVersionId(ver.id);
                                    setEditHook(ver.hook || '');
                                    setEditCaption(ver.caption || '');
                                    setEditScript(ver.script || '');
                                    setEditCta(ver.cta || '');
                                    setEditKeywords(ver.selectedKeywords ? ver.selectedKeywords.join(', ') : '');
                                    setEditHashtags(ver.selectedHashtags ? ver.selectedHashtags.join(', ') : '');
                                  }}
                                  className="text-slate-400 hover:text-white text-[10px] font-semibold underline"
                                >
                                  Edit Keywords/Hashtags
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}

                    <div className="pt-3 border-t border-slate-200 space-y-2">
                      <span className="text-[11px] text-slate-400 font-bold block">Pilih modul lanjutan untuk memproses konten ini:</span>
                      <div className="flex flex-wrap items-center gap-2">
                        {setActiveTab && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedDetailContent(null);
                                setActiveTab('content-studio');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                              title="Edit Draf Naskah & Copywriting di Content Studio"
                            >
                              <Compass className="w-3.5 h-3.5" /> Edit di Studio
                            </button>
                            <button
                              onClick={() => {
                                setSelectedDetailContent(null);
                                setActiveTab('content-storyboard');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 border border-slate-200 transition-all cursor-pointer"
                              title="Rancang Scene Breakdown Video & Audio"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Storyboard
                            </button>
                            <button
                              onClick={() => {
                                setSelectedDetailContent(null);
                                setActiveTab('content-evidence');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 border border-slate-200 transition-all cursor-pointer"
                              title="Kelola Dokumen Verifikasi Fact Sheet & Evidence Pack"
                            >
                              <FileText className="w-3.5 h-3.5 text-purple-400" /> Evidence Pack
                            </button>
                            <button
                              onClick={() => {
                                setSelectedDetailContent(null);
                                setActiveTab('gov-approvals');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 border border-slate-200 transition-all cursor-pointer"
                              title="Kirim ke Tim Legal & Brand Governance untuk Approval"
                            >
                              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Approval
                            </button>
                            <button
                              onClick={() => {
                                setSelectedDetailContent(null);
                                setActiveTab('act-publishing');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 border border-slate-200 transition-all cursor-pointer"
                              title="Jadwalkan Terbit & Buat Link UTM Tracking"
                            >
                              <Rocket className="w-3.5 h-3.5 text-emerald-400" /> Activation
                            </button>
                            <button
                              onClick={() => {
                                setSelectedDetailContent(null);
                                setActiveTab('act-distribution');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 border border-slate-200 transition-all cursor-pointer"
                              title="Atur Targeting Paid Ads & Budget Distribusi"
                            >
                              <Target className="w-3.5 h-3.5 text-pink-400" /> Paid Ads
                            </button>
                            <button
                              onClick={() => {
                                setSelectedDetailContent(null);
                                setActiveTab('intel-trends');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 border border-slate-200 transition-all cursor-pointer"
                              title="Riset Kata Kunci SEO & Tren Pasar"
                            >
                              <Search className="w-3.5 h-3.5 text-cyan-400" /> SEO & Trends
                            </button>
                            <button
                              onClick={() => {
                                setSelectedDetailContent(null);
                                setActiveTab('perf-overview');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 border border-slate-200 transition-all cursor-pointer"
                              title="Pantau Metric Analytics & Performa Campaign"
                            >
                              <Layers className="w-3.5 h-3.5 text-amber-300" /> Analytics
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Modal Buat Konten Baru */}
            {isAddContentModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
                <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl relative">
                  <button
                    onClick={() => setIsAddContentModalOpen(false)}
                    className="absolute top-5 right-5 p-2 text-slate-500 hover:text-slate-800 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="border-b border-slate-200 pb-3">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Plus className="w-5 h-5 text-rose-500" />
                      Tambah Konten Baru ke Rencana
                    </h3>
                    <p className="text-xs text-slate-400">Buat draf paket konten baru terhubung ke Campaign TELPRO 2026</p>
                  </div>

                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      if (!newContentTitle.trim()) return;

                      const newContentId = `cnt-${Date.now()}`;
                      const newVerId = `ver-${newContentId}-v1`;

                      const newContent: ContentItem = {
                        id: newContentId,
                        campaignId: newContentCampaignId,
                        title: newContentTitle,
                        objective: 'Brand Awareness & Thought Leadership',
                        audience: 'Decision Maker B2B & Executive',
                        platform: newContentPlatform,
                        format: (newContentFormat as ContentItem['format']) || 'Reels/Shorts',
                        status: 'Draft',
                        pic: newContentPic,
                        currentVersionId: newVerId
                      };

                      const newVer = {
                        id: newVerId,
                        contentId: newContentId,
                        versionNumber: 1,
                        createdAt: new Date().toISOString(),
                        createdBy: activeUser.name,
                        hook: 'Dapatkan solusi bisnis terbaik bersama TELPRO!',
                        caption: newContentCaption || 'Optimalkan operational efficiency dengan solusi terintegrasi TELPRO 2026.',
                        script: 'Scene 1: Introduction.\nScene 2: Problem statement.\nScene 3: TELPRO solution.',
                        cta: 'Call Center: 1500 473 | WA: +62811 150 4739 (chat only) | Email: info@telpro.co.id | Graha TelkomProperty, Jl. Kebon Sirih No. 10-12, Jakarta Pusat, 10110',
                        selectedAudio: 'Corporate Uplifting Beat',
                        audioRightsStatus: 'Verified Licensed'
                      };

                      addContentWithVersion(newContent, newVer);
                      setIsAddContentModalOpen(false);
                      setNewContentTitle('');
                      setNewContentCaption('');
                    }}
                    className="space-y-3 text-xs"
                  >
                    <div>
                      <label className="text-slate-700 font-semibold block mb-1">Judul Konten *</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Digital Transformation TELPRO 2026"
                        value={newContentTitle}
                        onChange={e => setNewContentTitle(e.target.value)}
                        className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-rose-500 focus:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-700 font-semibold block mb-1">Campaign</label>
                        <select
                          value={newContentCampaignId}
                          onChange={e => setNewContentCampaignId(e.target.value)}
                          className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-rose-500 focus:bg-white"
                        >
                          {campaigns.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-700 font-semibold block mb-1">Platform</label>
                        <select
                          value={newContentPlatform}
                          onChange={e => setNewContentPlatform(e.target.value)}
                          className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-rose-500 focus:bg-white"
                        >
                          <option value="Instagram">Instagram</option>
                          <option value="LinkedIn">LinkedIn</option>
                          <option value="Facebook">Facebook</option>
                          <option value="TikTok">TikTok</option>
                          <option value="YouTube">YouTube</option>
                          <option value="Article">Article / Web</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-700 font-semibold block mb-1">Format</label>
                        <select
                          value={newContentFormat}
                          onChange={e => setNewContentFormat(e.target.value)}
                          className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-rose-500 focus:bg-white"
                        >
                          <option value="Reels/Shorts">Reels / Shorts (Vertical)</option>
                          <option value="Carousel">Carousel / Slides</option>
                          <option value="Single Image">Single Post Image</option>
                          <option value="Long Video">Long Form Video</option>
                          <option value="Blog Article">Blog Article</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-700 font-semibold block mb-1">PIC (Penanggung Jawab)</label>
                        <input
                          type="text"
                          value={newContentPic}
                          onChange={e => setNewContentPic(e.target.value)}
                          className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-rose-500 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-700 font-semibold block mb-1">Draf Caption / Ringkasan</label>
                      <textarea
                        rows={3}
                        placeholder="Tuliskan draf singkat ide konten atau caption awal..."
                        value={newContentCaption}
                        onChange={e => setNewContentCaption(e.target.value)}
                        className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-rose-500 focus:bg-white"
                      />
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddContentModalOpen(false)}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-200 transition-colors"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-md"
                      >
                        Simpan ke Rencana
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Bottom Sequential Workflow Banner */}
            <div className="p-4 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/70 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl mt-6">
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                  <Compass className="w-4 h-4 text-rose-500 animate-pulse" />
                  LANGKAH WORKFLOW BERJENJANG BERIKUTNYA:
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Rencana Campaign & Content Plan (02) telah siap. Selanjutnya hubungkan rencana ini dengan Signal Trend & Opportunity Board di <strong>03. Ide & Tren</strong> sebelum masuk ke studio pembuatan naskah.
                </p>
              </div>
              {setActiveTab && (
                <button
                  type="button"
                  onClick={() => setActiveTab('intel-opportunities')}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer shrink-0"
                >
                  Lanjut ke 03. Ide & Tren (Pilih Signal / Opportunity) ➔
                </button>
              )}
            </div>
          </div>
        );
      })()}

      {/* Tab 5: Single Budget Ledger */}
      {subTab === 'budget' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Pagu Anggaran Bulanan (Ceiling)</span>
                <Coins className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-xl font-black text-slate-900 mt-2">
                Rp {monthlySetup.monthlyCeiling.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Target Periode: {monthlySetup.periodMonth}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Total Alokasi Rencana</span>
                <Target className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-xl font-black text-slate-200 mt-2">
                Rp {totalAllocatedAll.toLocaleString()}
              </div>
              <div className="text-[10px] text-rose-400 mt-1">
                {((totalAllocatedAll / (monthlySetup.monthlyCeiling || 1)) * 100).toFixed(1)}% dari Pagu Bulanan
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Realisasi Biaya (Actual Spent)</span>
                <TrendingUp className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl font-black text-amber-400 mt-2">
                Rp {totalActualAll.toLocaleString()}
              </div>
              <div className="text-[10px] text-amber-300 mt-1">
                {((totalActualAll / (totalAllocatedAll || 1)) * 100).toFixed(1)}% penyerapan biaya
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Sisa / Efisiensi Anggaran</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl font-black text-emerald-400 mt-2">
                Rp {totalVarianceAll.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-400 mt-1">
                Saldo efisiensi operasional
              </div>
            </div>
          </div>

          {/* Master Budget Table */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Coins className="w-4 h-4 text-rose-500" />
                  Single Budget Ledger ({budgets.length} Items)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Master alokasi anggaran kampanye & produksi: Monthly Ceiling → Campaign Allocation → Commitment → Actual</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddBudgetModal(true)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950/50 self-start sm:self-auto cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" /> Tambah Item Anggaran
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Aktivitas / Kegiatan</th>
                    <th className="p-3">Campaign Terkait</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3">Alokasi (Rp)</th>
                    <th className="p-3">Aktual (Rp)</th>
                    <th className="p-3">Variansi (Rp)</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {budgets.map(b => {
                    const cmp = campaigns.find(c => c.id === b.campaignId);
                    return (
                      <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-semibold text-slate-900">{b.activityName}</td>
                        <td className="p-3">
                          <span className="text-[11px] text-slate-400 font-medium">
                            {cmp ? cmp.name : b.campaignId}
                          </span>
                        </td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200">{b.category}</span></td>
                        <td className="p-3 font-bold text-slate-200">Rp {b.allocatedAmount.toLocaleString()}</td>
                        <td className="p-3 font-semibold text-amber-400">Rp {b.actualAmount.toLocaleString()}</td>
                        <td className="p-3 font-semibold text-emerald-400">Rp {b.varianceAmount.toLocaleString()}</td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-semibold">{b.status}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sequential Next Step Banner */}
          <div className="p-4 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/70 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl mt-6">
            <div className="space-y-1 text-left">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                <Compass className="w-4 h-4 text-rose-500 animate-pulse" />
                LANGKAH WORKFLOW BERJENJANG BERIKUTNYA:
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Alokasi Anggaran, Target Audience, & Rencana Campaign (02) telah selesai ditetapkan. Selanjutnya eksplorasi ide, tren pasar & AI signals di <strong>03. Ide & Tren</strong>.
              </p>
            </div>
            {setActiveTab && (
              <button
                type="button"
                onClick={() => setActiveTab('intel-radar')}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer shrink-0"
              >
                Lanjut ke 03. Ide & Tren ➔
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal: Edit Brand Profile */}
      {showEditBrandProfile && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-rose-400" />
                Edit TELPRO Brand Profile
              </h3>
              <button type="button" onClick={() => setShowEditBrandProfile(false)} className="text-slate-500 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBrandProfile} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Tone of Voice *</label>
                <textarea
                  rows={2}
                  required
                  value={editTone}
                  onChange={e => setEditTone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Preferred Terminology (Pisahkan dengan koma) *</label>
                <textarea
                  rows={2}
                  value={editPreferred}
                  onChange={e => setEditPreferred(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Prohibited Terminology & Claims (Pisahkan dengan koma) *</label>
                <textarea
                  rows={2}
                  value={editProhibited}
                  onChange={e => setEditProhibited(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Mandatory Disclaimer *</label>
                <textarea
                  rows={2}
                  value={editDisclaimer}
                  onChange={e => setEditDisclaimer(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button type="button" onClick={() => setShowEditBrandProfile(false)} className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-200">Batal</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Compliance Rules */}
      {showEditCompliance && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                Edit Brand Safety & Compliance Rules
              </h3>
              <button type="button" onClick={() => setShowEditCompliance(false)} className="text-slate-500 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCompliance} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Aturan Komparasi Kompetitor *</label>
                <textarea rows={2} value={editCompetitorRule} onChange={e => setEditCompetitorRule(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Copyright Musik & Trending Audio *</label>
                <textarea rows={2} value={editAudioRule} onChange={e => setEditAudioRule(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Klaim Berbasis Data (No Source No Fact) *</label>
                <textarea rows={2} value={editDataClaimRule} onChange={e => setEditDataClaimRule(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button type="button" onClick={() => setShowEditCompliance(false)} className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-200">Batal</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow">Simpan Rules</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Monthly Target Baseline */}
      {showEditMonthly && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Edit Monthly Setup Baseline</h3>
              <button type="button" onClick={() => setShowEditMonthly(false)} className="text-slate-500 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMonthly} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Periode Bulan *</label>
                <input type="text" value={editMonth} onChange={e => setEditMonth(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Business Objective *</label>
                <textarea rows={2} value={editBizObj} onChange={e => setEditBizObj(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Marketing Objective *</label>
                <textarea rows={2} value={editMktObj} onChange={e => setEditMktObj(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Communication Objective *</label>
                <textarea rows={2} value={editCommObj} onChange={e => setEditCommObj(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Pagu Anggaran Bulanan (Rp) *</label>
                <input type="number" value={editCeiling} onChange={e => setEditCeiling(Number(e.target.value))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Primary KPI Tracker *</label>
                <input type="text" value={editKpi} onChange={e => setEditKpi(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button type="button" onClick={() => setShowEditMonthly(false)} className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-200">Batal</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow">Simpan Baseline</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create or Edit Campaign */}
      {showNewCampaignModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-xl p-6 shadow-2xl animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingCampaign ? `Edit Campaign: ${editingCampaign.name}` : 'Buat Campaign Baru TELPRO 2026'}
              </h3>
              <button type="button" onClick={() => setShowShowNewCampaignModal(false)} className="text-slate-500 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCampaignSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Nama Campaign *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: TELPRO Cloud Edge Connectivity 2026"
                  value={campaignForm.name}
                  onChange={e => setCampaignForm({ ...campaignForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Produk Utama Prioritas *</label>
                  <input
                    type="text"
                    required
                    value={campaignForm.product}
                    onChange={e => setCampaignForm({ ...campaignForm, product: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Status Campaign *</label>
                  <select
                    value={campaignForm.status}
                    onChange={e => setCampaignForm({ ...campaignForm, status: e.target.value as Campaign['status'] })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="Planned">Planned</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Business Objective *</label>
                <textarea
                  rows={2}
                  value={campaignForm.businessObj}
                  onChange={e => setCampaignForm({ ...campaignForm, businessObj: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Target Audience *</label>
                <input
                  type="text"
                  value={campaignForm.audience}
                  onChange={e => setCampaignForm({ ...campaignForm, audience: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Tanggal Mulai</label>
                  <input
                    type="date"
                    value={campaignForm.start}
                    onChange={e => setCampaignForm({ ...campaignForm, start: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Tanggal Selesai</label>
                  <input
                    type="date"
                    value={campaignForm.end}
                    onChange={e => setCampaignForm({ ...campaignForm, end: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Alokasi Anggaran (Rp) *</label>
                <input
                  type="number"
                  value={campaignForm.budget}
                  onChange={e => setCampaignForm({ ...campaignForm, budget: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowShowNewCampaignModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-900/30"
                >
                  {editingCampaign ? 'Simpan Perubahan' : 'Simpan Campaign Baru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Budget */}
      {showAddBudgetModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-md p-6 shadow-2xl space-y-4 text-xs animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Coins className="w-4 h-4 text-rose-500" />
                Tambah Item Master Budget Ledger
              </h3>
              <button type="button" onClick={() => setShowAddBudgetModal(false)} className="text-slate-500 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBudget} className="space-y-3">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Nama Aktivitas / Kegiatan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Production Shoot Video Reels TELPRO..."
                  value={budgetActivity}
                  onChange={e => setBudgetActivity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Hubungkan ke Campaign *</label>
                <select
                  value={budgetCampaignId}
                  onChange={e => setBudgetCampaignId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {campaigns.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.priorityProduct})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Kategori Biaya *</label>
                <select
                  value={budgetCategory}
                  onChange={e => setBudgetCategory(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="Paid Ads">Paid Ads (Meta, LinkedIn, Google)</option>
                  <option value="Production">Production & Content Creation</option>
                  <option value="Talent">Talent & Key Opinion Leader (KOL)</option>
                  <option value="Event">Event & Offline Activation</option>
                  <option value="Vendor">Vendor & Infrastructure Tooling</option>
                  <option value="Creative">Creative Assets & Design</option>
                  <option value="Other">Other Operational</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Alokasi Anggaran (Rp) *</label>
                <input
                  type="number"
                  required
                  value={budgetAllocated}
                  onChange={e => setBudgetAllocated(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddBudgetModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-950/60"
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
