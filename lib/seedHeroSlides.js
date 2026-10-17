const mongoose = require('mongoose');
const HeroSlide = require('../models/HeroSlide');

const INITIAL_SLIDES = [
  {
    title: 'Jai Shree Ram',
    subtitle: 'Naam is the True Power',
    tagline: 'Chant. Connect. Learn. Live with Bhagwan Ram.',
    description: 'Join millions of devotees and experience peace, positivity and happiness through Ram Naam in your daily life.',
    badge: '🚩 Jai Shree Ram — Naam is the True Power',
    image: '/images/hero-ayodhya-ramji-hd.webp',
    button1Text: 'Start Ram Naam Jaap',
    button1Link: '/#jaap',
    button2Text: 'Watch Video',
    button2Link: 'https://www.youtube.com/embed/Pj3hXU0w198',
    order: 1,
    isActive: true
  },
  {
    title: 'अखंड नाम संकीर्तन',
    subtitle: 'कलियुग केवल नाम अधारा',
    tagline: 'सुमिरि सुमिरि नर उतरहिं पारा',
    description: 'भगवान श्री राम के पावन नाम का निरंतर जप करें और अपने जीवन को अलौकिक शांति एवं परम आनंद से भरें।',
    badge: '📿 पावन राम नाम जप महा-यज्ञ',
    image: '/ramji.jpg',
    button1Text: 'दैनिक जाप करें',
    button1Link: '/#jaap',
    button2Text: 'वैदिक सेवाएं देखें',
    button2Link: '/#services',
    order: 2,
    isActive: true
  },
  {
    title: 'श्री राम जन्मभूमि अयोध्या',
    subtitle: 'भव्य मंदिर अलौकिक दर्शन',
    tagline: 'राम लला सरकार के दिव्य दर्शन और आशीर्वाद',
    description: 'विश्व भर के करोड़ों रामभक्तों के साथ जुड़कर प्रतिदिन अयोध्या धाम का पावन स्मरण और नाम लेखन करें।',
    badge: '🛕 अयोध्या धाम पावन दर्शन',
    image: '/images/Ayodhya Ramji Photo.webp',
    button1Text: 'राम नाम बैंक जुड़ें',
    button1Link: '/community',
    button2Text: 'समस्त सेवाएं',
    button2Link: '/#services',
    order: 3,
    isActive: true
  }
];

async function seedHeroSlides() {
  try {
    const count = await HeroSlide.countDocuments();
    if (count === 0) {
      console.log('Seeding initial Hero Slides...');
      await HeroSlide.insertMany(INITIAL_SLIDES);
      console.log('Hero Slides seeded successfully!');
    }
  } catch (error) {
    console.error('Error seeding Hero Slides:', error.message);
  }
}

module.exports = { seedHeroSlides, INITIAL_SLIDES };
