export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface Rule {
  name: string;
  pattern: RegExp;
  severity?: Severity;
}

export interface FilterResult {
  safe: boolean;
  matched: Rule[];
  sanitized: string;
  rules: Rule[];
}

export interface ClassifyResult {
  label: 'allowed' | 'restricted';
  severity: Severity | 'none';
  triggers: string[];
}
