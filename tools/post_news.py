#!/usr/bin/env python3
"""Post latest news from news.json to a Telegram channel via Bot API.

Env vars:
  TELEGRAM_BOT_TOKEN — токен бота (от @BotFather)
  TELEGRAM_CHANNEL   — канал: @username или -100xxxxxxxxxx

Usage:
  python3 tools/post_news.py [--limit N] [--since YYYY-MM-DD]
"""

import argparse
import json
import os
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def send(token, chat_id, text):
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    data = urllib.parse.urlencode({
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "HTML",
    }).encode("utf-8")
    req = urllib.request.Request(url, data=data)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.status


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=5, help="сколько новостей отправить")
    ap.add_argument("--since", default=None, help="только новости не старше даты YYYY-MM-DD")
    args = ap.parse_args()

    token = os.environ.get("TELEGRAM_BOT_TOKEN", "").strip()
    channel = os.environ.get("TELEGRAM_CHANNEL", "").strip()
    if not token or not channel:
        print("SKIP: переменные TELEGRAM_BOT_TOKEN / TELEGRAM_CHANNEL не заданы")
        return

    with open(os.path.join(ROOT, "news.json"), encoding="utf-8") as f:
        items = json.load(f)["items"]["en"]  # в канал — английская лента

    if args.since:
        items = [i for i in items if (i.get("date") or "")[:10] >= args.since]

    posted = 0
    for it in items[: args.limit]:
        date_part = (it.get("date") or "")[:10]
        text = f"<b>{it['title']}</b>\n\n{date_part} · {it.get('source', '')}\n\n{it['link']}"
        text = text[:1024]
        try:
            send(token, channel, text)
            posted += 1
            print("posted:", it["title"][:70])
        except Exception as exc:
            print("ERROR:", exc)
    print(f"Total posted: {posted}")


if __name__ == "__main__":
    main()
