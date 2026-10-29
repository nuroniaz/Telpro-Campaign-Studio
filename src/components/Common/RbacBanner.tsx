import React from 'react';
import { useApp } from '../../context/AppContext';
import { ROLE_PERMISSIONS, hasPermission, RolePermission } from '../../utils/rbac';
import { ShieldAlert, Lock, CheckCircle2, Info } from 'lucide-react';

interface RbacBannerProps {
  requiredAction?: keyof RolePermission['allowedActions'];
  requiredRole?: string;
  moduleName: string;
}

export const RbacBanner: React.FC<RbacBannerProps> = ({ requiredAction, requiredRole, moduleName }) => {
  const { activeUser } = useApp();
  const perm = ROLE_PERMISSIONS[activeUser.role];

  if (activeUser.role === 'ROLE_SYSTEM_ADMIN') {
    return (
      <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between text-xs text-emerald-900 shadow-xs">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span><strong>Akses Full System Admin:</strong> Anda memiliki wewenang penuh untuk mengubah, menyetujui, dan mengeksekusi semua fitur di <strong>{moduleName}</strong>.</span>
        </div>
        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300 font-mono font-bold">
          ROLE_SYSTEM_ADMIN
        </span>
      </div>
    );
  }

  const isAllowed = requiredAction ? hasPermission(activeUser.role, requiredAction) : true;
  const isReadOnly = perm?.allowedActions.isReadOnly;

  if (isReadOnly) {
    return (
      <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-3 flex items-center justify-between text-xs text-amber-950 shadow-xs">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-600 shrink-0" />
          <span><strong>Mode Akses Read-Only (Pengawasan Management):</strong> Role Anda (<strong>{activeUser.title}</strong>) dapat memantau seluruh data <strong>{moduleName}</strong>, namun aksi pembuatan, pengeditan, atau persetujuan dinonaktifkan.</span>
        </div>
        <span className="text-[10px] bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-300 font-mono font-bold shrink-0">
          VIEWER ONLY
        </span>
      </div>
    );
  }

  if (!isAllowed) {
    return (
      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3 flex items-center justify-between text-xs text-amber-950 shadow-xs">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Akses Terbatas (Read-Only) pada {moduleName}:</strong> Role Anda (<strong>{activeUser.role.replace('ROLE_', '')}</strong>) tidak memiliki wewenang eksekusi di modul ini.
            {requiredRole && <span> Otoritas eksekusi memerlukan role <strong>{requiredRole}</strong>.</span>}
          </span>
        </div>
        <span className="text-[10px] bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-300 font-mono font-bold shrink-0">
          READ ONLY
        </span>
      </div>
    );
  }

  return null;
};
