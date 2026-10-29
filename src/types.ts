export type UserRole =
  | 'ROLE_REGIONAL_CREATOR'
  | 'ROLE_MARCOM_CREATOR'
  | 'ROLE_CORCOMM_CREATOR'
  | 'ROLE_JOINT_REVIEWER'
  | 'ROLE_VP_CORSEC'
  | 'ROLE_FINAL_APPROVER'
  | 'ROLE_PERFORMANCE_ANALYST'
  | 'ROLE_SYSTEM_ADMIN'
  // Legacy aliases for backward compatibility
  | 'ROLE_ANALYST_QA'
  | 'ROLE_MANAGER_MARKETING'
  | 'ROLE_VP_MARKETING'
  | 'ROLE_PUBLISHER'
  | 'ROLE_MANAGEMENT_VIEWER';

export type UserPermission =
  | 'CONTENT_PLANNER_OWNER'
  | 'CREATE_CONTENT'
  | 'EDIT_CONTENT'
  | 'USE_AI_STUDIO'
  | 'VIEW_CALENDAR'
  | 'EDIT_CALENDAR'
  | 'CURATE_REGIONAL_SUBMISSION'
  | 'SUBMIT_CONTENT_REVIEW'
  | 'REGIONAL_SUBMISSION_CREATE'
  | 'REGIONAL_SUBMISSION_EDIT'
  | 'VIEW_REGIONAL_PERFORMANCE'
  | 'PARTICIPATE_EDITORIAL_PLANNING'
  | 'REVIEW_PLANNER_STRUCTURE'
  | 'CORCOMM_TAXONOMY_INPUT'
  | 'JOINT_REVIEW_EXECUTE'
  | 'VP_CORSEC_APPROVAL'
  | 'FINAL_CONTENT_APPROVAL'
  | 'VIEW_NATIONAL_ANALYTICS'
  | 'MANAGE_SYSTEM'
  | 'MANAGE_TAXONOMY'
  | 'PUBLISH_CONTENT';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  businessUnit: string;
  avatarUrl?: string;
  permissions?: UserPermission[];
  regionalUnit?: string;
  isContentPlannerOwner?: boolean;
}

export type IntegrationStatus = 'SIMULATED' | 'CONNECTED' | 'DEGRADED' | 'ERROR' | 'STALE' | 'DISABLED';

export interface IntegrationConnection {
  id: string;
  provider: string;
  capability: string;
  status: IntegrationStatus;
  lastSync: string;
  environment: string;
}

export type CampaignStatus = 'Draft' | 'Planned' | 'Active' | 'Paused' | 'Completed' | 'Archived';

export interface Campaign {
  id: string;
  name: string;
  periodStart: string;
  periodEnd: string;
  businessObjective: string;
  marketingObjective: string;
  communicationObjective: string;
  audience: string;
  status: CampaignStatus;
  budgetAllocated: number;
  budgetSpent: number;
  owner: string;
  priorityProduct: string;
  keyMessage: string;
  funnelStage: string;
}

export type SignalType = 'Topic' | 'Keyword' | 'Hashtag' | 'Audio';
export type VerificationStatus = 'Verified' | 'Partially Verified' | 'Unverified' | 'Conflicting' | 'Stale';
export type MomentumStatus = 'Rising' | 'Peak' | 'Declining' | 'Emerging';
export type LifecycleStatus = 'Early Signal' | 'Emerging' | 'Rising' | 'Peak' | 'Declining' | 'Expired';
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Blocked';
export type HashtagRecommendation = 'USE' | 'TEST' | 'MONITOR' | 'AVOID';
export type AudioRightsStatus = 'Verified for Intended Use' | 'Needs Rights Verification' | 'Restricted' | 'Reference Only' | 'Unknown' | 'Expired';

