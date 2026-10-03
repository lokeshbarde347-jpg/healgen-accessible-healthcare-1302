import React, { useState } from 'react';
import {
  Camera,
  Upload,
  AlertTriangle,
  Eye,
  CheckCircle2,
  HelpCircle,
  FileQuestion,
  RefreshCw,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { SAMPLE_DIAGNOSTIC_IMAGES, SampleDiagnosticImage } from '../data/sampleData.ts';
import { apiClient } from '../services/apiClient.ts';
import { DiagnosticImageInsight, UserProfile } from '../types/medical.ts';

interface DiagnosticInsightProps {
  currentUser: UserProfile;
  currentLanguage: string;
}

export const DiagnosticInsight: React.FC<DiagnosticInsightProps> = ({ currentUser, currentLanguage }) => {
  const [selectedSample, setSelectedSample] = useState<SampleDiagnosticImage>(SAMPLE_DIAGNOSTIC_IMAGES[0]);
  const [activeImageDataUrl, setActiveImageDataUrl] = useState<string>(SAMPLE_DIAGNOSTIC_IMAGES[0].dataUrl);
  const [customDescription, setCustomDescription] = useState('Chest X-ray PA view routine check');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DiagnosticImageInsight | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle sample selection
  const handleSelectSample = (sample: SampleDiagnosticImage) => {
    setSelectedSample(sample);
    setActiveImageDataUrl(sample.dataUrl);
    setCustomDescription(sample.description);
    setAnalysisResult(null);
    setErrorMsg('');
  };

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setActiveImageDataUrl(result);
        setCustomDescription(`Uploaded image: ${file.name}`);
        setAnalysisResult(null);
        setErrorMsg('');
      };
      reader.readAsDataURL(file);
    }
  };

  // Run AI observation analysis
  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    setErrorMsg('');

    try {
      // Split base64 from data url
      let base64Data = '';
      let mimeType = 'image/png';
      if (activeImageDataUrl.includes(',')) {
        const parts = activeImageDataUrl.split(',');
        mimeType = parts[0].split(':')[1]?.split(';')[0] || 'image/png';
        base64Data = parts[1];
      }

      const result = await apiClient.analyzeDiagnosticImage({
        base64Data,
        mimeType,
        description: customDescription,
        imageType: selectedSample.type,
        language: currentLanguage,
        userId: currentUser.id,
        userRole: currentUser.role,
      });

      setAnalysisResult(result);
    } catch (err: any) {
      setErrorMsg(err.message || 'Observation analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-2xl p-6 text-white border border-teal-800/40 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-bold tracking-wider uppercase">
                Slide 4 Feature: Diagnostic Insight
              </span>
              <span className="text-xs text-teal-300/80 font-mono">Multimodal Vision & OCR</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">Diagnostic Visual Insight & Uncertainty</h1>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              Supports visual extraction from clinical imaging, rhythm strips, and paper lab scans with systematic uncertainty indicators.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-xl font-medium flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Assists Understanding — Not Primary Diagnosis</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Selector & Viewer (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Sample Switcher */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              1. Choose Preloaded Diagnostic Media or Upload
            </h3>

            <div className="grid grid-cols-3 gap-2">
              {SAMPLE_DIAGNOSTIC_IMAGES.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSample(sample)}
                  className={`p-2 rounded-xl border text-center transition ${
                    selectedSample.id === sample.id
                      ? 'border-teal-500 bg-teal-50/60 font-bold text-teal-900 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600 text-xs'
                  }`}
                >
                  <div className="text-[10px] uppercase font-bold text-teal-700">{sample.badge}</div>
                  <div className="text-xs truncate font-medium">{sample.name}</div>
                </button>
              ))}
            </div>

            {/* Upload Custom File Input */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Or upload your scan:</span>
              <label className="cursor-pointer px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload File</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Active Image Canvas Preview */}
          <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 shadow-md flex flex-col items-center justify-center min-h-[320px] overflow-hidden relative">
            <img
              src={activeImageDataUrl}
              alt="Medical scan preview"
              className="max-h-[300px] w-auto object-contain rounded-lg border border-slate-700"
            />
            <div className="absolute top-6 left-6 px-2.5 py-1 bg-slate-900/80 backdrop-blur-md rounded-md text-[10px] font-mono text-teal-400 border border-slate-700">
              DICOM Preview / Scan Active
            </div>
          </div>

          {/* Clinical Context Input */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-2">
            <label className="text-xs font-semibold text-slate-700">Clinical Context / Indication</label>
            <input
              type="text"
              value={customDescription}
              onChange={(e) => setCustomDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="w-full mt-2 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-60"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Extracting Multimodal Observations...</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>Run Multimodal Diagnostic Observation</span>
                </>
              )}
            </button>
            {errorMsg && <p className="text-xs text-red-600 mt-1">{errorMsg}</p>}
          </div>
        </div>

        {/* Right Column: AI Visual Observations & Uncertainty (7 cols) */}
        <div className="lg:col-span-7">
          {!analysisResult ? (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 flex flex-col items-center justify-center text-center min-h-[460px]">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
                <Camera className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">Ready for Diagnostic Media Observation</h3>
              <p className="text-xs text-slate-500 max-w-md mt-1">
                Click <strong>"Run Multimodal Diagnostic Observation"</strong> to analyze anatomical patterns, waveform integrity, or printed laboratory values with explicit uncertainty guardrails.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5 animate-fadeIn">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-base text-slate-900">{analysisResult.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Automated Visual Observations & Confidence Index</p>
                </div>

                {/* Uncertainty Pill */}
                <div className="text-right">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                      analysisResult.uncertaintyLevel === 'low'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : analysisResult.uncertaintyLevel === 'moderate'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-red-50 text-red-800 border-red-200'
                    }`}
                  >
                    Uncertainty: {analysisResult.uncertaintyLevel} ({analysisResult.confidencePercentage}% Confidence)
                  </span>
                </div>
              </div>

              {/* Findings Summary */}
              <div className="p-4 bg-teal-50/50 border border-teal-200/70 rounded-xl space-y-1">
                <h4 className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  Plain-Language Visual Summary
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">{analysisResult.findingsSummary}</p>
              </div>

              {/* Systematic Visual Observations */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Systematic Visual Observations ({analysisResult.observations.length})
                </h4>
                <div className="space-y-2">
                  {analysisResult.observations.map((obs, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-700">{obs}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Anomalies Flagged for Specialist Over-Read */}
              {analysisResult.anomaliesDetected.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Points Flagged for Physician Over-Read
                  </h4>
                  <div className="space-y-1.5">
                    {analysisResult.anomaliesDetected.map((anom, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-amber-50/70 rounded-lg border border-amber-200 text-xs text-amber-900 font-medium"
                      >
                        • {anom}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Clinician Review */}
              <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="font-bold text-slate-900">Recommended Professional Review:</div>
                <p className="text-slate-600">{analysisResult.recommendedClinicianReview}</p>
                <div className="pt-2 border-t border-slate-200 text-slate-700">
                  <strong>Patient Guidance:</strong> {analysisResult.patientAdvice}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
