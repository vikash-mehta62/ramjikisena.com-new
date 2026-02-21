import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen ram-naam-bg bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 relative">
      {/* Decorative Om Symbols */}
      <div className="om-symbol" style={{ top: '10%', left: '5%' }}>ॐ</div>
      <div className="om-symbol" style={{ top: '60%', right: '5%' }}>ॐ</div>
      
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 text-white py-4 shadow-lg relative z-10 sticky top-0">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-3xl">🚩</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold divine-glow">Ramji Ki Sena</h1>
                <p className="text-xs text-orange-100">राम नाम सत्य है</p>
              </div>
            </Link>
            <nav className="flex gap-4 items-center">
              <Link href="/about" className="hidden md:block hover:text-yellow-200 transition font-semibold">About</Link>
              <Link href="/mandirs" className="hidden md:flex hover:text-yellow-200 transition font-semibold items-center gap-1">
                <span>🛕</span> Mandirs
              </Link>
              <Link href="/gallery" className="hidden md:block hover:text-yellow-200 transition font-semibold">Gallery</Link>
              <Link href="/contact" className="hidden md:block hover:text-yellow-200 transition font-semibold">Contact</Link>
              <Link 
                href="/login"
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition font-semibold"
              >
                Login
              </Link>
              <Link 
                href="/register"
                className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition font-semibold shadow-lg"
              >
                Sign Up
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-8 md:py-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Hero Banner with Images */}
          <div className="bg-gradient-to-r from-orange-100 via-red-100 to-yellow-100 rounded-3xl p-8 md:p-12 mb-12 shadow-2xl border-4 divine-border relative overflow-hidden">
            <div className="absolute top-0 right-0 text-9xl text-orange-200 opacity-20">🕉️</div>
            <div className="absolute bottom-0 left-0 text-9xl text-orange-200 opacity-20">🚩</div>
            
            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
              {/* Left Side - Text */}
              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold text-orange-700 divine-glow">
                  🚩 जय श्री राम 🚩
                </h1>
                <h2 className="text-2xl md:text-4xl font-semibold text-red-600 divine-glow">
                  जय श्री हनुमान
                </h2>
                <p className="text-lg md:text-xl text-gray-800 leading-relaxed font-medium">
                  राम नाम का लिखित जाप - आध्यात्मिक यात्रा की शुरुआत करें
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/register"
                    className="px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-center"
                  >
                    ✨ अभी शुरू करें
                  </Link>
                  <Link 
                    href="/login"
                    className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-center"
                  >
                    🙏 लॉगिन करें
                  </Link>
                </div>
              </div>
              
              {/* Right Side - Divine Images */}
              <div className="flex items-center justify-center gap-6">
                {/* Ram Bhagwan */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition"></div>
                  <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden shadow-2xl border-4 divine-border">
                    <Image 
                      src="/images/Ayodhya Ramji Photo.webp"
                      alt="Ram Bhagwan"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  <p className="text-center mt-2 text-lg font-bold text-orange-700">श्री राम</p>
                </div>

                {/* Hanuman Ji */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-orange-400 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition"></div>
                  <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden shadow-2xl border-4 divine-border">
                    <div className="w-full h-full bg-gradient-to-br from-orange-300 to-red-300 flex items-center justify-center">
                      <span className="text-8xl">🙏</span>
                    </div>
                  </div>
                  <p className="text-center mt-2 text-lg font-bold text-red-700">हनुमान जी</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl border-2 border-orange-200 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-orange-700 mb-2">राम नाम लेखन</h3>
              <p className="text-gray-600">राम, राधे, हरे कृष्णा - अपनी पसंद का नाम लिखें</p>
            </div>
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl border-2 border-orange-200 text-center">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-orange-700 mb-2">Count Tracking</h3>
              <p className="text-gray-600">अपनी प्रगति को ट्रैक करें और माला गिनें</p>
            </div>
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl border-2 border-orange-200 text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold text-orange-700 mb-2">Leaderboard</h3>
              <p className="text-gray-600">भक्तों के साथ प्रतिस्पर्धा करें</p>
            </div>
          </div>

          {/* Description */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-2xl border-4 divine-border relative overflow-hidden">
              <div className="absolute top-0 right-0 text-6xl text-orange-200 opacity-30">🕉️</div>
              <div className="absolute bottom-0 left-0 text-6xl text-orange-200 opacity-30">🕉️</div>
              <h2 className="text-3xl font-bold text-orange-700 mb-4 text-center">राम नाम की महिमा</h2>
              <p className="text-lg md:text-xl text-gray-800 leading-relaxed relative z-10 font-medium text-center">
                कलयुग में न जप है न तप है और न योग ही है। सिर्फ <span className="text-orange-700 font-bold">राम नाम</span> ही इस कलिकाल में प्राणी मात्र का सहारा है। 
                श्री राम चन्द्र जी सहज ही कृपा करने वाले और परम दयालु हैं उस पर उनका नाम तो प्राणी मात्र को अभय प्रदान करने वाला 
                और परम कल्याण कारी है। कलयुग में <span className="text-red-700 font-bold">राम नाम का लिखित जाप</span> सभी पापों को नष्ट कर मुक्ति प्रदान करने वाला है।
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-12">
            <Link href="/mission" className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 border-2 border-orange-200 hover:border-orange-400 group">
              <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">🎯</div>
              <h3 className="text-xl font-bold text-orange-700">Our Mission</h3>
              <p className="text-sm text-gray-600 mt-2">हमारा उद्देश्य</p>
            </Link>
            <Link href="/glory" className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 border-2 border-orange-200 hover:border-orange-400 group">
              <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">📖</div>
              <h3 className="text-xl font-bold text-orange-700">Glory of Ram Naam</h3>
              <p className="text-sm text-gray-600 mt-2">राम नाम की महिमा</p>
            </Link>
            <Link href="/mandirs" className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 border-2 border-orange-200 hover:border-orange-400 group">
              <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">🛕</div>
              <h3 className="text-xl font-bold text-orange-700">Temple Directory</h3>
              <p className="text-sm text-gray-600 mt-2">मंदिर खोजें</p>
            </Link>
            <Link href="/gallery" className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 border-2 border-orange-200 hover:border-orange-400 group">
              <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">🖼️</div>
              <h3 className="text-xl font-bold text-orange-700">Gallery</h3>
              <p className="text-sm text-gray-600 mt-2">फोटो गैलरी</p>
            </Link>
          </div>

          {/* Bhakti Quotes Section */}
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl p-8 shadow-xl border-2 border-orange-300">
              <div className="text-5xl mb-4 text-center">🙏</div>
              <p className="text-lg text-gray-800 italic text-center font-medium">
                "राम नाम मणि दीप धरु जीह देहरीं द्वार।<br/>
                तुलसी भीतर बाहेरहुँ जौं चाहसि उजिआर।।"
              </p>
              <p className="text-sm text-gray-600 text-center mt-3">- तुलसीदास जी</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl p-8 shadow-xl border-2 border-orange-300">
              <div className="text-5xl mb-4 text-center">📿</div>
              <p className="text-lg text-gray-800 italic text-center font-medium">
                "कलियुग केवल नाम अधारा।<br/>
                सुमिर सुमिर नर उतरहिं पारा।।"
              </p>
              <p className="text-sm text-gray-600 text-center mt-3">- रामचरितमानस</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 text-white py-8 mt-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-3">
            <p className="text-2xl font-bold divine-glow">🕉️ राम राम 🕉️</p>
            <p className="text-sm">© 2024 Ramji Ki Sena - All Rights Reserved</p>
            <p className="text-xs text-orange-200">जय श्री राम | जय हनुमान</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
