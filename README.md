# TMail promo site

A static, dependency-free landing page for [jodaka/tmail](https://github.com/jodaka/tmail). It is ready for GitHub Pages.

## Preview locally

Open `index.html` directly, or serve the folder with any static server, for example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Publish with GitHub Pages

### Option A — put this site in its own repository

1. Create a GitHub repository, for example `tmail-site`.
2. Copy these files to the repository root.
3. Commit and push.
4. In GitHub, open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select `main` and `/ (root)`, then save.

### Option B — publish from the TMail repository

Copy the site into a `docs/` directory in the TMail repository, then set GitHub Pages to deploy from `master` and `/docs`.

## Files

- `index.html` — page structure and content
- `styles.css` — all visual styling and responsive layouts
- `script.js` — install-command copy button
- `favicon.svg` — site icon

No build step, framework, package manager, external font, or CDN is required.
