import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { SparkLogo } from '../Common/SparkLogo';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess?: (role: UserRole) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { users, login } = useApp();

  // Selected account identifier
  const [selectedIdentifier, setSelectedIdentifier] = useState<string>('usr-reg-1');
  const [passwordInput, setPasswordInput] = useState<string>('telpro2026');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = login(selectedIdentifier, passwordInput);
      if (res.success) {
        const found = users.find(
          u => u.id === selectedIdentifier ||
               u.role === selectedIdentifier ||
               u.email.toLowerCase() === selectedIdentifier.toLowerCase()
        );
        const role = found?.role || 'ROLE_REGIONAL_CREATOR';
        setIsLoading(false);
        if (onLoginSuccess) {
          onLoginSuccess(role);
        }
      } else {
        setErrorMessage(res.message);
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 relative overflow-hidden selection:bg-rose-500 selection:text-white">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-rose-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/3 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container: Focused & Distraction-Free */}
      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand & Application Name Banner without white background */}
        <div className="flex justify-center py-2">
          <SparkLogo size="md" variant="dark" showSubtitles={true} center={false} />
        </div>

        {/* Login Card */}
        <div className="p-7 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs font-semibold flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Account / User Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="w-4 h-4 text-slate-400" />
                </div>
                <select
                  value={selectedIdentifier}
                  onChange={(e) => setSelectedIdentifier(e.target.value)}
                  className="w-full pl-10 pr-8 py-3 rounded-2xl bg-slate-800/90 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer transition-all"
                >
                  <optgroup label="Regional Creators" className="bg-slate-900 font-bold text-rose-400">
                    <option value="usr-reg-1" className="text-white">Regional 1 - Creator</option>
                    <option value="usr-reg-2" className="text-white">Regional 2 - Creator</option>
                    <option value="usr-reg-3" className="text-white">Regional 3 - Creator</option>
                    <option value="usr-reg-4" className="text-white">Regional 4 - Creator</option>
                    <option value="usr-reg-5" className="text-white">Regional 5 - Creator</option>
                  </optgroup>
                  <optgroup label="Marcomm & Corcomm Kantor Pusat" className="bg-slate-900 font-bold text-teal-400">
                    <option value="usr-2" className="text-white">Marcomm (Creator, Reviewer & Analis @telprodico)</option>
                    <option value="usr-4" className="text-white">Corcomm (Creator, Reviewer & Analis @telkomproperty)</option>
                  </optgroup>
                  <optgroup label="Executive Approvers" className="bg-slate-900 font-bold text-indigo-400">
                    <option value="usr-6" className="text-white">VP Corporate Secretary (VP Corsec)</option>
                    <option value="usr-7" className="text-white">Plt. Direktur Utama (Plt. Dirut)</option>
                  </optgroup>
                  <optgroup label="Administrator Sistem (IT & Teknis)" className="bg-slate-900 font-bold text-amber-400">
                    <option value="usr-9" className="text-white">System Administrator (Tim IT & Teknis)</option>
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <span className="text-[11px] text-slate-500 font-mono">
                  Default: <span className="text-slate-300 font-bold">telpro2026</span>
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Masukkan password..."
                  required
                  className="w-full pl-10 pr-11 py-3 rounded-2xl bg-slate-800/90 border border-slate-700 text-white text-xs font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Login Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 active:scale-[0.99] transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to SPARK</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Note */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Single Sign-On (SSO) Protected • PT Telkom Property</span>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-600">
          &copy; 2026 PT Telkom Property. All rights reserved.
        </div>
      </div>
    </div>
  );
};
