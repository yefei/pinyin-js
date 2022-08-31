import * as fs from 'fs';

const data = fs.readFileSync('./pinyin.txt', 'utf-8');
const out = [
  '// auto genrate: ' + new Date().toISOString(),
  'export default {',
];
for (const i of data.split('\n')) {
  out.push(`  "${i[0]}": "${i.slice(1)}",`)
}
out.push('} as { [key: string]: string };')

fs.writeFileSync('./src/data.ts', out.join('\n'));
