import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ContentItem,
  ContentStatus,
  RegionalSubmission,
  MasterTaxonomy,
  ContentVersion
} from '../../types';
import {
  isContentPlannerOwner,
  canCurateRegional,
  hasUserPermission,
  isExecutiveApprover
} from '../../utils/rbac';
import { NavTab } from '../Sidebar';
import {
  Calendar as CalendarIcon,
  Filter,
  Plus,
  Inbox,
  Settings,
  Layers,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Eye,
  Edit3,
  Search,
  Check,
  X,
  FileText,
  MapPin,
  ChevronDown,
  ChevronUp,
  Tag,
  Sliders,
  Sparkles,
  ArrowRight,
  Shield,
  HelpCircle,
  Lock,
  RefreshCw,
  Wand2,
  MessageSquare,
  Copy,
  FileCheck,
  AlertTriangle,
  UserCheck,
  Workflow,
  ArrowLeft,
  Camera,
  Video,
  TrendingUp,
  Lightbulb,
  ListChecks,
  Smartphone,
  ShieldCheck,
  Music,
  Film,
  Trash2,
  Pencil,
  UploadCloud,
  Target,
  FolderPlus,
  CalendarCheck,
  CalendarPlus,
  ExternalLink
} from 'lucide-react';
import { PrePublishWorkflowView } from './PrePublishWorkflowView';

interface ContentPlannerViewProps {
  activeTab?: NavTab;
  setActiveTab?: (tab: NavTab) => void;
}

