type Severity = 'low' | 'medium' | 'high' | 'critical';
interface Rule {
    name: string;
    pattern: RegExp;
    severity?: Severity;
}
interface FilterResult {
    safe: boolean;
    matched: Rule[];
    sanitized: string;
    rules: Rule[];
}
interface ClassifyResult {
    label: 'allowed' | 'restricted';
    severity: Severity | 'none';
    triggers: string[];
}

declare class FilterSense {
    private rules;
    constructor(rules?: Rule[]);
    /**
     * Checks text against all rules.
     * Returns a result object containing matched rules and sanitized text.
     */
    check(text: string): FilterResult;
    /**
     * Classifies text as 'allowed' or 'restricted' based on matches.
     */
    classify(text: string): ClassifyResult;
    /**
     * Throws an error if the text is not safe.
     */
    ensureSafe(text: string): void;
    addRule(name: string, pattern: RegExp, severity?: Severity): void;
    removeRule(name: string): void;
    listRules(): Rule[];
}
declare const filter: FilterSense;

export { type ClassifyResult, type FilterResult, FilterSense, type Rule, type Severity, filter };
