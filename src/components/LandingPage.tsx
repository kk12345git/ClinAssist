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
  HeartPulse,
  Building2,
  TrendingDown,
  CheckCircle2,
  Hospital,
  Zap,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { setActiveStep, dashboardStats, vitals } = usePatient();

  return (
    <div className="relative overflow-hidden bg-hospital-canvas text-slate-900 min-h-[calc(100vh-4rem)]">
      {/* Background Soft Pink Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-rose-200/20 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-pink-200/20 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Step 1 Hero Header */}
        <div className="text-center max-w-4xl mx-auto">
          {/* Hospital Certification Badge */}
          <div className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-full bg-white border border-rose-200 shadow-sm shadow-rose-100 mb-6">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-xs">
              <Hospital className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-rose-700 tracking-wide uppercase">
              Hospital Enterprise Clinical AI Decision Platform
            </span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500 text-white">
              v2.0
            </span>
          </div>

          {/* Main Title & Tagline */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-tight">
            Next-Gen Hospital Intake & <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700">
              AI Clinical Decision Support
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-xl text-slate-600 font-normal max-w-3xl mx-auto leading-relaxed">
            Automating patient triage, ambient voice case-taking, diagnostic OCR, and physician SOAP notes. Designed for immediate deployment in hospital OPDs, emergency triage bays, and multi-specialty clinics.
          </p>

          {/* Hospital ROI & Trust Metric Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs">
            <span className="px-3.5 py-1.5 rounded-full bg-white border border-rose-100 text-slate-700 font-semibold shadow-xs flex items-center space-x-1.5">
              <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
              <span><strong>72% Faster</strong> Patient Charting</span>
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white border border-rose-100 text-slate-700 font-semibold shadow-xs flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span><strong>100%</strong> Red-Flag Clinical Screening</span>
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white border border-rose-100 text-slate-700 font-semibold shadow-xs flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span><strong>Tamil + Thanglish + English</strong> Real-Time Voice</span>
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white border border-rose-100 text-slate-700 font-semibold shadow-xs flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span><strong>Live Telemetry</strong> Tele-ICU & OPD Ready</span>
            </span>
          </div>

          {/* Action Card Grid */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {/* Start New Case Card */}
            <button
              onClick={() => setActiveStep(3)} // Jump to Patient Registration
              className="group p-6 rounded-3xl bg-white border border-rose-200/80 hover:border-rose-400 shadow-sm hover:shadow-xl hover:shadow-rose-100/60 text-left transition transform hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition">
                <UserPlus className="w-6 h-6" />
              </div>
              <h3 className="mt-4 font-bold text-lg text-slate-900 group-hover:text-rose-600 transition">
                {t('startNewCase')}
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Register OPD/Emergency patient with live vitals telemetry & AI speech intake.
              </p>
              <div className="mt-4 inline-flex items-center text-xs font-bold text-rose-600 group-hover:translate-x-1 transition">
                <span>Initiate Hospital Intake</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </button>

            {/* Existing Patient Card */}
            <button
              onClick={() => setActiveStep(11)} // Jump to Practitioner Dashboard
              className="group p-6 rounded-3xl bg-white border border-rose-200/80 hover:border-rose-400 shadow-sm hover:shadow-xl hover:shadow-rose-100/60 text-left transition transform hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-500 group-hover:bg-pink-500 group-hover:text-white transition">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="mt-4 font-bold text-lg text-slate-900 group-hover:text-pink-600 transition">
                {t('existingPatient')}
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Search hospital EMR records, historical labs, token queues, and past visits.
              </p>
              <div className="mt-4 inline-flex items-center text-xs font-bold text-pink-600 group-hover:translate-x-1 transition">
                <span>Search Hospital Records</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </button>

            {/* Practitioner Portal Card */}
            <button
              onClick={() => setActiveStep(11)} // Jump to Practitioner Dashboard
              className="group p-6 rounded-3xl bg-white border border-rose-200/80 hover:border-rose-400 shadow-sm hover:shadow-xl hover:shadow-rose-100/60 text-left transition transform hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="mt-4 font-bold text-lg text-slate-900 group-hover:text-purple-600 transition">
                Doctor Triage Console
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Physician dashboard, review triage alerts, sign digital SOAP sheets, and export Rx.
              </p>
              <div className="mt-4 inline-flex items-center text-xs font-bold text-purple-600 group-hover:translate-x-1 transition">
                <span>Open Doctor Console</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </button>
          </div>
        </div>

        {/* Live Hospital Telemetry & Language Bar */}
        <div className="mt-12 max-w-5xl mx-auto rounded-3xl bg-white border border-rose-100 p-6 shadow-sm shadow-rose-100/50">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                  <span>Indic Multilingual Voice AI Engine</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                    Tamil • Thanglish • English Active
                  </span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Allows rural and regional patients to speak naturally in native dialects; ClinAssist parses symptoms into formal medical English.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {LANGUAGE_OPTIONS.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 ${
                    language === lang.code
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-200'
                      : 'bg-slate-50 text-slate-700 hover:bg-rose-50 border border-slate-200'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 12-Step Hospital Clinical Workflow Bar */}
        <div className="mt-14 max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <span className="text-[11px] font-bold text-rose-600 uppercase tracking-widest block">
              Enterprise Hospital EMR Architecture
            </span>
            <h3 className="font-extrabold text-xl text-slate-900 mt-1">
              End-to-End 12-Step Patient Intake to Certified Discharge Workflow
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3.5">
            {[
              { num: 1, name: 'Hospital Welcome', icon: Sparkles, color: 'text-rose-500', bg: 'bg-rose-50' },
              { num: 2, name: 'Language Engine', icon: Globe, color: 'text-pink-500', bg: 'bg-pink-50' },
              { num: 3, name: 'Patient Triage Reg', icon: UserPlus, color: 'text-rose-600', bg: 'bg-rose-50' },
              { num: 4, name: 'Ambient Voice Intake', icon: Mic, color: 'text-purple-500', bg: 'bg-purple-50' },
              { num: 5, name: 'Adaptive CDS Qs', icon: Activity, color: 'text-pink-600', bg: 'bg-pink-50' },
              { num: 6, name: 'Structured Symptoms', icon: FileText, color: 'text-amber-500', bg: 'bg-amber-50' },
              { num: 7, name: 'Prescription OCR', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
              { num: 8, name: 'Patient Timeline', icon: Clock, color: 'text-indigo-500', bg: 'bg-indigo-50' },
              { num: 9, name: 'Red-Flag Safety CDS', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
              { num: 10, name: 'SOAP Notes & ICD-10', icon: Sparkles, color: 'text-rose-600', bg: 'bg-rose-50' },
              { num: 11, name: 'Doctor Dashboard', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
              { num: 12, name: 'Certified Hospital PDF', icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
            ].map(s => (
              <div
                key={s.num}
                onClick={() => setActiveStep(s.num)}
                className="p-3.5 rounded-2xl bg-white border border-rose-100 hover:border-rose-300 transition cursor-pointer text-center group shadow-xs hover:shadow-md hover:shadow-rose-100"
              >
                <div className={`w-8 h-8 mx-auto rounded-xl ${s.bg} flex items-center justify-center ${s.color} group-hover:scale-110 transition`}>
                  <s.icon className="w-4 h-4" />
                </div>
                <p className="text-[11px] font-bold text-slate-800 mt-2">Step {s.num}</p>
                <p className="text-[10px] text-slate-500 font-medium line-clamp-1">{s.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
