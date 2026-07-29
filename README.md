# nexus — project site

Landing page for the Nexus energy-system optimisation stack.

**Live:** https://vishalram24.github.io/nexus/

## The packages this page is about

- [**nexus-energy**](https://github.com/VishalRam24/nexus-energy) — energy system optimisation across 15 sectors
- [**nexus-opt**](https://github.com/VishalRam24/nexus-opt) — the Rust solver core underneath it

## Local development

```bash
npm install
npm run dev      # http://localhost:5173/nexus/
npm run build    # -> dist/
npm run preview
```

Vite + React 18 + Tailwind 3. `base` is set to `/nexus/` in `vite.config.js`
because GitHub Pages serves project sites under `/<repo>/`; change it if the
repo is ever renamed or moved to a custom domain.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site
and publishes `dist/` to GitHub Pages.

## Design credit

The page design, layout and component structure follow
[Notus React](https://github.com/creativetimofficial/notus-react) by
[Creative Tim](https://www.creative-tim.com), used under the MIT licence. The
palette and all content are Nexus's own — Notus's `blueGray`/`lightBlue` scheme
was replaced by `ink`/`flux`/`ember` in `tailwind.config.js`. Creative Tim's
copyright notice is retained in [LICENSE](LICENSE) as their licence requires.

## Licence

MIT — see [LICENSE](LICENSE).
