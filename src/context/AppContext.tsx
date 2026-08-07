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
  ContentStatus
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
  INITIAL_INTEGRATIONS
} from '../mockData';

interface AppContextType {
  activeUser: UserProfile;
  setActiveUserRole: (role: UserRole) => void;
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

  // Actions
  addCampaign: (campaign: Campaign) => void;
  updateCampaignStatus: (id: string, status: Campaign['status']) => void;
  addTrend: (trend: Trend) => void;
  addEvent: (event: EventItem) => void;
  revalidateEvent: (eventId: string) => void;
  createOpportunity: (opp: Opportunity) => void;
  addContentWithVersion: (content: ContentItem, version: ContentVersion) => void;
  applyAIGeneratedContent: (contentId: string, newVersionData: Partial<ContentVersion>) => void;
  updateApprovalDecision: (approvalId: string, decision: DecisionType, comment?: string) => void;
  addEvidence: (evidence: Evidence) => void;
  addBudgetItem: (item: BudgetItem) => void;
  addAuditLog: (event: Omit<AuditEvent, 'id' | 'timestamp'>) => void;
  sendAIMessage: (text: string) => Promise<void>;
  clearAIChat: () => void;
  publishContent: (contentId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users] = useState<UserProfile[]>(INITIAL_USERS);
  const [activeUser, setActiveUser] = useState<UserProfile>(INITIAL_USERS[0]);
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

  const [contentVersions, setContentVersions] = useState<ContentVersion[]>(() => {
    const local = localStorage.getItem('telpro_content_versions');
    return local ? JSON.parse(local) : INITIAL_CONTENT_VERSIONS;
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

  const [aiMessages, setAiMessages] = useState<AIMessage[]>([
    {
      id: 'msg-init',
      sender: 'ai',
      text: 'Halo! Saya TELPRO AI Content Partner. Ada ide campaign atau trend yang ingin dikembangkan menjadi paket konten terverifikasi hari ini?',
      timestamp: new Date().toISOString(),
      sources: ['TELPRO Knowledge Base 2026', 'Evidence Pack EVD-1'],
      confidence: 'high',
      suggestedActions: [
        { type: 'Apply to Brief', label: 'Buat Brief Smart Warehouse' },
        { type: 'Create Storyboard', label: 'Draft Video Storyboard 30s' }
      ]
    }
  ]);
  const [isAILoading, setIsAILoading] = useState<boolean>(false);

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

  const setActiveUserRole = (role: UserRole) => {
    const found = users.find(u => u.role === role);
    if (found) {
      setActiveUser(found);
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

    // Create initial approval stage (Fact Check & Evidence Check)
    const initialApproval: Approval = {
      id: `app-${Date.now()}`,
      contentVersionId: version.id,
      contentId: content.id,
      stage: 'Fact & Evidence Check',
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
      cta: newVersionData.cta || latestVersion.cta || 'Hubungi Sales TELPRO',
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

    // Reset approval queue for this new version
    const newApproval: Approval = {
      id: `app-${Date.now()}`,
      contentVersionId: newVersionId,
      contentId: contentId,
      stage: 'Fact & Evidence Check',
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

    // Progress workflow if approved/passed
    const content = contents.find(c => c.id === appItem.contentId);
    if (content) {
      if (decision === 'Pass' || decision === 'Approve') {
        let nextStage: ApprovalStage | null = null;
        let nextStatus: ContentStatus = 'Under Review';

        if (appItem.stage === 'Fact & Evidence Check') {
          nextStage = 'Brand & Creative QA';
        } else if (appItem.stage === 'Brand & Creative QA') {
          nextStage = 'Manager Review';
        } else if (appItem.stage === 'Manager Review') {
          nextStage = 'VP Marketing Review';
        } else if (appItem.stage === 'VP Marketing Review') {
          nextStage = 'VP Corsec Review';
        } else if (appItem.stage === 'VP Corsec Review') {
          nextStage = 'Final Approval';
        } else if (appItem.stage === 'Final Approval') {
          nextStatus = 'Approved';
        }

        if (nextStage) {
          const nextApproval: Approval = {
            id: `app-${Date.now()}-${Math.floor(Math.random() * 100)}`,
            contentVersionId: appItem.contentVersionId,
            contentId: appItem.contentId,
            stage: nextStage,
            reviewerName: 'Pending Officer',
            reviewerRole: nextStage === 'Manager Review' ? 'ROLE_MANAGER_MARKETING' :
                          nextStage === 'VP Marketing Review' ? 'ROLE_VP_MARKETING' :
                          nextStage === 'VP Corsec Review' ? 'ROLE_VP_CORSEC' : 'ROLE_FINAL_APPROVER',
            decision: 'Pending',
            submittedAt: new Date().toISOString(),
            dueAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
            slaStatus: 'Normal'
          };
          setApprovals(prev => [nextApproval, ...prev]);
        } else {
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
      status: 'Published',
      publishedAt: new Date().toISOString(),
      publishedUrl: `https://linkedin.com/company/telpro/posts/${contentId}`
    } : c));

    addAuditLog({
      actorName: activeUser.name,
      actorRole: activeUser.role,
      action: 'PUBLISHING_COMPLETE',
      entityName: 'ContentItem',
      entityId: contentId,
      afterState: `Published content to ${item.platform}`,
      contentVersionId: item.currentVersionId,
      sourceSystem: 'TELPRO Activation Module'
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

  return (
    <AppContext.Provider
      value={{
        activeUser,
        setActiveUserRole,
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
        addCampaign,
        updateCampaignStatus,
        addTrend,
        addEvent,
        revalidateEvent,
        createOpportunity,
        addContentWithVersion,
        applyAIGeneratedContent,
        updateApprovalDecision,
        addEvidence,
        addBudgetItem,
        addAuditLog,
        sendAIMessage,
        clearAIChat,
        publishContent
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
