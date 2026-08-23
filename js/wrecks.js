/* ==========================================================================
   Ship Salvage & Wreck Removal — wrecks.js
   Интерактивная карта затонувших судов (Leaflet + wrecks.geojson)
   ========================================================================== */

'use strict';

const wrecksMapEl = document.getElementById('wreck-map');
const wreckList = document.getElementById('wreck-list');
const wreckCount = document.getElementById('wreck-count');
const wreckItems = []; // { btn, metaEl, f }

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function metaText(f) {
  const d = I18N[currentLang];
  const p = f.properties;
  const y = p.year !== null ? String(p.year) : d['wrecks-unknown'];
  const dep = p.depth !== null ? p.depth + ' m' : d['wrecks-unknown'];
  return d['wrecks-year'] + ': ' + y + ' · ' + d['wrecks-depth'] + ': ' + dep;
}

function wreckPopup(f) {
  const d = I18N[currentLang];
  const p = f.properties;
  const y = p.year !== null ? String(p.year) : '<i>' + d['wrecks-unknown'] + '</i>';
  const dep = p.depth !== null ? p.depth + ' m' : '<i>' + d['wrecks-unknown'] + '</i>';
  return '<b>' + escapeHtml(p.name) + '</b><br>' + d['wrecks-year'] + ': ' + y +
         '<br>' + d['wrecks-depth'] + ': ' + dep;
}

function renderListMeta() {
  wreckItems.forEach(function (item) {
    item.metaEl.textContent = metaText(item.f);
  });
}

function initWrecks() {
  if (!wrecksMapEl || typeof L === 'undefined') return;

  fetch('wrecks.geojson')
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function (data) {
      const features = data.features || [];
      if (wreckCount) wreckCount.textContent = String(features.length);

      const map = L.map(wrecksMapEl, { scrollWheelZoom: false }).setView([45, 10], 3);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      const markers = [];
      features.forEach(function (f) {
        const lon = f.geometry.coordinates[0];
        const lat = f.geometry.coordinates[1];

        const m = L.circleMarker([lat, lon], {
          radius: 6,
          color: '#2fb7ff',
          weight: 1.5,
          fillColor: '#2fb7ff',
          fillOpacity: 0.85
        }).addTo(map);
        m.bindPopup(function () { return wreckPopup(f); });
        markers.push(m);

        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'wreck-item';
        btn.innerHTML = '<span class="wreck-name"></span><span class="wreck-meta"></span>';
        btn.querySelector('.wreck-name').textContent = f.properties.name;
        const metaEl = btn.querySelector('.wreck-meta');
        metaEl.textContent = metaText(f);

        btn.addEventListener('click', function () {
          map.flyTo([lat, lon], 9, { duration: 1.2 });
          setTimeout(function () { m.openPopup(); }, 1300);
        });

        li.appendChild(btn);
        if (wreckList) wreckList.appendChild(li);
        wreckItems.push({ metaEl: metaEl, f: f });
      });

      if (features.length) {
        map.fitBounds(L.latLngBounds(markers.map(function (m) {
          const ll = m.getLatLng();
          return [ll.lat, ll.lng];
        })).pad(0.08));
      }
    })
    .catch(function (err) {
      if (wreckList) {
        wreckList.innerHTML = '<li class="wreck-item"><span class="wreck-name">' +
          escapeHtml(err.message) + '</span></li>';
      }
    });
}

// Перерисовка подписей списка при смене языка (попапы обновляются динамически)
document.addEventListener('langchange', function () {
  if (wreckItems.length) renderListMeta();
});

document.addEventListener('DOMContentLoaded', initWrecks);
