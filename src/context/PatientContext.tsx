'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Patient,
  ChatMessage,
  SymptomStructure,
  MedicalDocument,
  TimelineEvent,
  RedFlagIndicator,
  CaseSummary,
  DashboardStats,
  PatientVitals,
  HospitalAssignment,
  PrescriptionItem,
  ICD10Code,
} from '../types/clinical';
import { processClinicalInput, synthesizeSOAPCaseSummary } from '../lib/ai-engine';
import { hospitalAudio } from '../lib/hospital-audio';

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
  // Hospital-grade additions
  vitals: PatientVitals;
  updateVitals: (newVitals: Partial<PatientVitals>) => void;
  isLiveTelemetryActive: boolean;
  setIsLiveTelemetryActive: (active: boolean) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  prescriptions: PrescriptionItem[];
  addPrescription: (rx: PrescriptionItem) => void;
  removePrescription: (id: string) => void;
  icdCodes: ICD10Code[];
  hospitalAssignment: HospitalAssignment;
}

const DEFAULT_VITALS: PatientVitals = {
  heartRate: 88,
  bloodPressureSys: 122,
  bloodPressureDia: 80,
  spO2: 98,
  temperature: 100.4,
  respiratoryRate: 18,
  bloodGlucose: 110,
  lastUpdated: 'Just now (Live Telemetry)',
  triageLevel: 'P3 - Urgent',
  isAbnormal: true,
};

const DEFAULT_ASSIGNMENT: HospitalAssignment = {
  tokenNumber: '#OPD-108',
  department: 'General Medicine',
  roomBed: 'Consultation Suite 04 / Bed 02',
  attendingDoctor: 'Dr. A. Sharma, MD (Reg #44592)',
  queueStatus: 'In Consultation',
  waitTimeMinutes: 8,
};

const DEFAULT_PATIENT: Patient = {
  id: 'PAT-2026-1008',
  name: 'Karthik Raja',
  age: 34,
  gender: 'Male',
  phone: '+91 98765 43210',
  preferredLanguage: 'ta',
  emergencyContact: '+91 98765 00000 (Wife - Anitha)',
  consent: true,
  registeredAt: '2026-09-26 09:30 AM',
  vitals: DEFAULT_VITALS,
  hospitalAssignment: DEFAULT_ASSIGNMENT,
};

const DEFAULT_SYMPTOMS: SymptomStructure = {
  id: 'symp-default',
  complaint: 'Acute Febrile Illness (Fever for 3 days with Bodyache & Headache)',
  duration: '3 days',
  severity: 7,
  location: 'Generalized Body & Frontal Cranial',
  associatedSymptoms: ['Chills & Rigors', 'Frontal Headache', 'Generalized Myalgia', 'Mild Dry Cough'],
  pastHistory: 'Known mild seasonal allergic rhinitis. No diabetes, asthma, or cardiac illness.',
  currentMedications: 'Tab. Paracetamol 650mg TDS, Tab. Cetirizine 10mg HS',
  updatedAt: new Date().toISOString(),
};

const INITIAL_CHAT: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'clinassist',
    text: 'Hello Karthik Raja! Welcome to ClinAssist Medical Decision Support. Please describe your main symptoms or health concern today.',
    timestamp: '09:30 AM',
    language: 'en',
  },
  {
    id: 'msg-2',
    sender: 'patient',
    text: 'Enaku 3 days-ah fever iruku, bodyache and severe headache iruku doctor.',
    timestamp: '09:31 AM',
    language: 'th',
    isAudio: true,
  },
  {
    id: 'msg-3',
    sender: 'clinassist',
    text: 'Understood. Acute fever for 3 days with generalized myalgia and headache recorded. Do you have cough, sore throat, or shortness of breath?',
    timestamp: '09:31 AM',
    language: 'en',
  },
];

