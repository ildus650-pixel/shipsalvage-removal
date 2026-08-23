/* ==========================================================================
   Ship Salvage & Wreck Removal — main.js
   Language switcher (EN/RU) · mobile nav · header scroll · contact form
   ========================================================================== */

'use strict';

/* --------------------------------------------------------------------------
   CONFIG — email, на который приходят заявки с формы (через FormSubmit.co).
   ВАЖНО: при первой заявке FormSubmit пришлёт на этот адрес письмо-активацию —
   его нужно подтвердить один раз, и все заявки начнут приходить на почту.
   -------------------------------------------------------------------------- */
const CONFIG = {
  CONTACT_EMAIL: 'ildus650@gmail.com'
};

/* --------------------------------------------------------------------------
   i18n dictionary. Каждый ключ обязан совпадать с data-i18n в index.html
   -------------------------------------------------------------------------- */
const I18N = {
  en: {
    'nav-home': 'Home',
    'nav-services': 'Services',
    'nav-about': 'About Us',
    'nav-contacts': 'Contacts',
    'nav-coverage': 'Coverage',
    'nav-wrecks': 'Wrecks',
    'coverage-cta': 'Explore the Wreck Map',
    'aria-menu': 'Toggle menu',
    'aria-call': 'Call us',
    'coverage-kicker': 'Where We Work',
    'coverage-title': 'Global Reach, Far East Roots',
    'coverage-sub': 'Home base in the Russian Far East — projects and partners around the world.',
    'cov-vvo-title': 'Vladivostok',
    'cov-vvo-desc': 'Home base — Russian Far East',
    'cov-nakh-title': 'Nakhodka',
    'cov-nakh-desc': 'Key operating port',
    'cov-apac-title': 'Asia-Pacific',
    'cov-apac-desc': 'Presence region',
    'cov-me-title': 'Middle East',
    'cov-me-desc': 'Presence region',
    'cov-eu-title': 'Europe',
    'cov-eu-desc': 'Presence region',
    'cov-am-title': 'Americas',
    'cov-am-desc': 'Presence region',
    'wrecks-kicker': 'Shipwreck Database',
    'wrecks-title': 'Interactive Wreck Map',
    'wrecks-sub': 'Known wrecks from open data (OpenStreetMap, ODbL). Click a marker or a list item for details.',
    'wrecks-count-suffix': 'known wrecks',
    'wrecks-list-title': 'Wreck list',
    'wrecks-depth': 'Depth',
    'wrecks-year': 'Year',
    'wrecks-unknown': 'unknown',
    'wrecks-attr': 'Data © OpenStreetMap contributors (ODbL) via Overpass API',
    'wrecks-meta-desc': 'Interactive map of shipwrecks with names, years and depths. Open data from OpenStreetMap (ODbL).',
    'wrecks-filter-name': 'Search by name',
    'wrecks-empty': 'No wrecks match the filters',
    'f-all': 'All',
    'f-depth-all': 'Any depth',
    'f-depth-0': '0–20 m',
    'f-depth-1': '20–50 m',
    'f-depth-2': '50+ m',
    'f-depth-n': 'No data',
    'f-year-all': 'Any year',
    'f-year-before': 'Before 1900',
    'f-year-1900': '1900–1950',
    'f-year-1950': '1950–2000',
    'f-year-2000': 'After 2000',
    'f-year-n': 'No data',
    'f-reg-fe': 'Russian Far East',
    'f-reg-pacific': 'Pacific & SE Asia',
    'f-reg-indian': 'Indian Ocean',
    'f-reg-baltic': 'Baltic Sea',
    'f-reg-eu': 'Europe & Atlantic',
    'f-reg-med': 'Mediterranean',
    'f-reg-carib': 'Caribbean',
    'f-reg-us': 'North Atlantic (US)',
    'f-reset': 'Reset',
    'hero-kicker': 'Marine Salvage Contractor',
    'hero-title': 'Ship Salvage & Wreck Removal',
    'hero-sub': 'A global marine contractor with proven experience in the Russian Far East — lifting vessels up to 3,000 tonnes, underwater cutting, dewatering and full-cycle metal recycling.',
    'hero-btn-contact': 'Contact Us',
    'hero-btn-services': 'Our Services',
    'stats-1-value': '15+',
    'stats-1-label': 'Years of Experience',
    'stats-2-value': '120+',
    'stats-2-label': 'Projects Completed',
    'stats-3-value': '3,000 t',
    'stats-3-label': 'Max Lifting Capacity',
    'stats-4-value': '10+',
    'stats-4-label': 'Countries Served',
    'services-kicker': 'What We Do',
    'services-title': 'Our Services',
    'services-sub': 'A full range of salvage operations — from survey to clean waters.',
    'svc1-title': 'Ship Lifting up to 3,000 t',
    'svc1-desc': 'Heavy-lift salvage of sunken, grounded and stranded vessels using pontoons, cranes and airbag systems — planned operations and emergency response in harbours and open water.',
    'svc2-title': 'Underwater Cutting & Dismantling',
    'svc2-desc': 'Precision underwater cutting, hull demolition and structural dismantling performed by certified diving teams with specialised equipment.',
    'svc3-title': 'Dewatering & Pumping',
    'svc3-desc': 'High-capacity pumping of flooded compartments, engine rooms and cargo holds to stabilise and refloat vessels safely.',
    'svc4-title': 'Metal Recycling & Processing',
    'svc4-desc': 'Environmentally compliant removal, sorting and recycling of ferrous and non-ferrous metals from decommissioned vessels.',
    'about-kicker': 'About Us',
    'about-title': 'Experience in Primorye. Projects Worldwide.',
    'about-p1': 'Our team began in Primorsky Krai — the Russian Far East, one of the most demanding maritime regions in the world. In the ports of Vladivostok and Nakhodka we learned to work in harsh conditions: strong currents, cold waters, tight schedules.',
    'about-p2': 'Today we operate internationally, delivering salvage, wreck removal and recycling services to shipping companies, ports, insurers and government agencies.',
    'about-pt1': 'Own diving teams and heavy-lift equipment',
    'about-pt2': '24/7 emergency response',
    'about-pt3': 'Environmental compliance on every project',
    'about-pt4': 'Certified marine engineers',
    'about-cta': 'Discuss Your Project',
    'cta-title': 'Have a Vessel to Raise or Remove?',
    'cta-sub': 'Tell us about your project — we respond within 24 hours.',
    'cta-btn': 'Get a Quote',
    'contacts-kicker': 'Contact Us',
    'contacts-title': 'Get in Touch',
    'contacts-sub': 'Phone, email or Telegram — choose the way that suits you.',
    'c-phone-label': 'Phone',
    'c-email-label': 'Email',
    'c-tg-label': 'Telegram',
    'c-tg-hint': 'Fastest way to reach us — message our bot.',
    'c-tg-btn': 'Open Telegram Bot',
    'form-title': 'Send a Message',
    'form-name-label': 'Name',
    'form-email-label': 'Email',
    'form-message-label': 'Message',
    'form-name-ph': 'John Smith',
    'form-email-ph': 'you@company.com',
    'form-message-ph': 'Describe your vessel, its location and what needs to be done…',
    'form-btn': 'Send Message',
    'form-success': 'Thank you! Your message has been sent. We will contact you shortly.',
    'form-error': 'Please fill in all fields correctly.',
    'footer-tagline': 'Marine salvage, wreck removal and metal recycling — worldwide.',
    'footer-nav-title': 'Navigation',
    'footer-contacts-title': 'Contacts',
    'footer-rights': 'All rights reserved.',
    'meta-desc': 'International marine salvage contractor: ship lifting up to 3,000 tonnes, underwater cutting and dismantling, dewatering, metal recycling. Experience in the Russian Far East, projects worldwide.'
  },

  ru: {
    'nav-home': 'Главная',
    'nav-services': 'Услуги',
    'nav-about': 'О нас',
    'nav-contacts': 'Контакты',
    'nav-coverage': 'География',
    'nav-wrecks': 'Крушения',
    'coverage-cta': 'Смотреть карту крушений',
    'aria-menu': 'Открыть меню',
    'aria-call': 'Позвонить',
    'coverage-kicker': 'География работ',
    'coverage-title': 'Глобальный охват, корни на Дальнем Востоке',
    'coverage-sub': 'База — Дальний Восток России. Проекты и партнёры по всему миру.',
    'cov-vvo-title': 'Владивосток',
    'cov-vvo-desc': 'База — Дальний Восток России',
    'cov-nakh-title': 'Находка',
    'cov-nakh-desc': 'Ключевой порт работы',
    'cov-apac-title': 'Азиатско-Тихоокеанский регион',
    'cov-apac-desc': 'Регион присутствия',
    'cov-me-title': 'Ближний Восток',
    'cov-me-desc': 'Регион присутствия',
    'cov-eu-title': 'Европа',
    'cov-eu-desc': 'Регион присутствия',
    'cov-am-title': 'Америка',
    'cov-am-desc': 'Регион присутствия',
    'wrecks-kicker': 'База затонувших судов',
    'wrecks-title': 'Карта затонувших судов',
    'wrecks-sub': 'Крушения из открытых данных (OpenStreetMap, ODbL). Нажмите маркер или пункт списка для деталей.',
    'wrecks-count-suffix': 'известных крушений',
    'wrecks-list-title': 'Список крушений',
    'wrecks-depth': 'Глубина',
    'wrecks-year': 'Год',
    'wrecks-unknown': 'нет данных',
    'wrecks-attr': 'Данные © OpenStreetMap contributors (ODbL) через Overpass API',
    'wrecks-meta-desc': 'Интерактивная карта затонувших судов: названия, годы и глубины. Открытые данные OpenStreetMap (ODbL).',
    'wrecks-filter-name': 'Поиск по названию',
    'wrecks-empty': 'Ничего не найдено по фильтрам',
    'f-all': 'Все',
    'f-depth-all': 'Любая глубина',
    'f-depth-0': '0–20 м',
    'f-depth-1': '20–50 м',
    'f-depth-2': '50+ м',
    'f-depth-n': 'Нет данных',
    'f-year-all': 'Любой год',
    'f-year-before': 'До 1900',
    'f-year-1900': '1900–1950',
    'f-year-1950': '1950–2000',
    'f-year-2000': 'После 2000',
    'f-year-n': 'Нет данных',
    'f-reg-fe': 'Дальний Восток',
    'f-reg-pacific': 'Тихий океан и ЮВА',
    'f-reg-indian': 'Индийский океан',
    'f-reg-baltic': 'Балтийское море',
    'f-reg-eu': 'Европа и Атлантика',
    'f-reg-med': 'Средиземное море',
    'f-reg-carib': 'Карибский бассейн',
    'f-reg-us': 'Атлантика (США)',
    'f-reset': 'Сбросить',
    'hero-kicker': 'Морской подрядчик по подъёму судов',
    'hero-title': 'Подъём и утилизация затонувших судов',
    'hero-sub': 'Международный морской подрядчик с опытом на Дальнем Востоке России — подъём судов до 3 000 тонн, подводная резка, откачка воды и утилизация металла полного цикла.',
    'hero-btn-contact': 'Связаться',
    'hero-btn-services': 'Наши услуги',
    'stats-1-value': '15+',
    'stats-1-label': 'Лет опыта',
    'stats-2-value': '120+',
    'stats-2-label': 'Проектов выполнено',
    'stats-3-value': '3 000 т',
    'stats-3-label': 'Макс. грузоподъёмность',
    'stats-4-value': '10+',
    'stats-4-label': 'Стран присутствия',
    'services-kicker': 'Что мы делаем',
    'services-title': 'Наши услуги',
    'services-sub': 'Полный цикл спасательных работ — от обследования судна до чистой акватории.',
    'svc1-title': 'Подъём судов до 3 000 тонн',
    'svc1-desc': 'Тяжёлый судоподъём затонувших, севших на мель и аварийных судов с помощью понтонов, кранов и пневматических систем — плановые работы и аварийное реагирование в портах и открытом море.',
    'svc2-title': 'Подводная резка и демонтаж',
    'svc2-desc': 'Точная подводная резка, демонтаж корпусов и конструкций силами сертифицированных водолазных команд со специализированным оборудованием.',
    'svc3-title': 'Откачка воды (девотеринг)',
    'svc3-desc': 'Откачка воды из затопленных отсеков, машинных отделений и трюмов для безопасной стабилизации и подъёма судна.',
    'svc4-title': 'Утилизация и переработка металла',
    'svc4-desc': 'Экологически безопасный демонтаж, сортировка и переработка чёрных и цветных металлов списанных судов.',
    'about-kicker': 'О нас',
    'about-title': 'Опыт в Приморье. Проекты по всему миру.',
    'about-p1': 'Наша команда начинала в Приморском крае — на Дальнем Востоке России, в одном из самых сложных морских регионов мира. В портах Владивостока и Находки мы научились работать в суровых условиях: сильные течения, холодная вода, жёсткие сроки.',
    'about-p2': 'Сегодня мы работаем по всему миру: подъём судов, удаление затонувших объектов и утилизация — для судоходных компаний, портов, страховщиков и государственных структур.',
    'about-pt1': 'Собственные водолазные команды и тяжёлое оборудование',
    'about-pt2': 'Аварийное реагирование 24/7',
    'about-pt3': 'Соблюдение экологических норм на каждом проекте',
    'about-pt4': 'Сертифицированные морские инженеры',
    'about-cta': 'Обсудить ваш проект',
    'cta-title': 'Нужно поднять или утилизировать судно?',
    'cta-sub': 'Расскажите о вашем проекте — мы ответим в течение 24 часов.',
    'cta-btn': 'Получить расчёт',
    'contacts-kicker': 'Контакты',
    'contacts-title': 'Свяжитесь с нами',
    'contacts-sub': 'Телефон, email или Telegram — выберите удобный способ.',
    'c-phone-label': 'Телефон',
    'c-email-label': 'Email',
    'c-tg-label': 'Telegram',
    'c-tg-hint': 'Самый быстрый способ — напишите нашему боту.',
    'c-tg-btn': 'Открыть Telegram-бот',
    'form-title': 'Отправить сообщение',
    'form-name-label': 'Имя',
    'form-email-label': 'Email',
    'form-message-label': 'Сообщение',
    'form-name-ph': 'Иван Иванов',
    'form-email-ph': 'you@company.com',
    'form-message-ph': 'Опишите судно, его местонахождение и что нужно сделать…',
    'form-btn': 'Отправить сообщение',
    'form-success': 'Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.',
    'form-error': 'Пожалуйста, заполните все поля корректно.',
    'footer-tagline': 'Подъём судов, удаление затонувших объектов и утилизация металла — по всему миру.',
    'footer-nav-title': 'Навигация',
    'footer-contacts-title': 'Контакты',
    'footer-rights': 'Все права защищены.',
    'meta-desc': 'Международный морской подрядчик: подъём судов до 3 000 тонн, подводная резка и демонтаж, откачка воды, утилизация металла. Опыт на Дальнем Востоке России, проекты по всему миру.'
  }
};

