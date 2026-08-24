#!/usr/bin/env python3
"""Автоответчик бота: отвечает на личные сообщения клиентов.

Env: TELEGRAM_BOT_TOKEN
Оффсет хранится в .tg_offset.json (коммитится workflow'ом, чтобы не отвечать дважды).
"""

import json
import os
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OFFSET_FILE = os.path.join(ROOT, ".tg_offset.json")

SITE = "https://ildus650-pixel.github.io/shipsalvage-removal/"
EMAIL = "ildus650@gmail.com"
CHANNEL = "https://t.me/ShipSalvageNews"

REPLIES = {
    "start": (
        "Здравствуйте! Это бот компании Ship Salvage & Wreck Removal.\n\n"
        "Заявки и вопросы: сайт — %s\nEmail — %s\n\n"
        "Новости морского спасения: %s"
    ) % (SITE, EMAIL, CHANNEL),
    "site": "Наш сайт: %s" % SITE,
    "email": "Email для заявок: %s" % EMAIL,
    "news": "Новостной канал: %s" % CHANNEL,
    "default": (
        "Спасибо за сообщение! Мы получили его и ответим в ближайшее время.\n\n"
        "Быстрее всего связаться с нами:\n— сайт: %s\n— email: %s\n— новости: %s"
    ) % (SITE, EMAIL, CHANNEL),
}


def api(token, method, **params):
    url = f"https://api.telegram.org/bot{token}/{method}"
    data = urllib.parse.urlencode(params).encode("utf-8")
    req = urllib.request.Request(url, data=data)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read() or b"{}")


def main():
    token = os.environ.get("TELEGRAM_BOT_TOKEN", "").strip()
    if not token:
        print("SKIP: TELEGRAM_BOT_TOKEN не задан")
        return

    offset = 0
    if os.path.exists(OFFSET_FILE):
        try:
            offset = int(json.load(open(OFFSET_FILE)).get("offset", 0))
        except Exception:
            offset = 0

    data = api(token, "getUpdates", timeout=0, offset=offset + 1, limit=50)
    max_id = offset
    replied = 0
    for u in data.get("result", []):
        max_id = max(max_id, u.get("update_id", 0))
        msg = u.get("message") or {}
        chat = msg.get("chat") or {}
        if chat.get("type") != "private":
            continue
        text = (msg.get("text") or "").strip().lower()
        key = "start" if text.startswith("/start") else \
              "site" if text.startswith("/site") else \
              "email" if text.startswith("/email") else \
              "news" if text.startswith("/news") else "default"
        try:
            api(token, "sendMessage",
                chat_id=chat["id"],
                text=REPLIES[key],
                reply_to_message_id=msg.get("message_id", 0),
                disable_web_page_preview="false")
            replied += 1
            print("replied to", chat.get("username") or chat["id"], "| key:", key)
        except Exception as exc:
            print("ERROR:", exc)

    with open(OFFSET_FILE, "w", encoding="utf-8") as f:
        json.dump({"offset": max_id}, f)
    print(f"updates processed: {len(data.get('result', []))}, replied: {replied}")


if __name__ == "__main__":
    main()
