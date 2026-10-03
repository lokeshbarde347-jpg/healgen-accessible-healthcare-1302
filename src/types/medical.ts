export interface Biomarker {
  name: string;
  value: string;
  referenceRange: string;
  status: 'normal' | 'low' | 'high' | 'critical' | 'informational';
  explanation: string;
}

export interface JargonTerm {
  term: string;
  simplified: string;
  definition: string;
}

export interface DoctorQuestion {
  question: string;
  reason: string;
  priority: 'high' | 'medium' | 'routine';
}

export interface MedicalReportAnalysis {
  id: string;
  title: string;
  patientId: string;
  patientName: string;
  reportDate: string;
  category: 'lab_test' | 'radiology' | 'pathology' | 'prescription' | 'general';
  originalText: string;
  plainLanguageSummary: string;
  readingGradeOriginal: number; // e.g. 14.5 (college)
  readingGradeSimplified: number; // e.g. 6.2 (elementary)
  biomarkers: Biomarker[];
  jargonGlossary: JargonTerm[];
  doctorQuestions: DoctorQuestion[];
  uncertaintyScore: number; // 0 to 100 (e.g., 94% confidence, 6% uncertainty)
  uncertaintyNotes: string[];
  clinicalDisclaimer: string;
  clinicianVerified?: boolean;
  clinicianNotes?: string;
  language: string;
  createdAt: string;
}

export interface DiagnosticImageInsight {
  id: string;
  title: string;
  imageType: 'xray' | 'ecg' | 'dermatology' | 'lab_sheet' | 'other';
  imageUrl: string;
  observations: string[];
  findingsSummary: string;
  uncertaintyLevel: 'low' | 'moderate' | 'high';
  confidencePercentage: number;
  anomaliesDetected: string[];
  recommendedClinicianReview: string;
  patientAdvice: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  uncertaintyIndex?: number;
  safetyFlags?: string[];
  suggestedQuestions?: string[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userRole: 'patient' | 'clinician' | 'admin';
  action: string;
  resourceId?: string;
  details: string;
  safetyCheck: 'PASSED' | 'REVIEW_REQUIRED' | 'NEUTRAL';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'clinician' | 'admin';
  avatarUrl: string;
  organization?: string;
  specialty?: string;
}
