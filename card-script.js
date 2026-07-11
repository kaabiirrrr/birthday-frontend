let noCount = 0;

class MusicBox {
  constructor() {
    this.audio = new Audio('images/ishq_bulaava_bollywood.mp3');
    this.audio.loop = true;
    this.isPlaying = false;

    // Restore time position if exists
    const savedTime = sessionStorage.getItem('music_current_time');
    if (savedTime) {
      this.audio.currentTime = parseFloat(savedTime);
    }

    // Continuously update saved time
    this.audio.addEventListener('timeupdate', () => {
      sessionStorage.setItem('music_current_time', this.audio.currentTime);
    });
  }

  start() {
    this.isPlaying = true;
    sessionStorage.setItem('music_is_playing', 'true');
    this.audio.play().catch(err => console.log("Audio play blocked: " + err));
  }

  stop() {
    this.isPlaying = false;
    sessionStorage.setItem('music_is_playing', 'false');
    this.audio.pause();
  }
}

const musicBox = new MusicBox();

/* --- Music Control UI Hookups --- */

const musicToggle = document.getElementById('music-toggle');
const visualizer = document.getElementById('visualizer');
const musicIcon = musicToggle.querySelector('.music-icon');
const musicText = musicToggle.querySelector('.music-text');

function updateMusicUI(playing) {
  if (playing) {
    musicToggle.classList.add('playing');
    visualizer.classList.add('playing');
    musicIcon.textContent = '⏸️';
    musicText.textContent = 'Pause Sound';
  } else {
    musicToggle.classList.remove('playing');
    visualizer.classList.remove('playing');
    musicIcon.textContent = '🎵';
    musicText.textContent = 'Play Sound';
  }
}

// Music Toggle Click Action
musicToggle.addEventListener('click', () => {
  if (musicBox.isPlaying) {
    musicBox.stop();
    updateMusicUI(false);
  } else {
    musicBox.start();
    updateMusicUI(true);
  }
});

// Auto-play attempt on interaction (due to browser security rules)
function startAutoplay() {
  if (sessionStorage.getItem('music_is_playing') !== 'false') {
    musicBox.start();
    updateMusicUI(true);
  }
  document.removeEventListener('click', startAutoplay);
  document.removeEventListener('touchstart', startAutoplay);
}

// Try to play immediately on load, or wait for first click/touch
window.addEventListener('load', () => {
  if (sessionStorage.getItem('music_is_playing') === 'false') {
    updateMusicUI(false);
    return;
  }
  setTimeout(() => {
    musicBox.audio.play().then(() => {
      musicBox.isPlaying = true;
      sessionStorage.setItem('music_is_playing', 'true');
      updateMusicUI(true);
    }).catch(err => {
      console.log("Autoplay blocked, waiting for interaction.");
      document.addEventListener('click', startAutoplay);
      document.addEventListener('touchstart', startAutoplay);
    });
  }, 100);
});


/* --- Tab Switching & Animations --- */

const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

function animateLetter() {
  const paragraphs = document.querySelectorAll('.letter-paragraph');
  paragraphs.forEach((p, idx) => {
    p.classList.remove('visible');
    setTimeout(() => {
      p.classList.add('visible');
    }, idx * 1000); // 1.0s delay between paragraphs
  });
}

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetTab = btn.getAttribute('data-tab');

    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanes.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    const targetPane = document.getElementById(targetTab);
    targetPane.classList.add('active');

    if (targetTab === 'tab-letter') {
      animateLetter();
    }
  });
});


/* --- Polaroid Lightbox Action --- */

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const polaroids = document.querySelectorAll('.polaroid-card');

polaroids.forEach(card => {
  card.addEventListener('click', () => {
    const img = card.querySelector('img');
    const caption = card.querySelector('.polaroid-caption').textContent;

    lightboxImg.src = img.src;
    lightboxCaption.textContent = caption;
    lightbox.classList.add('active');
  });
});

document.getElementById('close-lightbox-btn').addEventListener('click', () => {
  lightbox.classList.remove('active');
});

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    lightbox.classList.remove('active');
  }
});


/* --- Mobile Wish Card Helper (Flip on tap for mobile screens without hover) --- */

const wishCards = document.querySelectorAll('.wish-card');
wishCards.forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
  });
});


/* --- Interactive Be Mine Question Logic --- */

const noPrompts = [
  "No 😢",
  "Are you sure? 🥺",
  "Think again! 💔",
  "Please? 👉👈",
  "I will buy you pizza! 🍕",
  "I'll be the best bestie! 🥇",
  "You can't say no! 😉",
  "Still no? 😭",
  "Ok, last chance... 🥺",
  "Just click Yes already! 🤝"
];

const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const questionContent = document.getElementById('question-content');
const successContent = document.getElementById('success-content');

if (noBtn && yesBtn) {
  noBtn.addEventListener('click', () => {
    noCount++;

    // 1. Change text of NO button
    const nextPrompt = noPrompts[Math.min(noCount, noPrompts.length - 1)];
    noBtn.textContent = nextPrompt;

    // 2. Make YES button grow bigger
    const scale = 1 + noCount * 0.4; // Grow by 40% each click
    yesBtn.style.transform = `scale(${scale})`;

    // 3. Move NO button slightly to be playful
    const offsetRange = 35;
    const randomX = (Math.random() - 0.5) * offsetRange;
    const randomY = (Math.random() - 0.5) * offsetRange;
    noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;

    // If clicked too many times, hide the NO button
    if (noCount >= 9) {
      noBtn.style.display = 'none';
    }
  });

  yesBtn.addEventListener('click', () => {
    questionContent.style.display = 'none';
    successContent.style.display = 'block';

    // Play celebratory high notes
    if (musicBox) {
      musicBox.playNote(783.99, 0.4); // G5
      setTimeout(() => musicBox.playNote(987.77, 0.4), 120); // B5
      setTimeout(() => musicBox.playNote(1046.50, 0.6), 240); // C6
    }
  });
}


/* --- Close Card / Back to Stack Navigation --- */

document.getElementById('close-card-btn').addEventListener('click', () => {
  // Try closing the tab/window
  window.close();
  // Fallback if browser blocks tab closing (e.g. opened directly rather than script)
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 100);
});
