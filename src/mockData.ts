import {
  Campaign,
  Trend,
  EventItem,
  Opportunity,
  ContentItem,
  ContentVersion,
  Evidence,
  Approval,
  BudgetItem,
  AuditEvent,
  LeadFeedback,
  PerformanceMetric,
  LearningItem,
  IntegrationConnection,
  UserProfile,
  Storyboard,
  VideoProject
} from './types';

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr-1',
    name: 'Nuroniah (Marcom Lead)',
    email: 'nuroniaz@gmail.com',
    role: 'ROLE_MARCOM_CREATOR',
    title: 'Senior Marcom Specialist',
    businessUnit: 'TELPRO Enterprise Solutions'
  },
  {
    id: 'usr-2',
    name: 'Ahmad Analyst',
    email: 'ahmad.qa@telpro.co.id',
    role: 'ROLE_ANALYST_QA',
    title: 'Fact Check & QA Analyst',
    businessUnit: 'TELPRO Intelligence & QA'
  },
  {
    id: 'usr-3',
    name: 'Budi Manager',
    email: 'budi.mgr@telpro.co.id',
    role: 'ROLE_MANAGER_MARKETING',
    title: 'Marketing Manager',
    businessUnit: 'TELPRO Marketing Ops'
  },
  {
    id: 'usr-4',
    name: 'Siti VP Marketing',
    email: 'siti.vp@telpro.co.id',
    role: 'ROLE_VP_MARKETING',
    title: 'VP Digital Marketing',
    businessUnit: 'TELPRO Directorate'
  },
  {
    id: 'usr-5',
    name: 'Deni VP Corsec',
    email: 'deni.corsec@telpro.co.id',
    role: 'ROLE_VP_CORSEC',
    title: 'VP Corporate Secretary',
    businessUnit: 'TELPRO Corsec & Legal'
  },
  {
    id: 'usr-6',
    name: 'Direktur Utama (Final Approver)',
    email: 'dirut@telpro.co.id',
    role: 'ROLE_FINAL_APPROVER',
    title: 'Plt. Direktur Utama',
    businessUnit: 'TELPRO Executive Board'
  },
  {
    id: 'usr-7',
    name: 'Publisher Digital',
    email: 'publisher@telpro.co.id',
    role: 'ROLE_PUBLISHER',
    title: 'Digital Publishing Specialist',
    businessUnit: 'TELPRO Media Center'
  },
  {
    id: 'usr-8',
    name: 'Komisaris / Board (Viewer)',
    email: 'board.viewer@telpro.co.id',
    role: 'ROLE_MANAGEMENT_VIEWER',
    title: 'Executive Management Viewer',
    businessUnit: 'TELPRO Oversight Board'
  },
  {
    id: 'usr-9',
    name: 'Admin Sistem',
    email: 'sysadmin@telpro.co.id',
    role: 'ROLE_SYSTEM_ADMIN',
    title: 'Lead System Administrator',
    businessUnit: 'TELPRO IT Infrastructure'
  }
];

