import { jsPDF } from 'jspdf';
import { MedicalReportAnalysis } from '../types/medical.ts';

export function downloadCSV(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportReportToCSV(report: MedicalReportAnalysis) {
  const lines: string[] = [];

  // Metadata
  lines.push(`"HEALGEN ACCESSIBLE HEALTHCARE & DIAGNOSTICS - REPORT EXPORT"`);
  lines.push(`"Report Title","${report.title.replace(/"/g, '""')}"`);
  lines.push(`"Patient Name","${report.patientName.replace(/"/g, '""')}"`);
  lines.push(`"Date","${report.reportDate}"`);
  lines.push(`"Category","${report.category}"`);
  lines.push(`"Original Reading Grade","${report.readingGradeOriginal}"`);
  lines.push(`"Simplified Reading Grade","${report.readingGradeSimplified}"`);
  lines.push(`"Uncertainty Confidence","${report.uncertaintyScore}%"`);
  lines.push(`"Clinician Verified","${report.clinicianVerified ? 'Yes' : 'No'}"`);
  lines.push('');

  // Plain Language Summary
  lines.push(`"PLAIN-LANGUAGE SUMMARY"`);
  lines.push(`"${report.plainLanguageSummary.replace(/"/g, '""').replace(/\n/g, ' ')}"`);
  lines.push('');

  // Biomarkers Table
  lines.push(`"BIOMARKERS & LAB VALUES"`);
  lines.push(`"Test / Biomarker","Value","Reference Range","Status","Plain Language Explanation"`);
  report.biomarkers.forEach((bm) => {
    lines.push(
      `"${bm.name.replace(/"/g, '""')}","${bm.value.replace(/"/g, '""')}","${bm.referenceRange.replace(/"/g, '""')}","${bm.status.toUpperCase()}","${bm.explanation.replace(/"/g, '""')}"`
    );
  });
  lines.push('');

  // Prepared Doctor Questions
  lines.push(`"QUESTIONS PREPARED FOR DOCTOR"`);
  lines.push(`"Priority","Question","Clinical Purpose"`);
  report.doctorQuestions.forEach((q) => {
    lines.push(`"${q.priority.toUpperCase()}","${q.question.replace(/"/g, '""')}","${q.reason.replace(/"/g, '""')}"`);
  });
  lines.push('');

  // Jargon Glossary
  lines.push(`"MEDICAL JARGON BUSTED"`);
  lines.push(`"Medical Term","Everyday Meaning","Full Explanation"`);
  report.jargonGlossary.forEach((j) => {
    lines.push(`"${j.term.replace(/"/g, '""')}","${j.simplified.replace(/"/g, '""')}","${j.definition.replace(/"/g, '""')}"`);
  });
  lines.push('');

  lines.push(`"DISCLAIMER","${report.clinicalDisclaimer.replace(/"/g, '""')}"`);

  downloadCSV(`healgen_${report.id || 'report'}.csv`, lines.join('\n'));
}

export function exportReportToPDF(report: MedicalReportAnalysis) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  let y = margin;

  // Header Banner
  doc.setFillColor(13, 148, 136); // Teal 600
  doc.rect(0, 0, pageWidth, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('HEALGEN', margin, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('ACCESSIBLE HEALTHCARE & DIAGNOSTICS | RESPONSIBLE AI', margin, 18);

  doc.setFontSize(8);
  doc.text('PATIENT-CENTRED TRANSLATION', pageWidth - margin - 50, 15);

  y = 32;

  // Title & Metadata
  doc.setTextColor(15, 23, 42); // Slate 900
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(report.title, margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Patient: ${report.patientName}  |  Date: ${report.reportDate}  |  Category: ${report.category.toUpperCase()}  |  AI Confidence: ${report.uncertaintyScore}%`,
    margin,
    y
  );
  y += 7;

  // Reading Grade Impact Strip
  doc.setFillColor(240, 253, 250); // Teal 50
  doc.setDrawColor(204, 251, 241); // Teal 200
  doc.roundedRect(margin, y, pageWidth - margin * 2, 10, 2, 2, 'FD');

  doc.setTextColor(15, 118, 110);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  const gradeText = `Comprehension Impact: Raw Report Grade ${report.readingGradeOriginal} (Collegiate) -> Simplified Grade ${report.readingGradeSimplified} (Everyday Language)`;
  doc.text(gradeText, margin + 4, y + 6.5);
  y += 15;

  // Plain-Language Summary Box
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Plain-Language Summary for Patient & Family', margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  const summaryLines = doc.splitTextToSize(report.plainLanguageSummary, pageWidth - margin * 2);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 4.4 + 6;

  // Biomarkers Table
  if (report.biomarkers.length > 0) {
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Key Biomarkers & Clinical Measurements', margin, y);
    y += 5;

    // Table Header
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y, pageWidth - margin * 2, 7, 'F');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text('TEST / BIOMARKER', margin + 3, y + 5);
    doc.text('VALUE', margin + 55, y + 5);
    doc.text('REFERENCE', margin + 85, y + 5);
    doc.text('STATUS', margin + 115, y + 5);
    doc.text('EXPLANATION', margin + 135, y + 5);
    y += 8;

    // Table Rows
    report.biomarkers.forEach((bm) => {
      if (y > pageHeight - 35) {
        doc.addPage();
        y = margin;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text(bm.name, margin + 3, y + 4);

      doc.setFont('helvetica', 'normal');
      doc.text(bm.value, margin + 55, y + 4);
      doc.text(bm.referenceRange, margin + 85, y + 4);

      // Status pill color
      if (bm.status === 'high' || bm.status === 'critical') {
        doc.setTextColor(220, 38, 38);
        doc.text('ELEVATED', margin + 115, y + 4);
      } else if (bm.status === 'low') {
        doc.setTextColor(217, 119, 6);
        doc.text('LOW', margin + 115, y + 4);
      } else {
        doc.setTextColor(13, 148, 136);
        doc.text('NORMAL', margin + 115, y + 4);
      }

      doc.setTextColor(71, 85, 105);
      const explLines = doc.splitTextToSize(bm.explanation, pageWidth - margin - (margin + 135));
      doc.text(explLines[0] || '', margin + 135, y + 4);

      y += 7;
    });
    y += 4;
  }

  // Doctor Questions Section
  if (report.doctorQuestions.length > 0) {
    if (y > pageHeight - 45) {
      doc.addPage();
      y = margin;
    }

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Questions Prepared for Your Next Doctor Visit', margin, y);
    y += 5;

    report.doctorQuestions.forEach((dq, idx) => {
      if (y > pageHeight - 25) {
        doc.addPage();
        y = margin;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(13, 148, 136);
      doc.text(`[ ] ${idx + 1}.`, margin + 2, y + 4);

      doc.setTextColor(30, 41, 59);
      const qLines = doc.splitTextToSize(dq.question, pageWidth - margin * 2 - 14);
      doc.text(qLines, margin + 10, y + 4);
      y += qLines.length * 4 + 1;

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`Why ask: ${dq.reason}`, margin + 10, y + 3);
      y += 6;
    });
  }

  // Footer Disclaimer
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, pageHeight - 16, pageWidth - margin, pageHeight - 16);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'HEALGEN RESPONSIBLE AI NOTICE: Assists patient understanding and decision-making; not medical diagnosis. Doctors remain responsible for clinical care.',
    margin,
    pageHeight - 10
  );

  doc.save(`healgen_${report.id || 'report'}.pdf`);
}
