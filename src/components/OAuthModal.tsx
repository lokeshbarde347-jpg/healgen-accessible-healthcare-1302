import React, { useState } from 'react';
import { X, CheckCircle2, Shield, User, Stethoscope, Award, LogIn } from 'lucide-react';
import { UserProfile } from '../types/medical.ts';

interface OAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  availableUsers: UserProfile[];
  onSelectUser: (user: UserProfile) => void;
}

export const OAuthModal: React.FC<OAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  availableUsers,
  onSelectUser,
}) => {
  const [selectedProvider, setSelectedProvider] = useState<'google' | 'health_portal'>('google');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authSuccessMsg, setAuthSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSimulateOAuth = (user: UserProfile) => {
    setIsAuthenticating(true);
    setAuthSuccessMsg('');
    setTimeout(() => {
      onSelectUser(user);
      setIsAuthenticating(false);
      setAuthSuccessMsg(`Successfully authenticated as ${user.name} (${user.role.toUpperCase()})`);
      setTimeout(() => {
        setAuthSuccessMsg('');
        onClose();
      }, 1200);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">OAuth 2.0 Healthcare Identity</h2>
              <p className="text-xs text-slate-400">Single Sign-On & Role-Based Access Control</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Provider Select Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setSelectedProvider('google')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-2 ${
                selectedProvider === 'google' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Google OAuth 2.0
            </button>
            <button
              onClick={() => setSelectedProvider('health_portal')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-2 ${
                selectedProvider === 'health_portal'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Stethoscope className="w-4 h-4 text-teal-600" />
              SMART on FHIR Health Portal
            </button>
          </div>

          {/* Active OAuth Session Info */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-teal-500"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm text-slate-900">{currentUser.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 uppercase tracking-wide">
                    {currentUser.role}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{currentUser.email}</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Connected
            </span>
          </div>

          {/* Switch Active Role Profile */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Select Demo Identity / Role:
            </h4>
            <div className="space-y-2">
              {availableUsers.map((user) => {
                const isSelected = user.id === currentUser.id;
                let roleIcon = <User className="w-4 h-4 text-blue-600" />;
                let roleBadgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
                if (user.role === 'clinician') {
                  roleIcon = <Stethoscope className="w-4 h-4 text-emerald-600" />;
                  roleBadgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                } else if (user.role === 'admin') {
                  roleIcon = <Award className="w-4 h-4 text-purple-600" />;
                  roleBadgeColor = 'bg-purple-50 text-purple-700 border-purple-200';
                }

                return (
                  <button
                    key={user.id}
                    onClick={() => handleSimulateOAuth(user)}
                    disabled={isAuthenticating}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                        {roleIcon}
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-slate-900">{user.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {user.email} {user.specialty ? `• ${user.specialty}` : ''}
                        </div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${roleBadgeColor} uppercase`}>
                      {user.role}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {authSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{authSuccessMsg}</span>
            </div>
          )}

          {/* Scopes footnote */}
          <div className="text-[11px] text-slate-500 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="font-semibold text-slate-700">Authorized OAuth Scopes:</span>
            <div className="flex flex-wrap gap-1 mt-1 font-mono text-[10px]">
              <span className="px-1.5 py-0.5 bg-slate-200 rounded text-slate-700">openid</span>
              <span className="px-1.5 py-0.5 bg-slate-200 rounded text-slate-700">email</span>
              <span className="px-1.5 py-0.5 bg-slate-200 rounded text-slate-700">profile</span>
              <span className="px-1.5 py-0.5 bg-slate-200 rounded text-slate-700">health.records.read</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
