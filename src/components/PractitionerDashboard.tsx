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
  HeartPulse,
  Building2,
  Download,
  Activity,
  Bed,
  PhoneCall,
  BellRing,
} from 'lucide-react';
import { hospitalAudio } from '../lib/hospital-audio';

export const PractitionerDashboard: React.FC = () => {
  const { t } = useLanguage();
  const {
    dashboardStats,
    allPatients,
    recentCases,
    loadPatientCase,
    setActiveStep,
    vitals,
    isLiveTelemetryActive,
    setIsLiveTelemetryActive,
  } = usePatient();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Pending Review' | 'Completed'>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  const filteredCases = recentCases.filter(c => {
    const matchesSearch =
      c.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subjective.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const exportHospitalData = () => {
    hospitalAudio.playChime();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(recentCases, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ClinAssist_Hospital_MIS_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Dashboard Top Header */}
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-rose-600 uppercase tracking-widest block">
            STEP 11 — Physician & Hospital Ward Portal
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Hospital Clinical Dashboard & Triage Console
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time patient telemetry, department queues, bed allocation, and AI clinical decision verification.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Live Telemetry Toggle */}
          <button
            onClick={() => {
              setIsLiveTelemetryActive(!isLiveTelemetryActive);
              hospitalAudio.playPulse();
            }}
            className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-2xl border text-xs font-bold transition shadow-xs ${
              isLiveTelemetryActive
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            <HeartPulse className={`w-4 h-4 ${isLiveTelemetryActive ? 'text-rose-500 animate-ecg-heart' : 'text-slate-400'}`} />
            <span>Telemetry: {isLiveTelemetryActive ? 'STREAMING' : 'PAUSED'}</span>
          </button>

          <button
            onClick={exportHospitalData}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition shadow-xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export MIS</span>
          </button>

          <button
            onClick={() => setActiveStep(3)} // Jump to Patient Registration
            className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs shadow-md shadow-rose-200 transition transform hover:-translate-y-0.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>{t('startNewCase')}</span>
          </button>
        </div>
      </div>

      {/* Hospital Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Total Patients */}
        <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-sm hover:border-rose-300 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('totalPatients')}</span>
            <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500 group-hover:scale-105 transition">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-4">{dashboardStats.totalPatients}</p>
          <p className="text-[11px] text-rose-600 mt-1 font-semibold">+6 admitted today</p>
        </div>

        {/* Today's Consultations */}
        <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-sm hover:border-rose-300 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('todayCases')}</span>
            <div className="w-10 h-10 rounded-2xl bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-500 group-hover:scale-105 transition">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-4">{dashboardStats.todayCases}</p>
          <p className="text-[11px] text-pink-600 mt-1 font-semibold">Active OPD consultations</p>
        </div>

        {/* Pending Reviews */}
        <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-sm hover:border-rose-300 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('pendingReviews')}</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 group-hover:scale-105 transition">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <p className="text-3xl font-black text-amber-700 mt-4">{dashboardStats.pendingReviews}</p>
          <p className="text-[11px] text-amber-600 mt-1 font-semibold">Requires doctor digital sign-off</p>
        </div>

        {/* Ward Bed Occupancy */}
        <div className="p-6 rounded-3xl bg-white border border-rose-100 shadow-sm hover:border-rose-300 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bed Occupancy</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition">
              <Bed className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-700 mt-4">{dashboardStats.bedOccupancyRate}%</p>
          <p className="text-[11px] text-emerald-600 mt-1 font-semibold">22 / 28 Ward Beds Occupied</p>
        </div>
      </div>

      {/* Hospital Live Telemetry & Queue Section */}
      <div className="bg-white border border-rose-200/80 rounded-3xl p-6 sm:p-8 shadow-sm shadow-rose-100/50 space-y-6">
        {/* Search & Filter Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-rose-100">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by Patient ID, Name, or Condition..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-rose-400 focus:bg-white"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-500 hidden sm:inline">Status:</span>
            {(['all', 'Pending Review', 'Completed'] as const).map(st => (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  hospitalAudio.playPulse();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  statusFilter === st
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-800'
                }`}
              >
                {st === 'all' ? 'All Patients' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Hospital Patients Queue Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-xs">
            <thead className="bg-rose-50/70 border-b border-rose-100 text-slate-700 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Patient & Token</th>
                <th className="p-4">Time</th>
                <th className="p-4">Chief Complaint</th>
                <th className="p-4">Red Flags</th>
                <th className="p-4">Review Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredCases.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 transition">
                  <td className="p-4">
                    <p className="font-extrabold text-slate-900 text-sm">{c.patientName}</p>
                    <p className="text-[10px] text-rose-600 font-mono font-bold">{c.patientId}</p>
                  </td>
                  <td className="p-4 text-slate-500 font-medium">{c.createdAt}</td>
                  <td className="p-4 max-w-xs truncate text-slate-700 font-medium">
                    {c.symptomsSummary?.complaint || c.subjective}
                  </td>
                  <td className="p-4">
                    {c.redFlagsCount > 0 ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 inline-flex items-center space-x-1">
                        <AlertTriangle className="w-3 h-3 text-red-500" />
                        <span>{c.redFlagsCount} Red Flag Alert</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Clear
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => loadPatientCase(c.patientId)}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-700 border border-rose-200 font-bold text-xs transition inline-flex items-center space-x-1 shadow-2xs"
                    >
                      <span>Open EMR Sheet</span>
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
