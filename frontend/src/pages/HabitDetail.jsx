import React, { useState, useEffect } from 'react';
import { X, Music, Wind, Droplets, Flame } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import AppShell from '../layout/MobileContainer';
import { habitsAPI, logsAPI } from '../services/api';

const HabitDetail = () => {
  const { id } = useParams();
  const [habit, setHabit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const tips = [
    { text: 'Calm music can help you', icon: Music },
    { text: 'Mindful breathing helps you relax', icon: Wind },
    { text: 'Water is important', icon: Droplets },
  ];

  useEffect(() => {
    const fetchHabit = async () => {
      try {
        const data = await habitsAPI.getAll();
        const found = data.habits.find((h) => h.id === id);
        if (found) setHabit(found);
      } catch (err) {
        console.error('Failed to load habit:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHabit();
  }, [id]);

  // Timer logic
  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const handleFinish = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await logsAPI.create(id, today, true, seconds > 0 ? seconds : null);
    } catch (err) {
      console.error('Failed to log habit:', err);
    }
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return { mins, secs };
  };

  const { mins, secs } = formatTime(seconds);

  if (loading) {
    return (
      <AppShell className="!bg-accent-green" showSidebar={false}>
        <div className="flex items-center justify-center min-h-full">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell className="!bg-accent-green" showSidebar={false}>
      <div className="flex flex-col min-h-full justify-between p-6 lg:p-10">

        {/* Header */}
        <div className="flex items-center relative">
          <Link to="/dashboard" className="absolute left-0 p-2 text-gray-900 hover:bg-black/10 rounded-full transition-colors">
            <X size={24} />
          </Link>
          <h2 className="w-full text-center text-xl font-bold tracking-tight text-gray-900">
            {habit?.title || 'Habit'}
          </h2>
        </div>

        {/* Timer Area */}
        <div className="flex-1 flex flex-col items-center justify-center py-6">
          <div className="relative w-56 h-56 lg:w-72 lg:h-72 flex justify-center items-center">
            <div className="absolute top-0 w-full h-full flex justify-center items-center opacity-70 z-0">
              <svg viewBox="0 0 200 100" className="w-64 h-32 fill-white/60">
                <ellipse cx="100" cy="50" rx="80" ry="30" />
                <ellipse cx="50" cy="40" rx="30" ry="20" />
                <ellipse cx="150" cy="40" rx="40" ry="25" />
              </svg>
            </div>
            <img
              src="https://api.dicebear.com/7.x/shapes/svg?seed=Mittens&backgroundColor=transparent"
              alt="Mascot"
              className="w-40 h-40 lg:w-52 lg:h-52 object-contain relative z-10"
            />
            <div className="absolute -bottom-2 w-32 h-6 bg-black/15 rounded-[100%] blur-sm z-0"></div>
          </div>

          {/* Timer Display */}
          <div className="mt-10 text-center text-gray-900">
            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tighter">
              {mins} <span className="text-2xl lg:text-3xl font-bold">min</span>{' '}
              {String(secs).padStart(2, '0')} <span className="text-2xl lg:text-3xl font-bold">s</span>
            </h1>
          </div>

          {/* Timer Controls */}
          <button
            onClick={() => setTimerActive(!timerActive)}
            className="mt-6 px-8 py-3 bg-white/25 backdrop-blur-sm rounded-2xl text-gray-900 font-semibold hover:bg-white/35 transition-colors"
          >
            {timerActive ? '⏸ Pause' : '▶ Start Timer'}
          </button>

          {/* Streak */}
          {habit?.streak?.currentStreak > 0 && (
            <div className="mt-4 flex items-center gap-2 text-gray-900/70 font-semibold">
              <Flame size={20} />
              <span>{habit.streak.currentStreak} day streak</span>
            </div>
          )}
        </div>

        {/* Tips List */}
        <div className="space-y-3 max-w-md mx-auto w-full">
          {tips.map((tip, idx) => (
            <div key={idx} className="flex items-center space-x-4 bg-white/25 backdrop-blur-sm rounded-2xl p-4 text-gray-900 hover:bg-white/35 transition-colors">
              <tip.icon size={22} className="opacity-80 flex-shrink-0" />
              <span className="font-medium text-sm lg:text-base">{tip.text}</span>
            </div>
          ))}
        </div>

        {/* Finish Button */}
        <div className="mt-8 max-w-md mx-auto w-full">
          <Link
            to="/dashboard"
            onClick={handleFinish}
            className="w-full block py-4 bg-white text-text-dark text-center rounded-2xl font-bold text-lg shadow-lg hover:bg-gray-50 hover:shadow-xl transition-all active:scale-[0.98]"
          >
            Finish
          </Link>
        </div>

      </div>
    </AppShell>
  );
};

export default HabitDetail;
