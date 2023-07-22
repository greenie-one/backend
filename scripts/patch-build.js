/* eslint-disable @typescript-eslint/no-var-requires */
const { readFileSync, writeFileSync, renameSync, readdirSync, mkdirSync, rmSync } = require('fs');
const path = require('path');

const data = readFileSync('./dist/instrumentation.js', { encoding: 'utf-8' });
const res = data.replaceAll(/dirname\([0-9]+\),"core\.json"/g, 'dirname(__filename), "core.json"');

writeFileSync('./dist/instrumentation.js', res);

const saslPrepDir = readdirSync('./dist/saslprep/.yarn/unplugged')
const sparseBitfieldDir = readdirSync('./dist/sparse-bitfield/.yarn/unplugged')
const memoryPagerDir = readdirSync('./dist/memory-pager/.yarn/unplugged')


rmSync(path.resolve(__dirname, './dist/node_modules/'), { recursive: true, force: true })
mkdirSync(path.resolve(__dirname, './dist/node_modules/'))

renameSync(path.resolve(__dirname, `./dist/saslprep/.yarn/unplugged/${saslPrepDir[0]}/node_modules/saslprep`), path.resolve(__dirname, './dist/node_modules/saslprep'))
renameSync(path.resolve(__dirname, `./dist/sparse-bitfield/.yarn/unplugged/${sparseBitfieldDir[0]}/node_modules/sparse-bitfield`), path.resolve(__dirname, './dist/node_modules/sparse-bitfield'))
renameSync(path.resolve(__dirname, `./dist/memory-pager/.yarn/unplugged/${memoryPagerDir[0]}/node_modules/memory-pager`), path.resolve(__dirname, './dist/node_modules/memory-pager'))



