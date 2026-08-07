import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ContentItem, ContentVersion } from '../../types';
import { NavTab } from '../Sidebar';
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
  Bot
} from 'lucide-react';

interface ContentProductionViewProps {
  activeTab?: NavTab;
  setActiveTab?: (tab: NavTab) => void;
}

export const ContentProductionView: React.FC<ContentProductionViewProps> = ({ activeTab }) => {
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

  let contentTab: 'aipartner' | 'studio' | 'discoverability' | 'creativetrend' | 'production' | 'assets' = 'aipartner';
  if (activeTab === 'content-studio') contentTab = 'studio';
  else if (activeTab === 'content-discoverability') contentTab = 'discoverability';
  else if (activeTab === 'content-creativetrend') contentTab = 'creativetrend';
  else if (activeTab === 'content-production') contentTab = 'production';
  else if (activeTab === 'content-assets') contentTab = 'assets';
  else if (activeTab === 'content-aipartner') contentTab = 'aipartner';

  // AI Chat input
  const [chatInput, setChatInput] = useState('');

  // Creative Studio selected content
  const [selectedContentId, setSelectedContentId] = useState<string>(contents[0]?.id || '');
  const activeContent = contents.find(c => c.id === selectedContentId) || contents[0];
  const activeVersion = contentVersions.find(v => v.id === activeContent?.currentVersionId) || contentVersions[0];

  // Studio form states for editing draft version
  const [editHook, setEditHook] = useState(activeVersion?.hook || '');
  const [editCaption, setEditCaption] = useState(activeVersion?.caption || '');
  const [editScript, setEditScript] = useState(activeVersion?.script || '');
  const [editCta, setEditCta] = useState(activeVersion?.cta || '');

  // Handle Apply AI Action directly from chat message
  const handleApplyAIAction = (actionType: string) => {
    if (!activeContent) return;

    if (actionType.includes('Caption') || actionType.includes('Brief') || actionType.includes('Hook')) {
      applyAIGeneratedContent(activeContent.id, {
        hook: editHook || activeVersion?.hook || 'AI Generated Hook',
        caption: editCaption || activeVersion?.caption || 'AI Generated Caption Draft',
        script: editScript || activeVersion?.script || 'AI Script',
        cta: editCta || activeVersion?.cta || 'Hubungi TELPRO Sales',
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-500" />
            Content & Production (Agentic AI Collaboration)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">TELPRO AI Content Partner, Creative Studio, Discoverability, Creative Trend, & Asset Library</p>
        </div>
      </div>

      {/* Tab 1: TELPRO AI Content Partner (Multi-turn Chat & Context Panel) */}
      {contentTab === 'aipartner' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
          {/* Left Area (2 Cols): AI Multi-turn Chat */}
          <div className="lg:col-span-2 flex flex-col h-[640px] rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-white">TELPRO AI Content Partner</h2>
                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Evidence-Aware Reasoning Mode Active
                  </span>
                </div>
              </div>

              <button
                onClick={clearAIChat}
                className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-700"
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
                    className={`max-w-[85%] p-4 rounded-3xl text-xs space-y-2 leading-relaxed shadow-lg ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-br-none'
                        : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* AI Collapsible Sources & Risk Metadata */}
                    {msg.sender === 'ai' && (
                      <div className="pt-2 border-t border-slate-800/80 space-y-2 text-[10px]">
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="flex items-start gap-1 text-slate-400">
                            <FileCheck className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                            <span>Sources: <strong className="text-slate-300">{msg.sources.join(', ')}</strong></span>
                          </div>
                        )}

                        {msg.risks && msg.risks.length > 0 && (
                          <div className="flex items-start gap-1 text-amber-300 bg-amber-950/40 p-2 rounded-xl border border-amber-800/40">
                            <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                            <span>Risk Check: {msg.risks.join('; ')}</span>
                          </div>
                        )}

                        {/* Suggested Actions (Explicit Apply Buttons) */}
                        {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                          <div className="pt-2 flex flex-wrap gap-1.5">
                            {msg.suggestedActions.map((act, i) => (
                              <button
                                key={i}
                                onClick={() => handleApplyAIAction(act.type)}
                                className="px-2.5 py-1 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-800/60 font-semibold text-[10px] transition-colors flex items-center gap-1 shadow-sm"
                              >
                                <Sparkles className="w-2.5 h-2.5 text-rose-400" />
                                {act.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isAILoading && (
                <div className="flex items-center gap-2 text-xs text-rose-400 bg-slate-950 p-3 rounded-2xl border border-slate-800 w-fit animate-pulse">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  TELPRO AI sedang menganalisis context, evidence, & menyusun rekomendasi...
                </div>
              )}
            </div>

            {/* Chat Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Tanyakan ide angle, riset evidence, atau buatkan caption & storyboard..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <button
                type="submit"
                disabled={isAILoading}
                className="p-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold hover:scale-105 transition-all shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Column (1 Col): Content Context Panel */}
          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 text-xs">
              <h3 className="font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                <Target className="w-4 h-4 text-rose-400" />
                Active Context Memory
              </h3>

              <div>
                <span className="text-slate-500 font-semibold block">Campaign:</span>
                <span className="text-slate-200 font-bold">{selectedCampaign?.name}</span>
              </div>

              <div>
                <span className="text-slate-500 font-semibold block">Business Objective:</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">{selectedCampaign?.businessObjective}</p>
              </div>

              <div>
                <span className="text-slate-500 font-semibold block">Target Audience:</span>
                <span className="text-slate-300">{selectedCampaign?.audience}</span>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-slate-500 font-semibold block mb-1">Evidence Pack Terkait:</span>
                <div className="p-2 rounded-xl bg-slate-950 text-[10px] text-slate-300 border border-slate-800">
                  {evidences[0]?.sourceTitle} (Confidence {evidences[0]?.confidenceScore}%)
                </div>
              </div>
            </div>

            {/* Quick Prompts */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 text-xs">
              <h3 className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
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
                    className="w-full text-left p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] transition-colors"
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
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <h2 className="text-sm font-bold text-white">Pilih Paket Konten</h2>
            <div className="space-y-2 text-xs">
              {contents.map(cnt => (
                <button
                  key={cnt.id}
                  onClick={() => {
                    setSelectedContentId(cnt.id);
                    const ver = contentVersions.find(v => v.id === cnt.currentVersionId);
                    if (ver) {
                      setEditHook(ver.hook);
                      setEditCaption(ver.caption);
                      setEditScript(ver.script);
                      setEditCta(ver.cta);
                    }
                  }}
                  className={`w-full text-left p-3 rounded-2xl border transition-all ${
                    cnt.id === activeContent?.id
                      ? 'bg-rose-950/60 border-rose-500/80 text-white font-semibold shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="text-slate-400">{cnt.platform}</span>
                    <span className="text-rose-400 font-mono font-bold">#{cnt.currentVersionId}</span>
                  </div>
                  <div className="font-bold line-clamp-2">{cnt.title}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Center & Right Column (2 Cols): Creative Studio Editor */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-white">{activeContent?.title}</h2>
                <p className="text-xs text-slate-400">Current Canonical Version: <strong className="text-rose-400">#{activeContent?.currentVersionId}</strong></p>
              </div>
              <button
                onClick={() => handleApplyAIAction('Caption & Hook Update')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-rose-900/30"
              >
                <Sparkles className="w-4 h-4" /> Simpan Versi Baru (+1)
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Hook Kalimat Pembuka *</label>
                <input
                  type="text"
                  value={editHook}
                  onChange={e => setEditHook(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Caption Lengkap & Paragraf Penutup *</label>
                <textarea
                  rows={6}
                  value={editCaption}
                  onChange={e => setEditCaption(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Script Video / Storyboard Flow *</label>
                <textarea
                  rows={4}
                  value={editScript}
                  onChange={e => setEditScript(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Call to Action (CTA) *</label>
                <input
                  type="text"
                  value={editCta}
                  onChange={e => setEditCta(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Discoverability Optimizer */}
      {contentTab === 'discoverability' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl animate-in fade-in text-xs">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Target className="w-4 h-4 text-cyan-400" />
            Discoverability Optimizer (Search & Social SEO)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-bold block">Primary & Secondary Keywords:</span>
              <div className="flex flex-wrap gap-1.5">
                {['Smart Warehouse', 'TELPRO IoT', 'Efisiensi Logistik', 'IndiHome Dedicated WiFi', 'SLA 99.9%'].map(kw => (
                  <span key={kw} className="px-2.5 py-1 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-800 font-medium">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400 font-bold block">Recommended Hashtag Set:</span>
              <div className="flex flex-wrap gap-1.5">
                {['#TELPRO2026', '#SmartWarehouse', '#SupplyChainID', '#IndiHomeBusiness', '#InovasiB2B'].map(tag => (
                  <span key={tag} className="px-2.5 py-1 rounded-xl bg-rose-950 text-rose-300 border border-rose-800 font-medium">
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
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl animate-in fade-in text-xs">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <SlidersHorizontal className="w-4 h-4 text-purple-400" />
            Creative Trend Optimizer & Pattern Recommendations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-purple-300 font-bold block">Rekomendasi Pattern Hook Video:</span>
              <p className="text-slate-300">Gunakan visual "Perbandingan Masalah Sebelum vs Sesudah Solusi" dalam 3 detik pertama untuk meningkatkan retention rate hingga 40%.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-purple-300 font-bold block">Rekomendasi Audio Commercial Safe:</span>
              <p className="text-slate-300">Corporate Precision Motion Synth 120BPM (Terverifikasi Hak Komersial Resmi Telkom Group Library).</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Production Plan */}
      {contentTab === 'production' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl animate-in fade-in text-xs">
          <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3">Production Plan & Shot List</h2>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="font-bold text-white">Shot List Rencana Syuting Video Smart Warehouse TELPRO:</div>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li>Shot 01: Wide shot suasana gudang logistik sibuk (B-roll)</li>
              <li>Shot 02: Close up pemasangan sensor IoT TELPRO pada rak gudang</li>
              <li>Shot 03: Medium shot staf memantau Dashboard TELPRO di tablet</li>
              <li>Shot 04: Closing logo TELPRO 2026 & contact sales</li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 6: Asset Library */}
      {contentTab === 'assets' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl animate-in fade-in text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white">Asset Library & Google Drive Repository</h2>
              <p className="text-xs text-slate-400">Sinkronisasi langsung dengan folder resmi Google Drive TELPRO</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold">
              Drive Synced Live
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { name: 'TELPRO Brand Logo Pack 2026.zip', type: 'Brand Asset', rights: 'Verified' },
              { name: 'Dashboard Smart Warehouse UI Render.png', type: 'Product Asset', rights: 'Verified' },
              { name: 'Audio Synth Commercial License.wav', type: 'Licensed Audio', rights: 'Verified' }
            ].map(a => (
              <div key={a.name} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-bold text-white truncate">{a.name}</div>
                <div className="text-[10px] text-slate-400">{a.type} • {a.rights}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
