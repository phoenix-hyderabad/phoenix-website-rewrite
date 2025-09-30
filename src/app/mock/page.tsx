'use client';

import React, { useState } from 'react';
import { ArrowLeft, Zap, Clock, FileQuestion } from 'lucide-react';

function QADomainSelection() {
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [numQuestions, setNumQuestions] = useState<number>(10);
  const [timeLimit, setTimeLimit] = useState<number>(30);

  const domains = [
    { id: 'analog', name: 'Analog' },
    { id: 'digital', name: 'Digital' },
    { id: 'embedded', name: 'Embedded' },
    { id: 'aptitude', name: 'Aptitude' },
  ] as const;

  const handleBack = () => {
    window.history.back();
  };

  const handleStartAssessment = () => {
    if (!selectedDomain) {
      alert('Please select a domain');
      return;
    }
    
    const params = new URLSearchParams({
      domain: selectedDomain,
      questions: numQuestions.toString(),
      time: timeLimit.toString()
    });
    
    window.location.href = `/mock/quiz?${params.toString()}`;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 flex flex-col">
      {/* Back Button */}
      <div className="p-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-6 py-3 border-2 border-red-500 rounded-lg text-white hover:bg-red-500/10 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">back</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        {/* Title */}
        <h1 className="text-7xl font-bold text-white mb-8">QA</h1>

        {/* Subtitle */}
        <p className="text-gray-300 text-lg text-center max-w-2xl mb-12">
          Select a domain and configure your assessment settings
        </p>

        {/* Domain Selection */}
        <div className="w-full max-w-2xl space-y-4 mb-12">
          <h2 className="text-white text-xl font-semibold mb-4">Select Domain:</h2>
          {domains.map((domain) => (
            <button
              key={domain.id}
              onClick={() => setSelectedDomain(domain.id)}
              className={`w-full py-6 border-2 rounded-xl text-xl font-semibold transition-all ${
                selectedDomain === domain.id
                  ? 'border-red-500 bg-red-500/20 text-white'
                  : 'border-red-500 text-white hover:bg-red-500/10'
              }`}
            >
              {domain.name}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="w-full max-w-2xl space-y-6 mb-8">
          <h2 className="text-white text-xl font-semibold mb-4">Assessment Settings:</h2>
          
          {/* Number of Questions */}
          <div className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileQuestion size={24} className="text-red-500" />
              <label className="text-white text-lg font-medium">Number of Questions:</label>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                style={{accentColor: '#ef4444'}}
              />
              <span className="text-white text-2xl font-bold min-w-[60px] text-center bg-slate-700 px-4 py-2 rounded-lg">
                {numQuestions}
              </span>
            </div>
          </div>

          {/* Time Limit */}
          <div className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock size={24} className="text-red-500" />
              <label className="text-white text-lg font-medium">Time Limit (minutes):</label>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="10"
                max="120"
                step="5"
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                style={{accentColor: '#ef4444'}}
              />
              <span className="text-white text-2xl font-bold min-w-[60px] text-center bg-slate-700 px-4 py-2 rounded-lg">
                {timeLimit}
              </span>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartAssessment}
          disabled={!selectedDomain}
          className={`w-full max-w-2xl py-6 rounded-xl text-xl font-bold transition-all ${
            selectedDomain
              ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/50'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          Start Assessment
        </button>
      </div>
    </div>
  );
}

export default QADomainSelection;
