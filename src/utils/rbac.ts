import { UserRole, UserProfile, UserPermission } from '../types';

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
    canCurateRegional: boolean;
    canCreateRegionalSubmission: boolean;
    canJointReview: boolean;
    canVpCorsecApprove: boolean;
    canFinalApprove: boolean;
    isReadOnly: boolean;
  };
  defaultPermissions: UserPermission[];
  primaryModules: string[];
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermission> = {
  // 1. REGIONAL CREATOR
  ROLE_REGIONAL_CREATOR: {
    role: 'ROLE_REGIONAL_CREATOR',
    roleName: 'Regional Creator',
    allowedActions: {
      canCreateCampaign: false,
      canEditStrategy: false,
      canAddTrend: true,
      canCreateContent: false, // creates regional submission, not direct corporate plan
      canApproveGovernance: false,
      canPublishContent: false,
      canManageBudget: false,
      canManageSystem: false,
      canCurateRegional: false,
      canCreateRegionalSubmission: true,
      canJointReview: false,
      canVpCorsecApprove: false,
      canFinalApprove: false,
      isReadOnly: false,
    },
    defaultPermissions: [
      'REGIONAL_SUBMISSION_CREATE',
      'REGIONAL_SUBMISSION_EDIT',
      'USE_AI_STUDIO',
      'VIEW_CALENDAR',
      'VIEW_REGIONAL_PERFORMANCE'
    ],
    primaryModules: ['02. BUAT KONTEN (Regional Submission)', '03. REFERENSI KONTEN (Trend Finder)']
  },

  // 2. MARCOMM CREATOR
  ROLE_MARCOM_CREATOR: {
    role: 'ROLE_MARCOM_CREATOR',
    roleName: 'Marcomm (Creator, Reviewer & Analis @telprodico)',
    allowedActions: {
      canCreateCampaign: true,
      canEditStrategy: true,
      canAddTrend: true,
      canCreateContent: true,
      canApproveGovernance: false,
      canPublishContent: true, // Marcomm executes posting/publishing
      canManageBudget: false,
      canManageSystem: false,
      canCurateRegional: true,
      canCreateRegionalSubmission: false,
      canJointReview: true,
      canVpCorsecApprove: false,
      canFinalApprove: false,
      isReadOnly: false,
    },
    defaultPermissions: [
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
    ],
    primaryModules: ['02. BUAT KONTEN (Jadwal, AI, Review, Publish)', '03. REFERENSI KONTEN', '04. ANALITICS KONTEN (@telprodico)']
  },

  // 3. CORCOMM CREATOR (Co-Governance)
  ROLE_CORCOMM_CREATOR: {
    role: 'ROLE_CORCOMM_CREATOR',
    roleName: 'Corcomm (Creator, Reviewer & Analis @telkomproperty)',
    allowedActions: {
      canCreateCampaign: true,
      canEditStrategy: true,
      canAddTrend: true,
      canCreateContent: true,
      canApproveGovernance: false,
      canPublishContent: true, // Corcomm executes posting/publishing
      canManageBudget: false,
      canManageSystem: false,
      canCurateRegional: true,
      canCreateRegionalSubmission: false,
      canJointReview: true,
      canVpCorsecApprove: false,
      canFinalApprove: false,
      isReadOnly: false,
    },
    defaultPermissions: [
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
    ],
    primaryModules: ['02. BUAT KONTEN (Editorial, Studio, Review, Publish)', '03. REFERENSI KONTEN', '04. ANALITICS KONTEN (@telkomproperty)']
  },

  // 4. JOINT REVIEWER
  ROLE_JOINT_REVIEWER: {
    role: 'ROLE_JOINT_REVIEWER',
    roleName: 'Joint Reviewer (Marcomm + Corcomm)',
    allowedActions: {
      canCreateCampaign: false,
      canEditStrategy: false,
      canAddTrend: true,
      canCreateContent: false,
      canApproveGovernance: true,
      canPublishContent: false,
      canManageBudget: false,
      canManageSystem: false,
      canCurateRegional: false,
      canCreateRegionalSubmission: false,
      canJointReview: true,
      canVpCorsecApprove: false,
      canFinalApprove: false,
      isReadOnly: false,
    },
    defaultPermissions: [
      'JOINT_REVIEW_EXECUTE',
      'VIEW_CALENDAR',
      'SUBMIT_CONTENT_REVIEW'
    ],
    primaryModules: ['02. BUAT KONTEN (Approval Konten)', '05. GOVERNANCE']
  },

  // 5. VP CORSEC APPROVER
  ROLE_VP_CORSEC: {
    role: 'ROLE_VP_CORSEC',
    roleName: 'VP Corporate Secretary (VP Corsec)',
    allowedActions: {
      canCreateCampaign: false,
      canEditStrategy: false,
      canAddTrend: false,
      canCreateContent: false, // Strictly approver & monitor only
      canApproveGovernance: true,
      canPublishContent: false, // Approvers only approve & monitor; Marcomm & Corcomm execute publishing
      canManageBudget: false,
      canManageSystem: false,
      canCurateRegional: false,
      canCreateRegionalSubmission: false,
      canJointReview: false,
      canVpCorsecApprove: true,
      canFinalApprove: false,
      isReadOnly: false,
    },
    defaultPermissions: [
      'VP_CORSEC_APPROVAL',
      'VIEW_CALENDAR',
      'VIEW_NATIONAL_ANALYTICS'
    ],
    primaryModules: ['02. BUAT KONTEN (Approval & Monitoring)', '04. ANALITICS KONTEN']
  },

  // 6. EXECUTIVE / FINAL APPROVER
  ROLE_FINAL_APPROVER: {
    role: 'ROLE_FINAL_APPROVER',
    roleName: 'Plt. Direktur Utama (Final Approver)',
    allowedActions: {
      canCreateCampaign: false, // Executive approver does NOT create campaigns/content, only approves & monitors
      canEditStrategy: false,
      canAddTrend: false,
      canCreateContent: false, // Strictly approver & monitor only
      canApproveGovernance: true,
      canPublishContent: false, // Approvers only approve & monitor; Marcomm & Corcomm execute publishing
      canManageBudget: true,
      canManageSystem: false,
      canCurateRegional: false,
      canCreateRegionalSubmission: false,
      canJointReview: false,
      canVpCorsecApprove: false,
      canFinalApprove: true,
      isReadOnly: false,
    },
    defaultPermissions: [
      'FINAL_CONTENT_APPROVAL',
      'VIEW_CALENDAR',
      'VIEW_NATIONAL_ANALYTICS'
    ],
    primaryModules: ['02. BUAT KONTEN (Approval & Monitoring)', '04. ANALITICS KONTEN']
  },

  // 7. PERFORMANCE ANALYST
  ROLE_PERFORMANCE_ANALYST: {
    role: 'ROLE_PERFORMANCE_ANALYST',
    roleName: 'Performance Analyst',
    allowedActions: {
      canCreateCampaign: false,
      canEditStrategy: false,
      canAddTrend: true,
      canCreateContent: false,
      canApproveGovernance: false,
      canPublishContent: false,
      canManageBudget: false,
      canManageSystem: false,
      canCurateRegional: false,
      canCreateRegionalSubmission: false,
      canJointReview: false,
      canVpCorsecApprove: false,
      canFinalApprove: false,
      isReadOnly: false,
    },
    defaultPermissions: [
      'VIEW_NATIONAL_ANALYTICS',
      'VIEW_CALENDAR',
      'VIEW_REGIONAL_PERFORMANCE'
    ],
    primaryModules: ['04. ANALITICS KONTEN', '03. REFERENSI KONTEN']
  },

  // 8. SYSTEM ADMIN (Technical, User & Diagnostic Only - NO Business Authority)
  ROLE_SYSTEM_ADMIN: {
    role: 'ROLE_SYSTEM_ADMIN',
    roleName: 'System Administrator',
    allowedActions: {
      canCreateCampaign: false,
      canEditStrategy: false,
      canAddTrend: false,
      canCreateContent: false,
      canApproveGovernance: false, // NO business approval authority!
      canPublishContent: false,    // NO business publishing authority!
      canManageBudget: false,
      canManageSystem: true,
      canCurateRegional: false,
      canCreateRegionalSubmission: false,
      canJointReview: false,
      canVpCorsecApprove: false,
      canFinalApprove: false,
      isReadOnly: false,
    },
    defaultPermissions: [
      'MANAGE_SYSTEM'
    ],
    primaryModules: ['01. LOG IN APPS', 'SYSTEM DIAGNOSTIC & AUDIT']
  },

  // Legacy Aliases for seamless fallback
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
      canCurateRegional: false,
      canCreateRegionalSubmission: false,
      canJointReview: true,
      canVpCorsecApprove: false,
      canFinalApprove: false,
      isReadOnly: false,
    },
    defaultPermissions: ['JOINT_REVIEW_EXECUTE', 'VIEW_CALENDAR'],
    primaryModules: ['02. BUAT KONTEN', '03. REFERENSI KONTEN']
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
      canCurateRegional: false,
      canCreateRegionalSubmission: false,
      canJointReview: false,
      canVpCorsecApprove: false,
      canFinalApprove: false,
      isReadOnly: false,
    },
    defaultPermissions: ['PUBLISH_CONTENT', 'VIEW_CALENDAR'],
    primaryModules: ['02. BUAT KONTEN']
  },
  ROLE_MANAGER_MARKETING: {
    role: 'ROLE_MANAGER_MARKETING',
    roleName: 'Marketing Manager',
    allowedActions: {
      canCreateCampaign: true,
      canEditStrategy: true,
      canAddTrend: true,
      canCreateContent: true,
      canApproveGovernance: true,
      canPublishContent: false,
      canManageBudget: true,
      canManageSystem: false,
      canCurateRegional: true,
      canCreateRegionalSubmission: false,
      canJointReview: true,
      canVpCorsecApprove: false,
      canFinalApprove: false,
      isReadOnly: false,
    },
    defaultPermissions: ['CREATE_CONTENT', 'EDIT_CONTENT', 'JOINT_REVIEW_EXECUTE'],
    primaryModules: ['02. BUAT KONTEN']
  },
  ROLE_VP_MARKETING: {
    role: 'ROLE_VP_MARKETING',
    roleName: 'VP Marketing',
    allowedActions: {
      canCreateCampaign: true,
      canEditStrategy: true,
      canAddTrend: true,
      canCreateContent: false,
      canApproveGovernance: true,
      canPublishContent: false,
      canManageBudget: true,
      canManageSystem: false,
      canCurateRegional: false,
      canCreateRegionalSubmission: false,
      canJointReview: true,
      canVpCorsecApprove: false,
      canFinalApprove: false,
      isReadOnly: false,
    },
    defaultPermissions: ['JOINT_REVIEW_EXECUTE', 'VIEW_NATIONAL_ANALYTICS'],
    primaryModules: ['02. BUAT KONTEN']
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
      canCurateRegional: false,
      canCreateRegionalSubmission: false,
      canJointReview: false,
      canVpCorsecApprove: false,
      canFinalApprove: false,
      isReadOnly: true,
    },
    defaultPermissions: ['VIEW_CALENDAR', 'VIEW_NATIONAL_ANALYTICS'],
    primaryModules: ['04. ANALITICS KONTEN']
  }
};

