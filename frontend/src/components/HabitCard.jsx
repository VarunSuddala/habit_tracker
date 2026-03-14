import React from 'react';
import { Check, Circle, BookOpen, Brain, Wallet, Dumbbell, Droplets, PenLine, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';

const ICON_COMPONENTS = {
  'book-open': BookOpen,
  'brain': Brain,
  'wallet': Wallet,
  'dumbbell': Dumbbell,
  'droplets': Droplets,
  'pen-line': PenLine,
  'circle': Circle,
};

const HabitCard = ({
  id,
  title,
  subtitle,
  colorClass,
  iconName,
  icon: IconProp,
  completed = false,
  streak = 0,
  onToggle,
}) => {
  const Icon = IconProp || ICON_COMPONENTS[iconName] || Circle;

  return (
    <Link to={`/habit/${id}`} className="block">
      <div
        className={`${colorClass} rounded-3xl p-5 flex flex-col justify-between h-[140px] shadow-sm transform transition-transform hover:scale-[1.02] active:scale-95`}
      >
        <div className="flex justify-between items-start">
          <div className="p-2 bg-black/10 rounded-xl">
            <Icon size={24} className="text-current opacity-80" />
          </div>
          <div className="flex items-center gap-2">
            {streak > 0 && (
              <span className="flex items-center gap-0.5 text-xs font-bold opacity-70">
                <Flame size={14} /> {streak}
              </span>
            )}
            <button
              className="p-1"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggle?.();
              }}
            >
              {completed ? (
                <div className="bg-text-dark text-white rounded-full p-0.5">
                  <Check size={20} />
                </div>
              ) : (
                <Circle size={24} className="text-gray-900/50" />
              )}
            </button>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="font-bold text-lg leading-tight">{title}</h3>
          {subtitle && <p className="text-sm opacity-70 mt-1">{subtitle}</p>}
        </div>
      </div>
    </Link>
  );
};

export default HabitCard;
