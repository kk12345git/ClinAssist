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
} from 'lucide-react';
import { MedicalDocument, ExtractedMedicine } from '../types/clinical';

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

    setTimeout(() => {
      const newDoc: MedicalDocument = {
        id: 'doc-' + Date.now(),
        title: file.name || 'Uploaded Clinical Report.pdf',
        type: file.name.toLowerCase().includes('presc') ? 'prescription' : 'lab_report',
        fileUrl: URL.createObjectURL(file),
        uploadedAt: new Date().toLocaleString(),
        rawText: `Dr. K. Swaminathan, MD (Internal Med). Rx: Tab Amoxicillin 500mg BD x 5 days. Tab Paracetamol 650mg SOS. Date: 18/09/2026. WBC Count: 11,200/cu.mm. CRP: 12 mg/L.`,
        extractedMedicines: [
          { id: 'm-new-1', name: 'Amoxicillin', dosage: '500mg', frequency: 'Twice daily (BD)', duration: '5 days', verified: false },
          { id: 'm-new-2', name: 'Paracetamol', dosage: '650mg', frequency: 'As needed (SOS)', duration: '3 days', verified: false },
        ],
        extractedDate: new Date().toLocaleDateString(),
        extractedDetails: 'WBC Count: 11,200/cu.mm (Mild leukocytosis). CRP: 12 mg/L (Elevated inflammatory marker).',
        verifiedByPractitioner: false,
      };

      addDocument(newDoc);
      setSelectedDoc(newDoc);
      setIsScanning(false);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 p-6 bg-slate-900 border border-teal-500/30 rounded-3xl shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-teal-400 uppercase tracking-widest">
              STEP 7 — Document Intelligence
            </span>
            <h2 className="text-2xl font-bold text-white mt-0.5">{t('medicalOCR')}</h2>
          </div>
        </div>

        <button
          onClick={() => setActiveStep(8)} // Step 8 Medical Timeline
          className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 transition"
        >
          <span>Step 8: Patient Timeline</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload Dropzone & Document List */}
        <div className="lg:col-span-5 space-y-6">
          {/* Upload Dropzone */}
          <div className="p-6 bg-slate-900 border-2 border-dashed border-teal-500/40 hover:border-teal-400 rounded-3xl text-center relative overflow-hidden group transition">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleSimulatedUpload}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-110 transition">
              <UploadCloud className="w-7 h-7" />
            </div>
            <h3 className="mt-4 font-bold text-sm text-white">{t('uploadDoc')}</h3>
            <p className="mt-1 text-xs text-slate-400 max-w-xs mx-auto">{t('dragDrop')}</p>
            <span className="mt-3 inline-block px-3 py-1 rounded-full bg-slate-800 text-[10px] text-teal-300 font-semibold border border-slate-700">
              Supports PNG, JPG, PDF (OCR AI Auto-Parse)
            </span>
          </div>

          {isScanning && (
            <div className="p-4 rounded-2xl bg-teal-950/80 border border-teal-500/40 flex items-center space-x-3 animate-pulse">
              <RefreshCw className="w-5 h-5 text-teal-400 animate-spin" />
              <div>
                <p className="text-xs font-bold text-teal-200">Analyzing Document with OCR Engine...</p>
                <p className="text-[10px] text-slate-400">Extracting clinical entities & prescription details</p>
              </div>
            </div>
          )}

          {uploadSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Document OCR processed! Details ready for verification.</span>
            </div>
          )}

          {/* Document List */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Processed Medical Documents ({documents.length})
            </h3>
            <div className="space-y-3">
              {documents.map(doc => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition flex items-center justify-between ${
                    selectedDoc?.id === doc.id
                      ? 'bg-teal-950/60 border-teal-400 text-white shadow-lg'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-teal-400" />
                    <div>
                      <h4 className="text-xs font-bold line-clamp-1">{doc.title}</h4>
                      <p className="text-[10px] text-slate-400">{doc.uploadedAt}</p>
                    </div>
                  </div>
                  {doc.verifiedByPractitioner ? (
                    <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center space-x-1">
                      <Check className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Pending
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: OCR Extraction Details & Practitioner Verification */}
        <div className="lg:col-span-7">
          {selectedDoc ? (
            <div className="p-6 bg-slate-900 border border-teal-500/30 rounded-3xl shadow-2xl space-y-6">
              {/* Document Title & Verification Banner */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">
                    OCR Extracted Insights
                  </span>
                  <h3 className="text-lg font-bold text-white">{selectedDoc.title}</h3>
                </div>

                <button
                  onClick={() => toggleDocVerification(selectedDoc.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-md ${
                    selectedDoc.verifiedByPractitioner
                      ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-600'
                      : 'bg-amber-500 text-slate-950 hover:bg-amber-600'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {selectedDoc.verifiedByPractitioner
                      ? t('verifiedByPractitioner')
                      : 'Click to Verify Extracted Data'}
                  </span>
                </button>
              </div>

              {/* Extracted Details & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Extracted Document Date</span>
                  </span>
                  <p className="text-xs font-bold text-cyan-200 mt-1">{selectedDoc.extractedDate || '17 Sept 2026'}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center space-x-1">
                    <FileCheck className="w-3.5 h-3.5 text-teal-400" />
                    <span>Extracted Lab Values</span>
                  </span>
                  <p className="text-xs text-slate-300 mt-1">{selectedDoc.extractedDetails}</p>
                </div>
              </div>

              {/* Extracted Medicines Table */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
                  <Pill className="w-4 h-4 text-pink-400" />
                  <span>Extracted Medicines ({selectedDoc.extractedMedicines.length})</span>
                </h4>
                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold">
                      <tr>
                        <th className="p-3">Medicine Name</th>
                        <th className="p-3">Dosage</th>
                        <th className="p-3">Frequency</th>
                        <th className="p-3">Duration</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-200">
                      {selectedDoc.extractedMedicines.map(m => (
                        <tr key={m.id} className="hover:bg-slate-900/50">
                          <td className="p-3 font-bold text-teal-300">{m.name}</td>
                          <td className="p-3">{m.dosage}</td>
                          <td className="p-3">{m.frequency}</td>
                          <td className="p-3">{m.duration}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                              Verified
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Raw OCR Text Box */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Raw OCR Text</h4>
                <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 whitespace-pre-wrap font-mono leading-relaxed max-h-40 overflow-y-auto">
                  {selectedDoc.rawText}
                </pre>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 text-slate-400 text-xs">
              Select a document to inspect OCR text and extracted medicines.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
