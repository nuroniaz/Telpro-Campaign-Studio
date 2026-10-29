import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ContentItem, ContentVersion } from '../../types';
import { NavTab } from '../Sidebar';
import { RbacBanner } from '../Common/RbacBanner';
import { WorkflowPipelineBar } from '../Common/WorkflowPipelineBar';
import { hasPermission } from '../../utils/rbac';
import { VisualStoryboardGenerator } from './VisualStoryboardGenerator';
import { AiVideoStudio } from './AiVideoStudio';
import { VideoTimelineComposer } from './VideoTimelineComposer';
import {
  Sparkles,
  BrainCircuit,
  Send,
  FileCheck,
  RotateCcw,
  CheckCircle2,
  Copy,
  Layers,
  Music,
  Target,
  Plus,
  ArrowUpRight,
  Database,
  History,
  ShieldCheck,
  AlertTriangle,
  FileText,
  SlidersHorizontal,
  Bot,
  Lock,
  Film,
  Video,
  Upload,
  FileUp,
  Image,
  File,
  Trash2,
  ChevronRight,
  Compass,
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Building2,
  Edit3,
  Check
} from 'lucide-react';

interface ContentProductionViewProps {
  activeTab?: NavTab;
  setActiveTab?: (tab: NavTab) => void;
}

