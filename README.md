# REFUNDMANAGER

A full-stack expense & refund tracker I'm building to get properly comfortable with Angular (and to have something more useful than another to-do list) (˶ᵔ ᵕ ᵔ˶)

Employees log their outlays, pick a category, and send in a refund request. HR gets a separate view to review requests, check per-category budget status, and spot patterns on a calendar heatmap + charts.

# What it does

- Employee view: log an outlay, track your own requests, see your personal recap
- HR view: review requests by status, company-wide recap, filter by department
- Calendar heatmap of outlays by day (the part I'm proudest of), built directly on the native JS `Date` API with no AI help, just docs and a lot of trial and error. Plus budget-status widgets per category and charts
- Sign-in is just name + surname for now, no password. A real protected login system is still on the to-do list
- Session lives in `sessionStorage` on purpose, not `localStorage`: reload or close the tab and you're logged out again. A first small step toward thinking about session handling / security before building real auth

# Made with

- Angular 21 (standalone components) + TypeScript, reactive forms
- Vitest for unit tests
- Talks to the [.NET + PostgreSQL backend](https://github.com/siderilla/RefundManager). Run that alongside this to actually use the app

# Run it

```bash
npm install   # or pnpm install
ng serve
```

Needs the [backend](https://github.com/siderilla/RefundManager) running too (with its own Postgres database). The app expects it at `https://localhost:7258/api`.

Still a work in progress. A live demo with a hosted database is coming soon!

Enjoy ⋆｡°✩
