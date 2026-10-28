import { copyFile, cp, mkdir, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const siteRoot = dirname(scriptDirectory);
const outputDirectory = join(siteRoot, 'dist');

await rm(outputDirectory, { force: true, recursive: true });
await mkdir(outputDirectory, { recursive: true });

for (const fileName of ['index.html', 'styles.css', 'app.js']) {
  await copyFile(join(siteRoot, fileName), join(outputDirectory, fileName));
}

await cp(join(siteRoot, 'public'), join(outputDirectory, 'public'), { recursive: true });
await copyFile(join(siteRoot, 'cloudflare', '_headers'), join(outputDirectory, '_headers'));
