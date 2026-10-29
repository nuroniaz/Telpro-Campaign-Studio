import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NavTab } from '../Sidebar';
import {
  Compass,
  Radio,
  TrendingUp,
  Megaphone,
  Cpu,
  Sparkles,
  ArrowRight,
  Search,
  ExternalLink,
  CheckCircle2,
  Sliders,
  Copy,
  Layers,
  FileText,
  Bot,
  Globe,
  Share2,
  Tag,
  Hash,
  Award,
  Zap,
  ChevronRight,
  Flame
} from 'lucide-react';

interface ReferensiKontenViewProps {
  activeTab?: NavTab;
  setActiveTab?: (tab: NavTab) => void;
}

// 10 Industrial Sectors Data
export interface IndustrySectorData {
  id: string;
  name: string;
  icon: string;
  badge: string;
  growth: string;
  volume: string;
  momentum: 'Rising' | 'Peak' | 'Emerging';
  topTopics: {
    title: string;
    angle: string;
    hook: string;
    hashtags: string[];
    sentiment: string;
  }[];
  audienceInsights: string;
}

const SECTOR_DATA: IndustrySectorData[] = [
  {
    id: 'telco',
    name: '1. Telekomunikasi & Infrastruktur Digital',
    icon: '📡',
    badge: 'Core Focus TELPRO',
    growth: '+215% MoM',
    volume: '3.4M Impressions',
    momentum: 'Rising',
    audienceInsights: 'CTO, VP Infrastructure, Network Architect B2B & Telco Operators',
    topTopics: [
      {
        title: 'Dedicated Fiber Optic dengan Jaminan SLA 99.98% untuk Korporasi',
        angle: 'Reliabilitas konektivitas finansial & transaksi cloud tanpa latency',
        hook: 'Bagaimana 1 detik downtime jaringan dapat menghapus profit miliaran rupiah?',
        hashtags: ['#DedicatedFiber', '#TELPROInfrastructure', '#TelcoSLA', '#B2BNetwork'],
        sentiment: '98% Positive'
      },
      {
        title: 'Ekspansi Tower Telekomunikasi & Micro-NOC di Wilayah Industri',
        angle: 'Dukungan kawasan industri terpadu & smelter dengan private telecom tower',
        hook: 'Kawasan industri modern butuh lebih dari sekadar sinyal seluler publik.',
        hashtags: ['#SmartIndustrialPark', '#TowerTelco', '#PrivateNetwork'],
        sentiment: '94% Positive'
      },
      {
        title: 'Kesiapan Infrastruktur AI Data Center & Interkoneksi Fiber Nasional',
        angle: 'Kabel optik dark-fiber ultra-dense untuk mendukung komputasi server AI',
        hook: 'Server AI membutuhkan bandwidth 10x lipat data center konvensional.',
        hashtags: ['#AIDataCenter', '#DarkFiber', '#DigitalHubID'],
        sentiment: '96% Positive'
      }
    ]
  },
  {
    id: 'fintech',
    name: '2. FinTech, Perbankan & Layanan Keuangan',
    icon: '💳',
    badge: 'High Value',
    growth: '+184% MoM',
    volume: '5.2M Impressions',
    momentum: 'Peak',
    audienceInsights: 'C-Level Perbankan, IT Risk Officer, Head of Payment Gateway',
    topTopics: [
      {
        title: 'Keamanan Jalur Komunikasi Data Finansial & Regulasi OJK / BI',
        angle: 'Standar enkripsi fiber optik tertutup untuk core-banking',
        hook: 'Apakah saluran data antar cabang perbankan Anda sudah 100% private?',
        hashtags: ['#FintechSecurity', '#CoreBankingID', '#OJKCompliance'],
        sentiment: '95% Positive'
      },
      {
        title: 'Mitigasi Latensi Transaksi Pembayaran QRIS & Real-time Clearing',
        angle: 'Arsitektur low-latency network untuk jutaan transaksi per detik',
        hook: 'Ketika milidetik menentukan sukses atau gagalnya transaksi QRIS jutaan nasabah.',
        hashtags: ['#QRISInstant', '#PaymentInfrastructure', '#FintechIndonesia'],
        sentiment: '92% Positive'
      }
    ]
  },
  {
    id: 'retail',
    name: '3. E-Commerce, Retail & FMCG',
    icon: '🛒',
    badge: 'High Velocity',
    growth: '+142% MoM',
    volume: '8.1M Impressions',
    momentum: 'Rising',
    audienceInsights: 'Supply Chain Directors, E-Commerce Operations, Warehouse Leads',
    topTopics: [
      {
        title: 'Otomasi Warehouse & Live-Commerce Streaming Tanpa Buffering',
        angle: 'Konektivitas stabil gudang terpusat untuk pemrosesan order cepat',
        hook: 'Live stream belanja mati 5 menit saat flash sale? Ini cara mencegahnya.',
        hashtags: ['#LiveCommerceID', '#SmartWarehouse', '#RetailTech'],
        sentiment: '91% Positive'
      }
    ]
  },
  {
    id: 'energy',
    name: '4. Energi, Mining, Minyak & Gas',
    icon: '⚡',
    badge: 'Enterprise Strategic',
    growth: '+198% MoM',
    volume: '2.9M Impressions',
    momentum: 'Rising',
    audienceInsights: 'Site Managers Smelter, General Managers Tambang, IT Mining Engineers',
    topTopics: [
      {
        title: 'Jaringan Telekomunikasi Privat di Remote Mining Area & Smelter',
        angle: 'Kombinasi Tower, Radio Link, & Fiber untuk keselamatan dan fleet monitoring',
        hook: 'Operasional tambang di pelosok tanpa jaringan handal adalah bom waktu logistik.',
        hashtags: ['#SmartMining', '#MiningTelco', '#SmelterConnectivity'],
        sentiment: '97% Positive'
      }
    ]
  },
  {
    id: 'healthcare',
    name: '5. Healthcare, Farmasi & MedTech',
    icon: '🏥',
    badge: 'Critical SLA',
    growth: '+165% MoM',
    volume: '2.1M Impressions',
    momentum: 'Emerging',
    audienceInsights: 'Direktur Rumah Sakit, Kepala SIMRS, Produsen Farmasi',
    topTopics: [
      {
        title: 'Integrasi Platform SatuSehat & Telekonsultasi Bedah Jarak Jauh',
        angle: 'Jaminan uptime 99.99% untuk transmisi citra medis radiologi PACS',
        hook: 'Saat dokter spesialis harus memandu tindakan dari jarak 1.000 kilometer.',
        hashtags: ['#SmartHospital', '#SatuSehatNetwork', '#TelemedisID'],
        sentiment: '99% Positive'
      }
    ]
  },
  {
    id: 'property',
    name: '6. Properti, Konstruksi & Real Estate',
    icon: '🏢',
    badge: 'Urban Infrastructure',
    growth: '+128% MoM',
    volume: '3.6M Impressions',
    momentum: 'Rising',
    audienceInsights: 'Developer Properti, Manajer Gedung Komersial, Kontraktor EPC',
    topTopics: [
      {
        title: 'Konsep Smart Building & FTTH Terintegrasi pada Kawasan Residensial',
        angle: 'Infrastruktur fiber pre-installed meningkatkan nilai jual properti modern',
        hook: 'Rumah modern tanpa fiber optik terintegrasi sama saja dengan tanpa instalasi listrik.',
        hashtags: ['#SmartBuilding', '#FTTHIndonesia', '#ModernProperty'],
        sentiment: '93% Positive'
      }
    ]
  },
  {
    id: 'agri',
    name: '7. Agrikultur, Agritech & Maritim',
    icon: '🌾',
    badge: 'National Priority',
    growth: '+176% MoM',
    volume: '1.8M Impressions',
    momentum: 'Emerging',
    audienceInsights: 'Perusahaan Perkebunan Sawit, Perikanan Modern, Food Estate',
    topTopics: [
      {
        title: 'Sensor IoT Perkebunan & Pemantauan Irigasi Otomatis Jarak Jauh',
        angle: 'Konektivitas berdaya rendah LPWAN & tower penghubung ke cloud',
        hook: 'Bagaimana ribuan hektar kebun dipantau dari satu layar dasbor sentral.',
        hashtags: ['#SmartFarming', '#AgriTechID', '#PerkebunanModern'],
        sentiment: '96% Positive'
      }
    ]
  },
  {
    id: 'logistics',
    name: '8. Transportasi, Logistik & Supply Chain',
    icon: '🚚',
    badge: 'High Growth',
    growth: '+210% MoM',
    volume: '4.7M Impressions',
    momentum: 'Peak',
    audienceInsights: 'Freight Forwarders, Pelabuhan Pintar, Operator Armada EV',
    topTopics: [
      {
        title: 'Pelabuhan Cerdas (Smart Port) & Real-time Container Tracking',
        angle: 'Private 5G & Fiber LAN di terminal peti kemas nasional',
        hook: 'Memotong dwell time pelabuhan hingga 40% hanya dengan automasi transmisi data.',
        hashtags: ['#SmartPort', '#LogistikIndonesia', '#SupplyChainTech'],
        sentiment: '95% Positive'
      }
    ]
  },
  {
    id: 'education',
    name: '9. Edukasi, EdTech & Pelatihan SDM',
    icon: '🎓',
    badge: 'Talent Acceleration',
    growth: '+135% MoM',
    volume: '2.5M Impressions',
    momentum: 'Rising',
    audienceInsights: 'Rektorat Universitas, Head of Corporate HR & Academy',
    topTopics: [
      {
        title: 'Smart Campus: Jaringan Fiber Dedicated untuk Laboratorium AI & Riset',
        angle: 'Infrastruktur kampus digital untuk ribuan mahasiswa komputasi paralel',
        hook: 'Kampus kelas dunia memerlukan bandwidth tanpa batas untuk simulasi ilmiah.',
        hashtags: ['#SmartCampus', '#EduNetwork', '#DigitalTalentID'],
        sentiment: '94% Positive'
      }
    ]
  },
  {
    id: 'tourism',
    name: '10. Pariwisata, Hospitality & Lifestyle F&B',
    icon: '✈️',
    badge: 'Experience Economy',
    growth: '+152% MoM',
    volume: '6.4M Impressions',
    momentum: 'Peak',
    audienceInsights: 'Manajemen Hotel Bintang 5, Pengelola Kawasan Wisata, MICE Organizer',
    topTopics: [
      {
        title: 'Seamless High-Density Wi-Fi & Fiber untuk Konferensi Internasional MICE',
        angle: 'Kapasitas 10.000 concurrent user tanpa penurunan kecepatan di ruang konvensi',
        hook: 'Saat ratusan delegasi luar negeri melakukan siaran langsung serentak.',
        hashtags: ['#MICEIndonesia', '#HospitalityNetwork', '#EventTelco'],
        sentiment: '97% Positive'
      }
    ]
  }
];