export const INITIAL_INTEGRATIONS: IntegrationConnection[] = [
  {
    id: 'int-1',
    provider: 'Google Drive Asset Repository',
    capability: 'Asset Storage & Versioning',
    status: 'CONNECTED',
    lastSync: '2026-08-06T20:15:00Z',
    environment: 'production'
  },
  {
    id: 'int-2',
    provider: 'Meta Ads Manager (FB/IG)',
    capability: 'Paid Media & Audience Targeting',
    status: 'CONNECTED',
    lastSync: '2026-08-06T21:00:00Z',
    environment: 'production'
  },
  {
    id: 'int-3',
    provider: 'Google Ads & Keyword Planner',
    capability: 'Search Volume & Keyword Bidding',
    status: 'CONNECTED',
    lastSync: '2026-08-06T19:45:00Z',
    environment: 'production'
  },
  {
    id: 'int-4',
    provider: 'LinkedIn Marketing API',
    capability: 'B2B Lead Gen & Content Publishing',
    status: 'CONNECTED',
    lastSync: '2026-08-06T18:30:00Z',
    environment: 'production'
  },
  {
    id: 'int-5',
    provider: 'WhatsApp Business API',
    capability: 'Direct Chat Initiated & Contact Tracking',
    status: 'SIMULATED',
    lastSync: '2026-08-06T21:10:00Z',
    environment: 'staging'
  }
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'cmp-2026-01',
    name: 'TELPRO Smart Logistics & Supply Chain 2026',
    periodStart: '2026-08-01',
    periodEnd: '2026-09-30',
    businessObjective: 'Meningkatkan penyerapan solusi Smart Warehouse & IoT Fleet TELPRO di sektor manufaktur & ritel sebesar 25%',
    marketingObjective: 'Menghasilkan 150 B2B Marketing Qualified Leads (MQL) dan 450 WhatsApp Click Inquiries',
    communicationObjective: 'Mengedukasi C-Level tentang efisiensi operasional hingga 35% dengan teknologi terintegrasi TELPRO',
    audience: 'CFO, COO, VP Logistics, Supply Chain Manager Perusahaan Mid-to-Large',
    status: 'Active',
    budgetAllocated: 150000000,
    budgetSpent: 42500000,
    owner: 'Nuroniah (Marcom Lead)',
    priorityProduct: 'TELPRO Smart Warehouse IoT & Fleet Management',
    keyMessage: 'Kendali Presisi Logistik Real-Time dengan Infrastruktur Andal TELPRO',
    funnelStage: 'Consideration'
  },
  {
    id: 'cmp-2026-02',
    name: 'IndiHome Business Digital Acceleration Q3',
    periodStart: '2026-07-15',
    periodEnd: '2026-09-15',
    businessObjective: 'Akuisisi 1.200 pelanggan baru segmen UMKM & Commercial Space',
    marketingObjective: 'Mencapai 85.000 Landing Page Views dan 3.200 WA Click Conversions',
    communicationObjective: 'Membangun trust konektivitas 99.9% SLA khusus bisnis',
    audience: 'Pemilik UMKM, Cafe/Restaurant Owner, Manager Ritel & Workspace',
    status: 'Active',
    budgetAllocated: 95000000,
    budgetSpent: 31000000,
    owner: 'Budi Manager',
    priorityProduct: 'IndiHome Business Dedicated 100Mbps - 1Gbps',
    keyMessage: 'Koneksi Stabil, Bisnis Tanpa Hambatan bersama TELPRO',
    funnelStage: 'Acquisition'
  },
  {
    id: 'cmp-2026-03',
    name: 'TELPRO Managed Fiber & Cloud Edge 2026',
    periodStart: '2026-09-01',
    periodEnd: '2026-11-30',
    businessObjective: 'Penetrasi pasar Data Center & Cloud Interconnect B2B Telco',
    marketingObjective: 'Meningkatkan Brand Awareness B2B Tech Leader sebesar 40%',
    communicationObjective: 'Menunjukkan keunggulan latency <5ms dan compliance keamanan ISO 27001',
    audience: 'CTO, Head of IT Infrastructure, Banking & Fintech Security Lead',
    status: 'Planned',
    budgetAllocated: 200000000,
    budgetSpent: 0,
    owner: 'Nuroniah (Marcom Lead)',
    priorityProduct: 'TELPRO Cloud Edge & Dark Fiber Solution',
    keyMessage: 'Konektivitas Ultra-Low Latency & Keamanan Tingkat Tinggi',
    funnelStage: 'Awareness'
  }
];

