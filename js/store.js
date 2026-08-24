/* ==========================================================================
   store.js — раздел «Морской такелаж и снаряжение»
   Товары: реальные ссылки и цены магазинов-партнёров (проверены на дату сборки)
   ========================================================================== */

'use strict';

var STORE_PRODUCTS = [
  // ---------- Стропы и тросы (Slings & Ropes) ----------
  { id: 'th-dl-1', cat: 'ropes', store: 'TH',
    en: 'Black 3/8" x 15\' MFP Dock Line', ru: 'Швартов MFP 3/8" x 15 футов, чёрный',
    price: '$8.39', img: 'img/store/th-dockline-1.jpg',
    url: 'https://thmarinesupplies.com/products/black-3-8-x-15-mfp-dock-line', buy: true },
  { id: 'th-dl-2', cat: 'ropes', store: 'TH',
    en: '3/8" x 15\' Pre-Splice Nylon Dock Line', ru: 'Швартов нейлоновый с оплёткой 3/8" x 15 футов',
    price: '$10.99', img: 'img/store/th-dockline-2.jpg',
    url: 'https://thmarinesupplies.com/products/3-8-x-15-pre-splice-nylon-dock-line', buy: true },
  { id: 'th-dl-3', cat: 'ropes', store: 'TH',
    en: 'Black 1/2" x 25\' Premium Double Braid Dock Line', ru: 'Швартов Premium Double Braid 1/2" x 25 футов, чёрный',
    price: '$18.89', img: 'img/store/th-dockline-3.jpg',
    url: 'https://thmarinesupplies.com/products/black-1-2-x-25-premium-double-braid-dock-line', buy: true },

  // ---------- Такелаж (Rigging) ----------
  { id: 'th-hook', cat: 'rigging', store: 'TH',
    en: 'Telescopic Boat Hook', ru: 'Телескопический отпорный крюк',
    price: '$26.99', img: 'img/store/th-boat-hook.jpg',
    url: 'https://thmarinesupplies.com/products/telescopic-boat-hook', buy: true },
  { id: 'th-pad', cat: 'rigging', store: 'TH',
    en: 'Stainless Steel Pad Eye Straps (2 Pack)', ru: 'Обушки из нержавеющей стали, 2 шт.',
    price: '$8.39', img: 'img/store/th-pad-eye.jpg',
    url: 'https://thmarinesupplies.com/products/ss-steel-eye-straps', buy: true },
  { id: 'th-cleat', cat: 'rigging', store: 'TH',
    en: '4 1/2" Nylon Cleat', ru: 'Кнехт (уточка) нейлоновый 4,5"',
    price: '$3.19', img: 'img/store/th-cleat.jpg',
    url: 'https://thmarinesupplies.com/products/4-1-2-nylon-cleat', buy: true },

  // ---------- Лебёдки и тали (Winches & Hoists) ----------
  { id: 'th-w2k', cat: 'winches', store: 'TH',
    en: '2000 LB Dual Drive Trailer Winch', ru: 'Прицепная лебёдка 2000 lb, двухскоростная',
    price: '$117.99', img: 'img/store/th-winch-2000.jpg',
    url: 'https://thmarinesupplies.com/products/2000-lb-dual-drive-trailer-winch', buy: true },
  { id: 'th-w600', cat: 'winches', store: 'TH',
    en: '600 LB Trailer Winch', ru: 'Прицепная лебёдка 600 lb',
    price: '$61.99', img: 'img/store/th-winch-600.jpg',
    url: 'https://thmarinesupplies.com/products/600-lb-trailer-winch', buy: true },
  { id: 'c24-harken', cat: 'winches', store: 'C24',
    en: 'Harken "Radial" Winch', ru: 'Лебёдка Harken «Radial»',
    price: '£157.99', old: '£184.99', img: 'img/store/c24-winch-harken.jpg',
    url: 'https://www.compass24.com/harken-radial-winch-264158/90-b6a-black-60-82-0-7', buy: true },

  // ---------- Якоря и цепи (Anchors & Chains) ----------
  { id: 'c24-anchor-set', cat: 'anchors', store: 'C24',
    en: '3-Piece Anchor Set', ru: 'Якорный комплект из 3 предметов',
    price: '£37.99', old: '£39.99', img: 'img/store/c24-anchor-set.jpg',
    url: 'https://www.compass24.com/3-piece-anchor-set-922236/3-2-4', buy: true },
  { id: 'c24-anchor-m', cat: 'anchors', store: 'C24',
    en: 'M Anchor / Bruce Anchor', ru: 'Якорь M / Брюс',
    price: '£46.99', old: '£49.99', img: 'img/store/c24-anchor-m.jpg',
    url: 'https://www.compass24.com/m-anker-bruce-anker-958010/32-x-47-5-7', buy: true },

  // ---------- Навигация (Navigation) ----------
  { id: 'c24-onwa', cat: 'navigation', store: 'C24',
    en: 'ONWA KP-25/27 GPS Chartplotter, 5"/7"', ru: 'Картплоттер ONWA KP-25/27 GPS, 5"/7"',
    price: '£249.99', old: '£499.99', img: 'img/store/c24-plotter-onwa.jpg',
    url: 'https://www.compass24.com/onwa-kp-25-27-gps-chartplotter-compact-5-7-marine-plotter-with-nmea2000-492160/5-kp25', buy: true },
  { id: 'c24-simrad', cat: 'navigation', store: 'C24',
    en: 'Simrad GO5 XSE Plotter, 5" Touchscreen', ru: 'Картплоттер Simrad GO5 XSE, 5" сенсорный',
    price: '£399.99', old: '£699.99', img: 'img/store/c24-plotter-simrad.jpg',
    url: 'https://www.compass24.com/simrad-go5-xse-plotter-multifunction-display-5-inch-touchscreen-370841/5-go5-xse', buy: true },

  // ---------- Безопасность (Safety) ----------
  { id: 'ms-mit70', cat: 'safety', store: 'MS',
    en: 'MIT 70 Automatic Inflatable PFD', ru: 'Автоматический надувной спасательный жилет MIT 70',
    price: '$159.99', img: 'img/store/ms-pfd-mit70.jpg',
    url: 'https://mustangsurvival.com/products/mit-70-automatic-inflatable-pfd-md4042', buy: true },
  { id: 'ms-essential', cat: 'safety', store: 'MS',
    en: 'Essentialist Inflatable Belt Pack', ru: 'Поясной надувной спасательный пакет Essentialist',
    price: '$144.99', img: 'img/store/ms-belt-essentialist.jpg',
    url: 'https://mustangsurvival.com/products/essentialist-belt-pack-md3800', buy: true },
  { id: 'ms-minimal', cat: 'safety', store: 'MS',
    en: 'Minimalist Inflatable Belt Pack', ru: 'Поясной надувной спасательный пакет Minimalist',
    price: '$99.99', img: 'img/store/ms-belt-minimalist.jpg',
    url: 'https://mustangsurvival.com/products/minimalist-belt-pack-md3070', buy: true },

  // ---------- Запчасти (Parts) ----------
  { id: 'pv-kits', cat: 'parts', store: 'PV',
    en: 'Yamaha OEM Service Kits (20/100/300 h)', ru: 'Сервисные комплекты Yamaha OEM (20/100/300 ч)',
    price: null, img: 'img/store/pv-service-kits.jpg',
    url: 'https://partsvu.com/collections/yamaha-outboard-20-hour-100-hour-300-hour-service-kits', buy: false },
  { id: 'pv-oil', cat: 'parts', store: 'PV',
    en: 'Yamaha Genuine Oil Change Kits', ru: 'Комплекты замены масла Yamaha Genuine',
    price: null, img: 'img/store/pv-oil-kits.jpg',
    url: 'https://partsvu.com/collections/yamaha-4-stroke-genuine-yamalube-outboard-motor-oil-change-kits', buy: false }
];

