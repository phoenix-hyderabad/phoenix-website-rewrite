'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Flag, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface Question {
  id: number;
  text: string;
  image?: string;
  options: string[];
  optionsMap: Record<string, string>;
  correctAnswer?: string;
  section: string;
}

interface ApiResponse {
  questions: Question[];
  domain: string;
  count: number;
}

function QuizAssessment() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // default 30 min
  const [totalTimeLimit, setTotalTimeLimit] = useState(30 * 60);
  const [domain, setDomain] = useState('Aptitude');
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Fetch questions from API
  useEffect(() => {
    const domainParam = searchParams.get('domain') ?? 'aptitude';
    const questionsParam = parseInt(searchParams.get('questions') ?? '10');
    const timeParam = parseInt(searchParams.get('time') ?? '30');

    setDomain(domainParam.charAt(0).toUpperCase() + domainParam.slice(1));
    setTimeRemaining(timeParam * 60);
    setTotalTimeLimit(timeParam * 60);

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
  }, [searchParams]);

  const handleSubmit = useCallback((forceSubmit = false) => {
    if (submitted) return;

    const answeredCount = Object.keys(selectedAnswers).length;

    if (!forceSubmit) {
      if (!confirm(`You have answered ${answeredCount} out of ${totalQuestions} questions. Are you sure you want to submit?`)) {
        return;
      }
    }

    setSubmitted(true);

    // Calculate results
    let correctCount = 0;
    let incorrectCount = 0;

    questions.forEach((question) => {
      const userSelectedOption = selectedAnswers[question.id];
      if (userSelectedOption) {
        const correctOption = question.correctAnswer?.trim() ?? '';
        if (correctOption && userSelectedOption === correctOption) {
          correctCount++;
        } else if (correctOption) {
          incorrectCount++;
        }
      }
    });

    // Calculate time spent
    const timeSpentSeconds = totalTimeLimit - timeRemaining;
    const minutes = Math.floor(timeSpentSeconds / 60);
    const seconds = timeSpentSeconds % 60;
    const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Navigate to results page
    const resultsParams = new URLSearchParams({
      total: totalQuestions.toString(),
      correct: correctCount.toString(),
      incorrect: incorrectCount.toString(),
      time: timeFormatted,
      domain: domain,
    });

    router.push(`/mock/results?${resultsParams.toString()}`);
  }, [selectedAnswers, totalQuestions, questions, domain, timeRemaining, totalTimeLimit, submitted, router]);

  // Timer countdown
  useEffect(() => {
    if (loading || submitted || totalQuestions === 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-submit without confirmation dialogs
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, submitted, totalQuestions, handleSubmit]);

  const formatTime = (seconds: number) => {
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

  const handleNext = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleQuestionClick = (questionNum: number) => {
    if (questionNum >= 1 && questionNum <= totalQuestions) {
      setCurrentQuestion(questionNum);
    }
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

  // Determine timer urgency color
  const timerColor = timeRemaining <= 60
    ? 'text-red-600 animate-pulse'
    : timeRemaining <= 300
      ? 'text-orange-500'
      : 'text-red-600';

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
            onClick={() => router.back()}
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
            onClick={() => router.back()}
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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl text-blue-600 font-semibold">{domain} Assessment</h2>
            <p className="text-sm text-gray-600 mt-1">
              {totalQuestions} questions · {formatTime(totalTimeLimit)} total time
            </p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${timerColor}`}>
              {formatTime(timeRemaining)}
            </div>
            <div className="text-sm text-gray-600">Time Remaining</div>
          </div>
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
                const optionKey = `option${index + 1}`;
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
              onClick={() => handleSubmit(false)}
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

function QuizPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading assessment...</p>
        </div>
      </div>
    }>
      <QuizAssessment />
    </Suspense>
  );
}

export default QuizPageWrapper;
