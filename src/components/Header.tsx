import React from 'react';
import {
  ShieldCheck,
  Globe,
  Download,
  User,
  Stethoscope,
  ShieldAlert,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { UserProfile } from '../types/medical.ts';

interface HeaderProps {
  currentUser: UserProfile;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenResponsibleAI: () => void;
  onOpenPitchDeck: () => void;
  onOpenOAuth: () => void;
  currentLanguage: string;
  setLanguage: (lang: string) => void;
}

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'zh', name: '中文' },
];

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenResponsibleAI,
  onOpenPitchDeck,
  onOpenOAuth,
  currentLanguage,
  setLanguage,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-700 flex items-center justify-center text-white shadow-sm shadow-teal-500/20">
                <span className="font-extrabold text-xl tracking-tight">H</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg text-slate-900 tracking-tight">HEALGEN</span>
                  <button
                    onClick={onOpenResponsibleAI}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 transition cursor-pointer"
                    title="Click to view Responsible AI Framework"
                  >
                    <ShieldCheck className="w-3 h-3 text-teal-600" />
                    <span>RESPONSIBLE AI</span>
                  </button>
                  <button
                    onClick={onOpenPitchDeck}
                    className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition cursor-pointer"
                    title="View original HealGen pitch presentation slides"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>PITCH DECK (6 SLIDES)</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  Accessible Healthcare & Diagnostics • Plain-Language AI
                </p>
              </div>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1">
            {[
              { id: 'simplifier', label: 'Report Simplifier' },
              { id: 'diagnostic', label: 'Diagnostic Insight' },
              { id: 'assistant', label: 'Health Q&A' },
              { id: 'visit_prep', label: 'Doctor Visit Prep' },
              { id: 'longitudinal', label: 'Health Trends' },
              { id: 'analytics', label: 'Analytics & RBAC' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Language & Role/OAuth */}
          <div className="flex items-center gap-2.5">
            {/* Language Selector */}
            <div className="relative flex items-center">
              <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <select
                value={currentLanguage}
                onChange={(e) => setLanguage(e.target.value)}
                className="pl-8 pr-6 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 pointer-events-none" />
            </div>

            {/* User Profile / Role Trigger Button */}
            <button
              onClick={onOpenOAuth}
              className="flex items-center gap-2 p-1.5 pl-2 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition cursor-pointer"
              title="Change user or switch role (Patient / Clinician / Admin)"
            >
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover border border-teal-500"
              />
              <div className="text-left hidden md:block">
                <div className="text-xs font-bold text-slate-900 leading-tight">{currentUser.name}</div>
                <div className="text-[10px] text-teal-700 uppercase font-semibold tracking-wider">
                  {currentUser.role}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="lg:hidden flex items-center space-x-1 overflow-x-auto py-2 border-t border-slate-100 scrollbar-none">
          {[
            { id: 'simplifier', label: 'Report Simplifier' },
            { id: 'diagnostic', label: 'Diagnostic Insight' },
            { id: 'assistant', label: 'Health Q&A' },
            { id: 'visit_prep', label: 'Visit Prep' },
            { id: 'longitudinal', label: 'Trends' },
            { id: 'analytics', label: 'Analytics' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1 text-xs whitespace-nowrap font-medium rounded-lg transition ${
                  isActive ? 'bg-teal-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