export const ContentPlannerView: React.FC<ContentPlannerViewProps> = ({ activeTab, setActiveTab }) => {
  const {
    contents,
    activeUser,
    selectedCampaign,
    masterTaxonomy,
    updateMasterTaxonomy,
    regionalSubmissions,
    addRegionalSubmission,
    updateRegionalSubmission,
    updateRegionalSubmissionStatus,
    convertRegionalToPlanner,
    plannerStructureRequests,
    submitPlannerStructureRequest,
    reviewPlannerStructureRequest,
    updateContentPlannerItem,
    addContentWithVersion
  } = useApp();

  const isRegionalUser = activeUser.role === 'ROLE_REGIONAL_CREATOR';
  const isMarcommUser = activeUser.role === 'ROLE_MARCOM_CREATOR';
  const isCorcommUser = activeUser.role === 'ROLE_CORCOMM_CREATOR';
  const isApproverOnly = isExecutiveApprover(activeUser);
  const userRegion = activeUser.regionalUnit || 'Regional 1';

  // Active view mode: 'planner' | 'regional-inbox' | 'ai-field' | 'taxonomy' | 'editorial-flow'
  const [viewMode, setViewMode] = useState<'planner' | 'regional-inbox' | 'ai-field' | 'taxonomy' | 'editorial-flow'>(() => {
    if (isRegionalUser) {
      return activeTab === 'act-calendar' ? 'planner' : 'regional-inbox';
    }
    return 'planner';
  });

  // Sync viewMode when activeTab changes from Sidebar
  useEffect(() => {
    if (isRegionalUser) {
      if (activeTab === 'act-calendar') {
        setViewMode('planner');
      } else if (activeTab === 'content-schedule') {
        setViewMode('regional-inbox');
      }
    }
  }, [activeTab, isRegionalUser]);

  // Filter states for Content Planner (4-Seksi)
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [ownerFilter, setOwnerFilter] = useState<string>('ALL');
  const [channelFilter, setChannelFilter] = useState<string>('ALL');
  const [brandFilter, setBrandFilter] = useState<'ALL' | '@telprodico' | '@telkomproperty'>('ALL');
  const [corcommFilter, setCorcommFilter] = useState<'ALL' | 'REVIEWED' | 'PENDING'>('ALL');

  // Regional View Filters (Strict isolation + status filter)
  const [regionalStatusFilter, setRegionalStatusFilter] = useState<string>('ALL');
  const [regionalUnitFilter, setRegionalUnitFilter] = useState<string>('ALL'); // For Marcomm curation view

  // Expanded row IDs in table
  const [expandedItemIds, setExpandedItemIds] = useState<Record<string, boolean>>({});

  // Modals
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [isNewRegionalModalOpen, setIsNewRegionalModalOpen] = useState(false);
  const [editingRegionalSubmission, setEditingRegionalSubmission] = useState<RegionalSubmission | null>(null);
  const [selectedSubmissionForReview, setSelectedSubmissionForReview] = useState<RegionalSubmission | null>(null);
  const [revisionNotesInput, setRevisionNotesInput] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Regional Creation 2-Path Flow State
  const [regionalCreationStep, setRegionalCreationStep] = useState<
    'SELECT_MODE' | 'AI_TREND_SELECT' | 'AI_RECOMMENDATION_REVIEW' | 'MANUAL_FORM'
  >('SELECT_MODE');
  const [selectedTrendId, setSelectedTrendId] = useState<string>('custom-free-topic');
  const [aiSubMode, setAiSubMode] = useState<'FREE_TOPIC' | 'RECOMMENDED_TRENDS'>('FREE_TOPIC');
  const [aiTrendFilter, setAiTrendFilter] = useState<'ALL' | '@telprodico' | '@telkomproperty'>('ALL');
  const [selectedSubmissionForViewAi, setSelectedSubmissionForViewAi] = useState<RegionalSubmission | null>(null);
  const [activeSocialFormatTab, setActiveSocialFormatTab] = useState<'FEED' | 'STORY' | 'REELS'>('FEED');

  // AI Field Assistant State for Regional Users
  const [customFieldNotes, setCustomFieldNotes] = useState('');
  const [isGeneratingFieldAI, setIsGeneratingFieldAI] = useState(false);
  const [generatedFieldDraft, setGeneratedFieldDraft] = useState<{
    topic: string;
    activity: string;
    location: string;
    targetAudience: string;
    contentPillarSuggestion: string;
    captionDraft: string;
    supportingDoc: string;
  } | null>(null);

  // New Content Item Form State
  const [newItemData, setNewItemData] = useState<Partial<ContentItem>>({
    title: '',
    campaignProgram: selectedCampaign?.name || 'Transformasi Digital B2B 2026',
    primaryObjective: 'Brand Awareness',
    targetAudience: 'Manajer IT & CTO Enterprise',
    contentPillar: 'Product Excellence',
    keyMessage: '',
    topicIdea: '',
    contentFormat: 'Post / Feed',
    channel: 'LinkedIn',
    contentOwner: isRegionalUser ? 'Regional' : 'Marcomm',
    picName: activeUser.name,
    targetPublishDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    priority: 'Medium',
    supportingAssetStatus: 'Asset Ready (Verified)',
    supportingDataEvidence: 'Dokumen Spesifikasi Layanan TELPRO 2026',
    readinessNotes: 'Draf siap diproduksi dan diverifikasi sesuai master taxonomy.'
  });

  // Regional Submission Form State (pre-locked to user's region for regional users)
  const [newRegionalData, setNewRegionalData] = useState<Partial<RegionalSubmission>>({
    regional: userRegion,
    topic: '',
    activity: '',
    location: '',
    activityDate: new Date().toISOString().split('T')[0],
    targetAudience: '',
    contentPillarSuggestion: 'Community Impact',
    supportingAssetUrl: '',
    supportingAssetStatus: 'Draft Ready',
    supportingDocumentName: '',
    requestedPublishDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    picRegional: '', // Kosongkan wajib diisi nama orang
    submissionTrack: 'MONTHLY_AGENDA',
    brandTarget: '@telprodico'
  });

  // Filter for Content Planning Phase (Fase 1: Tema & Targeting vs Fase 2: File Aset Siap)
  const [phaseFilter, setPhaseFilter] = useState<'ALL' | 'PHASE_1_THEME' | 'PHASE_2_ASSET' | 'PUBLISHED'>('ALL');

  // Filter Inisiatif Mandiri (Pusat) vs Usulan Daerah (Regional)
  const [originFilter, setOriginFilter] = useState<'ALL' | 'HQ_INITIATIVE' | 'REGIONAL_SUBMISSION'>('ALL');

  // Modal: Kurasi Usulan Jadi Jadwal Konten (Fase 1: Tema & Targeting) oleh Marcomm / Corcomm
  const [curateModalSub, setCurateModalSub] = useState<RegionalSubmission | null>(null);
  const [curateThemeTitle, setCurateThemeTitle] = useState('');
  const [curateObjective, setCurateObjective] = useState('B2B Trust & Keandalan SLA');
  const [curateBrandTarget, setCurateBrandTarget] = useState<'@telprodico' | '@telkomproperty'>('@telprodico');
  const [curateTargetDate, setCurateTargetDate] = useState('');
  const [curatePillar, setCuratePillar] = useState('Product Education');
  const [curateFormat, setCurateFormat] = useState('Carousel');
  const [curateKeyMessage, setCurateKeyMessage] = useState('');
  const [curateCorcommApproval, setCurateCorcommApproval] = useState(false);

  // Modal: Unggah / Setor File Konten (Fase 2: Produksi Aset Lapangan)
  const [uploadAssetItem, setUploadAssetItem] = useState<ContentItem | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedDriveUrl, setUploadedDriveUrl] = useState('');
  const [uploadedDocName, setUploadedDocName] = useState('');
  const [uploadedNotes, setUploadedNotes] = useState('');
  const [isUploadingSimulated, setIsUploadingSimulated] = useState(false);

  // Modal: Jadwalkan Slot Tema Baru (Fase 1 Langsung dari Kalender)
  const [isNewThemeSlotModalOpen, setIsNewThemeSlotModalOpen] = useState(false);
  const [newThemeSlotData, setNewThemeSlotData] = useState({
    title: '',
    primaryObjective: 'B2B Trust & Keandalan SLA',
    channel: '@telprodico',
    targetPublishDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    contentPillar: 'Product Education',
    contentFormat: 'Carousel',
    contentOwner: isRegionalUser ? 'Regional' : (isCorcommUser ? 'Corcomm' : 'Marcomm'),
    regionalUnit: isRegionalUser ? userRegion : 'Regional 1',
    keyMessage: '',
    targetPropertyAsset: 'Telkom Landmark Tower (TLT) Jakarta',
    ctaTrackingLink: 'https://wa.me/628111000234?text=Halo%20Sales%20Telpro',
    corcommApproved: isCorcommUser
  });

  const openNewThemeSlotModal = () => {
    setNewThemeSlotData({
      title: '',
      primaryObjective: isCorcommUser ? 'ESG & Corporate Sustainability' : 'B2B Trust & Keandalan SLA',
      channel: isCorcommUser ? '@telkomproperty' : '@telprodico',
      targetPublishDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      contentPillar: isCorcommUser ? 'Corporate / Reputation' : 'Product Education',
      contentFormat: 'Carousel',
      contentOwner: isCorcommUser ? 'Corcomm' : (isRegionalUser ? 'Regional' : 'Marcomm'),
      regionalUnit: isRegionalUser ? userRegion : 'Regional 1',
      keyMessage: '',
      targetPropertyAsset: 'Telkom Landmark Tower (TLT) Jakarta',
      ctaTrackingLink: 'https://wa.me/628111000234?text=Halo%20Sales%20Telpro',
      corcommApproved: isCorcommUser
    });
    setIsNewThemeSlotModalOpen(true);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleExpand = (id: string) => {
    setExpandedItemIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Helper to open curate modal
  const openCurateModal = (sub: RegionalSubmission) => {
    setCurateModalSub(sub);
    setCurateThemeTitle(sub.topic);
    setCurateObjective(
      isCorcommUser
        ? 'ESG & Corporate Sustainability'
        : sub.targetAudience?.toLowerCase().includes('logistik') || sub.targetAudience?.toLowerCase().includes('maritim') || sub.targetAudience?.toLowerCase().includes('enterprise')
        ? 'B2B Trust & Keandalan SLA'
        : 'Brand Awareness & Jangkauan Pasar'
    );
    setCurateBrandTarget(isCorcommUser ? '@telkomproperty' : (sub.brandTarget || '@telprodico'));
    setCurateTargetDate(sub.requestedPublishDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
    setCuratePillar(isCorcommUser ? 'Corporate / Reputation' : (sub.contentPillarSuggestion || 'Product Education'));
    setCurateFormat('Carousel');
    setCurateKeyMessage(`Publikasi terarah tema regional: ${sub.topic} untuk kawasan ${sub.regional}`);
    setCurateCorcommApproval(isCorcommUser);
  };

  // Helper to open asset upload modal (Fase 2)
  const openUploadAssetModal = (item: ContentItem) => {
    setUploadAssetItem(item);
    setUploadedFileName(item.supportingAsset && !item.supportingAsset.includes('Belum') ? item.supportingAsset : '');
    setUploadedDriveUrl('');
    setUploadedDocName(item.supportingDataEvidence && !item.supportingDataEvidence.includes('Belum') ? item.supportingDataEvidence : '');
    setUploadedNotes(item.readinessNotes || '');
  };

  // Count items by Phase for quick filter badges
  const phaseCounts = useMemo(() => {
    let countPhase1 = 0;
    let countPhase2 = 0;
    let countPublished = 0;

    contents.forEach(item => {
      const isPublished = item.status === 'PUBLISHED';
      const isPhase1 =
        item.status === 'PLANNED' ||
        item.status === 'IDEA' ||
        item.supportingAssetStatus?.toLowerCase().includes('belum ada file') ||
        item.supportingAssetStatus?.toLowerCase().includes('pending') ||
        item.supportingAssetStatus?.toLowerCase().includes('curated from regional') ||
        !item.supportingAsset;

      if (isPublished) {
        countPublished++;
      } else if (isPhase1) {
        countPhase1++;
      } else {
        countPhase2++;
      }
    });

    return { countPhase1, countPhase2, countPublished };
  }, [contents]);

  // Count items by Owner for filter dropdown
  const ownerCounts = useMemo(() => {
    let marcomm = 0;
    let regional = 0;
    let corcomm = 0;
    let joint = 0;

    contents.forEach(item => {
      const o = (item.contentOwner || '').toLowerCase();
      if (o.includes('regional') || !!item.regionalUnit || !!item.picRegional) {
        regional++;
      } else if (o.includes('corcomm')) {
        corcomm++;
      } else if (o.includes('joint')) {
        joint++;
      } else {
        marcomm++;
      }
    });

    return { marcomm, regional, corcomm, joint, total: contents.length };
  }, [contents]);

  // Count items by Brand for quick toggle
  const brandCounts = useMemo(() => {
    let dico = 0;
    let property = 0;

    contents.forEach(item => {
      const ch = (item.channel || item.platform || '').toLowerCase();
      const ow = (item.contentOwner || '').toLowerCase();
      if (ch.includes('@telkomproperty') || ow.includes('corcomm')) {
        property++;
      } else {
        dico++;
      }
    });

    return { dico, property, total: contents.length };
  }, [contents]);

  // Count items pending Corcomm review (for Co-Governance oversight)
  const corcommPendingCount = useMemo(() => {
    return contents.filter(item => item.corcommReviewStatus !== 'Reviewed').length;
  }, [contents]);

  // Count items by Origin: Inisiatif Mandiri Pusat (Marcomm/Corcomm) vs Usulan Daerah (Regional)
  const originCounts = useMemo(() => {
    let hqInitiatives = 0;
    let regionalSubmissions = 0;

    contents.forEach(item => {
      const isReg =
        (item.contentOwner || '').toLowerCase().includes('regional') ||
        !!item.regionalUnit ||
        !!item.picRegional ||
        item.supportingAssetStatus?.toLowerCase().includes('regional');

      if (isReg) {
        regionalSubmissions++;
      } else {
        hqInitiatives++;
      }
    });

    return { hqInitiatives, regionalSubmissions, total: contents.length };
  }, [contents]);

  // Filtered Content Planner Items
  const filteredContents = contents.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.topicIdea && item.topicIdea.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.keyMessage && item.keyMessage.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.picName && item.picName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.primaryObjective && item.primaryObjective.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || item.status.toUpperCase() === statusFilter.toUpperCase();

    // Flexible owner matching supporting regional units, sub-brands, and joint initiatives
    const matchesOwner =
      ownerFilter === 'ALL' ||
      item.contentOwner === ownerFilter ||
      (ownerFilter === 'Regional' && (
        item.contentOwner?.toLowerCase().includes('regional') ||
        !!item.regionalUnit ||
        !!item.picRegional
      )) ||
      (ownerFilter === 'Corcomm' && item.contentOwner?.toLowerCase().includes('corcomm')) ||
      (ownerFilter === 'Marcomm' && item.contentOwner?.toLowerCase().includes('marcomm')) ||
      (ownerFilter === 'Joint' && item.contentOwner?.toLowerCase().includes('joint'));

    const matchesChannel = channelFilter === 'ALL' || item.channel === channelFilter || item.platform?.includes(channelFilter);

    // Brand target filter (@telprodico vs @telkomproperty)
    const matchesBrand =
      brandFilter === 'ALL' ||
      (brandFilter === '@telprodico' && (
        item.channel?.toLowerCase().includes('@telprodico') ||
        item.platform?.toLowerCase().includes('@telprodico') ||
        (item.contentOwner || '').toLowerCase().includes('marcomm')
      )) ||
      (brandFilter === '@telkomproperty' && (
        item.channel?.toLowerCase().includes('@telkomproperty') ||
        item.platform?.toLowerCase().includes('@telkomproperty') ||
        (item.contentOwner || '').toLowerCase().includes('corcomm')
      ));

    // Co-Governance Corcomm Approval filter
    const matchesCorcommApproval =
      corcommFilter === 'ALL' ||
      (corcommFilter === 'REVIEWED' && item.corcommReviewStatus === 'Reviewed') ||
      (corcommFilter === 'PENDING' && item.corcommReviewStatus !== 'Reviewed');

    // Phase Filter (Fase 1 vs Fase 2)
    const isPublished = item.status === 'PUBLISHED';
    const isPhase1 =
      item.status === 'PLANNED' ||
      item.status === 'IDEA' ||
      item.supportingAssetStatus?.toLowerCase().includes('belum ada file') ||
      item.supportingAssetStatus?.toLowerCase().includes('pending') ||
      item.supportingAssetStatus?.toLowerCase().includes('curated from regional') ||
      !item.supportingAsset;

    const matchesPhase =
      phaseFilter === 'ALL' ||
      (phaseFilter === 'PHASE_1_THEME' && isPhase1 && !isPublished) ||
      (phaseFilter === 'PHASE_2_ASSET' && !isPhase1 && !isPublished) ||
      (phaseFilter === 'PUBLISHED' && isPublished);

    // Inisiatif Mandiri Pusat vs Usulan Daerah
    const isRegionalOrigin =
      (item.contentOwner || '').toLowerCase().includes('regional') ||
      !!item.regionalUnit ||
      !!item.picRegional ||
      item.supportingAssetStatus?.toLowerCase().includes('regional');

    const matchesOrigin =
      originFilter === 'ALL' ||
      (originFilter === 'HQ_INITIATIVE' && !isRegionalOrigin) ||
      (originFilter === 'REGIONAL_SUBMISSION' && isRegionalOrigin);

    return matchesSearch && matchesStatus && matchesOwner && matchesChannel && matchesBrand && matchesCorcommApproval && matchesPhase && matchesOrigin;
  });

  // Strict Regional Data Isolation & Filtering
  const visibleRegionalSubmissions = useMemo(() => {
    let list = regionalSubmissions;

    // RULE 1: Regional Creator can ONLY see their own regionalUnit!
    if (isRegionalUser) {
      list = list.filter(s => s.regional === userRegion);
    } else if (regionalUnitFilter !== 'ALL') {
      list = list.filter(s => s.regional === regionalUnitFilter);
    }

    // Status Filter (Point 3: "Status ditambahkan")
    if (regionalStatusFilter !== 'ALL') {
      list = list.filter(s => s.currentStatus === regionalStatusFilter);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s =>
        s.topic.toLowerCase().includes(q) ||
        s.activity.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q) ||
        (s.picRegional && s.picRegional.toLowerCase().includes(q)) ||
        (s.targetAudience && s.targetAudience.toLowerCase().includes(q))
      );
    }

    return list;
  }, [regionalSubmissions, isRegionalUser, userRegion, regionalUnitFilter, regionalStatusFilter, searchQuery]);

  // Status Counts for KPI Cards & Chips
  const regionalStatusCounts = useMemo(() => {
    const baseList = isRegionalUser
      ? regionalSubmissions.filter(s => s.regional === userRegion)
      : (regionalUnitFilter === 'ALL' ? regionalSubmissions : regionalSubmissions.filter(s => s.regional === regionalUnitFilter));

    return {
      total: baseList.length,
      submitted: baseList.filter(s => s.currentStatus === 'SUBMITTED TO MARCOMM').length,
      revision: baseList.filter(s => s.currentStatus === 'REVISION REQUESTED').length,
      accepted: baseList.filter(s => s.currentStatus === 'ACCEPTED' || s.currentStatus === 'CONVERTED TO CONTENT PLAN').length,
      draft: baseList.filter(s => s.currentStatus === 'REGIONAL DRAFT' || s.currentStatus === 'DRAFT').length
    };
  }, [regionalSubmissions, isRegionalUser, userRegion, regionalUnitFilter]);

  // Count pending regional submissions for Marcomm review
  const pendingRegionalCount = regionalSubmissions.filter(s =>
    s.currentStatus === 'SUBMITTED TO MARCOMM' || s.currentStatus === 'DRAFT'
  ).length;

  const isOwner = isContentPlannerOwner(activeUser);
  const canCurate = canCurateRegional(activeUser);

  // Field AI Quick Templates (Referensi Tren Industri B2B & Properti)
  const fieldTemplates = [
    {
      id: 'custom-free-topic',
      icon: '✍️',
      badge: 'Fleksibel',
      title: 'Topik Bebas (Tulis Kegiatan Sendiri)',
      brandTarget: 'MARCOMM_CHOICE' as const,
      desc: 'Punya kegiatan yang tidak ada di daftar pilihan lain? Pilih ini dan ketik kegiatan Anda di catatan di bawah, AI akan menyusun format, sudut pandang pesan, & shot list khusus.',
      samplePrompt: 'Kegiatan inisiatif atau momen khusus regional yang ingin dipublikasikan.',
      trendAngle: 'Mengangkat inisiatif orisinal dari wilayah dengan narasi yang relevan, otentik, dan berdampak bagi mitra serta publik.',
      recommendedFormat: 'Carousel / Video Reels Sesuai Jenis Kegiatan',
      shotList: [
        '📸 Foto 1 (Hero/Wide): Momen utama kegiatan berlangsung dengan suasana ramai & representatif.',
        '📸 Foto 2 (Detail/Action): Interaksi peserta, perangkat/fasilitas, atau proses kerja nyata.',
        '🎥 Video 5-10 Detik: Cuplikan dinamis suasana kegiatan lapangan secara bergerak.',
        '💡 Panduan Kualitas: Pastikan pencahayaan cukup, tangkap ekspresi tulus, dan hindari foto buram.'
      ],
      defaultPillar: 'Community & Regional Initiative',
      targetAudience: 'Mitra Usaha, Klien Korporat & Publik Wilayah'
    },
    {
      id: 'enterprise-client',
      icon: '🏢',
      badge: 'Solusi B2B & Telco',
      title: 'Kunjungan Site & Aktivasi Klien Enterprise',
      brandTarget: '@telprodico' as const,
      desc: 'Dokumentasi serah terima layanan dedicated fiber optik & SLA 99.98% di pabrik, RSUD, kampus, atau kawasan industri.',
      samplePrompt: 'Kunjungan teknis dan serah terima link dedicated internet 1Gbps untuk klien industri di wilayah.',
      trendAngle: 'Konten kemitraan B2B nyata membuktikan reliabilitas tanpa klaim kosong, meningkatkan engagement organik LinkedIn & Instagram hingga 3.2x lipat.',
      recommendedFormat: 'Instagram Carousel (5 Slide) & LinkedIn Post',
      shotList: [
        '📸 Foto 1 (Hero/Wide): Tim teknisi & klien saat serah terima perangkat atau jabat tangan di depan gedung/fasilitas.',
        '📸 Foto 2 (Detail/Action): Sudut perangkat rack server / router aktif dengan indikator lampu hijau menyala rapi.',
        '🎥 Video 5-10 Detik: B-roll teknisi menguji kecepatan koneksi (speedtest) atau menjelaskan topologi jaringan.',
        '💡 Panduan Kualitas: Hindari memfoto layar konfigurasi IP/password sensitif, pastikan seragam & APD terlihat rapi.'
      ],
      defaultPillar: 'Product Excellence',
      targetAudience: 'Manajer IT, CTO, Direktur Operasional & Pelaku Industri Regional'
    },
    {
      id: 'network-standby',
      icon: '⚡',
      badge: 'Keandalan 24/7',
      title: 'Siaga Teknisi & Keandalan Jaringan Cuaca Ekstrem',
      brandTarget: '@telprodico' as const,
      desc: 'Dokumentasi dedikasi tim teknisi siaga lapangan menjaga keutuhan jaringan saat cuaca ekstrem atau event akbar daerah.',
      samplePrompt: 'Kesiapan tim preventive maintenance lapangan dalam menjaga SLA uptime jaringan 99.9% selama perhelatan akbar daerah.',
      trendAngle: 'Tren "Behind-The-Scenes Heroes" menonjolkan dedikasi humanis dan dedikasi teknisi di gardu/lapangan, memicu sentimen positif publik tertinggi.',
      recommendedFormat: 'Video Reels Vertikal (9:16) & Single Post Storytelling',
      shotList: [
        '📸 Foto 1 (Hero/Wide): Teknisi dengan rompi/APD lengkap sedang melakukan inspeksi di gardu jaringan outdoor.',
        '📸 Foto 2 (Detail/Action): Alat ukur OTDR atau proses splicing kabel fiber optik saat tim bekerja cermat.',
        '🎥 Video 7 Detik: Tim teknisi tersenyum menyapa dari mobil operasional siaga atau saat berpatroli.',
        '💡 Panduan Kualitas: Tampilkan ketelitian kerja, utamakan standar K3, hindari sudut foto berbahaya.'
      ],
      defaultPillar: 'Operational Reliability',
      targetAudience: 'Klien Korporat, Instansi Publik & Mitra Telekomunikasi Wilayah'
    },
    {
      id: 'smart-facility',
      icon: '🌿',
      badge: 'Properti & Fasilitas',
      title: 'Smart Workspace & Efisiensi Energi Fasilitas Gedung',
      brandTarget: '@telkomproperty' as const,
      desc: 'Dokumentasi modernisasi ruang kerja bersama, efisiensi energi smart building, dan audit kenyamanan gedung perkantoran.',
      samplePrompt: 'Penerapan pencahayaan hemat energi dan modernisasi fasilitas ruang kerja bersama di gedung TELPRO wilayah.',
      trendAngle: 'Tren sustainability (ESG) dan ruang kerja fleksibel menjadi pertimbangan utama direksi dan manajer GA dalam memilih gedung sewa kantor 2026.',
      recommendedFormat: 'Carousel Infografis Fakta Gedung & Foto Arsitektural Bersih',
      shotList: [
        '📸 Foto 1 (Hero/Wide): Sudut luas lobby atau ruang kerja modern yang terang, bersih, dan estetik.',
        '📸 Foto 2 (Detail/Fasilitas): Fasilitas penunjang (ruang meeting interaktif, area hijau indoor, panel sensor hemat energi).',
        '🎥 Video 8 Detik: Tur singkat suasana kerja yang nyaman dan kondusif bagi tenant korporat.',
        '💡 Panduan Kualitas: Ambil foto saat pencahayaan alami terbaik (siang hari), rapikan meja kerja sebelum difoto.'
      ],
      defaultPillar: 'Workplace & Facility Excellence',
      targetAudience: 'Penyewa Gedung (Tenant), Manajer GA Perusahaan & Pelaku Bisnis Properti'
    },
    {
      id: 'infrastructure-rollout',
      icon: '🚀',
      badge: 'Ekspansi Jaringan',
      title: 'Rollout ODP Baru & Penetrasi Jaringan Daerah',
      brandTarget: '@telprodico' as const,
      desc: 'Dokumentasi peresmian Optical Distribution Point (ODP) baru, kabel bawah tanah, atau ekspansi jalur backbone.',
      samplePrompt: 'Peresmian 40 titik ODP fiber optik baru untuk menjamin keandalan akses telekomunikasi di sentra logistik pelabuhan.',
      trendAngle: 'Pengumuman ekspansi infrastruktur fisik menegaskan kepemimpinan pasar dan memberikan kepastian kesiapan jaringan bagi investor daerah.',
      recommendedFormat: 'Infografis Peta Jangkauan & Carousel Dokumentasi Lapangan',
      shotList: [
        '📸 Foto 1 (Hero/Wide): Box ODP baru yang terpasang rapi dengan identitas TELPRO di tiang/manhole strategis.',
        '📸 Foto 2 (Detail/Action): Tim teknisi memegang diagram topologi jangkauan bersama tim pengawas lapangan.',
        '🎥 Video 5 Detik: Pemasangan segel sambungan atau pengujian kelayakan sinyal fiber optik.',
        '💡 Panduan Kualitas: Sorot kerapian kabel (cable management) sebagai bukti standar mutu teknis TELPRO.'
      ],
      defaultPillar: 'Infrastructure Reliability',
      targetAudience: 'Pelaku Usaha Distribusi, Kawasan Industri & Pengembang Kawasan'
    },
    {
      id: 'new-tenant-welcome',
      icon: '🏗️',
      badge: 'Gedung & Komersial',
      title: 'Penyambutan Tenant Korporat Baru di Gedung TELPRO',
      brandTarget: '@telkomproperty' as const,
      desc: 'Dokumentasi serah terima kunci ruang kantor atau kemitraan pengelolaan gedung dengan mitra korporat prestisius.',
      samplePrompt: 'Serah terima ruang kantor modern 500m2 untuk perusahaan logistik multinasional di gedung Telpro Regional.',
      trendAngle: 'Menampilkan tenant korporat ternama yang memilih gedung TELPRO membangun bukti sosial (social proof) terkuat untuk menarik tenant baru.',
      recommendedFormat: 'Single Post Eksklusif & Instagram Story Sambutan',
      shotList: [
        '📸 Foto 1 (Hero/Wide): Serah terima simbolis atau jabat tangan di lobby utama dengan backdrop logo TELPRO.',
        '📸 Foto 2 (Detail/Suasana): Ruang kantor baru yang telah ditata rapi, bersih, dan siap ditempati tim penyewa.',
        '🎥 Video 6 Detik: Ucapan selamat datang hangat dari building manager TELPRO wilayah.',
        '💡 Panduan Kualitas: Pastikan izin penayangan logo mitra telah disepakati, jaga sudut foto tetap profesional.'
      ],
      defaultPillar: 'Customer Partnership',
      targetAudience: 'Eksekutif Korporat, Konsultan Properti & Perusahaan Pencari Ruang Kantor'
    },
    {
      id: 'umkm-community',
      icon: '🤝',
      badge: 'Dampak Sosial & UMKM',
      title: 'Pemberdayaan Komunitas Digital & UMKM Daerah',
      brandTarget: 'MARCOMM_CHOICE' as const,
      desc: 'Inisiatif internet gratis, pelatihan pemasaran digital, atau sinergi Telpro dengan sentra kerajinan rakyat binaan.',
      samplePrompt: 'Pelatihan adopsi digital dan penyediaan akses internet Wi-Fi super cepat di pasar modern dan sentra kerajinan wilayah.',
      trendAngle: 'Keterlibatan sosial lokal (CSR/ESG) memperkuat kedekatan emosional warga dan stakeholder pemerintah daerah terhadap brand TELPRO.',
      recommendedFormat: 'Human Interest Carousel Foto & Video Dokumenter Pendek',
      shotList: [
        '📸 Foto 1 (Hero/Wide): Interaksi hangat staf TELPRO mendampingi pelaku usaha lokal menggunakan aplikasi digital.',
        '📸 Foto 2 (Detail/Produk): Produk kerajinan lokal berpadu dengan materi promosi internet andal TELPRO.',
        '🎥 Video 8 Detik: Testimoni singkat 1 kalimat dari pedagang/pengrajin lokal yang terbantu usahanya.',
        '💡 Panduan Kualitas: Tangkap ekspresi natural dan senyuman tulus, hindari pose kaku berbaris formal.'
      ],
      defaultPillar: 'Community Impact',
      targetAudience: 'Masyarakat Daerah, Dinas Terkait, Asosiasi UMKM & Warganet'
    }
  ];

  // Helper to generate full AI recommendation format
  const handleGenerateTrendAI = (
    trendId?: string,
    customNotes?: string,
    brandChoice?: string,
    trackChoice?: string
  ) => {
    setIsGeneratingFieldAI(true);
    const isCustomMode = aiSubMode === 'FREE_TOPIC' || trendId === 'custom-free-topic';
    const trend = isCustomMode
      ? fieldTemplates.find(t => t.id === 'custom-free-topic') || fieldTemplates[0]
      : fieldTemplates.find(t => t.id === (trendId || selectedTrendId)) || fieldTemplates[0];
    const brand = (brandChoice || newRegionalData.brandTarget || trend.brandTarget) as '@telprodico' | '@telkomproperty' | 'MARCOMM_CHOICE';
    const track = (trackChoice || newRegionalData.submissionTrack || 'MONTHLY_AGENDA') as 'MONTHLY_AGENDA' | 'FAST_TRACK_URGENT';
    const notes = customNotes !== undefined ? customNotes : customFieldNotes;

    setTimeout(() => {
      let dynamicTopic = `${trend.title} — ${userRegion}`;
      let dynamicActivity = trend.desc.split('.')[0];
      let dynamicLocation = `${userRegion} — Area Operasional & Fasilitas Regional`;
      let dynamicAudience = brand === '@telprodico'
        ? 'Manajer IT, CTO, Pelaku Industri & Klien Enterprise'
        : 'Tenant Gedung, Tamu Korporat, Stakeholder & Publik Wilayah';
      let dynamicPillar = brand === '@telprodico' ? 'Product Excellence' : 'Corporate & Workplace Excellence';
      let dynamicAngle = trend.trendAngle;
      let dynamicFormat = trend.recommendedFormat;
      let dynamicShotList = [...trend.shotList];

      if (isCustomMode) {
        const trimmed = notes ? notes.trim() : '';
        if (trimmed) {
          dynamicTopic = trimmed.length > 55 ? trimmed.slice(0, 52) + '...' : trimmed;
          dynamicActivity = trimmed;
          dynamicAngle = brand === '@telprodico'
            ? `Menonjolkan keunggulan produk/solusi B2B TELPRO melalui "${trimmed}" untuk memperkuat kepercayaan klien korporat di ${userRegion}.`
            : `Mempublikasikan info korporat/fasilitas "${trimmed}" untuk memperkuat citra tata kelola, K3, dan kepedulian lingkungan TELPRO di ${userRegion}.`;

          const lower = trimmed.toLowerCase();
          if (lower.includes('kunjungan') || lower.includes('direksi') || lower.includes('tamu') || lower.includes('audiensi')) {
            dynamicFormat = 'Instagram Carousel (5 Slide) & LinkedIn Recap';
            dynamicShotList = [
              '📸 Foto 1 (Hero/Wide): Penyambutan hangat & penerimaan kunjungan pimpinan/tamu di lokasi utama.',
              '📸 Foto 2 (Detail/Action): Walkthrough fasilitas, sesi peninjauan lapangan, atau pemaparan progres.',
              '📸 Foto 3 (Interaksi): Diskusi interaktif, pertukaran cenderamata, atau momen ramah tamah.',
              '🎥 Video 6-10 Detik: B-roll dinamis saat rombongan meninjau operasional atau menyapa tim.',
              '💡 Panduan Kualitas: Jaga kerapian seragam tim, pastikan backdrop/logo perusahaan terlihat jelas & tidak terpotong.'
            ];
          } else if (lower.includes('damkar') || lower.includes('kebakaran') || lower.includes('simulasi') || lower.includes('bencana') || lower.includes('hse') || lower.includes('k3')) {
            dynamicFormat = 'Video Reels Vertikal (9:16) & Foto Edukasi K3';
            dynamicShotList = [
              '📸 Foto 1 (Hero/Wide): Briefing kesiapan tim tanggap darurat (HSE/K3) sebelum latihan dimulai.',
              '🎥 Video 5-8 Detik: Aksi praktik pemadaman api (APAR/Hydrant) atau simulasi evakuasi tertib.',
              '📸 Foto 2 (Detail): Petugas mengarahkan jalur evakuasi atau penggunaan perlengkapan keselamatan.',
              '📸 Foto 3 (Closing): Evaluasi keselamatan bersama Dinas Damkar/Instansi terkait dan komitmen Zero Accident.',
              '💡 Panduan Kualitas: Utamakan rekaman video bergerak (bukan hanya foto diam) untuk aksi simulasi.'
            ];
          } else if (lower.includes('csr') || lower.includes('sosial') || lower.includes('bantuan') || lower.includes('pohon') || lower.includes('lingkungan')) {
            dynamicFormat = 'Human Interest Carousel & Story Dokumentasi';
            dynamicShotList = [
              '📸 Foto 1 (Hero/Wide): Momen aksi bersama warga atau penerima manfaat di lokasi kegiatan.',
              '📸 Foto 2 (Detail/Human): Ekspresi senyum tulus penerima bantuan atau aksi langsung tim relawan.',
              '🎥 Video 5-10 Detik: Testimoni singkat atau pesan kebersamaan dari perwakilan warga/mitra.',
              '💡 Panduan Kualitas: Tampilkan kedekatan emosional yang tulus dan hindari pose penyerahan bantuan yang terkesan kaku.'
            ];
          } else if (brand === '@telprodico') {
            dynamicFormat = 'Instagram Carousel (5 Slide) & LinkedIn Solusi B2B';
            dynamicShotList = [
              `📸 Foto 1 (Hero/Wide): Tim teknisi dan fasilitas implementasi produk pada kegiatan "${dynamicTopic}".`,
              '📸 Foto 2 (Detail Perangkat/Sinyal): Rak server/ODP/indikator koneksi aktif yang rapi dan teruji.',
              '🎥 Video 6-10 Detik: Teknisi mendemonstrasikan stabilitas jaringan / serah terima layanan.',
              '💡 Panduan Kualitas: Tampilkan standar kerapian kabel (cable management) dan kelengkapan APD.'
            ];
          } else {
            dynamicShotList = [
              `📸 Foto 1 (Hero/Wide): Momen utama pelaksanaan kegiatan "${dynamicTopic}" di fasilitas wilayah.`,
              '📸 Foto 2 (Detail/Action): Interaksi tim kerja, suasana ruang kantor, atau pelayanan kepada tenant.',
              '🎥 Video 5-10 Detik: Klip video dinamis memperlihatkan antusiasme & suasana nyata di lokasi.',
              '💡 Panduan Kualitas: Pastikan pencahayaan cukup, foto tajam, dan seragam representatif.'
            ];
          }
        } else {
          dynamicTopic = brand === '@telprodico' ? `Kegiatan Solusi Produk — ${userRegion}` : `Info Kegiatan Korporat — ${userRegion}`;
          dynamicActivity = `Inisiatif kegiatan yang dilaksanakan oleh tim ${userRegion}.`;
        }
      } else if (notes && notes.trim()) {
        dynamicTopic = `${trend.title}: ${notes.trim().slice(0, 60)}`;
        dynamicActivity = notes.trim();
      }

      let dynamicCaption = '';
      if (isCustomMode && notes && notes.trim()) {
        if (brand === '@telkomproperty') {
          dynamicCaption = `Mewujudkan pengelolaan fasilitas berstandar tinggi dan lingkungan kerja prima di ${userRegion}! 🏢✨\n\nMelalui kegiatan "${notes.trim()}", kami terus mengedepankan budaya kerja solid, keselamatan K3, serta kenyamanan prima bagi seluruh tenant dan mitra bisnis.\n\nBersama melangkah maju memberikan pelayanan fasilitas terbaik!\n\n#TELPROProperty #InfoPerusahaan #SmartBuilding #K3Nasional #${userRegion.replace(/\s+/g, '')} #TelkomProperty #FasilitasPrima`;
        } else {
          dynamicCaption = `Mendukung percepatan digital dan pertumbuhan mitra bisnis melalui solusi produk konektivitas andal di ${userRegion}! 🚀\n\nMelalui kegiatan "${notes.trim()}", tim TELPRO senantiasa memastikan keandalan infrastruktur dan standar SLA 99.98% demi kepuasan operasional klien industri.\n\nMitra digital terpercaya untuk pertumbuhan tanpa batas!\n\n#TELPRODigital #ProdukSolusiB2B #KonektivitasAndal #${userRegion.replace(/\s+/g, '')} #DedicatedInternet #SLA9998`;
        }
      } else if (brand === '@telkomproperty') {
        dynamicCaption = `Mewujudkan lingkungan kerja modern, aman, dan berdaya saing tinggi! Tim TELPRO ${userRegion} berkomitmen menghadirkan pengelolaan fasilitas gedung berstandar prima untuk menunjang produktivitas setiap tenant dan mitra bisnis di wilayah kami.\n\nFasilitas terawat, efisiensi energi optimal, dan kenyamanan kerja tanpa kompromi.\n\n#TELPROProperty #InfoPerusahaan #GedungKomersial #SmartWorkspace #${userRegion.replace(/\s+/g, '')} #TelkomProperty #FasilitasPrima`;
      } else {
        dynamicCaption = `Akselerasi konektivitas terdepan di seluruh penjuru negeri! Tim TELPRO ${userRegion} senantiasa menjaga keandalan infrastruktur telekomunikasi dengan standar SLA 99.98% demi menopang kelancaran operasional mitra industri dan enterprise di wilayah.\n\nMitra digital andal untuk pertumbuhan bisnis tanpa batas.\n\n#TELPRODigital #ProdukSolusiB2B #KonektivitasAndal #${userRegion.replace(/\s+/g, '')} #DedicatedInternet #EnterpriseConnectivity`;
      }

      const marcommAlignment = brand === '@telprodico'
        ? '✅ Selaras dengan Prioritas Marcomm: Akselerasi B2B Dedicated Connectivity & Penetrasi ODP Regional (Pilar Product Excellence)'
        : '✅ Selaras dengan Prioritas Corcomm: Bulan K3 Nasional, Manajemen Fasilitas Cerdas & Green Office (Pilar Corporate & Workplace Excellence)';

      const safetyGuardrails = brand === '@telprodico'
        ? [
            '🦺 Standar K3 Lapangan: Teknisi wajib mengenakan helm keselamatan, rompi safety berstandar, dan sarung tangan saat instalasi kabel/ODP.',
            '🏷️ Atribut Korporat: Pastikan seragam berlogo resmi TELPRO rapi, ID Card tampak jelas, dan dilarang merokok saat sesi dokumentasi foto/video.',
            '✨ Standar Kerapian Teknis (Cable Management): Foto rak server/perangkat wajib tersusun rapi tanpa kabel menjuntai berantakan demi mencerminkan SLA 99.98%.',
            '🔒 Kerahasiaan Klien: Jangan menampilkan nomor IP internal, password jaringan, atau data sensitif klien di layar monitor.'
          ]
        : [
            '🦺 Standar Keselamatan HSE: Saat simulasi evakuasi/Damkar, seluruh tim dan peserta wajib mematuhi arahan instruktur & jalur evakuasi steril.',
            '🏢 Citra Fasilitas & Lingkungan: Pastikan lobi, ruang rapat, dan koridor gedung tampak bersih, pencahayaan terang, dan bebas dari sampah visual.',
            '🤝 Nilai Budaya AKHLAK: Tampilkan keramahan dan sikap melayani (hospitality) saat berinteraksi dengan tenant gedung dan tamu korporat.',
            '📸 Representasi Seragam: Seluruh staf memakai seragam kerja resmi berlogo Telkom Property dengan rapi dan bersepatu formal/safety.'
          ];

      // Format 1: Instagram Story (9:16)
      const storyPkg = brand === '@telprodico'
        ? {
            hook: `Akselerasi Jaringan B2B di ${userRegion}! ⚡`,
            interactiveStickers: [
              `📍 Lokasi: ${userRegion}`,
              '📊 Polling: Seberapa penting SLA 99.98% untuk operasional bisnismu? [Wajib 100% | Sangat Penting]',
              '🔗 Stiker Link: Konsultasi Solusi B2B TELPRO'
            ],
            textOverlay: `Tim teknisi ${userRegion} memastikan konektivitas industri tetap stabil tanpa jeda! Geser untuk melihat aksi di lapangan 👉`,
            visualPrompt: 'Klip vertikal 9:16 (5-7 detik) memperlihatkan teknisi dengan APD lengkap mengecek lampu indikator hijau pada rak server.'
          }
        : {
            hook: `Kesiapan Fasilitas & K3 Prima di ${userRegion}! 🏢✨`,
            interactiveStickers: [
              `📍 Lokasi: Gedung Menara ${userRegion}`,
              '❓ Stiker Tanya Jawab: Kapan terakhir kali gedung kantormu mengadakan simulasi tanggap darurat?',
              '✨ Stiker GIF: #TelkomProperty #SafetyFirst #AKHLAK'
            ],
            textOverlay: `Mewujudkan lingkungan kerja yang aman, sehat, dan nyaman untuk seluruh tenant kami di ${userRegion}.`,
            visualPrompt: 'Klip vertikal 9:16 (5-7 detik) suasana lobi modern dan senyum ramah tim operasional menyambut tenant.'
          };

      // Format 2: Instagram Feed (Carousel)
      const feedPkg = brand === '@telprodico'
        ? {
            hookHeadline: `Menjaga Denyut Bisnis Industri ${userRegion} Tetap Terhubung Tanpa Batas`,
            carouselSlides: [
              `Slide 1 (Cover): Foto hero tim teknisi di depan fasilitas klien + Headline "${dynamicTopic}"`,
              `Slide 2 (Konteks Lapangan): Rincian implementasi jaringan fiber optik andal di wilayah ${userRegion}`,
              'Slide 3 (Standar Mutu): Pembuktian stabilitas jaringan dengan pemantauan 24/7 dan SLA 99.98%',
              'Slide 4 (Penutup & CTA): Konsultasikan kebutuhan infrastruktur B2B perusahaan Anda bersama tim TELPRO'
            ],
            captionDraft: dynamicCaption
          }
        : {
            hookHeadline: `Standar Fasilitas Prima & Keselamatan Kerja Tanpa Kompromi di ${userRegion}`,
            carouselSlides: [
              `Slide 1 (Cover): Foto lobi / briefing tim fasilitas dengan pencahayaan hangat + Headline "${dynamicTopic}"`,
              `Slide 2 (Konteks Kegiatan): Pelaksanaan "${dynamicActivity}" bersama tim K3 dan tenant gedung`,
              'Slide 3 (Nilai & Dampak): Kenyamanan maksimal bagi tenant dengan penerapan standar Smart & Green Building',
              'Slide 4 (Penutup & CTA): Bersama mewujudkan ruang kerja aman, produktif, dan berkelanjutan'
            ],
            captionDraft: dynamicCaption
          };

      // Format 3: Instagram Reels (Video Vertikal 9:16)
      const reelsPkg = brand === '@telprodico'
        ? {
            threeSecHook: `Pernah penasaran bagaimana internet pabrik tetap stabil 24 jam nonstop di ${userRegion}? 👀⚡`,
            storyboard: [
              {
                timestamp: '00:00 - 00:03',
                visual: 'Hook visual cepat: Teknisi membuka kabinet server rapi dengan sorot lampu indikator aktif.',
                audioAction: 'Voiceover: "Pernah penasaran bagaimana internet pabrik tetap stabil 24 jam nonstop?" + Efek Whoosh.'
              },
              {
                timestamp: '00:03 - 00:10',
                visual: 'B-roll transisi dinamis: Pengecekan redaman kabel fiber optik dengan OTDR dan kalibrasi perangkat.',
                audioAction: 'Beat musik elektronik korporat modern mulai menghentak (Tempo dinamis 120 BPM).'
              },
              {
                timestamp: '00:10 - 00:20',
                visual: 'Interaksi hangat: Serah terima uji kestabilan sinyal bersama IT Manager klien enterprise dengan senyum puas.',
                audioAction: 'Voiceover: "Melalui dedikasi tim lapangan TELPRO, SLA 99.98% bukan sekadar janji, tapi bukti nyata."'
              },
              {
                timestamp: '00:20 - 00:30',
                visual: 'Tim berpose jempol di depan logo perusahaan + Bumper logo resmi TELPRO Digital.',
                audioAction: 'Musik memuncak + Text Call-to-Action: "Konektivitas andal untuk bisnis Anda. Simpan video ini!"'
              }
            ],
            recommendedAudioMood: 'Upbeat Corporate Electronic / Modern Tech Pulse (Tempo 120 BPM, vibe profesional & energik)',
            captionDraft: `Dibalik kelancaran bisnis dan operasional industri di ${userRegion}, ada komitmen tanpa henti dari tim teknisi TELPRO! 🚀\n\nMenjaga keandalan konektivitas dengan standar SLA 99.98% adalah prioritas kami. Tulis di kolom komentar kebutuhan solusi bisnismu!\n\n#TELPRODigital #SolusiB2B #ReelsEdukasi #${userRegion.replace(/\s+/g, '')} #TeknisiTelco`
          }
        : {
            threeSecHook: `Apa yang terjadi kalau alarm darurat gedung berbunyi di ${userRegion}? 🚨🏢`,
            storyboard: [
              {
                timestamp: '00:00 - 00:03',
                visual: 'Hook visual: Bunyi sirine simulasi + langkah tegap tim HSE bergerak terkoordinasi.',
                audioAction: 'Voiceover: "Apa yang terjadi kalau alarm darurat gedung berbunyi?" + Efek suara alarm terarah.'
              },
              {
                timestamp: '00:03 - 00:10',
                visual: 'Adegan aksi simulasi: Petugas mengarahkan penghuni gedung lewat tangga darurat secara tertib dan tenang.',
                audioAction: 'Musik latar bertempo sigap & teratur mengalun dinamis.'
              },
              {
                timestamp: '00:10 - 00:20',
                visual: 'Praktik penggunaan APAR / selang hydrant bersama petugas pemadam kebakaran profesional.',
                audioAction: 'Voiceover: "Keselamatan tenant adalah prioritas nomor satu. Tanggap, terlatih, dan siap siaga."'
              },
              {
                timestamp: '00:20 - 00:30',
                visual: 'Briefing penutup Zero Accident bersama seluruh peserta + Bumper logo resmi Telkom Property.',
                audioAction: 'Musik ditutup nada ceria + Teks: "Gedung aman, kerja makin nyaman. Bagikan video ini ke rekan kerjamu!"'
              }
            ],
            recommendedAudioMood: 'Inspiring Cinematic Beat / Modern Corporate Drive (Vibe sigap, terpercaya, dan menenangkan)',
            captionDraft: `Kesiapsiagaan bukan pilihan, melainkan budaya utama di setiap fasilitas Telkom Property! 🏢✨\n\nMelalui "${dynamicTopic}", kami memastikan seluruh tenant dapat beraktivitas dengan tenang, aman, dan nyaman. Sudah siapkah tempat kerjamu hari ini?\n\n#TELPROProperty #BudayaK3 #SmartBuilding #${userRegion.replace(/\s+/g, '')} #TelkomProperty`
          };

      const recommendation = {
        topic: dynamicTopic,
        activity: dynamicActivity,
        location: dynamicLocation,
        targetAudience: dynamicAudience,
        contentPillarSuggestion: dynamicPillar,
        captionDraft: dynamicCaption,
        supportingDoc: `Dokumentasi_Foto_Video_${trend.id}_${userRegion.replace(/\s+/g, '_')}.zip`,
        trendAngle: dynamicAngle,
        recommendedFormat: dynamicFormat,
        shotList: dynamicShotList,
        corporateSafetyGuardrails: safetyGuardrails,
        marcommAlignmentNote: marcommAlignment,
        storyPackage: storyPkg,
        feedPackage: feedPkg,
        reelsPackage: reelsPkg
      };

      setGeneratedFieldDraft(recommendation);

      setNewRegionalData(prev => ({
        ...prev,
        regional: userRegion,
        topic: recommendation.topic,
        activity: recommendation.activity,
        location: recommendation.location,
        targetAudience: recommendation.targetAudience,
        contentPillarSuggestion: recommendation.contentPillarSuggestion,
        submissionTrack: track,
        brandTarget: brand,
        supportingAssetUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=400&q=80',
        supportingAssetStatus: 'Asset Ready (Verified)',
        supportingDocumentName: prev.supportingDocumentName || '',
        activityDate: prev.activityDate || new Date().toISOString().split('T')[0],
        requestedPublishDate: prev.requestedPublishDate || new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
        aiAssisted: true,
        trendAngle: recommendation.trendAngle,
        recommendedFormat: recommendation.recommendedFormat,
        shotList: recommendation.shotList,
        captionDraft: recommendation.captionDraft,
        corporateSafetyGuardrails: safetyGuardrails,
        marcommAlignmentNote: marcommAlignment,
        storyPackage: storyPkg,
        feedPackage: feedPkg,
        reelsPackage: reelsPkg
      }));

      setIsGeneratingFieldAI(false);
      setRegionalCreationStep('AI_RECOMMENDATION_REVIEW');
      showToast('✨ Format rekomendasi konten berhasil disusun oleh AI!');
    }, 600);
  };

  const handleGenerateFieldAI = (promptText?: string) => {
    handleGenerateTrendAI(selectedTrendId, promptText);
  };

  const handleApplyFieldDraftToForm = () => {
    if (!generatedFieldDraft) return;
    setNewRegionalData({
      regional: userRegion,
      topic: generatedFieldDraft.topic,
      activity: generatedFieldDraft.activity,
      location: generatedFieldDraft.location,
      activityDate: new Date().toISOString().split('T')[0],
      targetAudience: generatedFieldDraft.targetAudience,
      contentPillarSuggestion: generatedFieldDraft.contentPillarSuggestion,
      supportingAssetUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=400&q=80',
      supportingAssetStatus: 'Asset Ready (Verified)',
      supportingDocumentName: generatedFieldDraft.supportingDoc,
      requestedPublishDate: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
      picRegional: '', // Kosongkan wajib diisi nama orang
      submissionTrack: 'MONTHLY_AGENDA',
      brandTarget: '@telprodico',
      aiAssisted: true,
      trendAngle: (generatedFieldDraft as any).trendAngle,
      recommendedFormat: (generatedFieldDraft as any).recommendedFormat,
      shotList: (generatedFieldDraft as any).shotList,
      captionDraft: generatedFieldDraft.captionDraft
    });
    setRegionalCreationStep('AI_RECOMMENDATION_REVIEW');
    setIsNewRegionalModalOpen(true);
  };

  // Status Badge Styling Helper
  const getStatusBadge = (status: ContentStatus | string) => {
    const s = (status || '').toUpperCase();
    switch (s) {
      case 'IDEA':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'PLANNED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'IN PRODUCTION':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'IN REVIEW':
      case 'UNDER REVIEW':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'REVISION':
      case 'REVISION REQUIRED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'APPROVED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'SCHEDULED':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'PUBLISHED':
        return 'bg-slate-900 text-white border-slate-800';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Content Owner Badge Styling Helper
  const getOwnerBadge = (owner?: string) => {
    switch (owner) {
      case 'Marcomm':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Regional':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Corcomm':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Joint':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleCreateNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `cnt-${Date.now().toString().slice(-4)}`;
    const newVersionId = `ver-${newId}-v1`;

    const createdItem: ContentItem = {
      id: newId,
      campaignId: selectedCampaign?.id || 'cmp-2026-01',
      title: newItemData.topicIdea || newItemData.title || 'Rencana Konten Baru',
      objective: newItemData.primaryObjective || 'Brand Awareness',
      audience: newItemData.targetAudience || 'Enterprise Decision Makers',
      platform: newItemData.channel || 'LinkedIn',
      format: (newItemData.contentFormat as any) || 'Post / Feed',
      status: 'PLANNED',
      pic: newItemData.picName || activeUser.name,
      currentVersionId: newVersionId,

      // Section A: STRATEGY
      campaignProgram: newItemData.campaignProgram || 'Transformasi Digital Industri B2B 2026',
      primaryObjective: newItemData.primaryObjective || 'Brand Awareness',
      targetAudience: newItemData.targetAudience || 'Enterprise Decision Makers',
      contentPillar: (newItemData.contentPillar as any) || 'Product Excellence',
      keyMessage: newItemData.keyMessage || 'TELPRO menghadirkan solusi konektivitas berstandar SLA 99.98%.',

      // Section B: CONTENT
      topicIdea: newItemData.topicIdea || newItemData.title || 'Rencana Konten Baru',
      contentFormat: (newItemData.contentFormat as any) || 'Post / Feed',
      channel: newItemData.channel || 'LinkedIn',
      cta: 'Hubungi Call Center 1500 473 atau kunjungi www.telpro.co.id',
      sourceReference: 'Dokumentasi internal & Master Taxonomy',

      // Section C: EXECUTION
      contentOwner: newItemData.contentOwner || 'Marcomm',
      picName: newItemData.picName || activeUser.name,
      targetPublishDate: newItemData.targetPublishDate || new Date().toISOString().split('T')[0],
      priority: (newItemData.priority as any) || 'Medium',

      // Section D: READINESS
      supportingAssetStatus: newItemData.supportingAssetStatus || 'Asset Ready (Verified)',
      supportingDataEvidence: newItemData.supportingDataEvidence || 'Arsitektur Jaringan & SLA Card',
      readinessNotes: newItemData.readinessNotes || 'Direncanakan via Content Planner Single Source of Truth.'
    };

    addContentWithVersion(createdItem, {
      id: newVersionId,
      contentId: newId,
      versionNumber: 1,
      brief: `Brief rencana: ${createdItem.keyMessage}`,
      hook: `${createdItem.title} — Solusi Tepat Kebutuhan Bisnis Anda`,
      caption: `${createdItem.keyMessage}\n\nPT Telkom Property (TELPRO) siap menjadi mitra digital andal perusahaan Anda.\n\n#TELPRO2026 #InfrastrukturDigital`,
      script: '',
      cta: createdItem.cta || '',
      selectedKeywords: ['TELPRO', 'Enterprise'],
      selectedHashtags: ['#TELPRO2026'],
      createdBy: activeUser.name,
      createdAt: new Date().toISOString(),
      aiAssisted: false,
      evidenceIds: ['evd-1']
    });

    setIsNewItemModalOpen(false);
    showToast(`✅ Rencana konten "${createdItem.title}" berhasil ditambahkan ke Content Planner!`);
  };

  // Action: Marcomm / Corcomm menetapkan usulan regional jadi Kalender Konten (Fase 1: Tema & Targeting)
  const handleConfirmCurateToCalendar = () => {
    if (!curateModalSub) return;

    const brandName = curateBrandTarget === '@telprodico' ? '@telprodico' : '@telkomproperty';
    const channelPlatform = `${brandName} • Instagram & LinkedIn`;

    convertRegionalToPlanner(curateModalSub.id, {
      title: curateThemeTitle || curateModalSub.topic,
      topicIdea: curateThemeTitle || curateModalSub.topic,
      primaryObjective: curateObjective,
      objective: curateObjective,
      targetAudience: curateModalSub.targetAudience || 'Pengambil Keputusan & Manajer B2B',
      channel: channelPlatform,
      platform: channelPlatform,
      contentFormat: curateFormat,
      format: curateFormat,
      contentPillar: curatePillar,
      targetPublishDate: curateTargetDate,
      status: 'PLANNED',
      supportingAssetStatus: 'Belum Ada File (Tema & Targeting Terjadwal)',
      marcommReviewStatus: 'Reviewed',
      marcommReviewer: activeUser.name,
      marcommReviewedAt: new Date().toISOString(),
      corcommReviewStatus: curateCorcommApproval ? 'Reviewed' : 'Pending',
      corcommReviewer: curateCorcommApproval ? 'Corcomm Lead' : undefined,
      corcommReviewedAt: curateCorcommApproval ? new Date().toISOString() : undefined,
      readinessNotes: `Slot tema & targeting dikunci di kalender oleh Marcomm (${activeUser.name}) pada ${new Date().toLocaleDateString('id-ID')}. File konten fisik belum diperlukan (menunggu penyetoran materi lapangan pada Fase 2).`,
      keyMessage: curateKeyMessage || `Fokus narasi publikasi tema: ${curateThemeTitle}`
    });

    showToast(`📅 Tema "${curateThemeTitle}" berhasil dikunci di Kalender Konten! (Fase 1: Belum Perlu File)`);
    setCurateModalSub(null);
    setViewMode('planner');
    if (setActiveTab) setActiveTab('act-calendar');
  };

  // Action: Regional / Creator menyetorkan file konten lapangan (Fase 2)
  const handleSaveUploadedAsset = () => {
    if (!uploadAssetItem) return;

    setIsUploadingSimulated(true);
    setTimeout(() => {
      setIsUploadingSimulated(false);
      const assetFileName = uploadedFileName.trim() || 'Foto_Dokumentasi_Lapangan_HighRes.jpg';
      const docEvidence = uploadedDocName.trim() || (uploadedDriveUrl ? `Cloud Drive: ${uploadedDriveUrl}` : 'Berita Acara Kegiatan Lapangan');

      updateContentPlannerItem(uploadAssetItem.id, {
        ...uploadAssetItem,
        status: 'IN PRODUCTION',
        supportingAssetStatus: 'Asset Ready (Verified)',
        supportingAsset: assetFileName,
        supportingDataEvidence: docEvidence,
        readinessNotes: uploadedNotes.trim()
          ? `Materi lapangan telah disetor (${new Date().toLocaleDateString('id-ID')}): ${uploadedNotes}`
          : `File materi lapangan telah disetor lengkap oleh ${activeUser.name}. Siap untuk QC & Review publikasi.`
      });

      showToast(`✅ File konten "${uploadAssetItem.title}" berhasil disetor! Status berubah ke 'IN PRODUCTION (Aset Siap)'.`);
      setUploadAssetItem(null);
    }, 600);
  };

  // Action: Marcomm / Corcomm menambah slot tema baru langsung di Kalender Konten (Fase 1)
  const handleCreateNewThemeSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThemeSlotData.title.trim()) return;

    const newId = `cnt-theme-${Date.now().toString().slice(-4)}`;
    const newVersionId = `ver-${newId}-v1`;

    const brandName = newThemeSlotData.channel === '@telprodico' ? '@telprodico' : '@telkomproperty';
    const channelPlatform = `${brandName} • Instagram & LinkedIn`;

    const createdSlot: ContentItem = {
      id: newId,
      campaignId: selectedCampaign?.id || 'cmp-2026-01',
      title: newThemeSlotData.title,
      objective: newThemeSlotData.primaryObjective,
      audience: 'Enterprise & Regional Decision Makers',
      platform: channelPlatform,
      format: newThemeSlotData.contentFormat as any,
      status: 'PLANNED',
      pic: activeUser.name,
      currentVersionId: newVersionId,

      // Section A: STRATEGY
      campaignProgram: selectedCampaign?.name || 'Transformasi Digital Industri B2B 2026',
      primaryObjective: newThemeSlotData.primaryObjective,
      targetAudience: 'Enterprise & Regional Decision Makers',
      contentPillar: newThemeSlotData.contentPillar as any,
      keyMessage: newThemeSlotData.keyMessage || `Publikasi tema agenda: ${newThemeSlotData.title}`,

      // Section B: CONTENT
      topicIdea: newThemeSlotData.title,
      contentFormat: newThemeSlotData.contentFormat as any,
      channel: channelPlatform,
      cta: 'Hubungi Call Center 1500 473 atau kunjungi www.telpro.co.id',
      ctaTrackingLink: newThemeSlotData.ctaTrackingLink,
      targetPropertyAsset: newThemeSlotData.targetPropertyAsset,
      sourceReference: 'Agenda Kalender Editorial Nasional 2026',

      // Section C: EXECUTION
      contentOwner: newThemeSlotData.contentOwner as any,
      regionalUnit: newThemeSlotData.contentOwner === 'Regional' ? newThemeSlotData.regionalUnit : undefined,
      picName: activeUser.name,
      targetPublishDate: newThemeSlotData.targetPublishDate,
      priority: 'Medium',

      // Section D: READINESS (FASE 1: BELUM PERLU FILE)
      supportingAssetStatus: 'Belum Ada File (Tema & Targeting Terjadwal)',
      supportingDataEvidence: 'Menunggu Penyetoran Materi Lapangan (Fase 2)',
      readinessNotes: `Slot kalender resmi dijadwalkan oleh ${activeUser.name} pada ${new Date().toLocaleDateString('id-ID')}. File konten belum diperlukan di Fase 1.`,

      marcommReviewStatus: 'Reviewed',
      marcommReviewer: activeUser.name,
      marcommReviewedAt: new Date().toISOString(),
      corcommReviewStatus: newThemeSlotData.corcommApproved ? 'Reviewed' : 'Pending',
      corcommReviewer: newThemeSlotData.corcommApproved ? 'Corcomm Lead' : undefined,
      corcommReviewedAt: newThemeSlotData.corcommApproved ? new Date().toISOString() : undefined,
      reviewChecklist: {
        brandSafety: true,
        factCheck: true,
        claimCheck: true,
        corporateTone: newThemeSlotData.corcommApproved
      }
    };

    const newVersion: ContentVersion = {
      id: newVersionId,
      contentId: newId,
      versionNumber: 1,
      brief: `Rencana tema: ${newThemeSlotData.title}. Target tanggal: ${newThemeSlotData.targetPublishDate}.`,
      hook: `${newThemeSlotData.title} — Solusi Resmi TELPRO Group`,
      caption: `TELPRO Group menghadirkan komitmen keandalan infrastruktur dan inovasi berkelanjutan.\n\nTema: ${newThemeSlotData.title}\n\n#TELPRO2026 #TransformasiDigital`,
      script: `Slide 1: Pengantar tema ${newThemeSlotData.title}.\nSlide 2: Keunggulan & data pendukung.\nSlide 3: Kesimpulan & call to action.`,
      cta: 'Hubungi tim TELPRO untuk informasi lebih lanjut.',
      selectedKeywords: ['TELPRO', 'Infrastruktur', 'Kalender Konten'],
      selectedHashtags: ['#TELPRO2026', '#SolusiB2B'],
      createdBy: activeUser.name,
      createdAt: new Date().toISOString(),
      aiAssisted: false,
      evidenceIds: [],
      riskLevel: 'Low'
    };

    addContentWithVersion(createdSlot, newVersion);
    showToast(`📅 Slot tema "${newThemeSlotData.title}" berhasil dijadwalkan di Kalender! (Fase 1: Belum Ada File)`);
    setIsNewThemeSlotModalOpen(false);
    setNewThemeSlotData({
      title: '',
      primaryObjective: 'B2B Trust & Keandalan SLA',
      channel: '@telprodico',
      targetPublishDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      contentPillar: 'Product Education',
      contentFormat: 'Carousel',
      contentOwner: isRegionalUser ? 'Regional' : 'Marcomm',
      regionalUnit: isRegionalUser ? userRegion : 'Regional 1',
      keyMessage: '',
      corcommApproved: false
    });
  };

  const handleCreateRegionalSubmission = (e: React.FormEvent, asDraft: boolean = false) => {
    e.preventDefault();

    if (!asDraft) {
      if (!newRegionalData.picRegional?.trim()) {
        showToast('⚠️ Mohon isi Nama Lengkap PIC Lapangan penanggung jawab!');
        return;
      }
      if (!newRegionalData.topic?.trim()) {
        showToast('⚠️ Mohon isi Topik / Judul Usulan Konten!');
        return;
      }
      if (!newRegionalData.activity?.trim()) {
        showToast('⚠️ Mohon isi Detail Kegiatan Lapangan!');
        return;
      }
      if (!newRegionalData.location?.trim()) {
        showToast('⚠️ Mohon isi Lokasi Detail Kegiatan!');
        return;
      }
      if (!newRegionalData.targetAudience?.trim()) {
        showToast('⚠️ Mohon isi Sasaran Audiens!');
        return;
      }
      if (!newRegionalData.activityDate) {
        showToast('⚠️ Mohon tentukan Tanggal Pelaksanaan Kegiatan!');
        return;
      }
      if (!newRegionalData.requestedPublishDate) {
        showToast('⚠️ Mohon tentukan Ekspektasi Tanggal Tayang!');
        return;
      }
      if (!newRegionalData.supportingDocumentName?.trim()) {
        showToast('⚠️ Mohon isi Link Foto/Video atau Berkas Berita Acara!');
        return;
      }
    }

    const newSubmission: RegionalSubmission = {
      id: `reg-sub-${Date.now().toString().slice(-4)}`,
      regional: userRegion,
      topic: newRegionalData.topic || `Usulan Konten ${userRegion}`,
      activity: newRegionalData.activity || 'Kegiatan Lapangan',
      location: newRegionalData.location || `${userRegion} — Area Operasional`,
      activityDate: newRegionalData.activityDate || new Date().toISOString().split('T')[0],
      targetAudience: newRegionalData.targetAudience || 'Pelanggan & Mitra B2B',
      contentPillarSuggestion: newRegionalData.contentPillarSuggestion || 'Community Impact',
      supportingAssetUrl: newRegionalData.supportingAssetUrl,
      supportingAssetStatus: newRegionalData.supportingAssetStatus || 'Draft Ready',
      supportingDocumentName: newRegionalData.supportingDocumentName || 'Dokumentasi_Lapangan.pdf',
      requestedPublishDate: newRegionalData.requestedPublishDate,
      picRegional: newRegionalData.picRegional?.trim() || activeUser.name,
      submissionTrack: newRegionalData.submissionTrack || 'MONTHLY_AGENDA',
      brandTarget: newRegionalData.brandTarget || '@telprodico',
      editorialSlotStatus: newRegionalData.submissionTrack === 'FAST_TRACK_URGENT' ? 'BUFFER_READY' : 'QUEUED_FOR_MEETING',
      targetPropertyAsset: newRegionalData.targetPropertyAsset,
      aiAssisted: newRegionalData.aiAssisted || false,
      trendAngle: newRegionalData.trendAngle,
      recommendedFormat: newRegionalData.recommendedFormat,
      shotList: newRegionalData.shotList,
      captionDraft: newRegionalData.captionDraft,
      currentStatus: asDraft ? 'REGIONAL DRAFT' : 'SUBMITTED TO MARCOMM',
      submittedAt: new Date().toISOString()
    };

    addRegionalSubmission(newSubmission);
    setIsNewRegionalModalOpen(false);
    if (asDraft) {
      showToast(`📝 Draf usulan "${newSubmission.topic}" berhasil disimpan!`);
    } else {
      showToast(`📤 Usulan konten "${newSubmission.topic}" berhasil diajukan ke Marcomm!`);
    }
  };

  const handleUpdateRegionalSubmissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRegionalSubmission) return;

    updateRegionalSubmission(editingRegionalSubmission.id, {
      topic: editingRegionalSubmission.topic,
      activity: editingRegionalSubmission.activity,
      location: editingRegionalSubmission.location,
      activityDate: editingRegionalSubmission.activityDate,
      requestedPublishDate: editingRegionalSubmission.requestedPublishDate,
      targetAudience: editingRegionalSubmission.targetAudience,
      contentPillarSuggestion: editingRegionalSubmission.contentPillarSuggestion,
      supportingDocumentName: editingRegionalSubmission.supportingDocumentName,
      supportingAssetStatus: editingRegionalSubmission.supportingAssetStatus,
      submissionTrack: editingRegionalSubmission.submissionTrack,
      brandTarget: editingRegionalSubmission.brandTarget,
      currentStatus: 'SUBMITTED TO MARCOMM',
      revisionNotes: undefined // Clear revision notes upon re-submission
    });

    const topicName = editingRegionalSubmission.topic;
    setEditingRegionalSubmission(null);
    showToast(`🚀 Revisi usulan "${topicName}" berhasil diperbaiki & diajukan ulang ke Marcomm!`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-3.5 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-xl border border-slate-700 flex items-center gap-2 animate-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Sub-Navigation Bar - Only for Marcomm Central & Corcomm / Non-Regional */}
      {!isRegionalUser && (
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                isCorcommUser
                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {isCorcommUser ? 'Corcomm Lead • @telkomproperty' : 'Marcomm Lead • @telprodico'}
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-slate-500 text-xs font-medium">
                {isCorcommUser ? (
                  <span>Co-Governance Kalender &amp; Brand Safety Holding</span>
                ) : (
                  <span>Single Source of Truth {isOwner && <strong className="text-indigo-600">(You are Planner Owner)</strong>}</span>
                )}
              </span>
            </div>
            <h2 className="text-lg font-black text-slate-900 mt-1 flex items-center gap-2">
              <CalendarIcon className={`w-5 h-5 ${isCorcommUser ? 'text-blue-600' : 'text-rose-600'}`} />
              {isCorcommUser
                ? 'SPARK Content Planner & Co-Governance'
                : 'SPARK Content Planner & Jadwal Konten'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isCorcommUser
                ? 'Review keselarasan tema & reputasi korporat, berikan Co-Approval bersama Marcomm, dan kurasi usulan regional untuk brand holding.'
                : 'Kelola matriks perencanaan terintegrasi 4 Section (Strategy, Content, Execution, Readiness) dan kurasi usulan tema dari Regional.'}
            </p>
          </div>

          {/* View Switchers */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setViewMode('editorial-flow')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer relative ${
                viewMode === 'editorial-flow'
                  ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-300'
                  : 'bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200'
              }`}
              title="Lihat Alur Pra-Publish & Editorial Planning Whimsical Standard"
            >
              <Workflow className="w-3.5 h-3.5 text-rose-600" />
              <span>Alur Pra-Publish Whimsical</span>
              <span className="w-2 h-2 rounded-full bg-rose-600 absolute -top-1 -right-1 ring-1 ring-white"></span>
            </button>

            <button
              onClick={() => setViewMode('planner')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'planner'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Content Planner (4-Seksi)</span>
            </button>

            <button
              onClick={() => setViewMode('regional-inbox')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer relative ${
                viewMode === 'regional-inbox'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>Regional Content Inbox</span>
              {pendingRegionalCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-black">
                  {pendingRegionalCount}
                </span>
              )}
            </button>

            {isOwner && (
              <button
                onClick={() => setViewMode('taxonomy')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'taxonomy'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-indigo-200'
                }`}
                title="Khusus Content Planner Owner"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Master Taxonomy</span>
              </button>
            )}

            {isApproverOnly ? (
              <button
                onClick={() => setActiveTab && setActiveTab('content-approval')}
                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                title="Sebagai Executive Approver, kewenangan Anda berfokus pada otorisasi draf konten"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Antrean Approval Konten</span>
              </button>
            ) : (
              <button
                onClick={() => setIsNewItemModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Rencana Konten</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Executive Approver Notification Notice */}
      {!isRegionalUser && isApproverOnly && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              <strong>Peran Akun: Executive Approver</strong> ({activeUser.title}) • Anda memiliki akses pemantauan (monitoring) penuh terhadap seluruh matriks rencana konten &amp; jadwal tayang. Pembuatan draf baru dikelola oleh tim Creator.
            </span>
          </div>
          <button
            onClick={() => setActiveTab && setActiveTab('content-approval')}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold shrink-0 transition-all cursor-pointer shadow-xs flex items-center gap-1 self-start sm:self-auto"
          >
            <Shield className="w-3 h-3" />
            <span>Buka Antrean Approval</span>
          </button>
        </div>
      )}

      {/* Sub-Navigation Bar for Regional User (Opsi B: Kelola Usulan & Kalender Tayang) */}
      {isRegionalUser && (
        <div className="p-3 sm:p-4 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-600" />
              {userRegion}
            </span>
            <span className="text-slate-300 text-xs">•</span>
            <span className="text-xs text-slate-500 font-medium">
              PIC: <strong className="text-slate-700">{activeUser.name}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setViewMode('regional-inbox');
                if (setActiveTab) setActiveTab('content-schedule');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'regional-inbox'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>Kelola Usulan Konten</span>
              {regionalStatusCounts.revision > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-black">
                  {regionalStatusCounts.revision} Revisi
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setViewMode('planner');
                if (setActiveTab) setActiveTab('act-calendar');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'planner'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Kalender Tayang</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 0: ALUR PRA-PUBLISH & EDITORIAL WHIMSICAL STANDARD
      ========================================================================= */}
      {viewMode === 'editorial-flow' && (
        <PrePublishWorkflowView
          onNavigateTab={(targetTab) => {
            if (targetTab === 'regional-inbox') setViewMode('regional-inbox');
            else if (targetTab === 'planner-matrix' || targetTab === 'schedule') setViewMode('planner');
            else if (targetTab === 'ai') setViewMode('ai-field');
          }}
        />
      )}

      {/* =========================================================================
          VIEW 1: CONTENT PLANNER (4-SECTION STRUCTURE)
      ========================================================================= */}
      {viewMode === 'planner' && (
        <div className="space-y-4">
          {/* Regional Creator Calendar Context Banner */}
          {isRegionalUser && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white border border-emerald-800/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold uppercase">
                    Kalender Tayang Wilayah
                  </span>
                  <span className="text-xs text-slate-400">• Jadwal Agenda Resmi</span>
                </div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-emerald-400" />
                  Kalender Tayang Konten — {userRegion} &amp; Nasional
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Pantau tanggal publikasi konten yang telah disetujui pusat. Gunakan filter status atau pemilik konten di bawah untuk melihat agenda penayangan.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setViewMode('regional-inbox');
                    if (setActiveTab) setActiveTab('content-schedule');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <Inbox className="w-3.5 h-3.5" />
                  <span>Buka Kelola Usulan Konten</span>
                </button>
              </div>
            </div>
          )}

          {/* Alur Tata Kelola Konten (2-Fase): Penjelasan Alur Editorial & Produksi */}
          <div className="p-4 rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white border border-blue-800/40 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-black uppercase tracking-wider">
                    Alur Kerja Editorial 2-Fase (Whimsical Standard)
                  </span>
                  <span className="text-xs text-slate-400 hidden sm:inline">• Kalender Konten Nasional &amp; Regional</span>
                </div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-blue-400" />
                  Pemisahan Fase Perencanaan (Tema &amp; Targeting) vs Fase Penyetoran File Konten
                </h4>
              </div>

              {!isRegionalUser && (
                <button
                  onClick={() => setIsNewThemeSlotModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0 self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Jadwalkan Slot Tema Baru (Fase 1)</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center justify-center text-[10px] font-black">1</span>
                    Fase 1: Perencanaan Tema, Targeting &amp; Jadwal
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-200 text-[10px] font-semibold border border-amber-400/30">
                    File Belum Perlu
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Marcomm &amp; Corcomm menetapkan tema serta tujuan atas usulan regional atau agenda pusat, lalu menguncinya di Kalender Konten. <strong>Pada tahap ini, file konten fisik (foto/video) belum diperlukan.</strong>
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-300 flex items-center gap-1.5 text-xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center text-[10px] font-black">2</span>
                    Fase 2: Produksi &amp; Penyetoran Aset Lapangan
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-400/20 text-emerald-200 text-[10px] font-semibold border border-emerald-400/30">
                    Setelah Agenda Terlaksana
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Setelah jadwal terkunci di kalender dan agenda terlaksana, Tim Regional / Kreator menyetorkan materi foto, video, berita acara, atau link Cloud Storage untuk diproduksi &amp; di-review.
                </p>
              </div>
            </div>

            {/* Quick Phase Tabs Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/10">
              <span className="text-[11px] text-slate-400 font-semibold mr-1">Filter Fase Kalender:</span>
              <button
                type="button"
                onClick={() => setPhaseFilter('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  phaseFilter === 'ALL'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                <span>Semua Agenda</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 text-current font-black">
                  {contents.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPhaseFilter('PHASE_1_THEME')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  phaseFilter === 'PHASE_1_THEME'
                    ? 'bg-amber-400 text-amber-950 shadow-xs'
                    : 'bg-amber-900/30 text-amber-200 border border-amber-600/30 hover:bg-amber-800/40'
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>Fase 1: Tema &amp; Targeting Terjadwal (Belum Perlu File)</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 text-current font-black">
                  {phaseCounts.countPhase1}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPhaseFilter('PHASE_2_ASSET')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  phaseFilter === 'PHASE_2_ASSET'
                    ? 'bg-blue-500 text-white shadow-xs'
                    : 'bg-blue-900/30 text-blue-200 border border-blue-600/30 hover:bg-blue-800/40'
                }`}
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>Fase 2: File Aset Siap / Produksi</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 text-current font-black">
                  {phaseCounts.countPhase2}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPhaseFilter('PUBLISHED')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  phaseFilter === 'PUBLISHED'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'bg-emerald-900/30 text-emerald-200 border border-emerald-600/30 hover:bg-emerald-800/40'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Tayang / Published</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 text-current font-black">
                  {phaseCounts.countPublished}
                </span>
              </button>
            </div>
          </div>

          {/* Brand Target, Inisiatif vs Regional Origin, & Co-Governance Focus Quick Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2">
              {/* Brand Target Filter */}
              <div className="flex items-center gap-1 p-1 rounded-2xl bg-white border border-slate-200 shadow-2xs text-xs">
                <span className="text-[11px] font-bold text-slate-400 px-2 py-0.5 uppercase tracking-wider">Brand:</span>
                <button
                  type="button"
                  onClick={() => setBrandFilter('ALL')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    brandFilter === 'ALL'
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Semua ({brandCounts.total})
                </button>
                <button
                  type="button"
                  onClick={() => setBrandFilter('@telprodico')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    brandFilter === '@telprodico'
                      ? 'bg-rose-600 text-white shadow-2xs'
                      : 'text-rose-700 hover:bg-rose-50'
                  }`}
                >
                  <span>@telprodico • Marcomm</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 text-current font-black">
                    {brandCounts.dico}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setBrandFilter('@telkomproperty')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    brandFilter === '@telkomproperty'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  <span>@telkomproperty • Corcomm</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 text-current font-black">
                    {brandCounts.property}
                  </span>
                </button>
              </div>

              {/* Inisiatif Pusat vs Usulan Regional Quick Bar */}
              <div className="flex items-center gap-1 p-1 rounded-2xl bg-white border border-slate-200 shadow-2xs text-xs">
                <span className="text-[11px] font-bold text-slate-400 px-2 py-0.5 uppercase tracking-wider">Sumber Ide:</span>
                <button
                  type="button"
                  onClick={() => setOriginFilter('ALL')}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    originFilter === 'ALL'
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Semua
                </button>
                <button
                  type="button"
                  onClick={() => setOriginFilter('HQ_INITIATIVE')}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    originFilter === 'HQ_INITIATIVE'
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-indigo-700 hover:bg-indigo-50'
                  }`}
                  title="Konten Inisiatif Mandiri Kantor Pusat (Marcomm & Corcomm)"
                >
                  <span>🏛️ Inisiatif Pusat</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 text-current font-black">
                    {originCounts.hqInitiatives}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setOriginFilter('REGIONAL_SUBMISSION')}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    originFilter === 'REGIONAL_SUBMISSION'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-emerald-700 hover:bg-emerald-50'
                  }`}
                  title="Konten Kurasi Masukan Lapangan Unit Regional 1-5"
                >
                  <span>📍 Usulan Daerah</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 text-current font-black">
                    {originCounts.regionalSubmissions}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Co-Governance Quick Review Pill */}
              <button
                type="button"
                onClick={() => setCorcommFilter(corcommFilter === 'PENDING' ? 'ALL' : 'PENDING')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                  corcommFilter === 'PENDING'
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                    : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border-indigo-200'
                }`}
                title="Saring agenda yang belum di-Acc oleh Corcomm"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Pending Acc Corcomm</span>
                {corcommPendingCount > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    corcommFilter === 'PENDING' ? 'bg-white/30 text-white' : 'bg-indigo-200 text-indigo-900'
                  }`}>
                    {corcommPendingCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={openNewThemeSlotModal}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                title="Kunci Slot Tema Kalender Baru (Fase 1: Belum Perlu File)"
              >
                <CalendarPlus className="w-3.5 h-3.5 text-emerald-200" />
                <span>+ Slot Tema Kalender</span>
              </button>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari topik, pesan kunci, PIC, tujuan, atau format..."
                className="w-full text-xs text-slate-800 focus:outline-none bg-transparent"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Status Filter */}
              <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600">
                <Filter className="w-3 h-3 text-slate-400" />
                <span>Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="p-1 rounded-lg border border-slate-200 text-xs bg-slate-50 focus:bg-white"
                >
                  <option value="ALL">Semua Status ({contents.length})</option>
                  <option value="IDEA">IDEA</option>
                  <option value="PLANNED">PLANNED</option>
                  <option value="IN PRODUCTION">IN PRODUCTION</option>
                  <option value="IN REVIEW">IN REVIEW</option>
                  <option value="REVISION">REVISION</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="SCHEDULED">SCHEDULED</option>
                  <option value="PUBLISHED">PUBLISHED</option>
                </select>
              </div>

              {/* Owner Filter */}
              <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600">
                <span>Owner:</span>
                <select
                  value={ownerFilter}
                  onChange={(e) => setOwnerFilter(e.target.value)}
                  className="p-1 rounded-lg border border-slate-200 text-xs bg-slate-50 focus:bg-white font-medium text-slate-800"
                >
                  <option value="ALL">Semua Owner ({ownerCounts.total})</option>
                  <option value="Marcomm">Marcomm ({ownerCounts.marcomm})</option>
                  <option value="Regional">Regional ({ownerCounts.regional})</option>
                  <option value="Corcomm">Corcomm ({ownerCounts.corcomm})</option>
                  <option value="Joint">Joint ({ownerCounts.joint})</option>
                </select>
              </div>

              {/* Channel Filter */}
              <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600">
                <span>Kanal:</span>
                <select
                  value={channelFilter}
                  onChange={(e) => setChannelFilter(e.target.value)}
                  className="p-1 rounded-lg border border-slate-200 text-xs bg-slate-50 focus:bg-white"
                >
                  <option value="ALL">Semua Kanal</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Instagram">Instagram</option>
                  <option value="TikTok">TikTok</option>
                  <option value="YouTube">YouTube</option>
                  <option value="X">X (Twitter)</option>
                </select>
              </div>

              {/* Corcomm Co-Governance Filter */}
              <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600">
                <ShieldCheck className="w-3 h-3 text-indigo-500" />
                <span>Co-Approval:</span>
                <select
                  value={corcommFilter}
                  onChange={(e) => setCorcommFilter(e.target.value as any)}
                  className="p-1 rounded-lg border border-slate-200 text-xs bg-slate-50 focus:bg-white"
                >
                  <option value="ALL">Semua Persetujuan</option>
                  <option value="REVIEWED">Sudah Acc Corcomm</option>
                  <option value="PENDING">Pending Corcomm ({corcommPendingCount})</option>
                </select>
              </div>
            </div>
          </div>

          {/* Planner Items List / Table */}
          <div className="space-y-3">
            {filteredContents.length === 0 ? (
              <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-3 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
                  <Filter className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm">Tidak Ada Rencana Konten Sesuai Filter</h4>
                  <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
                    {ownerFilter !== 'ALL' || statusFilter !== 'ALL' || channelFilter !== 'ALL' || phaseFilter !== 'ALL' || brandFilter !== 'ALL' || corcommFilter !== 'ALL' || searchQuery.trim() ? (
                      <span>
                        Terdapat <strong>{contents.length} agenda</strong> dalam kalender, namun tersaring karena filter aktif:
                        {brandFilter !== 'ALL' && <span className="font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded mx-1">Brand: {brandFilter}</span>}
                        {corcommFilter !== 'ALL' && <span className="font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded mx-1">Co-Approval: {corcommFilter}</span>}
                        {ownerFilter !== 'ALL' && <span className="font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded mx-1">Owner: {ownerFilter} ({ownerCounts[ownerFilter.toLowerCase() as keyof typeof ownerCounts] || 0} agenda)</span>}
                        {phaseFilter !== 'ALL' && <span className="font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded mx-1">Fase: {phaseFilter}</span>}
                        {statusFilter !== 'ALL' && <span className="font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded mx-1">Status: {statusFilter}</span>}
                        {channelFilter !== 'ALL' && <span className="font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded mx-1">Kanal: {channelFilter}</span>}
                        {searchQuery.trim() && <span className="font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded mx-1">Cari: "{searchQuery}"</span>}.
                      </span>
                    ) : (
                      'Belum ada data rencana konten dalam sistem. Anda dapat menambahkan slot tema baru menggunakan tombol di atas.'
                    )}
                  </p>
                </div>

                {(ownerFilter !== 'ALL' || statusFilter !== 'ALL' || channelFilter !== 'ALL' || phaseFilter !== 'ALL' || brandFilter !== 'ALL' || corcommFilter !== 'ALL' || searchQuery.trim()) && (
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setOwnerFilter('ALL');
                        setStatusFilter('ALL');
                        setChannelFilter('ALL');
                        setPhaseFilter('ALL');
                        setBrandFilter('ALL');
                        setCorcommFilter('ALL');
                        setSearchQuery('');
                      }}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer transition-all"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Tampilkan Semua Agenda ({contents.length})</span>
                    </button>
                    {ownerFilter !== 'ALL' && (
                      <button
                        type="button"
                        onClick={() => setOwnerFilter('ALL')}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                      >
                        Reset Filter Owner
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              filteredContents.map((item) => {
                const isExpanded = !!expandedItemIds[item.id];
                const isPublished = item.status === 'PUBLISHED';
                const isPhase1 =
                  item.status === 'PLANNED' ||
                  item.status === 'IDEA' ||
                  item.supportingAssetStatus?.toLowerCase().includes('belum ada file') ||
                  item.supportingAssetStatus?.toLowerCase().includes('pending') ||
                  item.supportingAssetStatus?.toLowerCase().includes('curated from regional') ||
                  !item.supportingAsset;

                const isDicoBrand =
                  item.channel?.includes('@telprodico') ||
                  item.targetAudience?.toLowerCase().includes('b2b') ||
                  item.title.toLowerCase().includes('dico') ||
                  item.title.toLowerCase().includes('iot') ||
                  item.title.toLowerCase().includes('fiber') ||
                  item.contentPillar === 'Product Excellence' ||
                  item.contentPillar === 'Product Education';

                return (
                  <div
                    key={item.id}
                    className={`rounded-3xl bg-white border transition-all overflow-hidden ${
                      isPhase1
                        ? 'border-amber-200 shadow-2xs hover:border-amber-300'
                        : 'border-slate-200 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    {/* Compact Card Header */}
                    <div className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b ${
                      isPhase1 ? 'bg-amber-50/40 border-amber-100' : 'bg-slate-50/50 border-slate-100'
                    }`}>
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col gap-1 items-start shrink-0">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border tracking-wider shrink-0 ${getStatusBadge(item.status)}`}>
                            {item.status}
                          </span>

                          {/* Phase Pill Badge */}
                          {isPublished ? (
                            <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                              Tayang
                            </span>
                          ) : isPhase1 ? (
                            <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1" title="Fase 1: Tema & Targeting Terjadwal. File konten fisik belum diperlukan.">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                              Fase 1: Tema Terjadwal
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-blue-100 text-blue-800 border border-blue-200">
                              Fase 2: Aset Siap
                            </span>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Brand Target Account Badge */}
                            {isDicoBrand ? (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                                <span>@telprodico</span>
                                <span className="text-[9px] font-normal text-blue-600 hidden sm:inline">• Solusi Digital B2B</span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-100 text-rose-900 border border-rose-200 flex items-center gap-1">
                                <span>@telkomproperty</span>
                                <span className="text-[9px] font-normal text-rose-700 hidden sm:inline">• Properti &amp; Korporat</span>
                              </span>
                            )}

                            {/* Objective / Targeting Badge */}
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-violet-50 text-violet-800 border border-violet-200 flex items-center gap-1">
                              <Target className="w-3 h-3 text-violet-600 shrink-0" />
                              <span className="truncate max-w-[200px]">Tujuan: {item.primaryObjective || item.objective || 'Brand Awareness'}</span>
                            </span>

                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getOwnerBadge(item.contentOwner)}`}>
                              Owner: {item.contentOwner || 'Marcomm'}
                            </span>

                            {/* Origin Indicator Badge: Inisiatif Mandiri Pusat vs Usulan Daerah */}
                            {item.regionalUnit || item.picRegional || (item.contentOwner || '').toLowerCase().includes('regional') ? (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1" title={`Konten dikurasi dari usulan wilayah ${item.regionalUnit || ''}`}>
                                <span>📍</span>
                                <span>Usulan Daerah ({item.regionalUnit || 'Regional'})</span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200 flex items-center gap-1" title="Konten inisiatif mandiri Kantor Pusat">
                                <span>🏛️</span>
                                <span>Inisiatif Mandiri HQ</span>
                              </span>
                            )}

                            {/* B2B Property Asset Badge */}
                            {item.targetPropertyAsset && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200 flex items-center gap-1">
                                <span>🏢</span>
                                <span>{item.targetPropertyAsset}</span>
                              </span>
                            )}

                            {/* B2B Leads CTA Link Badge */}
                            {item.ctaTrackingLink && (
                              <a
                                href={item.ctaTrackingLink}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 flex items-center gap-1 transition-colors"
                                title="Buka tautan Leads WA / Penawaran"
                              >
                                <span>🎯</span>
                                <span>Link Leads B2B</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}

                            <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                              {item.channel || item.platform} • {item.contentFormat || item.format}
                            </span>

                            {/* Corcomm Approval Status Pill */}
                            {item.corcommReviewStatus === 'Reviewed' ? (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Disetujui Corcomm
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                                Review Corcomm: Pending
                              </span>
                            )}
                          </div>

                          <h3 className="font-black text-slate-900 text-sm leading-snug">
                            {item.topicIdea || item.title}
                          </h3>

                          {/* Key Message snippet */}
                          {item.keyMessage && (
                            <p className="text-xs text-slate-600 line-clamp-1">
                              <strong className="text-slate-800">Pesan:</strong> {item.keyMessage}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center flex-wrap gap-2 self-end md:self-center shrink-0">
                        <div className="text-right text-[11px] text-slate-500 hidden sm:block mr-2">
                          <div>PIC: <strong className="text-slate-800">{item.picName || item.pic}</strong></div>
                          <div>Target Tayang: <span className="font-mono font-bold text-slate-700">{item.targetPublishDate || 'TBD'}</span></div>
                        </div>

                        {/* Action: Unggah / Setor File Konten (Fase 2) */}
                        {isPhase1 && !isPublished && (
                          <button
                            onClick={() => openUploadAssetModal(item)}
                            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all shrink-0"
                            title="Setor Foto, Video, atau Dokumen Berita Acara Lapangan (Fase 2)"
                          >
                            <UploadCloud className="w-3.5 h-3.5" />
                            <span>Setor File (Fase 2)</span>
                          </button>
                        )}

                        {/* Co-Governance Actions for Non-Regional Users (Marcomm & Corcomm) */}
                        {!isRegionalUser && (
                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Corcomm Acc Button / Badge */}
                            {item.corcommReviewStatus === 'Reviewed' ? (
                              <span
                                className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold flex items-center gap-1 shrink-0"
                                title={`Disetujui Corcomm oleh ${item.corcommReviewer || 'Corcomm'} pada ${item.corcommReviewedAt ? new Date(item.corcommReviewedAt).toLocaleDateString('id-ID') : '-'}`}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="hidden sm:inline">Acc Corcomm</span>
                              </span>
                            ) : (
                              <button
                                onClick={() => {
                                  updateContentPlannerItem(item.id, {
                                    corcommReviewStatus: 'Reviewed',
                                    corcommReviewer: activeUser.name,
                                    corcommReviewedAt: new Date().toISOString()
                                  });
                                  showToast(`✅ Tema "${item.title}" disetujui Corcomm untuk Kalender Konten!`);
                                }}
                                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0 transition-all ${
                                  isCorcommUser
                                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs ring-2 ring-indigo-200'
                                    : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
                                }`}
                                title="Corcomm menyetujui tema & targeting untuk kalender tayang (Co-Approval)"
                              >
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>Acc Corcomm</span>
                              </button>
                            )}

                            {/* Marcomm Validasi Button / Badge */}
                            {item.marcommReviewStatus === 'Reviewed' ? (
                              <span
                                className="px-2.5 py-1 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 text-[11px] font-bold flex items-center gap-1 shrink-0"
                                title={`Tervalidasi Marcomm oleh ${item.marcommReviewer || 'Marcomm'}`}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                                <span className="hidden sm:inline">Valid Marcomm</span>
                              </span>
                            ) : isMarcommUser ? (
                              <button
                                onClick={() => {
                                  updateContentPlannerItem(item.id, {
                                    marcommReviewStatus: 'Reviewed',
                                    marcommReviewer: activeUser.name,
                                    marcommReviewedAt: new Date().toISOString()
                                  });
                                  showToast(`✅ Tema "${item.title}" tervalidasi Marcomm untuk Kalender Konten!`);
                                }}
                                className="px-2.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0 shadow-xs"
                                title="Validasi Marcomm untuk tema & target publikasi"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Validasi Marcomm</span>
                              </button>
                            ) : null}
                          </div>
                        )}

                        <button
                          onClick={() => setEditingItem(item)}
                          className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          title="Edit 4 Seksi Planner"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                          <span className="hidden sm:inline">Edit Detail</span>
                        </button>

                        <button
                          onClick={() => toggleExpand(item.id)}
                          className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          <span>{isExpanded ? 'Tutup 4 Seksi' : 'Buka 4 Seksi'}</span>
                        </button>
                      </div>
                    </div>

                    {/* 4-SECTION DETAILED ACCORDION */}
                    {isExpanded && (
                      <div className="p-5 space-y-4 bg-white animate-in fade-in duration-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {/* SECTION A: STRATEGY */}
                          <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 space-y-2.5">
                            <div className="flex items-center justify-between border-b border-indigo-100 pb-1.5">
                              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-900">
                                Seksi A • Strategy
                              </span>
                              <span className="text-[10px] text-indigo-600 font-bold">Pondasi</span>
                            </div>
                            <div className="text-xs space-y-1.5">
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold uppercase block">Campaign / Program</span>
                                <span className="font-bold text-slate-800">{item.campaignProgram || 'Transformasi Digital 2026'}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold uppercase block">Primary Objective</span>
                                <span className="text-slate-700">{item.primaryObjective || item.objective}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold uppercase block">Target Audience</span>
                                <span className="text-slate-700">{item.targetAudience || item.audience}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold uppercase block">Content Pillar</span>
                                <span className="inline-block px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 font-bold text-[10px]">
                                  {item.contentPillar || 'Product Excellence'}
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold uppercase block">Key Message</span>
                                <p className="text-[11px] text-slate-700 italic bg-white/70 p-2 rounded-xl border border-indigo-50">
                                  "{item.keyMessage || 'TELPRO memastikan jaminan SLA 99.98% untuk kelancaran enterprise.'}"
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* SECTION B: CONTENT */}
                          <div className="p-4 rounded-2xl bg-rose-50/40 border border-rose-100 space-y-2.5">
                            <div className="flex items-center justify-between border-b border-rose-100 pb-1.5">
                              <span className="text-[10px] font-black uppercase tracking-wider text-rose-900">
                                Seksi B • Content
                              </span>
                              <span className="text-[10px] text-rose-600 font-bold">Kreatif</span>
                            </div>
                            <div className="text-xs space-y-1.5">
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold uppercase block">Topic / Content Idea</span>
                                <span className="font-bold text-slate-800">{item.topicIdea || item.title}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Format</span>
                                  <span className="text-slate-700 font-semibold">{item.contentFormat || item.format}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Channel</span>
                                  <span className="text-slate-700 font-semibold">{item.channel || item.platform}</span>
                                </div>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold uppercase block">Call to Action (CTA)</span>
                                <p className="text-[11px] text-slate-700 bg-white/70 p-2 rounded-xl border border-rose-50 line-clamp-2">
                                  {item.cta || 'Hubungi Call Center 1500 473'}
                                </p>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold uppercase block">Source / Reference</span>
                                <span className="text-[11px] text-slate-600 font-mono">
                                  {item.sourceReference || 'Dokumen Teknis NOC TELPRO'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* SECTION C: EXECUTION */}
                          <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-100 space-y-2.5">
                            <div className="flex items-center justify-between border-b border-amber-100 pb-1.5">
                              <span className="text-[10px] font-black uppercase tracking-wider text-amber-900">
                                Seksi C • Execution
                              </span>
                              <span className="text-[10px] text-amber-700 font-bold">Operasional</span>
                            </div>
                            <div className="text-xs space-y-1.5">
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold uppercase block">Content Owner</span>
                                <span className="font-bold text-amber-900">{item.contentOwner || 'Marcomm'}</span>
                                {item.regionalUnit && (
                                  <span className="text-[11px] text-slate-600 block">Unit: {item.regionalUnit}</span>
                                )}
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold uppercase block">PIC Name</span>
                                <span className="font-bold text-slate-800">{item.picName || item.pic}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Target Publish</span>
                                  <span className="font-mono text-slate-800 font-bold">{item.targetPublishDate || 'TBD'}</span>
                                </div>
                                <div>
                                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Priority</span>
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                    item.priority === 'Critical' ? 'bg-rose-100 text-rose-800' :
                                    item.priority === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                                  }`}>
                                    {item.priority || 'Medium'}
                                  </span>
                                </div>
                              </div>
                              {item.activityProgram && (
                                <div>
                                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Kegiatan Regional</span>
                                  <span className="text-[11px] text-slate-700">{item.activityProgram} ({item.location})</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* SECTION D: READINESS */}
                          <div className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100 space-y-2.5">
                            <div className="flex items-center justify-between border-b border-emerald-100 pb-1.5">
                              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900">
                                Seksi D • Readiness
                              </span>
                              <span className="text-[10px] text-emerald-700 font-bold">Kesiapan</span>
                            </div>
                            <div className="text-xs space-y-1.5">
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold uppercase block">Supporting Asset</span>
                                <span className="font-semibold text-emerald-800 flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  {item.supportingAssetStatus || 'Asset Ready'}
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold uppercase block">Supporting Evidence</span>
                                <span className="text-[11px] text-slate-700">
                                  {item.supportingDataEvidence || 'Arsitektur Jaringan Valid'}
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 font-bold uppercase block">Readiness Notes</span>
                                <p className="text-[11px] text-slate-600 bg-white/70 p-2 rounded-xl border border-emerald-50">
                                  {item.readinessNotes || 'Semua kelengkapan siap untuk masuk tahap produksi / review.'}
                                </p>
                              </div>
                              <div className="pt-1">
                                <span className="text-[10px] text-slate-400 font-bold uppercase block">Joint Review Status</span>
                                <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono">
                                  <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700">
                                    Marcomm: {item.marcommReviewStatus || 'Pending'}
                                  </span>
                                  <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800">
                                    Corcomm: {item.corcommReviewStatus || 'Pending'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: REGIONAL CONTENT INBOX (STRICT ISOLATION & STATUS TRACKING)
      ========================================================================= */}
      {viewMode === 'regional-inbox' && (
        <div className="space-y-4">
          {/* Header & Regional Clean Banner */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            {isRegionalUser ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      {userRegion}
                    </span>
                    <span className="text-slate-300 text-xs">•</span>
                    <span className="text-slate-500 text-xs">
                      PIC: <strong className="text-slate-700">{activeUser.name}</strong>
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Inbox className="w-5 h-5 text-emerald-600" />
                    Kelola Usulan Konten — {userRegion}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Kirimkan foto, video, atau kegiatan dari wilayah Anda untuk dikurasi menjadi konten resmi TELPRO.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <button
                    onClick={() => {
                      setViewMode('planner');
                      if (setActiveTab) setActiveTab('act-calendar');
                    }}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <CalendarIcon className="w-3.5 h-3.5 text-slate-500" />
                    <span>Kalender Tayang</span>
                  </button>

                  <button
                    onClick={() => {
                      setNewRegionalData({
                        regional: userRegion,
                        topic: '',
                        activity: '',
                        location: '',
                        activityDate: new Date().toISOString().split('T')[0],
                        targetAudience: '',
                        contentPillarSuggestion: 'Community Impact',
                        supportingAssetUrl: '',
                        supportingAssetStatus: 'Draft Ready',
                        supportingDocumentName: '',
                        requestedPublishDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
                        picRegional: '',
                        submissionTrack: 'MONTHLY_AGENDA',
                        brandTarget: '@telprodico'
                      });
                      setRegionalCreationStep('SELECT_MODE');
                      setIsNewRegionalModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Buat Usulan Konten</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Inbox className="w-5 h-5 text-rose-600" />
                    Regional Content Inbox (Pusat Kurasi)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Kanal resmi kurasi usulan kegiatan operasional dan bahan konten dari unit Regional 1-5 untuk kampanye nasional.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={openNewThemeSlotModal}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    title="Buat konten inisiatif mandiri kantor pusat tanpa harus menunggu usulan daerah"
                  >
                    <CalendarPlus className="w-3.5 h-3.5 text-emerald-200" />
                    <span>+ Inisiatif Mandiri Pusat</span>
                  </button>
                </div>
              </div>
            )}

            {/* Banner Panduan Tema Konten Marcomm Pusat untuk Regional */}
            {isRegionalUser && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white shadow-sm border border-slate-700/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/60 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📌</span>
                    <div>
                      <h4 className="text-xs font-extrabold text-white flex items-center gap-2">
                        <span>Fokus Tema Editorial Marcomm Pusat (Bulan Ini)</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 font-bold">
                          Pedoman Wilayah
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        Sesuaikan usulan liputan daerah dengan salah satu pilar akun di bawah agar lebih cepat disetujui & tayang.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-2.5">
                  {/* Brand 1: @telprodico */}
                  <div className="p-2.5 rounded-xl bg-slate-800/90 border border-blue-500/30 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-blue-400 flex items-center gap-1.5">
                          <span>📦</span> @telprodico
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                          Khusus Produk & Solusi
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-200 mt-1.5 font-medium leading-snug">
                        <strong>Fokus:</strong> Akselerasi High-Speed Fiber B2B, penambahan ODP baru, dan pembuktian SLA keandalan teknisi 24/7.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setNewRegionalData({
                          regionalName: userRegion,
                          topic: '',
                          activity: '',
                          location: '',
                          activityDate: new Date().toISOString().split('T')[0],
                          targetAudience: '',
                          contentPillarSuggestion: 'Product Excellence',
                          supportingAssetUrl: '',
                          supportingAssetStatus: 'Draft Ready',
                          supportingDocumentName: '',
                          requestedPublishDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
                          picRegional: '',
                          submissionTrack: 'MONTHLY_AGENDA',
                          brandTarget: '@telprodico'
                        });
                        setAiSubMode('FREE_TOPIC');
                        setSelectedTrendId('custom-free-topic');
                        setCustomFieldNotes('');
                        setRegionalCreationStep('AI_TREND_SELECT');
                        setIsNewRegionalModalOpen(true);
                      }}
                      className="mt-2.5 w-full py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                      <span>✍️ Ajukan Usulan Produk (@telprodico)</span>
                    </button>
                  </div>

                  {/* Brand 2: @telkomproperty */}
                  <div className="p-2.5 rounded-xl bg-slate-800/90 border border-amber-500/30 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                          <span>🏢</span> @telkomproperty
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">
                          Khusus Info Perusahaan
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-200 mt-1.5 font-medium leading-snug">
                        <strong>Fokus:</strong> K3 & Simulasi Damkar, modernisasi fasilitas gedung, serah terima tenant kantor, serta bakti sosial CSR.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setNewRegionalData({
                          regionalName: userRegion,
                          topic: '',
                          activity: '',
                          location: '',
                          activityDate: new Date().toISOString().split('T')[0],
                          targetAudience: '',
                          contentPillarSuggestion: 'Corporate & Workplace Excellence',
                          supportingAssetUrl: '',
                          supportingAssetStatus: 'Draft Ready',
                          supportingDocumentName: '',
                          requestedPublishDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
                          picRegional: '',
                          submissionTrack: 'MONTHLY_AGENDA',
                          brandTarget: '@telkomproperty'
                        });
                        setAiSubMode('FREE_TOPIC');
                        setSelectedTrendId('custom-free-topic');
                        setCustomFieldNotes('');
                        setRegionalCreationStep('AI_TREND_SELECT');
                        setIsNewRegionalModalOpen(true);
                      }}
                      className="mt-2.5 w-full py-1.5 px-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                      <span>✍️ Ajukan Usulan Perusahaan (@telkomproperty)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notification alert if there's revision for Regional user */}
            {isRegionalUser && regionalStatusCounts.revision > 0 && (
              <div
                onClick={() => setRegionalStatusFilter('REVISION REQUESTED')}
                className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center justify-between gap-2 cursor-pointer hover:bg-rose-100/70 transition-all"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 animate-bounce" />
                  <span>
                    <strong>Perlu Tindakan:</strong> Ada <strong>{regionalStatusCounts.revision} usulan</strong> yang memerlukan catatan perbaikan dari Tim Marcomm Pusat. Klik di sini untuk melihat dan memperbarui.
                  </span>
                </div>
                <span className="text-[11px] font-bold text-rose-700 underline shrink-0">Lihat Revisi →</span>
              </div>
            )}

            {/* Status KPI Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setRegionalStatusFilter('ALL')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  regionalStatusFilter === 'ALL'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70">
                  {isRegionalUser ? 'Semua Usulan' : 'Total Usulan'}
                </span>
                <span className="text-xl font-black">{regionalStatusCounts.total}</span>
              </button>

              <button
                type="button"
                onClick={() => setRegionalStatusFilter('SUBMITTED TO MARCOMM')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  regionalStatusFilter === 'SUBMITTED TO MARCOMM'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70">
                  {isRegionalUser ? 'Menunggu Review' : 'Menunggu Kurasi'}
                </span>
                <span className="text-xl font-black">{regionalStatusCounts.submitted}</span>
              </button>

              <button
                type="button"
                onClick={() => setRegionalStatusFilter('REVISION REQUESTED')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                  regionalStatusFilter === 'REVISION REQUESTED'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                    : 'bg-rose-50 hover:bg-rose-100 text-rose-900 border-rose-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70">
                    {isRegionalUser ? 'Perlu Diperbaiki' : 'Perlu Revisi'}
                  </span>
                  {regionalStatusCounts.revision > 0 && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  )}
                </div>
                <span className="text-xl font-black">{regionalStatusCounts.revision}</span>
              </button>

              <button
                type="button"
                onClick={() => setRegionalStatusFilter('ACCEPTED')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  regionalStatusFilter === 'ACCEPTED'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-200'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70">
                  {isRegionalUser ? 'Disetujui / Tayang' : 'Diterima Marcomm'}
                </span>
                <span className="text-xl font-black">{regionalStatusCounts.accepted}</span>
              </button>

              <button
                type="button"
                onClick={() => setRegionalStatusFilter('REGIONAL DRAFT')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer col-span-2 sm:col-span-1 ${
                  regionalStatusFilter === 'REGIONAL DRAFT'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70">
                  {isRegionalUser ? 'Draf Disimpan' : 'Draf Regional'}
                </span>
                <span className="text-xl font-black">{regionalStatusCounts.draft}</span>
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Cari topik, kegiatan, lokasi di ${isRegionalUser ? userRegion : 'semua regional'}...`}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* For Marcomm Kurator: Regional Selector & Track Filter */}
              {!isRegionalUser && (
                <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
                  <span className="text-[11px] text-slate-500 font-semibold shrink-0">Filter Unit:</span>
                  <select
                    value={regionalUnitFilter}
                    onChange={(e) => setRegionalUnitFilter(e.target.value)}
                    className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 font-bold text-slate-700 cursor-pointer"
                  >
                    <option value="ALL">Semua Regional (1-5)</option>
                    <option value="Regional 1">Regional 1 (Sumatera)</option>
                    <option value="Regional 2">Regional 2 (Jabodetabek & Banten)</option>
                    <option value="Regional 3">Regional 3 (Jawa Barat)</option>
                    <option value="Regional 4">Regional 4 (Jawa Tengah & DIY)</option>
                    <option value="Regional 5">Regional 5 (Jatim, Bali & Nusa Tenggara)</option>
                  </select>
                </div>
              )}

              {/* Status Filter Reset if Active */}
              {regionalStatusFilter !== 'ALL' && (
                <button
                  onClick={() => setRegionalStatusFilter('ALL')}
                  className="text-[11px] text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer self-start md:self-auto"
                >
                  <X className="w-3 h-3" />
                  <span>Reset Filter Status ({regionalStatusFilter})</span>
                </button>
              )}
            </div>
          </div>

          {/* Submissions List */}
          <div className="space-y-3">
            {visibleRegionalSubmissions.length === 0 ? (
              <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
                <Inbox className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-800 text-sm">
                  {regionalStatusFilter !== 'ALL'
                    ? `Tidak ada usulan dengan status "${regionalStatusFilter}"`
                    : `Belum ada usulan untuk ${isRegionalUser ? userRegion : 'filter terpilih'}`}
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {isRegionalUser
                    ? 'Klik tombol "+ Buat Usulan Konten" untuk mengajukan usulan konten wilayah Anda.'
                    : 'Tidak ada data submisi yang cocok dengan kriteria filter saat ini.'}
                </p>
                {isRegionalUser && (
                  <button
                    onClick={() => {
                      setNewRegionalData({
                        regional: userRegion,
                        topic: '',
                        activity: '',
                        location: '',
                        activityDate: new Date().toISOString().split('T')[0],
                        targetAudience: '',
                        contentPillarSuggestion: 'Community Impact',
                        supportingAssetUrl: '',
                        supportingAssetStatus: 'Draft Ready',
                        supportingDocumentName: '',
                        requestedPublishDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
                        picRegional: '', // Kosongkan wajib diisi nama orang
                        submissionTrack: 'MONTHLY_AGENDA',
                        brandTarget: '@telprodico'
                      });
                      setIsNewRegionalModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Buat Usulan Baru</span>
                  </button>
                )}
              </div>
            ) : (
              visibleRegionalSubmissions.map((sub) => {
                const isConverted = sub.currentStatus === 'CONVERTED TO CONTENT PLAN';
                const isRevision = sub.currentStatus === 'REVISION REQUESTED';
                const isDraft = sub.currentStatus === 'REGIONAL DRAFT' || sub.currentStatus === 'DRAFT';
                const isSubmitted = sub.currentStatus === 'SUBMITTED TO MARCOMM';
                const isAccepted = sub.currentStatus === 'ACCEPTED';

                return (
                  <div
                    key={sub.id}
                    className={`p-5 rounded-3xl bg-white border shadow-2xs space-y-3 transition-all ${
                      isRevision
                        ? 'border-rose-300 ring-1 ring-rose-200'
                        : isAccepted || isConverted
                        ? 'border-emerald-200 bg-emerald-50/20'
                        : 'border-slate-200'
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-700" />
                          {sub.regional}
                        </span>

                        {/* Track Badge */}
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                          sub.submissionTrack === 'COMMERCIAL_PROMO'
                            ? 'bg-rose-50 text-rose-800 border-rose-300 font-extrabold'
                            : sub.submissionTrack === 'FAST_TRACK_URGENT'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-sky-50 text-sky-800 border-sky-200'
                        }`}>
                          <span>
                            {sub.submissionTrack === 'COMMERCIAL_PROMO'
                              ? '🏷️ Promo & Penawaran Komersial'
                              : sub.submissionTrack === 'FAST_TRACK_URGENT'
                              ? '⚡ Konten Cepat'
                              : '🗓️ Konten Terjadwal'}
                          </span>
                        </span>

                        {/* Property Asset Tag if present */}
                        {sub.targetPropertyAsset && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold flex items-center gap-1">
                            <span>🏢</span>
                            <span>{sub.targetPropertyAsset}</span>
                          </span>
                        )}

                        {/* Brand Target */}
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-mono font-bold">
                          {sub.brandTarget === 'MARCOMM_CHOICE' ? '🤝 Pilihan Marcomm' : (sub.brandTarget || '@telprodico')}
                        </span>

                        {/* Status Badge */}
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase border flex items-center gap-1 ${
                          isConverted ? 'bg-purple-100 text-purple-800 border-purple-200' :
                          isAccepted ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                          isRevision ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse' :
                          isDraft ? 'bg-slate-100 text-slate-700 border-slate-300' :
                          'bg-amber-100 text-amber-800 border-amber-200'
                        }`}>
                          {isRevision && <AlertCircle className="w-3 h-3 text-rose-600" />}
                          {isAccepted && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          {isSubmitted && <Clock className="w-3 h-3 text-amber-600" />}
                          {isDraft && <FileText className="w-3 h-3 text-slate-500" />}
                          <span>{sub.currentStatus}</span>
                        </span>

                        <span className="text-[11px] text-slate-400 font-mono">
                          ID: {sub.id}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500">
                        Diajukan oleh: <strong className="text-slate-800">{sub.picRegional}</strong> • Tanggal Kegiatan: <span className="font-mono font-bold text-slate-700">{sub.activityDate}</span>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div className="space-y-2 md:col-span-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-400">Usulan Topik / Ide</span>
                          <h4 className="font-extrabold text-slate-900 text-sm mt-0.5">{sub.topic}</h4>
                        </div>

                        <p className="text-slate-600 leading-relaxed">
                          Kegiatan: <strong className="text-slate-800">{sub.activity}</strong> di <strong>{sub.location}</strong>.
                        </p>

                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {sub.targetAudience && (
                            <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[11px]">
                              Audience: <strong>{sub.targetAudience}</strong>
                            </span>
                          )}
                          {sub.contentPillarSuggestion && (
                            <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 text-[11px]">
                              Pilar: <strong>{sub.contentPillarSuggestion}</strong>
                            </span>
                          )}
                          {sub.aiAssisted && (
                            <button
                              type="button"
                              onClick={() => setSelectedSubmissionForViewAi(sub)}
                              className="px-2.5 py-0.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                            >
                              <Sparkles className="w-3 h-3 text-indigo-600" />
                              <span>Format AI & Shot List</span>
                            </button>
                          )}
                        </div>

                        {/* Revision Note Box if Requested */}
                        {isRevision && (
                          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs mt-2 space-y-1">
                            <div className="font-bold flex items-center gap-1.5 text-rose-800">
                              <AlertTriangle className="w-4 h-4 text-rose-600" />
                              <span>Instruksi Revisi dari Kurator Marcomm Pusat:</span>
                            </div>
                            <p className="text-rose-700 pl-5 text-[11px] italic">
                              "{sub.revisionNotes || 'Harap lengkapi berita acara dan perjelas narasi manfaat layanan bagi pelanggan daerah.'}"
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Supporting Asset & Requested Schedule */}
                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-[11px]">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Supporting Asset / Berkas</span>
                          <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                            <FileText className="w-3.5 h-3.5 text-slate-500" />
                            {sub.supportingDocumentName || 'Dokumentasi Foto/Video'}
                          </span>
                          <span className="block text-emerald-600 font-medium text-[10px] mt-0.5">Status Asset: {sub.supportingAssetStatus}</span>
                        </div>

                        <div className="pt-1 border-t border-slate-200">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Target Publikasi Diminta</span>
                          <span className="font-mono font-bold text-slate-800">{sub.requestedPublishDate || 'Secepatnya'}</span>
                        </div>

                        {sub.recommendedFormat && (
                          <div className="pt-1 border-t border-slate-200">
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Format Konten Rekomendasi</span>
                            <span className="font-semibold text-slate-700 text-[10.5px] block mt-0.5">{sub.recommendedFormat}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                      <div className="text-[11px] text-slate-500">
                        {isConverted ? (
                          <span className="text-purple-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Telah berhasil dikonversi ke Content Planner Nasional
                          </span>
                        ) : isAccepted ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Diterima Marcomm — Menunggu Penjadwalan Produksi
                          </span>
                        ) : isRevision ? (
                          <span className="text-rose-700 font-bold flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Memerlukan tindakan perbaikan oleh PIC {sub.regional}
                          </span>
                        ) : isDraft ? (
                          <span className="text-slate-600 font-medium flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5" />
                            Draf belum dikirim ke Marcomm
                          </span>
                        ) : (
                          <span className="text-amber-700 font-medium flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            Dalam antrean review kurasi Marcomm Nasional
                          </span>
                        )}
                      </div>

                      {/* Regional Creator Action Buttons */}
                      {isRegionalUser && (
                        <div className="flex items-center gap-2">
                          {isRevision && (
                            <button
                              onClick={() => setEditingRegionalSubmission(sub)}
                              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Perbaiki & Ajukan Ulang</span>
                            </button>
                          )}

                          {isDraft && (
                            <>
                              <button
                                onClick={() => setEditingRegionalSubmission(sub)}
                                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold cursor-pointer"
                              >
                                Edit Draf
                              </button>
                              <button
                                onClick={() => {
                                  updateRegionalSubmission(sub.id, { currentStatus: 'SUBMITTED TO MARCOMM' });
                                  showToast(`📤 Usulan "${sub.topic}" berhasil diajukan ke Marcomm!`);
                                }}
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>Ajukan Sekarang</span>
                              </button>
                            </>
                          )}
                        </div>
                      )}

                      {/* Marcomm Kurator Action Buttons */}
                      {canCurate && !isConverted && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedSubmissionForReview(sub);
                              setRevisionNotesInput(sub.revisionNotes || '');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold cursor-pointer"
                          >
                            Minta Revisi
                          </button>

                          <button
                            onClick={() => {
                              updateRegionalSubmissionStatus(sub.id, 'REJECTED', 'Tidak sesuai prioritas kampanye nasional.');
                              showToast(`❌ Usulan #${sub.id} ditolak.`);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold cursor-pointer"
                          >
                            Tolak
                          </button>

                          <button
                            onClick={() => openCurateModal(sub)}
                            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                            title="Tetapkan Tema & Targeting ke Kalender Konten (File konten belum diperlukan)"
                          >
                            <CalendarCheck className="w-3.5 h-3.5 text-emerald-200" />
                            <span>Tetapkan Jadi Jadwal Konten (Tema & Targeting)</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2.5: ASISTEN AI KONTEN REGIONAL (KHUSUS REGIONAL CREATOR)
      ========================================================================= */}
      {viewMode === 'ai-field' && (
        <div className="space-y-5">
          <div className="p-6 rounded-3xl bg-linear-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white border border-indigo-800 shadow-md space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('regional-inbox')}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-white/20"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Kembali ke Usulan Saya</span>
                </button>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 text-[10px] font-bold uppercase border border-indigo-400/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  AI Field Assistant • {userRegion}
                </span>
              </div>
            </div>
            <h3 className="text-xl font-black">Bantuan Ide AI Konten Regional — {userRegion}</h3>
            <p className="text-xs text-indigo-200 max-w-2xl leading-relaxed">
              Pilih salah satu skenario cepat di bawah atau tuliskan poin kegiatan Anda. AI akan menyusunkan draf usulan lengkap siap kirim ke Marcomm Pusat.
            </p>
          </div>

          {/* Quick Scenario Cards */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Pilih Skenario Lapangan Cepat (1-Klik Generate):
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {fieldTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleGenerateFieldAI(template.samplePrompt)}
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{template.icon}</span>
                    <h5 className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {template.title}
                    </h5>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    {template.desc}
                  </p>
                  <span className="text-[10px] font-bold text-indigo-600 flex items-center gap-1 pt-1">
                    Gunakan Template Ini <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Prompt Box */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Edit3 className="w-4 h-4 text-indigo-600" />
              Atau Tuliskan Catatan Lapangan Bebas:
            </h4>
            <textarea
              rows={3}
              value={customFieldNotes}
              onChange={(e) => setCustomFieldNotes(e.target.value)}
              placeholder={`Contoh: Tim teknis ${userRegion} baru saja selesai mengaktifkan jaringan fiber optik 1Gbps untuk RSUD daerah, SLA 99.98%, dihadiri direktur rumah sakit.`}
              className="w-full p-3 rounded-2xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                AI akan otomatis menyusun Topik, Lokasi, Target Audiens, Pilar Konten, dan Draf Caption.
              </span>
              <button
                disabled={isGeneratingFieldAI}
                onClick={() => handleGenerateFieldAI()}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
              >
                {isGeneratingFieldAI ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Sedang Merancang...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Usulan Lapangan</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Result Card */}
          {generatedFieldDraft && (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-white to-indigo-50/40 border border-indigo-200 shadow-md space-y-4 animate-in fade-in-50 duration-300">
              <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                    📍 {userRegion}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Hasil Rekomendasi AI
                  </span>
                </div>
                <button
                  onClick={handleApplyFieldDraftToForm}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Salin ke Form Pengajuan Baru</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Rekomendasi Topik</span>
                    <h4 className="font-extrabold text-slate-900 text-sm mt-0.5">{generatedFieldDraft.topic}</h4>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Deskripsi Kegiatan</span>
                    <p className="text-slate-700 font-medium mt-0.5">{generatedFieldDraft.activity}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400">Lokasi</span>
                      <span className="block text-slate-800 font-bold">{generatedFieldDraft.location}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400">Pilar Konten</span>
                      <span className="block text-indigo-700 font-bold">{generatedFieldDraft.contentPillarSuggestion}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-indigo-100 space-y-2 text-xs">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Draf Caption Media Sosial</span>
                  <p className="text-slate-700 text-[11px] whitespace-pre-line leading-relaxed">
                    {generatedFieldDraft.captionDraft}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          VIEW 3: MASTER TAXONOMY & GOVERNANCE SETTINGS (PLANNER OWNER ONLY)
      ========================================================================= */}
      {viewMode === 'taxonomy' && isOwner && (
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-indigo-950 text-white border border-indigo-900 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 text-[10px] font-bold uppercase border border-indigo-400/30">
                  Business Owner Authority
                </span>
                <span className="text-[10px] text-indigo-300">Marcomm Exclusive</span>
              </div>
              <h3 className="text-lg font-black text-white mt-1 flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-300" />
                Master Taxonomy & Template Governance
              </h3>
              <p className="text-xs text-indigo-200 mt-0.5 max-w-2xl">
                Sebagai Content Planner Owner, Anda memiliki wewenang menetapkan pilar konten, objektif, audiens target, dan format standar yang digunakan oleh seluruh creator.
              </p>
            </div>

            <button
              onClick={() => {
                submitPlannerStructureRequest({
                  title: 'Penambahan Pilar AI Inovasi & Green Data Center 2026',
                  description: 'Menambahkan pilar Green Tech BUMN ke Section A dan channel TikTok Enterprise.',
                  proposedBy: activeUser.name,
                  targetSection: 'SECTION_A_STRATEGY'
                });
                showToast('📤 Usulan perubahan struktur planner dikirimkan ke Corcomm untuk co-governance review.');
              }}
              className="px-4 py-2 rounded-xl bg-white text-indigo-950 hover:bg-indigo-50 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-600" />
              <span>Ajukan Perubahan Struktur</span>
            </button>
          </div>

          {/* Master Taxonomy Grids */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Content Pillars */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-900 flex items-center justify-between">
                <span>Pilar Konten (Content Pillars)</span>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-mono">
                  {masterTaxonomy.contentPillars.length} Pilar
                </span>
              </span>
              <div className="space-y-1.5">
                {masterTaxonomy.contentPillars.map((pil, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-slate-50 text-xs text-slate-800 font-medium flex items-center justify-between">
                    <span>{pil}</span>
                    <Check className="w-3 h-3 text-emerald-600" />
                  </div>
                ))}
              </div>
            </div>

            {/* Primary Objectives */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-900 flex items-center justify-between">
                <span>Objektif Utama (Objectives)</span>
                <span className="text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded font-mono">
                  {masterTaxonomy.primaryObjectives.length} Opsi
                </span>
              </span>
              <div className="space-y-1.5">
                {masterTaxonomy.primaryObjectives.map((obj, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-slate-50 text-xs text-slate-800 font-medium flex items-center justify-between">
                    <span>{obj}</span>
                    <Check className="w-3 h-3 text-emerald-600" />
                  </div>
                ))}
              </div>
            </div>

            {/* Formats & Channels */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-900 flex items-center justify-between">
                <span>Format & Saluran Distribusi</span>
                <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-mono">
                  Multi-Channel
                </span>
              </span>
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase">Format:</div>
                <div className="flex flex-wrap gap-1">
                  {masterTaxonomy.formats.map((fmt, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-medium">
                      {fmt}
                    </span>
                  ))}
                </div>
                <div className="text-[11px] font-bold text-slate-400 uppercase pt-2">Channel:</div>
                <div className="flex flex-wrap gap-1">
                  {masterTaxonomy.channels.map((chn, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 text-[10px] font-medium">
                      {chn}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Planner Structure Change Requests & Corcomm Co-Governance */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-600" />
                  Daftar Usulan Perubahan Struktur Planner (Corcomm Co-Governance)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Setiap perubahan taksonomi atau seksi Content Planner membutuhkan review bersama Corcomm untuk menjamin kepatuhan reputasi holding.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {plannerStructureRequests.map((req) => (
                <div key={req.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{req.title}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        req.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' :
                        req.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">{req.description}</p>
                    <div className="text-[10px] text-slate-400">
                      Diajukan oleh: <strong className="text-slate-700">{req.proposedBy}</strong> ({req.targetSection})
                    </div>
                  </div>

                  {activeUser.role === 'ROLE_CORCOMM_CREATOR' && req.status === 'PENDING' && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          reviewPlannerStructureRequest(req.id, 'ACTIVE', 'Disetujui untuk mendukung program holding 2026.');
                          showToast('✅ Perubahan struktur planner disetujui oleh Corcomm.');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                      >
                        Setujui (Corcomm)
                      </button>
                      <button
                        onClick={() => {
                          reviewPlannerStructureRequest(req.id, 'REJECTED', 'Perlu penyesuaian pilar.');
                          showToast('❌ Usulan perubahan struktur ditolak.');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold cursor-pointer"
                      >
                        Tolak
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 1: EDIT 4-SECTIONS PLANNER ITEM
      ========================================================================= */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 my-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-rose-600" />
                  Edit 4 Seksi Content Planner
                </h3>
                <span className="text-[11px] text-slate-400">ID: {editingItem.id}</span>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Seksi A: Strategy */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                <span className="text-[11px] font-black uppercase text-indigo-900 block">
                  Seksi A: Strategy
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Primary Objective</label>
                    <select
                      value={editingItem.primaryObjective || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, primaryObjective: e.target.value })}
                      className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs"
                    >
                      {masterTaxonomy.primaryObjectives.map((o, idx) => (
                        <option key={idx} value={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Content Pillar</label>
                    <select
                      value={editingItem.contentPillar || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, contentPillar: e.target.value as any })}
                      className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs"
                    >
                      {masterTaxonomy.contentPillars.map((p, idx) => (
                        <option key={idx} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Key Message</label>
                  <textarea
                    rows={2}
                    value={editingItem.keyMessage || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, keyMessage: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs"
                  />
                </div>
              </div>

              {/* Seksi B: Content */}
              <div className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-2">
                <span className="text-[11px] font-black uppercase text-rose-900 block">
                  Seksi B: Content
                </span>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Topic / Idea</label>
                  <input
                    type="text"
                    value={editingItem.topicIdea || editingItem.title}
                    onChange={(e) => setEditingItem({ ...editingItem, topicIdea: e.target.value, title: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Channel</label>
                    <select
                      value={editingItem.channel || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, channel: e.target.value })}
                      className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs"
                    >
                      {masterTaxonomy.channels.map((c, idx) => (
                        <option key={idx} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Format</label>
                    <select
                      value={editingItem.contentFormat || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, contentFormat: e.target.value })}
                      className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs"
                    >
                      {masterTaxonomy.formats.map((f, idx) => (
                        <option key={idx} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Seksi C & D */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-2">
                  <span className="text-[11px] font-black uppercase text-amber-900 block">
                    Seksi C: Execution
                  </span>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Content Owner</label>
                    <select
                      value={editingItem.contentOwner || 'Marcomm'}
                      onChange={(e) => setEditingItem({ ...editingItem, contentOwner: e.target.value as any })}
                      className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs"
                    >
                      <option value="Marcomm">Marcomm</option>
                      <option value="Regional">Regional</option>
                      <option value="Corcomm">Corcomm</option>
                      <option value="Joint">Joint</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Target Date</label>
                    <input
                      type="date"
                      value={editingItem.targetPublishDate || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, targetPublishDate: e.target.value })}
                      className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Priority</label>
                    <select
                      value={editingItem.priority || 'Medium'}
                      onChange={(e) => setEditingItem({ ...editingItem, priority: e.target.value as any })}
                      className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs"
                    >
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
                  <span className="text-[11px] font-black uppercase text-emerald-900 block">
                    Seksi D: Readiness
                  </span>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Asset Status</label>
                    <input
                      type="text"
                      value={editingItem.supportingAssetStatus || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, supportingAssetStatus: e.target.value })}
                      className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Readiness Notes</label>
                    <textarea
                      rows={2}
                      value={editingItem.readinessNotes || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, readinessNotes: e.target.value })}
                      className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs"
                    />
                  </div>
                </div>

                {/* Co-Governance Status Section */}
                <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-black uppercase text-indigo-900 block">
                      Status Co-Governance (Marcomm &amp; Corcomm)
                    </span>
                    <span className="text-xs text-indigo-800">
                      Persetujuan bersama slot tema kalender untuk sinergi komersial dan korporat.
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingItem.marcommReviewStatus === 'Reviewed'}
                        onChange={(e) => setEditingItem({
                          ...editingItem,
                          marcommReviewStatus: e.target.checked ? 'Reviewed' : 'Pending',
                          marcommReviewer: e.target.checked ? activeUser.name : undefined,
                          marcommReviewedAt: e.target.checked ? new Date().toISOString() : undefined
                        })}
                        className="rounded text-teal-600 focus:ring-teal-500"
                      />
                      <span>Validasi Marcomm</span>
                    </label>

                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingItem.corcommReviewStatus === 'Reviewed'}
                        onChange={(e) => setEditingItem({
                          ...editingItem,
                          corcommReviewStatus: e.target.checked ? 'Reviewed' : 'Pending',
                          corcommReviewer: e.target.checked ? activeUser.name : undefined,
                          corcommReviewedAt: e.target.checked ? new Date().toISOString() : undefined
                        })}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Acc Corcomm</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  updateContentPlannerItem(editingItem.id, editingItem);
                  setEditingItem(null);
                  showToast('✅ Perubahan 4 Seksi Content Planner berhasil disimpan!');
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer shadow-sm"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: KURASI USULAN JADI JADWAL KONTEN (FASE 1: TEMA & TARGETING)
      ========================================================================= */}
      {curateModalSub && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10.5px] font-bold border border-indigo-200 flex items-center gap-1">
                    <CalendarCheck className="w-3 h-3 text-indigo-600" />
                    Fase 1: Perencanaan Tema &amp; Targeting
                  </span>
                  <span className="text-xs text-slate-400">• Marcomm Kurasi &amp; Corcomm Approval</span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  Tetapkan Usulan Jadi Jadwal Kalender Konten
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dari usulan unit: <strong className="text-slate-800">{curateModalSub.regional}</strong> (PIC: {curateModalSub.picRegional})
                </p>
              </div>

              <button
                onClick={() => setCurateModalSub(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Banner Edukasi: File Belum Diperlukan */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold text-amber-950">
                  Prinsip Kalender: File Konten Belum Diperlukan Pada Fase Ini!
                </p>
                <p className="text-[11.5px] text-amber-800 leading-relaxed">
                  Saat jadwal kalender ditetapkan oleh Marcomm dan disetujui Corcomm, yang dikunci adalah <strong>tema, targeting audience, tujuan bisnis, dan tanggal tayang</strong>. File konten fisik (foto/video/berita acara) baru akan disetorkan oleh Regional / Kreator pada <strong>Fase 2 (Produksi &amp; Kesiapan Aset)</strong>.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              {/* Tema Konten */}
              <div>
                <label className="block text-[10.5px] font-bold text-slate-600 uppercase mb-1">
                  Judul Tema Konten Terjadwal
                </label>
                <input
                  type="text"
                  value={curateThemeTitle}
                  onChange={(e) => setCurateThemeTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="Contoh: Implementasi IoT Smart Energy Management Menekan Emisi Gedung"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Brand Target Account */}
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-600 uppercase mb-1">
                    Akun Target Publikasi
                  </label>
                  <select
                    value={curateBrandTarget}
                    onChange={(e) => setCurateBrandTarget(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:bg-white"
                  >
                    <option value="@telprodico">@telprodico (Digital Solution, B2B, Connectivity)</option>
                    <option value="@telkomproperty">@telkomproperty (Property, Facility, Corporate)</option>
                  </select>
                </div>

                {/* Tujuan Konten / Primary Objective */}
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-600 uppercase mb-1">
                    Tujuan Konten (Targeting Objective)
                  </label>
                  <select
                    value={curateObjective}
                    onChange={(e) => setCurateObjective(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:bg-white"
                  >
                    <option value="B2B Trust & Keandalan SLA">B2B Trust &amp; Keandalan SLA</option>
                    <option value="Brand Awareness & Jangkauan Pasar">Brand Awareness &amp; Jangkauan Pasar</option>
                    <option value="Product Education & Fitur Solusi">Product Education &amp; Fitur Solusi</option>
                    <option value="Talent & Regional Engagement">Talent &amp; Regional Engagement</option>
                    <option value="ESG & Corporate Sustainability">ESG &amp; Corporate Sustainability</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Target Tanggal Tayang */}
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-600 uppercase mb-1">
                    Target Tanggal Tayang
                  </label>
                  <input
                    type="date"
                    value={curateTargetDate}
                    onChange={(e) => setCurateTargetDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800"
                  />
                </div>

                {/* Content Pillar */}
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-600 uppercase mb-1">
                    Pilar Konten
                  </label>
                  <select
                    value={curatePillar}
                    onChange={(e) => setCuratePillar(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white"
                  >
                    {masterTaxonomy.pillars.map((p, idx) => (
                      <option key={idx} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                {/* Content Format */}
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-600 uppercase mb-1">
                    Format Konten
                  </label>
                  <select
                    value={curateFormat}
                    onChange={(e) => setCurateFormat(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white"
                  >
                    {masterTaxonomy.formats.map((f, idx) => (
                      <option key={idx} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Key Message */}
              <div>
                <label className="block text-[10.5px] font-bold text-slate-600 uppercase mb-1">
                  Pesan Kunci / Key Message
                </label>
                <input
                  type="text"
                  value={curateKeyMessage}
                  onChange={(e) => setCurateKeyMessage(e.target.value)}
                  placeholder="Contoh: Infrastruktur fiber optik TELPRO berstandar SLA 99.98% menjamin kelancaran transaksi B2B"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800"
                />
              </div>

              {/* Corcomm Approval Checkbox */}
              <div className="p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="curateCorcommApprovalCheck"
                  checked={curateCorcommApproval}
                  onChange={(e) => setCurateCorcommApproval(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 border-indigo-300 focus:ring-indigo-500 mt-0.5 cursor-pointer"
                />
                <label htmlFor="curateCorcommApprovalCheck" className="text-xs cursor-pointer select-none">
                  <span className="font-bold text-indigo-950 block">
                    Konfirmasi Persetujuan Bersama Corcomm (Co-Governance)
                  </span>
                  <span className="text-[11px] text-indigo-800 leading-snug block mt-0.5">
                    Centang bila tema dan targeting ini telah disepakati bersama tim Corporate Communication untuk masuk agenda resmi kalender tayang.
                  </span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurateModalSub(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmCurateToCalendar}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Kunci Jadi Jadwal Kalender Konten (Fase 1)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: SETOR / UNGGAH FILE KONTEN — FASE 2 (PRODUKSI & ASET LAPANGAN)
      ========================================================================= */}
      {uploadAssetItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10.5px] font-bold border border-emerald-200 flex items-center gap-1">
                    <FolderPlus className="w-3 h-3 text-emerald-600" />
                    Fase 2: Produksi &amp; Penyetoran Aset Lapangan
                  </span>
                  <span className="text-xs text-slate-400">• Kesiapan Konten Fisik</span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  Setor File Konten &amp; Bukti Kegiatan Lapangan
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Slot Jadwal: <strong className="text-slate-800">{uploadAssetItem.title}</strong>
                </p>
              </div>

              <button
                onClick={() => setUploadAssetItem(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Info Summary */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Target Tayang</span>
                <span className="font-mono font-bold text-slate-800">{uploadAssetItem.targetPublishDate || 'TBD'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Kanal &amp; Akun</span>
                <span className="font-semibold text-indigo-700">{uploadAssetItem.channel || uploadAssetItem.platform}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Tujuan Konten</span>
                <span className="text-slate-700">{uploadAssetItem.primaryObjective || uploadAssetItem.objective || 'B2B Trust'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Owner / Unit</span>
                <span className="text-slate-700">{uploadAssetItem.contentOwner} {uploadAssetItem.regionalUnit ? `(${uploadAssetItem.regionalUnit})` : ''}</span>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* File Upload / Simulated Picker */}
              <div>
                <label className="block text-[10.5px] font-bold text-slate-600 uppercase mb-1">
                  Nama File Aset Foto / Video Footage Lapangan
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={uploadedFileName}
                    onChange={(e) => setUploadedFileName(e.target.value)}
                    placeholder="Contoh: Dokumentasi_Peresmian_Tower_Batam_2026.jpg"
                    className="flex-1 p-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const samples = [
                        'Dokumentasi_Kunjungan_Direksi_Regional.mp4',
                        'Foto_Inspeksi_SLA_Fiber_Optic_HighRes.jpg',
                        'Carousel_Infografis_Smart_Building.png',
                        'Liputan_CSR_Komunitas_Maritim_Batam.jpg'
                      ];
                      const pick = samples[Math.floor(Math.random() * samples.length)];
                      setUploadedFileName(pick);
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold shrink-0 cursor-pointer"
                  >
                    Pilih Sampel
                  </button>
                </div>
              </div>

              {/* Cloud Drive Link */}
              <div>
                <label className="block text-[10.5px] font-bold text-slate-600 uppercase mb-1">
                  Tautan Cloud Storage / Google Drive / OneDrive
                </label>
                <input
                  type="url"
                  value={uploadedDriveUrl}
                  onChange={(e) => setUploadedDriveUrl(e.target.value)}
                  placeholder="https://drive.google.com/drive/folders/... (Folder Raw Footage & High-Res)"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-800"
                />
              </div>

              {/* Berita Acara / Data Pendukung */}
              <div>
                <label className="block text-[10.5px] font-bold text-slate-600 uppercase mb-1">
                  Nama Dokumen Pendukung (Berita Acara / Laporan Lapangan)
                </label>
                <input
                  type="text"
                  value={uploadedDocName}
                  onChange={(e) => setUploadedDocName(e.target.value)}
                  placeholder="Contoh: Berita Acara Uji Fungsi SLA 99.98% PT Telpro Batam No. BA/02/2026"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800"
                />
              </div>

              {/* Catatan Kesiapan / Draft Caption */}
              <div>
                <label className="block text-[10.5px] font-bold text-slate-600 uppercase mb-1">
                  Catatan Materi &amp; Konteks Lapangan
                </label>
                <textarea
                  rows={2}
                  value={uploadedNotes}
                  onChange={(e) => setUploadedNotes(e.target.value)}
                  placeholder="Tuliskan keterangan detail momen kegiatan, tokoh yang hadir, atau poin penting yang wajib masuk caption..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setUploadAssetItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isUploadingSimulated}
                onClick={handleSaveUploadedAsset}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                {isUploadingSimulated ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menyimpan File...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4" />
                    <span>Konfirmasi Setor File Aset (Fase 2)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: JADWALKAN SLOT TEMA BARU — FASE 1 (LANGSUNG DARI KALENDER)
      ========================================================================= */}
      {isNewThemeSlotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10.5px] font-bold border border-blue-200 flex items-center gap-1">
                    <Plus className="w-3 h-3 text-blue-600" />
                    Slot Tema Baru (Fase 1)
                  </span>
                  <span className="text-xs text-slate-400">• Kalender Konten Nasional/Regional</span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  Jadwalkan Tema Konten &amp; Targeting
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tentukan tema, tujuan, dan tanggal tayang. File konten belum diperlukan di fase ini.
                </p>
              </div>

              <button
                onClick={() => setIsNewThemeSlotModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewThemeSlot} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[10.5px] font-bold text-slate-600 uppercase mb-1">
                  Judul Tema / Topik Konten
                </label>
                <input
                  type="text"
                  required
                  value={newThemeSlotData.title}
                  onChange={(e) => setNewThemeSlotData({ ...newThemeSlotData, title: e.target.value })}
                  placeholder="Contoh: Showcase Solusi Managed Tower SLA 99.98% Sektor Logistik Pelabuhan"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-600 uppercase mb-1">
                    Akun Target Publikasi
                  </label>
                  <select
                    value={newThemeSlotData.channel}
                    onChange={(e) => setNewThemeSlotData({ ...newThemeSlotData, channel: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:bg-white"
                  >
                    <option value="@telprodico">@telprodico (Digital Solution &amp; B2B)</option>
                    <option value="@telkomproperty">@telkomproperty (Property &amp; Corporate)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-slate-600 uppercase mb-1">
                    Tujuan Konten (Targeting Objective)
                  </label>
                  <select
                    value={newThemeSlotData.primaryObjective}
                    onChange={(e) => setNewThemeSlotData({ ...newThemeSlotData, primaryObjective: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:bg-white"
                  >
                    <option value="B2B Trust & Keandalan SLA">B2B Trust &amp; Keandalan SLA</option>
                    <option value="Brand Awareness & Jangkauan Pasar">Brand Awareness &amp; Jangkauan Pasar</option>
                    <option value="Product Education & Fitur Solusi">Product Education &amp; Fitur Solusi</option>
                    <option value="Talent & Regional Engagement">Talent &amp; Regional Engagement</option>
                    <option value="ESG & Corporate Sustainability">ESG &amp; Corporate Sustainability</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-600 uppercase mb-1">
                    Target Tanggal Tayang
                  </label>
                  <input
                    type="date"
                    required
                    value={newThemeSlotData.targetPublishDate}
                    onChange={(e) => setNewThemeSlotData({ ...newThemeSlotData, targetPublishDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-slate-600 uppercase mb-1">
                    Pilar Konten
                  </label>
                  <select
                    value={newThemeSlotData.contentPillar}
                    onChange={(e) => setNewThemeSlotData({ ...newThemeSlotData, contentPillar: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white"
                  >
                    {masterTaxonomy.pillars.map((p, idx) => (
                      <option key={idx} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-slate-600 uppercase mb-1">
                    Format Konten
                  </label>
                  <select
                    value={newThemeSlotData.contentFormat}
                    onChange={(e) => setNewThemeSlotData({ ...newThemeSlotData, contentFormat: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white"
                  >
                    {masterTaxonomy.formats.map((f, idx) => (
                      <option key={idx} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-600 uppercase mb-1">
                    Pemilik Konten (Owner)
                  </label>
                  <select
                    value={newThemeSlotData.contentOwner}
                    onChange={(e) => setNewThemeSlotData({ ...newThemeSlotData, contentOwner: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white"
                  >
                    <option value="Marcomm">Marcomm (Pusat)</option>
                    <option value="Regional">Regional Unit</option>
                    <option value="Corcomm">Corcomm (Holding)</option>
                    <option value="Joint">Joint Initiative</option>
                  </select>
                </div>

                {newThemeSlotData.contentOwner === 'Regional' && (
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-600 uppercase mb-1">
                      Unit Regional
                    </label>
                    <select
                      value={newThemeSlotData.regionalUnit}
                      onChange={(e) => setNewThemeSlotData({ ...newThemeSlotData, regionalUnit: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white"
                    >
                      {['Regional 1', 'Regional 2', 'Regional 3', 'Regional 4', 'Regional 5', 'Regional 6', 'Regional 7'].map((reg) => (
                        <option key={reg} value={reg}>{reg}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* B2B Asset Catalog & CTA Lead Link */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-2xl bg-teal-50/60 border border-teal-100">
                <div>
                  <label className="block text-[10.5px] font-bold text-teal-900 uppercase mb-1 flex items-center gap-1">
                    <span>🏢</span> Katalog Properti / Layanan B2B
                  </label>
                  <select
                    value={newThemeSlotData.targetPropertyAsset}
                    onChange={(e) => setNewThemeSlotData({ ...newThemeSlotData, targetPropertyAsset: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-teal-200 text-xs bg-white font-semibold text-slate-800"
                  >
                    <option value="Telkom Landmark Tower (TLT) Jakarta">Telkom Landmark Tower (TLT) Jakarta</option>
                    <option value="Sentul Integrated Data Center">Sentul Integrated Data Center</option>
                    <option value="Layanan Facility Management (FM) Terintegrasi">Layanan Facility Management (FM) Terintegrasi</option>
                    <option value="Solusi Green Building & Efisiensi Energi MEP">Solusi Green Building &amp; Efisiensi Energi MEP</option>
                    <option value="Kawasan Perkantoran Graha Merah Putih">Kawasan Perkantoran Graha Merah Putih</option>
                    <option value="Coworking & Flexible Workspace Regional">Coworking &amp; Flexible Workspace Regional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-teal-900 uppercase mb-1 flex items-center gap-1">
                    <span>🎯</span> Target Link CTA / Leads WA Sales
                  </label>
                  <input
                    type="url"
                    value={newThemeSlotData.ctaTrackingLink}
                    onChange={(e) => setNewThemeSlotData({ ...newThemeSlotData, ctaTrackingLink: e.target.value })}
                    placeholder="https://wa.me/62811... atau link penawaran"
                    className="w-full p-2.5 rounded-xl border border-teal-200 text-xs text-slate-800 bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-slate-600 uppercase mb-1">
                  Pesan Kunci / Key Message
                </label>
                <input
                  type="text"
                  value={newThemeSlotData.keyMessage}
                  onChange={(e) => setNewThemeSlotData({ ...newThemeSlotData, keyMessage: e.target.value })}
                  placeholder="Contoh: Infrastruktur digital terintegrasi TELPRO menjamin ketersediaan layanan tanpa gangguan"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800"
                />
              </div>

              {/* Corcomm Approval */}
              <div className="p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="slotCorcommApprovalCheck"
                  checked={newThemeSlotData.corcommApproved}
                  onChange={(e) => setNewThemeSlotData({ ...newThemeSlotData, corcommApproved: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 border-indigo-300 focus:ring-indigo-500 mt-0.5 cursor-pointer"
                />
                <label htmlFor="slotCorcommApprovalCheck" className="text-xs cursor-pointer select-none">
                  <span className="font-bold text-indigo-950 block">
                    Disetujui Corcomm untuk Kalender Editorial
                  </span>
                  <span className="text-[11px] text-indigo-800 leading-snug block mt-0.5">
                    Tandai status persetujuan Corcomm langsung jika slot tema ini telah dibahas dalam editorial meeting.
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewThemeSlotModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Kunci Jadwal di Kalender Konten</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: AJUKAN SUBMISI REGIONAL (ALUR 2 JALUR: BANTUAN AI & MANUAL)
      ========================================================================= */}
      {isNewRegionalModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 my-8">

            {/* -------------------------------------------------------------
                METODE PEMBUATAN USULAN (SELECTION SCREEN)
            ------------------------------------------------------------- */}
            {regionalCreationStep === 'SELECT_MODE' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10.5px] font-bold border border-emerald-200 inline-flex items-center gap-1 mb-1">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      Unit Regional: {userRegion}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-lg">
                      Pilih Metode Pembuatan Usulan Konten
                    </h3>
                    <p className="text-xs text-slate-500">
                      Bagaimana Anda ingin membuat usulan konten hari ini?
                    </p>
                  </div>
                  <button
                    onClick={() => setIsNewRegionalModalOpen(false)}
                    className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Kartu Metode 1: Bantuan AI (Rekomendasi Format & Shot List) */}
                  <div
                    onClick={() => setRegionalCreationStep('AI_TREND_SELECT')}
                    className="group relative p-5 rounded-2xl border-2 border-indigo-300 hover:border-indigo-600 bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/40 cursor-pointer transition-all hover:shadow-md flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold uppercase tracking-wider">
                          ⚡ Sangat Direkomendasikan
                        </span>
                      </div>

                      <div>
                        <h4 className="font-black text-slate-900 text-base group-hover:text-indigo-700 transition-colors">
                          Metode 1: Dibantu AI (Inspirasi Ide & Shot List)
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          Paling mudah & hemat waktu! Pilih inspirasi kegiatan, AI langsung merumuskan format medsos, sudut pandang pesan, checklist foto/video, dan draf caption.
                        </p>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-indigo-100/80 text-[11px] text-slate-700">
                        <div className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span>Inspirasi skenario @telprodico & @telkomproperty</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span>Panduan checklist shot list foto & video lokasi</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span>Format rekomendasi langsung siap kirim</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="mt-5 w-full py-2.5 rounded-xl bg-indigo-600 group-hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <span>Mulai dengan Inspirasi AI</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Kartu Metode 2: Tulis Mandiri / Manual */}
                  <div
                    onClick={() => setRegionalCreationStep('MANUAL_FORM')}
                    className="group relative p-5 rounded-2xl border-2 border-slate-200 hover:border-slate-500 bg-white cursor-pointer transition-all hover:shadow-md flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                          <Edit3 className="w-5 h-5" />
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                          Formulir Standar
                        </span>
                      </div>

                      <div>
                        <h4 className="font-black text-slate-900 text-base group-hover:text-slate-800 transition-colors">
                          Metode 2: Input Formulir Mandiri
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          Gunakan metode ini jika Anda sudah menyiapkan data rincian kegiatan, berita acara, dan tautan dokumentasi secara lengkap dan ingin langsung mengisi formulir.
                        </p>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-slate-100 text-[11px] text-slate-700">
                        <div className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>Isi langsung nama kegiatan & tanggal pelaksanaan</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>Pilih sendiri pilar dan target akun medsos</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>Cocok untuk kegiatan rutin terencana</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="mt-5 w-full py-2.5 rounded-xl bg-slate-100 group-hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>Buka Formulir Mandiri</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
                  <span>💡 <em>Tips:</em> Pilih Bantuan AI jika membutuhkan inspirasi sudut pandang dan checklist foto/video. Pilih Formulir Mandiri jika data kegiatan dan link dokumentasi sudah siap.</span>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------
                METODE 1 - LANGKAH 1: PILIH MODE INSPIRASI & INPUT KEGIATAN
            ------------------------------------------------------------- */}
            {regionalCreationStep === 'AI_TREND_SELECT' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRegionalCreationStep('SELECT_MODE')}
                      className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 cursor-pointer flex items-center gap-1.5 text-xs font-semibold border border-slate-200 transition-colors"
                      title="Ganti metode pembuatan"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Ganti Metode</span>
                    </button>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 block">
                        Metode 1: Asisten AI (Langkah 1 dari 2)
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-base">
                        {aiSubMode === 'FREE_TOPIC' ? 'Tulis Kegiatan Lapangan' : 'Pilih Inspirasi Marcomm'} — {userRegion}
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsNewRegionalModalOpen(false)}
                    className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* 2 Tab Mode yang Sangat Jelas & Mudah Dipahami */}
                <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setAiSubMode('FREE_TOPIC');
                      setSelectedTrendId('custom-free-topic');
                    }}
                    className={`p-3 rounded-xl text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                      aiSubMode === 'FREE_TOPIC'
                        ? 'bg-white text-indigo-950 shadow-sm border border-indigo-200 ring-2 ring-indigo-500/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0 mt-0.5 ${
                      aiSubMode === 'FREE_TOPIC' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'
                    }`}>
                      ✍️
                    </div>
                    <div>
                      <div className="text-xs font-black flex items-center gap-1.5">
                        <span>Topik Bebas (Tulis Sendiri)</span>
                        {aiSubMode === 'FREE_TOPIC' && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-normal leading-tight mt-0.5">
                        Ketik kegiatan wilayah tanpa template
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAiSubMode('RECOMMENDED_TRENDS');
                      if (selectedTrendId === 'custom-free-topic') {
                        setSelectedTrendId('enterprise-client');
                        setNewRegionalData(prev => ({ ...prev, brandTarget: '@telprodico' }));
                      }
                    }}
                    className={`p-3 rounded-xl text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                      aiSubMode === 'RECOMMENDED_TRENDS'
                        ? 'bg-white text-indigo-950 shadow-sm border border-indigo-200 ring-2 ring-indigo-500/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0 mt-0.5 ${
                      aiSubMode === 'RECOMMENDED_TRENDS' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'
                    }`}>
                      💡
                    </div>
                    <div>
                      <div className="text-xs font-black flex items-center gap-1.5">
                        <span>Inspirasi Rekomendasi Marcomm</span>
                        {aiSubMode === 'RECOMMENDED_TRENDS' && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-normal leading-tight mt-0.5">
                        Pilih contoh skenario dari pusat
                      </p>
                    </div>
                  </button>
                </div>

                {/* ============================================================
                    TAMPILAN 1: JIKA MEMILIH TOPIK BEBAS (BERSIH, TANPA KARTU)
                ============================================================ */}
                {aiSubMode === 'FREE_TOPIC' && (
                  <div className="space-y-3.5">
                    {/* Panduan Ringkas */}
                    <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950 flex items-center gap-2.5">
                      <span className="text-lg shrink-0">✨</span>
                      <p className="text-[11.5px] leading-relaxed">
                        <strong>Langkah Cepat:</strong> Pilih akun tujuan dan tuliskan kegiatan nyata di wilayah Anda. AI akan otomatis menyusun format postingan, sudut pandang pesan, checklist foto/video, dan draf caption.
                      </p>
                    </div>

                    {/* 1. Pilih Target Akun Medsos (2 Kartu Visual) */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                        1. Pilih Target Akun Media Sosial:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {/* Option A: @telprodico */}
                        <div
                          onClick={() => setNewRegionalData(prev => ({ ...prev, brandTarget: '@telprodico' }))}
                          className={`p-3.5 rounded-xl border-2 text-left cursor-pointer transition-all ${
                            (newRegionalData.brandTarget || '@telprodico') === '@telprodico'
                              ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-2 ring-blue-200'
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                              <span>📦</span> @telprodico
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                              Khusus Produk & Solusi
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-1.5 leading-snug">
                            Dedicated fiber optic, paket konektivitas industri B2B, ekspansi jaringan ODP, keandalan SLA teknisi.
                          </p>
                          <div className="mt-2 text-[10px] font-bold text-blue-700 flex items-center gap-1">
                            {(newRegionalData.brandTarget || '@telprodico') === '@telprodico' ? (
                              <span className="flex items-center gap-1 text-emerald-600 font-extrabold">
                                <CheckCircle2 className="w-3 h-3" /> Akun Terpilih
                              </span>
                            ) : (
                              <span>Pilih Akun Ini →</span>
                            )}
                          </div>
                        </div>

                        {/* Option B: @telkomproperty */}
                        <div
                          onClick={() => setNewRegionalData(prev => ({ ...prev, brandTarget: '@telkomproperty' }))}
                          className={`p-3.5 rounded-xl border-2 text-left cursor-pointer transition-all ${
                            newRegionalData.brandTarget === '@telkomproperty'
                              ? 'border-amber-600 bg-amber-50/60 shadow-xs ring-2 ring-amber-200'
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                              <span>🏢</span> @telkomproperty
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                              Khusus Info Perusahaan
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-1.5 leading-snug">
                            Gedung kantor & fasilitas, simulasi evakuasi K3/Damkar, kunjungan pimpinan/direksi, bakti sosial CSR.
                          </p>
                          <div className="mt-2 text-[10px] font-bold text-amber-700 flex items-center gap-1">
                            {newRegionalData.brandTarget === '@telkomproperty' ? (
                              <span className="flex items-center gap-1 text-emerald-600 font-extrabold">
                                <CheckCircle2 className="w-3 h-3" /> Akun Terpilih
                              </span>
                            ) : (
                              <span>Pilih Akun Ini →</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 2. Sifat Urgensi Konten */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase">
                          2. Sifat / Urgensi Usulan:
                        </label>
                        <span className="text-[10px] text-slate-500">
                          Tentukan penanganan waktu penayangan oleh Marcomm
                        </span>
                      </div>
                      <select
                        value={newRegionalData.submissionTrack || 'MONTHLY_AGENDA'}
                        onChange={(e) => setNewRegionalData({ ...newRegionalData, submissionTrack: e.target.value as any })}
                        className="p-2 rounded-lg border border-slate-200 text-xs font-bold bg-white focus:border-indigo-500"
                      >
                        <option value="MONTHLY_AGENDA">🗓️ Rutin / Fleksibel (Bisa kapan saja di kalender)</option>
                        <option value="FAST_TRACK_URGENT">⚡ Aktual / Butuh Cepat (Liputan momen terbaru)</option>
                      </select>
                    </div>

                    {/* 3. Tuliskan Kegiatan Lapangan */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                        3. Tuliskan Rincian Kegiatan Lapangan di {userRegion}:
                      </label>
                      <textarea
                        rows={4}
                        value={customFieldNotes}
                        onChange={(e) => setCustomFieldNotes(e.target.value)}
                        placeholder={
                          newRegionalData.brandTarget === '@telkomproperty'
                            ? 'Contoh: Tim Regional 1 pagi tadi mengadakan simulasi mitigasi kebakaran & evakuasi darurat bersama petugas Damkar di Menara Telkom Pekanbaru, diikuti oleh tim K3 dan tenant gedung...'
                            : 'Contoh: Tim teknisi regional telah menyelesaikan instalasi & serah terima Dedicated Fiber Internet 1Gbps untuk tenant pabrik di kawasan industri dengan SLA 99.98%...'
                        }
                        className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all leading-relaxed"
                      />
                      <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                        <span>💡 Ceritakan siapa yang terlibat, apa yang dilakukan, dan di mana lokasinya.</span>
                        <span className="font-semibold">{customFieldNotes.trim().length} karakter</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ============================================================
                    TAMPILAN 2: JIKA MEMILIH INSPIRASI REKOMENDASI MARCOMM
                ============================================================ */}
                {aiSubMode === 'RECOMMENDED_TRENDS' && (
                  <div className="space-y-3">
                    {/* Banner Tema Marcomm Pusat */}
                    <div className="p-3 rounded-xl bg-slate-900 text-white text-xs">
                      <div className="flex items-center justify-between mb-1.5 border-b border-slate-700 pb-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          📌 Fokus Tema Editorial Marcomm Bulan Ini:
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-300 font-semibold border border-indigo-400/30">
                          September 2026
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700">
                          <span className="text-blue-300 font-bold block">📦 @telprodico (Khusus Produk):</span>
                          <span className="text-slate-200">Akselerasi High-Speed Fiber B2B & Penetrasi ODP Daerah</span>
                        </div>
                        <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700">
                          <span className="text-amber-300 font-bold block">🏢 @telkomproperty (Khusus Info Perusahaan):</span>
                          <span className="text-slate-200">Bulan K3 & Green Building Fasilitas Kantor Modern</span>
                        </div>
                      </div>
                    </div>

                    {/* Filter Kategori */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Filter:</span>
                      <button
                        type="button"
                        onClick={() => setAiTrendFilter('ALL')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                          aiTrendFilter === 'ALL'
                            ? 'bg-indigo-600 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Semua Skenario ({fieldTemplates.filter(t => t.id !== 'custom-free-topic').length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setAiTrendFilter('@telprodico')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                          aiTrendFilter === '@telprodico'
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100'
                        }`}
                      >
                        📦 Khusus Produk (@telprodico)
                      </button>
                      <button
                        type="button"
                        onClick={() => setAiTrendFilter('@telkomproperty')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                          aiTrendFilter === '@telkomproperty'
                            ? 'bg-amber-600 text-white shadow-2xs'
                            : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        🏢 Khusus Info Perusahaan (@telkomproperty)
                      </button>
                    </div>

                    {/* Grid Pilihan Tren */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
                      {fieldTemplates
                        .filter(t => t.id !== 'custom-free-topic')
                        .filter(t => aiTrendFilter === 'ALL' || t.brandTarget === aiTrendFilter || t.brandTarget === 'MARCOMM_CHOICE')
                        .map((trend) => {
                          const isSelected = selectedTrendId === trend.id;
                          const isProduct = trend.brandTarget === '@telprodico';
                          return (
                            <div
                              key={trend.id}
                              onClick={() => {
                                setSelectedTrendId(trend.id);
                                setNewRegionalData(prev => ({
                                  ...prev,
                                  brandTarget: trend.brandTarget === 'MARCOMM_CHOICE' ? '@telprodico' : trend.brandTarget
                                }));
                              }}
                              className={`p-3 rounded-2xl border text-left cursor-pointer transition-all relative ${
                                isSelected
                                  ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-2 ring-indigo-200'
                                  : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50/50'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-1.5">
                                <span className="text-xl">{trend.icon}</span>
                                <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border ${
                                  isProduct
                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                }`}>
                                  {trend.badge}
                                </span>
                              </div>
                              <h5 className="font-bold text-slate-900 text-xs mt-1.5 line-clamp-1">
                                {trend.title}
                              </h5>
                              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-snug">
                                {trend.desc}
                              </p>
                              <div className="mt-2 flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
                                <span className={`font-bold ${isProduct ? 'text-blue-600' : 'text-amber-600'}`}>
                                  {trend.brandTarget === '@telprodico'
                                    ? '📦 @telprodico (Produk)'
                                    : trend.brandTarget === '@telkomproperty'
                                      ? '🏢 @telkomproperty (Info Perusahaan)'
                                      : '🤝 Pilihan Marcomm'}
                                </span>
                                {isSelected && (
                                  <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Terpilih
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>

                    {/* Catatan Lapangan Opsional */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                        Catatan Tambahan Kegiatan Wilayah (Opsional):
                      </label>
                      <input
                        type="text"
                        value={customFieldNotes}
                        onChange={(e) => setCustomFieldNotes(e.target.value)}
                        placeholder="Contoh: Kegiatan berlokasi di area Batam dan dihadiri perwakilan manajemen..."
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                )}

                {/* Footer Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setRegionalCreationStep('SELECT_MODE')}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer hover:bg-slate-200 transition-colors"
                  >
                    Kembali
                  </button>

                  <button
                    type="button"
                    disabled={isGeneratingFieldAI || (aiSubMode === 'FREE_TOPIC' && !customFieldNotes.trim())}
                    onClick={() => handleGenerateTrendAI(selectedTrendId, customFieldNotes)}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    {isGeneratingFieldAI ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Menyusun Format Rekomendasi...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>
                          {aiSubMode === 'FREE_TOPIC' && !customFieldNotes.trim()
                            ? 'Tuliskan rincian kegiatan terlebih dahulu...'
                            : 'Hasilkan Format Rekomendasi Konten →'}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------
                JALUR 1 - LANGKAH 2: FORMAT REKOMENDASI KONTEN (SIAP AJUKAN)
            ------------------------------------------------------------- */}
            {regionalCreationStep === 'AI_RECOMMENDATION_REVIEW' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRegionalCreationStep('AI_TREND_SELECT')}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer"
                      title="Ubah pilihan tren"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 block">
                        Langkah 2 dari 2: Format Rekomendasi Terstruktur
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        Format Rekomendasi Konten Lapangan
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsNewRegionalModalOpen(false)}
                    className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Banner Filosofi AI: Pemantik Ide & Fleksibel Disesuaikan */}
                <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-amber-500/10 to-emerald-500/10 border border-indigo-200/80 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white text-indigo-600 shadow-2xs shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">
                        AI Sebagai Pemantik Inspirasi (Bebas Disesuaikan 100%)
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        ✏️ Semua Kolom Dapat Diedit
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Draf di bawah ini adalah inspirasi awal agar tim wilayah tidak mulai dari nol. <strong>Anda bebas mengedit judul, alur slide carousel, naskah story/reels, hingga daftar foto/video</strong> agar tepat sasaran dengan kondisi nyata di lapangan.
                    </p>
                  </div>
                </div>

                {/* Header Ringkasan Format */}
                <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white font-bold text-[10.5px]">
                        Target Akun: {newRegionalData.brandTarget || '@telprodico'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-white border border-indigo-200 text-indigo-900 font-bold text-[10.5px]">
                        {newRegionalData.submissionTrack === 'FAST_TRACK_URGENT' ? '⚡ Konten Cepat' : '🗓️ Konten Terjadwal'}
                      </span>
                    </div>
                    <span className="text-xs font-extrabold text-indigo-900 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-indigo-600" />
                      Paket Lengkap 3 Format (Story + Feed + Reels)
                    </span>
                  </div>

                  {/* Badge Keselarasan Tema Marcomm/Corcomm */}
                  {newRegionalData.marcommAlignmentNote && (
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 text-xs flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-bold text-[11px] leading-snug">{newRegionalData.marcommAlignmentNote}</span>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <label className="text-[10px] font-bold text-indigo-900 uppercase flex items-center gap-1">
                        <Pencil className="w-3 h-3 text-indigo-600" />
                        <span>Topik / Hook Usulan (Dapat Diedit):</span>
                      </label>
                      <span className="text-[9.5px] text-indigo-600 font-semibold flex items-center gap-0.5">
                        <Pencil className="w-2.5 h-2.5" /> Klik untuk edit
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={newRegionalData.topic || ''}
                        onChange={(e) => setNewRegionalData({ ...newRegionalData, topic: e.target.value })}
                        className="w-full p-2 pr-8 rounded-xl bg-white border border-indigo-200 text-xs font-bold text-slate-900 focus:border-indigo-600"
                        placeholder="Ketik atau sesuaikan topik..."
                      />
                      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-400">
                        <Pencil className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mengapa Relevan & Sudut Pandang Tren */}
                {newRegionalData.trendAngle && (
                  <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs space-y-1">
                    <div className="font-extrabold flex items-center gap-1.5 text-amber-900 text-[11px] uppercase tracking-wider">
                      <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                      <span>Mengapa Topik Ini Kuat & Relevan (Sudut Pandang Tren):</span>
                    </div>
                    <p className="text-[11.5px] leading-relaxed text-amber-900">
                      {newRegionalData.trendAngle}
                    </p>
                  </div>
                )}

                {/* Panduan Shot List Lapangan (Foto & Video) - Dapat Diedit / Ditambah */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 text-xs space-y-2.5">
                  <div className="font-extrabold flex items-center justify-between text-emerald-900 text-[11px] uppercase tracking-wider">
                    <div className="flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-emerald-600" />
                      <span>Panduan Shot List Lapangan (Bebas Diedit / Ditambah):</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const cur = [...(newRegionalData.shotList || [])];
                        cur.push('Dokumentasi visual tambahan lapangan...');
                        setNewRegionalData({ ...newRegionalData, shotList: cur });
                      }}
                      className="text-[10.5px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer bg-white px-2 py-0.5 rounded-lg border border-emerald-200"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Tambah Shot</span>
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {(newRegionalData.shotList || []).map((shot, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-white/90 p-2 rounded-xl border border-emerald-100 hover:border-emerald-300 transition-colors shadow-2xs group">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <input
                          type="text"
                          value={shot}
                          onChange={(e) => {
                            const cur = [...(newRegionalData.shotList || [])];
                            cur[idx] = e.target.value;
                            setNewRegionalData({ ...newRegionalData, shotList: cur });
                          }}
                          className="flex-1 text-[11px] text-emerald-950 font-medium bg-transparent border-none focus:outline-hidden"
                          placeholder="Panduan pengambilan foto atau video..."
                        />
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="p-1 text-emerald-500 hover:text-emerald-700" title="Bisa langsung diedit">
                            <Pencil className="w-3.5 h-3.5" />
                          </span>
                          {(newRegionalData.shotList || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const cur = (newRegionalData.shotList || []).filter((_, i) => i !== idx);
                                setNewRegionalData({ ...newRegionalData, shotList: cur });
                              }}
                              className="p-1 text-slate-300 hover:text-rose-500 rounded cursor-pointer"
                              title="Hapus butir panduan"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] text-emerald-700 block">
                    💡 Sesuaikan dengan jenis kamera, fasilitas, atau personil yang tersedia di wilayah Anda.
                  </span>
                </div>

                {/* Guardrail Keselamatan K3, HSE & Nilai Perusahaan */}
                {newRegionalData.corporateSafetyGuardrails && newRegionalData.corporateSafetyGuardrails.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-950 text-xs space-y-2">
                    <div className="font-extrabold flex items-center gap-1.5 text-amber-900 text-[11px] uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      <span>Standar Keselamatan K3 & Etika Visual Korporat (Wajib Patuh):</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-amber-900">
                      {newRegionalData.corporateSafetyGuardrails.map((gd, gIdx) => (
                        <div key={gIdx} className="p-2 rounded-xl bg-white/80 border border-amber-200/60 leading-snug">
                          {gd}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ==============================================================
                    REKOMENDASI 3 FORMAT KONTEN SEKALIGUS (FEED, STORY, REELS)
                ============================================================== */}
                <div className="border border-slate-200 rounded-2xl p-3.5 bg-slate-50/70 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                        Rekomendasi 3 Format Konten (Dapat Diedit Penuh)
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                      Pilih Tab & Sesuaikan Kontennya
                    </span>
                  </div>

                  {/* Tab Selector Buttons */}
                  <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setActiveSocialFormatTab('FEED')}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        activeSocialFormatTab === 'FEED'
                          ? 'bg-white text-indigo-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>🖼️ Feed (Carousel)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveSocialFormatTab('STORY')}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        activeSocialFormatTab === 'STORY'
                          ? 'bg-white text-rose-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>📲 Story (9:16)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveSocialFormatTab('REELS')}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        activeSocialFormatTab === 'REELS'
                          ? 'bg-white text-violet-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Film className="w-3.5 h-3.5" />
                      <span>🎬 Reels (9:16)</span>
                    </button>
                  </div>

                  {/* TAB 1: FEED CAROUSEL (FULLY EDITABLE) */}
                  {activeSocialFormatTab === 'FEED' && (
                    <div className="space-y-2.5">
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <Pencil className="w-3 h-3 text-indigo-600" />
                            Headline Slide 1 (Hook Cover Feed) — Dapat Diedit:
                          </span>
                          <span className="text-[9.5px] text-indigo-600 font-semibold flex items-center gap-0.5">
                            <Pencil className="w-2.5 h-2.5" /> Edit
                          </span>
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            value={newRegionalData.feedPackage?.hookHeadline || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setNewRegionalData(prev => ({
                                ...prev,
                                feedPackage: {
                                  ...(prev.feedPackage || { carouselSlides: [], captionDraft: '' }),
                                  hookHeadline: val
                                }
                              }));
                            }}
                            className="w-full p-2 pr-8 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:border-indigo-600 bg-white"
                            placeholder="Headline slide cover..."
                          />
                          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-500">
                            <Pencil className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>

                      {/* Carousel Slides List Editable */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <Pencil className="w-3 h-3 text-indigo-600" />
                            Rencana Alur Slide Carousel (Bebas Edit / Tambah):
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const cur = [...(newRegionalData.feedPackage?.carouselSlides || [])];
                              cur.push(`Slide ${cur.length + 1}: Materi pendukung tambahan di lapangan...`);
                              setNewRegionalData(prev => ({
                                ...prev,
                                feedPackage: {
                                  ...(prev.feedPackage || { hookHeadline: '', captionDraft: '' }),
                                  carouselSlides: cur
                                }
                              }));
                            }}
                            className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer bg-white px-2 py-0.5 rounded-lg border border-slate-200"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Tambah Slide</span>
                          </button>
                        </div>
                        <div className="space-y-1.5">
                          {(newRegionalData.feedPackage?.carouselSlides || []).map((slide, sIdx) => (
                            <div key={sIdx} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors shadow-2xs group">
                              <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 font-black text-[10px] flex items-center justify-center shrink-0">
                                {sIdx + 1}
                              </span>
                              <input
                                type="text"
                                value={slide}
                                onChange={(e) => {
                                  const cur = [...(newRegionalData.feedPackage?.carouselSlides || [])];
                                  cur[sIdx] = e.target.value;
                                  setNewRegionalData(prev => ({
                                    ...prev,
                                    feedPackage: {
                                      ...(prev.feedPackage || { hookHeadline: '', captionDraft: '' }),
                                      carouselSlides: cur
                                    }
                                  }));
                                }}
                                className="flex-1 text-[11px] text-slate-800 font-medium bg-transparent border-none focus:outline-hidden"
                                placeholder={`Isi konten slide ${sIdx + 1}...`}
                              />
                              <div className="flex items-center gap-1 shrink-0">
                                <span className="p-1 rounded text-indigo-500 group-hover:text-indigo-700" title="Bisa langsung diedit">
                                  <Pencil className="w-3.5 h-3.5" />
                                </span>
                                {(newRegionalData.feedPackage?.carouselSlides || []).length > 2 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const cur = (newRegionalData.feedPackage?.carouselSlides || []).filter((_, i) => i !== sIdx);
                                      setNewRegionalData(prev => ({
                                        ...prev,
                                        feedPackage: {
                                          ...(prev.feedPackage || { hookHeadline: '', captionDraft: '' }),
                                          carouselSlides: cur
                                        }
                                      }));
                                    }}
                                    className="p-1 text-slate-300 hover:text-rose-500 rounded cursor-pointer"
                                    title="Hapus slide ini"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Draf Caption Feed Editable */}
                      <div className="p-3 rounded-2xl bg-white border border-slate-200 text-xs space-y-1.5 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1.5">
                            <Pencil className="w-3 h-3 text-indigo-600" />
                            Draf Caption Lengkap Feed Instagram (Dapat Diedit):
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(newRegionalData.feedPackage?.captionDraft || newRegionalData.captionDraft || '');
                              showToast('📋 Draf caption Feed berhasil disalin!');
                            }}
                            className="text-[10.5px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Salin Caption Feed</span>
                          </button>
                        </div>
                        <div className="relative">
                          <textarea
                            rows={4}
                            value={newRegionalData.feedPackage?.captionDraft || newRegionalData.captionDraft || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setNewRegionalData(prev => ({
                                ...prev,
                                captionDraft: val,
                                feedPackage: {
                                  ...(prev.feedPackage || { hookHeadline: '', carouselSlides: [] }),
                                  captionDraft: val
                                }
                              }));
                            }}
                            className="w-full text-[11px] text-slate-800 bg-slate-50 p-2.5 pr-8 rounded-xl border border-slate-200 whitespace-pre-line leading-relaxed font-sans focus:border-indigo-500 focus:bg-white"
                            placeholder="Ketik atau sesuaikan caption feed di sini..."
                          />
                          <div className="absolute right-2.5 top-2.5 pointer-events-none text-indigo-400">
                            <Pencil className="w-3.5 h-3.5 opacity-70" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: INSTAGRAM STORY (FULLY EDITABLE) */}
                  {activeSocialFormatTab === 'STORY' && (
                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white space-y-3 border border-slate-700 shadow-sm">
                      <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-[10px] font-black text-white">
                            IG
                          </div>
                          <div>
                            <span className="text-xs font-bold block leading-none">{newRegionalData.brandTarget || '@telprodico'}</span>
                            <span className="text-[9px] text-slate-300">Instagram Story Mockup (9:16 Vertikal)</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30">
                          Aktual 24 Jam
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs space-y-1.5 border border-white/10">
                        <div className="flex items-center justify-between">
                          <span className="text-[9.5px] font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Pencil className="w-3 h-3 text-amber-300" />
                            ⚡ Teks Hook & Overlay Story (Bebas Edit):
                          </span>
                          <span className="text-[9.5px] text-amber-300/80 font-semibold flex items-center gap-0.5">
                            <Pencil className="w-2.5 h-2.5" /> Edit
                          </span>
                        </div>
                        <div className="relative">
                          <textarea
                            rows={2}
                            value={newRegionalData.storyPackage?.textOverlay || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setNewRegionalData(prev => ({
                                ...prev,
                                storyPackage: {
                                  ...(prev.storyPackage || { interactiveStickers: [], visualPrompt: '' }),
                                  textOverlay: val
                                }
                              }));
                            }}
                            className="w-full text-xs font-bold text-white bg-black/30 p-2 pr-7 rounded-lg border border-white/20 leading-snug focus:border-rose-400"
                            placeholder="Ketik teks overlay story..."
                          />
                          <div className="absolute right-2.5 top-2.5 pointer-events-none text-amber-300/70">
                            <Pencil className="w-3 h-3" />
                          </div>
                        </div>
                      </div>

                      {/* Interactive stickers editable */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[9.5px] font-extrabold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Pencil className="w-3 h-3 text-indigo-300" />
                            📌 Rekomendasi Stiker Interaktif (Edit / Tambah):
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const cur = [...(newRegionalData.storyPackage?.interactiveStickers || [])];
                              cur.push('📍 ' + (newRegionalData.location || 'Lokasi Kegiatan'));
                              setNewRegionalData(prev => ({
                                ...prev,
                                storyPackage: {
                                  ...(prev.storyPackage || { textOverlay: '', visualPrompt: '' }),
                                  interactiveStickers: cur
                                }
                              }));
                            }}
                            className="text-[10px] font-bold text-rose-300 hover:text-white flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Tambah Stiker</span>
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(newRegionalData.storyPackage?.interactiveStickers || []).map((stk, stIdx) => (
                            <div key={stIdx} className="px-2 py-1 rounded-lg bg-white/15 text-white font-medium text-[10.5px] border border-white/10 flex items-center gap-1.5 group hover:border-white/30">
                              <input
                                type="text"
                                value={stk}
                                onChange={(e) => {
                                  const cur = [...(newRegionalData.storyPackage?.interactiveStickers || [])];
                                  cur[stIdx] = e.target.value;
                                  setNewRegionalData(prev => ({
                                    ...prev,
                                    storyPackage: {
                                      ...(prev.storyPackage || { textOverlay: '', visualPrompt: '' }),
                                      interactiveStickers: cur
                                    }
                                  }));
                                }}
                                className="bg-transparent border-none text-white text-[10.5px] focus:outline-hidden w-28"
                              />
                              <Pencil className="w-2.5 h-2.5 text-white/50 group-hover:text-white shrink-0" />
                              <button
                                type="button"
                                onClick={() => {
                                  const cur = (newRegionalData.storyPackage?.interactiveStickers || []).filter((_, i) => i !== stIdx);
                                  setNewRegionalData(prev => ({
                                    ...prev,
                                    storyPackage: {
                                      ...(prev.storyPackage || { textOverlay: '', visualPrompt: '' }),
                                      interactiveStickers: cur
                                    }
                                  }));
                                }}
                                className="text-slate-400 hover:text-rose-300 cursor-pointer font-bold"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-800/90 text-[10.5px] text-slate-300 border border-slate-700 space-y-1">
                        <div className="flex items-center justify-between">
                          <strong className="text-slate-200 flex items-center gap-1.5">
                            <Pencil className="w-3 h-3 text-slate-400" />
                            Arahan Visual Klip Story (Dapat Diedit):
                          </strong>
                          <span className="text-[9px] text-slate-400 flex items-center gap-0.5">
                            <Pencil className="w-2.5 h-2.5" /> Edit
                          </span>
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            value={newRegionalData.storyPackage?.visualPrompt || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setNewRegionalData(prev => ({
                                ...prev,
                                storyPackage: {
                                  ...(prev.storyPackage || { textOverlay: '', interactiveStickers: [] }),
                                  visualPrompt: val
                                }
                              }));
                            }}
                            className="w-full p-1.5 pr-7 rounded-lg bg-slate-900 border border-slate-600 text-white text-xs focus:border-rose-400"
                          />
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <Pencil className="w-3 h-3" />
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const text = `STORY TEXT OVERLAY:\n${newRegionalData.storyPackage?.textOverlay}\n\nSTIKER INTERAKTIF:\n${newRegionalData.storyPackage?.interactiveStickers.join('\n')}`;
                          navigator.clipboard.writeText(text);
                          showToast('📋 Naskah Story berhasil disalin!');
                        }}
                        className="w-full py-1.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-all"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Salin Naskah & Stiker Story</span>
                      </button>
                    </div>
                  )}

                  {/* TAB 3: INSTAGRAM REELS (FULLY EDITABLE) */}
                  {activeSocialFormatTab === 'REELS' && (
                    <div className="space-y-2.5">
                      {/* Stop scroll hook */}
                      <div className="p-2.5 rounded-xl bg-violet-50 border border-violet-200 text-violet-950 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold text-violet-700 uppercase tracking-wider flex items-center gap-1.5">
                            <Pencil className="w-3 h-3 text-violet-600" />
                            Hook 3 Detik Pertama (Stop-Scroll Penahan Penonton — Bebas Diedit):
                          </span>
                          <span className="text-[9.5px] font-bold text-violet-600 flex items-center gap-0.5">
                            <Pencil className="w-2.5 h-2.5" /> Edit
                          </span>
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            value={newRegionalData.reelsPackage?.threeSecHook || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setNewRegionalData(prev => ({
                                ...prev,
                                reelsPackage: {
                                  ...(prev.reelsPackage || { storyboard: [], recommendedAudioMood: '', captionDraft: '' }),
                                  threeSecHook: val
                                }
                              }));
                            }}
                            className="w-full p-2 pr-8 rounded-xl bg-white border border-violet-300 text-xs font-black text-violet-950 focus:border-violet-600"
                            placeholder="Hook pembuka 3 detik..."
                          />
                          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-violet-500">
                            <Pencil className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>

                      {/* Storyboard timeline editable */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <Pencil className="w-3 h-3 text-violet-600" />
                            Storyboard Adegan Video (Bebas Edit / Tambah Adegan):
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const cur = [...(newRegionalData.reelsPackage?.storyboard || [])];
                              cur.push({
                                timestamp: `00:${String(cur.length * 7).padStart(2, '0')} - 00:${String((cur.length + 1) * 7).padStart(2, '0')}`,
                                visual: 'Aksi lapangan baru...',
                                audioAction: 'Voiceover / musik pendukung...'
                              });
                              setNewRegionalData(prev => ({
                                ...prev,
                                reelsPackage: {
                                  ...(prev.reelsPackage || { threeSecHook: '', recommendedAudioMood: '', captionDraft: '' }),
                                  storyboard: cur
                                }
                              }));
                            }}
                            className="text-[10px] font-bold text-violet-600 hover:text-violet-800 flex items-center gap-1 cursor-pointer bg-white px-2 py-0.5 rounded-lg border border-slate-200"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Tambah Adegan</span>
                          </button>
                        </div>
                        <div className="space-y-1.5">
                          {(newRegionalData.reelsPackage?.storyboard || []).map((sc, scIdx) => (
                            <div key={scIdx} className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-violet-300 text-xs space-y-1.5 shadow-2xs group transition-colors">
                              <div className="flex items-center justify-between">
                                <span className="font-extrabold text-violet-600 text-[10.5px] flex items-center gap-1">
                                  ⏱️ {sc.timestamp}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="text-[9.5px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold flex items-center gap-1">
                                    <Pencil className="w-2.5 h-2.5 text-violet-500" />
                                    Adegan {scIdx + 1}
                                  </span>
                                  {(newRegionalData.reelsPackage?.storyboard || []).length > 2 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const cur = (newRegionalData.reelsPackage?.storyboard || []).filter((_, i) => i !== scIdx);
                                        setNewRegionalData(prev => ({
                                          ...prev,
                                          reelsPackage: {
                                            ...(prev.reelsPackage || { threeSecHook: '', recommendedAudioMood: '', captionDraft: '' }),
                                            storyboard: cur
                                          }
                                        }));
                                      }}
                                      className="text-slate-300 hover:text-rose-500 cursor-pointer"
                                      title="Hapus adegan"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[9px] font-bold text-slate-400 block mb-0.5 flex items-center gap-1">
                                    <Pencil className="w-2.5 h-2.5 text-slate-400" /> Visual Adegan:
                                  </label>
                                  <input
                                    type="text"
                                    value={sc.visual}
                                    onChange={(e) => {
                                      const cur = [...(newRegionalData.reelsPackage?.storyboard || [])];
                                      cur[scIdx] = { ...cur[scIdx], visual: e.target.value };
                                      setNewRegionalData(prev => ({
                                        ...prev,
                                        reelsPackage: {
                                          ...(prev.reelsPackage || { threeSecHook: '', recommendedAudioMood: '', captionDraft: '' }),
                                          storyboard: cur
                                        }
                                      }));
                                    }}
                                    className="w-full p-1.5 rounded-lg border border-slate-200 text-[11px] text-slate-800 focus:border-violet-500"
                                  />
                                </div>
                                <div>
                                  <label className="text-[9px] font-bold text-slate-400 block mb-0.5 flex items-center gap-1">
                                    <Pencil className="w-2.5 h-2.5 text-slate-400" /> Audio / Voiceover:
                                  </label>
                                  <input
                                    type="text"
                                    value={sc.audioAction}
                                    onChange={(e) => {
                                      const cur = [...(newRegionalData.reelsPackage?.storyboard || [])];
                                      cur[scIdx] = { ...cur[scIdx], audioAction: e.target.value };
                                      setNewRegionalData(prev => ({
                                        ...prev,
                                        reelsPackage: {
                                          ...(prev.reelsPackage || { threeSecHook: '', recommendedAudioMood: '', captionDraft: '' }),
                                          storyboard: cur
                                        }
                                      }));
                                    }}
                                    className="w-full p-1.5 rounded-lg border border-slate-200 text-[11px] text-slate-800 focus:border-violet-500"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Audio recommendation editable */}
                      <div className="p-2 rounded-xl bg-white border border-slate-200 flex items-center gap-2 text-[11px] text-slate-700 shadow-2xs">
                        <Music className="w-4 h-4 text-violet-600 shrink-0" />
                        <div className="flex-1 flex items-center gap-2">
                          <strong className="text-slate-900 shrink-0 flex items-center gap-1">
                            <Pencil className="w-3 h-3 text-violet-500" />
                            Vibe Audio:
                          </strong>
                          <input
                            type="text"
                            value={newRegionalData.reelsPackage?.recommendedAudioMood || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setNewRegionalData(prev => ({
                                ...prev,
                                reelsPackage: {
                                  ...(prev.reelsPackage || { threeSecHook: '', storyboard: [], captionDraft: '' }),
                                  recommendedAudioMood: val
                                }
                              }));
                            }}
                            className="flex-1 p-1 rounded-lg border border-slate-200 text-[11px] bg-slate-50 focus:border-violet-500"
                          />
                        </div>
                      </div>

                      {/* Reels caption editable */}
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold uppercase text-slate-500 flex items-center gap-1.5">
                            <Pencil className="w-3 h-3 text-violet-600" />
                            Caption Khusus Reels (Dapat Diedit):
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(newRegionalData.reelsPackage?.captionDraft || '');
                              showToast('📋 Caption Reels berhasil disalin!');
                            }}
                            className="text-[10.5px] font-bold text-violet-600 hover:text-violet-800 flex items-center gap-1 cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Salin Caption Reels</span>
                          </button>
                        </div>
                        <div className="relative">
                          <textarea
                            rows={3}
                            value={newRegionalData.reelsPackage?.captionDraft || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setNewRegionalData(prev => ({
                                ...prev,
                                reelsPackage: {
                                  ...(prev.reelsPackage || { threeSecHook: '', storyboard: [], recommendedAudioMood: '' }),
                                  captionDraft: val
                                }
                              }));
                            }}
                            className="w-full text-[11px] text-slate-800 bg-slate-50 p-2 pr-8 rounded-lg border border-slate-200 whitespace-pre-line leading-relaxed font-sans focus:border-violet-500 focus:bg-white"
                            placeholder="Sesuaikan caption reels..."
                          />
                          <div className="absolute right-2.5 top-2.5 pointer-events-none text-violet-400">
                            <Pencil className="w-3.5 h-3.5 opacity-70" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Data Pelengkap Lapangan (Wajib untuk Kirim) */}
                <div className="space-y-2.5 pt-2 border-t border-slate-100">
                  <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-700 block">
                    Lengkapi Data Pengajuan Wilayah:
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                        Nama Lengkap PIC Lapangan <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Budi Santoso (Teknisi Wilayah)"
                        value={newRegionalData.picRegional || ''}
                        onChange={(e) => setNewRegionalData({ ...newRegionalData, picRegional: e.target.value })}
                        className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white font-medium focus:border-emerald-500"
                      />
                      <span className="text-[9.5px] text-slate-400 block mt-0.5">Wajib diisi nama personil penanggung jawab</span>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                        Lokasi Detail Kegiatan <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={newRegionalData.location || ''}
                        onChange={(e) => setNewRegionalData({ ...newRegionalData, location: e.target.value })}
                        placeholder="Contoh: Kawasan Industri Batam / Hub Witel"
                        className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white font-medium focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                        Tanggal Pelaksanaan <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={newRegionalData.activityDate || ''}
                        onChange={(e) => setNewRegionalData({ ...newRegionalData, activityDate: e.target.value })}
                        className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                        Target Publikasi Diminta <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={newRegionalData.requestedPublishDate || ''}
                        onChange={(e) => setNewRegionalData({ ...newRegionalData, requestedPublishDate: e.target.value })}
                        className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                      Link Foto / Video / Google Drive <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: https://drive.google.com/drive/folders/dokumentasi-kegiatan..."
                      value={newRegionalData.supportingDocumentName || ''}
                      onChange={(e) => setNewRegionalData({ ...newRegionalData, supportingDocumentName: e.target.value })}
                      className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white font-medium focus:border-emerald-500"
                    />
                    <span className="text-[9.5px] text-slate-400 block mt-0.5">Sertakan link Google Drive atau folder foto/video sesuai panduan shot list di atas</span>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRegionalCreationStep('AI_TREND_SELECT')}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                    >
                      ← Ubah Tren
                    </button>

                    {generatedFieldDraft && (
                      <button
                        type="button"
                        onClick={() => {
                          setNewRegionalData(prev => ({
                            ...prev,
                            topic: generatedFieldDraft.topic,
                            shotList: generatedFieldDraft.shotList ? [...generatedFieldDraft.shotList] : [],
                            feedPackage: generatedFieldDraft.feedPackage ? {
                              ...generatedFieldDraft.feedPackage,
                              carouselSlides: [...generatedFieldDraft.feedPackage.carouselSlides]
                            } : undefined,
                            storyPackage: generatedFieldDraft.storyPackage ? {
                              ...generatedFieldDraft.storyPackage,
                              interactiveStickers: [...generatedFieldDraft.storyPackage.interactiveStickers]
                            } : undefined,
                            reelsPackage: generatedFieldDraft.reelsPackage ? {
                              ...generatedFieldDraft.reelsPackage,
                              storyboard: generatedFieldDraft.reelsPackage.storyboard.map(s => ({ ...s }))
                            } : undefined,
                            captionDraft: generatedFieldDraft.captionDraft
                          }));
                          showToast('🔄 Draf berhasil dikembalikan ke rekomendasi awal AI!');
                        }}
                        className="px-2.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                        title="Kembalikan semua teks & naskah ke draf rekomendasi awal AI"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                        <span>Reset ke Ide AI</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleCreateRegionalSubmission(e, true)}
                      className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold cursor-pointer"
                    >
                      Simpan Draf Regional
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleCreateRegionalSubmission(e, false)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer shadow-sm flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Ajukan ke Marcomm</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------
                JALUR 2: INPUT FORMULIR MANDIRI (MANUAL FORM)
            ------------------------------------------------------------- */}
            {regionalCreationStep === 'MANUAL_FORM' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRegionalCreationStep('SELECT_MODE')}
                      className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 cursor-pointer flex items-center gap-1.5 text-xs font-semibold border border-slate-200 transition-colors"
                      title="Ganti metode pembuatan"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Ganti Metode</span>
                    </button>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                        <Inbox className="w-5 h-5 text-emerald-600" />
                        Metode 2: Formulir Pengajuan Mandiri
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        {isRegionalUser
                          ? `Usulan resmi kegiatan ${userRegion} untuk dikurasi menjadi konten kampanye nasional`
                          : 'Usulkan kegiatan wilayah untuk dikurasi oleh Marcomm'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsNewRegionalModalOpen(false)}
                    className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Banner Beralih ke Bantuan AI */}
                <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-indigo-900">
                    <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Mau inspirasi ide konten dan panduan shot list foto otomatis?</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRegionalCreationStep('AI_TREND_SELECT')}
                    className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold cursor-pointer shrink-0"
                  >
                    Beralih ke Bantuan AI →
                  </button>
                </div>

                <form className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                        Unit Regional <span className="text-rose-500 font-bold ml-0.5">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        readOnly={isRegionalUser}
                        value={newRegionalData.regional || userRegion}
                        onChange={(e) => setNewRegionalData({ ...newRegionalData, regional: e.target.value })}
                        className={`w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold ${
                          isRegionalUser ? 'bg-slate-100 text-slate-700 cursor-not-allowed' : 'bg-white'
                        }`}
                      />
                      {isRegionalUser && (
                        <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">🔒 Terkunci sesuai akun regional</span>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                        Nama PIC Lapangan <span className="text-rose-500 font-bold ml-0.5">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Budi Santoso (Staf Operasional)"
                        value={newRegionalData.picRegional || ''}
                        onChange={(e) => setNewRegionalData({ ...newRegionalData, picRegional: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white font-medium focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                      <span className="text-[10px] text-slate-400 block mt-0.5">Wajib diisi nama personil penanggung jawab</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                        Sifat / Urgensi Konten <span className="text-rose-500 font-bold ml-0.5">*</span>
                      </label>
                      <select
                        value={newRegionalData.submissionTrack || 'MONTHLY_AGENDA'}
                        onChange={(e) => setNewRegionalData({ ...newRegionalData, submissionTrack: e.target.value as any })}
                        className="w-full p-2 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:border-emerald-500"
                      >
                        <option value="MONTHLY_AGENDA">🗓️ Rutin / Fleksibel (Bisa kapan saja)</option>
                        <option value="FAST_TRACK_URGENT">⚡ Aktual / Butuh Cepat (Liputan momen terbaru)</option>
                        <option value="COMMERCIAL_PROMO">🏷️ Promo Komersial / Penawaran B2B (Target Leads)</option>
                      </select>
                      <span className="text-[9px] text-slate-400 block mt-0.5">
                        *Jadwal tayang resmi ditentukan Marcomm Pusat setelah materi disetujui.
                      </span>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                        Target Akun Medsos <span className="text-rose-500 font-bold ml-0.5">*</span>
                      </label>
                      <select
                        value={newRegionalData.brandTarget || '@telprodico'}
                        onChange={(e) => setNewRegionalData({ ...newRegionalData, brandTarget: e.target.value as any })}
                        className="w-full p-2 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:border-emerald-500"
                      >
                        <option value="@telprodico">🏢 @telprodico (Digital, IT & Solusi Bisnis)</option>
                        <option value="@telkomproperty">🏗️ @telkomproperty (Gedung, Properti & Fasilitas)</option>
                        <option value="MARCOMM_CHOICE">🤝 Belum Tahu (Biar Tim Marcomm yang Menentukan)</option>
                      </select>
                    </div>

                    {/* Aset Properti Wilayah Terkait */}
                    <div className="col-span-2 pt-1 border-t border-slate-200/80">
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                        🏢 Target Aset Properti / Layanan Wilayah (Opsional untuk B2B Promo):
                      </label>
                      <select
                        value={newRegionalData.targetPropertyAsset || ''}
                        onChange={(e) => setNewRegionalData({ ...newRegionalData, targetPropertyAsset: e.target.value })}
                        className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white focus:border-emerald-500 font-medium"
                      >
                        <option value="">-- Pilih Aset Wilayah (Jika Terkait Penawaran Komersial) --</option>
                        <option value="Telkom Landmark Tower (TLT) Jakarta">Telkom Landmark Tower (TLT) Jakarta</option>
                        <option value="Sentul Integrated Data Center">Sentul Integrated Data Center</option>
                        <option value="Layanan Facility Management (FM) Terintegrasi">Layanan Facility Management (FM) Terintegrasi</option>
                        <option value="Solusi Green Building & Efisiensi Energi MEP">Solusi Green Building &amp; Efisiensi Energi MEP</option>
                        <option value="Kawasan Perkantoran Graha Merah Putih">Kawasan Perkantoran Graha Merah Putih</option>
                        <option value="Coworking & Flexible Workspace Regional">Coworking &amp; Flexible Workspace Regional</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                      Topik / Usulan Konten <span className="text-rose-500 font-bold ml-0.5">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newRegionalData.topic || ''}
                      onChange={(e) => setNewRegionalData({ ...newRegionalData, topic: e.target.value })}
                      placeholder="Contoh: Modernisasi Jaringan Fiber Kawasan Wisata Bahari..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                        Kegiatan Lapangan <span className="text-rose-500 font-bold ml-0.5">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={newRegionalData.activity || ''}
                        onChange={(e) => setNewRegionalData({ ...newRegionalData, activity: e.target.value })}
                        placeholder="Contoh: Peresmian ODP Baru & Edukasi Klien"
                        className="w-full p-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                        Lokasi Detail <span className="text-rose-500 font-bold ml-0.5">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={newRegionalData.location || ''}
                        onChange={(e) => setNewRegionalData({ ...newRegionalData, location: e.target.value })}
                        placeholder="Contoh: Kawasan Industri Batam / Witel Medan"
                        className="w-full p-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                        Target Audiens <span className="text-rose-500 font-bold ml-0.5">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={newRegionalData.targetAudience || ''}
                        onChange={(e) => setNewRegionalData({ ...newRegionalData, targetAudience: e.target.value })}
                        placeholder="Contoh: Pelaku Industri, BUMN, UMKM, Tenant"
                        className="w-full p-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                        Pilar Konten Rekomendasi <span className="text-rose-500 font-bold ml-0.5">*</span>
                      </label>
                      <select
                        value={newRegionalData.contentPillarSuggestion}
                        onChange={(e) => setNewRegionalData({ ...newRegionalData, contentPillarSuggestion: e.target.value })}
                        className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white font-medium focus:border-emerald-500"
                      >
                        {masterTaxonomy.contentPillars.map((p, idx) => (
                          <option key={idx} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                        Tanggal Pelaksanaan Kegiatan <span className="text-rose-500 font-bold ml-0.5">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={newRegionalData.activityDate || ''}
                        onChange={(e) => setNewRegionalData({ ...newRegionalData, activityDate: e.target.value })}
                        className="w-full p-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                        Target Publikasi Diminta <span className="text-rose-500 font-bold ml-0.5">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={newRegionalData.requestedPublishDate || ''}
                        onChange={(e) => setNewRegionalData({ ...newRegionalData, requestedPublishDate: e.target.value })}
                        className="w-full p-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                      Link Foto / Video / Berkas Berita Acara <span className="text-rose-500 font-bold ml-0.5">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newRegionalData.supportingDocumentName || ''}
                      onChange={(e) => setNewRegionalData({ ...newRegionalData, supportingDocumentName: e.target.value })}
                      placeholder="Contoh: Link Google Drive dokumentasi foto/video atau file Berita_Acara.pdf"
                      className="w-full p-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-500"
                    />
                    <span className="text-[10px] text-slate-400 block mt-0.5">Wajib sertakan tautan Google Drive dokumentasi atau file berita acara kegiatan</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>Semua kolom bertanda <strong className="text-rose-500">*</strong> wajib diisi lengkap.</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsNewRegionalModalOpen(false)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
                    >
                      Batal
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleCreateRegionalSubmission(e, true)}
                        className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold cursor-pointer"
                      >
                        Simpan Draf Regional
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleCreateRegionalSubmission(e, false)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer shadow-sm flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Kirim ke Marcomm</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: LIHAT FORMAT REKOMENDASI AI & SHOT LIST
      ========================================================================= */}
      {selectedSubmissionForViewAi && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10.5px] font-bold border border-indigo-200 inline-flex items-center gap-1 mb-1">
                  <Sparkles className="w-3 h-3 text-indigo-600" />
                  Format Rekomendasi AI — {selectedSubmissionForViewAi.regional}
                </span>
                <h3 className="font-extrabold text-slate-900 text-base">
                  {selectedSubmissionForViewAi.topic}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSubmissionForViewAi(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Target Brand & Format Banner */}
              <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white font-bold text-[10.5px]">
                    Target: {selectedSubmissionForViewAi.brandTarget || '@telprodico'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white border border-indigo-200 text-indigo-900 font-bold text-[10.5px]">
                    {selectedSubmissionForViewAi.submissionTrack === 'FAST_TRACK_URGENT' ? '⚡ Konten Cepat' : '🗓️ Konten Terjadwal'}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-indigo-900 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  Paket Lengkap 3 Format (Story + Feed + Reels)
                </span>
              </div>

              {/* Badge Keselarasan Marcomm */}
              {selectedSubmissionForViewAi.marcommAlignmentNote && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 text-xs flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-[11px] leading-snug">{selectedSubmissionForViewAi.marcommAlignmentNote}</span>
                </div>
              )}

              {/* Alasan Tren & Sudut Pandang */}
              {selectedSubmissionForViewAi.trendAngle && (
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                    <span>Sudut Pandang Tren & Mengapa Relevan:</span>
                  </div>
                  <p className="text-[11.5px] leading-relaxed text-amber-900">
                    {selectedSubmissionForViewAi.trendAngle}
                  </p>
                </div>
              )}

              {/* Panduan Shot List Lapangan */}
              {selectedSubmissionForViewAi.shotList && selectedSubmissionForViewAi.shotList.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <div className="font-extrabold text-emerald-900 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <Camera className="w-4 h-4 text-emerald-600" />
                    <span>Panduan Shot List Foto & Video Lapangan:</span>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-emerald-900">
                    {selectedSubmissionForViewAi.shotList.map((shot, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-white/70 p-2 rounded-xl border border-emerald-100">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{shot}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Guardrail Keselamatan K3 & Nilai Perusahaan */}
              {selectedSubmissionForViewAi.corporateSafetyGuardrails && selectedSubmissionForViewAi.corporateSafetyGuardrails.length > 0 && (
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-950 space-y-1.5">
                  <div className="font-extrabold text-amber-900 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Standar Keselamatan K3 & Etika Korporat (Wajib Patuh):</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[10.5px] text-amber-900">
                    {selectedSubmissionForViewAi.corporateSafetyGuardrails.map((gd, gIdx) => (
                      <div key={gIdx} className="p-1.5 rounded-lg bg-white/80 border border-amber-200/50 leading-snug">
                        {gd}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3 FORMAT MEDIA SOSIAL LENGKAP */}
              <div className="border border-slate-200 rounded-2xl p-3 bg-slate-50 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-slate-700 tracking-wider flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    Format Konten Siap Pakai:
                  </span>
                </div>

                {/* Tab buttons */}
                <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setActiveSocialFormatTab('FEED')}
                    className={`flex-1 py-1 px-2 rounded-lg text-[10.5px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      activeSocialFormatTab === 'FEED'
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>🖼️ Feed</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSocialFormatTab('STORY')}
                    className={`flex-1 py-1 px-2 rounded-lg text-[10.5px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      activeSocialFormatTab === 'STORY'
                        ? 'bg-white text-rose-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>📲 Story</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSocialFormatTab('REELS')}
                    className={`flex-1 py-1 px-2 rounded-lg text-[10.5px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      activeSocialFormatTab === 'REELS'
                        ? 'bg-white text-violet-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>🎬 Reels</span>
                  </button>
                </div>

                {/* TAB FEED */}
                {activeSocialFormatTab === 'FEED' && (
                  <div className="space-y-2">
                    <div className="p-2 rounded-xl bg-white border border-slate-200">
                      <span className="text-[9px] font-bold uppercase text-slate-400 block">Headline Slide 1 (Hook Cover):</span>
                      <p className="font-bold text-slate-900 text-xs">
                        {selectedSubmissionForViewAi.feedPackage?.hookHeadline || selectedSubmissionForViewAi.topic}
                      </p>
                    </div>

                    {selectedSubmissionForViewAi.feedPackage?.carouselSlides && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {selectedSubmissionForViewAi.feedPackage.carouselSlides.map((slide, sIdx) => (
                          <div key={sIdx} className="p-1.5 rounded-lg bg-white border border-slate-200 text-[10.5px] text-slate-700 leading-snug flex items-start gap-1.5">
                            <span className="w-3.5 h-3.5 rounded-full bg-indigo-50 text-indigo-600 font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                              {sIdx + 1}
                            </span>
                            <span>{slide}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9.5px] font-bold uppercase text-slate-500">Caption Feed:</span>
                        <button
                          type="button"
                          onClick={() => {
                            const cap = selectedSubmissionForViewAi.feedPackage?.captionDraft || selectedSubmissionForViewAi.captionDraft || '';
                            navigator.clipboard.writeText(cap);
                            showToast('📋 Caption Feed berhasil disalin!');
                          }}
                          className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Salin Caption</span>
                        </button>
                      </div>
                      <p className="text-[10.5px] text-slate-700 bg-slate-50 p-2 rounded-lg whitespace-pre-line leading-relaxed max-h-20 overflow-y-auto">
                        {selectedSubmissionForViewAi.feedPackage?.captionDraft || selectedSubmissionForViewAi.captionDraft}
                      </p>
                    </div>
                  </div>
                )}

                {/* TAB STORY */}
                {activeSocialFormatTab === 'STORY' && (
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white space-y-2 border border-slate-800">
                    <div className="p-2 rounded-xl bg-white/10 space-y-0.5">
                      <span className="text-[9px] font-bold text-amber-300 uppercase block">Teks Overlay Story:</span>
                      <p className="text-[11px] font-bold text-white">
                        {selectedSubmissionForViewAi.storyPackage?.textOverlay || selectedSubmissionForViewAi.topic}
                      </p>
                    </div>
                    {selectedSubmissionForViewAi.storyPackage?.interactiveStickers && (
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-indigo-300 uppercase block">Stiker Interaktif:</span>
                        <div className="flex flex-wrap gap-1">
                          {selectedSubmissionForViewAi.storyPackage.interactiveStickers.map((stk, stIdx) => (
                            <span key={stIdx} className="px-1.5 py-0.5 rounded bg-white/15 text-[10px] text-white">
                              {stk}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        const txt = `STORY OVERLAY:\n${selectedSubmissionForViewAi.storyPackage?.textOverlay || selectedSubmissionForViewAi.topic}`;
                        navigator.clipboard.writeText(txt);
                        showToast('📋 Teks Story berhasil disalin!');
                      }}
                      className="w-full py-1 px-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[10.5px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Salin Naskah Story</span>
                    </button>
                  </div>
                )}

                {/* TAB REELS */}
                {activeSocialFormatTab === 'REELS' && (
                  <div className="space-y-2">
                    <div className="p-2 rounded-xl bg-violet-50 border border-violet-200 text-violet-950">
                      <span className="text-[9px] font-extrabold text-violet-700 uppercase block mb-0.5">Hook 3 Detik:</span>
                      <p className="text-[11px] font-bold text-violet-900">
                        "{selectedSubmissionForViewAi.reelsPackage?.threeSecHook || selectedSubmissionForViewAi.topic}"
                      </p>
                    </div>
                    {selectedSubmissionForViewAi.reelsPackage?.storyboard && (
                      <div className="space-y-1">
                        {selectedSubmissionForViewAi.reelsPackage.storyboard.map((sc, scIdx) => (
                          <div key={scIdx} className="p-1.5 rounded-lg bg-white border border-slate-200 text-[10.5px] space-y-0.5">
                            <span className="font-bold text-violet-600 text-[9.5px]">⏱️ {sc.timestamp}</span>
                            <p className="text-slate-700"><strong>Visual:</strong> {sc.visual}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 flex items-center gap-2 text-[10.5px] text-slate-700">
                      <Music className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                      <span><strong>Audio:</strong> {selectedSubmissionForViewAi.reelsPackage?.recommendedAudioMood || 'Modern corporate upbeat'}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Detail Dokumen Lapangan */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500">Berkas / Dokumentasi Lapangan:</span>
                <p className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-slate-500" />
                  {selectedSubmissionForViewAi.supportingDocumentName || 'Dokumentasi_Kegiatan.pdf'}
                </p>
                <p className="text-[10px] text-slate-500">
                  PIC Regional: <strong>{selectedSubmissionForViewAi.picRegional}</strong> • Lokasi: <strong>{selectedSubmissionForViewAi.location}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedSubmissionForViewAi(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
              >
                Tutup Panduan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: TAMBAH RENCANA KONTEN BARU (4 SEKSI)
      ========================================================================= */}
      {isNewItemModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Plus className="w-5 h-5 text-rose-600" />
                  Tambah Rencana Konten Baru
                </h3>
                <p className="text-[11px] text-slate-500">Mencakup 4 Seksi: Strategy, Content, Execution, Readiness</p>
              </div>
              <button
                onClick={() => setIsNewItemModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewItem} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Topik / Ide Konten</label>
                <input
                  type="text"
                  required
                  value={newItemData.topicIdea}
                  onChange={(e) => setNewItemData({ ...newItemData, topicIdea: e.target.value })}
                  placeholder="Contoh: Solusi Managed Tower SLA 99.98% untuk Sektor Finansial"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Pilar Konten (Section A)</label>
                  <select
                    value={newItemData.contentPillar}
                    onChange={(e) => setNewItemData({ ...newItemData, contentPillar: e.target.value as any })}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                  >
                    {masterTaxonomy.contentPillars.map((p, idx) => (
                      <option key={idx} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Objektif Utama (Section A)</label>
                  <select
                    value={newItemData.primaryObjective}
                    onChange={(e) => setNewItemData({ ...newItemData, primaryObjective: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                  >
                    {masterTaxonomy.primaryObjectives.map((o, idx) => (
                      <option key={idx} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Kanal Distribusi (Section B)</label>
                  <select
                    value={newItemData.channel}
                    onChange={(e) => setNewItemData({ ...newItemData, channel: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                  >
                    {masterTaxonomy.channels.map((c, idx) => (
                      <option key={idx} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Format Konten (Section B)</label>
                  <select
                    value={newItemData.contentFormat}
                    onChange={(e) => setNewItemData({ ...newItemData, contentFormat: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                  >
                    {masterTaxonomy.formats.map((f, idx) => (
                      <option key={idx} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Content Owner (Section C)</label>
                  <select
                    value={newItemData.contentOwner}
                    onChange={(e) => setNewItemData({ ...newItemData, contentOwner: e.target.value as any })}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                  >
                    <option value="Marcomm">Marcomm</option>
                    <option value="Regional">Regional</option>
                    <option value="Corcomm">Corcomm</option>
                    <option value="Joint">Joint</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Target Publish (Section C)</label>
                  <input
                    type="date"
                    required
                    value={newItemData.targetPublishDate}
                    onChange={(e) => setNewItemData({ ...newItemData, targetPublishDate: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Pesan Kunci / Key Message</label>
                <input
                  type="text"
                  value={newItemData.keyMessage}
                  onChange={(e) => setNewItemData({ ...newItemData, keyMessage: e.target.value })}
                  placeholder="Contoh: Keandalan fiber optic terdedikasi menurunkan downtime 95%"
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewItemModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer shadow-sm"
                >
                  Tambahkan ke Planner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: CATATAN REVISI REGIONAL SUBMISSION
      ========================================================================= */}
      {selectedSubmissionForReview && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">
                Catatan Revisi untuk {selectedSubmissionForReview.regional}
              </h3>
              <button
                onClick={() => setSelectedSubmissionForReview(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Topik: <strong>{selectedSubmissionForReview.topic}</strong>
            </p>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                Instruksi Revisi kepada PIC Regional:
              </label>
              <textarea
                rows={4}
                value={revisionNotesInput}
                onChange={(e) => setRevisionNotesInput(e.target.value)}
                placeholder="Contoh: Mohon lengkapi foto resolusi tinggi dan angka pencapaian MTTR kegiatan..."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:bg-white resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedSubmissionForReview(null)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  updateRegionalSubmissionStatus(selectedSubmissionForReview.id, 'REVISION REQUESTED', revisionNotesInput);
                  setSelectedSubmissionForReview(null);
                  showToast(`✏️ Catatan revisi dikirimkan ke ${selectedSubmissionForReview.picRegional}`);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer"
              >
                Kirim Revisi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 5: PERBAIKI / EDIT USULAN REGIONAL (REVISI & DRAF)
      ========================================================================= */}
      {editingRegionalSubmission && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-indigo-600" />
                  {editingRegionalSubmission.currentStatus === 'REVISION REQUESTED'
                    ? 'Perbaiki Usulan & Ajukan Ulang ke Marcomm'
                    : 'Edit Draf Usulan Kegiatan'}
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  ID: {editingRegionalSubmission.id} • Unit: {editingRegionalSubmission.regional}
                </span>
              </div>
              <button
                onClick={() => setEditingRegionalSubmission(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Revision Instructions Banner */}
            {editingRegionalSubmission.revisionNotes && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-rose-800">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Catatan Revisi dari Tim Marcomm:</span>
                </div>
                <p className="text-rose-700 pl-5 text-[11px] italic">
                  "{editingRegionalSubmission.revisionNotes}"
                </p>
              </div>
            )}

            <form onSubmit={handleUpdateRegionalSubmissionSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                    Sifat / Urgensi Konten <span className="text-rose-500 font-bold ml-0.5">*</span>
                  </label>
                  <select
                    value={editingRegionalSubmission.submissionTrack || 'MONTHLY_AGENDA'}
                    onChange={(e) => setEditingRegionalSubmission({ ...editingRegionalSubmission, submissionTrack: e.target.value as any })}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:border-emerald-500"
                  >
                    <option value="MONTHLY_AGENDA">🗓️ Rutin / Fleksibel (Bisa kapan saja)</option>
                    <option value="FAST_TRACK_URGENT">⚡ Aktual / Butuh Cepat (Liputan momen terbaru)</option>
                  </select>
                  <span className="text-[9px] text-slate-400 block mt-0.5">
                    *Jadwal tayang resmi ditentukan Marcomm Pusat setelah materi disetujui.
                  </span>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                    Target Akun Medsos <span className="text-rose-500 font-bold ml-0.5">*</span>
                  </label>
                  <select
                    value={editingRegionalSubmission.brandTarget || '@telprodico'}
                    onChange={(e) => setEditingRegionalSubmission({ ...editingRegionalSubmission, brandTarget: e.target.value as any })}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:border-emerald-500"
                  >
                    <option value="@telprodico">🏢 @telprodico (Digital, IT & Solusi Bisnis)</option>
                    <option value="@telkomproperty">🏗️ @telkomproperty (Gedung, Properti & Fasilitas)</option>
                    <option value="MARCOMM_CHOICE">🤝 Belum Tahu (Biar Tim Marcomm yang Menentukan)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                  Topik / Usulan Konten <span className="text-rose-500 font-bold ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingRegionalSubmission.topic}
                  onChange={(e) => setEditingRegionalSubmission({ ...editingRegionalSubmission, topic: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                    Kegiatan Lapangan <span className="text-rose-500 font-bold ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingRegionalSubmission.activity}
                    onChange={(e) => setEditingRegionalSubmission({ ...editingRegionalSubmission, activity: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                    Lokasi Detail <span className="text-rose-500 font-bold ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingRegionalSubmission.location}
                    onChange={(e) => setEditingRegionalSubmission({ ...editingRegionalSubmission, location: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                    Target Audiens <span className="text-rose-500 font-bold ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingRegionalSubmission.targetAudience || ''}
                    onChange={(e) => setEditingRegionalSubmission({ ...editingRegionalSubmission, targetAudience: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                    Rekomendasi Pilar <span className="text-rose-500 font-bold ml-0.5">*</span>
                  </label>
                  <select
                    value={editingRegionalSubmission.contentPillarSuggestion || ''}
                    onChange={(e) => setEditingRegionalSubmission({ ...editingRegionalSubmission, contentPillarSuggestion: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-white font-medium focus:border-emerald-500"
                  >
                    {masterTaxonomy.contentPillars.map((p, idx) => (
                      <option key={idx} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                    Tanggal Kegiatan <span className="text-rose-500 font-bold ml-0.5">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={editingRegionalSubmission.activityDate}
                    onChange={(e) => setEditingRegionalSubmission({ ...editingRegionalSubmission, activityDate: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                    Target Publikasi Diminta <span className="text-rose-500 font-bold ml-0.5">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={editingRegionalSubmission.requestedPublishDate || ''}
                    onChange={(e) => setEditingRegionalSubmission({ ...editingRegionalSubmission, requestedPublishDate: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                  Supporting Asset / Berkas Dokumentasi <span className="text-rose-500 font-bold ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingRegionalSubmission.supportingDocumentName || ''}
                  onChange={(e) => setEditingRegionalSubmission({ ...editingRegionalSubmission, supportingDocumentName: e.target.value })}
                  placeholder="Nama file foto / link Google Drive hasil perbaikan"
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-500"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">Wajib cantumkan bukti foto atau berita acara yang telah diperbaiki</span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Semua kolom bertanda <strong className="text-rose-500">*</strong> wajib diisi lengkap.</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingRegionalSubmission(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer shadow-sm flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Simpan Perbaikan & Ajukan Ulang</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