/* --------------------------------------------------------------------------
   Language
   -------------------------------------------------------------------------- */
const STORAGE_KEY = 'sswr-lang';
let currentLang = 'en';

function detectLang() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'en' || saved === 'ru') return saved;
  return (navigator.language || '').toLowerCase().startsWith('ru') ? 'ru' : 'en';
}

function applyLang(lang) {
  const dict = I18N[lang];
  if (!dict) return;

  document.documentElement.setAttribute('lang', lang);

  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) el.textContent = dict[key];
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key] !== undefined) el.setAttribute('placeholder', dict[key]);
  });

  document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
    const key = el.getAttribute('data-i18n-aria');
    if (dict[key] !== undefined) el.setAttribute('aria-label', dict[key]);
  });

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    const key = document.body.dataset.page === 'wrecks' ? 'meta-desc-wrecks' : 'meta-desc';
    if (dict[key]) metaDesc.setAttribute('content', dict[key]);
  }

  document.querySelectorAll('.lang__btn').forEach(function (btn) {
    const active = btn.getAttribute('data-lang') === lang;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', String(active));
  });

  // Обновляем попапы карты при смене языка
  if (markers.length) {
    markers.forEach(function (m, i) {
      m.setPopupContent(popupContent(mapPoints[i]));
    });
  }

  currentLang = lang;

  // Событие для страниц с динамическим контентом (список крушений и т.п.)
  document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang } }));
}

