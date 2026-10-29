import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, Sparkles, Film } from 'lucide-react';

interface InteractiveVideoPlayerProps {
  videoClipUrl?: string;
  thumbnailUrl?: string;
  title?: string;
  duration?: number; // seconds
  aspectRatio?: '9:16' | '16:9' | '1:1';
  badgeText?: string;
  voiceOverText?: string;
  className?: string;
}

export const InteractiveVideoPlayer: React.FC<InteractiveVideoPlayerProps> = ({
  videoClipUrl,
  thumbnailUrl,
  title,
  duration = 5,
  aspectRatio = '16:9',
  badgeText,
  voiceOverText,
  className = ''
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [useSimulationMode, setUseSimulationMode] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  // Timer interval for simulation mode or video sync
  useEffect(() => {
    let timer: any = null;
    if (isPlaying && (useSimulationMode || hasError)) {
      timer = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.1;
        });
      }, 100);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, useSimulationMode, hasError, duration]);

  const handleTogglePlay = async () => {
    if (isPlaying) {
      if (videoRef.current && !useSimulationMode && !hasError) {
        videoRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      if (videoRef.current && !useSimulationMode && !hasError) {
        try {
          videoRef.current.muted = isMuted;
          await videoRef.current.play();
          setIsPlaying(true);
        } catch (err) {
          console.warn("HTML5 Video Play failed, falling back to interactive motion player mode:", err);
          setUseSimulationMode(true);
          setIsPlaying(true);
        }
      } else {
        setIsPlaying(true);
      }
    }
  };

  const handleVideoError = () => {
    console.warn("Video failed to load from URL, switching to Interactive Motion Graphic Player");
    setHasError(true);
    setUseSimulationMode(true);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && !useSimulationMode && !hasError) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleToggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (videoRef.current) {
      videoRef.current.muted = newMuted;
    }
  };

  const formatTime = (timeInSec: number) => {
    const mins = Math.floor(timeInSec / 60);
    const secs = Math.floor(timeInSec % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = Math.min(100, Math.max(0, (currentTime / (duration || 5)) * 100));

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group shadow-md ${className}`}>
      {/* Video element or Simulated Motion Image */}
      {!useSimulationMode && !hasError ? (
        <video
          ref={videoRef}
          src={videoClipUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'}
          poster={thumbnailUrl}
          playsInline
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onError={handleVideoError}
          className="w-full h-full object-cover min-h-[200px]"
        />
      ) : (
        /* Motion Graphic Simulation View */
        <div className="relative w-full h-full min-h-[220px] bg-slate-100 overflow-hidden flex items-center justify-center">
          <img
            src={thumbnailUrl || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'}
            alt="Video Frame"
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isPlaying ? 'scale-110 brightness-105' : 'scale-100 brightness-90'
            }`}
          />

          {/* Dynamic Motion Scanline Overlay when Playing */}
          {isPlaying && (
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-rose-500/20 pointer-events-none animate-pulse">
              <div className="absolute inset-x-0 h-1 bg-cyan-400/50 shadow-lg shadow-cyan-400/50 animate-bounce top-1/3" />
            </div>
          )}

          {/* Simulated On-Screen Captions */}
          {voiceOverText && isPlaying && (
            <div className="absolute bottom-12 inset-x-4 bg-white/95 backdrop-blur-md p-2 rounded-xl border border-rose-200 text-center text-slate-900 font-bold text-[11px] shadow-sm animate-in fade-in">
              🗣️ "{voiceOverText}"
            </div>
          )}
        </div>
      )}

      {/* Top Overlay Badge */}
      {badgeText && (
        <div className="absolute top-2 left-2 pointer-events-none z-10">
          <span className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-cyan-800 border border-cyan-200 text-[10px] font-bold shadow-xs">
            {badgeText}
          </span>
        </div>
      )}

      {/* Center Big Play Button Overlay if Paused */}
      {!isPlaying && (
        <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[1px] flex items-center justify-center transition-opacity z-10">
          <button
            onClick={handleTogglePlay}
            className="p-4 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-xl shadow-rose-600/40 transition-all hover:scale-110 flex items-center justify-center cursor-pointer"
          >
            <Play className="w-6 h-6 fill-white ml-0.5" />
          </button>
        </div>
      )}

      {/* Bottom Custom Playback Bar & Controls */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-transparent p-3 space-y-1.5 z-20">
        {/* Progress Bar */}
        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const newPct = clickX / rect.width;
            const newTime = newPct * (duration || 5);
            setCurrentTime(newTime);
            if (videoRef.current && !useSimulationMode && !hasError) {
              videoRef.current.currentTime = newTime;
            }
          }}
          className="w-full h-1.5 bg-white/30 hover:h-2 transition-all rounded-full cursor-pointer relative overflow-hidden"
        >
          <div
            className="h-full bg-gradient-to-r from-rose-500 to-cyan-400 rounded-full transition-all duration-100"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between text-[10px] text-white font-bold">
          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePlay}
              className="p-1.5 rounded-lg bg-white/20 hover:bg-rose-600 text-white transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            </button>

            <button
              onClick={handleToggleMute}
              className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-amber-300" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-300" />}
            </button>

            <span className="font-mono text-cyan-200">
              {formatTime(currentTime)} / {formatTime(duration || 5)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isPlaying && (
              <span className="flex items-center gap-1 text-emerald-300 text-[9px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> PLAYING
              </span>
            )}
            {title && <span className="text-white/80 truncate max-w-[120px]">{title}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
