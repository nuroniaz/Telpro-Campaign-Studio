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
  VideoProject,
  RegionalSubmission,
  MasterTaxonomy,
  PlannerStructureChangeRequest
} from './types';

export const INITIAL_USERS: UserProfile[] = [
  // 1. MARCOMM CREATOR (with designated CONTENT_PLANNER_OWNER permission)
  {
    id: 'usr-1',
    name: 'Marcomm Creator (Planner Owner)',
    email: 'marcomm.owner@telpro.co.id',
    role: 'ROLE_MARCOM_CREATOR',
    title: 'Marcomm Creator & Content Planner Owner',
    businessUnit: 'TELPRO Enterprise Solutions',
    isContentPlannerOwner: true,
    permissions: [
      'CONTENT_PLANNER_OWNER',
      'CREATE_CONTENT',
      'EDIT_CONTENT',
      'USE_AI_STUDIO',
      'VIEW_CALENDAR',
      'EDIT_CALENDAR',
      'CURATE_REGIONAL_SUBMISSION',
      'SUBMIT_CONTENT_REVIEW',
      'MANAGE_TAXONOMY',
      'PARTICIPATE_EDITORIAL_PLANNING'
    ]
  },
  // 2. MARCOMM CREATOR (Creator, Reviewer & Analis @telprodico)
  {
    id: 'usr-2',
    name: 'Marcomm Creator',
    email: 'marcomm@telpro.co.id',
    role: 'ROLE_MARCOM_CREATOR',
    title: 'Marcomm Content Creator & Analis @telprodico',
    businessUnit: 'TELPRO Enterprise Solutions & DICO',
    isContentPlannerOwner: false,
    permissions: [
      'CREATE_CONTENT',
      'EDIT_CONTENT',
      'USE_AI_STUDIO',
      'VIEW_CALENDAR',
      'EDIT_CALENDAR',
      'CURATE_REGIONAL_SUBMISSION',
      'SUBMIT_CONTENT_REVIEW',
      'JOINT_REVIEW_EXECUTE',
      'VIEW_NATIONAL_ANALYTICS',
      'PUBLISH_CONTENT'
    ]
  },
  // 3. REGIONAL CREATORS (1 through 5)
  {
    id: 'usr-reg-1',
    name: 'Regional 1 - Creator',
    email: 'regional1.creator@telpro.co.id',
    role: 'ROLE_REGIONAL_CREATOR',
    title: 'Regional Content & Field Creator',
    businessUnit: 'TELPRO Regional 1',
    regionalUnit: 'Regional 1',
    permissions: [
      'REGIONAL_SUBMISSION_CREATE',
      'REGIONAL_SUBMISSION_EDIT',
      'USE_AI_STUDIO',
      'VIEW_CALENDAR',
      'VIEW_REGIONAL_PERFORMANCE'
    ]
  },
  {
    id: 'usr-reg-2',
    name: 'Regional 2 - Creator',
    email: 'regional2.creator@telpro.co.id',
    role: 'ROLE_REGIONAL_CREATOR',
    title: 'Regional Content & Field Creator',
    businessUnit: 'TELPRO Regional 2',
    regionalUnit: 'Regional 2',
    permissions: [
      'REGIONAL_SUBMISSION_CREATE',
      'REGIONAL_SUBMISSION_EDIT',
      'USE_AI_STUDIO',
      'VIEW_CALENDAR',
      'VIEW_REGIONAL_PERFORMANCE'
    ]
  },
  {
    id: 'usr-reg-3',
    name: 'Regional 3 - Creator',
    email: 'regional3.creator@telpro.co.id',
    role: 'ROLE_REGIONAL_CREATOR',
    title: 'Regional Content & Field Creator',
    businessUnit: 'TELPRO Regional 3',
    regionalUnit: 'Regional 3',
    permissions: [
      'REGIONAL_SUBMISSION_CREATE',
      'REGIONAL_SUBMISSION_EDIT',
      'USE_AI_STUDIO',
      'VIEW_CALENDAR',
      'VIEW_REGIONAL_PERFORMANCE'
    ]
  },
  {
    id: 'usr-reg-4',
    name: 'Regional 4 - Creator',
    email: 'regional4.creator@telpro.co.id',
    role: 'ROLE_REGIONAL_CREATOR',
    title: 'Regional Content & Field Creator',
    businessUnit: 'TELPRO Regional 4',
    regionalUnit: 'Regional 4',
    permissions: [
      'REGIONAL_SUBMISSION_CREATE',
      'REGIONAL_SUBMISSION_EDIT',
      'USE_AI_STUDIO',
      'VIEW_CALENDAR',
      'VIEW_REGIONAL_PERFORMANCE'
    ]
  },
  {
    id: 'usr-reg-5',
    name: 'Regional 5 - Creator',
    email: 'regional5.creator@telpro.co.id',
    role: 'ROLE_REGIONAL_CREATOR',
    title: 'Regional Content & Field Creator',
    businessUnit: 'TELPRO Regional 5',
    regionalUnit: 'Regional 5',
    permissions: [
      'REGIONAL_SUBMISSION_CREATE',
      'REGIONAL_SUBMISSION_EDIT',
      'USE_AI_STUDIO',
      'VIEW_CALENDAR',
      'VIEW_REGIONAL_PERFORMANCE'
    ]
  },
  // 4. CORCOMM CREATOR (Creator, Reviewer & Analis @telkomproperty)
  {
    id: 'usr-4',
    name: 'Corcomm Creator',
    email: 'corcomm.creator@telpro.co.id',
    role: 'ROLE_CORCOMM_CREATOR',
    title: 'Corcomm Creator & Analis @telkomproperty',
    businessUnit: 'TELPRO Corporate Secretary & Holding Relations',
    permissions: [
      'CREATE_CONTENT',
      'EDIT_CONTENT',
      'VIEW_CALENDAR',
      'PARTICIPATE_EDITORIAL_PLANNING',
      'REVIEW_PLANNER_STRUCTURE',
      'CORCOMM_TAXONOMY_INPUT',
      'CURATE_REGIONAL_SUBMISSION',
      'JOINT_REVIEW_EXECUTE',
      'VIEW_NATIONAL_ANALYTICS',
      'PUBLISH_CONTENT'
    ]
  },
  // 5. VP CORSEC APPROVER
  {
    id: 'usr-6',
    name: 'VP Corporate Secretary',
    email: 'vp.corsec@telpro.co.id',
    role: 'ROLE_VP_CORSEC',
    title: 'VP Corporate Secretary',
    businessUnit: 'TELPRO Corsec & Legal',
    permissions: [
      'VP_CORSEC_APPROVAL',
      'VIEW_CALENDAR',
      'VIEW_NATIONAL_ANALYTICS'
    ]
  },
  // 6. PLT. DIREKTUR UTAMA (FINAL APPROVER)
  {
    id: 'usr-7',
    name: 'Plt. Direktur Utama',
    email: 'dirut@telpro.co.id',
    role: 'ROLE_FINAL_APPROVER',
    title: 'Plt. Direktur Utama (Final Approver)',
    businessUnit: 'TELPRO Board of Directors',
    permissions: [
      'FINAL_CONTENT_APPROVAL',
      'VIEW_CALENDAR',
      'VIEW_NATIONAL_ANALYTICS'
    ]
  },
  // 7. SYSTEM ADMIN (Technical Only - Tim IT & Teknis)
  {
    id: 'usr-9',
    name: 'System Administrator',
    email: 'sysadmin@telpro.co.id',
    role: 'ROLE_SYSTEM_ADMIN',
    title: 'System Administrator (Tim IT & Teknis)',
    businessUnit: 'TELPRO IT Infrastructure & Security',
    permissions: [
      'MANAGE_SYSTEM'
    ]
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
    name: 'Smart & Green Building Solutions 2026',
    periodStart: '2026-08-01',
    periodEnd: '2026-10-31',
    businessObjective: 'Mendorong adopsi solusi Smart Building IoT (BMS, IAQ, Energy Management) dan sertifikasi Bangunan Hijau (Greenship GBCI) pada 35+ gedung komersial TelkomGroup & eksternal',
    marketingObjective: 'Menghasilkan 180 B2B Marketing Qualified Leads (Building Owner, GA Lead, CSO) dan 520 konsultasi audit energi gedung',
    communicationObjective: 'Mengedukasi C-Level tentang penghematan biaya operasional (OpEx) energi chiller & HVAC gedung hingga 28.4%',
    audience: 'Building Owners, VP General Affair, Chief Sustainability Officer (CSO), Manajer Fasilitas',
    status: 'Active',
    budgetAllocated: 150000000,
    budgetSpent: 42500000,
    owner: 'Nuroniah (Marcom Lead)',
    priorityProduct: 'Smart BMS IoT & Energy Saving Solutions (Chiller, Lighting, Air Quality)',
    keyMessage: 'Pangkas OpEx & Emisi Karbon Gedung dengan Solusi Smart & Green Building TelkomProperty',
    funnelStage: 'Consideration'
  },
  {
    id: 'cmp-2026-02',
    name: 'Office Space Leasing & Asset Monetization Q3-Q4',
    periodStart: '2026-07-15',
    periodEnd: '2026-12-31',
    businessObjective: 'Optimalisasi okupansi dan monetisasi 3.010+ aset properti strategis TelkomGroup (Telkom Landmark Tower, Menara Multimedia, dsb.) dengan target occupancy rate 92%',
    marketingObjective: 'Mencapai 95.000 Impression, 2.800 Website Space Inquiry, dan 140 Virtual Site Tour Request',
    communicationObjective: 'Menampilkan prestise, lokasi prima, fasilitas Grade-A, dan ekosistem digital terintegrasi di jaringan gedung TelkomProperty',
    audience: 'Corporate Tenant, Country Manager Multinasional, Head of Procurement, Bisnis Startup Scale-Up',
    status: 'Active',
    budgetAllocated: 120000000,
    budgetSpent: 38000000,
    owner: 'Budi Manager',
    priorityProduct: 'Commercial Office Space Leasing & Shared Workspace',
    keyMessage: 'Lokasi Strategis, Fasilitas Grade-A & Ekosistem Digital Lengkap di Jaringan Gedung TelkomProperty',
    funnelStage: 'Acquisition'
  },
  {
    id: 'cmp-2026-03',
    name: 'Integrated Facility Management & Retail Hub 2026',
    periodStart: '2026-09-01',
    periodEnd: '2026-11-30',
    businessObjective: 'Transformasi fasilitas lantai dasar gedung perkantoran menjadi Lifestyle Hub modern: Indicafe (Kopi Teman Kerja), Smart Locker, Cloud Kitchen, dan UMKM Corner',
    marketingObjective: 'Meningkatkan kepuasan tenant (NPS) sebesar 35% dan menarik 45 mitra tenant retail F&B baru',
    communicationObjective: 'Mengubah gedung kantor konvensional menjadi ekosistem kerja dan gaya hidup yang nyaman, produktif, dan terhubung',
    audience: 'Tenant Gedung, Pengusaha Retail F&B, Operator Cloud Kitchen, Pekerja Komersial Modern',
    status: 'Planned',
    budgetAllocated: 95000000,
    budgetSpent: 0,
    owner: 'Nuroniah (Marcom Lead)',
    priorityProduct: 'Integrated Facility Management & Property-Based Retail Ecosystem (Indicafe, SwaMart)',
    keyMessage: 'Kenyamanan Maksimal & Akses Fasilitas Gaya Hidup Terpadu di Gedung Modern TelkomProperty',
    funnelStage: 'Awareness'
  },
  {
    id: 'cmp-2026-04',
    name: 'Property Development & Project Solution Excellence',
    periodStart: '2026-08-15',
    periodEnd: '2026-12-15',
    businessObjective: 'Penetrasi layanan arsitektur, interior fit-out modern, dan Mechanical-Electrical-Plumbing (MEP) untuk renovasi gedung perkantoran BUMN & korporasi swasta',
    marketingObjective: 'Akuisisi 25 project fit-out & retrofitting gedung bernilai strategis di 7 regional',
    communicationObjective: 'Membuktikan kapabilitas rekayasa konstruksi, kepatuhan K3 Zero-Accident, dan sertifikasi ISO terpadu TelkomProperty',
    audience: 'Direktur Fasilitas BUMN, Project Manager Konstruksi, Pengelola Properti Komersial',
    status: 'Active',
    budgetAllocated: 180000000,
    budgetSpent: 52000000,
    owner: 'Sinta Corcomm',
    priorityProduct: 'Turnkey Interior Fit-Out, Facade Revitalization & MEP Engineering Solutions',
    keyMessage: 'Solusi Rancang Bangun & Rekayasa Properti Andal Berstandar K3 Nasional',
    funnelStage: 'Consideration'
  }
];

