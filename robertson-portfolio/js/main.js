/* ============================================================
   ROBERTSON PORTFOLIO — main.js
   1. Scroll animations
   2. Portfolio filter (All / Flyers / Websites / Videos)
   3. Lightbox — tap to expand, swipe to navigate, video support
   4. Contact form
   5. Active nav highlight
============================================================ */


/* ============================================================
   1. SCROLL ANIMATIONS
============================================================ */
const fadeElements = document.querySelectorAll('.fade-up');

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      scrollObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeElements.forEach(el => scrollObserver.observe(el));


/* ============================================================
   2. PORTFOLIO FILTER
   Each .portfolio-item has a data-category attribute:
   "flyer" | "website" | "video"
   Clicking a filter button shows only matching items.
============================================================ */
const filterBtns  = document.querySelectorAll('.filter-btn');
const emptyMsg    = document.getElementById('portfolio-empty');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    // Re-collect items each time (in case of dynamic additions)
    const allItems = document.querySelectorAll('.portfolio-item');
    let visible = 0;

    allItems.forEach(item => {
      const match = filter === 'all' || item.dataset.category === filter;
      item.classList.toggle('hidden', !match);
      if (match) visible++;
    });

    // Show empty state if nothing matches
    if (emptyMsg) emptyMsg.style.display = visible === 0 ? 'block' : 'none';

    // Rebuild the lightbox item list after filtering
    buildLightboxItems();
  });
});


/* ============================================================
   3. LIGHTBOX
   - Click/tap a card to open
   - Arrow buttons or swipe left/right to navigate
   - Videos play automatically in the lightbox
   - Escape or tap backdrop to close
============================================================ */

let lightboxItems = []; // visible items only (respects current filter)
let currentIndex  = 0;

function buildLightboxItems() {
  lightboxItems = Array.from(
    document.querySelectorAll('.portfolio-item:not(.hidden)')
  );
}
buildLightboxItems(); // initial build

// Inject lightbox markup
const backdrop = document.createElement('div');
backdrop.className = 'lightbox-backdrop';
backdrop.innerHTML = `
  <div class="lightbox-inner">
    <button class="lightbox-close" aria-label="Close">&#x2715;</button>
    <button class="lightbox-prev" aria-label="Previous">&#8592;</button>
    <button class="lightbox-next" aria-label="Next">&#8594;</button>
    <img  class="lightbox-img"   src="" alt="" style="display:none" />
    <video class="lightbox-video" controls playsinline style="display:none"></video>
    <div  class="lightbox-fallback-bg" style="display:none; width:100%; height:340px; border-radius:2px;"></div>
    <div class="lightbox-info">
      <div>
        <h3 class="lightbox-title"></h3>
        <p  class="lightbox-desc"></p>
      </div>
    </div>
  </div>
`;
document.body.appendChild(backdrop);

const lbImg      = backdrop.querySelector('.lightbox-img');
const lbVideo    = backdrop.querySelector('.lightbox-video');
const lbFallback = backdrop.querySelector('.lightbox-fallback-bg');
const lbTitle    = backdrop.querySelector('.lightbox-title');
const lbDesc     = backdrop.querySelector('.lightbox-desc');
const closeBtn   = backdrop.querySelector('.lightbox-close');
const prevBtn    = backdrop.querySelector('.lightbox-prev');
const nextBtn    = backdrop.querySelector('.lightbox-next');

const gradients = {
  p1: 'linear-gradient(160deg, #1a1a1e, #0f1a0a)',
  p2: 'linear-gradient(160deg, #1a0f0a, #1a1a1e)',
  p3: 'linear-gradient(160deg, #0a0f1a, #0a1a14)',
  p4: 'linear-gradient(160deg, #1a1518, #100a1a)',
};

