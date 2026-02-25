import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function MissionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <Navbar showAuthButtons={true} />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-orange-200">
            <h2 className="text-4xl font-bold text-orange-700 mb-6 text-center">हमारा मिशन</h2>
            <p className="text-xl text-gray-700 text-center leading-relaxed mb-8">
              राम नाम के माध्यम से आध्यात्मिक जागरण
            </p>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border-l-4 border-orange-500">
                <h3 className="text-2xl font-bold text-orange-700 mb-3">🙏 आध्यात्मिक विकास</h3>
                <p className="text-gray-700 leading-relaxed">
                  हमारा उद्देश्य प्रत्येक व्यक्ति को राम नाम के माध्यम से आध्यात्मिक विकास की ओर प्रेरित करना है। 
                  राम नाम का जप मन को शांति प्रदान करता है और जीवन में सकारात्मकता लाता है।
                </p>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border-l-4 border-orange-500">
                <h3 className="text-2xl font-bold text-orange-700 mb-3">🌟 समुदाय निर्माण</h3>
                <p className="text-gray-700 leading-relaxed">
                  एक ऐसे समुदाय का निर्माण करना जहां सभी भक्त एक साथ मिलकर राम नाम का जप करें और 
                  एक दूसरे को प्रेरित करें। यह मंच सभी के लिए खुला है।
                </p>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border-l-4 border-orange-500">
                <h3 className="text-2xl font-bold text-orange-700 mb-3">📈 दैनिक अभ्यास</h3>
                <p className="text-gray-700 leading-relaxed">
                  राम नाम लेखन को दैनिक जीवन का हिस्सा बनाना। नियमित अभ्यास से आध्यात्मिक शक्ति में वृद्धि होती है 
                  और जीवन में सकारात्मक परिवर्तन आता है।
                </p>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border-l-4 border-orange-500">
                <h3 className="text-2xl font-bold text-orange-700 mb-3">🌍 वैश्विक पहुंच</h3>
                <p className="text-gray-700 leading-relaxed">
                  राम नाम की महिमा को विश्व भर में फैलाना। यह मंच सभी देशों के भक्तों के लिए उपलब्ध है 
                  ताकि वे भी इस आध्यात्मिक यात्रा का हिस्सा बन सकें।
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-8 text-white">
            <h3 className="text-3xl font-bold mb-4 text-center">हमारे साथ जुड़ें</h3>
            <p className="text-xl text-center mb-6">
              राम नाम लेखन की इस पवित्र यात्रा में हमारे साथ शामिल हों
            </p>
            <div className="flex justify-center">
              <Link href="/register" className="px-8 py-3 bg-white text-orange-600 font-bold rounded-lg hover:shadow-2xl transition">
                अभी शुरू करें
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
