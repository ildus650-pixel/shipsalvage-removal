/* ==========================================================================
   Ship Salvage & Wreck Removal — wrecks.js
   Интерактивная карта затонувших судов: Leaflet + кластеры + фильтры
   ========================================================================== */

'use strict';

const wrecksMapEl = document.getElementById('wreck-map');
const wreckList = document.getElementById('wreck-list');
const wreckCount = document.getElementById('wreck-count');
const wfName = document.getElementById('wf-name');
const wfRegion = document.getElementById('wf-region');
const wfDepth = document.getElementById('wf-depth');
const wfYear = document.getElementById('wf-year');
const wfReset = document.getElementById('wf-reset');

const filters = { q: '', region: 'all', depth: 'all', year: 'all' };
let wreckMap = null;
let cluster = null;
const wreckMarkers = []; // { marker, f, visible }

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

function matches(f) {
  const p = f.properties;
  if (filters.q && p.name.toLowerCase().indexOf(filters.q) === -1) return false;
  if (filters.region !== 'all' && p.region !== filters.region) return false;

  if (filters.depth !== 'all') {
    const d = p.depth;
    if (filters.depth === 'none') { if (d !== null) return false; }
    else if (filters.depth === '0-20') { if (d === null || d > 20) return false; }
    else if (filters.depth === '20-50') { if (d === null || d <= 20 || d > 50) return false; }
    else if (filters.depth === '50+') { if (d === null || d <= 50) return false; }
  }

  if (filters.year !== 'all') {
    const y = p.year;
    if (filters.year === 'y-none') { if (y !== null) return false; }
    else if (filters.year === 'y-before') { if (y === null || y >= 1900) return false; }
    else if (filters.year === 'y-1900') { if (y === null || y < 1900 || y > 1950) return false; }
    else if (filters.year === 'y-1950') { if (y === null || y <= 1950 || y > 2000) return false; }
    else if (filters.year === 'y-2000') { if (y === null || y <= 2000) return false; }
  }
  return true;
}

function rebuildList() {
  if (!wreckList) return;
  wreckList.innerHTML = '';
  const visible = wreckMarkers.filter(function (m) { return m.visible; });

  visible.forEach(function (m) {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'wreck-item';
    btn.innerHTML = '<span class="wreck-name"></span><span class="wreck-meta"></span>';
    btn.querySelector('.wreck-name').textContent = m.f.properties.name;
    btn.querySelector('.wreck-meta').textContent = metaText(m.f);
    btn.addEventListener('click', function () {
      const ll = m.marker.getLatLng();
      wreckMap.flyTo([ll.lat, ll.lng], 9, { duration: 1.2 });
      setTimeout(function () { m.marker.openPopup(); }, 1300);
    });
    li.appendChild(btn);
    wreckList.appendChild(li);
  });

  if (!visible.length) {
    const li = document.createElement('li');
    li.className = 'wreck-item';
    li.innerHTML = '<span class="wreck-name" style="color:var(--muted)">' +
      escapeHtml(I18N[currentLang]['wrecks-empty']) + '</span>';
    wreckList.appendChild(li);
  }

  if (wreckCount) wreckCount.textContent = visible.length + ' / ' + wreckMarkers.length;
}

function applyFilters() {
  if (!cluster) return;
  cluster.clearLayers();
  wreckMarkers.forEach(function (m) {
    m.visible = matches(m.f);
    if (m.visible) cluster.addLayer(m.marker);
  });
  rebuildList();
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

      wreckMap = L.map(wrecksMapEl, { scrollWheelZoom: false }).setView([45, 10], 3);
      addDarkTiles(wreckMap);

      cluster = (typeof L.markerClusterGroup === 'function')
        ? L.markerClusterGroup({ showCoverageOnHover: false, maxClusterRadius: 55 })
        : L.layerGroup();
      wreckMap.addLayer(cluster);

      features.forEach(function (f) {
        const lon = f.geometry.coordinates[0];
        const lat = f.geometry.coordinates[1];
        const m = L.circleMarker([lat, lon], {
          radius: 6,
          color: '#2fb7ff',
          weight: 1.5,
          fillColor: '#2fb7ff',
          fillOpacity: 0.85
        });
        m.bindPopup(function () { return wreckPopup(f); });
        wreckMarkers.push({ marker: m, f: f, visible: true });
      });

      applyFilters();

      if (features.length) {
        wreckMap.fitBounds(L.latLngBounds(wreckMarkers.map(function (m) {
          const ll = m.marker.getLatLng();
          return [ll.lat, ll.lng];
        })).pad(0.05));
      }

      if (wfName) wfName.addEventListener('input', function () {
        filters.q = wfName.value.trim().toLowerCase();
        applyFilters();
      });
      if (wfRegion) wfRegion.addEventListener('change', function () {
        filters.region = wfRegion.value;
        applyFilters();
      });
      if (wfDepth) wfDepth.addEventListener('change', function () {
        filters.depth = wfDepth.value;
        applyFilters();
      });
      if (wfYear) wfYear.addEventListener('change', function () {
        filters.year = wfYear.value;
        applyFilters();
      });
      if (wfReset) wfReset.addEventListener('click', function () {
        filters.q = '';
        filters.region = 'all';
        filters.depth = 'all';
        filters.year = 'all';
        if (wfName) wfName.value = '';
        if (wfRegion) wfRegion.value = 'all';
        if (wfDepth) wfDepth.value = 'all';
        if (wfYear) wfYear.value = 'all';
        applyFilters();
      });
    })
    .catch(function (err) {
      if (wreckList) {
        wreckList.innerHTML = '<li class="wreck-item"><span class="wreck-name">' +
          escapeHtml(err.message) + '</span></li>';
      }
    });
}

// При смене языка — перерисовываем список (попапы обновляются динамически)
document.addEventListener('langchange', function () {
  if (wreckMarkers.length) rebuildList();
});

document.addEventListener('DOMContentLoaded', initWrecks);