export const INITIAL_TRENDS: Trend[] = [
  {
    id: 'trd-1',
    type: 'Topic',
    title: 'Automated Warehouse & Green Supply Chain Indonesia 2026',
    platform: 'LinkedIn & Industry Reports',
    region: 'Indonesia',
    source: 'Kementerian Perhubungan & Asosiasi Logistik Indonesia (ALI)',
    sourceUrl: 'https://ali.or.id/reports/2026-green-logistics',
    capturedAt: '2026-08-05T08:00:00Z',
    confidence: 94,
    verificationStatus: 'Verified',
    momentum: 'Rising',
    lifecycle: 'Rising',
    relevanceScore: 92,
    brandFitScore: 95,
    riskLevel: 'Low',
    publishingWindow: '7 - 14 Agustus 2026',
    expirationDate: '2026-08-30'
  },
  {
    id: 'trd-2',
    type: 'Keyword',
    title: 'Sewa Fiber Optic Terdedikasi Murah Surabaya',
    platform: 'Google Search Engine',
    region: 'Jawa Timur',
    source: 'Google Keyword Planner API',
    capturedAt: '2026-08-06T10:30:00Z',
    confidence: 88,
    verificationStatus: 'Verified',
    momentum: 'Peak',
    lifecycle: 'Peak',
    relevanceScore: 85,
    brandFitScore: 88,
    riskLevel: 'Low',
    publishingWindow: 'Segera (Minggu Ini)',
    expirationDate: '2026-08-20'
  },
  {
    id: 'trd-3',
    type: 'Hashtag',
    title: '#SmartLogisticsID',
    platform: 'Instagram & TikTok',
    region: 'Indonesia',
    source: 'Social Listening API Engine',
    capturedAt: '2026-08-06T12:15:00Z',
    confidence: 90,
    verificationStatus: 'Verified',
    momentum: 'Rising',
    lifecycle: 'Rising',
    relevanceScore: 89,
    brandFitScore: 91,
    riskLevel: 'Low',
    hashtagRecommendation: 'USE',
    publishingWindow: '5 - 18 Agustus 2026',
    expirationDate: '2026-08-25'
  },
  {
    id: 'trd-4',
    type: 'Audio',
    title: 'Corporate Precision Motion Synth 120BPM',
    platform: 'TikTok & Instagram Reels',
    region: 'Global / ID',
    source: 'Approved Commercial Music Library #LIB-884',
    capturedAt: '2026-08-04T15:00:00Z',
    confidence: 96,
    verificationStatus: 'Verified',
    momentum: 'Rising',
    lifecycle: 'Rising',
    relevanceScore: 88,
    brandFitScore: 90,
    riskLevel: 'Low',
    audioRightsStatus: 'Verified for Intended Use',
    publishingWindow: 'Agustus 2026',
    expirationDate: '2026-12-31'
  },
  {
    id: 'trd-5',
    type: 'Audio',
    title: 'Viral Beat Sunset Chill Electronic',
    platform: 'TikTok Audio Trending',
    region: 'Indonesia',
    source: 'Unverified Third-Party TikTok Audio Stream',
    capturedAt: '2026-08-06T14:20:00Z',
    confidence: 60,
    verificationStatus: 'Unverified',
    momentum: 'Peak',
    lifecycle: 'Peak',
    relevanceScore: 45,
    brandFitScore: 40,
    riskLevel: 'High',
    audioRightsStatus: 'Needs Rights Verification',
    publishingWindow: 'Sangat Singkat',
    expirationDate: '2026-08-12'
  }
];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'evt-101',
    name: 'Indonesia Supply Chain & Logistics Tech Expo 2026',
    organizer: 'Asosiasi Logistik Indonesia & Kemenko Perekonomian',
    category: 'Exhibition & Summit',
    dateStart: '2026-08-22',
    dateEnd: '2026-08-24',
    venue: 'ICE BSD City Hall 5-6',
    city: 'Tangerang',
    isOnline: false,
    source: 'Official Press Release Kemenko #PR-2026-88',
    confidence: 98,
    verificationStatus: 'Verified',
    lastVerified: '2026-08-06T16:00:00Z',
    revalidationStatus: 'OK',
    version: 1
  },
  {
    id: 'evt-102',
    name: 'National UMKM Go Digital Forum 2026',
    organizer: 'Kementerian Koperasi dan UKM RI',
    category: 'National Forum & Webinar',
    dateStart: '2026-08-18',
    dateEnd: '2026-08-18',
    venue: 'Online Hybrid via Zoom & YouTube Live',
    city: 'Jakarta',
    isOnline: true,
    source: 'Kemenkop UKM Official Portal',
    confidence: 92,
    verificationStatus: 'Verified',
    lastVerified: '2026-08-05T09:00:00Z',
    revalidationStatus: 'OK',
    version: 1
  }
];

export const INITIAL_EVIDENCES: Evidence[] = [
  {
    id: 'evd-1',
    sourceTitle: 'Laporan Studi Efisiensi IoT Logistik TELPRO 2025/2026',
    sourceUrl: 'https://telpro.co.id/case-study/logistics-2026.pdf',
    sourceType: 'Internal Approved Source',
    claimText: 'Penggunaan TELPRO Smart Warehouse mengurangi delay operasional hingga 35% dan biaya pengiriman sebesar 22%.',
    verificationStatus: 'Verified',
    validityDate: '2026-12-31',
    confidenceScore: 98,
    reviewerNote: 'Diuji oleh Tim QA internal dengan sampel 12 gudang manufaktur.',
    lastVerifiedAt: '2026-08-01T10:00:00Z'
  },
  {
    id: 'evd-2',
    sourceTitle: 'Surat Keputusan SLA Jaringan Terdedikasi Telkom Group 2026',
    sourceUrl: 'https://telpro.co.id/policy/sla-dedicated-2026',
    sourceType: 'Official Primary Source',
    claimText: 'Jaringan Dedicated IndiHome Business & TELPRO Fiber memiliki jaminan Service Level Agreement (SLA) 99.9% uptime dengan garansi kompensasi.',
    verificationStatus: 'Verified',
    validityDate: '2026-12-31',
    confidenceScore: 99,
    reviewerNote: 'Surat Keputusan Direksi Telkom Indonesia No. SK-2026/TLK-88.',
    lastVerifiedAt: '2026-07-10T14:00:00Z'
  }
];

