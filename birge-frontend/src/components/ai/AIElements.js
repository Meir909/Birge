import React from 'react';
import { Star } from 'lucide-react';

export const AIBadge = ({ children = "AI", className = "" }) => {
    return (
        <div className={`
      inline-flex items-center gap-1.5 px-3 py-1 
      bg-gradient-to-r from-accent to-[#FBBF24] 
      text-white text-xs font-bold rounded-full shadow-sm
      ${className}
    `}>
            <Star className="w-3 h-3 fill-current" />
            <span>{children}</span>
        </div>
    );
};

export const EfficiencyScore = ({ score, showLabel = true, className = "" }) => {
    // score is 0-100
    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            {showLabel && (
                <div className="flex justify-between items-center text-xs font-medium">
                    <span className="text-gray-500 text-caption uppercase">Efficiency Score</span>
                    <span className="text-accent">{score}%</span>
                </div>
            )}
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full transition-all duration-500 ease-out bg-gradient-to-r from-error via-warning to-secondary"
                    style={{ width: `${score}%` }}
                />
            </div>
        </div>
    );
};

export const AITooltip = ({ text, className = "" }) => {
    return (
        <div className={`
      relative group cursor-help
      ${className}
    `}>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 
        bg-white border border-accent rounded-card shadow-lg 
        opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                <p className="text-xs text-dark leading-snug">{text}</p>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-accent" />
            </div>
            <div className="w-5 h-5 flex items-center justify-center rounded-full bg-accent bg-opacity-10 text-accent">
                <Star className="w-3 h-3 fill-current" />
            </div>
        </div>
    );
};