export const INITIAL_TRENDS: Trend[] = [
  {
    id: 'trd-1',
    rank: 1,
    sector: 'Kuliner & F&B',
    categoryLabel: 'KULINER, F&B & RESTORAN',
    type: 'Topic',
    title: 'PISTACHIO KUNAFA CHOCOLATE & VIRAL CRISPY DESSERT',
    platform: 'TikTok & Instagram',
    region: 'Indonesia & Global',
    source: 'TikTok Viral Pulse & Google Food Trends',
    sourceUrl: 'https://trends.google.com/food-viral-chocolate',
    capturedAt: '2026-08-18T08:00:00Z',
    confidence: 98,
    verificationStatus: 'Verified',
    momentum: 'Peak',
    lifecycle: 'Peak',
    relevanceScore: 94,
    brandFitScore: 88,
    riskLevel: 'Low',
    growthRate: '+480% Spike',
    volumeMetric: '4.2M Mentions & Views',
    publishingWindow: 'Immediate (Peak Window 48h)',
    expirationDate: '2026-08-28',
    imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'trd-2',
    rank: 2,
    sector: 'Teknologi & AI',
    categoryLabel: 'TEKNOLOGI & AI ENTERPRISE',
    type: 'Topic',
    title: 'AUTONOMOUS AI AGENTS & WORKFLOW AUTOMATION FOR ENTERPRISE',
    platform: 'Google Search & LinkedIn',
    region: 'Indonesia & ASEAN',
    source: 'Gartner Tech Radar & LinkedIn B2B Signals',
    sourceUrl: 'https://gartner.com/enterprise-ai-agents',
    capturedAt: '2026-08-18T07:30:00Z',
    confidence: 96,
    verificationStatus: 'Verified',
    momentum: 'Rising',
    lifecycle: 'Rising',
    relevanceScore: 98,
    brandFitScore: 99,
    riskLevel: 'Low',
    growthRate: '+310% Growth',
    volumeMetric: '1.8M Commercial Queries',
    publishingWindow: '7 - 14 Hari ke Depan',
    expirationDate: '2026-09-30',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'trd-3',
    rank: 3,
    sector: 'Properti & Green Building',
    categoryLabel: 'GREEN BUILDING & ESG COMPLIANCE',
    type: 'Topic',
    title: 'GREENSHIP GBCI & NET-ZERO CARBON RETROFIT PADA GEDUNG TINGGI B2B',
    platform: 'LinkedIn & Industry Reports',
    region: 'Indonesia',
    source: 'Green Building Council Indonesia (GBCI) & Kementerian PUPR',
    sourceUrl: 'https://gbcindonesia.org/greenship-retrofit',
    capturedAt: '2026-08-18T06:45:00Z',
    confidence: 95,
    verificationStatus: 'Verified',
    momentum: 'Rising',
    lifecycle: 'Rising',
    relevanceScore: 96,
    brandFitScore: 97,
    riskLevel: 'Low',
    growthRate: '+240% Growth',
    volumeMetric: '950K B2B Impressions',
    publishingWindow: 'Agustus - Oktober 2026',
    expirationDate: '2026-10-31',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'trd-4',
    rank: 4,
    sector: 'Pariwisata, Travel & Hospitality',
    categoryLabel: 'PARIWISATA & HOSPITALITY',
    type: 'Topic',
    title: 'HIDDEN GEM ECO-RESORT & SUSTAINABLE TOURISM LABUAN BAJO',
    platform: 'Instagram & TikTok',
    region: 'Indonesia',
    source: 'Kemenparekraf Wonderful Indonesia Portal',
    sourceUrl: 'https://kemenparekraf.go.id/eco-tourism-trends',
    capturedAt: '2026-08-18T05:20:00Z',
    confidence: 93,
    verificationStatus: 'Verified',
    momentum: 'Rising',
    lifecycle: 'Rising',
    relevanceScore: 89,
    brandFitScore: 92,
    riskLevel: 'Low',
    growthRate: '+215% Spike',
    volumeMetric: '2.1M Organic Views',
    publishingWindow: '5 - 12 Hari ke Depan',
    expirationDate: '2026-09-10',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'trd-5',
    rank: 5,
    sector: 'Properti & Perkantoran',
    categoryLabel: 'COMMERCIAL OFFICE SPACE & TOD',
    type: 'Keyword',
    title: 'SEWA RUANG KANTOR GRADE-A & TRANSIT-ORIENTED DEVELOPMENT (TOD)',
    platform: 'Google Search & LinkedIn',
    region: 'Jabodetabek & Surabaya',
    source: 'Google Keyword Planner Engine & Colliers Property Insights',
    sourceUrl: 'https://colliers.com/indonesia/commercial-office-report',
    capturedAt: '2026-08-18T04:15:00Z',
    confidence: 94,
    verificationStatus: 'Verified',
    momentum: 'Peak',
    lifecycle: 'Peak',
    relevanceScore: 97,
    brandFitScore: 99,
    riskLevel: 'Low',
    growthRate: '+190% Intent',
    volumeMetric: '820K High-Intent Search',
    publishingWindow: 'Segera (Minggu Ini)',
    expirationDate: '2026-10-15',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'trd-6',
    rank: 6,
    sector: 'Fashion & Lifestyle',
    categoryLabel: 'FASHION, LIFESTYLE & BEAUTY',
    type: 'Topic',
    title: 'SKIN BARRIER REPAIR CREAM & CLEAN BEAUTY FORMULA',
    platform: 'TikTok & Instagram',
    region: 'Indonesia & Southeast Asia',
    source: 'Social Commerce & Beauty Trend Radar',
    sourceUrl: 'https://socialpulse.io/beauty-skincare-trends',
    capturedAt: '2026-08-18T03:40:00Z',
    confidence: 95,
    verificationStatus: 'Verified',
    momentum: 'Rising',
    lifecycle: 'Rising',
    relevanceScore: 86,
    brandFitScore: 84,
    riskLevel: 'Low',
    growthRate: '+275% Volume',
    volumeMetric: '3.5M Engagements',
    publishingWindow: '1 - 2 Minggu',
    expirationDate: '2026-09-20',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'trd-7',
    rank: 7,
    sector: 'Otomotif & Transportasi',
    categoryLabel: 'OTOMOTIF & GREEN FLEET',
    type: 'Topic',
    title: 'ELECTRIC VEHICLE CHARGING HUB & GREEN URBAN FLEET INDONESIA',
    platform: 'LinkedIn & Google Search',
    region: 'Indonesia',
    source: 'Gaikindo & PLN Electric Mobility Report',
    sourceUrl: 'https://gaikindo.or.id/ev-charging-2026',
    capturedAt: '2026-08-18T02:30:00Z',
    confidence: 91,
    verificationStatus: 'Verified',
    momentum: 'Rising',
    lifecycle: 'Rising',
    relevanceScore: 92,
    brandFitScore: 93,
    riskLevel: 'Low',
    growthRate: '+165% YoY',
    volumeMetric: '1.2M Searches',
    publishingWindow: 'Agustus 2026',
    expirationDate: '2026-10-01',
    imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'trd-8',
    rank: 8,
    sector: 'Kuliner & F&B',
    categoryLabel: 'SPECIALTY BEVERAGE & CAFE',
    type: 'Topic',
    title: 'CEREMONIAL GRADE MATCHA & AESTHETIC TEA CULTURE',
    platform: 'Instagram & TikTok',
    region: 'Jakarta, Bandung, Bali',
    source: 'Instagram Culinary Creators Index',
    sourceUrl: 'https://instagram.com/trends/matcha-culture',
    capturedAt: '2026-08-18T02:00:00Z',
    confidence: 92,
    verificationStatus: 'Verified',
    momentum: 'Peak',
    lifecycle: 'Peak',
    relevanceScore: 85,
    brandFitScore: 82,
    riskLevel: 'Low',
    growthRate: '+290% Engagement',
    volumeMetric: '2.8M Posts & Tags',
    publishingWindow: 'Immediate',
    expirationDate: '2026-08-31',
    imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'trd-9',
    rank: 9,
    sector: 'Fintech & Bisnis',
    categoryLabel: 'FINTECH & DIGITAL BANKING',
    type: 'Topic',
    title: 'EMBEDDED LENDING & B2B SUPPLY CHAIN FINANCING API',
    platform: 'LinkedIn & X (Twitter)',
    region: 'Indonesia',
    source: 'OJK & Fintech Association Indonesia (AFTECH)',
    sourceUrl: 'https://aftech.or.id/supply-chain-finance',
    capturedAt: '2026-08-18T01:30:00Z',
    confidence: 93,
    verificationStatus: 'Verified',
    momentum: 'Rising',
    lifecycle: 'Rising',
    relevanceScore: 94,
    brandFitScore: 95,
    riskLevel: 'Low',
    growthRate: '+145% Growth',
    volumeMetric: '640K B2B Queries',
    publishingWindow: 'September 2026',
    expirationDate: '2026-10-15',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'trd-10',
    rank: 10,
    sector: 'Teknologi & AI',
    categoryLabel: 'HYBRID WORKPLACE & CLOUD',
    type: 'Topic',
    title: 'WORKPLACE ERGONOMICS & SECURE CLOUD COLLABORATION HUB',
    platform: 'Google Search & LinkedIn',
    region: 'Indonesia',
    source: 'Tech in Asia & IDC Cloud Tracker',
    sourceUrl: 'https://techinasia.com/workplace-cloud-hub',
    capturedAt: '2026-08-18T01:00:00Z',
    confidence: 89,
    verificationStatus: 'Verified',
    momentum: 'Emerging',
    lifecycle: 'Emerging',
    relevanceScore: 91,
    brandFitScore: 92,
    riskLevel: 'Low',
    growthRate: '+130% Spike',
    volumeMetric: '780K Impressions',
    publishingWindow: '2 - 3 Minggu',
    expirationDate: '2026-09-30',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'trd-audio-1',
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
    id: 'trd-audio-2',
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
    name: 'Indonesia Green Building & Sustainable Architecture Summit 2026',
    organizer: 'Green Building Council Indonesia (GBCI) & Kementerian PUPR',
    category: 'Exhibition & Summit',
    dateStart: '2026-08-22',
    dateEnd: '2026-08-24',
    venue: 'Telkom Landmark Tower Grand Auditorium & Ballroom',
    city: 'Jakarta Selatan',
    isOnline: false,
    source: 'Official Press Release GBCI & PUPR #PR-2026-88',
    confidence: 98,
    verificationStatus: 'Verified',
    lastVerified: '2026-08-06T16:00:00Z',
    revalidationStatus: 'OK',
    version: 1
  },
  {
    id: 'evt-102',
    name: 'BUMN Property Expo & National Asset Monetization Forum 2026',
    organizer: 'Kementerian BUMN & Forum Sinergi Properti BUMN',
    category: 'National Forum & Exhibition',
    dateStart: '2026-08-18',
    dateEnd: '2026-08-19',
    venue: 'ICE BSD City Hall 3',
    city: 'Tangerang',
    isOnline: false,
    source: 'Kementerian BUMN Official Portal & Siaran Pers TelkomGroup',
    confidence: 95,
    verificationStatus: 'Verified',
    lastVerified: '2026-08-05T09:00:00Z',
    revalidationStatus: 'OK',
    version: 1
  }
];

