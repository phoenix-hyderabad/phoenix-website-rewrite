'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, FileQuestion, UploadCloud, Loader2 } from 'lucide-react';

function QADomainSelection() {
  const router = useRouter();
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [numQuestions, setNumQuestions] = useState<number>(10);
  const [timeLimit, setTimeLimit] = useState<number>(30);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadMessage, setUploadMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const domains = [
    { id: 'analog', name: 'Analog' },
    { id: 'digital', name: 'Digital' },
    { id: 'embedded', name: 'Embedded' },
    { id: 'aptitude', name: 'Aptitude' },
  ] as const;

  const handleBack = () => {
    router.back();
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

    router.push(`/mock/quiz?${params.toString()}`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedDomain) {
      setUploadMessage({ text: 'Please select a domain first.', type: 'error' });
      return;
    }
    if (!file) {
      setUploadMessage({ text: 'Please select a PDF file.', type: 'error' });
      return;
    }

    setIsUploading(true);
    setUploadMessage(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('domain', selectedDomain);

    try {
      const res = await fetch('/api/mock/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload');
      }

      setUploadMessage({ text: data.message, type: 'success' });
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setUploadMessage({ text: err.message, type: 'error' });
    } finally {
      setIsUploading(false);
    }
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
              className={`w-full py-6 border-2 rounded-xl text-xl font-semibold transition-all ${selectedDomain === domain.id
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
                style={{ accentColor: '#ef4444' }}
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
                style={{ accentColor: '#ef4444' }}
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
          className={`w-full max-w-2xl py-6 rounded-xl text-xl font-bold transition-all ${selectedDomain
              ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/50'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
        >
          Start Assessment
        </button>

        {/* Admin Upload Section */}
        <div className="w-full max-w-2xl mt-12 bg-slate-800/80 border-2 border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <UploadCloud size={24} className="text-blue-400" />
            <h2 className="text-white text-xl font-semibold">Admin: Upload Questions (PDF)</h2>
          </div>
          <p className="text-gray-400 text-sm mb-6">
            Select a domain above, choose a PDF file formatted with questions (e.g. Q1) ... (A) ...), and click Upload.
          </p>
          
          <div className="flex flex-col gap-4">
            <input 
              type="file" 
              accept=".pdf" 
              onChange={handleFileChange}
              ref={fileInputRef}
              className="text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500/20 file:text-blue-400 hover:file:bg-blue-500/30"
            />
            
            <button
              onClick={handleUpload}
              disabled={isUploading || !file || !selectedDomain}
              className={`py-3 rounded-lg font-bold flex justify-center items-center gap-2 transition-all ${
                isUploading || !file || !selectedDomain
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30'
              }`}
            >
              {isUploading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Parsing and Uploading...
                </>
              ) : (
                'Upload PDF to Database'
              )}
            </button>
            
            {uploadMessage && (
              <div className={`p-4 rounded-lg ${uploadMessage.type === 'error' ? 'bg-red-500/20 text-red-200 border border-red-500/50' : 'bg-green-500/20 text-green-200 border border-green-500/50'}`}>
                {uploadMessage.text}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QADomainSelection;
