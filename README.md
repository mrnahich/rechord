# ReChord website — v1 draft

Static site, no build step. Four pages: `index.html` (product + the live map hook), `about.html` (team),
`updates.html` (release route), `investors.html`.

## Run

    python3 -m http.server 4780 --bind 127.0.0.1

then open http://127.0.0.1:4780. It must be served over http(s): the microphone and the map do not work from `file://`.

## The hook (index.html, js/hook.js)

- Visitor's city comes from their IP (geojs.io, then ipwho.is, then the browser time zone, then London).
- The map is MapLibre GL (vendored in `vendor/`) with our own style over OpenFreeMap vector tiles (OpenStreetMap data).
- Demo voices are placed on real nearby places read from the map tiles; their titles use the real place name.
- The visitor records up to 15 s. The recording is stored only in their browser (IndexedDB) and is never uploaded.

## Mock / placeholder content to replace before publishing

- Demo voices: `assets/audio/*.m4a` are macOS text-to-speech; names, likes and play counts in `js/hook.js` are invented.
- Avatars, covers and place photos in `assets/img/` are the generated images from the motion teasers.
- `updates.html`: features are real, version numbers and dates are samples (`js/pages.js`).
- `investors.html`: no metrics are shown; the four tiles are intentionally blank.
- Contact address `hello@rechord.life` in `js/pages.js` is a placeholder.
- Team voice intros are marked "soon"; no voices were fabricated for real people.

## Third-party services called from the visitor's browser

geojs.io / ipwho.is (IP to city), tiles.openfreemap.org (map tiles and fonts), photon.komoot.io (the "Wrong city?" search),
Google Fonts. For production, move IP lookup to our own server or CDN header and consider self-hosting tiles.

## Team voices

Put each recording at `assets/team/voice/<id>.m4a` or `.mp3` with id one of: shayan, oguzhan, jim, aslan, mahdi.
The pin becomes playable on its own and the waveform is drawn from the real audio. Positions and place names are in `js/pages.js`.
