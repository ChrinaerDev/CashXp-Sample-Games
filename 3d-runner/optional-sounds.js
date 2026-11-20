// Only supplied recordings are used. Missing files keep the game silent.
export async function loadSounds(assetUrl) {
  const urls = {};
  for (const name of ["jump", "collect", "hit", "game-over", "music"]) {
    try {
      urls[name] = assetUrl(`assets/sounds/${name}.mp3`);
    } catch {}
  }
  const AudioContext = globalThis.AudioContext || globalThis.webkitAudioContext;
  if (!Object.keys(urls).length || !AudioContext)
    return { play() {}, resume() {}, pause() {}, dispose() {} };
  const context = new AudioContext(),
    buffers = new Map(),
    active = new Set();
  let music = null,
    ended = false;
  await Promise.all(
    Object.entries(urls).map(async ([name, url]) => {
      try {
        const response = await fetch(url);
        buffers.set(
          name,
          await context.decodeAudioData(await response.arrayBuffer()),
        );
      } catch {}
    }),
  );
  function play(name) {
    const buffer = buffers.get(name);
    if (!buffer || context.state === "closed") return;
    if (name === "game-over") ended = true;
    const source = context.createBufferSource(),
      gain = context.createGain();
    source.buffer = buffer;
    source.loop = name === "music";
    gain.gain.value = name === "music" ? 0.22 : 0.65;
    source.connect(gain).connect(context.destination);
    source.start();
    active.add(source);
    source.onended = () => {
      active.delete(source);
      source.disconnect();
      gain.disconnect();
    };
    if (name === "music") music = source;
  }
  function resume() {
    if (ended || context.state === "closed") return;
    context.resume().catch(() => {});
    if (!music) play("music");
  }
  return {
    play,
    resume,
    pause() {
      if (!ended && context.state !== "closed")
        context.suspend().catch(() => {});
    },
    dispose() {
      if (music) {
        try {
          music.stop();
        } catch {}
      }
      const close = () => {
        for (const source of active) {
          try {
            source.stop();
          } catch {}
        }
        context.close().catch(() => {});
      };
      if (ended) setTimeout(close, 1500);
      else close();
    },
  };
}
