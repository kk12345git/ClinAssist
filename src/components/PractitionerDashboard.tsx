'use client';

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { usePatient } from '../context/PatientContext';
import {
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  Search,
  UserPlus,
  ArrowRight,
  FileText,
  AlertTriangle,
  Stethoscope,
  Sparkles,
  Filter,
} from 'lucide-react';

export const PractitionerDashboard: React.FC = () => {
  const { t } = useLanguage();
  const {
    dashboardStats,
    allPatients,
    recentCases,
    loadPatientCase,
    setActiveStep,
  } = usePatient();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Pending Review' | 'Completed'>('all');

  const filteredCases = recentCases.filter(c => {
    const matchesSearch =
      c.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subjective.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Dashboard Top Header */}
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-teal-400 uppercase tracking-widest block">
            STEP 11 — Doctor & Staff Portal
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">{t('practitionerDashboard')}</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time patient triage, active case intakes, and clinical decision support queue.
          </p>
        </div>

        <button
          onClick={() => setActiveStep(3)} // Jump to Patient Registration
          className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 font-bold text-xs shadow-xl shadow-teal-500/20 transition transform hover:-translate-y-0.5"
        >
          <UserPlus className="w-4 h-4" />
          <span>{t('startNewCase')}</span>
        </button>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Total Patients */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl relative overflow-hidden group hover:border-teal-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('totalPatients')}</span>
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-4">{dashboardStats.totalPatients}</p>
          <p className="text-[11px] text-teal-400 mt-1 font-semibold">+4 registered today</p>
        </div>

        {/* Today's Cases */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl relative overflow-hidden group hover:border-cyan-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('todayCases')}</span>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-4">{dashboardStats.todayCases}</p>
          <p className="text-[11px] text-cyan-400 mt-1 font-semibold">Active consultation stream</p>
        </div>

        {/* Pending Reviews */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl relative overflow-hidden group hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('pendingReviews')}</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <p className="text-3xl font-black text-amber-300 mt-4">{dashboardStats.pendingReviews}</p>
          <p className="text-[11px] text-amber-400 mt-1 font-semibold">Requires doctor sign-off</p>
        </div>

        {/* Completed Cases */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl relative overflow-hidden group hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('completedCases')}</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white mt-4">{dashboardStats.completedCases}</p>
          <p className="text-[11px] text-emerald-400 mt-1 font-semibold">PDF generated & archived</p>
        </div>
      </div>

      {/* Search Bar & Case List Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        {/* Search & Filter Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by Patient ID, Name, or Condition..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-400"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Status:</span>
            {(['all', 'Pending Review', 'Completed'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  statusFilter === st
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {st === 'all' ? 'All' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Cases Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Patient Info</th>
                <th className="p-4">Date</th>
                <th className="p-4">Primary Complaint</th>
                <th className="p-4">Red Flags</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {filteredCases.map(c => (
                <tr key={c.id} className="hover:bg-slate-900/60 transition">
                  <td className="p-4">
                    <p className="font-bold text-white text-sm">{c.patientName}</p>
                    <p className="text-[10px] text-teal-400 font-mono">{c.patientId}</p>
                  </td>
                  <td className="p-4 text-slate-400">{c.createdAt}</td>
                  <td className="p-4 max-w-xs truncate text-slate-300 font-medium">
                    {c.symptomsSummary?.complaint || c.subjective}
                  </td>
                  <td className="p-4">
                    {c.redFlagsCount > 0 ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/40 inline-flex items-center space-x-1">
                        <AlertTriangle className="w-3 h-3 text-red-400" />
                        <span>{c.redFlagsCount} Red Flag</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500">None</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === 'Completed'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => loadPatientCase(c.patientId)}
                      className="px-3 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500 text-teal-300 border border-teal-500/40 font-bold text-xs transition inline-flex items-center space-x-1"
                    >
                      <span>Open Case</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
