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
} from 'lucide-react';

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
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-slate-900 border border-teal-500/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Step Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">
                STEP 6 — Clinical Data Structuring
              </span>
              <h2 className="text-2xl font-bold text-white mt-0.5">{t('structuredSymptoms')}</h2>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 text-xs font-semibold transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{t('editSymptoms')}</span>
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition"
              >
                <Check className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            )}

            <button
              onClick={() => setActiveStep(7)} // Step 7 Medical Document OCR
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 transition"
            >
              <span>Step 7: OCR Scanner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span>Symptoms successfully updated and saved for clinical review.</span>
          </div>
        )}

        {/* Structured Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Complaint */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2 flex items-center space-x-1.5">
              <Activity className="w-4 h-4 text-teal-400" />
              <span>{t('complaint')}</span>
            </label>
            {isEditing ? (
              <input
                type="text"
                value={complaint}
                onChange={e => setComplaint(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-400"
              />
            ) : (
              <p className="text-sm font-bold text-teal-200">{symptoms.complaint}</p>
            )}
          </div>

          {/* Duration */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2 flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>{t('duration')}</span>
            </label>
            {isEditing ? (
              <input
                type="text"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-400"
              />
            ) : (
              <p className="text-sm font-bold text-cyan-200">{symptoms.duration}</p>
            )}
          </div>

          {/* Severity Slider */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>{t('severity')}</span>
              </label>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                severity >= 8 ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {severity} / 10
              </span>
            </div>
            {isEditing ? (
              <input
                type="range"
                min={1}
                max={10}
                value={severity}
                onChange={e => setSeverity(Number(e.target.value))}
                className="w-full accent-teal-400 cursor-pointer"
              />
            ) : (
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden mt-3">
                <div
                  className={`h-full rounded-full ${
                    severity >= 8 ? 'bg-gradient-to-r from-amber-500 to-red-500' : 'bg-gradient-to-r from-teal-400 to-emerald-400'
                  }`}
                  style={{ width: `${(severity / 10) * 100}%` }}
                />
              </div>
            )}
          </div>

          {/* Location */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2 flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>{t('location')}</span>
            </label>
            {isEditing ? (
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-400"
              />
            ) : (
              <p className="text-sm font-bold text-emerald-200">{symptoms.location}</p>
            )}
          </div>

          {/* Associated Symptoms Tags */}
          <div className="md:col-span-2 p-5 rounded-2xl bg-slate-950 border border-slate-800">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
              {t('associatedSymptoms')}
            </label>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {associated.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-teal-300 flex items-center space-x-1.5"
                >
                  <span>{tag}</span>
                  {isEditing && (
                    <button onClick={() => handleRemoveTag(tag)} className="text-slate-400 hover:text-red-400">
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
                  placeholder="Add symptom (e.g. Nausea)"
                  className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-400"
                />
                <button
                  onClick={handleAddTag}
                  className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Past History */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>{t('pastHistory')}</span>
            </label>
            {isEditing ? (
              <textarea
                rows={3}
                value={pastHistory}
                onChange={e => setPastHistory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-400"
              />
            ) : (
              <p className="text-xs text-slate-300">{symptoms.pastHistory}</p>
            )}
          </div>

          {/* Current Medications */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2 flex items-center space-x-1.5">
              <Pill className="w-4 h-4 text-pink-400" />
              <span>{t('currentMedications')}</span>
            </label>
            {isEditing ? (
              <textarea
                rows={3}
                value={currentMedications}
                onChange={e => setCurrentMedications(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-400"
              />
            ) : (
              <p className="text-xs text-slate-300">{symptoms.currentMedications}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
