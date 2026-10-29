import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NavTab } from '../Sidebar';
import {
  Calendar,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Send,
  Layers,
  MapPin,
  Clock,
  Inbox,
  Filter,
  Eye,
  Settings,
  ChevronRight,
  FileText,
  Workflow,
  HelpCircle,
  TrendingUp,
  BookmarkCheck,
  Share2,
  Edit3
} from 'lucide-react';

interface PrePublishWorkflowViewProps {
  onNavigateTab?: (tab: 'schedule' | 'ai' | 'approval' | 'publish' | 'post-publish' | 'planner-matrix' | 'regional-inbox') => void;
}

export const PrePublishWorkflowView: React.FC<PrePublishWorkflowViewProps> = ({ onNavigateTab }) => {
  const {
    contents,
    regionalSubmissions,
    activeUser,
    selectedCampaign,
    masterTaxonomy
  } = useApp();

  const [activeTab, setActiveTab] = useState<'flowchart' | 'simulator' | 'raci'>('flowchart');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-regional');
  const [simulatorMonth, setSimulatorMonth] = useState('Oktober 2026');
  const [simulatorTheme, setSimulatorTheme] = useState('Transformasi Digital Kawasan Industri & Efisiensi Energi Properti');
  const [isPlanLocked, setIsPlanLocked] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Node definitions matching the Whimsical Diagram + Regional Ingestion agreed standard
  const workflowNodes = [
    {
      id: 'node-start',
      stepNumber: '0.0',
      title: 'Start',
      subtitle: 'Inisiasi Siklus Bulanan',
      actor: 'Sistem SPARK',
      sla: 'Awal Siklus',
      category: 'init',
      color: 'bg-blue-600',
      borderColor: 'border-blue-500',
      description: 'Pemicu awal siklus perencanaan editorial bulanan untuk menyelaraskan kalender komunikasi korporat dan pemasaran.',
      outputs: ['Kalender Periode Baru Dibuka'],
      actionLabel: null,
      actionTarget: null
    },
    {
      id: 'node-regional',
      stepNumber: '0.1',
      title: 'Regional Ingestion (H-14 s/d H-8)',
      subtitle: 'Call for Agenda & Usulan Liputan Lapangan',
      actor: 'Regional 1–5 & Marcomm',
      sla: 'H-14 s/d H-8 Sebelum Bulan Berjalan',
      category: 'regional',
      color: 'bg-emerald-600',
      borderColor: 'border-emerald-500',
      tag: 'Titik Masuk Regional',
      description: 'PIC Regional 1–5 mengajukan inisiatif kegiatan wilayah, berita acara aktivasi, dan agenda lokal. Marcomm melakukan pra-kurasi untuk menyaring topik prioritas yang akan dibawa ke Rapat Editorial.',
      ruleNotes: 'Dual-Track: Jalur 1 (Agenda Bulanan Terjadwal) dibawa ke Rapat Editorial. Jalur 2 (Fast-Track Breaking News) dialokasikan ke Flexible Buffer Slot.',
      outputs: ['Daftar Usulan Terkurasi di Regional Content Inbox', 'Aset Dokumentasi Lapangan'],
      actionLabel: 'Buka Regional Content Inbox',
      actionTarget: 'regional-inbox'
    },
    {
      id: 'node-meeting',
      stepNumber: '1.0',
      title: 'Join Meeting (Editorial Planning)',
      subtitle: 'Rapat Penyelarasan Corcomm & Marcomm',
      actor: 'Corcomm & Marcomm',
      sla: 'Minimal H-7 Sebelum Bulan Berjalan',
      category: 'editorial',
      color: 'bg-indigo-600',
      borderColor: 'border-indigo-500',
      tag: 'Titik Temu Resmi',
      description: 'Pertemuan wajib minimal 1 minggu sebelum bulan baru antara Corcomm (@TelkomProperty) dan Marcomm (@Telprodico) untuk menyatukan agenda dan mengevaluasi hasil kurasi usulan Regional.',
      ruleNotes: 'Wajib dihadiri lead editorial dari kedua fungsi untuk mencegah tumpang tindih pesan dan jadwal tayang.',
      outputs: ['Notulensi Kesepakatan Kalender', 'Alokasi Slot Awal'],
      actionLabel: 'Buka Simulasi Rapat Editorial',
      actionTarget: 'simulator'
    },
    {
      id: 'node-align',
      stepNumber: '2.0',
      title: 'Align Objective & Priority Campaign',
      subtitle: 'Penetapan Sasaran Strategis',
      actor: 'Corcomm & Marcomm Lead',
      sla: 'Sesi Rapat Editorial (H-7)',
      category: 'editorial',
      color: 'bg-indigo-600',
      borderColor: 'border-indigo-500',
      description: 'Menentukan priority product, portfolio solusi, pesan korporasi (ESG/Reputasi), dan kampanye nasional yang akan naik di bulan berjalan.',
      ruleNotes: 'Fokus pada Inbound Leads & Reputasi Korporat B2B (bukan direct hard-selling ritel).',
      outputs: ['Daftar Tema Utama & Key Message Per Pekan'],
      actionLabel: 'Buka Content Planner Matrix',
      actionTarget: 'schedule'
    },
    {
      id: 'node-define',
      stepNumber: '3.0',
      title: 'Define Content List, Format & Schedule',
      subtitle: 'Alokasi Kuota Slot 40:40:20',
      actor: 'Editorial Planner Team',
      sla: 'H-6 s/d H-5',
      category: 'editorial',
      color: 'bg-indigo-600',
      borderColor: 'border-indigo-500',
      description: 'Menyusun butir-butir konten spesifik: judul, kanal (LinkedIn/IG), format (Feed/Reels/Carousel/Story), tanggal tayang, dan alokasi slot sumber:',
      ruleNotes: 'Alokasi Seimbang: ~40% Corcomm (@TelkomProperty), ~40% Marcomm (@Telprodico), ~20% Regional Spotlight (Reg 1–5), serta 1-2 Flexible Buffer Slot.',
      outputs: ['Draft Matriks Content Planner (4 Seksi: Strategy, Content, Execution, Readiness)'],
      actionLabel: 'Kelola Jadwal di Content Planner',
      actionTarget: 'schedule'
    },
    {
      id: 'node-assign',
      stepNumber: '4.0',
      title: 'Assign PIC (Copy / Design / Video)',
      subtitle: 'Penetapan Penanggung Jawab Teknis',
      actor: 'Editor in Chief / Content Lead',
      sla: 'H-5',
      category: 'editorial',
      color: 'bg-indigo-600',
      borderColor: 'border-indigo-500',
      description: 'Menetapkan PIC spesifik untuk setiap butir konten: Copywriter, Graphic Designer, Video Editor, serta narahubung ingest aset dari Regional.',
      ruleNotes: 'PIC bertanggung jawab atas batas waktu penyelesaian draf H-3 sebelum jadwal tayang.',
      outputs: ['Penugasan Terdistribusi di Kalender Kerja'],
      actionLabel: 'Lihat Penugasan PIC',
      actionTarget: 'schedule'
    },
    {
      id: 'node-output',
      stepNumber: '5.0',
      title: '(Output) Monthly Content Planning',
      subtitle: 'Katalog Jadwal Master Terkunci',
      actor: 'Planner Owner & Tim Bersama',
      sla: 'H-4 Sebelum Bulan Berjalan',
      category: 'output',
      color: 'bg-amber-600',
      borderColor: 'border-amber-500',
      tag: 'Dokumen Master Resmi',
      description: 'Dokumen master jadwal konten bulanan terkunci resmi (Single Source of Truth) yang memuat seluruh agenda Corcomm, Marcomm, dan Spotlight Regional.',
      ruleNotes: 'Perubahan setelah tahap ini memerlukan mekanisme revisi struktur berizin (Planner Structure Request).',
      outputs: ['Master Monthly Calendar', 'Daftar Tiket Produksi Siap Dikerjakan'],
      actionLabel: 'Buka Jadwal Terintegrasi',
      actionTarget: 'schedule'
    },
    {
      id: 'node-production',
      stepNumber: '6.0',
      title: 'Content Production',
      subtitle: 'Produksi Aset & Draf Narasi',
      actor: 'Marcomm, Corcomm & AI Studio',
      sla: 'H-4 s/d H-2 Jadwal Tayang',
      category: 'production',
      color: 'bg-purple-600',
      borderColor: 'border-purple-500',
      description: 'Eksekusi pembuatan konten visual, copywriting, video reels, dan carousel:\n1. Production @Telprodico oleh Marcomm\n2. Production @TelkomProperty oleh Corcomm\n3. Pengolahan aset mentah dan berita acara liputan dari Regional 1–5.',
      ruleNotes: 'Memanfaatkan Asisten AI SPARK untuk mempercepat penulisan caption, script reels, dan penyusunan carousel.',
      outputs: ['Draft Konten Lengkap (Visual + Copy + Tagar + Metadata)'],
      actionLabel: 'Buka Studio AI Pembuat Konten',
      actionTarget: 'ai'
    },
    {
      id: 'node-joint-review',
      stepNumber: '7.0',
      title: 'Joint Review & Approval',
      subtitle: 'Review Kolaborasi Marcomm & Corcomm',
      actor: 'Grup Kolaborasi Corcomm & Marcomm',
      sla: 'H-2 Jadwal Tayang',
      category: 'approval',
      color: 'bg-rose-600',
      borderColor: 'border-rose-500',
      tag: 'Grup Kolaborasi Bersama',
      description: 'Review dilakukan bersama di grup kolaborasi Corcomm & Marcomm untuk memastikan ketepatan pesan teknis, brand guideline, keselarasan visual, dan tidak adanya benturan jadwal tayang antar-akun.',
      ruleNotes: 'Kedua perwakilan wajib memberikan tanda persetujuan sebelum diteruskan ke level struktural Corsec.',
      outputs: ['Rekomendasi Lolos Review Gabungan / Catatan Perbaikan Internal'],
      actionLabel: 'Buka Approval Governance',
      actionTarget: 'approval'
    },
    {
      id: 'node-corsec',
      stepNumber: '8.0',
      title: 'Review & Approval VP Corsec',
      subtitle: 'Validasi Kepatuhan & Risiko Korporasi',
      actor: 'VP Corporate Secretary',
      sla: 'H-1 Jadwal Tayang (Maks 12 Jam)',
      category: 'approval',
      color: 'bg-rose-600',
      borderColor: 'border-rose-500',
      description: 'Pemeriksaan aspek legal, reputasi perusahaan, sensitivitas isu publik, serta keselarasan dengan kebijakan pemegang saham dan holding Telkom Group.',
      ruleNotes: 'Catatan kritis dari Corsec wajib ditindaklanjuti sebelum naik ke Direksi.',
      outputs: ['Persetujuan Corsec & Stempel Kepatuhan'],
      actionLabel: 'Cek Antrean Approval Corsec',
      actionTarget: 'approval'
    },
    {
      id: 'node-dirut',
      stepNumber: '9.0',
      title: 'Review & Approval Plt. Dirut',
      subtitle: 'Persetujuan Final Tingkat Direksi',
      actor: 'Plt. Direktur Utama',
      sla: 'H-1 s/d Hari H (Sebelum Publish)',
      category: 'approval',
      color: 'bg-rose-600',
      borderColor: 'border-rose-500',
      tag: 'Otoritas Tertinggi',
      description: 'Persetujuan akhir tingkat Direksi untuk konten strategis bernilai reputasi tinggi, pengumuman korporat, atau kemitraan skala nasional.',
      ruleNotes: 'Jika disetujui, konten otomatis masuk ke status siap tayang.',
      outputs: ['Executive Final Sign-off'],
      actionLabel: 'Cek Antrean Approval Direksi',
      actionTarget: 'approval'
    },
    {
      id: 'node-decision',
      stepNumber: '9.5',
      title: 'Keputusan: Need Review?',
      subtitle: 'Gerbang Verifikasi Akhir',
      actor: 'Reviewer Panel',
      sla: 'Real-time saat Approval',
      category: 'decision',
      color: 'bg-amber-500',
      borderColor: 'border-amber-400',
      description: 'Gerbang keputusan persetujuan:\n- JIKA YES (Perlu Revisi): Konten dialihkan ke "Content Production Revision" lalu dikembalikan ke Joint Review & Approval.\n- JIKA NO (Disetujui): Konten menjadi "Draft Content Ready to Publish".',
      ruleNotes: 'Revisi minor dapat langsung diperbaiki PIC dalam waktu 2 jam.',
      outputs: ['Draft Content Ready to Publish ATAU Tiket Revisi Produksi'],
      actionLabel: 'Buka Antrean Approval',
      actionTarget: 'approval'
    },
    {
      id: 'node-publish',
      stepNumber: '10.0',
      title: 'Content Publish',
      subtitle: 'Penayangan Multi-Kanal Resmi',
      actor: 'Publishing Engine & Social Media Admin',
      sla: 'Sesuai Jadwal Kalender Terkunci',
      category: 'publish',
      color: 'bg-emerald-600',
      borderColor: 'border-emerald-500',
      tag: 'Eksekusi Siap',
      description: 'Penayangan konten ke kanal resmi (@Telprodico atau @TelkomProperty) di LinkedIn, Instagram, Web Portal, dan YouTube secara otomatis sesuai jadwal waktu prima (prime-time).',
      ruleNotes: 'Setelah tayang, konten langsung masuk ke Siklus Pasca-Tayang & Monitoring (Whimsical Closed-Loop Bagian 2.5).',
      outputs: ['Live Public Content', 'ID Pelacakan Monitoring Kinerja'],
      actionLabel: 'Buka Eksekusi Publish',
      actionTarget: 'publish'
    }
  ];

  const selectedNode = workflowNodes.find(n => n.id === selectedNodeId) || workflowNodes[1];

  // Quota calculation for currently active content items
  const quotaStats = React.useMemo(() => {
    const total = contents.length || 1;
    const corcommCount = contents.filter(c => c.contentOwner === 'Corcomm' || c.targetAccount === '@telkomproperty').length;
    const marcommCount = contents.filter(c => c.contentOwner === 'Marcomm' || c.targetAccount === '@telprodico').length;
    const regionalCount = contents.filter(c => c.contentOwner === 'Regional' || c.regionalSubmissionOriginId).length;
    const bufferCount = contents.filter(c => c.category === 'BUFFER_FLEXIBLE').length || 2;

    return {
      total,
      corcommCount,
      corcommPct: Math.round((corcommCount / total) * 100) || 40,
      marcommCount,
      marcommPct: Math.round((marcommCount / total) * 100) || 40,
      regionalCount,
      regionalPct: Math.round((regionalCount / total) * 100) || 20,
      bufferCount
    };
  }, [contents]);

  // Regional Submissions breakdown for the meeting simulator
  const acceptedRegionalSubmissions = regionalSubmissions.filter(
    s => s.currentStatus === 'ACCEPTED' || s.currentStatus === 'CONVERTED TO CONTENT PLAN'
  );
  const pendingRegionalSubmissions = regionalSubmissions.filter(
    s => s.currentStatus === 'SUBMITTED TO MARCOMM'
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Visual Header Banner matching Whimsical Standard */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-slate-950 via-slate-900 to-indigo-950 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30 font-black text-[10px] tracking-wider uppercase flex items-center gap-1">
              <Workflow className="w-3 h-3 text-rose-400" /> WHIMSICAL STANDARD FLOW
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-mono text-[10px] flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400" /> Regional Ingestion H-14 s/d H-8
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 font-mono text-[10px] flex items-center gap-1">
              <Users className="w-3 h-3 text-indigo-400" /> Joint Editorial Corcomm &amp; Marcomm
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 font-mono text-[10px]">
              Alokasi Slot 40:40:20
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2.5">
                <Layers className="w-6 h-6 text-rose-500" />
                Alur Pra-Publish, Editorial Planning &amp; Titik Masuk Regional
              </h2>
              <p className="text-xs text-slate-300 max-w-3xl leading-relaxed mt-1">
                Panduan tata kelola resmi dari pengajuan usulan lapangan Regional 1–5, kurasi terpusat, Rapat Editorial bersama Corcomm &amp; Marcomm, pembagian kuota slot, hingga validasi bertingkat sebelum konten tayang.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onNavigateTab && onNavigateTab('post-publish')}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-white/10"
              >
                <span>Lihat Alur Pasca-Tayang (Bagian 2.5)</span>
                <ChevronRight className="w-3.5 h-3.5 text-rose-400" />
              </button>
            </div>
          </div>
        </div>

        {/* 3 Main View Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-6 pt-4 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => setActiveTab('flowchart')}
            className={`p-3 rounded-2xl text-left transition-all cursor-pointer border flex items-center gap-2.5 ${
              activeTab === 'flowchart'
                ? 'bg-rose-600/30 border-rose-400 text-white shadow-md ring-1 ring-rose-400'
                : 'bg-slate-900/50 hover:bg-slate-800/60 border-slate-800 text-slate-400'
            }`}
          >
            <Workflow className={`w-4 h-4 ${activeTab === 'flowchart' ? 'text-rose-400' : 'text-slate-500'}`} />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Tampilan 1</div>
              <div className="text-xs font-black">Diagram Alur Interaktif Whimsical</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('simulator')}
            className={`p-3 rounded-2xl text-left transition-all cursor-pointer border flex items-center gap-2.5 ${
              activeTab === 'simulator'
                ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-md ring-1 ring-indigo-400'
                : 'bg-slate-900/50 hover:bg-slate-800/60 border-slate-800 text-slate-400'
            }`}
          >
            <Calendar className={`w-4 h-4 ${activeTab === 'simulator' ? 'text-indigo-400' : 'text-slate-500'}`} />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Tampilan 2</div>
              <div className="text-xs font-black">Hub Rapat Editorial &amp; Alokasi Slot</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('raci')}
            className={`p-3 rounded-2xl text-left transition-all cursor-pointer border flex items-center gap-2.5 ${
              activeTab === 'raci'
                ? 'bg-emerald-600/30 border-emerald-400 text-white shadow-md ring-1 ring-emerald-400'
                : 'bg-slate-900/50 hover:bg-slate-800/60 border-slate-800 text-slate-400'
            }`}
          >
            <ShieldCheck className={`w-4 h-4 ${activeTab === 'raci' ? 'text-emerald-400' : 'text-slate-500'}`} />
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Tampilan 3</div>
              <div className="text-xs font-black">Matriks Peran (RACI) &amp; Batas Waktu (SLA)</div>
            </div>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-sm animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          TAB 1: DIAGRAM ALUR INTERAKTIF (WHIMSICAL FLOW PIPELINE)
      ========================================================================= */}
      {activeTab === 'flowchart' && (
        <div className="space-y-6">
          {/* Visual Step Nodes (Horizontal Scrollable / Responsive Pipeline) */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-rose-600" />
                  Peta Tahapan Alur Pra-Publish (Klik salah satu kotak untuk inspeksi rincian)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Menghubungkan input lapangan Regional ➔ Rapat Editorial Bersama ➔ Penugasan PIC ➔ Produksi ➔ Multi-Tier Approval ➔ Siap Tayang.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Regional
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Editorial
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span> Produksi
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span> Approval
                </span>
              </div>
            </div>

            {/* Horizontal Nodes Sequence */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {workflowNodes.map((node) => {
                const isSelected = selectedNodeId === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative group flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/50 shadow-md ring-2 ring-rose-200'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[9px] font-black font-mono uppercase px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                          Tahap {node.stepNumber}
                        </span>
                        {node.tag && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                            node.id === 'node-regional' ? 'bg-emerald-100 text-emerald-800' :
                            node.id === 'node-meeting' ? 'bg-indigo-100 text-indigo-800' :
                            node.id === 'node-output' ? 'bg-amber-100 text-amber-800' :
                            'bg-rose-100 text-rose-800'
                          }`}>
                            {node.tag}
                          </span>
                        )}
                      </div>

                      <h4 className={`text-xs font-black leading-snug transition-colors ${
                        isSelected ? 'text-rose-950' : 'text-slate-900 group-hover:text-rose-600'
                      }`}>
                        {node.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{node.subtitle}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                      <span className="text-slate-500 font-semibold">{node.actor}</span>
                      <span className="text-slate-400 font-mono text-[9px]">{node.sla}</span>
                    </div>

                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-rose-600 absolute -top-1 -right-1 ring-2 ring-white"></span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Inspector for Selected Node */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white font-mono text-[10px] font-bold">
                    TAHAP {selectedNode.stepNumber}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold">
                    Aktor: {selectedNode.actor}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                    Waktu: {selectedNode.sla}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mt-1.5">{selectedNode.title}</h3>
                <p className="text-xs text-slate-500">{selectedNode.subtitle}</p>
              </div>

              {selectedNode.actionLabel && (
                <button
                  type="button"
                  onClick={() => {
                    if (selectedNode.actionTarget === 'simulator') {
                      setActiveTab('simulator');
                    } else if (onNavigateTab && selectedNode.actionTarget) {
                      onNavigateTab(selectedNode.actionTarget as any);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm self-start md:self-auto"
                >
                  <span>{selectedNode.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-rose-400" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px] mb-1">
                    Deskripsi Operasional
                  </h4>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                    {selectedNode.description}
                  </p>
                </div>

                {selectedNode.ruleNotes && (
                  <div>
                    <h4 className="font-bold text-amber-900 uppercase tracking-wider text-[10px] mb-1 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      Aturan Kunci &amp; Standar Kolaborasi
                    </h4>
                    <p className="text-amber-900 bg-amber-50 p-3 rounded-2xl border border-amber-200 leading-relaxed font-medium">
                      {selectedNode.ruleNotes}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Output Resmi Tahap Ini
                  </h4>
                  <ul className="space-y-1.5 text-[11px] text-slate-600">
                    {selectedNode.outputs.map((out, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{out}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {selectedNode.id === 'node-regional' && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1.5">
                    <span className="font-black text-[10px] uppercase block tracking-wider text-emerald-800">
                      💡 Mengapa Regional di Tahap H-14 s/d H-8?
                    </span>
                    <p className="text-[11px] leading-relaxed text-emerald-800">
                      Memberi waktu bagi Marcomm untuk menyaring data teknis, meminta kelengkapan foto/berita acara bila kurang, dan mengunci slot tayang sebelum rapat bulanan dimulai.
                    </p>
                  </div>
                )}

                {selectedNode.id === 'node-meeting' && (
                  <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs space-y-1.5">
                    <span className="font-black text-[10px] uppercase block tracking-wider text-indigo-800">
                      🤝 Format Rapat Editorial Bersama
                    </span>
                    <p className="text-[11px] leading-relaxed text-indigo-800">
                      Dilaksanakan mingguan/bulanan berdurasi 60 menit dengan agenda: Evaluasi bulan lalu, alignment tema baru, dan alokasi slot 40% Corcomm : 40% Marcomm : 20% Regional.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: SIMULASI & HUB RAPAT EDITORIAL BULANAN (JOINT ALIGNMENT)
      ========================================================================= */}
      {activeTab === 'simulator' && (
        <div className="space-y-6">
          {/* Header & Alignment Parameters */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  Hub Penyelarasan Rapat Editorial Corcomm &amp; Marcomm
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Simulasikan atau jalankan penetapan target bulanan, alokasi slot 40:40:20, serta integrasi usulan Regional ke dalam jadwal master.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsPlanLocked(!isPlanLocked);
                    showToast(isPlanLocked ? '🔓 Rencana konten dibuka untuk revisi.' : '🔒 Rencana Konten Bulanan Berhasil Dikunci!');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                    isPlanLocked
                      ? 'bg-amber-600 hover:bg-amber-500 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  <BookmarkCheck className="w-3.5 h-3.5" />
                  <span>{isPlanLocked ? 'Buka Kunci Rencana' : 'Kunci (Output) Monthly Plan'}</span>
                </button>
              </div>
            </div>

            {/* Input Parameter Form */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Bulan Pelaksanaan</label>
                <select
                  value={simulatorMonth}
                  onChange={(e) => setSimulatorMonth(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50"
                >
                  <option value="September 2026">September 2026</option>
                  <option value="Oktober 2026">Oktober 2026</option>
                  <option value="November 2026">November 2026</option>
                  <option value="Desember 2026">Desember 2026</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tema Utama Prioritas Bulanan</label>
                <input
                  type="text"
                  value={simulatorTheme}
                  onChange={(e) => setSimulatorTheme(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                  placeholder="Masukkan fokus kampanye / tema komunikasi bulan ini..."
                />
              </div>
            </div>

            {/* Quota Slot Allocation Tracker (40:40:20 Rule) */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Target Alokasi Slot Konten Bulanan (Aturan 40:40:20):
                </span>
                <span className="text-[11px] text-slate-500 font-mono">Total Rencana: {quotaStats.total} Konten</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-1">
                  <div className="flex items-center justify-between text-indigo-900">
                    <span className="font-bold text-[11px]">Corcomm (@TelkomProperty)</span>
                    <span className="text-xs font-black">{quotaStats.corcommPct}%</span>
                  </div>
                  <div className="text-[10px] text-indigo-700">Target: ~40% (Reputasi, Fasilitas &amp; ESG)</div>
                  <div className="w-full bg-indigo-200 h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${Math.min(quotaStats.corcommPct, 100)}%` }}></div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-1">
                  <div className="flex items-center justify-between text-purple-900">
                    <span className="font-bold text-[11px]">Marcomm (@Telprodico)</span>
                    <span className="text-xs font-black">{quotaStats.marcommPct}%</span>
                  </div>
                  <div className="text-[10px] text-purple-700">Target: ~40% (Solusi B2B, Jaringan, Edukasi)</div>
                  <div className="w-full bg-purple-200 h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="bg-purple-600 h-full rounded-full" style={{ width: `${Math.min(quotaStats.marcommPct, 100)}%` }}></div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                  <div className="flex items-center justify-between text-emerald-900">
                    <span className="font-bold text-[11px]">Regional Spotlight (1–5)</span>
                    <span className="text-xs font-black">{quotaStats.regionalPct}%</span>
                  </div>
                  <div className="text-[10px] text-emerald-700">Target: ~20% (Liputan Lapangan &amp; Kemitraan)</div>
                  <div className="w-full bg-emerald-200 h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${Math.min(quotaStats.regionalPct, 100)}%` }}></div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
                  <div className="flex items-center justify-between text-amber-900">
                    <span className="font-bold text-[11px]">Flexible Buffer Slot</span>
                    <span className="text-xs font-black">{quotaStats.bufferCount} Slot</span>
                  </div>
                  <div className="text-[10px] text-amber-700">Respons Cepat Breaking News Wilayah</div>
                  <div className="w-full bg-amber-200 h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="bg-amber-600 h-full rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Curated Regional Ingestion Ready to be Allocated into Monthly Slots */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <Inbox className="w-4 h-4 text-emerald-600" />
                  Daftar Usulan Liputan Regional Terkurasi (Siap Masuk Jadwal {simulatorMonth})
                </h4>
                <p className="text-[11px] text-slate-500">
                  Usulan yang telah disetujui kurator Marcomm dari H-14 s/d H-8 untuk dialokasikan ke slot mingguan.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {acceptedRegionalSubmissions.length} Usulan Siap Jadwal
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {acceptedRegionalSubmissions.length === 0 ? (
                <div className="p-5 text-center text-xs text-slate-400 border border-dashed rounded-2xl col-span-2">
                  Belum ada usulan regional berstatus ACCEPTED. Buka Regional Content Inbox untuk menyetujui usulan.
                </div>
              ) : (
                acceptedRegionalSubmissions.map((sub) => (
                  <div key={sub.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {sub.regional}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">ID: {sub.id}</span>
                    </div>
                    <h5 className="font-bold text-slate-900 line-clamp-1">{sub.topic}</h5>
                    <p className="text-slate-500 text-[11px] line-clamp-1">Kegiatan: {sub.activity}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[10px]">
                      <span className="text-slate-500">PIC: {sub.picRegional}</span>
                      <span className="font-bold text-indigo-600">Alokasi Target: {sub.brandTarget || '@telprodico'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Locked Output Notice */}
            {isPlanLocked && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-3">
                <BookmarkCheck className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <strong>(Output) Monthly Content Planning Telah Dikunci:</strong> Rencana untuk {simulatorMonth} telah resmi disepakati oleh tim Corcomm &amp; Marcomm. Seluruh butir konten diteruskan ke tahapan Content Production.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: MATRIKS PERAN (RACI) & BATAS WAKTU (SLA)
      ========================================================================= */}
      {activeTab === 'raci' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Matriks Tanggung Jawab RACI (Responsible, Accountable, Consulted, Informed)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Standar kepemilikan peran dan alur eskalasi untuk memastikan tidak ada kekosongan tanggung jawab atau tumpang tindih kewenangan.
              </p>
            </div>

            {/* RACI Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase text-[10px] font-black">
                    <th className="p-3">Tahapan Alur Kerja</th>
                    <th className="p-3">Regional 1–5</th>
                    <th className="p-3">Marcomm (@Telprodico)</th>
                    <th className="p-3">Corcomm (@TelkomProperty)</th>
                    <th className="p-3">VP Corsec</th>
                    <th className="p-3">Plt. Dirut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-bold text-slate-800">1. Usulan Liputan &amp; Aset Lapangan (H-14 s/d H-8)</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">R (Responsible)</span></td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold">A (Accountable - Kurator)</span></td>
                    <td className="p-3 text-slate-400">I (Informed)</td>
                    <td className="p-3 text-slate-300">-</td>
                    <td className="p-3 text-slate-300">-</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-800">2. Editorial Planning Meeting (H-7)</td>
                    <td className="p-3 text-slate-400">I (Informed)</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold">R / A (Co-Lead)</span></td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold">R / A (Co-Lead)</span></td>
                    <td className="p-3 text-slate-500 font-medium">C (Consulted)</td>
                    <td className="p-3 text-slate-300">-</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-800">3. Content List &amp; Calendar Master (H-4)</td>
                    <td className="p-3 text-slate-400">I (Informed)</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold">R (Lead Telprodico)</span></td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold">R (Lead Property)</span></td>
                    <td className="p-3 text-slate-400">I (Informed)</td>
                    <td className="p-3 text-slate-300">-</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-800">4. Produksi Konten (H-4 s/d H-2)</td>
                    <td className="p-3 text-slate-600 font-medium">Suplai Raw Asset</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold">R (Eksekusi Marcomm)</span></td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold">R (Eksekusi Corcomm)</span></td>
                    <td className="p-3 text-slate-300">-</td>
                    <td className="p-3 text-slate-300">-</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-800">5. Joint Review &amp; Approval (H-2)</td>
                    <td className="p-3 text-slate-300">-</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">R (Reviewer Bersama)</span></td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">R (Reviewer Bersama)</span></td>
                    <td className="p-3 text-slate-500 font-medium">C (Consulted)</td>
                    <td className="p-3 text-slate-300">-</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-800">6. Approval VP Corsec &amp; Plt. Dirut (H-1 s/d Hari H)</td>
                    <td className="p-3 text-slate-300">-</td>
                    <td className="p-3 text-slate-400">I (Informed)</td>
                    <td className="p-3 text-slate-400">I (Informed)</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">A (Approver Corsec)</span></td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">A (Approver Dirut)</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-800">7. Publishing &amp; Monitoring (Hari H dst)</td>
                    <td className="p-3 text-slate-400">I (Informed)</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">R (Publishing Engine)</span></td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">R (Publishing Engine)</span></td>
                    <td className="p-3 text-slate-400">I (Informed)</td>
                    <td className="p-3 text-slate-400">I (Informed)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* RACI Legend */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-100 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block">R - Responsible</strong>
                <span className="text-slate-500">Pihak yang mengerjakan tugas secara langsung.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block">A - Accountable</strong>
                <span className="text-slate-500">Pemegang keputusan akhir dan penanggung jawab mutu.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block">C - Consulted</strong>
                <span className="text-slate-500">Pihak yang dimintai masukan atau konfirmasi dua arah.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 block">I - Informed</strong>
                <span className="text-slate-500">Pihak yang menerima pemberitahuan progres satu arah.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