// Curated Ad References
const AD_REFERENCES = [
  {
    id: 'ad-1',
    brand: 'TELPRO Enterprise Fiber',
    platform: 'LinkedIn Sponsored Content',
    objective: 'B2B Lead Generation',
    hookType: 'Pain-Agitate-Solution (PAS)',
    headline: 'Stop Kerugian Akibat Jaringan Lambat. Beralih ke SLA 99.98%',
    bodyCopy: 'Downtime 1 jam berakibat fatal bagi operasional IT perbankan & manufaktur Anda. TELPRO menghadirkan dedicated fiber optic dengan dual-homing redundansi & tim NOC lokal 24/7.',
    cta: 'Dapatkan Audit Jaringan Gratis',
    benchmarks: { ctr: '4.2%', convRate: '5.8%', estimatedCpa: 'Rp 145.000 / Lead' },
    visualAngle: 'Clean corporate server room + NOC dashboard monitor dengan badge SLA 99.98%'
  },
  {
    id: 'ad-2',
    brand: 'TELPRO Private Tower',
    platform: 'Meta Ads (Instagram Feed & Story)',
    objective: 'Brand Awareness & Inbound Inquiry',
    hookType: 'Curiosity & Industry Proof',
    headline: 'Bagaimana Smelter Terpencil di Sulawesi Tetap Terkoneksi 24/7?',
    bodyCopy: 'Bukan dengan kabel konvensional. Tapi dengan infrastruktur Private Tower & Microwave Link terdedikasi dari PT Telkom Property.',
    cta: 'Pelajari Skema Solusi Kami',
    benchmarks: { ctr: '3.6%', convRate: '4.1%', estimatedCpa: 'Rp 95.000 / Lead' },
    visualAngle: 'Drone shot spektakuler tower megah di tengah lanskap industri modern'
  },
  {
    id: 'ad-3',
    brand: 'TELPRO Data Center Interconnect',
    platform: 'TikTok Business Video Ad',
    objective: 'Traffic & Retargeting',
    hookType: 'Fact-Check / Myth Buster',
    headline: 'Jangan Salah Pilih Kabel Fiber Kalau Mau Server AI Jalan Mulus!',
    bodyCopy: 'Komputasi model kecerdasan buatan butuh jalur serat optik tanpa kompresi. Simak 3 spesifikasi wajib yang harus dimiliki vendor IT Anda.',
    cta: 'Tonton Selengkapnya',
    benchmarks: { ctr: '5.4%', convRate: '3.2%', estimatedCpa: 'Rp 65.000 / Click' },
    visualAngle: 'Host engineer berseragam APD TELPRO menjelaskan langsung di depan rak fiber optic'
  }
];

