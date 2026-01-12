
import React from 'react';
import { Home, Trophy, Star } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  score: number;
  onHomeClick: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, score, onHomeClick }) => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-green-50">
      <header className="w-full max-w-4xl p-4 flex justify-between items-center bg-white/80 backdrop-blur shadow-sm rounded-b-3xl sticky top-0 z-50">
        <button 
          onClick={onHomeClick}
          className="p-2 hover:bg-green-100 rounded-full transition-colors flex items-center gap-2 text-green-700 font-bold"
        >
          <Home className="w-6 h-6" />
          <span>בית</span>
        </button>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full text-yellow-700 font-bold">
            <Star className="w-5 h-5 fill-yellow-500" />
            <span>{score} נקודות</span>
          </div>
          <div className="text-2xl font-black text-green-600">יער הצלילים</div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl p-6 flex flex-col items-center">
        {children}
      </main>

      <footer className="p-6 text-gray-400 text-sm">
        נוצר באהבה עבור תלמידי כיתה א'
      </footer>
    </div>
  );
};

export default Layout;
