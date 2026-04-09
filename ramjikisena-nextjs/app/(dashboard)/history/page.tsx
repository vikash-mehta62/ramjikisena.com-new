'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Flame, ChevronLeft, ChevronRight, Trophy, Calendar, Hash, Layers } from 'lucide-react';

const getAuthHeaders = (): HeadersInit => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

interface DailyCount { date: string; count: number; }
interface UserData {
  _id: string; name: string; username: string;
  totalCount: number; mala: number; dailyCounts: DailyCount[];
}

function calcStreak(dailyCounts: DailyCount[]): { current: number; longest: number } {
  if (!dailyCounts.length) return { current: 0, longest: 0 };
  const dates = [...new Set(dailyCounts.map(d => new Date(d.date).toDateString()))]
    .map(d => new Date(d)).sort((a, b) => b.getTime() - a.getTime());
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  let current = 0;
  let check = new Date(today);
  if (dates[0].toDateString() === today.toDateString() || dates[0].toDateString() === yesterday.toDateString()) {
    for (const d of dates) {
      if (d.toDateString() === check.toDateString()) { current++; check.setDate(check.getDate() - 1); }
      else break;
    }
  }
  let longest = dates.length ? 1 : 0, run = 1;
  const asc = [...dates].sort((a, b) => a.getTime() - b.getTime());
  for (let i = 1; i < asc.length; i++) {
    const diff = (asc[i].getTime() - asc[i - 1].getTime()) / 86400000;
    if (diff === 1) { run++; longest = Math.max(longest, run); } else run = 1;
  }
  return { current, longest };
}

