(function () {
  const cfg = window.XAT_PRESENCE_CONFIG || {};
  const userId = cfg.userId || 1984;
  const pollMs = Math.max(30000, Number(cfg.pollMs) || 60000);
  const endpoint = cfg.statusApiUrl || '/api/xat-status';
  const el = document.getElementById('xat-presence');
  if (!el) return;

  function render(state, group) {
    const dot = el.querySelector('.online-status');
    if (!dot) return;
    dot.classList.remove('online', 'offline', 'checking');
    if (state === 'online') {
      dot.classList.add('online');
      dot.setAttribute('aria-label', 'Online on xat');
      el.firstChild.nodeValue = group ? 'Online · ' + group + ' ' : 'Online (xat) ';
      el.title = group ? 'Online on xat.com/' + group : 'Online on xat';
    } else if (state === 'offline') {
      dot.classList.add('offline');
      dot.setAttribute('aria-label', 'Offline');
      el.firstChild.nodeValue = 'Offline ';
      el.title = 'Currently offline on xat';
    } else {
      dot.classList.add('checking');
      dot.setAttribute('aria-label', 'Checking');
      el.firstChild.nodeValue = 'Checking xat... ';
      el.title = 'Checking xat presence';
    }
  }

  async function check() {
    render('checking');
    try {
      const url = endpoint + (endpoint.includes('?') ? '&' : '?') + 'user=' + encodeURIComponent(userId);
      const res = await fetch(url, { cache: 'no-store', headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error('Status endpoint unavailable');
      const data = await res.json();
      render(data.online === true ? 'online' : 'offline', data.group || data.chat || '');
    } catch (err) {
      // Never show a false green status when the source cannot be verified.
      render('offline');
    }
  }

  check();
  setInterval(check, pollMs);
})();
