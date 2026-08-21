import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { createCharacterPlayer } from '../src/player.js';

function eventTarget() {
  const listeners = new Map();
  return {
    addEventListener(type, listener) {
      listeners.set(type, listener);
    },
    removeEventListener(type) {
      listeners.delete(type);
    },
    emit(type, event = {}) {
      listeners.get(type)?.({ currentTarget: this, ...event });
    },
  };
}

test('plays a character clip while its hotspot is hovered and restores the static menu on exit', () => {
  const video = {
    ...eventTarget(),
    src: '',
    paused: true,
    loadCalled: 0,
    playCalled: 0,
    pauseCalled: 0,
    load() { this.loadCalled += 1; },
    play() { this.playCalled += 1; return Promise.resolve(); },
    pause() { this.pauseCalled += 1; },
    removeAttribute(name) { if (name === 'src') this.src = ''; },
  };
  const trigger = { dataset: { character: 'keladd' }, ...eventTarget() };

  const player = createCharacterPlayer({
    video,
    triggerButtons: new Set([trigger]),
  });

  trigger.emit('pointerenter');
  assert.equal(video.hidden, false);
  assert.equal(video.src, './public/assets/Keladd-Selec.mp4');
  assert.equal(video.playCalled, 1);

  trigger.emit('pointerleave');
  assert.equal(video.hidden, true);
  assert.equal(video.pauseCalled, 1);
  assert.equal(video.src, '');

  player.destroy();
});

test('plays a character clip when its hotspot is clicked', () => {
  const video = {
    ...eventTarget(),
    src: '',
    hidden: true,
    load() {},
    playCalled: 0,
    play() { this.playCalled += 1; return Promise.resolve(); },
  };
  const trigger = { dataset: { character: 'dander' }, ...eventTarget() };

  createCharacterPlayer({ video, triggerButtons: new Set([trigger]) });
  trigger.emit('click');

  assert.equal(video.hidden, false);
  assert.equal(video.src, './public/assets/Dander-Selec.mp4');
  assert.equal(video.playCalled, 1);
});

test('keeps the preview video out of the page until a character activates it', async () => {
  const styles = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
  assert.match(styles, /\.character-preview\[hidden\]\s*\{\s*display:\s*none;/);
});

test('loads a classic script so index.html can run from the local file system', async () => {
  const index = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(index, /<script src="\.\/app\.js"><\/script>/);
  assert.doesNotMatch(index, /type="module"/);
});
