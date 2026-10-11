const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Mandir = require('../models/Mandir');

// Map of exact verified 200 OK image URLs
const VERIFIED_IMAGE_MAP = {
  'बिरला मंदिर (श्री लक्ष्मी नारायण मंदिर)': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0d/Birla_Mandir_Bhopal_Side_view.jpg/330px-Birla_Mandir_Bhopal_Side_view.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'भोजेश्वर महादेव मंदिर (भोजपुर शिव मंदिर)': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d7/Shiva_Temple%2C_Bhojpur_01.jpg/330px-Shiva_Temple%2C_Bhojpur_01.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'खजराना गणेश मंदिर (इंदौर)': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ab/Khajrana_Ganesh_Temple.jpg/330px-Khajrana_Ganesh_Temple.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'श्री महाकालेश्वर ज्योतिर्लिंग (उज्जैन)': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/75/Mahakaleshwar_Temple%2C_Ujjain.jpg/330px-Mahakaleshwar_Temple%2C_Ujjain.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'श्री सोमनाथ ज्योतिर्लिंग (गुजरात)': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/10/Somanath_mandir_%28cropped%29.jpg/330px-Somanath_mandir_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'श्री मल्लिकार्जुन ज्योतिर्लिंग (श्रीशैलम, आंध्र प्रदेश)': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b0/Srisailam-temple-entrance.jpg/330px-Srisailam-temple-entrance.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'श्री ओंकारेश्वर ज्योतिर्लिंग (मध्य प्रदेश)': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/01/Omkareswar_Jyotirlinga.jpg/330px-Omkareswar_Jyotirlinga.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'श्री केदारनाथ ज्योतिर्लिंग (उत्तराखंड)': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/56/Kedarnath_Temple_in_Rainy_season.jpg/330px-Kedarnath_Temple_in_Rainy_season.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'श्री काशी विश्वनाथ ज्योतिर्लिंग (वाराणसी)': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/ff/Kashi_Vishwanath.jpg/330px-Kashi_Vishwanath.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'श्री भीमाशंकर ज्योतिर्लिंग (महाराष्ट्र)': 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Bhimashankar.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled',
  'श्री त्र्यंबकेश्वर ज्योतिर्लिंग (नासिक, महाराष्ट्र)': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/12/Trimbakeshwar_Temple-Nashik-Maharashtra-1.jpg/330px-Trimbakeshwar_Temple-Nashik-Maharashtra-1.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'श्री बैद्यनाथ धाम (देवघर, झारखंड)': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3f/Baidyanath_temple_and_temple_complex%2C_Deoghar_04.jpg/330px-Baidyanath_temple_and_temple_complex%2C_Deoghar_04.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'श्री नागेश्वर ज्योतिर्लिंग (द्वारका, गुजरात)': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/22/Nageshwar.JPG/330px-Nageshwar.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'श्री रामनाथस्वामी ज्योतिर्लिंग (रामेश्वरम, तमिलनाडु)': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/84/Ramanathaswamy_temple7.JPG/330px-Ramanathaswamy_temple7.JPG?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'श्री घृष्णेश्वर ज्योतिर्लिंग (वेरुल / एलोरा, महाराष्ट्र)': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ad/Grishneshwar_temple_in_Aurangabad_district.jpg/330px-Grishneshwar_temple_in_Aurangabad_district.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'श्री राम जन्मभूमि मंदिर (अयोध्या धाम)': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/de/Shri_Ram_Janambhoomi_Mandir%2C_Ayodhya_Dham.jpg/330px-Shri_Ram_Janambhoomi_Mandir%2C_Ayodhya_Dham.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'श्री बद्रीनाथ धाम (उत्तराखंड)': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f9/Badrinath_Temple_%2C_Uttarakhand.jpg/330px-Badrinath_Temple_%2C_Uttarakhand.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'श्री जगन्नाथ मंदिर (पुरी, ओडिशा)': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b7/Shri_Jagannath_temple.jpg/330px-Shri_Jagannath_temple.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'श्री द्वारकाधीश मंदिर (द्वारका, गुजरात)': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0c/Dwarakadheesh_Temple%2C_2014.jpg/330px-Dwarakadheesh_Temple%2C_2014.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'माँ कामाख्या देवी मंदिर (गुवाहाटी, असम)': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/48/Kamakhya_Temple_-_DEV_8829.jpg/330px-Kamakhya_Temple_-_DEV_8829.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'श्री बांके बिहारी मंदिर (वृंदावन)': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e3/Banke_Bihari_Vrindavan.jpg/330px-Banke_Bihari_Vrindavan.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'तिरुपति बालाजी (श्री वेंकटेश्वर स्वामी मंदिर - तिरुमाला)': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/Tirumala_090615.jpg/330px-Tirumala_090615.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail'
};

async function applyAndVerify() {
  await mongoose.connect(process.env.DB_CONNECTION_STRING);
  console.log('Connected to MongoDB. Updating mandir photos in DB...\n');

  for (const [name, url] of Object.entries(VERIFIED_IMAGE_MAP)) {
    await Mandir.updateOne(
      { name },
      { $set: { photos: [url] } }
    );
  }

  // Set photos: [] for any temple not in VERIFIED_IMAGE_MAP (so it uses placeholder)
  const names = Object.keys(VERIFIED_IMAGE_MAP);
  await Mandir.updateMany(
    { name: { $nin: names } },
    { $set: { photos: [] } }
  );

  console.log('Now testing all temples in DB with live HTTP fetch...\n');
  const all = await Mandir.find({}, { name: 1, photos: 1, 'location.city': 1 });

  let ok = 0;
  let placeholder = 0;
  let fail = 0;

  for (const m of all) {
    if (!m.photos || m.photos.length === 0) {
      console.log(`🛕 [SACRED PLACEHOLDER] ${m.name} (${m.location?.city})`);
      placeholder++;
      continue;
    }

    const u = m.photos[0];
    try {
      const res = await fetch(u, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        signal: AbortSignal.timeout(6000)
      });
      const ct = res.headers.get('content-type');
      if (res.status === 200 && ct?.startsWith('image/')) {
        console.log(`✅ [200 OK] ${m.name} (${ct})`);
        ok++;
      } else {
        console.log(`❌ [FAIL ${res.status}] ${m.name} (${ct})`);
        fail++;
      }
    } catch (e) {
      console.log(`❌ [ERR] ${m.name}: ${e.message}`);
      fail++;
    }
  }

  console.log(`\n===========================================`);
  console.log(`Final Database Images Status:`);
  console.log(`  ✅ Live Verified Photos (200 OK): ${ok}`);
  console.log(`  🛕 Dedicated Sacred Placeholders: ${placeholder}`);
  console.log(`  ❌ Failed / Broken Photos: ${fail}`);
  console.log(`===========================================\n`);

  await mongoose.disconnect();
}

applyAndVerify();
