'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { usePatient } from '../context/PatientContext';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  Bot,
  User,
  Volume2,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  Clock,
  HeartPulse,
  Activity,
  Sliders,
} from 'lucide-react';
import { hospitalAudio } from '../lib/hospital-audio';

export const CaseTaking: React.FC = () => {
  const { t, language } = useLanguage();
  const {
    patient,
    chatHistory,
    addChatMessage,
    setActiveStep,
    isRecording,
    setIsRecording,
    adaptiveQuestions,
    symptoms,
    vitals,
    hospitalAssignment,
  } = usePatient();

  const [inputVal, setInputVal] = useState('');
  const [speechSupported, setSpeechSupported] = useState(false);
  const [recordingTimer, setRecordingTimer] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setSpeechSupported(true);
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Voice Recording simulation & timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => setRecordingTimer(prev => prev + 1), 1000);
    } else {
      setRecordingTimer(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const toggleVoiceRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      hospitalAudio.playPulse();

      // If user hasn't typed, append realistic clinical speech
      if (!inputVal.trim()) {
        const voiceText =
          language === 'ta'
            ? 'எனக்கு 3 நாட்களாக காய்ச்சல் மற்றும் கடும் உடல்வலி உள்ளது, தலையும் வலிக்கிறது.'
            : language === 'th'
            ? 'Enaku 3 days-ah fever iruku, bodyache and headache severe-ah iruku doctor.'
            : 'I have had fever for 3 days with severe headache and general bodyache.';
        addChatMessage(voiceText, 'patient', true);
      }
    } else {
      setIsRecording(true);
      hospitalAudio.playPulse();

      // Browser Web Speech API
      if (typeof window !== 'undefined') {
        const SpeechRecognition =
          (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
          try {
            const recognition = new SpeechRecognition();
            recognition.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-US';
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.onresult = (event: any) => {
              const transcript = event.results[0][0].transcript;
              setInputVal(transcript);
              setIsRecording(false);
            };
            recognition.onerror = () => setIsRecording(false);
            recognition.start();
          } catch (e) {
            console.log('Web Speech API fallback active', e);
          }
        }
      }
    }
  };

  const handleSend = () => {
    if (!inputVal.trim()) return;
    addChatMessage(inputVal.trim(), 'patient');
    setInputVal('');
  };

  const handleQuickQuestionAnswer = (optText: string) => {
    addChatMessage(optText, 'patient');
    hospitalAudio.playPulse();
  };

  const handleSpeak = (text: string) => {
    hospitalAudio.speakText(text, language);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Banner Patient Context & Real-Time Telemetry Bar */}
      <div className="mb-6 p-5 rounded-3xl bg-white border border-rose-200/80 flex flex-wrap items-center justify-between gap-4 shadow-sm shadow-rose-100/50">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 font-extrabold text-sm shadow-xs">
            PAT
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-base text-slate-900">{patient.name}</h3>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                {hospitalAssignment?.tokenNumber || patient.id}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {hospitalAssignment?.department}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {patient.age} yrs • {patient.gender} • Language: <strong className="text-rose-700">{patient.preferredLanguage.toUpperCase()}</strong> • Room: {hospitalAssignment?.roomBed}
            </p>
          </div>
        </div>

        {/* Live Vitals Pill */}
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-3 px-4 py-2 rounded-2xl bg-rose-50/60 border border-rose-200 text-xs">
            <div className="flex items-center space-x-1.5 text-rose-700 font-bold">
              <HeartPulse className="w-4 h-4 text-rose-500 animate-ecg-heart" />
              <span>{vitals.heartRate} <span className="text-[10px] text-slate-500 font-normal">BPM</span></span>
            </div>
            <span className="text-rose-200">|</span>
            <div className="text-slate-700 font-semibold">
              BP: <span className="font-bold text-slate-900">{vitals.bloodPressureSys}/{vitals.bloodPressureDia}</span>
            </div>
            <span className="text-rose-200">|</span>
            <div className="text-slate-700 font-semibold">
              SpO2: <span className="font-bold text-emerald-700">{vitals.spO2}%</span>
            </div>
            <span className="text-rose-200">|</span>
            <div className="text-slate-700 font-semibold">
              Temp: <span className="font-bold text-amber-700">{vitals.temperature}°F</span>
            </div>
          </div>

          <button
            onClick={() => setActiveStep(6)} // Step 6 Structured Symptoms
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs font-bold shadow-md shadow-rose-200 transition transform hover:-translate-y-0.5"
          >
            <span>Step 6: Structured Symptoms</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Chat Conversation Stream & Voice Input (Step 4) */}
        <div className="lg:col-span-7 flex flex-col h-[670px] bg-white border border-rose-200/80 rounded-3xl overflow-hidden shadow-sm shadow-rose-100/50">
          {/* Stream Header */}
          <div className="p-4 bg-gradient-to-r from-rose-50/60 to-pink-50/40 border-b border-rose-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <h3 className="font-bold text-sm text-slate-900">{t('conversationHistory')}</h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white text-rose-700 border border-rose-200">
                Live Speech & Text Sync
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Bilingual Clinical NLP</span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-hospital-canvas">
            {chatHistory.map(msg => (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${
                  msg.sender === 'patient' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 text-xs font-bold shadow-xs ${
                    msg.sender === 'patient'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : 'bg-gradient-to-tr from-rose-500 to-pink-500 text-white'
                  }`}
                >
                  {msg.sender === 'patient' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[82%] p-4 rounded-2xl text-xs leading-relaxed shadow-xs ${
                    msg.sender === 'patient'
                      ? 'bg-white text-slate-900 border border-slate-200 rounded-tr-xs'
                      : 'bg-rose-50 text-slate-900 border border-rose-200/80 rounded-tl-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 text-[10px] text-slate-400">
                    <span className="font-bold text-rose-700">
                      {msg.sender === 'patient' ? patient.name : 'ClinAssist Clinical AI'}
                    </span>
                    <div className="flex items-center space-x-2">
                      {msg.isAudio && (
                        <span className="text-[10px] font-semibold text-rose-600 flex items-center">
                          <Volume2 className="w-3 h-3 mr-0.5" /> Spoken
                        </span>
                      )}
                      <span>{msg.timestamp}</span>
                      {msg.sender === 'clinassist' && (
                        <button
                          type="button"
                          onClick={() => handleSpeak(msg.text)}
                          className="p-1 hover:text-rose-600 transition"
                          title="Listen to AI voice"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm font-medium text-slate-800">{msg.text}</p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Recording Audio Wave animation indicator */}
          {isRecording && (
            <div className="p-3.5 bg-rose-500 text-white flex items-center justify-between animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-white animate-ping" />
                <span className="text-xs font-bold">
                  🎙️ {t('recordingActive')} ({recordingTimer}s)
                </span>
              </div>
              <span className="text-[11px] font-medium text-rose-100">{t('speakNowPrompt')}</span>
            </div>
          )}

          {/* Bottom Controls: Mic Toggle & Text Input */}
          <div className="p-4 bg-white border-t border-rose-100">
            <div className="flex items-center space-x-2">
              {/* Mic Toggle Button */}
              <button
                type="button"
                onClick={toggleVoiceRecording}
                className={`p-3.5 rounded-2xl font-bold transition flex items-center justify-center shrink-0 shadow-sm ${
                  isRecording
                    ? 'bg-rose-600 hover:bg-rose-700 text-white animate-bounce'
                    : 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200'
                }`}
                title={isRecording ? t('stopRecording') : t('startRecording')}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder={
                  language === 'ta'
                    ? 'அறிகுறிகளை உள்ளிடவும் அல்லது மைக் பயன்படுத்தவும்...'
                    : language === 'th'
                    ? 'Enaku fever iruku 3 days ah...'
                    : 'Describe chief complaint (e.g. Fever for 3 days with bodyache)...'
                }
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:border-rose-400 focus:bg-white placeholder-slate-400"
              />

              {/* Send Button */}
              <button
                type="button"
                onClick={handleSend}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold transition shrink-0 shadow-md shadow-rose-200"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: STEP 5 AI Adaptive Questions & Clinical Decision Support */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          <div className="p-6 bg-white border border-rose-200/80 rounded-3xl shadow-sm shadow-rose-100/50 relative overflow-hidden">
            <div className="flex items-center space-x-2.5 mb-4">
              <div className="w-9 h-9 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest block">
                  STEP 5 — AI Adaptive Triage Engine
                </span>
                <h3 className="font-bold text-base text-slate-900">{t('adaptiveQuestions')}</h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              ClinAssist continuously listens to patient complaints and poses targeted rule-out questions to screen for emergent conditions.
            </p>

            {/* Questions List */}
            <div className="space-y-4">
              {adaptiveQuestions.map((q, idx) => {
                const qText =
                  language === 'ta' ? q.questionTa : language === 'th' ? q.questionTh : q.questionEn;
                const options =
                  language === 'ta' ? q.optionsTa : language === 'th' ? q.optionsTh : q.optionsEn;

                return (
                  <div key={idx} className="p-4 rounded-2xl bg-rose-50/40 border border-rose-200/70">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-2">
                        <HelpCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <h4 className="text-xs font-bold text-slate-900">{qText}</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSpeak(qText)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition"
                        title="Read Question Aloud"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Interactive Answer Option Pills */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {options?.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => handleQuickQuestionAnswer(opt)}
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-800 border border-rose-200 text-[11px] font-medium transition text-left shadow-2xs hover:border-rose-300"
                        >
                          + {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Extracted Symptom State Box */}
            <div className="mt-6 p-4 rounded-2xl bg-white border border-rose-200 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[11px] font-bold text-rose-800 uppercase tracking-wider">
                  Live Clinical Entity Extraction:
                </h4>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Real-time Synced
                </span>
              </div>
              <div className="text-xs text-slate-700 space-y-1.5">
                <p>• <strong>Complaint:</strong> <span className="text-rose-950 font-bold">{symptoms.complaint}</span></p>
                <p>• <strong>Duration:</strong> <span className="text-slate-900 font-semibold">{symptoms.duration}</span></p>
                <p>• <strong>Pain Severity:</strong> <span className="text-amber-700 font-bold">{symptoms.severity}/10</span></p>
                <p>• <strong>Associated Signs:</strong> <span className="text-slate-600">{symptoms.associatedSymptoms.join(', ') || 'None'}</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
