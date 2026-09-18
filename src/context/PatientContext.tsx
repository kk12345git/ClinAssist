'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  Patient,
  ChatMessage,
  SymptomStructure,
  MedicalDocument,
  TimelineEvent,
  RedFlagIndicator,
  CaseSummary,
  DashboardStats,
} from '../types/clinical';
import { processClinicalInput, synthesizeSOAPCaseSummary } from '../lib/ai-engine';

interface PatientContextType {
  activeStep: number;
  setActiveStep: (step: number) => void;
  patient: Patient;
  setPatient: React.Dispatch<React.SetStateAction<Patient>>;
  chatHistory: ChatMessage[];
  addChatMessage: (text: string, sender?: 'patient' | 'clinassist' | 'practitioner', isAudio?: boolean) => void;
  symptoms: SymptomStructure;
  setSymptoms: React.Dispatch<React.SetStateAction<SymptomStructure>>;
  documents: MedicalDocument[];
  addDocument: (doc: MedicalDocument) => void;
  toggleDocVerification: (docId: string) => void;
  timeline: TimelineEvent[];
  redFlags: RedFlagIndicator[];
  caseSummary: CaseSummary;
  updatePractitionerNotes: (notes: string) => void;
  togglePractitionerSignOff: () => void;
  dashboardStats: DashboardStats;
  allPatients: Patient[];
  recentCases: CaseSummary[];
  completeCase: () => void;
  loadPatientCase: (patientId: string) => void;
  isRecording: boolean;
  setIsRecording: (rec: boolean) => void;
  adaptiveQuestions: {
    questionEn: string;
    questionTa: string;
    questionTh: string;
    optionsEn: string[];
    optionsTa: string[];
    optionsTh: string[];
  }[];
}

const DEFAULT_PATIENT: Patient = {
  id: 'PAT-2026-1008',
  name: 'Karthik Raja',
  age: 34,
  gender: 'Male',
  phone: '+91 98765 43210',
  preferredLanguage: 'ta',
  emergencyContact: '+91 98765 00000 (Wife - Anitha)',
  consent: true,
  registeredAt: '2026-09-18 09:30 AM',
};

const DEFAULT_SYMPTOMS: SymptomStructure = {
  id: 'symp-default',
  complaint: 'Fever for 3 days with Bodyache & Mild Cough',
  duration: '3 days',
  severity: 7,
  location: 'Generalized Body & Epigastrium',
  associatedSymptoms: ['Chills & Rigors', 'Headache', 'Loss of Appetite', 'Mild Dry Cough'],
  pastHistory: 'No diabetes or heart disease. Known mild allergic rhinitis.',
  currentMedications: 'Paracetamol 650mg TDS, Cetirizine 10mg HS',
  updatedAt: new Date().toISOString(),
};

const INITIAL_CHAT: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'clinassist',
    text: 'Hello Karthik Raja! Welcome to ClinAssist. Please describe your symptoms or main health concern today.',
    timestamp: '09:30 AM',
    language: 'en',
  },
  {
    id: 'msg-2',
    sender: 'patient',
    text: 'Enaku 3 days-ah fever iruku, bodyache and headache severe-ah iruku doctor.',
    timestamp: '09:31 AM',
    language: 'th',
    isAudio: true,
  },
  {
    id: 'msg-3',
    sender: 'clinassist',
    text: 'I understand you have had fever for 3 days with severe bodyache and headache. Do you have cough, cold, or difficulty breathing?',
    timestamp: '09:31 AM',
    language: 'en',
  },
];

const INITIAL_DOCS: MedicalDocument[] = [
  {
    id: 'doc-1',
    title: 'Recent Prescription & Blood Test Report',
    type: 'prescription',
    fileUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    uploadedAt: '2026-09-18 09:32 AM',
    rawText: 'Dr. S. Ramanathan, MD (Gen Med) - Reg #44592. Patient Karthik Raja, 34M. Rx: Tab Paracetamol 650mg TDS x 3 days. Tab Pantoprazole 40mg OD AC. Platelet Count: 1.85 Lakhs/cu.mm. Dengue NS1 Ag: Negative.',
    extractedMedicines: [
      { id: 'm1', name: 'Paracetamol', dosage: '650mg', frequency: 'Three times daily (TDS)', duration: '3 days', verified: true },
      { id: 'm2', name: 'Pantoprazole', dosage: '40mg', frequency: 'Once daily before food (OD AC)', duration: '5 days', verified: true },
    ],
    extractedDate: '17 Sept 2026',
    extractedDetails: 'Complete Blood Count normal. Dengue NS1 Negative. Mild leukopenia observed.',
    verifiedByPractitioner: true,
  },
];

