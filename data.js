/* Sumit Tour & Travels: all editable content lives in this file.
   Packages, prices and inclusions come from the package sheet.
   BRAND holds the contact details; REVIEWS must contain real reviews only. */

window.WL = {
  BRAND: {
    name: 'Sumit Tour & Travels',
    tagline: 'Plan your vacation stress free, tension free and within your budget.',
    city: 'Surat, Gujarat',
    phoneDisplay: '+91 78610 74491',
    whatsapp: '917861074491',             // digits only, with country code
    email: '',                            // add when available; the site hides it while empty
    website: 'www.sumittourandtravels.com',
    instagram: 'sumittourandtravels',
    address: '',
      },

  /* Stops. id doubles as the image file name: images/<id>.jpg */
  STOPS: {
    katra: ['Katra', 'Base town for the Vaishno Devi yatra.'],
    shivkhori: ['Shiv Khori', 'Cave shrine of Lord Shiva in the Reasi hills.'],
    patnitop: ['Patnitop', 'Pine-covered hill resort on the Jammu to Srinagar road.'],
    pahalgam: ['Pahalgam', 'Lidder river valley with meadows and pine forest.'],
    srinagar: ['Srinagar', 'Dal Lake, shikara rides and the Mughal gardens.'],
    gulmarg: ['Gulmarg', 'Snow meadow resort with the Gulmarg Gondola.'],
    sonmarg: ['Sonmarg', 'The meadow of gold, beside the Sindh river.'],
    shimla: ['Shimla', 'Hill capital with the Ridge and Mall Road.'],
    manali: ['Manali', 'Beas valley town under snow peaks.'],
    dalhousie: ['Dalhousie', 'Quiet colonial hill town among deodars.'],
    dharamshala: ['Dharamshala', 'Dhauladhar views and Tibetan monasteries.'],
    amritsar: ['Amritsar', 'Golden Temple and the evening at Wagah.'],
    cochin: ['Cochin', 'Fort Kochi and the Chinese fishing nets.'],
    munnar: ['Munnar', 'Tea estates and misty ridgelines.'],
    thekkady: ['Thekkady', 'Periyar reserve and spice plantations.'],
    alleppey: ['Alleppey', 'Backwater cruise on a Kerala houseboat.'],
    kovalam: ['Kovalam', 'Crescent beaches and the lighthouse headland.'],
    varanasi: ['Varanasi', 'Ghats of the Ganga and the evening aarti.'],
    jomsom: ['Jomsom', 'Dry Kali Gandaki valley in Mustang.'],
    ayodhya: ['Ayodhya', 'Ram Janmabhoomi and the Sarayu ghats.'],
    kathmandu: ['Kathmandu', 'Pashupatinath, Boudhanath and old Durbar squares.'],
    janakpur: ['Janakpur', 'Janaki Mandir, the birthplace of Sita.'],
    pokhara: ['Pokhara', 'Phewa Lake beneath the Annapurna range.'],
    haridwar: ['Haridwar', 'Har ki Pauri and the Ganga aarti.'],
    guptkashi: ['Guptkashi', 'Ancient Vishwanath temple and base for Kedarnath.'],
    kedarnath: ['Kedarnath', 'Shiva temple at 3,583 m in the Garhwal Himalaya.'],
    badrinath: ['Badrinath', 'Vishnu temple on the banks of the Alaknanda.'],
    rishikesh: ['Rishikesh', 'Laxman Jhula and the Ganga foothills.'],
  },

  REGIONS: {
    jk: 'Jammu & Kashmir',
    hp: 'Himachal',
    kl: 'Kerala',
    np: 'Nepal',
    uk: 'Uttarakhand',
  },

  /* price = rupees per person. nights = nights at each stop. visits = day trips or places covered without a night stay. */
  PACKAGES: [
    {
      id: 'vaishno', region: 'jk', days: 7, price: 11000, vehicle: '14-seater Tempo Traveller',
      title: 'Mata Vishno Devi, Shiv Khori & Patnitop',
      tagline: 'Darshan at Katra with Shiv Khori and Patnitop on the way.',
      route: [['katra', 4]], visits: ['shivkhori', 'patnitop'], hotel: '3-star hotels', train: 'Surat to Surat non-A.C. train travel',
    },
    {
      id: 'vaishno-kashmir', region: 'jk', days: 12, price: 21500, vehicle: '14-seater Tempo Traveller',
      title: 'Vishno Devi & Kashmir',
      tagline: 'Katra darshan, then Pahalgam and Srinagar with two snow day trips.',
      route: [['katra', 3], ['pahalgam', 2], ['srinagar', 4]], visits: ['gulmarg', 'sonmarg'], hotel: '3-star hotels', heated: true, train: 'Surat to Surat non-A.C. train travel',
    },
    {
      id: 'special-kashmir', region: 'jk', days: 10, price: 18500, vehicle: '17-seater Tempo Traveller',
      title: 'Special Kashmir',
      tagline: 'Pahalgam, Srinagar and a night at Katra on the return.',
      route: [['pahalgam', 2], ['srinagar', 4], ['katra', 1]], visits: ['gulmarg', 'sonmarg'], hotel: '3-star hotels', heated: true, train: 'Surat to Surat non-A.C. train travel',
    },
    {
      id: 'shimla-manali', region: 'hp', days: 8, price: 15000, vehicle: '17-seater Tempo Traveller',
      title: 'Shimla & Manali',
      tagline: 'The classic hill-station pair, two nights and three nights.',
      route: [['shimla', 2], ['manali', 3]], visits: [], hotel: '3-star hotels', train: 'Surat to Surat non-A.C. train travel',
    },
    {
      id: 'himachal', region: 'hp', days: 11, price: 20500, vehicle: '17-seater Tempo Traveller',
      title: 'Himachal Tour',
      tagline: 'Five hill towns and the Golden Temple in one loop.',
      route: [['dalhousie', 1], ['dharamshala', 1], ['manali', 3], ['shimla', 2], ['amritsar', 1]], visits: [], hotel: '3-star hotels', train: 'Surat to Surat non-A.C. train travel',
    },
    {
      id: 'kerala', region: 'kl', days: 8, price: 21900, vehicle: '17-seater Tempo Traveller',
      title: 'Kerala Tour',
      tagline: 'Tea hills, backwaters and three nights by the sea at Kovalam.',
      route: [['cochin', 1], ['munnar', 2], ['thekkady', 1], ['alleppey', 1], ['kovalam', 3]], visits: [], hotel: '3-star hotels', train: 'Surat to Surat non-A.C. train travel',
    },
    {
      id: 'nepal', region: 'np', days: 13, price: 25500, vehicle: 'Travel by rail and 2x2 AC bus',
      title: 'Nepal Tour',
      tagline: 'Banaras to Kathmandu and Pokhara, with Ayodhya and Janakpur on the way.',
      route: [['varanasi', 2], ['jomsom', 1], ['ayodhya', 1], ['kathmandu', 2], ['janakpur', 1], ['pokhara', 2]],
      visits: [], places: ['Banaras', 'Varanasi', 'Ayodhya', 'Janakpur', 'Pokhara', 'Gorakhpur', 'Manokamna Devi', 'Kathmandu-Pashupatinath', 'Lumbini'],
      hotel: '3-star hotels', train: 'Surat to Surat non-A.C. train travel', note: 'Nepal border charge is paid separately and will be applicable.',
    },
    {
      id: 'do-dham', region: 'uk', days: 10, price: 17500, vehicle: '17-seater Tempo Traveller',
      title: 'Do Dham: Kedarnath & Badrinath',
      tagline: 'Two of the four Dhams with Haridwar and Rishikesh at either end.',
      route: [['haridwar', 1], ['guptkashi', 2], ['kedarnath', 1], ['badrinath', 1], ['rishikesh', 1]], visits: [], hotel: 'Hotel stays along the route', train: 'Surat to Surat non-A.C. train travel',
    },
  ],

  /* Real traveller reviews only. Add objects like
     { name: 'Name', city: 'City', trip: 'Package name', stars: 5, text: '...' }
     The reviews section stays hidden while this list is empty. */
  REVIEWS: [],
};
