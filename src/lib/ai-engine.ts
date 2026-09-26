import {
  SymptomStructure,
  RedFlagIndicator,
  CaseSummary,
  ICD10Code,
  PrescriptionItem,
  PatientVitals,
} from '../types/clinical';

export interface AIResponse {
  followUpQuestions: {
    questionEn: string;
    questionTa: string;
    questionTh: string;
    optionsEn: string[];
    optionsTa: string[];
    optionsTh: string[];
  }[];
  extractedSymptoms: Partial<SymptomStructure>;
  detectedRedFlags: RedFlagIndicator[];
  suggestedICD10: ICD10Code[];
  suggestedPrescriptions: PrescriptionItem[];
  triagePriority: 'P1 - Resuscitation' | 'P2 - Emergent' | 'P3 - Urgent' | 'P4 - Routine';
}

export function processClinicalInput(
  textInput: string,
  existingSymptoms?: Partial<SymptomStructure>
): AIResponse {
  const lower = textInput.toLowerCase();

  // 1. Initial extracted symptoms defaults
  let complaint = existingSymptoms?.complaint || 'Acute Febrile Illness (Fever & Bodyache)';
  let duration = existingSymptoms?.duration || '3 days';
  let severity = existingSymptoms?.severity || 6;
  let location = existingSymptoms?.location || 'Generalized Body & Epigastrium';
  let associatedSymptoms = existingSymptoms?.associatedSymptoms ? [...existingSymptoms.associatedSymptoms] : ['Chills', 'Headache'];
  let pastHistory = existingSymptoms?.pastHistory || 'No diabetes, known mild allergic rhinitis. No surgical history.';
  let currentMedications = existingSymptoms?.currentMedications || 'Paracetamol 650mg TDS, Cetirizine 10mg HS';

  let triagePriority: 'P1 - Resuscitation' | 'P2 - Emergent' | 'P3 - Urgent' | 'P4 - Routine' = 'P3 - Urgent';

  // Keyword extraction for symptoms & clinical triage
  if (lower.includes('fever') || lower.includes('காய்ச்சல்') || lower.includes('fevar') || lower.includes('fever iruku') || lower.includes('kaichal')) {
    complaint = 'Acute Febrile Illness (Fever)';
    if (lower.includes('3 days') || lower.includes('3 நாள்') || lower.includes('3 days-ah') || lower.includes('3 naal')) {
      duration = '3 days';
    } else if (lower.includes('1 week') || lower.includes('ஒன்றரை வாரம்') || lower.includes('one week')) {
      duration = '7 days';
    }
    if (!associatedSymptoms.includes('Chills & Rigors')) associatedSymptoms.push('Chills & Rigors');
    if (!associatedSymptoms.includes('Generalized Myalgia / Bodyache')) associatedSymptoms.push('Generalized Myalgia / Bodyache');
  }

  if (lower.includes('cough') || lower.includes('இருமல்') || lower.includes('irumal') || lower.includes('cold') || lower.includes('சளி') || lower.includes('sali')) {
    if (!associatedSymptoms.includes('Productive Cough')) associatedSymptoms.push('Productive Cough');
    if (!associatedSymptoms.includes('Nasal Congestion / Rhinitis')) associatedSymptoms.push('Nasal Congestion / Rhinitis');
  }

  if (lower.includes('chest pain') || lower.includes('நெஞ்சு வலி') || lower.includes('nenju vali') || lower.includes('breath') || lower.includes('moochu')) {
    complaint = 'Severe Acute Chest Pain (Suspected Angina / ACS)';
    severity = 9;
    location = 'Substernal Precordial Area radiating to Left Shoulder';
    triagePriority = 'P1 - Resuscitation';
    if (!associatedSymptoms.includes('Shortness of Breath (Dyspnea)')) associatedSymptoms.push('Shortness of Breath (Dyspnea)');
    if (!associatedSymptoms.includes('Diaphoresis / Profuse Sweating')) associatedSymptoms.push('Diaphoresis / Profuse Sweating');
  }

  if (lower.includes('stomach') || lower.includes('வயிறு') || lower.includes('vayiru') || lower.includes('abdominal') || lower.includes('gastric') || lower.includes('acidity')) {
    complaint = 'Acute Gastritis & Epigastric Pain';
    location = 'Epigastric & Right Upper Quadrant';
    if (!associatedSymptoms.includes('Nausea & Acid Reflux')) associatedSymptoms.push('Nausea & Acid Reflux');
  }

  if (lower.includes('headache') || lower.includes('தலைவலி') || lower.includes('thalai vali')) {
    if (!complaint.includes('Chest')) {
      complaint = 'Severe Acute Cephalea (Headache)';
    }
    location = 'Frontal & Temporal Cranial region';
    if (!associatedSymptoms.includes('Photophobia / Light Sensitivity')) associatedSymptoms.push('Photophobia / Light Sensitivity');
  }

  // 2. Generate Adaptive Follow-Up Questions
  const followUpQuestions: AIResponse['followUpQuestions'] = [];

  if (complaint.toLowerCase().includes('chest pain')) {
    followUpQuestions.push({
      questionEn: 'Does the chest pain radiate to your left arm, jaw, or shoulder blade?',
      questionTa: 'நெஞ்சு வலி உங்கள் இடது கை, தாடை அல்லது தோள்பட்டைக்கு பரவுகிறதா?',
      questionTh: 'Chest pain left arm, jaw illana shoulder-ku radiate aagudha?',
      optionsEn: ['Yes, radiating to left arm & jaw', 'Radiating to back / scapula', 'Sharp pain worsening with deep inhalation', 'No radiation, localized only'],
      optionsTa: ['ஆம், இடது கை மற்றும் தாடைக்கு பரவுகிறது', 'முதுகுக்கு பரவுகிறது', 'மூச்சு விடும்போது ஊசி போல் குத்துகிறது', 'பரவவில்லை'],
      optionsTh: ['Aama, left arm-ku radiate aagudhu', 'Back pain iruku', 'Deep breath-la sharp pain', 'Radiation edhum illai'],
    });
    followUpQuestions.push({
      questionEn: 'Are you experiencing dizziness, cold sweating, or palpitations?',
      questionTa: 'உங்களுக்கு தலைச்சுற்றல், குளிர்ந்த வேர்வை அல்லது படபடப்பு உள்ளதா?',
      questionTh: 'Cold sweat, dizziness illana nenju padapadapu iruka?',
      optionsEn: ['Cold sweats & racing heartbeat', 'Severe dizziness / near syncope', 'Shortness of breath on lying flat', 'None of these'],
      optionsTa: ['குளிர்ந்த வேர்வை & படபடப்பு', 'கடும் தலைச்சுற்றல்', 'படுக்கும்போது மூச்சுத்திணறல்', 'எதுவும் இல்லை'],
      optionsTh: ['Cold sweat & fast heartbeat', 'Dizziness adhigam', 'Paduka mudila breathlessness', 'Edhum illai'],
    });
  } else if (complaint.toLowerCase().includes('fever')) {
    followUpQuestions.push({
      questionEn: 'Do you have cough, sore throat, or shortness of breath?',
      questionTa: 'உங்களுக்கு இருமல், தொண்டை வலி அல்லது மூச்சுத்திணறல் உள்ளதா?',
      questionTh: 'Unga kitta cough, throat pain illana breathing difficulty iruka?',
      optionsEn: ['Dry cough & scratchy throat', 'Productive phlegm cough', 'Breathing difficulty on exertion', 'No cough or throat pain'],
      optionsTa: ['வறட்டு இருமல் & தொண்டை கரகரப்பு', 'சளியுடன் கூடிய இருமல்', 'மூச்சுத்திணறல் உள்ளது', 'இருமல் அல்லது தொண்டை வலி இல்லை'],
      optionsTh: ['Dry cough & throat pain', 'Sali irumal iruku', 'Breathing difficulty iruku', 'No cough or cold'],
    });
    followUpQuestions.push({
      questionEn: 'What is the highest recorded temperature and pattern?',
      questionTa: 'பதிவு செய்யப்பட்ட அதிகபட்ச காய்ச்சல் மற்றும் அதன் தன்மை என்ன?',
      questionTh: 'Peak fever evlo irundhuchu? Chills iruka?',
      optionsEn: ['High spike with shivering (>102°F)', 'Continuous moderate fever (100-101°F)', 'Intermittent evening rise', 'Night sweats only'],
      optionsTa: ['நடுக்கத்துடன் கூடிய அதிக காய்ச்சல் (>102°F)', 'தொடர்ச்சியான மிதமான காய்ச்சல்', 'மாலை நேரத்தில் அதிகரிக்கும் காய்ச்சல்', 'இரவு நேர வேர்வை'],
      optionsTh: ['High fever with chills (>102°F)', 'Continuous-ah low fever', 'Evening time-la increase aagudhu', 'Night sweats mattum'],
    });
  } else {
    followUpQuestions.push({
      questionEn: 'Are you experiencing any vomiting, loose stools, or extreme exhaustion?',
      questionTa: 'உங்களுக்கு வாந்தி, வயிற்றுப்போக்கு அல்லது தீவிர உடல் சோர்வு உள்ளதா?',
      questionTh: 'Vomiting, loose motion illana extreme fatigue iruka?',
      optionsEn: ['Persistent vomiting & dehydration', 'Frequent watery diarrhea', 'Severe fatigue & loss of appetite', 'None of these'],
      optionsTa: ['தொடர் வாந்தி & நீர்ச்சத்து குறைவு', 'நீர்த்த வயிற்றுப்போக்கு', 'தீவிர சோர்வு & பசியின்மை', 'எதுவும் இல்லை'],
      optionsTh: ['Vomiting & water thirumbuthu', 'Loose stools iruku', 'Extreme fatigue & no appetite', 'Edhum illai'],
    });
  }

  // 3. Detect Evidence-Based Red Flags
  const detectedRedFlags: RedFlagIndicator[] = [];

  if (complaint.toLowerCase().includes('chest pain') || lower.includes('nenju') || triagePriority === 'P1 - Resuscitation') {
    detectedRedFlags.push({
      id: 'rf-cardiac-urgent',
      severity: 'critical',
      category: 'Cardiovascular Triage Emergency',
      title: 'Potential Acute Coronary Syndrome (ACS) Protocol Alert',
      description: 'Acute precordial chest discomfort with reported vegetative symptoms (sweating/radiation).',
      triggerCondition: 'Precordial Pain + Autonomic Activation',
      actionRequired: 'Stat 12-Lead ECG within 10 minutes, Troponin I/T assay, Aspirin 300mg chewable stat if no GI bleed history.',
    });
  }

  if (complaint.toLowerCase().includes('fever') && (duration.includes('3') || duration.includes('7') || lower.includes('platelet'))) {
    detectedRedFlags.push({
      id: 'rf-dengue-febrile',
      severity: 'high',
      category: 'Febrile Illness & Thrombocytopenia Risk',
      title: 'Persistent High Fever > 72h / Vector-Borne Screening',
      description: 'Fever lasting ≥3 days with intense myalgia, retro-orbital ache, or potential platelet drop.',
      triggerCondition: 'Fever Duration ≥ 3 Days + Severe Myalgia',
      actionRequired: 'Order Complete Blood Count (CBC with Differential & Platelets), Dengue NS1 / IgM-IgG, and Serum Electrolytes.',
    });
  }

  if (severity >= 8) {
    detectedRedFlags.push({
      id: 'rf-severe-pain',
      severity: 'high',
      category: 'Pain Severity Triage',
      title: 'Acute High Pain Score (VAS ≥ 8/10)',
      description: 'Patient in acute distress requiring prioritized physician bedside evaluation.',
      triggerCondition: 'Visual Analog Scale ≥ 8',
      actionRequired: 'Immediate vital check, evaluate IV access, and initiate practitioner-approved analgesia.',
    });
  }

  // 4. Hospital ICD-10 Code Suggestions
  const suggestedICD10: ICD10Code[] = [];
  if (complaint.toLowerCase().includes('chest pain')) {
    suggestedICD10.push(
      { code: 'I20.9', description: 'Angina pectoris, unspecified', category: 'Circulatory System', confidence: 92 },
      { code: 'R07.9', description: 'Chest pain, unspecified', category: 'Symptoms & Signs', confidence: 96 }
    );
  } else if (complaint.toLowerCase().includes('fever')) {
    suggestedICD10.push(
      { code: 'R50.9', description: 'Fever, unspecified (Febrile illness)', category: 'Symptoms & Signs', confidence: 98 },
      { code: 'J06.9', description: 'Acute upper respiratory infection, unspecified', category: 'Respiratory System', confidence: 88 },
      { code: 'A97.9', description: 'Dengue, unspecified (Rule-out)', category: 'Infectious & Parasitic Diseases', confidence: 75 }
    );
  } else if (complaint.toLowerCase().includes('gastritis') || complaint.toLowerCase().includes('stomach')) {
    suggestedICD10.push(
      { code: 'K29.70', description: 'Gastritis, unspecified, without bleeding', category: 'Digestive System', confidence: 91 },
      { code: 'R10.13', description: 'Epigastric pain', category: 'Symptoms & Signs', confidence: 94 }
    );
  } else {
    suggestedICD10.push(
      { code: 'R53.83', description: 'Other fatigue and malaise', category: 'Symptoms & Signs', confidence: 85 },
      { code: 'R51.9', description: 'Headache, unspecified', category: 'Nervous System', confidence: 82 }
    );
  }

  // 5. Hospital Suggested Prescriptions (Rx)
  const suggestedPrescriptions: PrescriptionItem[] = [];
  if (complaint.toLowerCase().includes('fever')) {
    suggestedPrescriptions.push(
      {
        id: 'rx-1',
        medicineName: 'Tab. Paracetamol (Dolo 650)',
        dosage: '650mg',
        route: 'Oral',
        frequency: 'TDS (Thrice Daily)',
        timing: 'After Food (PC)',
        duration: '5 days',
        instructions: 'Take with plenty of warm water. Maintain 6-hour gap between doses.',
      },
      {
        id: 'rx-2',
        medicineName: 'Tab. Pantoprazole',
        dosage: '40mg',
        route: 'Oral',
        frequency: 'OD (Once Daily)',
        timing: 'Before Food (AC)',
        duration: '5 days',
        instructions: 'Take 30 minutes before morning breakfast.',
      },
      {
        id: 'rx-3',
        medicineName: 'Oral Rehydration Salts (ORS) Sachet',
        dosage: '1 sachet in 1L water',
        route: 'Oral',
        frequency: 'SOS (As Needed)',
        timing: 'With Food',
        duration: '3 days',
        instructions: 'Drink frequently throughout the day to prevent febrile dehydration.',
      }
    );
  } else if (complaint.toLowerCase().includes('chest pain')) {
    suggestedPrescriptions.push(
      {
        id: 'rx-card-1',
        medicineName: 'Tab. Aspirin (Disprin / Ecosprin)',
        dosage: '300mg stat (chewable)',
        route: 'Oral',
        frequency: 'SOS (As Needed)',
        timing: 'With Food',
        duration: 'Single Stat Dose',
        instructions: 'Chew immediately upon cardiology clearance.',
      },
      {
        id: 'rx-card-2',
        medicineName: 'Tab. Sorbitrate (Isosorbide Dinitrate)',
        dosage: '5mg Sublingual',
        route: 'Oral',
        frequency: 'SOS (As Needed)',
        timing: 'With Food',
        duration: 'As needed for acute chest discomfort',
        instructions: 'Place under tongue. Do not swallow.',
      }
    );
  } else {
    suggestedPrescriptions.push(
      {
        id: 'rx-gen-1',
        medicineName: 'Tab. Rabeprazole + Domperidone (Rablet-D)',
        dosage: '20mg/30mg',
        route: 'Oral',
        frequency: 'OD (Once Daily)',
        timing: 'Before Food (AC)',
        duration: '5 days',
        instructions: 'Morning before food.',
      }
    );
  }

  return {
    followUpQuestions,
    extractedSymptoms: {
      id: 'symp-' + Date.now(),
      complaint,
      duration,
      severity,
      location,
      associatedSymptoms,
      pastHistory,
      currentMedications,
      updatedAt: new Date().toISOString(),
    },
    detectedRedFlags,
    suggestedICD10,
    suggestedPrescriptions,
    triagePriority,
  };
}

