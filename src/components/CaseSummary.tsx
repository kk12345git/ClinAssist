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
} from 'lucide-react';
import { exportCaseSheetPDF } from '../lib/pdf-generator';

export const CaseSummaryView: React.FC = () => {
  const { t } = useLanguage();
  const {
    caseSummary,
    patient,
    symptoms,
    documents,
    redFlags,
    updatePractitionerNotes,
    togglePractitionerSignOff,
    completeCase,
    setActiveStep,
  } = usePatient();

  const [notes, setNotes] = useState(caseSummary.practitionerNotes || '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleSaveNotes = () => {
    updatePractitionerNotes(notes);
    setIsEditingNotes(false);
  };

  const handleDownloadPDF = async () => {
    setIsExporting(true);
    await exportCaseSheetPDF('printable-case-sheet', `ClinAssist_${patient.id}_CaseSheet.pdf`);
    setIsExporting(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Action Header */}
      <div className="mb-6 p-6 bg-slate-900 border border-teal-500/30 rounded-3xl shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-400 to-cyan-400 flex items-center justify-center text-slate-950 font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-teal-400 uppercase tracking-widest">
              STEP 10 & 12 — Final Case Sheet Synthesis
            </span>
            <h2 className="text-2xl font-bold text-white mt-0.5">{t('finalCaseSheet')}</h2>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/30 transition transform hover:-translate-y-0.5"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generating PDF...' : t('generatePDF')}</span>
          </button>

          <button
            onClick={completeCase}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/30 transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Finalize & Close Case</span>
          </button>
        </div>
      </div>

      {/* Printable Case Sheet Container */}
      <div
        id="printable-case-sheet"
        className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-slate-100 space-y-8"
      >
        {/* Case Sheet Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight">ClinAssist Clinical Case Sheet</h1>
              <p className="text-xs text-slate-400">AI Intake & Practitioner Certified Record</p>
            </div>
          </div>

          <div className="text-right">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-teal-500/20 text-teal-300 border border-teal-500/40">
              {caseSummary.status}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">{caseSummary.createdAt}</p>
          </div>
        </div>

        {/* Patient Details Grid */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase">Patient ID</span>
            <p className="font-bold text-teal-300 font-mono text-sm">{patient.id}</p>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase">Patient Name</span>
            <p className="font-bold text-white text-sm">{patient.name}</p>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase">Age / Gender</span>
            <p className="font-bold text-slate-200 text-sm">{patient.age}y / {patient.gender}</p>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase">Preferred Language</span>
            <p className="font-bold text-cyan-300 text-sm">{patient.preferredLanguage.toUpperCase()}</p>
          </div>
        </div>

        {/* Section 1: Chief Complaint & Symptoms */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>1. Chief Complaint & Extracted Symptoms</span>
          </h3>
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <p><strong className="text-slate-400">Chief Complaint:</strong> {symptoms.complaint}</p>
            <p><strong className="text-slate-400">Duration:</strong> {symptoms.duration} | <strong className="text-slate-400">Severity:</strong> {symptoms.severity}/10</p>
            <p><strong className="text-slate-400">Location:</strong> {symptoms.location}</p>
            <p><strong className="text-slate-400">Associated Symptoms:</strong> {symptoms.associatedSymptoms.join(', ') || 'None'}</p>
            <p><strong className="text-slate-400">Past History:</strong> {symptoms.pastHistory}</p>
            <p><strong className="text-slate-400">Current Medications:</strong> {symptoms.currentMedications}</p>
          </div>
        </div>

        {/* Section 2: Red-Flag Clinical Review */}
        {redFlags.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4" />
              <span>2. Clinical Red Flags & Safety Warnings</span>
            </h3>
            <div className="p-5 rounded-2xl bg-red-950/30 border border-red-500/40 text-xs space-y-2 text-red-200">
              {redFlags.map(rf => (
                <div key={rf.id} className="flex items-start space-x-2">
                  <span className="font-bold text-red-400">• {rf.title}:</span>
                  <span>{rf.description} (Action: {rf.actionRequired})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: AI SOAP Clinical Notes Synthesis */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-2">
            <Sparkles className="w-4 h-4" />
            <span>3. Structured SOAP Clinical Synthesis</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <h4 className="font-bold text-teal-300 uppercase tracking-wider mb-2">Subjective (S)</h4>
              <p className="text-slate-300 leading-relaxed">{caseSummary.subjective}</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <h4 className="font-bold text-cyan-300 uppercase tracking-wider mb-2">Objective (O)</h4>
              <p className="text-slate-300 leading-relaxed">{caseSummary.objective}</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <h4 className="font-bold text-amber-300 uppercase tracking-wider mb-2">Assessment (A)</h4>
              <p className="text-slate-300 leading-relaxed">{caseSummary.assessment}</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <h4 className="font-bold text-emerald-300 uppercase tracking-wider mb-2">Plan (P)</h4>
              <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{caseSummary.plan}</p>
            </div>
          </div>
        </div>

        {/* Section 4: Practitioner Review & Editable Notes */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-teal-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Stethoscope className="w-4 h-4 text-teal-400" />
              <span>4. Practitioner Final Notes & Sign-Off</span>
            </h3>

            {!isEditingNotes ? (
              <button
                onClick={() => setIsEditingNotes(true)}
                className="flex items-center space-x-1 text-xs text-teal-400 hover:text-teal-300 font-semibold"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Notes</span>
              </button>
            ) : (
              <button
                onClick={handleSaveNotes}
                className="flex items-center space-x-1 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
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
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-400"
            />
          ) : (
            <p className="text-xs text-slate-300 italic">{caseSummary.practitionerNotes || 'No additional practitioner notes recorded.'}</p>
          )}

          {/* Practitioner Sign-Off Toggle */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={togglePractitionerSignOff}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                caseSummary.practitionerSigned
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {caseSummary.practitionerSigned
                  ? `Signed by ${caseSummary.signedBy || 'Dr. A. Sharma, MD'}`
                  : 'Click to Sign Off Case Sheet'}
              </span>
            </button>

            <span className="text-[10px] text-slate-500">ClinAssist Medical Engine Verification Stamp</span>
          </div>
        </div>
      </div>
    </div>
  );
};