const INITIAL_DOCS: MedicalDocument[] = [
  {
    id: 'doc-1',
    title: 'Hospital OPD Blood Investigation Panel & Dengue Screen',
    type: 'lab_report',
    fileUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    uploadedAt: '2026-09-26 09:32 AM',
    rawText: 'APOLLO CLINICAL LABS - Patient: Karthik Raja (34M). CBC Analysis: Hemoglobin: 14.2 g/dL. Total WBC Count: 7,400 /cu.mm. Platelet Count: 1.85 Lakhs/cu.mm (Adequate). Dengue NS1 Antigen: NEGATIVE. Serum Creatinine: 0.9 mg/dL. CRP: 8.5 mg/L (Mild elevation).',
    extractedMedicines: [
      { id: 'm1', name: 'Paracetamol', dosage: '650mg', frequency: 'Three times daily (TDS)', duration: '5 days', verified: true },
      { id: 'm2', name: 'Pantoprazole', dosage: '40mg', frequency: 'Once daily before food (OD AC)', duration: '5 days', verified: true },
    ],
    extractedDate: '26 Sept 2026',
    extractedDetails: 'Complete Blood Count within normal range. Platelet Count: 1.85L (Stable). Dengue NS1 Negative. Mildly elevated CRP indicative of acute viral reaction.',
    verifiedByPractitioner: true,
    labBiomarkers: [
      { name: 'Platelet Count', value: '1.85 Lakhs/cu.mm', reference: '1.5 - 4.5 Lakhs', status: 'Normal' },
      { name: 'Total Leukocyte (WBC)', value: '7,400 /cu.mm', reference: '4,000 - 11,000', status: 'Normal' },
      { name: 'C-Reactive Protein (CRP)', value: '8.5 mg/L', reference: '< 5.0 mg/L', status: 'High' },
      { name: 'Dengue NS1 Antigen', value: 'Negative', reference: 'Negative', status: 'Normal' },
    ],
  },
];

const INITIAL_TIMELINE: TimelineEvent[] = [
  {
    id: 'tl-1',
    date: '26 Sept 2026 - 09:30 AM',
    type: 'visit',
    title: 'Hospital OPD Triage Check-In',
    description: 'Patient registered at General Medicine Suite 4. Token #OPD-108 issued. Bedside vitals recorded.',
    badge: 'Active Token',
    badgeColor: 'pink',
  },
  {
    id: 'tl-2',
    date: '26 Sept 2026 - 09:32 AM',
    type: 'vital',
    title: 'Vital Signs Telemetry Streaming',
    description: 'Temp: 100.4°F, BP: 122/80 mmHg, Pulse: 88 BPM, SpO2: 98%. Low-grade pyrexia flagged.',
    badge: 'Vitals Log',
    badgeColor: 'blue',
  },
  {
    id: 'tl-3',
    date: '26 Sept 2026 - 09:34 AM',
    type: 'report',
    title: 'Digital Lab OCR Diagnostic Verified',
    description: 'CBC and Dengue NS1 Antigen scanned & verified. Normal platelet count confirmed.',
    badge: 'Lab Verified',
    badgeColor: 'emerald',
  },
  {
    id: 'tl-4',
    date: '15 June 2026',
    type: 'summary',
    title: 'Prior Hospital Record: Seasonal Rhinitis',
    description: 'Treated at OPD for allergic rhinitis with Antihistamines. Fully resolved.',
    badge: 'Historical EMR',
    badgeColor: 'purple',
  },
];

const INITIAL_RED_FLAGS: RedFlagIndicator[] = [
  {
    id: 'rf-1',
    severity: 'high',
    category: 'Febrile Triage Protocol',
    title: 'Persistent Febrile State > 72 Hours',
    description: 'Fever reported for 3 continuous days with pain severity score (7/10). Vector-borne illness rule-out required.',
    triggerCondition: 'Fever Duration ≥ 3 Days + Severe Bodyache',
    actionRequired: 'Monitor platelet trajectory, ensure oral hydration, repeat CBC if temperature spikes > 102°F.',
  },
];

const INITIAL_PRESCRIPTIONS: PrescriptionItem[] = [
  {
    id: 'rx-init-1',
    medicineName: 'Tab. Paracetamol (Dolo 650)',
    dosage: '650mg',
    route: 'Oral',
    frequency: 'TDS (Thrice Daily)',
    timing: 'After Food (PC)',
    duration: '5 days',
    instructions: 'Take with full glass of water. Keep 6-hour gap between doses.',
  },
  {
    id: 'rx-init-2',
    medicineName: 'Tab. Pantoprazole',
    dosage: '40mg',
    route: 'Oral',
    frequency: 'OD (Once Daily)',
    timing: 'Before Food (AC)',
    duration: '5 days',
    instructions: 'Take 30 minutes before breakfast.',
  },
  {
    id: 'rx-init-3',
    medicineName: 'Oral Rehydration Salts (ORS) Sachet',
    dosage: '1 Sachet in 1 Litre Water',
    route: 'Oral',
    frequency: 'SOS (As Needed)',
    timing: 'With Food',
    duration: '3 days',
    instructions: 'Sip steadily throughout the day to replace electrolytes.',
  },
];

