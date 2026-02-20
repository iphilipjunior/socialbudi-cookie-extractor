# Extension Icons

This directory holds the PNG icon files required by `manifest.json`.

## Required Files

| File | Size | Used For |
|------|------|----------|
| `icon16.png` | 16×16 px | Favicon / tab bar |
| `icon48.png` | 48×48 px | Extensions management page |
| `icon128.png` | 128×128 px | Chrome Web Store / install dialog |

## Source File

The master source is `icon.svg` in the repository root.
Design: SocialBudi blue gradient background (#0066FF → #0052CC), cookie with
chocolate chips, bite notch, and "SB" label.

## Converting SVG → PNG

Choose any of the methods below to produce the three required PNG files and
place them in this directory.

---

### Method 1 — Inkscape (CLI, recommended)

```bash
inkscape icon.svg --export-type=png --export-width=128 --export-filename=icons/icon128.png
inkscape icon.svg --export-type=png --export-width=48  --export-filename=icons/icon48.png
inkscape icon.svg --export-type=png --export-width=16  --export-filename=icons/icon16.png
```

---

### Method 2 — ImageMagick / `convert`

```bash
convert -background none icon.svg -resize 128x128 icons/icon128.png
convert -background none icon.svg -resize 48x48   icons/icon48.png
convert -background none icon.svg -resize 16x16   icons/icon16.png
```

---

### Method 3 — Node.js (`sharp`)

```bash
npm install sharp
node -e "
const sharp = require('sharp');
const src = 'icon.svg';
[128, 48, 16].forEach(s =>
  sharp(src).resize(s, s).png().toFile('icons/icon' + s + '.png')
);
"
```

---

### Method 4 — Browser (no tools required)

1. Open `icon.svg` in Chrome
2. Right-click → **Save image as** → save as `icon128.png`
3. Repeat, resizing manually in any image editor to 48×48 and 16×16

---

### Method 5 — Online Converter

1. Upload `icon.svg` to [svgtopng.com](https://svgtopng.com) or similar
2. Export at 128×128, 48×48, and 16×16
3. Save files as `icon128.png`, `icon48.png`, `icon16.png` in this directory

---

## Icon Guidelines

- **Format**: PNG with transparency supported
- **Background**: Rounded square filled with `#0066FF → #0052CC` gradient
- **Minimum contrast**: WCAG AA (already met by the SVG design)
- **Production**: Replace the placeholder SVG with a professionally designed
  icon before submitting to the Chrome Web Store

## Future Improvements

- [ ] Commission professional icon design
- [ ] Add dark-mode variant
- [ ] Add high-DPI (2×) variants for Retina displays
- [ ] Submit polished icon for Chrome Web Store listing

---

**Note:** The extension works without PNG files — Chrome will display a default
puzzle-piece icon. Add the PNGs before distributing to users.