function setLang(lang) {
  applyLang(lang);
  localStorage.setItem(STORAGE_KEY, lang);
}

/* --------------------------------------------------------------------------
   Mobile navigation + header scroll
   -------------------------------------------------------------------------- */
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

function closeNav() {
  nav.classList.remove('is-open');
  burger.classList.remove('is-active');
  burger.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('is-locked');
}

if (burger && nav) {
  burger.addEventListener('click', function () {
    const open = nav.classList.toggle('is-open');
    burger.classList.toggle('is-active', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('is-locked', open);
  });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeNav);
  });
}

const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 12);
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   Footer year
   -------------------------------------------------------------------------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

/* --------------------------------------------------------------------------
   Contact form
   -------------------------------------------------------------------------- */
const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function showStatus(msg, type) {
  statusEl.textContent = msg;
  statusEl.classList.toggle('is-success', type === 'success');
  statusEl.classList.toggle('is-error', type === 'error');
  statusEl.hidden = false;
}

function clearFieldErrors() {
  form.querySelectorAll('.form__field--error').forEach(function (f) {
    f.classList.remove('form__field--error');
  });
}

function markFieldError(input) {
  const field = input.closest('.form__field');
  if (field) field.classList.add('form__field--error');
}

function validate() {
  const name = document.getElementById('f-name');
  const email = document.getElementById('f-email');
  const message = document.getElementById('f-message');
  let ok = true;

  clearFieldErrors();

  if (!name.value.trim()) { markFieldError(name); ok = false; }
  if (!EMAIL_RE.test(email.value.trim())) { markFieldError(email); ok = false; }
  if (!message.value.trim()) { markFieldError(message); ok = false; }

  return ok ? { name: name.value.trim(), email: email.value.trim(), message: message.value.trim() } : null;
}

