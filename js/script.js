document.addEventListener("DOMContentLoaded", () => {
  // Keep real links clickable. The xat Trade and xat Loja rows use their href values.
  // Only non-link cards can use data-card for visual selection.
  document.querySelectorAll("[data-card]").forEach((card) => {
    if (card.tagName.toLowerCase() === "a" && card.getAttribute("href") && card.getAttribute("href") !== "#") {
      return;
    }

    card.addEventListener("click", (event) => {
      const target = card.dataset.card;
      if (target && target !== "") {
        event.preventDefault();
        console.log(`Selected profile section: ${target}`);
      }
    });
  });

  document.addEventListener("contextmenu", (event) => event.preventDefault());
});


// Profile music: autoplay when allowed, otherwise start on the first user interaction.
(() => {
  const music = document.getElementById('profileMusic');
  if (!music) return;

  music.volume = 0.35;
  music.loop = true;
  music.muted = false;

  let started = false;

  const tryStart = () => {
    if (started) return;
    const promise = music.play();
    if (promise && typeof promise.then === 'function') {
      promise.then(() => {
        started = true;
        cleanup();
      }).catch(() => {});
    }
  };

  const cleanup = () => {
    ['pointerdown', 'click', 'touchstart', 'keydown'].forEach(type =>
      document.removeEventListener(type, tryStart, true)
    );
  };

  ['pointerdown', 'click', 'touchstart', 'keydown'].forEach(type =>
    document.addEventListener(type, tryStart, true)
  );

  window.addEventListener('pageshow', tryStart);
  tryStart();
})();


// Theme scroll-to-top button
(() => {
  const button = document.getElementById('scrollTop');
  if (!button) return;

  const update = () => {
    button.classList.toggle('show', window.scrollY > 420);
  };

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', update, { passive: true });
  update();
})();


// Theme music control
(() => {
  const music = document.getElementById('profileMusic');
  const button = document.getElementById('musicControl');
  const icon = document.getElementById('musicIcon');
  if (!music || !button || !icon) return;

  const update = () => {
    const playing = !music.paused && !music.ended;
    button.classList.toggle('playing', playing);
    button.setAttribute('aria-label', playing ? 'Pause music' : 'Play music');
    button.setAttribute('title', playing ? 'Pause music' : 'Play music');
    icon.textContent = playing ? 'Ⅱ' : '▶';
  };

  button.addEventListener('click', (event) => {
    event.preventDefault();
    if (music.paused) {
      music.play().catch(() => {});
    } else {
      music.pause();
    }
    update();
  });

  music.addEventListener('play', update);
  music.addEventListener('pause', update);
  music.addEventListener('ended', update);
  update();
})();
