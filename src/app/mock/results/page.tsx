/**
 * Mock OA Results Page
 * 
 * This page displays the results after completing a mock online assessment.
 * 
 * Design Features:
 * - Dark gradient background (slate-800 -> slate-900 -> blue-900) matching the mock OA theme
 * - Red accent colors (#ef4444) consistent with the Phoenix branding
 * - Responsive grid layout for statistics cards
 * - Animated progress bars showing performance breakdown
 * - Performance level badges (Excellent, Very Good, Good, Average, Needs Improvement)
 * - Motivational messages based on score percentage
 * 
 * URL Parameters:
 * - total: Total number of questions
 * - correct: Number of correct answers
 * - incorrect: Number of incorrect answers
 * - time: Time taken (MM:SS format)
 * - domain: Assessment domain (Aptitude, Analog, Digital, Embedded)
 * 
 * Navigation:
 * - "Retake Assessment" button -> /mock
 * - "Go to Home" button -> /home
 * - Auto-redirects to /mock if accessed without result data
 */

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Trophy, CheckCircle2, XCircle, Clock, Target, TrendingUp, Home, RotateCcw } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface ResultStats {
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    unanswered: number;
    timeTaken: string;
    domain: string;
    score: number;
    percentage: number;
}

function MockOAResults() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<ResultStats>({
        totalQuestions: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        unanswered: 0,
        timeTaken: '00:00',
        domain: 'Aptitude',
        score: 0,
        percentage: 0,
    });

    useEffect(() => {
        // Check if we have results data
        const hasData = searchParams.get('total') !== null;

        if (!hasData) {
            // Redirect to mock page if no data
            router.push('/mock');
            return;
        }

        // Parse URL parameters
        const totalQuestions = parseInt(searchParams.get('total') ?? '0');
        const correctAnswers = parseInt(searchParams.get('correct') ?? '0');
        const incorrectAnswers = parseInt(searchParams.get('incorrect') ?? '0');
        const timeTaken = searchParams.get('time') ?? '00:00';
        const domain = searchParams.get('domain') ?? 'Aptitude';

        // Guard against invalid values
        const safeTotalQuestions = isNaN(totalQuestions) || totalQuestions <= 0 ? 1 : totalQuestions;
        const safeCorrectAnswers = isNaN(correctAnswers) ? 0 : correctAnswers;
        const safeIncorrectAnswers = isNaN(incorrectAnswers) ? 0 : incorrectAnswers;

        const unanswered = Math.max(0, safeTotalQuestions - safeCorrectAnswers - safeIncorrectAnswers);
        const percentage = Math.round((safeCorrectAnswers / safeTotalQuestions) * 100);

        setStats({
            totalQuestions: safeTotalQuestions,
            correctAnswers: safeCorrectAnswers,
            incorrectAnswers: safeIncorrectAnswers,
            unanswered,
            timeTaken,
            domain,
            score: safeCorrectAnswers,
            percentage: isNaN(percentage) ? 0 : percentage,
        });

        setLoading(false);
    }, [searchParams, router]);

    const getPerformanceLevel = (percentage: number) => {
        if (percentage >= 90) return { level: 'Excellent', color: 'text-green-400', bgColor: 'bg-green-500/20' };
        if (percentage >= 75) return { level: 'Very Good', color: 'text-blue-400', bgColor: 'bg-blue-500/20' };
        if (percentage >= 60) return { level: 'Good', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' };
        if (percentage >= 40) return { level: 'Average', color: 'text-orange-400', bgColor: 'bg-orange-500/20' };
        return { level: 'Needs Improvement', color: 'text-red-400', bgColor: 'bg-red-500/20' };
    };

    const safePercentage = (numerator: number, denominator: number) => {
        if (denominator <= 0) return 0;
        return (numerator / denominator) * 100;
    };

    const performance = getPerformanceLevel(stats.percentage);

    const handleRetakeQuiz = () => {
        router.push('/mock');
    };

    const handleGoHome = () => {
        router.push('/home');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
                    <p className="text-lg text-white">Loading results...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 py-12 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-6">
                        <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 rounded-full shadow-lg shadow-red-500/50">
                            <Trophy size={64} className="text-white" />
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Assessment Complete!</h1>
                    <p className="text-xl text-gray-300">
                        Domain: <span className="font-semibold text-red-400">{stats.domain}</span>
                    </p>
                </div>

                {/* Performance Badge */}
                <div className="mb-8">
                    <div className={`max-w-md mx-auto ${performance.bgColor} border-2 border-slate-700 rounded-2xl p-6 text-center`}>
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <TrendingUp size={28} className={performance.color} />
                            <h2 className={`text-3xl font-bold ${performance.color}`}>
                                {performance.level}
                            </h2>
                        </div>
                        <p className="text-white text-lg">
                            You scored <span className="font-bold text-2xl">{stats.percentage}%</span>
                        </p>
                    </div>
                </div>

                {/* Score Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {/* Total Questions */}
                    <div className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-6 hover:border-red-500/50 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-blue-500/20 p-3 rounded-lg">
                                <Target size={28} className="text-blue-400" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Total Questions</p>
                                <p className="text-3xl font-bold text-white">{stats.totalQuestions}</p>
                            </div>
                        </div>
                    </div>

                    {/* Correct Answers */}
                    <div className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-6 hover:border-red-500/50 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-green-500/20 p-3 rounded-lg">
                                <CheckCircle2 size={28} className="text-green-400" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Correct</p>
                                <p className="text-3xl font-bold text-white">{stats.correctAnswers}</p>
                            </div>
                        </div>
                    </div>

                    {/* Incorrect Answers */}
                    <div className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-6 hover:border-red-500/50 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-red-500/20 p-3 rounded-lg">
                                <XCircle size={28} className="text-red-400" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Incorrect</p>
                                <p className="text-3xl font-bold text-white">{stats.incorrectAnswers}</p>
                            </div>
                        </div>
                    </div>

                    {/* Time Taken */}
                    <div className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-6 hover:border-red-500/50 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-purple-500/20 p-3 rounded-lg">
                                <Clock size={28} className="text-purple-400" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Time Taken</p>
                                <p className="text-3xl font-bold text-white">{stats.timeTaken}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="bg-slate-800/50 border-2 border-slate-700 rounded-xl p-8 mb-8">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <div className="bg-red-500/20 p-2 rounded-lg">
                            <Target size={24} className="text-red-400" />
                        </div>
                        Performance Breakdown
                    </h2>

                    {/* Progress Bars */}
                    <div className="space-y-6">
                        {/* Correct Answers Bar */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-300 font-medium">Correct Answers</span>
                                <span className="text-green-400 font-bold">
                                    {stats.correctAnswers}/{stats.totalQuestions}
                                </span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-green-500 to-green-400 h-full rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${safePercentage(stats.correctAnswers, stats.totalQuestions)}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Incorrect Answers Bar */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-300 font-medium">Incorrect Answers</span>
                                <span className="text-red-400 font-bold">
                                    {stats.incorrectAnswers}/{stats.totalQuestions}
                                </span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-red-500 to-red-400 h-full rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${safePercentage(stats.incorrectAnswers, stats.totalQuestions)}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Unanswered Bar */}
                        {stats.unanswered > 0 && (
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-300 font-medium">Unanswered</span>
                                    <span className="text-gray-400 font-bold">
                                        {stats.unanswered}/{stats.totalQuestions}
                                    </span>
                                </div>
                                <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-gray-500 to-gray-400 h-full rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${safePercentage(stats.unanswered, stats.totalQuestions)}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Accuracy Percentage */}
                    <div className="mt-8 pt-6 border-t border-slate-700">
                        <div className="flex items-center justify-between">
                            <span className="text-xl text-gray-300 font-medium">Overall Accuracy</span>
                            <span className={`text-4xl font-bold ${performance.color}`}>
                                {stats.percentage}%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={handleRetakeQuiz}
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-red-500 text-white rounded-xl text-lg font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/50 hover:shadow-red-500/70 hover:scale-105"
                    >
                        <RotateCcw size={24} />
                        Retake Assessment
                    </button>
                    <button
                        onClick={handleGoHome}
                        className="flex items-center justify-center gap-3 px-8 py-4 border-2 border-red-500 text-white rounded-xl text-lg font-bold hover:bg-red-500/10 transition-all hover:scale-105"
                    >
                        <Home size={24} />
                        Go to Home
                    </button>
                </div>
            </div>
        </div>
    );
}

function ResultsPageWrapper() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
                    <p className="text-lg text-white">Loading results...</p>
                </div>
            </div>
        }>
            <MockOAResults />
        </Suspense>
    );
}

export default ResultsPageWrapper;
