import fs from 'fs/promises';
import path from 'path';
import { build } from 'esbuild';

async function getExternalDependencies() {
  // Resolve the path to package.json using import.meta.url
  const packageJsonPath = path.resolve(
    new URL(import.meta.url).pathname,
    '../package.json'
  );

  // Read the content of package.json and parse it
  const data = await fs.readFile(packageJsonPath, 'utf-8');
  const packageJson = JSON.parse(data);

  // Return the list of dependencies
  return Object.keys(packageJson.dependencies || {});
}

async function bundle() {
  const dependencies = await getExternalDependencies();

  await build({
    entryPoints: ['./src/app.ts'], // Main TypeScript entry point
    bundle: true, // Bundle the app into a single file
    outfile: './dist/app.js', // Output file
    platform: 'node', // Target Node.js
    target: 'es2020', // Match your Node.js version capabilities
    format: 'esm', // Use ES module output
    sourcemap: true, // Optional: Generate sourcemaps for debugging
    resolveExtensions: ['.ts', '.js'], // Handle .ts and .js extensions
    external: dependencies, // Ignore external dependencies dynamically
  }).catch(() => process.exit(1));
}

bundle();