export interface Trend {
  id: string;
  type: SignalType;
  title: string;
  platform: string;
  region: string;
  source: string;
  sourceUrl?: string;
  capturedAt: string;
  confidence: number; // 0 - 100
  verificationStatus: VerificationStatus;
  momentum: MomentumStatus;
  lifecycle: LifecycleStatus;
  relevanceScore: number; // 0 - 100
  brandFitScore: number; // 0 - 100
  riskLevel: RiskLevel;
  hashtagRecommendation?: HashtagRecommendation;
  audioRightsStatus?: AudioRightsStatus;
  publishingWindow: string;
  expirationDate: string;
  rank?: number;
  sector?: string;
  imageUrl?: string;
  growthRate?: string;
  volumeMetric?: string;
  categoryLabel?: string;
}

export interface EventItem {
  id: string;
  name: string;
  organizer: string;
  category: string;
  dateStart: string;
  dateEnd: string;
  venue: string;
  city: string;
  isOnline: boolean;
  source: string;
  confidence: number;
  verificationStatus: VerificationStatus;
  lastVerified: string;
  revalidationStatus: 'OK' | 'Needs Revalidation' | 'Revalidated';
  version: number;
}

export type OpportunityAction = 'Produce Now' | 'Prepare' | 'Monitor' | 'Needs Verification' | 'Ignore' | 'Blocked';
export type OpportunityStatus = 'Discovered' | 'Needs Verification' | 'Verified' | 'Relevant' | 'In Content Development' | 'Converted to Content' | 'Monitoring' | 'Expired';

export interface Opportunity {
  id: string;
  campaignId: string;
  title: string;
  sourceType: 'Trend' | 'Event' | 'Market Insight' | 'Manual';
  sourceTitle: string;
  businessAngle: string;
  audience: string;
  relevanceScore: number;
  momentumScore: number;
  overallScore: number;
  action: OpportunityAction;
  status: OpportunityStatus;
  publishingWindow: string;
  recommendedFormat: string;
}

export type ContentStatus =
  // Standard Lifecycle V1
  | 'IDEA'
  | 'PLANNED'
  | 'IN PRODUCTION'
  | 'IN REVIEW'
  | 'APPROVED'
  | 'SCHEDULED'
  | 'PUBLISHED'
  | 'REVISION'
  | 'REJECTED'
  | 'CANCELLED'
  // Legacy aliases for backward compatibility
  | 'Idea'
  | 'Draft'
  | 'AI-Assisted Draft'
  | 'Needs Verification'
  | 'Needs Fact Check'
  | 'Needs Brand Check'
  | 'Ready for Review'
  | 'Under Review'
  | 'Revision Required'
  | 'Approved'
  | 'In Production'
  | 'Scheduled'
  | 'Published'
  | 'Rejected';

