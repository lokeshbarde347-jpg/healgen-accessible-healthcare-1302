export interface SampleMedicalText {
  id: string;
  name: string;
  category: 'lab_test' | 'radiology' | 'pathology' | 'prescription' | 'general';
  description: string;
  patientName: string;
  text: string;
}

export const SAMPLE_MEDICAL_TEXTS: SampleMedicalText[] = [
  {
    id: 'sample_lipid',
    name: 'Advanced Cardiovascular Lipid Panel',
    category: 'lab_test',
    patientName: 'Sarah Jenkins',
    description: 'Fasting lipid panel showing high LDL (160 mg/dL), triglycerides (188 mg/dL) and high-sensitivity hs-CRP (3.4 mg/L).',
    text: `PATIENT: Sarah Jenkins | AGE: 52 | DOB: 1974-04-12 | FASTING: 12 Hours
COLLECTION: 2026-09-18 07:30 AM | SPECIMEN: Serum Venous Blood

TEST                              RESULT       REFERENCE       STATUS     UNITS
--------------------------------------------------------------------------------
Total Cholesterol                 242          < 200           HIGH       mg/dL
Triglycerides                     188          < 150           HIGH       mg/dL
HDL Cholesterol                   44           > 50            LOW        mg/dL
LDL Cholesterol (Calc)            160          < 100           HIGH       mg/dL
Non-HDL Cholesterol               198          < 130           HIGH       mg/dL
Cholesterol / HDL Ratio           5.5          < 4.5           HIGH       ratio
Apolipoprotein B (ApoB)           115          < 90            HIGH       mg/dL
hs-CRP (Cardio Inflammation)      3.4          < 1.0           HIGH       mg/L

CLINICAL IMPRESSION:
Atherogenic dyslipidemia characterized by elevated circulating ApoB particles, increased triglyceride-rich lipoproteins, and moderate systemic vascular inflammation (hs-CRP 3.4). Estimated 10-year ASCVD risk is moderately elevated. Recommend intensive lifestyle counseling, Mediterranean heart-healthy nutrition, and clinical review for lipid-lowering pharmacotherapy (e.g. HMG-CoA reductase inhibitor).`,
  },
  {
    id: 'sample_mri',
    name: 'Lumbar Spine MRI (Without Contrast)',
    category: 'radiology',
    patientName: 'Sarah Jenkins',
    description: 'Magnetic resonance imaging evaluating lower back pain and right leg radicular pain (sciatica).',
    text: `CLINICAL INDICATION: 52yo female with 6-month history of mechanical lumbar pain and radiating right lower extremity paresthesias in L5 distribution.
TECHNIQUE: Multiplanar multi-echo T1, T2, and STIR sagittal and axial sequences obtained on 3.0T MRI system.

FINDINGS:
L1-L2 & L2-L3: Vertebral body heights preserved. No focal disc herniation or canal stenosis.
L3-L4: Minimal facet arthropathy. Mild disc desiccation without impingement.
L4-L5: Disc height loss and moderate desiccation. Prominent 4.2mm focal broad-based posterior-right paracentral disc protrusion with an associated annular fissure. There is mild effacement of the anterior thecal sac and mild-to-moderate narrowing of the right neural foramen with abutment of the traversing right L5 nerve root.
L5-S1: Mild symmetric circumferential disc bulge; no nerve root compromise.

IMPRESSION:
1. L4-L5 disc protrusion with right neural foramen narrowing and right L5 nerve root abutment, correlating anatomically with right L5 radiculopathy / sciatica.
2. Multilevel lumbar spondylosis and degenerative disc disease without high-grade central spinal stenosis.`,
  },
  {
    id: 'sample_cmp',
    name: 'Comprehensive Metabolic Panel (CMP)',
    category: 'lab_test',
    patientName: 'Sarah Jenkins',
    description: 'Electrolyte balance, kidney clearance (eGFR, BUN, Creatinine), and liver function enzymes (ALT, AST, ALP).',
    text: `METABOLIC PANEL (COMPREHENSIVE) | FASTING: YES
TEST                          RESULT    REFERENCE RANGE     UNITS
-------------------------------------------------------------------
Sodium                        139       135 - 145           mmol/L
Potassium                     4.2       3.5 - 5.1           mmol/L
Chloride                      102       96 - 106            mmol/L
Carbon Dioxide (CO2)          26        22 - 29             mmol/L
Blood Urea Nitrogen (BUN)     18        7 - 20              mg/dL
Creatinine                    0.82      0.50 - 1.10         mg/dL
eGFR (CKD-EPI 2021)           > 90      > 60                mL/min/1.73m2
Glucose (Fasting)             92        70 - 99             mg/dL
Calcium                       9.4       8.6 - 10.2          mg/dL
Total Protein                 7.1       6.4 - 8.3           g/dL
Albumin                       4.4       3.5 - 5.0           g/dL
Total Bilirubin               0.6       0.2 - 1.2           mg/dL
Alkaline Phosphatase (ALP)    68        44 - 121            U/L
AST (SGOT)                    21        10 - 40             U/L
ALT (SGPT)                    19        7 - 56              U/L

IMPRESSION:
Unremarkable metabolic panel. Normal renal excretory capacity with eGFR > 90 mL/min. Preserved hepatic synthetic function and physiological electrolyte homeostasis.`,
  },
  {
    id: 'sample_pathology',
    name: 'Dermal Punch Biopsy Histopathology',
    category: 'pathology',
    patientName: 'Sarah Jenkins',
    description: 'Pathologist microscopic tissue evaluation of left upper back pigmented macule.',
    text: `PATHOLOGY REPORT: DERMATOPATHOLOGY CONSULTATION
SPECIMEN: 4mm punch biopsy, left mid-upper back cutaneous lesion.
GROSS DESCRIPTION: Specimen consists of a 4 x 4 x 3 mm ellipse of tan-brown skin with a central 3mm hyperpigmented macule.
MICROSCOPIC DESCRIPTION:
Sections demonstrate orthokeratosis overlying an intact epidermis. Within the basal layer and dermo-epidermal junction, there is a proliferation of melanocytes arranged in small, well-circumscribed nests. Melanocytes display monomorphic, uniform nuclei with absent cytological atypia. Mitotic figures are not identified (0 per mm2). No pagetoid spread into the upper spinous layers. The dermal papillae contain melanophages and sparse perivascular lymphocytic infiltration.
DIAGNOSIS:
SKIN, LEFT UPPER BACK (BIOPSY):
- COMPOUND MELANOCYTIC NEVUS, BENIGN.
- SURGICAL MARGINS COMPLETE AND CLEAR.
- NO EVIDENCE OF MELANOMA OR HIGH-GRADE DYSPLASIA.`,
  },
];

