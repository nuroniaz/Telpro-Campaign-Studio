import React from 'react';
import { NavTab } from '../Sidebar';
import {
  LayoutDashboard,
  Target,
  Compass,
  Sparkles,
  ShieldCheck,
  BarChart3,
  ChevronRight
} from 'lucide-react';

interface WorkflowPipelineBarProps {
  currentStage: '01' | '02' | '03' | '04' | '05';
  setActiveTab?: (tab: NavTab) => void;
  titleSuffix?: string;
}

export const WorkflowPipelineBar: React.FC<WorkflowPipelineBarProps> = ({
  currentStage,
  setActiveTab,
  titleSuffix
}) => {
  const stages = [
    {
      id: '01',
      number: '01',
      title: 'BERANDA',
      sub: 'Action Center',
      tab: 'home-dashboard' as NavTab,
      icon: LayoutDashboard,
      activeColor: 'bg-indigo-50 border-indigo-300 text-indigo-900 ring-indigo-300',
      badgeColor: 'bg-indigo-600 text-white',
      textColor: 'text-indigo-700'
    },
    {
      id: '02',
      number: '02',
      title: 'TREN & RISET',
      sub: 'Ide & Sinyal Viral',
      tab: 'intel-topics' as NavTab,
      icon: Compass,
      activeColor: 'bg-sky-50 border-sky-300 text-sky-900 ring-sky-300',
      badgeColor: 'bg-sky-600 text-white',
      textColor: 'text-sky-700'
    },
    {
      id: '03',
      number: '03',
      title: 'STUDIO KONTEN',
      sub: 'Draft & Storyboard',
      tab: 'content-studio' as NavTab,
      icon: Sparkles,
      activeColor: 'bg-rose-50 border-rose-300 text-rose-900 ring-rose-300',
      badgeColor: 'bg-rose-600 text-white',
      textColor: 'text-rose-700'
    },
    {
      id: '04',
      number: '04',
      title: 'REVIEW & JADWAL',
      sub: 'Approval & Kalender',
      tab: 'gov-approvals' as NavTab,
      icon: ShieldCheck,
      activeColor: 'bg-amber-50 border-amber-300 text-amber-900 ring-amber-300',
      badgeColor: 'bg-amber-600 text-white',
      textColor: 'text-amber-700'
    },
    {
      id: '05',
      number: '05',
      title: 'PERFORMA',
      sub: 'Kinerja & Laporan PDF',
      tab: 'perf-content' as NavTab,
      icon: BarChart3,
      activeColor: 'bg-emerald-50 border-emerald-300 text-emerald-900 ring-emerald-300',
      badgeColor: 'bg-emerald-600 text-white',
      textColor: 'text-emerald-700'
    }
  ];

  return (
    <div className="p-3.5 rounded-2xl bg-white/95 border border-slate-200/80 shadow-sm space-y-2 select-none backdrop-blur">
      <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 px-1">
        <span className="flex items-center gap-1.5 text-indigo-600">
          <span className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-rose-500 animate-pulse" />
          <span className="font-mono text-[10px] tracking-wider uppercase text-slate-700">
            Alur Kerja Sederhana Marcom TELPRO (5 Tahap Linear)
          </span>
          {titleSuffix && <span className="text-slate-500 font-normal">• {titleSuffix}</span>}
        </span>
        <span className="text-[10px] font-semibold bg-gradient-to-r from-indigo-50 to-pink-50 text-indigo-800 px-2.5 py-0.5 rounded-full border border-indigo-200">
          ✨ Terkoneksi & Berurutan
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-1">
        {stages.map((st, idx) => {
          const Icon = st.icon;
          const isActive = st.id === currentStage;
          const isPassed = Number(st.id) < Number(currentStage);

          return (
            <button
              key={st.id}
              type="button"
              onClick={() => setActiveTab && setActiveTab(st.tab)}
              className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                isActive
                  ? `${st.activeColor} shadow-md ring-1 scale-[1.01]`
                  : isPassed
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900 hover:border-emerald-300 hover:bg-emerald-50'
                  : 'bg-slate-50/90 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-lg text-[10px] font-black flex items-center justify-center shrink-0 ${
                  isActive
                    ? `${st.badgeColor} shadow-xs`
                    : isPassed
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {isPassed ? '✓' : st.number}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-black tracking-tight truncate ${
                      isActive ? st.textColor : isPassed ? 'text-emerald-800' : 'text-slate-700'
                    }`}
                  >
                    {st.title}
                  </span>
                </div>
                <div className="text-[8px] text-slate-500 truncate leading-none mt-0.5">
                  {st.sub}
                </div>
              </div>

              {idx < stages.length - 1 && (
                <ChevronRight
                  className={`w-3.5 h-3.5 shrink-0 hidden lg:block ${
                    isActive ? st.textColor : 'text-slate-300'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
