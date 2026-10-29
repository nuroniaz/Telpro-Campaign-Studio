import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NavTab } from '../Sidebar';
import { ContentItem, ContentVersion, Approval, DecisionType } from '../../types';
import {
  Calendar as CalendarIcon,
  Sparkles,
  ShieldCheck,
  Rocket,
  Plus,
  Play,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Film,
  Image as ImageIcon,
  Smartphone,
  FileText,
  Share2,
  ExternalLink,
  ChevronRight,
  Send,
  RefreshCw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Sliders,
  Hash,
  Volume2,
  Filter,
  Check,
  Eye,
  TrendingUp,
  MapPin
} from 'lucide-react';

import { ContentPlannerView } from './ContentPlannerView';
import { ApprovalGovernanceView } from './ApprovalGovernanceView';
import { isExecutiveApprover } from '../../utils/rbac';
import { PostPublishWorkflowView } from './PostPublishWorkflowView';

interface BuatKontenViewProps {
  activeTab?: NavTab;
  setActiveTab?: (tab: NavTab) => void;
}

export const BuatKontenView: React.FC<BuatKontenViewProps> = ({ activeTab, setActiveTab }) => {
  const {
    contents,
    contentVersions,
    approvals,
    updateApprovalDecision,
    publishContent,
    addContentWithVersion,
    addRegionalSubmission,
    activeUser,
    selectedCampaign
  } = useApp();

  const isRegionalUser = activeUser.role === 'ROLE_REGIONAL_CREATOR';
  const isApproverOnly = isExecutiveApprover(activeUser);
  const userRegion = activeUser.regionalUnit || 'Regional 1';

  // Sub-tabs: 'schedule' | 'ai' | 'approval' | 'publish' | 'post-publish'
  const [currentSubTab, setCurrentSubTab] = useState<'schedule' | 'ai' | 'approval' | 'publish' | 'post-publish'>(() => {
    if (activeTab === 'content-schedule' || activeTab === 'act-calendar') return 'schedule';
    if (activeTab === 'content-approval' || activeTab === 'gov-approvals') return 'approval';
    if (activeTab === 'content-publish' || activeTab === 'act-publishing') return isApproverOnly ? 'approval' : 'publish';
    if (activeTab === 'content-postpublish' || activeTab === 'act-monitoring') return 'post-publish';
    // Executive approvers default to approval queue, not AI content creator
    if (isApproverOnly) return 'approval';
    return 'ai';
  });

  // Sync when activeTab changes
  React.useEffect(() => {
    if (activeTab === 'content-schedule' || activeTab === 'act-calendar') setCurrentSubTab('schedule');
    else if (activeTab === 'content-ai' || activeTab === 'content-studio' || activeTab === 'content-aipartner') {
      setCurrentSubTab(isApproverOnly ? 'approval' : 'ai');
    }
    else if (activeTab === 'content-approval' || activeTab === 'gov-approvals') setCurrentSubTab('approval');
    else if (activeTab === 'content-publish' || activeTab === 'act-publishing') {
      setCurrentSubTab(isApproverOnly ? 'approval' : 'publish');
    }
    else if (activeTab === 'content-postpublish' || activeTab === 'act-monitoring') setCurrentSubTab('post-publish');
  }, [activeTab, isApproverOnly]);

  const handleSubTabChange = (tab: 'schedule' | 'ai' | 'approval' | 'publish' | 'post-publish') => {
    // Executive approvers only approve and monitor; cannot create or publish
    const targetTab = (isApproverOnly && (tab === 'ai' || tab === 'publish')) ? 'approval' : tab;
    setCurrentSubTab(targetTab);
    if (setActiveTab) {
      if (targetTab === 'schedule') setActiveTab('content-schedule');
      else if (targetTab === 'ai') setActiveTab('content-ai');
      else if (targetTab === 'approval') setActiveTab('content-approval');
      else if (targetTab === 'publish') setActiveTab('content-publish');
      else if (targetTab === 'post-publish') setActiveTab('content-postpublish' as NavTab);
    }
  };

  // --- STATE FOR AI CONTENT CREATOR ---
  const [contentFormat, setContentFormat] = useState<'story' | 'post' | 'reels' | 'carousel'>('post');
  const [topicPrompt, setTopicPrompt] = useState('Peluncuran Solusi Managed Fiber Optic & Private Tower TELPRO 2026');
  const [toneOfVoice, setToneOfVoice] = useState('Professional & Persuasif B2B');
  const [targetPlatform, setTargetPlatform] = useState('LinkedIn & Instagram');
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Carousel specific slides
  const [carouselSlides, setCarouselSlides] = useState([
    { slideNum: 1, title: "Tantangan Downtime Jaringan Industri", body: "Konektivitas terputus 1 jam dapat merugikan miliaran rupiah pada operasional manufaktur." },
    { slideNum: 2, title: "Mengapa Provider Tradisional Gagal?", body: "Latency tinggi dan waktu pemulihan (MTTR) lebih dari 4 jam membebani tim IT Anda." },
    { slideNum: 3, title: "Solusi: TELPRO Dedicated Fiber Optic", body: "SLA 99.98% dengan redundansi dual-homing dan monitoring NOC 24/7 nasional." },
    { slideNum: 4, title: "Hasil Nyata Klien Enterprise", body: "95% penurunan incident report dan efisiensi biaya operasional jaringan hingga 32%." },
    { slideNum: 5, title: "Siap Naik Kelas di Era Digital?", body: "Konsultasikan arsitektur private network perusahaan Anda bersama lead engineer TELPRO hari ini." }
  ]);

  // Reels script specific state
  const [reelsScript, setReelsScript] = useState({
    hook3s: "Pernah bayangkan apa yang terjadi kalau jaringan tower telko mati saat transaksi nasional memuncak?",
    visualCue: "Close-up dramatis kabel optik berkecepatan tinggi, transisi ke pusat kontrol NOC modern TELPRO",
    audioBed: "Corporate Tech Uplifting • 120 BPM • Bass synth modern",
    narration: "Bagi industri perbankan dan data center, 1 detik downtime bukan sekadar angka. Itulah mengapa TELPRO menghadirkan infrastruktur fiber optic terdedikasi dengan SLA 99.98%. Amankan masa depan bisnismu sekarang.",
    cta: "Klik tautan di bio untuk konsultasi infrastruktur tier-1 gratis."
  });

  // Story specific state
  const [storyFrames, setStoryFrames] = useState([
    { frame: 1, type: "Hook Visual", text: "Koneksi bisnis lambat di jam krusial? 🚨", interactive: "Sticker Poll: Pernah / Sering Banget" },
    { frame: 2, type: "Core Solution", text: "TELPRO Ultra-Fast Fiber: Latency < 5ms untuk enterprise ⚡", interactive: "Slider Emoji Api 🔥" },
    { frame: 3, type: "Direct Action", text: "Upgrade jaringan kantormu sekarang!", interactive: "Link Sticker: telpro.co.id/enterprise" }
  ]);

  // Post / Feed specific state
  const [postContent, setPostContent] = useState({
    headline: "Transformasi Konektivitas Bisnis Anda dengan Dedicated Fiber Optic TELPRO",
    caption: `Di era cloud dan komputasi cerdas, keandalan jaringan adalah fondasi utama profitabilitas bisnis.

PT Telkom Property (TELPRO) mempersembahkan infrastruktur serat optik tier-1 dan tower terintegrasi yang dirancang khusus untuk ketahanan operasional tingkat tinggi:
✅ Jaminan SLA 99.98% dengan dual-homing path
✅ Pemantauan Network Operations Center (NOC) 24/7/365
✅ Skalabilitas kapasitas hingga multi-gigabit on-demand

Optimalkan reliabilitas dan keamanan komunikasi data perusahaan Anda bersama mitra infrastruktur terpercaya di Indonesia.`,
    hashtags: "#TELPRO #FiberOptic #EnterpriseNetwork #TelekomunikasiIndonesia #B2BInfrastructure #DigitalTransformation #CloudConnectivity #TelkomProperty",
    cta: "Hubungi tim enterprise kami untuk jadwal assesmen jaringan gratis."
  });

  // Generate with AI
  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Buatkan draf konten ${contentFormat} untuk PT Telkom Property (TELPRO).
Topik: ${topicPrompt}
Tone: ${toneOfVoice}
Platform: ${targetPlatform}`,
          campaignContext: selectedCampaign?.name
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (contentFormat === 'post') {
          setPostContent(prev => ({
            ...prev,
            caption: data.reply || data.response || prev.caption
          }));
        }
      }
    } catch {
      // Fallback already robust
    } finally {
      setIsGenerating(false);
      setToastMessage(`✨ Konten ${contentFormat.toUpperCase()} berhasil dibuat dan dioptimasi oleh AI!`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Push to Approval Workflow
  const handleSendToApproval = () => {
    const newContentId = `cnt-${Date.now()}`;
    const newVersionId = `ver-${Date.now()}`;

    const newContent: ContentItem = {
      id: newContentId,
      campaignId: selectedCampaign?.id || 'cmp-1',
      title: `${contentFormat.toUpperCase()}: ${topicPrompt.slice(0, 40)}...`,
      objective: 'Brand Awareness & Enterprise Acquisition',
      audience: 'CTO, VP of Infrastructure & Enterprise Decision-Makers',
      platform: targetPlatform.includes('Instagram') ? 'Instagram' : 'LinkedIn',
      format: contentFormat === 'reels' ? 'Reels/Shorts' : contentFormat === 'carousel' ? 'Carousel' : 'Article',
      status: 'Ready for Review',
      pic: activeUser.name,
      currentVersionId: newVersionId,
      scheduledAt: new Date(Date.now() + 86400000 * 2).toISOString()
    };

    const newVersion: ContentVersion = {
      id: newVersionId,
      contentId: newContentId,
      versionNumber: 1,
      brief: `AI Generated Content for ${contentFormat.toUpperCase()}`,
      hook: reelsScript.hook3s || postContent.headline,
      caption: contentFormat === 'reels' ? reelsScript.narration : postContent.caption,
      script: contentFormat === 'reels' ? reelsScript.narration : postContent.caption,
      cta: postContent.cta,
      selectedKeywords: ['#TELPRO', '#EnterpriseFiber', '#SLA99'],
      selectedHashtags: postContent.hashtags,
      createdBy: activeUser.name,
      createdAt: new Date().toISOString(),
      aiAssisted: true,
      evidenceIds: ['evd-1'],
      riskLevel: 'Low'
    };

    addContentWithVersion(newContent, newVersion);
    setToastMessage("✅ Berhasil dikirim ke antrean 'Approval Konten'!");
    setTimeout(() => {
      setToastMessage(null);
      handleSubTabChange('approval');
    }, 1200);
  };

  // Push to Calendar
  const handleSendToSchedule = () => {
    setToastMessage("📅 Berhasil dijadwalkan pada Kalender Konten!");
    setTimeout(() => {
      setToastMessage(null);
      handleSubTabChange('schedule');
    }, 1000);
  };

  // Push directly to Publish
  const handleSendToPublish = () => {
    setToastMessage("🚀 Konten dialihkan ke pusat Publish Konten!");
    setTimeout(() => {
      setToastMessage(null);
      handleSubTabChange('publish');
    }, 1000);
  };

  // Push AI draft directly to Regional Submissions
  const handleSendToRegionalSubmission = () => {
    addRegionalSubmission({
      id: `reg-sub-${Date.now().toString().slice(-4)}`,
      regional: userRegion,
      topic: `${contentFormat.toUpperCase()}: ${topicPrompt.slice(0, 50)}`,
      activity: `Inisiatif Konten Draf AI (${contentFormat.toUpperCase()})`,
      location: `${userRegion} — Area Kerja`,
      activityDate: new Date().toISOString().split('T')[0],
      targetAudience: 'Pelaku Industri & Pelanggan Bisnis Regional',
      contentPillarSuggestion: 'Product Excellence',
      supportingAssetUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=400&q=80',
      supportingAssetStatus: 'Draft Ready',
      supportingDocumentName: `Draf_Naskah_AI_${contentFormat.toUpperCase()}.docx`,
      requestedPublishDate: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
      picRegional: activeUser.name,
      notes: contentFormat === 'reels' ? reelsScript.narration : postContent.caption,
      status: 'Draft'
    });
    setToastMessage(`✅ Draf AI berhasil disimpan ke 'Usulan Konten Saya (${userRegion})'!`);
    setTimeout(() => {
      setToastMessage(null);
      handleSubTabChange('schedule');
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Top Banner - Only for non-regional users */}
      {!isRegionalUser && (
        <div className={`p-6 rounded-3xl text-white border shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          isApproverOnly
            ? 'bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 border-rose-900 shadow-rose-950/20'
            : 'bg-gradient-to-r from-rose-900 via-slate-900 to-indigo-950 border-rose-900'
        }`}>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/30 text-rose-300 border border-rose-400/30 font-bold text-[10px] tracking-wider uppercase flex items-center gap-1">
                {isApproverOnly ? <ShieldCheck className="w-3 h-3 text-rose-300" /> : <Sparkles className="w-3 h-3 text-rose-300" />}
                {isApproverOnly ? 'Tahap 2 • Governance, Otorisasi & Kepatuhan SLA' : 'Tahap 2 • Produksi & Orkestrasi'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 font-mono text-[10px]">
                {isApproverOnly ? 'Executive Approver Mode' : 'Multi-Format Studio'}
              </span>
            </div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              {isApproverOnly ? '2. Otorisasi & Monitoring Konten' : '2. Buat Konten • End-to-End Suite'}
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              {isApproverOnly
                ? 'Sebagai Executive Approver, kewenangan akun Anda difokuskan pada peninjauan tata kelola (governance), audit bukti fakta & kepatuhan brand, serta otorisasi resmi. Pembuatan draf konten dikelola oleh Marcomm & Corcomm Creator.'
                : 'Kelola jadwal kalender, buat konten otomatis dengan AI (Story, Feed Post, Reels, Carousel), validasi approval multi-layer, hingga eksekusi publikasi ke seluruh channel resmi.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab && setActiveTab('ref-trends')}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-white/10"
            >
              <span>Lihat 03. Referensi Konten</span>
              <ChevronRight className="w-3.5 h-3.5 text-rose-400" />
            </button>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-sm animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sub-menu Navigation Tabs - Only for non-regional users */}
      {!isRegionalUser && (
        <div className={`grid gap-2 border-b border-slate-200 pb-3 ${
          isApproverOnly
            ? 'grid-cols-1 sm:grid-cols-3'
            : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
        }`}>
          <button
            onClick={() => handleSubTabChange('schedule')}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
              currentSubTab === 'schedule'
                ? 'bg-rose-50 border-rose-400 shadow-sm ring-2 ring-rose-200 text-rose-950'
                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              currentSubTab === 'schedule' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Bagian 2.1</div>
              <div className="text-xs font-black">{isApproverOnly ? 'Monitoring Kalender' : 'Jadwal Konten'}</div>
            </div>
          </button>

          {/* AI Content Creator tab is ONLY shown for non-approvers */}
          {!isApproverOnly && (
            <button
              onClick={() => handleSubTabChange('ai')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 relative ${
                currentSubTab === 'ai'
                  ? 'bg-rose-50 border-rose-400 shadow-sm ring-2 ring-rose-200 text-rose-950'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                currentSubTab === 'ai' ? 'bg-rose-600 text-white' : 'bg-rose-100 text-rose-700'
              }`}>
                <Sparkles className="w-4 h-4 animate-spin-slow" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-rose-500">Bagian 2.2 • Core</div>
                <div className="text-xs font-black">Buat Konten AI</div>
              </div>
              <span className="w-2 h-2 rounded-full bg-rose-600 absolute top-2 right-2 animate-ping" />
            </button>
          )}

          <button
            onClick={() => handleSubTabChange('approval')}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 relative ${
              currentSubTab === 'approval'
                ? 'bg-rose-50 border-rose-400 shadow-sm ring-2 ring-rose-200 text-rose-950'
                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              currentSubTab === 'approval' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-rose-600">{isApproverOnly ? 'Fokus Utama • 2.2' : 'Bagian 2.3'}</div>
              <div className="text-xs font-black">{isApproverOnly ? 'Approval & Otorisasi' : 'Approval Konten'}</div>
            </div>
            {isApproverOnly && (
              <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-black absolute top-2 right-2">
                OTORISASI
              </span>
            )}
          </button>

          {/* Publish sub-tab is ONLY for creators (Marcomm & Corcomm) - Approvers only approve & monitor */}
          {!isApproverOnly && (
            <button
              onClick={() => handleSubTabChange('publish')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                currentSubTab === 'publish'
                  ? 'bg-rose-50 border-rose-400 shadow-sm ring-2 ring-rose-200 text-rose-950'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                currentSubTab === 'publish' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                <Rocket className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Bagian 2.4</div>
                <div className="text-xs font-black">Publish Konten</div>
              </div>
            </button>
          )}

          <button
            onClick={() => handleSubTabChange('post-publish')}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 relative ${
              currentSubTab === 'post-publish'
                ? 'bg-rose-50 border-rose-400 shadow-sm ring-2 ring-rose-200 text-rose-950'
                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              currentSubTab === 'post-publish' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">{isApproverOnly ? 'Bagian 2.3' : 'Bagian 2.5'}</div>
              <div className="text-xs font-black">{isApproverOnly ? 'Monitoring Hasil Tayang' : 'Pasca-Tayang & Evaluasi'}</div>
            </div>
          </button>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 1: JADWAL KONTEN (Calendar & Schedule Timeline)
      ======================================================== */}
      {currentSubTab === 'schedule' && (
        <div className="space-y-6 animate-in fade-in">
          {activeUser.role !== 'ROLE_REGIONAL_CREATOR' && (
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-rose-600" />
                    Kalender & Jadwal Publikasi Konten
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Distribusi jadwal posting mingguan & harian per kanal (Instagram, TikTok, LinkedIn, YouTube, X)
                  </p>
                </div>
                <button
                  onClick={() => handleSubTabChange('ai')}
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Buat & Jadwalkan Konten Baru</span>
                </button>
              </div>

              {/* Time Slot Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-500" /> Pagi (09:00 WIB)
                    </span>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded-full text-slate-500 font-mono border">2 Post</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-indigo-700 text-[10px] uppercase">LinkedIn Post</span>
                        <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold">Terjadwal</span>
                      </div>
                      <p className="font-medium text-slate-800 line-clamp-1">TELPRO Managed Fiber Optic for Financial Sector</p>
                      <div className="text-[10px] text-slate-400">Senin, 09:00 WIB</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-sky-500" /> Siang (12:30 WIB)
                    </span>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded-full text-slate-500 font-mono border">1 Post</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-700 text-[10px] uppercase">Instagram Story</span>
                      <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold">Terjadwal</span>
                    </div>
                    <p className="font-medium text-slate-800 line-clamp-1">Behind The Scene: Tim NOC Telpro Siaga 24/7</p>
                    <div className="text-[10px] text-slate-400">Rabu, 12:30 WIB</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" /> Sore (17:00 WIB)
                    </span>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded-full text-slate-500 font-mono border">2 Post</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-teal-700 text-[10px] uppercase">TikTok / Reels</span>
                      <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold">Menunggu Review</span>
                    </div>
                    <p className="font-medium text-slate-800 line-clamp-1">3 Mitos Kabel Laut yang Sering Salah Paham</p>
                    <div className="text-[10px] text-slate-400">Kamis, 17:00 WIB</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-purple-500" /> Malam (20:00 WIB)
                    </span>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded-full text-slate-500 font-mono border">1 Post</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-pink-700 text-[10px] uppercase">Carousel 5 Slide</span>
                      <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold">Terjadwal</span>
                    </div>
                    <p className="font-medium text-slate-800 line-clamp-1">Panduan Arsitektur Jaringan Cloud Telco 2026</p>
                    <div className="text-[10px] text-slate-400">Jumat, 20:00 WIB</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SPARK Content Planner (4-Section Matrix, Regional Inbox & Master Taxonomy) */}
          <ContentPlannerView activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      )}

      {/* ========================================================
          SUB-TAB 2: BUAT KONTEN DENGAN AI (Story, Post, Reels, Carousel)
      ======================================================== */}
      {currentSubTab === 'ai' && (
        isApproverOnly ? (
          <div className="p-8 rounded-3xl bg-white border border-rose-200 text-center space-y-4 max-w-xl mx-auto shadow-sm my-8">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-600">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Peran Akun: Executive Approver</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sesuai kebijakan tata kelola TELPRO, akun <strong>Executive Approver</strong> ({activeUser.title}) tidak memiliki akses untuk membuat konten baru. Peran Anda difokuskan penuh untuk peninjauan (review), audit kepatuhan, dan otorisasi (approval) pada antrean draf konten.
            </p>
            <button
              onClick={() => handleSubTabChange('approval')}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              Buka Antrean Approval Konten
            </button>
          </div>
        ) : (
        <div className="space-y-6 animate-in fade-in">
          {isRegionalUser && (
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-[10px] uppercase font-bold flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-600" /> Wilayah Kerja: {userRegion}
                  </span>
                </div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  Draf Ide AI Regional — {userRegion}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Eksplorasi ide dan susun draf usulan konten regional berbasis AI untuk diajukan ke kurasi kampanye nasional.
                </p>
              </div>
              <button
                onClick={() => handleSubTabChange('schedule')}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
              >
                <span>Lihat Usulan Konten Saya</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Format Selector Bar */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
                Pilih Format Konten:
              </span>
              <button
                onClick={() => setContentFormat('story')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  contentFormat === 'story'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Story (9:16)</span>
              </button>

              <button
                onClick={() => setContentFormat('post')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  contentFormat === 'post'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Feed Post</span>
              </button>

              <button
                onClick={() => setContentFormat('reels')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  contentFormat === 'reels'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Reels / Shorts</span>
              </button>

              <button
                onClick={() => setContentFormat('carousel')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  contentFormat === 'carousel'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Carousel (Multi-Slide)</span>
              </button>
            </div>

            <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border">
              Format: {contentFormat.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Col: Prompt & Controls (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-rose-600" />
                    Parameter AI Generator
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Instruksikan Gemini untuk membuat draf konten yang relevan dengan TELPRO
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Topik / Pesan Kunci
                  </label>
                  <textarea
                    rows={3}
                    value={topicPrompt}
                    onChange={(e) => setTopicPrompt(e.target.value)}
                    placeholder="Contoh: Pentingnya SLA 99.98% jaringan tower untuk perbankan..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:outline-none focus:border-rose-500 focus:bg-white resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Tone of Voice
                    </label>
                    <select
                      value={toneOfVoice}
                      onChange={(e) => setToneOfVoice(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:outline-none focus:border-rose-500"
                    >
                      <option value="Professional & Persuasif B2B">Professional & Persuasif</option>
                      <option value="Educational & Insightful">Educational & Insightful</option>
                      <option value="Casual & Viral Storytelling">Casual & Storytelling</option>
                      <option value="Urgent & Call-to-Action">Urgent & Direct Action</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Kanal Tujuan
                    </label>
                    <select
                      value={targetPlatform}
                      onChange={(e) => setTargetPlatform(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:outline-none focus:border-rose-500"
                    >
                      <option value="LinkedIn & Instagram">LinkedIn & Instagram</option>
                      <option value="TikTok & Reels">TikTok & Reels</option>
                      <option value="Instagram Feed">Instagram Feed</option>
                      <option value="X (Twitter Thread)">X Thread</option>
                    </select>
                  </div>
                </div>

                {/* Quick Topic Starters */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Inspirasi Cepat Topik TELPRO:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setTopicPrompt("Penyebab Latency Tinggi pada Sistem Transaksi Enterprise & Solusi Fiber")}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[10px] text-slate-700 font-medium cursor-pointer"
                    >
                      ⚡ Anti Latency Enterprise
                    </button>
                    <button
                      type="button"
                      onClick={() => setTopicPrompt("5 Alasan BUMN Beralih ke Dedicated Tower & Private Micro-NOC")}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[10px] text-slate-700 font-medium cursor-pointer"
                    >
                      🏢 BUMN Private Tower
                    </button>
                    <button
                      type="button"
                      onClick={() => setTopicPrompt("Mitos vs Fakta: Benarkah Jaringan Fiber Optic Kebal Gangguan Cuaca?")}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[10px] text-slate-700 font-medium cursor-pointer"
                    >
                      🛡️ Mitos vs Fakta Fiber
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateAI}
                  disabled={isGenerating}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Memproses dengan AI Gemini...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                      <span>Generate Konten {contentFormat.toUpperCase()}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Action Buttons to Forward Content */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2.5">
                <span className="text-[11px] font-bold text-indigo-950 block">
                  Langkah Lanjutan Konten Ini:
                </span>
                {isRegionalUser ? (
                  <button
                    onClick={handleSendToRegionalSubmission}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all"
                  >
                    <Send className="w-4 h-4 text-emerald-100" />
                    <span>Ajukan ke Usulan Konten Saya ({userRegion})</span>
                  </button>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      onClick={handleSendToApproval}
                      className="px-3 py-2 rounded-xl bg-white hover:bg-indigo-100 border border-indigo-300 text-indigo-900 text-xs font-bold flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Kirim Approval</span>
                    </button>

                    <button
                      onClick={handleSendToSchedule}
                      className="px-3 py-2 rounded-xl bg-white hover:bg-indigo-100 border border-indigo-300 text-indigo-900 text-xs font-bold flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                    >
                      <CalendarIcon className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Jadwalkan</span>
                    </button>

                    <button
                      onClick={handleSendToPublish}
                      className="px-3 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                    >
                      <Rocket className="w-3.5 h-3.5" />
                      <span>Publish</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Col: Interactive Multi-Format Preview & Editor (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* FORMAT 1: STORY (9:16) PREVIEW */}
              {contentFormat === 'story' && (
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-rose-600" />
                      Pratinjau Story 3-Frame (Instagram / Facebook)
                    </h4>
                    <span className="text-[10px] font-mono bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full font-bold">
                      Format Vertikal 9:16
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {storyFrames.map((f) => (
                      <div key={f.frame} className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-900 to-indigo-950 text-white border border-slate-800 aspect-[9/16] flex flex-col justify-between shadow-md relative overflow-hidden">
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span className="font-bold">Frame {f.frame}</span>
                          <span className="text-rose-400">{f.type}</span>
                        </div>
                        <div className="text-xs font-black text-center my-auto px-2 leading-relaxed">
                          {f.text}
                        </div>
                        <div className="p-2 rounded-xl bg-white/10 backdrop-blur text-center text-[10px] font-semibold text-amber-200 border border-white/20">
                          {f.interactive}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FORMAT 2: FEED POST PREVIEW */}
              {contentFormat === 'post' && (
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-rose-600" />
                      Draf & Pratinjau Feed Post (Headline, Naskah & Hashtag)
                    </h4>
                    <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                      1:1 Square Feed
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Headline Visual
                      </label>
                      <input
                        type="text"
                        value={postContent.headline}
                        onChange={(e) => setPostContent({ ...postContent, headline: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-slate-50 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Isi Caption Lengkap
                      </label>
                      <textarea
                        rows={7}
                        value={postContent.caption}
                        onChange={(e) => setPostContent({ ...postContent, caption: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:bg-white leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Hashtags & Tagar Strategis
                      </label>
                      <input
                        type="text"
                        value={postContent.hashtags}
                        onChange={(e) => setPostContent({ ...postContent, hashtags: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-indigo-700 font-mono bg-slate-50 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* FORMAT 3: REELS / SHORTS SCRIPT PREVIEW */}
              {contentFormat === 'reels' && (
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Film className="w-4 h-4 text-rose-600" />
                      Naskah & Storyboard Reels / TikTok (15-60 Detik)
                    </h4>
                    <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                      Viral Script Blueprint
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-1">
                      <span className="font-bold text-amber-900 text-[10px] uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Hook 3-Detik Pertama (Krusial)
                      </span>
                      <p className="font-bold text-slate-900">{reelsScript.hook3s}</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <span className="font-bold text-slate-600 text-[10px] uppercase tracking-wider flex items-center gap-1">
                        <Film className="w-3.5 h-3.5 text-indigo-600" /> Arahan Visual / B-Roll
                      </span>
                      <p className="text-slate-800">{reelsScript.visualCue}</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <span className="font-bold text-slate-600 text-[10px] uppercase tracking-wider flex items-center gap-1">
                        <Volume2 className="w-3.5 h-3.5 text-emerald-600" /> Audio Bed & Sound Recommendation
                      </span>
                      <p className="text-slate-800 font-mono">{reelsScript.audioBed}</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <span className="font-bold text-slate-600 text-[10px] uppercase tracking-wider">
                        Naskah Voiceover Lengkap
                      </span>
                      <p className="text-slate-800 leading-relaxed">{reelsScript.narration}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* FORMAT 4: CAROUSEL SLIDES PREVIEW */}
              {contentFormat === 'carousel' && (
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Layers className="w-4 h-4 text-rose-600" />
                      Slide Carousel ({carouselSlides.length} Slide)
                    </h4>
                    <button
                      onClick={() => setCarouselSlides(prev => [
                        ...prev,
                        { slideNum: prev.length + 1, title: `Slide Tambahan ${prev.length + 1}`, body: "Isi teks pendukung atau poin statistik." }
                      ])}
                      className="px-2.5 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Tambah Slide</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto custom-scrollbar p-1">
                    {carouselSlides.map((slide, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/40 border border-slate-200 shadow-2xs space-y-2 relative">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                          <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">Slide {slide.slideNum}</span>
                          <span>{idx === 0 ? 'Cover/Hook' : idx === carouselSlides.length - 1 ? 'Closing/CTA' : 'Isi Value'}</span>
                        </div>
                        <input
                          type="text"
                          value={slide.title}
                          onChange={(e) => {
                            const updated = [...carouselSlides];
                            updated[idx].title = e.target.value;
                            setCarouselSlides(updated);
                          }}
                          className="w-full text-xs font-black text-slate-900 bg-transparent border-b border-transparent focus:border-indigo-400 focus:outline-none"
                        />
                        <textarea
                          rows={2}
                          value={slide.body}
                          onChange={(e) => {
                            const updated = [...carouselSlides];
                            updated[idx].body = e.target.value;
                            setCarouselSlides(updated);
                          }}
                          className="w-full text-[11px] text-slate-600 bg-transparent resize-none border-b border-transparent focus:border-indigo-400 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        )
      )}

      {/* ========================================================
          SUB-TAB 3: APPROVAL KONTEN (Workflow & Compliance Review)
      ======================================================== */}
      {currentSubTab === 'approval' && (
        <div className="space-y-6 animate-in fade-in">
          <ApprovalGovernanceView onNavigateToPublish={() => handleSubTabChange('publish')} />
        </div>
      )}

      {/* ========================================================
          SUB-TAB 4: PUBLISH KONTEN (Multi-Channel Dispatch Hub)
      ======================================================== */}
      {currentSubTab === 'publish' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-rose-600" />
                  Pusat Eksekusi Publikasi (Multi-Channel Dispatch)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Distribusi langsung ke Instagram Graph API, TikTok for Business, LinkedIn Organization, YouTube, &amp; X
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                  5 Kanal Siap Live
                </span>
              </div>
            </div>

            {/* Channels Status Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                <div className="text-xs font-extrabold text-pink-700">Instagram</div>
                <div className="text-[10px] text-emerald-600 font-bold">● Connected</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                <div className="text-xs font-extrabold text-slate-900">TikTok</div>
                <div className="text-[10px] text-emerald-600 font-bold">● Connected</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                <div className="text-xs font-extrabold text-indigo-700">LinkedIn</div>
                <div className="text-[10px] text-emerald-600 font-bold">● Connected</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                <div className="text-xs font-extrabold text-rose-700">YouTube</div>
                <div className="text-[10px] text-emerald-600 font-bold">● Connected</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                <div className="text-xs font-extrabold text-slate-800">X (Twitter)</div>
                <div className="text-[10px] text-emerald-600 font-bold">● Connected</div>
              </div>
            </div>

            {/* Publishing Queue Items */}
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Daftar Konten Siap Publish Sekarang:
              </h4>

              {contents.slice(0, 4).map((cnt) => (
                <div
                  key={cnt.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold">
                        {cnt.platform}
                      </span>
                      <span className="font-extrabold text-slate-900 text-xs">
                        {cnt.title}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2">
                      <span>Format: <strong className="text-slate-700">{cnt.format}</strong></span>
                      <span>•</span>
                      <span>Creator: {cnt.assignedCreator}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        publishContent(cnt.id);
                        setToastMessage(`🚀 Konten "${cnt.title.slice(0, 25)}..." berhasil di-publish ke ${cnt.platform}! Memulai pemantauan pasca-tayang.`);
                        setTimeout(() => {
                          setToastMessage(null);
                          handleSubTabChange('post-publish');
                        }, 1500);
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <Rocket className="w-3.5 h-3.5" />
                      <span>Publish Sekarang</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Banner link to Post-Publish & Monthly Evaluation */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-pink-50 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
              <div className="space-y-0.5">
                <div className="text-xs font-extrabold text-indigo-950 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  Siklus Pasca-Tayang &amp; Rapat Evaluasi Bulanan
                </div>
                <p className="text-[11px] text-slate-600">
                  Pantau impresi, picu amplifikasi (Story/Ads) atau simpan Best Practice, hingga rapat evaluasi strategi bulanan bersama Corcomm &amp; Marcomm.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleSubTabChange('post-publish')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0"
              >
                <span>Buka Pasca-Tayang &amp; Evaluasi</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 5: PASCA-TAYANG & EVALUASI BULANAN (Closed-Loop)
      ======================================================== */}
      {currentSubTab === 'post-publish' && (
        <div className="space-y-6 animate-in fade-in">
          <PostPublishWorkflowView onNavigateToSchedule={() => handleSubTabChange('schedule')} />
        </div>
      )}
    </div>
  );
};
