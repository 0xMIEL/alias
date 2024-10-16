/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
const fs = require('fs');
const path = require('path');

function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const buildSrc = path.join(__dirname, '../build');
const viewsSrc = path.join(__dirname, '../src/views');
const publicSrc = path.join(__dirname, '../src/public');
const wordsSrc = path.join(__dirname, '../src/setup/databaseSeed/words.json');
const packageSrc = path.join(__dirname, '../package.json');
const packageLockSrc = path.join(__dirname, '../package-lock.json');

const viewsDest = path.join(buildSrc, 'views');
const publicDest = path.join(buildSrc, 'public');

const wordsDest = path.join(
  __dirname,
  '../build/setup/databaseSeed',
  'words.json',
);
const packageDest = path.join(__dirname, '../build', 'package.json');
const packageLockDest = path.join(__dirname, '../build', 'package-lock.json');

if (!fs.existsSync(buildSrc)) {
  fs.mkdirSync(buildSrc, { recursive: true });
}

copyDirectory(viewsSrc, viewsDest);
copyDirectory(publicSrc, publicDest);
fs.copyFileSync(wordsSrc, wordsDest);
fs.copyFileSync(packageSrc, packageDest);
fs.copyFileSync(packageLockSrc, packageLockDest);
console.log(
  'Views, public, and words.json have been successfully copied to build/src',
);
