'use client';

import { useState, useEffect } from 'react';
import { IconSun, IconMoon } from '@tabler/icons-react';

interface HeaderProps {
  lastCheckDate: string;
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 11) return 'Selamat Pagi';
  if (h < 15) return 'Selamat Siang';
  if (h < 18) return 'Selamat Sore';
  return 'Selamat Malam';
}

export default function Header({ lastCheckDate }: HeaderProps) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('darkMode') === 'true') {
      setDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggle = () => {
    setDark(!dark);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', String(!dark));
  };

  return (
    <header className="sticky top-0 z-50 header-warm">
      <div className="max-w-xl mx-auto px-4 py-3 flex items-center gap-3">
        {/* Avatar circle */}
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center shadow-md shadow-violet-200/40 dark:shadow-violet-900/30 flex-shrink-0">
          <span className="text-white text-sm font-bold">BS</span>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5">
            <p className="text-[11px] text-[var(--warm-400)] font-medium">{getGreeting()},</p>
          </div>
          <h1 className="text-base md:text-lg font-bold text-[var(--warm-800)] dark:text-[var(--warm-800)] leading-tight">
            Bapak Syafriman
          </h1>
        </div>

        {/* Last check badge */}
        <div className="hidden md:flex items-center gap-1.5 bg-[var(--warm-100)] rounded-xl px-2.5 py-1.5">
          <span className="text-[10px]">📅</span>
          <span className="text-[10px] font-medium text-[var(--warm-500)]">{lastCheckDate}</span>
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={toggle}
          className="w-9 h-9 rounded-xl bg-[var(--warm-100)] flex items-center justify-center hover:bg-[var(--warm-200)] transition-all active:scale-95 flex-shrink-0"
          aria-label={dark ? 'Mode terang' : 'Mode gelap'}
        >
          {dark ? <IconSun size={15} className="text-amber-400" /> : <IconMoon size={15} className="text-[var(--warm-400)]" />}
        </button>
      </div>

      {/* Mobile date */}
      <div className="md:hidden px-4 pb-2 -mt-0.5">
        <p className="text-[10px] text-[var(--warm-300)]">📅 Pemeriksaan terakhir: {lastCheckDate}</p>
      </div>
    </header>
  );
}