const INITIAL_ICD: ICD10Code[] = [
  { code: 'R50.9', description: 'Fever, unspecified (Febrile illness)', category: 'Symptoms & Signs', confidence: 98 },
  { code: 'J06.9', description: 'Acute upper respiratory infection, unspecified', category: 'Respiratory System', confidence: 85 },
  { code: 'M79.1', description: 'Myalgia (Generalized bodyache)', category: 'Musculoskeletal', confidence: 91 },
];

const INITIAL_SUMMARY: CaseSummary = {
  id: 'cs-1008',
  patientId: 'PAT-2026-1008',
  patientName: 'Karthik Raja',
  createdAt: '2026-09-26',
  status: 'Pending Review',
  subjective: 'Patient presented to OPD with 3-day history of acute fever accompanied by generalized bodyache and severe frontal headache.',
  objective: 'Temp: 100.4°F, BP: 122/80 mmHg, SpO2: 98%, HR: 88 bpm. Lab findings confirm adequate platelet count (1.85L) and Dengue NS1 Antigen negative. Mild CRP elevation (8.5 mg/L).',
  assessment: 'Acute Febrile Illness of probable viral etiology with clinical triage flag for fever duration. Differential diagnosis under practitioner evaluation.',
  plan: '1. Strict oral rehydration & bed rest.\n2. Antipyretic therapy with Tab Paracetamol 650mg TDS.\n3. Gastroprotective therapy with Tab Pantoprazole 40mg OD AC.\n4. Attending physician physical exam and clinical review in 48 hours.',
  symptomsSummary: DEFAULT_SYMPTOMS,
  redFlagsCount: 1,
  documentsCount: 1,
  practitionerNotes: 'Patient is hemodynamically stable. Chest clear on auscultation. Hydration advised. Follow-up if temperature spikes above 102°F or if any rash develops.',
  practitionerSigned: false,
  signedBy: 'Dr. A. Sharma, MD',
  icdCodes: INITIAL_ICD,
  prescriptions: INITIAL_PRESCRIPTIONS,
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
    registeredAt: '2026-09-26 08:15 AM',
    vitals: {
      heartRate: 76,
      bloodPressureSys: 116,
      bloodPressureDia: 74,
      spO2: 99,
      temperature: 99.1,
      respiratoryRate: 16,
      bloodGlucose: 95,
      lastUpdated: '10 mins ago',
      triageLevel: 'P4 - Routine',
      isAbnormal: false,
    },
    hospitalAssignment: {
      tokenNumber: '#OPD-102',
      department: 'General Medicine',
      roomBed: 'Room 02 / Chair A',
      attendingDoctor: 'Dr. S. Ramanathan, MD',
      queueStatus: 'Waiting in Triage',
      waitTimeMinutes: 15,
    },
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
    registeredAt: '2026-09-26 09:05 AM',
    vitals: {
      heartRate: 98,
      bloodPressureSys: 148,
      bloodPressureDia: 92,
      spO2: 96,
      temperature: 98.8,
      respiratoryRate: 20,
      bloodGlucose: 154,
      lastUpdated: '5 mins ago',
      triageLevel: 'P2 - Emergent',
      isAbnormal: true,
    },
    hospitalAssignment: {
      tokenNumber: '#EMG-014',
      department: 'Emergency & Trauma',
      roomBed: 'Trauma Bay 01 / Bed 04',
      attendingDoctor: 'Dr. V. Meenakshi, MS',
      queueStatus: 'In Consultation',
      waitTimeMinutes: 0,
    },
  },
];

