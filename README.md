# 🏥 ClinAssist — Hospital Clinical Decision Support & Intelligent Intake Platform
### Enterprise Hospital Workstation v2.0 • Premium White & Pink Clinical Aesthetics

ClinAssist is a modern, real-time clinical AI intake, triage telemetry, and decision support platform engineered for hospitals, medical colleges, multi-specialty clinics, and emergency departments.

---

## 🌟 What's New in Version 2.0

### 1. 🎨 Premium White with Pink Finish Clinical UI
- **Porcelain White Canvas (`#FAFAFD`)** with delicate rose borders, pink ambient glows, and clean medical surfaces.
- **Tailored Rose / Blush Accents (`#F43F5E`, `#E11D48`, `#FDA4AF`)** providing a warm, high-end healthcare aesthetic.
- **Custom Rose-Themed Medical Scrollbars & Cards** with gentle micro-interactions.
- **Native Hospital EMR Print Stylesheet** for zero-margin clinical case sheet printouts.

### 2. ⚡ Real-Time Hospital Telemetry & Bedside Triage
- **Live Vital Signs Stream**: Continuous monitoring of Heart Rate (BPM with live animated ECG heartbeat wave), Blood Pressure (Sys/Dia), SpO2 (%), Temperature (°F), and Respiratory Rate.
- **Real-Time Telemetry Simulation Toggle**: Simulates live bedside telemetry updates.
- **Emergency Severity Index (ESI) & Triage Scoring**: Automatic prioritization (P1 - Resuscitation, P2 - Emergent, P3 - Urgent, P4 - Routine).
- **Web Audio Hospital Synthesizer**: Native zero-dependency audio alerts for vital warnings, pulse clicks, and chime feedback.

### 3. 🎙️ Ambient Voice Case-Taking & Multilingual Clinical NLP
- **Indic Dialect Support**: Full voice and text intake across **Tamil (தமிழ்), Thanglish (Tamil+English), English, and Hindi**.
- **Browser Web Speech API Dictation**: Real-time microphone speech-to-text dictation with audio wave visualization.
- **Interactive Speech Synthesis (Text-to-Speech)**: Clinicians and patients can listen to AI clinical prompts read aloud in native accents.
- **Dynamic Entity Extraction**: Instant parsing of Chief Complaints, Duration, Location, Pain Scale (VAS 1-10), and Associated Symptoms.

### 4. 📋 12-Step Hospital Clinical Workflow
1. **Hospital Welcome & Triage Lobby** — Department routing & institutional compliance badges.
2. **Language Engine** — Dialect selection with voice test previews.
3. **Hospital OPD Registration** — Token generation (`#OPD-108`), department & bed allocation, informed consent.
4. **Ambient Voice Case-Taking** — Real-time conversational intake stream.
5. **Adaptive Clinical Decision Questions** — Evidence-based rule-out queries.
6. **Structured Symptoms & VAS Pain Scale** — Medical history & baseline medication reconciliation.
7. **Document Intelligence & Lab OCR** — Automatic ingestion of CBC blood tests, Dengue panels, and prescription pads with biomarker comparison.
8. **Longitudinal Patient Timeline** — Chronological record of hospital visits, lab results, and telemetry.
9. **Clinical Safety & Red-Flag CDS** — Statutory medical disclaimer and algorithmic alerts (e.g. Sepsis, ACS protocol).
10. **Structured SOAP Synthesis & ICD-10 Coding** — Auto-generated Subjective, Objective, Assessment, and Plan notes with ICD-10 diagnostic classifications.
11. **Doctor Clinical Dashboard** — Hospital ward bed occupancy, pending reviews, MIS JSON/CSV exports.
12. **Certified Hospital Case Sheet** — NABH-compliant letterhead with QR code verification, prescription (Rx) table, and physician digital signature stamp.

---

## 🚀 Tech Stack

- **Framework**: [Next.js 16 (Turbopack, App Router)](https://nextjs.org/)
- **UI & Styling**: Vanilla CSS + Tailwind CSS v4
- **Language**: TypeScript 5
- **Icons**: Lucide React
- **PDF Generation**: jsPDF + HTML2Canvas
- **Audio Synthesizer**: Web Audio API + Web Speech API (zero external assets)

---

## 🛠️ Getting Started

```bash
# Clone the repository
git clone https://github.com/kk12345git/ClinAssist.git

# Navigate to project folder
cd ClinAssist

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License & Compliance

ClinAssist is designed for healthcare decision support. Final diagnostic and treatment decisions are reserved exclusively for licensed medical practitioners.
