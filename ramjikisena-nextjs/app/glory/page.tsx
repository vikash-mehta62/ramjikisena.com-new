import Link from 'next/link';

export default function GloryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <header className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl">📖</span>
              </div>
              <h1 className="text-2xl font-bold">Glory of Ram Naam</h1>
            </div>
            <Link href="/" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition">
              ← Home
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-orange-200">
            <h2 className="text-4xl font-bold text-orange-700 mb-6 text-center">राम नाम की महिमा</h2>
            
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl">
                <h3 className="text-2xl font-bold text-orange-700 mb-3">🕉️ राम नाम का महत्व</h3>
                <p>
                  राम नाम सबसे सरल और सबसे शक्तिशाली मंत्र है। यह केवल दो अक्षरों का है लेकिन इसमें 
                  संपूर्ण ब्रह्मांड की शक्ति समाहित है। राम नाम का जप करने से मन शांत होता है और 
                  आत्मा को परम शांति की प्राप्ति होती है।
                </p>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl">
                <h3 className="text-2xl font-bold text-orange-700 mb-3">✨ राम नाम के लाभ</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">•</span>
                    <span>मन की शांति और स्थिरता</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">•</span>
                    <span>नकारात्मक विचारों से मुक्ति</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">•</span>
                    <span>आध्यात्मिक शक्ति में वृद्धि</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">•</span>
                    <span>जीवन में सकारात्मकता</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">•</span>
                    <span>पापों का नाश</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">•</span>
                    <span>मोक्ष की प्राप्ति</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl">
                <h3 className="text-2xl font-bold text-orange-700 mb-3">📜 शास्त्रों में राम नाम</h3>
                <p className="italic text-lg mb-3">
                  "राम नाम मणि दीप धरु जीह देहरी द्वार।<br/>
                  तुलसी भीतर बाहेरहुँ जौं चाहसि उजिआर।।"
                </p>
                <p>
                  - गोस्वामी तुलसीदास जी ने राम नाम को मणि और दीपक की संज्ञा दी है। 
                  राम नाम से ही जीवन में प्रकाश आता है।
                </p>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl">
                <h3 className="text-2xl font-bold text-orange-700 mb-3">🌟 कलयुग में राम नाम</h3>
                <p>
                  कलयुग में राम नाम ही एकमात्र सहारा है। न जप है, न तप है, न योग है। 
                  केवल राम नाम का जप ही मनुष्य को मुक्ति दिला सकता है। राम नाम का लिखित जप 
                  विशेष रूप से फलदायी माना गया है।
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-8 text-white text-center">
            <h3 className="text-3xl font-bold mb-4">🙏 जय श्री राम 🙏</h3>
            <p className="text-xl">राम नाम सत्य है</p>
          </div>
        </div>
      </main>
    </div>
  );
}
