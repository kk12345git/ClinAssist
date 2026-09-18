'use client';

import React, { useState } from 'react';
import { useLanguage, LANGUAGE_OPTIONS } from '../context/LanguageContext';
import { usePatient } from '../context/PatientContext';
import {
  Stethoscope,
  Globe,
  User,
  ChevronDown,
  Activity,
  CheckCircle2,
  ShieldAlert,
  Sliders,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { SupportedLanguage } from '../types/clinical';

export const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { activeStep, setActiveStep, patient, caseSummary } = usePatient();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isStepOpen, setIsStepOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const steps = [
    { num: 1, name: t('step1Name') },
    { num: 2, name: t('step2Name') },
    { num: 3, name: t('step3Name') },
    { num: 4, name: t('step4Name') },
    { num: 5, name: t('step5Name') },
    { num: 6, name: t('step6Name') },
    { num: 7, name: t('step7Name') },
    { num: 8, name: t('step8Name') },
    { num: 9, name: t('step9Name') },
    { num: 10, name: t('step10Name') },
    { num: 11, name: t('step11Name') },
    { num: 12, name: t('step12Name') },
  ];

  const currentLangObj = LANGUAGE_OPTIONS.find(l => l.code === language) || LANGUAGE_OPTIONS[0];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-teal-500/20 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveStep(1)}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 via-cyan-500 to-emerald-400 p-0.5 shadow-md shadow-teal-500/30 flex items-center justify-center animate-pulse">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-teal-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-300 via-cyan-200 to-white">
                  ClinAssist
                </span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  MVP Clinical AI
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden md:block">Clinical Intake & Decision Support</p>
            </div>
          </div>

          {/* Center: Step Selector Dropdown & Pills */}
          <div className="hidden lg:flex items-center space-x-1">
            <div className="relative">
              <button
                onClick={() => setIsStepOpen(!isStepOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-teal-200 border border-slate-700 transition"
              >
                <Sliders className="w-3.5 h-3.5 text-teal-400" />
                <span>Step {activeStep}: {steps.find(s => s.num === activeStep)?.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isStepOpen && (
                <div className="absolute left-0 mt-2 w-64 rounded-xl bg-slate-900 border border-teal-500/30 shadow-2xl py-2 z-50 max-h-80 overflow-y-auto">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Jump to Workflow Step
                  </div>
                  {steps.map(s => (
                    <button
                      key={s.num}
                      onClick={() => {
                        setActiveStep(s.num);
                        setIsStepOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-teal-500/10 transition ${
                        activeStep === s.num ? 'bg-teal-500/20 text-teal-300 font-semibold border-l-2 border-teal-400' : 'text-slate-300'
                      }`}
                    >
                      <span>{s.name}</span>
                      {activeStep === s.num && <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Actions: Active Patient, Language, Login */}
          <div className="flex items-center space-x-3">
            {/* Active Patient Indicator */}
            {patient && (
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-semibold text-cyan-200">{patient.name}</span>
                <span className="text-slate-500">({patient.id})</span>
              </div>
            )}

            {/* Language Selector Pill */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-teal-950/60 hover:bg-teal-900/60 text-xs font-medium text-teal-200 border border-teal-500/30 transition shadow-sm"
              >
                <Globe className="w-3.5 h-3.5 text-teal-400" />
                <span className="mr-1">{currentLangObj.flag}</span>
                <span>{currentLangObj.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-teal-400/80" />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-teal-500/30 shadow-2xl py-2 z-50">
                  <div className="px-3 py-1 text-[11px] font-semibold text-teal-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Select Language</span>
                    <Sparkles className="w-3 h-3 text-teal-300" />
                  </div>
                  {LANGUAGE_OPTIONS.map(opt => (
                    <button
                      key={opt.code}
                      onClick={() => {
                        setLanguage(opt.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-teal-500/10 transition ${
                        language === opt.code ? 'bg-teal-500/20 text-teal-300 font-semibold' : 'text-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{opt.flag}</span>
                        <div>
                          <p>{opt.name}</p>
                          <p className="text-[10px] text-slate-400">{opt.nativeName}</p>
                        </div>
                      </div>
                      {opt.isMvpFull && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          MVP Ready
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Practitioner Login Button */}
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-xs font-semibold text-white shadow-md shadow-teal-500/20 transition"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('practitionerLogin')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Practitioner Login Demo Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-teal-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Stethoscope className="w-5 h-5 text-teal-400" />
              <span>Practitioner Portal Login</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              ClinAssist Secure Medical Portal for Doctors & Clinical Staff
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-medium">Medical Registration ID / Email</label>
                <input
                  type="text"
                  defaultValue="dr.sharma@clinassist.med"
                  className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-teal-400"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 font-medium">Password</label>
                <input
                  type="password"
                  defaultValue="••••••••••••"
                  className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-teal-400"
                />
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => {
                  setIsLoginModalOpen(false);
                  setActiveStep(11); // Jump to Practitioner Dashboard
                }}
                className="flex-1 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/30 transition text-center"
              >
                Sign In to Dashboard
              </button>
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs border border-slate-700 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
