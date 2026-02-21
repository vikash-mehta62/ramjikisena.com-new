import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl">ℹ️</span>
              </div>
              <h1 className="text-2xl font-bold">About Us</h1>
            </div>
            <Link href="/" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition">
              ← Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-orange-200">
            <h2 className="text-4xl font-bold text-orange-700 mb-4 text-center">
              🚩 Ramji Ki Sena 🚩
            </h2>
            <p className="text-xl text-gray-700 text-center leading-relaxed">
              राम नाम लेखन का एक आध्यात्मिक मंच
            </p>
          </div>

          {/* About Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-orange-200">
            <h3 className="text-2xl font-bold text-orange-700 mb-4">हमारे बारे में</h3>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                कलयुग में न जप है न तप है और न योग ही है। सिर्फ राम नाम ही इस कलिकाल में प्राणी मात्र का सहारा है। 
                श्री राम चन्द्र जी सहज ही कृपा करने वाले और परम दयालु हैं उस पर उनका नाम तो प्राणी मात्र को अभय प्रदान करने वाला 
                और परम कल्याण कारी है।
              </p>
              <p>
                कलयुग में राम नाम का लिखित जाप सभी पापों को नष्ट कर मुक्ति प्रदान करने वाला है। इसी उद्देश्य को ध्यान में रखते हुए 
                इस वेबसाइट का निर्माण किया गया है।
              </p>
              <p>
                आप सबसे हमारा अनुरोध है जितना अधिक संभव हो राम नाम का लिखित जप करें। इसी में हम सब का कल्याण है।
              </p>
            </div>
          </div>

          {/* Mission */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-orange-200">
            <h3 className="text-2xl font-bold text-orange-700 mb-4">🎯 हमारा उद्देश्य</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <span>राम नाम के महत्व को जन-जन तक पहुंचाना</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <span>लोगों को राम नाम लेखन के लिए प्रेरित करना</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <span>आध्यात्मिक विकास में सहायता करना</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">✅</span>
                <span>एक सकारात्मक समुदाय का निर्माण करना</span>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-orange-200">
            <h3 className="text-2xl font-bold text-orange-700 mb-4">✨ विशेषताएं</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-orange-50 p-4 rounded-xl">
                <h4 className="font-bold text-orange-700 mb-2">📊 Daily Tracking</h4>
                <p className="text-gray-600">अपनी दैनिक प्रगति को ट्रैक करें</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl">
                <h4 className="font-bold text-orange-700 mb-2">🏆 Leaderboard</h4>
                <p className="text-gray-600">अन्य भक्तों के साथ प्रतिस्पर्धा करें</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl">
                <h4 className="font-bold text-orange-700 mb-2">📈 Progress Chart</h4>
                <p className="text-gray-600">अपनी आध्यात्मिक यात्रा देखें</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl">
                <h4 className="font-bold text-orange-700 mb-2">👥 Community</h4>
                <p className="text-gray-600">भक्तों का समुदाय</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-8 text-white text-center">
            <h3 className="text-3xl font-bold mb-4">आज ही शुरू करें!</h3>
            <p className="text-xl mb-6">राम नाम लेखन की अपनी आध्यात्मिक यात्रा शुरू करें</p>
            <Link 
              href="/register"
              className="inline-block px-8 py-3 bg-white text-orange-600 font-bold rounded-lg hover:shadow-2xl transition"
            >
              रजिस्टर करें
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
