// Real Odisha Locations and Properties Data
export const properties = {
  priyan_naina: {
    id: 'priyan_naina',
    name: 'Priyan Naina Enclave',
    location: 'Mahanadi Vihar, Cuttack',
    district: 'Cuttack',
    bhks: ['2 BHK', '3 BHK', '4 BHK', '5 BHK'],
    railway: 'Cuttack Junction Railway Station (~1.5 km)',
    airport: 'Biju Patnaik International Airport, Bhubaneswar (~25–30 km)',
    schools: 'DAV Public School (Gandarpur), Guru Nanak Public School, Ravenshaw University nearby',
    markets: 'Reliance Fresh, Pride Mart, local markets in Mahanadi Vihar & Badambadi',
    maps: 'https://www.google.com/maps/search/?api=1&query=Mahanadi+Vihar+Cuttack',
    keywords: ['cuttack', 'mahanadi', 'vihar', 'mahanadi vihar', 'katak']
  },
  priya_jostna: {
    id: 'priya_jostna',
    name: 'Priya Jostna',
    location: 'Kesura Road / Cuttack-Puri Road',
    district: 'Khordha / Cuttack border',
    bhks: ['2 BHK', '3 BHK'],
    railway: 'Bhubaneswar / Khurda Road Railway Station',
    airport: 'Biju Patnaik International Airport (~15–20 km)',
    schools: 'Good CBSE & State schools along Cuttack-Puri corridor',
    markets: 'Local markets + easy access to Bhubaneswar city markets',
    maps: 'https://www.google.com/maps/search/?api=1&query=Kesora+Cuttack+Puri+Bypass+Road+Bhubaneswar',
    keywords: ['kesura', 'kesora', 'cuttack puri', 'puri road', 'bypass']
  },
  santoshi: {
    id: 'santoshi',
    name: 'Santoshi Enclave',
    location: 'Bari, Jajpur',
    district: 'Jajpur',
    bhks: ['2 BHK'],
    railway: 'Haridaspur / Dhanmandal / Cuttack (~38–58 km)',
    airport: 'Biju Patnaik International Airport (~80–85 km)',
    schools: 'Local government & private schools in Bari area',
    markets: 'Bari local market + nearby Jajpur town markets',
    maps: 'https://www.google.com/maps/search/?api=1&query=Bari+Jajpur+Odisha',
    keywords: ['jajpur', 'bari', 'jajapur', 'santoshi']
  },
  sea_view: {
    id: 'sea_view',
    name: 'Sea View Resort',
    location: 'Puri Sea Beach',
    district: 'Puri',
    bhks: ['2 BHK', '3 BHK', 'Duplex'],
    railway: 'Puri Railway Station (~2 km)',
    airport: 'Biju Patnaik International Airport (~60 km)',
    schools: 'Schools near Puri town & beach area',
    markets: 'Grand Road market, Swargadwar beach market, Jagannath Temple area',
    maps: 'https://www.google.com/maps/search/?api=1&query=Puri+Sea+Beach',
    keywords: ['puri', 'sea beach', 'beach', 'sea view', 'puri beach']
  },
  township: {
    id: 'township',
    name: 'Township Apartment',
    location: 'Sambalpur Town',
    district: 'Sambalpur',
    bhks: ['2 BHK', '3 BHK'],
    railway: 'Sambalpur Junction / Sambalpur Road Station',
    airport: 'Veer Surendra Sai Airport, Jharsuguda (~50–65 km)',
    schools: 'Good private & government schools in Sambalpur city',
    markets: 'Main market, Fatak, Ainthapali markets',
    maps: 'https://www.google.com/maps/search/?api=1&query=Sambalpur+Town+Odisha',
    keywords: ['sambalpur', 'sambal', 'township']
  },
  port_villa: {
    id: 'port_villa',
    name: 'Port Villa',
    location: 'Paradeep (near Port)',
    district: 'Jagatsinghpur',
    bhks: ['3 BHK', 'Duplex', 'Triplex'],
    railway: 'Paradeep Railway Station',
    airport: 'Biju Patnaik International Airport (~100–125 km)',
    schools: 'DAV Public School Paradeep, Kendriya Vidyalaya Paradeep Port, Bethany Convent',
    markets: 'Port market complex, local markets near Paradeep Port',
    maps: 'https://www.google.com/maps/search/?api=1&query=Paradeep+Port+Odisha',
    keywords: ['paradeep', 'paradip', 'pradeep', 'port', 'jagatsinghpur']
  },
  sun_rise: {
    id: 'sun_rise',
    name: 'Sun Rise Enclave',
    location: 'Khordha (near Collector Office / Pallahat)',
    district: 'Khordha',
    bhks: ['2 BHK', '3 BHK', '4 BHK'],
    railway: 'Khordha Town / Khurda Road Junction (~5–12 km)',
    airport: 'Biju Patnaik International Airport (~25–30 km)',
    schools: 'DAV Public School, St. Xavier’s, Kendriya Vidyalaya, local schools near Collectorate',
    markets: 'Khordha town market + easy access to Bhubaneswar markets',
    maps: 'https://www.google.com/maps/search/?api=1&query=Khordha+Collectorate+Odisha',
    keywords: ['khordha', 'khurda', 'khorda', 'collector', 'pallahat', 'bhubaneswar', 'bbsr']
  }
};

