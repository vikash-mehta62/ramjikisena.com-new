import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <Navbar showAuthButtons={true} />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-orange-200">
            <h2 className="text-3xl font-bold text-orange-700 mb-6 text-center">संपर्क करें</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-orange-100 to-red-100 p-6 rounded-xl">
                <div className="text-4xl mb-3">📧</div>
                <h3 className="font-bold text-orange-700 mb-2">Email</h3>
                <p className="text-gray-700">info@ramjikisena.com</p>
              </div>

              <div className="bg-gradient-to-br from-orange-100 to-red-100 p-6 rounded-xl">
                <div className="text-4xl mb-3">📱</div>
                <h3 className="font-bold text-orange-700 mb-2">Phone</h3>
                <p className="text-gray-700">+91 98765 43210</p>
              </div>

              <div className="bg-gradient-to-br from-orange-100 to-red-100 p-6 rounded-xl">
                <div className="text-4xl mb-3">📍</div>
                <h3 className="font-bold text-orange-700 mb-2">Address</h3>
                <p className="text-gray-700">Ayodhya, Uttar Pradesh, India</p>
              </div>

              <div className="bg-gradient-to-br from-orange-100 to-red-100 p-6 rounded-xl">
                <div className="text-4xl mb-3">🌐</div>
                <h3 className="font-bold text-orange-700 mb-2">Social Media</h3>
                <div className="flex gap-3">
                  <a href="#" className="text-blue-600 hover:text-blue-700">Facebook</a>
                  <a href="#" className="text-red-600 hover:text-red-700">YouTube</a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-orange-200">
            <h3 className="text-2xl font-bold text-orange-700 mb-4">Send Message</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Name</label>
                <input type="text" className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <input type="email" className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Message</label>
                <textarea rows={4} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"></textarea>
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
