# Haven — Product app

Parent dashboard + child PWA for the Haven mobile network. Lives at `app.gethavenmobile.com`.

Marketing site (the existing `index.html` + `/api` at repo root) is unrelated to this project and deploys separately.

## Local dev

```bash
cd app
npm install
npm run dev
# open http://localhost:3000
```

## Vercel setup (one-time)

This app deploys as a **separate Vercel project** from the marketing site, both pointing at the same Git repo.

1. In Vercel, create a new project from this repo.
2. Set **Root Directory** to `app`.
3. Framework will auto-detect as Next.js.
4. Add custom domain `app.gethavenmobile.com`.
5. DNS: add a `CNAME` record `app` → `cname.vercel-dns.com` on `gethavenmobile.com`.

The existing marketing-site Vercel project keeps its root directory at the repo root.

## Brand tokens

Design tokens (colours, type scale, spacing) live in [app/globals.css](app/globals.css) and mirror [style-guide.md](../style-guide.md) in the repo root. **Do not redefine** brand values — extend the variable set in `globals.css` if a new token is genuinely needed.

## Routes

See [the full plan](../../../.claude/plans/mvno-product-design-partitioned-wall.md) for the route map and phasing. Current state: foundation + broadsheet home stub. Auth, GIGS integration, real data, child PWA all to come.
