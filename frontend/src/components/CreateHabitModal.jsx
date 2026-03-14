import React, { useState } from 'react';
import { X } from 'lucide-react';
import { habitsAPI } from '../services/api';

const COLORS = [
  { name: 'Green', value: '#7ED957' },
  { name: 'Yellow', value: '#F5C842' },
  { name: 'Pink', value: '#F56FAD' },
  { name: 'Purple', value: '#5B4EFF' },
  { name: 'Blue', value: '#42C6F5' },
  { name: 'Orange', value: '#FF8C42' },
];

const ICONS = [
  { name: 'meditation', label: '🧘 Meditation' },
  { name: 'book', label: '📖 Reading' },
  { name: 'finance', label: '💰 Finance' },
  { name: 'fitness', label: '💪 Fitness' },
  { name: 'water', label: '💧 Water' },
  { name: 'journal', label: '✍️ Journal' },
];

const CreateHabitModal = ({ isOpen, onClose, onCreated }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('#7ED957');
  const [icon, setIcon] = useState('meditation');
  const [frequency, setFrequency] = useState('daily');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await habitsAPI.create({ title, category, color, icon, frequency });
      setTitle('');
      setCategory('');
      setColor('#7ED957');
      setIcon('meditation');
      onCreated?.();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 pb-10 sm:pb-6 shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-dark">New Habit</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-text-muted block mb-2">Habit Name *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Morning Run"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-purple focus:ring-2 focus:ring-primary-purple/20 outline-none text-base transition-all"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-text-muted block mb-2">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Health, Learning"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-purple focus:ring-2 focus:ring-primary-purple/20 outline-none text-base transition-all"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-text-muted block mb-2">Icon</label>
            <div className="grid grid-cols-3 gap-2">
              {ICONS.map((ic) => (
                <button
                  key={ic.name}
                  type="button"
                  onClick={() => setIcon(ic.name)}
                  className={`py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                    icon === ic.name
                      ? 'bg-primary-purple text-white shadow-md'
                      : 'bg-gray-100 text-text-dark hover:bg-gray-200'
                  }`}
                >
                  {ic.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-text-muted block mb-2">Color</label>
            <div className="flex gap-3">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`w-10 h-10 rounded-full transition-transform ${
                    color === c.value ? 'scale-125 ring-2 ring-offset-2 ring-gray-400' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c.value }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-text-muted block mb-2">Frequency</label>
            <div className="flex gap-2">
              {['daily', 'weekly'].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFrequency(f)}
                  className={`px-5 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                    frequency === f
                      ? 'bg-primary-purple text-white'
                      : 'bg-gray-100 text-text-dark hover:bg-gray-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !title.trim()}
            className="w-full py-4 bg-primary-purple text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-primary-purple/90 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Habit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateHabitModal;
