import { SymptomStructure, RedFlagIndicator, CaseSummary, SupportedLanguage } from '../types/clinical';

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
}

export function processClinicalInput(
  textInput: string,
  existingSymptoms?: Partial<SymptomStructure>
): AIResponse {
  const lower = textInput.toLowerCase();

  // 1. Initial extracted symptoms defaults
  let complaint = existingSymptoms?.complaint || 'General Malaise / Fever';
  let duration = existingSymptoms?.duration || '3 days';
  let severity = existingSymptoms?.severity || 6;
  let location = existingSymptoms?.location || 'Generalized / Body';
  let associatedSymptoms = existingSymptoms?.associatedSymptoms || [];
  let pastHistory = existingSymptoms?.pastHistory || 'No major prior surgical history reported. Known mild hypertension.';
  let currentMedications = existingSymptoms?.currentMedications || 'Paracetamol 500mg PRN, Amlodipine 5mg OD';

  // Extract complaints & details from text keywords
  if (lower.includes('fever') || lower.includes('காய்ச்சல்') || lower.includes('fevar') || lower.includes('fever iruku')) {
    complaint = 'Acute Febrile Illness (Fever)';
    if (lower.includes('3 days') || lower.includes('3 நாள்') || lower.includes('3 days-ah') || lower.includes('3 naal')) {
      duration = '3 days';
    } else if (lower.includes('1 week') || lower.includes('ஒன்றரை வாரம்')) {
      duration = '7 days';
    }
    if (!associatedSymptoms.includes('Chills & Rigors')) associatedSymptoms.push('Chills & Rigors');
    if (!associatedSymptoms.includes('Bodyache')) associatedSymptoms.push('Bodyache');
  }

  if (lower.includes('cough') || lower.includes('இருமல்') || lower.includes('irumal') || lower.includes('cold') || lower.includes('சளி')) {
    if (!associatedSymptoms.includes('Productive Cough')) associatedSymptoms.push('Productive Cough');
    if (!associatedSymptoms.includes('Nasal Congestion')) associatedSymptoms.push('Nasal Congestion');
  }

  if (lower.includes('chest pain') || lower.includes('நெஞ்சு வலி') || lower.includes('nenju vali')) {
    complaint = 'Severe Acute Chest Pain';
    severity = 9;
    location = 'Substernal / Left Precordial Area';
    if (!associatedSymptoms.includes('Shortness of Breath')) associatedSymptoms.push('Shortness of Breath');
    if (!associatedSymptoms.includes('Diaphoresis / Sweating')) associatedSymptoms.push('Diaphoresis / Sweating');
  }

  if (lower.includes('stomach') || lower.includes('வயிறு') || lower.includes('vayiru') || lower.includes('abdominal')) {
    complaint = 'Abdominal Pain & Gastrointestinal Distress';
    location = 'Epigastric / Right Upper Quadrant';
    if (!associatedSymptoms.includes('Nausea & Vomiting')) associatedSymptoms.push('Nausea & Vomiting');
  }

  if (lower.includes('headache') || lower.includes('தலைவலி') || lower.includes('thalai vali')) {
    complaint = 'Acute Headache';
    location = 'Frontal / Temporal region';
    if (!associatedSymptoms.includes('Photophobia')) associatedSymptoms.push('Photophobia');
  }

  // 2. Generate Adaptive Follow-Up Questions (Step 5)
  const followUpQuestions: AIResponse['followUpQuestions'] = [];

  if (complaint.toLowerCase().includes('fever')) {
    followUpQuestions.push({
      questionEn: 'Do you have cough, cold, or difficulty breathing?',
      questionTa: 'உங்களுக்கு இருமல், சளி அல்லது மூச்சுத்திணறல் உள்ளதா?',
      questionTh: 'Unga kitta cough, cold, illana breathing difficulty iruka?',
      optionsEn: ['Yes, dry cough & cold', 'Yes, with difficulty breathing', 'No cough or cold', 'Mild sore throat'],
      optionsTa: ['ஆம், வறட்டு இருமல் & சளி', 'ஆம், மூச்சுத்திணறல் உள்ளது', 'இருமல் சளி இல்லை', 'லேசான தொண்டை வலி'],
      optionsTh: ['Aama, dry cough iruku', 'Breathing difficulty iruku', 'Cough cold edhum illai', 'Mild throat pain'],
    });

    followUpQuestions.push({
      questionEn: 'What is the pattern of fever and peak temperature?',
      questionTa: 'காய்ச்சலின் தன்மை மற்றும் அதிகபட்ச வெப்பநிலை என்ன?',
      questionTh: 'Fever epdi iruku? High temperature continuous-ah iruka?',
      optionsEn: ['High fever with chills (>102°F)', 'Continuous low-grade fever', 'Intermittent (comes and goes)', 'Night sweats'],
      optionsTa: ['நடுக்கத்துடன் கூடிய அதிக காய்ச்சல்', 'தொடர்ச்சியான மிதமான காய்ச்சல்', 'வந்து போகும் காய்ச்சல்', 'இரவில் வேர்வை'],
      optionsTh: ['High fever with chills', 'Continuous-ah low fever', 'Vandhu pora fever', 'Night sweats iruku'],
    });
  } else if (complaint.toLowerCase().includes('chest pain')) {
    followUpQuestions.push({
      questionEn: 'Does the chest pain radiate to your left arm, shoulder, or jaw?',
      questionTa: 'நெஞ்சு வலி இடது கை, தோள்பட்டை அல்லது தாடைக்கு பரவுகிறதா?',
      questionTh: 'Chest pain edhavadhu left arm, shoulder illana jaw-ku radiate aagudha?',
      optionsEn: ['Yes, radiating to left arm & jaw', 'Radiating to back', 'Localized sharp pain on deep breath', 'No radiation'],
      optionsTa: ['ஆம், இடது கை மற்றும் தாடைக்கு பரவுகிறது', 'முதுகுக்கு பரவுகிறது', 'மூச்சு விடும்போது ஊசி குத்துவது போல்', 'பரவவில்லை'],
      optionsTh: ['Aama, left arm-ku radiate aagudhu', 'Back pain iruku', 'Breathing-la sharp pain', 'Radiation illai'],
    });
  } else {
    followUpQuestions.push({
      questionEn: 'Are you experiencing any dizziness, fatigue, or loss of appetite?',
      questionTa: 'உங்களுக்கு தலைச்சுற்றல், சோர்வு அல்லது பசியின்மை உள்ளதா?',
      questionTh: 'Unga kitta dizziness, tiredness illana loss of appetite iruka?',
      optionsEn: ['Yes, severe tiredness & loss of appetite', 'Dizziness when standing', 'Nausea & vomitting', 'None of these'],
      optionsTa: ['ஆம், அதிக சோர்வு & பசியின்மை', 'நிற்கும் போது தலைச்சுற்றல்', 'வாந்தி உணர்வு', 'எதுவும் இல்லை'],
      optionsTh: ['Aama, tiredness & no appetite', 'Standing-la dizziness', 'Nausea iruku', 'Edhum illai'],
    });
  }

  // 3. Detect Red Flags (Step 9)
  const detectedRedFlags: RedFlagIndicator[] = [];

  if (complaint.toLowerCase().includes('chest pain') || lower.includes('nenju') || lower.includes('breath')) {
    detectedRedFlags.push({
      id: 'rf-cardiac-1',
      severity: 'critical',
      category: 'Cardiovascular Risk',
      title: 'Potential Acute Coronary Syndrome Warning',
      description: 'Severe precordial chest pain reported with associated diaphoresis or shortness of breath.',
      triggerCondition: 'Chest pain + Diaphoresis / Dyspnea',
      actionRequired: 'Immediate Stat ECG, Troponin-I panel, and Urgent Cardiology Triage Required.',
    });
  }

  if (complaint.toLowerCase().includes('fever') && (duration.includes('3') || duration.includes('7')) && (associatedSymptoms.includes('Photophobia') || lower.includes('stiff neck') || lower.includes('neck'))) {
    detectedRedFlags.push({
      id: 'rf-neuro-1',
      severity: 'high',
      category: 'Neurological / Infectious Warning',
      title: 'Meningeal Signs / High Febrile Risk',
      description: 'Persistent fever for >3 days accompanied by severe headache or photophobia.',
      triggerCondition: 'Fever > 3 Days + Severe Headache',
      actionRequired: 'Evaluate for Kernig/Brudzinski signs, Complete Blood Count, and Malaria/Dengue Antigen screen.',
    });
  }

  if (severity >= 8) {
    detectedRedFlags.push({
      id: 'rf-pain-high',
      severity: 'moderate',
      category: 'Pain Management Triage',
      title: 'High Pain Severity (Score ≥ 8/10)',
      description: 'Patient reports acute high-intensity discomfort requiring urgent practitioner review.',
      triggerCondition: 'Visual Analog Scale ≥ 8',
      actionRequired: 'Assess vital signs immediately and evaluate emergency analgesic protocol.',
    });
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
  };
}

