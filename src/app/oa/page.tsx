"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Flag, ArrowLeft } from "lucide-react";

// ================== Types ==================
type AppState = "home" | "topics" | "test";

interface Question {
  id: number;
  text: string;
  options: string[];
  selectedAnswer?: number;
  flagged?: boolean;
  marks: number;
}

interface OA_pageProps {
  selectedTopic?: number | null;
  onBackToTopics?: () => void;
}

interface TopicSelectionProps {
  onTopicSelect: (topic: number) => void;
  onBack: () => void;
}

// ================== OA_page ==================
const OA_page: React.FC<OA_pageProps> = ({ selectedTopic, onBackToTopics }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // Generate 60 questions
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      text: "If in a certain code language, BRAVADO is coded as EZSRFNE, then how will RESPECT be coded in the same code language?",
      options: ["XYILVAW", "JYXLWAW", "VAWLJYX", "JYXLWGV"],
      marks: 1,
    },
    ...Array.from({ length: 59 }, (_, i) => ({
      id: i + 2,
      text: `Sample question ${i + 2} for ${
        selectedTopic ? `Topic ${selectedTopic}` : "the assessment"
      }.`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      marks: 1,
    })),
  ]);

  // ✅ Updated handlers (immutable + type-safe)
  const handleAnswerSelect = (optionIndex: number) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q, index) =>
        index === currentQuestion ? { ...q, selectedAnswer: optionIndex } : q
      )
    );
  };

  const handleFlag = () => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q, index) =>
        index === currentQuestion ? { ...q, flagged: !q.flagged } : q
      )
    );
  };

  const navigateToQuestion = (questionIndex: number) => {
    setCurrentQuestion(questionIndex);
  };

  const handlePrevious = () => {
    setCurrentQuestion((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentQuestion((prev) =>
      prev < questions.length - 1 ? prev + 1 : prev
    );
  };

  const getQuestionStatus = (index: number) => {
    const question = questions[index];
    if (question.flagged) return "flagged";
    if (question.selectedAnswer !== undefined) return "answered";
    return "unanswered";
  };

  const getQuestionButtonClass = (index: number) => {
    const status = getQuestionStatus(index);
    const isActive = index === currentQuestion;

    if (isActive) {
      return "bg-blue-600 text-white border-blue-600";
    }

    switch (status) {
      case "answered":
        return "bg-green-500 text-white border-green-500 hover:bg-green-600";
      case "flagged":
        return "bg-purple-500 text-white border-purple-500 hover:bg-purple-600";
      default:
        return "bg-red-500 text-white border-red-500 hover:bg-red-600";
    }
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 via-blue-300 to-blue-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-400 text-white py-2 px-4 flex justify-between items-center text-sm">
        {onBackToTopics && (
          <button
            onClick={onBackToTopics}
            className="flex items-center gap-2 px-3 py-1 border border-white border-opacity-50 rounded hover:bg-white hover:bg-opacity-20 transition-all duration-200"
          >
            <ArrowLeft size={16} />
            Back to Topics
          </button>
        )}
        <div className="flex-1 text-right">
          Powered by HirePro - absolute recruitment
        </div>
      </div>

      {/* Groups Section */}
      <div className="bg-white bg-opacity-90 px-6 py-4 border-b">
        <div className="text-sm text-gray-700 mb-2">
          <span className="font-semibold">Groups:</span>
          <span className="ml-2">
            <span className="text-blue-600 font-medium">Aptitude:</span> 1 to 20
            |
            <span className="text-blue-600 font-medium ml-2">
              Programming Basics:
            </span>{" "}
            21 to 40 |
            <span className="text-blue-600 font-medium ml-2">
              Technical[Computer Science or Electronics or Communication]:
            </span>{" "}
            41 to 60
          </span>
        </div>
        <div className="text-sm text-gray-700">
          <span className="font-semibold">Topic:</span>{" "}
          <span className="text-blue-600">
            {selectedTopic ? `Topic ${selectedTopic}` : "General Assessment"}
          </span>{" "}
          |
          <span className="font-semibold ml-2">Section:</span>{" "}
          <span className="text-blue-600">Mixed Questions</span>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 flex gap-6">
        {/* Main Question Area */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Question: {currentQ.id} [ {currentQ.marks} Mark ]
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={handleFlag}
                  className={`flex items-center gap-1 px-3 py-1 rounded text-sm font-medium ${
                    currentQ.flagged
                      ? "bg-red-500 text-white"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  <Flag size={16} />
                  {currentQ.flagged ? "Unflag" : "Flag/Unflag"}
                </button>
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className="flex items-center gap-1 px-3 py-1 bg-gray-400 text-white rounded text-sm font-medium hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                  Prev
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentQuestion === questions.length - 1}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Question Text */}
            <div className="bg-gray-50 p-4 rounded border-2 border-dashed border-gray-300 min-h-[200px] relative">
              <p className="text-gray-800 leading-relaxed">{currentQ.text}</p>
              <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                <div className="text-6xl font-bold text-gray-400 transform rotate-12">
                  HirePro
                </div>
              </div>
            </div>
          </div>

          {/* Question Navigation */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="grid grid-cols-12 gap-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => navigateToQuestion(index)}
                  className={`w-10 h-10 rounded text-sm font-medium border-2 transition-all duration-200 ${getQuestionButtonClass(
                    index
                  )}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Answer Section */}
        <div className="w-80">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Answer</h3>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm font-medium">
                {currentQ.selectedAnswer !== undefined ? "Answered" : "Unanswer"}
              </span>
            </div>

            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <label
                  key={index}
                  className="flex items-center space-x-3 p-3 rounded border hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                >
                  <input
                    type="radio"
                    name={`question_${currentQ.id}`}
                    value={index}
                    checked={currentQ.selectedAnswer === index}
                    onChange={() => handleAnswerSelect(index)}
                    className="w-5 h-5 text-blue-600 border-2 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-gray-800 flex-1">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-200">
            Submit Test
          </button>

          <div className="mt-6 bg-white rounded-lg shadow-md p-4">
            <h4 className="font-semibold text-gray-800 mb-3">Legend:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>Not Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded"></div>
                <span>Flagged</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
                <span>Current Question</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ================== TopicSelection ==================
const TopicSelection: React.FC<TopicSelectionProps> = ({
  onTopicSelect,
  onBack,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
      <div className="p-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 border-2 border-red-500 text-white rounded-lg hover:bg-red-500 hover:bg-opacity-20 transition-all duration-200"
        >
          <ArrowLeft size={20} />
          back
        </button>
      </div>

      <div className="flex flex-col items-center justify-center px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-8">QA</h1>
          <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
            The following are the topics from which you can practice for
            <br />
            Online Assessments.
          </p>
        </div>

        <div className="space-y-6 w-full max-w-2xl">
          <button
            onClick={() => onTopicSelect(1)}
            className="w-full py-8 px-12 bg-slate-800 border-2 border-red-500 rounded-2xl text-white text-2xl font-semibold hover:bg-slate-700 hover:border-red-400 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            TOPIC 1
          </button>

          <button
            onClick={() => onTopicSelect(2)}
            className="w-full py-8 px-12 bg-slate-800 border-2 border-red-500 rounded-2xl text-white text-2xl font-semibold hover:bg-slate-700 hover:border-red-400 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            TOPIC 2
          </button>
        </div>
      </div>
    </div>
  );
};

// ================== App ==================
function App() {
  const [currentView, setCurrentView] = useState<AppState>("topics");
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);

  const handleTopicSelect = (topic: number) => {
    setSelectedTopic(topic);
    setCurrentView("test");
  };

  const handleBack = () => {
    if (currentView === "test") {
      setCurrentView("topics");
    } else {
      setCurrentView("home");
    }
  };

  const handleBackToTopics = () => {
    setCurrentView("topics");
  };

  if (currentView === "topics") {
    return (
      <TopicSelection onTopicSelect={handleTopicSelect} onBack={handleBack} />
    );
  }

  if (currentView === "test") {
    return (
      <OA_page
        selectedTopic={selectedTopic}
        onBackToTopics={handleBackToTopics}
      />
    );
  }

  return (
    <TopicSelection onTopicSelect={handleTopicSelect} onBack={handleBack} />
  );
}

export default App;
