import { loadSounds } from "./optional-sounds.js";
export async function createGame({
  canvas,
  engine,
  settings,
  finish,
  durationSeconds,
  locale,
  assetUrl,
}) {
  const sounds = await loadSounds(assetUrl);
  const THREE = engine.three;
  const palette = {
    Aurora: { sky: "#142d3a", track: "#294752", accent: "#73efc2" },
    Sunset: { sky: "#342440", track: "#4c3856", accent: "#ffc487" },
    Midnight: { sky: "#101a32", track: "#253254", accent: "#a9a1ff" },
  }[settings.theme] || { sky: "#142d3a", track: "#294752", accent: "#73efc2" };
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(palette.sky);
  scene.fog = new THREE.Fog(palette.sky, 35, 115);
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 150);
  camera.position.set(0, 5.6, 12);
  camera.lookAt(0, 1, -15);
  const renderer = engine.createRenderer();
  scene.add(new THREE.HemisphereLight("#d6efff", "#1b233a", 2.4));
  const sunlight = new THREE.DirectionalLight("#fff2d8", 3.2);
  sunlight.position.set(-5, 12, 9);
  sunlight.castShadow = true;
  sunlight.shadow.camera.left = -12;
  sunlight.shadow.camera.right = 12;
  sunlight.shadow.camera.top = 20;
  sunlight.shadow.camera.bottom = -20;
  scene.add(sunlight);

  const geometries = new Set(),
    materials = new Set();
  function geometry(value) {
    geometries.add(value);
    return value;
  }
  function material(color, extra = {}) {
    const value = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.65,
      ...extra,
    });
    materials.add(value);
    return value;
  }
  const box = geometry(new THREE.BoxGeometry(1, 1, 1));
  const crystal = geometry(new THREE.OctahedronGeometry(0.4));
  const floorMaterial = material(palette.track);
  const railMaterial = material(palette.accent, {
    emissive: palette.accent,
    emissiveIntensity: 0.4,
  });
  const barrierMaterial = material("#f8a77d");
  const crystalMaterial = material("#ffda79", {
    emissive: "#dd9f22",
    emissiveIntensity: 0.5,
    metalness: 0.4,
  });
  const bodyMaterial = material(palette.accent);
  const whiteMaterial = material("#f1f7ff");
  function block(parent, mat, x, y, z, sx, sy, sz) {
    const mesh = new THREE.Mesh(box, mat);
    mesh.position.set(x, y, z);
    mesh.scale.set(sx, sy, sz);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  const runner = new THREE.Group();
  runner.position.z = 4;
  scene.add(runner);
  block(runner, bodyMaterial, 0, 1, 0, 0.55, 0.7, 0.4);
  block(runner, whiteMaterial, 0, 1.6, 0, 0.44, 0.44, 0.44);
  const legs = [
    block(runner, whiteMaterial, -0.17, 0.35, 0, 0.18, 0.6, 0.2),
    block(runner, whiteMaterial, 0.17, 0.35, 0, 0.18, 0.6, 0.2),
  ];
  const arms = [
    block(runner, bodyMaterial, -0.4, 1, 0, 0.18, 0.65, 0.18),
    block(runner, bodyMaterial, 0.4, 1, 0, 0.18, 0.65, 0.18),
  ];
  const hudCanvas = document.createElement("canvas");
  hudCanvas.width = 512;
  hudCanvas.height = 80;
  const hudContext = hudCanvas.getContext("2d");
  const hudTexture = new THREE.CanvasTexture(hudCanvas);
  const hudMaterial = new THREE.SpriteMaterial({
    map: hudTexture,
    depthTest: false,
    depthWrite: false,
    transparent: true,
  });
  const hud = new THREE.Sprite(hudMaterial);
  hud.renderOrder = 10;
  hud.position.set(0, 0.65, -1.8);
  camera.add(hud);
  scene.add(camera);
  let lastHud = -1;
  function score() {
    return Math.min(
      1_000_000_000,
      Math.floor(distance) + collected * settings.coinPoints,
    );
  }
  function updateHud() {
    const current = score();
    if (current === lastHud) return;
    lastHud = current;
    hudContext.clearRect(0, 0, 512, 80);
    hudContext.fillStyle = "rgba(8,20,29,.78)";
    hudContext.fillRect(0, 0, 512, 80);
    hudContext.font = "bold 35px system-ui";
    hudContext.fillStyle = "#f2fff9";
    hudContext.textAlign = "center";
    hudContext.fillText(
      (locale === "fr" ? "POINTS " : "SCORE ") + current,
      256,
      52,
    );
    hudTexture.needsUpdate = true;
  }

  const pieces = [];
  let generated = 0;
  const lanes = [-2, 0, 2];
  function createPiece(z) {
    const group = new THREE.Group();
    group.position.z = z;
    const easy = generated++ < 4;
    const gapLane =
      !easy && engine.random() < 0.18 ? Math.floor(engine.random() * 3) : -1;
    for (let lane = 0; lane < 3; lane++)
      if (lane !== gapLane)
        block(group, floorMaterial, lanes[lane], -0.25, 0, 1.94, 0.4, 11.9);
    for (const x of [-3.15, 3.15]) {
      block(group, railMaterial, x, 0.12, 0, 0.07, 0.08, 12);
      block(group, floorMaterial, x, 0.1, -5.5, 0.18, 0.7, 0.18);
    }
    let obstacle = null;
    if (!easy && settings.obstacles && engine.random() < 0.7) {
      const available = [0, 1, 2].filter((lane) => lane !== gapLane);
      const lane = available[Math.floor(engine.random() * available.length)];
      obstacle = block(
        group,
        barrierMaterial,
        lanes[lane],
        0.7,
        0,
        1.25,
        1.4,
        1.15,
      );
    }
    const coinLane = easy ? 1 : Math.floor(engine.random() * 3);
    const coin = new THREE.Mesh(crystal, crystalMaterial);
    coin.position.set(lanes[coinLane], 1.25, -3);
    group.add(coin);
    scene.add(group);
    pieces.push({ group, gapLane, obstacle, coin, collected: false });
  }
  for (let index = 0; index < 12; index++) createPiece(8 - index * 12);
  let lane = 1,
    verticalSpeed = 0,
    grounded = true,
    distance = 0,
    collected = 0,
    elapsed = 0,
    accumulator = 0;
  let running = false,
    done = false,
    deadline = 0,
    pointer = null;
  function end() {
    if (done) return;
    done = true;
    running = false;
    loop.stop();
    sounds.play("game-over");
    finish(score());
  }
  function step(delta) {
    distance += settings.speed * delta;
    elapsed += delta;
    runner.position.x +=
      (lanes[lane] - runner.position.x) * Math.min(1, delta * 16);
    for (const piece of pieces) {
      piece.group.position.z += settings.speed * delta;
      piece.coin.rotation.y += delta * 2;
      if (
        !piece.collected &&
        Math.abs(piece.group.position.z - 3 - 4) < 0.8 &&
        Math.abs(piece.coin.position.x - runner.position.x) < 0.75 &&
        runner.position.y < 2.5
      ) {
        piece.collected = true;
        piece.coin.visible = false;
        collected++;
        sounds.play("collect");
      }
      if (
        piece.obstacle &&
        Math.abs(piece.group.position.z - 4) < 0.85 &&
        Math.abs(piece.obstacle.position.x - runner.position.x) < 0.75 &&
        runner.position.y < 1.4
      ) {
        sounds.play("hit");
        end();
      }
    }
    while (pieces[0].group.position.z > 22) {
      scene.remove(pieces.shift().group);
      createPiece(pieces.at(-1).group.position.z - 12);
    }
    const currentLane = Math.max(
      0,
      Math.min(2, Math.round((runner.position.x + 2) / 2)),
    );
    const ground = pieces.some(
      (piece) =>
        Math.abs(piece.group.position.z - 4) < 6 &&
        piece.gapLane !== currentLane,
    );
    verticalSpeed -= 22 * delta;
    runner.position.y += verticalSpeed * delta;
    grounded = ground && runner.position.y <= 0;
    if (grounded) {
      runner.position.y = 0;
      verticalSpeed = 0;
    }
    if (runner.position.y < -5) end();
    const stride = Math.sin(distance * 2.1) * 0.45;
    legs[0].rotation.x = stride;
    legs[1].rotation.x = -stride;
    arms[0].rotation.x = -stride;
    arms[1].rotation.x = stride;
    runner.rotation.z = (lanes[lane] - runner.position.x) * -0.12;
    if (
      elapsed >= Math.max(1, durationSeconds - 1) ||
      Date.now() >= deadline - 700
    )
      end();
  }
  const loop = engine.loop((delta) => {
    if (!running) return;
    accumulator += delta;
    while (accumulator >= 1 / 120 && running) {
      step(1 / 120);
      accumulator -= 1 / 120;
    }
    updateHud();
    renderer.render(scene, camera);
  });
  function jump() {
    if (running && grounded) {
      verticalSpeed = 8;
      grounded = false;
      sounds.play("jump");
    }
  }
  function keyboard(event) {
    sounds.resume();
    if (
      !running ||
      event.repeat ||
      !["ArrowLeft", "ArrowRight", "ArrowUp", " "].includes(event.key)
    )
      return;
    event.preventDefault();
    if (event.key === "ArrowLeft") lane = Math.max(0, lane - 1);
    else if (event.key === "ArrowRight") lane = Math.min(2, lane + 1);
    else jump();
  }
  function down(event) {
    sounds.resume();
    if (!running) return;
    pointer = { x: event.clientX, y: event.clientY, id: event.pointerId };
    canvas.setPointerCapture(event.pointerId);
  }
  function up(event) {
    if (!pointer || pointer.id !== event.pointerId) return;
    const dx = event.clientX - pointer.x,
      dy = event.clientY - pointer.y;
    pointer = null;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 14)
      lane = Math.max(0, Math.min(2, lane + Math.sign(dx)));
    else if (dy < -14 || Math.max(Math.abs(dx), Math.abs(dy)) < 14) jump();
  }
  function cancel() {
    pointer = null;
  }
  function pause() {
    sounds.pause();
    running = false;
    pointer = null;
    loop.pause();
  }
  function resume() {
    if (!done) {
      running = true;
      sounds.resume();
      loop.resume();
    }
  }
  addEventListener("keydown", keyboard);
  canvas.addEventListener("pointerdown", down);
  canvas.addEventListener("pointerup", up);
  canvas.addEventListener("pointercancel", cancel);
  return {
    start(input) {
      deadline = input.deadlineAt;
      resume();
    },
    pause,
    resume,
    stop: pause,
    resize(size) {
      engine.resizeRenderer(renderer, size);
      camera.aspect = size.width / size.height;
      camera.updateProjectionMatrix();
      hud.scale.set(Math.min(1.6, 0.7 * camera.aspect), 0.22, 1);
      updateHud();
      renderer.render(scene, camera);
    },
    dispose() {
      pause();
      sounds.dispose();
      removeEventListener("keydown", keyboard);
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", cancel);
      for (const value of geometries) value.dispose();
      for (const value of materials) value.dispose();
      hudTexture.dispose();
      hudMaterial.dispose();
    },
  };
}
