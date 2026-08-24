/* ==========================================================================
   Ship Salvage & Wreck Removal — news.js
   Лента новостей (8 языков) из news.json + озвучка (speechSynthesis)
   ========================================================================== */

'use strict';

const newsList = document.getElementById('news-list');
const newsUpdated = document.getElementById('news-updated');

const TTS_LANG = {
  en: 'en-US', ru: 'ru-RU', cn: 'zh-CN', hi: 'hi-IN',
  bn: 'bn-BD', de: 'de-DE', fr: 'fr-FR', es: 'es-ES'
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

function renderNews() {
  if (!newsList) return;
  newsList.innerHTML = '';

  fetch('news.json')
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function (data) {
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
        a.innerHTML = '<span class="news-title"></span>' +
          '<span class="news-meta"><span class="news-source"></span><span class="news-date"></span></span>' +
          (it.summary ? '<span class="news-summary"></span>' : '');
        a.querySelector('.news-title').textContent = it.title;
        a.querySelector('.news-source').textContent = it.source || '';
        a.querySelector('.news-date').textContent = (it.date || '').slice(0, 10);
        if (it.summary) a.querySelector('.news-summary').textContent = it.summary;
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
      newsList.innerHTML = '<li class="news-item"><span class="news-title">' +
        escapeHtml(err.message) + '</span></li>';
    });
}

// При смене языка — перерисовываем ленту на языке гостя
document.addEventListener('langchange', renderNews);

document.addEventListener('DOMContentLoaded', renderNews);
