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
      <div className="p-8 text-center bg-white border border-slate-200 rounded-3xl space-y-4 shadow-sm my-6">
        <Sparkles className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-900">Belum Ada Visual Storyboard Aktif</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Buat storyboard visual pertama Anda untuk campaign {selectedCampaign?.name || 'baru'} untuk mulai menguji visual frame & voiceover generator.
        </p>
        <button
          onClick={handleCreateFreshStoryboard}
          className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-transform hover:scale-105 cursor-pointer"
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
      <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Film className="w-5 h-5 text-rose-500" />
              Visual Storyboard Generator (Script-to-Scene Breakdown)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Translasi otomatis script menjadi panel visual storyboard ber-versioning & Property Truth Guard
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold text-[11px]">Mode Storyboard:</span>
            {(['Quick Storyboard', 'Production Storyboard', 'Campaign Visual Board'] as StoryboardMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => setSelectedMode(mode)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all text-[11px] cursor-pointer ${
                  selectedMode === mode
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Info Header */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-[11px]">
          <div>
            <span className="text-slate-500 block">Storyboard ID:</span>
            <strong className="text-slate-900">{currentStoryboard.id} (Version #{currentStoryboard.versionNumber})</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Total Scene & Durasi:</span>
            <strong className="text-cyan-700">{currentStoryboard.scenes.length} Scene • {currentStoryboard.scenes.reduce((acc, s) => acc + s.duration, 0)}s Total</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Status QA Storyboard:</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[10px]">
              {currentStoryboard.status}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Property Truth Guard:</span>
            <span className="text-amber-800 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Verified Property Layer
            </span>
          </div>
        </div>
      </div>

      {/* Storyboard Scene Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        {currentStoryboard.scenes.map(sc => (
          <div key={sc.id} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3.5 relative">
            {/* Header Scene */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-rose-600 text-white font-extrabold flex items-center justify-center text-xs shadow-xs">
                  #{sc.sceneNumber}
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-xs">{sc.sceneObjective}</h3>
                  <span className="text-[10px] text-slate-500">Durasi: {sc.duration} Detik</span>
                </div>
              </div>

              {/* Status & Review Badge */}
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                sc.reviewStatus === 'Approved'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {sc.reviewStatus}
              </span>
            </div>

            {/* Visual Image Panel */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group">
              <img
                src={sc.generatedImageUrl || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'}
                alt={`Scene ${sc.sceneNumber}`}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Overlay Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                <span className="px-2 py-0.5 rounded-lg bg-white/90 backdrop-blur-md text-cyan-800 border border-cyan-200 text-[9px] font-bold shadow-xs">
                  AI GENERATED — VISUAL REFERENCE
                </span>
                <span className={`px-2 py-0.5 rounded-lg backdrop-blur-md text-[9px] font-bold border shadow-xs ${
                  sc.representationStatus === 'ACTUAL VERIFIED ASSET'
                    ? 'bg-emerald-50/90 text-emerald-800 border-emerald-200'
                    : 'bg-amber-50/90 text-amber-800 border-amber-200'
                }`}>
                  {sc.representationStatus}
                </span>
              </div>

              <button
                onClick={() => handleRegenerateImage(sc.id)}
                className="absolute bottom-2 right-2 px-2.5 py-1.5 rounded-xl bg-white/90 hover:bg-rose-50 text-slate-700 border border-slate-200 text-[10px] font-bold transition-all flex items-center gap-1 shadow-sm cursor-pointer"
              >
                <RotateCcw className="w-3 h-3 text-rose-500" /> Regenerate Visual
              </button>
            </div>

            {/* Camera & Shot Details */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[10px]">
              <div>
                <span className="text-slate-500 block">Shot Type:</span>
                <strong className="text-slate-800">{sc.shotType}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Angle:</span>
                <strong className="text-slate-800">{sc.cameraAngle}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Movement:</span>
                <strong className="text-slate-800">{sc.cameraMovement}</strong>
              </div>
            </div>

            {/* Voiceover & On-screen Text Editable */}
            {editingSceneId === sc.id ? (
              <div className="space-y-2 p-3 bg-slate-50 rounded-2xl border border-rose-200">
                <div>
                  <label className="text-[10px] text-slate-600 block mb-0.5">Edit Voice Over Script:</label>
                  <textarea
                    rows={2}
                    value={editVO}
                    onChange={e => setEditVO(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-900 font-mono text-[10px]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-600 block mb-0.5">Edit On-Screen Text:</label>
                  <input
                    type="text"
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1 text-slate-900 font-mono text-[10px]"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => setEditingSceneId(null)}
                    className="px-2.5 py-1 rounded-lg bg-slate-200 text-slate-700 text-[10px] cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => handleSaveEdit(sc.id)}
                    className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold text-[10px] cursor-pointer"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-[11px]">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-semibold block text-[10px] mb-0.5">🎙️ Voice Over:</span>
                  <p className="text-slate-800 italic font-mono leading-relaxed">"{sc.voiceOver}"</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-semibold block text-[10px] mb-0.5">📺 On-Screen Text:</span>
                  <p className="text-rose-700 font-bold">{sc.onScreenText}</p>
                </div>
              </div>
            )}

            {/* Footer Action & Review Controls */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-[10px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Audio: {sc.audioNote}</span>
                <button
                  onClick={() => handleStartEdit(sc)}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors cursor-pointer"
                >
                  Edit Details
                </button>
              </div>

              {/* Review Actions Bar */}
              <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-500" /> Reviewer Decision:
                  </span>
                  <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold border ${
                    sc.reviewStatus === 'Approved'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : sc.reviewStatus === 'Revision Required'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {sc.reviewStatus}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateStoryboardScene(currentStoryboard.id, sc.id, { reviewStatus: 'Approved' })}
                    className={`flex-1 py-1.5 rounded-xl font-bold text-[10px] transition-all flex items-center justify-center gap-1 border cursor-pointer ${
                      sc.reviewStatus === 'Approved'
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                        : 'bg-white hover:bg-emerald-50 text-slate-700 border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve Scene
                  </button>
                  <button
                    onClick={() => updateStoryboardScene(currentStoryboard.id, sc.id, { reviewStatus: 'Revision Required' })}
                    className={`flex-1 py-1.5 rounded-xl font-bold text-[10px] transition-all flex items-center justify-center gap-1 border cursor-pointer ${
                      sc.reviewStatus === 'Revision Required'
                        ? 'bg-amber-600 text-white border-amber-500 shadow-xs'
                        : 'bg-white hover:bg-amber-50 text-slate-700 border-slate-200 hover:border-amber-300'
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
