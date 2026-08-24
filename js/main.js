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
// Словарь интерфейса (8 языков) вынесен в js/i18n.js — глобальный I18N

const STORAGE_KEY = 'sswr-lang';
const SUPPORTED_LANGS = ['en', 'ru', 'cn', 'hi', 'bn', 'de', 'fr', 'es', 'ar', 'pt'];
let currentLang = 'en';

function detectLang() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (SUPPORTED_LANGS.indexOf(saved) !== -1) return saved;
  const lang = (navigator.language || '').toLowerCase();
  if (lang.startsWith('ru')) return 'ru';
  if (lang.startsWith('zh')) return 'cn';
  if (lang.startsWith('hi')) return 'hi';
  if (lang.startsWith('bn')) return 'bn';
  if (lang.startsWith('de')) return 'de';
  if (lang.startsWith('fr')) return 'fr';
  if (lang.startsWith('es')) return 'es';
  if (lang.startsWith('ar')) return 'ar';
  if (lang.startsWith('pt')) return 'pt';
  return 'en';
}

function applyLang(lang) {
  const dict = I18N[lang];
  if (!dict) return;

  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

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
    const page = document.body.dataset.page;
    const key = page === 'wrecks' ? 'meta-desc-wrecks' : (page === 'store' ? 'meta-desc-store' : 'meta-desc');
    if (dict[key]) metaDesc.setAttribute('content', dict[key]);
  }

  const langSelect = document.getElementById('lang-select');
  if (langSelect) langSelect.value = lang;

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

function showStatus(el, msg, type) {
  el.textContent = msg;
  el.classList.toggle('is-success', type === 'success');
  el.classList.toggle('is-error', type === 'error');
  el.hidden = false;
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
      showStatus(statusEl, I18N[currentLang]['form-error'], 'error');
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
          showStatus(statusEl, I18N[currentLang]['form-success'], 'success');
          tgNotify('Заявка с сайта\nИмя: ' + data.name + '\nEmail: ' + data.email +
                   '\n\n' + data.message);
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
   Report form — сообщить о затонувшем объекте
   -------------------------------------------------------------------------- */
const reportForm = document.getElementById('report-form');
const reportStatus = document.getElementById('report-status');

if (reportForm) {
  reportForm.addEventListener('submit', function (e) {
    e.preventDefault();
    reportStatus.hidden = true;

    const rName = document.getElementById('r-name');
    const rContact = document.getElementById('r-contact');
    const rLocation = document.getElementById('r-location');
    const rDesc = document.getElementById('r-description');

    const clearErr = function () {
      reportForm.querySelectorAll('.form__field--error').forEach(function (f) {
        f.classList.remove('form__field--error');
      });
    };
    const markErr = function (input) {
      const f = input.closest('.form__field');
      if (f) f.classList.add('form__field--error');
    };

    clearErr();
    const contactVal = (rContact.value || '').trim();
    const locationVal = (rLocation.value || '').trim();
    const isEmail = EMAIL_RE.test(contactVal);
    const isPhone = /^[+\d][\d\s\-()]{6,17}$/.test(contactVal);
    let ok = true;

    if (!locationVal) { markErr(rLocation); ok = false; }
    if (!isEmail && !isPhone) { markErr(rContact); ok = false; }

    if (!ok) {
      showStatus(reportStatus, I18N[currentLang]['report-error'], 'error');
      return;
    }

    const btn = reportForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.style.opacity = '0.6';

    fetch('https://formsubmit.co/ajax/' + CONFIG.CONTACT_EMAIL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name: (rName.value || '').trim(),
        contact: contactVal,
        location: locationVal,
        description: (rDesc.value || '').trim(),
        _subject: 'Заявка: затонувший объект (location report)',
        _captcha: 'false'
      })
    })
      .then(function (resp) {
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        return resp.json();
      })
      .then(function (res) {
        if (res.success === 'true' || res.success === true) {
          showStatus(reportStatus, I18N[currentLang]['report-success'], 'success');
          tgNotify('Сообщение о затонувшем объекте\nМестоположение: ' + locationVal +
                   '\nОбъект: ' + (rDesc.value || '').trim() +
                   '\nКонтакт: ' + contactVal +
                   '\nИмя: ' + (rName.value || '').trim());
          reportForm.reset();
        } else {
          throw new Error('FormSubmit error');
        }
      })
      .catch(function () {
        const subject = encodeURIComponent('Затонувший объект: ' + locationVal);
        const body = encodeURIComponent(
          'Местоположение: ' + locationVal +
          '\nОбъект: ' + (rDesc.value || '').trim() +
          '\nКонтакт: ' + contactVal +
          '\nИмя: ' + (rName.value || '').trim());
        window.location.href = 'mailto:' + CONFIG.CONTACT_EMAIL + '?subject=' + subject + '&body=' + body;
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

function addBaseLayers(targetMap, darkLayer) {
  // Переключатель подложек: тёмный океан / Яндекс / Яндекс-гибрид / Луна (Google)
  const yandex = L.tileLayer('https://core-renderer-tiles.maps.yandex.net/tiles?l=map&x={x}&y={y}&z={z}&scale=1&lang=ru_RU', {
    attribution: '&copy; <a href="https://yandex.ru/legal/maps_termsofuse/">Яндекс Карты</a>',
    maxZoom: 19
  });
  const yandexHybrid = L.tileLayer('https://core-renderer-tiles.maps.yandex.net/tiles?l=skl&x={x}&y={y}&z={z}&scale=1&lang=ru_RU', {
    attribution: '&copy; <a href="https://yandex.ru/legal/maps_termsofuse/">Яндекс Карты</a>',
    maxZoom: 19
  });
  const moon = L.tileLayer('https://mw1.google.com/mw-planetary/lunar/lunarmaps_v1/clem_bw/{z}/{x}/{y}.jpg', {
    attribution: 'Imagery &copy; Google Moon',
    minZoom: 2,
    maxZoom: 10
  });
  L.control.layers({
    'Ocean (dark)': darkLayer,
    'Yandex': yandex,
    'Yandex hybrid': yandexHybrid,
    'Moon': moon
  }, null, { position: 'topright' }).addTo(targetMap);
}

function initMap() {
  if (!mapEl || typeof L === 'undefined') return;
  map = L.map(mapEl, { scrollWheelZoom: false }).setView([43, 100], 3);
  addBaseLayers(map, addDarkTiles(map));
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
  const langSelect = document.getElementById('lang-select');
  if (langSelect) {
    langSelect.addEventListener('change', function () {
      setLang(langSelect.value);
    });
  }

  applyLang(detectLang());
  initMap();
  updateSpy();
});
