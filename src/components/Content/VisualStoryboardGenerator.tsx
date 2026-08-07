import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StoryboardMode, ShotType, CameraAngle, CameraMovement, PropertyTruthGuard, StoryboardScene } from '../../types';
import {
  Film,
  Sparkles,
  Camera,
  Layers,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Play,
  Sliders,
  ShieldCheck,
  Video,
  Eye,
  FileText
} from 'lucide-react';

export const VisualStoryboardGenerator: React.FC = () => {
  const { storyboards, updateStoryboardScene, addStoryboardScene, addStoryboard, selectedCampaign, activeUser } = useApp();
  const currentStoryboard = storyboards[0]; // Active storyboard

  const [selectedMode, setSelectedMode] = useState<StoryboardMode>(currentStoryboard?.mode || 'Production Storyboard');
  const [editingSceneId, setEditingSceneId] = useState<string | null>(null);
  const [editVO, setEditVO] = useState<string>('');
  const [editText, setEditText] = useState<string>('');

  const handleCreateFreshStoryboard = () => {
    const newStb = {
      id: `stb-${Date.now()}`,
      contentId: `cnt-${Date.now()}`,
      campaignId: selectedCampaign?.id || 'cmp-e2e',
      mode: 'Production Storyboard' as StoryboardMode,
      scenes: [
        {
          id: `sc-1`,
          sceneNumber: 1,
          visualPrompt: 'C-Level Executive melihat dashboard IoT & Smart Warehouse TELPRO',
          voiceOver: 'Transformasi operasional berbasis presisi data real-time bersama TELPRO.',
          onScreenText: 'TELPRO Smart Solutions 2026',
          reviewStatus: 'Approved' as const,
          generatedImageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: `sc-2`,
          sceneNumber: 2,
          visualPrompt: 'Gudang modern dengan otomatisasi sensor & telemetri pintar',
          voiceOver: 'Tingkatkan efisiensi hingga 35% dan jaminan pemantauan SLA tanpa henti.',
          onScreenText: 'Efisiensi Berkelanjutan • SLA 99.9%',
          reviewStatus: 'Pending' as const,
          generatedImageUrl: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80'
        }
      ]
    };
    addStoryboard(newStb);
  };

  if (!currentStoryboard) {
    return (
      <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl my-6">
        <Sparkles className="w-10 h-10 text-rose-400 mx-auto" />
        <h3 className="text-base font-bold text-white">Belum Ada Visual Storyboard Aktif</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Buat storyboard visual pertama Anda untuk campaign {selectedCampaign?.name || 'baru'} untuk mulai menguji visual frame & voiceover generator.
        </p>
        <button
          onClick={handleCreateFreshStoryboard}
          className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-900/40 transition-transform hover:scale-105"
        >
          + Buat Visual Storyboard E2E Baru
        </button>
      </div>
    );
  }

  const handleStartEdit = (sc: StoryboardScene) => {
    setEditingSceneId(sc.id);
    setEditVO(sc.voiceOver);
    setEditText(sc.onScreenText);
  };

  const handleSaveEdit = (scId: string) => {
    updateStoryboardScene(currentStoryboard.id, scId, {
      voiceOver: editVO,
      onScreenText: editText
    });
    setEditingSceneId(null);
  };

  const handleRegenerateImage = (scId: string) => {
    const timestamp = Date.now();
    updateStoryboardScene(currentStoryboard.id, scId, {
      generatedImageUrl: `https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80&sig=${timestamp}`,
      reviewStatus: 'Pending'
    });
  };

  return (
    <div className="space-y-6 text-xs animate-in fade-in">
      {/* Top Banner & Mode Selector */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Film className="w-5 h-5 text-rose-500" />
              Visual Storyboard Generator (Script-to-Scene Breakdown)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Translasi otomatis script menjadi panel visual storyboard ber-versioning & Property Truth Guard
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold text-[11px]">Mode Storyboard:</span>
            {(['Quick Storyboard', 'Production Storyboard', 'Campaign Visual Board'] as StoryboardMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => setSelectedMode(mode)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all text-[11px] ${
                  selectedMode === mode
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-900/30'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Info Header */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80 text-[11px]">
          <div>
            <span className="text-slate-500 block">Storyboard ID:</span>
            <strong className="text-white">{currentStoryboard.id} (Version #{currentStoryboard.versionNumber})</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Total Scene & Durasi:</span>
            <strong className="text-cyan-400">{currentStoryboard.scenes.length} Scene • {currentStoryboard.scenes.reduce((acc, s) => acc + s.duration, 0)}s Total</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Status QA Storyboard:</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold text-[10px]">
              {currentStoryboard.status}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Property Truth Guard:</span>
            <span className="text-amber-300 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Verified Property Layer
            </span>
          </div>
        </div>
      </div>

      {/* Storyboard Scene Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        {currentStoryboard.scenes.map(sc => (
          <div key={sc.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3.5 relative">
            {/* Header Scene */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-rose-600 text-white font-extrabold flex items-center justify-center text-xs shadow-md">
                  #{sc.sceneNumber}
                </span>
                <div>
                  <h3 className="font-bold text-white text-xs">{sc.sceneObjective}</h3>
                  <span className="text-[10px] text-slate-400">Durasi: {sc.duration} Detik</span>
                </div>
              </div>

              {/* Status & Review Badge */}
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                sc.reviewStatus === 'Approved'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  : 'bg-amber-950 text-amber-300 border-amber-800'
              }`}>
                {sc.reviewStatus}
              </span>
            </div>

            {/* Visual Image Panel */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 group">
              <img
                src={sc.generatedImageUrl || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'}
                alt={`Scene ${sc.sceneNumber}`}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Overlay Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                <span className="px-2 py-0.5 rounded-lg bg-slate-950/80 backdrop-blur-md text-cyan-300 border border-cyan-800/80 text-[9px] font-bold">
                  AI GENERATED — VISUAL REFERENCE
                </span>
                <span className={`px-2 py-0.5 rounded-lg backdrop-blur-md text-[9px] font-bold border ${
                  sc.representationStatus === 'ACTUAL VERIFIED ASSET'
                    ? 'bg-emerald-950/90 text-emerald-300 border-emerald-800'
                    : 'bg-amber-950/90 text-amber-300 border-amber-800'
                }`}>
                  {sc.representationStatus}
                </span>
              </div>

              <button
                onClick={() => handleRegenerateImage(sc.id)}
                className="absolute bottom-2 right-2 px-2.5 py-1.5 rounded-xl bg-slate-950/90 hover:bg-rose-900/90 text-slate-200 border border-slate-700 text-[10px] font-bold transition-all flex items-center gap-1 shadow-md"
              >
                <RotateCcw className="w-3 h-3 text-rose-400" /> Regenerate Visual
              </button>
            </div>

            {/* Camera & Shot Details */}
            <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 text-[10px]">
              <div>
                <span className="text-slate-500 block">Shot Type:</span>
                <strong className="text-slate-300">{sc.shotType}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Angle:</span>
                <strong className="text-slate-300">{sc.cameraAngle}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Movement:</span>
                <strong className="text-slate-300">{sc.cameraMovement}</strong>
              </div>
            </div>

            {/* Voiceover & On-screen Text Editable */}
            {editingSceneId === sc.id ? (
              <div className="space-y-2 p-3 bg-slate-950 rounded-2xl border border-rose-800/50">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Edit Voice Over Script:</label>
                  <textarea
                    rows={2}
                    value={editVO}
                    onChange={e => setEditVO(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-mono text-[10px]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Edit On-Screen Text:</label>
                  <input
                    type="text"
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1 text-white font-mono text-[10px]"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => setEditingSceneId(null)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-[10px]"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => handleSaveEdit(sc.id)}
                    className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold text-[10px]"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-[11px]">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400 font-semibold block text-[10px] mb-0.5">🎙️ Voice Over:</span>
                  <p className="text-slate-200 italic font-mono leading-relaxed">"{sc.voiceOver}"</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400 font-semibold block text-[10px] mb-0.5">📺 On-Screen Text:</span>
                  <p className="text-rose-300 font-bold">{sc.onScreenText}</p>
                </div>
              </div>
            )}

            {/* Footer Action & Review Controls */}
            <div className="space-y-2 pt-2 border-t border-slate-800 text-[10px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Audio: {sc.audioNote}</span>
                <button
                  onClick={() => handleStartEdit(sc)}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors"
                >
                  Edit Details
                </button>
              </div>

              {/* Review Actions Bar */}
              <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" /> Reviewer Decision:
                  </span>
                  <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold border ${
                    sc.reviewStatus === 'Approved'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : sc.reviewStatus === 'Revision Required'
                      ? 'bg-rose-950 text-rose-300 border-rose-800'
                      : 'bg-amber-950 text-amber-300 border-amber-800'
                  }`}>
                    {sc.reviewStatus}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateStoryboardScene(currentStoryboard.id, sc.id, { reviewStatus: 'Approved' })}
                    className={`flex-1 py-1.5 rounded-xl font-bold text-[10px] transition-all flex items-center justify-center gap-1 border ${
                      sc.reviewStatus === 'Approved'
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-900/30'
                        : 'bg-slate-900 hover:bg-emerald-950/60 text-slate-300 border-slate-800 hover:border-emerald-800'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve Scene
                  </button>
                  <button
                    onClick={() => updateStoryboardScene(currentStoryboard.id, sc.id, { reviewStatus: 'Revision Required' })}
                    className={`flex-1 py-1.5 rounded-xl font-bold text-[10px] transition-all flex items-center justify-center gap-1 border ${
                      sc.reviewStatus === 'Revision Required'
                        ? 'bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-900/30'
                        : 'bg-slate-900 hover:bg-amber-950/60 text-slate-300 border-slate-800 hover:border-amber-800'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" /> Request Revision
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
