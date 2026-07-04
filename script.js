/* ==========================================================================
   DR. ATTIYA'S DENTAL EMPIRE — SCRIPT
   Vanilla JS only. Organised by feature, each self-contained.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------
     1. STICKY NAVBAR — style change on scroll
  ------------------------------------------------------------------ */
  const header = document.getElementById('siteHeader');
  const toggleHeaderStyle = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  toggleHeaderStyle();
  window.addEventListener('scroll', toggleHeaderStyle, { passive: true });

  /* ------------------------------------------------------------------
     2. MOBILE HAMBURGER MENU
  ------------------------------------------------------------------ */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');

  const openMobileNav = () => {
    mobileNav.classList.add('open');
    mobileNavOverlay.classList.add('open');
    hamburgerBtn.classList.add('active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    mobileNav.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const closeMobileNav = () => {
    mobileNav.classList.remove('open');
    mobileNavOverlay.classList.remove('open');
    hamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  hamburgerBtn.addEventListener('click', () => {
    mobileNav.classList.contains('open') ? closeMobileNav() : openMobileNav();
  });
  mobileNavOverlay.addEventListener('click', closeMobileNav);
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMobileNav));

  /* ------------------------------------------------------------------
     3. SMOOTH SCROLL for in-page anchor links (native scroll-behavior
        already handles most of this; this covers the mobile nav close
        + focus management for accessibility)
  ------------------------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        }
      }
    });
  });

  /* ------------------------------------------------------------------
     4. SCROLL-TRIGGERED REVEAL ANIMATIONS (Intersection Observer)
  ------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger children slightly for a smoother group reveal
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ------------------------------------------------------------------
     5. SUBTLE PARALLAX ON HERO IMAGE
  ------------------------------------------------------------------ */
  const heroImg = document.getElementById('heroImg');
  const hero = document.querySelector('.hero');
  if (heroImg && hero) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < hero.offsetHeight) {
        heroImg.style.transform = `scale(1.08) translateY(${scrollY * 0.15}px)`;
      }
    }, { passive: true });
  }

  /* ------------------------------------------------------------------
     6. TESTIMONIAL CAROUSEL — autoplay + manual arrows + dots
  ------------------------------------------------------------------ */
  const track = document.getElementById('carouselTrack');
  const slides = track ? Array.from(track.children) : [];
  const dotsWrap = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let currentSlide = 0;
  let autoplayTimer;

  if (track && slides.length) {
    // Build dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function updateCarousel() {
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
    }

    function goToSlide(index) {
      currentSlide = (index + slides.length) % slides.length;
      updateCarousel();
      restartAutoplay();
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    function startAutoplay() {
      autoplayTimer = setInterval(nextSlide, 6000);
    }
    function restartAutoplay() {
      clearInterval(autoplayTimer);
      startAutoplay();
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Pause autoplay when hovering / focusing the carousel
    const carousel = document.getElementById('testimonialCarousel');
    carousel.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
    carousel.addEventListener('mouseleave', startAutoplay);

    startAutoplay();
  }

  /* ------------------------------------------------------------------
     7. FAQ ACCORDION — expand/collapse
  ------------------------------------------------------------------ */
  const accordionTriggers = document.querySelectorAll('.accordion-trigger');
  accordionTriggers.forEach(trigger => {
    const panel = trigger.nextElementSibling;

    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      // Close all other panels for a clean single-open accordion
      accordionTriggers.forEach(other => {
        if (other !== trigger) {
          other.setAttribute('aria-expanded', 'false');
          other.nextElementSibling.style.maxHeight = null;
        }
      });

      if (isOpen) {
        trigger.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = null;
      } else {
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  /* ------------------------------------------------------------------
     8. GALLERY LIGHTBOX
  ------------------------------------------------------------------ */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const fullSrc = item.getAttribute('data-full');
      const altText = item.querySelector('img').getAttribute('alt');
      lightboxImg.setAttribute('src', fullSrc);
      lightboxImg.setAttribute('alt', altText);
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  /* ------------------------------------------------------------------
     9. BACK TO TOP BUTTON
  ------------------------------------------------------------------ */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ------------------------------------------------------------------
     10. APPOINTMENT FORM VALIDATION (client-side, real-time)
  ------------------------------------------------------------------ */
  const appointmentForm = document.getElementById('appointmentForm');
  const formStatus = document.getElementById('formStatus');

  const validators = {
    fullName: (value) => value.trim().length >= 2 ? '' : 'Please enter your full name.',
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? '' : 'Please enter a valid email address.',
    phone: (value) => /^[0-9+\-\s()]{7,15}$/.test(value.trim()) ? '' : 'Please enter a valid phone number.',
    department: (value) => value ? '' : 'Please select a department.',
    prefDate: (value) => {
      if (!value) return 'Please choose a preferred date.';
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const chosen = new Date(value);
      return chosen >= today ? '' : 'Please choose a date from today onward.';
    },
    prefTime: (value) => value ? '' : 'Please choose a preferred time.'
  };

  function validateField(field) {
    const validator = validators[field.name];
    if (!validator) return true;
    const errorEl = document.getElementById(field.id + 'Error');
    const message = validator(field.value);
    const formField = field.closest('.form-field');

    if (message) {
      formField.classList.add('invalid');
      if (errorEl) errorEl.textContent = message;
      return false;
    } else {
      formField.classList.remove('invalid');
      if (errorEl) errorEl.textContent = '';
      return true;
    }
  }

  if (appointmentForm) {
    // Real-time validation as the user types/selects
    Object.keys(validators).forEach(name => {
      const field = appointmentForm.elements[name];
      if (field) {
        field.addEventListener('input', () => validateField(field));
        field.addEventListener('blur', () => validateField(field));
      }
    });

    // Prevent picking a date in the past
    const dateField = appointmentForm.elements['prefDate'];
    if (dateField) {
      const today = new Date().toISOString().split('T')[0];
      dateField.setAttribute('min', today);
    }

    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isFormValid = true;

      Object.keys(validators).forEach(name => {
        const field = appointmentForm.elements[name];
        if (field && !validateField(field)) isFormValid = false;
      });

      if (!isFormValid) {
        formStatus.textContent = 'Please fix the highlighted fields and try again.';
        formStatus.style.color = '#C15C4A';
        return;
      }

      // Simulate a successful submission (no backend wired up)
      formStatus.style.color = 'var(--color-teal)';
      formStatus.textContent = 'Thank you! Your appointment request has been received — we will confirm shortly.';
      appointmentForm.reset();
    });
  }

  /* ------------------------------------------------------------------
     11. NEWSLETTER FORM (simple email validation)
  ------------------------------------------------------------------ */
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterStatus = document.getElementById('newsletterStatus');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('newsletterEmail');
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());

      if (valid) {
        newsletterStatus.textContent = 'Subscribed! Watch your inbox for updates.';
        newsletterForm.reset();
      } else {
        newsletterStatus.textContent = 'Please enter a valid email address.';
      }
    });
  }

  /* ------------------------------------------------------------------
     12. FOOTER YEAR
  ------------------------------------------------------------------ */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