export const INITIAL_EVIDENCES: Evidence[] = [
  {
    id: 'evd-1',
    sourceTitle: 'Laporan Audit Efisiensi Energi Smart BMS TelkomProperty 2025/2026',
    sourceUrl: 'https://telkomproperty.co.id/case-study/audit-energi-bms-2026.pdf',
    sourceType: 'Internal Approved Source',
    claimText: 'Implementasi Smart BMS TelkomProperty menurunkan konsumsi listrik chiller & HVAC sebesar 28.4% dan mereduksi emisi karbon hingga 420 ton CO2/tahun pada 15 gedung komersial.',
    verificationStatus: 'Verified',
    validityDate: '2026-12-31',
    confidenceScore: 98,
    reviewerNote: 'Diuji oleh Auditor Energi Tersertifikasi HAKE & Tim QA Teknis TelkomProperty.',
    lastVerifiedAt: '2026-08-01T10:00:00Z'
  },
  {
    id: 'evd-2',
    sourceTitle: 'Sertifikasi Bangunan Hijau Greenship GBCI & Penghargaan K3 Telkom Landmark Tower 2026',
    sourceUrl: 'https://telkomproperty.co.id/certification/greenship-gold-tlt.pdf',
    sourceType: 'Official Primary Source',
    claimText: 'Telkom Landmark Tower meraih predikat Greenship Tingkat Emas dari GBCI dan Zero-Accident K3 Nasional 5 tahun berturut-turut.',
    verificationStatus: 'Verified',
    validityDate: '2026-12-31',
    confidenceScore: 99,
    reviewerNote: 'Sertifikat Resmi GBCI #GBCI-GS-2026-012 dan Kepmenaker RI.',
    lastVerifiedAt: '2026-07-10T14:00:00Z'
  },
  {
    id: 'evd-3',
    sourceTitle: 'Katalog Master Optimalisasi 3.010 Aset Properti TelkomGroup 2026',
    sourceUrl: 'https://telkomproperty.co.id/portfolio/master-asset-monetization-2026.pdf',
    sourceType: 'Official Primary Source',
    claimText: 'TelkomProperty mengelola dan mengoptimalisasi lebih dari 3.010 aset properti strategis di 7 regional dengan skema sewa kantor, lifestyle hub, dan kemitraan strategis.',
    verificationStatus: 'Verified',
    validityDate: '2026-12-31',
    confidenceScore: 99,
    reviewerNote: 'Rencana Kerja & Anggaran Perusahaan (RKAP) PT Graha Sarana Duta 2026.',
    lastVerifiedAt: '2026-08-01T08:00:00Z'
  }
];

export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    campaignId: 'cmp-2026-01',
    title: 'Visual Storytelling: Gedung Konvensional vs Smart Green Building TelkomProperty',
    sourceType: 'Trend',
    sourceTitle: 'GREENSHIP GBCI & NET-ZERO CARBON RETROFIT PADA GEDUNG TINGGI B2B',
    businessAngle: 'Solusi terpadu pemangkasan OpEx listrik 28.4% dan sertifikasi Greenship bagi pemilik gedung komersial',
    audience: 'Building Owner, VP General Affair, COO, Facility Manager',
    relevanceScore: 96,
    momentumScore: 92,
    overallScore: 94,
    action: 'Produce Now',
    status: 'In Content Development',
    publishingWindow: '10 - 20 Agustus 2026',
    recommendedFormat: 'Carousel & Reels Storyboard'
  },
  {
    id: 'opp-2',
    campaignId: 'cmp-2026-02',
    title: 'Edukasi B2B: Kenapa Perusahaan Multinasional Beralih ke Gedung Bersertifikat Bangunan Hijau',
    sourceType: 'Event',
    sourceTitle: 'BUMN Property Expo & National Asset Monetization Forum 2026',
    businessAngle: 'Keunggulan lokasi Grade-A, sirkulasi udara higienis (IAQ), dan ekosistem digital terintegrasi di Telkom Landmark Tower',
    audience: 'Corporate Tenant, Head of Procurement, Country Manager Multinasional',
    relevanceScore: 91,
    momentumScore: 88,
    overallScore: 90,
    action: 'Produce Now',
    status: 'In Content Development',
    publishingWindow: '12 - 25 Agustus 2026',
    recommendedFormat: 'Infographic & Short Video'
  }
];

