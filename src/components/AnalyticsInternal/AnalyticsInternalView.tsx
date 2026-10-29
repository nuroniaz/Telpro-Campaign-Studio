import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NavTab } from '../Sidebar';
import {
  BarChart3,
  TrendingUp,
  ShieldAlert,
  Download,
  Lock,
  Users,
  Target,
  Clock,
  Layers,
  Sparkles,
  CheckCircle2,
  Calendar,
  ArrowUpRight,
  BrainCircuit,
  Building2,
  Instagram,
  MessageSquare,
  FileCheck2,
  Compass,
  FileSpreadsheet
} from 'lucide-react';

interface AnalyticsInternalViewProps {
  activeTab?: NavTab;
  setActiveTab?: (tab: NavTab) => void;
}

type InstagramAccount = 'telprodico' | 'telkomproperty';

export const AnalyticsInternalView: React.FC<AnalyticsInternalViewProps> = ({ setActiveTab }) => {
  const { activeUser, regionalSubmissions } = useApp();

  const isRegionalUser = activeUser.role === 'ROLE_REGIONAL_CREATOR';
  const userRegion = activeUser.regionalUnit || 'Regional 1';

  // Regional submissions metrics for the active region
  const myRegionSubs = (regionalSubmissions || []).filter(
    s => s.regional === userRegion || s.picRegional === activeUser.name
  );
  const myApprovedSubs = myRegionSubs.filter(s => s.currentStatus === 'CURATED_APPROVED');
  const myDraftSubs = myRegionSubs.filter(s => s.currentStatus === 'DRAFT');
  const myReviewSubs = myRegionSubs.filter(s => s.currentStatus === 'SUBMITTED' || s.currentStatus === 'UNDER_REVIEW');

  // Initial account selection based on user role
  const defaultAccount: InstagramAccount =
    activeUser.role === 'ROLE_CORCOMM_CREATOR' ? 'telkomproperty' : 'telprodico';

  const [selectedAccount, setSelectedAccount] = useState<InstagramAccount>(defaultAccount);
  const [timeRange, setTimeRange] = useState('30d');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadInternalReport = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  const isDico = selectedAccount === 'telprodico';

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Top Banner with Strictly Confidential Badge & Account Context */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="flex flex-wrap items-center gap-2">
            {isRegionalUser ? (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-extrabold text-[10px] tracking-wider uppercase flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-emerald-400" /> KINERJA KONTEN REGIONAL • {userRegion}
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30 font-black text-[10px] tracking-wider uppercase flex items-center gap-1">
                <Lock className="w-3 h-3 text-rose-400" /> STRICTLY CONFIDENTIAL • INTERNAL ONLY
              </span>
            )}
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 font-mono text-[10px]">
              Fokus: Leads Generation &amp; Inquiries B2B
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-mono text-[10px]">
              {isRegionalUser ? `Akses: ${userRegion} (Regional Creator)` : 'Akses: Marcomm, Corcomm & Regional'}
            </span>
          </div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5 pt-1">
            <Instagram className="w-6 h-6 text-pink-400" />
            {isRegionalUser
              ? `Kinerja Konten & Inbound Leads (${userRegion})`
              : 'Analitik Performa Instagram • Pengukuran Leads'}
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            {isRegionalUser
              ? `Pantau evaluasi performa publikasi resmi Instagram dan efektivitas usulan konten lapangan dari ${userRegion} yang telah dikurasi oleh tim Marcomm & Corcomm Kantor Pusat.`
              : 'Evaluasi perolehan prospek korporasi (MQL/SQL), efektivitas naskah konten, responsivitas inquiry, dan sentimen reputasi. Metrik berorientasi murni pada perolehan prospek (Leads) tanpa transaksi penjualan langsung.'}
          </p>
        </div>

        <div className="flex items-center gap-2 z-10 shrink-0">
          <button
            onClick={handleDownloadInternalReport}
            className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer ring-1 ring-white/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Audit Leads PDF</span>
          </button>
        </div>
      </div>

      {/* Special Context Card for Regional Creator */}
      {isRegionalUser && (
        <div className="p-5 rounded-3xl bg-white border border-emerald-200 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                <Building2 className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Sorotan Kinerja Usulan Konten {userRegion}
                </h3>
                <p className="text-slate-500 text-[11px]">
                  Kontribusi materi kegiatan lapangan Anda terhadap konten kampanye nasional
                </p>
              </div>
            </div>
            {setActiveTab && (
              <button
                type="button"
                onClick={() => setActiveTab('content-schedule')}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <span>Kelola Usulan Konten</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Diajukan</span>
              <span className="text-xl font-black text-slate-900 font-mono">{myRegionSubs.length}</span>
              <span className="text-[10px] text-slate-500 block">Usulan Lapangan</span>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100">
              <span className="text-[10px] font-bold text-emerald-700 uppercase block">Disetujui / Tayang</span>
              <span className="text-xl font-black text-emerald-800 font-mono">{myApprovedSubs.length}</span>
              <span className="text-[10px] text-emerald-600 block">Masuk Planner Nasional</span>
            </div>
            <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-100">
              <span className="text-[10px] font-bold text-amber-700 uppercase block">Sedang Direview</span>
              <span className="text-xl font-black text-amber-800 font-mono">{myReviewSubs.length}</span>
              <span className="text-[10px] text-amber-600 block">Proses Kurasi Pusat</span>
            </div>
            <div className="p-3 rounded-2xl bg-teal-50/70 border border-teal-100">
              <span className="text-[10px] font-bold text-teal-700 uppercase block">Est. Reach Wilayah</span>
              <span className="text-xl font-black text-teal-800 font-mono">42.5K</span>
              <span className="text-[10px] text-teal-600 block">Jangkauan Audiens</span>
            </div>
          </div>
        </div>
      )}

      {downloadSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-sm animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Laporan Evaluasi Leads (@{selectedAccount}) terenkripsi dengan watermark "{activeUser.email} - LEADS CONFIDENTIAL" berhasil diunduh.</span>
        </div>
      )}

      {/* Account Switcher Bar: Marcomm (@telprodico) vs Corcomm (@telkomproperty) */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Pilih Akun Instagram yang Dianalisis:
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Tab @telprodico (Marcomm) */}
            <button
              id="analytics-tab-telprodico"
              type="button"
              onClick={() => setSelectedAccount('telprodico')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2.5 transition-all cursor-pointer border ${
                isDico
                  ? 'bg-teal-600 text-white border-teal-700 shadow-md ring-2 ring-teal-300'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <Instagram className={`w-4 h-4 ${isDico ? 'text-teal-100' : 'text-slate-500'}`} />
              <div className="text-left">
                <div>@telprodico</div>
                <div className={`text-[9px] font-normal ${isDico ? 'text-teal-100' : 'text-slate-400'}`}>
                  Marcomm • Solusi Bisnis &amp; DICO
                </div>
              </div>
              {activeUser.role === 'ROLE_MARCOM_CREATOR' && (
                <span className="ml-1 px-1.5 py-0.2 rounded bg-teal-800 text-[8px] text-teal-200 font-bold uppercase">
                  Akun Anda
                </span>
              )}
            </button>

            {/* Tab @telkomproperty (Corcomm) */}
            <button
              id="analytics-tab-telkomproperty"
              type="button"
              onClick={() => setSelectedAccount('telkomproperty')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2.5 transition-all cursor-pointer border ${
                !isDico
                  ? 'bg-blue-600 text-white border-blue-700 shadow-md ring-2 ring-blue-300'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <Instagram className={`w-4 h-4 ${!isDico ? 'text-blue-100' : 'text-slate-500'}`} />
              <div className="text-left">
                <div>@telkomproperty</div>
                <div className={`text-[9px] font-normal ${!isDico ? 'text-blue-100' : 'text-slate-400'}`}>
                  Corcomm • Korporasi, Holding &amp; ESG
                </div>
              </div>
              {activeUser.role === 'ROLE_CORCOMM_CREATOR' && (
                <span className="ml-1 px-1.5 py-0.2 rounded bg-blue-800 text-[8px] text-blue-200 font-bold uppercase">
                  Akun Anda
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Time range filter & Governance Notice */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 text-[11px] font-medium">Periode Data:</span>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="7d">7 Hari Terakhir</option>
              <option value="30d">30 Hari Terakhir</option>
              <option value="90d">Kuartal Q3 2026</option>
            </select>
          </div>
        </div>
      </div>

      {/* Account Description Banner */}
      <div className={`p-4 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
        isDico
          ? 'bg-teal-50/70 border-teal-200 text-teal-900'
          : 'bg-blue-50/70 border-blue-200 text-blue-900'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white ${
            isDico ? 'bg-teal-600' : 'bg-blue-600'
          }`}>
            {isDico ? 'MD' : 'CP'}
          </div>
          <div>
            <div className="font-extrabold flex items-center gap-1.5">
              <span>{isDico ? 'Instagram Resmi Produk & Layanan: @telprodico' : 'Instagram Resmi Korporat: @telkomproperty'}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                isDico ? 'bg-teal-200 text-teal-800' : 'bg-blue-200 text-blue-800'
              }`}>
                {isDico ? 'Dikelola oleh Marcomm' : 'Dikelola oleh Corcomm'}
              </span>
            </div>
            <p className="text-[11px] opacity-80 mt-0.5">
              {isDico
                ? 'Target: Menghasilkan leads prospek B2B untuk Smart Office, Fasilitas Gedung, IoT Energy, dan Data Center Space.'
                : 'Target: Menghasilkan inquiries pemangku kepentingan korporat, kolaborasi kemitraan BUMN, program ESG, dan liputan media.'}
            </p>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <div className="font-mono font-black text-sm">
            {isDico ? '48.6K Followers' : '92.4K Followers'}
          </div>
          <div className="text-[10px] text-slate-500 font-medium">
            {isDico ? '+2.4K follower baru bulan ini' : '+4.1K follower baru bulan ini'}
          </div>
        </div>
      </div>

      {/* 4 Core Inbound Leads KPIs (Strictly Leads, NO sales/closing) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Leads */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>{isDico ? 'Total B2B Leads Masuk' : 'Total Inquiries Korporat'}</span>
            <span className={`p-1.5 rounded-xl ${isDico ? 'bg-teal-50 text-teal-600' : 'bg-blue-50 text-blue-600'}`}>
              <Users className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {isDico ? '342 Leads' : '186 Inquiries'}
          </div>
          <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> {isDico ? '+31.5% dari bulan lalu' : '+24.2% dari bulan lalu'}
          </div>
        </div>

        {/* KPI 2: Qualified Leads */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>{isDico ? 'Marketing Qualified Leads (MQL)' : 'Verified Stakeholder Leads'}</span>
            <span className="p-1.5 rounded-xl bg-indigo-50 text-indigo-600">
              <FileCheck2 className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {isDico ? '218 Leads (63.7%)' : '142 Entitas (76.3%)'}
          </div>
          <div className="text-[10px] text-indigo-600 font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> Profil instansi &amp; kebutuhan valid
          </div>
        </div>

        {/* KPI 3: Cost per Lead / Positive Index */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>{isDico ? 'Cost per Qualified Lead (CPL)' : 'Indeks Sentimen Korporat'}</span>
            <span className="p-1.5 rounded-xl bg-amber-50 text-amber-600">
              <Target className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {isDico ? 'Rp 48.200 / Lead' : '96.8% Positif'}
          </div>
          <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> {isDico ? '22% lebih efisien dari target' : 'Zero isu reputasi berisiko'}
          </div>
        </div>

        {/* KPI 4: Lead Response Speed */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>{isDico ? 'SLA Respons Inquiries Masuk' : 'Waktu Tindak Lanjut Media'}</span>
            <span className="p-1.5 rounded-xl bg-rose-50 text-rose-600">
              <Clock className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {isDico ? '14 Menit' : '18 Menit'}
          </div>
          <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Target SLA &lt; 30 Menit (Memenuhi Standar)
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Format Effectiveness Matrix in Generating LEADS (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Layers className={`w-4 h-4 ${isDico ? 'text-teal-600' : 'text-blue-600'}`} />
                  Efektivitas Format Konten @{selectedAccount} Menghasilkan Leads
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Jumlah formulir konsultasi &amp; pesan inquiry yang dipicu oleh masing-masing tipe format
                </p>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Database Leads SPARK</span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Carousel */}
              <div className={`p-4 rounded-2xl border space-y-2 ${
                isDico
                  ? 'bg-teal-50/40 border-teal-200'
                  : 'bg-blue-50/40 border-blue-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${isDico ? 'bg-teal-600' : 'bg-blue-600'}`} />
                    <span className="font-extrabold text-slate-900">Carousel (Multi-Slide Educational)</span>
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                      isDico ? 'bg-teal-100 text-teal-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      Tertinggi Konversi Formulir Leads
                    </span>
                  </div>
                  <span className={`font-mono font-bold ${isDico ? 'text-teal-900' : 'text-blue-900'}`}>
                    {isDico ? '154 Leads Masuk' : '78 Kemitraan Masuk'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-600 pt-1">
                  <div>Jangkauan: <strong className="text-slate-800">{isDico ? '194.000' : '142.000'}</strong></div>
                  <div>Save Rate: <strong className="text-emerald-700">{isDico ? '14.2%' : '11.8%'}</strong></div>
                  <div>Klik Tautan Bio: <strong className="text-slate-800">{isDico ? '5.4%' : '4.6%'}</strong></div>
                </div>
              </div>

              {/* Reels / Video */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-600" />
                    <span className="font-extrabold text-slate-900">Reels (Video Tour &amp; Wawancara)</span>
                    <span className="px-1.5 py-0.2 rounded bg-pink-100 text-pink-800 text-[9px] font-bold">
                      Tertinggi Viral Organic Reach
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-800">
                    {isDico ? '112 Leads Masuk' : '62 Inquiries Masuk'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-600 pt-1">
                  <div>Jangkauan: <strong className="text-slate-800">{isDico ? '280.000' : '210.000'}</strong></div>
                  <div>Completion Rate: <strong className="text-slate-800">{isDico ? '68.4%' : '61.2%'}</strong></div>
                  <div>DM Interaksi: <strong className="text-slate-800">{isDico ? '4.1%' : '3.8%'}</strong></div>
                </div>
              </div>

              {/* Single Post */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                    <span className="font-extrabold text-slate-900">Single Post (Pengumuman &amp; Infografis)</span>
                  </div>
                  <span className="font-mono font-bold text-slate-800">
                    {isDico ? '48 Leads Masuk' : '31 Inquiries Masuk'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-600 pt-1">
                  <div>Jangkauan: <strong className="text-slate-800">{isDico ? '98.000' : '85.000'}</strong></div>
                  <div>Save Rate: <strong className="text-slate-800">4.5%</strong></div>
                  <div>Engagement: <strong className="text-slate-800">3.2%</strong></div>
                </div>
              </div>

              {/* Story */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="font-extrabold text-slate-900">Instagram Stories (Sticker Poll &amp; Link CTA)</span>
                  </div>
                  <span className="font-mono font-bold text-slate-800">
                    {isDico ? '28 Leads Masuk' : '15 Inquiries Masuk'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-600 pt-1">
                  <div>Jangkauan 24 Jam: <strong className="text-slate-800">{isDico ? '42.000' : '38.000'}</strong></div>
                  <div>Sticker Tap: <strong className="text-slate-800">19.2%</strong></div>
                  <div>Swipe / Link Tap: <strong className="text-slate-800">5.8%</strong></div>
                </div>
              </div>
            </div>
          </div>

          {/* Inbound Leads Breakdown by Interest Category */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              Kategori Kebutuhan Prospek / Leads yang Masuk ({isDico ? '@telprodico' : '@telkomproperty'})
            </h3>

            <div className="space-y-2.5 text-xs">
              {isDico ? (
                <>
                  <div>
                    <div className="flex items-center justify-between font-semibold text-slate-700 mb-1">
                      <span>1. Sewa Smart Office &amp; Coworking Space Telpro</span>
                      <span className="font-mono font-bold text-teal-700">138 Leads (40.3%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-teal-600 h-full rounded-full" style={{ width: '40.3%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between font-semibold text-slate-700 mb-1">
                      <span>2. Solusi Efisiensi Energi &amp; Green Building IoT DICO</span>
                      <span className="font-mono font-bold text-indigo-700">92 Leads (26.9%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: '26.9%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between font-semibold text-slate-700 mb-1">
                      <span>3. Managed Facility &amp; Asset Maintenance B2B</span>
                      <span className="font-mono font-bold text-sky-700">64 Leads (18.7%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-sky-500 h-full rounded-full" style={{ width: '18.7%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between font-semibold text-slate-700 mb-1">
                      <span>4. Fiber Connection &amp; Data Center Colocation Space</span>
                      <span className="font-mono font-bold text-amber-700">48 Leads (14.1%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: '14.1%' }} />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <div className="flex items-center justify-between font-semibold text-slate-700 mb-1">
                      <span>1. Permohonan Kolaborasi Kemitraan B2B &amp; Vendor Rekanan</span>
                      <span className="font-mono font-bold text-blue-700">72 Inquiries (38.7%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: '38.7%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between font-semibold text-slate-700 mb-1">
                      <span>2. Program Kolaborasi ESG, CSR Lingkungan &amp; BUMN Holding</span>
                      <span className="font-mono font-bold text-emerald-700">54 Inquiries (29.0%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: '29.0%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between font-semibold text-slate-700 mb-1">
                      <span>3. Permintaan Wawancara Eksekutif &amp; Liputan Media PR</span>
                      <span className="font-mono font-bold text-indigo-700">38 Inquiries (20.4%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: '20.4%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between font-semibold text-slate-700 mb-1">
                      <span>4. Employer Branding &amp; Program Magang / Talent Engagement</span>
                      <span className="font-mono font-bold text-purple-700">22 Inquiries (11.9%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full" style={{ width: '11.9%' }} />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Lead Decision Makers & Strategic Recommendations (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Profile of Decision Makers (Leads Origin) */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                Jabatan Pengisi Formulir Leads Masuk
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Profil jabatan pengambil keputusan yang menyampaikan inquiry lewat akun {isDico ? '@telprodico' : '@telkomproperty'}
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex items-center justify-between font-semibold text-slate-700 mb-1">
                  <span>General Affair &amp; Facility Director / Manager</span>
                  <span className="font-mono font-bold text-indigo-700">38%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: '38%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between font-semibold text-slate-700 mb-1">
                  <span>Chief Technology Officer / IT Infrastructure Lead</span>
                  <span className="font-mono font-bold text-teal-700">27%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-teal-600 h-full rounded-full" style={{ width: '27%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between font-semibold text-slate-700 mb-1">
                  <span>Corporate Secretary / Stakeholder Relations BUMN</span>
                  <span className="font-mono font-bold text-blue-700">21%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '21%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between font-semibold text-slate-700 mb-1">
                  <span>Procurement &amp; Vendor Partnership Lead</span>
                  <span className="font-mono font-bold text-slate-600">14%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-slate-400 h-full rounded-full" style={{ width: '14%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* AI Strategic Recommendation Box for Selected Account */}
          <div className={`p-6 rounded-3xl text-white shadow-sm space-y-3 border ${
            isDico
              ? 'bg-gradient-to-br from-teal-950 via-slate-900 to-indigo-950 border-teal-800'
              : 'bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 border-blue-800'
          }`}>
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
              <BrainCircuit className="w-4 h-4" />
              <span>Rekomendasi AI untuk Akun @{selectedAccount}:</span>
            </div>

            <ul className="space-y-2 text-xs text-slate-200 leading-relaxed list-disc list-inside">
              {isDico ? (
                <>
                  <li>
                    <strong>Tingkatkan CTA ke Form Konsultasi Smart Office</strong> pada postingan hari Selasa &amp; Kamis pukul 10:00–12:00 WIB saat aktivitas General Affair B2B paling aktif.
                  </li>
                  <li>
                    Carousel edukasi <em>"Cara Memangkas Biaya Listrik Gedung 30% dengan IoT"</em> terbukti mendatangkan 48 leads berkualitas. Replikasi format ini untuk topik Data Center Hub.
                  </li>
                  <li>
                    Pastikan admin WhatsApp responsif dalam 15 menit agar rasio konversi MQL ke Discovery Call tetap di atas 60%.
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <strong>Fokuskan konten narasi ESG &amp; Dekarbonisasi</strong> karena menyumbang 45% interaksi dari instansi BUMN dan kementerian terkait.
                  </li>
                  <li>
                    Gunakan format Reels pendek berdurasi &lt; 45 detik saat mendokumentasikan kunjungan lapangan direksi guna menjaga completion rate di atas 60%.
                  </li>
                  <li>
                    Pantau mention reputasi di kolom komentar Instagram @telkomproperty setiap pagi untuk mencegah eskalasi isu sebelum ditindaklanjuti tim Corsec.
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
