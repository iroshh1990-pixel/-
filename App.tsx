
import React, { useState, useEffect } from 'react';
import { GameType, GameQuestion, UserStats } from './types';
import { generateQuestions } from './services/geminiService';
import Layout from './components/Layout';
import GameCard from './components/GameCard';
import Confetti from './components/Confetti';
import { Sparkles, ArrowRight, RotateCcw, Play } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'loading' | 'completed'>('lobby');
  const [currentLevelType, setCurrentLevelType] = useState<GameType | null>(null);
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stats, setStats] = useState<UserStats>({ score: 0, completedLevels: [] });
  const [showConfetti, setShowConfetti] = useState(false);

  const startLevel = async (type: GameType) => {
    setGameState('loading');
    setCurrentLevelType(type);
    const newQuestions = await generateQuestions(type);
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setGameState('playing');
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setStats(prev => ({ ...prev, score: prev.score + 10 }));
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setGameState('completed');
    }
  };

  const goHome = () => {
    setGameState('lobby');
    setQuestions([]);
    setCurrentIndex(0);
  };

  const renderLobby = () => (
    <div className="flex flex-col items-center gap-8 py-12">
      <div className="text-center">
        <h1 className="text-5xl font-black text-green-700 mb-4 animate-float">שלום כיתה א'!</h1>
        <p className="text-xl text-green-600">בחרו הרפתקה והתחילו לשחק</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl px-4">
        <LevelCard 
          title="כמה הברות?" 
          desc="נמחה כפיים ונחלק את המילים" 
          icon="🥁"
          color="bg-orange-100 border-orange-200 text-orange-700"
          onClick={() => startLevel(GameType.SYLLABLES)}
        />
        <LevelCard 
          title="מה הצליל הפותח?" 
          desc="נגלה באיזה צליל מתחילה המילה" 
          icon="👂"
          color="bg-blue-100 border-blue-200 text-blue-700"
          onClick={() => startLevel(GameType.INITIAL_SOUND)}
        />
        <LevelCard 
          title="מי מתחרז?" 
          desc="נמצא זוגות של מילים דומות" 
          icon="🎶"
          color="bg-purple-100 border-purple-200 text-purple-700"
          onClick={() => startLevel(GameType.RHYMES)}
        />
      </div>
    </div>
  );

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-2xl font-bold text-green-700">היער מתכונן... כבר מתחילים!</p>
    </div>
  );

  const renderPlaying = () => (
    <div className="w-full flex flex-col items-center gap-6">
      <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
        <div 
          className="bg-green-500 h-4 rounded-full transition-all duration-500" 
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>
      {questions.length > 0 && (
        <GameCard 
          question={questions[currentIndex]} 
          onAnswer={handleAnswer} 
        />
      )}
      <p className="text-gray-500 font-bold">שאלה {currentIndex + 1} מתוך {questions.length}</p>
    </div>
  );

  const renderCompleted = () => (
    <div className="flex flex-col items-center py-16 gap-8 text-center bg-white p-12 rounded-3xl shadow-2xl border-4 border-yellow-200 max-w-md">
      <Sparkles className="w-24 h-24 text-yellow-500 animate-bounce" />
      <h2 className="text-4xl font-black text-green-700">כל הכבוד!</h2>
      <p className="text-2xl text-green-600">סיימת את ההרפתקה בהצלחה</p>
      <div className="text-5xl font-black text-yellow-600">
        +{questions.length * 10} נקודות!
      </div>
      <div className="flex gap-4">
        <button 
          onClick={goHome}
          className="flex items-center gap-2 bg-green-500 text-white px-8 py-3 rounded-full text-xl font-bold hover:bg-green-600 transition-colors"
        >
          למסך הבית <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );

  return (
    <Layout score={stats.score} onHomeClick={goHome}>
      {showConfetti && <Confetti />}
      
      {gameState === 'lobby' && renderLobby()}
      {gameState === 'loading' && renderLoading()}
      {gameState === 'playing' && renderPlaying()}
      {gameState === 'completed' && renderCompleted()}
    </Layout>
  );
};

interface LevelCardProps {
  title: string;
  desc: string;
  icon: string;
  color: string;
  onClick: () => void;
}

const LevelCard: React.FC<LevelCardProps> = ({ title, desc, icon, color, onClick }) => (
  <button 
    onClick={onClick}
    className={`${color} p-6 rounded-3xl border-4 flex flex-col items-center text-center gap-4 hover:scale-105 transition-transform shadow-lg group`}
  >
    <div className="text-6xl group-hover:animate-bounce">{icon}</div>
    <h3 className="text-2xl font-black">{title}</h3>
    <p className="font-bold opacity-80">{desc}</p>
    <div className="mt-2 bg-white/50 px-4 py-1 rounded-full flex items-center gap-2">
      <Play className="w-4 h-4" /> התחל משחק
    </div>
  </button>
);

export default App;