export type ContentOwner = 'Regional' | 'Marcomm' | 'Corcomm' | 'Joint Collaboration';
export type ContentPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export interface ContentItem {
  id: string;
  campaignId: string;
  opportunityId?: string;
  title: string;
  objective: string;
  audience: string;
  platform: string;
  format: 'Carousel' | 'Reels/Shorts' | 'Infographic' | 'Article' | 'Video Storyboard' | string;
  status: ContentStatus;
  pic: string;
  currentVersionId: string;
  publishedUrl?: string;
  scheduledAt?: string;
  publishedAt?: string;

  // 4-Section Content Planner Structure (Single Source of Truth)
  // Section A: STRATEGY
  campaignProgram?: string;
  primaryObjective?: string;
  targetAudience?: string;
  contentPillar?: string;
  keyMessage?: string;

  // Section B: CONTENT
  topicIdea?: string;
  contentFormat?: string;
  channel?: string;
  cta?: string;
  ctaTrackingLink?: string;
  targetPropertyAsset?: string;
  sourceReference?: string;

  // Section C: EXECUTION
  contentOwner?: ContentOwner;
  picName?: string;
  targetPublishDate?: string;
  priority?: ContentPriority;
  // Conditional Regional Fields (when contentOwner === 'Regional')
  regionalUnit?: string;
  picRegional?: string;
  activityProgram?: string;
  location?: string;
  activityDate?: string;
  supportingAsset?: string;
  requestedPublishDate?: string;

  // Section D: READINESS
  supportingAssetStatus?: string;
  supportingDataEvidence?: string;
  readinessNotes?: string;

  // Joint Review & Governance State
  marcommReviewStatus?: 'Pending' | 'Reviewed';
  marcommReviewer?: string;
  marcommReviewedAt?: string;
  corcommReviewStatus?: 'Pending' | 'Reviewed';
  corcommReviewer?: string;
  corcommReviewedAt?: string;
  reviewChecklist?: {
    brandSafety: boolean;
    factCheck: boolean;
    claimCheck: boolean;
    corporateTone: boolean;
  };
  vpCorsecApprovalStatus?: 'Pending' | 'Approved' | 'Revision Required' | 'Rejected';
  vpCorsecApprover?: string;
  vpCorsecApproved?: boolean;
  vpCorsecApprovedAt?: string;
  finalApprovalStatus?: 'Pending' | 'Approved' | 'Revision Required' | 'Rejected';
  finalApprover?: string;
  finalApproved?: boolean;
  finalApprovedAt?: string;
  rejectionReason?: string;
  governanceComments?: GovernanceComment[];

  // Post-Publish Closed Loop Flow (Monitoring -> Optimization/Best Practice -> Report -> Monthly Evaluation -> Planning)
  postPublish?: PostPublishData;
}

export interface GovernanceComment {
  id: string;
  authorName: string;
  authorRole: string;
  authorTitle?: string;
  content: string;
  createdAt: string;
  type: 'joint_review' | 'vp_corsec_audit' | 'dirut_directive' | 'creator_response';
  category?: string; // For VP Corsec: e.g. "Brand Safety & Reputasi Holding", "Aspek Hukum & HAKI", "Audit Klaim SLA & Fakta", "Penyelarasan Kebijakan BUMN"
  urgency?: 'Minor Redaksional' | 'Wajib Penyesuaian' | 'Blocker Kepatuhan';
  directiveChip?: string; // For Dirut: e.g. "👍 Narasi Tajam, Lanjutkan", "🎯 Tekankan Nilai Efisiensi B2B", "⏱️ Tayangkan Momen Jam Kerja", "💡 Sederhanakan Bahasa"
}

export type PostPublishStage =
  | 'MONITORING'
  | 'AMPLIFICATION'
  | 'BEST_PRACTICE'
  | 'RECORDED_FOR_REPORT'
  | 'MONTHLY_EVALUATION'
  | 'CLOSED_LOOP_COMPLETED';

export interface PostPublishData {
  stage: PostPublishStage;
  targetAccount?: '@telprodico' | '@telkomproperty';
  publishedAt?: string;
  metrics: {
    impressions: number;
    reach: number;
    engagementRate: number; // e.g. 4.8 for 4.8%
    inboundLeads: number;   // Leads only, no sales
    linkClicks: number;
    saveRate: number;
    shares: number;
    comments: number;
  };
  optimizationNeeded?: boolean;
  amplificationTactics?: {
    storyRepost: boolean;
    boostAds: boolean;
    buzzComments: boolean;
    budgetEstimate?: number;
    notes?: string;
    startedAt?: string;
  };
  bestPracticeNotes?: string;
  isDocumentedBestPractice?: boolean;
  recordedInReport?: boolean;
  recordedAt?: string;
  monthlyEvaluation?: {
    evaluatedAt?: string;
    strategyDecision?: 'KEEP_CURRENT' | 'TWEAK_STRATEGY';
    tweakNotes?: string;
    nextMonthAction?: string;
    evaluatedBy?: string;
  };
}

export type RegionalSubmissionStatus =
  | 'REGIONAL DRAFT'
  | 'SUBMITTED TO MARCOMM'
  | 'REVISION REQUESTED'
  | 'ACCEPTED'
  | 'HELD'
  | 'REJECTED';

