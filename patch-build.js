/* eslint-disable @typescript-eslint/no-var-requires */
const { readFileSync, writeFileSync } = require('fs');

const data = readFileSync('./dist/instrumentation.js', { encoding: 'utf-8' });
const res = data.replaceAll(/dirname\([0-9]+\),"core\.json"/g, 'dirname(__filename), "core.json"');

writeFileSync('./dist/instrumentation.js', res);
