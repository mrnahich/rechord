# ReChord website — v1 draft

Static site, no build step. Pages: `index.html` (product, the live map hook, the film, reviews, Android waitlist), `about.html` (team),
`updates.html` (release route), `blog.html` + `blog/*.html`, `investors.html`, and `privacy.html` / `terms.html` (not linked yet).

## Run

    python3 -m http.server 4780 --bind 127.0.0.1

then open http://127.0.0.1:4780. It must be served over http(s): the microphone and the map do not work from `file://`.

## The hook (index.html, js/hook.js)

- Visitor's city comes from their IP (geojs.io, then ipwho.is, then the browser time zone, then London). If the IP's country disagrees with the browser time zone (a VPN), the time-zone city wins.
- Place names in non-Latin scripts are skipped, and a voice only names a place that suits its story; otherwise it shows its plain title.
- The map is MapLibre GL (vendored in `vendor/`) with our own style over OpenFreeMap vector tiles (OpenStreetMap data).
- Demo voices are placed on real nearby places read from the map tiles; their titles use the real place name.
- Day / night: the map follows the real sun at the visitor's place (light palette while the sun is up); the chip next to the city flips it.
- The visitor records up to 15 s. The recording is stored only in their browser (IndexedDB) and is never uploaded.

## Mock / placeholder content to replace before publishing

- Map demo voices (maya, noor, theo, aiko, sam, zara) are audio cut from AI-generated selfie videos made in Google Flow; leo and jonas are hidden until they get a recording. The Stories strip reuses the same voices; the old `story_*.m4a` TTS files are no longer used. Names, likes and play counts in `js/hook.js` are invented.
- Avatars, covers and place photos in `assets/img/` are the generated images from the motion teasers.
- `updates.html`: features are real, version numbers and dates are samples (`js/pages.js`).
- `investors.html`: no metrics are shown; the four tiles are intentionally blank.
- Contact address is `info@rechord.life` (`CONTACT_EMAIL` in `js/pages.js`).
- Team voices: Aslan, Oguzhan and Mahdi recorded their own (`assets/team/voice/`); Shayan and Jim still show "soon". No voices were fabricated for real people.

## Third-party services called from the visitor's browser

geojs.io / ipwho.is (IP to city), tiles.openfreemap.org (map tiles and fonts), photon.komoot.io (the "Wrong city?" search),
Google Fonts. For production, move IP lookup to our own server or CDN header and consider self-hosting tiles.

## Team voices

Put each recording at `assets/team/voice/<id>.m4a` or `.mp3` with id one of: shayan, oguzhan, jim, aslan, mahdi.
The pin becomes playable on its own and the waveform is drawn from the real audio. Positions and place names are in `js/pages.js`.

## Legal pages (privacy.html, terms.html)

Generated from the two Markdown files (Privacy Policy, Terms of Use). All emails are `info@rechord.life`. Company name, address,
governing law, dates and a few options are highlighted as "to be added". They carry `noindex` and are kept out of the footer by
`LEGAL_READY = false` in `js/core.js`. When the details are filled in: fill them, remove the robots line, set `LEGAL_READY = true`.

## Link previews

Every page has Open Graph / Twitter tags pointing at `assets/og.png` (1200x630). The absolute URLs use
`https://mrnahich.github.io/rechord/`; change them when the site moves to rechord.life.

## Android closed testing (Home, inside the closing CTA)

Collects the Gmail a tester uses on their phone. There is no backend yet: `WAITLIST_ENDPOINT` in `js/home.js` is empty, so a sign-up
opens a ready-to-send email to info@rechord.life. Set the endpoint (for example a Google Form's formResponse URL plus its field name
in `WAITLIST_FIELD`) to store sign-ups instead.

## App Store reviews (Home)

Quoted word for word from Apple's public reviews feed (UK and Canada). A third 5-star review by "Mr nahich" (Turkey) was left out
because it reads as the founder's own.

## Blog

Posts live in `tools/blog_posts.py`; run `python3 tools/build_blog.py` to rebuild `blog.html` and `blog/*.html`.
Covers in `assets/blog/` were generated with Codex (OpenAI image generation).

## Product film (Home, after the hero)

`assets/video/rechord-film.mp4` (1920x1080, about 1:38) with poster `assets/video/rechord-film.jpg`. Source is
`motion/rechord-film.html` in the parent folder (canvas/DOM film timed to the voice-over; voice by Gemini TTS, music "The Geometry of Breath").
