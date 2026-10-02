# Site icon

`favicon.svg` is the "pink-heart" icon from Fluent Emoji Flat (Microsoft), fetched from
https://api.iconify.design/fluent-emoji-flat/pink-heart.svg and licensed MIT
(https://github.com/microsoft/fluentui-emoji/blob/main/LICENSE).

`favicon.ico` (16/32/48), `apple-touch-icon.png` (180, white background), `icon-192.png` and
`icon-512.png` (dark background) are rendered from that SVG with sharp.

`icon-maskable-512.png` (the heart at 60% of the canvas, inside the maskable safe zone) is rendered by
`node scripts/make-maskable-icon.mjs`. `site.webmanifest` lists it with `"purpose": "maskable"`.

Share cards (`public/images/og/*.png`, 1200x630) come from `node scripts/make-og-card.mjs`; see the
header of that script.
