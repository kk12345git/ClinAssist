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
} from 'lucide-react';

export const ClinicalReview: React.FC = () => {
  const { t } = useLanguage();
  const { redFlags, symptoms, setActiveStep } = usePatient();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Step Header */}
      <div className="mb-6 p-6 bg-slate-900 border border-red-500/40 rounded-3xl shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-semibold text-red-400 uppercase tracking-widest">
              STEP 9 — Safety & Triage Engine
            </span>
            <h2 className="text-2xl font-bold text-white mt-0.5">{t('clinicalReview')}</h2>
          </div>
        </div>

        <button
          onClick={() => setActiveStep(10)} // Step 10 AI Case Summary
          className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 transition"
        >
          <span>Step 10: AI Case Summary</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Critical Disclaimer Card (Requirement: "Diagnosis automatically declare panna maatom") */}
      <div className="mb-8 p-6 rounded-3xl bg-amber-950/60 border border-amber-500/50 shadow-2xl relative overflow-hidden">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-amber-200 uppercase tracking-wider flex items-center space-x-2">
              <span>{t('redFlagsNotice')}</span>
            </h3>
            <p className="mt-2 text-xs text-amber-100/90 leading-relaxed font-medium">
              ⚠️ <strong className="text-white">{t('noAutoDiagnosis')}</strong> ClinAssist provides triage risk indicators and clinical flags to support practitioners. Final diagnostic confirmation, prescription issuing, and treatment planning are reserved exclusively for the licensed medical practitioner.
            </p>
          </div>
        </div>
      </div>

      {/* Active Red Flags Indicators */}
      <div className="space-y-6">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
          Predefined Clinical Indicators ({redFlags.length} Active Flags)
        </h3>

        {redFlags.map(rf => (
          <div
            key={rf.id}
            className={`p-6 rounded-3xl border shadow-xl space-y-4 ${
              rf.severity === 'critical'
                ? 'bg-red-950/40 border-red-500/60 text-red-100'
                : rf.severity === 'high'
                ? 'bg-amber-950/40 border-amber-500/60 text-amber-100'
                : 'bg-slate-900 border-slate-800 text-slate-200'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-red-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-red-300">
                  {rf.category}
                </span>
              </div>

              <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-red-500/20 text-red-300 border border-red-500/40">
                {rf.severity.toUpperCase()} RED FLAG
              </span>
            </div>

            <h4 className="text-lg font-bold text-white">{rf.title}</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{rf.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Trigger Rule</span>
                <span className="font-semibold text-amber-300">{rf.triggerCondition}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Recommended Action</span>
                <span className="font-semibold text-emerald-300">{rf.actionRequired}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