export const INITIAL_CONTENTS: ContentItem[] = [
  {
    id: 'cnt-101',
    campaignId: 'cmp-2026-01',
    opportunityId: 'opp-1',
    title: 'Gedung Konvensional vs Smart Green Building TelkomProperty: 5 Titik Kebocoran Biaya Listrik',
    objective: 'Mengedukasi C-Level tentang efisiensi operasional energi hingga 28.4%',
    audience: 'Building Owner, VP General Affair, COO, Facility Manager',
    platform: 'LinkedIn & Instagram',
    format: 'Carousel',
    status: 'IN REVIEW',
    pic: 'Nuroniah (Marcomm Lead)',
    currentVersionId: 'ver-101-v2',

    // Section A: STRATEGY
    campaignProgram: 'Smart & Green Building Solutions 2026',
    primaryObjective: 'Product Education',
    targetAudience: 'Building Owner, VP General Affair, COO, Facility Manager',
    contentPillar: 'Product Education',
    keyMessage: 'Smart BMS TelkomProperty memangkas 28.4% konsumsi listrik chiller HVAC & emisi karbon gedung dengan sensor IoT terintegrasi.',

    // Section B: CONTENT
    topicIdea: 'Gedung Konvensional vs Smart Green Building TelkomProperty: 5 Titik Kebocoran Biaya Listrik',
    contentFormat: 'Carousel',
    channel: 'LinkedIn',
    cta: 'Konsultasikan audit efisiensi energi gedung Anda via WA Sales TelkomProperty.',
    sourceReference: 'Laporan Audit Efisiensi Energi Smart BMS TelkomProperty 2025/2026 (evd-1)',

    // Section C: EXECUTION
    contentOwner: 'Marcomm',
    picName: 'Nuroniah',
    targetPublishDate: '2026-09-10',
    priority: 'Critical',

    // Section D: READINESS
    supportingAssetStatus: 'Asset Ready (High Res Infographic & Data Chart)',
    supportingDataEvidence: 'Audit Energi Sampel 15 Gedung Komersial (Verified evd-1)',
    readinessNotes: 'Slide 1-7 siap. Memerlukan checklist Brand Safety dan verifikasi klaim 28.4% sebelum final approval.',

    // Joint Review Status (Marcomm + Corcomm)
    marcommReviewStatus: 'Reviewed',
    marcommReviewer: 'Nuroniah (Marcomm Lead)',
    marcommReviewedAt: '2026-09-02T11:00:00Z',
    corcommReviewStatus: 'Reviewed',
    corcommReviewer: 'Sinta Corcomm',
    corcommReviewedAt: '2026-09-02T11:30:00Z',
    reviewChecklist: {
      brandSafety: true,
      factCheck: true,
      claimCheck: true,
      corporateTone: true
    },
    vpCorsecApproved: false,
    finalApproved: false,
    governanceComments: [
      {
        id: 'cmt-seed-1',
        authorName: 'Nuroniah (Marcomm Lead)',
        authorRole: 'ROLE_CREATOR',
        authorTitle: 'Marketing Communication Specialist',
        content: 'Draf visual carousel 7 slide telah diselaraskan dengan data audit energi chiller Telkom Landmark Tower (EVD-1). Siap ditinjau oleh Corcomm dan VP Corsec.',
        createdAt: '2026-09-02T11:00:00Z',
        type: 'creator_response'
      },
      {
        id: 'cmt-seed-2',
        authorName: 'Deni Hendrawan (VP Corsec)',
        authorRole: 'ROLE_VP_CORSEC',
        authorTitle: 'VP Corporate Secretary & Governance',
        content: 'Klaim penghematan 28.4% harus disertai disclaimer bintang (*) merujuk pada gedung tipikal komersial. Pastikan logo TelkomGroup mematuhi tata letak brand identity holding BUMN.',
        createdAt: '2026-09-02T13:45:00Z',
        type: 'vp_corsec_audit',
        category: 'Brand Safety & Reputasi Holding',
        urgency: 'Wajib Penyesuaian'
      }
    ]
  },
  {
    id: 'cnt-102',
    campaignId: 'cmp-2026-02',
    opportunityId: 'opp-2',
    title: '3 Alasan Kenapa Perusahaan Multinasional Beralih ke Gedung Bersertifikat Bangunan Hijau (Greenship)',
    objective: 'Mendorong Inbound Inquiry Sewa Ruang Kantor di Jaringan Gedung TelkomProperty',
    audience: 'Corporate Tenant, Country Manager Multinasional, Head of Procurement',
    platform: 'Instagram & TikTok',
    format: 'Reels/Shorts',
    status: 'IN REVIEW',
    pic: 'Budi Marcomm',
    currentVersionId: 'ver-102-v1',

    // Section A: STRATEGY
    campaignProgram: 'Office Space Leasing & Asset Monetization Q3-Q4',
    primaryObjective: 'Lead Generation',
    targetAudience: 'Corporate Tenant, Country Manager Multinasional, Head of Procurement',
    contentPillar: 'Conversion',
    keyMessage: 'Telkom Landmark Tower & Graha TelkomProperty tawarkan ruang kantor Grade-A bersertifikat Greenship Emas dengan sirkulasi udara higienis & efisiensi biaya utilitas.',

    // Section B: CONTENT
    topicIdea: '3 Alasan Kenapa Perusahaan Multinasional Beralih ke Gedung Bersertifikat Bangunan Hijau (Greenship)',
    contentFormat: 'Reels/Shorts',
    channel: 'Instagram',
    cta: 'Klik link di bio untuk virtual tour & konsultasi ketersediaan ruang kantor premium Q3-Q4.',
    sourceReference: 'Sertifikasi Bangunan Hijau Greenship GBCI Telkom Landmark Tower 2026 (evd-2)',

    // Section C: EXECUTION
    contentOwner: 'Marcomm',
    picName: 'Budi Marcomm',
    targetPublishDate: '2026-09-14',
    priority: 'High',

    // Section D: READINESS
    supportingAssetStatus: 'Script Finalized & B-Roll Drone Footage TLT Ready',
    supportingDataEvidence: 'Sertifikat Greenship GBCI #GBCI-GS-2026-012',
    readinessNotes: 'Produksi video pendek 30 detik untuk feed reels & shorts.',

    marcommReviewStatus: 'Reviewed',
    marcommReviewer: 'Nuroniah (Marcomm Lead)',
    marcommReviewedAt: '2026-09-02T10:00:00Z',
    corcommReviewStatus: 'Reviewed',
    corcommReviewer: 'Sinta Corcomm',
    corcommReviewedAt: '2026-09-02T10:30:00Z',
    reviewChecklist: {
      brandSafety: true,
      factCheck: true,
      claimCheck: true,
      corporateTone: true
    },
    vpCorsecApprovalStatus: 'Approved',
    vpCorsecApproved: true,
    vpCorsecApprover: 'Deni Hendrawan (VP Corsec)',
    vpCorsecApprovedAt: '2026-09-02T14:15:00Z',
    finalApprovalStatus: 'Pending',
    finalApproved: false,
    governanceComments: [
      {
        id: 'cmt-seed-102-1',
        authorName: 'Budi (Marcomm Video Creator)',
        authorRole: 'ROLE_CREATOR',
        authorTitle: 'Visual & Multimedia Specialist',
        content: 'Naskah video reels 30 detik menyoroti 3 pilar: Greenship Gold, filtrasi HEPA AC, dan pemangkasan biaya utilitas 22%. Aset video drone telah siap.',
        createdAt: '2026-09-02T10:30:00Z',
        type: 'creator_response'
      },
      {
        id: 'cmt-seed-102-2',
        authorName: 'Deni Hendrawan (VP Corsec)',
        authorRole: 'ROLE_VP_CORSEC',
        authorTitle: 'VP Corporate Secretary & Governance',
        content: 'Audit kepatuhan tata kelola selesai: Sertifikasi GBCI telah diverifikasi nomor register resminya. Narasi aman dari sisi hukum & citra holding BUMN. Direkomendasikan persetujuan akhir Plt. Dirut.',
        createdAt: '2026-09-02T14:15:00Z',
        type: 'vp_corsec_audit',
        category: 'Audit Klaim SLA & Fakta',
        urgency: 'Minor Redaksional'
      }
    ]
  },
  {
    id: 'cnt-103',
    campaignId: 'cmp-2026-01',
    opportunityId: 'opp-1',
    title: 'Panduan Strategis 2026: Optimalisasi Aset Properti Korporat & Konsep Smart Workspace Terpadu',
    objective: 'Peningkatan Thought Leadership & Lead Gen Organik Kemitraan Properti Komersial',
    audience: 'Direktur Fasilitas BUMN, Asset Manager Korporat, Real Estate Investor',
    platform: 'Article / Blog',
    format: 'Article',
    status: 'APPROVED',
    pic: 'Sinta Corcomm',
    currentVersionId: 'ver-103-v1',

    // Section A: STRATEGY
    campaignProgram: 'Smart & Green Building Solutions 2026',
    primaryObjective: 'Awareness',
    targetAudience: 'Direktur Fasilitas BUMN, Asset Manager Korporat, Real Estate Investor',
    contentPillar: 'Industry Insight',
    keyMessage: 'Monetisasi aset properti dan retrofit smart facility meningkatkan nilai valuasi portofolio gedung komersial secara berkelanjutan.',

    // Section B: CONTENT
    topicIdea: 'Panduan Strategis 2026: Optimalisasi Aset Properti Korporat & Konsep Smart Workspace Terpadu',
    contentFormat: 'Article',
    channel: 'Web Portal',
    cta: 'Unduh Whitepaper Lengkap Optimalisasi Properti di Portal Insight Resmi TelkomProperty.',
    sourceReference: 'Katalog Master Optimalisasi 3.010 Aset Properti TelkomGroup (evd-3)',

    // Section C: EXECUTION
    contentOwner: 'Joint Collaboration',
    picName: 'Sinta Corcomm',
    targetPublishDate: '2026-09-18',
    priority: 'Medium',

    // Section D: READINESS
    supportingAssetStatus: 'Whitepaper PDF & Article Draft 100% Ready',
    supportingDataEvidence: 'RKAP TelkomProperty 2026 #WP-2026-44',
    readinessNotes: 'Telah melalui Joint Review lengkap & persetujuan VP Corsec.',

    marcommReviewStatus: 'Reviewed',
    marcommReviewer: 'Nuroniah (Marcomm Lead)',
    marcommReviewedAt: '2026-09-01T15:00:00Z',
    corcommReviewStatus: 'Reviewed',
    corcommReviewer: 'Sinta Corcomm',
    corcommReviewedAt: '2026-09-02T09:30:00Z',
    reviewChecklist: {
      brandSafety: true,
      factCheck: true,
      claimCheck: true,
      corporateTone: true
    },
    vpCorsecApprovalStatus: 'Approved',
    vpCorsecApprover: 'Deni VP Corsec',
    finalApprovalStatus: 'Approved',
    finalApprover: 'Direktur Utama'
  },
  {
    id: 'cnt-104',
    campaignId: 'cmp-2026-02',
    opportunityId: 'opp-3',
    title: 'Kisah Sukses Tenant Korporat: 3 Tahun Berkantor di Telkom Landmark Tower dengan Efisiensi Maksimal',
    objective: 'Membangun Trust & Social Proof Kualitas Pengelolaan Gedung Grade-A TelkomProperty',
    audience: 'Corporate Tenant, Head of GA, Bisnis Multinasional',
    platform: 'Facebook & Instagram',
    format: 'Infographic',
    status: 'PUBLISHED',
    pic: 'Rian Regional (Regional Creator Jabar)',
    currentVersionId: 'ver-104-v1',
    publishedUrl: 'https://instagram.com/p/DF104_telpro',
    publishedAt: '2026-09-05T08:00:00Z',

    // Section A: STRATEGY
    campaignProgram: 'Office Space Leasing & Asset Monetization Q3-Q4',
    primaryObjective: 'Reputation & CSR',
    targetAudience: 'Corporate Tenant, Head of GA, Bisnis Multinasional',
    contentPillar: 'Customer Story',
    keyMessage: 'Nol downtime fasilitas mekanikal-elektrikal, efisiensi energi utilitas, dan ekosistem digital Grade-A di Telkom Landmark Tower.',

    // Section B: CONTENT
    topicIdea: 'Kisah Sukses Tenant Korporat: 3 Tahun Berkantor di Telkom Landmark Tower dengan Efisiensi Maksimal',
    contentFormat: 'Infographic',
    channel: 'Instagram',
    cta: 'Jadwalkan site tour dan konsultasikan sewa ruang kantor korporat Anda bersama tim TelkomProperty.',
    sourceReference: 'Survei Kepuasan Tenant (NPS) Telkom Landmark Tower 2026',

    // Section C: EXECUTION
    contentOwner: 'Regional',
    regionalUnit: 'Regional 3 - Jawa Barat',
    picRegional: 'Rian Regional',
    activityProgram: 'Showcase Portofolio Gedung Perkantoran Unggulan',
    location: 'Telkom Landmark Tower Jakarta & Graha Telkom Bandung',
    activityDate: '2026-08-25',
    supportingAsset: 'Foto Interior Kantor & Sertifikat Greenship (Verified)',
    requestedPublishDate: '2026-09-05',
    picName: 'Rian Regional',
    targetPublishDate: '2026-09-05',
    priority: 'Medium',

    // Section D: READINESS
    supportingAssetStatus: 'Published & Live on Social',
    supportingDataEvidence: 'Form Persetujuan Publikasi Brand Mitra Tenant',
    readinessNotes: 'Dipublikasikan serentak di Instagram & Facebook regional.',

    // Post-Publish Stage 1: MONITORING
    postPublish: {
      stage: 'MONITORING',
      targetAccount: '@telkomproperty',
      publishedAt: '2026-09-05T08:00:00Z',
      metrics: {
        impressions: 14200,
        reach: 9800,
        engagementRate: 4.6,
        inboundLeads: 12,
        linkClicks: 94,
        saveRate: 7.2,
        shares: 38,
        comments: 19
      }
    }
  },
  {
    id: 'cnt-107-pub',
    campaignId: 'cmp-2026-01',
    title: 'Smart BMS TelkomProperty: Pangkas Biaya Listrik & AC Gedung Perkantoran hingga 28.4%',
    objective: 'Menghasilkan Inbound Leads dari Manajer Operasional & Pemilik Gedung Komersial',
    audience: 'Building Manager, GA Enterprise & Property Owners',
    platform: 'Instagram',
    format: 'Carousel',
    status: 'PUBLISHED',
    pic: 'Nuroniah (Marcomm Lead)',
    currentVersionId: 'ver-107-v1',
    publishedUrl: 'https://instagram.com/p/DF107_telpro',
    publishedAt: '2026-09-04T10:00:00Z',
    campaignProgram: 'Smart & Green Building Solutions 2026',
    primaryObjective: 'Product Education',
    targetAudience: 'Building Manager, GA Enterprise & Property Owners',
    contentPillar: 'Product Education',
    keyMessage: 'Sensor cerdas IoT BMS TelkomProperty otomatis mengatur suhu pendingin & pencahayaan gedung sesuai okupansi ruangan.',
    topicIdea: 'Smart BMS TelkomProperty: Pangkas Biaya Listrik & AC Gedung Perkantoran hingga 28.4%',
    contentFormat: 'Carousel',
    channel: 'Instagram',
    cta: 'Klik tautan di bio untuk jadwalkan konsultasi audit energi gratis gedung Anda.',
    contentOwner: 'Marcomm',
    picName: 'Nuroniah',
    targetPublishDate: '2026-09-04',
    priority: 'Critical',

    // Post-Publish Stage 2: AMPLIFICATION (YES Pathway)
    postPublish: {
      stage: 'AMPLIFICATION',
      targetAccount: '@telprodico',
      publishedAt: '2026-09-04T10:00:00Z',
      metrics: {
        impressions: 28400,
        reach: 19500,
        engagementRate: 5.8,
        inboundLeads: 24,
        linkClicks: 210,
        saveRate: 9.4,
        shares: 72,
        comments: 36
      },
      optimizationNeeded: true,
      amplificationTactics: {
        storyRepost: true,
        boostAds: true,
        buzzComments: true,
        budgetEstimate: 1200000,
        notes: 'Targeting Meta Ads ke GA & Procurement di area Jabodetabek & Surabaya.',
        startedAt: '2026-09-05T09:00:00Z'
      }
    }
  },
  {
    id: 'cnt-108-pub',
    campaignId: 'cmp-2026-01',
    title: 'Penerapan Standar Dekarbonisasi & ESG Telkom Group di Menara Landmark',
    objective: 'Memperkuat Reputasi BUMN Hijau dan Kepemimpinan Keberlanjutan Korporasi',
    audience: 'Regulator, Analis ESG, Stakeholder BUMN',
    platform: 'Instagram',
    format: 'Infographic',
    status: 'PUBLISHED',
    pic: 'Sinta Corcomm',
    currentVersionId: 'ver-108-v1',
    publishedUrl: 'https://instagram.com/p/DF108_telkomprop',
    publishedAt: '2026-09-03T14:00:00Z',
    campaignProgram: 'TelkomProperty Green Building Initiative',
    primaryObjective: 'Reputation & CSR',
    targetAudience: 'Regulator, Analis ESG, Stakeholder BUMN',
    contentPillar: 'Corporate / Reputation',
    keyMessage: 'Sertifikasi Green Building Greenship Gold membuktikan komitmen nyata dekarbonisasi.',
    topicIdea: 'Penerapan Standar Dekarbonisasi & ESG Telkom Group di Menara Landmark',
    contentFormat: 'Infographic',
    channel: 'Instagram',
    cta: 'Pelajari inisiatif ESG kami di sustainability.telpro.co.id',
    contentOwner: 'Corcomm',
    picName: 'Sinta Corcomm',
    targetPublishDate: '2026-09-03',
    priority: 'High',

    // Post-Publish Stage 2: BEST PRACTICE (NO Pathway)
    postPublish: {
      stage: 'BEST_PRACTICE',
      targetAccount: '@telkomproperty',
      publishedAt: '2026-09-03T14:00:00Z',
      metrics: {
        impressions: 22100,
        reach: 15400,
        engagementRate: 6.2,
        inboundLeads: 8, // inquiries
        linkClicks: 140,
        saveRate: 11.2,
        shares: 64,
        comments: 42
      },
      optimizationNeeded: false,
      isDocumentedBestPractice: true,
      bestPracticeNotes: 'Struktur visual data-driven dengan diagram sertifikasi terbukti menghasilkan sentimen 98% positif dan save rate di atas rata-rata benchmark industri.'
    }
  },
  {
    id: 'cnt-109-pub',
    campaignId: 'cmp-2026-02',
    title: 'Transformasi Ruang Kerja Fleksibel: Tren Flex-Space B2B Pasca 2025',
    objective: 'Edukasi Pasar Coworking & Private Office B2B',
    audience: 'Founder Startup & HR Director',
    platform: 'Instagram',
    format: 'Carousel',
    status: 'PUBLISHED',
    pic: 'Budi Marcomm',
    currentVersionId: 'ver-109-v1',
    publishedUrl: 'https://instagram.com/p/DF109_telpro',
    publishedAt: '2026-08-28T09:00:00Z',
    contentOwner: 'Marcomm',
    picName: 'Budi Marcomm',
    targetPublishDate: '2026-08-28',
    priority: 'Medium',

    // Post-Publish Stage 3: RECORDED FOR REPORT
    postPublish: {
      stage: 'RECORDED_FOR_REPORT',
      targetAccount: '@telprodico',
      publishedAt: '2026-08-28T09:00:00Z',
      metrics: {
        impressions: 18900,
        reach: 12800,
        engagementRate: 4.8,
        inboundLeads: 16,
        linkClicks: 112,
        saveRate: 6.5,
        shares: 28,
        comments: 21
      },
      recordedInReport: true,
      recordedAt: '2026-09-02T16:00:00Z'
    }
  },
  {
    id: 'cnt-110-pub',
    campaignId: 'cmp-2026-01',
    title: 'Kunjungan Kerja Direksi Holding & Penguatan Sinergi Aset Properti Nasional',
    objective: 'Pemberitaan Resmi & Kepemimpinan Korporasi',
    audience: 'Karyawan Internal Telkom Group, Mitra Bisnis BUMN',
    platform: 'Instagram',
    format: 'Carousel',
    status: 'PUBLISHED',
    pic: 'Sinta Corcomm',
    currentVersionId: 'ver-110-v1',
    publishedUrl: 'https://instagram.com/p/DF110_telkomprop',
    publishedAt: '2026-08-24T11:00:00Z',
    contentOwner: 'Corcomm',
    picName: 'Sinta Corcomm',
    targetPublishDate: '2026-08-24',
    priority: 'High',

    // Post-Publish Stage 4 & 5: MONTHLY EVALUATION COMPLETE (Keep Current / Tweak Strategy)
    postPublish: {
      stage: 'CLOSED_LOOP_COMPLETED',
      targetAccount: '@telkomproperty',
      publishedAt: '2026-08-24T11:00:00Z',
      metrics: {
        impressions: 16400,
        reach: 11200,
        engagementRate: 5.1,
        inboundLeads: 5,
        linkClicks: 85,
        saveRate: 5.8,
        shares: 44,
        comments: 29
      },
      recordedInReport: true,
      monthlyEvaluation: {
        evaluatedAt: '2026-09-01T14:30:00Z',
        strategyDecision: 'TWEAK_STRATEGY',
        tweakNotes: 'Sertakan infografis data pendukung sinergi aset pada slide ke-2 agar engagement audiens eksternal meningkat.',
        nextMonthAction: 'Liputan kolaborasi monetisasi aset regional semester II.',
        evaluatedBy: 'Sinta Corcomm & Nuroniah Marcomm'
      }
    }
  },
  {
    id: 'cnt-105',
    campaignId: 'cmp-2026-04',
    title: 'Aktivasi Fasilitas NeuCentrIX Green Data Center Graha TelkomProperty Kebon Sirih: PUE 1.35',
    objective: 'Menampilkan keunggulan fasilitas Green Data Center MEP & Power Tier-3 untuk enterprise',
    audience: 'CTO & Infrastructure Head Perbankan / Fintech',
    platform: 'LinkedIn',
    format: 'Carousel',
    status: 'PLANNED',
    pic: 'Nuroniah (Marcomm Lead)',
    currentVersionId: 'ver-105-v1',

    // Section A: STRATEGY
    campaignProgram: 'Property Development & Project Solution Excellence',
    primaryObjective: 'Consideration',
    targetAudience: 'CTO & Infrastructure Head Perbankan / Fintech',
    contentPillar: 'Product Education',
    keyMessage: 'Graha TelkomProperty Kebon Sirih hadirkan fasilitas Tier-3 dengan sistem pendingin presisi hemat energi dan efisiensi PUE 1.35.',

    // Section B: CONTENT
    topicIdea: 'Aktivasi Fasilitas NeuCentrIX Green Data Center Graha TelkomProperty Kebon Sirih: PUE 1.35',
    contentFormat: 'Carousel',
    channel: 'LinkedIn',
    cta: 'Jadwalkan Site Visit & Executive Tour Graha TelkomProperty bersama Account Manager.',
    sourceReference: 'Sertifikasi Green Data Center PUE & ISO 27001 (evd-2)',

    // Section C: EXECUTION
    contentOwner: 'Regional',
    regionalUnit: 'Regional 2 - Jabodetabek',
    picRegional: 'Dewi Kartika (PIC Reg 2)',
    activityProgram: 'Peresmian Green Server Room Graha TelkomProperty',
    location: 'Graha TelkomProperty Kebon Sirih, Jakarta Pusat',
    activityDate: '2026-09-02',
    supportingAsset: 'Foto Fasilitas Server Room & PDU Meter',
    requestedPublishDate: '2026-09-22',
    picName: 'Nuroniah',
    targetPublishDate: '2026-09-22',
    priority: 'Critical',

    // Section D: READINESS
    supportingAssetStatus: 'Curated from Regional Submission reg-sub-003',
    supportingDataEvidence: 'Dokumen Sertifikasi PUE 1.35',
    readinessNotes: 'Hasil kurasi Regional Inbox. Siap masuk tahap produksi visual carousel.',

    marcommReviewStatus: 'Pending',
    corcommReviewStatus: 'Pending',
    reviewChecklist: {
      brandSafety: false,
      factCheck: false,
      claimCheck: false,
      corporateTone: false
    }
  },
  {
    id: 'cnt-106',
    campaignId: 'cmp-2026-03',
    title: 'Transformasi Lobby Gedung Kantor Menjadi Lifestyle Hub & Indicafe Modern',
    objective: 'Mengedukasi tenant & mitra retail mengenai konsep modern workspace ekosistem TelkomProperty',
    audience: 'Tenant Gedung, Pelaku Usaha Retail F&B, Pekerja Komersial Modern',
    platform: 'YouTube & Instagram',
    format: 'Video Storyboard',
    status: 'PLANNED',
    pic: 'Sinta Corcomm',
    currentVersionId: 'ver-106-v1',

    // Section A: STRATEGY
    campaignProgram: 'Integrated Facility Management & Retail Hub 2026',
    primaryObjective: 'Awareness',
    targetAudience: 'Tenant Gedung, Pelaku Usaha Retail F&B, Pekerja Komersial Modern',
    contentPillar: 'Customer Story',
    keyMessage: 'Revitalisasi lantai dasar gedung perkantoran menghadirkan Indicafe (Kopi Teman Kerja), Smart Locker, dan community space yang nyaman.',

    // Section B: CONTENT
    topicIdea: 'Transformasi Lobby Gedung Kantor Menjadi Lifestyle Hub & Indicafe Modern',
    contentFormat: 'Video Storyboard',
    channel: 'YouTube',
    cta: 'Pelajari konsep Lifestyle Hub & kemitraan retail TelkomProperty di telkomproperty.co.id',
    sourceReference: 'Press Release Peluncuran Indicafe & SwaMart TelkomProperty 2026',

    // Section C: EXECUTION
    contentOwner: 'Corcomm',
    picName: 'Sinta Corcomm',
    targetPublishDate: '2026-09-25',
    priority: 'High',

    // Section D: READINESS
    supportingAssetStatus: 'Footage Drone & Video B-Roll Disetujui',
    supportingDataEvidence: 'MoU Kemitraan Retail & Tenant TelkomProperty 2026',
    readinessNotes: 'Storyboard 6 scene sedang disusun di AI Video Studio.',

    marcommReviewStatus: 'Pending',
    corcommReviewStatus: 'Pending',
    reviewChecklist: {
      brandSafety: false,
      factCheck: false,
      claimCheck: false,
      corporateTone: false
    }
  }
];

