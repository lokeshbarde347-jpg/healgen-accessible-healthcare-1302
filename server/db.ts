import fs from 'fs';
import path from 'path';
import { MedicalReportAnalysis, DiagnosticImageInsight, AuditLog, UserProfile } from '../src/types/medical.ts';

const DB_FILE_PATH = path.join(process.cwd(), 'data', 'healgen_db.json');

export interface DatabaseSchema {
  users: UserProfile[];
  reports: MedicalReportAnalysis[];
  diagnosticImages: DiagnosticImageInsight[];
  auditLogs: AuditLog[];
  analytics: {
    totalReportsAnalyzed: number;
    avgReadingGradeReduction: number;
    comprehensionScoreAvg: number;
    safetyChecksPassed: number;
    uncertaintyFlaggedCount: number;
    activeUsersCount: number;
  };
}

const INITIAL_USERS: UserProfile[] = [
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
    organization: 'Clinical Governance & Safety Directorate',
  },
];

const INITIAL_REPORTS: MedicalReportAnalysis[] = [
  {
    id: 'rep_lipid_2026',
    title: 'Comprehensive Lipid & Cardiovascular Risk Panel',
    patientId: 'usr_patient_1',
    patientName: 'Sarah Jenkins',
    reportDate: '2026-09-18',
    category: 'lab_test',
    originalText: `SPECIMEN: Serum / Venipuncture. FASTING: 12 Hours.
TEST NAME                    RESULT       FLAG      REFERENCE RANGE       UNITS
Total Cholesterol            242          HIGH      < 200                 mg/dL
Triglycerides                188          HIGH      < 150                 mg/dL
HDL Cholesterol              44                     > 50                  mg/dL
LDL Cholesterol (Calculated) 160          HIGH      < 100                 mg/dL
Non-HDL Cholesterol          198          HIGH      < 130                 mg/dL
Cholesterol/HDL Ratio        5.5          HIGH      < 4.5                 ratio
Apolipoprotein B             115          HIGH      < 90                  mg/dL
High Sensitivity CRP (hs-CRP) 3.4         HIGH      < 1.0 (Low risk)      mg/L

CLINICAL IMPRESSION: Dyslipidemia characterized by elevated atherogenic lipoproteins and elevated systemic inflammatory biomarker (hs-CRP). Elevated atherosclerotic cardiovascular disease (ASCVD) risk profile. Recommend lifestyle dietary interventions, evaluation for statin pharmacotherapy (HMG-CoA reductase inhibitor), and repeat fasting panel in 12 weeks.`,
    plainLanguageSummary: `Your blood cholesterol and fat levels are higher than typical target ranges. Specifically, your "bad" cholesterol (LDL) and triglycerides are elevated, while your protective "good" cholesterol (HDL) is slightly below recommended levels. In addition, an inflammation marker called hs-CRP is elevated, which can indicate mild irritation or inflammation in blood vessel walls. This means your heart and blood vessels could experience more strain over time if left unaddressed. Simple nutrition adjustments, cardiovascular exercise, and potential preventive medication discussed with your physician can effectively bring these numbers back into healthy balance.`,
    readingGradeOriginal: 14.8,
    readingGradeSimplified: 6.4,
    biomarkers: [
      {
        name: 'Total Cholesterol',
        value: '242 mg/dL',
        referenceRange: '< 200 mg/dL',
        status: 'high',
        explanation: 'The total amount of cholesterol circulating in your bloodstream. High values can form fatty buildup in arteries over time.',
      },
      {
        name: 'LDL Cholesterol ("Bad")',
        value: '160 mg/dL',
        referenceRange: '< 100 mg/dL',
        status: 'high',
        explanation: 'Often called bad cholesterol because it can deposit in the walls of your blood vessels.',
      },
      {
        name: 'HDL Cholesterol ("Good")',
        value: '44 mg/dL',
        referenceRange: '> 50 mg/dL',
        status: 'low',
        explanation: 'The protective cholesterol that collects excess fat from arteries and takes it back to your liver.',
      },
      {
        name: 'Triglycerides',
        value: '188 mg/dL',
        referenceRange: '< 150 mg/dL',
        status: 'high',
        explanation: 'A common type of fat stored from excess calories, carbs, or sugars.',
      },
      {
        name: 'hs-CRP (Inflammation)',
        value: '3.4 mg/L',
        referenceRange: '< 1.0 mg/L',
        status: 'high',
        explanation: 'High-sensitivity C-reactive protein measures general inflammation in the cardiovascular system.',
      },
    ],
    jargonGlossary: [
      {
        term: 'Dyslipidemia',
        simplified: 'Imbalanced blood fats',
        definition: 'An abnormal amount of lipids (like cholesterol or triglycerides) in the blood.',
      },
      {
        term: 'Atherogenic',
        simplified: 'Plaque-forming tendency',
        definition: 'Having the ability or tendency to cause buildup of fatty deposits inside blood vessels.',
      },
      {
        term: 'HMG-CoA Reductase Inhibitor',
        simplified: 'Statin medication',
        definition: 'A standard family of medications (such as Atorvastatin or Rosuvastatin) that help the liver produce less cholesterol.',
      },
    ],
    doctorQuestions: [
      {
        question: 'Given my LDL of 160 and elevated hs-CRP, would you recommend starting a statin medication, or should we try 3 months of nutrition and exercise first?',
        reason: 'Helps determine whether immediate medical therapy or conservative lifestyle modification is best for your overall cardiovascular risk score.',
        priority: 'high',
      },
      {
        question: 'Could any other factors (such as stress, recent illness, or genetics) be elevating my hs-CRP inflammation marker?',
        reason: 'hs-CRP can temporarily spike from minor infections or joint flare-ups, so checking for other causes is standard practice.',
        priority: 'medium',
      },
      {
        question: 'When should we schedule a follow-up fasting blood test to measure progress?',
        reason: 'Typically doctors re-test at 8 to 12 weeks after implementing changes.',
        priority: 'routine',
      },
    ],
    uncertaintyScore: 95,
    uncertaintyNotes: [
      'Report has clear numerical boundaries with verified laboratory reference ranges.',
      'Cardiovascular risk calculations require full clinical context (blood pressure, smoking status, family history) which the AI cannot see.',
    ],
    clinicalDisclaimer: 'HealGen assists understanding and does not replace medical advice or physician diagnosis. Always discuss clinical findings directly with your physician.',
    clinicianVerified: true,
    clinicianNotes: 'Patient counseled on Mediterranean dietary habits; consider baseline CAC (Coronary Artery Calcium) score if uncertain on statin.',
    language: 'en',
    createdAt: '2026-09-19T10:14:00Z',
  },
  {
    id: 'rep_mri_lumbar',
    title: 'Lumbar Spine MRI (Without Contrast)',
    patientId: 'usr_patient_1',
    patientName: 'Sarah Jenkins',
    reportDate: '2026-08-04',
    category: 'radiology',
    originalText: `EXAMINATION: MRI LUMBAR SPINE WITHOUT CONTRAST
INDICATION: Persistent lower back pain with right lower extremity L5 dermatomal paresthesias.
FINDINGS:
L1-L2 through L3-L4: Normal disk heights and signals. No significant spinal canal or neuroforaminal compromise.
L4-L5: Moderate intervertebral disc desiccation with a 4mm broad-based posterior disk protrusion with subtle annular fissure. Mild effacement of the thecal sac. Mild bilateral neuroforaminal narrowing, right greater than left, abutting the exiting right L5 nerve root.
L5-S1: Mild disc bulging without significant central canal stenosis.
IMPRESSION:
1. L4-L5 broad-based posterior disc protrusion impinging on right L5 nerve root, corresponding with patient's reported right radiculopathy.
2. Mild multi-level degenerative disc disease as detailed above.`,
    plainLanguageSummary: `The magnetic resonance imaging (MRI) scan of your lower spine shows that one of the cushioning discs between your lower back bones (specifically at the level called L4-L5) has a mild bulge (about 4 millimeters). This bulge is touching or lightly pressing against the nerve that travels down your right leg. This directly explains why you have been feeling tingling, numbness, or shooting pain down your right thigh or foot (known as sciatica or radiculopathy). The remaining discs look mostly healthy with normal age-related wear and tear.`,
    readingGradeOriginal: 15.6,
    readingGradeSimplified: 6.8,
    biomarkers: [
      {
        name: 'L4-L5 Disc Protrusion',
        value: '4 mm',
        referenceRange: '0 mm (Flush)',
        status: 'high',
        explanation: 'A small outward bulge of the spinal cushion disc toward the spinal canal.',
      },
      {
        name: 'Right L5 Nerve Contact',
        value: 'Abutment / Impingement',
        referenceRange: 'No nerve contact',
        status: 'caution' as any,
        explanation: 'The bulging disc is lightly pressing on the nerve going down your right leg, causing tingling or pain.',
      },
    ],
    jargonGlossary: [
      {
        term: 'Annular Fissure',
        simplified: 'Tiny tear in the outer disc ring',
        definition: 'A small micro-tear or wear mark in the tough outer fibers of the spinal disc cushion, very common as we age.',
      },
      {
        term: 'Neuroforaminal Narrowing',
        simplified: 'Tight nerve tunnel',
        definition: 'The bony exit window through which spinal nerves leave the spine to go to the legs has become slightly tighter.',
      },
      {
        term: 'Radiculopathy',
        simplified: 'Nerve pain or sciatica',
        definition: 'Pain, numbness, tingling, or weakness that travels along the path of an irritated spinal nerve.',
      },
    ],
    doctorQuestions: [
      {
        question: 'Are physical therapy and core-strengthening exercises sufficient to take the pressure off this right L5 nerve?',
        reason: 'Most disc protrusions respond well to targeted non-surgical physical therapy.',
        priority: 'high',
      },
      {
        question: 'Would a short course of anti-inflammatory medication or an epidural steroid injection help calm the nerve inflammation?',
        reason: 'Helps clarify pain management options if daily mobility or sleep is restricted.',
        priority: 'medium',
      },
      {
        question: 'What warning symptoms (like sudden foot drop or bladder changes) should prompt me to seek urgent evaluation?',
        reason: 'Critical safety question to know red-flag emergency symptoms for spinal compression.',
        priority: 'high',
      },
    ],
    uncertaintyScore: 92,
    uncertaintyNotes: [
      'Radiology report has clear structural findings matching clinical symptoms.',
      'Imaging findings must always be correlated with physical physical exam tests (straight leg raise, reflex testing).',
    ],
    clinicalDisclaimer: 'HealGen assists understanding and does not replace medical advice or physician diagnosis. Consult an orthopedic specialist or physical therapist.',
    clinicianVerified: true,
    clinicianNotes: 'Referred to outpatient Physical Therapy; recommended avoiding heavy spinal flexion / lifting.',
    language: 'en',
    createdAt: '2026-08-05T14:30:00Z',
  },
  {
    id: 'rep_cmp_2026',
    title: 'Comprehensive Metabolic Panel (CMP) & Renal Function',
    patientId: 'usr_patient_1',
    patientName: 'Sarah Jenkins',
    reportDate: '2026-07-12',
    category: 'lab_test',
    originalText: `COMPREHENSIVE METABOLIC PANEL (CMP)
Sodium: 139 mmol/L (135-145)
Potassium: 4.2 mmol/L (3.5-5.1)
Chloride: 102 mmol/L (96-106)
Carbon Dioxide: 26 mmol/L (22-29)
Blood Urea Nitrogen (BUN): 18 mg/dL (7-20)
Creatinine: 0.82 mg/dL (0.50-1.10)
eGFR: > 90 mL/min/1.73m2 (> 60)
Glucose, Fasting: 92 mg/dL (70-99)
Calcium: 9.4 mg/dL (8.6-10.2)
Total Protein: 7.1 g/dL (6.4-8.3)
Albumin: 4.4 g/dL (3.5-5.0)
Total Bilirubin: 0.6 mg/dL (0.2-1.2)
Alkaline Phosphatase (ALP): 68 U/L (44-121)
Aspartate Aminotransferase (AST): 21 U/L (10-40)
Alanine Aminotransferase (ALT): 19 U/L (7-56)

IMPRESSION: Normal metabolic panel. Excellent preserved glomerular filtration rate (eGFR > 90). Normal hepatic enzymes and electrolyte balance.`,
    plainLanguageSummary: `Your metabolic blood test results are completely normal and reassuring! Your kidneys are filtering waste cleanly and effectively (with an eGFR above 90), your liver enzymes are in optimal balance, your blood sugar is steady at 92 mg/dL, and your essential body salts (electrolytes like sodium and potassium) are right where they should be.`,
    readingGradeOriginal: 13.9,
    readingGradeSimplified: 5.9,
    biomarkers: [
      {
        name: 'Fasting Blood Sugar (Glucose)',
        value: '92 mg/dL',
        referenceRange: '70 - 99 mg/dL',
        status: 'normal',
        explanation: 'Your blood sugar level after fasting. Under 100 mg/dL is considered optimal.',
      },
      {
        name: 'Kidney Filter Rate (eGFR)',
        value: '> 90 mL/min',
        referenceRange: '> 60 mL/min',
        status: 'normal',
        explanation: 'Measures how well your kidneys clean waste products from your blood. Above 90 is excellent.',
      },
      {
        name: 'Liver Enzymes (AST / ALT)',
        value: '21 / 19 U/L',
        referenceRange: '10-40 / 7-56 U/L',
        status: 'normal',
        explanation: 'Proteins released by liver cells. Normal numbers show healthy liver cell integrity.',
      },
      {
        name: 'Potassium & Sodium',
        value: '4.2 / 139 mmol/L',
        referenceRange: 'Normal',
        status: 'normal',
        explanation: 'Electrolytes that keep your heart rhythm steady, nerves firing, and fluid balanced.',
      },
    ],
    jargonGlossary: [
      {
        term: 'eGFR',
        simplified: 'Kidney filtration speed',
        definition: 'Estimated Glomerular Filtration Rate calculates how many milliliters of blood your kidneys filter every minute.',
      },
      {
        term: 'Hepatic Enzymes',
        simplified: 'Liver proteins',
        definition: 'Enzymes like AST and ALT found in liver tissue that indicate liver stress when elevated.',
      },
    ],
    doctorQuestions: [
      {
        question: 'Since my kidney and liver functions look great, is my body well-suited to handle any future cholesterol medication if needed?',
        reason: 'Physicians look at CMP before prescribing medications like statins to confirm healthy liver and kidney function.',
        priority: 'routine',
      },
    ],
    uncertaintyScore: 98,
    uncertaintyNotes: ['All biomarkers have explicit numerical values falling squarely within laboratory reference ranges.'],
    clinicalDisclaimer: 'HealGen assists understanding and does not replace medical advice or physician diagnosis.',
    clinicianVerified: true,
    clinicianNotes: 'Routine metabolic panel normal. Re-check annually.',
    language: 'en',
    createdAt: '2026-07-13T09:00:00Z',
  },
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud_1',
    timestamp: '2026-10-02T22:45:11Z',
    userId: 'usr_patient_1',
    userRole: 'patient',
    action: 'REPORT_SIMPLIFICATION',
    resourceId: 'rep_lipid_2026',
    details: 'Processed Lipid Panel text. De-identification scrub completed (0 PII tokens retained). Plain language grade reduced 14.8 -> 6.4.',
    safetyCheck: 'PASSED',
  },
  {
    id: 'aud_2',
    timestamp: '2026-10-02T23:12:04Z',
    userId: 'usr_clinician_1',
    userRole: 'clinician',
    action: 'CLINICAL_VERIFICATION',
    resourceId: 'rep_lipid_2026',
    details: 'Dr. Marcus Vance verified AI explanation fidelity and added physician guidance notes.',
    safetyCheck: 'PASSED',
  },
  {
    id: 'aud_3',
    timestamp: '2026-10-03T00:05:40Z',
    userId: 'usr_patient_1',
    userRole: 'patient',
    action: 'HEALTH_QA_QUERY',
    details: 'User asked about LDL reduction strategies and statin safety profile.',
    safetyCheck: 'PASSED',
  },
  {
    id: 'aud_4',
    timestamp: '2026-10-03T00:10:19Z',
    userId: 'usr_admin_1',
    userRole: 'admin',
    action: 'GOVERNANCE_AUDIT',
    details: 'Model safety filter validation: 100% of responses contained non-diagnostic disclaimers and uncertainty ratings.',
    safetyCheck: 'PASSED',
  },
];