const INITIAL_TIMELINE: TimelineEvent[] = [
  {
    id: 'tl-1',
    date: '18 Sept 2026 - 09:30 AM',
    type: 'visit',
    title: 'Consultation Intake Started',
    description: 'Patient registered and case-taking initiated via ClinAssist AI Voice Assistant.',
    badge: 'Active Visit',
    badgeColor: 'emerald',
  },
  {
    id: 'tl-2',
    date: '17 Sept 2026',
    type: 'report',
    title: 'Lab Report Uploaded',
    description: 'CBC & Dengue NS1 test uploaded. Extracted medicines verified by practitioner.',
    badge: 'Lab OCR',
    badgeColor: 'blue',
  },
  {
    id: 'tl-3',
    date: '15 June 2026',
    type: 'summary',
    title: 'Previous Visit: Upper Respiratory Infection',
    description: 'Diagnosed with viral fever. Treated with symptomatic medication. Resolved in 4 days.',
    badge: 'Past History',
    badgeColor: 'purple',
  },
];

const INITIAL_RED_FLAGS: RedFlagIndicator[] = [
  {
    id: 'rf-1',
    severity: 'high',
    category: 'Febrile Triage Warning',
    title: 'Persistent High Fever > 3 Days',
    description: 'Fever reported for 3 continuous days with high pain severity (7/10).',
    triggerCondition: 'Fever Duration ≥ 3 Days + Bodyache',
    actionRequired: 'Order Complete Blood Count (CBC) and monitor vitals every 4 hours.',
  },
];

const INITIAL_SUMMARY: CaseSummary = {
  id: 'cs-1008',
  patientId: 'PAT-2026-1008',
  patientName: 'Karthik Raja',
  createdAt: '2026-09-18',
  status: 'Pending Review',
  subjective: 'Patient presented with 3-day history of acute fever accompanied by generalized bodyache and severe headache.',
  objective: 'Temp: 100.4°F, BP: 122/80 mmHg, SpO2: 98%. Lab report indicates normal platelet count (1.85L) and Dengue NS1 negative.',
  assessment: 'Acute Febrile Illness likely viral origin. High clinical triage flag present due to fever duration.',
  plan: '1. Continue Paracetamol 650mg TDS.\n2. Adequate oral rehydration.\n3. Practitioner physical examination and re-evaluation in 24 hours.',
  symptomsSummary: DEFAULT_SYMPTOMS,
  redFlagsCount: 1,
  documentsCount: 1,
  practitionerNotes: 'Patient appears clinically stable. Hydration advised. Follow-up if temperature spikes above 102°F.',
  practitionerSigned: false,
  signedBy: 'Dr. A. Sharma, MD',
};

const SAMPLE_PATIENTS: Patient[] = [
  DEFAULT_PATIENT,
  {
    id: 'PAT-2026-1002',
    name: 'Priya Sundaram',
    age: 28,
    gender: 'Female',
    phone: '+91 98401 12345',
    preferredLanguage: 'ta',
    emergencyContact: '+91 98401 99999 (Mother)',
    consent: true,
    registeredAt: '2026-09-17 04:15 PM',
  },
  {
    id: 'PAT-2026-1005',
    name: 'Mohammed Ali',
    age: 52,
    gender: 'Male',
    phone: '+91 97100 88888',
    preferredLanguage: 'en',
    emergencyContact: '+91 97100 11111 (Son)',
    consent: true,
    registeredAt: '2026-09-18 08:00 AM',
  },
];

