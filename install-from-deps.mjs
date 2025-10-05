import fs from 'fs';
const deps = JSON.parse(fs.readFileSync('./deps.json', 'utf8')).dependencies;
const packages = Object.entries(deps)
  .map(([name, data]) => `${name}@${data.version}`)
  .join(' ');

console.log('Installing:', packages);
const { execSync } = await import('child_process');
execSync(`npm install ${packages}`, { stdio: 'inherit' });