/**
 * Check action-level permission
 */
export const hasPermission = (
  role: UserRole,
  action: keyof RolePermission['allowedActions']
): boolean => {
  const perm = ROLE_PERMISSIONS[role];
  if (!perm) return false;
  // System Admin does NOT automatically bypass business actions!
  return perm.allowedActions[action] || false;
};

/**
 * Check granular user permission
 */
export const hasUserPermission = (
  user: UserProfile,
  permission: UserPermission
): boolean => {
  if (!user) return false;
  // Check direct user permissions
  if (user.permissions && user.permissions.includes(permission)) {
    return true;
  }
  // Check special flag for CONTENT_PLANNER_OWNER
  if (permission === 'CONTENT_PLANNER_OWNER' && user.isContentPlannerOwner) {
    return true;
  }
  // Check role default permissions
  const roleConfig = ROLE_PERMISSIONS[user.role];
  if (roleConfig && roleConfig.defaultPermissions.includes(permission)) {
    return true;
  }
  return false;
};

/**
 * Specifically check if user is designated Content Planner Owner
 * Content Planner is business-owned by MARCOMM, but only designated Marcomm users receive this!
 */
export const isContentPlannerOwner = (user: UserProfile): boolean => {
  if (!user) return false;
  if (user.isContentPlannerOwner) return true;
  if (user.permissions && user.permissions.includes('CONTENT_PLANNER_OWNER')) return true;
  return false;
};

