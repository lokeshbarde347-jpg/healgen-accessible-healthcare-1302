import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Download,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  Stethoscope,
  Trash2,
  Share2,
  FileSpreadsheet,
  Filter,
  Check,
  Plus,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { MedicalReportAnalysis, UserProfile } from '../types/medical.ts';
import { SAMPLE_MEDICAL_TEXTS } from '../data/sampleData.ts';
import { exportReportToPDF, exportReportToCSV } from '../utils/exportUtils.ts';
import { apiClient } from '../services/apiClient.ts';

interface ReportSimplifierProps {
  reports: MedicalReportAnalysis[];
  currentReport: MedicalReportAnalysis | null;
  onSelectReport: (report: MedicalReportAnalysis) => void;
  onReportCreated: (newReport: MedicalReportAnalysis) => void;
  onReportDeleted: (id: string) => void;
  currentUser: UserProfile;
  currentLanguage: string;
}

export const ReportSimplifier: React.FC<ReportSimplifierProps> = ({
  reports,
  currentReport,
  onSelectReport,
  onReportCreated,
  onReportDeleted,
  currentUser,
  currentLanguage,
}) => {
  const [inputText, setInputText] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [category, setCategory] = useState<'lab_test' | 'radiology' | 'pathology' | 'prescription' | 'general'>('lab_test');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'flagged' | 'normal'>('all');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [checkedQuestions, setCheckedQuestions] = useState<Record<number, boolean>>({});
  const [newQuestionText, setNewQuestionText] = useState('');

  // Clinician verification state
  const [clinicianNotesInput, setClinicianNotesInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Load a sample template
  const handleLoadSample = (sampleId: string) => {
    const sample = SAMPLE_MEDICAL_TEXTS.find((s) => s.id === sampleId);
    if (sample) {
      setInputText(sample.text);
      setCustomTitle(sample.name);
      setCategory(sample.category);
      setErrorMsg('');
    }
  };

  // Submit report for AI simplification
  const handleSimplifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) {
      setErrorMsg('Please enter or select a medical report text.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg('');

    try {
      const generated = await apiClient.simplifyReport({
        text: inputText,
        title: customTitle || 'Clinical Diagnostic Report',
        category,
        patientName: currentUser.name,
        patientId: currentUser.id,
        language: currentLanguage,
        userRole: currentUser.role,
      });

      onReportCreated(generated);
      onSelectReport(generated);
      setInputText('');
      setCustomTitle('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to process report. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Clinician verification handler
  const handleVerifyReport = async () => {
    if (!currentReport) return;
    setIsVerifying(true);
    try {
      const updated = await apiClient.verifyReport(
        currentReport.id,
        clinicianNotesInput || 'Verified by clinical specialist. Explanation verified as accurate.',
        currentUser.role
      );
      onSelectReport(updated);
      setClinicianNotesInput('');
    } catch (err: any) {
      alert(err.message || 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  // Web Speech synthesis audio readout
  const handleToggleAudio = () => {
    if (!currentReport) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentReport.plainLanguageSummary);
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  // Add custom question to report
  const handleAddQuestion = () => {
    if (!newQuestionText.trim() || !currentReport) return;
    const updated = {
      ...currentReport,
      doctorQuestions: [
        ...currentReport.doctorQuestions,
        {
          question: newQuestionText.trim(),
          reason: 'Added by patient during preparation',
          priority: 'high' as const,
        },
      ],
    };
    onSelectReport(updated);
    setNewQuestionText('');
  };

  // Filtered biomarkers
  const displayedBiomarkers = (currentReport?.biomarkers || []).filter((bm) => {
    if (statusFilter === 'flagged') return bm.status === 'high' || bm.status === 'low' || bm.status === 'critical';
    if (statusFilter === 'normal') return bm.status === 'normal';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Selector */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-cyan-800 rounded-2xl p-6 text-white shadow-lg shadow-teal-950/10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/30 text-teal-200 border border-teal-400/30 text-[10px] font-bold tracking-wider uppercase">
                Human-Centred Generative AI
              </span>
              <span className="text-xs text-teal-200/80 font-mono">Model: Gemini 3.8 Flash</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">Medical Report Simplifier</h1>
            <p className="text-sm text-teal-100 max-w-2xl mt-1">
              Transforms dense pathology, radiology, blood panels, and clinical jargon into crystal-clear plain language with actionable visit questions.
            </p>
          </div>

          {/* Quick Sample Selector */}
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15 lg:max-w-md w-full">
            <div className="text-[11px] font-bold text-teal-100 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              1-Click Instant Demo Samples:
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {SAMPLE_MEDICAL_TEXTS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleLoadSample(sample.id)}
                  className="px-2.5 py-1.5 bg-white/15 hover:bg-white/25 rounded-lg text-left text-xs text-white font-medium truncate transition border border-white/10"
                  title={sample.name}
                >
                  {sample.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Input / Vault Sidebar + Active Report Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Form & Saved Reports History (4 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Input Accordion / Form */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                Upload or Paste Clinical Report
              </span>
              {inputText && (
                <button
                  onClick={() => setInputText('')}
                  className="text-[11px] text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </h2>

            <form onSubmit={handleSimplifySubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Report Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fasting Lipid Panel or Spine MRI"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Report Category
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['lab_test', 'radiology', 'pathology'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`py-1.5 text-xs font-medium rounded-lg border text-center capitalize transition ${
                        category === cat
                          ? 'border-teal-600 bg-teal-50 text-teal-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {cat.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Raw Clinical Text or Doctor's Notes
                </label>
                <textarea
                  rows={7}
                  placeholder="Paste lab results, doctor's impression, pathology note, or radiology findings here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full p-3 text-xs font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
                />
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing with Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-teal-200" />
                    <span>Generate Plain-Language Simplification</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Saved Reports Vault */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Patient Reports Vault ({reports.length})
              </h3>
              <span className="text-[11px] text-teal-700 font-medium">HIPAA Scrubbed</span>
            </div>

            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {reports.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No saved reports yet. Select a sample above to get started.
                </div>
              ) : (
                reports.map((report) => {
                  const isSelected = currentReport?.id === report.id;
                  return (
                    <div
                      key={report.id}
                      onClick={() => onSelectReport(report)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition flex items-start justify-between gap-2 ${
                        isSelected
                          ? 'border-teal-500 bg-teal-50/60 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-slate-900 truncate">
                            {report.title}
                          </span>
                          {report.clinicianVerified && (
                            <span title="Clinically Verified">
                              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {report.reportDate} • {report.biomarkers.length} markers • Grade {report.readingGradeSimplified}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Remove "${report.title}" from your vault?`)) {
                            onReportDeleted(report.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-red-600 rounded transition"
                        title="Delete report"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Active Simplified Report Dashboard (7 cols) */}
        <div className="lg:col-span-7">
          {!currentReport ? (
            <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center flex flex-col items-center justify-center min-h-[420px]">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">Select or Analyze a Report</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Choose one of the 1-click clinical samples on the left or paste your own laboratory result to view the plain-language breakdown.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-6 p-6">
              {/* Report Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">{currentReport.title}</h2>
                    {currentReport.clinicianVerified && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Physician Verified
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                    <span>Patient: <strong>{currentReport.patientName}</strong></span>
                    <span>•</span>
                    <span>Date: {currentReport.reportDate}</span>
                    <span>•</span>
                    <span className="uppercase text-[10px] font-bold px-2 py-0.5 bg-slate-100 rounded text-slate-600">
                      {currentReport.category}
                    </span>
                  </div>
                </div>

                {/* Action Buttons: PDF, CSV, Audio */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleAudio}
                    className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                      isPlayingAudio
                        ? 'bg-amber-500 text-white border-amber-600'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                    title="Listen to summary read aloud"
                  >
                    {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-teal-600" />}
                    <span className="hidden sm:inline">{isPlayingAudio ? 'Stop Audio' : 'Listen'}</span>
                  </button>

                  <button
                    onClick={() => exportReportToPDF(currentReport)}
                    className="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                    title="Download clinical summary PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>

                  <button
                    onClick={() => exportReportToCSV(currentReport)}
                    className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-medium transition cursor-pointer"
                    title="Export data to CSV"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  </button>
                </div>
              </div>

              {/* Reading Grade Reduction & Uncertainty Metric Pill */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Reading Level Reduction */}
                <div className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800">
                      Comprehension Accessibility
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500 line-through">Grade {currentReport.readingGradeOriginal}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-teal-600" />
                      <span className="text-sm font-extrabold text-teal-900">
                        Grade {currentReport.readingGradeSimplified} Plain English
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                      <TrendingDown className="w-3 h-3" />
                      -{(currentReport.readingGradeOriginal - currentReport.readingGradeSimplified).toFixed(1)} Grades
                    </span>
                  </div>
                </div>

                {/* Uncertainty & Reliability Gauge */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                      AI Confidence & Uncertainty
                    </span>
                    <div className="text-sm font-extrabold text-slate-900 mt-1">
                      {currentReport.uncertaintyScore}% Alignment Confidence
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center font-bold text-xs text-teal-800 border-2 border-teal-500">
                    {currentReport.uncertaintyScore}%
                  </div>
                </div>
              </div>

              {/* Plain Language Summary Box */}
              <div className="bg-slate-50/60 border border-slate-200/80 rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    Plain-Language Summary
                  </h3>
                  <span className="text-[11px] text-slate-500">Human-Centred Translation</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                  {currentReport.plainLanguageSummary}
                </p>
              </div>

              {/* Biomarkers & Clinical Measurements Table */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <span>Key Biomarkers & Values ({currentReport.biomarkers.length})</span>
                  </h3>

                  {/* Filter tabs */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start">
                    <button
                      onClick={() => setStatusFilter('all')}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition ${
                        statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      All ({currentReport.biomarkers.length})
                    </button>
                    <button
                      onClick={() => setStatusFilter('flagged')}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition ${
                        statusFilter === 'flagged' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Attention Needed
                    </button>
                    <button
                      onClick={() => setStatusFilter('normal')}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition ${
                        statusFilter === 'normal' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      Normal Range
                    </button>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                        <th className="py-2.5 px-3">Test / Biomarker</th>
                        <th className="py-2.5 px-3">Result</th>
                        <th className="py-2.5 px-3">Target Range</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">What This Means</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {displayedBiomarkers.map((bm, i) => {
                        let statusBadge = (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                            Normal
                          </span>
                        );
                        if (bm.status === 'high' || bm.status === 'critical') {
                          statusBadge = (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                              Elevated
                            </span>
                          );
                        } else if (bm.status === 'low') {
                          statusBadge = (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              Low
                            </span>
                          );
                        }

                        return (
                          <tr key={i} className="hover:bg-slate-50/80 transition">
                            <td className="py-2.5 px-3 font-bold text-slate-900">{bm.name}</td>
                            <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">{bm.value}</td>
                            <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{bm.referenceRange}</td>
                            <td className="py-2.5 px-3">{statusBadge}</td>
                            <td className="py-2.5 px-3 text-slate-600 leading-snug">{bm.explanation}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Medical Jargon Busted (Glossary) */}
              {currentReport.jargonGlossary.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-bold text-sm text-slate-900">Medical Terminology Glossary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentReport.jargonGlossary.map((jargon, idx) => (
                      <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-teal-800">{jargon.term}</span>
                          <span className="text-[10px] font-semibold text-slate-500 px-2 py-0.5 bg-slate-200 rounded">
                            {jargon.simplified}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600">{jargon.definition}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prepared Doctor Questions Checklist */}
              <div className="space-y-3 bg-teal-50/40 border border-teal-200/60 rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      Prepared Questions for Your Doctor ({currentReport.doctorQuestions.length})
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Check off questions during your appointment or add personal concerns.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {currentReport.doctorQuestions.map((q, idx) => {
                    const isChecked = checkedQuestions[idx] || false;
                    return (
                      <div
                        key={idx}
                        onClick={() =>
                          setCheckedQuestions((prev) => ({ ...prev, [idx]: !prev[idx] }))
                        }
                        className={`p-3 rounded-xl border transition flex items-start gap-3 cursor-pointer ${
                          isChecked
                            ? 'bg-white/90 border-teal-500 line-through opacity-70'
                            : 'bg-white border-slate-200 hover:border-teal-300'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center shrink-0 transition ${
                            isChecked ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-900">{q.question}</p>
                          <p className="text-[11px] text-slate-500 italic mt-0.5">Why ask: {q.reason}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add personal question input */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Type an additional question to ask your doctor..."
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddQuestion()}
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    onClick={handleAddQuestion}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Clinician Oversight / Verification Box (RBAC) */}
              {(currentUser.role === 'clinician' || currentUser.role === 'admin') && (
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-emerald-700" />
                      <h4 className="font-bold text-xs text-emerald-950 uppercase tracking-wider">
                        Clinician Verification Console (Role: {currentUser.role.toUpperCase()})
                      </h4>
                    </div>
                    {currentReport.clinicianVerified && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Verification Recorded
                      </span>
                    )}
                  </div>

                  {currentReport.clinicianNotes && (
                    <div className="p-2.5 bg-white rounded-lg border border-emerald-200 text-xs text-slate-700">
                      <strong>Physician Note:</strong> {currentReport.clinicianNotes}
                    </div>
                  )}

                  {!currentReport.clinicianVerified && (
                    <div className="space-y-2">
                      <textarea
                        rows={2}
                        placeholder="Add physician notes or confirm plain-language explanation accuracy..."
                        value={clinicianNotesInput}
                        onChange={(e) => setClinicianNotesInput(e.target.value)}
                        className="w-full p-2 text-xs bg-white border border-emerald-300 rounded-lg focus:outline-none"
                      />
                      <button
                        onClick={handleVerifyReport}
                        disabled={isVerifying}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Sign & Electronically Verify Report</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Responsible AI Safety & Non-Diagnostic Notice */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Responsible AI Governance:</strong> {currentReport.clinicalDisclaimer}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
