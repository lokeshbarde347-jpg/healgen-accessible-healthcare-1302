import React, { useState } from 'react';
import {
  Calendar,
  CheckSquare,
  Printer,
  Download,
  AlertCircle,
  HelpCircle,
  FileText,
  User,
  Pill,
  Sparkles,
  Plus,
} from 'lucide-react';
import { MedicalReportAnalysis, UserProfile } from '../types/medical.ts';
import { exportReportToPDF } from '../utils/exportUtils.ts';

interface DoctorVisitPrepProps {
  reports: MedicalReportAnalysis[];
  currentUser: UserProfile;
}

export const DoctorVisitPrep: React.FC<DoctorVisitPrepProps> = ({ reports, currentUser }) => {
  const [appointmentDate, setAppointmentDate] = useState('2026-10-15');
  const [physicianName, setPhysicianName] = useState('Dr. Marcus Vance, MD');
  const [chiefConcern, setChiefConcern] = useState(
    'Review elevated LDL cholesterol and hs-CRP inflammation; discuss physical therapy progress for right leg sciatica.'
  );

  const [currentMedications, setCurrentMedications] = useState([
    { name: 'Multivitamin', dose: '1 tab daily', purpose: 'General nutrition' },
    { name: 'Omega-3 Fish Oil', dose: '1000 mg daily', purpose: 'Cardiovascular support' },
    { name: 'Ibuprofen', dose: '200 mg as needed', purpose: 'Mild lower back relief' },
  ]);

  const [newMed, setNewMed] = useState({ name: '', dose: '', purpose: '' });

  // Gather all high-priority questions from reports
  const aggregatedQuestions = reports.flatMap((r) => r.doctorQuestions || []);

  const handleAddMedication = () => {
    if (!newMed.name) return;
    setCurrentMedications([...currentMedications, newMed]);
    setNewMed({ name: '', dose: '', purpose: '' });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-700 to-cyan-800 rounded-2xl p-6 text-white shadow-md flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold tracking-wider uppercase">
              Slide 4 Feature: Patient-Doctor Communication
            </span>
          </div>
          <h1 className="text-xl font-bold">Doctor Visit Readiness Cheat Sheet</h1>
          <p className="text-xs text-teal-100 max-w-xl mt-1">
            Transform confusing clinical data into a concise 1-page agenda so you make the most of your 15-minute consultation.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-white text-teal-800 hover:bg-teal-50 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print Agenda</span>
        </button>
      </div>

      {/* Printable Sheet Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6 print:border-none print:shadow-none">
        {/* Visit Details Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-slate-100 pb-5">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Patient</label>
            <div className="text-sm font-semibold text-slate-900">{currentUser.name}</div>
            <div className="text-xs text-slate-500">ID: {currentUser.id}</div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Consulting Physician</label>
            <input
              type="text"
              value={physicianName}
              onChange={(e) => setPhysicianName(e.target.value)}
              className="text-xs font-semibold px-2.5 py-1.5 border border-slate-200 rounded-lg w-full"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Appointment Date</label>
            <input
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg w-full"
            />
          </div>
        </div>

        {/* Primary Goal / Chief Complaint */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-teal-600" />
            Primary Purpose for Today's Visit:
          </label>
          <textarea
            rows={2}
            value={chiefConcern}
            onChange={(e) => setChiefConcern(e.target.value)}
            className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
          />
        </div>

        {/* Recent Abnormal Test Highlights */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Flagged Results to Review from Recent Reports:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {reports
              .flatMap((r) => r.biomarkers.filter((b) => b.status === 'high' || b.status === 'low'))
              .slice(0, 4)
              .map((bm, i) => (
                <div key={i} className="p-3 bg-red-50/50 border border-red-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-red-950">{bm.name}</span>
                    <p className="text-[11px] text-red-700 font-mono mt-0.5">
                      Result: <strong>{bm.value}</strong> (Target: {bm.referenceRange})
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 uppercase">
                    {bm.status}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Prioritized Doctor Questions */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4 text-teal-600" />
            Top Questions to Ask Your Doctor ({aggregatedQuestions.length}):
          </h3>
          <div className="space-y-2">
            {aggregatedQuestions.slice(0, 5).map((q, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                <input type="checkbox" className="mt-1 w-4 h-4 rounded text-teal-600 focus:ring-teal-500 cursor-pointer" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-900">{q.question}</p>
                  <p className="text-[11px] text-slate-500 italic mt-0.5">Clinical reason: {q.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Medications & Supplements */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Pill className="w-4 h-4 text-teal-600" />
              Current Medications & Supplements:
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {currentMedications.map((med, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-0.5">
                <div className="font-bold text-slate-900">{med.name}</div>
                <div className="text-[11px] text-teal-700 font-semibold">{med.dose}</div>
                <div className="text-[10px] text-slate-500">{med.purpose}</div>
              </div>
            ))}
          </div>

          {/* Add Medication mini form */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              placeholder="Name (e.g. Vitamin D3)"
              value={newMed.name}
              onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
              className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
            />
            <input
              type="text"
              placeholder="Dose (e.g. 2000 IU)"
              value={newMed.dose}
              onChange={(e) => setNewMed({ ...newMed, dose: e.target.value })}
              className="w-28 px-3 py-1.5 text-xs border border-slate-200 rounded-lg"
            />
            <button
              onClick={handleAddMedication}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Blank Notes Section for the Visit */}
        <div className="p-4 bg-slate-50/60 border border-dashed border-slate-300 rounded-xl space-y-2">
          <div className="text-xs font-bold text-slate-700">Doctor's Answers & Action Plan (Notes During Visit):</div>
          <div className="h-16 border-b border-slate-200 border-dotted"></div>
        </div>

        {/* Safety Disclaimer */}
        <div className="text-[11px] text-slate-400 text-center pt-2">
          HealGen assists patient-physician partnership. Doctors remain solely responsible for diagnosis and treatment plans.
        </div>
      </div>
    </div>
  );
};
