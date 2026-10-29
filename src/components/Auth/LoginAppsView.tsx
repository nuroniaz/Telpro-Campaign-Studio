import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, UserProfile } from '../../types';
import { NavTab } from '../Sidebar';
import {
  Lock,
  Mail,
  Key,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  User,
  Users,
  Building,
  KeyRound,
  LogIn,
  LogOut,
  RefreshCw,
  Sparkles,
  Smartphone,
  Globe,
  Radio
} from 'lucide-react';

interface LoginAppsViewProps {
  setActiveTab: (tab: NavTab) => void;
}

export const LoginAppsView: React.FC<LoginAppsViewProps> = ({ setActiveTab }) => {
  const { users, activeUser, setActiveUserRole } = useApp();

  const [emailInput, setEmailInput] = useState(activeUser.email);
  const [passwordInput, setPasswordInput] = useState('••••••••••••');
  const [rememberDevice, setRememberDevice] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [loginFeedback, setLoginFeedback] = useState<string | null>(null);

  const handleQuickLogin = (user: UserProfile) => {
    setIsAuthenticating(true);
    setEmailInput(user.email);
    setTimeout(() => {
      setActiveUserRole(user.role);
      setIsAuthenticating(false);
      setLoginFeedback(`Berhasil masuk sebagai ${user.name} (${user.title})`);
      setTimeout(() => setLoginFeedback(null), 3500);
    }, 400);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      setLoginFeedback(`Autentikasi SSO Berhasil! Sesi aman aktif untuk ${activeUser.name}`);
      setTimeout(() => setLoginFeedback(null), 3500);
    }, 500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30 font-bold text-[10px] tracking-wider uppercase flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-rose-400" /> Tahap 1 • Akses & Keamanan
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-mono text-[10px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                SSO Portal Aktif
              </span>
            </div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              1. Log In Apps • SPARK Telpro
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Pusat autentikasi enterprise single sign-on (SSO), verifikasi identitas peran (RBAC), serta manajemen sesi terenkripsi untuk seluruh ekosistem kampanye PT Telkom Property.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('content-ai')}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-600/20 hover:scale-105 transition-all cursor-pointer ring-1 ring-white/20"
            >
              <span>Lanjut ke 02. Buat Konten</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {loginFeedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-xs animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{loginFeedback}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: SSO & Login Form (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <LogIn className="w-4 h-4 text-rose-600" />
                  Masuk Akun Pengguna (SSO)
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Gunakan email kredensial resmi TELPRO atau akun terdaftar
                </p>
              </div>
              <span className="p-1.5 rounded-xl bg-slate-100 text-slate-600">
                <Lock className="w-4 h-4" />
              </span>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Email Korporat TELPRO
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="nama@telpro.co.id"
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none focus:border-rose-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Password / Token Akses
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50 focus:outline-none focus:border-rose-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                  />
                  <span>Ingat perangkat ini (30 hari)</span>
                </label>
                <span className="text-rose-600 hover:underline cursor-pointer font-medium">
                  Lupa Kredensial?
                </span>
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                {isAuthenticating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Memverifikasi SSO...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                    <span>Masuk dengan SSO TELPRO</span>
                  </>
                )}
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200" />
                <span className="flex-shrink mx-2 text-[10px] text-slate-400 uppercase font-semibold">
                  Atau Opsi Cepat
                </span>
                <div className="flex-grow border-t border-slate-200" />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-600" />
                  <span>Google Workspace Telkom</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[9px]">
                  Terhubung
                </span>
              </div>
            </form>
          </div>

          {/* Security Guarantee Box */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 text-[11px] text-indigo-900 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
              <span>Standar Keamanan Enterprise Level-3</span>
            </div>
            <p className="text-indigo-700/80 leading-relaxed">
              Platform SPARK menerapkan isolasi data RBAC ketat, immutable audit logs per aktivitas, serta token JWT dengan enkripsi AES-256.
            </p>
          </div>
        </div>

        {/* Right Column: Active Session & Role Switcher (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Session Status Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-600" />
                  Sesi Pengguna Aktif Saat Ini
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Informasi identitas dan otoritas izin yang sedang digunakan di platform
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Terautentikasi
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-indigo-50/30 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-indigo-600 text-white font-black text-base flex items-center justify-center shadow-md">
                  {activeUser.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                    <span>{activeUser.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[9px] font-bold">
                      {activeUser.role.replace('ROLE_', '')}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">{activeUser.email}</div>
                  <div className="text-[11px] text-indigo-700 font-medium mt-0.5 flex items-center gap-1">
                    <Building className="w-3 h-3 text-indigo-500" />
                    <span>{activeUser.title} • {activeUser.businessUnit}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1 text-right self-end sm:self-center">
                <span className="text-[10px] text-slate-400 font-mono">Token Expiry: 12 Jam</span>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">MFA Aktif</span>
              </div>
            </div>

            {/* Quick Next Step Action */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500 font-medium">
                Siap mulai memproduksi konten kampanye?
              </span>
              <button
                onClick={() => setActiveTab('content-ai')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>Masuk ke 02. Buat Konten</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Role Switcher Grid (Demo & Multi-Persona Testing) */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  Ganti Profil Pengguna (Simulasi Peran / Role-Switching)
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Pilih salah satu profil resmi berikut untuk menguji alur kerja dari sudut pandang Creator, Approver, atau Analyst:
                </p>
              </div>
              <span className="text-[10px] font-bold text-slate-400">
                {users.length} Akun Tersedia
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {users.slice(0, 6).map((u) => {
                const isSelected = activeUser.id === u.id;
                return (
                  <div
                    key={u.id}
                    onClick={() => handleQuickLogin(u)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-rose-50/70 border-rose-400 shadow-xs ring-2 ring-rose-200'
                        : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-rose-600 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {u.name.slice(0, 1)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-xs truncate">
                          {u.name}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {u.title}
                        </div>
                        <div className="text-[9px] font-mono text-indigo-600 font-semibold mt-0.5">
                          {u.role.replace('ROLE_', '')}
                        </div>
                      </div>
                    </div>

                    {isSelected ? (
                      <span className="p-1 rounded-full bg-rose-600 text-white shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 hover:text-slate-600 shrink-0">
                        Pilih
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
