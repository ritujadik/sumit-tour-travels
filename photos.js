/* Real photographs from Wikimedia Commons (free licences). Each entry: [folder, file, photographer, licence].
   Credits are shown in the site footer, as the CC licences require.
   To use your own photo for a stop, set an override below, e.g.  OVERRIDE.srinagar = 'images/srinagar.jpg' */
window.WL_PHOTOS = (function () {
  const D = {
    hero: ['e/e1', 'Dal_Lake_Hazratbal_Srinagar.jpg', 'Suhail Skindar Sofi', 'CC BY-SA 4.0'],
    katra: ['c/c6', 'Vaishno_Devi_entrance.jpg', 'Thenerdatul', 'CC BY 4.0'],
    shivkhori: ['1/11', 'Shiv_khori_2.jpg', 'Devika Robin Singh', 'CC BY-SA 4.0'],
    patnitop: ['c/cd', 'Patnitop_Cottages_-_Relax_in_Nature.jpg', 'Vikas Panwar', 'CC BY-SA 4.0'],
    pahalgam: ['f/f6', 'Pahalgam_Valley.jpg', 'KennyOMG', 'CC BY-SA 3.0'],
    srinagar: ['c/c4', 'Mobile_fruit_seller_on_shikara_in_Dal_lake_%2C_Srinagar_%2CKashmir.jpg', 'Harvinder Chandigarh', 'CC BY 4.0'],
    gulmarg: ['9/96', 'Gulmarg_Gondola%2C_Cable_Car.JPG', 'Skywayman9', 'CC BY-SA 3.0'],
    sonmarg: ['b/bc', 'Sonmarg_-_Paradise.jpg', 'Mohammad Iliyas Khanday', 'CC BY-SA 4.0'],
    shimla: ['e/ef', 'Shimla_town_%285726333362%29.jpg', 'Ryan from Toronto, Canada', 'CC BY 2.0'],
    manali: ['3/3f', 'Simsa_Manali_East_Himachal_Oct22_A7C_03328.jpg', 'Timothy A. Gonsalves', 'CC BY-SA 4.0'],
    dalhousie: ['2/2e', 'Dalhousie_l_Himachal_Pradesh.jpg', 'Piyush Tripathi', 'CC BY-SA 4.0'],
    dharamshala: ['5/5f', 'Dhauladhar_alpenglow_above_Dharamshala%2C_India.jpg', 'UnpetitproleX', 'CC BY-SA 4.0'],
    amritsar: ['c/c4', 'Akal_Takht_and_Harmandir_Sahib%2C_Amritsar%2C_Punjab%2C_India.jpg', 'Jasleen Kaur', 'CC BY-SA 2.0'],
    cochin: ['8/87', 'Chinese_fishingnet_kochi.jpg', 'Challiyil Eswaramangalath Vipin', 'CC BY-SA 2.0'],
    munnar: ['1/14', 'Munnar_Road_and_Tea_Plantations_%2811223%29.jpg', 'Manukrishnan80', 'CC BY-SA 3.0'],
    thekkady: ['b/ba', 'Thekkady_Periyar_National_Park.jpg', 'Manukeerampanal', 'CC BY 4.0'],
    alleppey: ['2/20', 'Houseboat_on_Alleppey_backwaters_%28Kerala%2C_India_2023%29_%2852704577484%29.jpg', 'Paul Arps', 'CC BY 2.0'],
    kovalam: ['3/3c', 'Kovalam_beach_trivandrum_kerala.jpg', 'Georgeumartin', 'CC BY-SA 4.0'],
    varanasi: ['3/3a', 'Varanasi_Munshi_Ghat3.jpg', 'Marcin Białek', 'CC BY-SA 3.0'],
    jomsom: ['8/80', 'Jomsom_Airport%2C_Mustang%2C_Nepal.jpg', 'Vyacheslav Argenberg', 'CC BY 4.0'],
    ayodhya: ['b/ba', 'Sarayu_River_night_view%2C_Ayodhya_001.jpg', 'रूही', 'CC BY-SA 4.0'],
    kathmandu: ['e/e0', 'Boudhanath_stupa%2C_Kathmandu_01.jpg', 'Bernard Gagnon', 'CC BY-SA 4.0'],
    janakpur: ['f/f7', 'Janaki_Temple%2C_Janakpur-September_22%2C_2016-IMG_7493.jpg', 'Bijay Chaurasia', 'CC BY-SA 4.0'],
    pokhara: ['9/93', 'Phewa_Lake-Pokhara_05.jpg', 'Sabina Bajracharya', 'CC BY-SA 4.0'],
    haridwar: ['3/3d', 'Aarti_at_Har_ki_Pauri_on_Explore.jpg', 'Ramesh Lalwani', 'CC BY 2.0'],
    guptkashi: ['a/a1', 'Chaukhamba_peak%2C_Garhwal_Himalayas%2C_Uttarakhand.jpg', 'Gaurav Agrawal', 'CC BY 2.0'],
    kedarnath: ['c/ce', '%E2%80%9CKEDARNATH%E2%80%9D.jpg', 'Sarika Shirbhate', 'CC BY-SA 4.0'],
    badrinath: ['2/25', 'Badrinath_Temple%2C_Uttarakhand_%28Photo-_Vishwanath_Negi%29.jpg', 'Vishwanath Negi', 'CC BY 4.0'],
    rishikesh: ['7/7e', 'Laxman_Jhula_Bridge.jpg', 'Dey.sandip', 'CC BY-SA 4.0'],
  };
  const OVERRIDE = {};
  const url = (id, w) => OVERRIDE[id] || (D[id] ? `images/${id}.jpg` : null);
  const credit = (id) => D[id] ? { photographer: D[id][2], licence: D[id][3], page: 'https://commons.wikimedia.org/wiki/File:' + D[id][1] } : null;
  return { url, credit, ids: Object.keys(D), OVERRIDE };
})();
