// src/cleaner.ts
function cleanText(text) {
  if (!text) return "";
  let cleaned = text.normalize("NFKC");
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
  cleaned = cleaned.replace(/\s+/g, " ");
  return cleaned.trim();
}

// src/rules.ts
var defaultRules = [
  {
    name: "email",
    pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
    severity: "medium"
  },
  {
    name: "phone_number",
    // Matches common formats like (123) 456-7890, 123-456-7890, 123.456.7890
    pattern: /(\+\d{1,3}[-.]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
    severity: "medium"
  },
  {
    name: "credit_card",
    // Simple check for sequences of 13-19 digits, possibly separated by spaces or dashes
    pattern: /\b(?:\d[ -]*?){13,19}\b/,
    severity: "high"
  },
  {
    name: "profanity_strong",
    // Placeholder for strong insults - using a very limited set for demonstration to avoid hardcoding a massive list
    // In a real app, this might be loaded from a better source or be more comprehensive
    pattern: /\b(fuck|shit|bitch|asshole|cunt|dick|pussy)\b/i,
    severity: "high"
  },
  {
    name: "numeric_sequence_long",
    // Catch generic long number sequences that might be identifiers
    pattern: /\b\d{10,}\b/,
    severity: "low"
  }
];

// src/index.ts
var FilterSense = class {
  constructor(rules = defaultRules) {
    this.rules = [...rules];
  }
  /**
   * Checks text against all rules.
   * Returns a result object containing matched rules and sanitized text.
   */
  check(text) {
    const sanitized = cleanText(text);
    const matched = [];
    for (const rule of this.rules) {
      if (rule.pattern.test(sanitized)) {
        matched.push(rule);
      }
    }
    return {
      safe: matched.length === 0,
      matched,
      sanitized,
      rules: [...this.rules]
    };
  }
  /**
   * Classifies text as 'allowed' or 'restricted' based on matches.
   */
  classify(text) {
    const { matched } = this.check(text);
    if (matched.length === 0) {
      return {
        label: "allowed",
        severity: "none",
        triggers: []
      };
    }
    const severityLevels = {
      low: 1,
      medium: 2,
      high: 3,
      critical: 4
    };
    let maxSeverity = "low";
    let maxScore = 0;
    for (const rule of matched) {
      const s = rule.severity || "low";
      const score = severityLevels[s];
      if (score > maxScore) {
        maxScore = score;
        maxSeverity = s;
      }
    }
    return {
      label: "restricted",
      severity: maxSeverity,
      triggers: matched.map((r) => r.name)
    };
  }
  /**
   * Throws an error if the text is not safe.
   */
  ensureSafe(text) {
    const { safe, matched } = this.check(text);
    if (!safe) {
      const names = matched.map((r) => r.name).join(", ");
      throw new Error(`Text contains unsafe content: ${names}`);
    }
  }
  addRule(name, pattern, severity = "medium") {
    this.removeRule(name);
    this.rules.push({ name, pattern, severity });
  }
  removeRule(name) {
    this.rules = this.rules.filter((r) => r.name !== name);
  }
  listRules() {
    return [...this.rules];
  }
};
var filter = new FilterSense();
export {
  FilterSense,
  filter
};
