import { FilterSense, filter } from '../src/index';
import { cleanText } from '../src/cleaner';

describe('Cleaner', () => {
  test('should normalize text', () => {
    const input = '  Hello   World!  ';
    const expected = 'Hello World!';
    expect(cleanText(input)).toBe(expected);
  });

  test('should remove invisible characters', () => {
    // using some zero width space or control chars
    const input = 'Hello\u200BWorld'; // Zero width space might be kept by NFKC?
    // Actually our cleaner specifically targets control chars.
    // \u0000 is null
    const inputWithControl = 'Hello\u0000World';
    expect(cleanText(inputWithControl)).toBe('HelloWorld');
  });
});

describe('FilterSense', () => {
  const myFilter = new FilterSense();

  test('should detect profanity', () => {
    const result = myFilter.check('You are a bad shit');
    expect(result.safe).toBe(false);
    expect(result.matched.some(r => r.name === 'profanity_strong')).toBe(true);
  });

  test('should detect emails', () => {
    const result = myFilter.check('Contact me at test@example.com');
    expect(result.safe).toBe(false);
    expect(result.matched.some(r => r.name === 'email')).toBe(true);
  });

  test('should detect phone numbers', () => {
    const result = myFilter.check('Call 123-456-7890');
    expect(result.safe).toBe(false);
    expect(result.matched.some(r => r.name === 'phone_number')).toBe(true);
  });

  test('should allow safe text', () => {
    const result = myFilter.check('Hello there, nice weather.');
    expect(result.safe).toBe(true);
    expect(result.matched).toHaveLength(0);
  });

  test('should allow custom rule addition', () => {
    const f = new FilterSense();
    f.addRule('foo', /foo/, 'low');
    
    const result = f.check('This contains foo');
    expect(result.safe).toBe(false);
    expect(result.matched[0].name).toBe('foo');
  });

  test('should allow removing rules', () => {
    const f = new FilterSense();
    f.removeRule('email');
    const result = f.check('test@example.com');
    // Assuming no other rule catches it. (Numeric might catch parts but usually dot not matched)
    // Actually the email regex is specific.
    expect(result.safe).toBe(true);
  });

  test('classify should return restricted for unsafe content', () => {
    const result = myFilter.classify('shit');
    expect(result.label).toBe('restricted');
    expect(result.severity).toBe('high');
  });

  test('classify should return allowed for safe content', () => {
    const result = myFilter.classify('Hello world');
    expect(result.label).toBe('allowed');
  });

  test('ensureSafe should throw error on unsafe content', () => {
    expect(() => {
      myFilter.ensureSafe('shit');
    }).toThrow('Text contains unsafe content');
  });

  test('ensureSafe should not throw on safe content', () => {
    expect(() => {
      myFilter.ensureSafe('Hello world');
    }).not.toThrow();
  });
});
