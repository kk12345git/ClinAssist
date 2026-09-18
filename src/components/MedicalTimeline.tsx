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
} from 'lucide-react';

export const MedicalTimeline: React.FC = () => {
  const { t } = useLanguage();
  const { timeline, patient, setActiveStep } = usePatient();
  const [filter, setFilter] = useState<string>('all');

  const filteredEvents = filter === 'all' ? timeline : timeline.filter(ev => ev.type === filter);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Step Header */}
      <div className="mb-6 p-6 bg-slate-900 border border-teal-500/30 rounded-3xl shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">
              STEP 8 — Patient Medical History
            </span>
            <h2 className="text-2xl font-bold text-white mt-0.5">{t('medicalTimeline')}</h2>
            <p className="text-xs text-slate-400">Patient: {patient.name} ({patient.id})</p>
          </div>
        </div>

        <button
          onClick={() => setActiveStep(9)} // Step 9 Clinical Review & Red Flags
          className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 transition"
        >
          <span>Step 9: Clinical Red Flags</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-8 p-2 rounded-2xl bg-slate-900 border border-slate-800">
        <span className="text-xs font-semibold text-slate-400 px-3 flex items-center space-x-1">
          <Filter className="w-3.5 h-3.5 text-teal-400" />
          <span>Filter Timeline:</span>
        </span>
        {[
          { id: 'all', label: 'All Events' },
          { id: 'visit', label: 'Visits' },
          { id: 'report', label: 'Reports & OCR' },
          { id: 'symptom', label: 'Symptoms' },
          { id: 'medication', label: 'Medications' },
          { id: 'summary', label: 'Case Summaries' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              filter === tab.id
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Timeline Stream */}
      <div className="relative border-l-2 border-slate-800 ml-4 sm:ml-6 space-y-8 pl-6 sm:pl-8">
        {filteredEvents.map((ev, idx) => (
          <div key={ev.id} className="relative group">
            {/* Dot node */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-5 h-5 rounded-full bg-slate-950 border-2 border-teal-400 flex items-center justify-center shadow-md shadow-teal-500/20 group-hover:scale-125 transition">
              <div className="w-2 h-2 rounded-full bg-teal-400" />
            </div>

            {/* Event Card */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-teal-500/40 transition shadow-xl space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-400 flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-teal-400" />
                  <span>{ev.date}</span>
                </span>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    ev.badgeColor === 'emerald'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : ev.badgeColor === 'blue'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      : ev.badgeColor === 'purple'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {ev.badge}
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition">
                {ev.title}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">{ev.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
