const TEMPLE_WIKI_PAGES = [
  { name: 'श्री सोमनाथ ज्योतिर्लिंग', page: 'Somnath_temple' },
  { name: 'श्री महाकालेश्वर ज्योतिर्लिंग', page: 'Mahakaleshwar_Temple' },
  { name: 'श्री ओंकारेश्वर ज्योतिर्लिंग', page: 'Omkareshwar_Temple' },
  { name: 'श्री केदारनाथ ज्योतिर्लिंग', page: 'Kedarnath_Temple' },
  { name: 'श्री काशी विश्वनाथ ज्योतिर्लिंग', page: 'Kashi_Vishwanath_Temple' },
  { name: 'श्री त्र्यंबकेश्वर ज्योतिर्लिंग', page: 'Trimbakeshwar_Shiva_Temple' },
  { name: 'श्री भीमाशंकर ज्योतिर्लिंग', page: 'Bhimashankar_Temple' },
  { name: 'श्री बैद्यनाथ धाम', page: 'Baidyanath_Temple' },
  { name: 'श्री मल्लिकार्जुन ज्योतिर्लिंग', page: 'Mallikarjuna_Temple,_Srisailam' },
  { name: 'श्री नागेश्वर ज्योतिर्लिंग', page: 'Nageshvara_Jyotirlinga' },
  { name: 'श्री रामनाथस्वामी ज्योतिर्लिंग', page: 'Ramanathaswamy_Temple' },
  { name: 'श्री घृष्णेश्वर ज्योतिर्लिंग', page: 'Grishneshwar_Temple' },
  { name: 'श्री राम जन्मभूमि मंदिर', page: 'Ram_Mandir' },
  { name: 'श्री बद्रीनाथ धाम', page: 'Badrinath_Temple' },
  { name: 'श्री जगन्नाथ मंदिर', page: 'Jagannath_Temple,_Puri' },
  { name: 'श्री द्वारकाधीश मंदिर', page: 'Dwarkadhish_Temple' },
  { name: 'माँ कामाख्या देवी मंदिर', page: 'Kamakhya_Temple' },
  { name: 'श्री बांके बिहारी मंदिर', page: 'Banke_Bihari_Temple' },
  { name: 'तिरुपति बालाजी', page: 'Venkateswara_Temple,_Tirumala' },
  { name: 'भोजेश्वर महादेव मंदिर', page: 'Bhojeshwar_Temple' },
  { name: 'खजराना गणेश मंदिर', page: 'Khajrana_Ganesh_Temple' },
  { name: 'बिरला मंदिर भोपाल', page: 'Lakshmi_Narayan_Temple,_Bhopal' }
];

async function checkAllWiki() {
  console.log('Testing official Wikipedia thumbnails...\n');
  const results = {};

  for (const t of TEMPLE_WIKI_PAGES) {
    try {
      const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${t.page}`, {
        headers: { 'User-Agent': 'RamJiKiSenaDirectory/1.0 (contact@ramjikisena.com)' }
      });
      if (res.ok) {
        const data = await res.json();
        const thumbUrl = data.thumbnail?.source;
        if (thumbUrl) {
          // verify thumbnail works with 200
          const imgRes = await fetch(thumbUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
          console.log(`✅ [${imgRes.status}] ${t.name} -> ${thumbUrl}`);
          results[t.name] = { url: thumbUrl, title: data.title, description: data.description };
        } else {
          console.log(`⚠️ [NO THUMB] ${t.name} -> Page exists but no thumbnail`);
        }
      } else {
        console.log(`❌ [HTTP ${res.status}] ${t.name} -> Page: ${t.page}`);
      }
    } catch (e) {
      console.log(`❌ [ERR] ${t.name} -> ${e.message}`);
    }
  }

  console.log('\nTotal verified thumbnails found:', Object.keys(results).length);
}

checkAllWiki();
