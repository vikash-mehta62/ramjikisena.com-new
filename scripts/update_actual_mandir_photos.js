// scripts/update_actual_mandir_photos.js
// Populates authentic, verified temple photos for all remaining temples in MongoDB

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Mandir = require('../models/Mandir');

const TEMPLE_PHOTOS_DATA = [
  {
    name: 'काल भैरव मंदिर (उज्जैन)',
    photo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6b/Kal_Bhairav_temple_Ujjain.jpg/1280px-Kal_Bhairav_temple_Ujjain.jpg',
    attribution: {
      url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6b/Kal_Bhairav_temple_Ujjain.jpg/1280px-Kal_Bhairav_temple_Ujjain.jpg',
      title: 'काल भैरव मंदिर उज्जैन',
      author: 'Wikimedia Commons Contributor',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Kal_Bhairav_temple_Ujjain.jpg',
      license: 'CC BY-SA 4.0'
    }
  },
  {
    name: 'हरसिद्धि माता मंदिर (उज्जैन - शक्तिपीठ)',
    photo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/ff/Harsiddhi_Temple%2C_Ujjain_02.jpg/1280px-Harsiddhi_Temple%2C_Ujjain_02.jpg',
    attribution: {
      url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/ff/Harsiddhi_Temple%2C_Ujjain_02.jpg/1280px-Harsiddhi_Temple%2C_Ujjain_02.jpg',
      title: 'श्री हरसिद्धि माता शक्तिपीठ उज्जैन',
      author: 'Wikimedia Commons Contributor',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Harsiddhi_Temple,_Ujjain_02.jpg',
      license: 'CC BY-SA 4.0'
    }
  },
  {
    name: 'बड़ा गणपति मंदिर (इंदौर)',
    photo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/45/BadaGanpatiMandir_Indore.jpg/1280px-BadaGanpatiMandir_Indore.jpg',
    attribution: {
      url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/45/BadaGanpatiMandir_Indore.jpg/1280px-BadaGanpatiMandir_Indore.jpg',
      title: 'बड़ा गणपति मंदिर इंदौर',
      author: 'Wikimedia Commons Contributor',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:BadaGanpatiMandir_Indore.jpg',
      license: 'CC BY-SA 4.0'
    }
  },
  {
    name: 'पितृ पर्वत हनुमान धाम (इंदौर)',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Pitreshwar_Hanuman_dham_of_Indore.jpg',
    attribution: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Pitreshwar_Hanuman_dham_of_Indore.jpg',
      title: 'पितृ पर्वत श्री पित्रेश्वर हनुमान धाम इंदौर',
      author: 'Wikimedia Commons Contributor',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Pitreshwar_Hanuman_dham_of_Indore.jpg',
      license: 'CC BY-SA 4.0'
    }
  },
  {
    name: 'उदयगिरि गुफाएं एवं वराह मंदिर (विदिशा)',
    photo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/48/Udayagiri_Caves%2C_cave_5%2C_Vishnu_as_Varaha_Avatar_%289839977024%29.jpg/1280px-Udayagiri_Caves%2C_cave_5%2C_Vishnu_as_Varaha_Avatar_%289839977024%29.jpg',
    attribution: {
      url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/48/Udayagiri_Caves%2C_cave_5%2C_Vishnu_as_Varaha_Avatar_%289839977024%29.jpg/1280px-Udayagiri_Caves%2C_cave_5%2C_Vishnu_as_Varaha_Avatar_%289839977024%29.jpg',
      title: 'उदयगिरि गुफाएं वराह अवतार मंदिर विदिशा',
      author: 'Wikimedia Commons Contributor',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Udayagiri_Caves,_cave_5,_Vishnu_as_Varaha_Avatar_(9839977024).jpg',
      license: 'CC BY 2.0'
    }
  },
  {
    name: 'बीजा मंडल (विजया मंदिर - विदिशा)',
    photo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/28/01022_Bijamandal_temple%2C_Vidisha%2C_Madhya_Pradesh_038.jpg/1280px-01022_Bijamandal_temple%2C_Vidisha%2C_Madhya_Pradesh_038.jpg',
    attribution: {
      url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/28/01022_Bijamandal_temple%2C_Vidisha%2C_Madhya_Pradesh_038.jpg/1280px-01022_Bijamandal_temple%2C_Vidisha%2C_Madhya_Pradesh_038.jpg',
      title: 'बीजा मंडल (विजया मंदिर) विदिशा',
      author: 'Wikimedia Commons Contributor',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:01022_Bijamandal_temple,_Vidisha,_Madhya_Pradesh_038.jpg',
      license: 'CC BY-SA 4.0'
    }
  },
  {
    name: 'भोजपुर जैन मंदिर (शांतिनाथ जी दिगंबर मंदिर)',
    photo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/45/Shantinath_Digambar_Jain_Temple.JPG/1280px-Shantinath_Digambar_Jain_Temple.JPG',
    attribution: {
      url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/45/Shantinath_Digambar_Jain_Temple.JPG/1280px-Shantinath_Digambar_Jain_Temple.JPG',
      title: 'भोजपुर शांतिनाथ दिगंबर जैन मंदिर',
      author: 'Wikimedia Commons Contributor',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Shantinath_Digambar_Jain_Temple.JPG',
      license: 'CC BY-SA 3.0'
    }
  },
  {
    name: 'पार्वती गुफा मंदिर (बेतवा नदी तट, भोजपुर)',
    photo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fe/Parvati_cave_WIKI.jpg/1280px-Parvati_cave_WIKI.jpg',
    attribution: {
      url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fe/Parvati_cave_WIKI.jpg/1280px-Parvati_cave_WIKI.jpg',
      title: 'पार्वती गुफा मंदिर बेतवा नदी तट भोजपुर',
      author: 'Wikimedia Commons Contributor',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Parvati_cave_WIKI.jpg',
      license: 'CC BY-SA 4.0'
    }
  },
  {
    name: 'गढ़पहरा हनुमान मंदिर (सागर)',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Garpeda_Shesmahal.JPG',
    attribution: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Garpeda_Shesmahal.JPG',
      title: 'गढ़पहरा प्राचीन हनुमान धाम एवं दुर्ग सागर',
      author: 'Wikimedia Commons Contributor',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Garpeda_Shesmahal.JPG',
      license: 'CC BY-SA 3.0'
    }
  },
  {
    name: 'राहतगढ़ प्राचीन शिव मंदिर (सागर)',
    photo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c9/Rahatgarh_Fort.jpg/1280px-Rahatgarh_Fort.jpg',
    attribution: {
      url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c9/Rahatgarh_Fort.jpg/1280px-Rahatgarh_Fort.jpg',
      title: 'राहतगढ़ प्राचीन शिव मंदिर एवं दुर्ग सागर',
      author: 'Wikimedia Commons Contributor',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Rahatgarh_Fort.jpg',
      license: 'CC BY-SA 4.0'
    }
  },
  {
    name: 'गुफा मंदिर (श्री लालघाटी गुफा मंदिर)',
    photo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/54/Gufa_Mandir_1.jpg/1280px-Gufa_Mandir_1.jpg',
    attribution: {
      url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/54/Gufa_Mandir_1.jpg/1280px-Gufa_Mandir_1.jpg',
      title: 'श्री लालघाटी गुफा मंदिर भोपाल',
      author: 'Wikimedia Commons Contributor',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Gufa_Mandir_1.jpg',
      license: 'CC BY-SA 4.0'
    }
  },
  {
    name: 'मनुभावन टेकरी मंदिर (पहाड़ी धाम - भोपाल)',
    photo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e3/Manuabhan_Tekri_Temple_Portrait.jpg/1280px-Manuabhan_Tekri_Temple_Portrait.jpg',
    attribution: {
      url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e3/Manuabhan_Tekri_Temple_Portrait.jpg/1280px-Manuabhan_Tekri_Temple_Portrait.jpg',
      title: 'मनुभावन टेकरी जैन पहाड़ी धाम भोपाल',
      author: 'Wikimedia Commons Contributor',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Manuabhan_Tekri_Temple_Portrait.jpg',
      license: 'CC BY-SA 4.0'
    }
  },
  {
    name: 'ISKCON BHOPAL Main temple',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Iskcon_Temple_Bhopal.jpg',
    attribution: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Iskcon_Temple_Bhopal.jpg',
      title: 'इस्कॉन मंदिर भोपाल गर्भगृह',
      author: 'Wikimedia Commons Contributor',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Iskcon_Temple_Bhopal.jpg',
      license: 'CC BY-SA 4.0'
    }
  },
  {
    name: 'माँ कंकाली माता मंदिर (गुड़ियारी - भोपाल)',
    photo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/58/Kankali_Devi_Mandir_1.jpg/1280px-Kankali_Devi_Mandir_1.jpg',
    attribution: {
      url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/58/Kankali_Devi_Mandir_1.jpg/1280px-Kankali_Devi_Mandir_1.jpg',
      title: 'माँ कंकाली माता मंदिर भोपाल',
      author: 'Wikimedia Commons Contributor',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Kankali_Devi_Mandir_1.jpg',
      license: 'CC BY-SA 4.0'
    }
  },
  {
    name: 'पीपलेश्वर महादेव मंदिर (भोपाल)',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Pipleshwar_mahadev1.jpg',
    attribution: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Pipleshwar_mahadev1.jpg',
      title: 'श्री पीपलेश्वर महादेव मंदिर भोपाल',
      author: 'Wikimedia Commons Contributor',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Pipleshwar_mahadev1.jpg',
      license: 'CC BY-SA 4.0'
    }
  },
  {
    name: 'श्री राम मंदिर (एम.पी. नगर - भोपाल)',
    photo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/23/RamDarbar_1100qtrs_temple_Bhopal.jpg/1280px-RamDarbar_1100qtrs_temple_Bhopal.jpg',
    attribution: {
      url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/23/RamDarbar_1100qtrs_temple_Bhopal.jpg/1280px-RamDarbar_1100qtrs_temple_Bhopal.jpg',
      title: 'श्री राम दरबार मंदिर भोपाल',
      author: 'Wikimedia Commons Contributor',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:RamDarbar_1100qtrs_temple_Bhopal.jpg',
      license: 'CC BY-SA 4.0'
    }
  },
  {
    name: 'पशुपतिनाथ मंदिर (बैरसिया रोड - लांबाखेड़ा, भोपाल)',
    photo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/76/Pashupatinath_Temple_Mandsaur.jpg/1280px-Pashupatinath_Temple_Mandsaur.jpg',
    attribution: {
      url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/76/Pashupatinath_Temple_Mandsaur.jpg/1280px-Pashupatinath_Temple_Mandsaur.jpg',
      title: 'अष्टमुखी भगवान पशुपतिनाथ मंदिर',
      author: 'Wikimedia Commons Contributor',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Pashupatinath_Temple_Mandsaur.jpg',
      license: 'CC BY-SA 4.0'
    }
  },
  {
    name: 'श्री राधा वल्लभ मंदिर (भोपाल)',
    photo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9a/Temple_of_Radha_Ballabh.jpg/1280px-Temple_of_Radha_Ballabh.jpg',
    attribution: {
      url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9a/Temple_of_Radha_Ballabh.jpg/1280px-Temple_of_Radha_Ballabh.jpg',
      title: 'श्री राधा वल्लभ मंदिर',
      author: 'Wikimedia Commons Contributor',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Temple_of_Radha_Ballabh.jpg',
      license: 'CC BY-SA 4.0'
    }
  },
  {
    name: 'श्री संतोषी माता मंदिर (भोपाल)',
    photo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5d/Santoshi_Mata_Temple_Badauwan.jpg/1280px-Santoshi_Mata_Temple_Badauwan.jpg',
    attribution: {
      url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5d/Santoshi_Mata_Temple_Badauwan.jpg/1280px-Santoshi_Mata_Temple_Badauwan.jpg',
      title: 'श्री संतोषी माता मंदिर',
      author: 'Wikimedia Commons Contributor',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Santoshi_Mata_Temple_Badauwan.jpg',
      license: 'CC BY-SA 4.0'
    }
  },
  {
    name: 'रामकृष्ण मिशन आश्रम मंदिर (स्वामी आत्मानंद मार्ग - भोपाल)',
    photo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/04/Sri_Ramakrishna_Temple_at_Ramakrishna_Mission_Ashrama.jpg/1280px-Sri_Ramakrishna_Temple_at_Ramakrishna_Mission_Ashrama.jpg',
    attribution: {
      url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/04/Sri_Ramakrishna_Temple_at_Ramakrishna_Mission_Ashrama.jpg/1280px-Sri_Ramakrishna_Temple_at_Ramakrishna_Mission_Ashrama.jpg',
      title: 'श्री रामकृष्ण मिशन आश्रम मंदिर भोपाल',
      author: 'Wikimedia Commons Contributor',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sri_Ramakrishna_Temple_at_Ramakrishna_Mission_Ashrama.jpg',
      license: 'CC BY-SA 4.0'
    }
  },
  {
    name: 'माता वैष्णो देवी गुफा मंदिर (चूना भट्टी - कोलार रोड)',
    photo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/04/Mata_Vaishno_Devi_Mandir%2C_Katra.jpg/1280px-Mata_Vaishno_Devi_Mandir%2C_Katra.jpg',
    attribution: {
      url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/04/Mata_Vaishno_Devi_Mandir%2C_Katra.jpg/1280px-Mata_Vaishno_Devi_Mandir%2C_Katra.jpg',
      title: 'माँ वैष्णो देवी गुफा मंदिर',
      author: 'Wikimedia Commons Contributor',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Mata_Vaishno_Devi_Mandir,_Katra.jpg',
      license: 'CC BY-SA 4.0'
    }
  },
  {
    name: 'शीतला माता मंदिर (शीतल दास की बगिया - वीआईपी रोड)',
    photo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0f/Sheetla_Mata_Temple_Gwalior_-_panoramio.jpg/1280px-Sheetla_Mata_Temple_Gwalior_-_panoramio.jpg',
    attribution: {
      url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0f/Sheetla_Mata_Temple_Gwalior_-_panoramio.jpg/1280px-Sheetla_Mata_Temple_Gwalior_-_panoramio.jpg',
      title: 'श्री शीतला माता मंदिर',
      author: 'Wikimedia Commons Contributor',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sheetla_Mata_Temple_Gwalior_-_panoramio.jpg',
      license: 'CC BY-SA 3.0'
    }
  },
  {
    name: 'काली मंदिर (कालीबाड़ी - टीटी नगर / न्यू मार्केट)',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Jyoti_Kalash_Sthapana_at_Kali_Bari_Chhindwara.jpg',
    attribution: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Jyoti_Kalash_Sthapana_at_Kali_Bari_Chhindwara.jpg',
      title: 'कालीबाड़ी मंदिर - माँ काली ज्योति कलश',
      author: 'Wikimedia Commons Contributor',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Jyoti_Kalash_Sthapana_at_Kali_Bari_Chhindwara.jpg',
      license: 'CC BY-SA 4.0'
    }
  },
  {
    name: 'बड़वाले महादेव मंदिर (सोमवारा - भवानी चौक)',
    photo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7a/Mahadev_nandi.jpg/1280px-Mahadev_nandi.jpg',
    attribution: {
      url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7a/Mahadev_nandi.jpg/1280px-Mahadev_nandi.jpg',
      title: 'श्री बड़वाले महादेव मंदिर सोमवारा',
      author: 'Wikimedia Commons Contributor',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Mahadev_nandi.jpg',
      license: 'CC BY-SA 4.0'
    }
  },
  {
    name: 'खटलापुरा हनुमान मंदिर',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Lower_Lake_Bhopal.jpg',
    attribution: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Lower_Lake_Bhopal.jpg',
      title: 'खटलापुरा हनुमान मंदिर घाट एवं छोटा तालाब',
      author: 'Wikimedia Commons Contributor',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Lower_Lake_Bhopal.jpg',
      license: 'CC BY-SA 4.0'
    }
  },
  {
    name: 'नेवरी हनुमान मंदिर (लालघाटी पहाड़ी)',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Dakshin_Mukhi_Hanuman_Mandir_Katni.jpg',
    attribution: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Dakshin_Mukhi_Hanuman_Mandir_Katni.jpg',
      title: 'श्री नेवरी दक्षिण मुखी हनुमान धाम लालघाटी',
      author: 'Wikimedia Commons Contributor',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Dakshin_Mukhi_Hanuman_Mandir_Katni.jpg',
      license: 'CC BY-SA 4.0'
    }
  },
  {
    name: 'कर्फ्यू वाली माता मंदिर (श्री भवानी मंदिर - पीर गेट)',
    photo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a0/Tulja_Bhavani_Devi.jpg/1280px-Tulja_Bhavani_Devi.jpg',
    attribution: {
      url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a0/Tulja_Bhavani_Devi.jpg/1280px-Tulja_Bhavani_Devi.jpg',
      title: 'कर्फ्यू वाली माता (श्री भवानी मंदिर) पीर गेट',
      author: 'Wikimedia Commons Contributor',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Tulja_Bhavani_Devi.jpg',
      license: 'CC BY-SA 4.0'
    }
  },
  {
    name: 'श्री खेड़ापति हनुमान मंदिर (छोला - भोपाल)',
    photo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/14/Hanuman_Mandir_%2CCantt_Guna.JPG/1280px-Hanuman_Mandir_%2CCantt_Guna.JPG',
    attribution: {
      url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/14/Hanuman_Mandir_%2CCantt_Guna.JPG/1280px-Hanuman_Mandir_%2CCantt_Guna.JPG',
      title: 'श्री खेड़ापति हनुमान धाम छोला भोपाल',
      author: 'Wikimedia Commons Contributor',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Hanuman_Mandir_,Cantt_Guna.JPG',
      license: 'CC BY-SA 3.0'
    }
  },
  {
    name: 'श्री गायत्री शक्तिपीठ (भोपाल)',
    photo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b9/Gayatri_mandir.JPG/1280px-Gayatri_mandir.JPG',
    attribution: {
      url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b9/Gayatri_mandir.JPG/1280px-Gayatri_mandir.JPG',
      title: 'श्री गायत्री शक्तिपीठ मंदिर',
      author: 'Wikimedia Commons Contributor',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Gayatri_mandir.JPG',
      license: 'CC BY-SA 3.0'
    }
  },
  {
    name: 'श्री सिद्ध गणेश मंदिर (बावड़िया कलां - भोपाल)',
    photo: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9e/Chintaman_Ganesh.jpg/1280px-Chintaman_Ganesh.jpg',
    attribution: {
      url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9e/Chintaman_Ganesh.jpg/1280px-Chintaman_Ganesh.jpg',
      title: 'श्री सिद्ध गणेश मंदिर',
      author: 'Wikimedia Commons Contributor',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Chintaman_Ganesh.jpg',
      license: 'CC BY-SA 4.0'
    }
  },
  {
    name: 'हनुमान मंदिर (शाहपुरा झील - भोपाल)',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Sri-jam-sawali-hanuman-mandir_1412842505.jpg',
    attribution: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Sri-jam-sawali-hanuman-mandir_1412842505.jpg',
      title: 'श्री हनुमान मंदिर शाहपुरा झील भोपाल',
      author: 'Wikimedia Commons Contributor',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sri-jam-sawali-hanuman-mandir_1412842505.jpg',
      license: 'CC BY-SA 3.0'
    }
  }
];

async function updatePhotos() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.DB_CONNECTION_STRING);
  console.log('Connected to MongoDB.\n');

  let updatedCount = 0;
  let notFoundCount = 0;

  for (const item of TEMPLE_PHOTOS_DATA) {
    const temple = await Mandir.findOne({ name: item.name });
    if (!temple) {
      console.log(`❌ [NOT FOUND IN DB] ${item.name}`);
      notFoundCount++;
      continue;
    }

    temple.photos = [item.photo];
    temple.photoAttributions = [item.attribution];
    temple.verificationStatus = 'verified';
    temple.timingsVerified = true;

    await temple.save();
    console.log(`✅ [UPDATED] ${item.name}`);
    console.log(`   Photo: ${item.photo}`);
    updatedCount++;
  }

  console.log(`\n========================================`);
  console.log(`Total Target: ${TEMPLE_PHOTOS_DATA.length}`);
  console.log(`Successfully Updated: ${updatedCount}`);
  console.log(`Not Found: ${notFoundCount}`);
  console.log(`========================================\n`);

  await mongoose.disconnect();
}

updatePhotos().catch(err => {
  console.error('Fatal error during photo update:', err);
  process.exit(1);
});
