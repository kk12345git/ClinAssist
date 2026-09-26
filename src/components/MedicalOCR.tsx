'use client';

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { usePatient } from '../context/PatientContext';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Check,
  Eye,
  Sparkles,
  ArrowRight,
  Pill,
  Calendar,
  AlertCircle,
  FileCheck,
  RefreshCw,
  FlaskConical,
  Camera,
} from 'lucide-react';
import { MedicalDocument, ExtractedMedicine } from '../types/clinical';
import { hospitalAudio } from '../lib/hospital-audio';

export const MedicalOCR: React.FC = () => {
  const { t } = useLanguage();
  const { documents, addDocument, toggleDocVerification, setActiveStep } = usePatient();

  const [isScanning, setIsScanning] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<MedicalDocument | null>(documents[0] || null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    hospitalAudio.playPulse();

    setTimeout(() => {
      const isPrescription = file.name.toLowerCase().includes('presc');
      const newDoc: MedicalDocument = {
        id: 'doc-' + Date.now(),
        title: file.name || 'Hospital Clinical Investigation Sheet.pdf',
        type: isPrescription ? 'prescription' : 'lab_report',
        fileUrl: URL.createObjectURL(file),
        uploadedAt: new Date().toLocaleString(),
        rawText: `APOLLO HOSPITALS CENTRAL LABS\nConsultant: Dr. K. Swaminathan, MD (Internal Med) - Reg #55120\nRx: Tab Amoxicillin 500mg BD x 5 days (Oral PC)\nTab Paracetamol 650mg TDS x 3 days\nWBC Count: 11,200 /cu.mm (Ref: 4,000-11,000)\nPlatelet Count: 2.10 Lakhs/cu.mm (Ref: 1.5-4.5L)\nCRP: 12.0 mg/L (High > 5.0)\nImpression: Acute upper respiratory bacterial-viral overlap.`,
        extractedMedicines: [
          { id: 'm-new-1', name: 'Amoxicillin', dosage: '500mg', frequency: 'Twice daily (BD)', duration: '5 days', verified: false },
          { id: 'm-new-2', name: 'Paracetamol', dosage: '650mg', frequency: 'Three times daily (TDS)', duration: '3 days', verified: false },
        ],
        extractedDate: new Date().toLocaleDateString(),
        extractedDetails: 'WBC Count: 11,200/cu.mm (Mild leukocytosis). CRP: 12 mg/L (Elevated inflammatory marker). Platelets adequate.',
        verifiedByPractitioner: false,
        labBiomarkers: [
          { name: 'Total WBC Count', value: '11,200 /cu.mm', reference: '4,000 - 11,000', status: 'High' },
          { name: 'Platelet Count', value: '2.10 Lakhs/cu.mm', reference: '1.5 - 4.5 Lakhs', status: 'Normal' },
          { name: 'C-Reactive Protein (CRP)', value: '12.0 mg/L', reference: '< 5.0 mg/L', status: 'High' },
          { name: 'Hemoglobin', value: '13.8 g/dL', reference: '13.0 - 17.0', status: 'Normal' },
        ],
      };

      addDocument(newDoc);
      setSelectedDoc(newDoc);
      setIsScanning(false);
      setUploadSuccess(true);
      hospitalAudio.playChime();
      setTimeout(() => setUploadSuccess(false), 3000);
    }, 1800);
  };

  const loadSampleDoc = (type: 'cbc' | 'prescription' | 'xray') => {
    setIsScanning(true);
    hospitalAudio.playPulse();

    setTimeout(() => {
      let sample: MedicalDocument;
      if (type === 'cbc') {
        sample = {
          id: 'doc-cbc-' + Date.now(),
          title: 'CBC & Dengue Serology Panel - Apollo Labs.pdf',
          type: 'lab_report',
          fileUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
          uploadedAt: new Date().toLocaleString(),
          rawText: `CENTRAL PATHOLOGY - Patient: Karthik Raja (34M)\nComplete Blood Count with Platelet Trajectory\nPlatelets: 1.85 Lakhs/cu.mm [Normal 1.5 - 4.5L]\nHb: 14.2 g/dL [Normal 13.0 - 17.5]\nDengue NS1 Antigen: NEGATIVE\nSerum Creatinine: 0.9 mg/dL`,
          extractedMedicines: [],
          extractedDate: '26 Sept 2026',
          extractedDetails: 'Complete Blood Count within normal limits. Dengue NS1 Negative. No urgent thrombocytopenia.',
          verifiedByPractitioner: true,
          labBiomarkers: [
            { name: 'Platelet Count', value: '1.85 Lakhs/cu.mm', reference: '1.5 - 4.5 Lakhs', status: 'Normal' },
            { name: 'Hemoglobin', value: '14.2 g/dL', reference: '13.0 - 17.5 g/dL', status: 'Normal' },
            { name: 'Dengue NS1 Ag', value: 'Negative', reference: 'Negative', status: 'Normal' },
            { name: 'Serum Creatinine', value: '0.9 mg/dL', reference: '0.7 - 1.2 mg/dL', status: 'Normal' },
          ],
        };
      } else if (type === 'prescription') {
        sample = {
          id: 'doc-rx-' + Date.now(),
          title: 'Dr. Ramanathan OPD Prescription Pad.png',
          type: 'prescription',
          fileUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
          uploadedAt: new Date().toLocaleString(),
          rawText: `OPD CLINICAL NOTE - Dr. S. Ramanathan, MD (Gen Med)\nRx:\n1. Tab Dolo 650mg TDS x 5 days\n2. Tab Pantocid 40mg OD AC x 5 days\n3. Sachet Electral ORS in 1L water SOS`,
          extractedMedicines: [
            { id: 'm-p1', name: 'Dolo (Paracetamol)', dosage: '650mg', frequency: 'Three times daily (TDS)', duration: '5 days', verified: true },
            { id: 'm-p2', name: 'Pantocid (Pantoprazole)', dosage: '40mg', frequency: 'Once daily before food (OD AC)', duration: '5 days', verified: true },
            { id: 'm-p3', name: 'Electral ORS', dosage: '1 Sachet in 1L', frequency: 'SOS (As Needed)', duration: '3 days', verified: true },
          ],
          extractedDate: '26 Sept 2026',
          extractedDetails: '3 Medications successfully extracted from handwriting via AI OCR.',
          verifiedByPractitioner: true,
        };
      } else {
        sample = {
          id: 'doc-xr-' + Date.now(),
          title: 'Chest Radiograph (PA View) Report.pdf',
          type: 'imaging',
          fileUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
          uploadedAt: new Date().toLocaleString(),
          rawText: `DEPARTMENT OF RADIOLOGY\nExamination: Chest X-Ray PA View\nFindings: Both lung fields are clear. No focal consolidation, pneumothorax, or pleural effusion. Cardiac silhouette is normal in size and contour. Costophrenic angles are sharp.\nImpression: Normal study of the chest.`,
          extractedMedicines: [],
          extractedDate: '26 Sept 2026',
          extractedDetails: 'Lung fields clear. No focal consolidation. Normal cardiac size.',
          verifiedByPractitioner: true,
          labBiomarkers: [
            { name: 'Costophrenic Angles', value: 'Sharp (Normal)', reference: 'Sharp', status: 'Normal' },
            { name: 'Cardiac Silhouette', value: 'Within Limits', reference: '< 0.50 CTR', status: 'Normal' },
          ],
        };
      }

      addDocument(sample);
      setSelectedDoc(sample);
      setIsScanning(false);
      setUploadSuccess(true);
      hospitalAudio.playChime();
      setTimeout(() => setUploadSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 p-6 bg-white border border-rose-200/80 rounded-3xl shadow-sm shadow-rose-100/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">
              STEP 7 — Hospital Document Intelligence & Lab OCR
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-0.5">{t('medicalOCR')}</h2>
          </div>
        </div>

        <button
          onClick={() => setActiveStep(8)} // Step 8 Medical Timeline
          className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs shadow-md shadow-rose-200 transition transform hover:-translate-y-0.5"
        >
          <span>Step 8: Patient Timeline</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload Dropzone & Sample Buttons & Document List */}
        <div className="lg:col-span-5 space-y-6">
          {/* Upload Dropzone */}
          <div className="p-6 bg-rose-50/40 border-2 border-dashed border-rose-300 hover:border-rose-500 rounded-3xl text-center relative overflow-hidden group transition">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleSimulatedUpload}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <div className="w-14 h-14 mx-auto rounded-2xl bg-white border border-rose-200 flex items-center justify-center text-rose-500 group-hover:scale-110 transition shadow-2xs">
              <UploadCloud className="w-7 h-7" />
            </div>
            <h3 className="mt-4 font-bold text-sm text-slate-900">{t('uploadDoc')}</h3>
            <p className="mt-1 text-xs text-slate-500 max-w-xs mx-auto">{t('dragDrop')}</p>
            <span className="mt-3 inline-block px-3 py-1 rounded-full bg-white text-[10px] text-rose-700 font-bold border border-rose-200">
              Auto-Extracts Lab Values, Dosages & Diagnostic Findings
            </span>
          </div>

          {/* Quick Demo Pre-load Samples for Hospital Demonstrations */}
          <div className="p-4 bg-white border border-rose-200/80 rounded-2xl">
            <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider block mb-2">
              Instant Hospital Test Samples (Click to load):
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => loadSampleDoc('cbc')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-[11px] font-semibold text-slate-700 hover:text-rose-800 border border-slate-200 transition text-center"
              >
                🔬 CBC Blood Test
              </button>
              <button
                type="button"
                onClick={() => loadSampleDoc('prescription')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-[11px] font-semibold text-slate-700 hover:text-rose-800 border border-slate-200 transition text-center"
              >
                📝 Prescription Pad
              </button>
              <button
                type="button"
                onClick={() => loadSampleDoc('xray')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-[11px] font-semibold text-slate-700 hover:text-rose-800 border border-slate-200 transition text-center"
              >
                🩻 Chest X-Ray
              </button>
            </div>
          </div>

          {isScanning && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 flex items-center space-x-3 animate-pulse">
              <RefreshCw className="w-5 h-5 text-rose-600 animate-spin" />
              <div>
                <p className="text-xs font-bold text-rose-900">Hospital OCR Diagnostic Engine Ingesting...</p>
                <p className="text-[10px] text-rose-700">Harmonizing lab biomarkers, dosages, and reference ranges</p>
              </div>
            </div>
          )}

          {uploadSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Document OCR processed! Clinical entities ready for physician verification.</span>
            </div>
          )}

          {/* Document List */}
          <div className="p-6 bg-white border border-rose-200/80 rounded-3xl">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Processed Medical Documents ({documents.length})
            </h3>
            <div className="space-y-3">
              {documents.map(doc => (
                <div
                  key={doc.id}
                  onClick={() => {
                    setSelectedDoc(doc);
                    hospitalAudio.playPulse();
                  }}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition flex items-center justify-between ${
                    selectedDoc?.id === doc.id
                      ? 'bg-rose-50/70 border-rose-400 text-slate-900 shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:border-rose-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-rose-500" />
                    <div>
                      <h4 className="text-xs font-bold line-clamp-1">{doc.title}</h4>
                      <p className="text-[10px] text-slate-400">{doc.uploadedAt}</p>
                    </div>
                  </div>
                  {doc.verifiedByPractitioner ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold flex items-center space-x-1">
                      <Check className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                      Pending
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: OCR Extraction Details & Lab Biomarkers */}
        <div className="lg:col-span-7">
          {selectedDoc ? (
            <div className="p-6 bg-white border border-rose-200/80 rounded-3xl shadow-sm shadow-rose-100/50 space-y-6">
              {/* Document Title & Verification Banner */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-rose-100">
                <div>
                  <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">
                    Clinical OCR Intelligence
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">{selectedDoc.title}</h3>
                </div>

                <button
                  onClick={() => toggleDocVerification(selectedDoc.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                    selectedDoc.verifiedByPractitioner
                      ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                      : 'bg-rose-500 text-white hover:bg-rose-600'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {selectedDoc.verifiedByPractitioner
                      ? t('verifiedByPractitioner')
                      : 'Verify Document Data'}
                  </span>
                </button>
              </div>

              {/* Extracted Details & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-rose-500" />
                    <span>Investigation Date</span>
                  </span>
                  <p className="text-xs font-bold text-slate-800 mt-1">{selectedDoc.extractedDate || '26 Sept 2026'}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center space-x-1">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Clinical Diagnostic Findings</span>
                  </span>
                  <p className="text-xs text-slate-700 mt-1">{selectedDoc.extractedDetails}</p>
                </div>
              </div>

              {/* Lab Biomarkers Comparison Table (If Available) */}
              {selectedDoc.labBiomarkers && selectedDoc.labBiomarkers.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
                    <FlaskConical className="w-4 h-4 text-purple-600" />
                    <span>Standardized Biological Biomarkers ({selectedDoc.labBiomarkers.length})</span>
                  </h4>
                  <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-rose-50/60 border-b border-rose-100 text-slate-700 font-bold">
                        <tr>
                          <th className="p-3">Biomarker / Assay</th>
                          <th className="p-3">Reported Value</th>
                          <th className="p-3">Reference Interval</th>
                          <th className="p-3">Clinical Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-800">
                        {selectedDoc.labBiomarkers.map((bm, bIdx) => (
                          <tr key={bIdx} className="hover:bg-slate-50">
                            <td className="p-3 font-bold text-slate-900">{bm.name}</td>
                            <td className="p-3 font-semibold">{bm.value}</td>
                            <td className="p-3 text-slate-500">{bm.reference}</td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  bm.status === 'Normal'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-red-50 text-red-700 border border-red-200'
                                }`}
                              >
                                {bm.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Extracted Medicines Table */}
              {selectedDoc.extractedMedicines.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
                    <Pill className="w-4 h-4 text-rose-500" />
                    <span>Extracted Medicines ({selectedDoc.extractedMedicines.length})</span>
                  </h4>
                  <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-rose-50/60 border-b border-rose-100 text-slate-700 font-bold">
                        <tr>
                          <th className="p-3">Medicine Name</th>
                          <th className="p-3">Dosage</th>
                          <th className="p-3">Frequency</th>
                          <th className="p-3">Duration</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-800">
                        {selectedDoc.extractedMedicines.map(m => (
                          <tr key={m.id} className="hover:bg-slate-50">
                            <td className="p-3 font-bold text-rose-900">{m.name}</td>
                            <td className="p-3">{m.dosage}</td>
                            <td className="p-3">{m.frequency}</td>
                            <td className="p-3">{m.duration}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded-full text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                                Extracted
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Raw OCR Text Box */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Raw OCR Ingestion Stream</h4>
                <pre className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 whitespace-pre-wrap font-mono leading-relaxed max-h-36 overflow-y-auto">
                  {selectedDoc.rawText}
                </pre>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs">
              Select or upload a document to inspect OCR findings and biomarker tables.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
