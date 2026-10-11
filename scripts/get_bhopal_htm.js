async function getBhopalHTM() {
  const url = 'https://hindutemplemap.com/api/near?lat=23.2599&lng=77.4126&limit=30&r=25';
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const data = await res.json();
  console.log('HTM count for Bhopal:', data.rows ? data.rows.length : 0);
  data.rows.forEach((r, i) => {
    console.log(`${i+1}. ${r.n} | Deity: ${r.d || 'General'} | Dist: ${r.km}km | Slug: ${r.s}`);
  });
}
getBhopalHTM();
