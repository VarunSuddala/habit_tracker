import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../layout/MobileContainer';
import DateStrip from '../components/DateStrip';
import HabitCard from '../components/HabitCard';
import BottomNav from '../components/BottomNav';
import CreateHabitModal from '../components/CreateHabitModal';
import { useAuth } from '../context/AuthContext';
import { logsAPI } from '../services/api';

const ICON_MAP = {
  meditation: 'brain',
  book: 'book-open',
  finance: 'wallet',
  fitness: 'dumbbell',
  water: 'droplets',
  journal: 'pen-line',
  default: 'circle',
};

const COLOR_MAP = {
  '#7ED957': 'bg-accent-green',
  '#F5C842': 'bg-habit-yellow',
  '#F56FAD': 'bg-habit-pink',
  '#5B4EFF': 'bg-primary-purple text-white',
  '#42C6F5': 'bg-sky-200',
  '#FF8C42': 'bg-orange-300',
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await logsAPI.getByDate(selectedDate);
      setHabits(data.logs || []);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const toggleHabit = async (habitId, currentState) => {
    try {
      setHabits((prev) =>
        prev.map((h) => (h.habitId === habitId ? { ...h, completed: !currentState } : h))
      );
      await logsAPI.create(habitId, selectedDate, !currentState);
    } catch (err) {
      console.error('Failed to toggle habit:', err);
      setHabits((prev) =>
        prev.map((h) => (h.habitId === habitId ? { ...h, completed: currentState } : h))
      );
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning,';
    if (hour < 17) return 'Good afternoon,';
    return 'Good evening,';
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppShell className="!bg-[#f8f9fb]">
      <div className="flex flex-col min-h-full pb-28">

        {/* Header */}
        <div className="px-6 pt-10 lg:pt-8 flex justify-between items-start mb-2">
          <div>
            <h2 className="text-lg text-text-muted font-medium">{getGreeting()}</h2>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight mt-1 text-text-dark">
              {user?.name || 'User'}
            </h1>
          </div>
          <div className="flex space-x-3 mt-2">
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-white shadow-sm text-text-dark hover:bg-gray-50 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            </button>
            <button
              onClick={handleLogout}
              title="Logout"
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-white shadow-sm text-text-dark hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        </div>

        {/* Date Strip */}
        <div className="mb-4">
          <DateStrip selectedDate={selectedDate} onDateChange={setSelectedDate} />
        </div>

        {/* Habit Grid */}
        <div className="px-6 grid grid-cols-2 lg:grid-cols-3 gap-4 flex-1 content-start">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-3xl h-[140px]" />
            ))
          ) : habits.length === 0 ? (
            <div className="col-span-2 lg:col-span-3 text-center py-16 text-text-muted">
              <p className="text-4xl mb-4">🌱</p>
              <p className="text-lg font-medium">No habits yet</p>
              <p className="text-sm mt-2">Tap the + button to create your first habit!</p>
            </div>
          ) : (
            habits.map((habit) => (
              <HabitCard
                key={habit.habitId}
                id={habit.habitId}
                title={habit.title}
                subtitle={habit.category || habit.frequency}
                colorClass={COLOR_MAP[habit.color] || 'bg-white border border-gray-200'}
                iconName={ICON_MAP[habit.icon] || ICON_MAP.default}
                completed={habit.completed}
                streak={habit.streak?.currentStreak}
                onToggle={() => toggleHabit(habit.habitId, habit.completed)}
              />
            ))
          )}
        </div>

      </div>

      <BottomNav onAddClick={() => setShowCreateModal(true)} />

      <CreateHabitModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={fetchLogs}
      />
    </AppShell>
  );
};

export default Dashboard;
