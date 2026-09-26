'use client';

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { usePatient } from '../context/PatientContext';
import {
  Clock,
  Calendar,
  FileText,
  Activity,
  Pill,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle,
  HeartPulse,
} from 'lucide-react';
import { hospitalAudio } from '../lib/hospital-audio';

export const MedicalTimeline: React.FC = () => {
  const { t } = useLanguage();
  const { timeline, patient, setActiveStep, hospitalAssignment } = usePatient();
  const [filter, setFilter] = useState<string>('all');

  const filteredEvents = filter === 'all' ? timeline : timeline.filter(ev => ev.type === filter);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Step Header */}
      <div className="mb-6 p-6 bg-white border border-rose-200/80 rounded-3xl shadow-sm shadow-rose-100/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">
              STEP 8 — Longitudinal Medical Timeline
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-0.5">{t('medicalTimeline')}</h2>
            <p className="text-xs text-slate-500">
              Patient: <strong className="text-slate-800">{patient.name}</strong> ({patient.id}) • Token: <strong className="text-rose-700">{hospitalAssignment?.tokenNumber}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveStep(9)} // Step 9 Clinical Review & Red Flags
          className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs shadow-md shadow-rose-200 transition transform hover:-translate-y-0.5"
        >
          <span>Step 9: Clinical Red Flags</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-8 p-2.5 rounded-2xl bg-white border border-rose-200/80 shadow-2xs">
        <span className="text-xs font-bold text-slate-500 px-3 flex items-center space-x-1.5">
          <Filter className="w-3.5 h-3.5 text-rose-500" />
          <span>Filter Record:</span>
        </span>
        {[
          { id: 'all', label: 'All Hospital Events' },
          { id: 'visit', label: 'OPD / Triage Visits' },
          { id: 'vital', label: 'Vitals & Telemetry' },
          { id: 'report', label: 'Lab Reports & OCR' },
          { id: 'summary', label: 'Historical Records' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setFilter(tab.id);
              hospitalAudio.playPulse();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filter === tab.id
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-rose-50 hover:text-rose-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Timeline Stream */}
      <div className="relative border-l-2 border-rose-200 ml-4 sm:ml-6 space-y-8 pl-6 sm:pl-8">
        {filteredEvents.map(ev => (
          <div key={ev.id} className="relative group">
            {/* Dot node */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-5 h-5 rounded-full bg-white border-3 border-rose-500 flex items-center justify-center shadow-xs group-hover:scale-125 transition">
              <div className="w-2 h-2 rounded-full bg-rose-500" />
            </div>

            {/* Event Card */}
            <div className="p-6 rounded-3xl bg-white border border-rose-100 hover:border-rose-300 transition shadow-sm hover:shadow-md hover:shadow-rose-100/50 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-500 flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-rose-500" />
                  <span>{ev.date}</span>
                </span>

                <span
                  className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    ev.badgeColor === 'pink'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : ev.badgeColor === 'emerald'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : ev.badgeColor === 'blue'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : ev.badgeColor === 'purple'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {ev.badge}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 group-hover:text-rose-600 transition">
                {ev.title}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">{ev.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