var STORE_NAMES = {
  TH: 'T-H Marine',
  C24: 'Compass24',
  MS: 'Mustang Survival',
  PV: 'PartsVu'
};

var storeState = { cat: 'all', q: '' };

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function storeText(key) {
  var dict = I18N[currentLang] || I18N.en || {};
  return dict[key] !== undefined ? dict[key] : (I18N.en[key] !== undefined ? I18N.en[key] : key);
}

function renderStore() {
  var grid = document.getElementById('store-grid');
  var empty = document.getElementById('st-empty');
  var countEl = document.getElementById('st-count');
  if (!grid) return;

  var q = storeState.q.trim().toLowerCase();
  var items = STORE_PRODUCTS.filter(function (p) {
    if (storeState.cat !== 'all' && p.cat !== storeState.cat) return false;
    if (!q) return true;
    return (p.en + ' ' + p.ru + ' ' + STORE_NAMES[p.store]).toLowerCase().indexOf(q) !== -1;
  });

  countEl.textContent = items.length + ' ' + storeText('store-count');

  if (!items.length) {
    grid.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');

  var lang = currentLang;
  grid.innerHTML = items.map(function (p) {
    var name = lang === 'ru' && p.ru ? p.ru : p.en;
    var priceHtml = p.price
      ? '<span class="store-price">' + escapeHtml(p.price) +
        (p.old ? ' <s class="store-old">' + escapeHtml(p.old) + '</s>' : '') + '</span>'
      : '<span class="store-price store-price--na">OEM</span>';
    var btnLabel = storeText(p.buy ? 'store-buy' : 'store-visit');
    return '' +
      '<article class="store-card">' +
        '<a class="store-card__img" href="' + escapeHtml(p.url) + '" target="_blank" rel="noopener sponsored" tabindex="-1">' +
          '<img src="' + escapeHtml(p.img) + '" alt="' + escapeHtml(name) + '" loading="lazy" onerror="this.style.display=\'none\'">' +
        '</a>' +
        '<div class="store-card__body">' +
          '<span class="store-badge store-badge--' + p.store.toLowerCase() + '">' + STORE_NAMES[p.store] + '</span>' +
          '<h3 class="store-card__title"><a href="' + escapeHtml(p.url) + '" target="_blank" rel="noopener sponsored">' + escapeHtml(name) + '</a></h3>' +
          '<div class="store-card__foot">' + priceHtml +
            '<a class="btn btn--small" href="' + escapeHtml(p.url) + '" target="_blank" rel="noopener sponsored">' + btnLabel + '</a>' +
          '</div>' +
        '</div>' +
      '</article>';
  }).join('');
}

function bindStore() {
  var search = document.getElementById('st-search');
  var chips = document.getElementById('st-chips');
  var reset = document.getElementById('st-reset');
  if (!search || !chips) return;

  search.addEventListener('input', function () {
    storeState.q = search.value;
    renderStore();
  });

  chips.addEventListener('click', function (e) {
    var btn = e.target.closest('.store-chip');
    if (!btn) return;
    storeState.cat = btn.getAttribute('data-cat');
    Array.prototype.forEach.call(chips.querySelectorAll('.store-chip'), function (c) {
      c.classList.toggle('is-active', c === btn);
    });
    renderStore();
  });

  if (reset) {
    reset.addEventListener('click', function () {
      storeState = { cat: 'all', q: '' };
      search.value = '';
      Array.prototype.forEach.call(chips.querySelectorAll('.store-chip'), function (c) {
        c.classList.toggle('is-active', c.getAttribute('data-cat') === 'all');
      });
      renderStore();
    });
  }
}

document.addEventListener('DOMContentLoaded', function () {
  bindStore();
  renderStore();
});

document.addEventListener('langchange', function () {
  renderStore();
});