// Sample SVG diagnostic images as data URIs for instant preview and multimodal AI testing
export interface SampleDiagnosticImage {
  id: string;
  name: string;
  type: 'xray' | 'ecg' | 'dermatology' | 'lab_sheet';
  badge: string;
  description: string;
  dataUrl: string;
}

const CHEST_XRAY_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="500" viewBox="0 0 600 500">
  <rect width="600" height="500" fill="%230b1120"/>
  <defs>
    <radialGradient id="lungL" cx="35%" cy="45%" r="35%">
      <stop offset="0%" stop-color="%231e293b"/>
      <stop offset="60%" stop-color="%230f172a"/>
      <stop offset="100%" stop-color="%23020617"/>
    </radialGradient>
    <radialGradient id="lungR" cx="65%" cy="45%" r="35%">
      <stop offset="0%" stop-color="%231e293b"/>
      <stop offset="60%" stop-color="%230f172a"/>
      <stop offset="100%" stop-color="%23020617"/>
    </radialGradient>
  </defs>
  <!-- Ribs outline -->
  <path d="M 280,70 L 320,70 L 320,440 L 280,440 Z" fill="%23334155" opacity="0.6"/>
  <path d="M 120,120 Q 300,100 480,120 M 100,160 Q 300,140 500,160 M 90,210 Q 300,190 510,210 M 80,260 Q 300,240 520,260 M 80,310 Q 300,290 520,310 M 90,360 Q 300,340 510,360" stroke="%2364748b" stroke-width="8" stroke-linecap="round" fill="none" opacity="0.45"/>
  <!-- Clavicles -->
  <path d="M 140,110 Q 230,125 300,135 Q 370,125 460,110" stroke="%2394a3b8" stroke-width="12" fill="none" opacity="0.7"/>
  <!-- Lungs -->
  <ellipse cx="210" cy="240" rx="85" ry="130" fill="url(%23lungL)" opacity="0.9"/>
  <ellipse cx="390" cy="240" rx="85" ry="130" fill="url(%23lungR)" opacity="0.9"/>
  <!-- Cardiac Silhouette -->
  <path d="M 270,220 C 270,190 320,190 330,220 C 350,280 340,340 270,360 C 240,350 240,290 270,220 Z" fill="%23cbd5e1" opacity="0.6"/>
  <!-- Diaphragms -->
  <path d="M 100,380 Q 210,320 300,370 Q 390,320 500,380" stroke="%23e2e8f0" stroke-width="10" fill="none" opacity="0.7"/>
  <text x="30" y="40" fill="%2338bdf8" font-family="monospace" font-size="14" font-weight="bold">HEALGEN DIAGNOSTIC OBSERVER: CHEST PA VIEW</text>
  <text x="30" y="60" fill="%2394a3b8" font-family="sans-serif" font-size="12">Patient: S. Jenkins | 2026-09 | Bilateral lung fields aerated</text>
  <text x="30" y="475" fill="%23f59e0b" font-family="sans-serif" font-size="11">UNVERIFIED OBSERVATION: Requires Radiologist Review</text>