const SAMPLE_RECENT_CASES: CaseSummary[] = [
  INITIAL_SUMMARY,
  {
    id: 'cs-1002',
    patientId: 'PAT-2026-1002',
    patientName: 'Priya Sundaram',
    createdAt: '2026-09-26',
    status: 'Completed',
    subjective: 'Presented with acute sore throat, scratchy cough, and mild low-grade pyrexia for 2 days.',
    objective: 'Throat erythema (+). Temp 99.1°F. SpO2 99%. Heart sounds normal.',
    assessment: 'Acute Pharyngitis / Viral URTI.',
    plan: 'Warm saline gargle, Lozenges, Paracetamol 500mg SOS.',
    symptomsSummary: { ...DEFAULT_SYMPTOMS, complaint: 'Sore Throat & Dry Cough', duration: '2 days', severity: 4 },
    redFlagsCount: 0,
    documentsCount: 1,
    practitionerNotes: 'Case completed. Recovery confirmed. Advised to stay well hydrated.',
    practitionerSigned: true,
    signedBy: 'Dr. S. Ramanathan, MD',
    icdCodes: [
      { code: 'J02.9', description: 'Acute pharyngitis, unspecified', category: 'Respiratory', confidence: 95 },
    ],
    prescriptions: [
      {
        id: 'rx-p1',
        medicineName: 'Tab. Paracetamol',
        dosage: '500mg',
        route: 'Oral',
        frequency: 'SOS (As Needed)',
        timing: 'After Food (PC)',
        duration: '3 days',
        instructions: 'Take when fever or pain is felt.',
      },
    ],
  },
  {
    id: 'cs-1005',
    patientId: 'PAT-2026-1005',
    patientName: 'Mohammed Ali',
    createdAt: '2026-09-26',
    status: 'Pending Review',
    subjective: 'Presented with acute epigastric burning pain, retrosternal acidity, and post-prandial fullness.',
    objective: 'BP 148/92 mmHg, Pulse 98 bpm. Abdomen soft, tenderness localized to epigastrium.',
    assessment: 'Acute Acid Peptic Disease / GERD. Cardiovascular evaluation pending.',
    plan: '1. Tab Rabeprazole 20mg OD.\n2. Antacid gel 10ml TDS.\n3. ECG stat to rule out atypical angina.',
    symptomsSummary: { ...DEFAULT_SYMPTOMS, complaint: 'Acute Epigastric Burning Pain & Acidity', duration: '5 days', severity: 8 },
    redFlagsCount: 1,
    documentsCount: 0,
    practitionerNotes: 'ECG recommended. Dietary modifications advised.',
    practitionerSigned: false,
    icdCodes: [
      { code: 'K29.70', description: 'Gastritis, unspecified', category: 'Digestive', confidence: 94 },
      { code: 'I10', description: 'Essential hypertension', category: 'Circulatory', confidence: 89 },
    ],
    prescriptions: [
      {
        id: 'rx-m1',
        medicineName: 'Tab. Rabeprazole',
        dosage: '20mg',
        route: 'Oral',
        frequency: 'OD (Once Daily)',
        timing: 'Before Food (AC)',
        duration: '14 days',
        instructions: 'Morning 30 minutes before breakfast.',
      },
    ],
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
  const [vitals, setVitals] = useState<PatientVitals>(DEFAULT_VITALS);
  const [isLiveTelemetryActive, setIsLiveTelemetryActive] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>(INITIAL_PRESCRIPTIONS);
  const [icdCodes, setIcdCodes] = useState<ICD10Code[]>(INITIAL_ICD);
  const [hospitalAssignment, setHospitalAssignment] = useState<HospitalAssignment>(DEFAULT_ASSIGNMENT);

  const [adaptiveQuestions, setAdaptiveQuestions] = useState(
    processClinicalInput(DEFAULT_SYMPTOMS.complaint).followUpQuestions
  );

  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalPatients: 38,
    todayCases: 14,
    pendingReviews: 4,
    completedCases: 34,
    criticalTriageAlerts: 2,
    bedOccupancyRate: 78,
  });

  // Sound toggle
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    hospitalAudio.setSoundEnabled(next);
  };

  // Real-time Telemetry Simulator (slight organic fluctuations)
  useEffect(() => {
    if (!isLiveTelemetryActive) return;
    const interval = setInterval(() => {
      setVitals(prev => {
        const hrDelta = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const nextHR = Math.min(130, Math.max(65, prev.heartRate + hrDelta));
        const nextSpO2 = Math.min(100, Math.max(95, prev.spO2 + (Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0)));
        return {
          ...prev,
          heartRate: nextHR,
          spO2: nextSpO2,
          lastUpdated: 'Live (' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ')',
        };
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isLiveTelemetryActive]);

  const updateVitals = (newVitals: Partial<PatientVitals>) => {
    setVitals(prev => {
      const updated = { ...prev, ...newVitals, lastUpdated: 'Updated ' + new Date().toLocaleTimeString() };
      if (updated.temperature > 101 || updated.spO2 < 94 || updated.heartRate > 115) {
        updated.isAbnormal = true;
        hospitalAudio.playAlert();
      } else {
        updated.isAbnormal = false;
      }
      return updated;
    });
  };

  const addPrescription = (rx: PrescriptionItem) => {
    setPrescriptions(prev => [rx, ...prev]);
    setCaseSummary(prev => ({
      ...prev,
      prescriptions: [rx, ...(prev.prescriptions || [])],
    }));
    hospitalAudio.playChime();
  };

  const removePrescription = (id: string) => {
    setPrescriptions(prev => prev.filter(r => r.id !== id));
    setCaseSummary(prev => ({
      ...prev,
      prescriptions: (prev.prescriptions || []).filter(r => r.id !== id),
    }));
  };

  const addChatMessage = (text: string, sender: 'patient' | 'clinassist' | 'practitioner' = 'patient', isAudio = false) => {
    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAudio,
    };

    setChatHistory(prev => [...prev, newMsg]);

    // Run Clinical AI Decision Engine
    if (sender === 'patient') {
      const aiRes = processClinicalInput(text, symptoms);
      setSymptoms(prev => ({ ...prev, ...aiRes.extractedSymptoms }));
      setAdaptiveQuestions(aiRes.followUpQuestions);
      if (aiRes.suggestedICD10.length > 0) {
        setIcdCodes(aiRes.suggestedICD10);
      }

      if (aiRes.detectedRedFlags.length > 0) {
        setRedFlags(prev => {
          const existingIds = new Set(prev.map(rf => rf.id));
          const newFlags = aiRes.detectedRedFlags.filter(rf => !existingIds.has(rf.id));
          if (newFlags.length > 0) hospitalAudio.playAlert();
          return [...prev, ...newFlags];
        });
      }

      // Generate AI follow-up response in chat
      setTimeout(() => {
        const topQ = aiRes.followUpQuestions[0];
        const aiText = topQ
          ? topQ.questionEn
          : "Thank you. Clinical symptoms registered. Hospital triage record updated.";

        const aiMsg: ChatMessage = {
          id: 'msg-' + (Date.now() + 1),
          sender: 'clinassist',
          text: aiText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setChatHistory(prev => [...prev, aiMsg]);
        hospitalAudio.playChime();
      }, 700);
    }
  };

  const addDocument = (doc: MedicalDocument) => {
    setDocuments(prev => [doc, ...prev]);
    const newTl: TimelineEvent = {
      id: 'tl-' + Date.now(),
      date: new Date().toLocaleDateString() + ' - OCR Ingested',
      type: 'report',
      title: doc.title,
      description: doc.extractedDetails || 'Document analyzed via ClinAssist OCR.',
      badge: doc.type.toUpperCase(),
      badgeColor: 'pink',
    };
    setTimeline(prev => [newTl, ...prev]);
    hospitalAudio.playChime();
  };

  const toggleDocVerification = (docId: string) => {
    setDocuments(prev =>
      prev.map(d => (d.id === docId ? { ...d, verifiedByPractitioner: !d.verifiedByPractitioner } : d))
    );
    hospitalAudio.playPulse();
  };

  const updatePractitionerNotes = (notes: string) => {
    setCaseSummary(prev => ({ ...prev, practitionerNotes: notes }));
  };

  const togglePractitionerSignOff = () => {
    setCaseSummary(prev => {
      const nextStatus = !prev.practitionerSigned ? 'Completed' : 'Pending Review';
      if (!prev.practitionerSigned) hospitalAudio.playChime();
      return {
        ...prev,
        practitionerSigned: !prev.practitionerSigned,
        status: nextStatus,
        signedBy: !prev.practitionerSigned ? 'Dr. A. Sharma, MD (Reg #44592)' : undefined,
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
    hospitalAudio.playChime();
  };

  const loadPatientCase = (patientId: string) => {
    const foundPatient = allPatients.find(p => p.id === patientId);
    if (foundPatient) {
      setPatient(foundPatient);
      if (foundPatient.vitals) setVitals(foundPatient.vitals);
      if (foundPatient.hospitalAssignment) setHospitalAssignment(foundPatient.hospitalAssignment);
      const foundCase = recentCases.find(c => c.patientId === patientId);
      if (foundCase) {
        setCaseSummary(foundCase);
        if (foundCase.symptomsSummary) setSymptoms(foundCase.symptomsSummary);
        if (foundCase.prescriptions) setPrescriptions(foundCase.prescriptions);
        if (foundCase.icdCodes) setIcdCodes(foundCase.icdCodes);
      }
      setActiveStep(12); // Jump to Case Sheet
      hospitalAudio.playChime();
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
        vitals,
        updateVitals,
        isLiveTelemetryActive,
        setIsLiveTelemetryActive,
        soundEnabled,
        toggleSound,
        prescriptions,
        addPrescription,
        removePrescription,
        icdCodes,
        hospitalAssignment,
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