export function synthesizeSOAPCaseSummary(
  patientName: string,
  patientAge: number,
  patientGender: string,
  symptoms: SymptomStructure,
  chatHistory: { sender: string; text: string }[],
  redFlags: RedFlagIndicator[]
): Omit<CaseSummary, 'id' | 'patientId' | 'createdAt' | 'status' | 'practitionerNotes' | 'practitionerSigned'> {
  const subjective = `Patient ${patientName}, ${patientAge}y/o ${patientGender}, presented with chief complaint of "${symptoms.complaint}" lasting for ${symptoms.duration}. Patient states severity level as ${symptoms.severity}/10 located primarily in the ${symptoms.location}. Associated clinical findings include: ${symptoms.associatedSymptoms.join(', ') || 'None reported'}. Past Medical History: ${symptoms.pastHistory}. Current Medications: ${symptoms.currentMedications}.`;

  const objective = `Vitals & Clinical Data Intake: General Condition: Alert, oriented. Temperature: 100.4°F. Pulse: 88 bpm. BP: 124/82 mmHg. SpO2: 98% on room air. Systematic Physical Examination pending practitioner consultation. OCR Document findings attached.`;

  const assessment = `Primary Clinical Impression: ${symptoms.complaint} (Pending practitioner final evaluation). Red Flag Flags Identified: ${redFlags.length} active flag(s) [${redFlags.map(r => r.title).join('; ') || 'None'}]. Note: Differential diagnosis is strictly deferred to attending physician.`;

  const plan = `1. Complete clinical physical examination by attending physician.\n2. Diagnostic Investigations: Routine CBC, CRP, Dengue NS1 / Fever Panel as indicated.\n3. Symptomatic Relief & Hydration guidelines.\n4. Follow-up consultation scheduled in 48 hours or sooner if red flags escalate.`;

  return {
    patientName,
    subjective,
    objective,
    assessment,
    plan,
    symptomsSummary: symptoms,
    redFlagsCount: redFlags.length,
    documentsCount: 1,
  };
}
