/* ============================================
   FOR SOPHIE — Interactions
   ============================================ */

(function () {
  'use strict';

  /* --------------------------------------------
     1. SCROLL-TRIGGERED CHAPTER REVEALS & BLEND
     -------------------------------------------- */
  const chapters = document.querySelectorAll('.chapter');
  const bgLayers = document.querySelectorAll('.bg-layer');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          
          // Background Blending Logic
          const targetId = entry.target.id;
          bgLayers.forEach(layer => {
            if (layer.getAttribute('data-bg') === targetId) {
              layer.classList.add('active');
            } else {
              layer.classList.remove('active');
            }
          });
        }
      });
    },
    { threshold: 0.4 } // triggers when 40% of the chapter is in view
  );

  chapters.forEach((ch) => revealObserver.observe(ch));

  /* --------------------------------------------
     2. ACTIVE CHAPTER NAV DOTS
     -------------------------------------------- */
  const navLinks = document.querySelectorAll('.chapter-nav a');

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    },
    { threshold: 0.5 }
  );

  chapters.forEach((ch) => navObserver.observe(ch));

  /* --------------------------------------------
     3. CHAPTER I — COFFEE MUG CLICK
     -------------------------------------------- */
  const mug = document.getElementById('mug');
  if (mug) {
    mug.addEventListener('click', () => {
      const steam = mug.querySelector('.steam');
      steam.style.animation = 'none';
      // Force reflow to restart animation
      void steam.offsetWidth;
      steam.style.animation = '';
      mug.style.transform = 'translateY(-10px) rotate(-8deg)';
      setTimeout(() => {
        mug.style.transform = '';
      }, 400);
    });
  }

  /* --------------------------------------------
     4. CHAPTER II — D20 DICE ROLLER
     -------------------------------------------- */
  const d20 = document.getElementById('d20');
  const d20Number = d20 ? d20.querySelector('.d20-number') : null;
  let rolling = false;

  function rollD20() {
    if (!d20 || rolling) return;
    rolling = true;
    d20.classList.remove('nat20');
    d20.classList.add('rolling');

    // Animate through random numbers
    let ticks = 0;
    const shuffle = setInterval(() => {
      d20Number.textContent = Math.floor(Math.random() * 20) + 1;
      ticks++;
      if (ticks > 8) clearInterval(shuffle);
    }, 80);

    setTimeout(() => {
      // Since it's her birthday/poem, always let her roll a Nat 20!
      const result = 20; 
      d20Number.textContent = result;
      d20.classList.remove('rolling');
      if (result === 20) {
        d20.classList.add('nat20');
      }
      rolling = false;
    }, 800);
  }

  if (d20) {
    d20.addEventListener('click', rollD20);
    d20.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        rollD20();
      }
    });
  }

/* --------------------------------------------
     5. CHAPTER V — BEE FOLLOWS CURSOR
     -------------------------------------------- */
  const bee = document.getElementById('bee');
  const honeyChapter = document.getElementById('chapter-5');
  const honeyStage = document.querySelector('.honey-stage'); // Added target container

  if (bee && honeyChapter && honeyStage) {
    let beeX = -100;
    let beeY = -100;
    let targetX = window.innerWidth * 0.5;
    let targetY = window.innerHeight * 0.3;
    let beeActive = false;
    let hasCursor = false;

    // Only move toward cursor when honey chapter is in view
    const beeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          beeActive = entry.isIntersecting;
        });
      },
      { threshold: 0.3 }
    );
    beeObserver.observe(honeyChapter);

    honeyChapter.addEventListener('mousemove', (e) => {
      // FIX: Calculate mouse position relative to the honey-stage, not the whole window
      const stageRect = honeyStage.getBoundingClientRect();
      targetX = e.clientX - stageRect.left;
      targetY = e.clientY - stageRect.top;
      
      if (!hasCursor) {
        // Snap to cursor on first move
        beeX = targetX;
        beeY = targetY;
        hasCursor = true;
      }
    });

    function animateBee() {
      if (beeActive && hasCursor) {
        const t = Date.now() / 1000;
        // Loose orbit so the bee buzzes NEAR the cursor
        const orbitX = Math.sin(t * 2.4) * 22 + Math.sin(t * 0.9) * 10;
        const orbitY = Math.cos(t * 1.9) * 16 + Math.cos(t * 1.1) * 8;
        const aimX = targetX + orbitX;
        const aimY = targetY - 18 + orbitY; 
        beeX += (aimX - beeX) * 0.14;
        beeY += (aimY - beeY) * 0.14;

        // Flip the bee if it's heading left
        const facing = aimX < beeX - 2 ? ' scaleX(-1)' : '';
        bee.style.transform = 'translate(' + (beeX - 20) + 'px, ' + (beeY - 14) + 'px)' + facing;
      }
      requestAnimationFrame(animateBee);
    }
    animateBee();
  }

})();