require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const DB = process.env.DB_CONNECTION_STRING;

// ── Inline schemas (avoid import issues) ──────────────────────────────────────
const serviceSchema = new mongoose.Schema({
  poojaType: String, price: Number, duration: String, description: String
}, { _id: true });

const panditSchema = new mongoose.Schema({
  username: { type: String, unique: true, sparse: true, trim: true, lowercase: true },
  password: String,
  name: { type: String, required: true },
  photo: { type: String, default: '' },
  photos: [String],
  contact: { phone: { type: String, required: true, unique: true }, email: String, whatsapp: String },
  experience: { type: Number, default: 0 },
  specialization: [String],
  languages: [String],
  qualification: String,
  location: { address: String, city: { type: String, required: true }, state: { type: String, required: true }, pincode: String },
  services: [serviceSchema],
  availability: {
    workingDays: { type: [String], default: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'] },
    workingHours: { start: String, end: String }
  },
  description: String,
  about: String,
  reviews: [],
  averageRating: { type: Number, default: 0 },
  totalBookings: { type: Number, default: 0 },
  completedBookings: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const liveKathaSchema = new mongoose.Schema({
  addressLine1: String, addressLine2: String,
  city: String, state: String, country: { type: String, default: 'India' }, pincode: String,
  startDate: Date, endDate: Date,
  liveLink: String, kathaType: String,
  isActive: { type: Boolean, default: true }
}, { _id: true, timestamps: true });

const kathaVachakSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo: { type: String, default: '' },
  photos: [String],
  experience: { type: Number, default: 0 },
  specialization: { type: String, default: '' },
  description: { type: String, default: '' },
  contact: { phone: String, email: String, whatsapp: String },
  liveKathas: [liveKathaSchema],
  socialMedia: { facebook: String, instagram: String, youtube: String, twitter: String },
  reviews: [],
  averageRating: { type: Number, default: 4.8 },
}, { timestamps: true });

const Pandit = mongoose.models.pandit || mongoose.model('pandit', panditSchema);
const KathaVachak = mongoose.models.kathaVachak || mongoose.model('kathaVachak', kathaVachakSchema);

// ── Data ──────────────────────────────────────────────────────────────────────

const now = new Date();
const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

const pandits = [
  {
    name: 'पं. राजेश शर्मा',
    username: 'pandit_rajesh_sharma',
    password: 'pandit123',
    photo: 'https://images.pexels.com/photos/8978484/pexels-photo-8978484.jpeg?auto=compress&cs=tinysrgb&w=400',
    contact: { phone: '9876543210', email: 'rajesh.sharma@pandit.com', whatsapp: '9876543210' },
    experience: 25,
    specialization: ['विवाह संस्कार', 'गृह प्रवेश', 'सत्यनारायण कथा', 'हवन'],
    languages: ['Hindi', 'Sanskrit', 'English'],
    qualification: 'शास्त्री, काशी हिन्दू विश्वविद्यालय',
    location: { address: 'Arera Colony', city: 'Bhopal', state: 'Madhya Pradesh', pincode: '462016' },
    description: 'वैदिक परंपरा के अनुसार सभी संस्कार करने में 25 वर्षों का अनुभव। काशी से शास्त्री की उपाधि प्राप्त।',
    about: 'पं. राजेश शर्मा जी भोपाल के प्रसिद्ध वैदिक पंडित हैं जो विवाह, गृह प्रवेश, और सभी 16 संस्कारों में विशेषज्ञ हैं।',
    services: [
      { poojaType: 'विवाह संस्कार', price: 5100, duration: 'Full Day', description: 'पूर्ण वैदिक विधि से विवाह' },
      { poojaType: 'गृह प्रवेश', price: 2100, duration: '3 hours', description: 'वास्तु शांति सहित गृह प्रवेश' },
      { poojaType: 'सत्यनारायण कथा', price: 1100, duration: '2 hours', description: 'श्री सत्यनारायण व्रत कथा' },
      { poojaType: 'हवन', price: 1500, duration: '2 hours', description: 'नवग्रह हवन' },
    ],
    availability: { workingDays: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], workingHours: { start: '06:00', end: '20:00' } },
    averageRating: 4.9,
    isVerified: true,
  },
  {
    name: 'पं. विष्णु प्रसाद तिवारी',
    username: 'pandit_vishnu_tiwari',
    password: 'pandit123',
    photo: 'https://images.pexels.com/photos/8978474/pexels-photo-8978474.jpeg?auto=compress&cs=tinysrgb&w=400',
    contact: { phone: '9876543211', email: 'vishnu.tiwari@pandit.com', whatsapp: '9876543211' },
    experience: 18,
    specialization: ['भागवत कथा', 'रामायण पाठ', 'मुंडन संस्कार', 'नामकरण'],
    languages: ['Hindi', 'Sanskrit'],
    qualification: 'आचार्य, उज्जैन',
    location: { address: 'Mahakal Marg', city: 'Ujjain', state: 'Madhya Pradesh', pincode: '456001' },
    description: 'उज्जैन के महाकाल मंदिर से जुड़े अनुभवी पंडित। भागवत कथा और रामायण पाठ में विशेष दक्षता।',
    about: 'पं. विष्णु प्रसाद तिवारी जी उज्जैन के प्रसिद्ध पंडित हैं। महाकाल मंदिर में 18 वर्षों से सेवारत।',
    services: [
      { poojaType: 'भागवत कथा', price: 11000, duration: '7 Days', description: 'श्रीमद् भागवत सप्ताह' },
      { poojaType: 'रामायण पाठ', price: 5100, duration: '3 Days', description: 'अखंड रामायण पाठ' },
      { poojaType: 'मुंडन संस्कार', price: 1500, duration: '2 hours', description: 'वैदिक मुंडन संस्कार' },
      { poojaType: 'नामकरण', price: 1100, duration: '1.5 hours', description: 'शिशु नामकरण संस्कार' },
    ],
    availability: { workingDays: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], workingHours: { start: '05:00', end: '21:00' } },
    averageRating: 4.8,
    isVerified: true,
  },
  {
    name: 'पं. सुरेश दुबे',
    username: 'pandit_suresh_dube',
    password: 'pandit123',
    photo: 'https://images.pexels.com/photos/8978476/pexels-photo-8978476.jpeg?auto=compress&cs=tinysrgb&w=400',
    contact: { phone: '9876543212', email: 'suresh.dube@pandit.com', whatsapp: '9876543212' },
    experience: 30,
    specialization: ['ज्योतिष', 'वास्तु शास्त्र', 'कुंडली मिलान', 'पितृ दोष निवारण'],
    languages: ['Hindi', 'Sanskrit', 'Marathi'],
    qualification: 'ज्योतिषाचार्य, इंदौर',
    location: { address: 'Rajwada Area', city: 'Indore', state: 'Madhya Pradesh', pincode: '452001' },
    description: 'इंदौर के प्रसिद्ध ज्योतिषाचार्य। 30 वर्षों का अनुभव। कुंडली मिलान और वास्तु में विशेषज्ञ।',
    about: 'पं. सुरेश दुबे जी इंदौर के जाने-माने ज्योतिषाचार्य हैं। हजारों परिवारों को उनका मार्गदर्शन मिल चुका है।',
    services: [
      { poojaType: 'कुंडली मिलान', price: 2100, duration: '1 hour', description: 'विवाह हेतु कुंडली मिलान' },
      { poojaType: 'वास्तु परामर्श', price: 3100, duration: '2 hours', description: 'घर/दुकान वास्तु निरीक्षण' },
      { poojaType: 'पितृ दोष निवारण', price: 5100, duration: 'Half Day', description: 'पितृ दोष शांति पूजा' },
      { poojaType: 'ग्रह शांति', price: 2500, duration: '3 hours', description: 'नवग्रह शांति पूजा' },
    ],
    availability: { workingDays: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], workingHours: { start: '08:00', end: '19:00' } },
    averageRating: 4.7,
    isVerified: true,
  },
  {
    name: 'पं. कमलेश मिश्रा',
    username: 'pandit_kamlesh_mishra',
    password: 'pandit123',
    photo: 'https://images.pexels.com/photos/8978480/pexels-photo-8978480.jpeg?auto=compress&cs=tinysrgb&w=400',
    contact: { phone: '9876543213', email: 'kamlesh.mishra@pandit.com', whatsapp: '9876543213' },
    experience: 15,
    specialization: ['सुंदरकांड पाठ', 'हनुमान चालीसा', 'दुर्गा सप्तशती', 'नवरात्रि पूजा'],
    languages: ['Hindi', 'Sanskrit'],
    qualification: 'शास्त्री, जबलपुर',
    location: { address: 'Napier Town', city: 'Jabalpur', state: 'Madhya Pradesh', pincode: '482001' },
    description: 'जबलपुर के प्रसिद्ध पंडित। सुंदरकांड और दुर्गा सप्तशती पाठ में विशेष दक्षता।',
    about: 'पं. कमलेश मिश्रा जी जबलपुर में 15 वर्षों से धार्मिक अनुष्ठान करा रहे हैं।',
    services: [
      { poojaType: 'सुंदरकांड पाठ', price: 1500, duration: '3 hours', description: 'श्री सुंदरकांड पाठ' },
      { poojaType: 'दुर्गा सप्तशती', price: 2100, duration: '4 hours', description: 'दुर्गा सप्तशती पाठ' },
      { poojaType: 'नवरात्रि पूजा', price: 9000, duration: '9 Days', description: 'नवरात्रि विशेष पूजा' },
      { poojaType: 'हनुमान पूजा', price: 1100, duration: '2 hours', description: 'मंगलवार विशेष हनुमान पूजा' },
    ],
    availability: { workingDays: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], workingHours: { start: '06:00', end: '20:00' } },
    averageRating: 4.6,
    isVerified: true,
  },
  {
    name: 'पं. धर्मेंद्र पाठक',
    username: 'pandit_dharmendra_pathak',
    password: 'pandit123',
    photo: 'https://images.pexels.com/photos/8978488/pexels-photo-8978488.jpeg?auto=compress&cs=tinysrgb&w=400',
    contact: { phone: '9876543214', email: 'dharmendra.pathak@pandit.com', whatsapp: '9876543214' },
    experience: 22,
    specialization: ['विवाह', 'यज्ञोपवीत', 'अंत्येष्टि संस्कार', 'श्राद्ध'],
    languages: ['Hindi', 'Sanskrit', 'English'],
    qualification: 'वेदाचार्य, ग्वालियर',
    location: { address: 'Lashkar', city: 'Gwalior', state: 'Madhya Pradesh', pincode: '474001' },
    description: 'ग्वालियर के वरिष्ठ वेदाचार्य। सभी 16 संस्कारों में पारंगत। 22 वर्षों का अनुभव।',
    about: 'पं. धर्मेंद्र पाठक जी ग्वालियर के प्रतिष्ठित पंडित हैं। वेद और उपनिषद के गहरे ज्ञाता।',
    services: [
      { poojaType: 'यज्ञोपवीत संस्कार', price: 3100, duration: 'Half Day', description: 'जनेऊ संस्कार' },
      { poojaType: 'श्राद्ध पूजा', price: 2100, duration: '3 hours', description: 'पितृ श्राद्ध' },
      { poojaType: 'विवाह', price: 7100, duration: 'Full Day', description: 'वैदिक विवाह संस्कार' },
      { poojaType: 'अंत्येष्टि', price: 2500, duration: '4 hours', description: 'अंत्येष्टि संस्कार' },
    ],
    availability: { workingDays: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], workingHours: { start: '05:00', end: '21:00' } },
    averageRating: 4.9,
    isVerified: true,
  },
];

