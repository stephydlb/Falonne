// menu toggle
document.getElementById('menu-toggle').addEventListener('click', function(){
  document.getElementById('nav-list').classList.toggle('show');
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const target = document.querySelector(a.getAttribute('href'));
    if(target){ e.preventDefault(); target.scrollIntoView({behavior:'smooth', block:'start'}); }
    // close mobile nav if open
    const nav = document.getElementById('nav-list');
    if(nav.classList.contains('show')) nav.classList.remove('show');
  });
});

// Contact form -> open WhatsApp with prefilled message
function sendForm(){
  const name = encodeURIComponent(document.getElementById('name').value.trim());
  const phone = document.getElementById('phone').value.trim();
  const msg = encodeURIComponent(document.getElementById('message').value.trim());
  // ensure number is in international format, replace below with your number if you want the message to be sent to you
  const businessNumber = "241077739097"; // <-- Remplace avec ton numéro +241...
  const text = `Demande de réservation de ${name}. Téléphone: ${phone}. Message: ${msg}`;
  const url = `https://wa.me/${businessNumber}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

document.addEventListener('DOMContentLoaded', function(){
  const reveals = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }

  // Ripple effect for .btn
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function addRipple(e){
    if(prefersReduced) return;
    const btn = e.currentTarget;
    const existing = btn.querySelector('.ripple');
    if(existing) existing.remove();
    const circle = document.createElement('span');
    const diameter = Math.max(btn.clientWidth, btn.clientHeight);
    const rect = btn.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - diameter/2}px`;
    circle.style.top = `${e.clientY - rect.top - diameter/2}px`;
    circle.classList.add('ripple');
    btn.appendChild(circle);
    setTimeout(()=>circle.remove(), 650);
  }
  document.querySelectorAll('.btn').forEach(b=>{
    b.addEventListener('click', addRipple);
  });

  // Press animation for .btn on pointer/keyboard
  function triggerPressAnim(el){
    if(!el) return;
    el.classList.remove('press-anim');
    // Force reflow to restart animation
    // eslint-disable-next-line no-unused-expressions
    void el.offsetWidth;
    el.classList.add('press-anim');
    const remove = ()=>{ el.classList.remove('press-anim'); el.removeEventListener('animationend', remove); };
    el.addEventListener('animationend', remove);
  }
  document.querySelectorAll('.btn').forEach(b=>{
    b.addEventListener('pointerdown', ()=> triggerPressAnim(b));
    b.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter' || e.key === ' '){ triggerPressAnim(b); }
    });
  });

  // Press animation for floating WhatsApp FAB
  const fab = document.getElementById('fab-chat');
  if(fab){
    fab.addEventListener('pointerdown', ()=> triggerPressAnim(fab));
    fab.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter' || e.key === ' '){ triggerPressAnim(fab); }
    });
  }

  // Parallax hero background
  const heroSlides = Array.from(document.querySelectorAll('.hero-slides img'));
  const hero = document.getElementById('hero');
  const dotsWrap = document.querySelector('.hero-indicators');
  if(heroSlides.length > 1){
    let idx = heroSlides.findIndex(img=>img.classList.contains('show'));
    if(idx < 0) idx = 0;
    let timer = null;
    function show(i){
      heroSlides[idx].classList.remove('show');
      idx = (i + heroSlides.length) % heroSlides.length;
      heroSlides[idx].classList.add('show');
      if(dotsWrap){
        dotsWrap.querySelectorAll('button').forEach((b,j)=>b.classList.toggle('active', j===idx));
      }
    }
    function start(){ if(timer) return; timer = setInterval(()=> show(idx+1), 2500); }
    function stop(){ if(timer){ clearInterval(timer); timer = null; } }
    // Build dots
    if(dotsWrap){
      dotsWrap.innerHTML = heroSlides.map((_,i)=>`<button aria-label="Aller au slide ${i+1}"></button>`).join('');
      dotsWrap.querySelectorAll('button').forEach((btn,i)=>{
        btn.addEventListener('click', ()=>{ stop(); show(i); start(); });
      });
      dotsWrap.querySelectorAll('button')[idx]?.classList.add('active');
    }
    // Pause on hover/focus within hero
    if(hero){
      hero.addEventListener('mouseenter', stop);
      hero.addEventListener('mouseleave', start);
      hero.addEventListener('focusin', stop);
      hero.addEventListener('focusout', start);
    }
    start();
  }

  // Accent hue/lightness shift on scroll
  if(!prefersReduced){
    const root = document.documentElement;
    const shift = ()=>{
      const h = 15 + Math.min(8, window.scrollY/200); // 0..8
      const l = 72 - Math.min(6, window.scrollY/400); // 72..66
      root.style.setProperty('--accent-h', h.toFixed(1));
      root.style.setProperty('--accent-l', l.toFixed(1));
    };
    shift();
    window.addEventListener('scroll', shift, {passive:true});
  }

  // 3D Tilt on cards and gallery images
  if(window.matchMedia('(pointer:fine)').matches && !prefersReduced){
    function attachTilt(el){
      const damp = 20; // higher = slower tilt
      function move(e){
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width/2;
        const cy = r.top + r.height/2;
        const dx = (e.clientX - cx) / r.width; // -0.5..0.5
        const dy = (e.clientY - cy) / r.height;
        const rx = Math.max(-10, Math.min(10, -dy*18));
        const ry = Math.max(-10, Math.min(10, dx*18));
        el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      }
      function leave(){
        el.style.transform = 'rotateX(0deg) rotateY(0deg)';
      }
      el.addEventListener('mousemove', move);
      el.addEventListener('mouseleave', leave);
    }
    document.querySelectorAll('.cards .card, .gallery .grid img').forEach(attachTilt);
  }

  // Cursor-follow shadow in background
  if(window.matchMedia('(pointer:fine)').matches && !prefersReduced){
    const r = document.documentElement;
    const update = (e)=>{
      r.style.setProperty('--mx', e.clientX + 'px');
      r.style.setProperty('--my', e.clientY + 'px');
    };
    window.addEventListener('mousemove', update, {passive:true});
  }
      });
    },{threshold:0.2});
    reveals.forEach(el=>io.observe(el));
  }else{
    reveals.forEach(el=>el.classList.add('in'));
  }

  const slides = Array.from(document.querySelectorAll('.testimonials .slide'));
  if(slides.length>1){
    let i = 0;
    setInterval(()=>{
      slides[i].classList.remove('active');
      i = (i+1) % slides.length;
      slides[i].classList.add('active');
    }, 4000);
  }

  // Theme toggle with persistence
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  const savedTheme = localStorage.getItem('theme');
  if(savedTheme === 'dark') body.classList.add('theme-dark');
  if(themeToggle){
    themeToggle.addEventListener('click', ()=>{
      body.classList.toggle('theme-dark');
      localStorage.setItem('theme', body.classList.contains('theme-dark') ? 'dark' : 'light');
    });
  }

  // i18n FR/EN
  const dict = {
    fr: {
      heroTitle: "Élégance et soin, au cœur de Libreville.",
      heroDesc: "Manucure et pédicure professionnelles à domicile ou en salon — service chaleureux à Libreville.",
      book: "Prendre rendez-vous",
      seeServices: "Voir les services",
      servicesTitle: "Nos services",
      servicesLead: "Des soins adaptés, produits de qualité et finitions soignées.",
      galleryTitle: "Galerie",
      galleryLead: "Quelques réalisations — remplace ces images par les tiennes dès que tu es prêt.",
      testimonialsTitle: "Témoignages",
      contactTitle: "Contact & Réseaux",
      contactLead: "Disponible à Libreville — Réservations rapides via WhatsApp ou réseaux sociaux.",
      ctaWhatsapp: "WhatsApp",
      ctaFacebook: "Facebook",
      ctaTiktok: "TikTok",
      ctaInstagram: "Instagram",
      ctaEmail: "Email",
      footerHtml: "© <strong>Home Nail's 241</strong> — Libreville, Gabon • Site réalisé avec amour à Libreville • Politique de confidentialité (bientôt)"
    },
    en: {
      heroTitle: "Elegance and care, in the heart of Libreville.",
      heroDesc: "Professional manicure and pedicure at home or in-salon — warm service in Libreville.",
      book: "Book an appointment",
      seeServices: "See services",
      servicesTitle: "Our services",
      servicesLead: "Tailored care, quality products and meticulous finishes.",
      galleryTitle: "Gallery",
      galleryLead: "Some works — replace these images with yours when ready.",
      testimonialsTitle: "Testimonials",
      contactTitle: "Contact & Socials",
      contactLead: "Available in Libreville — Quick bookings via WhatsApp or social media.",
      ctaWhatsapp: "WhatsApp",
      ctaFacebook: "Facebook",
      ctaTiktok: "TikTok",
      ctaInstagram: "Instagram",
      ctaEmail: "Email",
      footerHtml: "© <strong>Home Nail's 241</strong> — Libreville, Gabon • Made with love in Libreville • Privacy policy (soon)",
      newsletterTitle: "Stay updated",
      newsletterButton: "Subscribe"
    }
  };

  function applyLang(lang){
    const t = dict[lang] || dict.fr;
    const byId = (id, prop='text')=>{
      const el = document.getElementById(id);
      if(!el) return;
      if(prop==='html') el.innerHTML = t[id] || el.innerHTML;
      else el.textContent = t[id] || el.textContent;
    };
    // Map keys to element IDs used above
    const map = [
      ['heroTitle','hero-title'],
      ['heroDesc','hero-desc'],
      ['book','book-label'],
      ['seeServices','see-services-label'],
      ['servicesTitle','services-title'],
      ['servicesLead','services-lead'],
      ['galleryTitle','gallery-title'],
      ['galleryLead','gallery-lead'],
      ['testimonialsTitle','testimonials-title'],
      ['contactTitle','contact-title'],
      ['contactLead','contact-lead'],
      ['ctaWhatsapp','cta-whatsapp'],
      ['ctaFacebook','cta-facebook'],
      ['ctaTiktok','cta-tiktok'],
      ['ctaInstagram','cta-instagram'],
      ['ctaEmail','cta-email']
    ];
    map.forEach(([key,id])=>{
      const el = document.getElementById(id);
      if(el){ el.textContent = t[key]; }
    });
    const footer = document.getElementById('footer-text');
    if(footer){ footer.innerHTML = t.footerHtml; }
    const nlTitle = document.getElementById('newsletter-title');
    if(nlTitle && t.newsletterTitle){ nlTitle.textContent = t.newsletterTitle; }
    const nlBtn = document.getElementById('newsletter-button');
    if(nlBtn && t.newsletterButton){ nlBtn.textContent = t.newsletterButton; }
    document.documentElement.lang = lang;
  }

  const langSelect = document.getElementById('lang-select');
  const savedLang = localStorage.getItem('lang') || 'fr';
  if(langSelect){
    langSelect.value = savedLang;
    applyLang(savedLang);
    langSelect.addEventListener('change', ()=>{
      const lang = langSelect.value;
      localStorage.setItem('lang', lang);
      applyLang(lang);
    });
  }else{
    applyLang(savedLang);
  }

  // PWA: register service worker
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js').catch(()=>{/* silent */});
  }

  // Newsletter simple handler
  const nlBtn = document.getElementById('newsletter-btn');
  const nlEmail = document.getElementById('newsletter-email');
  if(nlBtn && nlEmail){
    nlBtn.addEventListener('click', ()=>{
      const email = (nlEmail.value || '').trim();
      if(!email) return;
      try{
        const key = 'falonne_newsletter_emails';
        const list = JSON.parse(localStorage.getItem(key) || '[]');
        if(!list.includes(email)) list.push(email);
        localStorage.setItem(key, JSON.stringify(list));
      }catch{}
      const subject = encodeURIComponent('Inscription newsletter / Newsletter signup');
      const body = encodeURIComponent(`Bonjour,\n\nJe souhaite recevoir les nouveautés.\nEmail: ${email}`);
      window.location.href = `mailto:contact@falonneservice.com?subject=${subject}&body=${body}`;
    });
  }

  // WhatsApp Group join for memberships
  const WHATSAPP_GROUP_URL = 'https://chat.whatsapp.com/HGxmFavBQUSAdRWbY66w5u?mode=wwt'; // Lien du groupe fourni
  document.querySelectorAll('[data-join-whatsapp="group"]').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      e.preventDefault();
      const url = WHATSAPP_GROUP_URL && !WHATSAPP_GROUP_URL.includes('REPLACE')
        ? WHATSAPP_GROUP_URL
        : 'https://wa.me/241077739097';
      window.open(url, '_blank', 'noopener');
    });
  });

  // Header shadow on scroll
  const header = document.querySelector('.site-header');
  const setHeaderShadow = () => {
    if(!header) return;
    if(window.scrollY > 10) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  setHeaderShadow();
  window.addEventListener('scroll', setHeaderShadow, {passive:true});

  // Scroll-spy for nav links
  const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));
  const sections = ['services','pricing','gallery','about','contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);
  if('IntersectionObserver' in window && sections.length){
    const spy = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        const id = entry.target.id;
        const link = navLinks.find(a => a.getAttribute('href') === `#${id}`);
        if(!link) return;
        if(entry.isIntersecting){
          navLinks.forEach(a=>a.classList.remove('active'));
          link.classList.add('active');
        }
      });
    }, {threshold:0.5, rootMargin:'-20% 0px -60% 0px'});
    sections.forEach(sec=>spy.observe(sec));
  }
});
