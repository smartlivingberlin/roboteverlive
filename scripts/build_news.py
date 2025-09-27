import json, time, sys
from urllib.request import urlopen
import xml.etree.ElementTree as ET

FEEDS = [
  ("IFR", "https://ifr.org/rss/news"),
  ("IEEE Spectrum Robotics", "https://spectrum.ieee.org/robotics/fulltext/rss"),
  ("The Verge Robotics", "https://www.theverge.com/rss/group/robotics/index.xml"),
  ("ScienceDaily AI & Robotics", "https://www.sciencedaily.com/rss/computers_math/artificial_intelligence.xml")
]

def fetch_feed(url, limit=8):
  try:
    with urlopen(url, timeout=20) as r:
      data = r.read()
    root = ET.fromstring(data)
    # try RSS 2.0
    items = root.findall(".//item")
    out=[]
    for it in items[:limit]:
      title = (it.findtext("title") or "").strip()
      link = (it.findtext("link") or "").strip()
      date = (it.findtext("pubDate") or "").strip()
      desc = (it.findtext("description") or "").strip()
      out.append({"title":title, "link":link, "date":date, "summary":desc})
    if out: return out
    # Atom fallback
    entries = root.findall(".//{http://www.w3.org/2005/Atom}entry")
    for e in entries[:limit]:
      title = (e.findtext("{http://www.w3.org/2005/Atom}title") or "").strip()
      link_el = e.find("{http://www.w3.org/2005/Atom}link")
      link = (link_el.get("href") if link_el is not None else "").strip()
      date = (e.findtext("{http://www.w3.org/2005/Atom}updated") or "").strip()
      desc = (e.findtext("{http://www.w3.org/2005/Atom}summary") or "").strip()
      out.append({"title":title, "link":link, "date":date, "summary":desc})
    return out
  except Exception as e:
    print("feed error", url, e, file=sys.stderr)
    return []

all_items=[]
for source, url in FEEDS:
  items = fetch_feed(url, limit=6)
  for x in items:
    x["source"]=source
  all_items.extend(items)

# sort newest-ish (fallback on current time)
def ts(s):
  try:
    return time.mktime(time.strptime(s[:25], "%a, %d %b %Y %H:%M:%S"))
  except: return 0

all_items = sorted(all_items, key=lambda x: ts(x.get("date","")), reverse=True)[:30]

with open("data/news.json","w",encoding="utf-8") as f:
  json.dump(all_items, f, ensure_ascii=False, indent=2)
print(f"wrote {len(all_items)} items to data/news.json")
