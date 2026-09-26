'use client';

import React from 'react';
import { useLanguage, LANGUAGE_OPTIONS } from '../context/LanguageContext';
import { usePatient } from '../context/PatientContext';
import { Globe, Check, Sparkles, ArrowRight, Volume2, ShieldCheck } from 'lucide-react';
import { SupportedLanguage } from '../types/clinical';
import { hospitalAudio } from '../lib/hospital-audio';

export const LanguageSelectorModal: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { setActiveStep } = usePatient();

  const handleSelectLanguage = (code: SupportedLanguage) => {
    setLanguage(code);
    hospitalAudio.playPulse();
  };

  const handleSpeakSample = (text: string, lang: string) => {
    hospitalAudio.speakText(text, lang);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white border border-rose-200/80 rounded-3xl p-8 shadow-sm shadow-rose-100/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-200/10 rounded-full blur-3xl pointer-events-none" />

        {/* Step Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">
                STEP 2 — Multilingual Voice & Clinical NLP Engine
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                Hospital Tele-Consult Ready
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mt-0.5">Select Patient Preferred Consultation Language</h2>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-8 leading-relaxed">
          ClinAssist bridges the doctor-patient dialect gap by translating spoken patient descriptions into standardized medical terms and bilingual case sheets.
        </p>

        {/* Language Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LANGUAGE_OPTIONS.map(opt => {
            const isSelected = language === opt.code;
            return (
              <div
                key={opt.code}
                onClick={() => handleSelectLanguage(opt.code)}
                className={`p-5 rounded-2xl border text-left transition transform hover:-translate-y-0.5 cursor-pointer relative ${
                  isSelected
                    ? 'bg-rose-50/60 border-rose-400 text-slate-900 shadow-md shadow-rose-100 ring-2 ring-rose-200'
                    : 'bg-white border-slate-200 hover:border-rose-300 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{opt.flag}</span>
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-mono uppercase">{opt.code}</span>
                  )}
                </div>

                <div className="mt-4">
                  <h4 className="font-bold text-base text-slate-900">{opt.name}</h4>
                  <p className="text-xs text-slate-500 font-medium">{opt.nativeName}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-rose-100/60 flex items-center justify-between">
                  {opt.isMvpFull ? (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                      <Sparkles className="w-3 h-3 text-emerald-500" />
                      <span>Full Speech & Text</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">Available</span>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const demo =
                        opt.code === 'ta'
                          ? 'வணக்கம், உங்கள் அறிகுறிகளை விவரிக்கவும்.'
                          : opt.code === 'th'
                          ? 'Vanakkam, unga symptoms sollunga.'
                          : 'Welcome to ClinAssist medical intake.';
                      handleSpeakSample(demo, opt.code);
                    }}
                    className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                    title="Play Audio Sample"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Translation Preview Panel */}
        <div className="mt-8 p-5 rounded-2xl bg-rose-50/40 border border-rose-200/80">
          <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Active Translation Preview ({LANGUAGE_OPTIONS.find(l => l.code === language)?.name}):</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
            <div className="p-3 bg-white rounded-xl border border-rose-100 shadow-2xs">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Chief Complaint Prompt</span>
              <span className="font-semibold text-rose-900">{t('chiefComplaint')}</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-rose-100 shadow-2xs">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Voice Assistant Status</span>
              <span className="font-semibold text-slate-900">{t('recordingActive')}</span>
            </div>
          </div>
        </div>

        {/* Next Step Action Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => setActiveStep(3)} // Proceed to Patient Registration
            className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-sm shadow-md shadow-rose-200 transition transform hover:-translate-y-0.5"
          >
            <span>Proceed to Step 3 (Patient Registration)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