export const INITIAL_CONTENT_VERSIONS: ContentVersion[] = [
  {
    id: 'ver-101-v2',
    contentId: 'cnt-101',
    versionNumber: 2,
    brief: 'Carousel 7 slide yang membahas perbandingan biaya operasional energi gedung konvensional vs Smart Green Building TelkomProperty.',
    hook: 'Apakah Gedung Komersial Anda Menyimpan Kebocoran Biaya Listrik AC hingga 28% Setiap Bulan?',
    caption: 'Dalam pengelolaan gedung tinggi modern, sistem tata udara (chiller & HVAC) menyumbang lebih dari 60% tagihan listrik operasional.\n\nSmart Building Management System (BMS) TelkomProperty mengintegrasikan sensor IoT okupansi, otomasi suhu cerdas, dan predictive maintenance dalam satu platform terpusat.\n\nBerdasarkan audit teknis TelkomProperty 2026, implementasi Smart BMS berhasil memangkas 28.4% konsumsi energi dan mereduksi 420 ton CO2/tahun.\n\nKonsultasikan audit efisiensi energi gedung Anda bersama tim expert TelkomProperty sekarang juga!\n\n#TelkomProperty #SmartBuilding #GreenBuilding #BMS #EfisiensiEnergi #ESGIndonesia',
    script: 'Slide 1: Cover Hook High Contrast - Gedung Hijau.\nSlide 2: Masalah #1 Chiller Beroperasi Beban Penuh Saat Ruangan Kosong.\nSlide 3: Masalah #2 Ketidakseimbangan Suhu & Kualitas Udara (IAQ).\nSlide 4: Solusi IoT Smart BMS TelkomProperty.\nSlide 5: Grafik Bukti Audit Efisiensi Listrik 28.4% (Evidence Verified).\nSlide 6: Reduksi Emisi Karbon & Menuju Greenship GBCI.\nSlide 7: CTA Hubungi Sales / Konsultasi Audit Energi Gedung.',
    cta: 'Call Center: 1500 473 | WA: +62811 150 4739 (chat only) | Email: info@telkomproperty.co.id | Graha TelkomProperty, Jl. Kebon Sirih No. 10-12, Jakarta Pusat 10110',
    selectedKeywords: ['Smart Building', 'BMS IoT', 'Green Building GBCI', 'Efisiensi Energi Gedung'],
    selectedHashtags: ['#TelkomProperty', '#SmartBuilding', '#GreenBuilding', '#NetZeroCarbon'],
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
    brief: 'Reels edukasi 30 detik untuk corporate tenant & multinasional mengenai keunggulan ruang kantor hijau.',
    hook: 'Cari Ruang Kantor Grade-A di Jakarta Selatan yang Siap Dukung Target Net-Zero Korporasi Anda?',
    caption: 'Bukan sekadar lokasi prestisius di koridor Gatot Subroto. Telkom Landmark Tower (TLT) menghadirkan sertifikasi Greenship Emas, efisiensi energi, kualitas udara dalam ruangan optimal, serta konektivitas serat optik terintegrasi.\n\nJadikan kantor perusahaan Anda kebanggaan karyawan dan wujud nyata komitmen ESG!\n\nKlik link di bio untuk virtual tour & ketersediaan lantai.',
    script: '00-05s: Drone shot spektakuler Telkom Landmark Tower (TLT).\n05-15s: Interior premium Grade-A, sirkulasi udara higienis & ruang kerja kolaboratif.\n15-25s: Sertifikasi Greenship GBCI Emas & fasilitas penunjang (Indicafe, Masjid, Retail Hub).\n25-30s: CTA Hubungi Marketing TelkomProperty.',
    cta: 'Call Center: 1500 473 | WA: +62811 150 4739 (chat only) | Email: info@telkomproperty.co.id | Graha TelkomProperty, Jl. Kebon Sirih No. 10-12, Jakarta Pusat 10110',
    selectedKeywords: ['Sewa Kantor Jakarta', 'Telkom Landmark Tower', 'Office Space Grade A', 'Greenship Gold'],
    selectedHashtags: ['#TelkomLandmarkTower', '#OfficeForLease', '#TelkomProperty', '#JakartaOffice'],
    selectedAudio: 'Viral Beat Sunset Chill Electronic',
    audioRightsStatus: 'Needs Rights Verification',
    createdBy: 'Nuroniah (Marcom Lead)',
    createdAt: '2026-08-06T15:00:00Z',
    aiAssisted: true,
    evidenceIds: ['evd-2'],
    riskLevel: 'Medium'
  },
  {
    id: 'ver-103-v1',
    contentId: 'cnt-103',
    versionNumber: 1,
    brief: 'Artikel mendalam wawasan industri: Optimalisasi 3.010 aset properti korporat untuk meningkatkan nilai tambah bisnis.',
    hook: 'Monetisasi Aset Properti Korporat 2026: Strategi Mengubah Dead Capital Menjadi Pendapatan Berkelanjutan',
    caption: 'TelkomProperty membagikan kerangka kerja strategis optimalisasi lebih dari 3.010 aset di seluruh Indonesia melalui pendekatan Smart Asset Monetization, Green Retrofit, dan Transit-Oriented Hub.\n\nUnduh whitepaper lengkapnya di portal wawasan resmi TelkomProperty.',
    script: 'Struktur Artikel:\n1. Lanskap Industri Properti Komersial Indonesia 2026.\n2. Mengidentifikasi Underutilized Asset dalam Portofolio Korporat.\n3. Model Monetisasi: Commercial Leasing, Retail Hub, hingga NeuCentrIX Hub.\n4. Integrasi Standar ESG & Greenship Retrofit.\n5. Studi Kasus dan Roadmap Kemitraan Bersama TelkomProperty.',
    cta: 'Call Center: 1500 473 | WA: +62811 150 4739 (chat only) | Email: info@telkomproperty.co.id | Graha TelkomProperty, Jl. Kebon Sirih No. 10-12, Jakarta Pusat, 10110',
    selectedKeywords: ['Optimalisasi Aset', 'Monetisasi Properti', 'TelkomProperty Insight', 'Asset Management'],
    selectedHashtags: ['#TelkomPropertyInsight', '#AssetMonetization', '#PropertyManagement'],
    selectedAudio: 'None',
    audioRightsStatus: 'Verified for Intended Use',
    createdBy: 'Rian Febrian (Strategy Specialist)',
    createdAt: '2026-08-07T09:00:00Z',
    aiAssisted: true,
    evidenceIds: ['evd-3'],
    riskLevel: 'Low'
  },
  {
    id: 'ver-104-v1',
    contentId: 'cnt-104',
    versionNumber: 1,
    brief: 'Infografis testimoni kepuasan tenant korporat di Menara Telkom Landmark.',
    hook: '3 Tahun Tanpa Kendala Fasilitas: Mengapa Brand Multinasional Memilih Menetap di Telkom Landmark Tower',
    caption: 'Keandalan infrastruktur mekanikal-elektrikal, layanan Integrated Facility Management 24/7, dan efisiensi utilitas menjadikan Telkom Landmark Tower pilihan utama tenant global.\n\nTemukan ruang kantor ideal bagi ekspansi bisnis Anda bersama TelkomProperty!',
    script: 'Infografis Visual 4 Panel:\nPanel 1: Kebutuhan Ruang Kerja Berkelanjutan Berstandar Global.\nPanel 2: Fasilitas Grade-A & Zero-Accident K3 Telkom Landmark Tower.\nPanel 3: Efisiensi Biaya Utilitas 20%+ dan Kenyamanan Karyawan.\nPanel 4: Jadwalkan Site Visit & Konsultasi Sewa Ruang Kantor.',
    cta: 'Call Center: 1500 473 | WA: +62811 150 4739 (chat only) | Email: info@telkomproperty.co.id | Graha TelkomProperty, Jl. Kebon Sirih No. 10-12, Jakarta Pusat, 10110',
    selectedKeywords: ['Tenant Testimonial', 'Office Space Jakarta', 'Telkom Landmark Tower'],
    selectedHashtags: ['#TelkomProperty', '#TLTJakarta', '#OfficeSpaceRental'],
    selectedAudio: 'None',
    audioRightsStatus: 'Verified for Intended Use',
    createdBy: 'Dewi Lestari (Compliance Lead)',
    createdAt: '2026-08-08T11:00:00Z',
    aiAssisted: true,
    evidenceIds: ['evd-2'],
    riskLevel: 'Low'
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
    comment: 'Draft brief, hook, script carousel Smart Building BMS disiapkan dan diajukan ke pipeline.',
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
    comment: 'Klaim efisiensi listrik 28.4% dan reduksi emisi 420 ton CO2 telah dicocokkan dengan Laporan Audit EVD-1. Terverifikasi.',
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
    comment: 'Hook tajam, narasi mendukung KPI MQL Smart & Green Building Solutions. Lanjutkan ke VP Marketing.',
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
    activityName: 'Meta & LinkedIn Sponsored Content (Smart & Green Building)',
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
    activityName: 'Produksi Carousel & Video Storyboard Studio TelkomProperty',
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
    activityName: 'Google Search Keyword Ads (Office Space Leasing TLT)',
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
        sceneObjective: 'Hook Masalah Beban Listrik AC Gedung',
        visualDescription: 'Wide shot fasad gedung komersial bertingkat tinggi di siang hari yang terik dengan unit chiller rooftop beroperasi keras.',
        shotType: 'Wide Shot',
        cameraAngle: 'Low Angle',
        cameraMovement: 'Static',
        lighting: 'Bright Direct Sunlight',
        voiceOver: 'Apakah tagihan listrik pendingin udara gedung komersial Anda terus membengkak setiap bulannya?',
        onScreenText: '60% Beban Listrik Gedung = Chiller & AC 🛑',
        audioNote: 'Corporate Precision Motion Synth (Upbeat start)',
        generatedImageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
        representationStatus: 'ACTUAL ASSET WITH AI MOTION',
        reviewStatus: 'Approved'
      },
      {
        id: 'sc-2',
        sceneNumber: 2,
        duration: 5,
        sceneObjective: 'Solusi Smart BMS TelkomProperty',
        visualDescription: 'Close-up panel sensor IoT BMS TelkomProperty terpasang rapi di koridor lantai perkantoran dengan status indikator aktif hijau.',
        shotType: 'Close Up',
        cameraAngle: 'Eye Level',
        cameraMovement: 'Dolly Push-in',
        lighting: 'Accent Cyan Spotlight',
        voiceOver: 'Dengan Smart BMS TelkomProperty, temperatur dan sirkulasi udara diatur otomatis berdasarkan tingkat hunian riil.',
        onScreenText: 'Smart BMS IoT 24/7 Energy Optimization 📡',
        audioNote: 'Subtle Tech Ping Sound Effect',
        generatedImageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
        representationStatus: 'AI-ASSISTED COMPOSITE',
        reviewStatus: 'Approved'
      },
      {
        id: 'sc-3',
        sceneNumber: 3,
        duration: 5,
        sceneObjective: 'Bukti Hasil Audit Energi 28.4%',
        visualDescription: 'Facility Manager gedung memegang tablet yang menampilkan TelkomProperty Smart Energy Dashboard dengan kurva efisiensi turun.',
        shotType: 'Medium Shot',
        cameraAngle: 'Eye Level',
        cameraMovement: 'Handheld',
        lighting: 'Warm Soft Interior',
        voiceOver: 'Konsumsi energi terpangkas 28.4% dan emisi karbon berkurang hingga 420 ton per tahun.',
        onScreenText: 'Efisiensi Energi 28.4% Terverifikasi ✔️',
        audioNote: 'Data Rise Sound Effect',
        generatedImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
        representationStatus: 'ACTUAL VERIFIED ASSET',
        reviewStatus: 'Approved'
      },
      {
        id: 'sc-4',
        sceneNumber: 4,
        duration: 4,
        sceneObjective: 'CTA Konsultasi TelkomProperty',
        visualDescription: 'Gedung Telkom Landmark Tower megah di sore hari dengan logo TelkomProperty dan teks kontak resmi.',
        shotType: 'Medium Shot',
        cameraAngle: 'Low Angle',
        cameraMovement: 'Pan',
        lighting: 'Natural Golden Hour',
        voiceOver: 'Wujudkan green building berstandar internasional bersama TelkomProperty. Jadwalkan audit energi gedung Anda sekarang.',
        onScreenText: 'Hubungi Tim Solusi TelkomProperty 🚀',
        audioNote: 'Audio Synth Outro & Logo Stinger',
        generatedImageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
        representationStatus: 'ACTUAL VERIFIED ASSET',
        reviewStatus: 'Approved'
      }
    ]
  }
];

