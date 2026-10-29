import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Trend, EventItem, Opportunity, Evidence, AudioRightsStatus } from '../../types';
import { NavTab } from '../Sidebar';
import { RbacBanner } from '../Common/RbacBanner';
import { WorkflowPipelineBar } from '../Common/WorkflowPipelineBar';
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
  RotateCcw,
  Hash,
  Search,
  Copy,
  Check,
  Filter,
  ShieldAlert,
  Tag,
  BarChart2,
  Layers,
  ArrowRight,
  Flame,
  LayoutGrid,
  Play,
  Pause,
  Volume2,
  Trophy,
  ListOrdered,
  BarChart3,
  Globe,
  Activity
} from 'lucide-react';

export interface TrendingKeywordItem {
  id: string;
  term: string;
  type: 'Hashtag' | 'Keyword' | 'Long-Tail Query';
  platform: 'All Platforms' | 'Instagram' | 'LinkedIn' | 'TikTok' | 'Google Search' | 'X (Twitter)';
  category: 'Smart Logistics' | 'Enterprise Connectivity' | 'B2B Digital Solution' | 'General Tech / Viral';
  rec: 'USE' | 'TEST' | 'AVOID';
  relevance: number;
  brandSafety: number;
  searchVolume: string;
  growth: string;
  intent: 'High Commercial' | 'Educational / Informational' | 'Brand Authority' | 'Spam / Negative';
  rationale: string;
  suggestedCampaign: string;
}