export interface RegionalSubmission {
  id: string;
  regional: string;
  topic: string;
  activity: string;
  location?: string;
  activityDate?: string;
  requestedPublishDate?: string;
  picRegional: string;
  supportingAssetStatus?: string;
  supportingAssetUrl?: string;
  supportingDocumentName?: string;
  submissionDate?: string;
  submittedAt?: string;
  currentStatus: RegionalSubmissionStatus;
  revisionNotes?: string;
  contentPillarSuggestion?: string;
  targetAudience?: string;
  convertedContentId?: string;
  submissionTrack?: 'MONTHLY_AGENDA' | 'FAST_TRACK_URGENT' | 'COMMERCIAL_PROMO';
  targetPropertyAsset?: string;
  brandTarget?: '@telprodico' | '@telkomproperty' | 'MARCOMM_CHOICE';
  editorialSlotStatus?: 'QUEUED_FOR_MEETING' | 'ALLOCATED_TO_SLOT' | 'BUFFER_READY';
  aiAssisted?: boolean;
  trendAngle?: string;
  recommendedFormat?: string;
  shotList?: string[];
  captionDraft?: string;
  corporateSafetyGuardrails?: string[];
  marcommAlignmentNote?: string;
  storyPackage?: {
    hook: string;
    interactiveStickers: string[];
    textOverlay: string;
    visualPrompt: string;
  };
  feedPackage?: {
    hookHeadline: string;
    carouselSlides: string[];
    captionDraft: string;
  };
  reelsPackage?: {
    threeSecHook: string;
    storyboard: { timestamp: string; visual: string; audioAction: string }[];
    recommendedAudioMood: string;
    captionDraft: string;
  };
}

export interface MasterTaxonomy {
  campaigns: string[];
  objectives: string[];
  audienceCategories: string[];
  contentPillars: string[];
  formats: string[];
  channels: string[];
  priorities: string[];
}

export type PlannerStructureStatus = 'DRAFT STRUCTURE' | 'CORCOMM REVIEW' | 'ACTIVE' | 'PENDING' | 'REJECTED';

export interface PlannerStructureChangeRequest {
  id: string;
  requestedBy?: string;
  proposedBy?: string;
  requestedAt: string;
  title: string;
  description?: string;
  proposedChanges?: string;
  targetSection?: string;
  status: PlannerStructureStatus;
  corcommReviewer?: string;
  corcommComment?: string;
  reviewedAt?: string;
}

export interface ContentVersion {
  id: string;
  contentId: string;
  versionNumber: number;
  brief: string;
  hook: string;
  caption: string;
  script: string;
  cta: string;
  selectedKeywords: string[];
  selectedHashtags: string[];
  selectedAudio?: string;
  audioRightsStatus?: AudioRightsStatus;
  createdBy: string;
  createdAt: string;
  aiAssisted: boolean;
  evidenceIds: string[];
  riskLevel: RiskLevel;
}

export type SourceType = 'Official Primary Source' | 'Official Supporting Source' | 'Credible Secondary Source' | 'Internal Approved Source' | 'Unverified Source';

export interface Evidence {
  id: string;
  sourceTitle: string;
  sourceUrl: string;
  sourceType: SourceType;
  claimText: string;
  verificationStatus: VerificationStatus;
  validityDate: string;
  confidenceScore: number;
  reviewerNote?: string;
  lastVerifiedAt: string;
}

export type ApprovalStage =
  | '01. Creator Submission'
  | '02. Marcom Review'
  | '03. Manager Marketing Review'
  | '04. VP Marketing Review'
  | '05. VP Corsec Review'
  | '06. Plt. Direktur Utama Approval'
  | '06. Direktur Utama Approval'
  | '07. Publisher Execution'
  | 'Fact & Evidence Check'
  | 'Brand & Creative QA'
  | 'Manager Review'
  | 'Final Approval';

