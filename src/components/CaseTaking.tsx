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
} from 'lucide-react';

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

  // Handle Speech Recording Simulation & Web Speech API
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
      // Append simulated voice transcript if user hasn't typed
      if (!inputVal.trim()) {
        const voiceText =
          language === 'ta'
            ? 'எனக்கு 3 நாட்களாக காய்ச்சல் மற்றும் கடும் தலைவலி உள்ளது.'
            : language === 'th'
            ? 'Enaku 3 days-ah fever iruku, head and body severe-ah valikudhu doctor.'
            : 'I have fever for 3 days with severe headache and bodyache.';
        addChatMessage(voiceText, 'patient', true);
      }
    } else {
      setIsRecording(true);
      // Attempt Browser Web Speech API if supported
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
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Banner Patient Context */}
      <div className="mb-6 p-4 rounded-2xl bg-slate-900 border border-teal-500/30 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 font-bold">
            PAT
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center space-x-2">
              <span>{patient.name}</span>
              <span className="text-xs font-normal text-slate-400">({patient.id})</span>
            </h3>
            <p className="text-xs text-slate-400">
              {patient.age} yrs • {patient.gender} • Language: <span className="text-teal-300 font-semibold">{patient.preferredLanguage.toUpperCase()}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveStep(6)} // Proceed to Structured Symptoms
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-semibold transition"
          >
            <span>Step 6: Structured Symptoms</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Chat Conversation Stream & Voice Input (Step 4) */}
        <div className="lg:col-span-7 flex flex-col h-[650px] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          {/* Stream Header */}
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="font-bold text-sm text-white">{t('conversationHistory')}</h3>
            </div>
            <span className="text-[11px] text-slate-400">Live Voice & Text Sync</span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {chatHistory.map(msg => (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${
                  msg.sender === 'patient' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    msg.sender === 'patient'
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950'
                  }`}
                >
                  {msg.sender === 'patient' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed shadow-lg ${
                    msg.sender === 'patient'
                      ? 'bg-slate-800 text-slate-100 border border-slate-700 rounded-tr-none'
                      : 'bg-teal-950/80 text-teal-100 border border-teal-500/30 rounded-tl-none'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 text-[10px] text-slate-400">
                    <span className="font-semibold text-teal-300">
                      {msg.sender === 'patient' ? patient.name : 'ClinAssist AI'}
                    </span>
                    <span className="flex items-center space-x-1">
                      {msg.isAudio && <Volume2 className="w-3 h-3 text-cyan-400 inline mr-1" />}
                      <span>{msg.timestamp}</span>
                    </span>
                  </div>
                  <p className="text-sm font-medium">{msg.text}</p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Recording Audio Wave animation indicator */}
          {isRecording && (
            <div className="p-3 bg-red-950/80 border-t border-red-500/40 flex items-center justify-between animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-bold text-red-300">
                  🎙️ {t('recordingActive')} ({recordingTimer}s)
                </span>
              </div>
              <span className="text-[10px] text-red-200">{t('speakNowPrompt')}</span>
            </div>
          )}

          {/* Bottom Controls: Mic Toggle & Text Input */}
          <div className="p-4 bg-slate-950 border-t border-slate-800">
            <div className="flex items-center space-x-2">
              {/* Mic Toggle Button */}
              <button
                type="button"
                onClick={toggleVoiceRecording}
                className={`p-3.5 rounded-2xl font-bold transition flex items-center justify-center shrink-0 shadow-lg ${
                  isRecording
                    ? 'bg-red-500 hover:bg-red-600 text-white animate-bounce'
                    : 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950'
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
                    : 'Describe chief complaint (e.g. Fever for 3 days)...'
                }
                className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-2xl text-xs text-white focus:outline-none focus:border-teal-400 placeholder-slate-500"
              />

              {/* Send Button */}
              <button
                type="button"
                onClick={handleSend}
                className="p-3.5 rounded-2xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold transition shrink-0 shadow-lg"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: STEP 5 AI Adaptive Questions Panel */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          <div className="p-6 bg-slate-900 border border-teal-500/30 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-teal-400 uppercase tracking-widest block">
                  STEP 5 — AI Decision Engine
                </span>
                <h3 className="font-bold text-base text-white">{t('adaptiveQuestions')}</h3>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              ClinAssist dynamically analyzes patient input and asks targeted clinical follow-up questions to rule out severe conditions.
            </p>

            {/* Questions List */}
            <div className="space-y-4">
              {adaptiveQuestions.map((q, idx) => {
                const qText =
                  language === 'ta' ? q.questionTa : language === 'th' ? q.questionTh : q.questionEn;
                const options =
                  language === 'ta' ? q.optionsTa : language === 'th' ? q.optionsTh : q.optionsEn;

                return (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <div className="flex items-start space-x-2">
                      <HelpCircle className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                      <h4 className="text-xs font-bold text-teal-200">{qText}</h4>
                    </div>

                    {/* Interactive Answer Option Pills */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {options?.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => handleQuickQuestionAnswer(opt)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-teal-500/20 text-slate-200 hover:text-teal-300 border border-slate-700 hover:border-teal-500/40 text-[11px] font-medium transition text-left"
                        >
                          + {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Summary Preview Box */}
            <div className="mt-6 p-4 rounded-2xl bg-teal-950/40 border border-teal-500/30">
              <h4 className="text-[11px] font-bold text-teal-300 uppercase tracking-wider mb-2">
                Live Extracted Symptom State:
              </h4>
              <div className="text-xs text-slate-300 space-y-1">
                <p>• Complaint: <span className="text-white font-semibold">{symptoms.complaint}</span></p>
                <p>• Duration: <span className="text-white font-semibold">{symptoms.duration}</span></p>
                <p>• Severity: <span className="text-amber-300 font-semibold">{symptoms.severity}/10</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
