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
  Volume2,
  VolumeX,
  HeartPulse,
  Building,
  Key,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const {
    activeStep,
    setActiveStep,
    patient,
    vitals,
    hospitalAssignment,
    soundEnabled,
    toggleSound,
  } = usePatient();

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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-[0_4px_20px_-4px_rgba(244,63,94,0.06)] text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveStep(1)}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-500 to-rose-400 p-0.5 shadow-md shadow-rose-200 flex items-center justify-center transition transform group-hover:scale-105">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-rose-500" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700">
                  ClinAssist
                </span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                  Hospital Workstation v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                Clinical Intake, Vitals Telemetry & Decision Support
              </p>
            </div>
          </div>

          {/* Center: Live Vitals Ticker Pill & Step Selector */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Live Bedside Vitals Stream */}
            <div className="flex items-center space-x-3 px-3.5 py-1.5 rounded-xl bg-rose-50/70 border border-rose-200/80 text-xs">
              <div className="flex items-center space-x-1.5 text-rose-700 font-bold">
                <HeartPulse className="w-4 h-4 text-rose-500 animate-ecg-heart" />
                <span>{vitals.heartRate} <span className="text-[10px] font-normal text-slate-500">BPM</span></span>
              </div>
              <span className="text-rose-300">|</span>
              <div className="text-slate-700 font-semibold">
                BP: <span className="text-slate-900 font-bold">{vitals.bloodPressureSys}/{vitals.bloodPressureDia}</span>
              </div>
              <span className="text-rose-300">|</span>
              <div className="text-slate-700 font-semibold">
                SpO2: <span className="text-emerald-700 font-bold">{vitals.spO2}%</span>
              </div>
              <span className="text-rose-300">|</span>
              <div className="text-slate-700 font-semibold">
                Temp: <span className="text-amber-700 font-bold">{vitals.temperature}°F</span>
              </div>
            </div>

            {/* Step Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsStepOpen(!isStepOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-xs font-semibold text-slate-700 border border-rose-200 transition shadow-xs"
              >
                <Sliders className="w-3.5 h-3.5 text-rose-500" />
                <span>Step {activeStep}: {steps.find(s => s.num === activeStep)?.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isStepOpen && (
                <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-white border border-rose-100 shadow-2xl py-2 z-50 max-h-80 overflow-y-auto">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-rose-700 uppercase tracking-wider bg-rose-50/50">
                    Clinical Workflow Navigator
                  </div>
                  {steps.map(s => (
                    <button
                      key={s.num}
                      onClick={() => {
                        setActiveStep(s.num);
                        setIsStepOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-rose-50 transition ${
                        activeStep === s.num
                          ? 'bg-rose-50 text-rose-700 font-bold border-l-3 border-rose-500'
                          : 'text-slate-600'
                      }`}
                    >
                      <span>{s.name}</span>
                      {activeStep === s.num && <CheckCircle2 className="w-3.5 h-3.5 text-rose-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Actions: Sound, Active Patient, Language, Login */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Audio Feedback Sound Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl border transition ${
                soundEnabled
                  ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
                  : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
              }`}
              title={soundEnabled ? 'Hospital Audio Telemetry Sound: ON' : 'Audio Sound: OFF'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Active Patient Indicator Pill */}
            {patient && (
              <div
                onClick={() => setActiveStep(12)}
                className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-50/80 border border-rose-200 text-xs text-slate-700 cursor-pointer hover:bg-rose-100/70 transition"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-rose-900">{patient.name}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-white text-rose-600 border border-rose-200">
                  {hospitalAssignment?.tokenNumber || patient.id}
                </span>
              </div>
            )}

            {/* Language Selector Pill */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-xs font-semibold text-slate-700 border border-rose-200 transition shadow-xs"
              >
                <Globe className="w-3.5 h-3.5 text-rose-500" />
                <span className="mr-0.5">{currentLangObj.flag}</span>
                <span>{currentLangObj.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white border border-rose-100 shadow-2xl py-2 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-rose-700 uppercase tracking-wider flex items-center justify-between border-b border-rose-50">
                    <span>Select Language</span>
                    <Sparkles className="w-3 h-3 text-rose-400" />
                  </div>
                  {LANGUAGE_OPTIONS.map(opt => (
                    <button
                      key={opt.code}
                      onClick={() => {
                        setLanguage(opt.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-rose-50 transition ${
                        language === opt.code
                          ? 'bg-rose-50 text-rose-700 font-bold border-l-2 border-rose-500'
                          : 'text-slate-600'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{opt.flag}</span>
                        <div>
                          <p className="font-medium">{opt.name}</p>
                          <p className="text-[10px] text-slate-400">{opt.nativeName}</p>
                        </div>
                      </div>
                      {opt.isMvpFull && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                          Active
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Practitioner Portal Button */}
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-xs font-bold text-white shadow-md shadow-rose-200 transition transform hover:-translate-y-0.5"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('practitionerLogin')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Practitioner Login Demo Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-rose-200 rounded-3xl p-7 max-w-md w-full shadow-2xl relative">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Doctor & Staff Portal Authentication
                </h3>
                <p className="text-xs text-slate-500">
                  Apollo-ClinAssist Multi-Specialty Hospital EMR
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3.5">
              <div>
                <label className="text-xs text-slate-700 font-semibold">Doctor Registration / Hospital Email</label>
                <input
                  type="text"
                  defaultValue="dr.sharma@clinassist.med"
                  className="w-full mt-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-400 focus:bg-white"
                />
              </div>
              <div>
                <label className="text-xs text-slate-700 font-semibold">Hospital Password</label>
                <input
                  type="password"
                  defaultValue="••••••••••••"
                  className="w-full mt-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-400 focus:bg-white"
                />
              </div>
              <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 text-[11px] text-rose-800 flex items-center space-x-2">
                <Key className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Role: Senior Consultant Physician • Dept: General Medicine (Suite 04)</span>
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => {
                  setIsLoginModalOpen(false);
                  setActiveStep(11); // Jump to Practitioner Dashboard
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs shadow-lg shadow-rose-200 transition text-center"
              >
                Sign In to Doctor Dashboard
              </button>
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
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
