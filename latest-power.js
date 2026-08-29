/*
  Automatic Latest Power loader
  Source: Illuxat latest power data.
  The profile first tries Illuxat directly. If the browser blocks cross-origin
  access, it retries through a read-only CORS relay. Existing values stay visible
  if the source is temporarily unavailable.
*/
(async function () {
  const source = 'https://illuxat.com/en/';
  const proxy = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(source);

  const $ = id => document.getElementById(id);
  const set = (id, value) => { const el = $(id); if (el && value) el.textContent = value; };

  function parseLatestPower(text) {
    const normalized = text.replace(/\s+/g, ' ').trim();

    // Current Illuxat homepage pattern:
    // selfcare #750 ... Store price : 300 xats ... Status : Limited ...
    // Trade : 400 - 500 xats or 29 - 37 days
    const re = /([a-z0-9_-]+)\s+#(\d+).*?Store price\s*:\s*([0-9,]+\s*(?:xats|days)).*?Status\s*:\s*(Limited|Unlimited).*?Trade\s*:\s*([0-9,]+\s*-\s*[0-9,]+)\s*xats\s*or\s*([0-9,]+\s*-\s*[0-9,]+)\s*days/i;
    const m = normalized.match(re);
    if (!m) return null;

    return {
      name: m[1],
      id: '#' + m[2],
      price: m[3],
      status: m[4],
      xats: m[5],
      days: m[6]
    };
  }

  async function getText(url) {
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return await r.text();
  }

  try {
    let text;
    try {
      text = await getText(source);
    } catch (directError) {
      text = await getText(proxy);
    }

    const data = parseLatestPower(text);
    if (!data) throw new Error('Latest power format not found');

    set('latestPowerName', data.name.charAt(0).toUpperCase() + data.name.slice(1));
    set('latestPowerId', data.id);
    set('latestPowerPrice', data.price);
    set('latestPowerStatus', data.status);
    set('latestPowerBadge', data.status);
    set('latestPowerXats', data.xats);
    set('latestPowerDays', data.days);

    const image = $('latestPowerImage');
    if (image) {
      image.src = 'https://xat.com/images/smw/' + encodeURIComponent(data.name.toLowerCase()) + '.png';
      image.alt = data.name + ' power';
    }

    const link = $('latestPowerLink');
    if (link) link.href = 'https://illuxat.com/en/power/' + encodeURIComponent(data.name.toLowerCase());

    const update = $('latestPowerUpdate');
    if (update) update.textContent = 'Updated automatically from Illuxat';
  } catch (error) {
    const update = $('latestPowerUpdate');
    if (update) update.textContent = 'Using saved latest power data';
  }
})();