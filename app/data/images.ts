export interface GalleryImage {
    url: string;
    time: string; // e.g., "2024-05-01" or any format you prefer
    title: string;
    color: string;
  }
  
// Populate the images array
const unsortedImages: GalleryImage[] = [

  { url: '/images/20160305-Dancer-舞者.jpg', time: '2016-03-05', title: 'Dancer 舞者', color: '#702117' },
  { url: '/images/20180217-in_the_rain-在雨中.jpg', time: '2018-02-17', title: 'in the rain 在雨中', color: '#c6a8a8' },
  { url: '/images/20190430-sunflowers.jpg', time: '2019-04-30', title: 'sunflowers', color: '#c0945c' },
  { url: '/images/20190802-Red_sail_harbor.jpg', time: '2019-08-02', title: 'Red sail harbor', color: '#5f86b6' },
  { url: '/images/20200524-Little_daisies.jpg', time: '2020-05-24', title: 'Little daisies', color: '#f2e04e' },
  { url: '/images/20200524-Two_flowers.jpg', time: '2020-05-24', title: 'Two flowers', color: '#301e2c' },
  { url: '/images/20200606-Porcelain.jpg', time: '2020-06-06', title: 'Porcelain', color: '#363f6d' },
  { url: '/images/20200802-A_Fruitful_Display.jpg', time: '2020-08-02', title: 'A Fruitful Display', color: '#bfbec3' },
  { url: '/images/240212-spring_festival.png', time: '2024-02-12', title: 'Spring Festival春节', color: '#ffc96c' },
  { url: '/images/20240714-Modigliani001.jpg', time: '2024-07-14', title: 'Modigliani001', color: '#b0b5b0' },
  { url: '/images/20240719-Modigliani002.jpg', time: '2024-07-19', title: 'Modigliani002', color: '#f1a760' },
  { url: '/images/20240722-Modigliani003.jpg', time: '2024-07-22', title: 'Modigliani003', color: '#6f6253' },
  { url: '/images/20240725-Modigliani004.png', time: '2024-07-25', title: 'Modigliani004', color: '#e09079' },
  { url: '/images/20240810-Bathroom_Beauty001.jpg', time: '2024-08-10', title: 'Bathroom Beauty001', color: '#d29549' },
  { url: '/images/20240825-landscape01.jpg', time: '2024-08-25', title: 'landscape01', color: '#aabee4' },
  { url: '/images/20250201-vibrant_violin.png', time: '2025-02-01', title: 'vibrant violin', color: '#d2dbe1' },
  { url: '/images/20250204-spring.jpg', time: '2025-02-04', title: 'spring', color: '#ffeec8'}
  ,
  { url: '/images/20250223-Harbor.jpg', time: '2025-02-23', title: 'Harbor', color: '#465662' },
  { url: '/images/20250310-fruit01.jpg', time: '2025-03-10', title: 'fruit01', color: '#e04426' },
  { url: '/images/20250406-frut02.jpg', time: '2025-04-06', title: 'fruit02', color: '#b0210f' },
  { url: '/images/20250501-Lotus01.jpg', time: '2025-05-01', title: 'Lotus01', color: '#cdd167' },
  { url: '/images/20250506-Lotus02.jpg', time: '2025-05-06', title: 'Lotus02', color: '#bdd1c2' },
  { url: '/images/water_color-20190215-Fresh_mushrooms.jpg', time: '2019-02-15', title: 'Fresh mushrooms', color: '#9c4230' },
  { url: '/images/water_color-20190223-tearful_rose.jpg', time: '2019-02-23', title: 'tearful rose', color: '#edbcc4' },
  { url: '/images/water_color-20190227-Lonely_boat.jpg', time: '2019-02-27', title: 'Lonely boat', color: '#455d55' },
  { url: '/images/water_color-20190321-Golden Gate Bridge.jpg', time: '2019-03-21', title: 'Golden Gate Bridge', color: '#b05224' },
  { url: '/images/water_color-20190402-Venice_water_village.jpg', time: '2019-04-02', title: 'Venice water village', color: '#e6dfdc' },
  { url: '/images/water_color-20190424-Roadside.jpg', time: '2019-04-24', title: 'Roadside', color: '#e6dce1' },
  { url: '/images/20190505-windmill.png', time: '2019-05-05', title: 'windmill', color: '#11454e' },
  { url: '/images/water_colorr-20190217-cherrirs.jpg', time: '2019-02-17', title: 'cherries', color: '#204410' },

];



// Sort by time descending (most recent first)
export const images: GalleryImage[] = unsortedImages.sort((a, b) => {
  if (!a.time) return 1;
  if (!b.time) return -1;
  return b.time.localeCompare(a.time);
});
