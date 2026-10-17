# Pots & Plants Melbourne — FIT5032 A3

A Vue 3 web application for an illustrative Melbourne urban-greening community website. This is a coursework prototype; images and example records are not official planting projects.

## Project links

- Live app (Firebase Hosting): https://fit5032-67cf3.web.app
- GitHub repository: https://github.com/suzie0516/FIT5032-Suzie-Yoon/tree/Assignment/A3
- Firebase project: `fit5032-67cf3`

## Technology

Vue 3, Vite, Vue Router, Bootstrap, Leaflet, Firebase Authentication, Cloud Functions v2 (Node.js 22), Cloud Firestore, Chart.js, Nodemailer, jsPDF.

## Local setup

Use Node.js 22 or a compatible version specified by `package.json`.

```powershell
cd A3
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Open the local URL displayed by Vite, usually `http://localhost:5173/`. `VITE_FUNCTIONS_BASE_URL` must refer to the HTTPS base URL of this project's deployed Firebase Functions. Check the Firebase Console if the example value does not match your project. Values prefixed with `VITE_` are exposed in client bundles; **never put passwords, API secrets or service account credentials in them**. Firebase Auth web configuration in `src/firebase.js` is public client configuration, not a server secret.

## Features and assessment mapping

| Requirement | Implementation |
| --- | --- |
| D.1 | Firebase Authentication (registration, login and account state) |
| D.2 | Authenticated email via `sendEmail`, optionally attaching a validated PDF or CSV |
| D.3 | Two interactive datasets in `TablesDemoView.vue` with search, sort and pagination |
| D.4 | Firebase Hosting deployment |
| E.1 | Firebase Cloud Functions: `countRecords`, `adminOverview`, `sendEmail`, `sendBulkEmail`, `getPlants`, `getProjects`, `designRatings` |
| E.2 | Leaflet-based Melbourne map, including location search and route planning |
| E.3 | Accessibility improvements across views; Lighthouse is an automated check, not complete WCAG certification |
| E.4 | CSV/PDF export via `src/utils/exportData.js` |
| F.1 | Admin Overview, interactive Firestore-based charts, selected-member bulk email, and two public REST API endpoints |

The table datasets in `TablesDemoView.vue` are illustrative client-side records; they are **not** the same as the live Firestore-backed charts and public plant/project APIs. Design ratings are stored per authenticated user and design in Firestore through `designRatings`.

## Cloud Functions

Functions are exported from `functions/index.js`. Install server dependencies separately when deploying from a fresh checkout:

```powershell
cd functions
npm ci
cd ..
```

The email functions require Firebase Secret Manager secrets named `GMAIL_USER` and `GMAIL_APP_PASSWORD`. These must be configured in the Firebase project; do not copy secret values into Git, `.env.example`, or screenshots.

## Firestore security

`firestore.rules` records the rule **already confirmed as published in Firebase Console**: direct browser read/write access is denied. Backend functions using the Firebase Admin SDK can still access Firestore and must verify their own authorization and validate requests.

`firebase.json` now references `firestore.rules` so the rule remains version-controlled. **Do not run an unqualified `firebase deploy` unless you intend to deploy all configured targets**. To deploy only this rule after reviewing it, use:

```powershell
firebase deploy --only firestore:rules
```

Hosting and Functions can continue to be deployed independently:

```powershell
npm run build
firebase deploy --only hosting
# Deploy a specific changed function only when needed:
# firebase deploy --only functions:designRatings
```

## Verification and limitations

- The build has been reported successful using `npm run build`; hosting and `designRatings` were deployed successfully.
- Two different test accounts' ratings were reported to contribute to a shared average.
- Lighthouse Accessibility 100 was reported for seven major pages, alongside keyboard and 200% zoom checks. An automated score does not itself establish full WCAG 2.1 AA conformance.
- `designRatings` reads at most 1,000 rating documents for the coursework demonstration; production use should use scalable aggregates.
- Public API results and interactive data tables are different data sources.
- Cloudflare Workers automatic build status is unrelated to the Firebase Hosting/Functions deployment used by this A3 app.

## Submission

The Moodle submission must include the A3 source (excluding `node_modules`, `dist`, local `.env` files, and caches) **and the completed official A3 report template** with the 6–10-minute demonstration video URL, AI/use-of-tools declaration, and other required details. Check the report and video access permissions before submission.
