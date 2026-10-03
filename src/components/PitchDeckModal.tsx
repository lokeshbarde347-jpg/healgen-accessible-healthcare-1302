import React, { useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  FileText,
  Camera,
  MessageSquare,
  ClipboardList,
  BarChart3,
  ExternalLink,
} from 'lucide-react';

interface PitchDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tabId: string) => void;
}

const SLIDES = [
  {
    page: 1,
    title: 'HEALGEN',
    subtitle: 'Accessible Healthcare & Diagnostics',
    tagline: 'Generative AI for Human-Centred Healthcare • Responsible AI',
    bullets: [
      'Generative AI for Human-Centred Healthcare',
      'Making medical information understandable, accessible and actionable.',
      'Responsible AI with strict non-diagnostic boundaries and human oversight.',
    ],
    actionTab: 'simplifier',
    actionLabel: 'Launch Report Simplifier',
    icon: Sparkles,
    badge: 'HEALGEN | 1/6',
  },
  {
    page: 2,
    title: '01 THE PROBLEM',
    subtitle: 'Healthcare information is complex',
    tagline: 'Patients struggle to navigate dense medical documentation',
    bullets: [
      'Medical reports and lab results often use difficult, intimidating terminology.',
      'Patients can struggle to understand important health information when they need it most.',
      'Information may be scattered across multiple records, portals, and specialists.',
      'AI must balance usefulness with accuracy, privacy, and clinical safety.',
    ],
    actionTab: 'simplifier',
    actionLabel: 'See How We Solve Terminology',
    icon: FileText,
    badge: 'HEALGEN | 2/6',
  },
  {
    page: 3,
    title: '02 OUR SOLUTION',
    subtitle: 'An AI assistant that explains healthcare information',
    tagline: 'Human-centred translation without automated diagnosing',
    bullets: [
      'Upload or enter medical information such as reports, prescriptions and lab results.',
      'Generative AI converts complex content into plain-language 6th-grade explanations.',
      'Users can ask general health questions and prepare questions for doctors.',
      'HealGen supports understanding and decision-making—not medical diagnosis.',
    ],
    actionTab: 'assistant',
    actionLabel: 'Try Health Q&A Assistant',
    icon: MessageSquare,
    badge: 'HEALGEN | 3/6',
  },
  {
    page: 4,
    title: '03 KEY FEATURES',
    subtitle: 'Clearer healthcare communication in one platform',
    tagline: 'Comprehensive suite of patient-empowerment tools',
    bullets: [
      'Medical Report Simplifier — plain-language summaries and biomarker breakdowns',
      'Health Q&A Assistant — general health information with safety guardrails',
      'Diagnostic Insight — supported image observations with explicit uncertainty levels',
      'Patient–Doctor Communication — terminology mastery and question preparation',
      'Health Summary — concise longitudinal summaries across records over time',
      'Privacy & Safety — de-identification protection, transparency and clear limitations',
    ],
    actionTab: 'visit_prep',
    actionLabel: 'Explore Doctor Visit Prep',
    icon: ClipboardList,
    badge: 'HEALGEN | 4/6',
  },
  {
    page: 5,
    title: '04 HOW IT WORKS',
    subtitle: 'From medical input to understandable insight',
    tagline: 'Multi-step verification with systematic uncertainty estimation',
    bullets: [
      '1. Upload / enter a report or supported image (radiograph, ECG, or lab scan)',
      '2. AI extracts relevant information via OCR and multimodal vision',
      '3. Generative AI summarizes and explains the content in plain language',
      '4. User asks questions or requests a multi-record health summary',
      '5. System communicates uncertainty and encourages professional review when needed',
      'Technology: LLM + document/OCR processing + secure data layer + web/mobile UI',
    ],
    actionTab: 'diagnostic',
    actionLabel: 'Try Diagnostic Visual Insight',
    icon: Camera,
    badge: 'HEALGEN | 5/6',
  },
  {
    page: 6,
    title: '05 IMPACT & FUTURE',
    subtitle: 'Human-centred healthcare through responsible AI',
    tagline: 'Doctors remain responsible for clinical decisions',
    bullets: [
      'Impact: reduce confusion • improve communication • save review time • increase accessibility',
      'Future: multilingual explanations • voice interface • EHR integration • clinician review tools',
      'Responsible AI: privacy, transparency, factual accuracy and human oversight',
      'Core principle: HealGen assists understanding; doctors remain responsible for clinical decisions.',
    ],
    actionTab: 'analytics',
    actionLabel: 'View Real-Time Analytics & RBAC',
    icon: BarChart3,
    badge: 'HEALGEN | 6/6',
  },
];

export const PitchDeckModal: React.FC<PitchDeckModalProps> = ({ isOpen, onClose, onNavigateToTab }) => {
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);

  if (!isOpen) return null;

  const slide = SLIDES[currentSlideIdx];
  const IconComponent = slide.icon;

  const handleNext = () => {
    setCurrentSlideIdx((prev) => (prev < SLIDES.length - 1 ? prev + 1 : prev));
  };

  const handlePrev = () => {
    setCurrentSlideIdx((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 flex flex-col min-h-[500px]">
        {/* Top Slide Header */}
        <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-cyan-800 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
              <IconComponent className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold tracking-tight">{slide.title}</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white uppercase tracking-wider">
                  {slide.badge}
                </span>
              </div>
              <p className="text-xs text-teal-100 font-medium">{slide.subtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slide Body */}
        <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 text-teal-900 text-xs font-semibold">
              {slide.tagline}
            </div>

            <div className="space-y-3">
              {slide.bullets.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-3 text-slate-700 text-sm">
                  <div className="w-2 h-2 rounded-full bg-teal-600 mt-2 shrink-0"></div>
                  <span className="leading-relaxed">{bullet}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Launch Button */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => {
                onNavigateToTab(slide.actionTab);
                onClose();
              }}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer w-full sm:w-auto justify-center"
            >
              <span>{slide.actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Slider Navigation */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400">
                Slide {slide.page} of {SLIDES.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrev}
                  disabled={currentSlideIdx === 0}
                  className="p-2 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 disabled:opacity-30 transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentSlideIdx === SLIDES.length - 1}
                  className="p-2 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-600 disabled:opacity-30 transition cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Ribbon */}
        <div className="px-8 py-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <span className="font-semibold text-teal-800">HEALGEN • RESPONSIBLE AI</span>
          <span>Core Principle: HealGen assists understanding; doctors remain responsible for clinical decisions.</span>
        </div>
      </div>
    </div>
  );
};
