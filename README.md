# FilterSense

A lightweight, zero-dependency text safety filter for Node.js and the browser.
Practical, extensible, and designed for AI prompts and user input sanitization.

## What it does

FilterSense helps you detect and handle potentially sensitive or unsafe patterns in text (for example: emails, phone numbers, credit card-like sequences, profanity, and long numeric identifiers).

It is intentionally rule-based (regex-driven), so it is:

- Predictable
- Fast
- Easy to extend

## Features

- 🚀 **Lightweight**: Zero external runtime dependencies.
- 🛡️ **Type Safe**: Built with TypeScript.
- 🧹 **Smart Cleaning**: Removes invisible characters, excess whitespace, and normalizes Unicode.
- 🧩 **Extensible**: Add your own regex rules easily.
- 📦 **Universal**: CommonJS and ESM support.

## Quickstart (local development)

```bash
npm install
npm test
npm run build
```

## Installation

```bash
npm install filtersense
```

## Usage

### Basic Check

```typescript
import { filter } from 'filtersense';

const result = filter.check('Hello world! Check out test@example.com');

console.log(result);
/*
{
  safe: false,
  matched: [ { name: 'email', pattern: /.../, severity: 'medium' } ],
  sanitized: 'Hello world! Check out test@example.com',
  rules: [...]
}
*/
```

### Basic Check (CommonJS)

```js
const { filter } = require('filtersense');

const result = filter.check('Call me at 123-456-7890');
console.log(result.safe);
```

### Classification

Quickly determine if content is allowed or restricted.

```typescript
const classification = filter.classify('Some bad words here...');

if (classification.label === 'restricted') {
  console.warn(`Blocked due to ${classification.severity} severity rule.`);
}
```

### Using it like validation / middleware

FilterSense does not ship an Express middleware out of the box, but it is easy to integrate.

```ts
import { filter } from 'filtersense';
import type { Request, Response, NextFunction } from 'express';

export function requireSafeText(field: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const value = String((req.body as any)?.[field] ?? '');
    const result = filter.check(value);

    if (!result.safe) {
      return res.status(400).json({
        error: 'Unsafe content detected',
        triggers: result.matched.map(r => r.name),
        sanitized: result.sanitized
      });
    }

    next();
  };
}
```

### Ensuring Safety (Throwing Error)

Great for middleware or pre-validation hooks.

```typescript
try {
  filter.ensureSafe('This contains sensitive info 1234-5678-9012-3456');
} catch (error) {
  console.error('Validation failed:', error.message);
}
```

### Custom Rules

You can add your own rules or modify the existing instance.

```typescript
import { FilterSense } from 'filtersense';

const myFilter = new FilterSense();

// Add a rule to block the word "groot"
myFilter.addRule('no_groot', /\bgroot\b/i, 'low');

const result = myFilter.check('I am Groot');
console.log(result.safe); // false
```

## Writing rules

A rule is:

- `name`: a stable identifier (used in `triggers` and error messages)
- `pattern`: a `RegExp` tested against the sanitized text
- `severity`: one of `low | medium | high | critical`

Tip: Prefer word boundaries (`\b`) when matching words to avoid false positives.

## Default Rules

FilterSense comes with basic detection for:

- **Email addresses**
- **Phone numbers**
- **Credit card-like sequences**
- **Profanity** (basic list)
- **Long numeric sequences**

## Severity and classification behavior

`classify()` returns `restricted` if one or more rules match.

If multiple rules match, the returned severity is the highest severity among the matched rules.

## API

### `check(text: string): FilterResult`
Runs all rules against the text. Returns `safe`, `matched`, `sanitized` text, and the list of evaluated `rules`.

### `classify(text: string): ClassifyResult`
Returns `{ label: 'allowed' | 'restricted', severity, triggers }`.

### `ensureSafe(text: string): void`
Throws an error if any rule is triggered.

### `addRule(name: string, pattern: RegExp, severity?: Severity)`
Adds a new rule or updates an existing one by name.

### `removeRule(name: string)`
Removes a rule by name.

## Demo (included in this repo)

This repo includes a tiny runnable demo so you can test behavior quickly.

```bash
npm run demo
```

You can also pass your own text:

```bash
npm run demo -- "contact me at test@example.com"
```

## License

MIT
