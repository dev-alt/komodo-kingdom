import { useState } from 'react';
import { quizQuestions, getRandomCards } from '@/data/cards';
import { useAuth } from '@/context/AuthContext';
import type { KomodoCard, QuizQuestion } from '@/types';
import { TradingCard } from './TradingCard';
import { CheckCircle, XCircle, Trophy, RotateCcw, Package } from 'lucide-react';

interface QuizProps {
  onComplete?: () => void;
}

const pickQuestions = (count: number, seed: number) => {
  const total = quizQuestions.length;
  const safeCount = Math.min(count, total);

  return Array.from({ length: safeCount }, (_, index) => {
    return quizQuestions[(seed + index) % total];
  });
};

export function Quiz({ onComplete }: QuizProps) {
  const { user, addCardsToCollection, updateUserStats } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [earnedCards, setEarnedCards] = useState<KomodoCard[]>([]);
  const [showPackOpening, setShowPackOpening] = useState(false);
  const [quizSeed, setQuizSeed] = useState(0);

  const shuffledQuestions: QuizQuestion[] = pickQuestions(3, quizSeed);
  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult || !currentQuestion) return;
    
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setCorrectCount(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    setQuizComplete(true);
    
    // Calculate rarity bonus based on correct answers
    const rarityBonus = correctCount * 0.15;
    const cards = getRandomCards(3, rarityBonus);
    setEarnedCards(cards);
    
    // Update user stats
    if (user) {
      updateUserStats({
        quizzesCompleted: user.quizzesCompleted + 1,
        correctAnswers: user.correctAnswers + correctCount
      });
    }
  };

  const openPack = () => {
    setShowPackOpening(true);
    addCardsToCollection(earnedCards);
  };

  const closePackOpening = () => {
    setShowPackOpening(false);
    if (onComplete) {
      onComplete();
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setCorrectCount(0);
    setQuizComplete(false);
    setEarnedCards([]);
    setQuizSeed((prev) => (prev + 3) % quizQuestions.length);
  };

  if (!currentQuestion && !quizComplete) {
    return (
      <div className="bg-[#243824] rounded-2xl p-8 border-2 border-[#3a4a3a] text-center text-[#B8C1B8]">
        Preparing quiz...
      </div>
    );
  }

  if (quizComplete) {
    return (
      <div className="bg-[#243824] rounded-2xl p-8 border-2 border-[#3a4a3a] text-center">
        <Trophy className="w-16 h-16 text-[#FF6F2C] mx-auto mb-4" />
        <h2 className="font-display text-3xl text-[#F3EFE6] mb-2">
          Quiz Complete!
        </h2>
        <p className="text-[#B8C1B8] mb-4">
          You got {correctCount} out of {shuffledQuestions.length} correct!
        </p>
        
        <div className="flex justify-center gap-2 mb-6">
          {shuffledQuestions.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index < correctCount ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
          ))}
        </div>

        {!showPackOpening ? (
          <div className="space-y-4">
            <p className="text-[#F3EFE6]">
              {correctCount === 3 
                ? 'Perfect score! You earned a Legendary Pack!' 
                : correctCount === 2 
                ? 'Great job! You earned a Rare Pack!'
                : 'Good effort! You earned a Standard Pack!'}
            </p>
            <button
              onClick={openPack}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Package className="w-5 h-5" />
              Open Your Pack
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-[#FF6F2C] font-bold text-lg">
              🎉 Congratulations! You got {earnedCards.length} new cards!
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              {earnedCards.map((card, index) => (
                <TradingCard 
                  key={card.id} 
                  card={card} 
                  size="sm"
                  className="animate-float"
                  style={{ animationDelay: `${index * 0.2}s` }}
                />
              ))}
            </div>
            <button
              onClick={closePackOpening}
              className="btn-primary inline-flex items-center gap-2"
            >
              Add to Collection
            </button>
          </div>
        )}

        <button
          onClick={resetQuiz}
          className="mt-4 text-[#B8C1B8] hover:text-[#F3EFE6] flex items-center gap-2 mx-auto"
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#243824] rounded-2xl p-6 border-2 border-[#3a4a3a]">
      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-[#B8C1B8] text-sm">
          Question {currentQuestionIndex + 1} of {shuffledQuestions.length}
        </span>
        <div className="flex gap-1">
          {shuffledQuestions.map((_, index) => (
            <div
              key={index}
              className={`w-8 h-2 rounded-full ${
                index < currentQuestionIndex 
                  ? 'bg-[#FF6F2C]' 
                  : index === currentQuestionIndex 
                  ? 'bg-[#FF6F2C]/50' 
                  : 'bg-[#3a4a3a]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <h3 className="font-display text-xl text-[#F3EFE6] mb-6">
        {currentQuestion.question}
      </h3>

      {/* Options */}
      <div className="space-y-3">
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrectAnswer = index === currentQuestion.correctAnswer;
          
          let optionClass = 'quiz-option';
          if (showResult) {
            if (isCorrectAnswer) {
              optionClass += ' correct';
            } else if (isSelected && !isCorrect) {
              optionClass += ' wrong';
            }
          } else if (isSelected) {
            optionClass += ' border-[#FF6F2C] bg-[#2a422a]';
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={showResult}
              className={`${optionClass} w-full text-left flex items-center justify-between`}
            >
              <span className="text-[#F3EFE6]">{option}</span>
              {showResult && isCorrectAnswer && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              {showResult && isSelected && !isCorrect && (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Result Message */}
      {showResult && (
        <div className={`mt-4 p-4 rounded-xl ${isCorrect ? 'bg-green-900/30 border border-green-500' : 'bg-red-900/30 border border-red-500'}`}>
          <p className={`font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {isCorrect ? '✅ Correct!' : '❌ Wrong!'}
          </p>
          {!isCorrect && (
            <p className="text-[#B8C1B8] text-sm mt-1">
              The correct answer was: {currentQuestion.options[currentQuestion.correctAnswer]}
            </p>
          )}
        </div>
      )}

      {/* Next Button */}
      {showResult && (
        <button
          onClick={handleNext}
          className="btn-primary w-full mt-4"
        >
          {currentQuestionIndex < shuffledQuestions.length - 1 ? 'Next Question' : 'See Results'}
        </button>
      )}
    </div>
  );
}
