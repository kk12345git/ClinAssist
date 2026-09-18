export type SupportedLanguage = 'en' | 'ta' | 'hi' | 'te' | 'ml' | 'kn' | 'th';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  isMvpFull?: boolean;
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
}

export interface TimelineEvent {
  id: string;
  date: string;
  type: 'visit' | 'symptom' | 'report' | 'medication' | 'summary';
  title: string;
  description: string;
  badge: string;
  badgeColor: 'blue' | 'emerald' | 'amber' | 'purple' | 'red';
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
}

export interface DashboardStats {
  totalPatients: number;
  todayCases: number;
  pendingReviews: number;
  completedCases: number;
}