const kathaVachaks = [
  {
    name: 'पं. प्रदीप मिश्रा जी',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Pandit_Pradeep_Mishra.jpg/440px-Pandit_Pradeep_Mishra.jpg',
    experience: 20,
    specialization: 'शिव महापुराण, भागवत कथा',
    description: 'सीहोर, मध्यप्रदेश के विश्वप्रसिद्ध कथावाचक। शिव महापुराण कथा के लिए विशेष रूप से प्रसिद्ध। करोड़ों भक्तों के प्रिय।',
    contact: { phone: '9000000001', email: 'pradeep.mishra@katha.com', whatsapp: '9000000001' },
    socialMedia: {
      youtube: 'https://www.youtube.com/@PanditPradeepMishra',
      facebook: 'https://facebook.com/panditpradeepmishra',
    },
    averageRating: 5.0,
    liveKathas: [
      {
        addressLine1: 'Shiv Mandir Parisar',
        addressLine2: 'Sehore Road',
        city: 'Sehore',
        state: 'Madhya Pradesh',
        country: 'India',
        pincode: '466001',
        startDate: now,
        endDate: nextWeek,
        liveLink: 'https://www.youtube.com/@PanditPradeepMishra',
        kathaType: 'शिव महापुराण',
        isActive: true,
      }
    ],
  },
  {
    name: 'पं. अनिरुद्धाचार्य जी',
    photo: 'https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=400&h=400&fit=crop&crop=face',
    experience: 15,
    specialization: 'श्रीमद् भागवत, राम कथा',
    description: 'वृंदावन के प्रसिद्ध कथावाचक। श्रीमद् भागवत और राम कथा में विशेष दक्षता। देशभर में कथाएं करते हैं।',
    contact: { phone: '9000000002', email: 'aniruddhacharya@katha.com', whatsapp: '9000000002' },
    socialMedia: {
      youtube: 'https://www.youtube.com/@AniruddhacharyaJi',
    },
    averageRating: 4.9,
    liveKathas: [
      {
        addressLine1: 'Ram Leela Maidan',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        country: 'India',
        pincode: '462001',
        startDate: tomorrow,
        endDate: nextWeek,
        liveLink: 'https://www.youtube.com/@AniruddhacharyaJi',
        kathaType: 'श्रीमद् भागवत कथा',
        isActive: true,
      }
    ],
  },
  {
    name: 'पं. देवकीनंदन ठाकुर जी',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    experience: 25,
    specialization: 'राम कथा, सुंदरकांड',
    description: 'राम कथा के विश्वप्रसिद्ध वाचक। सरल और प्रभावशाली शैली में कथा वाचन। लाखों भक्तों के प्रिय।',
    contact: { phone: '9000000003', email: 'devkinandan@katha.com', whatsapp: '9000000003' },
    socialMedia: {
      youtube: 'https://www.youtube.com/@DevkinandanThakurJi',
    },
    averageRating: 4.9,
    liveKathas: [
      {
        addressLine1: 'Hanuman Mandir',
        city: 'Indore',
        state: 'Madhya Pradesh',
        country: 'India',
        pincode: '452001',
        startDate: nextWeek,
        endDate: nextMonth,
        liveLink: 'https://www.youtube.com/@DevkinandanThakurJi',
        kathaType: 'राम कथा',
        isActive: true,
      }
    ],
  },
  {
    name: 'पं. जया किशोरी जी',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
    experience: 12,
    specialization: 'भजन, भागवत, राधा कृष्ण कथा',
    description: 'युवा पीढ़ी की प्रिय कथावाचक। भजन और भागवत कथा में अद्भुत प्रतिभा। देशभर में लोकप्रिय।',
    contact: { phone: '9000000004', email: 'jaya.kishori@katha.com', whatsapp: '9000000004' },
    socialMedia: {
      youtube: 'https://www.youtube.com/@JayaKishoriJi',
      instagram: 'https://instagram.com/jayakishori',
    },
    averageRating: 4.8,
    liveKathas: [],
  },
  {
    name: 'पं. मुरारी बापू जी',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    experience: 40,
    specialization: 'रामायण, तुलसी रामायण',
    description: 'रामायण कथा के महान वाचक। 40 वर्षों से रामकथा का प्रचार-प्रसार। विश्वभर में कथाएं करते हैं।',
    contact: { phone: '9000000005', email: 'murari.bapu@katha.com', whatsapp: '9000000005' },
    socialMedia: {
      youtube: 'https://www.youtube.com/@MurariBapu',
    },
    averageRating: 5.0,
    liveKathas: [
      {
        addressLine1: 'Ramkatha Bhavan',
        city: 'Ujjain',
        state: 'Madhya Pradesh',
        country: 'India',
        pincode: '456001',
        startDate: now,
        endDate: nextWeek,
        liveLink: 'https://www.youtube.com/@MurariBapu',
        kathaType: 'तुलसी रामायण',
        isActive: true,
      }
    ],
  },
];

// ── Seed ──────────────────────────────────────────────────────────────────────
async function seed() {
  try {
    await mongoose.connect(DB);
    console.log('✅ Connected to MongoDB');

    // Clear existing
    await Pandit.deleteMany({});
    await KathaVachak.deleteMany({});
    console.log('🗑️  Cleared existing pandits & katha vachaks');

    // Hash passwords for pandits
    for (const p of pandits) {
      p.password = await bcrypt.hash(p.password, 10);
    }

    const insertedPandits = await Pandit.insertMany(pandits);
    console.log(`✅ Inserted ${insertedPandits.length} Pandits`);

    const insertedKV = await KathaVachak.insertMany(kathaVachaks);
    console.log(`✅ Inserted ${insertedKV.length} Katha Vachaks`);

    console.log('\n🎉 Seed complete!\n');
    console.log('Pandits:');
    insertedPandits.forEach(p => console.log(`  - ${p.name} (${p.location.city})`));
    console.log('\nKatha Vachaks:');
    insertedKV.forEach(k => {
      const live = k.liveKathas.length > 0 ? '🔴 LIVE' : '⚪';
      console.log(`  ${live} ${k.name}`);
    });

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