function mailtoFallback(data) {
  const subject = encodeURIComponent('Заявка с сайта Ship Salvage — ' + data.name);
  const body = encodeURIComponent('Name: ' + data.name + '\nEmail: ' + data.email + '\n\n' + data.message);
  window.location.href = 'mailto:' + CONFIG.CONTACT_EMAIL + '?subject=' + subject + '&body=' + body;
}

if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    statusEl.hidden = true;

    const data = validate();
    if (!data) {
      showStatus(I18N[currentLang]['form-error'], 'error');
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.style.opacity = '0.6';

    fetch('https://formsubmit.co/ajax/' + CONFIG.CONTACT_EMAIL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        message: data.message,
        _subject: 'Заявка с сайта Ship Salvage & Wreck Removal',
        _captcha: 'false'
      })
    })
      .then(function (resp) {
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        return resp.json();
      })
      .then(function (res) {
        if (res.success === 'true' || res.success === true) {
          showStatus(I18N[currentLang]['form-success'], 'success');
          form.reset();
        } else {
          throw new Error('FormSubmit error');
        }
      })
      .catch(function () {
        mailtoFallback(data);
      })
      .finally(function () {
        btn.disabled = false;
        btn.style.opacity = '';
      });
  });
}

/* --------------------------------------------------------------------------
   Interactive map (Leaflet) — регионы работы
   -------------------------------------------------------------------------- */
