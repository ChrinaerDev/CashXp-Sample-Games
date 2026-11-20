# Sky Runner reference

From the parent examples directory, run `npm ci` then `npm run build:runner`. Upload `3d-runner/dist/sky-runner-reference.zip` in Game Publishing. No Three.js code is bundled into the game: it uses `context.engine.three` and the shared renderer, loop, resize helper and seeded generator.

Use left/right arrows to switch lanes and space/up to jump. On touch screens, swipe sideways to change lanes and swipe up or tap to jump. Avoid barriers and missing platform lanes; collect crystals. Distance and crystals contribute to the score. Speed, obstacles, theme and crystal points are configurable in See through. The game finishes on collision, falling, or just before the authoritative deadline. Pause freezes play but does not extend that deadline.

Test on a WebGL2-capable browser and physical mobile device. Gameplay is procedural and uses simple built-in geometry. All listeners, textures, materials and geometries are released on disposal; renderer and scheduler ownership stays with the engine. This example does not include an authoritative cash-score verifier.
