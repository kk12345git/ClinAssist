'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { usePatient } from '../context/PatientContext';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  Info,
  Stethoscope,
  Activity,
  HeartPulse,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';
import { hospitalAudio } from '../lib/hospital-audio';

export const ClinicalReview: React.FC = () => {
  const { t } = useLanguage();
  const { redFlags, symptoms, setActiveStep, vitals } = usePatient();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Step Header */}
      <div className="mb-6 p-6 bg-white border border-rose-200/80 rounded-3xl shadow-sm shadow-rose-100/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">
              STEP 9 — Hospital Clinical Safety & Triage CDS
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-0.5">{t('clinicalReview')}</h2>
          </div>
        </div>

        <button
          onClick={() => {
            hospitalAudio.playPulse();
            setActiveStep(10); // Step 10 AI Case Summary
          }}
          className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs shadow-md shadow-rose-200 transition transform hover:-translate-y-0.5"
        >
          <span>Step 10: SOAP Synthesis & ICD-10</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Critical Medical Legal Disclaimer Banner */}
      <div className="mb-8 p-6 rounded-3xl bg-amber-50/80 border border-amber-200 shadow-2xs relative overflow-hidden">
        <div className="flex items-start space-x-4">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
            <Info className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-amber-900 uppercase tracking-wider flex items-center space-x-2">
              <span>{t('redFlagsNotice')}</span>
            </h3>
            <p className="mt-1.5 text-xs text-amber-900/90 leading-relaxed font-medium">
              ⚠️ <strong className="text-amber-950 font-bold">{t('noAutoDiagnosis')}</strong> ClinAssist generates clinical risk indicators and algorithmic triage suggestions to support hospital doctors. Diagnostic confirmation, prescription authoring, and therapeutic execution remain the sole legal responsibility of the licensed medical practitioner.
            </p>
          </div>
        </div>
      </div>

      {/* Active Red Flags Indicators */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Evidence-Based Clinical Flags ({redFlags.length} Active Protocol Alerts)
          </h3>
          <span className="text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            Triage Level: {vitals.triageLevel}
          </span>
        </div>

        {redFlags.map(rf => (
          <div
            key={rf.id}
            className={`p-6 rounded-3xl border shadow-xs space-y-4 ${
              rf.severity === 'critical'
                ? 'bg-red-50/50 border-red-300 text-slate-900'
                : rf.severity === 'high'
                ? 'bg-rose-50/50 border-rose-300 text-slate-900'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-rose-800">
                  {rf.category}
                </span>
              </div>

              <span
                className={`px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${
                  rf.severity === 'critical'
                    ? 'bg-red-100 text-red-800 border border-red-300'
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}
              >
                {rf.severity.toUpperCase()} ALERT
              </span>
            </div>

            <h4 className="text-lg font-bold text-slate-900">{rf.title}</h4>
            <p className="text-xs text-slate-700 leading-relaxed">{rf.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
              <div className="p-4 rounded-2xl bg-white border border-rose-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Algorithmic Trigger Condition</span>
                <span className="font-semibold text-rose-900">{rf.triggerCondition}</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-rose-100 shadow-2xs">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Recommended Hospital Action</span>
                <span className="font-semibold text-emerald-800">{rf.actionRequired}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
