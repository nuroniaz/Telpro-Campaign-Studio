import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VideoSourceMode, MediaProvider, VideoScene } from '../../types';
import { InteractiveVideoPlayer } from './InteractiveVideoPlayer';
import {
  Video,
  Play,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Lock,
  Layers,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  SlidersHorizontal,
  Film
} from 'lucide-react';

export const AiVideoStudio: React.FC = () => {
  const { videoProjects, updateVideoScene, regenerateSceneMedia, addVideoProject, selectedCampaign, activeUser } = useApp();
  const currentVideoProject = videoProjects[0];

  const [selectedProvider, setSelectedProvider] = useState<MediaProvider>('Veo AI Video Router');
  const [activePreviewScene, setActivePreviewScene] = useState<VideoScene | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handleCreateFreshVideoProject = () => {
    const newProj = {
      id: `vid-${Date.now()}`,
      contentId: `cnt-${Date.now()}`,
      campaignId: selectedCampaign?.id || 'cmp-e2e',
      aspectRatio: '16:9' as const,
      resolution: '4K (2160p)' as const,
      scenes: [
        {
          id: `vsc-1`,
          sceneNumber: 1,
          motionPrompt: 'Camera pan slow across executive control center with digital dashboard HUD overlay',
          providerUsed: 'Veo AI Video Router' as MediaProvider,
          audioTrackUrl: 'bg-ambient-synth-1.mp3',
          voiceOverAudioUrl: 'vo-indonesian-executive-1.mp3',
          reviewStatus: 'Approved' as const,
          thumbnailUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
          consistencyLock: { character: true, style: true, colorGrade: true }
        },
        {
          id: `vsc-2`,
          sceneNumber: 2,
          motionPrompt: 'Dynamic drone fly-through automated smart warehouse facility',
          providerUsed: 'Sora Multi-Modal' as MediaProvider,
          audioTrackUrl: 'bg-ambient-synth-2.mp3',
          voiceOverAudioUrl: 'vo-indonesian-executive-2.mp3',
          reviewStatus: 'Pending' as const,
          thumbnailUrl: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80',
          consistencyLock: { character: true, style: true, colorGrade: false }
        }
      ]
    };
    addVideoProject(newProj);
  };

  if (!currentVideoProject) {
    return (
      <div className="p-8 text-center bg-white border border-slate-200 rounded-3xl space-y-4 shadow-sm my-6">
        <Film className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-900">Belum Ada AI Video Project Aktif</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Buat AI Video Project pertama untuk campaign {selectedCampaign?.name || 'baru'} untuk menguji generative video router & consistency locks.
        </p>
        <button
          onClick={handleCreateFreshVideoProject}
          className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-transform hover:scale-105 cursor-pointer"
        >
          + Buat AI Video Project E2E Baru
        </button>
      </div>
    );
  }

  const handleToggleLock = (scId: string, lockKey: keyof VideoScene['consistencyLock']) => {
    const sc = currentVideoProject.scenes.find(s => s.id === scId);
    if (!sc) return;
    updateVideoScene(currentVideoProject.id, scId, {
      consistencyLock: {
        ...sc.consistencyLock,
        [lockKey]: !sc.consistencyLock[lockKey]
      }
    });
  };

  return (
    <div className="space-y-6 text-xs animate-in fade-in">
      {/* AI Video Studio Header Banner & Router Abstraction */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Video className="w-5 h-5 text-rose-600" />
              AI Video Studio (Scene-by-Scene Generation & Hybrid Media Router)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              "Generate by scene, review by scene, compose as one video" — Mode Hybrid Real Asset + AI
            </p>
          </div>

          {/* Media Generation Provider Router */}
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-semibold text-[11px] flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-cyan-600" /> Router Provider:
            </span>
            <select
              value={selectedProvider}
              onChange={e => setSelectedProvider(e.target.value as MediaProvider)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 font-bold text-[11px] focus:ring-2 focus:ring-rose-500 cursor-pointer"
            >
              <option value="Veo AI Video Router">Veo AI Video Router (Fast Motion)</option>
              <option value="Gemini / Imagen 3">Gemini / Imagen 3 Visual Engine</option>
              <option value="TELPRO Real Asset Repository">TELPRO Real Asset Repository</option>
            </select>
          </div>
        </div>

        {/* Project Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-[11px]">
          <div>
            <span className="text-slate-500 block">Video Project Name:</span>
            <strong className="text-slate-900">{currentVideoProject.title}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Aspect Ratio & Target:</span>
            <strong className="text-cyan-700">{currentVideoProject.aspectRatio} • {currentVideoProject.targetDuration}s Duration</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Status QA Router:</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[10px]">
              {currentVideoProject.status}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Property Truth Guard:</span>
            <span className="text-amber-800 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Active Verification
            </span>
          </div>
        </div>
      </div>

      {/* Video Scenes Generation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {currentVideoProject.scenes.map(sc => (
          <div key={sc.id} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3.5 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-rose-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                  #{sc.sceneNumber}
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-xs">{sc.sourceMode}</h3>
                  <span className="text-[10px] text-slate-500">Durasi: {sc.duration}s • Provider: {sc.provider}</span>
                </div>
              </div>

              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                sc.reviewStatus === 'Approved'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {sc.reviewStatus}
              </span>
            </div>

            {/* Video Clip Player Preview */}
            <InteractiveVideoPlayer
              videoClipUrl={sc.videoClipUrl}
              thumbnailUrl={sc.thumbnailUrl}
              title={`Scene #${sc.sceneNumber} (${sc.sourceMode})`}
              duration={sc.duration}
              badgeText={sc.propertyTruthGuard}
              voiceOverText={sc.prompt}
              className="h-52"
            />

            {/* Consistency Lock Toggles */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-[10px]">
              <div className="font-bold text-slate-700 flex items-center gap-1">
                <Lock className="w-3 h-3 text-cyan-600" /> Consistency Lock (Menjaga Style AI):
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { key: 'brandLock', label: 'Brand Lock' },
                  { key: 'characterLock', label: 'Character Lock' },
                  { key: 'buildingLock', label: 'Building Lock' },
                  { key: 'visualStyleLock', label: 'Visual Style Lock' }
                ].map(item => {
                  const locked = sc.consistencyLock[item.key as keyof VideoScene['consistencyLock']];
                  return (
                    <button
                      key={item.key}
                      onClick={() => handleToggleLock(sc.id, item.key as keyof VideoScene['consistencyLock'])}
                      className={`px-2 py-1 rounded-xl font-semibold border text-left transition-colors flex items-center justify-between cursor-pointer ${
                        locked
                          ? 'bg-cyan-50 text-cyan-800 border-cyan-200'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className="text-[9px] font-bold">{locked ? 'LOCKED' : 'OFF'}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generation Actions & Review Controls */}
            <div className="space-y-2 pt-1 border-t border-slate-100 text-[10px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 truncate max-w-[200px]" title={sc.prompt}>
                  Prompt: "{sc.prompt}"
                </span>
                <button
                  onClick={() => regenerateSceneMedia(currentVideoProject.id, sc.id)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Regenerate Scene Clip
                </button>
              </div>

              {/* Review Actions Bar */}
              <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" /> Review Clip Status:
                  </span>
                  <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold border ${
                    sc.reviewStatus === 'Approved'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : sc.reviewStatus === 'Revision Required'
                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {sc.reviewStatus}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateVideoScene(currentVideoProject.id, sc.id, { reviewStatus: 'Approved' })}
                    className={`flex-1 py-1.5 rounded-xl font-bold text-[10px] transition-all flex items-center justify-center gap-1 border cursor-pointer ${
                      sc.reviewStatus === 'Approved'
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                        : 'bg-white hover:bg-emerald-50 text-slate-700 border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve Clip
                  </button>
                  <button
                    onClick={() => updateVideoScene(currentVideoProject.id, sc.id, { reviewStatus: 'Revision Required' })}
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

      {/* Video Preview Modal */}
      {activePreviewScene && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Preview Clip Scene #{activePreviewScene.sceneNumber}</h3>
              <button
                onClick={() => setActivePreviewScene(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 min-h-[250px] flex items-center justify-center">
              <video
                src={activePreviewScene.videoClipUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'}
                poster={activePreviewScene.thumbnailUrl}
                controls
                autoPlay
                className="w-full h-full max-h-[350px] object-cover rounded-2xl"
              />
            </div>

            <div className="text-[11px] space-y-1 text-slate-600">
              <div><strong className="text-slate-800">Provider AI:</strong> {activePreviewScene.provider}</div>
              <div><strong className="text-slate-800">Truth Guard:</strong> {activePreviewScene.propertyTruthGuard}</div>
              <div><strong className="text-slate-800">Prompt:</strong> {activePreviewScene.prompt}</div>
            </div>

            <button
              onClick={() => setActivePreviewScene(null)}
              className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer"
            >
              Tutup Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
