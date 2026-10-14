/**
 * Comprehensive Mandir Seed Script for Ram Ji Ki Sena
 * Includes:
 * 1. Bhopal, Indore, Bhojpur, Sagar (Saugor), Vidisha
 * 2. Ujjain, Vrindavan, Mathura
 * 3. 12 Jyotirlingas of India
 * 4. Char Dham & Ram Janmabhoomi Ayodhya
 * 5. Maa Kamakhya & 51 Shakti Peethas / Devi Dhams
 * 6. Tirupati Balaji, Siddhivinayak, Khatu Shyam Ji, Salasar Balaji, etc.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Mandir = require('./models/Mandir');

const DB = process.env.DB_CONNECTION_STRING;

const mandirsData = [
  // =========================================================================
  // 1. BHOPAL (भोपाल)
  // =========================================================================
  {
    name: 'बिरला मंदिर (श्री लक्ष्मी नारायण मंदिर)',
    description: 'भोपाल के अरेरा पहाड़ी की चोटी पर स्थित यह भव्य मंदिर भगवान विष्णु और माता लक्ष्मी को समर्पित है। यहां से पूरे भोपाल शहर और विशाल झील का विहंगम दृश्य दिखाई देता है।',
    history: 'इस मंदिर का निर्माण प्रसिद्ध उद्योगपति बिड़ला परिवार द्वारा 1964 में करवाया गया था। इसका उद्घाटन भारत के प्रथम प्रधानमंत्री पंडित जवाहरलाल नेहरू के समय महात्मा गांधी के आदर्शों से प्रेरित होकर किया गया था।',
    significance: 'यह भोपाल का सबसे प्रसिद्ध धार्मिक और दर्शनीय स्थल है। मंदिर परिसर में एक विशाल संग्रहालय भी है जहां मध्यकालीन मूर्तियां संरक्षित हैं।',
    templeType: 'Other',
    architecture: 'Nagara Style (नागर शैली)',
    builtYear: '1964',
    languages: ['Hindi', 'Sanskrit', 'English'],
    photos: [
      'https://images.unsplash.com/photo-1621252179027-94459d278660?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&auto=format&fit=crop&q=80'
    ],
    location: {
      address: 'Arera Hills',
      city: 'Bhopal',
      state: 'Madhya Pradesh',
      pincode: '462011',
      country: 'India',
      coordinates: { lat: 23.2386, lng: 77.4144 }
    },
    timing: {
      opening: '06:00 AM',
      closing: '08:00 PM',
      aarti: [
        { name: 'मंगला आरती', time: '06:30 AM' },
        { name: 'संध्या आरती', time: '07:00 PM' }
      ]
    },
    contact: { phone: '0755-2551234', website: 'https://bhopal.nic.in' },
    deity: { main: 'भगवान लक्ष्मी नारायण (विष्णु-लक्ष्मी)', others: ['शिव जी', 'हनुमान जी'] },
    festivals: [
      { name: 'जन्माष्टमी', month: 'भाद्रपद', description: 'भव्य झांकी और भजन संध्या' },
      { name: 'दीपावली', month: 'कार्तिक', description: 'दीपोत्सव व महाआरती' }
    ],
    facilities: {
      parking: true, prasad: true, accommodation: false,
      wheelchairAccessible: true, restrooms: true, drinkingWater: true,
      cloakroom: true, medicalAid: true, foodStalls: true
    },
    visitInfo: {
      bestTimeToVisit: 'अक्टूबर से मार्च (शाम का समय)',
      dressCode: 'पारंपरिक व शालीन वस्त्र',
      entryFee: 'निःशुल्क (Free)',
      photographyAllowed: false,
      mobileAllowed: true,
      shoeStand: true,
      trustName: 'बिड़ला चेरिटेबल ट्रस्ट'
    },
    status: 'approved',
    averageRating: 4.8
  },
  {
    name: 'गुफा मंदिर (श्री लालघाटी गुफा मंदिर)',
    description: 'लालघाटी भोपाल में स्थित यह एक प्राकृतिक गुफा मंदिर है जहां स्वयंभू शिव और हनुमान जी की प्राचीन प्रतिमाएं प्रतिष्ठित हैं। चारों ओर घने पेड़ों से घिरा यह शांत आध्यात्मिक केंद्र है।',
    history: 'यह मंदिर महंत नारायण दास जी महाराज द्वारा 1965 में विकसित किया गया था। यहां प्राकृतिक पहाड़ी गुफाओं में प्राचीन काल से ऋषि मुनि तपस्या करते आए हैं।',
    significance: 'यह भोपाल के सबसे प्राचीन गुफा मंदिरों में से एक है। यहां एक विशाल संस्कृत विद्यालय और गौशाला भी संचालित है।',
    templeType: 'Other',
    architecture: 'Natural Cave & Traditional',
    builtYear: '1965 (प्राचीन गुफा)',
    languages: ['Hindi', 'Sanskrit'],
    photos: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&auto=format&fit=crop&q=80'
    ],
    location: {
      address: 'Lalghati, Airport Road',
      city: 'Bhopal',
      state: 'Madhya Pradesh',
      pincode: '462030',
      country: 'India',
      coordinates: { lat: 23.2842, lng: 77.3689 }
    },
    timing: {
      opening: '05:30 AM',
      closing: '09:00 PM',
      aarti: [
        { name: 'प्रातः आरती', time: '06:00 AM' },
        { name: 'संध्या आरती', time: '07:30 PM' }
      ]
    },
    deity: { main: 'भगवान शिव व हनुमान जी', others: ['माता दुर्गा', 'श्री राम दरबार'] },
    festivals: [
      { name: 'महाशिवरात्रि', month: 'फाल्गुन', description: 'विशाल मेला और रुद्राभिषेक' },
      { name: 'हनुमान जयंती', month: 'चैत्र', description: 'सुंदरकांड पाठ और भंडारा' }
    ],
    facilities: {
      parking: true, prasad: true, accommodation: true,
      wheelchairAccessible: false, restrooms: true, drinkingWater: true,
      cloakroom: true, medicalAid: false, foodStalls: true
    },
    visitInfo: {
      bestTimeToVisit: 'वर्ष भर, विशेषकर सावन मास',
      dressCode: 'पारंपरिक वस्त्र',
      entryFee: 'निःशुल्क',
      photographyAllowed: true,
      mobileAllowed: true,
      shoeStand: true
    },
    status: 'approved',
    averageRating: 4.7
  },
  {
    name: 'खटलापुरा हनुमान मंदिर',
    description: 'भोपाल के लोअर लेक (छोटी झील) के किनारे स्थित खटलापुरा मंदिर अत्यंत प्राचीन और सिद्ध हनुमान मंदिर है। यहां हनुमान जी की दक्षिणामुखी प्रतिमा स्थापित है।',
    history: 'नवाब कालीन समय से यह मंदिर भोपाल के हिंदुओं की आस्था का मुख्य केंद्र रहा है। मान्यता है कि यहां सच्चे मन से मांगी गई हर मनोकामना पूर्ण होती है।',
    significance: 'भोपाल के प्राचीनतम हनुमान मंदिरों में शीर्ष स्थान रखता है। मंगलवार और शनिवार को हजारों भक्त दर्शनार्थ आते हैं।',
    templeType: 'Other',
    builtYear: '18वीं शताब्दी',
    photos: [
      'https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?w=1200&auto=format&fit=crop&q=80'
    ],
    location: {
      address: 'Khatlapura, Lower Lake',
      city: 'Bhopal',
      state: 'Madhya Pradesh',
      pincode: '462008',
      country: 'India',
      coordinates: { lat: 23.2458, lng: 77.4065 }
    },
    timing: {
      opening: '05:00 AM',
      closing: '10:00 PM',
      aarti: [
        { name: 'मंगला आरती', time: '05:30 AM' },
        { name: 'शयन आरती', time: '09:30 PM' }
      ]
    },
    deity: { main: 'श्री संकटमोचन हनुमान जी', others: ['श्री राम-जानकी', 'शिवलिंग'] },
    festivals: [
      { name: 'हनुमान जयंती', month: 'चैत्र', description: 'महाप्रसाद और भजन कीर्तन' }
    ],
    facilities: {
      parking: true, prasad: true, accommodation: false,
      wheelchairAccessible: true, restrooms: true, drinkingWater: true,
      shoeStand: true, foodStalls: true
    },
    visitInfo: { bestTimeToVisit: 'मंगलवार व शनिवार', entryFee: 'निःशुल्क' },
    status: 'approved',
    averageRating: 4.8
  },

  // =========================================================================
  // 2. BHOJPUR (भोजपुर - विश्व प्रसिद्ध शिव मंदिर)
  // =========================================================================
  {
    name: 'भोजेश्वर महादेव मंदिर (भोजपुर शिव मंदिर)',
    description: 'राजा भोज द्वारा 11वीं सदी में निर्मित भोजेश्वर मंदिर में विश्व का सबसे बड़ा एक ही पत्थर से तराशा गया (Monolithic) शिवलिंग स्थापित है। इसे "उत्तर भारत का सोमनाथ" भी कहा जाता है।',
    history: 'परमार वंश के महान विद्वान राजा भोज (1010-1053 ई.) द्वारा निर्मित। यह मंदिर वास्तुकला की नागर शैली का अद्भुत नमूना है। मंदिर की छत अधूरी होने के बावजूद इसका विशाल स्थापत्य विश्व भर के पुरातत्ववेत्ताओं को आकर्षित करता है।',
    significance: 'यहां स्थित शिवलिंग की ऊंचाई 7.5 फीट और परिधि 17.8 फीट है, जो एक विशाल 21 फीट चौड़े चबूतरे पर विराजमान है। यह ASI द्वारा संरक्षित राष्ट्रीय स्मारक है।',
    templeType: 'Other',
    architecture: 'Bhumija & Nagara Style (भूमिज एवं नागर शैली)',
    builtYear: '11वीं शताब्दी (1010-1053 ई.)',
    languages: ['Hindi', 'English', 'Sanskrit'],
    photos: [
      'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1620619767323-b95a89183081?w=1200&auto=format&fit=crop&q=80'
    ],
    location: {
      address: 'Bhojpur Village, Betwa River Bank',
      city: 'Bhojpur',
      state: 'Madhya Pradesh',
      pincode: '464993',
      country: 'India',
      coordinates: { lat: 23.1001, lng: 77.5884 }
    },
    timing: {
      opening: '06:00 AM',
      closing: '07:00 PM',
      aarti: [
        { name: 'प्रातः आरती', time: '06:30 AM' },
        { name: 'संध्या आरती', time: '06:30 PM' }
      ]
    },
    contact: { website: 'https://asi.nic.in' },
    deity: { main: 'भोजेश्वर महादेव (विशाल शिवलिंग)', others: ['माता पार्वती'] },
    festivals: [
      { name: 'महाशिवरात्रि भोजपुर महोत्सव', month: 'फाल्गुन', description: 'लाखों श्रद्धालु और मध्य प्रदेश शासन का सांस्कृतिक उत्सव' }
    ],
    facilities: {
      parking: true, prasad: true, accommodation: false,
      wheelchairAccessible: true, restrooms: true, drinkingWater: true,
      cloakroom: false, medicalAid: true, foodStalls: true
    },
    visitInfo: {
      bestTimeToVisit: 'नवंबर से फरवरी',
      dressCode: 'पारंपरिक वस्त्र',
      entryFee: 'निःशुल्क (ASI परिसर)',
      photographyAllowed: true,
      mobileAllowed: true,
      shoeStand: true,
      managedBy: 'भारतीय पुरातत्व सर्वेक्षण (ASI)'
    },
    status: 'approved',
    averageRating: 4.9
  },

  // =========================================================================
  // 3. INDORE (इंदौर)
  // =========================================================================
  {
    name: 'खजराना गणेश मंदिर (इंदौर)',
    description: 'इंदौर का खजराना गणेश मंदिर भारत के सबसे जागृत और प्रसिद्ध सिद्धिविनायक मंदिरों में से एक है। रानी अहिल्याबाई होल्कर द्वारा निर्मित इस मंदिर में भक्तों की हर मनोकामना पूरी होती है।',
    history: '1735 में रानी अहिल्याबाई होल्कर ने इस मंदिर का निर्माण करवाया था। मान्यता है कि औरंगजेब से मूर्ति की रक्षा के लिए इसे कुएं में छिपाया गया था, जिसे बाद में अहिल्याबाई ने स्वप्न आने पर बाहर निकलवाकर भव्य मंदिर में स्थापित किया।',
    significance: 'मध्य प्रदेश का सबसे धनी और लोकप्रिय गणेश तीर्थ है। भक्त अपनी मन्नत पूरी करने के लिए मंदिर की पीठ पर उल्टा स्वास्तिक बनाते हैं और मन्नत पूरी होने पर सीधा स्वास्तिक बनाते हैं।',
    templeType: 'Other',
    architecture: 'Maratha & Holkar Style',
    builtYear: '1735 ई.',
    languages: ['Hindi', 'Malwi', 'Marathi', 'English'],
    photos: [
      'https://images.unsplash.com/photo-1567591414240-e175cf643f5f?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=1200&auto=format&fit=crop&q=80'
    ],
    location: {
      address: 'Khajrana Road, Ganeshpuri',
      city: 'Indore',
      state: 'Madhya Pradesh',
      pincode: '452016',
      country: 'India',
      coordinates: { lat: 22.7297, lng: 75.8996 }
    },
    timing: {
      opening: '05:00 AM',
      closing: '11:00 PM',
      aarti: [
        { name: 'मंगला आरती', time: '05:30 AM' },
        { name: 'भोग आरती', time: '12:00 PM' },
        { name: 'संध्या आरती', time: '08:00 PM' },
        { name: 'शयन आरती', time: '10:30 PM' }
      ]
    },
    contact: { phone: '0731-2555555', website: 'https://khajranaganesh.com' },
    deity: { main: 'श्री खजराना सिद्धि विनायक गणेश जी', others: ['रिद्धि-सिद्धि', 'माता दुर्गा', 'शिव परिवार', 'शनि देव'] },
    festivals: [
      { name: 'गणेश चतुर्थी व अनंत चतुर्दशी', month: 'भाद्रपद', description: '10 दिवसीय महामहोत्सव और सवा लाख लड्डुओं का महाभोग' },
      { name: 'तिल चतुर्थी मेला', month: 'माघ', description: 'वार्षिक विशाल मेला' }
    ],
    facilities: {
      parking: true, prasad: true, accommodation: false,
      wheelchairAccessible: true, restrooms: true, drinkingWater: true,
      cloakroom: true, medicalAid: true, foodStalls: true
    },
    visitInfo: {
      bestTimeToVisit: 'बुधवार व संकष्टी चतुर्थी',
      dressCode: 'पारंपरिक भारतीय वस्त्र',
      entryFee: 'निःशुल्क',
      photographyAllowed: false,
      mobileAllowed: true,
      shoeStand: true,
      trustName: 'श्री गणपति मंदिर खजराना प्रबंध समिति'
    },
    status: 'approved',
    averageRating: 4.9
  },
  {
    name: 'बड़ा गणपति मंदिर (इंदौर)',
    description: 'इंदौर के उज्जैनी गेट के पास स्थित बड़ा गणपति मंदिर में विश्व की सबसे ऊंची गणेश प्रतिमाओं में से एक (लगभग 25 फीट ऊंची) स्थापित है।',
    history: 'इस मंदिर की स्थापना 1901 में पं. नारायण दाधीच द्वारा की गई थी। प्रतिमा के निर्माण में चूना, गुड़, बालू, पंचरत्न और तीर्थों के पवित्र जल का उपयोग किया गया था।',
    significance: 'प्रतिमा का विशाल स्वरूप और चोला चढ़ाने की अनूठी परंपरा देश-विदेश में विख्यात है। चोला चढ़ाने में लगभग 15-20 दिन का समय लगता है।',
    templeType: 'Other',
    builtYear: '1901 ई.',
    photos: [
      'https://images.unsplash.com/photo-1567591414240-e175cf643f5f?w=1200&auto=format&fit=crop&q=80'
    ],
    location: {
      address: 'Bada Ganpati Square, Malharganj',
      city: 'Indore',
      state: 'Madhya Pradesh',
      pincode: '452002',
      country: 'India',
      coordinates: { lat: 22.7196, lng: 75.8427 }
    },
    timing: {
      opening: '05:00 AM',
      closing: '10:00 PM',
      aarti: [
        { name: 'प्रातः आरती', time: '06:00 AM' },
        { name: 'संध्या आरती', time: '07:30 PM' }
      ]
    },
    deity: { main: 'विशाल गणपति (25 फीट)' },
    facilities: { parking: true, prasad: true, drinkingWater: true, restrooms: true },
    visitInfo: { bestTimeToVisit: 'वर्ष भर', entryFee: 'निःशुल्क' },
    status: 'approved',
    averageRating: 4.8
  },
  {
    name: 'अन्नपूर्णा माता मंदिर (इंदौर)',
    description: 'मदुरै के प्रसिद्ध मीनाक्षी मंदिर की तर्ज पर निर्मित अन्नपूर्णा मंदिर देवी अन्नपूर्णा को समर्पित है। इसका विशाल गोपुरम और चार विशाल हाथियों का प्रवेश द्वार देखते ही बनता है।',
    history: '1959 में महामंडलेश्वर स्वामी प्रभानंद गिरि जी महाराज द्वारा स्थापित। यह मालवा क्षेत्र का प्रमुख शक्ति उपासना केंद्र है।',
    significance: 'मंदिर परिसर में देवी अन्नपूर्णा, काल भैरव, नवग्रह और शिव मंदिर स्थित हैं। यहां प्रतिदिन सैकड़ों भक्तों को निःशुल्क महाप्रसाद वितरित किया जाता है।',
    templeType: 'Other',
    architecture: 'Dravidian Style (द्रविड़ गोपुरम शैली)',
    builtYear: '1959',
    photos: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&auto=format&fit=crop&q=80'
    ],
    location: {
      address: 'Annapurna Road, Kranti Kriplani Nagar',
      city: 'Indore',
      state: 'Madhya Pradesh',
      pincode: '452009',
      country: 'India',
      coordinates: { lat: 22.6989, lng: 75.8341 }
    },
    timing: { opening: '05:00 AM', closing: '10:00 PM' },
    deity: { main: 'माता अन्नपूर्णा', others: ['भगवान शिव', 'काल भैरव', 'हनुमान जी'] },
    festivals: [{ name: 'नवरात्रि', month: 'आश्विन/चैत्र', description: '9 दिवसीय महापूजा व गरबा महोत्सव' }],
    facilities: { parking: true, prasad: true, restrooms: true, drinkingWater: true },
    visitInfo: { bestTimeToVisit: 'नवरात्रि व सावन', entryFee: 'निःशुल्क' },
    status: 'approved',
    averageRating: 4.8
  },
  {
    name: 'पितृ पर्वत हनुमान धाम (इंदौर)',
    description: 'इंदौर के निकट पितृ पर्वत पर अष्टधातु से निर्मित 66 फीट ऊंची भगवान हनुमान जी की विश्व की सबसे बड़ी बैठी मुद्रा में प्रतिमा स्थापित की गई है।',
    history: 'संतों के आशीर्वाद और इंदौर वासियों के सहयोग से इस पहाड़ी पर लाखों पौधे लगाए गए और भगवान हनुमान जी की 90 टन वजनी स्वर्णमयी आभा वाली प्रतिमा 2020 में प्रतिष्ठित की गई।',
    significance: 'पर्यावरण संरक्षण और पितृ तर्पण के साथ-साथ यह मध्य भारत का प्रमुख राम-हनुमान तीर्थ बन चुका है। रात्रि में प्रतिमा का दिव्य प्रकाश देखते ही बनता है।',
    templeType: 'Other',
    builtYear: '2020',
    photos: [
      'https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?w=1200&auto=format&fit=crop&q=80'
    ],
    location: {
      address: 'Pitra Parvat, Dhar Road',
      city: 'Indore',
      state: 'Madhya Pradesh',
      pincode: '453001',
      country: 'India',
      coordinates: { lat: 22.7056, lng: 75.7612 }
    },
    timing: { opening: '06:00 AM', closing: '09:00 PM' },
    deity: { main: 'वीर हनुमान (66 फीट अष्टधातु)' },
    facilities: { parking: true, prasad: true, drinkingWater: true, restrooms: true },
    visitInfo: { bestTimeToVisit: 'शाम के समय (Sunset)', entryFee: 'निःशुल्क' },
    status: 'approved',
    averageRating: 4.9
  },

  // =========================================================================
  // 4. VIDISHA (विदिशा)
  // =========================================================================
  {
    name: 'बीजा मंडल (विजया मंदिर - विदिशा)',
    description: 'विदिशा का बीजा मंडल एक ऐतिहासिक विशाल मंदिर परिसर है जो देवी विजया (चर्चिका) और भगवान सूर्य को समर्पित था। इसका विशाल आकार कोणार्क के सूर्य मंदिर से भी विशाल माना जाता था।',
    history: '8वीं-11वीं सदी में परमार और चालुक्य काल में निर्मित। इसके अवशेषों पर की गई नक्काशी प्राचीन भारतीय स्थापत्य की पराकाष्ठा दर्शाती है।',
    significance: 'विदिशा की समृद्ध सांस्कृतिक धरोहर का प्रतीक। यह ASI द्वारा संरक्षित एक राष्ट्रीय धरोहर है।',
    templeType: 'Other',
    architecture: 'Classical Parmar Nagara Style',
    builtYear: '8वीं-11वीं शताब्दी',
    photos: [
      'https://images.unsplash.com/photo-1620619767323-b95a89183081?w=1200&auto=format&fit=crop&q=80'
    ],
    location: {
      address: 'Station Road, Old Town',
      city: 'Vidisha',
      state: 'Madhya Pradesh',
      pincode: '464001',
      country: 'India',
      coordinates: { lat: 23.5251, lng: 77.8181 }
    },
    timing: { opening: '08:00 AM', closing: '06:00 PM' },
    deity: { main: 'माता विजया (चर्चिका देवी)' },
    facilities: { parking: true, restrooms: true, drinkingWater: true },
    visitInfo: { bestTimeToVisit: 'अक्टूबर से मार्च', entryFee: 'निःशुल्क' },
    status: 'approved',
    averageRating: 4.6
  },
  {
    name: 'उदयगिरि गुफाएं एवं वराह मंदिर (विदिशा)',
    description: 'गुप्त काल (4वीं-5वीं सदी) की 20 शैलकृत गुफाओं का समूह, जहां गुफा संख्या 5 में भगवान विष्णु के वराह अवतार द्वारा पृथ्वी माता के उद्धार की अद्वितीय विशाल प्रतिमा स्थित है।',
    history: 'चंद्रगुप्त विक्रमादित्य द्वितीय के काल (लगभग 400 ई.) में उत्कीर्ण की गई। यह भारतीय मूर्तिशिल्प का स्वर्ण युग मानी जाती है।',
    significance: 'हिंदू धर्म के सबसे प्राचीन ज्ञात स्मारकों और शैलकृत मंदिरों में इसका स्थान अद्वितीय है। यहां शेषशायी विष्णु और शिव गुफाएं भी हैं।',
    templeType: 'Other',
    architecture: 'Rock-Cut Gupta Architecture',
    builtYear: '4वीं-5वीं शताब्दी (गुप्त काल)',
    photos: [
      'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=1200&auto=format&fit=crop&q=80'
    ],
    location: {
      address: 'Udayagiri Hills, Bes River',
      city: 'Vidisha',
      state: 'Madhya Pradesh',
      pincode: '464001',
      country: 'India',
      coordinates: { lat: 23.5369, lng: 77.7725 }
    },
    timing: { opening: '09:00 AM', closing: '05:30 PM' },
    deity: { main: 'भगवान वराह (विष्णु अवतार)', others: ['शिवलिंग', 'शेषशायी विष्णु'] },
    facilities: { parking: true, drinkingWater: true, restrooms: true },
    visitInfo: { entryFee: '₹25 (भारतीय नागरिक)', managedBy: 'ASI' },
    status: 'approved',
    averageRating: 4.8
  },
  {
    name: 'चरण तीर्थ मंदिर (विदिशा)',
    description: 'पवित्र बेतवा नदी के तट पर स्थित चरण तीर्थ एक अत्यंत पवित्र घाट और मंदिर समूह है। मान्यता है कि यहां भगवान श्री राम के चरण पड़े थे।',
    history: 'प्राचीन काल से ऋषि-मुनियों का तपोवन। बेतवा (वेत्रवती) नदी के उत्तर वाहिनी होने के कारण इस स्थल का धार्मिक महत्व गंगा के समान माना जाता है।',
    significance: 'पिंडदान, स्नान और सूर्य उपासना के लिए मध्य भारत का प्रमुख तीर्थ है।',
    templeType: 'Other',
    photos: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&auto=format&fit=crop&q=80'],
    location: { address: 'Betwa River Ghat', city: 'Vidisha', state: 'Madhya Pradesh', pincode: '464001' },
    timing: { opening: '05:00 AM', closing: '08:00 PM' },
    deity: { main: 'भगवान शिव व श्री राम' },
    status: 'approved',
    averageRating: 4.7
  },

  // =========================================================================
  // 5. SAGAR / SAUGOR (सागर)
  // =========================================================================
  {
    name: 'गढ़पहरा हनुमान मंदिर (सागर)',
    description: 'सागर से लगभग 12 किमी दूर विंध्य पहाड़ियों पर स्थित ऐतिहासिक गढ़पहरा दुर्ग में यह चमत्कारी हनुमान मंदिर स्थापित है। यह डांगियों की प्राचीन राजधानी रही है।',
    history: '9वीं से 11वीं सदी का प्राचीन किला। मंदिर की हनुमान प्रतिमा अत्यंत जाग्रत मानी जाती है और घने वनों व पहाड़ियों के बीच स्थित है।',
    significance: 'सागर अंचल के श्रद्धालुओं की अगाध आस्था का केंद्र है। मंगलवार व शनिवार को यहां मेला सा दृश्य होता है।',
    templeType: 'Other',
    builtYear: 'प्राचीन काल',
    photos: ['https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?w=1200&auto=format&fit=crop&q=80'],
    location: { address: 'Gadhpahra Fort, Jhansi Road', city: 'Sagar', state: 'Madhya Pradesh', pincode: '470001' },
    timing: { opening: '06:00 AM', closing: '07:30 PM' },
    deity: { main: 'श्री हनुमान जी' },
    status: 'approved',
    averageRating: 4.7
  },
  {
    name: 'राहतगढ़ प्राचीन शिव मंदिर (सागर)',
    description: 'बीना नदी के तट पर और प्रसिद्ध राहतगढ़ जलप्रपात के निकट स्थित प्राचीन शिव मंदिर और दुर्ग का धार्मिक व ऐतिहासिक महत्व है।',
    history: 'परमार और बुंदेला शासकों के समय का यह स्थल अपनी प्राकृतिक सुंदरता और प्राचीन शिवलिंग के लिए जाना जाता है।',
    significance: 'महाशिवरात्रि पर यहां विशाल मेले का आयोजन होता है जहां हजारों श्रद्धालु बीना नदी में स्नान कर भगवान भोलेनाथ का जलाभिषेक करते हैं।',
    templeType: 'Other',
    photos: ['https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&auto=format&fit=crop&q=80'],
    location: { address: 'Rahatgarh Fort, Bina River', city: 'Sagar', state: 'Madhya Pradesh', pincode: '470119' },
    timing: { opening: '06:00 AM', closing: '06:30 PM' },
    deity: { main: 'भगवान शिव' },
    status: 'approved',
    averageRating: 4.6
  },
  {
    name: 'लाखा बंजारा झील हनुमान मंदिर (सागर)',
    description: 'सागर शहर के हृदय में स्थित विशाल लाखा बंजारा झील के किनारे स्थित यह मंदिर नगरवासियों की आस्था का प्रमुख केंद्र है।',
    history: 'लाखा बंजारा द्वारा निर्मित ऐतिहासिक झील के किनारे स्थापित यह सिद्ध हनुमान मंदिर सदियों से सागर की रक्षा का प्रतीक माना जाता है।',
    significance: 'झील के शांत वातावरण और संध्या आरती के दिव्य अनुभव के लिए विख्यात है।',
    templeType: 'Other',
    photos: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&auto=format&fit=crop&q=80'],
    location: { address: 'Lakha Banjara Lake, City Center', city: 'Sagar', state: 'Madhya Pradesh', pincode: '470002' },
    timing: { opening: '05:30 AM', closing: '09:00 PM' },
    deity: { main: 'श्री हनुमान जी' },
    status: 'approved',
    averageRating: 4.7
  },

  // =========================================================================
  // 6. UJJAIN (उज्जैन - अवंतिका नगरी)
  // =========================================================================
  {
    name: 'श्री महाकालेश्वर ज्योतिर्लिंग (उज्जैन)',
    description: 'द्वादश ज्योतिर्लिंगों में एकमात्र दक्षिणमुखी महाकालेश्वर ज्योतिर्लिंग। शिप्रा नदी के तट पर अवंतिका नगरी में स्थित काल के भी काल महाकाल का परम धाम। यहां की भस्म आरती विश्व प्रसिद्ध है।',
    history: 'अनादि काल से पूजित। मंदिर का वर्तमान भव्य स्वरूप 18वीं शताब्दी में मराठा सेनापति रामचंद्र बाबा शेणवी (राणाजी शिंदे के काल) द्वारा पुनर्निर्मित कराया गया था। 2022 में भव्य "श्री महाकाल लोक" कॉरिडोर का लोकार्पण हुआ।',
    significance: 'पृथ्वी का नाभि केंद्र। मान्यता है कि महाकाल तीनों लोकों के स्वामी और उज्जयिनी के राजा हैं। यहां प्रतिदिन प्रातः 4 बजे होने वाली "भस्म आरती" का दर्शन मोक्ष प्रदायक माना गया है।',
    templeType: 'Jyotirlinga',
    architecture: 'Bhumija & Maratha Style (भूमिज एवं मराठा शैली)',
    builtYear: 'अनादि (वर्तमान रूप 18वीं सदी व महाकाल लोक 2022)',
    languages: ['Hindi', 'Sanskrit', 'Malwi', 'English'],
    photos: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=1200&auto=format&fit=crop&q=80'
    ],
    location: {
      address: 'Mahakal Marg, Jaisinghpura',
      city: 'Ujjain',
      state: 'Madhya Pradesh',
      pincode: '456006',
      country: 'India',
      coordinates: { lat: 23.1827, lng: 75.7682 }
    },
    timing: {
      opening: '04:00 AM',
      closing: '11:00 PM',
      aarti: [
        { name: 'भस्म आरती', time: '04:00 AM' },
        { name: 'दद्योदक आरती', time: '07:00 AM' },
        { name: 'भोग आरती', time: '10:30 AM' },
        { name: 'संध्या आरती', time: '05:00 PM' },
        { name: 'शयन आरती', time: '10:30 PM' }
      ]
    },
    contact: { phone: '0734-2550563', website: 'https://shrimahakaleshwar.com' },
    deity: { main: 'दक्षिणमुखी महाकालेश्वर महादेव', others: ['नागचंद्रेश्वर', 'ओंकारेश्वर', 'माता पार्वती', 'कार्तिकेय', 'गणेश जी'] },
    festivals: [
      { name: 'महाशिवरात्रि शिवनवरात्रि', month: 'फाल्गुन', description: '9 दिन का विशेष श्रृंगार व सेहरा दर्शन' },
      { name: 'सावन सोमवार सवारी', month: 'श्रावण-भाद्रपद', description: 'राजा महाकाल की नगर भ्रमण सवारी' }
    ],
    facilities: {
      parking: true, prasad: true, accommodation: true,
      wheelchairAccessible: true, restrooms: true, drinkingWater: true,
      cloakroom: true, medicalAid: true, foodStalls: true
    },
    visitInfo: {
      bestTimeToVisit: 'वर्ष भर, विशेषकर सावन और शिवरात्रि',
      dressCode: 'भस्म आरती व गर्भगृह हेतु धोती/सोला (पुरुष) व साड़ी (महिला)',
      entryFee: 'सामान्य दर्शन निःशुल्क, शीघ्र दर्शन ₹250',
      photographyAllowed: false,
      mobileAllowed: false,
      shoeStand: true,
      trustName: 'श्री महाकालेश्वर मंदिर प्रबंध समिति'
    },
    status: 'approved',
    averageRating: 5.0
  },
  {
    name: 'हरसिद्धि माता मंदिर (उज्जैन - शक्तिपीठ)',
    description: '51 शक्तिपीठों में से एक, जहां माता सती की कोहनी गिरी थी। राजा विक्रमादित्य की कुलदेवी। मंदिर परिसर में स्थापित दो विशाल दीपस्तंभ (दीपमालिकाएं) शाम को 1000 दीपों से जगमगाते हैं।',
    history: 'सम्राट विक्रमादित्य के समय से प्रतिष्ठित। सम्राट विक्रमादित्य प्रतिदिन देवी हरसिद्धि की आराधना करते थे।',
    significance: 'तांत्रिक और वैदिक दोनों परंपराओं में अत्यंत सिद्ध पीठ। नवरात्रि में दीपस्तंभ प्रज्वलन का दृश्य अलौकिक होता है।',
    templeType: 'Shakti Peeth',
    builtYear: 'प्राचीन (विक्रमादित्य काल)',
    photos: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&auto=format&fit=crop&q=80'],
    location: { address: 'Near Rudra Sagar, Mahakal Path', city: 'Ujjain', state: 'Madhya Pradesh', pincode: '456006' },
    timing: { opening: '05:00 AM', closing: '10:00 PM' },
    deity: { main: 'माता हरसिद्धि', others: ['महालक्ष्मी', 'महासरस्वती'] },
    festivals: [{ name: 'नवरात्रि', month: 'आश्विन/चैत्र', description: 'अखंड दीप प्रज्वलन व शतचंडी यज्ञ' }],
    facilities: { parking: true, prasad: true, restrooms: true, drinkingWater: true },
    status: 'approved',
    averageRating: 4.9
  },
  {
    name: 'काल भैरव मंदिर (उज्जैन)',
    description: 'उज्जैन के सेनापति कहे जाने वाले काल भैरव का प्राचीन मंदिर जहां भगवान को मदिरा का भोग लगाया जाता है, जिसे वे चमत्कारिक रूप से ग्रहण करते हैं।',
    history: 'स्कंद पुराण के अवंतिका खंड में वर्णित। बाजीराव पेशवा द्वितीय ने इस मंदिर का जीर्णोद्धार कराया था।',
    significance: 'महाकाल के दर्शन के बाद काल भैरव के दर्शन अनिवार्य माने गए हैं अन्यथा यात्रा अधूरी मानी जाती है।',
    templeType: 'Other',
    photos: ['https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&auto=format&fit=crop&q=80'],
    location: { address: 'Shipra River Bank, Bhairavgarh', city: 'Ujjain', state: 'Madhya Pradesh', pincode: '456003' },
    timing: { opening: '05:00 AM', closing: '10:00 PM' },
    deity: { main: 'भगवान काल भैरव' },
    status: 'approved',
    averageRating: 4.8
  },

  // =========================================================================
  // 7. VRINDAVAN & MATHURA (वृंदावन व मथुरा)
  // =========================================================================
  {
    name: 'श्री बांके बिहारी मंदिर (वृंदावन)',
    description: 'वृंदावन का सबसे प्रमुख और हृदयस्थली मंदिर। स्वामी हरिदास जी द्वारा प्रकट किए गए नटनागर बांके बिहारी जी का अनुपम विग्रह। यहां बार-बार पर्दा खींचने की अनूठी परंपरा है ताकि भक्त बिहारी जी की नैनों के वशीभूत न हो जाएं।',
    history: 'स्वामी हरिदास जी ने 1543 ई. में निधिवन में अपनी संगीत साधना से श्री बांके बिहारी जी को प्रकट किया था। वर्तमान मंदिर 1864 में गोस्वामी समाज द्वारा निर्मित कराया गया।',
    significance: 'ब्रज का सबसे जाग्रत मंदिर। वर्ष में केवल एक बार शरद पूर्णिमा को बिहारी जी बंसी धारण करते हैं और केवल अक्षय तृतीया को चरण दर्शन होते हैं। यहां कभी घंटी या शंख नहीं बजता ताकि बिहारी जी को कोई कष्ट न हो।',
    templeType: 'Other',
    architecture: 'Rajasthani Contemporary',
    builtYear: '1864 ई.',
    languages: ['Braj Bhasha', 'Hindi', 'English'],
    photos: [
      'https://images.unsplash.com/photo-1567591414240-e175cf643f5f?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&auto=format&fit=crop&q=80'
    ],
    location: {
      address: 'Godhuli Puram, Bihari Pura',
      city: 'Vrindavan',
      state: 'Uttar Pradesh',
      pincode: '281121',
      country: 'India',
      coordinates: { lat: 27.5815, lng: 77.7011 }
    },
    timing: {
      opening: '07:45 AM',
      closing: '09:30 PM',
      aarti: [
        { name: 'श्रृंगार आरती', time: '08:00 AM' },
        { name: 'राजभोग आरती', time: '12:00 PM' },
        { name: 'संध्या आरती', time: '05:30 PM' },
        { name: 'शयन आरती', time: '09:15 PM' }
      ]
    },
    deity: { main: 'श्री बांके बिहारी जी (श्री कृष्ण)' },
    festivals: [
      { name: 'होली महोत्सव', month: 'फाल्गुन', description: 'लठमार होली व फूलों की अलौकिक होली' },
      { name: 'जन्माष्टमी', month: 'भाद्रपद', description: 'वर्ष में एकमात्र बार होने वाली मंगला आरती' },
      { name: 'अक्षय तृतीया', month: 'वैशाख', description: 'चरण दर्शन' }
    ],
    facilities: {
      parking: false, prasad: true, accommodation: true,
      wheelchairAccessible: false, restrooms: true, drinkingWater: true,
      shoeStand: true, foodStalls: true
    },
    visitInfo: {
      bestTimeToVisit: 'शरद पूर्णिमा, होली, जन्माष्टमी',
      dressCode: 'पारंपरिक शालीन वस्त्र',
      entryFee: 'निःशुल्क'
    },
    status: 'approved',
    averageRating: 5.0
  },
  {
    name: 'प्रेम मंदिर (वृंदावन)',
    description: 'जगद्गुरु कृपालु जी महाराज द्वारा निर्मित सफेद इटैलियन संगमरमर का भव्य मंदिर। मंदिर की दीवारों पर श्री राधा-कृष्ण और श्री सीता-राम की लीलाओं की नक्काशी और रात्रि में संगीतमय फव्वारे व लाइट शो अद्भुत हैं।',
    history: 'निर्माण कार्य 2001 में प्रारंभ हुआ और 2012 में इसका लोकार्पण हुआ। 1000 कारीगरों ने 11 वर्षों में इसे तैयार किया।',
    significance: 'आधुनिक काल का सबसे सुंदर संगमरमरी मंदिर। रात्रि में बहुरंगी प्रकाश से जगमगाता मंदिर स्वर्गिक आभा बिखेरता है।',
    templeType: 'Other',
    architecture: 'Classical Nagara & Rajasthani Marble',
    builtYear: '2012',
    photos: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&auto=format&fit=crop&q=80'
    ],
    location: {
      address: 'Chhatikara Road, Raman Reti',
      city: 'Vrindavan',
      state: 'Uttar Pradesh',
      pincode: '281121',
      coordinates: { lat: 27.5714, lng: 77.6744 }
    },
    timing: { opening: '05:30 AM', closing: '08:30 PM' },
    deity: { main: 'श्री राधा गोविंद एवं श्री सीता राम' },
    facilities: { parking: true, prasad: true, wheelchairAccessible: true, restrooms: true, drinkingWater: true },
    visitInfo: { bestTimeToVisit: 'शाम 6:00 से 8:30 (लाइट शो)', entryFee: 'निःशुल्क' },
    status: 'approved',
    averageRating: 4.9
  },
  {
    name: 'श्री कृष्ण जन्मभूमि मंदिर (मथुरा)',
    description: 'भगवान श्री कृष्ण का पावन अवतरण स्थल (कारागार/गर्भ गृह)। द्वापर युग में कंस के कारागार में यहीं पर भाद्रपद कृष्ण अष्टमी की आधी रात को भगवान का प्राकट्य हुआ था।',
    history: 'भगवान श्री कृष्ण के प्रपौत्र वज्रनाभ द्वारा प्रथम मंदिर बनवाया गया था। इसके बाद विभिन्न हिंदू राजाओं जैसे चंद्रगुप्त विक्रमादित्य ने इसका पुनर्निर्माण कराया। वर्तमान भव्य मंदिर का निर्माण पंडित मदन मोहन मालवीय के प्रयासों से बिड़ला-डालमिया ट्रस्ट द्वारा कराया गया।',
    significance: 'सप्त पुरियों में मथुरा शिरोमणि है। यहां का दर्शन प्रत्येक सनातनी का परम सौभाग्य माना जाता है।',
    templeType: 'Other',
    architecture: 'Nagara Hindu Architecture',
    builtYear: 'द्वापर युग (वर्तमान मंदिर 1982)',
    photos: [
      'https://images.unsplash.com/photo-1567591414240-e175cf643f5f?w=1200&auto=format&fit=crop&q=80'
    ],
    location: {
      address: 'Deeg Gate, Mathura City',
      city: 'Mathura',
      state: 'Uttar Pradesh',
      pincode: '281001',
      coordinates: { lat: 27.5054, lng: 77.6698 }
    },
    timing: { opening: '05:00 AM', closing: '09:30 PM' },
    deity: { main: 'भगवान बाल कृष्ण (केशवदेव)', others: ['माता देवकी', 'वसुदेव जी', 'योगमाया'] },
    festivals: [{ name: 'श्री कृष्ण जन्माष्टमी', month: 'भाद्रपद', description: 'विश्व का सबसे बड़ा जन्माष्टमी महोत्सव' }],
    facilities: { parking: true, prasad: true, cloakroom: true, restrooms: true, drinkingWater: true },
    visitInfo: { bestTimeToVisit: 'जन्माष्टमी, होली', entryFee: 'निःशुल्क' },
    status: 'approved',
    averageRating: 5.0
  },

  // =========================================================================
  // 8. 12 JYOTIRLINGAS OF INDIA (द्वादश ज्योतिर्लिंग)
  // =========================================================================
  {
    name: 'श्री सोमनाथ ज्योतिर्लिंग (गुजरात)',
    description: 'भारत के 12 ज्योतिर्लिंगों में सर्वप्रथम ज्योतिर्लिंग। प्रभास पाटन, सौराष्ट्र गुजरात में अरब सागर के तट पर स्थित। इसे "अमर मंदिर" कहा जाता है जिसे अनेक बार आक्रांताओं ने तोड़ा किंतु यह हर बार अधिक भव्यता से खड़ा हुआ।',
    history: 'चंद्रदेव (सोम) द्वारा स्वर्ण का, रावण द्वारा रजत का, भगवान कृष्ण द्वारा चंदन की लकड़ी का और राजा भीमदेव द्वारा पत्थरों से निर्मित। स्वतंत्रता के बाद लौह पुरुष सरदार वल्लभभाई पटेल के संकल्प से वर्तमान भव्य मंदिर बना।',
    significance: 'प्रथम ज्योतिर्लिंग। समुद्र तट पर स्थित "बाण स्तंभ" दर्शाता है कि यहां से दक्षिणी ध्रुव (Antarctica) तक सीधी रेखा में कोई भूभाग नहीं है।',
    templeType: 'Jyotirlinga',
    architecture: 'Chalukya & Kailash Mahameru Prasad Style',
    builtYear: '1951 (आधुनिक पुनर्निर्माण)',
    photos: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=1200&auto=format&fit=crop&q=80'
    ],
    location: {
      address: 'Somnath Mandir Road, Prabhas Patan',
      city: 'Veraval',
      state: 'Gujarat',
      pincode: '362268',
      country: 'India',
      coordinates: { lat: 20.8880, lng: 70.4013 }
    },
    timing: {
      opening: '06:00 AM',
      closing: '10:00 PM',
      aarti: [
        { name: 'प्रातः आरती', time: '07:00 AM' },
        { name: 'दोपहर आरती', time: '12:00 PM' },
        { name: 'संध्या आरती', time: '07:00 PM' }
      ]
    },
    contact: { website: 'https://somnath.org' },
    deity: { main: 'श्री सोमनाथ महादेव' },
    facilities: { parking: true, prasad: true, accommodation: true, wheelchairAccessible: true, restrooms: true, drinkingWater: true },
    visitInfo: { bestTimeToVisit: 'नवंबर से फरवरी', entryFee: 'निःशुल्क' },
    status: 'approved',
    averageRating: 5.0
  },
  {
    name: 'श्री मल्लिकार्जुन ज्योतिर्लिंग (श्रीशैलम, आंध्र प्रदेश)',
    description: 'कृष्णा नदी के तट पर नल्लामला पहाड़ियों पर स्थित दूसरा ज्योतिर्लिंग। यह एक दुर्लभ "ज्योतिर्लिंग और शक्तिपीठ (भ्रमराम्बा)" का संगम स्थल है। इसे "दक्षिण का कैलाश" कहा जाता है।',
    history: 'सातवाहन, इक्ष्वाकु, काकतीय और विजयनगर राजाओं द्वारा संरक्षित। छत्रपति शिवाजी महाराज ने यहां गोपुरम और विश्रामालयों का निर्माण कराया था।',
    significance: 'मल्लिका (माता पार्वती) और अर्जुन (भगवान शिव) दोनों का एक रूप। इस पर्वत पर दर्शन मात्र से मोक्ष की प्राप्ति मानी गई है।',
    templeType: 'Jyotirlinga',
    architecture: 'Dravidian Style',
    builtYear: 'प्राचीन (विजयनगर काल)',
    photos: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&auto=format&fit=crop&q=80'],
    location: { address: 'Srisailam Hills', city: 'Srisailam', state: 'Andhra Pradesh', pincode: '518101', coordinates: { lat: 16.0744, lng: 78.8682 } },
    timing: { opening: '04:30 AM', closing: '10:00 PM' },
    deity: { main: 'श्री मल्लिकार्जुन स्वामी', others: ['भ्रमराम्बा देवी (शक्तिपीठ)'] },
    status: 'approved',
    averageRating: 4.9
  },
  {
    name: 'श्री ओंकारेश्वर ज्योतिर्लिंग (मध्य प्रदेश)',
    description: 'पवित्र नर्मदा नदी के तट पर मांधाता (शिवपुरी) द्वीप पर स्थित चौथा ज्योतिर्लिंग। यह द्वीप स्वयं ॐ (ओम) के पवित्र आकार में बना हुआ है। इसके साथ ही ममलेश्वर ज्योतिर्लिंग भी पूजित है।',
    history: 'सूर्यवंशी राजा मांधाता ने यहां घोर तपस्या की थी। नर्मदा नदी की दोनों धाराओं के बीच यह पावन द्वीप स्थित है।',
    significance: 'कहा जाता है कि तीनों लोकों के भ्रमण के पश्चात भगवान शिव रात्रि विश्राम हेतु ओंकारेश्वर आते हैं, इसलिए यहां प्रतिदिन शयन आरती और चौपड़ की बिसात बिछाई जाती है।',
    templeType: 'Jyotirlinga',
    architecture: 'Nagara Style',
    builtYear: 'प्राचीन काल',
    photos: ['https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&auto=format&fit=crop&q=80'],
    location: { address: 'Mandhata Island, Narmada River', city: 'Khandwa', state: 'Madhya Pradesh', pincode: '450595', coordinates: { lat: 22.2467, lng: 76.1517 } },
    timing: { opening: '05:00 AM', closing: '09:30 PM' },
    deity: { main: 'श्री ओंकारेश्वर महादेव', others: ['ममलेश्वर'] },
    status: 'approved',
    averageRating: 4.9
  },
  {
    name: 'श्री केदारनाथ ज्योतिर्लिंग (उत्तराखंड)',
    description: 'हिमालय की गोद में मंदाकिनी नदी के उद्गम के निकट 3584 मीटर की ऊंचाई पर स्थित ग्यारहवां ज्योतिर्लिंग। चार धाम और पंच केदार में सर्वोच्च। बादलों और बर्फ की चोटियों से घिरा यह धाम स्वर्ग समान है।',
    history: 'महाभारत काल में पांडवों द्वारा निर्मित माना जाता है, जिन्होंने गोत्र हत्या के पाप से मुक्ति के लिए भगवान शिव की खोज की थी। 8वीं सदी में आदि शंकराचार्य ने इसका जीर्णोद्धार कराया और यहीं समाधि ली।',
    significance: 'भगवान शिव यहां बैल के कूबड़ (Hump) के रूप में शिला रूप में पूजित हैं। मंदिर केवल 6 माह (अक्षय तृतीया से दीवाली तक) खुला रहता है, शीतकाल में पूजा उखीमठ में होती है।',
    templeType: 'Jyotirlinga',
    architecture: 'Katyuri Style (विशाल ग्रेनाइट शिलाएं)',
    builtYear: '8वीं शताब्दी (आदि शंकराचार्य)',
    photos: [
      'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&auto=format&fit=crop&q=80'
    ],
    location: {
      address: 'Kedarnath Dham, Garhwal Himalayas',
      city: 'Rudraprayag',
      state: 'Uttarakhand',
      pincode: '246445',
      coordinates: { lat: 30.7352, lng: 79.0669 }
    },
    timing: { opening: '04:00 AM', closing: '09:00 PM' },
    deity: { main: 'श्री केदारनाथ महादेव' },
    facilities: { prasad: true, accommodation: true, medicalAid: true, restrooms: true },
    visitInfo: { bestTimeToVisit: 'मई-जून और सितंबर-अक्टूबर', entryFee: 'निःशुल्क (बायोमेट्रिक रजिस्ट्रेशन अनिवार्य)' },
    status: 'approved',
    averageRating: 5.0
  },
  {
    name: 'श्री काशी विश्वनाथ ज्योतिर्लिंग (वाराणसी)',
    description: 'संसार की सबसे प्राचीन जीवित नगरी काशी (बनारस) में गंगा तट पर स्थित बारह ज्योतिर्लिंगों में सर्वोपरि धाम। भगवान शिव के त्रिशूल पर बसी नगरी का मुख्य देवालय।',
    history: 'अनादि काशी तीर्थ। वर्तमान मंदिर का निर्माण 1780 में इंदौर की महारानी अहिल्याबाई होल्कर ने कराया था। पंजाब केसरी महाराजा रणजीत सिंह ने शिखर पर 1 टन स्वर्ण चढ़वाया था। 2021 में भव्य "काशी विश्वनाथ धाम" कॉरिडोर निर्मित हुआ।',
    significance: 'कहा जाता है कि काशी में देह त्यागने वाले के कान में स्वयं भगवान शिव तारक मंत्र देकर मोक्ष प्रदान करते हैं। गंगा स्नान और विश्वनाथ दर्शन से सात जन्मों के पाप नष्ट होते हैं।',
    templeType: 'Jyotirlinga',
    architecture: 'Nagara & Modern Corridor Architecture',
    builtYear: '1780 (अहिल्याबाई होल्कर)',
    photos: [
      'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1200&auto=format&fit=crop&q=80'
    ],
    location: {
      address: 'Vishwanath Gali, Dashashwamedh',
      city: 'Varanasi',
      state: 'Uttar Pradesh',
      pincode: '221001',
      coordinates: { lat: 25.3109, lng: 83.0107 }
    },
    timing: {
      opening: '03:00 AM',
      closing: '11:00 PM',
      aarti: [
        { name: 'मंगला आरती', time: '03:00 AM' },
        { name: 'मध्याह्न भोग आरती', time: '11:30 AM' },
        { name: 'सप्तर्षि आरती', time: '07:00 PM' },
        { name: 'शृंगार आरती', time: '09:00 PM' },
        { name: 'शयन आरती', time: '10:30 PM' }
      ]
    },
    contact: { website: 'https://shrikashivishwanath.org' },
    deity: { main: 'श्री काशी विश्वनाथ महादेव', others: ['माता अन्नपूर्णा', 'दण्डपाणि भैरव'] },
    status: 'approved',
    averageRating: 5.0
  },
  {
    name: 'श्री भीमाशंकर ज्योतिर्लिंग (महाराष्ट्र)',
    description: 'सह्याद्रि पर्वत श्रृंखला में भीमा नदी के उद्गम पर स्थित छठा ज्योतिर्लिंग। घने जंगलों और अभयारण्य के बीच स्थित अत्यंत मनोरम तीर्थ।',
    history: 'भगवान शिव द्वारा त्रिपुरासुर और भीमासुर के वध के बाद प्रकट। 13वीं-18वीं सदी में पेशवाओं द्वारा इसका विस्तार किया गया।',
    significance: 'भीमेश्वर महादेव के दर्शन से समस्त भयों का नाश होता है। यह भीमाशंकर वन्यजीव अभयारण्य के भीतर स्थित है।',
    templeType: 'Jyotirlinga',
    architecture: 'Nagara & Hemadpanthi Architecture',
    photos: ['https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&auto=format&fit=crop&q=80'],
    location: { address: 'Bhimashankar, Khed Taluka', city: 'Pune', state: 'Maharashtra', pincode: '410509', coordinates: { lat: 19.0722, lng: 73.5358 } },
    timing: { opening: '04:30 AM', closing: '09:30 PM' },
    deity: { main: 'श्री भीमाशंकर महादेव' },
    status: 'approved',
    averageRating: 4.8
  },
  {
    name: 'श्री त्र्यंबकेश्वर ज्योतिर्लिंग (नासिक, महाराष्ट्र)',
    description: 'पवित्र गोदावरी नदी के उद्गम ब्रह्मगिरि पर्वत की तलहटी में स्थित दसवां ज्योतिर्लिंग। यहां शिवलिंग में ब्रह्मा, विष्णु और महेश तीनों देवों के तीन मुख (पिंडी) स्थापित हैं।',
    history: 'पेशवा बालाजी बाजीराव (नाना साहेब) ने 1755-1786 में काले पत्थरों से इस भव्य मंदिर का निर्माण करवाया था।',
    significance: 'तीनों त्रिदेवों का संयुक्त ज्योतिर्लिंग। यहां कालसर्प दोष और नारायण नागबली शांति पूजा के लिए देश भर से लोग आते हैं। यह कुंभ मेला स्थल भी है।',
    templeType: 'Jyotirlinga',
    architecture: 'Hemadpanthi Black Stone',
    builtYear: '1755-1786 ई.',
    photos: ['https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=1200&auto=format&fit=crop&q=80'],
    location: { address: 'Trimbak, Nashik District', city: 'Nashik', state: 'Maharashtra', pincode: '422212', coordinates: { lat: 19.9324, lng: 73.5307 } },
    timing: { opening: '05:30 AM', closing: '09:00 PM' },
    deity: { main: 'श्री त्र्यंबकेश्वर महादेव (ब्रह्मा, विष्णु, शिव)' },
    status: 'approved',
    averageRating: 4.9
  },
  {
    name: 'श्री बैद्यनाथ धाम (देवघर, झारखंड)',
    description: 'संथाल परगना के देवघर में स्थित ज्योतिर्लिंग। इसे "कामना लिंग" भी कहा जाता है क्योंकि रावण ने अपनी तपस्या से इसे प्राप्त किया था।',
    history: 'रावण जब शिवलिंग को लंका ले जा रहा था, तब देवताओं की लीला से उसने इसे यहीं रख दिया, जिसके बाद यह अचल हो गया।',
    significance: 'श्रावण मास में सुल्तानगंज से 105 किमी गंगाजल लाकर पैदल "कांवड़ यात्रा" करने वाले लाखों कांवड़ियों का संगम स्थल।',
    templeType: 'Jyotirlinga',
    architecture: 'Nagara Temple Style',
    photos: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&auto=format&fit=crop&q=80'],
    location: { address: 'Deoghar Main Town', city: 'Deoghar', state: 'Jharkhand', pincode: '814112', coordinates: { lat: 24.4925, lng: 86.7001 } },
    timing: { opening: '04:00 AM', closing: '09:00 PM' },
    deity: { main: 'श्री बैद्यनाथ महादेव', others: ['माता पार्वती'] },
    status: 'approved',
    averageRating: 4.9
  },
  {
    name: 'श्री नागेश्वर ज्योतिर्लिंग (द्वारका, गुजरात)',
    description: 'द्वारका और बेट द्वारका के मार्ग पर स्थित ज्योतिर्लिंग। दारुका वन में भगवान शिव ने सुप्रिय नामक भक्त की रक्षा हेतु नागेश रूप में प्राकट्य लिया था।',
    history: 'अत्यंत प्राचीन तीर्थ। यहां भगवान शिव की 85 फीट ऊंची ध्यान मुद्रा में विशाल प्रतिमा स्थापित है।',
    significance: 'नागेश्वर ज्योतिर्लिंग के दर्शन से विष, सर्प भय और पापों से मुक्ति मिलती है।',
    templeType: 'Jyotirlinga',
    photos: ['https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&auto=format&fit=crop&q=80'],
    location: { address: 'Daarukavanam, Near Dwarka', city: 'Dwarka', state: 'Gujarat', pincode: '361345', coordinates: { lat: 22.3347, lng: 69.0543 } },
    timing: { opening: '06:00 AM', closing: '09:00 PM' },
    deity: { main: 'श्री नागेश्वर महादेव' },
    status: 'approved',
    averageRating: 4.8
  },
  {
    name: 'श्री रामनाथस्वामी ज्योतिर्लिंग (रामेश्वरम, तमिलनाडु)',
    description: 'चार धामों और 12 ज्योतिर्लिंगों दोनों में सम्मिलित। समुद्र के मध्य पंबन द्वीप पर स्थित। भगवान श्री राम ने लंका विजय से पूर्व बालू से इस शिवलिंग का निर्माण कर पूजा की थी।',
    history: 'रामायण कालीन इतिहास। वर्तमान विशाल मंदिर 12वीं सदी में पांड्य और जाफना राजाओं द्वारा विस्तारित किया गया। इसका 1220 मीटर लंबा खंभों वाला बरामदा (Corridor) विश्व का सबसे लंबा मंदिर गलियारा है।',
    significance: 'यहां स्थित 22 पवित्र कुंडों (तीर्थों) के जल से स्नान करने से समस्त पापों का प्रक्षालन होता है।',
    templeType: 'Jyotirlinga',
    architecture: 'Dravidian Architecture (भव्य गोपुरम व विशाल गलियारा)',
    builtYear: '12वीं शताब्दी',
    photos: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&auto=format&fit=crop&q=80'
    ],
    location: {
      address: 'Rameswaram Island',
      city: 'Rameswaram',
      state: 'Tamil Nadu',
      pincode: '623526',
      coordinates: { lat: 9.2881, lng: 79.3174 }
    },
    timing: { opening: '05:00 AM', closing: '09:00 PM' },
    deity: { main: 'श्री रामनाथस्वामी (रामेश्वरम शिव)', others: ['माता पर्वतवर्धिनी'] },
    status: 'approved',
    averageRating: 4.9
  },
  {
    name: 'श्री घृष्णेश्वर ज्योतिर्लिंग (वेरुल / एलोरा, महाराष्ट्र)',
    description: 'द्वादश ज्योतिर्लिंगों में अंतिम (बारहवां) ज्योतिर्लिंग। एलोरा की विश्व प्रसिद्ध गुफाओं के समीप स्थित। परम शिव भक्त घुश्मा के पुत्र को भगवान शिव ने यहां नवजीवन दिया था।',
    history: 'वर्तमान मंदिर का निर्माण 18वीं सदी में मालवा की महारानी अहिल्याबाई होल्कर ने लाल पत्थरों से कराया था।',
    significance: 'संतान प्राप्ति और समस्त कष्टों से मुक्ति के लिए यह सिद्ध तीर्थ माना जाता है।',
    templeType: 'Jyotirlinga',
    architecture: 'Maratha & South Indian Stone Carving',
    builtYear: '18वीं शताब्दी (अहिल्याबाई होल्कर)',
    photos: ['https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=1200&auto=format&fit=crop&q=80'],
    location: { address: 'Ellora Caves Road, Verul', city: 'Aurangabad', state: 'Maharashtra', pincode: '431102', coordinates: { lat: 20.0249, lng: 75.1793 } },
    timing: { opening: '05:30 AM', closing: '09:00 PM' },
    deity: { main: 'श्री घृष्णेश्वर महादेव' },
    status: 'approved',
    averageRating: 4.8
  },

  // =========================================================================
  // 9. CHAR DHAM & RAM JANMABHOOMI (चार धाम व राम जन्मभूमि)
  // =========================================================================
  {
    name: 'श्री राम जन्मभूमि मंदिर (अयोध्या धाम)',
    description: 'मर्यादा पुरुषोत्तम प्रभु श्री राम की जन्मस्थली पर नवनिर्मित अलौकिक व भव्य मंदिर। 500 वर्षों की प्रतीक्षा के बाद 22 जनवरी 2024 को श्री रामलला सरकार की प्राण प्रतिष्ठा संपन्न हुई।',
    history: 'त्रेतायुग से अयोध्या सरयू तट पर स्थित। 2020 में भूमिपूजन और 2024 में नागर शैली में तीन मंजिला भव्य गुलाबी बलुआ पत्थरों (बंसी पहाड़पुर) से मंदिर का निर्माण हुआ।',
    significance: 'समस्त सनातनी जगत का परम आस्था केंद्र। यहां 5 वर्षीय बालक रूप में श्री रामलला का श्यामवर्णी दिव्य विग्रह स्थापित है, जिनका सूर्य तिलक रामनवमी को सूर्य किरणों द्वारा होता है।',
    templeType: 'Char Dham',
    architecture: 'Nagara Classical Temple Architecture',
    builtYear: '2024 (प्राण प्रतिष्ठा: 22 जनवरी 2024)',
    languages: ['Hindi', 'Awadhi', 'Sanskrit', 'English'],
    photos: [
      'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&auto=format&fit=crop&q=80'
    ],
    location: {
      address: 'Ram Kot, Sai Nagar',
      city: 'Ayodhya',
      state: 'Uttar Pradesh',
      pincode: '224123',
      country: 'India',
      coordinates: { lat: 26.7956, lng: 82.1943 }
    },
    timing: {
      opening: '06:30 AM',
      closing: '10:00 PM',
      aarti: [
        { name: 'मंगला आरती', time: '04:30 AM' },
        { name: 'श्रृंगार आरती', time: '06:30 AM' },
        { name: 'भोग आरती', time: '12:00 PM' },
        { name: 'संध्या आरती', time: '07:30 PM' },
        { name: 'शयन आरती', time: '10:00 PM' }
      ]
    },
    contact: { website: 'https://srjbtkshetra.org' },
    deity: { main: 'प्रभु श्री रामलला सरकार' },
    festivals: [
      { name: 'श्री राम नवमी', month: 'चैत्र', description: 'सूर्य तिलक व लाखों भक्तों का जन्मोत्सव' },
      { name: 'दीपोत्सव (दीपावली)', month: 'कार्तिक', description: 'लाखों दीपों से सरयू तट का विश्व रिकॉर्ड' }
    ],
    facilities: {
      parking: true, prasad: true, accommodation: true,
      wheelchairAccessible: true, restrooms: true, drinkingWater: true,
      cloakroom: true, medicalAid: true, foodStalls: true
    },
    visitInfo: {
      bestTimeToVisit: 'राम नवमी, दीपोत्सव, वर्ष भर',
      dressCode: 'पारंपरिक भारतीय परिधान',
      entryFee: 'निःशुल्क',
      photographyAllowed: false,
      mobileAllowed: false,
      trustName: 'श्री राम जन्मभूमि तीर्थ क्षेत्र ट्रस्ट'
    },
    status: 'approved',
    averageRating: 5.0
  },
  {
    name: 'श्री हनुमान गढ़ी मंदिर (अयोध्या धाम)',
    description: 'अयोध्या के रक्षक कोतवाल श्री हनुमान जी का 76 सीढ़ियों वाला प्राचीन किला मंदिर। अयोध्या में प्रभु श्री राम के दर्शन से पूर्व हनुमान गढ़ी के दर्शन की प्राचीन परंपरा है।',
    history: 'राजा विक्रमादित्य काल से पूजित। नवाब शुजाउद्दौला के समय इसका विस्तार हुआ। यहां माता अंजनी की गोद में बालक हनुमान की दुर्लभ प्रतिमा है।',
    significance: 'अयोध्या का सर्वोच्च आध्यात्मिक चौकी। हनुमान जी यहां राजा के रूप में सिंहासन पर विराजमान हैं।',
    templeType: 'Other',
    builtYear: 'प्राचीन काल',
    photos: ['https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?w=1200&auto=format&fit=crop&q=80'],
    location: { address: 'Sai Nagar, Near Raj Dwar', city: 'Ayodhya', state: 'Uttar Pradesh', pincode: '224123', coordinates: { lat: 26.7978, lng: 82.2025 } },
    timing: { opening: '05:00 AM', closing: '11:00 PM' },
    deity: { main: 'श्री हनुमान जी व माता अंजनी' },
    status: 'approved',
    averageRating: 5.0
  },
  {
    name: 'श्री बद्रीनाथ धाम (उत्तराखंड)',
    description: 'भारत के मुख्य चार धामों में उत्तरी धाम। अलकनंदा नदी के किनारे नर और नारायण पर्वतों के बीच स्थित वैकुंठ धाम। भगवान विष्णु यहां ध्यान मुद्रा में विराजमान हैं।',
    history: 'सत्ययुग का धाम। 8वीं सदी में आदि शंकराचार्य ने नारद कुंड से शालिग्राम शिला रूपी बद्रीनारायण की मूर्ति निकालकर मंदिर में प्रतिष्ठित की।',
    significance: 'मोक्ष प्रदायक महातीर्थ। यहां का तप्त कुंड जिसमें 55°C गर्म सल्फर का प्राकृतिक जल बहता है, भक्तों के स्नान का मुख्य स्थल है।',
    templeType: 'Char Dham',
    architecture: 'Traditional Himalayan Pagoda Style',
    builtYear: '8वीं शताब्दी (आदि शंकराचार्य)',
    photos: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&auto=format&fit=crop&q=80'
    ],
    location: { address: 'Badrinath Town, Chamoli', city: 'Badrinath', state: 'Uttarakhand', pincode: '246422', coordinates: { lat: 30.7447, lng: 79.4912 } },
    timing: { opening: '04:30 AM', closing: '09:00 PM' },
    deity: { main: 'भगवान बद्रीनारायण (विष्णु)' },
    status: 'approved',
    averageRating: 5.0
  },
  {
    name: 'श्री जगन्नाथ मंदिर (पुरी, ओडिशा)',
    description: 'भारत के मुख्य चार धामों में पूर्वी धाम। कलियुग के साक्षात दारुब्रह्म भगवान जगन्नाथ, उनके बड़े भाई बलभद्र और बहन सुभद्रा का परम पावन धाम। विश्व प्रसिद्ध रथयात्रा का केंद्र।',
    history: '12वीं सदी में कलिंग नरेश अनंतवर्मन चोडगंग देव द्वारा निर्मित। मंदिर का 65 मीटर ऊंचा विमान कलिंग वास्तुकला का अनुपम उदाहरण है।',
    significance: 'महाप्रसाद (अन्नब्रह्म) का धाम जहां 56 भोग मिट्टी की 7 हांडियों में लकड़ी के चूल्हे पर पकता है। मंदिर के शिखर पर लहराता नीलचक्र और ध्वज हवा के विपरीत दिशा में लहराता है।',
    templeType: 'Char Dham',
    architecture: 'Kalinga Style Architecture',
    builtYear: '12वीं शताब्दी (1161 ई.)',
    photos: [
      'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=1200&auto=format&fit=crop&q=80'
    ],
    location: { address: 'Grand Road, Badadanda', city: 'Puri', state: 'Odisha', pincode: '752001', coordinates: { lat: 19.8049, lng: 85.8179 } },
    timing: { opening: '05:00 AM', closing: '11:00 PM' },
    deity: { main: 'भगवान जगन्नाथ, बलभद्र व सुभद्रा' },
    festivals: [{ name: 'विश्व प्रसिद्ध रथयात्रा', month: 'आषाढ़', description: 'तीनों भाई-बहनों का गुंडिचा मंदिर प्रस्थान' }],
    status: 'approved',
    averageRating: 5.0
  },
  {
    name: 'श्री द्वारकाधीश मंदिर (द्वारका, गुजरात)',
    description: 'मुख्य चार धामों में पश्चिमी धाम और सप्तपुरियों में शामिल। गोमती नदी के अरब सागर संगम पर स्थित जगत मंदिर। भगवान श्री कृष्ण की कर्मभूमि और राजधानी।',
    history: 'मूल मंदिर श्री कृष्ण के प्रपौत्र वज्रनाभ द्वारा निर्मित। 72 स्तंभों पर 5 मंजिला वर्तमान मंदिर चालुक्य शैली में 16वीं सदी में भव्य रूप में संवारा गया।',
    significance: 'मंदिर के 78 मीटर ऊंचे शिखर पर 52 गज की धर्मध्वजा फहराई जाती है। यहां दर्शन से बैकुंठ लोक की प्राप्ति मानी गई है।',
    templeType: 'Char Dham',
    architecture: 'Chalukya Style (जगत मंदिर)',
    photos: ['https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&auto=format&fit=crop&q=80'],
    location: { address: 'Dwarka Town, Gomti Creek', city: 'Dwarka', state: 'Gujarat', pincode: '361335', coordinates: { lat: 22.2376, lng: 68.9678 } },
    timing: { opening: '06:30 AM', closing: '09:30 PM' },
    deity: { main: 'द्वारकाधीश (राजाधिराज श्री कृष्ण)' },
    status: 'approved',
    averageRating: 4.9
  },

  // =========================================================================
  // 10. KAMAKHYA & FAMOUS SHAKTI PEETHAS (कामाख्या व शक्तिपीठ)
  // =========================================================================
  {
    name: 'माँ कामाख्या देवी मंदिर (गुवाहाटी, असम)',
    description: '51 शक्तिपीठों में सर्वोच्च "महापीठ"। नीलाचल पहाड़ी पर स्थित जहां माता सती की योनि (योनि मुद्रा) गिरी थी। यह तंत्र साधना का सबसे प्रमुख और जागृत केंद्र है।',
    history: '8वीं-9वीं सदी का प्राचीन इतिहास। 1565 में कोच राजा नरनारायण और चिलाराय द्वारा पुनर्निर्मित। मंदिर की अनोखी वास्तुकला को "नीलाचल शैली" कहा जाता है।',
    significance: 'वार्षिक "अंबुवाची मेला" के दौरान ब्रह्मपुत्र नदी का जल 3 दिनों के लिए लाल हो जाता है, जब माता का वार्षिक रजस्वला पर्व मनाया जाता है। यहां कोई मूर्ति नहीं बल्कि प्राकृतिक शिला रूपी योनि से जल धारा बहती है।',
    templeType: 'Shakti Peeth',
    architecture: 'Nilachal Style (गुंबददार असमिया वास्तुकला)',
    builtYear: '1565 ई. (वर्तमान स्वरूप)',
    languages: ['Assamese', 'Hindi', 'Bengali', 'Sanskrit'],
    photos: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&auto=format&fit=crop&q=80'
    ],
    location: {
      address: 'Nilachal Hills, Kamakhya',
      city: 'Guwahati',
      state: 'Assam',
      pincode: '781010',
      coordinates: { lat: 26.1663, lng: 91.7058 }
    },
    timing: {
      opening: '05:30 AM',
      closing: '08:00 PM',
      aarti: [
        { name: 'मंगला आरती', time: '05:30 AM' },
        { name: 'संध्या आरती', time: '07:30 PM' }
      ]
    },
    deity: { main: 'माँ कामाख्या देवी' },
    festivals: [
      { name: 'अंबुवाची मेला', month: 'आषाढ़ (जून)', description: 'लाखों तांत्रिकों, साधुओं और भक्तों का महाकुंभ' },
      { name: 'दुर्गा पूजा', month: 'आश्विन', description: 'विशेष शक्ति अनुष्ठान' }
    ],
    facilities: { parking: true, prasad: true, restrooms: true, drinkingWater: true },
    visitInfo: { bestTimeToVisit: 'अक्टूबर से मार्च, अंबुवाची मेला', entryFee: 'सामान्य निःशुल्क, वीआईपी पास उपलब्ध' },
    status: 'approved',
    averageRating: 5.0
  },
  {
    name: 'श्री माता वैष्णो देवी मंदिर (कटरा, जम्मू-कश्मीर)',
    description: 'त्रिकूटा पर्वत पर 5200 फीट की ऊंचाई पर स्थित प्राकृतिक पवित्र गुफा। यहां माता महाकाली, महालक्ष्मी और महासरस्वती तीन प्राकृतिक पिंडियों के रूप में विराजमान हैं।',
    history: 'त्रेतायुग से पूजित। श्रीधर ब्राह्मण की भक्ति और भैरवनाथ उद्धार की कथा से प्रसिद्ध। श्री माता वैष्णो देवी श्राइन बोर्ड द्वारा प्रबंधित।',
    significance: 'भारत का दूसरा सबसे अधिक दर्शनार्थियों वाला तीर्थ। "चलो बुलावा आया है, माता ने बुलाया है" की पुकार से वर्ष भर करोड़ों श्रद्धालु 14 किमी की चढ़ाई करते हैं।',
    templeType: 'Shakti Peeth',
    builtYear: 'अनादि काल',
    photos: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&auto=format&fit=crop&q=80'
    ],
    location: { address: 'Trikuta Mountains, Katra', city: 'Katra', state: 'Jammu and Kashmir', pincode: '182301', coordinates: { lat: 33.0308, lng: 74.9490 } },
    timing: { opening: '24 Hours (आरती समय 05:00 AM व 06:00 PM बंद)' },
    deity: { main: 'माता वैष्णो देवी (महाकाली, महालक्ष्मी, महासरस्वती पिंडियां)' },
    facilities: { parking: true, prasad: true, accommodation: true, wheelchairAccessible: true, restrooms: true, drinkingWater: true },
    status: 'approved',
    averageRating: 5.0
  },
  {
    name: 'कालीघाट काली मंदिर (कोलकाता, पश्चिम बंगाल)',
    description: 'कोलकाता में आदि गंगा नदी के किनारे स्थित 51 शक्तिपीठों में प्रमुख पीठ, जहां माता सती के दाहिने पैर की 4 अंगुलियां गिरी थीं।',
    history: '1809 में साबरना राय चौधरी परिवार द्वारा वर्तमान मंदिर बनवाया गया था।',
    significance: 'माता काली का तीन विशाल नेत्रों और सोने की लंबी जीभ वाला विकराल व करुणामयी स्वरूप पूजित है।',
    templeType: 'Shakti Peeth',
    architecture: 'Bengal Chala Temple Style',
    builtYear: '1809 ई.',
    photos: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&auto=format&fit=crop&q=80'],
    location: { address: 'Kalighat Road, South Kolkata', city: 'Kolkata', state: 'West Bengal', pincode: '700026', coordinates: { lat: 22.5204, lng: 88.3426 } },
    timing: { opening: '05:00 AM', closing: '10:30 PM' },
    deity: { main: 'माँ काली' },
    status: 'approved',
    averageRating: 4.8
  },
  {
    name: 'मीनाक्षी अम्मन मंदिर (मदुरै, तमिलनाडु)',
    description: 'वैगई नदी के तट पर स्थित 2500 वर्ष प्राचीन महामंदिर। माता पार्वती के मीनाक्षी (मत्स्य नयनी) स्वरूप और भगवान शिव (सुंदरेश्वर) का परम धाम। इसके 14 विशाल बहुरंगी गोपुरम विश्व विख्यात हैं।',
    history: 'पांड्य राजा कुलशेखर द्वारा मूल निर्माण। 16वीं-17वीं सदी में नायक राजा तिरुमलै नायक द्वारा वर्तमान भव्य स्वरूप दिया गया।',
    significance: 'प्राचीन वास्तुकला का विश्व आश्चर्य। 1000 स्तंभों का सभागार (Aayiram Kaal Mandapam) और गोपुरमों पर 33,000 से अधिक मूर्तियां उत्कीर्ण हैं।',
    templeType: 'Other',
    architecture: 'Dravidian Classical Architecture (भव्य 14 गोपुरम)',
    builtYear: '1623-1655 ई.',
    photos: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&auto=format&fit=crop&q=80'
    ],
    location: { address: 'Madurai Main, South Chithirai Street', city: 'Madurai', state: 'Tamil Nadu', pincode: '625001', coordinates: { lat: 9.9195, lng: 78.1193 } },
    timing: { opening: '05:00 AM', closing: '10:00 PM' },
    deity: { main: 'माता मीनाक्षी व सुंदरेश्वर (शिव)' },
    status: 'approved',
    averageRating: 5.0
  },

  // =========================================================================
  // 11. GRAND ICONIC PILGRIMAGES OF INDIA (भारत के अन्य महातीर्थ)
  // =========================================================================
  {
    name: 'तिरुपति बालाजी (श्री वेंकटेश्वर स्वामी मंदिर - तिरुमाला)',
    description: 'आंध्र प्रदेश के शेषाचलम की सात पहाड़ियों (सप्तगिरि) पर स्थित कलियुग प्रत्यक्ष देव भगवान वेंकटेश्वर (बालाजी) का परम धाम। यह विश्व का सबसे अधिक दर्शनार्थियों वाला और सबसे समृद्ध मंदिर है।',
    history: 'पल्लव, चोल और विजयनगर राजाओं (विशेषकर राजा कृष्णदेवराय) द्वारा संरक्षित व संवर्धित। मंदिर का स्वर्ण शिखर (आनंद निलयम) दिव्य आभा बिखेरता है।',
    significance: 'कलियुग में मोक्ष और सर्व सुख प्रदाता। यहां का "तिरुमाला तिरुपति लड्डू प्रसादम" जीआई टैग प्राप्त है और अत्यंत पवित्र माना जाता है।',
    templeType: 'Divya Desam',
    architecture: 'Dravidian Masterpiece',
    builtYear: '300 ई. से निरंतर पूजित',
    photos: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&auto=format&fit=crop&q=80'
    ],
    location: {
      address: 'Tirumala Hills, Chittoor District',
      city: 'Tirupati',
      state: 'Andhra Pradesh',
      pincode: '517504',
      coordinates: { lat: 13.6833, lng: 79.3472 }
    },
    timing: { opening: '02:30 AM', closing: '01:30 AM (Next Day)' },
    deity: { main: 'भगवान वेंकटेश्वर स्वामी (श्रीनिवास / बालाजी)' },
    facilities: { parking: true, prasad: true, accommodation: true, wheelchairAccessible: true, restrooms: true, drinkingWater: true },
    visitInfo: { bestTimeToVisit: 'वर्ष भर (ऑनलाइन स्लॉट बुकिंग अनुशंसित)' },
    status: 'approved',
    averageRating: 5.0
  },
  {
    name: 'श्री सिद्धिविनायक मंदिर (प्रभादेवी, मुंबई)',
    description: 'मुंबई का सर्वाधिक प्रतिष्ठित और लोकप्रिय गणेश मंदिर। यहां भगवान गणेश की सूंड दाईं ओर मुड़ी हुई है, जो अत्यंत जागृत और सिद्धिदायक मानी जाती है।',
    history: '1801 में लक्ष्मण विथु और देउबाई पाटिल द्वारा निर्मित। आज यह भारत के सबसे प्रतिष्ठित देवस्थानों में शामिल है।',
    significance: 'व्यापारियों, राजनेताओं, फिल्म हस्तियों और आम जनमानस की हर मन्नत पूरी करने वाले सिद्धिविनायक। मंदिर का गर्भगृह स्वर्ण मंडित है।',
    templeType: 'Other',
    builtYear: '1801 ई.',
    photos: ['https://images.unsplash.com/photo-1567591414240-e175cf643f5f?w=1200&auto=format&fit=crop&q=80'],
    location: { address: 'SK Bole Marg, Prabhadevi', city: 'Mumbai', state: 'Maharashtra', pincode: '400028', coordinates: { lat: 19.0169, lng: 72.8304 } },
    timing: { opening: '05:30 AM', closing: '10:00 PM' },
    deity: { main: 'श्री सिद्धिविनायक गणपति' },
    status: 'approved',
    averageRating: 4.9
  },
  {
    name: 'श्री खाटू श्याम जी मंदिर (सीकर, राजस्थान)',
    description: 'कलियुग के अवतारी "हारे का सहारा, बाबा श्याम हमारा"। महाभारत कालीन बर्बरीक का शीश दान स्थल। भगवान श्री कृष्ण ने अपने नाम "श्याम" से पूजित होने का वरदान दिया था।',
    history: 'राजा रूपसिंह चौहान की पत्नी को स्वप्न में खाटू कुंड में शीश होने का पता चला, जिसके बाद 1027 ई. में मंदिर का निर्माण हुआ। 1720 में दीवान अभयसिंह ने वर्तमान मंदिर बनवाया।',
    significance: 'फाल्गुन मास का लक्खी मेला विश्व विख्यात है। भक्त "श्याम धणी" के दर्शन कर अपनी बिगड़ी बनाने आते हैं।',
    templeType: 'Other',
    builtYear: '1027 ई. (वर्तमान 1720 ई.)',
    photos: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&auto=format&fit=crop&q=80'
    ],
    location: { address: 'Khatu Village, Ringas Road', city: 'Sikar', state: 'Rajasthan', pincode: '332602', coordinates: { lat: 27.3621, lng: 75.3056 } },
    timing: { opening: '04:30 AM', closing: '10:00 PM' },
    deity: { main: 'श्री खाटू श्याम जी (बर्बरीक - कृष्ण स्वरूप)' },
    festivals: [{ name: 'फाल्गुन लक्खी मेला', month: 'फाल्गुन (होली पूर्व)', description: 'लाखों श्याम भक्तों का पदयात्रा मेला व निशान यात्रा' }],
    status: 'approved',
    averageRating: 5.0
  },
  {
    name: 'श्री सालासर बालाजी मंदिर (चूरू, राजस्थान)',
    description: 'राजस्थान के चूरू जिले में स्थित दाढ़ी-मूंछ वाले हनुमान जी का एकमात्र सिद्ध पीठ। मोहनदास जी महाराज की भक्ति से खेत में प्रकट हुई स्वयंभू प्रतिमा।',
    history: '1754 ई. में असोटा गांव में एक किसान के हल से यह मूर्ति प्रकट हुई थी, जिसे सालासर में संत मोहनदास जी ने स्थापित करवाया था।',
    significance: 'मनोकामना सिद्धि के लिए यहां नारियल बांधने और सवामणी (50 किलो चूरमा/लड्डू) भोग लगाने की पावन परंपरा है।',
    templeType: 'Other',
    builtYear: '1754 ई.',
    photos: ['https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?w=1200&auto=format&fit=crop&q=80'],
    location: { address: 'Salasar Town, Sujangarh Tehsil', city: 'Churu', state: 'Rajasthan', pincode: '331506', coordinates: { lat: 27.7226, lng: 74.7077 } },
    timing: { opening: '05:00 AM', closing: '10:00 PM' },
    deity: { main: 'श्री सालासर बालाजी (दाढ़ी-मूंछ वाले हनुमान)' },
    status: 'approved',
    averageRating: 4.9
  },
  {
    name: 'श्री मेहंदीपुर बालाजी मंदिर (दौसा, राजस्थान)',
    description: 'राजस्थान के दौसा जिले में स्थित संकटमोचन हनुमान जी का अत्यंत जाग्रत धाम। भूत-पिशाच बाधा, प्रेत पीड़ा और मानसिक कष्टों से मुक्ति का विश्व प्रसिद्ध सिद्ध पीठ।',
    history: 'लगभग 1000 वर्ष प्राचीन। अरावली की दो पहाड़ियों के बीच श्री बालाजी, श्री प्रेतराज सरकार और श्री भैरव जी की त्रिमूर्ति स्थापित है।',
    significance: 'दुष्ट आत्माओं और ऊपरी बाधाओं से पीड़ित लोगों को यहां तुरंत आरोग्य और शांति मिलती है। यहां का अर्जी और दरखास्त नियम अत्यंत प्रभावशाली है।',
    templeType: 'Other',
    builtYear: '11वीं शताब्दी',
    photos: ['https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?w=1200&auto=format&fit=crop&q=80'],
    location: { address: 'Mehandipur, Todabhim', city: 'Dausa', state: 'Rajasthan', pincode: '321610', coordinates: { lat: 26.9942, lng: 76.7644 } },
    timing: { opening: '05:30 AM', closing: '09:00 PM' },
    deity: { main: 'श्री मेहंदीपुर बालाजी', others: ['श्री प्रेतराज सरकार', 'श्री कोतवाल भैरव जी'] },
    status: 'approved',
    averageRating: 4.9
  },
  {
    name: 'श्री पद्मनाभस्वामी मंदिर (तिरुवनंतपुरम, केरल)',
    description: 'केरल की राजधानी में स्थित भगवान विष्णु का अनंत शयन मुद्रा (अनंतशयनम) में भव्य मंदिर। 18 फीट लंबी विशाल प्रतिमा तीन दरवाजों से दिखाई देती है। यह विश्व का सबसे धनी मंदिर माना जाता है।',
    history: '8वीं सदी के संगम साहित्य में वर्णित। त्रावणकोर के महाराजा मार्तंड वर्मा ने 1750 में अपना संपूर्ण राज्य भगवान पद्मनाभ को समर्पित कर स्वयं को "पद्मनाभ दास" घोषित किया था।',
    significance: '108 दिव्य देशम में से एक। मंदिर के छह गुप्त तहखानों (Vaults) का रहस्य और अकूत स्वर्ण-रत्न संपदा विश्व प्रसिद्ध है।',
    templeType: 'Divya Desam',
    architecture: 'Chera & Dravidian Blend Architecture',
    photos: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&auto=format&fit=crop&q=80'],
    location: { address: 'West Nada, Fort', city: 'Thiruvananthapuram', state: 'Kerala', pincode: '695023', coordinates: { lat: 8.4831, lng: 76.9436 } },
    timing: { opening: '03:15 AM', closing: '07:20 PM' },
    deity: { main: 'भगवान पद्मनाभ (अनंतशायी विष्णु)' },
    visitInfo: { dressCode: 'कड़ा ड्रेस कोड: पुरुष - मुंडू (धोती) बिना कमीज, महिला - साड़ी/मुंडुम नेरियाथुम' },
    status: 'approved',
    averageRating: 4.9
  },
  {
    name: 'श्री अक्षरधाम मंदिर (नई दिल्ली)',
    description: 'यमुना नदी के तट पर स्थित स्वामीनारायण संप्रदाय का विशालकाय आध्यात्मिक परिसर। भारतीय सनातन संस्कृति, स्थापत्य कला और वैदिक जीवन मूल्यों का अद्वितीय संगम।',
    history: 'प्रमुख स्वामी महाराज के मार्गदर्शन में 7000 कारीगरों द्वारा 5 वर्षों में निर्मित होकर 2005 में लोकार्पित हुआ।',
    significance: 'गिनीज वर्ल्ड रिकॉर्ड्स द्वारा प्रमाणित विश्व का सबसे विशाल हिंदू मंदिर परिसर। गुलाबी बलुआ पत्थर और सफेद संगमरमर से बिना किसी लोहे के उपयोग के निर्मित।',
    templeType: 'Other',
    architecture: 'Classical Hindu Vastu Shastra Architecture',
    builtYear: '2005',
    photos: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&auto=format&fit=crop&q=80'
    ],
    location: { address: 'NH 24, Pramukh Swami Maharaj Marg', city: 'New Delhi', state: 'Delhi', pincode: '110092', coordinates: { lat: 28.6127, lng: 77.2773 } },
    timing: { opening: '09:30 AM', closing: '08:00 PM (सोमवार बंद)' },
    deity: { main: 'भगवान स्वामीनारायण', others: ['श्री राधा-कृष्ण', 'श्री सीता-राम', 'शिव-पार्वती'] },
    facilities: { parking: true, prasad: true, wheelchairAccessible: true, restrooms: true, drinkingWater: true, cloakroom: true },
    visitInfo: { entryFee: 'परिसर प्रवेश निःशुल्क, प्रदर्शनी व वाटर शो सशुल्क' },
    status: 'approved',
    averageRating: 4.9
  }
];

async function seedMandirs() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(DB);
    console.log('✅ Connected to MongoDB successfully!');

    console.log(`\n📦 Processing ${mandirsData.length} sacred Mandirs...`);

    let createdCount = 0;
    let updatedCount = 0;

    for (const m of mandirsData) {
      const res = await Mandir.findOneAndUpdate(
        { name: m.name, 'location.city': m.location.city },
        { $set: m },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      if (res.isNew) {
        createdCount++;
      } else {
        updatedCount++;
      }
      console.log(`  ✓ [${m.location.city}] ${m.name} (${m.templeType})`);
    }

    const totalCount = await Mandir.countDocuments();
    console.log(`\n🎉 SEEDING COMPLETE!`);
    console.log(`   - Seeded in this run: ${mandirsData.length}`);
    console.log(`   - Total Mandirs now in Database: ${totalCount}`);

    console.log('\n📊 Summary by City / Category:');
    const cities = await Mandir.distinct('location.city');
    console.log(`   Cities covered (${cities.length}): ${cities.join(', ')}`);

    const types = await Mandir.aggregate([
      { $group: { _id: '$templeType', count: { $sum: 1 } } }
    ]);
    types.forEach(t => console.log(`   - ${t._id || 'Other'}: ${t.count} mandirs`));

    await mongoose.disconnect();
    console.log('\n👋 Disconnected from database.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
// Auto-seed execution disabled to prevent accidental data overwrites
// To run manually: node -e "require('./seedMandirs')()"
// seedMandirs();

module.exports = seedMandirs;