/**
 * Check if user can manage Master Taxonomy (Only Content Planner Owner)
 */
export const canManageTaxonomy = (user: UserProfile): boolean => {
  return isContentPlannerOwner(user);
};

/**
 * Check if user can execute Joint Review (Marcomm or Corcomm or Joint Reviewer)
 */
export const canExecuteJointReview = (user: UserProfile): boolean => {
  if (!user) return false;
  return (
    user.role === 'ROLE_JOINT_REVIEWER' ||
    user.role === 'ROLE_MARCOM_CREATOR' ||
    user.role === 'ROLE_CORCOMM_CREATOR' ||
    hasUserPermission(user, 'JOINT_REVIEW_EXECUTE')
  );
};

/**
 * Check if user can approve at VP Corsec stage
 */
export const canApproveVpCorsec = (user: UserProfile): boolean => {
  if (!user) return false;
  return user.role === 'ROLE_VP_CORSEC' || hasUserPermission(user, 'VP_CORSEC_APPROVAL');
};

/**
 * Check if user has generic FINAL_CONTENT_APPROVAL permission
 */
export const canFinalApprove = (user: UserProfile): boolean => {
  if (!user) return false;
  return (
    user.role === 'ROLE_FINAL_APPROVER' ||
    hasUserPermission(user, 'FINAL_CONTENT_APPROVAL')
  );
};

/**
 * Check if user can curate regional submissions
 */
export const canCurateRegional = (user: UserProfile): boolean => {
  if (!user) return false;
  return (
    user.role === 'ROLE_MARCOM_CREATOR' ||
    user.role === 'ROLE_CORCOMM_CREATOR' ||
    hasUserPermission(user, 'CURATE_REGIONAL_SUBMISSION')
  );
};

/**
 * Check if user is an Executive Approver (VP Corsec, Plt. Direktur Utama / Final Approver, Joint Reviewer)
 * Rule: Executive approvers cannot create content, only act as approvers/reviewers.
 */
export const isExecutiveApprover = (user: UserProfile): boolean => {
  if (!user) return false;
  return (
    user.role === 'ROLE_VP_CORSEC' ||
    user.role === 'ROLE_FINAL_APPROVER' ||
    user.role === 'ROLE_JOINT_REVIEWER' ||
    user.role === 'ROLE_VP_MARKETING' ||
    user.role === 'ROLE_MANAGEMENT_VIEWER'
  );
};