const SAMPLE_RECENT_CASES: CaseSummary[] = [
  INITIAL_SUMMARY,
  {
    id: 'cs-1002',
    patientId: 'PAT-2026-1002',
    patientName: 'Priya Sundaram',
    createdAt: '2026-09-17',
    status: 'Completed',
    subjective: 'Presented with acute sore throat and dry cough for 2 days.',
    objective: 'Throat erythema (+). Temp 99.2°F. SpO2 99%.',
    assessment: 'Acute Pharyngitis.',
    plan: 'Warm saline gargle, Lozenges, Amoxicillin 500mg BD x 5 days.',
    symptomsSummary: { ...DEFAULT_SYMPTOMS, complaint: 'Sore Throat & Dry Cough', duration: '2 days', severity: 4 },
    redFlagsCount: 0,
    documentsCount: 1,
    practitionerNotes: 'Case completed. Recovery confirmed.',
    practitionerSigned: true,
    signedBy: 'Dr. A. Sharma, MD',
  },
  {
    id: 'cs-1005',
    patientId: 'PAT-2026-1005',
    patientName: 'Mohammed Ali',
    createdAt: '2026-09-18',
    status: 'Pending Review',
    subjective: 'Presented with epigastric burning pain and acidity.',
    objective: 'Abdomen soft, mild epigastric tenderness. BP 138/88 mmHg.',
    assessment: 'Gastroesophageal Reflux Disease / Gastritis.',
    plan: 'Tab Rabeprazole 20mg OD, Antacid syrup 10ml TDS.',
    symptomsSummary: { ...DEFAULT_SYMPTOMS, complaint: 'Epigastric Burning Pain', duration: '5 days', severity: 5 },
    redFlagsCount: 1,
    documentsCount: 0,
    practitionerNotes: 'Dietary modifications advised. Review ECG if pain recurs.',
    practitionerSigned: false,
  },
];

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const PatientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [patient, setPatient] = useState<Patient>(DEFAULT_PATIENT);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(INITIAL_CHAT);
  const [symptoms, setSymptoms] = useState<SymptomStructure>(DEFAULT_SYMPTOMS);
  const [documents, setDocuments] = useState<MedicalDocument[]>(INITIAL_DOCS);
  const [timeline, setTimeline] = useState<TimelineEvent[]>(INITIAL_TIMELINE);
  const [redFlags, setRedFlags] = useState<RedFlagIndicator[]>(INITIAL_RED_FLAGS);
  const [caseSummary, setCaseSummary] = useState<CaseSummary>(INITIAL_SUMMARY);
  const [allPatients, setAllPatients] = useState<Patient[]>(SAMPLE_PATIENTS);
  const [recentCases, setRecentCases] = useState<CaseSummary[]>(SAMPLE_RECENT_CASES);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [adaptiveQuestions, setAdaptiveQuestions] = useState(
    processClinicalInput(DEFAULT_SYMPTOMS.complaint).followUpQuestions
  );

  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalPatients: 24,
    todayCases: 8,
    pendingReviews: 3,
    completedCases: 21,
  });

  const addChatMessage = (text: string, sender: 'patient' | 'clinassist' | 'practitioner' = 'patient', isAudio = false) => {
    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAudio,
    };

    setChatHistory(prev => [...prev, newMsg]);

    // Run AI Decision Engine
    if (sender === 'patient') {
      const aiRes = processClinicalInput(text, symptoms);
      setSymptoms(prev => ({ ...prev, ...aiRes.extractedSymptoms }));
      setAdaptiveQuestions(aiRes.followUpQuestions);
      if (aiRes.detectedRedFlags.length > 0) {
        setRedFlags(prev => {
          const existingIds = new Set(prev.map(rf => rf.id));
          const newFlags = aiRes.detectedRedFlags.filter(rf => !existingIds.has(rf.id));
          return [...prev, ...newFlags];
        });
      }

      // Generate AI follow-up response in chat
      setTimeout(() => {
        const topQ = aiRes.followUpQuestions[0];
        const aiText = topQ
          ? topQ.questionEn
          : "Thank you. I have recorded your symptoms. Practitioner review is ready.";
        
        const aiMsg: ChatMessage = {
          id: 'msg-' + (Date.now() + 1),
          sender: 'clinassist',
          text: aiText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setChatHistory(prev => [...prev, aiMsg]);
      }, 700);
    }
  };

  const addDocument = (doc: MedicalDocument) => {
    setDocuments(prev => [doc, ...prev]);
    const newTl: TimelineEvent = {
      id: 'tl-' + Date.now(),
      date: new Date().toLocaleDateString() + ' - Document Upload',
      type: 'report',
      title: doc.title,
      description: doc.extractedDetails || 'Document processed via ClinAssist OCR.',
      badge: doc.type.toUpperCase(),
      badgeColor: 'blue',
    };
    setTimeline(prev => [newTl, ...prev]);
  };

  const toggleDocVerification = (docId: string) => {
    setDocuments(prev =>
      prev.map(d => (d.id === docId ? { ...d, verifiedByPractitioner: !d.verifiedByPractitioner } : d))
    );
  };

  const updatePractitionerNotes = (notes: string) => {
    setCaseSummary(prev => ({ ...prev, practitionerNotes: notes }));
  };

  const togglePractitionerSignOff = () => {
    setCaseSummary(prev => {
      const nextStatus = !prev.practitionerSigned ? 'Completed' : 'Pending Review';
      return {
        ...prev,
        practitionerSigned: !prev.practitionerSigned,
        status: nextStatus,
        signedBy: !prev.practitionerSigned ? 'Dr. A. Sharma, MD' : undefined,
      };
    });
  };

  const completeCase = () => {
    setCaseSummary(prev => ({ ...prev, status: 'Completed', practitionerSigned: true }));
    setDashboardStats(prev => ({
      ...prev,
      pendingReviews: Math.max(0, prev.pendingReviews - 1),
      completedCases: prev.completedCases + 1,
    }));
  };

  const loadPatientCase = (patientId: string) => {
    const foundPatient = allPatients.find(p => p.id === patientId);
    if (foundPatient) {
      setPatient(foundPatient);
      const foundCase = recentCases.find(c => c.patientId === patientId);
      if (foundCase) {
        setCaseSummary(foundCase);
        if (foundCase.symptomsSummary) {
          setSymptoms(foundCase.symptomsSummary);
        }
      }
      setActiveStep(12); // Jump to Case Sheet
    }
  };

  return (
    <PatientContext.Provider
      value={{
        activeStep,
        setActiveStep,
        patient,
        setPatient,
        chatHistory,
        addChatMessage,
        symptoms,
        setSymptoms,
        documents,
        addDocument,
        toggleDocVerification,
        timeline,
        redFlags,
        caseSummary,
        updatePractitionerNotes,
        togglePractitionerSignOff,
        dashboardStats,
        allPatients,
        recentCases,
        completeCase,
        loadPatientCase,
        isRecording,
        setIsRecording,
        adaptiveQuestions,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = (): PatientContextType => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
};
