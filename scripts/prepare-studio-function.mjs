// Make .output-studio/server deployable as a Cloud Function.
// Nitro traces only the ESM build of firebase-functions, but the Firebase CLI loads the
// package's CommonJS entry to discover functions before deploying, so install the real
// dependencies locally. musl-only optional packages are dropped because Cloud Build
// (glibc) refuses to install them as direct dependencies.
import { execSync } from 'node:child_process'
import { readFileSync, rmSync, writeFileSync } from 'node:fs'

const dir = '.output-studio/server'
const pkgPath = `${dir}/package.json`
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
for (const name of Object.keys(pkg.dependencies ?? {})) {
  if (name.includes('musl')) delete pkg.dependencies[name]
}
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')

rmSync(`${dir}/node_modules`, { recursive: true, force: true })
rmSync(`${dir}/package-lock.json`, { force: true })
execSync('npm install --omit=dev --no-audit --no-fund --ignore-scripts', { cwd: dir, stdio: 'inherit' })
