# Contributing to FilterSense

Thanks for taking the time to contribute!

## Quickstart

```bash
npm install
npm test
npm run build
npm run demo
```

## Project structure (high level)

- `src/`: library source (TypeScript)
- `dist/`: build output (generated)
- `demo/`: small runnable demo
- `docs/`: GitHub Pages site

## Development workflow

1. Fork the repo and create a feature branch.
2. Make your change (keep it focused and small when possible).
3. Add or update tests if behavior changes.
4. Ensure all checks pass locally:

```bash
npm test
npm run build
```

## Adding or updating rules

- Prefer clear rule names that won’t change.
- Prefer word boundaries (`\b`) where appropriate to avoid false positives.
- Keep rules deterministic and regex-driven.

## Commit / PR guidelines

- Write a clear PR title and description.
- Include a short example (input/output) when changing rule behavior.
- If you add a new rule, mention the intended false-positive/false-negative tradeoffs.

## Reporting bugs

Please open an issue with:

- What you expected
- What happened instead
- A minimal repro string
- Node.js version

## Code of Conduct

Be respectful and constructive in issues and pull requests.
