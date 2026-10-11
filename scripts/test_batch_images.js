const VERIFIED_URLS = [
  { name: 'बिरला मंदिर भोपाल', url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0d/Birla_Mandir_Bhopal_Side_view.jpg/640px-Birla_Mandir_Bhopal_Side_view.jpg?utm_source=en.wikipedia.org' },
  { name: 'भोजेश्वर महादेव मंदिर', url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d7/Shiva_Temple%2C_Bhojpur_01.jpg/640px-Shiva_Temple%2C_Bhojpur_01.jpg?utm_source=en.wikipedia.org' },
  { name: 'खजराना गणेश मंदिर', url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ab/Khajrana_Ganesh_Temple.jpg/640px-Khajrana_Ganesh_Temple.jpg?utm_source=en.wikipedia.org' },
  { name: 'श्री महाकालेश्वर ज्योतिर्लिंग', url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/63/Mahakaleshwar_Temple_Ujjain.jpg/640px-Mahakaleshwar_Temple_Ujjain.jpg?utm_source=en.wikipedia.org' },
  { name: 'श्री सोमनाथ ज्योतिर्लिंग', url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/10/Somanath_mandir_%28cropped%29.jpg/640px-Somanath_mandir_%28cropped%29.jpg?utm_source=en.wikipedia.org' },
  { name: 'श्री मल्लिकार्जुन ज्योतिर्लिंग', url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d4/Srisailam_Temple_Gopuram.jpg/640px-Srisailam_Temple_Gopuram.jpg?utm_source=en.wikipedia.org' },
  { name: 'श्री ओंकारेश्वर ज्योतिर्लिंग', url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c2/Omkareshwar_Temple_Narmada_view.jpg/640px-Omkareshwar_Temple_Narmada_view.jpg?utm_source=en.wikipedia.org' },
  { name: 'श्री केदारनाथ ज्योतिर्लिंग', url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/69/Kedarnath_Temple_Uttarakhand.jpg/640px-Kedarnath_Temple_Uttarakhand.jpg?utm_source=en.wikipedia.org' },
  { name: 'श्री काशी विश्वनाथ ज्योतिर्लिंग', url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/04/Kashi_Vishwanath_Temple_Varanasi.jpg/640px-Kashi_Vishwanath_Temple_Varanasi.jpg?utm_source=en.wikipedia.org' },
  { name: 'श्री भीमाशंकर ज्योतिर्लिंग', url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1a/Bhimashankar_Temple_exterior.jpg/640px-Bhimashankar_Temple_exterior.jpg?utm_source=en.wikipedia.org' },
  { name: 'श्री त्र्यंबकेश्वर ज्योतिर्लिंग', url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/77/Trimbakeshwar_Temple_Nashik.jpg/640px-Trimbakeshwar_Temple_Nashik.jpg?utm_source=en.wikipedia.org' },
  { name: 'श्री बैद्यनाथ धाम', url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/36/Baidyanath_Temple_Deoghar.jpg/640px-Baidyanath_Temple_Deoghar.jpg?utm_source=en.wikipedia.org' },
  { name: 'श्री नागेश्वर ज्योतिर्लिंग', url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a2/Nageshwar_Jyotirlinga_Temple.jpg/640px-Nageshwar_Jyotirlinga_Temple.jpg?utm_source=en.wikipedia.org' },
  { name: 'श्री रामनाथस्वामी ज्योतिर्लिंग', url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d6/Ramanathaswamy_Temple_Corridor.jpg/640px-Ramanathaswamy_Temple_Corridor.jpg?utm_source=en.wikipedia.org' },
  { name: 'श्री घृष्णेश्वर ज्योतिर्लिंग', url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6f/Grishneshwar_temple_shikhara.jpg/640px-Grishneshwar_temple_shikhara.jpg?utm_source=en.wikipedia.org' },
  { name: 'श्री राम जन्मभूमि मंदिर', url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c5/Ram_Mandir_Ayodhya_January_2024.jpg/640px-Ram_Mandir_Ayodhya_January_2024.jpg?utm_source=en.wikipedia.org' },
  { name: 'श्री बद्रीनाथ धाम', url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a2/Badrinath_Temple_front_view.jpg/640px-Badrinath_Temple_front_view.jpg?utm_source=en.wikipedia.org' },
  { name: 'श्री जगन्नाथ मंदिर', url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c5/Puri_Jagannath_Temple.jpg/640px-Puri_Jagannath_Temple.jpg?utm_source=en.wikipedia.org' },
  { name: 'श्री द्वारकाधीश मंदिर', url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f6/Dwarkadhish_Temple_Gujarat.jpg/640px-Dwarkadhish_Temple_Gujarat.jpg?utm_source=en.wikipedia.org' },
  { name: 'माँ कामाख्या देवी मंदिर', url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Kamakhya_Temple_Guwahati.jpg/640px-Kamakhya_Temple_Guwahati.jpg?utm_source=en.wikipedia.org' },
  { name: 'श्री बांके बिहारी मंदिर', url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/75/Banke_Bihari_Temple_Vrindavan.jpg/640px-Banke_Bihari_Temple_Vrindavan.jpg?utm_source=en.wikipedia.org' },
  { name: 'तिरुपति बालाजी', url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/Tirumala_090615.jpg/640px-Tirumala_090615.jpg?utm_source=en.wikipedia.org' }
];

async function checkBatch() {
  console.log(`Checking ${VERIFIED_URLS.length} verified image URLs...`);
  let passed = 0;
  for (const item of VERIFIED_URLS) {
    try {
      const res = await fetch(item.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        signal: AbortSignal.timeout(6000)
      });
      const ct = res.headers.get('content-type');
      if (res.status === 200 && ct?.startsWith('image/')) {
        console.log(`✅ [200 OK] ${item.name} (${ct})`);
        passed++;
      } else {
        console.log(`❌ [FAIL ${res.status}] ${item.name} (${ct})`);
      }
    } catch (e) {
      console.log(`❌ [ERR] ${item.name}: ${e.message}`);
    }
  }
  console.log(`\nBatch result: ${passed} / ${VERIFIED_URLS.length} verified OK!`);
}

checkBatch();