export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    campaignId: 'cmp-2026-01',
    title: 'Visual Storytelling: Transformasi Gudang Manual ke Smart Warehouse TELPRO',
    sourceType: 'Trend',
    sourceTitle: 'Automated Warehouse & Green Supply Chain Indonesia 2026',
    businessAngle: 'Solusi terpadu penghematan opstip & efisiensi armada bagi pengusaha rantai pasok',
    audience: 'VP Supply Chain, COO, Manager Gudang Industri',
    relevanceScore: 95,
    momentumScore: 90,
    overallScore: 93,
    action: 'Produce Now',
    status: 'In Content Development',
    publishingWindow: '10 - 16 Agustus 2026',
    recommendedFormat: 'Carousel & Reels Storyboard'
  },
  {
    id: 'opp-2',
    campaignId: 'cmp-2026-02',
    title: 'Edukasi UMKM: Mengapa Internet Rumahan Tidak Cukup untuk Toko / Cafe Bisnis',
    sourceType: 'Event',
    sourceTitle: 'National UMKM Go Digital Forum 2026',
    businessAngle: 'Perbandingan Dedicated SLA vs Shared Bandwidth dengan ROI bergaransi',
    audience: 'Pemilik Cafe, Ritel Modern, Owner Online Shop Scale-Up',
    relevanceScore: 88,
    momentumScore: 85,
    overallScore: 87,
    action: 'Produce Now',
    status: 'In Content Development',
    publishingWindow: '12 - 17 Agustus 2026',
    recommendedFormat: 'Infographic & Short Video'
  }
];

export const INITIAL_CONTENTS: ContentItem[] = [
  {
    id: 'cnt-101',
    campaignId: 'cmp-2026-01',
    opportunityId: 'opp-1',
    title: 'Gudang Manual vs Smart Warehouse TELPRO: 5 Titik Kebocoran Biaya',
    objective: 'Mengedukasi C-Level tentang efisiensi operasional hingga 35%',
    audience: 'VP Supply Chain & COO Perusahaan Ritel/Manufaktur',
    platform: 'LinkedIn & Instagram',
    format: 'Carousel',
    status: 'Under Review',
    pic: 'Nuroniah (Marcom Lead)',
    currentVersionId: 'ver-101-v2'
  },
  {
    id: 'cnt-102',
    campaignId: 'cmp-2026-02',
    opportunityId: 'opp-2',
    title: '3 Alasan Internet Cafe Sering Rontok Saat Jam Ramai (dan Solusinya)',
    objective: 'Mendorong WA Click Conversions untuk langganan IndiHome Business',
    audience: 'Pemilik Cafe & Restoran Modern',
    platform: 'Instagram & TikTok',
    format: 'Reels/Shorts',
    status: 'Draft',
    pic: 'Nuroniah (Marcom Lead)',
    currentVersionId: 'ver-102-v1'
  }
];

