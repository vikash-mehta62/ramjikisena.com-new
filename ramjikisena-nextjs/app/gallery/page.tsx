import Link from 'next/link';

export default function GalleryPage() {
  const images = [
    { id: 1, title: 'Ram Mandir Ayodhya', emoji: '🛕' },
    { id: 2, title: 'Ram Naam Lekhan', emoji: '✍️' },
    { id: 3, title: 'Bhajan Sandhya', emoji: '🎵' },
    { id: 4, title: 'Community Event', emoji: '👥' },
    { id: 5, title: 'Katha Program', emoji: '📖' },
    { id: 6, title: 'Aarti', emoji: '🪔' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <header className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl">🖼️</span>
              </div>
              <h1 className="text-2xl font-bold">Gallery</h1>
            </div>
            <Link href="/" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition">
              ← Home
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-orange-200 mb-8">
            <h2 className="text-3xl font-bold text-orange-700 mb-2 text-center">फोटो गैलरी</h2>
            <p className="text-gray-600 text-center">हमारे आध्यात्मिक कार्यक्रमों की झलकियां</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <div
                key={image.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-orange-200 hover:shadow-2xl transition group"
              >
                <div className="h-64 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center text-8xl group-hover:scale-110 transition">
                  {image.emoji}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-orange-700 text-center">{image.title}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-3">अपनी फोटो शेयर करें</h3>
            <p className="mb-6">अपने राम नाम लेखन या आध्यात्मिक कार्यक्रमों की फोटो हमारे साथ शेयर करें</p>
            <Link href="/contact" className="inline-block px-8 py-3 bg-white text-orange-600 font-bold rounded-lg hover:shadow-2xl transition">
              Contact Us
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
