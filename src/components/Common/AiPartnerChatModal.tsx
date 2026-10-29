import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Campaign } from '../../types';
import { isExecutiveApprover } from '../../utils/rbac';
import {
  Sparkles,
  Bot,
  User,
  Send,
  X,
  Target,
  BrainCircuit,
  CheckCircle2,
  Plus,
  ArrowRight,
  RotateCcw,
  Lightbulb,
  Coins,
  Briefcase,
  Layers,
  Zap,
  TrendingUp,
  ShieldCheck,
  Minus,
  Maximize2
} from 'lucide-react';

interface AiPartnerChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab?: string;
  onCampaignCreated?: (campaignId: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  reasoningSteps?: string[];
  proposedCampaign?: Partial<Campaign>;
}

interface QuickPrompt {
  title: string;
  prompt: string;
}

const getContextLabel = (tab?: string): string => {
  if (!tab || tab.startsWith('home-')) return 'Rekomendasi Utama';
  if (tab.startsWith('strategy-')) return 'Rekomendasi Strategi & Campaign';
  if (tab.startsWith('content-')) return 'Rekomendasi Content & Studio';
  if (tab.startsWith('gov-')) return 'Rekomendasi Governance & Approval';
  if (tab.startsWith('act-')) return 'Rekomendasi Activation & Publishing';
  if (tab.startsWith('intel-') || tab.startsWith('perf-')) return 'Rekomendasi Intelijen & Analitik';
  return 'Rekomendasi AI';
};

const getContextualWelcomeMessage = (tab?: string, campaignName?: string, userName?: string, isApprover?: boolean): string => {
  const nameGreeting = userName ? `, ${userName}` : '';
  const cmpCtx = campaignName ? ` (Campaign Aktif: "${campaignName}")` : '';

  if (isApprover) {
    return `Halo${nameGreeting}! Anda terhubung dalam mode Executive Approver. Saya siap mendampingi Anda dalam analisis risiko reputasi, audit bukti fakta (evidence-check), pemenuhan SLA otorisasi, serta evaluasi kelayakan kepatuhan brand sebelum pemberian persetujuan resmi. Sesuai tata kelola, wewenang pembuatan draf konten dialokasikan untuk peran Creator.`;
  }

  if (!tab || tab.startsWith('home-')) {
    return `Halo${nameGreeting}! Saya TELPRO Agentic AI Partner. Saya siap mendampingi Anda di seluruh modul — mulai dari ideasi strategi, draf & copywriting konten, riset intelijen, hingga panduan governance & analitik.`;
  }
  if (tab.startsWith('strategy-')) {
    return `Halo${nameGreeting}! Anda sedang berada di modul Marketing Strategy${cmpCtx}. Ada yang ingin dikonsultasikan mengenai penetapan target audiens, positioning produk, atau efisiensi alokasi budget?`;
  }
  if (tab.startsWith('content-')) {
    return `Halo${nameGreeting}! Anda sedang berada di modul Content Studio & Production${cmpCtx}. Saya siap membimbing penulisan Hook, Copywriting Instagram/LinkedIn, Script Video 30s, atau Storyboard.`;
  }
  if (tab.startsWith('gov-')) {
    return `Halo${nameGreeting}! Anda sedang berada di modul Governance & Approvals. Saya siap membantu verifikasi fakta, analisis kelayakan lisensi asset, dan ringkasan catatan persetujuan tim Legal & Brand.`;
  }
  if (tab.startsWith('act-')) {
    return `Halo${nameGreeting}! Anda sedang berada di modul Activation & Publishing. Mari periksa jam terbit optimal, susunan parameter UTM link, serta strategi targeting ads.`;
  }
  if (tab.startsWith('intel-') || tab.startsWith('perf-')) {
    return `Halo${nameGreeting}! Anda sedang berada di modul Intelligence & Analytics. Mari bedah tren pasar terkini, riset kata kunci SEO, serta analisis performa campaign TELPRO.`;
  }
  return `Halo${nameGreeting}! Saya TELPRO Agentic AI Partner. Ada yang ingin Anda diskusikan atau tanyakan seputar TELPRO 2026?`;
};