</svg>`;

const ECG_STRIP_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="260" viewBox="0 0 600 260">
  <rect width="600" height="260" fill="%23fff1f2"/>
  <!-- Grid lines -->
  <defs>
    <pattern id="ecgGrid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="%23fecdd3" stroke-width="0.8"/>
      <path d="M 100 0 L 0 0 0 100" fill="none" stroke="%23fda4af" stroke-width="1.5"/>
    </pattern>
  </defs>
  <rect width="600" height="260" fill="url(%23ecgGrid)"/>
  <!-- Lead II Waveform -->
  <path d="M 10,140 L 40,140 Q 50,130 60,140 L 75,140 L 80,145 L 88,60 L 98,165 L 105,140 L 125,140 Q 145,115 165,140 L 210,140 Q 220,130 230,140 L 245,140 L 250,145 L 258,60 L 268,165 L 275,140 L 295,140 Q 315,115 335,140 L 380,140 Q 390,130 400,140 L 415,140 L 420,145 L 428,60 L 438,165 L 445,140 L 465,140 Q 485,115 505,140 L 580,140" fill="none" stroke="%23e11d48" stroke-width="2.2" stroke-linecap="round"/>
  <text x="20" y="30" fill="%239f1239" font-family="monospace" font-size="14" font-weight="bold">LEAD II RHYTHM STRIP (25mm/s, 10mm/mV)</text>
  <text x="20" y="50" fill="%2364748b" font-family="sans-serif" font-size="12">HR: ~72 bpm | Regular Sinus Rhythm | Normal PR Interval (160ms)</text>
  <rect x="240" y="55" width="40" height="120" fill="none" stroke="%230284c7" stroke-width="1.5" stroke-dasharray="3,3"/>
  <text x="290" y="80" fill="%230369a1" font-family="sans-serif" font-size="11">QRS Complex (84ms)</text>
</svg>`;

const LAB_PAPER_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
  <rect width="600" height="400" fill="%23f8fafc"/>
  <rect x="20" y="20" width="560" height="360" rx="8" fill="%23ffffff" stroke="%23cbd5e1" stroke-width="1.5"/>
  <path d="M 20 80 L 580 80 M 20 140 L 580 140" stroke="%23e2e8f0" stroke-width="1"/>
  <text x="40" y="50" fill="%230f172a" font-family="sans-serif" font-size="16" font-weight="bold">METROPOLITAN CLINICAL LABORATORIES</text>
  <text x="40" y="70" fill="%2364748b" font-family="sans-serif" font-size="11">Automated Chemistry & Immunoassay Printout - Specimen ID: 8942-01</text>
  <text x="40" y="110" fill="%23475569" font-family="sans-serif" font-size="12">Patient: Sarah Jenkins | Ref Physician: Dr. Marcus Vance | Status: FINAL</text>
  
  <text x="40" y="170" fill="%23334155" font-family="monospace" font-size="13">GLUCOSE, FASTING      92 mg/dL         (70 - 99)       NORMAL</text>
  <text x="40" y="205" fill="%23dc2626" font-family="monospace" font-size="13" font-weight="bold">TOTAL CHOLESTEROL     242 mg/dL        (< 200)         [HIGH]  *</text>
  <text x="40" y="240" fill="%23dc2626" font-family="monospace" font-size="13" font-weight="bold">LDL CHOLESTEROL       160 mg/dL        (< 100)         [HIGH]  *</text>
  <text x="40" y="275" fill="%23d97706" font-family="monospace" font-size="13" font-weight="bold">TRIGLYCERIDES         188 mg/dL        (< 150)         [HIGH]  *</text>
  <text x="40" y="310" fill="%23334155" font-family="monospace" font-size="13">HDL CHOLESTEROL       44 mg/dL         (> 50)          LOW</text>
  <text x="40" y="345" fill="%23dc2626" font-family="monospace" font-size="13" font-weight="bold">hs-CRP INFLAMMATION   3.4 mg/L         (< 1.0)         [ELEVATED]</text>
</svg>`;

export const SAMPLE_DIAGNOSTIC_IMAGES: SampleDiagnosticImage[] = [
  {
    id: 'sample_img_xray',
    name: 'Chest Radiograph (PA View)',
    type: 'xray',
    badge: 'X-Ray Imaging',
    description: 'Posteroanterior chest radiograph demonstrating lung field aeration, cardiac silhouette, and costophrenic angles.',
    dataUrl: CHEST_XRAY_SVG,
  },
  {
    id: 'sample_img_ecg',
    name: '12-Lead Rhythm Strip (Lead II)',
    type: 'ecg',
    badge: 'Cardiology ECG',
    description: 'Lead II cardiac rhythm strip tracing depicting normal sinus rhythm with intact P-QRS-T intervals.',
    dataUrl: ECG_STRIP_SVG,
  },
  {
    id: 'sample_img_lab',
    name: 'Laboratory Chemistry Report Paper Scan',
    type: 'lab_sheet',
    badge: 'Document OCR',
    description: 'Laboratory printed requisition sheet showing flagged lipid values and metabolic parameters for OCR extraction.',
    dataUrl: LAB_PAPER_SVG,
  },
];
