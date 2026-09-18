'use client';

import React from 'react';
import { useLanguage, LANGUAGE_OPTIONS } from '../context/LanguageContext';
import { usePatient } from '../context/PatientContext';
import {
  Stethoscope,
  UserPlus,
  Search,
  ShieldCheck,
  Globe,
  ArrowRight,
  Sparkles,
  CheckCircle,
  FileText,
  Clock,
  Mic,
  Activity,
  AlertTriangle,
  Award,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { setActiveStep } = usePatient();

  return (
    <div className="relative overflow-hidden bg-slate-950 text-white min-h-[calc(100vh-4rem)]">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Step 1 Hero Header */}
        <div className="text-center max-w-3xl mx-auto">
          {/* Logo & Badge */}
          <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-slate-900/90 border border-teal-500/30 shadow-xl mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-400 to-cyan-400 flex items-center justify-center shadow-md">
              <Stethoscope className="w-4 h-4 text-slate-950" />
            </div>
            <span className="text-xs font-semibold text-teal-300 tracking-wide uppercase">
              ClinAssist Clinical Decision Support System
            </span>
          </div>

          {/* Main Title & Tagline */}
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Next-Gen AI Clinical Intake & <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-300 to-emerald-300">
              Case-Taking Platform
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
            {t('tagline')}
          </p>

          {/* Action Card Grid */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {/* Start New Case Card */}
            <button
              onClick={() => setActiveStep(3)} // Jump to Patient Registration
              className="group p-6 rounded-2xl bg-gradient-to-b from-teal-900/40 to-slate-900 border border-teal-500/40 hover:border-teal-400/80 shadow-xl hover:shadow-teal-500/20 text-left transition transform hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400 group-hover:bg-teal-500 group-hover:text-slate-950 transition">
                <UserPlus className="w-6 h-6" />
              </div>
              <h3 className="mt-4 font-bold text-lg text-white group-hover:text-teal-300 transition">
                {t('startNewCase')}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Register new patient & initiate AI voice/text clinical intake.
              </p>
              <div className="mt-4 inline-flex items-center text-xs font-semibold text-teal-400 group-hover:translate-x-1 transition">
                <span>Begin Intake</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </button>

            {/* Existing Patient Card */}
            <button
              onClick={() => setActiveStep(11)} // Jump to Practitioner Dashboard
              className="group p-6 rounded-2xl bg-gradient-to-b from-cyan-900/40 to-slate-900 border border-cyan-500/40 hover:border-cyan-400/80 shadow-xl hover:shadow-cyan-500/20 text-left transition transform hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="mt-4 font-bold text-lg text-white group-hover:text-cyan-300 transition">
                {t('existingPatient')}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Search medical records, past visits, and case history.
              </p>
              <div className="mt-4 inline-flex items-center text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition">
                <span>Search Patient</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </button>

            {/* Practitioner Portal Card */}
            <button
              onClick={() => setActiveStep(11)} // Jump to Practitioner Dashboard
              className="group p-6 rounded-2xl bg-gradient-to-b from-purple-900/40 to-slate-900 border border-purple-500/40 hover:border-purple-400/80 shadow-xl hover:shadow-purple-500/20 text-left transition transform hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-slate-950 transition">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="mt-4 font-bold text-lg text-white group-hover:text-purple-300 transition">
                {t('practitionerLogin')}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Doctor dashboard, review pending cases & sign case sheets.
              </p>
              <div className="mt-4 inline-flex items-center text-xs font-semibold text-purple-400 group-hover:translate-x-1 transition">
                <span>Open Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </button>
          </div>
        </div>

        {/* Step 2 Language Quick Bar Highlight */}
        <div className="mt-14 max-w-4xl mx-auto rounded-2xl bg-slate-900/80 border border-slate-800 p-6 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white flex items-center space-x-2">
                  <span>Multilingual Support Engine</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Tamil + English + Thanglish Fully Functional
                  </span>
                </h4>
                <p className="text-xs text-slate-400">
                  Select your preferred language for instant patient case taking and AI prompts.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {LANGUAGE_OPTIONS.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center space-x-1 ${
                    language === lang.code
                      ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 12-Step Workflow Preview Bar */}
        <div className="mt-12 max-w-6xl mx-auto">
          <h3 className="text-center font-bold text-sm text-slate-400 uppercase tracking-widest mb-6">
            Complete 12-Step Healthcare Intake Architecture
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { num: 1, name: 'Welcome Page', icon: Sparkles, color: 'text-teal-400' },
              { num: 2, name: 'Language Select', icon: Globe, color: 'text-cyan-400' },
              { num: 3, name: 'Patient Reg', icon: UserPlus, color: 'text-emerald-400' },
              { num: 4, name: 'Case Taking', icon: Mic, color: 'text-purple-400' },
              { num: 5, name: 'AI Questions', icon: Activity, color: 'text-pink-400' },
              { num: 6, name: 'Structured Symptoms', icon: FileText, color: 'text-amber-400' },
              { num: 7, name: 'Document OCR', icon: FileText, color: 'text-teal-400' },
              { num: 8, name: 'Medical Timeline', icon: Clock, color: 'text-blue-400' },
              { num: 9, name: 'Red Flags Review', icon: AlertTriangle, color: 'text-red-400' },
              { num: 10, name: 'AI Summary', icon: Sparkles, color: 'text-indigo-400' },
              { num: 11, name: 'Dashboard', icon: ShieldCheck, color: 'text-emerald-400' },
              { num: 12, name: 'Final Case PDF', icon: Award, color: 'text-yellow-400' },
            ].map(s => (
              <div
                key={s.num}
                onClick={() => setActiveStep(s.num)}
                className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/40 transition cursor-pointer text-center group"
              >
                <s.icon className={`w-5 h-5 mx-auto ${s.color} group-hover:scale-110 transition`} />
                <p className="text-[11px] font-bold text-slate-200 mt-2">Step {s.num}</p>
                <p className="text-[10px] text-slate-400 line-clamp-1">{s.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
