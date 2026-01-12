
import React, { useState } from 'react';
import { GameQuestion, GameType } from '../types';
import { Volume2, CheckCircle2, XCircle } from 'lucide-react';

interface GameCardProps {
  question: GameQuestion;
  onAnswer: (isCorrect: boolean) => void;
}

const GameCard: React.FC<GameCardProps> = ({ question, onAnswer }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<'correct' | 'wrong' | null>(null);

  const handleOptionClick = (option: string) => {
    if (status) return; // Prevent double clicking
    setSelected(option);
    const isCorrect = option === question.correctAnswer;
    setStatus(isCorrect ? 'correct' : 'wrong');
    
    setTimeout(() => {
      onAnswer(isCorrect);
      setSelected(null);
      setStatus(null);
    }, 1500);
  };

  const playSound = () => {
    const utterance = new SpeechSynthesisUtterance(question.word);
    utterance.lang = 'he-IL';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="w-full bg-white p-8 rounded-3xl shadow-xl border-4 border-green-200 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col items-center mb-6">
        <h2 className="text-2xl font-bold text-green-800 mb-4 text-center">{question.instruction}</h2>
        
        <div className="relative group cursor-pointer" onClick={playSound}>
          <img 
            src={question.imageUrl} 
            alt={question.word} 
            className="w-64 h-48 object-cover rounded-2xl shadow-md group-hover:scale-105 transition-transform"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
            <Volume2 className="w-16 h-16 text-white" />
          </div>
        </div>
        
        <div className="mt-4 flex items-center gap-2 text-3xl font-black text-blue-600">
          {question.word}
          <button onClick={playSound} className="p-2 bg-blue-100 rounded-full text-blue-600 hover:bg-blue-200">
            <Volume2 className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {question.options.map((option, idx) => {
          const isSelected = selected === option;
          const isCorrect = option === question.correctAnswer;
          
          let buttonClass = "p-4 text-xl font-bold rounded-2xl border-4 transition-all ";
          if (status === 'correct' && isCorrect) {
            buttonClass += "bg-green-500 text-white border-green-600 scale-105 shadow-lg";
          } else if (status === 'wrong' && isSelected) {
            buttonClass += "bg-red-500 text-white border-red-600 animate-shake";
          } else if (status === 'wrong' && isCorrect) {
            buttonClass += "bg-green-100 text-green-700 border-green-300";
          } else {
            buttonClass += "bg-white text-gray-700 border-gray-100 hover:border-blue-300 hover:bg-blue-50";
          }

          return (
            <button
              key={idx}
              disabled={!!status}
              onClick={() => handleOptionClick(option)}
              className={buttonClass}
            >
              <div className="flex items-center justify-center gap-2">
                {status === 'correct' && isCorrect && <CheckCircle2 className="w-6 h-6" />}
                {status === 'wrong' && isSelected && <XCircle className="w-6 h-6" />}
                {option}
              </div>
            </button>
          );
        })}
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 3; }
      `}</style>
    </div>
  );
};

export default GameCard;
