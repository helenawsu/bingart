export interface GalleryImage {
    url: string;
    time: string; // e.g., "2024-05-01" or any format you prefer
  }
  
// Populate the images array
const unsortedImages: GalleryImage[] = [
  { url: '/images/20160305-Dancer-舞者.jpg', time: '2016-03-05' },
  { url: '/images/20180217-in_the_rain-在雨中.jpg', time: '2018-02-17' },
  { url: '/images/20190430-sunflowers.jpg', time: '2019-04-30' },
  { url: '/images/20190802-Red_sail_harbor.jpg', time: '2019-08-02' },
  { url: '/images/20200524-Little_daisies.jpg', time: '2020-05-24' },
  { url: '/images/20200524-Two_flowers.jpg', time: '2020-05-24' },
  { url: '/images/20200606-Porcelain.jpg', time: '2020-06-06' },
  { url: '/images/20200802-A_Fruitful_Display.jpg', time: '2020-08-02' },
  { url: '/images/20240714-Modigliani001.jpg', time: '2024-07-14' },
  { url: '/images/20240719-Modigliani002.jpg', time: '2024-07-19' },
  { url: '/images/20240722-Modigliani003.jpg', time: '2024-07-22' },
  { url: '/images/20240810-Bathroom_Beauty001.jpg', time: '2024-08-10' },
  { url: '/images/20240825-landscape01.jpg', time: '2024-08-25' },
  { url: '/images/20250204-spring.jpg', time: '2025-02-04' },
  { url: '/images/20250223-Harbor.jpg', time: '2025-02-23' },
  { url: '/images/20250310-fruit01.jpg', time: '2025-03-10' },
  { url: '/images/20250406-frut02.jpg', time: '2025-04-06' },
  { url: '/images/20250501-Lotus01.jpg', time: '2025-05-01' },
  { url: '/images/20250506-Lotus02.jpg', time: '2025-05-06' },
  { url: '/images/water_color-20190215-Fresh_mushrooms.jpg', time: '2019-02-15' },
  { url: '/images/water_color-20190223-tearful_rose.jpg', time: '2019-02-23' },
  { url: '/images/water_color-20190227-Lonely_boat.jpg', time: '2019-02-27' },
  { url: '/images/water_color-20190321-Golden Gate Bridge.jpg', time: '2019-03-21' },
  { url: '/images/water_color-20190402-Venice_water_village.jpg', time: '2019-04-02' },
  { url: '/images/water_color-20190424-Roadside.jpg', time: '2019-04-24' },
  { url: '/images/water_colorr-20190217-cherrirs.jpg', time: '2019-02-17' },
];

// Sort by time descending (most recent first)
export const images: GalleryImage[] = unsortedImages.sort((a, b) => {
  if (!a.time) return 1;
  if (!b.time) return -1;
  return b.time.localeCompare(a.time);
});
