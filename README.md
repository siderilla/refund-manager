# REFUNDMANAGER

A full-stack expense & refund tracker I'm building to get properly comfortable with Angular (and to have something more useful than another to-do list) (˶ᵔ ᵕ ᵔ˶)

Employees log their outlays, pick a category, and send in a refund request. HR gets a separate view to review requests, check per-category budget status, and spot patterns on a calendar heatmap + charts.

# What it does

- Employee view: log an outlay, track your own requests, see your personal recap
- HR view: review requests by status, company-wide recap, filter by department
- Calendar heatmap of outlays by day (the part I'm proudest of), built directly on the native JS `Date` API with no AI help, just docs and a lot of trial and error. Plus budget-status widgets per category and charts
- Real login: password hashed server-side, JWT issued on success and sent as a Bearer token on every request after that
- Session lives in `sessionStorage` on purpose, not `localStorage`: reload or close the tab and you're logged out again

# Made with

- Angular 22 (standalone components) + TypeScript, reactive forms
- Vitest for unit tests
- Talks to the [.NET + PostgreSQL backend](https://github.com/siderilla/RefundManager). Run that alongside this to actually use the app

# Run it

```bash
npm install   # or pnpm install
ng serve
```

Needs the [backend](https://github.com/siderilla/RefundManager) running too (with its own Postgres database). The API URL lives in `src/environments/environment.ts` (production) / `environment.development.ts` (used automatically by `ng serve`) — point it at wherever the backend actually runs.

# Try the demo

The 4 seed employees all share the password **`Demo2026!`** (see the [backend README](https://github.com/siderilla/RefundManager) for how it's bootstrapped). Log in with any employee's name + surname and that password; the one with the `HR Manager` role can approve/reject refund requests.

Still a work in progress. A live demo with a hosted database is coming soon!

Enjoy ⋆｡°✩