const mapEl = document.getElementById('map');
let map = null;
let markers = [];

const mapPoints = [
  { lat: 43.1155, lng: 131.8855, titleKey: 'cov-vvo-title', descKey: 'cov-vvo-desc' },
  { lat: 42.8233, lng: 132.8731, titleKey: 'cov-nakh-title', descKey: 'cov-nakh-desc' },
  { lat: 1.3521, lng: 103.8198, titleKey: 'cov-apac-title', descKey: 'cov-apac-desc' },
  { lat: 25.2048, lng: 55.2708, titleKey: 'cov-me-title', descKey: 'cov-me-desc' },
  { lat: 51.9244, lng: 4.4777, titleKey: 'cov-eu-title', descKey: 'cov-eu-desc' },
  { lat: 8.9824, lng: -79.5199, titleKey: 'cov-am-title', descKey: 'cov-am-desc' }
];

function popupContent(point) {
  const d = I18N[currentLang];
  return '<b>' + (d[point.titleKey] || point.titleKey) + '</b><br>' + (d[point.descKey] || point.descKey);
}

function addDarkTiles(targetMap) {
  // Тёмные тайлы CARTO; при недоступности — запасной OSM с тёмным фильтром
  let errors = 0;
  const carto = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  });
  carto.on('tileerror', function () {
    errors += 1;
    if (errors >= 12 && targetMap) {
      targetMap.removeLayer(carto);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
      }).addTo(targetMap);
      if (targetMap._container) targetMap._container.classList.add('map--osm-fallback');
    }
  });
  carto.addTo(targetMap);
  return carto;
}

