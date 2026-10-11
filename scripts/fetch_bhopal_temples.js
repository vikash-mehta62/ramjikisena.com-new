async function getBhopalOSM() {
  const mirrors = [
    'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
    'https://overpass-api.de/api/interpreter'
  ];
  const query = `[out:json][timeout:25];(node["amenity"="place_of_worship"]["religion"="hindu"]["name"](23.15,77.30,23.35,77.52););out 50;`;

  for (const m of mirrors) {
    try {
      console.log('Trying mirror:', m);
      const res = await fetch(m, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'RamJiKiSena/1.0' },
        body: 'data=' + encodeURIComponent(query),
        signal: AbortSignal.timeout(12000)
      });
      const text = await res.text();
      if (res.ok) {
        const data = JSON.parse(text);
        console.log(`Found ${data.elements ? data.elements.length : 0} named temples in Bhopal on ${m}:`);
        data.elements.forEach((e, idx) => {
          const name = e.tags?.['name:hi'] || e.tags?.name;
          console.log(`  ${idx+1}. ${name} (${e.lat}, ${e.lon})`);
        });
        return data.elements;
      } else {
        console.log('Mirror returned status:', res.status, text.slice(0, 100));
      }
    } catch (e) {
      console.log('Mirror error:', e.message);
    }
  }
}

getBhopalOSM();