const getContextualPrompts = (tab?: string, seed: number = 0, campaignName?: string, isApprover?: boolean): QuickPrompt[] => {
  const cmp = campaignName || 'TELPRO Smart Warehouse';

  if (isApprover) {
    const approverPrompts: QuickPrompt[] = [
      { title: '🛡️ Audit Kepatuhan Klaim B2B & Legal', prompt: 'Periksa kelayakan klaim SLA 99.9% dan disclaimer resmi sebelum konten disetujui.' },
      { title: '⚖️ Evaluasi Risiko & Mitigasi Brand', prompt: 'Analisis potensi risiko reputasi atau pelanggaran hak cipta pada materi kampanye minggu ini.' },
      { title: '📋 Summary Catatan Persetujuan VP & Dirut', prompt: 'Rangkumkan poin-poin penting yang perlu diperhatikan manajemen sebelum memberikan sign-off.' },
      { title: '⚡ Protokol Emergency & Percepatan SLA', prompt: 'Bagaimana alur koordinasi cepat jika terdapat konten publikasi mendesak hari ini?' },
      { title: '📊 Matrix Otorisasi & Batas Kewenangan', prompt: 'Jelaskan matriks kewenangan persetujuan antara VP Corsec dan Plt. Direktur Utama.' },
      { title: '🔍 Validasi Evidence & Sumber Data', prompt: 'Periksa apakah bukti lapangan dan referensi angka dalam draf sudah diverifikasi valid.' }
    ];
    const selectedIndex = Math.abs(seed) % approverPrompts.length;
    return [approverPrompts[selectedIndex]];
  }

  const strategyPrompts: QuickPrompt[] = [
    { title: '🎯 Strategi B2B Smart Warehouse', prompt: `Rancang strategi campaign B2B Q3 2026 untuk produk ${cmp}.` },
    { title: '💼 IndiHome Dedicated UMKM', prompt: 'Buat rencana campaign akselerasi digital IndiHome Dedicated 100Mbps untuk Workspace & UMKM.' },
    { title: '📊 Alokasi Budget Enterprise', prompt: 'Rekomendasikan strategi campaign dengan budget Rp 250 Juta & target CPL < Rp 150.000.' },
    { title: '🚀 Expansion & Smart Office', prompt: 'Usulkan positioning & pesan kunci untuk ekspansi Smart Office & Coworking TELPRO.' },
    { title: '🌐 Digital Transformation 2026', prompt: 'Bagaimana langkah menyusun positioning TELPRO sebagai pemimpin solusi B2B ICT Property?' },
    { title: '🤝 B2B Partnership Messaging', prompt: 'Tuliskan usulan value proposition untuk kemitraan strategis dengan BUMN & Developer.' },
    { title: '🎯 Funnel Acquisition B2B', prompt: 'Rancang peta customer journey B2B dari tahap awareness hingga demo produk TELPRO.' },
    { title: '📈 High-Margin Product Promo', prompt: 'Buatkan konsep kampanye khusus untuk produk High-Margin TELPRO kuartal ini.' }
  ];

  const contentPrompts: QuickPrompt[] = [
    { title: '✍️ Draf Hook & Copywriting', prompt: 'Tuliskan 3 opsi Hook & Caption Instagram Reels tentang IndiHome Business Dedicated.' },
    { title: '🎬 Konsep Storyboard Video 30s', prompt: `Buatkan struktur adegan (storyboard) video 30 detik untuk produk ${cmp}.` },
    { title: '📱 Carousel LinkedIn B2B', prompt: 'Buat outline 5 slide Carousel LinkedIn tentang "5 Titik Kebocoran Biaya Gudang Manual".' },
    { title: '🎧 Lisensi Sound & Audio', prompt: 'Rekomendasikan gaya musik & audio berlisensi resmi untuk video B2B TELPRO.' },
    { title: '🎥 Script Veo 2 AI Video', prompt: 'Tuliskan prompt script video AI Veo 2 berdurasi 15 detik tentang Smart Space Office.' },
    { title: '📐 Multi-Platform Adaptation', prompt: 'Bagaimana cara mengubah 1 artikel blog TELPRO menjadi 3 format mikro-konten sosmed?' },
    { title: '🏷️ Hashtag & SEO Copy', prompt: 'Berikan 10 hashtag & kata kunci relevan untuk meningkatkan pencarian TELPRO Smart City.' },
    { title: '💡 Ide Content Calendar Minggu Ini', prompt: 'Berikan 4 ide konten mingguan dengan variasi pilar Edukasi, Promo, & Social Proof.' }
  ];

  const govPrompts: QuickPrompt[] = [
    { title: '🛡️ Alur Verifikasi Fact-Checking', prompt: 'Jelaskan alur verifikasi fakta dan persetujuan bertingkat sebelum rilis resmi.' },
    { title: '📋 Summary Catatan Approver', prompt: 'Rangkumkan poin revisi utama dari tim Legal & Brand Governance untuk draf ini.' },
    { title: '🔒 Copyright & Lisensi Asset', prompt: 'Periksa kriteria kepatuhan Lisensi Asset & Copyright Protected Gambar untuk campaign publik.' },
    { title: '⚡ Emergency Approval Protocol', prompt: 'Bagaimana prosedur percepatan approval untuk konten event hangat hari ini?' },
    { title: '✅ Checklist Brand Guidelines', prompt: 'Periksa apakah draf tagline & warna visual sudah sesuai Brand Guidelines TELPRO 2026.' },
    { title: '⚖️ Legal Risk Audit B2B Claims', prompt: 'Apakah ada klaim garansi SLA 99.9% yang membutuhkan disclaimer legal resmi?' },
    { title: '📊 Matrix Otoritas Approval', prompt: 'Siapa saja stakeholder wajib yang harus menyetujui materi sebelum publikasi?' },
    { title: '📝 Template Memo Persetujuan', prompt: 'Buatkan draf singkat memo persetujuan riset materi campaign untuk tim Direksi.' }
  ];

  const actPrompts: QuickPrompt[] = [
    { title: '🚀 Waktu Posting Optimal', prompt: 'Kapan jadwal jam terbit paling responsif untuk audiens B2B di LinkedIn & Instagram?' },
    { title: '📈 Segmentasi Paid Ads', prompt: 'Rekomendasikan segmentasi audiens Meta Ads & LinkedIn Ads untuk IndiHome Business.' },
    { title: '🔗 Parameter UTM Link Tracking', prompt: 'Bagaimana susunan parameter UTM link untuk mengukur konversi leads dari Instagram Bio?' },
    { title: '📅 Sync Master Calendar', prompt: 'Cek apakah ada bentrokan jadwal terbit antar campaign TELPRO minggu ini.' },
    { title: '📲 Multi-Channel Distribution', prompt: 'Bagaimana alur koordinasi terbit simultan di Instagram, LinkedIn, & Website Blog?' },
    { title: '🎯 Lead Magnet Conversion', prompt: 'Buat penawaran Lead Magnet (E-book/Whitepaper) untuk menggaet kontak B2B.' },
    { title: '🔔 Automated Publishing Workflow', prompt: 'Bagaimana memastikan status konten dari Approved otomatis masuk antrean terbit?' },
    { title: '📊 Evaluasi Budget Performance Ads', prompt: 'Saran alokasi budget retargeting vs cold audience untuk iklan TELPRO.' }
  ];

  const intelPrompts: QuickPrompt[] = [
    { title: '💡 Tren Konten Tech & B2B', prompt: 'Apa tren gaya visual & format konten B2B tech yang sedang viral minggu ini?' },
    { title: '📊 Evaluasi Engagement Rate', prompt: 'Bagaimana strategi menaikkan Engagement Rate dari 2.1% menjadi 4.5% di LinkedIn?' },
    { title: '🔍 Keyword & SEO Discoverability', prompt: 'Riset kata kunci SEO pencarian tertinggi untuk solusi Gudang Digital TELPRO.' },
    { title: '🏆 Benchmark Competitor TELPRO', prompt: 'Rangkum keunggulan komunikasi TELPRO dibandingkan kompetitor B2B telekomunikasi.' },
    { title: '📈 ROI & Lead Attribution', prompt: 'Bagaimana cara menghitung Return on Ad Spend (ROAS) untuk campaign B2B bernilai tinggi?' },
    { title: '💬 Sentiment Analysis Feedback', prompt: 'Bagaimana kecenderungan sentimen tanggapan audiens terhadap campaign TELPRO saat ini?' },
    { title: '🎓 Continuous Marketing Loop', prompt: 'Saran rekomendasi aksi berdasarkan pembelajaran data statistik campaign bulan lalu.' },
    { title: '🤖 System & Data Sync Check', prompt: 'Periksa apakah ketersediaan data sinkronisasi API TELPRO dalam status aktif.' }
  ];

  let pool: QuickPrompt[];
  if (!tab || tab.startsWith('home-')) {
    pool = [
      strategyPrompts[0], contentPrompts[0], govPrompts[0], intelPrompts[0],
      actPrompts[0], strategyPrompts[1], contentPrompts[1], intelPrompts[2]
    ];
  } else if (tab.startsWith('strategy-')) {
    pool = strategyPrompts;
  } else if (tab.startsWith('content-')) {
    pool = contentPrompts;
  } else if (tab.startsWith('gov-')) {
    pool = govPrompts;
  } else if (tab.startsWith('act-')) {
    pool = actPrompts;
  } else {
    pool = intelPrompts;
  }

  const selectedIndex = Math.abs(seed) % pool.length;
  return [pool[selectedIndex]];
};

