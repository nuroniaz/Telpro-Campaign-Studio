import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  UserRole,
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
  AIMessage,
  DecisionType,
  ApprovalStage,
  ContentStatus,
  Storyboard,
  StoryboardScene,
  VideoProject,
  VideoScene,
  APPROVAL_HIERARCHY,
  MasterTaxonomy,
  RegionalSubmission,
  PlannerStructureChangeRequest,
  PostPublishData,
  PostPublishStage,
  GovernanceComment
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_CAMPAIGNS,
  INITIAL_TRENDS,
  INITIAL_EVENTS,
  INITIAL_EVIDENCES,
  INITIAL_OPPORTUNITIES,
  INITIAL_CONTENTS,
  INITIAL_CONTENT_VERSIONS,
  INITIAL_APPROVALS,
  INITIAL_BUDGETS,
  INITIAL_AUDIT_LOGS,
  INITIAL_LEAD_FEEDBACKS,
  INITIAL_PERFORMANCE_METRICS,
  INITIAL_LEARNINGS,
  INITIAL_INTEGRATIONS,
  INITIAL_STORYBOARDS,
  INITIAL_VIDEO_PROJECTS,
  INITIAL_MASTER_TAXONOMY,
  INITIAL_REGIONAL_SUBMISSIONS,
  INITIAL_PLANNER_STRUCTURE_REQUESTS
} from '../mockData';
import {
  hasUserPermission,
  isContentPlannerOwner,
  canCurateRegional,
  canExecuteJointReview,
  canApproveVpCorsec,
  canFinalApprove
} from '../utils/rbac';

interface AppContextType {
  activeUser: UserProfile;
  setActiveUserRole: (role: UserRole) => void;
  switchUser: (userIdOrRole: string) => void;
  users: UserProfile[];
  selectedCampaignId: string;
  setSelectedCampaignId: (id: string) => void;
  selectedCampaign: Campaign | undefined;
  
  campaigns: Campaign[];
  trends: Trend[];
  events: EventItem[];
  evidences: Evidence[];
  opportunities: Opportunity[];
  contents: ContentItem[];
  contentVersions: ContentVersion[];
  approvals: Approval[];
  budgets: BudgetItem[];
  auditLogs: AuditEvent[];
  leadFeedbacks: LeadFeedback[];
  performanceMetrics: PerformanceMetric[];
  learnings: LearningItem[];
  integrations: IntegrationConnection[];
  aiMessages: AIMessage[];
  isAILoading: boolean;
  isAiPartnerModalOpen: boolean;
  setIsAiPartnerModalOpen: (open: boolean) => void;
  storyboards: Storyboard[];
  videoProjects: VideoProject[];
  masterTaxonomy: MasterTaxonomy;
  regionalSubmissions: RegionalSubmission[];
  plannerStructureRequests: PlannerStructureChangeRequest[];

  isAuthenticated: boolean;
  login: (roleOrEmail: string, password?: string) => { success: boolean; message: string };
  logout: () => void;

  clearAllDummyData: () => void;
  restoreDemoData: () => void;

  // Actions
  addCampaign: (campaign: Campaign) => void;
  updateCampaignStatus: (id: string, status: Campaign['status']) => void;
  addTrend: (trend: Trend) => void;
  addEvent: (event: EventItem) => void;
  revalidateEvent: (eventId: string) => void;
  createOpportunity: (opp: Opportunity) => void;
  addContentWithVersion: (content: ContentItem, version: ContentVersion) => void;
  updateVersionCta: (versionId: string, newCta: string) => void;
  updateVersionDetails: (versionId: string, updatedFields: Partial<ContentVersion>) => void;
  applyAIGeneratedContent: (contentId: string, newVersionData: Partial<ContentVersion>) => void;
  updateApprovalDecision: (approvalId: string, decision: DecisionType, comment?: string) => void;
  addEvidence: (evidence: Evidence) => void;
  addBudgetItem: (item: BudgetItem) => void;
  addAuditLog: (event: Omit<AuditEvent, 'id' | 'timestamp'>) => void;
  sendAIMessage: (text: string) => Promise<void>;
  clearAIChat: () => void;
  publishContent: (contentId: string) => void;
  scheduleContent: (contentId: string, scheduledDate?: string) => void;
  updateStoryboardScene: (storyboardId: string, sceneId: string, updatedScene: Partial<StoryboardScene>) => void;
  addStoryboardScene: (storyboardId: string, newScene: StoryboardScene) => void;
  addStoryboard: (storyboard: Storyboard) => void;
  updateVideoScene: (videoProjectId: string, videoSceneId: string, updatedScene: Partial<VideoScene>) => void;
  regenerateSceneMedia: (videoProjectId: string, videoSceneId: string) => void;
  addVideoProject: (project: VideoProject) => void;

  // Content Planner & Governance Actions
  updateMasterTaxonomy: (newTaxonomy: Partial<MasterTaxonomy>) => boolean;
  addRegionalSubmission: (submission: RegionalSubmission) => void;
  updateRegionalSubmission: (submissionId: string, updatedData: Partial<RegionalSubmission>) => void;
  updateRegionalSubmissionStatus: (submissionId: string, status: RegionalSubmission['currentStatus'], notes?: string) => void;
  convertRegionalToPlanner: (submissionId: string, overrides?: Partial<ContentItem>) => ContentItem | undefined;
  submitPlannerStructureRequest: (req: Omit<PlannerStructureChangeRequest, 'id' | 'requestedAt' | 'status'>) => void;
  reviewPlannerStructureRequest: (requestId: string, status: 'ACTIVE' | 'REJECTED', comment?: string) => void;
  updateContentPlannerItem: (contentId: string, updatedFields: Partial<ContentItem>) => void;
  addGovernanceComment: (contentId: string, comment: Omit<GovernanceComment, 'id' | 'createdAt'>) => void;
  executeJointReview: (contentId: string, reviewerType: 'marcomm' | 'corcomm' | 'joint', decision: 'Approved' | 'Revision', checklist: NonNullable<ContentItem['reviewChecklist']>, comment?: string) => void;
  executeVpCorsecApproval: (contentId: string, decision: 'Approved' | 'Revision' | boolean, comment?: string, category?: string, urgency?: GovernanceComment['urgency']) => void;
  executeFinalApproval: (contentId: string, decision: 'Approved' | 'Revision' | boolean, comment?: string, directiveChip?: string) => void;

  // Post-Publish Closed Loop Flow Actions (Whimsical Standard)
  decideOptimization: (contentId: string, needed: boolean, amplificationTactics?: PostPublishData['amplificationTactics'], bestPracticeNotes?: string) => void;
  recordContentForReport: (contentId: string) => void;
  evaluateMonthlyStrategy: (contentId: string, decision: 'KEEP_CURRENT' | 'TWEAK_STRATEGY', tweakNotes?: string, nextMonthAction?: string) => void;
  feedBackToPlanning: (contentId: string, plannedTopic: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users] = useState<UserProfile[]>(INITIAL_USERS);
  const [activeUser, setActiveUser] = useState<UserProfile>(() => {
    const savedUserId = localStorage.getItem('spark_active_user_id');
    if (savedUserId) {
      const found = INITIAL_USERS.find(u => u.id === savedUserId || u.role === savedUserId);
      if (found) return found;
    }
    return INITIAL_USERS[0];
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('spark_auth_logged_in') === 'true';
  });