export const INITIAL_CONTENT_VERSIONS: ContentVersion[] = [
  {
    id: 'ver-101-v2',
    contentId: 'cnt-101',
    versionNumber: 2,
    brief: 'Carousel 7 slide yang membahas perbandingan biaya operasional gudang konvensional vs Smart Warehouse IoT TELPRO.',
    hook: 'Apakah Gudang Anda Menyimpan Kebocoran Biaya Diam-Diam hingga 35% Setiap Bulan?',
    caption: 'Dalam industri logistik modern, keterlambatan pelacakan inventaris 10 menit saja dapat memicu efek domino biaya operasional.\n\nTELPRO Smart Warehouse menghadirkan sensor IoT terpadu, pemantauan suhu/kondisi barang real-time, serta analitik armada otomatis dalam satu layar kontrol.\n\nSesuai studi kasus internal TELPRO 2026, penerapan sistem ini berhasil memangkas delay operasional hingga 35% dan menghemat biaya pengiriman 22%.\n\nKonsultasikan transformasi gudang bisnis Anda bersama tim expert TELPRO sekarang juga!\n\n#TELPRO2026 #SmartWarehouse #SupplyChainIndonesia #InovasiLogistik #B2BTech',
    script: 'Slide 1: Cover Hook High Contrast.\nSlide 2: Masalah #1 Inakurasi Stok & Stok Opname Manual.\nSlide 3: Masalah #2 Delay Rute Armada Tanpa GPS Tracking.\nSlide 4: Solusi TELPRO Smart Warehouse Dashboard.\nSlide 5: Grafik Bukti Efisiensi 35% (Evidence Verified).\nSlide 6: Penghematan Biaya 22%.\nSlide 7: CTA Hubungi Sales / Klik WA di Bio.',
    cta: 'Hubungi Team Expert TELPRO via WhatsApp untuk Sesi Demo Live Dashboard',
    selectedKeywords: ['Smart Warehouse', 'IoT Logistik', 'TELPRO Supply Chain', 'Efisiensi Gudang'],
    selectedHashtags: ['#TELPRO2026', '#SmartWarehouse', '#SupplyChainID', '#B2BLogistics'],
    selectedAudio: 'Corporate Precision Motion Synth 120BPM',
    audioRightsStatus: 'Verified for Intended Use',
    createdBy: 'Nuroniah (Marcom Lead)',
    createdAt: '2026-08-06T14:30:00Z',
    aiAssisted: true,
    evidenceIds: ['evd-1'],
    riskLevel: 'Low'
  },
  {
    id: 'ver-102-v1',
    contentId: 'cnt-102',
    versionNumber: 1,
    brief: 'Reels edukasi cepat 30 detik untuk pemilik cafe terkait koneksi internet terdedikasi.',
    hook: 'Kasir Mandiri Error Pas Lagi Antre Panjang? Ini Penyebab Utama Internet Cafe Lemot!',
    caption: 'Banyak pemilik cafe mengira paket internet rumahan biasa sudah cukup. Padahal saat 50 pengunjung tersambung WiFi bersamaan, sistem POS & transaksi digital Anda akan berebut bandwidth!\n\nIndiHome Business dari TELPRO hadir dengan jaminan SLA 99.9% dedicated bandwidth, membuat sistem kasir & pelanggan tetap lancar jaya.\n\nKlik link di bio untuk penawaran promo khusus Q3!',
    script: '00-05s: Visual antrean cafe panik karena kasir loading.\n05-15s: Penjelasan perbandingan Shared Bandwidth vs Dedicated Bandwidth.\n15-25s: Tampilan router IndiHome Business & jaminan SLA 99.9%.\n25-30s: CTA Klik WhatsApp di bio.',
    cta: 'Konsultasi Gratis via WhatsApp TELPRO Marketing',
    selectedKeywords: ['Internet Cafe', 'IndiHome Business', 'WiFi Dedikasi', 'SLA 99.9%'],
    selectedHashtags: ['#IndiHomeBusiness', '#BisnisLancar', '#TELPROConnect'],
    selectedAudio: 'Viral Beat Sunset Chill Electronic',
    audioRightsStatus: 'Needs Rights Verification',
    createdBy: 'Nuroniah (Marcom Lead)',
    createdAt: '2026-08-06T15:00:00Z',
    aiAssisted: true,
    evidenceIds: ['evd-2'],
    riskLevel: 'Medium'
  }
];

export const INITIAL_APPROVALS: Approval[] = [
  {
    id: 'app-101-1',
    contentVersionId: 'ver-101-v2',
    contentId: 'cnt-101',
    stage: '01. Creator Submission',
    reviewerName: 'Nuroniah (Marcom Lead)',
    reviewerRole: 'ROLE_MARCOM_CREATOR',
    decision: 'Pass',
    comment: 'Draft brief, hook, script carousel Smart Warehouse disiapkan dan diajukan ke pipeline.',
    submittedAt: '2026-08-06T14:00:00Z',
    decidedAt: '2026-08-06T14:15:00Z',
    dueAt: '2026-08-07T12:00:00Z',
    slaStatus: 'Completed'
  },
  {
    id: 'app-101-2',
    contentVersionId: 'ver-101-v2',
    contentId: 'cnt-101',
    stage: '02. Marcom Review',
    reviewerName: 'Ahmad Analyst',
    reviewerRole: 'ROLE_ANALYST_QA',
    decision: 'Pass',
    comment: 'Klaim efisiensi 35% dan penghematan 22% telah dicocokkan dengan Laporan Studi EVD-1. Terverifikasi.',
    submittedAt: '2026-08-06T14:20:00Z',
    decidedAt: '2026-08-06T15:10:00Z',
    dueAt: '2026-08-07T12:00:00Z',
    slaStatus: 'Completed'
  },
  {
    id: 'app-101-3',
    contentVersionId: 'ver-101-v2',
    contentId: 'cnt-101',
    stage: '03. Manager Marketing Review',
    reviewerName: 'Budi Manager',
    reviewerRole: 'ROLE_MANAGER_MARKETING',
    decision: 'Approve',
    comment: 'Hook tajam, narasi mendukung KPI MQL Smart Logistics. Lanjutkan ke VP Marketing.',
    submittedAt: '2026-08-06T15:15:00Z',
    decidedAt: '2026-08-06T16:00:00Z',
    dueAt: '2026-08-07T15:00:00Z',
    slaStatus: 'Completed'
  },
  {
    id: 'app-101-4',
    contentVersionId: 'ver-101-v2',
    contentId: 'cnt-101',
    stage: '04. VP Marketing Review',
    reviewerName: 'Siti VP Marketing',
    reviewerRole: 'ROLE_VP_MARKETING',
    decision: 'Pending',
    submittedAt: '2026-08-06T16:05:00Z',
    dueAt: '2026-08-07T18:00:00Z',
    slaStatus: 'Normal'
  }
];