function initMap() {
  if (!mapEl || typeof L === 'undefined') return;
  map = L.map(mapEl, { scrollWheelZoom: false }).setView([43, 100], 3);
  addDarkTiles(map);
  mapPoints.forEach(function (p) {
    const m = L.marker([p.lat, p.lng]).addTo(map);
    m.bindPopup(popupContent(p));
    markers.push(m);
  });
  try {
    map.fitBounds(L.latLngBounds(mapPoints.map(function (p) { return [p.lat, p.lng]; })).pad(0.3));
  } catch (e) { /* noop */ }
}

/* --------------------------------------------------------------------------
   Scroll reveal + scroll-spy
   -------------------------------------------------------------------------- */
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(function (el) { io.observe(el); });
} else {
  revealEls.forEach(function (el) { el.classList.add('is-in-view'); });
}

const spySections = ['home', 'services', 'about', 'coverage', 'contacts'];
const navLinks = document.querySelectorAll('.nav__link');

function updateSpy() {
  const pos = window.scrollY + window.innerHeight * 0.35;
  let current = 'home';
  spySections.forEach(function (id) {
    const sec = document.getElementById(id);
    if (sec && sec.offsetTop <= pos) current = id;
  });
  navLinks.forEach(function (link) {
    const href = link.getAttribute('href') || '';
    const active = href.charAt(0) === '#' && href === '#' + current;
    link.classList.toggle('is-current', active);
  });
}

window.addEventListener('scroll', updateSpy, { passive: true });
window.addEventListener('resize', updateSpy, { passive: true });

/* --------------------------------------------------------------------------
   Init
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.lang__btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setLang(btn.getAttribute('data-lang'));
    });
  });

  applyLang(detectLang());
  initMap();
  updateSpy();
});