export interface ApprovalHierarchyStep {
  step: number;
  stage: ApprovalStage;
  label: string;
  role: UserRole;
  roleLabel: string;
  description: string;
}

export const APPROVAL_HIERARCHY: ApprovalHierarchyStep[] = [
  {
    step: 1,
    stage: '01. Creator Submission',
    label: '1. Creator',
    role: 'ROLE_MARCOM_CREATOR',
    roleLabel: 'MARCOM_CREATOR',
    description: 'Creator menyusun brief, script & asset draft'
  },
  {
    step: 2,
    stage: '02. Marcom Review',
    label: '2. Marcom',
    role: 'ROLE_ANALYST_QA',
    roleLabel: 'ANALYST_QA / MARCOM',
    description: 'Marcom verifikasi fakta & klaim evidence'
  },
  {
    step: 3,
    stage: '03. Manager Marketing Review',
    label: '3. Manager Marketing',
    role: 'ROLE_MANAGER_MARKETING',
    roleLabel: 'MANAGER_MARKETING',
    description: 'Manager Marketing peninjauan Brand & Creative QA'
  },
  {
    step: 4,
    stage: '04. VP Marketing Review',
    label: '4. VP Marketing',
    role: 'ROLE_VP_MARKETING',
    roleLabel: 'VP_MARKETING',
    description: 'VP Marketing persetujuan Strategi & Alokasi Budget'
  },
  {
    step: 5,
    stage: '05. VP Corsec Review',
    label: '5. VP Corsec',
    role: 'ROLE_VP_CORSEC',
    roleLabel: 'VP_CORSEC',
    description: 'VP Corporate Secretary tinjauan Risiko, Legal & Governance'
  },
  {
    step: 6,
    stage: '06. Plt. Direktur Utama Approval',
    label: '6. Plt. Dirut',
    role: 'ROLE_FINAL_APPROVER',
    roleLabel: 'PLT_DIRUT',
    description: 'Plt. Direktur Utama persetujuan Eksekutif tertinggi'
  },
  {
    step: 7,
    stage: '07. Publisher Execution',
    label: '7. Publisher (Creator/Marcom)',
    role: 'ROLE_PUBLISHER',
    roleLabel: 'PUBLISHER',
    description: 'Publisher/Marcom penjadwalan & eksekusi publikasi'
  }
];
export type DecisionType = 'Pending' | 'Pass' | 'Approve' | 'Revision Required' | 'Reject' | 'Hold';

export interface Approval {
  id: string;
  contentVersionId: string;
  contentId: string;
  stage: ApprovalStage;
  reviewerName: string;
  reviewerRole: UserRole;
  decision: DecisionType;
  comment?: string;
  submittedAt: string;
  decidedAt?: string;
  dueAt: string;
  slaStatus: 'Normal' | 'Near Due' | 'Overdue' | 'Escalated' | 'Completed';
}

export interface BudgetItem {
  id: string;
  campaignId: string;
  activityName: string;
  category: 'Paid Ads' | 'Talent' | 'Production' | 'Event' | 'Creative' | 'Vendor' | 'Other';
  allocatedAmount: number;
  committedAmount: number;
  actualAmount: number;
  varianceAmount: number;
  status: 'Planned' | 'Approved' | 'Executed';
}

export interface AuditEvent {
  id: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  entityName: string;
  entityId: string;
  beforeState?: string;
  afterState?: string;
  timestamp: string;
  aiRunId?: string;
  contentVersionId?: string;
  sourceSystem: string;
  userPermission?: string;
  revisionNote?: string;
}

export interface LeadFeedback {
  id: string;
  campaignId: string;
  channel: string;
  source: string;
  status: 'New Inquiry' | 'Qualified Lead' | 'In Contact' | 'Passed to Enterprise Sales' | 'Unqualified';
  customerInquiry: string;
  contactName: string;
  companyName: string;
  receivedAt: string;
}