class DatabaseService {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        return JSON.parse(fileContent);
      }
    } catch (e) {
      console.warn('Could not read existing database file, initializing default database:', e);
    }

    const initialData: DatabaseSchema = {
      users: INITIAL_USERS,
      reports: INITIAL_REPORTS,
      diagnosticImages: [],
      auditLogs: INITIAL_AUDIT_LOGS,
      analytics: {
        totalReportsAnalyzed: 142,
        avgReadingGradeReduction: 8.3,
        comprehensionScoreAvg: 94.6,
        safetyChecksPassed: 100,
        uncertaintyFlaggedCount: 14,
        activeUsersCount: 38,
      },
    };

    this.saveToDisk(initialData);
    return initialData;
  }

  private saveToDisk(dataToSave: DatabaseSchema) {
    try {
      const dir = path.dirname(DB_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file to disk:', err);
    }
  }

  public getUsers(): UserProfile[] {
    return this.data.users;
  }

  public getUserById(id: string): UserProfile | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public getReports(patientId?: string): MedicalReportAnalysis[] {
    if (patientId) {
      return this.data.reports.filter((r) => r.patientId === patientId);
    }
    return this.data.reports;
  }

  public getReportById(id: string): MedicalReportAnalysis | undefined {
    return this.data.reports.find((r) => r.id === id);
  }

  public saveReport(report: MedicalReportAnalysis): MedicalReportAnalysis {
    const existingIndex = this.data.reports.findIndex((r) => r.id === report.id);
    if (existingIndex >= 0) {
      this.data.reports[existingIndex] = report;
    } else {
      this.data.reports.unshift(report);
      this.data.analytics.totalReportsAnalyzed += 1;
    }
    this.saveToDisk(this.data);
    return report;
  }

  public deleteReport(id: string): boolean {
    const initialLen = this.data.reports.length;
    this.data.reports = this.data.reports.filter((r) => r.id !== id);
    if (this.data.reports.length !== initialLen) {
      this.saveToDisk(this.data);
      return true;
    }
    return false;
  }

  public verifyReportByClinician(reportId: string, notes: string): MedicalReportAnalysis | null {
    const report = this.data.reports.find((r) => r.id === reportId);
    if (report) {
      report.clinicianVerified = true;
      report.clinicianNotes = notes;
      this.saveToDisk(this.data);
      this.logAudit({
        userId: 'usr_clinician_1',
        userRole: 'clinician',
        action: 'CLINICIAN_VERIFIED',
        resourceId: reportId,
        details: `Clinician verified report "${report.title}". Added notes: "${notes.slice(0, 50)}..."`,
        safetyCheck: 'PASSED',
      });
      return report;
    }
    return null;
  }

  public getAnalytics() {
    return {
      ...this.data.analytics,
      reportsCount: this.data.reports.length,
      auditLogsCount: this.data.auditLogs.length,
      recentReports: this.data.reports.slice(0, 5),
    };
  }

  public logAudit(entry: Omit<AuditLog, 'id' | 'timestamp'>): AuditLog {
    const newLog: AuditLog = {
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };
    this.data.auditLogs.unshift(newLog);
    if (this.data.auditLogs.length > 200) {
      this.data.auditLogs.pop();
    }
    this.saveToDisk(this.data);
    return newLog;
  }

  public getAuditLogs(): AuditLog[] {
    return this.data.auditLogs;
  }
}

export const dbService = new DatabaseService();
