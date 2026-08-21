(() => {
  const characters = {
    keladd: './public/assets/Keladd-Selec.mp4',
    dander: './public/assets/Dander-Selec.mp4',
  };

  const video = document.querySelector('#character-preview');
  const buttons = document.querySelectorAll('[data-character]');
  let activeCharacter = null;

  const play = (characterKey) => {
    const source = characters[characterKey];
    if (!source || activeCharacter === characterKey) return;

    activeCharacter = characterKey;
    video.hidden = false;
    video.src = source;
    video.load();
    video.play().catch(() => {});
  };

  const stop = () => {
    if (!activeCharacter) return;

    video.pause();
    video.removeAttribute('src');
    video.load();
    video.hidden = true;
    activeCharacter = null;
  };

  buttons.forEach((button) => {
    const characterKey = button.dataset.character;
    button.addEventListener('pointerenter', () => play(characterKey));
    button.addEventListener('pointerleave', stop);
    button.addEventListener('focus', () => play(characterKey));
    button.addEventListener('blur', stop);
    button.addEventListener('click', () => play(characterKey));
  });
})();
