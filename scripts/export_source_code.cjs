const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const outputFile = path.join(rootDir, 'full_source_code.txt');
const mobileOutputFile = path.join(rootDir, 'mobile_interface_source_code.txt');

const ignoreDirs = new Set(['node_modules', 'dist', '.git', '.cache', 'build']);
const textExtensions = new Set(['.tsx', '.ts', '.jsx', '.js', '.css', '.html', '.json', '.md']);

let allFiles = [];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.') && entry.name !== '.env.example') continue;
    if (ignoreDirs.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (textExtensions.has(ext) && !entry.name.endsWith('.map') && !entry.name.includes('full_source_code') && !entry.name.includes('mobile_interface')) {
        allFiles.push(fullPath);
      }
    }
  }
}

walk(rootDir);
allFiles.sort();

console.log(`Found ${allFiles.length} source code files.`);

let output = `================================================================================\n`;
output += `PROJECT: WEB CALCULATOR & MOBILE INTERFACE FULL SOURCE CODE\n`;
output += `GENERATED AT: ${new Date().toISOString()}\n`;
output += `TOTAL SOURCE FILES: ${allFiles.length}\n`;
output += `================================================================================\n\n`;

// Table of contents
output += `TABLE OF CONTENTS:\n`;
allFiles.forEach((file, index) => {
  const relPath = path.relative(rootDir, file);
  output += `${index + 1}. /${relPath}\n`;
});
output += `\n================================================================================\n\n`;

for (const file of allFiles) {
  const relPath = path.relative(rootDir, file);
  output += `================================================================================\n`;
  output += `FILE: /${relPath}\n`;
  output += `================================================================================\n`;
  try {
    const content = fs.readFileSync(file, 'utf8');
    output += content;
    output += `\n\n`;
  } catch (err) {
    output += `[Error reading file: ${err.message}]\n\n`;
  }
}

// Write to root
fs.writeFileSync(outputFile, output, 'utf8');
fs.writeFileSync(mobileOutputFile, output, 'utf8');

// Write to public for direct web download
const publicDir = path.join(rootDir, 'public');
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, 'full_source_code.txt'), output, 'utf8');
fs.writeFileSync(path.join(publicDir, 'mobile_interface_source_code.txt'), output, 'utf8');

// Write to dist if dist exists
const distDir = path.join(rootDir, 'dist');
if (fs.existsSync(distDir)) {
  fs.writeFileSync(path.join(distDir, 'full_source_code.txt'), output, 'utf8');
  fs.writeFileSync(path.join(distDir, 'mobile_interface_source_code.txt'), output, 'utf8');
}

const stats = fs.statSync(outputFile);
console.log(`Export completed! File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB (${stats.size} bytes).`);
