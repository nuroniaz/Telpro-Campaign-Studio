import { UserRole } from '../types';

export interface RolePermission {
  role: UserRole;
  roleName: string;
  allowedActions: {
    canCreateCampaign: boolean;
    canEditStrategy: boolean;
    canAddTrend: boolean;
    canCreateContent: boolean;
    canApproveGovernance: boolean;
    canPublishContent: boolean;
    canManageBudget: boolean;
    canManageSystem: boolean;
    isReadOnly: boolean;
  };
  primaryModules: string[];
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermission> = {
  ROLE_MARCOM_CREATOR: {
    role: 'ROLE_MARCOM_CREATOR',
    roleName: 'Marcom & Content Creator',
    allowedActions: {
      canCreateCampaign: true,
      canEditStrategy: true,
      canAddTrend: true,
      canCreateContent: true,
      canApproveGovernance: false,
      canPublishContent: false,
      canManageBudget: false,
      canManageSystem: false,
      isReadOnly: false,
    },
    primaryModules: ['03. INTELLIGENCE', '04. CONTENT & PRODUCTION']
  },
  ROLE_ANALYST_QA: {
    role: 'ROLE_ANALYST_QA',
    roleName: 'Analyst & Evidence QA',
    allowedActions: {
      canCreateCampaign: false,
      canEditStrategy: false,
      canAddTrend: true,
      canCreateContent: false,
      canApproveGovernance: true,
      canPublishContent: false,
      canManageBudget: false,
      canManageSystem: false,
      isReadOnly: false,
    },
    primaryModules: ['03. INTELLIGENCE', '05. GOVERNANCE']
  },
  ROLE_PUBLISHER: {
    role: 'ROLE_PUBLISHER',
    roleName: 'Digital Publishing Specialist',
    allowedActions: {
      canCreateCampaign: false,
      canEditStrategy: false,
      canAddTrend: false,
      canCreateContent: false,
      canApproveGovernance: false,
      canPublishContent: true,
      canManageBudget: false,
      canManageSystem: false,
      isReadOnly: false,
    },
    primaryModules: ['04. CONTENT & PRODUCTION', '06. ACTIVATION']
  },
  ROLE_MANAGER_MARKETING: {
    role: 'ROLE_MANAGER_MARKETING',
    roleName: 'Marketing Manager (Stage 1 Reviewer)',
    allowedActions: {
      canCreateCampaign: true,
      canEditStrategy: true,
      canAddTrend: true,
      canCreateContent: true,
      canApproveGovernance: true,
      canPublishContent: false,
      canManageBudget: true,
      canManageSystem: false,
      isReadOnly: false,
    },
    primaryModules: ['02. STRATEGY & PLANNING', '05. GOVERNANCE']
  },
  ROLE_VP_MARKETING: {
    role: 'ROLE_VP_MARKETING',
    roleName: 'VP Marketing (Executive Approver)',
    allowedActions: {
      canCreateCampaign: true,
      canEditStrategy: true,
      canAddTrend: true,
      canCreateContent: false,
      canApproveGovernance: true,
      canPublishContent: false,
      canManageBudget: true,
      canManageSystem: false,
      isReadOnly: false,
    },
    primaryModules: ['02. STRATEGY & PLANNING', '05. GOVERNANCE', '07. PERFORMANCE & LEARNING']
  },
  ROLE_VP_CORSEC: {
    role: 'ROLE_VP_CORSEC',
    roleName: 'VP Corporate Secretary (Governance Approver)',
    allowedActions: {
      canCreateCampaign: false,
      canEditStrategy: true,
      canAddTrend: false,
      canCreateContent: false,
      canApproveGovernance: true,
      canPublishContent: false,
      canManageBudget: false,
      canManageSystem: false,
      isReadOnly: false,
    },
    primaryModules: ['02. STRATEGY & PLANNING', '05. GOVERNANCE']
  },
  ROLE_FINAL_APPROVER: {
    role: 'ROLE_FINAL_APPROVER',
    roleName: 'Final Authority Approver',
    allowedActions: {
      canCreateCampaign: true,
      canEditStrategy: true,
      canAddTrend: true,
      canCreateContent: true,
      canApproveGovernance: true,
      canPublishContent: true,
      canManageBudget: true,
      canManageSystem: false,
      isReadOnly: false,
    },
    primaryModules: ['05. GOVERNANCE', '06. ACTIVATION']
  },
  ROLE_MANAGEMENT_VIEWER: {
    role: 'ROLE_MANAGEMENT_VIEWER',
    roleName: 'Executive Management Viewer',
    allowedActions: {
      canCreateCampaign: false,
      canEditStrategy: false,
      canAddTrend: false,
      canCreateContent: false,
      canApproveGovernance: false,
      canPublishContent: false,
      canManageBudget: false,
      canManageSystem: false,
      isReadOnly: true,
    },
    primaryModules: ['01. HOME', '07. PERFORMANCE & LEARNING']
  },
  ROLE_SYSTEM_ADMIN: {
    role: 'ROLE_SYSTEM_ADMIN',
    roleName: 'Lead System Administrator',
    allowedActions: {
      canCreateCampaign: true,
      canEditStrategy: true,
      canAddTrend: true,
      canCreateContent: true,
      canApproveGovernance: true,
      canPublishContent: true,
      canManageBudget: true,
      canManageSystem: true,
      isReadOnly: false,
    },
    primaryModules: ['01. HOME', '02. STRATEGY & PLANNING', '03. INTELLIGENCE', '04. CONTENT & PRODUCTION', '05. GOVERNANCE', '06. ACTIVATION', '07. PERFORMANCE & LEARNING', '08. SYSTEM']
  }
};

export const hasPermission = (
  role: UserRole,
  action: keyof RolePermission['allowedActions']
): boolean => {
  const perm = ROLE_PERMISSIONS[role];
  if (!perm) return false;
  if (role === 'ROLE_SYSTEM_ADMIN') return true;
  return perm.allowedActions[action] || false;
};
