#!/usr/bin/env bash
# ============================================================================
# Публикация сайта «Ship Salvage & Wreck Removal» на Netlify одной командой:
#
#   bash deploy-netlify.sh
#
# Первый запуск:
#   1. Скрипт установит netlify-cli (если нет).
#   2. Откроется браузер — нажмите Authorize (вход в Netlify, бесплатно).
#   3. Скрипт спросит: создать новый сайт или привязать существующий —
#      выберите «Create & configure a new site» и придумайте имя,
#      например shipsalvage.
#   4. Сайт опубликуется по адресу https://<имя>.netlify.app
#
# Повторные запуски обновляют уже опубликованный сайт.
# ============================================================================
set -e
cd "$(dirname "$0")"

if ! command -v netlify >/dev/null 2>&1; then
  echo "==> Устанавливаю netlify-cli..."
  npm install -g netlify-cli
fi

echo "==> Вход в Netlify (в браузере нажмите Authorize)..."
netlify login

echo "==> Деплой в production..."
netlify deploy --prod --dir . --message "Deploy $(date +'%Y-%m-%d %H:%M')"

echo ""
echo "==> Готово! Сайт опубликован. Адрес покажет команда выше (Site URL)."
