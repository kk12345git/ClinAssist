'use client';

import React from 'react';
import { Navbar } from '../components/Navbar';
import { LandingPage } from '../components/LandingPage';
import { LanguageSelectorModal } from '../components/LanguageSelectorModal';
import { PatientRegistration } from '../components/PatientRegistration';
import { CaseTaking } from '../components/CaseTaking';
import { StructuredSymptoms } from '../components/StructuredSymptoms';
import { MedicalOCR } from '../components/MedicalOCR';
import { MedicalTimeline } from '../components/MedicalTimeline';
import { ClinicalReview } from '../components/ClinicalReview';
import { CaseSummaryView } from '../components/CaseSummary';
import { PractitionerDashboard } from '../components/PractitionerDashboard';
import { usePatient } from '../context/PatientContext';
import { ShieldCheck, HeartPulse, Building2, PhoneCall } from 'lucide-react';

export default function Home() {
  const { activeStep } = usePatient();

  const renderActiveStep = () => {
    switch (activeStep) {
      case 1:
        return <LandingPage />;
      case 2:
        return <LanguageSelectorModal />;
      case 3:
        return <PatientRegistration />;
      case 4:
      case 5:
        return <CaseTaking />;
      case 6:
        return <StructuredSymptoms />;
      case 7:
        return <MedicalOCR />;
      case 8:
        return <MedicalTimeline />;
      case 9:
        return <ClinicalReview />;
      case 10:
      case 12:
        return <CaseSummaryView />;
      case 11:
        return <PractitionerDashboard />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <main className="min-h-screen bg-hospital-canvas text-slate-900 flex flex-col selection:bg-rose-100 selection:text-rose-800">
      {/* Top Hospital Emergency & Hospital Status Ribbon */}
      <div className="bg-gradient-to-r from-rose-50 via-white to-pink-50 border-b border-rose-100 px-4 py-1.5 text-[11px] text-slate-600 flex flex-wrap items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1.5 font-semibold text-rose-700">
            <Building2 className="w-3.5 h-3.5 text-rose-500" />
            <span>Apollo-ClinAssist Academic Medical Center & Research Network</span>
          </span>
          <span className="hidden md:inline-block text-slate-300">|</span>
          <span className="hidden md:inline-flex items-center space-x-1 text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>NABH Accredited • HIPAA / ISO 27001 Certified Clinical AI</span>
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 text-rose-700 font-medium">
            <HeartPulse className="w-3.5 h-3.5 text-rose-500 animate-ecg-heart" />
            <span>Real-time Triage Telemetry: <strong className="text-emerald-700">ONLINE</strong></span>
          </div>
          <span className="hidden sm:inline-flex items-center space-x-1 text-slate-600">
            <PhoneCall className="w-3 h-3 text-rose-500" />
            <span>ER Hotline: 1066 / +91 44 2829 0200</span>
          </span>
        </div>
      </div>

      <Navbar />

      <div className="flex-1 pb-16">
        {renderActiveStep()}
      </div>

      <footer className="py-6 border-t border-rose-100/80 text-center text-xs text-slate-500 bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="font-semibold text-slate-800">ClinAssist Health Technologies v2.0 Enterprise</span>
            <span className="text-slate-400">• Hospital Bedside & OPD Decision Support</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Designed for Multi-Specialty Hospitals, Medical Colleges & Clinical Healthcare Networks
          </div>
        </div>
      </footer>
    </main>
  );
}