export const INITIAL_MASTER_TAXONOMY: MasterTaxonomy = {
  campaigns: [
    'Smart & Green Building Solutions 2026',
    'Office Space Leasing & Asset Monetization Q3-Q4',
    'Integrated Facility Management & Retail Hub 2026',
    'Property Development & Project Solution Excellence'
  ],
  objectives: [
    'Brand Awareness',
    'Engagement',
    'Consideration',
    'Lead Generation',
    'Reputation & CSR',
    'Product Education'
  ],
  audienceCategories: [
    'Building Owners & Property Developers',
    'Corporate Tenants & Multinational Executives',
    'Enterprise Procurement & General Affair (GA)',
    'Government & BUMN Facility Directors',
    'Facility Managers & MEP Engineers'
  ],
  contentPillars: [
    'Industry Insight',
    'Product Education',
    'Customer Story',
    'Corporate / Reputation',
    'Engagement',
    'Conversion'
  ],
  formats: [
    'Carousel',
    'Reels/Shorts',
    'Infographic',
    'Article',
    'Video Storyboard'
  ],
  channels: [
    'LinkedIn',
    'Instagram',
    'TikTok',
    'YouTube',
    'X (Twitter)',
    'Web Portal'
  ],
  priorities: [
    'Critical',
    'High',
    'Medium',
    'Low'
  ]
};