function JaapCalendar({ dailyCounts }: { dailyCounts: DailyCount[] }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [hovered, setHovered] = useState<number | null>(null);

  const countMap = new Map<string, number>();
  dailyCounts.forEach(d => {
    const dt = new Date(d.date);
    const key = `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}`;
    countMap.set(key, (countMap.get(key) || 0) + d.count);
  });

  const key = (d: number) => `${viewYear}-${viewMonth}-${d}`;
  const hasJaap = (d: number) => countMap.has(key(d));
  const getCount = (d: number) => countMap.get(key(d)) || 0;
  const isToday = (d: number) =>
    d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const monthName = new Date(viewYear, viewMonth).toLocaleString('en-IN', { month: 'long', year: 'numeric' });

  // Month stats
  const monthTotal = Array.from({ length: daysInMonth }, (_, i) => getCount(i + 1)).reduce((a, b) => a + b, 0);
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => hasJaap(i + 1)).filter(Boolean).length;

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Color intensity based on count
  const getIntensity = (count: number) => {
    if (count === 0) return null;
    if (count < 10) return 'low';
    if (count < 50) return 'mid';
    if (count < 108) return 'high';
    return 'max';
  };

  const intensityStyle = (intensity: string | null, todayCell: boolean) => {
    if (todayCell && !intensity) return { bg: 'bg-orange-100', text: 'text-orange-600', ring: 'ring-2 ring-orange-400' };
    switch (intensity) {
      case 'low':  return { bg: 'bg-orange-200', text: 'text-orange-800', ring: '' };
      case 'mid':  return { bg: 'bg-orange-400', text: 'text-white', ring: '' };
      case 'high': return { bg: 'bg-orange-500', text: 'text-white', ring: '' };
      case 'max':  return { bg: 'bg-red-600',    text: 'text-white', ring: 'ring-2 ring-yellow-400' };
      default:     return { bg: 'bg-slate-100',  text: 'text-slate-400', ring: '' };
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border-2 border-orange-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 px-5 py-4">
        <div className="flex items-center justify-between">
          <button onClick={prevMonth}
            className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <div className="text-center">
            <h3 className="font-black text-white text-lg">{monthName}</h3>
            <p className="text-orange-100 text-xs mt-0.5">
              {monthDays} दिन · {monthTotal.toLocaleString()} राम नाम
            </p>
          </div>
          <button onClick={nextMonth}
            className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'].map(d => (
            <div key={d} className="text-center text-[10px] font-black text-slate-400 py-1">{d}</div>
          ))}
        </div>

        {/* Cells */}
        <div className="grid grid-cols-7 gap-1.5">
          {cells.map((day, i) => {
            if (!day) return <div key={`e-${i}`} />;
            const count = getCount(day);
            const intensity = getIntensity(count);
            const todayCell = isToday(day);
            const style = intensityStyle(intensity, todayCell);
            const isHovered = hovered === day;

            return (
              <div key={day} className="relative group">
                <div
                  onMouseEnter={() => setHovered(day)}
                  onMouseLeave={() => setHovered(null)}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center cursor-default transition-all
                    ${style.bg} ${style.text} ${style.ring}
                    ${todayCell && intensity ? 'ring-2 ring-white ring-offset-1 ring-offset-orange-500' : ''}
                    hover:scale-110 hover:z-10 hover:shadow-lg
                  `}
                >
                  <span className="text-xs font-black leading-none">{day}</span>
                  {intensity && (
                    <span className="text-[7px] font-bold opacity-80 leading-none mt-0.5">
                      {count >= 1000 ? `${(count/1000).toFixed(1)}k` : count}
                    </span>
                  )}
                </div>

                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 pointer-events-none">
                    <div className="bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-xl">
                      {new Date(viewYear, viewMonth, day).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      {intensity ? ` · ${count} राम नाम` : ' · कोई जाप नहीं'}
                    </div>
                    <div className="w-2 h-2 bg-slate-900 rotate-45 mx-auto -mt-1" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 mt-4 flex-wrap">
          <span className="text-[10px] font-bold text-slate-400">कम → ज़्यादा:</span>
          {[
            { bg: 'bg-slate-100', label: '0' },
            { bg: 'bg-orange-200', label: '<10' },
            { bg: 'bg-orange-400', label: '<50' },
            { bg: 'bg-orange-500', label: '<108' },
            { bg: 'bg-red-600 ring-1 ring-yellow-400', label: '108+' },
          ].map(({ bg, label }) => (
            <div key={label} className="flex items-center gap-1">
              <div className={`w-3.5 h-3.5 rounded ${bg}`} />
              <span className="text-[9px] text-slate-400">{label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1 ml-auto">
            <div className="w-3.5 h-3.5 rounded bg-orange-100 ring-1 ring-orange-400" />
            <span className="text-[9px] text-slate-400">आज</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LekhanHistoryPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
      headers: getAuthHeaders(), credentials: 'include',
    }).then(res => {
      if (!res.ok) { router.push('/login'); return null; }
      return res.json();
    }).then(data => {
      if (data?.success) setUser(data.user);
      setLoading(false);
    }).catch(() => router.push('/login'));
  }, []);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  const sorted = user?.dailyCounts
    ? [...user.dailyCounts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];

  const { current: currentStreak, longest: longestStreak } = calcStreak(user?.dailyCounts || []);

  const stats = [
    { label: 'Total Count',    value: (user?.totalCount || 0).toLocaleString(), icon: Hash,     color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200' },
    { label: 'Total Mala',     value: Number(user?.mala || 0).toFixed(2),       icon: Layers,   color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
    { label: 'Active Days',    value: sorted.length,                             icon: Calendar, color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200' },
    { label: 'Longest Streak', value: longestStreak,                             icon: Trophy,   color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-200' },
  ];

  return (
    <div className="max-w-5xl space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900">Lekhan History</h1>
        <p className="text-slate-500 text-sm mt-1">Apna daily Ram Naam count aur streak dekhein</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.label} className={`${s.bg} border-2 ${s.border} rounded-2xl p-4 flex items-center gap-3`}>
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}
              style={{ filter: 'brightness(0.9)' }}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs font-bold text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Streak Banner */}
      {currentStreak > 0 && (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-4 flex items-center gap-4 text-white shadow-lg shadow-orange-200">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Flame className="w-8 h-8 text-yellow-300" />
          </div>
          <div className="flex-1">
            <p className="text-orange-100 text-xs font-bold uppercase tracking-widest">Current Streak 🔥</p>
            <p className="text-3xl font-black">{currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}</p>
            <p className="text-orange-100 text-xs mt-0.5">
              {currentStreak >= 30 ? '🏆 Legendary! Jai Shri Ram!' :
               currentStreak >= 7  ? '⭐ Incredible consistency!' :
               currentStreak >= 3  ? '💪 Great going!' : '🙏 Keep it up!'}
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-orange-100 text-xs">Best</p>
            <p className="text-2xl font-black">{longestStreak}</p>
          </div>
        </div>
      )}

      {/* Calendar + List side by side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Calendar - takes more space */}
        <div className="lg:col-span-3">
          <JaapCalendar dailyCounts={user?.dailyCounts || []} />
        </div>

        {/* Daily List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border-2 border-orange-100 overflow-hidden h-full">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-4">
              <h3 className="font-black">Daily Count</h3>
              <p className="text-orange-100 text-xs mt-0.5">{sorted.length} दिन का रिकॉर्ड</p>
            </div>
            <div className="p-4">
              {sorted.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-4xl mb-3">📝</div>
                  <p className="text-slate-500 font-semibold text-sm">No history yet</p>
                  <p className="text-slate-400 text-xs mt-1">Ram Naam likhna shuru karein</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                  {sorted.map((entry, i) => {
                    const isTop = i === 0;
                    return (
                      <div key={i}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors
                          ${isTop ? 'bg-orange-500 text-white' : 'bg-orange-50 hover:bg-orange-100'}`}>
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0
                            ${isTop ? 'bg-white/20 text-white' : 'bg-orange-500 text-white'}`}>
                            {i + 1}
                          </div>
                          <div>
                            <p className={`font-bold text-xs ${isTop ? 'text-white' : 'text-slate-800'}`}>
                              {formatDate(entry.date)}
                            </p>
                            <p className={`text-[10px] ${isTop ? 'text-orange-100' : 'text-slate-400'}`}>
                              {new Date(entry.date).toLocaleDateString('en-IN', { weekday: 'short' })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-black ${isTop ? 'text-white' : 'text-orange-600'}`}>
                            {entry.count.toLocaleString()}
                          </p>
                          <p className={`text-[9px] ${isTop ? 'text-orange-100' : 'text-slate-400'}`}>राम नाम</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
