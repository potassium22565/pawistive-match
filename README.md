# The Pawistive Match Project — v0.1

A questionnaire-first shelter adoption website, built with HTML, CSS and JavaScript for GitHub Pages. No build step, external packages, API keys, analytics or live AI service.

## Run locally

Requires Python 3 for the local server; Node 24 for tests.

```sh
python3 -m http.server 8000
```

Open http://localhost:8000 from the repository root. Opening index.html directly through file:// will not load the JSON dataset. Run `npm test` for matching-engine checks. No npm install is necessary.

## Publish with GitHub Pages

1. Create a GitHub repository, then upload the **contents** of this folder to its root. Include `.github/workflows/pages.yml` and `.nojekyll` (these may be hidden by your file manager). Use the `main` branch.
2. In the repository, open Settings → Pages → Build and deployment → Source → GitHub Actions.
3. Push to main, or run the “Test and deploy GitHub Pages” workflow from Actions. GitHub provides the deployed URL after success.

Alternative: omit the workflow and use Pages “Deploy from a branch”, selecting main and `/ (root)`. All resource paths are relative so project repository URLs work.

This deliverable is repository-ready source; no GitHub account was connected and no remote repository or deployment has been created.

## Visitor journey

Homepage → 16 required single-choice questions → ranked eligible dogs → dedicated dog profile route (`#dog/dog-1`) with care, household compatibility and adoption instructions. Each profile has its own shareable URL within the static app. Back/forward navigation works. Answers persist only in sessionStorage for the current tab and may be cleared from results.

## Staff workspace

Open admin.html. Add/edit/delete profiles, upload a photograph under 1 MB, change status, and import/export JSON. Edits are in localStorage and affect adopter mode **on the same browser and origin**. Refresh adopter mode after editing. Export dogs.json, replace data/dogs.json in GitHub, and commit to update the public data for everyone. Reset removes the local override and restores the deployed dataset. Export before resetting.

This is a working local demo, not an authenticated staff portal. Anyone may open it; it cannot alter the repository or other people's browsers. Photographs are embedded in the export or referenced via HTTPS. Browser quota limits apply; failed saves are reported. No photo is bundled for the fictional dogs; placeholders avoid implying a real shelter listing. Never store confidential staff notes in published JSON.

## Matching model

Documented incompatibility with children/cats/dogs, inability to meet recorded ongoing medical needs, or nonavailable status excludes a record. Unknown household compatibility remains eligible but is explicitly flagged for staff assessment. The model does not infer suitability from breed, age or size.

| Scored factor | Weight | Rule |
| --- | ---: | --- |
| Activity | 30 | 1 − absolute difference of 1–3 activity levels / 2 |
| Alone time | 25 | Full points within recorded limit; subtract excess hours / 6, floored at zero |
| Training commitment | 20 | Full points if commitment meets need; subtract level shortfall / 3 |
| Medical capacity | 15 | Full points if no recorded needs or willing; half if needs require discussion |
| Exercise plan | 10 | Full points for a confirmed plan, otherwise 30% |

Score = rounded sum of weighted factors, out of 100. Weights and thresholds are provisional, not scientifically validated. A score is not a success probability. Ties use record ID for repeatability. Unknown compatibility does not earn household points; it creates a visible review concern. Medical needs must be discussed individually even if a user selects yes.

Housing permission is flagged on results. Housing type, backup support, experience, grooming, settling-in, budget and introduction answers currently provide discussion context, not additional points. No hidden inference is made from these answers. Future iterations should collect corresponding verified dog needs before scoring them. Current explanations are deterministic templates; there is no AI API call.

## Historical replay

Staff workspace accepts a JSON array like `data/historical-demo.json`. Every case supplies an ID, adopter answers, the adopted dog ID, and a complete snapshot of the dogs actually available at that time. Use pre-adoption observations and **available status at the time**, not today's adopted status. The historical replay uses the same `rank()` function as visitor recommendations.

It reports exact eligible rank (or Excluded), candidate counts, and top-3/top-5 inclusion over all cases. Excluded adopted dogs count as misses. The included case is fictional and demonstrates the format only. Real historical records have not been provided or accessed. Remove personal identifiers before importing. Replay data stays in memory in the browser and is not uploaded.

Historical choice agreement cannot establish welfare, long-term success, or that a higher-ranked alternative would have been better. Small candidate pools inflate top-k results. Missing observations, inconsistent records, selection bias and time leakage must be assessed. Agree on outcomes with shelter staff; use held-out records and compare with simple baselines before drawing conclusions.

## Files

- `js/engine.js`: pure scoring, validation and historical evaluation.
- `js/app.js`: questionnaire, results and profile routes.
- `js/admin.js`: local staff workspace and replay.
- `js/store.js`: dataset loading, storage, escaping and export.
- `data/dogs.json`: six fictional dog profiles.
- `tests/engine.test.js`: matching checks.

## Next integration boundaries

Replace the local data adapter with an authenticated backend that validates all writes, controls staff access, stores photos and retains verification history. For live AI explanations, call a server endpoint with only the verified facts, computed factors and concerns; keep API keys on that server. AI wording must never override exclusions or invent dog traits. No backend URL, secret or pretend integration is included.

Before a shelter pilot, staff must verify each profile and adoption instruction, define compatibility policies, review accessibility on actual devices and validate the model against real records. The current prototype is not an official shelter service.