export const INITIAL_REGIONAL_SUBMISSIONS: RegionalSubmission[] = [
  // REGIONAL 1
  {
    id: 'reg-sub-001',
    regional: 'Regional 1',
    topic: 'Retrofit Green Building & Rooftop Solar PV 120 kWp Menara Telkom Medan',
    activity: 'Pemasangan Solar Panel Rooftop & Integrasi IoT BMS Efisiensi Energi',
    location: 'Menara Telkom Medan, Sumatera Utara',
    activityDate: '2026-09-04',
    requestedPublishDate: '2026-09-10',
    picRegional: 'Regional 1 - Creator',
    supportingAssetStatus: 'Available',
    supportingAssetUrl: 'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?w=600&auto=format&fit=crop&q=80',
    supportingDocumentName: 'Berita_Acara_Aktivasi_Solar_PV_2026.pdf',
    submissionDate: '2026-09-01',
    currentStatus: 'SUBMITTED TO MARCOMM',
    contentPillarSuggestion: 'Product Education',
    targetAudience: 'Building Owners, Manajer Kawasan Bisnis Sumatera & ESG Practitioners',
    submissionTrack: 'MONTHLY_AGENDA',
    brandTarget: '@telkomproperty',
    editorialSlotStatus: 'QUEUED_FOR_MEETING'
  },
  {
    id: 'reg-sub-001b',
    regional: 'Regional 1',
    topic: 'Monetisasi Aset Gedung Telkom Sudirman Pekanbaru Menjadi Creative Office Hub',
    activity: 'Revitalisasi Eks-Kantor Telkom Menjadi Ruang Kerja Bersama & Retail Terpadu',
    location: 'Plaza Telkom Sudirman, Pekanbaru',
    activityDate: '2026-08-29',
    requestedPublishDate: '2026-09-11',
    picRegional: 'Regional 1 - Creator',
    supportingAssetStatus: 'Pending Upload',
    supportingDocumentName: 'Laporan_Kajian_Kelayakan_Monetisasi_Pekanbaru.pdf',
    submissionDate: '2026-08-30',
    currentStatus: 'REVISION REQUESTED',
    revisionNotes: 'Catatan Marcomm: Mohon lampirkan proyeksi okupansi tenant retail F&B dan foto render 3D fasad modern yang telah disetujui VP Properti.',
    contentPillarSuggestion: 'Industry Insight',
    targetAudience: 'Pelaku Usaha Lokal, Investor Properti Komersial & Startup Riau',
    submissionTrack: 'FAST_TRACK_URGENT',
    brandTarget: '@telkomproperty',
    editorialSlotStatus: 'BUFFER_READY'
  },
  {
    id: 'reg-sub-001c',
    regional: 'Regional 1',
    topic: 'Optimalisasi Aset Lahan Strategis Palembang: Kemitraan Commercial Lifestyle Hub',
    activity: 'Pencanangan Proyek Sentra Kuliner & Retail Modern di Atas Lahan Aset Telkom',
    location: 'Kawasan Bisnis Veteran, Palembang',
    activityDate: '2026-08-22',
    requestedPublishDate: '2026-09-05',
    picRegional: 'Regional 1 - Creator',
    supportingAssetStatus: 'Verified',
    supportingAssetUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
    supportingDocumentName: 'MoU_Kemitraan_Retail_Hub_Palembang.pdf',
    submissionDate: '2026-08-23',
    currentStatus: 'ACCEPTED',
    contentPillarSuggestion: 'Community Impact',
    targetAudience: 'Mitra Retail Komersial, Pengusaha F&B & Komunitas Palembang',
    submissionTrack: 'MONTHLY_AGENDA',
    brandTarget: '@telkomproperty',
    editorialSlotStatus: 'ALLOCATED_TO_SLOT',
    convertedContentId: 'cnt-106'
  },
  {
    id: 'reg-sub-001d',
    regional: 'Regional 1',
    topic: 'Draf: Program Pengelolaan Limbah Gedung & Zero Plastic Policy Regional 1',
    activity: 'Implementasi Waste Management Terpadu & Audit K3 di 12 Gedung Perkantoran Sumatera',
    location: 'Gedung-Gedung TelkomProperty Regional Sumatera',
    activityDate: '2026-09-07',
    requestedPublishDate: '2026-09-20',
    picRegional: 'Regional 1 - Creator',
    supportingAssetStatus: 'Draft Ready',
    supportingDocumentName: 'Draft_Proposal_Waste_Management.docx',
    submissionDate: '2026-09-06',
    currentStatus: 'REGIONAL DRAFT',
    contentPillarSuggestion: 'Corporate / Reputation',
    targetAudience: 'Tenant Gedung, Tim Pengelola Fasilitas & Stakeholder Lingkungan Hidup'
  },

  // REGIONAL 2
  {
    id: 'reg-sub-003',
    regional: 'Regional 2',
    topic: 'Aktivasi Data Center Tier-3 Hijau Graha TelkomProperty Kebon Sirih',
    activity: 'Peresmian Fasilitas Server Efisiensi Energi PUE 1.35 & Pendingin Presisi',
    location: 'Graha TelkomProperty, Jl. Kebon Sirih No. 10-12, Jakarta Pusat',
    activityDate: '2026-09-02',
    requestedPublishDate: '2026-09-15',
    picRegional: 'Regional 2 - Creator',
    supportingAssetStatus: 'Verified',
    supportingAssetUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
    supportingDocumentName: 'Sertifikasi_Green_Data_Center_PUE.pdf',
    submissionDate: '2026-09-02',
    currentStatus: 'ACCEPTED',
    contentPillarSuggestion: 'Product Education',
    targetAudience: 'CTO Perbankan, Fintech & Institusi Finansial',
    convertedContentId: 'cnt-105'
  },
  {
    id: 'reg-sub-003b',
    regional: 'Regional 2',
    topic: 'Sertifikasi K3 Zero Accident & Simulasi Tanggap Darurat Telkom Landmark Tower',
    activity: 'Pelatihan Evakuasi Kebakaran Gedung Tinggi & Audit Fasilitas Proteksi Kebakaran',
    location: 'Telkom Landmark Tower, Gatot Subroto Jakarta Selatan',
    activityDate: '2026-09-04',
    requestedPublishDate: '2026-09-14',
    picRegional: 'Regional 2 - Creator',
    supportingAssetStatus: 'Available',
    supportingDocumentName: 'Sertifikat_K3_Zero_Accident_Kemnaker.pdf',
    submissionDate: '2026-09-04',
    currentStatus: 'SUBMITTED TO MARCOMM',
    contentPillarSuggestion: 'Corporate / Reputation',
    targetAudience: 'Corporate Tenants, Risk Management Enterprise & GA Professionals'
  },
  {
    id: 'reg-sub-003c',
    regional: 'Regional 2',
    topic: 'Audit Mutu Udara (IAQ) & Penggantian Filter HEPA Terpusat Gedung TLT',
    activity: 'Pengukuran Baku Mutu Kualitas Udara Bersih Greenship GBCI di Seluruh Lantai Sewa',
    location: 'Telkom Landmark Tower, Jakarta Selatan',
    activityDate: '2026-08-31',
    requestedPublishDate: '2026-09-12',
    picRegional: 'Regional 2 - Creator',
    supportingAssetStatus: 'Pending Review',
    supportingDocumentName: 'Hasil_Uji_Lab_IAQ_Greenship.pdf',
    submissionDate: '2026-09-01',
    currentStatus: 'REVISION REQUESTED',
    revisionNotes: 'Catatan Marcomm: Harap konfirmasi izin pencantuman perbandingan kualitas udara sebelum & sesudah filter HEPA dari auditor independen.',
    contentPillarSuggestion: 'Product Education',
    targetAudience: 'HR Director, General Affair & Country Manager Multinasional'
  },

  // REGIONAL 3
  {
    id: 'reg-sub-002',
    regional: 'Regional 3',
    topic: 'Transformasi Gedung Heritage Telkom Lembong Menjadi Coworking & Boutique Hub',
    activity: 'Konservasi Arsitektur Bersejarah & Penataan Modern Workspace Terpadu',
    location: 'Gedung Heritage Telkom Lembong, Kota Bandung',
    activityDate: '2026-08-28',
    requestedPublishDate: '2026-09-12',
    picRegional: 'Regional 3 - Creator',
    supportingAssetStatus: 'Pending Upload',
    submissionDate: '2026-08-30',
    currentStatus: 'REVISION REQUESTED',
    revisionNotes: 'Catatan Marcomm: Mohon sertakan izin cagar budaya resmi dan foto dokumentasi interior kontemporer bersertifikat.',
    contentPillarSuggestion: 'Customer Story',
    targetAudience: 'Komunitas Startup Bandung, Arsitek & Pelaku Industri Kreatif'
  },
  {
    id: 'reg-sub-002b',
    regional: 'Regional 3',
    topic: 'Modernisasi Fasilitas MEP & Smart Chiller Magnetic Bearing Graha Telkom Dipatiukur',
    activity: 'Penggantian Unit Chiller Hemat Energi 300 TR Pemangkas Konsumsi Listrik 30%',
    location: 'Graha TelkomProperty Dipatiukur, Bandung',
    activityDate: '2026-09-03',
    requestedPublishDate: '2026-09-16',
    picRegional: 'Regional 3 - Creator',
    supportingAssetStatus: 'Available',
    supportingDocumentName: 'Berita_Acara_Instalasi_Chiller_Dipatiukur.pdf',
    submissionDate: '2026-09-03',
    currentStatus: 'SUBMITTED TO MARCOMM',
    contentPillarSuggestion: 'Product Education',
    targetAudience: 'Facility Engineers, Pengelola Gedung & Akademisi ITB'
  },
  {
    id: 'reg-sub-002c',
    regional: 'Regional 3',
    topic: 'Peluncuran Indicafe Lifestyle Hub & Smart Locker di Lobby Kantor Telkom Japati',
    activity: 'Aktivasi Layanan F&B Teman Kerja & Fasilitas Meeting Tenant Komersial Modern',
    location: 'Lobby Kantor Telkom Japati, Bandung',
    activityDate: '2026-08-25',
    requestedPublishDate: '2026-09-08',
    picRegional: 'Regional 3 - Creator',
    supportingAssetStatus: 'Verified',
    supportingAssetUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80',
    supportingDocumentName: 'Peresmian_Indicafe_Japati.pdf',
    submissionDate: '2026-08-26',
    currentStatus: 'ACCEPTED',
    contentPillarSuggestion: 'Customer Story',
    targetAudience: 'Karyawan TelkomGroup, Tenant Kantor & Komunitas Bisnis Bandung'
  },

  // REGIONAL 4
  {
    id: 'reg-sub-005',
    regional: 'Regional 4',
    topic: 'Optimalisasi Aset Komersial Telkom Gayungan Surabaya Menjadi Smart Office Hub',
    activity: 'Groundbreaking Revitalisasi Aset Strategis Selatan Surabaya Seluas 1.8 Hektar',
    location: 'Kawasan Aset Telkom Gayungan, Surabaya',
    activityDate: '2026-09-05',
    requestedPublishDate: '2026-09-16',
    picRegional: 'Regional 4 - Creator',
    supportingAssetStatus: 'Verified',
    supportingAssetUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
    supportingDocumentName: 'Masterplan_Revitalisasi_Gayungan_Surabaya.pdf',
    submissionDate: '2026-09-02',
    currentStatus: 'SUBMITTED TO MARCOMM',
    contentPillarSuggestion: 'Industry Insight',
    targetAudience: 'Pengusaha Logistik Jawa Timur, Tenant Perkantoran & Investor BUMN'
  },
  {
    id: 'reg-sub-005b',
    regional: 'Regional 4',
    topic: 'Revitalisasi Gedung Heritage Kotabaru Yogyakarta Menjadi Creative Hub Budaya',
    activity: 'Pemanfaatan Bangunan Cagar Budaya Telkom untuk Tenant Kreatif & Galeri Seni',
    location: 'Gedung Heritage Kotabaru, DI Yogyakarta',
    activityDate: '2026-08-29',
    requestedPublishDate: '2026-09-14',
    picRegional: 'Regional 4 - Creator',
    supportingAssetStatus: 'Available',
    supportingDocumentName: 'PKS_Pemanfaatan_Heritage_Yogya.pdf',
    submissionDate: '2026-08-30',
    currentStatus: 'ACCEPTED',
    contentPillarSuggestion: 'Customer Story',
    targetAudience: 'Pelaku Industri Kreatif, Wisatawan Budaya & Komunitas Seni Yogya'
  },
  {
    id: 'reg-sub-005c',
    regional: 'Regional 4',
    topic: 'Sistem Rainwater Harvesting & Konservasi Air Bersih Menara Telkom Semarang',
    activity: 'Pemasangan Instalasi Pengolahan Air Hujan untuk Sirkulasi Toilet & Taman Menara',
    location: 'Menara Telkom Pahlawan, Semarang',
    activityDate: '2026-08-20',
    requestedPublishDate: '2026-09-01',
    picRegional: 'Regional 4 - Creator',
    supportingAssetStatus: 'Pending Upload',
    submissionDate: '2026-08-21',
    currentStatus: 'REVISION REQUESTED',
    revisionNotes: 'Catatan Marcomm: Mohon sertakan kalkulasi penghematan volume PDAM bulanan dan diagram sirkulasi air daur ulang.',
    contentPillarSuggestion: 'Product Education',
    targetAudience: 'Pengelola Gedung Ramah Lingkungan & Pegiat Konservasi Air'
  },

  // REGIONAL 5
  {
    id: 'reg-sub-004',
    regional: 'Regional 5',
    topic: 'Pengelolaan Fasilitas Terpadu (IFM) Telkom Hub Penyangga IKN & Balikpapan',
    activity: 'Penerapan Smart Facility Management & IoT Monitoring di Gedung Perkantoran Strategis',
    location: 'Telkom Hub Balikpapan & Kawasan Penyangga IKN',
    activityDate: '2026-09-06',
    requestedPublishDate: '2026-09-18',
    picRegional: 'Regional 5 - Creator',
    supportingAssetStatus: 'Available',
    supportingAssetUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80',
    supportingDocumentName: 'Kesiapan_Operasional_IFM_IKN.pdf',
    submissionDate: '2026-09-03',
    currentStatus: 'SUBMITTED TO MARCOMM',
    contentPillarSuggestion: 'Corporate / Reputation',
    targetAudience: 'Otorita IKN, Kementerian BUMN, Kontraktor & Tenant Enterprise'
  },
  {
    id: 'reg-sub-004b',
    regional: 'Regional 5',
    topic: 'Green Building Showcase: Telkom Landmark Office & Resort Hub Denpasar Bali',
    activity: 'Sertifikasi Bangunan Hijau Berbasis Arsitektur Tropis & Efisiensi Energi Terbarukan',
    location: 'Kawasan Renon Denpasar, Bali',
    activityDate: '2026-08-27',
    requestedPublishDate: '2026-09-09',
    picRegional: 'Regional 5 - Creator',
    supportingAssetStatus: 'Verified',
    supportingAssetUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80',
    supportingDocumentName: 'Greenship_Certificate_Renon_Bali.pdf',
    submissionDate: '2026-08-28',
    currentStatus: 'ACCEPTED',
    contentPillarSuggestion: 'Customer Story',
    targetAudience: 'Pelaku Usaha Hospitality, Perusahaan Multinasional & Komunitas Bali'
  },
  {
    id: 'reg-sub-004c',
    regional: 'Regional 5',
    topic: 'Draf: Monetisasi Aset Gedung Telkom Pettarani Makassar Menjadi Pusat Bisnis B2B',
    activity: 'Studi Kelayakan Sewa Ruang Kantor Komersial & Sentra Layanan Digital Indonesia Timur',
    location: 'Plaza Telkom Pettarani, Makassar',
    activityDate: '2026-09-08',
    requestedPublishDate: '2026-09-22',
    picRegional: 'Regional 5 - Creator',
    supportingAssetStatus: 'Draft Ready',
    supportingDocumentName: 'Feasibility_Study_Pettarani_Makassar.docx',
    submissionDate: '2026-09-06',
    currentStatus: 'REGIONAL DRAFT',
    contentPillarSuggestion: 'Industry Insight',
    targetAudience: 'Pelaku Usaha Sulawesi Selatan & BUMN Regional Timur'
  }
];

