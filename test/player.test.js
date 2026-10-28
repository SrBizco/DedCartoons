import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const siteRoot = new URL('../', import.meta.url);

test('the landing page contains only the room entry and its ENTER artwork', async () => {
  const index = await readFile(new URL('index.html', siteRoot), 'utf8');

  assert.match(index, /id="room-entry-gate"/);
  assert.match(index, /Enter-input\.mp4/);
  assert.doesNotMatch(index, /title-menu|character-menu|<h2[^>]*>La habitación<\/h2>/);
});

test('the room embed keeps Unity centered while hiding its standalone footer', async () => {
  const styles = await readFile(new URL('styles.css', siteRoot), 'utf8');
  const buildScript = await readFile(new URL('../DedCartoonsRoom/Assets/Editor/BuildWebGL.cs', siteRoot), 'utf8');
  const generatedRoom = await readFile(new URL('public/room/index.html', siteRoot), 'utf8');

  assert.match(styles, /\.room-frame[\s\S]*?border:\s*0;/);
  assert.match(buildScript, /#unity-footer \{\{ display: none; \}\}/);
  assert.match(buildScript, /background:\s*#000/);
  assert.match(buildScript, /#unity-canvas \{\{ background: #000; \}\}/);
  assert.match(generatedRoom, /#unity-canvas \{ background: #000; \}/);
  assert.match(buildScript, /transform: translate\(-50%, -50%\) scale\(1\.35\)/);
  assert.match(buildScript, /config\.matchWebGLToCanvasSize = false/);
  assert.match(buildScript, /canvas\.style\.width = ""960px""/);
  assert.match(buildScript, /canvas\.style\.height = ""540px""/);
  assert.doesNotMatch(buildScript, /#unity-container, #unity-container\.unity-desktop/);
});

test('WebGL keeps the same 16:9 render resolution used by the standalone build', async () => {
  const projectSettings = await readFile(new URL('../DedCartoonsRoom/ProjectSettings/ProjectSettings.asset', siteRoot), 'utf8');

  assert.match(projectSettings, /defaultScreenWidthWeb: 1920/);
  assert.match(projectSettings, /defaultScreenHeightWeb: 1080/);
});

test('the WebGL wrapper uses a lower, letterboxed render target on mobile only', async () => {
  const buildScript = await readFile(new URL('../DedCartoonsRoom/Assets/Editor/BuildWebGL.cs', siteRoot), 'utf8');
  const generatedRoom = await readFile(new URL('public/room/index.html', siteRoot), 'utf8');

  assert.match(buildScript, /const string deviceModeMarker = "const dedIsMobile"/);
  assert.match(buildScript, /config\.devicePixelRatio = 1/);
  assert.match(buildScript, /\.unity-mobile #unity-canvas/);
  assert.match(generatedRoom, /const dedIsMobile = \/iPhone\|iPad\|iPod\|Android\/i\.test\(navigator\.userAgent\)/);
  assert.match(generatedRoom, /if \(!dedIsMobile\)\s*\{\s*config\.matchWebGLToCanvasSize = false;/);
  assert.match(generatedRoom, /if \(dedIsMobile\)\s*\{[\s\S]*?config\.devicePixelRatio = 1;/);
  assert.match(generatedRoom, /\.unity-mobile #unity-canvas \{ width: 100%; height: auto; aspect-ratio: 16 \/ 9;/);
});

test('GitHub Pages deployment includes Unity decompression fallback and publishes the complete site', async () => {
  const projectSettings = await readFile(new URL('../DedCartoonsRoom/ProjectSettings/ProjectSettings.asset', siteRoot), 'utf8');
  const workflow = await readFile(new URL('.github/workflows/deploy-pages.yml', siteRoot), 'utf8');

  assert.match(projectSettings, /webGLDecompressionFallback: 1/);
  assert.match(projectSettings, /webGLCompressionFormat: 0/);
  assert.match(workflow, /mkdir _site/);
  assert.match(workflow, /cp index\.html styles\.css app\.js _site\//);
  assert.match(workflow, /cp -R public _site\/public/);
  assert.match(workflow, /path:\s*\.\/_site/);
  assert.match(workflow, /actions\/deploy-pages/);
});

test('the navigator preloads audio sources, including those under inactive screens', async () => {
  const navigator = await readFile(new URL('../DedCartoonsRoom/Assets/Scripts/ScreenNavigator.cs', siteRoot), 'utf8');

  assert.match(navigator, /FindObjectsByType<AudioSource>\(FindObjectsInactive\.Include/);
  assert.match(navigator, /clip\.LoadAudioData\(\)/);
});

test('the page keeps a classic script tag for the local development server', async () => {
  const index = await readFile(new URL('index.html', siteRoot), 'utf8');
  assert.match(index, /<script src="\.\/app\.js"><\/script>/);
  assert.doesNotMatch(index, /type="module"/);
});

test('Cloudflare Pages has a dedicated publish build', async () => {
  const packageJson = await readFile(new URL('package.json', siteRoot), 'utf8');

  assert.match(packageJson, /"build:cloudflare": "node scripts\/build-cloudflare\.mjs"/);
});
