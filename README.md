# OnlyYes.love (Expo / React Native + Web)

A playful Valentine link builder where the recipient can *only* say **YES**.

## Routes
- `/` — Landing page
- `/builder` — Build your custom link
- `/v/<code>` — Shareable valentine page (code is a URL-safe base64 payload)

## Features
- Vibrant gradients + glassy card UI
- Builder with live preview
- Multiple “No button” tricks (toggle-able):
  - **dodgeNo**: NO runs away when the cursor/finger gets close
  - **jumpscare**: first NO press opens a “wrong button” modal and boosts YES
  - **magnetNo**: NO drifts toward YES after being pressed
  - **morphNoToYes**: after a few tries, NO literally becomes “Yes”
  - **ghostNo**: NO fades and becomes effectively unusable

## Run locally (web)
```bash
npm install
npx expo start --web
```

## Run on phone (Expo Go)
```bash
npm install
npx expo start
```
Scan the QR code with Expo Go.

## Deploy (fastest path)
Because the share link encodes everything in the URL, you can deploy as a static web app (no backend).

Option A: Expo web build + host anywhere
```bash
npx expo export -p web
```
Upload the `dist/` folder to Netlify / Vercel / Cloudflare Pages.

Option B: Vercel/Netlify “build command”
- `npx expo export -p web`
- publish directory: `dist`

## Custom domain
If you buy a domain like `onlyyes.love`, point it to your host and it will work instantly.

## Notes
- The builder uses `window.location.origin` on web to form the link. On native it falls back to `https://onlyyes.love` (change that once deployed).
- GIF default matches your provided Giphy link.