export const districtMap = {
  // Exact matches
  cuttack: 'priyan_naina',
  katak: 'priyan_naina',
  jajpur: 'santoshi',
  jajapur: 'santoshi',
  puri: 'sea_view',
  sambalpur: 'township',
  jagatsinghpur: 'port_villa',
  paradeep: 'port_villa',
  paradip: 'port_villa',
  khordha: 'sun_rise',
  khurda: 'sun_rise',
  khorda: 'sun_rise',
  bhubaneswar: 'sun_rise',
  bbsr: 'sun_rise',

  // Nearest for other districts
  angul: 'priyan_naina',
  anugul: 'priyan_naina',
  dhenkanal: 'priyan_naina',
  kendrapara: 'port_villa',
  kendrapada: 'port_villa',
  bhadrak: 'santoshi',
  balasore: 'santoshi',
  baleswar: 'santoshi',
  mayurbhanj: 'santoshi',
  keonjhar: 'township',
  kendujhar: 'township',
  sundargarh: 'township',
  jharsuguda: 'township',
  bargarh: 'township',
  balangir: 'township',
  bolangir: 'township',
  subarnapur: 'township',
  sonepur: 'township',
  deogarh: 'township',
  debagarh: 'township',
  nuapada: 'township',
  kalahandi: 'township',
  kandhamal: 'sun_rise',
  boudh: 'sun_rise',
  baudh: 'sun_rise',
  nayagarh: 'sun_rise',
  ganjam: 'sea_view',
  gajapati: 'sea_view',
  koraput: 'sea_view',
  rayagada: 'sea_view',
  malkangiri: 'sea_view',
  nabarangpur: 'sea_view',
  nabarangapur: 'sea_view'
};

export function findNearestProperty(userLoc = '') {
  const loc = userLoc.toLowerCase().trim();

  // Direct keyword match in property
  for (const key in properties) {
    const p = properties[key];
    if (p.keywords.some((k) => loc.includes(k))) {
      return { prop: p, isExact: true };
    }
  }

  // District map
  for (const dist in districtMap) {
    if (loc.includes(dist)) {
      const propKey = districtMap[dist];
      const targetProp = properties[propKey];
      const isExact =
        dist === targetProp.district.toLowerCase() ||
        targetProp.keywords.some((k) => loc.includes(k));
      return { prop: targetProp, isExact };
    }
  }

  // Fallback – default to Cuttack
  return { prop: properties.priyan_naina, isExact: false, fallback: true };
}

export function matchBHK(userText = '', available = []) {
  const t = userText.toLowerCase();
  if (t.includes('2') || t.includes('two')) return available.find((b) => b.includes('2'));
  if (t.includes('3') || t.includes('three')) return available.find((b) => b.includes('3'));
  if (t.includes('4') || t.includes('four')) return available.find((b) => b.includes('4'));
  if (t.includes('5') || t.includes('five')) return available.find((b) => b.includes('5'));
  if (t.includes('duplex')) return available.find((b) => b.toLowerCase().includes('duplex'));
  if (t.includes('triplex')) return available.find((b) => b.toLowerCase().includes('triplex'));
  return null;
}