export const AiPartnerChatModal: React.FC<AiPartnerChatModalProps> = ({
  isOpen,
  onClose,
  activeTab,
  onCampaignCreated
}) => {
  const { addCampaign, setSelectedCampaignId, activeUser, selectedCampaign } = useApp();
  const isApprover = isExecutiveApprover(activeUser);

  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [createdCampaignId, setCreatedCampaignId] = useState<string | null>(null);
  const [promptSeed, setPromptSeed] = useState(0);

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Automatically update conversation session & prompts when opening chat or changing module context
  useEffect(() => {
    if (isOpen) {
      const newSeed = Math.floor(Math.random() * 100);
      setPromptSeed(newSeed);
      const welcomeText = getContextualWelcomeMessage(activeTab, selectedCampaign?.name, activeUser?.name, isApprover);

      setMessages([
        {
          id: `init-msg-${Date.now()}`,
          sender: 'ai',
          text: welcomeText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          reasoningSteps: [
            `Mendeteksi konteks modul aktif: ${activeTab || 'Dashboard'}`,
            `Sinkronisasi Hak Akses: ${isApprover ? 'Executive Approver (Review & Otorisasi Sahaja)' : 'Creator / Standard'}`,
            `Sinkronisasi Brand Profile & Guidelines TELPRO 2026`,
            `Akses data Evidence Pack & Historical Campaign Performance`
          ]
        }
      ]);
      setCreatedCampaignId(null);
    }
  }, [isOpen, activeTab, selectedCampaign?.name, activeUser?.name, isApprover]);

  if (!isOpen) return null;

  if (isMinimized) {
    return (
      <div
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-5 right-5 z-50 w-[300px] sm:w-[320px] bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-3 flex items-center justify-between gap-2 shadow-xl cursor-pointer hover:border-rose-400 transition-all ring-1 ring-slate-100 animate-in slide-in-from-bottom-2"
      >
        <div className="flex items-center gap-2.5 truncate">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-rose-600 via-pink-600 to-amber-500 p-0.5 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-white rounded-[6px] flex items-center justify-center">
              <BrainCircuit className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
            </div>
          </div>
          <div className="truncate">
            <h4 className="font-bold text-xs text-slate-900 truncate">TELPRO Agentic AI</h4>
            <p className="text-[10px] text-slate-500 truncate">Klik untuk memperbesar chat</p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => setIsMinimized(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            title="Perbesar Chat"
          >
            <Maximize2 className="w-3.5 h-3.5 text-rose-600" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            title="Tutup Chat"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  const handleResetChat = () => {
    const newSeed = promptSeed + 1;
    setPromptSeed(newSeed);
    const welcomeText = getContextualWelcomeMessage(activeTab, selectedCampaign?.name, activeUser?.name, isApprover);

    setMessages([
      {
        id: `init-msg-reset-${Date.now()}`,
        sender: 'ai',
        text: `Sesi percakapan diperbarui. ${welcomeText}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reasoningSteps: [
          'Reset sesi percakapan',
          `Mode Akun: ${isApprover ? 'Executive Approver (Otorisasi & Audit Saja)' : 'Creator / Standard'}`,
          `Topik rekomendasi disesuaikan dengan konteks ${activeTab || 'Dashboard'}`
        ]
      }
    ]);
    setCreatedCampaignId(null);
  };

  const activePrompts = getContextualPrompts(activeTab, promptSeed, selectedCampaign?.name, isApprover);
  const contextLabel = isApprover ? 'Rekomendasi Audit & Governance' : getContextLabel(activeTab);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isThinking) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(-5).map(m => ({ role: m.sender, text: m.text })),
          isExecutiveApprover: isApprover,
          userRole: activeUser?.role
        })
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.answer || 'Terima kasih. Saya telah menganalisis pertanyaan ini berdasarkan konteks dan pedoman TELPRO 2026.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reasoningSteps: data.reasoningSteps || [
          'Menganalisis intent & konteks pertanyaan',
          'Konsultasi data Knowledge Base & Guidelines TELPRO 2026',
          'Menyusun rekomendasi aksi terukur'
        ],
        proposedCampaign: isApprover ? undefined : data.proposedCampaign
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error("AI Partner Chat Error:", err);
      setMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: 'Terjadi kendala jaringan saat terhubung ke Agentic AI Server. Silakan coba lagi.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleApplyCampaign = (camp: Partial<Campaign>) => {
    const fullCamp: Campaign = {
      id: `cmp-2026-${Date.now().toString().slice(-4)}`,
      name: camp.name || 'Campaign Baru TELPRO',
      periodStart: camp.periodStart || '2026-09-01',
      periodEnd: camp.periodEnd || '2026-11-30',
      businessObjective: camp.businessObjective || 'Objektif Bisnis TELPRO',
      marketingObjective: camp.marketingObjective || 'Objektif Marketing',
      communicationObjective: camp.communicationObjective || 'Objektif Komunikasi',
      audience: camp.audience || 'Target Audience',
      status: 'Planned',
      budgetAllocated: camp.budgetAllocated || 150000000,
      budgetSpent: 0,
      owner: `${activeUser.name} (${activeUser.role.replace('ROLE_', '')})`,
      priorityProduct: camp.priorityProduct || 'TELPRO Smart Solutions',
      keyMessage: camp.keyMessage || 'Solusi Terpadu Telkom Property',
      funnelStage: camp.funnelStage || 'Consideration'
    };

    addCampaign(fullCamp);
    setSelectedCampaignId(fullCamp.id);
    setCreatedCampaignId(fullCamp.id);

    if (onCampaignCreated) {
      onCampaignCreated(fullCamp.id);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 w-[92vw] sm:w-[390px] md:w-[410px] h-[520px] max-h-[82vh] bg-white/95 backdrop-blur-md border border-slate-200 rounded-3xl flex flex-col shadow-2xl overflow-hidden text-slate-800 animate-in slide-in-from-bottom-5 duration-200 ring-1 ring-slate-200/60">
      
      {/* Modal Header */}
      <div className="p-3.5 border-b border-slate-100 bg-white flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 via-pink-600 to-amber-500 p-0.5 flex items-center justify-center shadow-sm shrink-0">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <BrainCircuit className="w-4 h-4 text-rose-600 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">TELPRO Agentic AI Partner</h3>
              <span className={`px-1.5 py-0.2 rounded border text-[8px] font-extrabold uppercase ${
                isApprover ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {isApprover ? 'Approver Advisor' : 'Asisten AI'}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              {isApprover ? 'Konsultasi tata kelola, audit bukti, kepatuhan brand, & otorisasi' : 'Pendamping cerdas strategi, draf konten, & analitik'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleResetChat}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all text-[11px] flex items-center gap-1 font-semibold cursor-pointer"
            title="Reset Chat & Sesi Baru"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            title="Minimize Chat"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            title="Tutup Chat Pop-up"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Success Banner if Campaign Created */}
      {createdCampaignId && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-3 py-2 flex items-center justify-between text-[11px] text-emerald-800 shrink-0">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">
              <strong>Berhasil!</strong> Campaign baru disimpan.
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[9px] shrink-0 cursor-pointer"
          >
            Selesai
          </button>
        </div>
      )}

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar bg-slate-50/60">
        
        {/* Quick Starters */}
        {messages.length <= 2 && (
          <div className="p-2.5 rounded-2xl bg-white border border-slate-200 space-y-1.5 shadow-xs animate-in fade-in duration-200">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[9px] font-extrabold text-rose-600 uppercase tracking-wider flex items-center gap-1 truncate">
                <Lightbulb className="w-3 h-3 text-amber-500 shrink-0" /> {contextLabel}
              </span>
              <button
                type="button"
                onClick={() => setPromptSeed(prev => prev + 1)}
                className="text-[9px] font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1 hover:underline transition-colors shrink-0 cursor-pointer"
                title="Ganti kombinasi topik rekomendasi"
              >
                <RotateCcw className="w-2.5 h-2.5" /> Ganti Topik 🎲
              </button>
            </div>

            <div className="grid grid-cols-1 gap-1.5 text-xs">
              {activePrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(qp.prompt)}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50/50 border border-slate-200 hover:border-rose-300 text-left text-slate-700 hover:text-slate-900 transition-all group cursor-pointer"
                >
                  <div className="font-bold text-[10px] text-rose-700 group-hover:text-rose-800">
                    {qp.title}
                  </div>
                  <div className="text-[9px] text-slate-500 truncate">{qp.prompt}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages List */}
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-2 text-xs ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-6 h-6 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5 text-rose-600" />
              </div>
            )}

            <div className={`space-y-1.5 max-w-[85%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              {/* Main Text bubble */}
              <div
                className={`p-2.5 rounded-2xl leading-relaxed text-[11px] shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-rose-600 text-white rounded-tr-none'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>

              {/* Proposed Campaign Card */}
              {msg.proposedCampaign && (
                <div className="p-3 rounded-2xl bg-white border border-rose-300 shadow-sm space-y-2 text-[10px]">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <div className="flex items-center gap-1.5 truncate">
                      <Target className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span className="font-extrabold text-slate-900 truncate">
                        {msg.proposedCampaign.name}
                      </span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[8px] font-bold shrink-0">
                      DRAFT
                    </span>
                  </div>

                  <div className="space-y-1 text-slate-700">
                    <div><strong className="text-slate-500">Produk:</strong> {msg.proposedCampaign.priorityProduct}</div>
                    <div><strong className="text-slate-500">Objective:</strong> {msg.proposedCampaign.businessObjective}</div>
                  </div>

                  {isApprover ? (
                    <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[10px] flex items-start gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Mode Approver:</strong> Pembuatan campaign/konten baru dialokasikan untuk peran Creator. Akun Anda berfokus pada audit &amp; otorisasi.
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => msg.proposedCampaign && handleApplyCampaign(msg.proposedCampaign)}
                      className="w-full py-1.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center gap-1 shadow-xs transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Terapkan Campaign
                    </button>
                  )}
                </div>
              )}

              <span className="text-[8px] text-slate-400 px-1 block">{msg.timestamp}</span>
            </div>

            {msg.sender === 'user' && (
              <div className="w-6 h-6 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5 text-slate-600" />
              </div>
            )}
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-2 text-[10px] text-rose-600 font-semibold p-2 rounded-xl bg-white border border-slate-200 w-fit shadow-xs animate-pulse">
            <Bot className="w-3.5 h-3.5" />
            <span>Agentic AI sedang memproses masukan Anda...</span>
          </div>
        )}
      </div>

      {/* Chat Input Bar */}
      <div className="p-2.5 border-t border-slate-100 bg-white shrink-0">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-1.5"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ketik pertanyaan atau tugas AI..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[11px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-400 focus:bg-white transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isThinking}
            className={`p-2 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
              input.trim() && !isThinking
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-xs cursor-pointer'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
};
