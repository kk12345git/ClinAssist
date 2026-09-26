'use client';

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { usePatient } from '../context/PatientContext';
import {
  FileText,
  Edit3,
  Check,
  Plus,
  X,
  Sliders,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Pill,
  Clock,
  MapPin,
  Activity,
  HeartPulse,
} from 'lucide-react';
import { hospitalAudio } from '../lib/hospital-audio';

export const StructuredSymptoms: React.FC = () => {
  const { t } = useLanguage();
  const { symptoms, setSymptoms, setActiveStep } = usePatient();
  const [isEditing, setIsEditing] = useState(false);

  const [complaint, setComplaint] = useState(symptoms.complaint);
  const [duration, setDuration] = useState(symptoms.duration);
  const [severity, setSeverity] = useState(symptoms.severity);
  const [location, setLocation] = useState(symptoms.location);
  const [associated, setAssociated] = useState<string[]>(symptoms.associatedSymptoms || []);
  const [newTag, setNewTag] = useState('');
  const [pastHistory, setPastHistory] = useState(symptoms.pastHistory);
  const [currentMedications, setCurrentMedications] = useState(symptoms.currentMedications);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAddTag = () => {
    if (newTag.trim() && !associated.includes(newTag.trim())) {
      setAssociated([...associated, newTag.trim()]);
      setNewTag('');
      hospitalAudio.playPulse();
    }
  };

  const handleRemoveTag = (tag: string) => {
    setAssociated(associated.filter(t => t !== tag));
  };

  const handleSave = () => {
    setSymptoms(prev => ({
      ...prev,
      complaint,
      duration,
      severity,
      location,
      associatedSymptoms: associated,
      pastHistory,
      currentMedications,
      updatedAt: new Date().toISOString(),
    }));
    setIsEditing(false);
    setSaveSuccess(true);
    hospitalAudio.playChime();
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const getSeverityDescription = (val: number) => {
    if (val <= 3) return 'Mild Discomfort (Manageable)';
    if (val <= 6) return 'Moderate Pain (Affects daily activity)';
    if (val <= 8) return 'Severe Distress (Requires physician intervention)';
    return 'Critical / Worst Possible Pain (Urgent Triage)';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white border border-rose-200/80 rounded-3xl p-8 shadow-sm shadow-rose-100/50 relative overflow-hidden">
        {/* Step Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-rose-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">
                STEP 6 — Clinical Entity Structuring & Harmonization
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-0.5">{t('structuredSymptoms')}</h2>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{t('editSymptoms')}</span>
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs shadow-md shadow-emerald-200 transition"
              >
                <Check className="w-4 h-4" />
                <span>Save Structured Clinical Record</span>
              </button>
            )}

            <button
              onClick={() => setActiveStep(7)} // Step 7 Medical Document OCR
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs shadow-md shadow-rose-200 transition transform hover:-translate-y-0.5"
            >
              <span>Step 7: OCR Scanner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Symptoms successfully reconciled and structured for medical review.</span>
          </div>
        )}

        {/* Structured Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chief Complaint */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 flex items-center space-x-1.5">
              <Activity className="w-4 h-4 text-rose-500" />
              <span>{t('complaint')}</span>
            </label>
            {isEditing ? (
              <input
                type="text"
                value={complaint}
                onChange={e => setComplaint(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-400 font-semibold"
              />
            ) : (
              <p className="text-sm font-bold text-slate-900">{symptoms.complaint}</p>
            )}
          </div>

          {/* Duration */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-pink-500" />
              <span>{t('duration')}</span>
            </label>
            {isEditing ? (
              <input
                type="text"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-400 font-semibold"
              />
            ) : (
              <p className="text-sm font-bold text-slate-800">{symptoms.duration}</p>
            )}
          </div>

          {/* Severity Slider */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
                <Sliders className="w-4 h-4 text-rose-500" />
                <span>{t('severity')} (Visual Analog Scale)</span>
              </label>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  severity >= 8
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : severity >= 5
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {severity} / 10
              </span>
            </div>
            {isEditing ? (
              <div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={severity}
                  onChange={e => setSeverity(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <p className="text-[11px] text-slate-500 mt-1 italic">{getSeverityDescription(severity)}</p>
              </div>
            ) : (
              <div>
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden mt-3">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      severity >= 8
                        ? 'bg-gradient-to-r from-rose-500 to-red-600'
                        : 'bg-gradient-to-r from-pink-400 to-rose-500'
                    }`}
                    style={{ width: `${(severity / 10) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-600 mt-2 font-medium">{getSeverityDescription(severity)}</p>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-purple-500" />
              <span>{t('location')}</span>
            </label>
            {isEditing ? (
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-400 font-semibold"
              />
            ) : (
              <p className="text-sm font-bold text-slate-800">{symptoms.location}</p>
            )}
          </div>

          {/* Associated Symptoms Tags */}
          <div className="md:col-span-2 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
              {t('associatedSymptoms')}
            </label>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {associated.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-xs font-semibold text-rose-800 flex items-center space-x-1.5 shadow-2xs"
                >
                  <span>{tag}</span>
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="text-slate-400 hover:text-red-500 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </span>
              ))}
            </div>

            {isEditing && (
              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  placeholder="Add symptom (e.g. Nausea, Photophobia, Chest Tightness)"
                  className="px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-400 w-80"
                />
                <button
                  onClick={handleAddTag}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs"
                >
                  <Plus className="w-4 h-4 inline mr-1" /> Add
                </button>
              </div>
            )}
          </div>

          {/* Past History */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{t('pastHistory')}</span>
            </label>
            {isEditing ? (
              <textarea
                rows={3}
                value={pastHistory}
                onChange={e => setPastHistory(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-400"
              />
            ) : (
              <p className="text-xs text-slate-700 leading-relaxed">{symptoms.pastHistory}</p>
            )}
          </div>

          {/* Current Medications */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 flex items-center space-x-1.5">
              <Pill className="w-4 h-4 text-pink-500" />
              <span>{t('currentMedications')} (Reconciliation)</span>
            </label>
            {isEditing ? (
              <textarea
                rows={3}
                value={currentMedications}
                onChange={e => setCurrentMedications(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-400"
              />
            ) : (
              <p className="text-xs text-slate-700 leading-relaxed">{symptoms.currentMedications}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