export const INITIAL_BUDGETS: BudgetItem[] = [
  {
    id: 'bdg-1',
    campaignId: 'cmp-2026-01',
    activityName: 'Meta & LinkedIn Sponsored Content (Smart Logistics)',
    category: 'Paid Ads',
    allocatedAmount: 75000000,
    committedAmount: 25000000,
    actualAmount: 22500000,
    varianceAmount: 2500000,
    status: 'Approved'
  },
  {
    id: 'bdg-2',
    campaignId: 'cmp-2026-01',
    activityName: 'Produksi Carousel & Video Storyboard Studio TELPRO',
    category: 'Production',
    allocatedAmount: 45000000,
    committedAmount: 20000000,
    actualAmount: 20000000,
    varianceAmount: 0,
    status: 'Executed'
  },
  {
    id: 'bdg-3',
    campaignId: 'cmp-2026-02',
    activityName: 'Google Search Keyword Ads (IndiHome Business)',
    category: 'Paid Ads',
    allocatedAmount: 50000000,
    committedAmount: 18000000,
    actualAmount: 16500000,
    varianceAmount: 1500000,
    status: 'Approved'
  }
];

export const INITIAL_AUDIT_LOGS: AuditEvent[] = [
  {
    id: 'aud-1001',
    actorName: 'Nuroniah (Marcom Lead)',
    actorRole: 'ROLE_MARCOM_CREATOR',
    action: 'CONTENT_VERSION_CREATE',
    entityName: 'ContentVersion',
    entityId: 'ver-101-v2',
    beforeState: 'Version 1 (Initial Draft)',
    afterState: 'Version 2 (AI-Assisted with Verified Evidence EVD-1)',
    timestamp: '2026-08-06T14:30:00Z',
    aiRunId: 'run-ai-8821',
    contentVersionId: 'ver-101-v2',
    sourceSystem: 'TELPRO Campaign Studio Core'
  },
  {
    id: 'aud-1002',
    actorName: 'Ahmad Analyst',
    actorRole: 'ROLE_ANALYST_QA',
    action: 'FACT_CHECK_DECISION',
    entityName: 'Approval',
    entityId: 'app-101-1',
    beforeState: 'Pending',
    afterState: 'Pass',
    timestamp: '2026-08-06T15:10:00Z',
    contentVersionId: 'ver-101-v2',
    sourceSystem: 'TELPRO Governance Engine'
  },
  {
    id: 'aud-1003',
    actorName: 'Budi Manager',
    actorRole: 'ROLE_MANAGER_MARKETING',
    action: 'APPROVAL_DECISION',
    entityName: 'Approval',
    entityId: 'app-101-3',
    beforeState: 'Pending',
    afterState: 'Approve',
    timestamp: '2026-08-06T16:30:00Z',
    contentVersionId: 'ver-101-v2',
    sourceSystem: 'TELPRO Governance Engine'
  }
];

export const INITIAL_LEAD_FEEDBACKS: LeadFeedback[] = [
  {
    id: 'ld-1',
    campaignId: 'cmp-2026-01',
    channel: 'WhatsApp Business API',
    source: 'Carousel LinkedIn Smart Logistics',
    status: 'Qualified Lead',
    customerInquiry: 'Permintaan proposal sistem tracking IoT 15 armada truk kontainer di Surabaya',
    contactName: 'Ir. Hendra Wijaya',
    companyName: 'PT Nusantara Trans Logistik',
    receivedAt: '2026-08-06T11:20:00Z'
  },
  {
    id: 'ld-2',
    campaignId: 'cmp-2026-02',
    channel: 'Landing Page Form',
    source: 'Google Search Ads Dedicated WiFi',
    status: 'In Contact',
    customerInquiry: 'Tanya syarat pasang IndiHome Business Dedicated 200Mbps di Mall Cafe',
    contactName: 'Sisca Febriani',
    companyName: 'Kopi Kenangan Nusantara Outlet #12',
    receivedAt: '2026-08-06T13:45:00Z'
  }
];

