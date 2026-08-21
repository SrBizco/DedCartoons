const characters = {
  keladd: './public/assets/Keladd-Selec.mp4',
  dander: './public/assets/Dander-Selec.mp4',
};

export function createCharacterPlayer({ video, triggerButtons }) {
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
    video.src = '';
    video.removeAttribute?.('src');
    video.load();
    video.hidden = true;
    activeCharacter = null;
  };

  const handlers = Array.from(triggerButtons, (button) => ({
    button,
    enter: () => play(button.dataset.character),
    click: () => play(button.dataset.character),
    leave: stop,
  }));

  handlers.forEach(({ button, enter, click, leave }) => {
    button.addEventListener('pointerenter', enter);
    button.addEventListener('pointerleave', leave);
    button.addEventListener('focus', enter);
    button.addEventListener('blur', leave);
    button.addEventListener('click', click);
  });

  return {
    play,
    stop,
    destroy() {
      handlers.forEach(({ button, enter, click, leave }) => {
        button.removeEventListener('pointerenter', enter);
        button.removeEventListener('pointerleave', leave);
        button.removeEventListener('focus', enter);
        button.removeEventListener('blur', leave);
        button.removeEventListener('click', click);
      });
    },
  };
}
