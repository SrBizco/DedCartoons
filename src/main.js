import { createCharacterPlayer } from './player.js';

createCharacterPlayer({
  video: document.querySelector('#character-preview'),
  triggerButtons: document.querySelectorAll('[data-character]'),
});
