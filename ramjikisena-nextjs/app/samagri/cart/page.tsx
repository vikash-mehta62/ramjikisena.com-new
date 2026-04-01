'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, Trash2, ArrowLeft, MapPin, Calendar, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api from '@/lib/api';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  unit?: string;
}

interface DeliveryAddress {
  name: string; phone: string; address: string;
  city: string; state: string; pincode: string;
}

function CartContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const packageId = searchParams.get('packageId');
  const packageName = searchParams.get('packageName');
  const packagePrice = searchParams.get('price');

  const [cart, setCart] = useState<CartItem[]>([]);
  const [step, setStep] = useState<'cart' | 'address' | 'confirm'>('cart');
  const [placing, setPlacing] = useState(false);
  const [address, setAddress] = useState<DeliveryAddress>({
    name: '', phone: '', address: '', city: '', state: '', pincode: ''
  });
  const [poojaDate, setPoojaDate] = useState('');
  const [poojaType, setPoojaType] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const isPackageOrder = !!packageId;

  useEffect(() => {
    if (!isPackageOrder) {
      const saved = localStorage.getItem('samagri_cart');
      if (saved) setCart(JSON.parse(saved));
    }
    // Pre-fill address from user profile
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setAddress(prev => ({
        ...prev,
        name: user.name || '',
        phone: user.contact || '',
        city: user.city || '',
      }));
    }
  }, [isPackageOrder]);

  const updateQty = (productId: string, delta: number) => {
    const newCart = cart.map(c => c.productId === productId
      ? { ...c, quantity: Math.max(0, c.quantity + delta) }
      : c
    ).filter(c => c.quantity > 0);
    setCart(newCart);
    localStorage.setItem('samagri_cart', JSON.stringify(newCart));
  };

  const removeItem = (productId: string) => {
    const newCart = cart.filter(c => c.productId !== productId);
    setCart(newCart);
    localStorage.setItem('samagri_cart', JSON.stringify(newCart));
  };

  const subtotal = isPackageOrder
    ? Number(packagePrice) || 0
    : cart.reduce((s, c) => s + c.price * c.quantity, 0);
  const deliveryCharge = subtotal >= 500 ? 0 : 50;
  const total = subtotal + deliveryCharge;

  const isAddressValid = address.name && address.phone && address.address && address.city && address.state && address.pincode;

  const placeOrder = async () => {
    setPlacing(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) { router.push('/login'); return; }

      const payload: any = {
        orderType: isPackageOrder ? 'package' : 'custom',
        deliveryAddress: address,
        poojaDate: poojaDate || undefined,
        poojaType,
        specialInstructions,
        paymentMethod,
      };

      if (isPackageOrder) {
        payload.packageId = packageId;
      } else {
        payload.items = cart.map(c => ({ productId: c.productId, name: c.name, quantity: c.quantity }));
      }

      const res = await api.post('/api/samagri/orders', payload);
      const data = await res.json();

      if (data.success) {
        if (!isPackageOrder) localStorage.removeItem('samagri_cart');
        router.push(`/samagri/orders/${data.order._id}?success=true`);
      } else {
        alert(data.message || 'Order failed. Please try again.');
      }
    } catch (err) {
      alert('Something went wrong. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  const isEmpty = !isPackageOrder && cart.length === 0;

  return (
    <>
      <Navbar />
      <div className="h-20"></div>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/samagri" className="p-2 bg-white rounded-xl shadow hover:shadow-md transition">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold text-orange-800">
              {step === 'cart' ? '🛒 आपका Cart' : step === 'address' ? '📍 Delivery Address' : '✅ Order Confirm करें'}
            </h1>
          </div>

          {/* Steps indicator */}
          <div className="flex items-center gap-2 mb-8">
            {(['cart', 'address', 'confirm'] as const).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step === s ? 'bg-orange-600 text-white' : (i < ['cart','address','confirm'].indexOf(step) ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500')}`}>
                  {i < ['cart','address','confirm'].indexOf(step) ? '✓' : i + 1}
                </div>
                <span className={`text-sm font-medium hidden md:block ${step === s ? 'text-orange-700' : 'text-gray-400'}`}>
                  {s === 'cart' ? 'Cart' : s === 'address' ? 'Address' : 'Confirm'}
                </span>
                {i < 2 && <ChevronRight className="w-4 h-4 text-gray-300" />}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4">

              {/* STEP 1: Cart */}
              {step === 'cart' && (
                <>
                  {isPackageOrder ? (
                    <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-orange-200">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center text-3xl">🎁</div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">{packageName}</h3>
                          <p className="text-orange-600 font-bold text-xl">₹{packagePrice}</p>
                          <p className="text-sm text-gray-500">Complete Pooja Package</p>
                        </div>
                      </div>
                    </div>
                  ) : isEmpty ? (
                    <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                      <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500 text-lg mb-4">आपका cart खाली है</p>
                      <Link href="/samagri" className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 transition">
                        सामग्री देखें
                      </Link>
                    </div>
                  ) : (
                    cart.map(item => (
                      <div key={item.productId} className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4 border border-orange-100">
                        <div className="w-16 h-16 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                          {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" /> : <span className="text-2xl">🪔</span>}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800">{item.name}</h3>
                          <p className="text-orange-600 font-bold">₹{item.price} / {item.unit}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQty(item.productId, -1)} className="w-8 h-8 bg-orange-100 text-orange-700 rounded-lg flex items-center justify-center hover:bg-orange-200 font-bold">−</button>
                          <span className="w-6 text-center font-bold">{item.quantity}</span>
                          <button onClick={() => updateQty(item.productId, 1)} className="w-8 h-8 bg-orange-600 text-white rounded-lg flex items-center justify-center hover:bg-orange-700 font-bold">+</button>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800">₹{item.price * item.quantity}</p>
                          <button onClick={() => removeItem(item.productId)} className="text-red-400 hover:text-red-600 mt-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}

                  {/* Pooja details */}
                  {!isEmpty && (
                    <div className="bg-white rounded-2xl shadow-md p-6 border border-orange-100">
                      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-orange-600" /> पूजा विवरण (Optional)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-600 mb-1 block">पूजा की तारीख</label>
                          <input type="date" value={poojaDate} onChange={e => setPoojaDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-400" />
                        </div>
                        <div>
                          <label className="text-sm text-gray-600 mb-1 block">पूजा का प्रकार</label>
                          <select value={poojaType} onChange={e => setPoojaType(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-400">
                            <option value="">Select Pooja</option>
                            {['Griha Pravesh','Satyanarayan Katha','Rudrabhishek','Marriage','Hawan','Mundan','Shradh','Other'].map(p => (
                              <option key={p} value={p}>{p}</option>
                            ))}
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm text-gray-600 mb-1 block">विशेष निर्देश</label>
                          <textarea value={specialInstructions} onChange={e => setSpecialInstructions(e.target.value)}
                            rows={2} placeholder="कोई विशेष आवश्यकता..."
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 resize-none" />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* STEP 2: Address */}
              {step === 'address' && (
                <div className="bg-white rounded-2xl shadow-md p-6 border border-orange-100">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><MapPin className="w-4 h-4 text-orange-600" /> Delivery Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: 'name', label: 'पूरा नाम *', placeholder: 'आपका नाम' },
                      { key: 'phone', label: 'मोबाइल नंबर *', placeholder: '10 digit number' },
                      { key: 'address', label: 'पूरा पता *', placeholder: 'घर/फ्लैट नंबर, गली, मोहल्ला', full: true },
                      { key: 'city', label: 'शहर *', placeholder: 'City' },
                      { key: 'state', label: 'राज्य *', placeholder: 'State' },
                      { key: 'pincode', label: 'पिन कोड *', placeholder: '6 digit pincode' },
                    ].map(field => (
                      <div key={field.key} className={field.full ? 'md:col-span-2' : ''}>
                        <label className="text-sm text-gray-600 mb-1 block">{field.label}</label>
                        <input
                          value={(address as any)[field.key]}
                          onChange={e => setAddress({ ...address, [field.key]: e.target.value })}
                          placeholder={field.placeholder}
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: Confirm */}
              {step === 'confirm' && (
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl shadow-md p-6 border border-orange-100">
                    <h3 className="font-bold text-gray-800 mb-3">📍 Delivery Address</h3>
                    <p className="text-gray-700">{address.name} · {address.phone}</p>
                    <p className="text-gray-600 text-sm">{address.address}, {address.city}, {address.state} - {address.pincode}</p>
                  </div>
                  <div className="bg-white rounded-2xl shadow-md p-6 border border-orange-100">
                    <h3 className="font-bold text-gray-800 mb-4">💳 Payment Method</h3>
                    <div className="space-y-3">
                      {[
                        { value: 'cod', label: '💵 Cash on Delivery', desc: 'Delivery ke time pay karein' },
                        { value: 'upi', label: '📱 UPI', desc: 'GPay, PhonePe, Paytm' },
                        { value: 'card', label: '💳 Card', desc: 'Debit / Credit Card' },
                      ].map(opt => (
                        <label key={opt.value} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === opt.value ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-200'}`}>
                          <input type="radio" name="payment" value={opt.value} checked={paymentMethod === opt.value} onChange={() => setPaymentMethod(opt.value)} className="accent-orange-600" />
                          <div>
                            <p className="font-semibold text-gray-800">{opt.label}</p>
                            <p className="text-xs text-gray-500">{opt.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-md p-6 border border-orange-100 sticky top-24">
                <h3 className="font-bold text-gray-800 mb-4">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{subtotal}</span></div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span className={deliveryCharge === 0 ? 'text-green-600 font-medium' : ''}>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
                  </div>
                  {deliveryCharge > 0 && <p className="text-xs text-orange-600">₹{500 - subtotal} more for free delivery</p>}
                  <div className="border-t pt-2 flex justify-between font-bold text-lg text-gray-800">
                    <span>Total</span><span className="text-orange-700">₹{total}</span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-6 space-y-3">
                  {step === 'cart' && !isEmpty && (
                    <button onClick={() => setStep('address')}
                      className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all hover:scale-105">
                      Delivery Address →
                    </button>
                  )}
                  {step === 'address' && (
                    <>
                      <button onClick={() => setStep('confirm')} disabled={!isAddressValid}
                        className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        Review Order →
                      </button>
                      <button onClick={() => setStep('cart')} className="w-full text-gray-500 text-sm hover:text-gray-700">← Back to Cart</button>
                    </>
                  )}
                  {step === 'confirm' && (
                    <>
                      <button onClick={placeOrder} disabled={placing}
                        className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50">
                        {placing ? '⏳ Order हो रहा है...' : '✅ Order Place करें'}
                      </button>
                      <button onClick={() => setStep('address')} className="w-full text-gray-500 text-sm hover:text-gray-700">← Back</button>
                    </>
                  )}
                </div>
              </div>

              <Link href="/samagri/orders" className="block bg-white rounded-2xl shadow-md p-4 border border-orange-100 text-center text-orange-700 font-semibold hover:bg-orange-50 transition">
                📦 My Orders देखें
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-6xl">🪔</div></div>}>
      <CartContent />
      <Footer />
    </Suspense>
  );
}
