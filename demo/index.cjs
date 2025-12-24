const { filter, FilterSense } = require('../dist/index.js');

function printResult(title, result) {
  console.log(`\n=== ${title} ===`);
  console.log('safe:', result.safe);
  console.log('sanitized:', result.sanitized);
  console.log('matched:', result.matched.map(r => ({ name: r.name, severity: r.severity })));
}

function main() {
  const input = process.argv.slice(2).join(' ') || [
    'Hello world!',
    'Contact me at test@example.com',
    'Call me at 123-456-7890',
    'My card is 4111 1111 1111 1111',
    'You are a bad shit',
    'Order id: 123456789012345'
  ].join(' | ');

  console.log('Input:', input);

  const parts = input.split('|').map(s => s.trim()).filter(Boolean);

  for (const [i, text] of parts.entries()) {
    const result = filter.check(text);
    printResult(`Default filter.check() [${i + 1}]`, result);

    const classification = filter.classify(text);
    console.log('classify:', classification);

    try {
      filter.ensureSafe(text);
      console.log('ensureSafe: OK');
    } catch (err) {
      console.log('ensureSafe: BLOCKED');
      console.log(String(err && err.message ? err.message : err));
    }
  }

  const custom = new FilterSense();
  custom.addRule('no_groot', /\bgroot\b/i, 'low');
  const customResult = custom.check('I am Groot');
  printResult('Custom rule example', customResult);
}

main();
