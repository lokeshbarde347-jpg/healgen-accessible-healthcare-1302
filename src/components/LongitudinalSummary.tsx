import React, { useState } from 'react';
import {
  TrendingUp,
  Activity,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Download,
  RefreshCw,
  Layers,
} from 'lucide-react';
import { MedicalReportAnalysis, UserProfile } from '../types/medical.ts';
import { apiClient } from '../services/apiClient.ts';

interface LongitudinalSummaryProps {
  reports: MedicalReportAnalysis[];
  currentUser: UserProfile;
  currentLanguage: string;
}

export const LongitudinalSummary: React.FC<LongitudinalSummaryProps> = ({
  reports,
  currentUser,
  currentLanguage,
}) => {
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesisData, setSynthesisData] = useState<{
    headline: string;
    executiveSummary: string;
    trendAnalysis: { metricName: string; direction: string; insight: string }[];
    strengthsIdentified: string[];
    clinicalActionItems: string[];
  }>({
    headline: 'Stable Organ Function with Actionable Cardiovascular Focus',
    executiveSummary:
      'Over the past recorded period, your vital kidney, liver, and electrolyte markers demonstrate excellent preserved health and stability. Your primary focus area remains your lipid balance (cholesterol & triglycerides) alongside conservative physical therapy for lumbar spine comfort.',
    trendAnalysis: [
      {
        metricName: 'Metabolic & Kidney Health (eGFR, Glucose)',
        direction: 'improving',
        insight: 'Kidney filtration (>90 mL/min) and fasting blood glucose (92 mg/dL) remain optimal and stable.',
      },
      {
        metricName: 'Cardiovascular Lipid Panel (LDL, hs-CRP)',
        direction: 'needs_attention',
        insight: 'Elevated LDL (160 mg/dL) and mild inflammation indicate benefits from dietary adjustments and possible preventive therapy.',
      },
      {
        metricName: 'Musculoskeletal / Lumbar Spine',
        direction: 'stable',
        insight: 'L4-L5 disc protrusion identified; responding to non-invasive conservative treatment.',
      },
    ],
    strengthsIdentified: [
      'Excellent renal filtration capacity (>90 mL/min)',
      'Normal hepatic enzymes confirming liver resilience',
      'Normal resting blood glucose without signs of pre-diabetes',
    ],
    clinicalActionItems: [
      'Discuss lipid-lowering strategy with primary care physician',
      'Maintain consistent core-strengthening physical therapy routines',
      'Schedule repeat lipid panel in 3 months',
    ],
  });

  const handleRefreshSynthesis = async () => {
    setIsSynthesizing(true);
    try {
      const res = await apiClient.synthesize({
        reportIds: reports.map((r) => r.id),
        language: currentLanguage,
        userId: currentUser.id,
        userRole: currentUser.role,
      });
      setSynthesisData(res);
    } catch (e: any) {
      alert(e.message || 'Failed to re-synthesize records');
    } finally {
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-cyan-800 rounded-2xl p-6 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/30 text-teal-200 border border-teal-400/30 text-[10px] font-bold tracking-wider uppercase">
              Slide 4 Feature: Health Summary
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Longitudinal Health Journey</h1>
          <p className="text-sm text-teal-100 max-w-xl mt-1">
            Synthesizes trends, biomarkers, and clinical findings across all your uploaded records over time.
          </p>
        </div>

        <button
          onClick={handleRefreshSynthesis}
          disabled={isSynthesizing}
          className="px-4 py-2.5 bg-white text-teal-800 hover:bg-teal-50 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer self-start sm:self-auto disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${isSynthesizing ? 'animate-spin' : ''}`} />
          <span>{isSynthesizing ? 'Synthesizing...' : 'Re-Run Multi-Record AI Synthesis'}</span>
        </button>
      </div>

      {/* Synthesis Executive Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-teal-600" />
          <h2 className="text-base font-bold text-slate-900">{synthesisData.headline}</h2>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
          {synthesisData.executiveSummary}
        </p>

        {/* Biomarker Trajectory Cards */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Biomarker Progression Trends:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {synthesisData.trendAnalysis.map((trend, idx) => {
              let badgeColor = 'bg-teal-50 text-teal-800 border-teal-200';
              if (trend.direction === 'needs_attention') {
                badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
              }
              return (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{trend.metricName}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${badgeColor}`}>
                      {trend.direction.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{trend.insight}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Strengths vs Action Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Strengths */}
          <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-2">
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Preserved Health Strengths
            </h4>
            <div className="space-y-1.5">
              {synthesisData.strengthsIdentified.map((st, i) => (
                <div key={i} className="text-xs text-emerald-800 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>{st}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Items */}
          <div className="p-4 bg-teal-50/50 border border-teal-200 rounded-xl space-y-2">
            <h4 className="text-xs font-bold text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-teal-600" />
              Recommended Focus Areas
            </h4>
            <div className="space-y-1.5">
              {synthesisData.clinicalActionItems.map((act, i) => (
                <div key={i} className="text-xs text-teal-900 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Historical Record Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Calendar className="w-4 h-4 text-teal-600" />
          Clinical Timeline ({reports.length} Records)
        </h3>

        <div className="space-y-3">
          {reports.map((report) => (
            <div
              key={report.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{report.title}</span>
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-200 px-2 py-0.5 rounded uppercase">
                    {report.category}
                  </span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-1 mt-1">{report.plainLanguageSummary}</p>
                <div className="text-[11px] text-slate-400 mt-1">
                  Recorded: {report.reportDate} • Reading Grade: {report.readingGradeSimplified} • Confidence: {report.uncertaintyScore}%
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <span className="text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-lg">
                  {report.biomarkers.length} Biomarkers
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
