#!/usr/bin/env python3
"""Fetch marine / salvage news from public RSS feeds into news.json.

Новости на 8 языках: news.json = {"updated": ISO, "items": {en, ru, cn, hi, bn, de, fr, es}}

Run:  python3 tools/fetch_news.py
"""

import json
import os
import re
import html as html_mod
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "news.json")

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124 Safari/537.36"
MAX_TOTAL = 12
SUMMARY_LEN = 220

# Ключевые слова темы для английских лент
TOPIC_KEYWORDS = [
    "salvage", "wreck", "shipwreck", "grounded", "grounding", "sunken",
    "sinking", "stranded", "refloat", "casualty", "rescue", "towage",
    "towing", "mayday", "search and rescue", "collision", "abandoned vessel",
    "recovery operation", "marine incident", "vessel fire", "cargo spill",
]


def gn(query, hl, gl, ceid):
    return ("https://news.google.com/rss/search?"
            + urllib.parse.urlencode({"q": query, "hl": hl, "gl": gl, "ceid": ceid}))


# (источник, url, strip_google_suffix)
FEEDS = {
    "en": [
        ("gCaptain", "https://gcaptain.com/feed/", False),
        ("Hellenic Shipping", "https://www.hellenicshippingnews.com/feed/", False),
        ("The Loadstar", "https://theloadstar.com/feed/", False),
    ],
    "ru": [("Google News", gn("спасение судов OR крушение корабля OR затонувшее судно OR судно село на мель", "ru", "RU", "RU:ru"), True)],
    "cn": [("Google News", gn("沉船打捞 OR 船舶拆解 OR 海难救援 OR 搁浅货船", "zh-CN", "CN", "CN:zh-Hans"), True)],
    "hi": [("Google News", gn("जहाज़ तोड़ना OR जहाज़ डूबना OR जहाज़ बचाव", "hi", "IN", "IN:hi"), True)],
    "bn": [("Google News", gn("জাহাজ ভাঙা OR জাহাজ ডুবি OR জাহাজ উদ্ধার", "bn", "BD", "BD:bn"), True)],
    "de": [("Google News", gn("Schiffswrack OR Schiffsbergung OR Schiffsverschrottung", "de", "DE", "DE:de"), True)],
    "fr": [("Google News", gn("épave de navire OR sauvetage maritime OR démolition navale", "fr", "FR", "FR:fr"), True)],
    "es": [("Google News", gn("naufragio OR salvamento marítimo OR desguace de buques", "es", "ES", "ES:es"), True)],
}


def fetch(url, timeout=30):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read()


def strip_html(text):
    if not text:
        return ""
    text = re.sub(r"<[^>]+>", " ", text)
    text = html_mod.unescape(text)
    return re.sub(r"\s+", " ", text).strip()


def parse_date(value):
    if not value:
        return None
    for fn in (parsedate_to_datetime, lambda v: datetime.fromisoformat(v.replace("Z", "+00:00"))):
        try:
            return fn(value)
        except Exception:
            continue
    return None


def clean_google_title(title):
    if " - " in title:
        head, _, tail = title.rpartition(" - ")
        if head and len(tail) <= 45 and ". " not in tail:
            return head.strip(), tail.strip()
    return title, "Google News"


def parse_feed(source, raw, strip_suffix=False):
    items = []
    root = ET.fromstring(raw)
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
        dt = parse_date(child("pubDate") or child("dc:date"))
        items.append({
            "title": title,
            "link": link,
            "source": out_source,
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


def relevance_en(text):
    return sum(1 for kw in TOPIC_KEYWORDS
               if re.search(r"\b" + re.escape(kw) + r"\b", text))


def main():
    out_items = {}
    for lang, feeds in FEEDS.items():
        all_items = []
        for source, url, strip_suffix in feeds:
            try:
                all_items.extend(parse_feed(source, fetch(url), strip_suffix))
            except Exception as exc:
                print(f"{lang}/{source}: ERROR {exc}")

        # дедупликация
        seen, unique = set(), []
        for it in all_items:
            if it["link"] in seen:
                continue
            seen.add(it["link"])
            unique.append(it)

        # сортировка: en — по релевантности и дате; остальные — по дате
        if lang == "en":
            unique.sort(key=lambda it: (relevance_en(it["title"].lower()), it["date"] or "0000"), reverse=True)
        else:
            unique.sort(key=lambda it: (it["date"] or "0000"), reverse=True)

        out_items[lang] = unique[:MAX_TOTAL]
        print(f"{lang}: {len(unique[:MAX_TOTAL])} items")

    data = {
        "updated": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "items": out_items,
    }
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)

    for lang in ("en", "ru", "cn", "hi", "bn", "de", "fr", "es"):
        lst = out_items.get(lang, [])
        first = lst[0]["title"][:55] if lst else "—"
        print(f"  {lang}: {len(lst)} | {first}")


if __name__ == "__main__":
    main()
