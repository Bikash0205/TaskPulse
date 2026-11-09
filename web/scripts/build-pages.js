const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const apiDir = path.join(rootDir, 'app', 'api');
const tempApiDir = path.join(rootDir, 'app', '_api');
const outDir = path.join(rootDir, 'out');

console.log('[TaskPulse Pages Build] Starting static export for GitHub Pages...');

let renamed = false;
try {
  if (fs.existsSync(apiDir)) {
    console.log('[TaskPulse Pages Build] Temporarily stashing app/api to app/_api for static export...');
    fs.renameSync(apiDir, tempApiDir);
    renamed = true;
  }

  process.env.GITHUB_PAGES = 'true';

  console.log('[TaskPulse Pages Build] Executing next build (export)...');
  execSync('npx next build', {
    cwd: rootDir,
    stdio: 'inherit',
    env: { ...process.env, GITHUB_PAGES: 'true' }
  });

  // Ensure .nojekyll exists
  const noJekyllPath = path.join(outDir, '.nojekyll');
  fs.writeFileSync(noJekyllPath, '');
  console.log('[TaskPulse Pages Build] Created .nojekyll in out directory.');

  console.log('[TaskPulse Pages Build] Build and static export completed successfully!');
} catch (err) {
  console.error('[TaskPulse Pages Build] Error during export build:', err);
  process.exitCode = 1;
} finally {
  if (renamed && fs.existsSync(tempApiDir)) {
    console.log('[TaskPulse Pages Build] Restoring app/_api to app/api...');
    fs.renameSync(tempApiDir, apiDir);
  }
}