export const INITIAL_PLANNER_STRUCTURE_REQUESTS: PlannerStructureChangeRequest[] = [
  {
    id: 'str-req-001',
    requestedBy: 'Marcomm Creator (Planner Owner)',
    requestedAt: '2026-09-02T10:00:00Z',
    title: 'Penambahan Pilar Konten "Corporate / Reputation" & Mandatory Evidence Link',
    proposedChanges: '1. Menambahkan pilar Corporate / Reputation untuk mengawal program ESG & BUMN Holding.\n2. Menetapkan field Supporting Data/Evidence sebagai mandatory saat Content Owner adalah Corcomm atau Joint Collaboration.',
    status: 'ACTIVE',
    corcommReviewer: 'Corcomm Creator',
    corcommComment: 'Disetujui. Pilar Corporate / Reputation sangat relevan dengan arahan holding Telkom Group Q3 2026.',
    reviewedAt: '2026-09-02T14:30:00Z'
  }
];

export const INITIAL_VIDEO_PROJECTS: VideoProject[] = [
  {
    id: 'vid-101',
    contentId: 'cnt-101',
    title: 'Smart Green Building TelkomProperty Reel 18s',
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
        prompt: 'Cinematic wide shot of high-rise commercial glass building under sunny blue sky, smooth camera tilt up, architectural brilliance',
        thumbnailUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80',
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
        prompt: 'Close-up macro of TelkomProperty IoT Smart BMS sensor on modern corridor wall, subtle green pulse animation',
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
        prompt: 'Real recorded footage of TelkomProperty Smart Energy Dashboard on tablet with 28.4% energy reduction',
        thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80',
        videoClipUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        provider: 'TelkomProperty Real Asset Repository',
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
        prompt: 'Exterior shot of Telkom Landmark Tower with modern motion graphic branding overlay and TelkomProperty official contact CTA',
        thumbnailUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80',
        videoClipUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        provider: 'Veo AI Video Router',
        consistencyLock: { brandLock: true, characterLock: false, buildingLock: true, visualStyleLock: true },
        propertyTruthGuard: 'ACTUAL VERIFIED ASSET',
        reviewStatus: 'Approved'
      }
    ]
  }
];



