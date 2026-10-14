const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Mandir = require('../models/Mandir');

const EXTRA_BHOJPUR_TEMPLES = [
  {
    name: 'भोजपुर जैन मंदिर (शांतिनाथ जी दिगंबर मंदिर)',
    description: 'भोजेश्वर शिव मंदिर के ठीक सामने उसी पहाड़ी पर स्थित ऐतिहासिक भोजपुर जैन मंदिर में भगवान शांतिनाथ की 20 फीट ऊंची विशाल एक ही पाषाण से निर्मित दिगंबर प्रतिमा विराजमान है।',
    history: 'इस मंदिर का निर्माण 11वीं सदी में परमार राजा भोज के शासनकाल में हुआ था। प्रतिमा की चौकी पर राजा भोज के काल का प्राचीन अभिलेख उत्कीर्ण है।',
    significance: 'यहाँ भगवान शांतिनाथ के साथ-साथ पार्श्वनाथ और सुपार्श्वनाथ की प्राचीन पाषाण प्रतिमाएं भी स्थापित हैं। यह पुरातत्व और जैन धर्म का अत्यंत पावन स्थल है।',
    templeType: 'Other',
    architecture: 'Paramara Era Stone Architecture',
    builtYear: '11th Century CE',
    location: {
      address: 'भोजेश्वर मंदिर के पास, भोजपुर',
      city: 'Bhojpur',
      state: 'Madhya Pradesh',
      pincode: '464993',
      coordinates: { lat: 23.0980, lng: 77.5790 }
    },
    timing: {
      opening: '06:00 AM',
      closing: '06:30 PM',
      aarti: []
    },
    deity: { main: 'भगवान शांतिनाथ (20 फीट विशाल पाषाण प्रतिमा)', others: ['भगवान पार्श्वनाथ', 'भगवान सुपार्श्वनाथ'] },
    facilities: { parking: true, drinkingWater: true },
    visitInfo: { bestTimeToVisit: 'वर्षभर', entryFee: 'निःशुल्क' },
    photos: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/45/Shantinath_Digambar_Jain_Temple.JPG/1280px-Shantinath_Digambar_Jain_Temple.JPG'
    ],
    photoAttributions: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/45/Shantinath_Digambar_Jain_Temple.JPG/1280px-Shantinath_Digambar_Jain_Temple.JPG',
        title: 'भोजपुर शांतिनाथ दिगंबर जैन मंदिर',
        author: 'Wikimedia Commons Contributor',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Shantinath_Digambar_Jain_Temple.JPG',
        license: 'CC BY-SA 3.0'
      }
    ],
    source: 'curated',
    verificationStatus: 'verified',
    timingsVerified: false,
    status: 'approved'
  },
  {
    name: 'पार्वती गुफा मंदिर (बेतवा नदी तट, भोजपुर)',
    description: 'भोजपुर शिव मंदिर के ठीक नीचे बेतwa नदी की घाटी में स्थित पार्वती गुफा एक प्राकृतिक पाषाण गुफा है जिसमें 11वीं सदी की पुरातात्विक मूर्तियां विद्यमान हैं।',
    history: 'परमार काल में साधु-संतों की साधना स्थली रही इस गुफा में माता पार्वती और शिवलिंग स्थापित हैं।',
    significance: 'भोजेश्वर महादेव के दर्शन के उपरांत श्रद्धालु बेतवा नदी के पवित्र तट और इस गुफा के दर्शन करने पहुँचते हैं।',
    templeType: 'Other',
    location: {
      address: 'बेतवा नदी तट, भोजपुर',
      city: 'Bhojpur',
      state: 'Madhya Pradesh',
      pincode: '464993',
      coordinates: { lat: 23.0990, lng: 77.5815 }
    },
    timing: {
      opening: '06:30 AM',
      closing: '06:00 PM',
      aarti: []
    },
    deity: { main: 'माता पार्वती एवं प्राचीन शिवलिंग', others: ['नंदी जी'] },
    facilities: { drinkingWater: true },
    visitInfo: { bestTimeToVisit: 'सूर्योदय से सूर्यास्त', entryFee: 'निःशुल्क' },
    photos: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fe/Parvati_cave_WIKI.jpg/1280px-Parvati_cave_WIKI.jpg'
    ],
    photoAttributions: [
      {
        url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fe/Parvati_cave_WIKI.jpg/1280px-Parvati_cave_WIKI.jpg',
        title: 'पार्वती गुफा मंदिर बेतवा नदी तट भोजपुर',
        author: 'Wikimedia Commons Contributor',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Parvati_cave_WIKI.jpg',
        license: 'CC BY-SA 4.0'
      }
    ],
    source: 'curated',
    verificationStatus: 'verified',
    timingsVerified: false,
    status: 'approved'
  }
];

async function addBhojpurTemples() {
  await mongoose.connect(process.env.DB_CONNECTION_STRING);
  for (const t of EXTRA_BHOJPUR_TEMPLES) {
    await Mandir.findOneAndUpdate(
      { name: t.name, 'location.city': 'Bhojpur' },
      { $set: t },
      { upsert: true, new: true }
    );
    console.log(`✓ Added: ${t.name}`);
  }
  const count = await Mandir.countDocuments({ 'location.city': 'Bhojpur' });
  console.log(`Total temples in Bhojpur now: ${count}`);
  await mongoose.disconnect();
}

// Auto-seed execution disabled to prevent accidental data overwrites
// addBhojpurTemples();

module.exports = addBhojpurTemples;
