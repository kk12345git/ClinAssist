'use client';

import React, { useState } from 'react';
import { useLanguage, LANGUAGE_OPTIONS } from '../context/LanguageContext';
import { usePatient } from '../context/PatientContext';
import {
  UserPlus,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  HeartPulse,
  Building,
  Activity,
  Phone,
  AlertCircle,
} from 'lucide-react';
import { SupportedLanguage } from '../types/clinical';
import { hospitalAudio } from '../lib/hospital-audio';

export const PatientRegistration: React.FC = () => {
  const { t, language } = useLanguage();
  const { setPatient, setActiveStep, updateVitals } = usePatient();

  const [id, setId] = useState(`PAT-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [tokenNumber, setTokenNumber] = useState(`#OPD-${Math.floor(100 + Math.random() * 900)}`);
  const [name, setName] = useState('Karthik Raja');
  const [age, setAge] = useState(34);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [preferredLanguage, setPreferredLanguage] = useState<SupportedLanguage>(language);
  const [department, setDepartment] = useState<'General Medicine' | 'Emergency & Trauma' | 'Cardiology' | 'Pulmonology' | 'Pediatrics'>('General Medicine');
  const [roomBed, setRoomBed] = useState('Consultation Suite 04 / Bed 02');
  const [emergencyContact, setEmergencyContact] = useState('+91 98765 00000 (Anitha - Wife)');
  const [consent, setConsent] = useState(true);

  // Initial vitals capture
  const [heartRate, setHeartRate] = useState(88);
  const [bpSys, setBpSys] = useState(122);
  const [bpDia, setBpDia] = useState(80);
  const [spO2, setSpO2] = useState(98);
  const [temp, setTemp] = useState(100.4);

  const [error, setError] = useState('');

  const generateNewId = () => {
    setId(`PAT-2026-${Math.floor(1000 + Math.random() * 9000)}`);
    setTokenNumber(`#OPD-${Math.floor(100 + Math.random() * 900)}`);
    hospitalAudio.playPulse();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Patient Full Name is required for hospital registration.');
      return;
    }
    if (!consent) {
      setError('Informed patient clinical consent must be acknowledged.');
      return;
    }

    const newVitals = {
      heartRate,
      bloodPressureSys: bpSys,
      bloodPressureDia: bpDia,
      spO2,
      temperature: temp,
      respiratoryRate: 18,
      bloodGlucose: 108,
      lastUpdated: 'Registered ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      triageLevel: temp > 101 || spO2 < 95 ? ('P2 - Emergent' as const) : ('P3 - Urgent' as const),
      isAbnormal: temp > 100.4 || spO2 < 95,
    };

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
      vitals: newVitals,
      hospitalAssignment: {
        tokenNumber,
        department,
        roomBed,
        attendingDoctor: 'Dr. A. Sharma, MD (Reg #44592)',
        queueStatus: 'In Consultation',
        waitTimeMinutes: 5,
      },
    });

    updateVitals(newVitals);
    hospitalAudio.playChime();
    setActiveStep(4); // Jump to Case-Taking Page
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white border border-rose-200/80 rounded-3xl p-8 shadow-sm shadow-rose-100/50 relative overflow-hidden">
        {/* Step Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-rose-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">
                STEP 3 — Hospital OPD & Triage Intake Form
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-0.5">{t('patientRegistration')}</h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-500">OPD Token:</span>
            <span className="px-3 py-1 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-mono font-bold text-xs">
              {tokenNumber}
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Demographics */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center space-x-1.5">
              <span>1. Patient Demographics & Hospital Identifiers</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Patient ID */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {t('patientId')}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={id}
                    onChange={e => setId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-rose-700 font-mono font-bold focus:outline-none focus:border-rose-400 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={generateNewId}
                    className="absolute right-2 top-2 p-1 rounded-lg bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 text-xs border border-slate-200 transition"
                    title="Generate New ID"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {t('name')} *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Karthik Raja"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-400 focus:bg-white"
                />
              </div>

              {/* Age */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {t('age')} *
                </label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={age}
                  onChange={e => setAge(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-400 focus:bg-white"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {t('gender')}
                </label>
                <select
                  value={gender}
                  onChange={e => setGender(e.target.value as 'Male' | 'Female' | 'Other')}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-400 focus:bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {t('phone')}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-400 focus:bg-white"
                />
              </div>

              {/* Preferred Language */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {t('preferredLanguage')}
                </label>
                <select
                  value={preferredLanguage}
                  onChange={e => setPreferredLanguage(e.target.value as SupportedLanguage)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-400 focus:bg-white"
                >
                  {LANGUAGE_OPTIONS.map(l => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.name} ({l.nativeName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Hospital Department
                </label>
                <select
                  value={department}
                  onChange={e => setDepartment(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-400 focus:bg-white"
                >
                  <option value="General Medicine">General Medicine</option>
                  <option value="Emergency & Trauma">Emergency & Trauma</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Pulmonology">Pulmonology</option>
                  <option value="Pediatrics">Pediatrics</option>
                </select>
              </div>

              {/* Room / Bed Allocation */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Suite / Bed Allocation
                </label>
                <input
                  type="text"
                  value={roomBed}
                  onChange={e => setRoomBed(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-400 focus:bg-white"
                />
              </div>

              {/* Emergency Contact */}
              <div className="sm:col-span-3">
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {t('emergencyContact')}
                </label>
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={e => setEmergencyContact(e.target.value)}
                  placeholder="Kin Name, Relationship & Contact Number"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-400 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Bedside Vitals Telemetry Capture */}
          <div className="p-5 rounded-2xl bg-rose-50/40 border border-rose-200/80">
            <h3 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
              <HeartPulse className="w-4 h-4 text-rose-500 animate-ecg-heart" />
              <span>2. Bedside Vitals & Triage Assessment</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Heart Rate (BPM)</label>
                <input
                  type="number"
                  value={heartRate}
                  onChange={e => setHeartRate(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-rose-200 rounded-xl text-xs font-bold text-rose-700 focus:outline-none focus:border-rose-400"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">BP Systolic</label>
                <input
                  type="number"
                  value={bpSys}
                  onChange={e => setBpSys(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-rose-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-400"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">BP Diastolic</label>
                <input
                  type="number"
                  value={bpDia}
                  onChange={e => setBpDia(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-rose-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-400"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">SpO2 (%)</label>
                <input
                  type="number"
                  value={spO2}
                  onChange={e => setSpO2(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-rose-200 rounded-xl text-xs font-bold text-emerald-700 focus:outline-none focus:border-rose-400"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Temperature (°F)</label>
                <input
                  type="number"
                  step="0.1"
                  value={temp}
                  onChange={e => setTemp(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-rose-200 rounded-xl text-xs font-bold text-amber-700 focus:outline-none focus:border-rose-400"
                />
              </div>
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="p-4 rounded-2xl bg-white border border-rose-200 flex items-start space-x-3">
            <input
              type="checkbox"
              id="consent"
              checked={consent}
              onChange={e => setConsent(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-rose-600 focus:ring-rose-400 bg-white border-slate-300 cursor-pointer"
            />
            <label htmlFor="consent" className="text-xs text-slate-600 cursor-pointer leading-relaxed">
              <span className="font-bold text-rose-800 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 inline text-rose-600 mr-1" />
                Informed Patient Clinical Consent & Data Security Notice
              </span>
              {t('consentLabel')} Patient records are processed in compliance with hospital confidentiality standards.
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-sm shadow-md shadow-rose-200 transition transform hover:-translate-y-0.5"
            >
              <span>Proceed to Ambient Case Taking</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
