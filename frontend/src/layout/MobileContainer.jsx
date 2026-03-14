import React from 'react';

/**
 * AppShell — Responsive layout container.
 * - On mobile (<768px): full-width, full-height app experience.
 * - On desktop (>=768px): centered card with a subtle device frame for context,
 *   plus an optional sidebar/info panel on the left.
 */
const AppShell = ({ children, className = '', showSidebar = true }) => {
  return (
    <div className={`min-h-screen ${showSidebar ? 'bg-gradient-to-br from-indigo-50 via-white to-purple-50' : ''}`}>
      {/* Desktop: two-column layout when sidebar is shown, centered full-width when not */}
      <div className={`flex min-h-screen ${!showSidebar ? 'justify-center' : ''}`}>

        {/* LEFT PANEL — visible only on large screens when sidebar is enabled */}
        {showSidebar && (
          <div className="hidden lg:flex lg:flex-1 items-center justify-center p-12">
            <div className="max-w-md text-center space-y-6">
              <div className="w-20 h-20 bg-primary-purple rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-primary-purple/30">
                <span className="text-3xl font-black text-white tracking-tight">A</span>
              </div>
              <h1 className="text-5xl font-black text-text-dark tracking-tight leading-tight">
                Antigravite
              </h1>
              <p className="text-lg text-text-muted leading-relaxed">
                Build healthy habits, one day at a time. Track your progress, maintain streaks, and unlock your best self.
              </p>
              <div className="flex justify-center gap-3 pt-4">
                <span className="px-4 py-2 bg-primary-purple/10 text-primary-purple rounded-full text-sm font-semibold">Habits</span>
                <span className="px-4 py-2 bg-accent-green/10 text-green-700 rounded-full text-sm font-semibold">Streaks</span>
                <span className="px-4 py-2 bg-habit-yellow/20 text-amber-700 rounded-full text-sm font-semibold">Analytics</span>
              </div>
            </div>
          </div>
        )}

        {/* MAIN CONTENT AREA */}
        <div className={`min-h-screen flex flex-col relative ${showSidebar ? 'w-full lg:w-[480px] lg:flex-shrink-0' : 'w-full'}`}>
          {/* On desktop with sidebar, add card styling. Without sidebar, go full-width */}
          <div className={`flex-1 flex flex-col overflow-hidden relative ${
            showSidebar 
              ? 'bg-white lg:my-6 lg:mr-6 lg:rounded-3xl lg:shadow-2xl lg:shadow-black/5 lg:border lg:border-gray-100' 
              : ''
          } ${className}`}>
            <div className="flex-1 overflow-y-auto hide-scrollbar">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppShell;
