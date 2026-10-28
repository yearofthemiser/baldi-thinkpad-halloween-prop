# Baldi's Think Pad — Halloween cosplay PWA

A free, self-contained Android-friendly recreation of the mockup supplied for the cosplay prop.
No music, dependencies, trackers, or internet connection after the first successful cached load.

## Quick preview without hosting

The separate downloadable file `Baldi_ThinkPad_Standalone_Demo.html` contains all the image, style and JavaScript assets in one HTML file. It is useful for immediate local testing. The installable version in this ZIP is the recommended final choice. The single-file demo cannot be installed as a PWA directly from a local file.

## Play

1. Open `index.html` from the extracted folder on a computer to quickly preview the game, **or** host the folder on an HTTPS website to install it on Android.
2. Rotate the phone to landscape.
3. Use the purple number buttons, `C` to clear, `−` to toggle the sign, and `OK` to submit.
4. The first two randomly generated questions allow right/wrong answers and advance either way.
5. The third is glitched and always wrong. After pressing `OK`, the portrait frowns and all keypad buttons become inert.
6. **Secret reset:** touch Baldi's portrait at any time to begin a fresh round.

## Install on Android (recommended)

- Upload the **contents** of this folder to GitHub Pages, Netlify, or another HTTPS static hosting service. (Upload the files, not a zip served as a download.)
- In Chrome on the Android phone, visit the published HTTPS link while online.
- Chrome menu `⋮` > **Install app** or **Add to Home screen** (wording depends on the device).
- Open the new Think Pad icon from the home screen. It requests fullscreen landscape mode.
- Visit it online once; then test airplane mode, restart the installed app, and confirm it still loads.
- Disable notifications and automatic screen lock, and enable **Screen pinning** under Android settings if you want to avoid accidental exits during cosplay.

For GitHub Pages: in your repository Settings → Pages choose **Deploy from a branch**, select the branch and `/ (root)` folder, then save. The published Pages URL will be an HTTPS address. Publication can take a moment.

**Important:** PWAs and offline service workers require HTTPS (or localhost). Opening an HTML file directly can preview it, but doesn't install/capture offline via a service worker. Do not rely on having a data connection at the costume party: test offline *after* installation.

## Customization

- Image-based interface: `assets/background.png` (1536 x 689, adapted from your reference image).
- Alternate face: `assets/baldi-angry.png`.
- Glitch graphic: `assets/corrupted-problem.svg`.
- Math and reset behavior: `script.js`.
- Button hitboxes, positions and overlay text: `index.html` and `style.css`.
- Layout is scaled to fit a landscape phone while retaining the proportions of your mockup.

## Test checklist

- [ ] Each of the 12 keypad buttons is tappable.
- [ ] `C` clears, `−` toggles sign and `OK` submits.
- [ ] Answer questions 1 and 2 (right or wrong), then see the corrupted question 3.
- [ ] Enter any answer on question 3 and tap `OK`: angry face, red `X`, frozen controls.
- [ ] Tap the portrait: a new random Q1 appears, statuses clear and keys work again.
- [ ] Install and re-open from home screen in airplane mode.

Made for a fan-made, personal Halloween cosplay prop, not an official game or app.

When you edit the app after publishing it, increment `CACHE_NAME` in `service-worker.js` (e.g., from `v1` to `v2`), then deploy. This tells existing installations to refresh the cached files.