export interface PerformanceMetric {
  contentId: string;
  campaignId: string;
  reach: number;
  impressions: number;
  engagement: number;
  ctr: number; // percentage e.g. 3.4
  lpViews: number;
  waClicks: number;
  chatInitiated: number;
  spend: number;
  cpc: number;
  cpl: number;
  predictedScore: number;
  actualPerformanceScore: number;
}

export interface LearningItem {
  id: string;
  campaignId: string;
  category: string;
  frameworkAction: 'CONTINUE' | 'STOP' | 'START' | 'TEST';
  observation: string;
  hypothesis: string;
  recommendation: string;
  owner: string;
  createdAt: string;
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  sources?: string[];
  confidence?: 'high' | 'medium' | 'low';
  assumptions?: string[];
  risks?: string[];
  missingData?: string[];
  suggestedActions?: { type: string; label: string }[];
}

export type PropertyTruthGuard =
  | 'ACTUAL VERIFIED ASSET'
  | 'ACTUAL ASSET WITH AI MOTION'
  | 'AI-ASSISTED COMPOSITE'
  | 'AI-GENERATED CONCEPT'
  | 'UNVERIFIED REPRESENTATION';

export type StoryboardMode = 'Quick Storyboard' | 'Production Storyboard' | 'Campaign Visual Board';
export type ShotType = 'Wide Shot' | 'Medium Shot' | 'Close Up' | 'Extreme Close Up' | 'Macro' | 'Over the Shoulder';
export type CameraAngle = 'Eye Level' | 'Low Angle' | 'High Angle' | 'Bird Eye' | 'Dutch Angle';
export type CameraMovement = 'Static' | 'Pan' | 'Tilt' | 'Dolly Push-in' | 'Dolly Pull-out' | 'Parallax' | 'Handheld';

export interface StoryboardScene {
  id: string;
  sceneNumber: number;
  duration: number; // in seconds
  sceneObjective: string;
  visualDescription: string;
  shotType: ShotType;
  cameraAngle: CameraAngle;
  cameraMovement: CameraMovement;
  lighting: string;
  voiceOver: string;
  onScreenText: string;
  audioNote: string;
  generatedImageUrl?: string;
  representationStatus: PropertyTruthGuard;
  reviewStatus: 'Pending' | 'Approved' | 'Revision Required';
}

export interface Storyboard {
  id: string;
  contentId: string;
  versionNumber: number;
  mode: StoryboardMode;
  scenes: StoryboardScene[];
  status: 'Draft' | 'Approved' | 'In Production';
  createdAt: string;
}

export type VideoSourceMode = 'Text-to-Video' | 'Image-to-Video' | 'Storyboard-to-Video' | 'Hybrid Real Asset + AI' | 'Real Footage';
export type MediaProvider = 'Gemini / Imagen 3' | 'Veo AI Video Router' | 'ElevenLabs Voice Router' | 'TELPRO Real Asset Repository' | 'TelkomProperty Real Asset Repository';

export interface VideoScene {
  id: string;
  storyboardSceneId?: string;
  sceneNumber: number;
  sourceMode: VideoSourceMode;
  duration: number;
  aspectRatio: '9:16' | '16:9' | '1:1';
  prompt: string;
  videoClipUrl?: string;
  thumbnailUrl?: string;
  provider: MediaProvider;
  consistencyLock: {
    brandLock: boolean;
    characterLock: boolean;
    buildingLock: boolean;
    visualStyleLock: boolean;
  };
  propertyTruthGuard: PropertyTruthGuard;
  reviewStatus: 'Pending' | 'Approved' | 'Revision Required';
}

export interface VideoProject {
  id: string;
  contentId: string;
  title: string;
  aspectRatio: '9:16' | '16:9' | '1:1';
  targetDuration: number;
  scenes: VideoScene[];
  voiceOverAudioUrl?: string;
  backgroundMusicUrl?: string;
  status: 'Draft' | 'Composed' | 'Ready for QA';
}