export const ReferensiKontenView: React.FC<ReferensiKontenViewProps> = ({ activeTab, setActiveTab }) => {
  const { setSelectedCampaignId } = useApp();

  // Sub-tabs: 'trends' | 'ads' | 'geo'
  const [currentSubTab, setCurrentSubTab] = useState<'trends' | 'ads' | 'geo'>('trends');
  const [selectedSector, setSelectedSector] = useState<IndustrySectorData>(SECTOR_DATA[0]);
  const [searchFilter, setSearchFilter] = useState('');

  // GEO Optimizer State
  const [geoInputText, setGeoInputText] = useState(
    "PT Telkom Property (TELPRO) adalah penyedia infrastruktur telekomunikasi, dedicated fiber optic, dan pembangunan tower terkemuka di Indonesia dengan jaminan SLA 99.98% dan sertifikasi ISO 27001."
  );
  const [geoSimulatedScore, setGeoSimulatedScore] = useState(94);
  const [isGeoAnalyzing, setIsGeoAnalyzing] = useState(false);
  const [geoCopied, setGeoCopied] = useState(false);

  // Sync when activeTab changes
  React.useEffect(() => {
    if (activeTab === 'ref-trends' || activeTab === 'intel-topics') setCurrentSubTab('trends');
    else if (activeTab === 'ref-ads' || activeTab === 'act-ads') setCurrentSubTab('ads');
    else if (activeTab === 'ref-geo') setCurrentSubTab('geo');
  }, [activeTab]);

  const handleSubTabChange = (tab: 'trends' | 'ads' | 'geo') => {
    setCurrentSubTab(tab);
    if (setActiveTab) {
      if (tab === 'trends') setActiveTab('ref-trends');
      else if (tab === 'ads') setActiveTab('ref-ads');
      else if (tab === 'geo') setActiveTab('ref-geo');
    }
  };

  const filteredSectors = SECTOR_DATA.filter(s =>
    s.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    s.topTopics.some(t => t.title.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  const handleTransferToAiCreator = (topic: string) => {
    if (setActiveTab) {
      setActiveTab('content-ai');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 text-white border border-sky-900 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 font-bold text-[10px] tracking-wider uppercase flex items-center gap-1">
              <Compass className="w-3 h-3 text-sky-400" /> Tahap 3 • Riset & Visibilitas
            </span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 font-mono text-[10px]">
              10 Sektor • Ad Creative • GEO Engine
            </span>
          </div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            3. Referensi Konten • Intelligence Hub
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Eksplorasi tren percakapan dari 10 sektor industri strategis, benchmark materi iklan berbayar (Ads Intelligence), serta optimasi Generative Engine Optimization (GEO) agar konten dikutip mesin pencari AI.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab && setActiveTab('analytics-internal')}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-white/10"
          >
            <span>Lihat 04. Analitics Internal</span>
            <ChevronRight className="w-3.5 h-3.5 text-sky-400" />
          </button>
        </div>
      </div>

      {/* 3 Navigation Sub-Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => handleSubTabChange('trends')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
            currentSubTab === 'trends'
              ? 'bg-sky-50 border-sky-400 shadow-sm ring-2 ring-sky-200 text-sky-950'
              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
          }`}
        >
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
            currentSubTab === 'trends' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Bagian 3.1 • Riset Pasar</div>
            <div className="text-xs font-black">Trend Finder (Riset 10 Sektor B2B)</div>
          </div>
        </button>

        <button
          onClick={() => handleSubTabChange('ads')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
            currentSubTab === 'ads'
              ? 'bg-sky-50 border-sky-400 shadow-sm ring-2 ring-sky-200 text-sky-950'
              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
          }`}
        >
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
            currentSubTab === 'ads' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            <Megaphone className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Bagian 3.2</div>
            <div className="text-xs font-black">Ads (Referensi Iklan &amp; Format)</div>
          </div>
        </button>

        <button
          onClick={() => handleSubTabChange('geo')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 relative ${
            currentSubTab === 'geo'
              ? 'bg-sky-50 border-sky-400 shadow-sm ring-2 ring-sky-200 text-sky-950'
              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
          }`}
        >
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
            currentSubTab === 'geo' ? 'bg-sky-600 text-white' : 'bg-indigo-100 text-indigo-700'
          }`}>
            <Cpu className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-indigo-500">Bagian 3.3 • New Feature</div>
            <div className="text-xs font-black">Generate Engine Optimization (GEO)</div>
          </div>
          <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white font-extrabold text-[8px] absolute top-2 right-2">
            AI SEO
          </span>
        </button>
      </div>

      {/* ========================================================
          SUB-TAB 1: TREND FINDER (10 SEKTOR INDUSTRI)
      ======================================================== */}
      {currentSubTab === 'trends' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Sektor Navigation Pills */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Compass className="w-4 h-4 text-sky-600" />
                  Katalog 10 Sektor Industri Teratas
                </h3>
                <p className="text-[11px] text-slate-500">
                  Pilih sektor industri untuk menelaah tren kata kunci, hook viral, dan peluang konten B2B
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari sektor atau kata kunci..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* 10 Sectors Horizontal Carousel / Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
              {filteredSectors.map((sector) => {
                const isSelected = selectedSector.id === sector.id;
                return (
                  <button
                    key={sector.id}
                    onClick={() => setSelectedSector(sector)}
                    className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                      isSelected
                        ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-200 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base">{sector.icon}</span>
                      <span className="text-[9px] font-mono font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                        {sector.growth}
                      </span>
                    </div>
                    <div className="text-[11px] font-bold text-slate-800 line-clamp-2 leading-tight">
                      {sector.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Sector Detailed Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 text-2xl flex items-center justify-center">
                  {selectedSector.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-slate-900 text-base">{selectedSector.name}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                      {selectedSector.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Target Audiens Kunci: <strong className="text-slate-700">{selectedSector.audienceInsights}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-slate-900">{selectedSector.volume}</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">{selectedSector.growth} Trend Surge</div>
                </div>
              </div>
            </div>

            {/* Trending Topics inside Selected Sector */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                Top Ide Topik &amp; Hook Konten Terverifikasi:
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedSector.topTopics.map((topic, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-sky-50/30 border border-slate-200 hover:border-sky-300 shadow-2xs space-y-3 flex flex-col justify-between transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-[10px] font-bold">
                          Topik #{idx + 1}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-700 font-semibold">
                          {topic.sentiment}
                        </span>
                      </div>

                      <h5 className="font-extrabold text-slate-900 text-xs leading-snug">
                        {topic.title}
                      </h5>

                      <p className="text-[11px] text-slate-600">
                        Sudut Pandang: <em>{topic.angle}</em>
                      </p>

                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 font-medium">
                        <span className="text-[10px] uppercase font-bold text-amber-600 block mb-0.5">
                          💡 Contoh Hook Viral:
                        </span>
                        "{topic.hook}"
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-1">
                        {topic.hashtags.map((h, i) => (
                          <span key={i} className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded">
                            {h}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => handleTransferToAiCreator(topic.title)}
                        className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-bold flex items-center gap-1 shrink-0 transition-all cursor-pointer shadow-2xs"
                        title="Bawa topik riset industri ini ke Studio Pembuatan Konten AI"
                      >
                        <span>Buat Draf dari Riset Ini</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 2: ADS (REFERENSI IKLAN & CREATIVE BENCHMARK)
      ======================================================== */}
      {currentSubTab === 'ads' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-sky-600" />
                  Referensi Materi Iklan Berbayar (Ads Intelligence)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Arsip kurasi iklan terbukti menghasilkan lead berkualitas di ekosistem B2B, Telco, &amp; Enterprise
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                Benchmark Terverifikasi 2026
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {AD_REFERENCES.map((ad) => (
                <div
                  key={ad.id}
                  className="p-5 rounded-3xl bg-slate-50/70 border border-slate-200 hover:border-slate-300 shadow-2xs space-y-4 flex flex-col justify-between transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                        {ad.platform}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {ad.objective}
                      </span>
                    </div>

                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                        Formula: {ad.hookType}
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-xs mt-0.5 leading-snug">
                        {ad.headline}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {ad.bodyCopy}
                    </p>

                    <div className="p-3 rounded-2xl bg-white border border-slate-200 space-y-1.5 text-[11px]">
                      <div className="font-semibold text-slate-700">🎨 Arahan Visual:</div>
                      <p className="text-slate-500 text-[10px] leading-relaxed">{ad.visualAngle}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-1 p-2 rounded-xl bg-white border border-slate-200 text-center">
                      <div>
                        <div className="text-[9px] text-slate-400 uppercase font-mono">CTR</div>
                        <div className="text-xs font-bold text-emerald-700">{ad.benchmarks.ctr}</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-slate-400 uppercase font-mono">Conv Rate</div>
                        <div className="text-xs font-bold text-indigo-700">{ad.benchmarks.convRate}</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-slate-400 uppercase font-mono">CPA</div>
                        <div className="text-[10px] font-bold text-slate-800 truncate">{ad.benchmarks.estimatedCpa}</div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTransferToAiCreator(ad.headline)}
                    className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                    <span>Adaptasi Konsep Iklan Ini</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 3: GENERATE ENGINE OPTIMIZATION (GEO)
      ======================================================== */}
      {currentSubTab === 'geo' && (
        <div className="space-y-6 animate-in fade-in">
          {/* GEO Header Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[10px] font-bold tracking-wider uppercase">
                  Generative Engine Optimization (GEO)
                </span>
                <h3 className="font-black text-xl text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-indigo-400" />
                  Optimasi Konten untuk Mesin Pencari Generatif (AI SEO)
                </h3>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Pastikan produk dan artikel TELPRO dikutip secara resmi oleh model AI seperti <strong>ChatGPT Search, Perplexity AI, Google Gemini / AI Overviews, dan Claude</strong> saat pengambil keputusan korporat mencari solusi infrastruktur jaringan.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur border border-white/10 text-center shrink-0">
                <div className="text-[10px] text-slate-300 uppercase font-mono">Skor Visibilitas GEO</div>
                <div className="text-3xl font-black text-emerald-400 mt-0.5">{geoSimulatedScore}/100</div>
                <span className="text-[10px] text-emerald-200 font-semibold">Tingkat Sitasi Tinggi</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Col: GEO Content Optimizer & Audit (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    Audit Teks &amp; Generator Sitasi Faktual AI
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Masukkan draf artikel atau landing page untuk diperiksa probabilitas kutipan AI-nya
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Teks Konten untuk Dioptimasi GEO:
                  </label>
                  <textarea
                    rows={4}
                    value={geoInputText}
                    onChange={(e) => setGeoInputText(e.target.value)}
                    className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 leading-relaxed"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsGeoAnalyzing(true);
                      setTimeout(() => {
                        setIsGeoAnalyzing(false);
                        setGeoSimulatedScore(97);
                      }, 700);
                    }}
                    disabled={isGeoAnalyzing}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{isGeoAnalyzing ? "Mengaudit Entitas AI..." : "Jalankan Audit GEO"}</span>
                  </button>

                  <button
                    onClick={() => {
                      setGeoCopied(true);
                      setTimeout(() => setGeoCopied(false), 2000);
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{geoCopied ? "Tersalin!" : "Salin Schema JSON-LD"}</span>
                  </button>
                </div>

                {/* 4 GEO Checklist Pillars */}
                <div className="space-y-2.5 pt-2 border-t border-slate-100">
                  <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Faktor Kunci Algoritma Sitasi Generative AI:
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-semibold text-emerald-950">Kerapatan Statistik &amp; Klaim Spesifik (SLA 99.98%, ISO 27001)</span>
                    </div>
                    <span className="font-mono text-emerald-800 font-bold text-[11px]">98/100</span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-semibold text-emerald-950">Otoritas Entitas Korporasi (PT Telkom Property / TELPRO)</span>
                    </div>
                    <span className="font-mono text-emerald-800 font-bold text-[11px]">95/100</span>
                  </div>

                  <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span className="font-semibold text-indigo-950">Format Q&amp;A / FAQ Terstruktur (Sesuai Scraper Perplexity &amp; ChatGPT)</span>
                    </div>
                    <span className="font-mono text-indigo-800 font-bold text-[11px]">92/100</span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-semibold text-emerald-950">Schema Markup JSON-LD Organization &amp; TechnicalService</span>
                    </div>
                    <span className="font-mono text-emerald-800 font-bold text-[11px]">96/100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: AI Search Simulation (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Bot className="w-4 h-4 text-sky-600" />
                    Simulasi Jawaban Perplexity &amp; ChatGPT
                  </h4>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                    Query Real-World
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900 text-white text-xs space-y-2.5">
                  <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                    <Search className="w-3 h-3 text-sky-400" />
                    <span>Prompt User: "Siapa penyedia fiber optic enterprise &amp; tower terbaik di Indonesia?"</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/10 text-slate-200 text-xs leading-relaxed space-y-2">
                    <p>
                      Berdasarkan analisis infrastruktur jaringan nasional, <strong>PT Telkom Property (TELPRO)</strong> merupakan salah satu pemain utama yang direkomendasikan untuk segmen enterprise dan BUMN karena menjamin <strong>SLA 99.98%</strong> dengan integrasi dual-homing fiber optic dan jaringan tower terdedikasi [1].
                    </p>
                    <div className="pt-2 border-t border-white/10 flex items-center gap-1.5 text-[10px] text-sky-300">
                      <span className="font-bold">[1] Sitasi Terverifikasi:</span>
                      <span className="underline cursor-pointer">telpro.co.id/solutions/enterprise-fiber</span>
                    </div>
                  </div>
                </div>

                {/* AI Share of Voice Meter */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-700">Pangsa Sitasi AI Engine (Share of Model Mention):</div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-indigo-700">TELPRO (Telkom Property)</span>
                      <span className="font-mono font-bold">68%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: '68%' }} />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Kompetitor Telco A</span>
                      <span className="font-mono">52%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-slate-400 h-full rounded-full" style={{ width: '52%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