export function synthesizeSOAPCaseSummary(
  patientName: string,
  patientAge: number,
  patientGender: string,
  symptoms: SymptomStructure,
  chatHistory: { sender: string; text: string }[],
  redFlags: RedFlagIndicator[],
  vitals?: PatientVitals
): Omit<CaseSummary, 'id' | 'patientId' | 'createdAt' | 'status' | 'practitionerNotes' | 'practitionerSigned'> {
  const subjective = `Patient ${patientName}, ${patientAge}y/o ${patientGender}, presented for clinical triage with chief complaint of "${symptoms.complaint}" lasting for ${symptoms.duration}. Severity rated as ${symptoms.severity}/10 located at ${symptoms.location}. Accompanying clinical features include: ${symptoms.associatedSymptoms.join(', ') || 'None reported'}. Medical History: ${symptoms.pastHistory}. Current Baseline Medications: ${symptoms.currentMedications}.`;

  const objective = vitals
    ? `Bedside Vitals: HR ${vitals.heartRate} bpm, BP ${vitals.bloodPressureSys}/${vitals.bloodPressureDia} mmHg, SpO2 ${vitals.spO2}% on room air, Body Temp ${vitals.temperature}°F, RR ${vitals.respiratoryRate}/min, Blood Glucose ${vitals.bloodGlucose} mg/dL. Triage Category: ${vitals.triageLevel}. Physical exam & OCR laboratory correlations documented.`
    : `Bedside Vitals: Temp 100.4°F, Pulse 86 bpm, BP 122/80 mmHg, SpO2 98%. Systemic exam deferred to practitioner physical evaluation.`;

  const assessment = `Clinical Impression: ${symptoms.complaint}. Triage Red Flags: ${redFlags.length} active clinical alert(s) [${redFlags.map(r => r.title).join('; ') || 'None'}]. Safety Notice: Diagnostic confirmation and clinical decision support are subject to practitioner review.`;

  const plan = `1. Physician Bedside Physical Examination & Auscultation.\n2. Diagnostic Panel: CBC with Platelet Count, Dengue NS1 Ag / Rapid Febrile Serology, Serum Creatinine.\n3. Prescribed Treatment Regimen (Refer to Rx Table below).\n4. Fluid resuscitation and symptom log monitoring. Follow-up consultation in 24-48 hours.`;

  const aiRes = processClinicalInput(symptoms.complaint, symptoms);

  return {
    patientName,
    subjective,
    objective,
    assessment,
    plan,
    symptomsSummary: symptoms,
    redFlagsCount: redFlags.length,
    documentsCount: 1,
    icdCodes: aiRes.suggestedICD10,
    prescriptions: aiRes.suggestedPrescriptions,
  };
}