const INITIAL_KEYWORD_ITEMS: TrendingKeywordItem[] = [
  {
    id: 'tag-01',
    term: '#SmartLogisticsID',
    type: 'Hashtag',
    platform: 'Instagram',
    category: 'Smart Logistics',
    rec: 'USE',
    relevance: 96,
    brandSafety: 98,
    searchVolume: '48.2K posts / bln',
    growth: '+38% m-o-m',
    intent: 'High Commercial',
    rationale: 'Sangat selaras dengan produk TELPRO Smart Warehouse & IoT Fleet. Relevansi target C-Level logistik 96%.',
    suggestedCampaign: 'TELPRO Smart Warehouse Solution'
  },
  {
    id: 'tag-02',
    term: 'Konektivitas Dedicated SLA 99.9%',
    type: 'Keyword',
    platform: 'Google Search',
    category: 'Enterprise Connectivity',
    rec: 'USE',
    relevance: 94,
    brandSafety: 100,
    searchVolume: '14.5K search / bln',
    growth: '+22% m-o-m',
    intent: 'High Commercial',
    rationale: 'High buying-intent keyword untuk segmen Corporate IT & Enterprise Data Center. Konversi pencarian tinggi.',
    suggestedCampaign: 'TELPRO Enterprise Dedicated Internet'
  },
  {
    id: 'tag-03',
    term: '#SupplyChainIndonesia',
    type: 'Hashtag',
    platform: 'LinkedIn',
    category: 'Smart Logistics',
    rec: 'USE',
    relevance: 91,
    brandSafety: 95,
    searchVolume: '32.1K impressions / bln',
    growth: '+18% m-o-m',
    intent: 'Brand Authority',
    rationale: 'Hashtag industri utama di LinkedIn untuk thought leadership logistik dan efisiensi distribusi manufaktur.',
    suggestedCampaign: 'TELPRO Supply Chain Network'
  },
  {
    id: 'tag-04',
    term: 'Vendor Internet Kantor Stabil Jakarta',
    type: 'Long-Tail Query',
    platform: 'Google Search',
    category: 'Enterprise Connectivity',
    rec: 'USE',
    relevance: 89,
    brandSafety: 96,
    searchVolume: '8.9K search / bln',
    growth: '+45% m-o-m',
    intent: 'High Commercial',
    rationale: 'Query transaksional pencarian vendor fiber optik kantor dengan rasio klik ke kontak lead mencapai 14%.',
    suggestedCampaign: 'TELPRO Enterprise Dedicated Internet'
  },
  {
    id: 'tag-05',
    term: '#SolusiBisnisDigital',
    type: 'Hashtag',
    platform: 'Instagram',
    category: 'B2B Digital Solution',
    rec: 'TEST',
    relevance: 78,
    brandSafety: 85,
    searchVolume: '110K posts / bln',
    growth: '+12% m-o-m',
    intent: 'Educational / Informational',
    rationale: 'Saturasi sedang. Efektif bila dipadukan dengan studi kasus nyata efisiensi biaya operasional UMKM & Middle Corporate.',
    suggestedCampaign: 'TELPRO Digital EcoSystem'
  },
  {
    id: 'tag-06',
    term: 'Efisiensi Biaya Logistik Pergudangan Otomatis',
    type: 'Long-Tail Query',
    platform: 'LinkedIn',
    category: 'Smart Logistics',
    rec: 'USE',
    relevance: 93,
    brandSafety: 99,
    searchVolume: '6.2K search / bln',
    growth: '+60% m-o-m',
    intent: 'Educational / Informational',
    rationale: 'Topik hangat menyusul kenaikan biaya operasional armada, sangat cocok untuk format Carousel Infografis & Whitepaper.',
    suggestedCampaign: 'TELPRO Smart Warehouse Solution'
  },
  {
    id: 'tag-07',
    term: '#TransformasiDigitalB2B',
    type: 'Hashtag',
    platform: 'LinkedIn',
    category: 'B2B Digital Solution',
    rec: 'USE',
    relevance: 88,
    brandSafety: 94,
    searchVolume: '19.4K posts / bln',
    growth: '+15% m-o-m',
    intent: 'Brand Authority',
    rationale: 'Hashtag resmi komunitas manajer IT & direktur transformasi digital korporasi B2B.',
    suggestedCampaign: 'TELPRO Digital EcoSystem'
  },
  {
    id: 'tag-08',
    term: '#TrendAIIndonesia2026',
    type: 'Hashtag',
    platform: 'TikTok',
    category: 'General Tech / Viral',
    rec: 'TEST',
    relevance: 72,
    brandSafety: 80,
    searchVolume: '350K views / bln',
    growth: '+120% m-o-m',
    intent: 'Educational / Informational',
    rationale: 'Viralitas tinggi namun audiens sangat luas. Perlu hook edukatif spesifik agar tidak terkesan gimik murahan.',
    suggestedCampaign: 'TELPRO Digital EcoSystem'
  },
  {
    id: 'tag-09',
    term: '#ViralIndonesia2026',
    type: 'Hashtag',
    platform: 'All Platforms',
    category: 'General Tech / Viral',
    rec: 'AVOID',
    relevance: 12,
    brandSafety: 20,
    searchVolume: '2.5M posts',
    growth: '-5% m-o-m',
    intent: 'Spam / Negative',
    rationale: '🚫 DILARANG BRAND GUARDRAIL: Saturasi spam sangat tinggi, merusak citra profesional B2B, risiko asosiasi konten negatif.',
    suggestedCampaign: 'None (Blacklisted)'
  },
  {
    id: 'tag-10',
    term: 'Internet Murahan Tanpa Kuota',
    type: 'Keyword',
    platform: 'Google Search',
    category: 'General Tech / Viral',
    rec: 'AVOID',
    relevance: 8,
    brandSafety: 15,
    searchVolume: '95K search / bln',
    growth: '+5% m-o-m',
    intent: 'Spam / Negative',
    rationale: '🚫 DILARANG BRAND VOICE: Bertentangan dengan positioning TELPRO sebagai penyedia infrastruktur terdedikasi kualitas premium (SLA 99.9%).',
    suggestedCampaign: 'None (Blacklisted)'
  }
];

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

  let intelTab: 'dashboard' | 'topics' | 'audio' | 'hashtags' | 'events' | 'opportunities' | 'evidence' = 'dashboard';
  if (activeTab === 'intel-dashboard') intelTab = 'dashboard';
  else if (activeTab === 'intel-topics' || activeTab === 'intel-radar') intelTab = 'topics';
  else if (activeTab === 'intel-audio') intelTab = 'audio';
  else if (activeTab === 'intel-hashtags') intelTab = 'hashtags';
  else if (activeTab === 'intel-events') intelTab = 'events';
  else if (activeTab === 'intel-opportunities') intelTab = 'opportunities';
  else if (activeTab === 'intel-evidence') intelTab = 'evidence';

  // Trending Topic Radar State
  const [topicViewMode, setTopicViewMode] = useState<'chart' | 'katalog'>('chart');
  const [topicPlatformFilter, setTopicPlatformFilter] = useState<string>('Semua Platform');
  const [topicSectorFilter, setTopicSectorFilter] = useState<string>('all');
  const [topicSearchQuery, setTopicSearchQuery] = useState<string>('');

  // Audio Player State
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [audioRightsFilter, setAudioRightsFilter] = useState<string>('all');
  const [audioPlatformFilter, setAudioPlatformFilter] = useState<string>('all');

  // Convert Trend to Opportunity Modal state
  const [selectedTrendForOpp, setSelectedTrendForOpp] = useState<Trend | null>(null);
  const [oppAngle, setOppAngle] = useState('');

  // Hashtag & Keyword Trending State
  const [keywords, setKeywords] = useState<TrendingKeywordItem[]>(() => {
    const saved = localStorage.getItem('telpro_trending_keywords');
    return saved ? JSON.parse(saved) : INITIAL_KEYWORD_ITEMS;
  });

  const [tagTypeFilter, setTagTypeFilter] = useState<string>('all');
  const [tagPlatformFilter, setTagPlatformFilter] = useState<string>('all');
  const [tagRecFilter, setTagRecFilter] = useState<string>('all');
  const [tagSearchQuery, setTagSearchQuery] = useState<string>('');
  const [copiedTermId, setCopiedTermId] = useState<string | null>(null);

  // Add Keyword Modal State
  const [showAddKeywordModal, setShowAddKeywordModal] = useState(false);
  const [newTerm, setNewTerm] = useState('');
  const [newType, setNewType] = useState<TrendingKeywordItem['type']>('Hashtag');
  const [newPlatform, setNewPlatform] = useState<TrendingKeywordItem['platform']>('All Platforms');
  const [newCategory, setNewCategory] = useState<TrendingKeywordItem['category']>('Smart Logistics');
  const [newRec, setNewRec] = useState<TrendingKeywordItem['rec']>('USE');
  const [newRelevance, setNewRelevance] = useState(90);
  const [newVolume, setNewVolume] = useState('25K search / bln');
  const [newRationale, setNewRationale] = useState('');

  // Convert Hashtag/Keyword to Opportunity
  const [selectedTagForOpp, setSelectedTagForOpp] = useState<TrendingKeywordItem | null>(null);
  const [tagOppAngle, setTagOppAngle] = useState('');

  const handleCopyTerm = (id: string, term: string) => {
    navigator.clipboard?.writeText(term);
    setCopiedTermId(id);
    setTimeout(() => {
      setCopiedTermId(null);
    }, 2000);
  };

  const handleSaveKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTerm) return;

    const newItem: TrendingKeywordItem = {
      id: `tag-${Date.now().toString().slice(-4)}`,
      term: newTerm.startsWith('#') || newType !== 'Hashtag' ? newTerm : `#${newTerm}`,
      type: newType,
      platform: newPlatform,
      category: newCategory,
      rec: newRec,
      relevance: Number(newRelevance) || 85,
      brandSafety: newRec === 'AVOID' ? 20 : 95,
      searchVolume: newVolume || '15K search / bln',
      growth: '+25% m-o-m',
      intent: newRec === 'USE' ? 'High Commercial' : newRec === 'TEST' ? 'Educational / Informational' : 'Spam / Negative',
      rationale: newRationale || 'Dianalisis secara manual oleh Tim Strategi & Marcom TELPRO.',
      suggestedCampaign: selectedCampaign?.name || 'TELPRO Smart Warehouse Solution'
    };

    const updated = [newItem, ...keywords];
    setKeywords(updated);
    localStorage.setItem('telpro_trending_keywords', JSON.stringify(updated));
    setShowAddKeywordModal(false);
    setNewTerm('');
    setNewRationale('');
  };

  const handleCreateOppFromTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTagForOpp) return;

    const newOpp: Opportunity = {
      id: `opp-${Date.now().toString().slice(-4)}`,
      campaignId: selectedCampaign?.id || 'cmp-2026-01',
      title: `Opportunity: ${selectedTagForOpp.term}`,
      sourceType: 'Trend',
      sourceTitle: selectedTagForOpp.term,
      businessAngle: tagOppAngle || selectedTagForOpp.rationale,
      audience: selectedCampaign?.audience || 'Decision Maker B2B & Supply Chain IT',
      relevanceScore: selectedTagForOpp.relevanceScore,
      momentumScore: 90,
      overallScore: Math.round((selectedTagForOpp.relevanceScore + 90) / 2),
      action: 'Produce Now',
      status: 'In Content Development',
      publishingWindow: '48 Jam ke depan (Peak Discovery)',
      recommendedFormat: selectedTagForOpp.platform === 'TikTok' || selectedTagForOpp.platform === 'Instagram' ? 'Reels/Shorts' : 'Carousel'
    };

    createOpportunity(newOpp);
    setSelectedTagForOpp(null);
    setTagOppAngle('');
    if (setActiveTab) setActiveTab('intel-opportunities');
  };

  // Filtered keywords list
  const filteredKeywords = keywords.filter(item => {
    if (tagTypeFilter !== 'all' && item.type !== tagTypeFilter) return false;
    if (tagPlatformFilter !== 'all' && item.platform !== tagPlatformFilter && item.platform !== 'All Platforms') return false;
    if (tagRecFilter !== 'all' && item.rec !== tagRecFilter) return false;
    if (tagSearchQuery.trim()) {
      const q = tagSearchQuery.toLowerCase();
      return (
        item.term.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.rationale.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const countUse = keywords.filter(k => k.rec === 'USE').length;
  const countTest = keywords.filter(k => k.rec === 'TEST').length;
  const countAvoid = keywords.filter(k => k.rec === 'AVOID').length;

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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-400" />
              03. Intelligence Layer (Ide, Trend, & Evidence Engine)
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Identifikasi signal pasar, trending hashtag, audio rights, event revalidation, & evidence pack terverifikasi</p>
          </div>
        </div>
        <RbacBanner moduleName="Intelligence Layer" requiredAction="canAddTrend" requiredRole="ROLE_STRATEGY_LEAD / ROLE_MARCOM_CREATOR / ROLE_FACT_CHECKER / ROLE_SYSTEM_ADMIN" />

        {/* Universal Sequential Workflow Bar */}
        <WorkflowPipelineBar currentStage="02" setActiveTab={setActiveTab} titleSuffix="Riset Signal, Radar Trend, & Opportunity (Langkah ke-2)" />
      </div>

      {/* Tab 0: Intelligence Dashboard */}
      {intelTab === 'dashboard' && (
        <div className="space-y-6 animate-in fade-in">
          {/* KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() => setActiveTab && setActiveTab('intel-topics')}
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-cyan-500/50 transition-all cursor-pointer shadow-sm group"
            >
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Trending Topic & Signals</span>
                <Radio className="w-4 h-4 text-cyan-400 group-hover:animate-pulse" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2 flex items-baseline gap-2">
                {trends.filter(t => t.type !== 'Audio').length}{' '}
                <span className="text-xs font-normal text-emerald-400 font-bold">+3 signal baru</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Radar real-time Google & B2B Feeds</div>
            </div>

            <div
              onClick={() => setActiveTab && setActiveTab('intel-audio')}
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-purple-500/50 transition-all cursor-pointer shadow-sm group"
            >
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Trending Audio (Cleared)</span>
                <Music className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-2xl font-black text-purple-700 mt-2 flex items-baseline gap-2">
                {trends.filter(t => t.type === 'Audio' && t.audioRightsStatus === 'Verified for Intended Use').length}{' '}
                <span className="text-xs font-normal text-slate-400">Audio Safe</span>
              </div>
              <div className="text-[10px] text-emerald-400 mt-1">100% Bebas Copyright Strike (Commercial License)</div>
            </div>

            <div
              onClick={() => setActiveTab && setActiveTab('intel-hashtags')}
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-cyan-500/50 transition-all cursor-pointer shadow-sm group"
            >
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Keyword & Hashtag</span>
                <Search className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-2xl font-black text-cyan-700 mt-2 flex items-baseline gap-2">
                {keywords.length}{' '}
                <span className="text-xs font-normal text-slate-400">Term Terpantau</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">SEO Target & High Commercial Intent</div>
            </div>

            <div
              onClick={() => setActiveTab && setActiveTab('intel-events')}
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-500/50 transition-all cursor-pointer shadow-sm group"
            >
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Event Calendar</span>
                <Calendar className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-2xl font-black text-amber-700 mt-2 flex items-baseline gap-2">
                {events.length}{' '}
                <span className="text-xs font-normal text-slate-400">Agenda B2B</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Automated H-30/H-7 Revalidation</div>
            </div>
          </div>

          {/* 4 Feature Cards (Direct Navigation matching menu) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Feature 1: Trending Topic */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-cyan-500/40 transition-all shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-800">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Trending Topic</h3>
                    <p className="text-xs text-slate-400">Signal tren B2B, logistik, & infrastruktur digital</p>
                  </div>
                </div>
                {setActiveTab && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('intel-topics')}
                    className="text-xs font-bold text-cyan-700 hover:text-cyan-800 flex items-center gap-1 bg-cyan-50 px-3 py-1.5 rounded-xl border border-cyan-200 hover:bg-cyan-100 transition-colors"
                  >
                    Buka Topic <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="text-[11px] text-slate-700 font-bold">Top Rising Signals Saat Ini:</div>
                {trends.filter(t => t.type !== 'Audio').slice(0, 2).map(tr => (
                  <div key={tr.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0">
                    <span className="text-slate-900 font-semibold truncate max-w-[220px]">{tr.title}</span>
                    <span className="text-emerald-400 font-mono font-bold text-[11px]">{tr.confidence}% conf</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature 2: Trending Audio */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-purple-500/40 transition-all shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-2xl bg-purple-50 border border-purple-200 text-purple-800">
                    <Music className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Trending Audio</h3>
                    <p className="text-xs text-slate-400">Commercial rights guardrail & audio TikTok/Reels</p>
                  </div>
                </div>
                {setActiveTab && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('intel-audio')}
                    className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200 hover:bg-purple-100 transition-colors"
                  >
                    Buka Audio <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="text-[11px] text-slate-700 font-bold">Audio Terverifikasi Aman Komersial:</div>
                {trends.filter(t => t.type === 'Audio').slice(0, 2).map(au => (
                  <div key={au.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0">
                    <span className="text-slate-900 font-semibold truncate max-w-[220px]">{au.title}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      au.audioRightsStatus === 'Verified for Intended Use' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {au.audioRightsStatus === 'Verified for Intended Use' ? '✓ Verified' : '⚠️ Restricted'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature 3: Keyword & Hashtag */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-cyan-500/40 transition-all shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-800">
                    <Search className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Keyword & Hashtag</h3>
                    <p className="text-xs text-slate-400">Analisis SEO volume tinggi & rekomendasi USE/TEST</p>
                  </div>
                </div>
                {setActiveTab && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('intel-hashtags')}
                    className="text-xs font-bold text-cyan-700 hover:text-cyan-800 flex items-center gap-1 bg-cyan-50 px-3 py-1.5 rounded-xl border border-cyan-200 hover:bg-cyan-100 transition-colors"
                  >
                    Buka Keyword <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="text-[11px] text-slate-700 font-bold">Rekomendasi Tagar Utama:</div>
                <div className="flex flex-wrap gap-1.5">
                  {keywords.filter(k => k.rec === 'USE').slice(0, 4).map(k => (
                    <span key={k.id} className="px-2 py-1 rounded-lg bg-white border border-slate-200 shadow-sm text-slate-800 font-bold text-[11px] font-mono">
                      {k.term}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Feature 4: Event Calendar */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-amber-500/40 transition-all shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Event Calendar</h3>
                    <p className="text-xs text-slate-400">Agenda expo, summit industri, & countdown</p>
                  </div>
                </div>
                {setActiveTab && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('intel-events')}
                    className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 hover:bg-amber-100 transition-colors"
                  >
                    Buka Calendar <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="text-[11px] text-slate-700 font-bold">Agenda B2B Terdekat:</div>
                {events.slice(0, 2).map(ev => (
                  <div key={ev.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0">
                    <span className="text-slate-900 font-semibold truncate max-w-[200px]">{ev.name}</span>
                    <span className="text-slate-400 text-[10px]">{ev.dateStart}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: Trending Topic (Live Signal Radar & Countdown Charts) */}
      {intelTab === 'topics' && (() => {
        const topicTrends = trends.filter(t => t.type !== 'Audio');

        const filteredTopics = topicTrends.filter(t => {
          if (topicSectorFilter !== 'all' && t.sector && t.sector !== topicSectorFilter) {
            return false;
          }
          if (topicPlatformFilter !== 'Semua Platform') {
            const plat = t.platform.toLowerCase();
            const target = topicPlatformFilter.toLowerCase();
            if (
              !plat.includes(target) &&
              !(target.includes('google') && plat.includes('google')) &&
              !(target.includes('tiktok') && plat.includes('tiktok')) &&
              !(target.includes('instagram') && plat.includes('instagram')) &&
              !(target.includes('linkedin') && plat.includes('linkedin')) &&
              !(target.includes('twitter') && (plat.includes('x') || plat.includes('twitter')))
            ) {
              return false;
            }
          }
          if (topicSearchQuery.trim()) {
            const q = topicSearchQuery.toLowerCase();
            return (
              t.title.toLowerCase().includes(q) ||
              t.source.toLowerCase().includes(q) ||
              (t.sector && t.sector.toLowerCase().includes(q)) ||
              (t.categoryLabel && t.categoryLabel.toLowerCase().includes(q))
            );
          }
          return true;
        });

        // Sorted by rank
        const displayRankTrends = filteredTopics.length > 0 ? filteredTopics : topicTrends;
        const firstColTrends = displayRankTrends.slice(0, 5);
        const secondColTrends = displayRankTrends.slice(5, 10);

        const renderChartCard = (trendItem: Trend, index: number, colOffset: number) => {
          const displayRank = trendItem.rank || (colOffset + index + 1);
          const isRank1 = displayRank === 1;

          return (
            <div
              key={trendItem.id}
              className={`p-4 rounded-2xl transition-all shadow-xl flex flex-col sm:flex-row gap-4 relative overflow-hidden group ${
                isRank1
                  ? 'bg-amber-50/50 border-2 border-amber-400 shadow-sm hover:shadow-md'
                  : 'bg-white border border-slate-200 hover:border-amber-300 shadow-sm'
              }`}
            >
              {/* Thumbnail / Image Preview */}
              <div className="relative w-full sm:w-36 h-32 sm:h-auto min-h-[110px] rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
                <img
                  src={trendItem.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'}
                  alt={trendItem.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Position Badge overlay */}
                {isRank1 ? (
                  <span className="absolute top-2 left-2 px-2.5 py-1 rounded-md bg-amber-400 text-slate-950 font-black text-xs shadow-lg flex items-center gap-1 tracking-tight">
                    👑 POSISI #1
                  </span>
                ) : (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/90 border border-slate-300 text-slate-800 font-black text-[11px] shadow-md tracking-tight">
                    POSISI #{displayRank}
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="flex-1 flex flex-col justify-between space-y-2.5 min-w-0">
                {/* Top Badges Row */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 font-extrabold text-[10px] uppercase tracking-wider">
                    {trendItem.categoryLabel || trendItem.sector || 'TRENDING SECTOR'}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      trendItem.momentum === 'Peak'
                        ? 'bg-indigo-100 text-indigo-900 border-indigo-300'
                        : trendItem.momentum === 'Rising'
                        ? 'bg-blue-100 text-blue-900 border-blue-300'
                        : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    }`}
                  >
                    {trendItem.momentum || 'Rising'}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 ml-auto">
                    <CheckCircle2 className="w-3 h-3" /> {trendItem.verificationStatus}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-black text-slate-900 group-hover:text-amber-600 transition-colors uppercase leading-snug line-clamp-2">
                  {trendItem.title}
                </h3>

                {/* Growth & Platform Metrics */}
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
                  <span className="text-emerald-700 font-mono font-black">
                    {trendItem.growthRate || '+240% Spike'}
                  </span>
                  <span>•</span>
                  <span className="text-slate-800 font-bold">
                    {trendItem.volumeMetric || '1.5M Mentions'}
                  </span>
                  <span>•</span>
                  <span className="text-slate-700 truncate max-w-[170px]">
                    Platform: <strong className="text-slate-900 font-bold">{trendItem.platform}</strong>
                  </span>
                </div>

                {/* Bottom Strip & CTA */}
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-[10px] text-slate-700">
                    <span>
                      Confidence: <strong className="text-emerald-700 font-bold">{trendItem.confidence}%</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Relevance: <strong className="text-indigo-700 font-bold">{trendItem.relevanceScore}%</strong>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedTrendForOpp(trendItem)}
                    className="text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 flex items-center gap-1 px-3.5 py-1.5 rounded-xl transition-all hover:scale-105 cursor-pointer shrink-0 shadow-sm"
                  >
                    Konversi ke Opportunity <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        };

        return (
          <div className="space-y-6 animate-in fade-in">
            {/* 1. Header Card: TRENDING TOPIC RADAR */}
            <div className="p-5 md:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left Title & Live Scraper Badge */}
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-100 border border-amber-300 text-[10px] font-mono tracking-wider font-extrabold text-amber-900">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" />
                    DIGITAL TREND SCRAPER ACTIVE
                  </div>
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-amber-400/20 font-black">
                      <Radio className="w-6 h-6" />
                    </div>
                    <div>
                      <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase">
                        TRENDING TOPIC RADAR
                      </h1>
                    </div>
                  </div>
                </div>

                {/* Right View Switchers */}
                <div className="flex items-center gap-2 self-start md:self-center">
                  <button
                    type="button"
                    onClick={() => setTopicViewMode('chart')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      topicViewMode === 'chart'
                        ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/25'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <ListOrdered className="w-4 h-4" />
                    Chart Board (Top 1-10)
                  </button>

                  <button
                    type="button"
                    onClick={() => setTopicViewMode('katalog')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      topicViewMode === 'katalog'
                        ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/25'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                    Katalog & Filter ({topicTrends.length})
                  </button>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center">
                    <Layers className="w-4 h-4 text-amber-400" />
                  </div>
                </div>
              </div>

              {/* Subtitle / Scraper Description */}
              <div className="pt-3 border-t border-slate-200">
                <p className="text-xs md:text-sm text-slate-600 font-medium leading-relaxed">
                  Mendeteksi tren digital terverifikasi dari 12+ sektor industri. Mengukur momentum pertumbuhan, penilaian relevansi bisnis, serta safety gate risiko otomatis.
                </p>
              </div>
            </div>

            {/* 2. Main Countdown Section (When View Mode is 'chart') */}
            {topicViewMode === 'chart' && (
              <div className="p-5 md:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
                {/* Top Sub-Bar */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-800 tracking-wider">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" />
                    AS OF AUGUST 18
                  </div>
                  <div className="px-3.5 py-1 rounded-full bg-slate-900 text-white font-black text-xs uppercase tracking-wider shadow">
                    TOP 10 TRENDS
                  </div>
                </div>

                {/* Main Headline & Platform Filter Bar */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  {/* Headline */}
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-amber-400/20 font-black mt-1">
                      <Flame className="w-8 h-8 fill-current" />
                    </div>
                    <div>
                      <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none">
                        COUNTDOWN
                      </h1>
                      <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none mt-1">
                        CHARTS
                      </h1>
                      <h2 className="text-xl md:text-2xl font-black text-amber-600 tracking-tight leading-tight mt-1">
                        {topicSectorFilter === 'all'
                          ? 'GLOBAL TRENDING TOPICS'
                          : `${topicSectorFilter.toUpperCase()} TRENDING TOPICS`}
                      </h2>
                    </div>
                  </div>

                  {/* Platform selector */}
                  <div className="flex flex-wrap items-center gap-1.5 self-start lg:self-center">
                    <span className="text-xs font-bold text-slate-700 mr-1.5">Platform:</span>
                    {['Semua Platform', 'Google Search', 'TikTok', 'Instagram', 'LinkedIn', 'X (Twitter)'].map(plat => (
                      <button
                        key={plat}
                        type="button"
                        onClick={() => setTopicPlatformFilter(plat)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          topicPlatformFilter === plat
                            ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {plat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sektor Industri Horizontal Slider / Pills */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <Layers className="w-4 h-4 text-amber-600" />
                    <span>Pilih Sektor Industri Chart Top 10:</span>
                  </div>

                  <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    <div className="flex items-center gap-2 min-w-max">
                      {[
                        { id: 'all', label: '🏆 Semua Sektor (Global)' },
                        { id: 'Pariwisata, Travel & Hospitality', label: 'Pariwisata, Travel & Hospitality' },
                        { id: 'Teknologi & AI', label: 'Teknologi & AI' },
                        { id: 'Properti & Logistik', label: 'Properti & Logistik' },
                        { id: 'Kuliner & F&B', label: 'Kuliner & F&B' },
                        { id: 'Fashion & Lifestyle', label: 'Fashion & Lifestyle' },
                        { id: 'Kesehatan & Wellness', label: 'Kesehatan & Wellness' },
                        { id: 'Otomotif & Transportasi', label: 'Otomotif & Transportasi' },
                        { id: 'Fintech & Bisnis', label: 'Fintech & Bisnis' }
                      ].map(sec => (
                        <button
                          key={sec.id}
                          type="button"
                          onClick={() => setTopicSectorFilter(sec.id)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                            topicSectorFilter === sec.id
                              ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {sec.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Horizontal Bar Slider Graphic */}
                  <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full w-1/4" />
                  </div>
                </div>

                {/* Dual Column Layout: #1 - #5 and #6 - #10 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                  {/* Column 1: Posisi #1 - #5 */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-black text-amber-700 tracking-wider uppercase border-b border-slate-200 pb-2">
                      <Trophy className="w-4 h-4 text-amber-600" />
                      POSISI #1 SAMPAI #5
                    </div>

                    <div className="space-y-3.5">
                      {firstColTrends.map((item, idx) => renderChartCard(item, idx, 0))}
                    </div>
                  </div>

                  {/* Column 2: Posisi #6 - #10 */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-black text-slate-800 tracking-wider uppercase border-b border-slate-200 pb-2">
                      <ListOrdered className="w-4 h-4 text-slate-600" />
                      POSISI #6 SAMPAI #10
                    </div>

                    <div className="space-y-3.5">
                      {secondColTrends.map((item, idx) => renderChartCard(item, idx, 5))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Katalog & Filter View (When View Mode is 'katalog') */}
            {topicViewMode === 'katalog' && (
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
                {/* Search & Filter Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari topik, sektor, atau sumber data..."
                      value={topicSearchQuery}
                      onChange={e => setTopicSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:bg-white"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={topicSectorFilter}
                      onChange={e => setTopicSectorFilter(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:bg-white"
                    >
                      <option value="all">Semua Sektor Industri</option>
                      <option value="Kuliner & F&B">Kuliner & F&B</option>
                      <option value="Teknologi & AI">Teknologi & AI</option>
                      <option value="Properti & Logistik">Properti & Logistik</option>
                      <option value="Pariwisata, Travel & Hospitality">Pariwisata & Travel</option>
                      <option value="Fashion & Lifestyle">Fashion & Lifestyle</option>
                      <option value="Otomotif & Transportasi">Otomotif</option>
                      <option value="Fintech & Bisnis">Fintech & Bisnis</option>
                    </select>

                    <select
                      value={topicPlatformFilter}
                      onChange={e => setTopicPlatformFilter(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:bg-white"
                    >
                      <option value="Semua Platform">Semua Platform</option>
                      <option value="Google Search">Google Search</option>
                      <option value="TikTok">TikTok</option>
                      <option value="Instagram">Instagram</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="X (Twitter)">X (Twitter)</option>
                    </select>
                  </div>
                </div>

                {/* Catalog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTopics.map((trd, i) => (
                    <div
                      key={trd.id}
                      className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-amber-400 transition-all space-y-3 shadow-sm flex flex-col justify-between"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 font-extrabold border border-amber-300">
                            {trd.categoryLabel || trd.sector || trd.type}
                          </span>
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> {trd.verificationStatus}
                          </span>
                        </div>

                        <h3 className="text-xs font-black text-slate-900 line-clamp-2 uppercase">
                          {trd.title}
                        </h3>

                        <div className="p-3 rounded-2xl bg-slate-50 text-[11px] space-y-1.5 border border-slate-200">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Platform:</span>
                            <span className="text-slate-900 font-semibold">{trd.platform}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Source:</span>
                            <span className="text-slate-900 font-semibold truncate max-w-[180px]">{trd.source}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Confidence:</span>
                            <span className="text-emerald-400 font-bold">{trd.confidence}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Business Fit:</span>
                            <span className="text-indigo-400 font-bold">{trd.relevanceScore}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Momentum:</span>
                            <span className="text-amber-700 font-bold">{trd.growthRate || trd.momentum}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          trd.riskLevel === 'Low' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}>
                          Risk: {trd.riskLevel}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedTrendForOpp(trd)}
                          className="text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 flex items-center gap-1 px-3.5 py-1.5 rounded-xl transition-all hover:scale-105 cursor-pointer shadow-sm"
                        >
                          Konversi ke Opportunity <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* Tab 2: Trending Hashtags & SEO Keywords */}
      {intelTab === 'hashtags' && (
        <div className="space-y-6 animate-in fade-in">
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Total Term Terpantau</span>
                <Hash className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">
                {keywords.length} <span className="text-xs font-normal text-slate-400">Hashtag & Keyword</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Multi-platform radar & SEO search</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Rekomendasi Utama (USE)</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-400 mt-2">
                {countUse} <span className="text-xs font-normal text-slate-400">Term Aman & Relevan</span>
              </div>
              <div className="text-[10px] text-emerald-500 mt-1">Brand fit & high buying-intent</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Uji Coba Terkontrol (TEST)</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-400 mt-2">
                {countTest} <span className="text-xs font-normal text-slate-400">Emerging Signals</span>
              </div>
              <div className="text-[10px] text-amber-400/80 mt-1">Perlu kaitan edukatif / studi kasus</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Dilarang (AVOID)</span>
                <ShieldAlert className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl font-black text-rose-400 mt-2">
                {countAvoid} <span className="text-xs font-normal text-slate-400">Blacklisted / Spam</span>
              </div>
              <div className="text-[10px] text-rose-400 mt-1">Brand safety guardrail violation</div>
            </div>
          </div>

          {/* Main Content Box */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-5 shadow-sm text-xs">
            {/* Header & Action Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-cyan-600" />
                  Hashtag & Keyword Trending Intelligence
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pemantauan keyword SEO bervolume tinggi, query transaksional, & hashtag B2B relevan berbasis data penelusuran riil
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddKeywordModal(true)}
                className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-950/60 self-start sm:self-auto cursor-pointer transition-all shrink-0"
              >
                <Plus className="w-4 h-4" /> Riset / Tambah Keyword Baru
              </button>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari hashtag, keyword, atau topik..."
                  value={tagSearchQuery}
                  onChange={e => setTagSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 shadow-sm rounded-xl pl-8 pr-3 py-1.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs"
                />
              </div>

              {/* Type Filter */}
              <div>
                <select
                  value={tagTypeFilter}
                  onChange={e => setTagTypeFilter(e.target.value)}
                  className="w-full bg-white border border-slate-200 shadow-sm rounded-xl px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs"
                >
                  <option value="all">Semua Tipe (Hashtag, Keyword, Query)</option>
                  <option value="Hashtag">Hashtag (#)</option>
                  <option value="Keyword">Keyword (SEO Target)</option>
                  <option value="Long-Tail Query">Long-Tail Search Query</option>
                </select>
              </div>

              {/* Platform Filter */}
              <div>
                <select
                  value={tagPlatformFilter}
                  onChange={e => setTagPlatformFilter(e.target.value)}
                  className="w-full bg-white border border-slate-200 shadow-sm rounded-xl px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs"
                >
                  <option value="all">Semua Platform</option>
                  <option value="Instagram">Instagram</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Google Search">Google Search</option>
                  <option value="X (Twitter)">X (Twitter)</option>
                </select>
              </div>

              {/* Recommendation Filter */}
              <div>
                <select
                  value={tagRecFilter}
                  onChange={e => setTagRecFilter(e.target.value)}
                  className="w-full bg-white border border-slate-200 shadow-sm rounded-xl px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs"
                >
                  <option value="all">Semua Status Rekomendasi</option>
                  <option value="USE">🟢 USE (Rekomendasi Utama)</option>
                  <option value="TEST">🟡 TEST (Uji Coba Terukur)</option>
                  <option value="AVOID">🔴 AVOID (Dilarang / Blacklisted)</option>
                </select>
              </div>
            </div>

            {/* Keyword / Hashtag Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredKeywords.map(item => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all space-y-3.5 ${
                    item.rec === 'USE'
                      ? 'bg-white border-slate-200 hover:border-cyan-500/50 shadow-sm'
                      : item.rec === 'TEST'
                      ? 'bg-white border-slate-200 hover:border-amber-500/50 shadow-sm'
                      : 'bg-rose-950/20 border-rose-900/40 hover:border-rose-700/60'
                  }`}
                >
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[10px] border border-slate-200">
                          {item.type}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 font-semibold text-[10px] border border-cyan-800/80">
                          {item.platform}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 font-semibold text-[10px] border border-indigo-800/80">
                          {item.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                          {item.term}
                        </h3>
                        <button
                          type="button"
                          onClick={() => handleCopyTerm(item.id, item.term)}
                          title="Salin ke Clipboard"
                          className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors"
                        >
                          {copiedTermId === item.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span
                        className={`text-[10px] font-black px-2.5 py-1 rounded-lg border ${
                          item.rec === 'USE'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 border-emerald-700/80'
                            : item.rec === 'TEST'
                            ? 'bg-amber-950 text-amber-300 border-amber-700/80'
                            : 'bg-rose-50 text-rose-800 border border-rose-200 border-rose-700/80'
                        }`}
                      >
                        {item.rec === 'USE' ? '✓ USE' : item.rec === 'TEST' ? '⚡ TEST' : '✕ AVOID'}
                      </span>
                    </div>
                  </div>

                  {/* Metrics Box */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px]">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Volume / Reach</span>
                      <span className="text-slate-900 font-bold">{item.searchVolume}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Momentum</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                        <TrendingUp className="w-3 h-3" /> {item.growth}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Relevansi B2B</span>
                      <span className="text-cyan-700 font-bold">{item.relevance}%</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Brand Safety</span>
                      <span className={`font-bold ${item.brandSafety >= 80 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {item.brandSafety}%
                      </span>
                    </div>
                  </div>

                  {/* Strategic Rationale & Best Practice */}
                  <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-cyan-400" /> Analisis Marcom & Rekomendasi Penempatan:
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-mono text-[9px] border border-slate-200">
                        Intent: {item.intent}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {item.rationale}
                    </p>
                    <div className="text-[10px] text-slate-500 pt-0.5">
                      Target Campaign: <span className="text-slate-900 font-semibold">{item.suggestedCampaign}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyTerm(item.id, item.term)}
                      className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
                    >
                      {copiedTermId === item.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" /> Tersalin ke Clipboard
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Salin Term
                        </>
                      )}
                    </button>

                    {item.rec !== 'AVOID' && (
                      <button
                        type="button"
                        onClick={() => setSelectedTagForOpp(item)}
                        className="text-xs font-bold text-cyan-300 hover:text-cyan-200 flex items-center gap-1 bg-cyan-950/80 hover:bg-cyan-900 px-3 py-1.5 rounded-xl border border-cyan-800/60 transition-colors cursor-pointer"
                      >
                        Jadikan Ide Konten <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredKeywords.length === 0 && (
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <Hash className="w-8 h-8 text-slate-600 mx-auto" />
                <h4 className="text-sm font-bold text-slate-900">Tidak ada hashtag/keyword yang cocok</h4>
                <p className="text-xs text-slate-400">Silakan ubah filter atau kata kunci pencarian Anda.</p>
              </div>
            )}
          </div>

          {/* Guidelines & Anti-Slop Card */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm text-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Standard Operating Procedure (SOP) Hashtag & Keyword TELPRO
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-700 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-cyan-700 flex items-center gap-1">
                  <span>LinkedIn (B2B Priority)</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Gunakan maksimal 3-5 hashtag otoritas industri (misal: <code>#SmartLogisticsID</code>, <code>#SupplyChainIndonesia</code>). Hindari hashtag generik berlebihan.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-indigo-700 flex items-center gap-1">
                  <span>Instagram & TikTok (Visual Reach)</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Kombinasikan 2 brand hashtag (<code>#TELPRO</code>, <code>#TransformasiDigitalB2B</code>) dengan 3 hashtag niche solusi bisnis. Jangan gunakan tag viral yang tidak relevan.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-rose-700 flex items-center gap-1">
                  <span>Guardrail & Negative Blacklist</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  DILARANG menggunakan kata <em>"Internet Murahan"</em> atau tag spam <code>#ViralIndonesia</code>. Fokus pada proposisi nilai: Presisi, SLA 99.9%, dan Efisiensi Operasional.
                </p>
              </div>
            </div>
          </div>

          {/* Sequential Next Step Banner */}
          <div className="p-4 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/70 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl mt-6">
            <div className="space-y-1 text-left">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                <Compass className="w-4 h-4 text-cyan-500 animate-pulse" />
                LANGKAH WORKFLOW BERIKUTNYA:
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Hashtag & Keyword strategis telah diverifikasi. Selanjutnya pilih dan prioritaskan di <strong>Opportunity Board</strong> atau langsung masuk ke <strong>04. Studio Konten</strong> untuk penulisan naskah.
              </p>
            </div>
            {setActiveTab && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('intel-opportunities')}
                  className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 shadow-sm border border-slate-200 transition-all cursor-pointer"
                >
                  <BookmarkCheck className="w-3.5 h-3.5 text-cyan-400" /> Buka Opportunity Board
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('create-studio')}
                  className="px-5 py-2 rounded-2xl bg-gradient-to-r from-cyan-600 to-rose-600 hover:from-cyan-500 hover:to-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  Lanjut ke 04. Buat Konten ➔
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Trending Audio (Rights Safety & Player) */}
      {intelTab === 'audio' && (
        <div className="space-y-6 animate-in fade-in">
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Total Track Terpantau</span>
                <Music className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2">
                {trends.filter(t => t.type === 'Audio').length}{' '}
                <span className="text-xs font-normal text-slate-400">Trending Audio</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">TikTok & Instagram Reels Viral Charts</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Safe for Commercial Ads</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-400 mt-2">
                {trends.filter(t => t.type === 'Audio' && t.audioRightsStatus === 'Verified for Intended Use').length}{' '}
                <span className="text-xs font-normal text-slate-400">Cleared Tracks</span>
              </div>
              <div className="text-[10px] text-emerald-500 mt-1">Copyright Protected & bebas copyright strike</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Restricted (Personal Only)</span>
                <ShieldAlert className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl font-black text-rose-400 mt-2">
                {trends.filter(t => t.type === 'Audio' && t.audioRightsStatus !== 'Verified for Intended Use').length}{' '}
                <span className="text-xs font-normal text-slate-400">Needs License</span>
              </div>
              <div className="text-[10px] text-rose-400 mt-1">Dilarang untuk Iklan Berbayar (Ads)</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Target Format</span>
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-black text-cyan-700 mt-2">
                Shorts / Reels
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Optimasi durasi 15s - 30s</div>
            </div>
          </div>

          {/* Audio Catalog Box */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-5 shadow-sm text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Music className="w-4 h-4 text-purple-600" />
                  Trending Audio Catalog & Commercial Rights Verification
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Audio trending dengan filter keamanan Copyright Protected komersial (B2B Brand Safety).
                </p>
              </div>
              {/* Filter */}
              <div className="flex items-center gap-2">
                <select
                  value={audioRightsFilter}
                  onChange={e => setAudioRightsFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:bg-white text-xs"
                >
                  <option value="all">Semua Status Copyright</option>
                  <option value="verified">🟢 Verified Safe for Commercial</option>
                  <option value="restricted">🔴 Restricted / Needs License</option>
                </select>
              </div>
            </div>

            {/* Audio Track Cards */}
            <div className="space-y-3">
              {trends
                .filter(t => t.type === 'Audio')
                .filter(t => {
                  if (audioRightsFilter === 'verified') return t.audioRightsStatus === 'Verified for Intended Use';
                  if (audioRightsFilter === 'restricted') return t.audioRightsStatus !== 'Verified for Intended Use';
                  return true;
                })
                .map(aud => {
                  const isPlaying = playingAudioId === aud.id;
                  const isVerified = aud.audioRightsStatus === 'Verified for Intended Use';

                  return (
                    <div
                      key={aud.id}
                      className={`p-4 rounded-2xl border transition-all space-y-3 ${
                        isPlaying
                          ? 'bg-purple-950/30 border-purple-500/80 shadow-lg shadow-purple-950/50'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Left: Player control & title */}
                        <div className="flex items-center gap-3 min-w-0">
                          <button
                            type="button"
                            onClick={() => setPlayingAudioId(isPlaying ? null : aud.id)}
                            className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-md ${
                              isPlaying
                                ? 'bg-purple-600 text-white scale-105 shadow-purple-900/50'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200'
                            }`}
                          >
                            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                          </button>

                          <div className="space-y-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-sm font-bold text-slate-900 truncate">{aud.title}</h3>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                  isVerified
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 border-emerald-800'
                                    : 'bg-rose-50 text-rose-800 border border-rose-200 border-rose-800'
                                }`}
                              >
                                {isVerified ? '✓ Verified Commercial Safe' : '⚠️ Restricted / Personal Only'}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                              <span>Platform: <strong className="text-slate-900 font-semibold">{aud.platform}</strong></span>
                              <span>Source: <strong className="text-slate-900 font-semibold">{aud.source}</strong></span>
                              <span>Momentum: <strong className="text-cyan-400">{aud.momentum}</strong></span>
                              <span>Relevansi: <strong className="text-indigo-400">{aud.relevanceScore}%</strong></span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                          <button
                            type="button"
                            onClick={() => setSelectedTrendForOpp(aud)}
                            className="text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 flex items-center gap-1 px-3.5 py-1.5 rounded-xl transition-all hover:scale-105 cursor-pointer shadow-sm"
                          >
                            Pakai untuk Video Shorts/Reels <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Waveform graphic simulation when playing */}
                      {isPlaying && (
                        <div className="pt-2 border-t border-purple-900/40 flex items-center justify-between gap-3 text-[11px]">
                          <div className="flex items-center gap-1.5 text-purple-400 font-mono">
                            <Volume2 className="w-4 h-4 animate-bounce" />
                            <span>Previewing Audio Stream (0:15 / 0:30)...</span>
                          </div>
                          {/* Animated sound bars */}
                          <div className="flex items-end gap-1 h-5">
                            {[40, 70, 90, 60, 100, 45, 80, 65, 95, 50, 75, 85].map((h, i) => (
                              <span
                                key={i}
                                className="w-1 bg-gradient-to-t from-purple-500 to-cyan-400 rounded-full animate-pulse"
                                style={{
                                  height: `${h}%`,
                                  animationDelay: `${i * 80}ms`,
                                  animationDuration: '600ms'
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Audio Safety Guardrail Explanation */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm text-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              SOP Copyright & Lisensi Audio Komersial TELPRO (B2B Guardrail)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-emerald-700">Audio Bebas Lisensi / Komersial:</div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Dapat digunakan untuk campaign organik maupun Meta/TikTok Ads berbayar tanpa risiko takedown, mute, atau gugatan copyright brand.
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-rose-700">Audio Populer Berlisensi Personal:</div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  AI Guardrail secara otomatis memblokir audio personal dari alur Iklan Berbayar. Hanya boleh dijadikan referensi beat internal.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Event Calendar */}
      {intelTab === 'events' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Event Calendar & Revalidation Engine</h2>
              <p className="text-xs text-slate-400">Jadwal revalidasi berkala: H-30, H-14, H-7, H-1, Hari-H untuk menjaga akurasi konten</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map(evt => (
              <div key={evt.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-900 font-bold border border-indigo-300">
                    {evt.category}
                  </span>
                  <span className="text-slate-600 font-semibold">Version: v{evt.version}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900">{evt.name}</h3>

                <div className="text-xs space-y-1 text-slate-800">
                  <div>📅 Tanggal: <strong className="text-slate-900 font-bold">{evt.dateStart} s/d {evt.dateEnd}</strong></div>
                  <div>📍 Lokasi: <strong className="text-slate-900 font-bold">{evt.venue}, {evt.city}</strong></div>
                  <div>🏢 Organizer: <span className="font-semibold text-slate-900">{evt.organizer}</span></div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Revalidation: {evt.revalidationStatus}
                  </span>
                  <button
                    onClick={() => revalidateEvent(evt.id)}
                    className="text-xs text-indigo-700 hover:text-indigo-800 font-bold flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-200 transition-colors"
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
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Opportunity Board ({opportunities.length})</h2>
              <p className="text-xs text-slate-400">Hasil konversi intelligence ke opsi sudut pandang bisnis yang siap diproduksi</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {opportunities.map(opp => (
              <div key={opp.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 font-semibold border border-rose-800">
                    Action: {opp.action}
                  </span>
                  <span className="text-emerald-400 font-bold text-xs">Score: {opp.overallScore}/100</span>
                </div>

                <h3 className="text-xs font-bold text-slate-900">{opp.title}</h3>
                <p className="text-xs text-slate-700 leading-relaxed"><strong className="text-slate-900 font-bold">Business Angle:</strong> {opp.businessAngle}</p>

                <div className="pt-2 border-t border-slate-200 space-y-2 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Format: <strong className="text-slate-900 font-bold">{opp.recommendedFormat}</strong></span>
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
                        cta: 'Call Center: 1500 473 | WA: +62811 150 4739 (chat only) | Email: info@telpro.co.id | Graha TelkomProperty, Jl. Kebon Sirih No. 10-12, Jakarta Pusat, 10110',
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
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Evidence Pack & Claim-to-Source Mapping</h2>
              <p className="text-xs text-slate-400">Prinsip Utama: No source, no fact. Setiap klaim publikasi wajib terhubung ke sumber bukti valid.</p>
            </div>
          </div>

          <div className="space-y-3">
            {evidences.map(evd => (
              <div key={evd.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-semibold border border-indigo-800">
                    {evd.sourceType}
                  </span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Confidence: {evd.confidenceScore}%
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <span>{evd.sourceTitle}</span>
                  <a href={evd.sourceUrl} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline flex items-center gap-0.5">
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 text-xs text-slate-800 border border-slate-200">
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

      {/* Bottom Sequential Workflow Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/70 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl mt-6">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            LANGKAH WORKFLOW BERJENJANG BERIKUTNYA:
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Riset Signal Trend & Opportunity (03) telah lengkap. Selanjutnya olah signal ini menjadi draf naskah, storyboard, dan video AI di <strong>04. Buat Konten (AI Studio)</strong>.
          </p>
        </div>
        {setActiveTab && (
          <button
            type="button"
            onClick={() => setActiveTab('content-studio')}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-rose-600 hover:from-cyan-500 hover:to-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer shrink-0"
          >
            Lanjut ke 04. Buat Konten (AI Studio) ➔
          </button>
        )}
      </div>

      {/* Modal: Convert Trend to Opportunity */}
      {selectedTrendForOpp && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-3">Konversi Trend ke Content Opportunity</h3>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="text-slate-400">Trend Signal:</div>
              <div className="font-bold text-slate-900">{selectedTrendForOpp.title}</div>
            </div>

            <form onSubmit={handleCreateOppFromTrend} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Sudut Pandang Bisnis (Business Angle) *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Bagaimana trend ini dikaitkan dengan keunggulan solusi TELPRO?"
                  value={oppAngle}
                  onChange={e => setOppAngle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedTrendForOpp(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-200"
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

      {/* Modal: Add/Research New Keyword/Hashtag */}
      {showAddKeywordModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Hash className="w-4 h-4 text-cyan-600" />
                Riset & Tambah Hashtag / Keyword Baru
              </h3>
              <button
                type="button"
                onClick={() => setShowAddKeywordModal(false)}
                className="text-slate-500 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveKeyword} className="space-y-3">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">
                  Kata Kunci / Tagar (Term) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: #LogistikPresisi atau Vendor Data Center SLA 99.9%"
                  value={newTerm}
                  onChange={e => setNewTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Tipe *</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white"
                  >
                    <option value="Hashtag">Hashtag (#)</option>
                    <option value="Keyword">Keyword (SEO)</option>
                    <option value="Long-Tail Query">Long-Tail Search Query</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Platform Utama *</label>
                  <select
                    value={newPlatform}
                    onChange={e => setNewPlatform(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white"
                  >
                    <option value="All Platforms">All Platforms</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Instagram">Instagram</option>
                    <option value="TikTok">TikTok</option>
                    <option value="Google Search">Google Search</option>
                    <option value="X (Twitter)">X (Twitter)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Kategori Produk / Solusi *</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white"
                  >
                    <option value="Smart Logistics">Smart Logistics</option>
                    <option value="Enterprise Connectivity">Enterprise Connectivity</option>
                    <option value="B2B Digital Solution">B2B Digital Solution</option>
                    <option value="General Tech / Viral">General Tech / Viral</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Status Rekomendasi *</label>
                  <select
                    value={newRec}
                    onChange={e => setNewRec(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white"
                  >
                    <option value="USE">🟢 USE (Rekomendasi Utama)</option>
                    <option value="TEST">🟡 TEST (Uji Coba)</option>
                    <option value="AVOID">🔴 AVOID (Dilarang)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Relevansi B2B (0-100)%</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={newRelevance}
                    onChange={e => setNewRelevance(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Estimasi Volume Pencarian</label>
                  <input
                    type="text"
                    placeholder="Contoh: 18.5K search / bln"
                    value={newVolume}
                    onChange={e => setNewVolume(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">
                  Alasan Strategis & Rationale Marcom *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Mengapa keyword ini dianjurkan / diuji coba / dilarang?"
                  value={newRationale}
                  onChange={e => setNewRationale(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddKeywordModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-lg shadow-cyan-950/60"
                >
                  Simpan Term Intelligence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Convert Keyword/Hashtag to Opportunity */}
      {selectedTagForOpp && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-600" />
                Konversi Hashtag/Keyword ke Content Opportunity
              </h3>
              <button
                type="button"
                onClick={() => setSelectedTagForOpp(null)}
                className="text-slate-500 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="text-slate-500 text-[11px] font-semibold">Selected Term:</div>
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                {selectedTagForOpp.term}
                <span className="text-[10px] px-2.5 py-0.5 rounded bg-cyan-100 text-cyan-900 font-bold border border-cyan-300">
                  {selectedTagForOpp.type} • {selectedTagForOpp.platform}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium mt-1">{selectedTagForOpp.rationale}</p>
            </div>

            <form onSubmit={handleCreateOppFromTag} className="space-y-3">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">
                  Sudut Pandang Bisnis (Business Angle / Hook Gagasan) *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Contoh: Edukasi bagaimana teknologi TELPRO menjawab tantangan pencarian ini dengan SLA 99.9%..."
                  value={tagOppAngle}
                  onChange={e => setTagOppAngle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedTagForOpp(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-lg shadow-cyan-950/60"
                >
                  Buat Opportunity & Buka Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
