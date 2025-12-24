import { Rule } from './types';

export const defaultRules: Rule[] = [
  {
    name: 'email',
    pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
    severity: 'medium'
  },
  {
    name: 'phone_number',
    // Matches common formats like (123) 456-7890, 123-456-7890, 123.456.7890
    pattern: /(\+\d{1,3}[-.]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
    severity: 'medium'
  },
  {
    name: 'credit_card',
    // Simple check for sequences of 13-19 digits, possibly separated by spaces or dashes
    pattern: /\b(?:\d[ -]*?){13,19}\b/,
    severity: 'high'
  },
  {
    name: 'profanity_strong',
    // Placeholder for strong insults - using a very limited set for demonstration to avoid hardcoding a massive list
    // In a real app, this might be loaded from a better source or be more comprehensive
    pattern: /\b(fuck|shit|bitch|asshole|cunt|dick|pussy)\b/i,
    severity: 'high'
  },
  {
    name: 'numeric_sequence_long',
    // Catch generic long number sequences that might be identifiers
    pattern: /\b\d{10,}\b/,
    severity: 'low'
  }
];
