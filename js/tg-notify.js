/* ==========================================================================
   tg-notify.js — уведомления о заявках в Telegram (личный чат владельца).

   ВНИМАНИЕ (компромисс): токен бота лежит в клиентском коде, потому что у
   статического сайта на GitHub Pages нет сервера. Это значит, что токен виден
   в исходниках страницы. Для продакшена лучше:
     1) создать отдельного бота только для заявок, ИЛИ
     2) перенести приём заявок на сервер (любой VPS / FormBold и т.п.).
   Уведомления дублируются в EMAIL (основной канал) — Telegram лишь дублирует.
   ========================================================================== */

'use strict';

const TG_NOTIFY = {
  token: '7835106186:AAEhqlpCBnTzIg2sg9DG3jeTEWk69vBKOoQ',
  chatId: '8188225611'
};

function tgNotify(text) {
  if (!TG_NOTIFY.token || !TG_NOTIFY.chatId || TG_NOTIFY.chatId === '0') {
    return Promise.resolve();
  }
  return fetch('https://api.telegram.org/bot' + TG_NOTIFY.token + '/sendMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TG_NOTIFY.chatId,
      text: text,
      disable_web_page_preview: 'true'
    })
  }).catch(function () {
    /* почта остаётся основным каналом — сбой TG не критичен */
  });
}
