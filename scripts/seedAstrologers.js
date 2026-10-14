// Seed Astrologers & Tarot Card Readers
require('dotenv').config();
const mongoose = require('mongoose');
const Astrologer = require('../models/Astrologer');

const initialAstrologers = [
  {
    name: 'पंडित राधेश्याम शास्त्री (Pt. Radheshyam Shastri)',
    username: 'radheshyam_shastri',
    password: 'password123',
    tagline: 'वरिष्ठ वैदिक ज्योतिषी एवं कुंडली मिलान विशेषज्ञ',
    about: '20+ वर्षों का अनुभव। संपूर्णानंद संस्कृत विश्वविद्यालय से ज्योतिष रत्न। जन्मकुंडली विश्लेषण, ग्रह दोष शांति, विवाह व करियर मार्गदर्शन में विशेषज्ञता।',
    contact: {
      phone: '9876543210',
      email: 'radheshyam@astrology.in',
      whatsapp: '9876543210'
    },
    location: {
      city: 'Bhopal',
      state: 'Madhya Pradesh',
      address: 'MP Nagar Zone-II, Bhopal'
    },
    experience: 20,
    specialties: ['Vedic Astrology', 'Kundli Milan', 'Prashna Kundali', 'Dosh Nivaran'],
    languages: ['Hindi', 'Sanskrit'],
    qualifications: 'ज्योतिष रत्न, संपूर्णानंद संस्कृत वि.वि.',
    fee: 501,
    feePerMinute: 15,
    isVerified: true,
    isActive: true,
    availabilityStatus: 'online',
    totalConsultations: 1240,
    averageRating: 4.9,
    services: [
      {
        title: 'जन्म कुंडली सम्पूर्ण विश्लेषण (Kundli Analysis)',
        price: 501,
        duration: '30 mins',
        type: 'Call',
        description: 'ग्रह दशा, करियर, स्वास्थ्य, व आगामी 5 वर्षों का भविष्यफल'
      },
      {
        title: 'विवाह व गुण मिलान (Kundli Milan)',
        price: 501,
        duration: '30 mins',
        type: 'Video Call',
        description: 'अष्टकूट गुण मिलान, नाड़ी दोष व मांगलिक विचार'
      }
    ],
    reviews: [
      {
        userName: 'Vikram Singh',
        rating: 5,
        comment: 'शास्त्री जी का कुंडली विश्लेषण बेहद सटीक रहा। करियर संबंधी उपाय से बहुत लाभ हुआ।',
        topic: 'Career Guidance'
      },
      {
        userName: 'Sunita Sharma',
        rating: 5,
        comment: 'विवाह मिलान के समय बहुत शांत भाव से मार्गदर्शन किया। धन्यवाद!',
        topic: 'Marriage Milan'
      }
    ]
  },
  {
    name: 'मीरा वशिष्ठ (Meera Vashistha)',
    username: 'meera_tarot',
    password: 'password123',
    tagline: 'प्रमाणित टैरो कार्ड रीडर एवं एंजल गाइडेंस विशेषज्ञ',
    about: 'इंटरनेशनल सर्टिफाइड टैरो मास्टर। लव, रिलेशनशिप, करियर उलझनों व लाइफ चॉइसेस के लिए 3-कार्ड व सेल्टिक क्रॉस स्प्रेड के माध्यम से दिव्य अंतर्दृष्टि प्रदान करती हैं।',
    contact: {
      phone: '9876543211',
      email: 'meera@tarotreading.in',
      whatsapp: '9876543211'
    },
    location: {
      city: 'Indore',
      state: 'Madhya Pradesh',
      address: 'Vijay Nagar, Indore'
    },
    experience: 8,
    specialties: ['Tarot Card Reading', 'Love & Relationship', 'Angel Guidance', 'Numerology'],
    languages: ['Hindi', 'English'],
    qualifications: 'Certified Master Tarot Reader (ITA)',
    fee: 651,
    feePerMinute: 20,
    isVerified: true,
    isActive: true,
    availabilityStatus: 'online',
    totalConsultations: 890,
    averageRating: 4.9,
    services: [
      {
        title: '3-Card Tarot Deep Insight (Love & Career)',
        price: 651,
        duration: '30 mins',
        type: 'Call',
        description: 'Past, Present, Future card spread for specific life questions'
      },
      {
        title: 'Celtic Cross Comprehensive Spread',
        price: 1100,
        duration: '45 mins',
        type: 'Video Call',
        description: '10 कार्ड का विस्तृत स्प्रेड जीवन की बड़ी चुनौतियों के समाधान हेतु'
      }
    ],
    reviews: [
      {
        userName: 'Pooja Verma',
        rating: 5,
        comment: 'Meera ji is magical! Her card interpretations were spot on about my job dilemma.',
        topic: 'Career Tarot'
      }
    ]
  },
  {
    name: 'आचार्य देवेन्द्र जोशी (Acharya Devendra Joshi)',
    username: 'devendra_vastu',
    password: 'password123',
    tagline: 'प्राचीन वास्तु शास्त्र एवं अंक ज्योतिष (Numerology) मर्मज्ञ',
    about: 'उज्जैन के प्रतिष्ठित ज्योतिषी। घर, दूकान, फैक्ट्री के वास्तु दोष निवारण बिना तोड़-फोड़ एवं लकी नंबर/नेम करेक्शन के विशेषज्ञ।',
    contact: {
      phone: '9876543212',
      email: 'devendra@vastuujjain.com',
      whatsapp: '9876543212'
    },
    location: {
      city: 'Ujjain',
      state: 'Madhya Pradesh',
      address: 'Mahakal Marg, Ujjain'
    },
    experience: 15,
    specialties: ['Vastu Shastra', 'Numerology', 'Vedic Astrology'],
    languages: ['Hindi', 'Gujarati', 'Sanskrit'],
    qualifications: 'वास्तु वाचस्पति, उज्जैन पीठ',
    fee: 1100,
    feePerMinute: 25,
    isVerified: true,
    isActive: true,
    availabilityStatus: 'online',
    totalConsultations: 1560,
    averageRating: 5.0,
    services: [
      {
        title: 'घर/व्यापार वास्तु परामर्श (Vastu Consultation)',
        price: 1100,
        duration: '45 mins',
        type: 'Video Call',
        description: 'नक्शा देखकर ऊर्जा संतुलन व दोष निवारण के वैदिक उपाय'
      },
      {
        title: 'अंक ज्योतिष नाम सुधार (Name Numerology)',
        price: 801,
        duration: '30 mins',
        type: 'Chat / WhatsApp',
        description: 'जन्म तारीख अनुसार नाम का शुभ मूलांक समायोजन'
      }
    ],
    reviews: [
      {
        userName: 'Rajesh Agrawal',
        rating: 5,
        comment: 'दुकान के वास्तु में दिए गए छोटे से बदलाव से ग्राहकों की आवक में चमत्कारिक सुधार हुआ।',
        topic: 'Business Vastu'
      }
    ]
  },
  {
    name: 'डॉ. अनन्य शर्मा (Dr. Ananya Sharma)',
    username: 'ananya_astro',
    password: 'password123',
    tagline: 'हस्तरेखा विशारद एवं वैदिक लाइफ कोच',
    about: 'हस्तरेखा शास्त्र व चक्र हीलिंग में 11 वर्षों का शोध एवं अनुभव। आपकी हथेली की रेखाओं से भाग्य, स्वास्थ्य व कर्म के रहस्यों का उद्घाटन।',
    contact: {
      phone: '9876543213',
      email: 'ananya@palmistryindia.org',
      whatsapp: '9876543213'
    },
    location: {
      city: 'Delhi',
      state: 'Delhi',
      address: 'Connaught Place, New Delhi'
    },
    experience: 11,
    specialties: ['Palmistry', 'Vedic Astrology', 'Tarot Card Reading'],
    languages: ['Hindi', 'English'],
    qualifications: 'Ph.D. in Vedic Sciences, Palmistry Visharad',
    fee: 751,
    feePerMinute: 18,
    isVerified: true,
    isActive: true,
    availabilityStatus: 'online',
    totalConsultations: 920,
    averageRating: 4.8,
    services: [
      {
        title: 'हस्तरेखा फोटो परामर्श (Palm Reading Analysis)',
        price: 751,
        duration: '30 mins',
        type: 'Call',
        description: 'दोनों हथेलियों के फोटो देखकर जीवन रेखा, भाग्य रेखा, हृदय रेखा का विश्लेषण'
      }
    ],
    reviews: [
      {
        userName: 'Amit Saxena',
        rating: 5,
        comment: 'Very scientific and logical explanation. Clear and peaceful guidance.',
        topic: 'Palmistry'
      }
    ]
  },
  {
    name: 'पं. बृजेश तिवारी (Pt. Brijesh Tiwary)',
    username: 'brijesh_ayodhya',
    password: 'password123',
    tagline: 'अयोध्या धाम - कालसर्प, मांगलिक व पितृ दोष निवारण',
    about: 'काशी विश्वनाथ विद्यापीठ से शिक्षित। अयोध्या धाम में निरंतर 22 वर्षों से वैदिक अनुष्ठान, ग्रह शांति व महामृत्युंजय जप के विशेषज्ञ।',
    contact: {
      phone: '9876543214',
      email: 'brijesh@ayodhyadivyadarshan.org',
      whatsapp: '9876543214'
    },
    location: {
      city: 'Ayodhya',
      state: 'Uttar Pradesh',
      address: 'Ramkot, Ayodhya'
    },
    experience: 22,
    specialties: ['Vedic Astrology', 'Kundli Milan', 'Dosh Nivaran', 'Prashna Kundali'],
    languages: ['Hindi', 'Awadhi', 'Sanskrit'],
    qualifications: 'वेदाचार्य, काशी विश्वनाथ संस्कृत परिषद',
    fee: 501,
    feePerMinute: 15,
    isVerified: true,
    isActive: true,
    availabilityStatus: 'online',
    totalConsultations: 2100,
    averageRating: 5.0,
    services: [
      {
        title: 'दोष विचार व शांति उपाय (Dosh Analysis)',
        price: 501,
        duration: '30 mins',
        type: 'Call',
        description: 'कालसर्प, शनि साढ़ेसाती, व पितृ दोष निवारण के सरल वैदिक उपाय'
      }
    ],
    reviews: [
      {
        userName: 'Kishan Lal',
        rating: 5,
        comment: 'तिवारी जी की वाणी में अद्भुत शांति है। सारे संशय दूर हो गए।',
        topic: 'Kundli Dosh'
      }
    ]
  }
];

async function seed() {
  try {
    const mongoUri = process.env.DB_CONNECTION_STRING || process.env.MONGODB_URI;
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    let addedCount = 0;
    for (const item of initialAstrologers) {
      const existing = await Astrologer.findOne({ 'contact.phone': item.contact.phone });
      if (!existing) {
        await Astrologer.create(item);
        console.log(`Created astrologer: ${item.name}`);
        addedCount++;
      } else {
        console.log(`Already exists: ${item.name}`);
      }
    }

    const total = await Astrologer.countDocuments();
    console.log(`Seeding complete. Added: ${addedCount}, Total in DB: ${total}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
// Auto-seed execution disabled to prevent accidental data overwrites
// seed();

module.exports = seed;