function openLightbox(index) {
  currentIndex   = index;
  const item     = lightboxItems[index];
  if (!item) return;

  const imgEl    = item.querySelector('.portfolio-img');
  const title    = item.querySelector('.portfolio-overlay h3');
  const desc     = item.querySelector('.portfolio-overlay p');
  const videoSrc = item.dataset.video || '';

  // Reset all media
  lbImg.style.display      = 'none';
  lbVideo.style.display    = 'none';
  lbFallback.style.display = 'none';
  lbVideo.pause();
  lbVideo.src = '';

  if (videoSrc) {
    // Video item
    lbVideo.src           = videoSrc;
    lbVideo.style.display = 'block';
    lbVideo.load();
    lbVideo.play().catch(() => {}); // autoplay (may be blocked by browser)
  } else if (imgEl && imgEl.complete && imgEl.naturalWidth > 0) {
    // Image loaded successfully
    lbImg.src           = imgEl.src;
    lbImg.alt           = imgEl.alt || '';
    lbImg.style.display = 'block';
  } else {
    // Fallback gradient
    const thumbClass          = ['p1','p2','p3','p4'].find(c => item.querySelector('.' + c));
    lbFallback.style.background = gradients[thumbClass] || '#18181b';
    lbFallback.style.display  = 'block';
  }

  lbTitle.textContent = title ? title.textContent : '';
  lbDesc.textContent  = desc  ? desc.textContent  : '';

  // Arrow visibility
  prevBtn.style.opacity = index === 0 ? '0.25' : '1';
  nextBtn.style.opacity = index === lightboxItems.length - 1 ? '0.25' : '1';

  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  backdrop.classList.remove('open');
  document.body.style.overflow = '';
  lbVideo.pause();
  lbVideo.src = '';
}

function showPrev() { if (currentIndex > 0) openLightbox(currentIndex - 1); }
function showNext() { if (currentIndex < lightboxItems.length - 1) openLightbox(currentIndex + 1); }

// Open on card tap/click
document.getElementById('portfolio-grid').addEventListener('click', (e) => {
  const item = e.target.closest('.portfolio-item');
  if (!item || item.classList.contains('hidden')) return;
  const index = lightboxItems.indexOf(item);
  if (index !== -1) openLightbox(index);
});

// Controls
backdrop.addEventListener('click', e => { if (e.target === backdrop) closeLightbox(); });
closeBtn.addEventListener('click', closeLightbox);
prevBtn.addEventListener('click', e => { e.stopPropagation(); showPrev(); });
nextBtn.addEventListener('click', e => { e.stopPropagation(); showNext(); });

// Keyboard
document.addEventListener('keydown', e => {
  if (!backdrop.classList.contains('open')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  showPrev();
  if (e.key === 'ArrowRight') showNext();
});

// Swipe
let touchStartX = 0;
backdrop.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
backdrop.addEventListener('touchend',   e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) diff > 0 ? showNext() : showPrev();
}, { passive: true });


/* ============================================================
   4. CONTACT FORM
   To send real emails, sign up at formspree.io (free),
   then replace YOUR_FORM_ID in the fetch URL below.
============================================================ */
const sendBtn      = document.getElementById('send-btn');
const nameInput    = document.getElementById('name');
const emailInput   = document.getElementById('email');
const messageInput = document.getElementById('message');
const feedback     = document.getElementById('form-feedback');

if (sendBtn) {
  sendBtn.addEventListener('click', () => {
    const name    = nameInput.value.trim();
    const email   = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !email || !message) { showFeedback('Please fill in all fields.', 'error'); return; }
    if (!isValidEmail(email))        { showFeedback('Please enter a valid email address.', 'error'); return; }

    // Uncomment when you have a Formspree ID:
    // fetch('https://formspree.io/f/YOUR_FORM_ID', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ name, email, message })
    // }).then(r => r.ok
    //   ? showFeedback("Message sent! I'll be in touch soon.", 'success')
    //   : showFeedback('Something went wrong. Try again.', 'error')
    // );

    showFeedback("Message sent! I'll get back to you soon.", 'success');
    nameInput.value = emailInput.value = messageInput.value = '';
  });
}

function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
function showFeedback(msg, type) {
  if (!feedback) return;
  feedback.textContent = msg;
  feedback.style.color = type === 'error' ? '#ff6b6b' : 'var(--accent)';
  setTimeout(() => { feedback.textContent = ''; }, 5000);
}


/* ============================================================
   5. ACTIVE NAV HIGHLIGHT
============================================================ */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--text)' : '';
      });
    }
  });
}, { threshold: 0.4 }).observe
// observe all sections
; sections.forEach(s => {
  new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--text)' : '';
        });
      }
    });
  }, { threshold: 0.4 }).observe(s);
});
