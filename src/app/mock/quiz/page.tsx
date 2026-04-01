'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Flag, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface Question {
  id: number;
  text: string;
  image?: string;
  options: string[];
  optionsMap: Record<string, string>; // Maps option number to text (e.g., "option1": "a")
  correctAnswer?: string; // Will be "option1", "option2", etc.
  section: string;
}

interface Section {
  id: string;
  name: string;
  timeLimit: number; // in seconds
  questionRange: {
    start: number;
    end: number;
  };
}

interface ApiResponse {
  questions: Question[];
  domain: string;
  count: number;
  sections: Section[];
}

function QuizAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [currentSection, setCurrentSection] = useState<string>('A');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [sectionTimers, setSectionTimers] = useState<Record<string, number>>({
    'A': 30 * 60, // 30 minutes for section A
    'B': 30 * 60, // 30 minutes for section B
    'C': 30 * 60, // 30 minutes for section C
  });
  const [sections] = useState<Section[]>([
    { id: 'A', name: 'Aptitude', timeLimit: 30 * 60, questionRange: { start: 1, end: 20 } },
    { id: 'B', name: 'Programming Basics', timeLimit: 30 * 60, questionRange: { start: 21, end: 40 } },
    { id: 'C', name: 'Technical', timeLimit: 30 * 60, questionRange: { start: 41, end: 60 } },
  ]);
  const [domain, setDomain] = useState('Aptitude');
  const [totalQuestions, setTotalQuestions] = useState(60);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch questions from API
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const domainParam = params.get('domain') ?? 'aptitude';
    const questionsParam = parseInt(params.get('questions') ?? '10');
    const timeParam = parseInt(params.get('time') ?? '30');

    setDomain(domainParam.charAt(0).toUpperCase() + domainParam.slice(1));
    setTotalQuestions(questionsParam);
    
    // Initialize section timers based on the time parameter
    setSectionTimers({
      'A': timeParam * 60,
      'B': timeParam * 60,
      'C': timeParam * 60,
    });

    // Fetch questions from the API
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/mock/questions?domain=${domainParam}&questions=${questionsParam}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }

        const data = await response.json() as ApiResponse;

        if (data.questions && data.questions.length > 0) {
          // Renumber questions from 1 to n
          const renumberedQuestions: Question[] = data.questions.map((q, index) => ({
            ...q,
            id: index + 1,
          }));
          setQuestions(renumberedQuestions);
          setTotalQuestions(renumberedQuestions.length);

          // Log to verify correct answers are loaded
          console.log('Questions loaded:', renumberedQuestions.length);
          console.log('Sample question:', {
            id: renumberedQuestions[0]?.id,
            text: renumberedQuestions[0]?.text.substring(0, 50) + '...',
            correctAnswer: renumberedQuestions[0]?.correctAnswer,
            hasCorrectAnswer: !!renumberedQuestions[0]?.correctAnswer
          });
        } else {
          setError('No questions found for this domain');
        }
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions().catch(console.error);
  }, []);

  const handleSubmit = useCallback(() => {
    const answeredCount = Object.keys(selectedAnswers).length;
    const unfinishedSections = sections.filter(section => (sectionTimers[section.id] ?? 0) > 0);
    
    if (unfinishedSections.length > 0) {
      const message = `You still have time remaining in ${unfinishedSections.length} section(s). Are you sure you want to submit?`;
      if (!confirm(message)) {
        return;
      }
    }

    if (confirm(`You have answered ${answeredCount} out of ${totalQuestions} questions. Are you sure you want to submit?`)) {
      // Calculate results for each section
      const sectionResults = sections.map(section => {
        const sectionQuestions = questions.filter(q => 
          q.id >= section.questionRange.start && 
          q.id <= section.questionRange.end
        );
        
        let correctAnswers = 0;
        let incorrectAnswers = 0;

        sectionQuestions.forEach((question) => {
          const userSelectedOption = selectedAnswers[question.id];
          if (userSelectedOption) {
            const correctOption = question.correctAnswer?.trim() ?? '';
            if (correctOption && userSelectedOption === correctOption) {
              correctAnswers++;
              console.log(`Section ${section.id} - Q${question.id}: ✅ Correct!`);
            } else if (correctOption) {
              incorrectAnswers++;
              console.log(`Section ${section.id} - Q${question.id}: ❌ Wrong!`);
            }
          }
        });

        return {
          sectionId: section.id,
          sectionName: section.name,
          total: sectionQuestions.length,
          correct: correctAnswers,
          incorrect: incorrectAnswers,
          timeSpent: section.timeLimit - (sectionTimers[section.id] ?? 0)
        };
      });

      const totalCorrect = sectionResults.reduce((sum, section) => sum + section.correct, 0);
      const totalIncorrect = sectionResults.reduce((sum, section) => sum + section.incorrect, 0);
      
      // Format section times
      const sectionTimesFormatted = sectionResults.map(section => {
        const minutes = Math.floor(section.timeSpent / 60);
        const seconds = section.timeSpent % 60;
        return `${section.sectionName}=${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }).join(',');

      // Navigate to results page with detailed section data
      const resultsParams = new URLSearchParams({
        total: totalQuestions.toString(),
        correct: totalCorrect.toString(),
        incorrect: totalIncorrect.toString(),
        sections: JSON.stringify(sectionResults),
        sectionTimes: sectionTimesFormatted,
        domain: domain,
      });

      window.location.href = `/mock/results?${resultsParams.toString()}`;
    }
  }, [selectedAnswers, totalQuestions, questions, domain, sections, sectionTimers]);

  // All sections timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSectionTimers((prev) => {
        const newTimers = { ...prev };
        let allExpired = true;
        
        // Update all section timers simultaneously
        sections.forEach(section => {
          const currentTime = newTimers[section.id] ?? 0;
          if (currentTime > 0) {
            newTimers[section.id] = currentTime - 1;
            allExpired = false;
          }
          
          // If a section timer expires and it's the current section, switch to another section
          if (currentTime <= 0 && section.id === currentSection) {
            const nextAvailableSection = sections.find(s => {
              const sectionTime = newTimers[s.id] ?? 0;
              return s.id !== currentSection && sectionTime > 0;
            })?.id;
            
            if (nextAvailableSection) {
              setCurrentSection(nextAvailableSection);
            }
          }
        });
        
        // If all timers have expired, submit the quiz
        if (allExpired) {
          clearInterval(timer);
          handleSubmit();
        }
        
        return newTimers;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleSubmit, sections, currentSection]);

  const formatTime = (seconds: number | undefined) => {
    if (typeof seconds !== 'number') return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: answer
    });
  };

  const handleFlag = () => {
    const newFlagged = new Set(flaggedQuestions);
    if (newFlagged.has(currentQuestion)) {
      newFlagged.delete(currentQuestion);
    } else {
      newFlagged.add(currentQuestion);
    }
    setFlaggedQuestions(newFlagged);
  };

  const currentSectionData = sections.find(s => s.id === currentSection);

  const handleNext = () => {
    if (!currentSectionData) return;
    
    if (currentQuestion < currentSectionData.questionRange.end) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Try to move to next section
      const nextSectionIndex = sections.findIndex(s => s.id === currentSection) + 1;
      const nextSection = sections[nextSectionIndex];
      if (nextSection) {
        setCurrentSection(nextSection.id);
        setCurrentQuestion(nextSection.questionRange.start);
      }
    }
  };

  const handlePrev = () => {
    if (!currentSectionData) return;
    
    if (currentQuestion > currentSectionData.questionRange.start) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      // Try to move to previous section
      const prevSectionIndex = sections.findIndex(s => s.id === currentSection) - 1;
      const prevSection = sections[prevSectionIndex];
      if (prevSection) {
        setCurrentSection(prevSection.id);
        setCurrentQuestion(prevSection.questionRange.end);
      }
    }
  };

  const handleQuestionClick = (questionNum: number) => {
    setCurrentQuestion(questionNum);
  };

  const getQuestionStatus = (qNum: number) => {
    if (qNum === currentQuestion) return 'current';
    if (flaggedQuestions.has(qNum)) return 'flagged';
    if (selectedAnswers[qNum]) return 'answered';
    return 'not-answered';
  };

  const getQuestionColor = (status: string) => {
    switch (status) {
      case 'current': return 'bg-blue-500 text-white';
      case 'flagged': return 'bg-purple-500 text-white';
      case 'answered': return 'bg-green-500 text-white';
      default: return 'bg-red-500 text-white';
    }
  };

  const currentQ = questions[currentQuestion - 1];
  const answeredCount = Object.keys(selectedAnswers).length;

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading questions...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Questions</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Show message if no questions
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
          <div className="text-gray-400 text-5xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Questions Available</h2>
          <p className="text-gray-600 mb-6">There are no questions available for the selected domain.</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl text-blue-600 font-semibold">Sections</h2>
          <div className="text-right">
            <div className="text-2xl font-bold text-red-600">
              {formatTime(sectionTimers[currentSection])}
            </div>
            <div className="text-sm text-gray-600">Current Section Time Remaining</div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setCurrentSection(section.id)}
              className={`p-4 rounded-lg transition-colors ${
                currentSection === section.id
                  ? 'bg-blue-700 text-white'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              <div className="font-semibold">{section.name}</div>
              <div className="text-sm mt-1">
                Questions {section.questionRange.start}-{section.questionRange.end}
              </div>
              <div className="text-sm mt-1">
                Time: {formatTime(sectionTimers[section.id])}
              </div>
            </button>
          ))}
        </div>
        
        <div className="text-sm text-gray-600">
          <p>Current Section: <span className="font-semibold">{
            sections.find(s => s.id === currentSection)?.name
          }</span></p>
          <p className="mt-1">
            Navigate between sections freely. Each section has its own timer.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Question Section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Question Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Question:</h2>
              <button
                onClick={handleFlag}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${flaggedQuestions.has(currentQuestion)
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                <Flag size={18} />
                Flag/Unflag
              </button>
            </div>

            <div className="mb-4">
              <span className="text-lg font-semibold">{currentQuestion} [ 1 Mark ]</span>
            </div>

            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6">
              {currentQ ? (
                <>
                  <p className="text-gray-800 text-base leading-relaxed">{currentQ.text}</p>
                  {currentQ.image && (
                    <div className="mt-4 relative w-full max-w-2xl mx-auto">
                      <Image
                        src={currentQ.image}
                        alt="Question illustration"
                        width={800}
                        height={600}
                        className="rounded-lg"
                        style={{ width: '100%', height: 'auto' }}
                      />
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-800 text-base leading-relaxed">Loading question...</p>
              )}
            </div>

            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handlePrev}
                disabled={currentQuestion === 1}
                className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
                Prev
              </button>
              <button
                onClick={handleNext}
                disabled={currentQuestion === totalQuestions}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Answer Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Answer</h2>
              {selectedAnswers[currentQuestion] && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Answered
                </span>
              )}
            </div>

            <div className="space-y-3">
              {currentQ?.options.map((option, index) => {
                const optionKey = `option${index + 1}`; // "option1", "option2", etc.
                return (
                  <label
                    key={index}
                    className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={optionKey}
                      checked={selectedAnswers[currentQuestion] === optionKey}
                      onChange={(e) => handleAnswerSelect(e.target.value)}
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="text-gray-800">{option}</span>
                  </label>
                );
              })}
            </div>

            <button
              onClick={handleSubmit}
              className="w-full mt-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              Submit Test
            </button>
          </div>
        </div>

        {/* Question Navigation Sidebar */}
        <div className="space-y-4">
          {/* Question Grid */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Questions</h3>
            <div className="grid grid-cols-5 gap-2 mb-6">
              {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((qNum) => {
                const status = getQuestionStatus(qNum);
                return (
                  <button
                    key={qNum}
                    onClick={() => handleQuestionClick(qNum)}
                    className={`aspect-square rounded-lg font-semibold text-sm transition-colors ${getQuestionColor(status)}`}
                  >
                    {qNum}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Legend:</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500 rounded"></div>
                <span className="text-sm text-gray-700">Not Answered</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-700">Answered</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500 rounded"></div>
                <span className="text-sm text-gray-700">Flagged</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded"></div>
                <span className="text-sm text-gray-700">Current Question</span>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Answered:</span>
                <span className="font-semibold">{answeredCount}/{totalQuestions}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Flagged:</span>
                <span className="font-semibold">{flaggedQuestions.size}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Not Answered:</span>
                <span className="font-semibold">{totalQuestions - answeredCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizAssessment;
