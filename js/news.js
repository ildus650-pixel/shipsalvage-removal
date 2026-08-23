/* ==========================================================================
   Ship Salvage & Wreck Removal — news.js
   Лента новостей из news.json (парсинг RSS, см. tools/fetch_news.py)
   ========================================================================== */

'use strict';

const newsList = document.getElementById('news-list');
const newsUpdated = document.getElementById('news-updated');

function renderNews() {
  if (!newsList) return;

  fetch('news.json')
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function (data) {
      const items = data.items || [];
      if (newsUpdated && data.updated) {
        newsUpdated.textContent = String(data.updated).slice(0, 10);
      }

      if (!items.length) {
        newsList.innerHTML = '<li class="news-item"><span class="news-title">' +
          escapeHtml(I18N[currentLang]['news-empty']) + '</span></li>';
        return;
      }

      items.forEach(function (it) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.className = 'news-item';
        a.href = it.link;
        a.target = '_blank';
        a.rel = 'noopener';
        a.innerHTML = '<span class="news-title"></span>' +
          '<span class="news-meta"><span class="news-source"></span><span class="news-date"></span></span>' +
          (it.summary ? '<span class="news-summary"></span>' : '');
        a.querySelector('.news-title').textContent = it.title;
        a.querySelector('.news-source').textContent = it.source || '';
        a.querySelector('.news-date').textContent = (it.date || '').slice(0, 10);
        if (it.summary) a.querySelector('.news-summary').textContent = it.summary;
        li.appendChild(a);
        newsList.appendChild(li);
      });
    })
    .catch(function (err) {
      newsList.innerHTML = '<li class="news-item"><span class="news-title">' +
        escapeHtml(err.message) + '</span></li>';
    });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

document.addEventListener('DOMContentLoaded', renderNews);
