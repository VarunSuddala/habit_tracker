import React from 'react';
import { Home, Plus } from 'lucide-react';

const BottomNav = () => {
  return (
    <div className="absolute bottom-0 w-full px-6 pb-8 pt-4 bg-gradient-to-t from-white via-white/90 to-transparent flex justify-between items-center z-10">
      <button className="p-2 text-text-dark hover:text-primary-purple transition-colors">
        <Home size={28} />
      </button>
      
      <button className="w-14 h-14 bg-primary-purple text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-primary-purple/90 transition-transform active:scale-95">
        <Plus size={32} />
      </button>

      <button className="p-1 rounded-full border-2 border-transparent hover:border-primary-purple transition-colors">
        <img 
          src="https://api.dicebear.com/7.x/notionists/svg?seed=Diana&backgroundColor=ffd5dc" 
          alt="Profile" 
          className="w-8 h-8 rounded-full"
        />
      </button>
    </div>
  );
};

export default BottomNav;