export const INITIAL_PERFORMANCE_METRICS: PerformanceMetric[] = [
  {
    contentId: 'cnt-101',
    campaignId: 'cmp-2026-01',
    reach: 48500,
    impressions: 62000,
    engagement: 4120,
    ctr: 3.85,
    lpViews: 1850,
    waClicks: 320,
    chatInitiated: 142,
    spend: 22500000,
    cpc: 12162,
    cpl: 158450,
    predictedScore: 93,
    actualPerformanceScore: 95
  },
  {
    contentId: 'cnt-102',
    campaignId: 'cmp-2026-02',
    reach: 32000,
    impressions: 41000,
    engagement: 2890,
    ctr: 2.90,
    lpViews: 1200,
    waClicks: 210,
    chatInitiated: 88,
    spend: 16500000,
    cpc: 13750,
    cpl: 187500,
    predictedScore: 87,
    actualPerformanceScore: 84
  }
];

export const INITIAL_LEARNINGS: LearningItem[] = [
  {
    id: 'lrn-1',
    campaignId: 'cmp-2026-01',
    category: 'Visual & Hook Pattern',
    frameworkAction: 'CONTINUE',
    observation: 'Carousel yang menampilkan grafik perbandingan biaya sebelum & sesudah solusi TELPRO menghasilkan CTR 35% lebih tinggi daripada slide teks penuh.',
    hypothesis: 'Audiens B2B C-Level merespons lebih cepat bukti kuantitatif ber-evidence.',
    recommendation: 'Pertahankan format grafik komparatif berbasis Laporan Studi Terverifikasi di semua campaign B2B Enterprise Q4.',
    owner: 'Nuroniah (Marcom Lead)',
    createdAt: '2026-08-05T09:00:00Z'
  },
  {
    id: 'lrn-2',
    campaignId: 'cmp-2026-02',
    category: 'Audio & Rights Safety',
    frameworkAction: 'STOP',
    observation: 'Audio trending TikTok yang belum terverifikasi hak komersialnya berisiko ditolak saat QA dan memicu delay eksekusi 2 hari.',
    hypothesis: 'Proses Rights Verification mandiri di pertengahan jalan memperlambat Publishing SLA.',
    recommendation: 'Hanya pilih audio dari Approved Commercial Library yang bertanda "Verified for Intended Use".',
    owner: 'Ahmad Analyst',
    createdAt: '2026-08-04T16:00:00Z'
  }
];

export const INITIAL_STORYBOARDS: Storyboard[] = [
  {
    id: 'stb-101',
    contentId: 'cnt-101',
    versionNumber: 1,
    mode: 'Production Storyboard',
    status: 'In Production',
    createdAt: '2026-08-06T14:00:00Z',
    scenes: [
      {
        id: 'sc-1',
        sceneNumber: 1,
        duration: 4,
        sceneObjective: 'Hook Masalah Penumpukan Stok',
        visualDescription: 'Wide shot area gudang logistik dengan tumpukan kardus kargo dan aktivitas forklift.',
        shotType: 'Wide Shot',
        cameraAngle: 'High Angle',
        cameraMovement: 'Static',
        lighting: 'Cool Industrial Overhead LED',
        voiceOver: 'Apakah penumpukan barang dan keterlambatan kargo masih menghambat efisiensi gudang Anda?',
        onScreenText: 'Delay Kargo = Margin Tergerus 🛑',
        audioNote: 'Corporate Precision Motion Synth (Upbeat start)',
        generatedImageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
        representationStatus: 'ACTUAL ASSET WITH AI MOTION',
        reviewStatus: 'Approved'
      },
      {
        id: 'sc-2',
        sceneNumber: 2,
        duration: 5,
        sceneObjective: 'Solusi IoT Sensor TELPRO',
        visualDescription: 'Close-up sensor IoT TELPRO terpasang di rak gudang dengan indikator LED hijau aktif.',
        shotType: 'Close Up',
        cameraAngle: 'Eye Level',
        cameraMovement: 'Dolly Push-in',
        lighting: 'Accent Cyan Spotlight',
        voiceOver: 'Dengan sensor IoT TELPRO, lokasi kargo dan suhu ruang terpantau otomatis secara akurat.',
        onScreenText: 'Monitoring IoT 24/7 Real-Time 📡',
        audioNote: 'Subtle Tech Ping Sound Effect',
        generatedImageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
        representationStatus: 'AI-ASSISTED COMPOSITE',
        reviewStatus: 'Approved'
      },
      {
        id: 'sc-3',
        sceneNumber: 3,
        duration: 5,
        sceneObjective: 'Bukti Hasil & Dashboard',
        visualDescription: 'Staf manajer gudang memegang tablet yang menampilkan Telpro Smart Warehouse Dashboard.',
        shotType: 'Medium Shot',
        cameraAngle: 'Eye Level',
        cameraMovement: 'Handheld',
        lighting: 'Warm Soft Interior',
        voiceOver: 'Akurasi inventori meningkat hingga 99.8% dan waktu pencarian kargo berkurang 60%.',
        onScreenText: 'Akurasi Inventori 99.8% ✔️',
        audioNote: 'Data Rise Sound Effect',
        generatedImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
        representationStatus: 'ACTUAL VERIFIED ASSET',
        reviewStatus: 'Approved'
      },
      {
        id: 'sc-4',
        sceneNumber: 4,
        duration: 4,
        sceneObjective: 'CTA Konsultasi B2B TELPRO',
        visualDescription: 'Truk armada logistik dengan logo TELPRO berangkat dari bay gudang disertai animasi CTA contact.',
        shotType: 'Medium Shot',
        cameraAngle: 'Low Angle',
        cameraMovement: 'Pan',
        lighting: 'Natural Golden Hour',
        voiceOver: 'Transformasi operasional gudang Anda bersama TELPRO. Konsultasi solusi B2B gratis hari ini.',
        onScreenText: 'Hubungi TELPRO Enterprise Sales 🚀',
        audioNote: 'Audio Synth Outro & Logo Stinger',
        generatedImageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80',
        representationStatus: 'ACTUAL VERIFIED ASSET',
        reviewStatus: 'Approved'
      }
    ]
  }
];

