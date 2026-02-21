'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi, User } from '@/lib/auth';

type NameType = 'RAM' | 'RADHE' | 'HARE_KRISHNA';

interface NameConfig {
  name: string;
  displayName: string;
  hindiName: string;
  pattern: string[];
  hindiChars: string[];
  emoji: string;
}

const NAME_CONFIGS: Record<NameType, NameConfig> = {
  RAM: {
    name: 'RAM',
    displayName: 'राम',
    hindiName: 'राम नाम',
    pattern: ['R', 'A', 'M'],
    hindiChars: ['र', 'ा', 'म'],
    emoji: '🚩'
  },
  RADHE: {
    name: 'RADHE',
    displayName: 'राधे',
    hindiName: 'राधे नाम',
    pattern: ['RA', 'DHE'],
    hindiChars: ['रा', 'धे'],
    emoji: '🌺'
  },
  HARE_KRISHNA: {
    name: 'HARE_KRISHNA',
    displayName: 'हरे कृष्णा',
    hindiName: 'हरे कृष्णा',
    pattern: ['HA', 'RE', 'KRI', 'SHNA'],
    hindiChars: ['ह', 'रे', 'कृ', 'ष्णा'],
    emoji: '🦚'
  }
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [currentCount, setCurrentCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [malaCount, setMalaCount] = useState(0);
  const [textareaValue, setTextareaValue] = useState('');
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedName, setSelectedName] = useState<NameType>('RAM');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userData = await authApi.getCurrentUser();

      if (!userData) {
        router.push('/login');
        return;
      }

      setUser(userData);
      setCurrentCount(userData.currCount);
      setTotalCount(userData.totalCount);
      setMalaCount(parseFloat(userData.mala.toString()));
      setLoading(false);
    } catch (error) {
      router.push('/login');
    }
  };

  const appendCharacter = (char: string) => {
    const config = NAME_CONFIGS[selectedName];
    
    // For RAM - simple sequence tracking
    if (selectedName === 'RAM') {
      let newTextarea = textareaValue;
      
      // Check what's the next expected character
      if (char === 'R' && (userInput === '' || userInput === 'RAM')) {
        setUserInput('R');
        newTextarea += 'र';
      } else if (char === 'A' && userInput === 'R') {
        setUserInput('RA');
        newTextarea += 'ा';
      } else if (char === 'M' && userInput === 'RA') {
        setUserInput('RAM');
        newTextarea += 'म ';
        setCurrentCount(prev => prev + 1);
        setTotalCount(prev => prev + 1);
        setMalaCount(prev => ((prev * 108 + 1) / 108));
      } else {
        // Wrong sequence, ignore
        return;
      }
      
      setTextareaValue(newTextarea);
      return;
    }
    
    // For RADHE - 2 button sequence
    if (selectedName === 'RADHE') {
      let newTextarea = textareaValue;
      
      if (char === 'RA' && (userInput === '' || userInput === 'RADHE')) {
        setUserInput('RA');
        newTextarea += 'रा';
      } else if (char === 'DHE' && userInput === 'RA') {
        setUserInput('RADHE');
        newTextarea += 'धे ';
        setCurrentCount(prev => prev + 1);
        setTotalCount(prev => prev + 1);
        setMalaCount(prev => ((prev * 108 + 1) / 108));
      } else {
        return;
      }
      
      setTextareaValue(newTextarea);
      return;
    }
    
    // For HARE KRISHNA - 4 button sequence
    if (selectedName === 'HARE_KRISHNA') {
      let newTextarea = textareaValue;
      
      if (char === 'HA' && (userInput === '' || userInput === 'HAREKRISHNA')) {
        setUserInput('HA');
        newTextarea += 'ह';
      } else if (char === 'RE' && userInput === 'HA') {
        setUserInput('HARE');
        newTextarea += 'रे ';
      } else if (char === 'KRI' && userInput === 'HARE') {
        setUserInput('HAREKRI');
        newTextarea += 'कृ';
      } else if (char === 'SHNA' && userInput === 'HAREKRI') {
        setUserInput('HAREKRISHNA');
        newTextarea += 'ष्णा ';
        setCurrentCount(prev => prev + 1);
        setTotalCount(prev => prev + 1);
        setMalaCount(prev => ((prev * 108 + 1) / 108));
      } else {
        return;
      }
      
      setTextareaValue(newTextarea);
      return;
    }
  };

  const handleSave = async () => {
    if (textareaValue.trim() === '') {
      alert('कृपया सेव बटन पर क्लिक करने से पहले राम नाम लिखें');
      return;
    }

    setSaving(true);

    try {
      const result = await authApi.saveCount(currentCount, totalCount, malaCount);

      if (result.success) {
        setTimeout(() => {
          setTextareaValue('');
          setUserInput('');
          setCurrentCount(0);
          setSaving(false);
          alert('✅ आपका रामनाम धन सेव हो गया है!');
          // Refresh user data
          fetchUserData();
        }, 2000);
      } else {
        alert('Error saving data');
        setSaving(false);
      }
    } catch (error) {
      alert('Error saving data');
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await authApi.logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🙏</div>
          <p className="text-xl text-orange-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl">🚩</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Ramji Ki Sena</h1>
                <p className="text-sm text-orange-100">Jai Shri Ram</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/mandirs"
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition flex items-center gap-2"
              >
                <span>🛕</span> Mandirs
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Welcome Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-orange-200">
            <h2 className="text-2xl font-bold text-orange-700 mb-2">
              🙏 Welcome, {user?.name || 'User'}!
            </h2>
            <p className="text-gray-600">Start your {NAME_CONFIGS[selectedName].hindiName} Lekhan journey</p>
          </div>

          {/* Name Selector */}
          <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl shadow-xl p-6 border-2 border-orange-300">
            <h3 className="text-lg font-bold text-orange-800 mb-4">
              🕉️ Select Name for Counting / नाम चुनें
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => {
                  setSelectedName('RAM');
                  setUserInput('');
                  setTextareaValue('');
                }}
                className={`p-4 rounded-xl font-bold text-lg transition-all ${
                  selectedName === 'RAM'
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg scale-105'
                    : 'bg-white text-orange-700 hover:bg-orange-50 border-2 border-orange-300'
                }`}
              >
                <div className="text-3xl mb-2">🚩</div>
                <div>राम</div>
                <div className="text-xs mt-1 opacity-80">RAM</div>
              </button>
              <button
                onClick={() => {
                  setSelectedName('RADHE');
                  setUserInput('');
                  setTextareaValue('');
                }}
                className={`p-4 rounded-xl font-bold text-lg transition-all ${
                  selectedName === 'RADHE'
                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg scale-105'
                    : 'bg-white text-pink-700 hover:bg-pink-50 border-2 border-pink-300'
                }`}
              >
                <div className="text-3xl mb-2">🌺</div>
                <div>राधे</div>
                <div className="text-xs mt-1 opacity-80">RADHE</div>
              </button>
              <button
                onClick={() => {
                  setSelectedName('HARE_KRISHNA');
                  setUserInput('');
                  setTextareaValue('');
                }}
                className={`p-4 rounded-xl font-bold text-lg transition-all ${
                  selectedName === 'HARE_KRISHNA'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg scale-105'
                    : 'bg-white text-blue-700 hover:bg-blue-50 border-2 border-blue-300'
                }`}
              >
                <div className="text-3xl mb-2">🦚</div>
                <div>हरे कृष्णा</div>
                <div className="text-xs mt-1 opacity-80">HARE KRISHNA</div>
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-6 shadow-lg">
              <h3 className="text-sm font-medium mb-2">Your Rank</h3>
              <p className="text-4xl font-bold">{user?.rank || '-'}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
              <h3 className="text-sm font-medium mb-2">Current Count</h3>
              <p className="text-4xl font-bold">{currentCount}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
              <h3 className="text-sm font-medium mb-2">Total Count</h3>
              <p className="text-4xl font-bold">{totalCount}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
              <h3 className="text-sm font-medium mb-2">Mala Count</h3>
              <p className="text-4xl font-bold">{malaCount.toFixed(2)}</p>
            </div>
          </div>

          {/* Writing Area */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-orange-200">
            <h3 className="text-xl font-bold text-orange-700 mb-4">
              यहाँ पर {NAME_CONFIGS[selectedName].displayName} नाम लिखें
            </h3>
            <textarea
              value={textareaValue}
              readOnly
              className="w-full h-48 p-4 border-2 border-orange-300 rounded-xl focus:outline-none focus:border-orange-500 text-2xl font-semibold text-orange-700 resize-none"
              placeholder={`यहाँ पर ${NAME_CONFIGS[selectedName].displayName} नाम लिखें...`}
            />
          </div>

          {/* Buttons - Dynamic based on selected name */}
          {selectedName === 'RAM' && (
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => appendCharacter('R')}
                className="bg-gradient-to-br from-red-500 to-red-600 text-white text-4xl font-bold py-8 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all active:scale-95"
              >
                र
              </button>
              <button
                onClick={() => appendCharacter('A')}
                className="bg-gradient-to-br from-orange-500 to-orange-600 text-white text-4xl font-bold py-8 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all active:scale-95"
              >
                ा
              </button>
              <button
                onClick={() => appendCharacter('M')}
                className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white text-4xl font-bold py-8 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all active:scale-95"
              >
                म
              </button>
            </div>
          )}

          {selectedName === 'RADHE' && (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => appendCharacter('RA')}
                className="bg-gradient-to-br from-pink-500 to-pink-600 text-white text-4xl font-bold py-8 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all active:scale-95"
              >
                रा
              </button>
              <button
                onClick={() => appendCharacter('DHE')}
                className="bg-gradient-to-br from-rose-500 to-rose-600 text-white text-4xl font-bold py-8 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all active:scale-95"
              >
                धे
              </button>
            </div>
          )}

          {selectedName === 'HARE_KRISHNA' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => appendCharacter('HA')}
                className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-4xl font-bold py-8 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all active:scale-95"
              >
                ह
              </button>
              <button
                onClick={() => appendCharacter('RE')}
                className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white text-4xl font-bold py-8 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all active:scale-95"
              >
                रे
              </button>
              <button
                onClick={() => appendCharacter('KRI')}
                className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white text-4xl font-bold py-8 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all active:scale-95"
              >
                कृ
              </button>
              <button
                onClick={() => appendCharacter('SHNA')}
                className="bg-gradient-to-br from-purple-500 to-purple-600 text-white text-4xl font-bold py-8 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all active:scale-95"
              >
                ष्णा
              </button>
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white text-xl font-bold py-4 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                सेव हो रहा है...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                💾 Save
              </span>
            )}
          </button>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/devotees"
              className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition text-center border-2 border-orange-200 hover:border-orange-400"
            >
              <div className="text-3xl mb-2">👥</div>
              <p className="font-semibold text-orange-700">All Devotees</p>
            </Link>
            <Link
              href="/history"
              className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition text-center border-2 border-orange-200 hover:border-orange-400"
            >
              <div className="text-3xl mb-2">📊</div>
              <p className="font-semibold text-orange-700">Lekhan History</p>
            </Link>
            <Link
              href="/blogs"
              className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition text-center border-2 border-orange-200 hover:border-orange-400"
            >
              <div className="text-3xl mb-2">📝</div>
              <p className="font-semibold text-orange-700">Blogs</p>
            </Link>
            <Link
              href="/mandirs"
              className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition text-center border-2 border-orange-200 hover:border-orange-400"
            >
              <div className="text-3xl mb-2">🛕</div>
              <p className="font-semibold text-orange-700">Mandirs</p>
            </Link>
            <Link
              href="/profile"
              className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition text-center border-2 border-orange-200 hover:border-orange-400"
            >
              <div className="text-3xl mb-2">👤</div>
              <p className="font-semibold text-orange-700">My Profile</p>
            </Link>
          </div>
        </div>
      </main>

      {/* Saving Overlay */}
      {saving && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center shadow-2xl">
            <div className="text-6xl mb-4 animate-bounce">🚩</div>
            <p className="text-xl font-semibold text-orange-700">
              आपका रामनाम धन सेव हो रहा है...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
