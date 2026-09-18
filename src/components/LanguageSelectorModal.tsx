'use client';

import React from 'react';
import { useLanguage, LANGUAGE_OPTIONS } from '../context/LanguageContext';
import { usePatient } from '../context/PatientContext';
import { Globe, Check, Sparkles, ArrowRight, Stethoscope } from 'lucide-react';
import { SupportedLanguage } from '../types/clinical';

export const LanguageSelectorModal: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { setActiveStep } = usePatient();

  const handleSelectLanguage = (code: SupportedLanguage) => {
    setLanguage(code);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-slate-900 border border-teal-500/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Step Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-teal-400 uppercase tracking-widest">
                STEP 2 — Language Engine
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                MVP Tamil + English Fully Active
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">Select Patient Preferred Language</h2>
          </div>
        </div>

        <p className="text-sm text-slate-300 mb-8 leading-relaxed">
          ClinAssist translates voice commands, clinical question prompts, and case sheet summaries in real-time across regional Indic languages.
        </p>

        {/* Language Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LANGUAGE_OPTIONS.map(opt => {
            const isSelected = language === opt.code;
            return (
              <button
                key={opt.code}
                onClick={() => handleSelectLanguage(opt.code)}
                className={`p-5 rounded-2xl border text-left transition transform hover:-translate-y-1 relative ${
                  isSelected
                    ? 'bg-gradient-to-r from-teal-900/60 to-slate-900 border-teal-400 text-white shadow-xl shadow-teal-500/20 ring-2 ring-teal-400/50'
                    : 'bg-slate-800/80 border-slate-700 hover:border-teal-500/40 text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{opt.flag}</span>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-teal-400 text-slate-950 flex items-center justify-center font-bold">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <h4 className="font-bold text-base text-white">{opt.name}</h4>
                  <p className="text-xs text-slate-400 font-medium">{opt.nativeName}</p>
                </div>

                {opt.isMvpFull && (
                  <div className="mt-3 inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <Sparkles className="w-3 h-3 text-emerald-300" />
                    <span>MVP Fully Working</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Sample Translation Preview Banner */}
        <div className="mt-8 p-5 rounded-2xl bg-slate-950 border border-slate-800">
          <h4 className="text-xs font-semibold text-teal-400 uppercase tracking-wider mb-2">
            Active Translation Preview ({LANGUAGE_OPTIONS.find(l => l.code === language)?.name}):
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Chief Complaint Prompt:</span>
              <span className="font-semibold text-teal-200">{t('chiefComplaint')}</span>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px]">AI Follow-Up Prompt:</span>
              <span className="font-semibold text-cyan-200">{t('recordingActive')}</span>
            </div>
          </div>
        </div>

        {/* Next Step Action Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => setActiveStep(3)} // Proceed to Patient Registration
            className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 font-bold text-sm shadow-xl shadow-teal-500/30 transition"
          >
            <span>Proceed to Step 3 (Patient Registration)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
