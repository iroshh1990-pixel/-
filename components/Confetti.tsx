
import React, { useEffect } from 'react';

const Confetti: React.FC = () => {
  useEffect(() => {
    // We'll use a CSS-only simple confetti or dynamic injection if library not available.
    // For this environment, we'll simulate it with some floating elements.
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{
            backgroundColor: ['#fbbf24', '#f87171', '#60a5fa', '#34d399', '#a78bfa'][Math.floor(Math.random() * 5)],
            left: `${Math.random() * 100}%`,
            top: `-20px`,
            animation: `fall ${2 + Math.random() * 3}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Confetti;