export const INITIAL_VIDEO_PROJECTS: VideoProject[] = [
  {
    id: 'vid-101',
    contentId: 'cnt-101',
    title: 'Smart Warehouse TELPRO Reel 18s',
    aspectRatio: '9:16',
    targetDuration: 18,
    status: 'Ready for QA',
    voiceOverAudioUrl: 'https://actions.google.com/sounds/v1/speech/person_speaking.ogg',
    backgroundMusicUrl: 'https://actions.google.com/sounds/v1/science_fiction/digital_pulse.ogg',
    scenes: [
      {
        id: 'vsc-1',
        storyboardSceneId: 'sc-1',
        sceneNumber: 1,
        sourceMode: 'Hybrid Real Asset + AI',
        duration: 4,
        aspectRatio: '9:16',
        prompt: 'Cinematic wide shot of a modern automated warehouse in Surabaya, smooth camera push-in, industrial lighting',
        thumbnailUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80',
        videoClipUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        provider: 'Veo AI Video Router',
        consistencyLock: { brandLock: true, characterLock: false, buildingLock: true, visualStyleLock: true },
        propertyTruthGuard: 'ACTUAL ASSET WITH AI MOTION',
        reviewStatus: 'Approved'
      },
      {
        id: 'vsc-2',
        storyboardSceneId: 'sc-2',
        sceneNumber: 2,
        sourceMode: 'Image-to-Video',
        duration: 5,
        aspectRatio: '9:16',
        prompt: 'Macro shot of green LED blinking on IoT RFID sensor attached to warehouse rack, high-tech motion',
        thumbnailUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80',
        videoClipUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        provider: 'Gemini / Imagen 3',
        consistencyLock: { brandLock: true, characterLock: false, buildingLock: false, visualStyleLock: true },
        propertyTruthGuard: 'AI-ASSISTED COMPOSITE',
        reviewStatus: 'Approved'
      },
      {
        id: 'vsc-3',
        storyboardSceneId: 'sc-3',
        sceneNumber: 3,
        sourceMode: 'Real Footage',
        duration: 5,
        aspectRatio: '9:16',
        prompt: 'Real recorded footage of Telpro Smart Warehouse Dashboard on iPad Pro',
        thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80',
        videoClipUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        provider: 'TELPRO Real Asset Repository',
        consistencyLock: { brandLock: true, characterLock: true, buildingLock: true, visualStyleLock: true },
        propertyTruthGuard: 'ACTUAL VERIFIED ASSET',
        reviewStatus: 'Approved'
      },
      {
        id: 'vsc-4',
        storyboardSceneId: 'sc-4',
        sceneNumber: 4,
        sourceMode: 'Text-to-Video',
        duration: 4,
        aspectRatio: '9:16',
        prompt: 'Logistics truck leaving warehouse bay with TELPRO 2026 motion graphic branding overlay',
        thumbnailUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=400&q=80',
        videoClipUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        provider: 'Veo AI Video Router',
        consistencyLock: { brandLock: true, characterLock: false, buildingLock: true, visualStyleLock: true },
        propertyTruthGuard: 'ACTUAL VERIFIED ASSET',
        reviewStatus: 'Approved'
      }
    ]
  }
];

