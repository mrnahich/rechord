# Builds blog.html and blog/<slug>.html from tools/blog_posts.py. Run from anywhere: python3 tools/build_blog.py
import datetime, html, pathlib, re, sys
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tools'))
from blog_posts import POSTS

HEAD = '''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
{base}<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#050a14">
<link rel="icon" href="assets/ui/rechord-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&family=Instrument+Serif:ital@1&display=swap">
<link rel="stylesheet" href="css/site.css">
<link rel="stylesheet" href="css/pages.css">
</head>
<body data-page="blog">
<main>
'''
FOOT = '''</main>
<footer class="footer" id="footer"></footer>
<script src="js/core.js"></script>
<script src="js/pages.js"></script>
</body>
</html>
'''
e = lambda s: html.escape(s, quote=True)
nice = lambda d: datetime.date.fromisoformat(d).strftime('%-d %B %Y')
mins = lambda b: max(2, round(len(re.sub(r'<[^>]+>', ' ', b).split()) / 220))

def card(p, i):
    return f'''      <a class="post-card card" href="blog/{p['slug']}.html" data-reveal style="--d:{i * .1:.1f}s">
        <div class="post-cover"><img src="assets/blog/{p['cover']}" alt="{e(p['cover_alt'])}" loading="lazy"></div>
        <div class="post-meta mono"><span>{e(p['kicker'])}</span><span>{nice(p['date'])} · {mins(p['body'])} min read</span></div>
        <h2>{e(p['title'])}</h2>
        <p>{e(p['excerpt'])}</p>
      </a>'''

index = HEAD.format(base='', title='Blog — ReChord', desc='Stories, guides and ideas from the team behind ReChord, the app that pins voices to places.') + f'''  <section class="page-hero">
    <div class="grid-bg" aria-hidden="true"></div><div class="glow" aria-hidden="true"></div>
    <div class="wrap">
      <span class="eyebrow" data-reveal>Blog</span>
      <h1 class="display split">Notes from <span class="serif">the map.</span></h1>
      <p class="lead" data-reveal style="--d:.3s">Stories, guides and ideas from the people building ReChord.</p>
    </div>
  </section>
  <section class="wrap blog-list">
{chr(10).join(card(p, i) for i, p in enumerate(POSTS))}
  </section>
''' + FOOT
(ROOT / 'blog.html').write_text(index)

(ROOT / 'blog').mkdir(exist_ok=True)
for i, p in enumerate(POSTS):
    others = [q for q in POSTS if q is not p]
    page = HEAD.format(base='<base href="../">\n', title=f"{e(p['title'])} — ReChord Blog", desc=e(p['excerpt'])) + f'''  <article class="post">
    <header class="post-hero wrap">
      <a class="post-back mono" href="blog.html">← All posts</a>
      <div class="post-meta mono" data-reveal><span>{e(p['kicker'])}</span><span>{nice(p['date'])} · {mins(p['body'])} min read · The ReChord team</span></div>
      <h1 class="display split">{e(p['title'])}</h1>
    </header>
    <figure class="post-figure wrap" data-reveal><img src="assets/blog/{p['cover']}" alt="{e(p['cover_alt'])}"></figure>
    <div class="post-body wrap">
{p['body'].strip()}
    </div>
    <aside class="post-cta wrap">
      <div class="card">
        <h3>Leave your first voice.</h3>
        <p>ReChord is free on the App Store.</p>
        <a class="store-badge" data-store target="_blank" rel="noopener"><img src="assets/ui/app-store-badge.svg" alt="Download on the App Store" height="48"></a>
      </div>
    </aside>
    <section class="wrap post-more">
      <span class="eyebrow">Keep reading</span>
      <div class="blog-list">
{chr(10).join(card(q, j) for j, q in enumerate(others))}
      </div>
    </section>
  </article>
''' + FOOT
    (ROOT / 'blog' / f"{p['slug']}.html").write_text(page)
print('built', len(POSTS), 'posts')
