'use client';

import React, { useState } from 'react';
import { useLanguage, LANGUAGE_OPTIONS } from '../context/LanguageContext';
import { usePatient } from '../context/PatientContext';
import { UserPlus, ShieldCheck, ArrowRight, RefreshCw, CheckCircle } from 'lucide-react';
import { SupportedLanguage } from '../types/clinical';

export const PatientRegistration: React.FC = () => {
  const { t, language } = useLanguage();
  const { setPatient, setActiveStep } = usePatient();

  const [id, setId] = useState(`PAT-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [name, setName] = useState('Karthik Raja');
  const [age, setAge] = useState(34);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [preferredLanguage, setPreferredLanguage] = useState<SupportedLanguage>(language);
  const [emergencyContact, setEmergencyContact] = useState('+91 98765 00000 (Anitha - Wife)');
  const [consent, setConsent] = useState(true);
  const [error, setError] = useState('');

  const generateNewId = () => {
    setId(`PAT-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Patient Full Name is required');
      return;
    }
    if (!consent) {
      setError('Patient consent checkbox must be accepted');
      return;
    }

    setPatient({
      id,
      name,
      age,
      gender,
      phone,
      preferredLanguage,
      emergencyContact,
      consent,
      registeredAt: new Date().toLocaleString(),
    });

    setActiveStep(4); // Jump to Case-Taking Page
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-slate-900 border border-teal-500/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Step Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
              STEP 3 — Intake Form
            </span>
            <h2 className="text-2xl font-bold text-white mt-1">{t('patientRegistration')}</h2>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Patient ID */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {t('patientId')}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={id}
                  onChange={e => setId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-teal-300 font-mono font-bold focus:outline-none focus:border-teal-400"
                />
                <button
                  type="button"
                  onClick={generateNewId}
                  className="absolute right-2 top-2 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs transition"
                  title="Generate New ID"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Patient Full Name */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {t('name')} *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Karthik Raja"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-400"
              />
            </div>

            {/* Age */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {t('age')} *
              </label>
              <input
                type="number"
                min={1}
                max={120}
                value={age}
                onChange={e => setAge(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-400"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {t('gender')}
              </label>
              <select
                value={gender}
                onChange={e => setGender(e.target.value as 'Male' | 'Female' | 'Other')}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-400"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {t('phone')}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-400"
              />
            </div>

            {/* Preferred Language */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {t('preferredLanguage')}
              </label>
              <select
                value={preferredLanguage}
                onChange={e => setPreferredLanguage(e.target.value as SupportedLanguage)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-400"
              >
                {LANGUAGE_OPTIONS.map(l => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.name} ({l.nativeName})
                  </option>
                ))}
              </select>
            </div>

            {/* Emergency Contact */}
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {t('emergencyContact')}
              </label>
              <input
                type="text"
                value={emergencyContact}
                onChange={e => setEmergencyContact(e.target.value)}
                placeholder="Name & Relationship"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-500/30 flex items-start space-x-3">
            <input
              type="checkbox"
              id="consent"
              checked={consent}
              onChange={e => setConsent(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-teal-500 focus:ring-teal-400 bg-slate-900 border-slate-700 cursor-pointer"
            />
            <label htmlFor="consent" className="text-xs text-slate-300 cursor-pointer leading-relaxed">
              <span className="font-semibold text-teal-300 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 inline text-teal-400 mr-1" />
                Informed Patient Consent
              </span>
              {t('consentLabel')}
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-slate-950 font-bold text-sm shadow-xl shadow-teal-500/30 transition transform hover:-translate-y-0.5"
            >
              <span>{t('registerSubmit')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
