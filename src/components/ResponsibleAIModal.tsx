import React from 'react';
import { ShieldCheck, Lock, AlertTriangle, Eye, UserCheck, X, FileCheck } from 'lucide-react';

interface ResponsibleAIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResponsibleAIModal: React.FC<ResponsibleAIModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-700 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
              <ShieldCheck className="w-6 h-6 text-teal-200" />
            </div>
            <div>
              <h2 className="text-xl font-bold">HealGen Responsible AI Charter</h2>
              <p className="text-xs text-teal-100 font-medium">Human-Centred Healthcare • Safety, Transparency & Privacy</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Core Principle */}
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-teal-900 text-sm">Core Clinical Principle</h4>
                <p className="text-xs text-teal-800 mt-1 leading-relaxed">
                  <strong>HealGen assists patient understanding and decision-making; doctors remain solely responsible for clinical diagnosis and prescribing.</strong>{' '}
                  Our generative models provide explanatory translations, never definitive diagnostic decrees.
                </p>
              </div>
            </div>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50">
              <div className="flex items-center gap-2 mb-2 text-teal-700 font-semibold text-sm">
                <Lock className="w-4 h-4" />
                <span>Privacy & De-Identification</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Health documents undergo automated HIPAA-aligned de-identification scrubbing before reasoning. We do not use private patient clinical records to train foundational models.
              </p>
            </div>

            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50">
              <div className="flex items-center gap-2 mb-2 text-teal-700 font-semibold text-sm">
                <Eye className="w-4 h-4" />
                <span>Uncertainty Communication</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every report and observation is assigned an explicit Uncertainty & Confidence index. The model clearly marks missing clinical context that only a doctor can evaluate.
              </p>
            </div>

            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50">
              <div className="flex items-center gap-2 mb-2 text-teal-700 font-semibold text-sm">
                <UserCheck className="w-4 h-4" />
                <span>Human-in-the-Loop Oversight</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Licensed clinicians can review, annotate, and digitally verify simplified reports before or during consultations, maintaining clinical integrity.
              </p>
            </div>

            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50">
              <div className="flex items-center gap-2 mb-2 text-teal-700 font-semibold text-sm">
                <FileCheck className="w-4 h-4" />
                <span>Auditable Governance</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Real-time immutable audit logging of model transactions, reading level reduction metrics, and safety checks enables full institutional compliance.
              </p>
            </div>
          </div>

          {/* Standards strip */}
          <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <span>Alignment: AMA Ethical Guidelines • HIPAA Safe Harbor • FDA SAMD Framework</span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition text-xs"
            >
              I Understand & Agree
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
