(() => {
  const roomFrame = document.querySelector('#room-frame');
  const entryGate = document.querySelector('#room-entry-gate');

  const enterRoom = () => {
    if (!roomFrame || !entryGate || entryGate.hidden) return;

    roomFrame.contentWindow?.postMessage('ded-cartoons-enter', window.location.origin);
    entryGate.hidden = true;
    roomFrame.focus();
  };

  window.addEventListener('keydown', (event) => {
    if (event.code === 'Enter') {
      event.preventDefault();
      enterRoom();
    }
  });

  entryGate?.addEventListener('click', enterRoom);
})();
