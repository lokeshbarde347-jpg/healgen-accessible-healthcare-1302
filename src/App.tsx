import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { ReportSimplifier } from './components/ReportSimplifier.tsx';
import { DiagnosticInsight } from './components/DiagnosticInsight.tsx';
import { HealthChat } from './components/HealthChat.tsx';
import { DoctorVisitPrep } from './components/DoctorVisitPrep.tsx';
import { LongitudinalSummary } from './components/LongitudinalSummary.tsx';
import { AnalyticsDashboard } from './components/AnalyticsDashboard.tsx';
import { ResponsibleAIModal } from './components/ResponsibleAIModal.tsx';
import { OAuthModal } from './components/OAuthModal.tsx';
import { PitchDeckModal } from './components/PitchDeckModal.tsx';
import { MedicalReportAnalysis, UserProfile } from './types/medical.ts';
import { apiClient } from './services/apiClient.ts';
import { ShieldCheck, Heart, Sparkles } from 'lucide-react';

const DEFAULT_USERS: UserProfile[] = [
  {
    id: 'usr_patient_1',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@example.com',
    role: 'patient',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'usr_clinician_1',
    name: 'Dr. Marcus Vance, MD',
    email: 'marcus.vance@healgen-health.org',
    role: 'clinician',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200',
    organization: 'Metropolitan Health Network',
    specialty: 'Internal Medicine & Diagnostic Oncology',
  },
  {
    id: 'usr_admin_1',
    name: 'Elena Rostova',
    email: 'elena.rostova@healgen-health.org',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    organization: 'Clinical Governance Directorate',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('simplifier');
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEFAULT_USERS[0]);
  const [availableUsers, setAvailableUsers] = useState<UserProfile[]>(DEFAULT_USERS);
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');

  const [reports, setReports] = useState<MedicalReportAnalysis[]>([]);
  const [currentReport, setCurrentReport] = useState<MedicalReportAnalysis | null>(null);
  const [isLoadingReports, setIsLoadingReports] = useState(true);

  const [isResponsibleAIModalOpen, setIsResponsibleAIModalOpen] = useState(false);
  const [isOAuthModalOpen, setIsOAuthModalOpen] = useState(false);
  const [isPitchDeckModalOpen, setIsPitchDeckModalOpen] = useState(false);

  // Initial load
  useEffect(() => {
    async function initData() {
      try {
        const [usersData, reportsData] = await Promise.all([
          apiClient.getUsers().catch(() => DEFAULT_USERS),
          apiClient.getReports().catch(() => []),
        ]);

        if (usersData && usersData.length > 0) {
          setAvailableUsers(usersData);
          setCurrentUser(usersData[0]);
        }

        if (reportsData && reportsData.length > 0) {
          setReports(reportsData);
          setCurrentReport(reportsData[0]);
        }
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setIsLoadingReports(false);
      }
    }

    initData();
  }, []);

  const handleReportCreated = (newReport: MedicalReportAnalysis) => {
    setReports((prev) => [newReport, ...prev]);
    setCurrentReport(newReport);
  };

  const handleReportDeleted = async (id: string) => {
    try {
      await apiClient.deleteReport(id, currentUser.id, currentUser.role);
      const updated = reports.filter((r) => r.id !== id);
      setReports(updated);
      if (currentReport?.id === id) {
        setCurrentReport(updated[0] || null);
      }
    } catch (e) {
      console.error('Failed to delete report:', e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <Header
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenResponsibleAI={() => setIsResponsibleAIModalOpen(true)}
        onOpenPitchDeck={() => setIsPitchDeckModalOpen(true)}
        onOpenOAuth={() => setIsOAuthModalOpen(true)}
        currentLanguage={currentLanguage}
        setLanguage={setCurrentLanguage}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoadingReports ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 gap-3">
            <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-medium">Loading HealGen clinical workspace...</p>
          </div>
        ) : (
          <>
            {activeTab === 'simplifier' && (
              <ReportSimplifier
                reports={reports}
                currentReport={currentReport}
                onSelectReport={setCurrentReport}
                onReportCreated={handleReportCreated}
                onReportDeleted={handleReportDeleted}
                currentUser={currentUser}
                currentLanguage={currentLanguage}
              />
            )}

            {activeTab === 'diagnostic' && (
              <DiagnosticInsight currentUser={currentUser} currentLanguage={currentLanguage} />
            )}

            {activeTab === 'assistant' && (
              <HealthChat
                currentReport={currentReport}
                currentUser={currentUser}
                currentLanguage={currentLanguage}
              />
            )}

            {activeTab === 'visit_prep' && (
              <DoctorVisitPrep reports={reports} currentUser={currentUser} />
            )}

            {activeTab === 'longitudinal' && (
              <LongitudinalSummary
                reports={reports}
                currentUser={currentUser}
                currentLanguage={currentLanguage}
              />
            )}

            {activeTab === 'analytics' && <AnalyticsDashboard currentUser={currentUser} />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900 tracking-tight">HEALGEN</span>
            <span>•</span>
            <span>Generative AI for Human-Centred Healthcare</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsResponsibleAIModalOpen(true)}
              className="hover:text-teal-700 transition underline underline-offset-4 cursor-pointer"
            >
              Responsible AI Charter
            </button>
            <span>•</span>
            <button
              onClick={() => setIsOAuthModalOpen(true)}
              className="hover:text-teal-700 transition underline underline-offset-4 cursor-pointer"
            >
              RBAC & Identity
            </button>
            <span>•</span>
            <span>Doctors remain responsible for clinical decisions.</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ResponsibleAIModal
        isOpen={isResponsibleAIModalOpen}
        onClose={() => setIsResponsibleAIModalOpen(false)}
      />

      <OAuthModal
        isOpen={isOAuthModalOpen}
        onClose={() => setIsOAuthModalOpen(false)}
        currentUser={currentUser}
        availableUsers={availableUsers}
        onSelectUser={setCurrentUser}
      />

      <PitchDeckModal
        isOpen={isPitchDeckModalOpen}
        onClose={() => setIsPitchDeckModalOpen(false)}
        onNavigateToTab={(tabId) => setActiveTab(tabId)}
      />
    </div>
  );
}
