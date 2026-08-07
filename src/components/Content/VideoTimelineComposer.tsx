import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { InteractiveVideoPlayer } from './InteractiveVideoPlayer';
import {
  SlidersHorizontal,
  Play,
  Pause,
  Music,
  FileText,
  Video,
  Sparkles,
  CheckCircle2,
  Volume2,
  Clock,
  Layers,
  Send,
  Download,
  Film
} from 'lucide-react';

export const VideoTimelineComposer: React.FC = () => {
  const { videoProjects, addVideoProject, selectedCampaign, activeUser, addAuditLog } = useApp();
  const project = videoProjects[0];

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeSceneIdx, setActiveSceneIdx] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleCreateProject = () => {
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
          motionPrompt: 'Camera pan slow across executive control center',
          providerUsed: 'Veo AI Video Router' as const,
          audioTrackUrl: 'bg-ambient-synth-1.mp3',
          voiceOverAudioUrl: 'vo-indonesian-executive-1.mp3',
          reviewStatus: 'Approved' as const,
          thumbnailUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
          consistencyLock: { character: true, style: true, colorGrade: true }
        }
      ]
    };
    addVideoProject(newProj);
  };

  if (!project) {
    return (
      <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl my-6">
        <Film className="w-10 h-10 text-rose-400 mx-auto" />
        <h3 className="text-base font-bold text-white">Belum Ada Timeline Studio Project</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Proyek video timeline composer akan otomatis muncul ketika ada AI video project aktif.
        </p>
        <button
          onClick={handleCreateProject}
          className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-900/40 transition-transform hover:scale-105"
        >
          + Buat Project Timeline E2E Baru
        </button>
      </div>
    );
  }

  const activeScene = project.scenes[activeSceneIdx] || project.scenes[0];

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleSelectScene = (index: number) => {
    setActiveSceneIdx(index);
    setIsPlaying(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play();
      }
    }, 50);
  };

  const handleExportDraft = () => {
    addAuditLog({
      actorName: activeUser.name,
      actorRole: activeUser.role,
      action: 'EXPORT_VIDEO_TIMELINE_DRAFT',
      entityName: 'VideoProject',
      entityId: project.id,
      sourceSystem: 'Video Timeline & Composer'
    });
    alert(`Draft Video "${project.title}" berhasil di-render dan disimpan untuk proses Governance & Fact-Check Approval!`);
  };

  return (
    <div className="space-y-6 text-xs animate-in fade-in">
      {/* Top Banner */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-rose-500" />
            Video Timeline & Composer (Nonlinear Composition & Layering)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Visual Track + Audio Track + Text/Subtitle Track — Penggabungan elemen real footage & AI generated video
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportDraft}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-rose-900/30 transition-all hover:scale-105"
          >
            <Send className="w-4 h-4" /> Simpan Draft & Kirim ke QA Approval
          </button>
        </div>
      </div>

      {/* Main Composer Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Player & Interactive Timeline */}
        <div className="lg:col-span-2 space-y-5">
          {/* Main Video Monitor Preview */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <InteractiveVideoPlayer
              key={activeScene?.id}
              videoClipUrl={activeScene?.videoClipUrl}
              thumbnailUrl={activeScene?.thumbnailUrl}
              title={`Active Scene #${activeScene?.sceneNumber}: ${activeScene?.sourceMode}`}
              duration={activeScene?.duration || 5}
              badgeText={`Active Scene #${activeScene?.sceneNumber}`}
              voiceOverText={`Delay Kargo = Margin Tergerus 🛑 — ${activeScene?.prompt}`}
              className="aspect-video"
            />
          </div>

          {/* Timeline Multi-Track Editor */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h3 className="font-bold text-white text-xs border-b border-slate-800 pb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" /> Multi-Track Layering & Alignment (Klik Clip untuk Play)
            </h3>

            {/* Track 1: Visual Track */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                <span className="flex items-center gap-1"><Video className="w-3.5 h-3.5 text-rose-400" /> Track 1: Visual Clips (Real + AI)</span>
                <span>4 Clips • 18s</span>
              </div>

              <div className="grid grid-cols-4 gap-2 bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
                {project.scenes.map((sc, idx) => (
                  <button
                    key={sc.id}
                    onClick={() => handleSelectScene(idx)}
                    className={`p-2.5 rounded-xl border text-left transition-all space-y-1 ${
                      activeSceneIdx === idx
                        ? 'bg-rose-950/80 border-rose-500 shadow-md ring-1 ring-rose-500'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold">
                      <span className="text-rose-300">#Scene {sc.sceneNumber}</span>
                      <span className="text-rose-400">{sc.duration}s</span>
                    </div>
                    <div className="text-[10px] font-bold text-white truncate">{sc.sourceMode}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Track 2: Audio Track */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                <span className="flex items-center gap-1"><Music className="w-3.5 h-3.5 text-emerald-400" /> Track 2: Voice Over & Commercial Music</span>
                <span>2 Audio Layers</span>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 space-y-1.5 text-[10px]">
                <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 font-bold flex items-center justify-between">
                  <span>🎙️ Voice Over: Indonesian Male Corporate Voice (0s - 18s)</span>
                  <span>100% Vol</span>
                </div>
                <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-800/80 text-cyan-300 font-bold flex items-center justify-between">
                  <span>🎵 Background Music: Corporate Precision Motion Synth (120BPM)</span>
                  <span>45% Vol</span>
                </div>
              </div>
            </div>

            {/* Track 3: Text & Subtitle Track */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-amber-400" /> Track 3: Subtitles & On-Screen Overlay</span>
                <span>Synced Subtitles</span>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 text-[10px] text-amber-300 font-bold">
                💬 Auto-Generated Subtitles (Synced with Voice Over Track)
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Composition Inspector */}
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3.5 text-xs">
            <h3 className="font-bold text-white border-b border-slate-800 pb-2">Composition Properties</h3>

            <div className="space-y-2">
              <div>
                <span className="text-slate-500 block text-[10px]">Target Platform:</span>
                <span className="text-white font-bold">Instagram Reels & TikTok (9:16 Vertical)</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px]">Total Duration:</span>
                <span className="text-cyan-400 font-bold font-mono">18 Detik Exact</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px]">Audio Rights Clearance:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approved Commercial Library
                </span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px]">Fact Check Status:</span>
                <span className="text-amber-300 font-bold">Awaiting Fact Check QA</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 text-xs">
            <h3 className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-rose-400" /> Auto-Polish Video
            </h3>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Gunakan TELPRO AI Composer untuk menyesuaikan tempo transitions dan menyeimbangkan volume audio otomatis.
            </p>
            <button
              onClick={() => alert("Auto-polish audio & transition balancing berhasil diterapkan!")}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 font-bold border border-rose-900/60 transition-colors"
            >
              Terapkan AI Audio-Video Balancing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
