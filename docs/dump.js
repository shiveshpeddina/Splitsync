const fs = require('fs');
const path = require('path');

const dirs = ['client/src', 'server/src', 'server/prisma'];
const exts = ['.js', '.jsx', '.css', '.prisma'];
const outputFile = 'splitwave_codebase.md';

let output = '# SplitWave Codebase Export\n\n';

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
    } else {
      if (exts.includes(path.extname(fullPath))) {
        output += `## File: ${fullPath.replace(/\\/g, '/')}\n`;
        // Determine syntax highlighting
        let lang = path.extname(fullPath).slice(1);
        if (lang === 'jsx' || lang === 'js') lang = 'javascript';
        
        output += '```' + lang + '\n';
        output += fs.readFileSync(fullPath, 'utf8') + '\n';
        output += '```\n\n';
      }
    }
  }
}

dirs.forEach(walk);
fs.writeFileSync(outputFile, output);
console.log('Success: All files dumped to ' + outputFile);
