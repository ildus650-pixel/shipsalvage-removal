/* ==========================================================================
   Ship Salvage & Wreck Removal — news.js
   Лента новостей (8 языков) из news.json + озвучка (speechSynthesis)
   ========================================================================== */

'use strict';

const newsList = document.getElementById('news-list');
const newsUpdated = document.getElementById('news-updated');

const TTS_LANG = {
  en: 'en-US', ru: 'ru-RU', cn: 'zh-CN', hi: 'hi-IN',
  bn: 'bn-BD', de: 'de-DE', fr: 'fr-FR', es: 'es-ES',
  ar: 'ar-SA', pt: 'pt-BR'
};

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function speakNews(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = TTS_LANG[currentLang] || 'en-US';
  u.rate = 1;
  window.speechSynthesis.speak(u);
}

let renderToken = 0;

function renderNews() {
  if (!newsList) return;
  const token = ++renderToken; // защита от гонки параллельных рендеров
  newsList.innerHTML = '';

  fetch('news.json')
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function (data) {
      if (token !== renderToken) return;
      const byLang = data.items || {};
      // Новости на языке гостя; если пусто — английская лента
      const items = byLang[currentLang] || byLang.en || [];
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
        li.className = 'news-item-wrap';

        const a = document.createElement('a');
        a.className = 'news-item';
        a.href = it.link;
        a.target = '_blank';
        a.rel = 'noopener';

        if (it.image) {
          const img = document.createElement('img');
          img.className = 'news-img';
          img.alt = '';
          img.loading = 'lazy';
          img.src = it.image;
          img.addEventListener('error', function () { img.style.display = 'none'; });
          a.appendChild(img);
        }

        const body = document.createElement('span');
        body.className = 'news-body';
        body.innerHTML = '<span class="news-title"></span>' +
          '<span class="news-meta"><span class="news-source"></span><span class="news-date"></span></span>' +
          (it.summary ? '<span class="news-summary"></span>' : '');
        body.querySelector('.news-title').textContent = it.title;
        body.querySelector('.news-source').textContent = it.source || '';
        body.querySelector('.news-date').textContent = (it.date || '').slice(0, 10);
        if (it.summary) body.querySelector('.news-summary').textContent = it.summary;
        a.appendChild(body);
        li.appendChild(a);

        // Кнопка «слушать» — озвучка заголовка и описания
        const listenBtn = document.createElement('button');
        listenBtn.type = 'button';
        listenBtn.className = 'news-listen-btn';
        listenBtn.setAttribute('aria-label', I18N[currentLang]['news-listen'] || 'Listen');
        listenBtn.textContent = '\uD83D\uDD0A';
        listenBtn.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          speakNews(it.title + '. ' + (it.summary || ''));
        });
        li.appendChild(listenBtn);

        newsList.appendChild(li);
      });
    })
    .catch(function (err) {
      if (token !== renderToken) return;
      newsList.innerHTML = '<li class="news-item"><span class="news-title">' +
        escapeHtml(err.message) + '</span></li>';
    });
}

// При смене языка — перерисовываем ленту на языке гостя
document.addEventListener('langchange', renderNews);

document.addEventListener('DOMContentLoaded', renderNews);
