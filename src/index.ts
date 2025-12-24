import { cleanText } from './cleaner';
import { defaultRules } from './rules';
import { Rule, FilterResult, ClassifyResult, Severity } from './types';

export { Rule, FilterResult, ClassifyResult, Severity };

export class FilterSense {
  private rules: Rule[];

  constructor(rules: Rule[] = defaultRules) {
    this.rules = [...rules];
  }

  /**
   * Checks text against all rules.
   * Returns a result object containing matched rules and sanitized text.
   */
  public check(text: string): FilterResult {
    const sanitized = cleanText(text);
    const matched: Rule[] = [];

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
  public classify(text: string): ClassifyResult {
    const { matched } = this.check(text);
    
    if (matched.length === 0) {
      return {
        label: 'allowed',
        severity: 'none',
        triggers: []
      };
    }

    // Determine highest severity
    const severityLevels: Record<Severity, number> = {
      low: 1,
      medium: 2,
      high: 3,
      critical: 4
    };

    let maxSeverity: Severity = 'low';
    let maxScore = 0;

    for (const rule of matched) {
      const s = rule.severity || 'low';
      const score = severityLevels[s];
      if (score > maxScore) {
        maxScore = score;
        maxSeverity = s;
      }
    }

    return {
      label: 'restricted',
      severity: maxSeverity,
      triggers: matched.map(r => r.name)
    };
  }

  /**
   * Throws an error if the text is not safe.
   */
  public ensureSafe(text: string): void {
    const { safe, matched } = this.check(text);
    if (!safe) {
      const names = matched.map(r => r.name).join(', ');
      throw new Error(`Text contains unsafe content: ${names}`);
    }
  }

  public addRule(name: string, pattern: RegExp, severity: Severity = 'medium'): void {
    // Remove existing rule with same name if any
    this.removeRule(name);
    this.rules.push({ name, pattern, severity });
  }

  public removeRule(name: string): void {
    this.rules = this.rules.filter(r => r.name !== name);
  }

  public listRules(): Rule[] {
    return [...this.rules];
  }
}

// Export a default instance for quick use
export const filter = new FilterSense();
