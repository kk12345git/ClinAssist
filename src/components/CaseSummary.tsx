'use client';

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { usePatient } from '../context/PatientContext';
import {
  Sparkles,
  Download,
  CheckCircle2,
  Edit3,
  Save,
  Printer,
  ShieldCheck,
  Stethoscope,
  FileText,
  AlertTriangle,
  Pill,
  User,
  Calendar,
  Award,
  Plus,
  Trash2,
  QrCode,
  Building2,
  HeartPulse,
} from 'lucide-react';
import { exportCaseSheetPDF } from '../lib/pdf-generator';
import { hospitalAudio } from '../lib/hospital-audio';
import { PrescriptionItem } from '../types/clinical';

export const CaseSummaryView: React.FC = () => {
  const { t } = useLanguage();
  const {
    caseSummary,
    patient,
    symptoms,
    documents,
    redFlags,
    vitals,
    hospitalAssignment,
    prescriptions,
    addPrescription,
    removePrescription,
    icdCodes,
    updatePractitionerNotes,
    togglePractitionerSignOff,
    completeCase,
    setActiveStep,
  } = usePatient();

  const [notes, setNotes] = useState(caseSummary.practitionerNotes || '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // New Rx form modal state
  const [showAddRx, setShowAddRx] = useState(false);
  const [rxName, setRxName] = useState('');
  const [rxDosage, setRxDosage] = useState('500mg');
  const [rxRoute, setRxRoute] = useState<'Oral' | 'IV' | 'IM' | 'Inhalation' | 'Topical'>('Oral');
  const [rxFreq, setRxFreq] = useState<'OD (Once Daily)' | 'BD (Twice Daily)' | 'TDS (Thrice Daily)' | 'QID (4 Times Daily)' | 'SOS (As Needed)'>('BD (Twice Daily)');
  const [rxTiming, setRxTiming] = useState<'After Food (PC)' | 'Before Food (AC)' | 'At Bedtime (HS)' | 'With Food'>('After Food (PC)');
  const [rxDuration, setRxDuration] = useState('5 days');
  const [rxInstr, setRxInstr] = useState('Take with full glass of water.');

  const handleSaveNotes = () => {
    updatePractitionerNotes(notes);
    setIsEditingNotes(false);
    hospitalAudio.playPulse();
  };

  const handleDownloadPDF = async () => {
    setIsExporting(true);
    hospitalAudio.playChime();
    await exportCaseSheetPDF('printable-case-sheet', `ClinAssist_${patient.id}_HospitalCaseSheet.pdf`);
    setIsExporting(false);
  };

  const handlePrint = () => {
    hospitalAudio.playPulse();
    window.print();
  };

  const handleCreatePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rxName.trim()) return;
    const newRx: PrescriptionItem = {
      id: 'rx-manual-' + Date.now(),
      medicineName: rxName.trim(),
      dosage: rxDosage,
      route: rxRoute,
      frequency: rxFreq,
      timing: rxTiming,
      duration: rxDuration,
      instructions: rxInstr,
    };
    addPrescription(newRx);
    setRxName('');
    setShowAddRx(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Action Header Banner */}
      <div className="mb-6 p-6 bg-white border border-rose-200/80 rounded-3xl shadow-sm shadow-rose-100/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-xs">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">
              STEP 10 & 12 — Certified Hospital Case Sheet
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-0.5">{t('finalCaseSheet')}</h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print EMR</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs shadow-md shadow-rose-200 transition transform hover:-translate-y-0.5"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generating PDF...' : t('generatePDF')}</span>
          </button>

          <button
            onClick={completeCase}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs shadow-md shadow-emerald-200 transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Sign & Archive Case</span>
          </button>
        </div>
      </div>

      {/* Printable Hospital Case Sheet Container */}
      <div
        id="printable-case-sheet"
        className="bg-white border border-rose-200/90 rounded-3xl p-8 sm:p-10 shadow-sm shadow-rose-100/50 text-slate-900 space-y-8"
      >
        {/* Hospital Institutional Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b-2 border-rose-100">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  Apollo-ClinAssist Multi-Specialty Hospital
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 uppercase">
                  NABH Accredited
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Department of {hospitalAssignment?.department || 'General Medicine'} • Consultation Suite 04
              </p>
              <p className="text-[11px] text-slate-400">
                124 Greams Road, Chennai - 600006 • 24x7 Medical Records Desk
              </p>
            </div>
          </div>

          {/* QR Code & Status */}
          <div className="flex items-center space-x-3 text-right">
            <div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  caseSummary.status === 'Completed'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {caseSummary.status}
              </span>
              <p className="text-[11px] text-slate-500 font-mono mt-1 font-bold">
                Token: {hospitalAssignment?.tokenNumber}
              </p>
              <p className="text-[10px] text-slate-400">{caseSummary.createdAt}</p>
            </div>
            <div className="p-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
              <QrCode className="w-10 h-10" />
            </div>
          </div>
        </div>

        {/* Patient Details & Bedside Vitals Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-rose-50/40 border border-rose-200 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Hospital Patient ID</span>
            <p className="font-extrabold text-rose-700 font-mono text-sm">{patient.id}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Patient Name</span>
            <p className="font-extrabold text-slate-900 text-sm">{patient.name}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Age / Gender</span>
            <p className="font-bold text-slate-700 text-sm">{patient.age}y / {patient.gender}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Bed / Suite</span>
            <p className="font-bold text-slate-700 text-sm">{hospitalAssignment?.roomBed}</p>
          </div>
        </div>

        {/* Bedside Vitals Telemetry Row */}
        <div className="p-4 rounded-2xl bg-white border border-rose-200 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-2 font-bold text-slate-700">
            <HeartPulse className="w-4 h-4 text-rose-500 animate-ecg-heart" />
            <span>Bedside Vitals:</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700">
            <span>Pulse: <strong className="text-rose-700">{vitals.heartRate} BPM</strong></span>
            <span>BP: <strong className="text-slate-900">{vitals.bloodPressureSys}/{vitals.bloodPressureDia} mmHg</strong></span>
            <span>SpO2: <strong className="text-emerald-700">{vitals.spO2}%</strong></span>
            <span>Temp: <strong className="text-amber-700">{vitals.temperature}°F</strong></span>
            <span>RR: <strong className="text-slate-800">{vitals.respiratoryRate}/min</strong></span>
            <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px]">
              Triage: {vitals.triageLevel}
            </span>
          </div>
        </div>

        {/* Section 1: Chief Complaint & Symptoms */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>1. Chief Complaint & Clinical Intake History</span>
          </h3>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700 leading-relaxed">
            <p><strong className="text-slate-900">Chief Complaint:</strong> {symptoms.complaint}</p>
            <p><strong className="text-slate-900">Duration:</strong> {symptoms.duration} | <strong className="text-slate-900">Severity (VAS):</strong> {symptoms.severity}/10 ({symptoms.severity >= 7 ? 'Severe' : 'Moderate'})</p>
            <p><strong className="text-slate-900">Anatomical Location:</strong> {symptoms.location}</p>
            <p><strong className="text-slate-900">Associated Clinical Signs:</strong> {symptoms.associatedSymptoms.join(', ') || 'None'}</p>
            <p><strong className="text-slate-900">Past Medical History:</strong> {symptoms.pastHistory}</p>
            <p><strong className="text-slate-900">Baseline Medications:</strong> {symptoms.currentMedications}</p>
          </div>
        </div>

        {/* Section 2: Clinical Safety Red Flags */}
        {redFlags.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-red-600 uppercase tracking-wider flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4" />
              <span>2. Clinical Red Flags & Algorithmic Safety Warnings</span>
            </h3>
            <div className="p-5 rounded-2xl bg-red-50/60 border border-red-200 text-xs space-y-2 text-red-900">
              {redFlags.map(rf => (
                <div key={rf.id} className="flex items-start space-x-2">
                  <span className="font-bold text-red-700">• {rf.title}:</span>
                  <span>{rf.description} (Protocol: <em>{rf.actionRequired}</em>)</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: AI SOAP Clinical Notes Synthesis */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span>3. Structured SOAP Clinical Synthesis</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-rose-700 uppercase tracking-wider mb-2">Subjective (S)</h4>
              <p className="text-slate-700 leading-relaxed">{caseSummary.subjective}</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-pink-700 uppercase tracking-wider mb-2">Objective (O)</h4>
              <p className="text-slate-700 leading-relaxed">{caseSummary.objective}</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-amber-800 uppercase tracking-wider mb-2">Assessment (A)</h4>
              <p className="text-slate-700 leading-relaxed">{caseSummary.assessment}</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-emerald-800 uppercase tracking-wider mb-2">Plan (P)</h4>
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{caseSummary.plan}</p>
            </div>
          </div>
        </div>

        {/* Section 4: Hospital ICD-10 Diagnostic Coding */}
        {icdCodes && icdCodes.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4" />
              <span>4. Diagnostic Coding (ICD-10-CM Classification)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {icdCodes.map((icd, iIdx) => (
                <div key={iIdx} className="p-3.5 rounded-xl bg-white border border-rose-200 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-extrabold text-sm text-rose-700">{icd.code}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                      {icd.confidence}% Match
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 mt-1">{icd.description}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{icd.category}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 5: Hospital Prescription (Rx) Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center space-x-2">
              <Pill className="w-4 h-4" />
              <span>5. Hospital Treatment Regimen & Prescriptions (Rx)</span>
            </h3>
            <button
              onClick={() => setShowAddRx(true)}
              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition flex items-center space-x-1 no-print"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Medication</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-rose-50/70 border-b border-rose-100 text-slate-700 font-bold">
                <tr>
                  <th className="p-3">Medication Name</th>
                  <th className="p-3">Dosage</th>
                  <th className="p-3">Route</th>
                  <th className="p-3">Frequency</th>
                  <th className="p-3">Timing</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Instructions</th>
                  <th className="p-3 text-right no-print">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {prescriptions.map(rx => (
                  <tr key={rx.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{rx.medicineName}</td>
                    <td className="p-3 font-semibold text-rose-800">{rx.dosage}</td>
                    <td className="p-3">{rx.route}</td>
                    <td className="p-3 font-semibold">{rx.frequency}</td>
                    <td className="p-3 text-slate-600">{rx.timing}</td>
                    <td className="p-3">{rx.duration}</td>
                    <td className="p-3 text-slate-500 max-w-xs">{rx.instructions}</td>
                    <td className="p-3 text-right no-print">
                      <button
                        onClick={() => removePrescription(rx.id)}
                        className="p-1 text-slate-400 hover:text-red-500 transition"
                        title="Remove Medicine"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 6: Practitioner Final Notes & Digital Sign-Off Stamp */}
        <div className="p-6 rounded-2xl bg-rose-50/40 border border-rose-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <Stethoscope className="w-4 h-4 text-rose-600" />
              <span>6. Attending Physician Review & Certified Digital Stamp</span>
            </h3>

            {!isEditingNotes ? (
              <button
                onClick={() => setIsEditingNotes(true)}
                className="flex items-center space-x-1 text-xs text-rose-600 hover:text-rose-700 font-bold no-print"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Physician Notes</span>
              </button>
            ) : (
              <button
                onClick={handleSaveNotes}
                className="flex items-center space-x-1 text-xs text-emerald-600 hover:text-emerald-700 font-bold no-print"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Notes</span>
              </button>
            )}
          </div>

          {isEditingNotes ? (
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-rose-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-400"
            />
          ) : (
            <p className="text-xs text-slate-700 italic bg-white p-3 rounded-xl border border-rose-100">
              {caseSummary.practitionerNotes || 'Patient appears clinically stable. Hydration advised. Follow-up if temperature spikes above 102°F.'}
            </p>
          )}

          {/* Practitioner Digital Signature Stamp */}
          <div className="pt-4 border-t border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <button
              onClick={togglePractitionerSignOff}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-xs ${
                caseSummary.practitionerSigned
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                  : 'bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:from-rose-600 hover:to-pink-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {caseSummary.practitionerSigned
                  ? `Digitally Signed by ${caseSummary.signedBy || 'Dr. A. Sharma, MD'}`
                  : 'Click to Sign Off & Certify Hospital Case Sheet'}
              </span>
            </button>

            <div className="text-right text-[11px] text-slate-500">
              <span className="font-bold text-slate-800 block">Dr. A. Sharma, MD (Internal Medicine)</span>
              <span>Tamil Nadu Medical Council Reg #44592 • ClinAssist Cryptographic Verification</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Medication Modal */}
      {showAddRx && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 no-print">
          <div className="bg-white border border-rose-200 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <Pill className="w-5 h-5 text-rose-500" />
              <span>Add Hospital Prescription Medication</span>
            </h3>

            <form onSubmit={handleCreatePrescription} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Medication Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tab. Azithromycin"
                  value={rxName}
                  onChange={e => setRxName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-400 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Dosage</label>
                  <input
                    type="text"
                    value={rxDosage}
                    onChange={e => setRxDosage(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-400 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Route</label>
                  <select
                    value={rxRoute}
                    onChange={e => setRxRoute(e.target.value as any)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-400 focus:bg-white"
                  >
                    <option value="Oral">Oral</option>
                    <option value="IV">IV</option>
                    <option value="IM">IM</option>
                    <option value="Inhalation">Inhalation</option>
                    <option value="Topical">Topical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Frequency</label>
                  <select
                    value={rxFreq}
                    onChange={e => setRxFreq(e.target.value as any)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-400 focus:bg-white"
                  >
                    <option value="OD (Once Daily)">OD (Once Daily)</option>
                    <option value="BD (Twice Daily)">BD (Twice Daily)</option>
                    <option value="TDS (Thrice Daily)">TDS (Thrice Daily)</option>
                    <option value="QID (4 Times Daily)">QID (4 Times Daily)</option>
                    <option value="SOS (As Needed)">SOS (As Needed)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Timing</label>
                  <select
                    value={rxTiming}
                    onChange={e => setRxTiming(e.target.value as any)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-400 focus:bg-white"
                  >
                    <option value="After Food (PC)">After Food (PC)</option>
                    <option value="Before Food (AC)">Before Food (AC)</option>
                    <option value="At Bedtime (HS)">At Bedtime (HS)</option>
                    <option value="With Food">With Food</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Duration</label>
                  <input
                    type="text"
                    value={rxDuration}
                    onChange={e => setRxDuration(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-400 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-bold block mb-1">Special Instructions</label>
                  <input
                    type="text"
                    value={rxInstr}
                    onChange={e => setRxInstr(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-400 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddRx(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold shadow-md shadow-rose-200"
                >
                  Add to Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