export const ContentProductionView: React.FC<ContentProductionViewProps> = ({ activeTab, setActiveTab }) => {
  const {
    selectedCampaign,
    contents,
    contentVersions,
    aiMessages,
    isAILoading,
    sendAIMessage,
    clearAIChat,
    applyAIGeneratedContent,
    addContentWithVersion,
    evidences,
    activeUser
  } = useApp();

  const [studioSearch, setStudioSearch] = useState('');
  const [studioPlatformFilter, setStudioPlatformFilter] = useState('all');

  let contentTab: 'aipartner' | 'studio' | 'storyboard' | 'aivideo' | 'timeline' | 'discoverability' | 'creativetrend' | 'production' | 'assets' = 'aipartner';
  if (activeTab === 'content-studio') contentTab = 'studio';
  else if (activeTab === 'content-storyboard') contentTab = 'storyboard';
  else if (activeTab === 'content-aivideo') contentTab = 'aivideo';
  else if (activeTab === 'content-timeline') contentTab = 'timeline';
  else if (activeTab === 'content-discoverability') contentTab = 'discoverability';
  else if (activeTab === 'content-creativetrend') contentTab = 'creativetrend';
  else if (activeTab === 'content-production') contentTab = 'production';
  else if (activeTab === 'content-assets') contentTab = 'assets';
  else if (activeTab === 'content-aipartner') contentTab = 'aipartner';

  // AI Chat input
  const [chatInput, setChatInput] = useState('');

  const FULL_OFFICIAL_TELPRO_CTA = 'Call Center: 1500 473 | WA: +62811 150 4739 (chat only) | Email: info@telpro.co.id | Graha TelkomProperty, Jl. Kebon Sirih No. 10-12, Jakarta Pusat, 10110';

  // Save to Pipeline Modal States
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveTitle, setSaveTitle] = useState('');
  const [savePlatform, setSavePlatform] = useState('LinkedIn');
  const [saveFormat, setSaveFormat] = useState<'Carousel' | 'Reels/Shorts' | 'Infographic' | 'Article' | 'Video Storyboard'>('Carousel');
  const [saveHook, setSaveHook] = useState('');
  const [saveCaption, setSaveCaption] = useState('');
  const [saveScript, setSaveScript] = useState('');
  const [saveCta, setSaveCta] = useState(FULL_OFFICIAL_TELPRO_CTA);

  // Creative Studio selected content
  const [selectedContentId, setSelectedContentId] = useState<string>(contents[0]?.id || '');
  const activeContent = contents.find(c => c.id === selectedContentId) || contents[0];
  const activeVersion = contentVersions.find(v => v.id === activeContent?.currentVersionId) || contentVersions[0];

  const getSanitizedCta = (val?: string) => {
    if (!val || val.includes('Hubungi TELPRO Sales') || val.includes('telpro.id') || val.includes('Hubungi Sales')) {
      return FULL_OFFICIAL_TELPRO_CTA;
    }
    return val;
  };

  // Studio form states for editing draft version
  const [editHook, setEditHook] = useState(activeVersion?.hook || '');
  const [editCaption, setEditCaption] = useState(activeVersion?.caption || '');
  const [editScript, setEditScript] = useState(activeVersion?.script || '');
  const [editCta, setEditCta] = useState(getSanitizedCta(activeVersion?.cta));

  // Keep form fields synced when activeVersion changes
  useEffect(() => {
    if (activeVersion) {
      setEditHook(activeVersion.hook || '');
      setEditCaption(activeVersion.caption || '');
      setEditScript(activeVersion.script || '');
      setEditCta(getSanitizedCta(activeVersion.cta));
    }
  }, [activeVersion?.id, selectedContentId]);

  // Keep selectedContentId valid when studioPlatformFilter or studioSearch changes
  useEffect(() => {
    const studioFiltered = contents.filter(cnt => {
      if (studioPlatformFilter !== 'all') {
        const pf = studioPlatformFilter.toLowerCase();
        const cp = (cnt.platform || '').toLowerCase();
        if (pf === 'article') {
          if (!cp.includes('article') && !cp.includes('blog') && !cp.includes('web') && !cp.includes('search')) return false;
        } else if (!cp.includes(pf)) {
          return false;
        }
      }
      if (studioSearch.trim()) {
        const q = studioSearch.toLowerCase();
        const titleMatch = (cnt.title || '').toLowerCase().includes(q);
        const platMatch = (cnt.platform || '').toLowerCase().includes(q);
        if (!titleMatch && !platMatch) return false;
      }
      return true;
    });

    if (studioFiltered.length > 0) {
      const isStillInList = studioFiltered.some(c => c.id === selectedContentId);
      if (!isStillInList) {
        setSelectedContentId(studioFiltered[0].id);
      }
    }
  }, [studioPlatformFilter, studioSearch, contents]);

  // Asset Library Upload States
  const [assetList, setAssetList] = useState<Array<{ id: string; name: string; size: string; type: string; rights: string; date: string; url?: string }>>([
    { id: 'ast-1', name: 'TELPRO Brand Logo Pack 2026.zip', size: '14.2 MB', type: 'Brand Asset', rights: 'TELPRO Verified', date: '2026-08-01' },
    { id: 'ast-2', name: 'Dashboard Smart Warehouse UI Render.png', size: '2.8 MB', type: 'Product Asset', rights: 'TELPRO Verified', date: '2026-08-03' },
    { id: 'ast-3', name: 'Audio Synth Commercial License.wav', size: '8.5 MB', type: 'Licensed Audio', rights: 'TELPRO Verified', date: '2026-08-05' }
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAssets = Array.from(files).map((file: File, i) => ({
      id: `ast-${Date.now()}-${i}`,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      type: file.type.includes('image') ? 'Visual Image' : file.type.includes('video') ? 'Video Asset' : 'Document/Asset',
      rights: 'TELPRO Verified Upload',
      date: new Date().toISOString().split('T')[0],
      url: URL.createObjectURL(file)
    }));

    setAssetList(prev => [...newAssets, ...prev]);
    alert(`✅ Berhasil mengunggah ${files.length} berkas media/asset baru ke Drive Sync TELPRO!`);
  };

  const openSavePipelineModalWithText = (text: string) => {
    const campaignName = selectedCampaign?.name || 'Campaign Aktif';
    setSaveTitle(`Konten AI: ${campaignName} - ${new Date().toLocaleDateString('id-ID')}`);
    setSaveHook(text.slice(0, 150) + '...');
    setSaveCaption(text);
    setSaveScript(text);
    setSaveCta(FULL_OFFICIAL_TELPRO_CTA);
    setShowSaveModal(true);
  };

  const handleSaveToPipelineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saveTitle.trim()) {
      alert('Mohon isi judul konten terlebih dahulu.');
      return;
    }

    const newContentId = `cnt-${Date.now()}`;
    const newVersionId = `ver-${Date.now()}-1`;

    const newContent: ContentItem = {
      id: newContentId,
      campaignId: selectedCampaign?.id || 'cmp-e2e',
      title: saveTitle,
      objective: selectedCampaign?.businessObjective || 'Peningkatan Awarness & B2B Leads',
      audience: selectedCampaign?.audience || 'Target Executive B2B',
      platform: savePlatform,
      format: saveFormat,
      status: 'AI-Assisted Draft',
      pic: activeUser.name,
      currentVersionId: newVersionId
    };

    const newVersion: ContentVersion = {
      id: newVersionId,
      contentId: newContentId,
      versionNumber: 1,
      brief: `Brief Konten AI untuk ${saveTitle}`,
      hook: saveHook || 'Standard TELPRO Hook',
      caption: saveCaption || 'Standard TELPRO Caption',
      script: saveScript || 'Standard TELPRO Script',
      cta: saveCta || FULL_OFFICIAL_TELPRO_CTA,
      selectedKeywords: ['TELPRO', 'Smart Solution'],
      selectedHashtags: ['#TELPRO2026', '#B2BSolution'],
      createdBy: activeUser.name,
      createdAt: new Date().toISOString(),
      aiAssisted: true,
      evidenceIds: [],
      riskLevel: 'Low'
    };

    addContentWithVersion(newContent, newVersion);
    setSelectedContentId(newContentId);
    setShowSaveModal(false);
    alert(`✅ BERHASIL DISIMPAN KE PIPELINE KONTEN CAMPAIGN!\n\nKonten "${saveTitle}" untuk Campaign "${selectedCampaign?.name || 'Aktif'}" telah terdaftar di Pipeline Konten dan otomatis masuk ke Tahap 1 Fact Check & Evidence Review.`);
  };

  // Handle Apply AI Action directly from chat message
  const handleApplyAIAction = (actionType: string) => {
    if (!activeContent) return;

    if (actionType.includes('Caption') || actionType.includes('Brief') || actionType.includes('Hook')) {
      applyAIGeneratedContent(activeContent.id, {
        hook: editHook || activeVersion?.hook || 'AI Generated Hook',
        caption: editCaption || activeVersion?.caption || 'AI Generated Caption Draft',
        script: editScript || activeVersion?.script || 'AI Script',
        cta: editCta || activeVersion?.cta || FULL_OFFICIAL_TELPRO_CTA,
        aiAssisted: true
      });
      alert(`Berhasil menerapkan ${actionType}! Versi baru #${activeContent.id} berhasil disimpan ke Governance Audit Log.`);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendAIMessage(chatInput);
    setChatInput('');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-500" />
              04. Content & Production (Agentic AI Studio)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">TELPRO AI Content Partner, Creative Studio, Discoverability, Creative Trend, & Asset Library</p>
          </div>
        </div>
        <RbacBanner moduleName="Content & Production" requiredAction="canCreateContent" requiredRole="ROLE_STRATEGY_LEAD / ROLE_MARCOM_CREATOR / ROLE_SYSTEM_ADMIN" />

        {/* Universal Sequential Workflow Bar */}
        <WorkflowPipelineBar currentStage="03" setActiveTab={setActiveTab} titleSuffix="Pembuatan Naskah, Storyboard, & AI Video (Langkah ke-3)" />

        {/* End-to-End Workflow Sub-Pipeline Stepper */}
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 px-1">
            <span className="flex items-center gap-1.5 text-rose-600">
              <BrainCircuit className="w-4 h-4 text-rose-500 animate-pulse" />
              Alur Kerja Pembuatan Konten AI Berkelanjutan (End-to-End AI Workflow)
            </span>
            <span className="text-[10px] text-slate-500 font-mono">AI Context Preserved Throughout Pipeline</span>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1 text-[10px]">
            {[
              { step: '1', label: 'CAMPAIGN', desc: 'Tujuan & Audience', tab: 'strategy-campaigns' as NavTab, active: false, icon: Target },
              { step: '2', label: 'IDE & TREN', desc: 'Signal Relevan', tab: 'intel-radar' as NavTab, active: false, icon: Compass },
              { step: '3', label: 'USER PILIH TREND', desc: 'Konfirmasi Signal', tab: 'intel-opportunities' as NavTab, active: false, icon: CheckCircle2 },
              { step: '4', label: 'BUAT KONTEN', desc: 'AI Context Hub', tab: 'content-aipartner' as NavTab, active: contentTab === 'aipartner', icon: BrainCircuit },
              { step: '5', label: 'FORMAT & SCRIPT', desc: 'Draft Naskah', tab: 'content-studio' as NavTab, active: contentTab === 'studio', icon: Sparkles },
              { step: '6', label: 'STORYBOARD', desc: 'Visual Scene', tab: 'content-storyboard' as NavTab, active: contentTab === 'storyboard', icon: FileText },
              { step: '7', label: 'AI VIDEO', desc: 'Veo 2 & Render', tab: 'content-aivideo' as NavTab, active: contentTab === 'aivideo' || contentTab === 'timeline', icon: Film },
              { step: '8', label: 'CAPTION & CTA', desc: 'Post Package', tab: 'content-discoverability' as NavTab, active: contentTab === 'discoverability', icon: Target }
            ].map((st, i, arr) => {
              const StepIcon = st.icon;
              return (
                <React.Fragment key={st.step}>
                  <button
                    type="button"
                    onClick={() => setActiveTab && setActiveTab(st.tab)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all shrink-0 cursor-pointer ${
                      st.active
                        ? 'bg-rose-50 border-rose-300 text-rose-950 shadow-sm ring-1 ring-rose-400 font-bold'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full text-[9px] font-extrabold flex items-center justify-center ${
                      st.active ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {st.step}
                    </span>
                    <div className="text-left min-w-0">
                      <div className={`font-extrabold tracking-tight text-[10px] ${st.active ? 'text-rose-900' : 'text-slate-800'}`}>
                        {st.label}
                      </div>
                      <div className="text-[8px] text-slate-500 truncate">{st.desc}</div>
                    </div>
                  </button>
                  {i < arr.length - 1 && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab 1: TELPRO AI Content Partner (Multi-turn Chat & Context Panel) */}
      {contentTab === 'aipartner' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
          {/* Left Area (2 Cols): AI Multi-turn Chat */}
          <div className="lg:col-span-2 flex flex-col h-[640px] rounded-3xl bg-white border border-slate-200 shadow-md overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-slate-900">TELPRO AI Content Partner</h2>
                  <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Evidence-Aware Reasoning Mode Active
                  </span>
                </div>
              </div>

              <button
                onClick={clearAIChat}
                className="text-[11px] text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Reset Thread
              </button>
            </div>

            {/* Chat Message List */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
              {aiMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-1 px-1">
                    <span>{msg.sender === 'user' ? activeUser.name : 'TELPRO AI Partner'}</span>
                    <span>•</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <div
                    className={`max-w-[85%] p-4 rounded-3xl text-xs space-y-2 leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-br-none'
                        : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* AI Collapsible Sources & Risk Metadata */}
                    {msg.sender === 'ai' && (
                      <div className="pt-2 border-t border-slate-200 space-y-2 text-[10px]">
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="flex items-start gap-1 text-slate-600">
                            <FileCheck className="w-3 h-3 text-cyan-600 shrink-0 mt-0.5" />
                            <span>Sources: <strong className="text-slate-800">{msg.sources.join(', ')}</strong></span>
                          </div>
                        )}

                        {msg.risks && msg.risks.length > 0 && (
                          <div className="flex items-start gap-1 text-amber-800 bg-amber-50 p-2 rounded-xl border border-amber-200">
                            <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                            <span>Risk Check: {msg.risks.join('; ')}</span>
                          </div>
                        )}

                        {/* Save to Pipeline Button for AI Messages */}
                        <div className="pt-1 flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => openSavePipelineModalWithText(msg.text)}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-[10px] shadow-sm flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            Simpan ke Pipeline Konten Campaign
                          </button>

                          {msg.suggestedActions && msg.suggestedActions.length > 0 && msg.suggestedActions.map((act, i) => (
                            <button
                              key={i}
                              onClick={() => handleApplyAIAction(act.type)}
                              className="px-2.5 py-1 rounded-xl bg-white hover:bg-slate-100 text-rose-700 border border-rose-200 font-semibold text-[10px] transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                            >
                              <Sparkles className="w-2.5 h-2.5 text-rose-500" />
                              {act.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isAILoading && (
                <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 p-3 rounded-2xl border border-rose-200 w-fit animate-pulse">
                  <Sparkles className="w-4 h-4 animate-spin text-rose-500" />
                  TELPRO AI sedang menganalisis context, evidence, & menyusun rekomendasi...
                </div>
              )}
            </div>

            {/* Chat Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Tanyakan ide angle, riset evidence, atau buatkan caption & storyboard..."
                className="flex-1 bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <button
                type="submit"
                disabled={isAILoading}
                className="p-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold hover:scale-105 transition-all shadow-sm cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Column (1 Col): Content Context Panel */}
          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-md space-y-3 text-xs">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                <Target className="w-4 h-4 text-rose-500" />
                Active Context Memory
              </h3>

              <div>
                <span className="text-slate-500 font-semibold block">Campaign:</span>
                <span className="text-slate-800 font-bold">{selectedCampaign?.name}</span>
              </div>

              <div>
                <span className="text-slate-500 font-semibold block">Business Objective:</span>
                <p className="text-slate-700 text-[11px] leading-relaxed">{selectedCampaign?.businessObjective}</p>
              </div>

              <div>
                <span className="text-slate-500 font-semibold block">Target Audience:</span>
                <span className="text-slate-700">{selectedCampaign?.audience}</span>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-slate-500 font-semibold block mb-1">Evidence Pack Terkait:</span>
                <div className="p-2 rounded-xl bg-slate-50 text-[10px] text-slate-700 border border-slate-200">
                  {evidences[0]?.sourceTitle ? `${evidences[0].sourceTitle} (Confidence ${evidences[0].confidenceScore}%)` : 'TELPRO Internal Knowledge Base Verified'}
                </div>

                <button
                  onClick={() => {
                    const lastAiMsg = [...aiMessages].reverse().find(m => m.sender === 'ai');
                    openSavePipelineModalWithText(lastAiMsg ? lastAiMsg.text : 'Draft Konten dari TELPRO AI Partner');
                  }}
                  className="w-full mt-2 py-2.5 px-3 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.02] cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Simpan Hasil AI ke Pipeline
                </button>
              </div>
            </div>

            {/* Quick Prompts */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-md space-y-3 text-xs">
              <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Prompt Pintar Cepat
              </h3>
              <div className="space-y-2">
                {[
                  'Bandingkan 3 alternatif angle promosi Smart Warehouse',
                  'Kritisi draft caption ini terhadap aturan Brand Safety TELPRO',
                  'Buatkan script video reels 30s dengan hook masalah delay gudang'
                ].map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendAIMessage(p)}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 text-[11px] transition-colors cursor-pointer"
                  >
                    💡 "{p}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Creative Studio (Brief, Hook, Caption, Script, Storyboard) */}
      {contentTab === 'studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
          {/* Left Column (1 Col): Content Package Selector */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Pilih Paket Konten</h2>
              <button
                onClick={() => {
                  setSaveTitle(`Konten Baru: ${selectedCampaign?.name || 'Campaign'}`);
                  setSaveHook('');
                  setSaveCaption('');
                  setSaveScript('');
                  setSaveCta(FULL_OFFICIAL_TELPRO_CTA);
                  setShowSaveModal(true);
                }}
                className="px-2.5 py-1 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] flex items-center gap-1 shadow-sm transition-transform hover:scale-105 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> + Buat Baru
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <div className="relative">
                <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari konten..."
                  value={studioSearch}
                  onChange={e => setStudioSearch(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 border border-slate-200 text-[11px] rounded-xl pl-7 pr-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-rose-500 placeholder:text-slate-400"
                />
              </div>
              <select
                value={studioPlatformFilter}
                onChange={e => setStudioPlatformFilter(e.target.value)}
                className="w-full bg-slate-50 text-slate-700 border border-slate-200 text-[11px] rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-rose-500"
              >
                <option value="all">Semua Platform</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="linkedin">LinkedIn</option>
                <option value="article">Article / Blog / Web</option>
                <option value="tiktok">TikTok</option>
                <option value="youtube">YouTube</option>
              </select>
            </div>

            <div className="space-y-2 text-xs max-h-[520px] overflow-y-auto pr-1">
              {(() => {
                const studioFiltered = contents.filter(cnt => {
                  if (studioPlatformFilter !== 'all') {
                    const pf = studioPlatformFilter.toLowerCase();
                    const cp = (cnt.platform || '').toLowerCase();
                    if (pf === 'article') {
                      if (!cp.includes('article') && !cp.includes('blog') && !cp.includes('web') && !cp.includes('search')) return false;
                    } else if (!cp.includes(pf)) {
                      return false;
                    }
                  }
                  if (studioSearch.trim()) {
                    const q = studioSearch.toLowerCase();
                    const titleMatch = (cnt.title || '').toLowerCase().includes(q);
                    const platMatch = (cnt.platform || '').toLowerCase().includes(q);
                    if (!titleMatch && !platMatch) return false;
                  }
                  return true;
                });

                if (studioFiltered.length === 0) {
                  return (
                    <div className="p-4 text-center text-slate-500 text-[11px] italic">
                      Tidak ada konten yang cocok dengan pencarian/filter.
                    </div>
                  );
                }

                return studioFiltered.map(cnt => (
                  <button
                    key={cnt.id}
                    onClick={() => {
                      setSelectedContentId(cnt.id);
                      const ver = contentVersions.find(v => v.id === cnt.currentVersionId);
                      if (ver) {
                        setEditHook(ver.hook);
                        setEditCaption(ver.caption);
                        setEditScript(ver.script);
                        setEditCta(getSanitizedCta(ver.cta));
                      }
                    }}
                    className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                      cnt.id === activeContent?.id
                        ? 'bg-rose-50 border-rose-300 text-rose-950 font-semibold shadow-xs ring-1 ring-rose-400'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="text-slate-500 font-medium">{cnt.platform}</span>
                      <span className="text-rose-600 font-mono font-bold">#{cnt.currentVersionId}</span>
                    </div>
                    <div className="font-bold line-clamp-2 text-slate-900">{cnt.title}</div>
                  </button>
                ));
              })()}
            </div>
          </div>

          {/* Center & Right Column (2 Cols): Creative Studio Editor */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">{activeContent?.title}</h2>
                <p className="text-xs text-slate-500">Versi Resmi Terkini: <strong className="text-rose-600">#{activeContent?.currentVersionId}</strong></p>
              </div>
              <button
                onClick={() => handleApplyAIAction('Caption & Hook Update')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold flex items-center gap-1.5 shadow-md shadow-rose-600/20 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" /> Simpan Versi Baru (+1)
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Hook Kalimat Pembuka *</label>
                <input
                  type="text"
                  value={editHook}
                  onChange={e => setEditHook(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Caption Lengkap & Paragraf Penutup *</label>
                <textarea
                  rows={6}
                  value={editCaption}
                  onChange={e => setEditCaption(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Script Video / Storyboard Flow *</label>
                <textarea
                  rows={4}
                  value={editScript}
                  onChange={e => setEditScript(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono text-[11px]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-700 font-semibold block flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5 text-rose-600" /> Call to Action (CTA) & Official Contact *
                  </label>
                  <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" /> Aksi Edit Manual Aktif
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={editCta}
                  onChange={e => setEditCta(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs leading-relaxed font-mono"
                  placeholder="Isikan CTA & Kontak Resmi (Dapat disesuaikan manual)..."
                />

                {/* Quick Presets & Official Contact Card */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-3 h-3 text-rose-600" /> Kontak Resmi TELPRO (Official Contact Us)
                    </span>
                    <span className="text-[9px] text-slate-500">Kebon Sirih 10-12, Jakpus</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[10px]">
                    <div className="p-2 rounded-xl bg-white border border-slate-200 flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <div>
                        <div className="text-slate-500 font-medium">Call Center</div>
                        <div className="text-slate-900 font-bold">1500 473</div>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-white border border-slate-200 flex items-center gap-2">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <div>
                        <div className="text-slate-500 font-medium">WhatsApp (Chat Only)</div>
                        <div className="text-slate-900 font-bold">+62 811 150 4739</div>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-white border border-slate-200 flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                      <div>
                        <div className="text-slate-500 font-medium">Email Resmi</div>
                        <div className="text-slate-900 font-bold">info@telpro.co.id</div>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-white border border-slate-200 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-slate-500 font-medium">Kantor Pusat (HQ)</div>
                        <div className="text-slate-900 font-bold truncate">Graha TelkomProperty, Kebon Sirih 10-12</div>
                      </div>
                    </div>
                  </div>

                  {/* Preset Action Buttons */}
                  <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-1.5 items-center">
                    <span className="text-[10px] text-slate-500 font-medium">Gunakan Preset:</span>
                    <button
                      type="button"
                      onClick={() => setEditCta('Call Center: 1500 473 | WA: +62811 150 4739 (chat only) | Email: info@telpro.co.id | Graha TelkomProperty, Jl. Kebon Sirih No. 10-12, Jakarta Pusat, 10110')}
                      className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-semibold transition-colors cursor-pointer"
                    >
                      📞 Lengkap (Semua Kontak & Alamat)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditCta('Call Center: 1500 473 | WA: +62811 150 4739 (chat only) | telpro.co.id')}
                      className="px-2 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-semibold transition-colors cursor-pointer"
                    >
                      💬 Call Center & WA Chat Only
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditCta('Email: info@telpro.co.id | Graha TelkomProperty, Jl. Kebon Sirih No. 10-12, Jakarta Pusat, 10110')}
                      className="px-2 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-semibold transition-colors cursor-pointer"
                    >
                      ✉️ Email & Kebon Sirih 10-12
                    </button>
                  </div>
                </div>
              </div>

              {/* Upload Media Attachment Box inside Creative Studio */}
              <div className="pt-2 border-t border-slate-200">
                <label className="text-slate-700 font-semibold block mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-rose-500" />
                    Upload Hasil Konten / Media Attachments (Desain, Video MP4, Carousel Slide)
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Sync to Drive</span>
                </label>

                <div className="relative border border-dashed border-rose-300 hover:border-rose-500 bg-rose-50/40 hover:bg-rose-50/70 rounded-2xl p-4 text-center transition-all group cursor-pointer">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    title="Klik atau drag file ke sini untuk mengunggah hasil eksekusi konten"
                  />
                  <div className="flex items-center justify-center gap-3 pointer-events-none">
                    <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0">
                      <FileUp className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-800">Klik atau seret berkas media ke sini</p>
                      <p className="text-[10px] text-slate-500">Mendukung Gambar (PNG/JPG), Video (MP4), PSD, PDF (Maks. 500MB)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Visual Storyboard Generator */}
      {contentTab === 'storyboard' && <VisualStoryboardGenerator />}

      {/* Tab: AI Video Studio */}
      {contentTab === 'aivideo' && <AiVideoStudio />}

      {/* Tab: Video Timeline & Composer */}
      {contentTab === 'timeline' && <VideoTimelineComposer />}

      {/* Tab 3: Discoverability Optimizer */}
      {contentTab === 'discoverability' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm animate-in fade-in text-xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Target className="w-4 h-4 text-cyan-600" />
            Discoverability Optimizer (Search & Social SEO)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-slate-600 font-bold block">Primary & Secondary Keywords:</span>
              <div className="flex flex-wrap gap-1.5">
                {['Smart Warehouse', 'TELPRO IoT', 'Efisiensi Logistik', 'IndiHome Dedicated WiFi', 'SLA 99.9%'].map(kw => (
                  <span key={kw} className="px-2.5 py-1 rounded-xl bg-cyan-50 text-cyan-800 border border-cyan-200 font-medium">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-slate-600 font-bold block">Recommended Hashtag Set:</span>
              <div className="flex flex-wrap gap-1.5">
                {['#TELPRO2026', '#SmartWarehouse', '#SupplyChainID', '#IndiHomeBusiness', '#InovasiB2B'].map(tag => (
                  <span key={tag} className="px-2.5 py-1 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Creative Trend Optimizer */}
      {contentTab === 'creativetrend' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm animate-in fade-in text-xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <SlidersHorizontal className="w-4 h-4 text-purple-600" />
            Creative Trend Optimizer & Pattern Recommendations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-purple-700 font-bold block">Rekomendasi Pattern Hook Video:</span>
              <p className="text-slate-700">Gunakan visual "Perbandingan Masalah Sebelum vs Sesudah Solusi" dalam 3 detik pertama untuk meningkatkan retention rate hingga 40%.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-purple-700 font-bold block">Rekomendasi Audio Commercial Safe:</span>
              <p className="text-slate-700">Corporate Precision Motion Synth 120BPM (Terverifikasi Hak Komersial Resmi Telkom Group Library).</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Production Plan */}
      {contentTab === 'production' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm animate-in fade-in text-xs">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Production Plan & Shot List</h2>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="font-bold text-slate-900">Shot List Rencana Syuting Video Smart Warehouse TELPRO:</div>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li>Shot 01: Wide shot suasana gudang logistik sibuk (B-roll)</li>
              <li>Shot 02: Close up pemasangan sensor IoT TELPRO pada rak gudang</li>
              <li>Shot 03: Medium shot staf memantau Dashboard TELPRO di tablet</li>
              <li>Shot 04: Closing logo TELPRO 2026 & contact sales</li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 6: Asset Library & Upload Hub */}
      {contentTab === 'assets' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-6 shadow-sm animate-in fade-in text-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 gap-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-rose-500" />
                Asset Library & Media Repository Drive Sync
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Unggah hasil eksekusi konten (desain flyer, carousel slide, video MP4, logo, B-roll) untuk campaign <strong className="text-rose-600">{selectedCampaign?.name || 'Aktif'}</strong>.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[11px] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Google Drive Synced Live
              </span>
            </div>
          </div>

          {/* Upload Drop Zone Box */}
          <div className="relative border-2 border-dashed border-rose-300 hover:border-rose-500 bg-rose-50/30 hover:bg-rose-50/60 rounded-3xl p-8 text-center transition-all group cursor-pointer">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              title="Klik atau seret file ke sini untuk mengunggah"
            />
            <div className="space-y-3 pointer-events-none">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Unggah Hasil Konten / Media Kreatif</p>
                <p className="text-xs text-slate-600 mt-1">
                  Klik untuk memilih file atau <strong className="text-rose-600">drag & drop</strong> file di sini.
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Mendukung PNG, JPG, MP4, WAV, ZIP, PDF, PSD (Maksimal 500MB/file)
                </p>
              </div>
              <button className="px-4 py-2 rounded-xl bg-rose-600 group-hover:bg-rose-500 text-white font-bold text-xs shadow-md inline-flex items-center gap-1.5 transition-colors">
                <FileUp className="w-3.5 h-3.5" /> Pilih File Asset
              </button>
            </div>
          </div>

          {/* List of Uploaded Assets */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-slate-700 font-bold border-b border-slate-100 pb-2">
              <span>Daftar Asset & Media Repository ({assetList.length})</span>
              <span className="text-[11px] text-slate-500">Kueri Status: Copyright Protected Verified TELPRO</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {assetList.map(a => (
                <div key={a.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-slate-300 transition-colors shadow-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-rose-500 shrink-0">
                        {a.type.includes('Visual') || a.name.endsWith('.png') || a.name.endsWith('.jpg') ? (
                          <Image className="w-4 h-4" />
                        ) : a.type.includes('Video') || a.name.endsWith('.mp4') ? (
                          <Film className="w-4 h-4 text-purple-600" />
                        ) : (
                          <File className="w-4 h-4 text-cyan-600" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-xs truncate" title={a.name}>{a.name}</div>
                        <div className="text-[10px] text-slate-500">{a.size} • {a.date}</div>
                      </div>
                    </div>
                  </div>

                  {a.url && (
                    <div className="rounded-xl overflow-hidden max-h-24 bg-slate-100 border border-slate-200 flex items-center justify-center">
                      <img src={a.url} alt={a.name} className="object-cover h-24 w-full" />
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                        {a.rights}
                      </span>
                      <button
                        onClick={() => {
                          setAssetList(prev => prev.filter(x => x.id !== a.id));
                        }}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                        title="Hapus Asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <button
                        onClick={() => {
                          if (setActiveTab) {
                            setActiveTab('content-studio');
                          }
                          alert(`📌 Asset "${a.name}" berhasil ditautkan ke Creative Studio!\n\nAnda diarahkan ke Creative Studio untuk melengkapi Hook & Caption.`);
                        }}
                        className="px-2 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-rose-700 border border-rose-200 font-semibold text-[10px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        📌 Ke Creative Studio
                      </button>
                      <button
                        onClick={() => {
                          if (setActiveTab) {
                            setActiveTab('gov-approvals');
                          }
                          alert(`🚀 Asset "${a.name}" dan Paket Konten "${selectedCampaign?.name || 'Campaign'}" BERHASIL DIAJUKAN KE REVIEW QUEUE!\n\nAnda diarahkan ke menu 05. REVIEW & PUBLISH (My Review Queue & Approval) untuk peninjauan Fact-Check & Brand Governance.`);
                        }}
                        className="px-2 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-[10px] flex items-center justify-center gap-1 shadow-sm transition-transform hover:scale-105 cursor-pointer"
                      >
                        🚀 Ajukan ke Review
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sequential Workflow Banner */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm mt-6">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2 text-rose-600 font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-rose-500 animate-pulse" />
            LANGKAH WORKFLOW BERJENJANG BERIKUTNYA:
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Draf naskah, storyboard, dan materi konten (04) telah selesai dibuat. Selanjutnya ajukan ke <strong>05. Governance & Publishing</strong> untuk verifikasi Fact-Check, Brand QA, dan Approval resmi.
          </p>
        </div>
        {setActiveTab && (
          <button
            type="button"
            onClick={() => setActiveTab('gov-approvals')}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
          >
            Lanjut ke 05. Governance & Review ➔
          </button>
        )}
      </div>

      {/* Modal: Simpan ke Pipeline Konten Campaign */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200 text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Simpan ke Pipeline Konten Campaign</h3>
                  <p className="text-[11px] text-slate-500">
                    Campaign Target: <strong className="text-rose-600">{selectedCampaign?.name || 'Campaign Aktif'}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSaveModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xs p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveToPipelineSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Judul Konten *</label>
                <input
                  type="text"
                  required
                  value={saveTitle}
                  onChange={e => setSaveTitle(e.target.value)}
                  placeholder="Misal: Edu-Carousel: Smart Space Smart Growth TELPRO"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Platform Media *</label>
                  <select
                    value={savePlatform}
                    onChange={e => setSavePlatform(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Article / Blog">Article / Blog</option>
                    <option value="TikTok">TikTok</option>
                    <option value="YouTube">YouTube</option>
                    <option value="Corporate Website">Corporate Website</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Format Konten *</label>
                  <select
                    value={saveFormat}
                    onChange={e => setSaveFormat(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="Carousel">Carousel</option>
                    <option value="Reels/Shorts">Reels/Shorts</option>
                    <option value="Infographic">Infographic</option>
                    <option value="Article">Article</option>
                    <option value="Video Storyboard">Video Storyboard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Hook Kalimat Pembuka</label>
                <input
                  type="text"
                  value={saveHook}
                  onChange={e => setSaveHook(e.target.value)}
                  placeholder="Kalimat penarik perhatian di 3 detik / slide pertama..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Caption / Teks Utama</label>
                <textarea
                  rows={4}
                  value={saveCaption}
                  onChange={e => setSaveCaption(e.target.value)}
                  placeholder="Isi narasi, poin edukasi utama, atau deskripsi post..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono text-[11px]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-slate-700 font-semibold block flex items-center gap-1">
                    <Edit3 className="w-3 h-3 text-rose-500" /> CTA (Call to Action) & Official Contact *
                  </label>
                  <span className="text-[9px] text-slate-500">Dapat Disesuaikan Manual</span>
                </div>
                <textarea
                  rows={3}
                  value={saveCta}
                  onChange={e => setSaveCta(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs font-mono leading-relaxed"
                  placeholder="Isi CTA & Kontak Resmi..."
                />
                <div className="flex flex-wrap gap-1 pt-1">
                  <button
                    type="button"
                    onClick={() => setSaveCta('Call Center: 1500 473 | WA: +62811 150 4739 (chat only) | Email: info@telpro.co.id | Graha TelkomProperty, Jl. Kebon Sirih No. 10-12, Jakarta Pusat, 10110')}
                    className="px-2 py-0.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-semibold hover:bg-rose-100 cursor-pointer"
                  >
                    📞 Preset Lengkap TELPRO
                  </button>
                  <button
                    type="button"
                    onClick={() => setSaveCta('Call Center: 1500 473 | WA: +62811 150 4739 (chat only) | telpro.co.id')}
                    className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-semibold hover:bg-slate-200 cursor-pointer"
                  >
                    💬 Call Center & WA
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSaveModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  🚀 Simpan ke Pipeline Konten Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