  // Auto-migrate to TelkomProperty schema if legacy data is found in localStorage
  const CURRENT_DATA_VERSION = 'telkomproperty_2026_v2';
  if (typeof window !== 'undefined') {
    const storedVersion = localStorage.getItem('spark_data_schema_version');
    if (storedVersion !== CURRENT_DATA_VERSION) {
      localStorage.setItem('spark_data_schema_version', CURRENT_DATA_VERSION);
      localStorage.setItem('telpro_campaigns', JSON.stringify(INITIAL_CAMPAIGNS));
      localStorage.setItem('telpro_trends', JSON.stringify(INITIAL_TRENDS));
      localStorage.setItem('telpro_events', JSON.stringify(INITIAL_EVENTS));
      localStorage.setItem('telpro_evidences', JSON.stringify(INITIAL_EVIDENCES));
      localStorage.setItem('telpro_opportunities', JSON.stringify(INITIAL_OPPORTUNITIES));
      localStorage.setItem('telpro_contents', JSON.stringify(INITIAL_CONTENTS));
      localStorage.setItem('telpro_content_versions', JSON.stringify(INITIAL_CONTENT_VERSIONS));
      localStorage.setItem('telpro_approvals', JSON.stringify(INITIAL_APPROVALS));
      localStorage.setItem('telpro_budgets', JSON.stringify(INITIAL_BUDGETS));
      localStorage.setItem('telpro_storyboards', JSON.stringify(INITIAL_STORYBOARDS));
      localStorage.setItem('telpro_video_projects', JSON.stringify(INITIAL_VIDEO_PROJECTS));
      localStorage.setItem('telpro_master_taxonomy', JSON.stringify(INITIAL_MASTER_TAXONOMY));
      localStorage.setItem('telpro_regional_submissions', JSON.stringify(INITIAL_REGIONAL_SUBMISSIONS));
      localStorage.setItem('telpro_planner_structure_requests', JSON.stringify(INITIAL_PLANNER_STRUCTURE_REQUESTS));
    }
  }

  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(INITIAL_CAMPAIGNS[0].id);

  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const local = localStorage.getItem('telpro_campaigns');
    return local ? JSON.parse(local) : INITIAL_CAMPAIGNS;
  });

  const [trends, setTrends] = useState<Trend[]>(() => {
    const local = localStorage.getItem('telpro_trends');
    return local ? JSON.parse(local) : INITIAL_TRENDS;
  });

  const [events, setEvents] = useState<EventItem[]>(() => {
    const local = localStorage.getItem('telpro_events');
    return local ? JSON.parse(local) : INITIAL_EVENTS;
  });

  const [evidences, setEvidences] = useState<Evidence[]>(() => {
    const local = localStorage.getItem('telpro_evidences');
    return local ? JSON.parse(local) : INITIAL_EVIDENCES;
  });

  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    const local = localStorage.getItem('telpro_opportunities');
    return local ? JSON.parse(local) : INITIAL_OPPORTUNITIES;
  });

  const [contents, setContents] = useState<ContentItem[]>(() => {
    const local = localStorage.getItem('telpro_contents');
    return local ? JSON.parse(local) : INITIAL_CONTENTS;
  });

  const FULL_CTA_DEFAULT = 'Call Center: 1500 473 | WA: +62811 150 4739 (chat only) | Email: info@telpro.co.id | Graha TelkomProperty, Jln Kebon Sirih No. 10-12, Jakarta Pusat, 10110';

  const [contentVersions, setContentVersions] = useState<ContentVersion[]>(() => {
    const local = localStorage.getItem('telpro_content_versions');
    let versions = INITIAL_CONTENT_VERSIONS;
    if (local) {
      try {
        versions = JSON.parse(local);
      } catch (e) {
        console.error('Failed to parse telpro_content_versions from localStorage', e);
      }
    }
    return versions.map(v => {
      if (!v.cta || v.cta.includes('Hubungi TELPRO Sales') || v.cta.includes('telpro.id') || v.cta.includes('Hubungi Sales')) {
        return { ...v, cta: FULL_CTA_DEFAULT };
      }
      return v;
    });
  });

  const [approvals, setApprovals] = useState<Approval[]>(() => {
    const local = localStorage.getItem('telpro_approvals');
    return local ? JSON.parse(local) : INITIAL_APPROVALS;
  });

  const [budgets, setBudgets] = useState<BudgetItem[]>(() => {
    const local = localStorage.getItem('telpro_budgets');
    return local ? JSON.parse(local) : INITIAL_BUDGETS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(() => {
    const local = localStorage.getItem('telpro_audit_logs');
    return local ? JSON.parse(local) : INITIAL_AUDIT_LOGS;
  });

  const [leadFeedbacks] = useState<LeadFeedback[]>(INITIAL_LEAD_FEEDBACKS);
  const [performanceMetrics] = useState<PerformanceMetric[]>(INITIAL_PERFORMANCE_METRICS);
  const [learnings] = useState<LearningItem[]>(INITIAL_LEARNINGS);
  const [integrations] = useState<IntegrationConnection[]>(INITIAL_INTEGRATIONS);

  const [storyboards, setStoryboards] = useState<Storyboard[]>(() => {
    const local = localStorage.getItem('telpro_storyboards');
    return local ? JSON.parse(local) : INITIAL_STORYBOARDS;
  });

  const [videoProjects, setVideoProjects] = useState<VideoProject[]>(() => {
    const local = localStorage.getItem('telpro_video_projects');
    return local ? JSON.parse(local) : INITIAL_VIDEO_PROJECTS;
  });

  const [masterTaxonomy, setMasterTaxonomy] = useState<MasterTaxonomy>(() => {
    const local = localStorage.getItem('telpro_master_taxonomy');
    return local ? JSON.parse(local) : INITIAL_MASTER_TAXONOMY;
  });

  const [regionalSubmissions, setRegionalSubmissions] = useState<RegionalSubmission[]>(() => {
    const local = localStorage.getItem('telpro_regional_submissions');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_REGIONAL_SUBMISSIONS.length) {
          return parsed;
        }
      } catch (e) {}
    }
    return INITIAL_REGIONAL_SUBMISSIONS;
  });

  const [plannerStructureRequests, setPlannerStructureRequests] = useState<PlannerStructureChangeRequest[]>(() => {
    const local = localStorage.getItem('telpro_planner_structure_requests');
    return local ? JSON.parse(local) : INITIAL_PLANNER_STRUCTURE_REQUESTS;
  });

  const [aiMessages, setAiMessages] = useState<AIMessage[]>([
    {
      id: 'msg-init',
      sender: 'ai',
      text: 'Halo! Saya TelkomProperty AI Content Partner. Ada ide campaign, audit energi green building, atau monetisasi ruang perkantoran yang ingin dikembangkan menjadi paket konten terverifikasi hari ini?',
      timestamp: new Date().toISOString(),
      sources: ['TelkomProperty Knowledge Base 2026', 'Evidence Pack EVD-1 (Audit Energi Greenship GBCI)'],
      confidence: 'high',
      suggestedActions: [
        { type: 'Apply to Brief', label: 'Buat Brief Smart Building & Chiller Audit' },
        { type: 'Create Storyboard', label: 'Draft Video Reel Green Building 18s' }
      ]
    }
  ]);
  const [isAILoading, setIsAILoading] = useState<boolean>(false);
  const [isAiPartnerModalOpen, setIsAiPartnerModalOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('telpro_storyboards', JSON.stringify(storyboards));
  }, [storyboards]);

  useEffect(() => {
    localStorage.setItem('telpro_video_projects', JSON.stringify(videoProjects));
  }, [videoProjects]);

  useEffect(() => {
    localStorage.setItem('telpro_master_taxonomy', JSON.stringify(masterTaxonomy));
  }, [masterTaxonomy]);

  useEffect(() => {
    localStorage.setItem('telpro_regional_submissions', JSON.stringify(regionalSubmissions));
  }, [regionalSubmissions]);

  useEffect(() => {
    localStorage.setItem('telpro_planner_structure_requests', JSON.stringify(plannerStructureRequests));
  }, [plannerStructureRequests]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('telpro_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('telpro_trends', JSON.stringify(trends));
  }, [trends]);

  useEffect(() => {
    localStorage.setItem('telpro_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('telpro_evidences', JSON.stringify(evidences));
  }, [evidences]);

  useEffect(() => {
    localStorage.setItem('telpro_opportunities', JSON.stringify(opportunities));
  }, [opportunities]);

  useEffect(() => {
    localStorage.setItem('telpro_contents', JSON.stringify(contents));
  }, [contents]);

  useEffect(() => {
    localStorage.setItem('telpro_content_versions', JSON.stringify(contentVersions));
  }, [contentVersions]);

  useEffect(() => {
    localStorage.setItem('telpro_approvals', JSON.stringify(approvals));
  }, [approvals]);

  useEffect(() => {
    localStorage.setItem('telpro_budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('telpro_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId) || campaigns[0];

  const switchUser = (userIdOrRoleOrEmail: string) => {
    const trimmed = userIdOrRoleOrEmail.trim();
    let targetId = trimmed;
    if (trimmed === 'reg1' || trimmed === 'regional-1' || trimmed === 'Regional Creator 1') targetId = 'usr-reg-1';
    if (trimmed === 'reg2' || trimmed === 'regional-2' || trimmed === 'Regional Creator 2') targetId = 'usr-reg-2';
    if (trimmed === 'reg3' || trimmed === 'regional-3' || trimmed === 'usr-3' || trimmed === 'Regional Creator 3') targetId = 'usr-reg-3';
    if (trimmed === 'reg4' || trimmed === 'regional-4' || trimmed === 'Regional Creator 4') targetId = 'usr-reg-4';
    if (trimmed === 'reg5' || trimmed === 'regional-5' || trimmed === 'Regional Creator 5') targetId = 'usr-reg-5';
    if (trimmed === 'marcomm' || trimmed === 'marcom' || trimmed === 'marcomm-creator') targetId = 'usr-2';
    if (trimmed === 'corcomm' || trimmed === 'corcom' || trimmed === 'corcomm-creator') targetId = 'usr-4';
    if (trimmed === 'vp-corsec' || trimmed === 'corsec' || trimmed === 'vp corsec' || trimmed === 'VP Corsec') targetId = 'usr-6';
    if (trimmed === 'dirut' || trimmed === 'plt-dirut' || trimmed === 'plt dirut' || trimmed === 'plt. dirut' || trimmed === 'Plt. Dirut' || trimmed === 'Plt. Direktur Utama') targetId = 'usr-7';

    const found = users.find(
      u => u.id === targetId ||
           u.id === trimmed ||
           u.role === trimmed ||
           u.email.toLowerCase() === trimmed.toLowerCase() ||
           u.name.toLowerCase().includes(trimmed.toLowerCase())
    );
    if (found) {
      setActiveUser(found);
      localStorage.setItem('spark_active_user_id', found.id);
      addAuditLog({
        actorName: found.name,
        actorRole: found.role,
        action: 'USER_ROLE_SWITCH',
        entityName: 'UserSession',
        entityId: found.id,
        afterState: `Switched active session to ${found.name} (${found.title})`,
        sourceSystem: 'TELPRO Identity System'
      });
    }
  };

  const setActiveUserRole = (role: UserRole) => {
    // If activeUser is already in this role, keep current user unless needed
    if (activeUser.role === role) return;
    const found = users.find(u => u.role === role);
    if (found) {
      setActiveUser(found);
      localStorage.setItem('spark_active_user_id', found.id);
      addAuditLog({
        actorName: found.name,
        actorRole: role,
        action: 'USER_ROLE_SWITCH',
        entityName: 'UserSession',
        entityId: found.id,
        afterState: `Switched active role to ${role}`,
        sourceSystem: 'TELPRO Identity System'
      });
    }
  };

  const login = (roleOrEmail: string, password?: string): { success: boolean; message: string } => {
    const trimmed = roleOrEmail.trim();
    let targetId = trimmed;
    if (trimmed === 'reg1' || trimmed === 'regional-1' || trimmed === 'Regional Creator 1') targetId = 'usr-reg-1';
    if (trimmed === 'reg2' || trimmed === 'regional-2' || trimmed === 'Regional Creator 2') targetId = 'usr-reg-2';
    if (trimmed === 'reg3' || trimmed === 'regional-3' || trimmed === 'usr-3' || trimmed === 'Regional Creator 3') targetId = 'usr-reg-3';
    if (trimmed === 'reg4' || trimmed === 'regional-4' || trimmed === 'Regional Creator 4') targetId = 'usr-reg-4';
    if (trimmed === 'reg5' || trimmed === 'regional-5' || trimmed === 'Regional Creator 5') targetId = 'usr-reg-5';
    if (trimmed === 'marcomm' || trimmed === 'marcom' || trimmed === 'marcomm-creator') targetId = 'usr-2';
    if (trimmed === 'corcomm' || trimmed === 'corcom' || trimmed === 'corcomm-creator') targetId = 'usr-4';
    if (trimmed === 'vp-corsec' || trimmed === 'corsec' || trimmed === 'vp corsec' || trimmed === 'VP Corsec') targetId = 'usr-6';
    if (trimmed === 'dirut' || trimmed === 'plt-dirut' || trimmed === 'plt dirut' || trimmed === 'plt. dirut' || trimmed === 'Plt. Dirut' || trimmed === 'Plt. Direktur Utama') targetId = 'usr-7';

    const targetUser = users.find(
      u => u.id === targetId ||
           u.id === trimmed ||
           u.role === trimmed ||
           u.email.toLowerCase() === trimmed.toLowerCase() ||
           u.name.toLowerCase().includes(trimmed.toLowerCase())
    );

    if (!targetUser) {
      return { success: false, message: 'Role atau Akun pengguna tidak ditemukan dalam sistem.' };
    }

    const trimmedPassword = (password || '').trim();
    // Default password for all roles: 'telpro2026'
    // Also accept role-specific shortcuts or demo keys
    const validPasswords = [
      'telpro2026',
      'admin123',
      'password',
      'telpro',
      '123456',
      targetUser.role.replace('ROLE_', '').toLowerCase() + '2026'
    ];

    const isMatch = validPasswords.some(p => p.toLowerCase() === trimmedPassword.toLowerCase());

    if (!isMatch && trimmedPassword !== '') {
      return {
        success: false,
        message: 'Password salah. Gunakan password default: telpro2026'
      };
    }

    setActiveUser(targetUser);
    setIsAuthenticated(true);
    localStorage.setItem('spark_auth_logged_in', 'true');
    localStorage.setItem('spark_active_user_id', targetUser.id);

    addAuditLog({
      actorName: targetUser.name,
      actorRole: targetUser.role,
      action: 'LOGIN_SUCCESS',
      entityName: 'UserSession',
      entityId: targetUser.id,
      afterState: `User ${targetUser.name} (${targetUser.role}) berhasil masuk ke sesi sistem via portal SSO`,
      sourceSystem: 'TELPRO Identity & SSO Engine'
    });

    return {
      success: true,
      message: `Berhasil masuk sebagai ${targetUser.name} (${targetUser.title})`
    };
  };

  const logout = () => {
    addAuditLog({
      actorName: activeUser.name,
      actorRole: activeUser.role,
      action: 'LOGOUT',
      entityName: 'UserSession',
      entityId: activeUser.id,
      afterState: `User ${activeUser.name} (${activeUser.role}) keluar dari sesi sistem`,
      sourceSystem: 'TELPRO Identity System'
    });
    setIsAuthenticated(false);
    localStorage.removeItem('spark_auth_logged_in');
  };

  const addAuditLog = (evt: Omit<AuditEvent, 'id' | 'timestamp'>) => {
    const newLog: AuditEvent = {
      ...evt,
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const addCampaign = (campaign: Campaign) => {
    setCampaigns(prev => [campaign, ...prev]);
    setSelectedCampaignId(campaign.id);
    addAuditLog({
      actorName: activeUser.name,
      actorRole: activeUser.role,
      action: 'CAMPAIGN_CREATE',
      entityName: 'Campaign',
      entityId: campaign.id,
      afterState: `Created campaign ${campaign.name}`,
      sourceSystem: 'TELPRO Strategy Module'
    });
  };

  const updateCampaignStatus = (id: string, status: Campaign['status']) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    addAuditLog({
      actorName: activeUser.name,
      actorRole: activeUser.role,
      action: 'CAMPAIGN_STATUS_UPDATE',
      entityName: 'Campaign',
      entityId: id,
      afterState: `Status updated to ${status}`,
      sourceSystem: 'TELPRO Strategy Module'
    });
  };

  const addTrend = (trend: Trend) => {
    setTrends(prev => [trend, ...prev]);
    addAuditLog({
      actorName: activeUser.name,
      actorRole: activeUser.role,
      action: 'TREND_CREATE',
      entityName: 'Trend',
      entityId: trend.id,
      afterState: `Discovered trend signal ${trend.title}`,
      sourceSystem: 'TELPRO Intelligence Layer'
    });
  };

  const addEvent = (event: EventItem) => {
    setEvents(prev => [event, ...prev]);
    addAuditLog({
      actorName: activeUser.name,
      actorRole: activeUser.role,
      action: 'EVENT_CREATE',
      entityName: 'EventItem',
      entityId: event.id,
      afterState: `Created event ${event.name}`,
      sourceSystem: 'TELPRO Intelligence Layer'
    });
  };

  const revalidateEvent = (eventId: string) => {
    setEvents(prev => prev.map(e => e.id === eventId ? {
      ...e,
      revalidationStatus: 'Revalidated',
      lastVerified: new Date().toISOString(),
      version: e.version + 1
    } : e));

    addAuditLog({
      actorName: activeUser.name,
      actorRole: activeUser.role,
      action: 'EVENT_REVALIDATE',
      entityName: 'EventItem',
      entityId: eventId,
      afterState: `Revalidated event data to Version + 1`,
      sourceSystem: 'TELPRO Intelligence Layer'
    });
  };

  const createOpportunity = (opp: Opportunity) => {
    setOpportunities(prev => [opp, ...prev]);
    addAuditLog({
      actorName: activeUser.name,
      actorRole: activeUser.role,
      action: 'OPPORTUNITY_CREATE',
      entityName: 'Opportunity',
      entityId: opp.id,
      afterState: `Created opportunity ${opp.title} with score ${opp.overallScore}`,
      sourceSystem: 'TELPRO Intelligence Layer'
    });
  };

  const addContentWithVersion = (content: ContentItem, version: ContentVersion) => {
    setContents(prev => [content, ...prev]);
    setContentVersions(prev => [version, ...prev]);

    // Initial approval sent to Step 2: Marcom Review (ROLE_ANALYST_QA) after Creator Submission
    const initialApproval: Approval = {
      id: `app-${Date.now()}`,
      contentVersionId: version.id,
      contentId: content.id,
      stage: '02. Marcom Review',
      reviewerName: 'Ahmad Analyst',
      reviewerRole: 'ROLE_ANALYST_QA',
      decision: 'Pending',
      submittedAt: new Date().toISOString(),
      dueAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      slaStatus: 'Normal'
    };
    setApprovals(prev => [initialApproval, ...prev]);

    addAuditLog({
      actorName: activeUser.name,
      actorRole: activeUser.role,
      action: 'CONTENT_CREATE',
      entityName: 'ContentItem',
      entityId: content.id,
      afterState: `Created content ${content.title} Version 1`,
      contentVersionId: version.id,
      sourceSystem: 'TELPRO Creative Studio'
    });
  };

  const updateVersionCta = (versionId: string, newCta: string) => {
    setContentVersions(prev => {
      const updated = prev.map(v => v.id === versionId ? { ...v, cta: newCta } : v);
      localStorage.setItem('telpro_content_versions', JSON.stringify(updated));
      return updated;
    });
    addAuditLog({
      actorName: activeUser.name,
      actorRole: activeUser.role,
      action: 'CTA_UPDATED',
      entityName: 'ContentVersion',
      entityId: versionId,
      beforeState: 'Previous CTA',
      afterState: `Manual CTA updated to: ${newCta.slice(0, 60)}...`,
      contentVersionId: versionId,
      sourceSystem: 'TELPRO Manual CTA Editor'
    });
  };

  const updateVersionDetails = (versionId: string, updatedFields: Partial<ContentVersion>) => {
    setContentVersions(prev => {
      const updated = prev.map(v => v.id === versionId ? { ...v, ...updatedFields } : v);
      localStorage.setItem('telpro_content_versions', JSON.stringify(updated));
      return updated;
    });
    addAuditLog({
      actorName: activeUser.name,
      actorRole: activeUser.role,
      action: 'VERSION_FIELDS_UPDATED',
      entityName: 'ContentVersion',
      entityId: versionId,
      beforeState: 'Previous Version Content',
      afterState: `Manual edit saved for fields: ${Object.keys(updatedFields).join(', ')}`,
      contentVersionId: versionId,
      sourceSystem: 'TELPRO Manual Content Editor'
    });
  };

  const applyAIGeneratedContent = (contentId: string, newVersionData: Partial<ContentVersion>) => {
    const existingContent = contents.find(c => c.id === contentId);
    if (!existingContent) return;

    const existingVersions = contentVersions.filter(v => v.contentId === contentId);
    const nextVerNum = existingVersions.length + 1;
    const newVersionId = `ver-${contentId}-v${nextVerNum}`;

    const latestVersion = existingVersions[existingVersions.length - 1] || {};

    const newVersion: ContentVersion = {
      id: newVersionId,
      contentId,
      versionNumber: nextVerNum,
      brief: newVersionData.brief || latestVersion.brief || 'AI Generated Brief',
      hook: newVersionData.hook || latestVersion.hook || '',
      caption: newVersionData.caption || latestVersion.caption || '',
      script: newVersionData.script || latestVersion.script || '',
      cta: newVersionData.cta || latestVersion.cta || 'Call Center: 1500 473 | WA: +62811 150 4739 (chat only) | Email: info@telpro.co.id | Graha TelkomProperty, Jl. Kebon Sirih No. 10-12, Jakarta Pusat 10110',
      selectedKeywords: newVersionData.selectedKeywords || latestVersion.selectedKeywords || ['TELPRO'],
      selectedHashtags: newVersionData.selectedHashtags || latestVersion.selectedHashtags || ['#TELPRO2026'],
      selectedAudio: newVersionData.selectedAudio || latestVersion.selectedAudio,
      audioRightsStatus: newVersionData.audioRightsStatus || latestVersion.audioRightsStatus || 'Verified for Intended Use',
      createdBy: `${activeUser.name} (AI Applied)`,
      createdAt: new Date().toISOString(),
      aiAssisted: true,
      evidenceIds: newVersionData.evidenceIds || latestVersion.evidenceIds || ['evd-1'],
      riskLevel: newVersionData.riskLevel || 'Low'
    };

    setContentVersions(prev => [...prev, newVersion]);
    setContents(prev => prev.map(c => c.id === contentId ? { ...c, currentVersionId: newVersionId, status: 'Needs Verification' } : c));

    // Reset approval queue for this new version (Sent to Step 2: Marcom Review)
    const newApproval: Approval = {
      id: `app-${Date.now()}`,
      contentVersionId: newVersionId,
      contentId: contentId,
      stage: '02. Marcom Review',
      reviewerName: 'Ahmad Analyst',
      reviewerRole: 'ROLE_ANALYST_QA',
      decision: 'Pending',
      submittedAt: new Date().toISOString(),
      dueAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      slaStatus: 'Normal'
    };
    setApprovals(prev => [newApproval, ...prev]);

    addAuditLog({
      actorName: activeUser.name,
      actorRole: activeUser.role,
      action: 'AI_ACTION_APPLIED',
      entityName: 'ContentVersion',
      entityId: newVersionId,
      beforeState: `Previous Version ID: ${existingContent.currentVersionId}`,
      afterState: `Applied AI generated changes -> Version ${nextVerNum}`,
      contentVersionId: newVersionId,
      sourceSystem: 'TELPRO AI Content Partner'
    });
  };

  const updateApprovalDecision = (approvalId: string, decision: DecisionType, comment?: string) => {
    const appItem = approvals.find(a => a.id === approvalId);
    if (!appItem) return;

    setApprovals(prev => prev.map(a => a.id === approvalId ? {
      ...a,
      decision,
      comment: comment || a.comment,
      decidedAt: new Date().toISOString(),
      reviewerName: activeUser.name,
      reviewerRole: activeUser.role,
      slaStatus: 'Completed'
    } : a));

    // Progress workflow if approved/passed sequentially through the 7-tier hierarchy
    const content = contents.find(c => c.id === appItem.contentId);
    if (content) {
      if (decision === 'Pass' || decision === 'Approve') {
        // Find current step in APPROVAL_HIERARCHY
        let currentStepIdx = APPROVAL_HIERARCHY.findIndex(
          h => h.stage === appItem.stage || h.role === appItem.reviewerRole
        );

        // Fallback matching for legacy stage names
        if (currentStepIdx === -1) {
          if (appItem.stage === 'Fact & Evidence Check') currentStepIdx = 1; // Marcom Review
          else if (appItem.stage === 'Brand & Creative QA' || appItem.stage === 'Manager Review') currentStepIdx = 2; // Manager Marketing Review
          else if (appItem.stage === 'VP Marketing Review') currentStepIdx = 3;
          else if (appItem.stage === 'VP Corsec Review') currentStepIdx = 4;
          else if (appItem.stage === 'Final Approval') currentStepIdx = 5; // Direktur Utama Approval
        }

        const nextHierarchyStep = APPROVAL_HIERARCHY[currentStepIdx + 1];

        if (nextHierarchyStep) {
          const nextApproval: Approval = {
            id: `app-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            contentVersionId: appItem.contentVersionId,
            contentId: appItem.contentId,
            stage: nextHierarchyStep.stage,
            reviewerName: `Pending (${nextHierarchyStep.label})`,
            reviewerRole: nextHierarchyStep.role,
            decision: 'Pending',
            submittedAt: new Date().toISOString(),
            dueAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
            slaStatus: 'Normal'
          };
          setApprovals(prev => [nextApproval, ...prev]);
          setContents(prev => prev.map(c => c.id === content.id ? { ...c, status: 'Under Review' } : c));
        } else {
          // Final stage (Publisher Execution) approved -> mark as Approved / Ready
          setContents(prev => prev.map(c => c.id === content.id ? { ...c, status: 'Approved' } : c));
        }
      } else if (decision === 'Revision Required') {
        setContents(prev => prev.map(c => c.id === content.id ? { ...c, status: 'Revision Required' } : c));
      }
    }

    addAuditLog({
      actorName: activeUser.name,
      actorRole: activeUser.role,
      action: 'APPROVAL_DECISION',
      entityName: 'Approval',
      entityId: approvalId,
      beforeState: `Stage: ${appItem.stage} | Decision: Pending`,
      afterState: `Decision: ${decision} | Comment: ${comment || 'N/A'}`,
      contentVersionId: appItem.contentVersionId,
      sourceSystem: 'TELPRO Governance Engine'
    });
  };

  const publishContent = (contentId: string) => {
    const item = contents.find(c => c.id === contentId);
    if (!item) return;

    setContents(prev => prev.map(c => c.id === contentId ? {
      ...c,
      status: 'PUBLISHED',
      publishedAt: new Date().toISOString(),
      publishedUrl: `https://instagram.com/p/${contentId}_telpro`,
      postPublish: {
        stage: 'MONITORING',
        targetAccount: item.contentOwner === 'Corcomm' ? '@telkomproperty' : '@telprodico',
        publishedAt: new Date().toISOString(),
        metrics: {
          impressions: Math.floor(Math.random() * 8000) + 12000,
          reach: Math.floor(Math.random() * 5000) + 8500,
          engagementRate: Number((Math.random() * 3 + 3.5).toFixed(1)),
          inboundLeads: Math.floor(Math.random() * 14) + 6,
          linkClicks: Math.floor(Math.random() * 100) + 85,
          saveRate: Number((Math.random() * 4 + 4.5).toFixed(1)),
          shares: Math.floor(Math.random() * 35) + 20,
          comments: Math.floor(Math.random() * 25) + 12
        }
      }
    } : c));

    addAuditLog({
      actorName: activeUser.name,
      actorRole: activeUser.role,
      action: 'PUBLISHING_COMPLETE',
      entityName: 'ContentItem',
      entityId: contentId,
      afterState: `Published content to ${item.channel || item.platform || 'Digital Channel'} & initialized Post-Publish Monitoring`,
      contentVersionId: item.currentVersionId,
      sourceSystem: 'TELPRO Activation Module'
    });
  };

  const decideOptimization = (
    contentId: string,
    needed: boolean,
    amplificationTactics?: PostPublishData['amplificationTactics'],
    bestPracticeNotes?: string
  ) => {
    setContents(prev => prev.map(c => {
      if (c.id !== contentId) return c;
      const currentPP: PostPublishData = c.postPublish || {
        stage: 'MONITORING',
        targetAccount: c.contentOwner === 'Corcomm' ? '@telkomproperty' : '@telprodico',
        publishedAt: new Date().toISOString(),
        metrics: {
          impressions: 14500,
          reach: 9200,
          engagementRate: 4.5,
          inboundLeads: 12,
          linkClicks: 88,
          saveRate: 6.8,
          shares: 34,
          comments: 18
        }
      };

      if (needed) {
        return {
          ...c,
          postPublish: {
            ...currentPP,
            stage: 'AMPLIFICATION',
            optimizationNeeded: true,
            amplificationTactics: amplificationTactics || {
              storyRepost: true,
              boostAds: true,
              buzzComments: false,
              startedAt: new Date().toISOString()
            }
          }
        };
      } else {
        return {
          ...c,
          postPublish: {
            ...currentPP,
            stage: 'BEST_PRACTICE',
            optimizationNeeded: false,
            isDocumentedBestPractice: true,
            bestPracticeNotes: bestPracticeNotes || 'Dokumentasi performa solid untuk referensi tim.'
          }
        };
      }
    }));

    addAuditLog({
      actorName: activeUser.name,
      actorRole: activeUser.role,
      action: needed ? 'POST_PUBLISH_AMPLIFY' : 'POST_PUBLISH_BEST_PRACTICE',
      entityName: 'ContentItem',
      entityId: contentId,
      afterState: needed ? 'Optimization needed -> Amplification triggered' : 'Optimization not needed -> Documented as Best Practice',
      sourceSystem: 'TELPRO Post-Publish Closed Loop'
    });
  };

  const recordContentForReport = (contentId: string) => {
    setContents(prev => prev.map(c => {
      if (c.id !== contentId) return c;
      return {
        ...c,
        postPublish: {
          ...(c.postPublish || {
            metrics: { impressions: 12000, reach: 8000, engagementRate: 4.0, inboundLeads: 10, linkClicks: 70, saveRate: 5.0, shares: 20, comments: 10 }
          }),
          stage: 'RECORDED_FOR_REPORT',
          recordedInReport: true,
          recordedAt: new Date().toISOString()
        } as PostPublishData
      };
    }));

    addAuditLog({
      actorName: activeUser.name,
      actorRole: activeUser.role,
      action: 'POST_PUBLISH_RECORD_REPORT',
      entityName: 'ContentItem',
      entityId: contentId,
      afterState: 'Content performance recorded for Monthly Collaboration Evaluation',
      sourceSystem: 'TELPRO Post-Publish Closed Loop'
    });
  };

  const evaluateMonthlyStrategy = (
    contentId: string,
    decision: 'KEEP_CURRENT' | 'TWEAK_STRATEGY',
    tweakNotes?: string,
    nextMonthAction?: string
  ) => {
    setContents(prev => prev.map(c => {
      if (c.id !== contentId) return c;
      return {
        ...c,
        postPublish: {
          ...(c.postPublish || {
            metrics: { impressions: 12000, reach: 8000, engagementRate: 4.0, inboundLeads: 10, linkClicks: 70, saveRate: 5.0, shares: 20, comments: 10 }
          }),
          stage: 'CLOSED_LOOP_COMPLETED',
          monthlyEvaluation: {
            evaluatedAt: new Date().toISOString(),
            strategyDecision: decision,
            tweakNotes,
            nextMonthAction,
            evaluatedBy: `${activeUser.name} (${activeUser.role})`
          }
        } as PostPublishData
      };
    }));

    addAuditLog({
      actorName: activeUser.name,
      actorRole: activeUser.role,
      action: 'MONTHLY_EVALUATION_COMPLETE',
      entityName: 'ContentItem',
      entityId: contentId,
      afterState: `Monthly Evaluation: ${decision}. Next Month Action: ${nextMonthAction || 'None'}`,
      sourceSystem: 'TELPRO Joint Meeting Forum'
    });
  };

  const feedBackToPlanning = (contentId: string, plannedTopic: string) => {
    const newId = `cnt-loop-${Date.now().toString().slice(-4)}`;
    const newContent: ContentItem = {
      id: newId,
      campaignId: 'cmp-2026-01',
      title: plannedTopic,
      objective: 'Tindak lanjut rekomendasi Evaluasi Bulanan',
      audience: 'B2B Enterprise & Stakeholder',
      platform: 'LinkedIn & Instagram',
      format: 'Carousel',
      status: 'PLANNED',
      pic: activeUser.name,
      currentVersionId: `ver-${newId}-v1`,
      topicIdea: plannedTopic,
      targetPublishDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      priority: 'High',
      contentOwner: activeUser.role === 'ROLE_CORCOMM_CREATOR' ? 'Corcomm' : 'Marcomm'
    };
    setContents(prev => [newContent, ...prev]);
  };

  const scheduleContent = (contentId: string, scheduledDate?: string) => {
    const item = contents.find(c => c.id === contentId);
    if (!item) return;

    const dateToSchedule = scheduledDate || item.targetPublishDate || new Date().toISOString().split('T')[0];

    setContents(prev => prev.map(c => c.id === contentId ? {
      ...c,
      status: 'SCHEDULED',
      targetPublishDate: dateToSchedule
    } : c));

    addAuditLog({
      actorName: activeUser.name,
      actorRole: activeUser.role,
      action: 'CONTENT_SCHEDULED',
      entityName: 'ContentItem',
      entityId: contentId,
      afterState: `Konten dijadwalkan untuk publikasi pada: ${dateToSchedule}`,
      sourceSystem: 'TELPRO Content Scheduler'
    });
  };

  const updateMasterTaxonomy = (newTaxonomy: Partial<MasterTaxonomy>): boolean => {
    if (!isContentPlannerOwner(activeUser)) {
      addAuditLog({
        actorName: activeUser.name,
        actorRole: activeUser.role,
        action: 'TAXONOMY_UPDATE_DENIED',
        entityName: 'MasterTaxonomy',
        entityId: 'global',
        afterState: 'Akses ditolak: Hanya Content Planner Owner (Marcomm) yang memiliki otorisasi Master Taxonomy',
        sourceSystem: 'TELPRO RBAC Engine'
      });
      return false;
    }

    setMasterTaxonomy(prev => ({
      ...prev,
      ...newTaxonomy
    }));

    addAuditLog({
      actorName: activeUser.name,
      actorRole: activeUser.role,
      action: 'TAXONOMY_UPDATE',
      entityName: 'MasterTaxonomy',
      entityId: 'global',
      afterState: `Taxonomy updated by Content Planner Owner: ${Object.keys(newTaxonomy).join(', ')}`,
      userPermission: 'CONTENT_PLANNER_OWNER',
      sourceSystem: 'TELPRO Master Taxonomy Manager'
    });
    return true;
  };

  const addRegionalSubmission = (submission: RegionalSubmission) => {
    setRegionalSubmissions(prev => [submission, ...prev]);
    addAuditLog({
      actorName: activeUser.name,
      actorRole: activeUser.role,
      action: 'REGIONAL_SUBMISSION_CREATE',
      entityName: 'RegionalSubmission',
      entityId: submission.id,
      afterState: `Submisi kegiatan regional diajukan: ${submission.topic} (${submission.regional})`,
      sourceSystem: 'TELPRO Regional Inbox'
    });
  };

  const updateRegionalSubmission = (
    submissionId: string,
    updatedData: Partial<RegionalSubmission>
  ) => {
    setRegionalSubmissions(prev => prev.map(s => s.id === submissionId ? {
      ...s,
      ...updatedData
    } : s));

    addAuditLog({
      actorName: activeUser.name,
      actorRole: activeUser.role,
      action: 'REGIONAL_SUBMISSION_EDIT',
      entityName: 'RegionalSubmission',
      entityId: submissionId,
      afterState: `Submisi kegiatan regional diperbarui: ${updatedData.topic || submissionId}`,
      sourceSystem: 'TELPRO Regional Inbox'
    });
  };

  const updateRegionalSubmissionStatus = (
    submissionId: string,
    status: RegionalSubmission['currentStatus'],
    notes?: string
  ) => {
    setRegionalSubmissions(prev => prev.map(s => s.id === submissionId ? {
      ...s,
      currentStatus: status,
      revisionNotes: notes || s.revisionNotes
    } : s));

    addAuditLog({
      actorName: activeUser.name,
      actorRole: activeUser.role,
      action: 'REGIONAL_SUBMISSION_STATUS',
      entityName: 'RegionalSubmission',
      entityId: submissionId,
      afterState: `Status diubah menjadi: ${status}${notes ? ` | Catatan: ${notes}` : ''}`,
      sourceSystem: 'TELPRO Regional Inbox'
    });
  };

  const convertRegionalToPlanner = (
    submissionId: string,
    overrides?: Partial<ContentItem>
  ): ContentItem | undefined => {
    const sub = regionalSubmissions.find(s => s.id === submissionId);
    if (!sub) return undefined;

    const newContentId = `cnt-reg-${Date.now().toString().slice(-4)}`;
    const newVersionId = `ver-${newContentId}-v1`;

    const newContent: ContentItem = {
      id: newContentId,
      campaignId: selectedCampaignId || 'cmp-2026-01',
      title: sub.topic,
      objective: `Mendukung publikasi inisiatif ${sub.activity} di ${sub.regional}`,
      audience: sub.targetAudience || 'Manajer Bisnis & Komunitas Regional',
      platform: 'LinkedIn & Instagram',
      format: 'Carousel',
      status: 'PLANNED',
      pic: `${activeUser.name} (Curated from ${sub.picRegional})`,
      currentVersionId: newVersionId,

      // Section A: STRATEGY
      campaignProgram: selectedCampaign?.name || 'Transformasi Digital Industri B2B 2026',
      primaryObjective: 'Brand Awareness',
      targetAudience: sub.targetAudience || 'Manajer Bisnis & Komunitas Regional',
      contentPillar: (sub.contentPillarSuggestion as any) || 'Customer Story',
      keyMessage: `Inisiatif ${sub.activity} memperkuat infrastruktur dan pertumbuhan ekonomi digital wilayah ${sub.regional}.`,

      // Section B: CONTENT
      topicIdea: sub.topic,
      contentFormat: 'Carousel',
      channel: 'LinkedIn',
      cta: FULL_CTA_DEFAULT,
      sourceReference: `Dokumen Lapangan: ${sub.supportingDocumentName || 'Dokumentasi Berita Acara'} (${sub.location})`,

      // Section C: EXECUTION
      contentOwner: 'Regional',
      regionalUnit: sub.regional,
      picRegional: sub.picRegional,
      activityProgram: sub.activity,
      location: sub.location,
      activityDate: sub.activityDate,
      supportingAsset: sub.supportingAssetUrl || 'Uploaded Photo / Asset Package',
      requestedPublishDate: sub.requestedPublishDate,
      picName: activeUser.name,
      targetPublishDate: sub.requestedPublishDate || new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0],
      priority: 'High',

      // Section D: READINESS
      supportingAssetStatus: sub.supportingAssetStatus === 'Verified' ? 'Asset Ready (Verified)' : 'Draft Asset Under Review',
      supportingDataEvidence: sub.supportingDocumentName || 'Dokumentasi Lapangan & Berita Acara',
      readinessNotes: `Dikurasi oleh Marcomm (${activeUser.name}) dari usulan Regional Inbox #${sub.id}. Lokasi: ${sub.location}.`,

      marcommReviewStatus: 'Pending',
      corcommReviewStatus: 'Pending',
      reviewChecklist: {
        brandSafety: false,
        factCheck: false,
        claimCheck: false,
        corporateTone: false
      },

      ...overrides
    };

    const newVersion: ContentVersion = {
      id: newVersionId,
      contentId: newContentId,
      versionNumber: 1,
      brief: `Publikasi kegiatan: ${sub.activity}. Lokasi: ${sub.location}. Target audience: ${sub.targetAudience || 'Regional Enterprise'}.`,
      hook: `${sub.topic} — Langkah Nyata Digitalisasi Wilayah!`,
      caption: `TELPRO terus memperluas komitmen konektivitas andal di seluruh penjuru negeri.\n\nMelalui kegiatan ${sub.activity} di ${sub.location}, kami memastikan ketersediaan layanan dengan standar SLA tertinggi untuk mendukung mobilitas dan efisiensi bisnis.\n\n#TELPRO2026 #KonektivitasRegional #${sub.regional.replace(/\s+/g, '')}`,
      script: `Slide 1: Foto dokumentasi ${sub.activity} di ${sub.location}.\nSlide 2: Detail pencapaian dan keunggulan teknis.\nSlide 3: Komitmen TELPRO & CTA kontak sales.`,
      cta: FULL_CTA_DEFAULT,
      selectedKeywords: ['TELPRO Regional', 'Konektivitas', sub.regional],
      selectedHashtags: ['#TELPRO2026', '#InfrastrukturDigital'],
      createdBy: `${activeUser.name} (Curated from ${sub.picRegional})`,
      createdAt: new Date().toISOString(),
      aiAssisted: false,
      evidenceIds: ['evd-1'],
      riskLevel: 'Low'
    };

    setContents(prev => [newContent, ...prev]);
    setContentVersions(prev => [newVersion, ...prev]);

    setRegionalSubmissions(prev => prev.map(s => s.id === submissionId ? {
      ...s,
      currentStatus: 'CONVERTED TO CONTENT PLAN',
      convertedContentId: newContentId
    } : s));

    addAuditLog({
      actorName: activeUser.name,
      actorRole: activeUser.role,
      action: 'REGIONAL_CONVERTED_TO_PLANNER',
      entityName: 'ContentItem',
      entityId: newContentId,
      afterState: `Submisi Regional #${submissionId} berhasil dikurasi menjadi rencana konten "${newContent.title}" dengan Content Owner: Regional`,
      sourceSystem: 'TELPRO Content Planner Kurasi'
    });

    return newContent;
  };

  const submitPlannerStructureRequest = (req: Omit<PlannerStructureChangeRequest, 'id' | 'requestedAt' | 'status'>) => {
    const newReq: PlannerStructureChangeRequest = {
      ...req,
      id: `str-req-${Date.now()}`,
      requestedAt: new Date().toISOString(),
      status: 'PENDING'
    };
    setPlannerStructureRequests(prev => [newReq, ...prev]);
    addAuditLog({
      actorName: activeUser.name,
      actorRole: activeUser.role,
      action: 'PLANNER_STRUCTURE_REQUEST_SUBMITTED',
      entityName: 'PlannerStructureChangeRequest',
      entityId: newReq.id,
      afterState: `Usulan perubahan struktur planner diajukan: ${newReq.title}`,
      sourceSystem: 'TELPRO Planner Governance'
    });
  };

  const reviewPlannerStructureRequest = (
    requestId: string,
    status: 'ACTIVE' | 'REJECTED',
    comment?: string
  ) => {
    setPlannerStructureRequests(prev => prev.map(r => r.id === requestId ? {
      ...r,
      status,
      corcommReviewer: activeUser.name,
      corcommComment: comment,
      reviewedAt: new Date().toISOString()
    } : r));

    addAuditLog({
      actorName: activeUser.name,
      actorRole: activeUser.role,
      action: 'PLANNER_STRUCTURE_REQUEST_REVIEWED',
      entityName: 'PlannerStructureChangeRequest',
      entityId: requestId,
      afterState: `Keputusan struktur planner: ${status} oleh Corcomm (${activeUser.name}). Catatan: ${comment || 'N/A'}`,
      sourceSystem: 'TELPRO Corcomm Co-Governance'
    });
  };

  const updateContentPlannerItem = (contentId: string, updatedFields: Partial<ContentItem>) => {
    const existing = contents.find(c => c.id === contentId);
    if (!existing) return;

    setContents(prev => prev.map(c => c.id === contentId ? { ...c, ...updatedFields } : c));

    addAuditLog({
      actorName: activeUser.name,
      actorRole: activeUser.role,
      action: 'CONTENT_PLANNER_ITEM_UPDATE',
      entityName: 'ContentItem',
      entityId: contentId,
      beforeState: `Status: ${existing.status} | Title: ${existing.title}`,
      afterState: `Updated fields: ${Object.keys(updatedFields).join(', ')}`,
      sourceSystem: 'TELPRO Content Planner Single Source of Truth'
    });
  };

  const executeJointReview = (
    contentId: string,
    reviewerType: 'marcomm' | 'corcomm' | 'joint',
    decision: 'Approved' | 'Revision',
    checklist: NonNullable<ContentItem['reviewChecklist']>,
    comment?: string
  ) => {
    const content = contents.find(c => c.id === contentId);
    if (!content) return;

    setContents(prev => prev.map(c => {
      if (c.id !== contentId) return c;

      const newChecklist = { ...c.reviewChecklist, ...checklist };
      let newMarcommStatus = c.marcommReviewStatus;
      let newCorcommStatus = c.corcommReviewStatus;
      let newMarcommReviewer = c.marcommReviewer;
      let newCorcommReviewer = c.corcommReviewer;

      if (reviewerType === 'marcomm') {
        newMarcommStatus = decision === 'Approved' ? 'Reviewed' : 'Revision';
        newMarcommReviewer = activeUser.name;
      } else if (reviewerType === 'corcomm') {
        newCorcommStatus = decision === 'Approved' ? 'Reviewed' : 'Revision';
        newCorcommReviewer = activeUser.name;
      } else if (reviewerType === 'joint') {
        newMarcommStatus = decision === 'Approved' ? 'Reviewed' : 'Revision';
        newCorcommStatus = decision === 'Approved' ? 'Reviewed' : 'Revision';
        newMarcommReviewer = `${activeUser.name} (Reviewer Marcomm/Corcomm)`;
        newCorcommReviewer = `${activeUser.name} (Reviewer Marcomm/Corcomm)`;
      }

      if (newMarcommStatus === 'Revision' || newCorcommStatus === 'Revision') {
        return {
          ...c,
          marcommReviewStatus: newMarcommStatus,
          corcommReviewStatus: newCorcommStatus,
          marcommReviewer: newMarcommReviewer,
          corcommReviewer: newCorcommReviewer,
          reviewChecklist: newChecklist,
          status: 'REVISION',
          rejectionReason: comment
        };
      }

      const isBothApproved = newMarcommStatus === 'Reviewed' && newCorcommStatus === 'Reviewed';
      const newStatus = isBothApproved ? 'APPROVED' : 'IN REVIEW';

      return {
        ...c,
        marcommReviewStatus: newMarcommStatus,
        corcommReviewStatus: newCorcommStatus,
        marcommReviewer: newMarcommReviewer,
        corcommReviewer: newCorcommReviewer,
        reviewChecklist: newChecklist,
        status: newStatus
      };
    }));

    addAuditLog({
      actorName: activeUser.name,
      actorRole: activeUser.role,
      action: 'JOINT_REVIEW_DECISION',
      entityName: 'ContentItem',
      entityId: contentId,
      afterState: `Review Bersama (${activeUser.name}): ${decision}. Checklist: BrandSafety=${checklist.brandSafety}, Fact=${checklist.factCheck}, Claim=${checklist.claimCheck}, Tone=${checklist.corporateTone}. Catatan: ${comment || 'Disetujui'}`,
      sourceSystem: 'TELPRO Review Governance'
    });
  };

  const addGovernanceComment = (
    contentId: string,
    commentData: Omit<GovernanceComment, 'id' | 'createdAt'>
  ) => {
    const newComment: GovernanceComment = {
      ...commentData,
      id: `gov-cmt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString()
    };

    setContents(prev => prev.map(c => {
      if (c.id !== contentId) return c;
      const existing = c.governanceComments || [];
      return {
        ...c,
        governanceComments: [...existing, newComment]
      };
    }));

    addAuditLog({
      actorName: activeUser.name,
      actorRole: activeUser.role,
      action: 'GOVERNANCE_DISCUSSION_COMMENT',
      entityName: 'ContentItem',
      entityId: contentId,
      afterState: `Catatan Diskusi [${commentData.type}]: ${commentData.content}`,
      sourceSystem: 'TELPRO Governance Discussion'
    });
  };

  const executeVpCorsecApproval = (
    contentId: string,
    decision: 'Approved' | 'Revision' | boolean,
    comment?: string,
    category?: string,
    urgency?: GovernanceComment['urgency']
  ) => {
    const isApproved = decision === 'Approved' || decision === true;
    const finalDecision: 'Approved' | 'Revision' = isApproved ? 'Approved' : 'Revision';

    const newComment: GovernanceComment = {
      id: `gov-cmt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      authorName: activeUser.name,
      authorRole: activeUser.role,
      authorTitle: activeUser.title,
      content: comment || (isApproved ? 'Otorisasi VP Corsec diberikan (Governance Cleared). Sesuai reputasi holding.' : 'Perlu revisi naskah & kelengkapan audit.'),
      createdAt: new Date().toISOString(),
      type: 'vp_corsec_audit',
      category: category || 'Brand Safety & Reputasi Holding',
      urgency: urgency || (isApproved ? 'Minor Redaksional' : 'Wajib Penyesuaian')
    };

    setContents(prev => prev.map(c => {
      if (c.id !== contentId) return c;
      const existingComments = c.governanceComments || [];
      return {
        ...c,
        vpCorsecApprovalStatus: finalDecision,
        vpCorsecApproved: isApproved,
        vpCorsecApprover: activeUser.name,
        vpCorsecApprovedAt: isApproved ? new Date().toISOString() : undefined,
        // If approved by VP Corsec, remains IN REVIEW for Dirut; if rejected, status = REVISION
        status: isApproved ? 'IN REVIEW' : 'REVISION',
        rejectionReason: isApproved ? undefined : (comment || 'Catatan telaah VP Corsec'),
        governanceComments: [...existingComments, newComment]
      };
    }));

    addAuditLog({
      actorName: activeUser.name,
      actorRole: activeUser.role,
      action: 'VP_CORSEC_APPROVAL',
      entityName: 'ContentItem',
      entityId: contentId,
      afterState: `Otorisasi VP Corsec: ${finalDecision}. Approver: ${activeUser.name}. Kategori: ${category || 'Umum'}. Catatan: ${comment || 'Sesuai guideline reputasi holding'}`,
      userPermission: 'VP_CORSEC_APPROVAL',
      sourceSystem: 'TELPRO Corsec Governance'
    });
  };

  const executeFinalApproval = (
    contentId: string,
    decision: 'Approved' | 'Revision' | boolean,
    directiveText?: string,
    directiveChip?: string
  ) => {
    const isApproved = decision === 'Approved' || decision === true;
    const finalDecision: 'Approved' | 'Revision' = isApproved ? 'Approved' : 'Revision';

    const newComment: GovernanceComment = {
      id: `gov-cmt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      authorName: activeUser.name,
      authorRole: activeUser.role,
      authorTitle: activeUser.title,
      content: directiveText || (directiveChip ? `Arahan: ${directiveChip}` : (isApproved ? 'Disposisi Disetujui Penuh oleh Plt. Direktur Utama. Siap publikasi live.' : 'Plt. Dirut meminta perbaikan naskah.')),
      createdAt: new Date().toISOString(),
      type: 'dirut_directive',
      directiveChip: directiveChip || (isApproved ? '👍 Disetujui Penuh' : '✏️ Perlu Penyesuaian')
    };

    setContents(prev => prev.map(c => {
      if (c.id !== contentId) return c;
      const existingComments = c.governanceComments || [];
      return {
        ...c,
        finalApprovalStatus: finalDecision,
        finalApproved: isApproved,
        finalApprover: activeUser.name,
        finalApprovedAt: isApproved ? new Date().toISOString() : undefined,
        status: isApproved ? 'APPROVED' : 'REVISION',
        rejectionReason: isApproved ? undefined : (directiveText || directiveChip || 'Arahan penyesuaian Plt. Dirut'),
        governanceComments: [...existingComments, newComment]
      };
    }));

    addAuditLog({
      actorName: activeUser.name,
      actorRole: activeUser.role,
      action: 'FINAL_CONTENT_APPROVAL',
      entityName: 'ContentItem',
      entityId: contentId,
      afterState: `Otorisasi Akhir Plt. Direktur Utama: ${finalDecision} oleh ${activeUser.name} (${activeUser.title}). Disposisi: ${directiveChip || ''} - ${directiveText || 'Persetujuan eksekutif tertinggi'}`,
      userPermission: 'FINAL_CONTENT_APPROVAL',
      sourceSystem: 'TELPRO Executive Authority'
    });
  };

  const addEvidence = (evidence: Evidence) => {
    setEvidences(prev => [evidence, ...prev]);
    addAuditLog({
      actorName: activeUser.name,
      actorRole: activeUser.role,
      action: 'EVIDENCE_ADD',
      entityName: 'Evidence',
      entityId: evidence.id,
      afterState: `Added evidence source: ${evidence.sourceTitle}`,
      sourceSystem: 'TELPRO Evidence Pack'
    });
  };

  const addBudgetItem = (item: BudgetItem) => {
    setBudgets(prev => [item, ...prev]);
    addAuditLog({
      actorName: activeUser.name,
      actorRole: activeUser.role,
      action: 'BUDGET_UPDATE',
      entityName: 'BudgetItem',
      entityId: item.id,
      afterState: `Added budget item ${item.activityName} - Rp ${item.allocatedAmount.toLocaleString()}`,
      sourceSystem: 'TELPRO Budget Ledger'
    });
  };

  const sendAIMessage = async (text: string) => {
    const userMsg: AIMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };
    setAiMessages(prev => [...prev, userMsg]);
    setIsAILoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          campaignContext: selectedCampaign,
          history: aiMessages.slice(-5).map(m => ({ role: m.sender, text: m.text }))
        })
      });

      const data = await res.json();
      const aiMsg: AIMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: data.answer || 'Maaf, gagal memproses respons AI.',
        timestamp: new Date().toISOString(),
        sources: data.sources || [],
        confidence: data.confidence || 'high',
        assumptions: data.assumptions || [],
        risks: data.risks || [],
        missingData: data.missing_data || [],
        suggestedActions: data.suggested_actions || []
      };

      setAiMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error("AI error:", err);
      setAiMessages(prev => [...prev, {
        id: `msg-err-${Date.now()}`,
        sender: 'ai',
        text: 'Terjadi kendala jaringan saat menghubungi TELPRO AI Service. Silakan coba lagi.',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsAILoading(false);
    }
  };

  const clearAIChat = () => {
    setAiMessages([
      {
        id: 'msg-init-reset',
        sender: 'ai',
        text: 'Sesi percakapan direset. TELPRO AI Content Partner siap mendiskusikan strategi & ide konten baru.',
        timestamp: new Date().toISOString(),
        sources: ['TELPRO Knowledge Base 2026']
      }
    ]);
  };

  const updateStoryboardScene = (storyboardId: string, sceneId: string, updatedScene: Partial<StoryboardScene>) => {
    setStoryboards(prev =>
      prev.map(stb => {
        if (stb.id !== storyboardId) return stb;
        return {
          ...stb,
          scenes: stb.scenes.map(sc => (sc.id === sceneId ? { ...sc, ...updatedScene } : sc))
        };
      })
    );
    addAuditLog({
      actorName: activeUser.name,
      actorRole: activeUser.role,
      action: 'UPDATE_STORYBOARD_SCENE',
      entityName: 'StoryboardScene',
      entityId: sceneId,
      sourceSystem: 'Visual Storyboard Generator'
    });
  };

  const addStoryboardScene = (storyboardId: string, newScene: StoryboardScene) => {
    setStoryboards(prev =>
      prev.map(stb => {
        if (stb.id !== storyboardId) return stb;
        return { ...stb, scenes: [...stb.scenes, newScene] };
      })
    );
    addAuditLog({
      actorName: activeUser.name,
      actorRole: activeUser.role,
      action: 'ADD_STORYBOARD_SCENE',
      entityName: 'StoryboardScene',
      entityId: newScene.id,
      sourceSystem: 'Visual Storyboard Generator'
    });
  };

  const addStoryboard = (storyboard: Storyboard) => {
    setStoryboards(prev => [storyboard, ...prev]);
    addAuditLog({
      actorName: activeUser.name,
      actorRole: activeUser.role,
      action: 'ADD_STORYBOARD',
      entityName: 'Storyboard',
      entityId: storyboard.id,
      sourceSystem: 'Visual Storyboard Generator'
    });
  };

  const addVideoProject = (project: VideoProject) => {
    setVideoProjects(prev => [project, ...prev]);
    addAuditLog({
      actorName: activeUser.name,
      actorRole: activeUser.role,
      action: 'ADD_VIDEO_PROJECT',
      entityName: 'VideoProject',
      entityId: project.id,
      sourceSystem: 'AI Video Studio'
    });
  };

  const updateVideoScene = (videoProjectId: string, videoSceneId: string, updatedScene: Partial<VideoScene>) => {
    setVideoProjects(prev =>
      prev.map(proj => {
        if (proj.id !== videoProjectId) return proj;
        return {
          ...proj,
          scenes: proj.scenes.map(sc => (sc.id === videoSceneId ? { ...sc, ...updatedScene } : sc))
        };
      })
    );
    addAuditLog({
      actorName: activeUser.name,
      actorRole: activeUser.role,
      action: 'UPDATE_VIDEO_SCENE',
      entityName: 'VideoScene',
      entityId: videoSceneId,
      sourceSystem: 'AI Video Studio'
    });
  };

  const regenerateSceneMedia = (videoProjectId: string, videoSceneId: string) => {
    const timestamp = Date.now();
    setVideoProjects(prev =>
      prev.map(proj => {
        if (proj.id !== videoProjectId) return proj;
        return {
          ...proj,
          scenes: proj.scenes.map(sc => {
            if (sc.id !== videoSceneId) return sc;
            return {
              ...sc,
              thumbnailUrl: `https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80&sig=${timestamp}`,
              reviewStatus: 'Pending'
            };
          })
        };
      })
    );
    addAuditLog({
      actorName: activeUser.name,
      actorRole: activeUser.role,
      action: 'REGENERATE_VIDEO_SCENE',
      entityName: 'VideoScene',
      entityId: videoSceneId,
      sourceSystem: 'AI Video Router'
    });
  };

  const clearAllDummyData = () => {
    setCampaigns([]);
    setTrends([]);
    setEvents([]);
    setEvidences([]);
    setOpportunities([]);
    setContents([]);
    setContentVersions([]);
    setApprovals([]);
    setBudgets([]);
    setStoryboards([]);
    setVideoProjects([]);
    setRegionalSubmissions([]);
    setPlannerStructureRequests([]);
    setSelectedCampaignId('');

    localStorage.removeItem('telpro_campaigns');
    localStorage.removeItem('telpro_trends');
    localStorage.removeItem('telpro_events');
    localStorage.removeItem('telpro_evidences');
    localStorage.removeItem('telpro_opportunities');
    localStorage.removeItem('telpro_contents');
    localStorage.removeItem('telpro_content_versions');
    localStorage.removeItem('telpro_approvals');
    localStorage.removeItem('telpro_budgets');
    localStorage.removeItem('telpro_storyboards');
    localStorage.removeItem('telpro_video_projects');
    localStorage.removeItem('telpro_regional_submissions');
    localStorage.removeItem('telpro_planner_structure_requests');

    addAuditLog({
      actorName: activeUser.name,
      actorRole: activeUser.role,
      action: 'CLEAR_ALL_DUMMY_DATA',
      entityName: 'SystemData',
      entityId: 'ALL',
      afterState: 'Dikosongkan semua data dummy untuk pengujian end-to-end',
      sourceSystem: 'TELPRO System Data Manager'
    });
  };

  const restoreDemoData = () => {
    setCampaigns(INITIAL_CAMPAIGNS);
    setTrends(INITIAL_TRENDS);
    setEvents(INITIAL_EVENTS);
    setEvidences(INITIAL_EVIDENCES);
    setOpportunities(INITIAL_OPPORTUNITIES);
    setContents(INITIAL_CONTENTS);
    setContentVersions(INITIAL_CONTENT_VERSIONS);
    setApprovals(INITIAL_APPROVALS);
    setBudgets(INITIAL_BUDGETS);
    setStoryboards(INITIAL_STORYBOARDS);
    setVideoProjects(INITIAL_VIDEO_PROJECTS);
    setMasterTaxonomy(INITIAL_MASTER_TAXONOMY);
    setRegionalSubmissions(INITIAL_REGIONAL_SUBMISSIONS);
    setPlannerStructureRequests(INITIAL_PLANNER_STRUCTURE_REQUESTS);
    setSelectedCampaignId(INITIAL_CAMPAIGNS[0].id);

    localStorage.setItem('telpro_campaigns', JSON.stringify(INITIAL_CAMPAIGNS));
    localStorage.setItem('telpro_trends', JSON.stringify(INITIAL_TRENDS));
    localStorage.setItem('telpro_events', JSON.stringify(INITIAL_EVENTS));
    localStorage.setItem('telpro_evidences', JSON.stringify(INITIAL_EVIDENCES));
    localStorage.setItem('telpro_opportunities', JSON.stringify(INITIAL_OPPORTUNITIES));
    localStorage.setItem('telpro_contents', JSON.stringify(INITIAL_CONTENTS));
    localStorage.setItem('telpro_content_versions', JSON.stringify(INITIAL_CONTENT_VERSIONS));
    localStorage.setItem('telpro_approvals', JSON.stringify(INITIAL_APPROVALS));
    localStorage.setItem('telpro_budgets', JSON.stringify(INITIAL_BUDGETS));
    localStorage.setItem('telpro_storyboards', JSON.stringify(INITIAL_STORYBOARDS));
    localStorage.setItem('telpro_video_projects', JSON.stringify(INITIAL_VIDEO_PROJECTS));
    localStorage.setItem('telpro_master_taxonomy', JSON.stringify(INITIAL_MASTER_TAXONOMY));
    localStorage.setItem('telpro_regional_submissions', JSON.stringify(INITIAL_REGIONAL_SUBMISSIONS));
    localStorage.setItem('telpro_planner_structure_requests', JSON.stringify(INITIAL_PLANNER_STRUCTURE_REQUESTS));

    addAuditLog({
      actorName: activeUser.name,
      actorRole: activeUser.role,
      action: 'RESTORE_DEMO_DATA',
      entityName: 'SystemData',
      entityId: 'ALL',
      afterState: 'Dipulihkan data demo awal dan tata kelola Content Planner',
      sourceSystem: 'TELPRO System Data Manager'
    });
  };

  return (
    <AppContext.Provider
      value={{
        activeUser,
        setActiveUserRole,
        switchUser,
        users,
        selectedCampaignId,
        setSelectedCampaignId,
        selectedCampaign,
        campaigns,
        trends,
        events,
        evidences,
        opportunities,
        contents,
        contentVersions,
        approvals,
        budgets,
        auditLogs,
        leadFeedbacks,
        performanceMetrics,
        learnings,
        integrations,
        aiMessages,
        isAILoading,
        isAiPartnerModalOpen,
        setIsAiPartnerModalOpen,
        storyboards,
        videoProjects,
        masterTaxonomy,
        regionalSubmissions,
        plannerStructureRequests,
        isAuthenticated,
        login,
        logout,
        clearAllDummyData,
        restoreDemoData,
        addCampaign,
        updateCampaignStatus,
        addTrend,
        addEvent,
        revalidateEvent,
        createOpportunity,
        addContentWithVersion,
        updateVersionCta,
        updateVersionDetails,
        applyAIGeneratedContent,
        updateApprovalDecision,
        addEvidence,
        addBudgetItem,
        addAuditLog,
        sendAIMessage,
        clearAIChat,
        publishContent,
        scheduleContent,
        updateStoryboardScene,
        addStoryboardScene,
        addStoryboard,
        updateVideoScene,
        regenerateSceneMedia,
        addVideoProject,
        updateMasterTaxonomy,
        addRegionalSubmission,
        updateRegionalSubmission,
        updateRegionalSubmissionStatus,
        convertRegionalToPlanner,
        submitPlannerStructureRequest,
        reviewPlannerStructureRequest,
        updateContentPlannerItem,
        addGovernanceComment,
        executeJointReview,
        executeVpCorsecApproval,
        executeFinalApproval,
        decideOptimization,
        recordContentForReport,
        evaluateMonthlyStrategy,
        feedBackToPlanning
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
