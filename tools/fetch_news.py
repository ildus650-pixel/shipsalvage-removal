#!/usr/bin/env python3
"""Fetch marine / salvage news from public RSS feeds into news.json.

Run:  python3 tools/fetch_news.py
Writes: news.json  ({"updated": ISO, "items": [{title, link, source, date, summary}]})
"""

import json
import os
import re
import html as html_mod
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone, date
from email.utils import parsedate_to_datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "news.json")

FEEDS = [
    # (источник, url) — только ленты с прямыми ссылками на статьи:
    # у них есть link preview в Telegram (Google News скрывает реальные адреса)
    ("gCaptain", "https://gcaptain.com/feed/"),
    ("Hellenic Shipping", "https://www.hellenicshippingnews.com/feed/"),
    ("The Loadstar", "https://theloadstar.com/feed/"),
]

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124 Safari/537.36"
MAX_PER_SOURCE = 8
MAX_TOTAL = 15
SUMMARY_LEN = 220

# Ключевые слова темы (приоритет — новости про спасение/крушения)
TOPIC_KEYWORDS = [
    "salvage", "wreck", "shipwreck", "grounded", "grounding", "sunken",
    "sinking", "stranded", "refloat", "casualty", "rescue", "towage",
    "towing", "mayday", "search and rescue", "collision", "abandoned vessel",
    "recovery operation", "marine incident", "vessel fire", "cargo spill",
]


def fetch(url, timeout=30):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read()


def resolve_url(url):
    """Разворачиваем redirect-ссылки (Google News) до реального адреса статьи —
    у реальных статей есть link preview в Telegram, у redirect-ов нет."""
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=20) as resp:
            return resp.geturl()
    except Exception:
        return url


def strip_html(text):
    if not text:
        return ""
    text = re.sub(r"<[^>]+>", " ", text)
    text = html_mod.unescape(text)
    return re.sub(r"\s+", " ", text).strip()


def parse_date(value):
    if not value:
        return None
    try:
        dt = parsedate_to_datetime(value)
        return dt
    except Exception:
        pass
    try:
        dt = datetime.fromisoformat(value.replace("Z", "+00:00"))
        return dt
    except Exception:
        return None


def clean_google_title(title):
    # "Заголовок - Источник" -> (Заголовок, Источник)
    if " - " in title:
        head, _, tail = title.rpartition(" - ")
        if head and len(tail) <= 45 and ". " not in tail:
            return head.strip(), tail.strip()
    return title, "Google News"


def parse_feed(source, raw, strip_suffix=False):
    items = []
    root = ET.fromstring(raw)
    # RSS 2.0
    for item in root.iter("item"):
        def child(tag):
            el = item.find(tag)
            return el.text if el is not None and el.text else ""

        title = strip_html(child("title"))
        link = child("link").strip()
        if not title or not link:
            continue
        out_source = source
        if strip_suffix:
            title, out_source = clean_google_title(title)
            out_source = out_source or source
            link = resolve_url(link)
        date_str = child("pubDate") or child("dc:date")
        dt = parse_date(date_str)
        items.append({
            "title": title,
            "link": link,
            "source": out_source,
            "date": dt.isoformat() if dt else None,
            "summary": strip_html(child("description"))[:SUMMARY_LEN],
        })
        date_str = child("pubDate") or child("dc:date")
        dt = parse_date(date_str)
        items.append({
            "title": title,
            "link": link,
            "source": source,
            "date": dt.isoformat() if dt else None,
            "summary": strip_html(child("description"))[:SUMMARY_LEN],
        })
    # Atom fallback
    if not items:
        ns = {"a": "http://www.w3.org/2005/Atom"}
        for entry in root.findall("a:entry", ns):
            def child(tag):
                el = entry.find("a:" + tag, ns)
                return el.text if el is not None and el.text else ""

            title = strip_html(child("title"))
            link_el = entry.find("a:link", ns)
            link = link_el.get("href", "").strip() if link_el is not None else ""
            if not title or not link:
                continue
            dt = parse_date(child("updated"))
            items.append({
                "title": title,
                "link": link,
                "source": source,
                "date": dt.isoformat() if dt else None,
                "summary": strip_html(child("summary"))[:SUMMARY_LEN],
            })
    return items


def main():
    all_items = []
    for source, url in FEEDS:
        try:
            raw = fetch(url)
            items = parse_feed(source, raw)
            print(f"{source}: {len(items)} items")
            all_items.extend(items[:MAX_PER_SOURCE])
        except Exception as exc:
            print(f"{source}: ERROR {exc}")

    # дедупликация по ссылке
    seen, unique = set(), []
    for it in all_items:
        if it["link"] in seen:
            continue
        seen.add(it["link"])
        unique.append(it)

    # релевантность теме: совпадения ключевых слов по границам слова
    def relevance(it):
        text = it["title"].lower()
        return sum(1 for kw in TOPIC_KEYWORDS
                   if re.search(r"\b" + re.escape(kw) + r"\b", text))

    for it in unique:
        it["score"] = relevance(it)

    def sort_key(it):
        # сначала релевантные, внутри — по дате
        return (it["score"], it["date"] or "0000")

    unique.sort(key=sort_key, reverse=True)
    unique = unique[:MAX_TOTAL]
    for it in unique:
        del it["score"]

    data = {
        "updated": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "items": unique,
    }
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)

    print(f"\nSaved {len(unique)} items -> news.json")
    for it in unique[:5]:
        print(" -", (it["date"] or "????-??-??")[:10], "|", it["source"], "|", it["title"][:70])


if __name__ == "__main__":
    main()
