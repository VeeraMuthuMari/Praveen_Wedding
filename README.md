# Praveena & Praveen — Wedding Invitation

A single-page, frontend-only Vue 3 and Vite invitation for a modern Hindu love marriage. Its cinematic plum-and-rose opening pairs a procedural Three.js mandapam entrance with a CSS illustration fallback, floating petals and hearts, subtle Hindu accents, couple portraits, a live ceremony countdown, exactly two event cards, venue map, RSVP form, and music controls.

## Requirements

- Node.js 20 or newer
- npm

## Run locally

```bash
npm install
npm run dev
```

Vite listens on `0.0.0.0:5173`, so you can also open the invitation from another device on the same network at [http://192.168.1.127:5173](http://192.168.1.127:5173/). Vue DevTools is enabled by the Vite plugin in development only.

Create and preview a production build:

```bash
npm run build
npm run preview
```

The static website is generated in `dist/`.

## Customize the wedding

Update [`src/data/wedding.js`](./src/data/wedding.js) with the couple and family names, wedding ceremony and reception date/time/venue, address, directions links, phone and WhatsApp numbers, email, music path, couple photographs, and venue background. The ceremony countdown is tied only to the wedding ceremony timestamp. Dates use ISO 8601 timestamps with timezone; the display dates and times should match them. `venuePhoto` controls the cinematic venue backdrop; the default is the custom illustration at `public/images/south-indian-mandapam.svg`.

Replace the sample couple images in `public/images/` with optimized photographs of the couple. The included photographs are generic placeholders, not depictions of the couple or an authentic Hindu wedding. Keep the existing filenames or update `bridePhoto` and `groomPhoto` in `src/data/wedding.js`. Change the music path there and add your licensed audio file under `public/music/`. Music starts only after the **Enter Our Wedding** interaction, never on page load.

The RSVP form validates guest details and prepares a WhatsApp message using `whatsappNumber`. Replace the placeholder `0000000000` with the couple's WhatsApp number before enabling RSVP; while the placeholder remains, the form explains that RSVP is unavailable. The separate floating WhatsApp contact link uses the same setting.

The event configuration contains exactly two celebrations: the Wedding Ceremony on Sunday, 24 January 2027, and Wedding Reception on Sunday, 31 January 2027. Their dates and prominent time labels are configured in `src/data/wedding.js`. Reusable Hindu decorative accents are in `src/components/MangoThoranam.vue` and `Kuthuvilakku.vue`; the Three.js temple scene is `src/components/TempleEntrance3D.vue`, with a responsive CSS fallback. Ambient floral layers respect reduced-motion preferences and pause when the browser tab is hidden. The family details, contact links, times, and address are sample invitation content; verify or replace them before sharing the published link.

## Cloudflare Pages

1. Connect the project repository to Cloudflare Pages.
2. Set the build command to `npm run build`.
3. Set the build output directory to `dist`.
4. Configure Node.js 20 or newer for the build environment.

The `public/_redirects` file is copied into `dist/` and keeps the single-page invitation available on direct requests.
