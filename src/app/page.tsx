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
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      <div className="flex-1 pb-16">
        {renderActiveStep()}
      </div>
      <footer className="py-6 border-t border-slate-900 text-center text-xs text-slate-500 bg-slate-950">
        ClinAssist Medical Decision Support Platform © 2026 • Certified Clinical AI Workflow
      </footer>
    </main>
  );
}
