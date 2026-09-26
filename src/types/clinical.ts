export type SupportedLanguage = 'en' | 'ta' | 'hi' | 'te' | 'ml' | 'kn' | 'th';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  isMvpFull?: boolean;
}

export interface PatientVitals {
  heartRate: number; // BPM
  bloodPressureSys: number; // mmHg
  bloodPressureDia: number; // mmHg
  spO2: number; // %
  temperature: number; // °F
  respiratoryRate: number; // /min
  bloodGlucose: number; // mg/dL
  lastUpdated: string;
  triageLevel: 'P1 - Resuscitation' | 'P2 - Emergent' | 'P3 - Urgent' | 'P4 - Routine';
  isAbnormal?: boolean;
}

export interface HospitalAssignment {
  tokenNumber: string; // e.g. #OPD-108
  department: 'General Medicine' | 'Emergency & Trauma' | 'Cardiology' | 'Pulmonology' | 'Pediatrics' | 'Infectious Diseases';
  roomBed: string; // e.g. Consultation Suite 3 / Bed B-12
  attendingDoctor: string; // e.g. Dr. A. Sharma, MD
  queueStatus: 'In Consultation' | 'Waiting in Triage' | 'Investigations Ordered' | 'Discharged';
  waitTimeMinutes: number;
}

export interface PrescriptionItem {
  id: string;
  medicineName: string;
  dosage: string;
  route: 'Oral' | 'IV' | 'IM' | 'Inhalation' | 'Topical';
  frequency: 'OD (Once Daily)' | 'BD (Twice Daily)' | 'TDS (Thrice Daily)' | 'QID (4 Times Daily)' | 'SOS (As Needed)';
  timing: 'After Food (PC)' | 'Before Food (AC)' | 'At Bedtime (HS)' | 'With Food';
  duration: string;
  instructions: string;
}

export interface ICD10Code {
  code: string;
  description: string;
  category: string;
  confidence: number; // 0-100
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  preferredLanguage: SupportedLanguage;
  emergencyContact: string;
  consent: boolean;
  registeredAt: string;
  vitals?: PatientVitals;
  hospitalAssignment?: HospitalAssignment;
}

export interface ChatMessage {
  id: string;
  sender: 'patient' | 'clinassist' | 'practitioner';
  text: string;
  timestamp: string;
  language?: SupportedLanguage;
  isAudio?: boolean;
  category?: string;
}

export interface SymptomStructure {
  id: string;
  complaint: string;
  duration: string;
  severity: number; // 1-10
  location: string;
  associatedSymptoms: string[];
  pastHistory: string;
  currentMedications: string;
  updatedAt: string;
}

export interface ExtractedMedicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  verified: boolean;
}

export interface MedicalDocument {
  id: string;
  title: string;
  type: 'prescription' | 'lab_report' | 'imaging';
  fileUrl: string;
  uploadedAt: string;
  rawText: string;
  extractedMedicines: ExtractedMedicine[];
  extractedDate: string;
  extractedDetails: string;
  verifiedByPractitioner: boolean;
  labBiomarkers?: {
    name: string;
    value: string;
    reference: string;
    status: 'Normal' | 'High' | 'Low' | 'Critical';
  }[];
}

export interface TimelineEvent {
  id: string;
  date: string;
  type: 'visit' | 'symptom' | 'report' | 'medication' | 'summary' | 'vital';
  title: string;
  description: string;
  badge: string;
  badgeColor: 'blue' | 'emerald' | 'amber' | 'purple' | 'red' | 'pink';
  details?: string[];
}

export interface RedFlagIndicator {
  id: string;
  severity: 'critical' | 'high' | 'moderate';
  category: string;
  title: string;
  description: string;
  triggerCondition: string;
  actionRequired: string;
}

export interface AdaptiveQuestion {
  id: string;
  triggerKeywords: string[];
  question: Record<SupportedLanguage, string>;
  options?: Record<SupportedLanguage, string[]>;
}

export interface CaseSummary {
  id: string;
  patientId: string;
  patientName: string;
  createdAt: string;
  status: 'Draft' | 'Pending Review' | 'Completed';
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  symptomsSummary: SymptomStructure;
  redFlagsCount: number;
  documentsCount: number;
  practitionerNotes: string;
  practitionerSigned: boolean;
  signedBy?: string;
  icdCodes?: ICD10Code[];
  prescriptions?: PrescriptionItem[];
}

export interface DashboardStats {
  totalPatients: number;
  todayCases: number;
  pendingReviews: number;
  completedCases: number;
  criticalTriageAlerts: number;
  bedOccupancyRate: number; // percentage
}
