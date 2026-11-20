export function createGame({ canvas, seed, settings, finish, locale }) {
  const ctx = canvas.getContext("2d");
  const size = 18;
  const snake = [
    { x: 8, y: 9 },
    { x: 7, y: 9 },
    { x: 6, y: 9 },
  ];
  const directions = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
  };
  let direction = directions.ArrowRight;
  let nextDirection = direction;
  let food = { x: 12, y: 9 };
  let randomState = seed >>> 0;
  let score = 0;
  let timer;
  let running = false;
  let deadline = 0;
  let touch;
  let width = 320;
  let height = 320;
  const same = (a, b) => a.x === b.x && a.y === b.y;

  function random(max) {
    randomState = (Math.imul(randomState, 1664525) + 1013904223) >>> 0;
    return Math.floor((randomState / 4294967296) * max);
  }

  function draw() {
    const cell = Math.max(
      1,
      Math.floor(Math.min((height - 32) / size, (width - 12) / size)),
    );
    const left = Math.floor((width - size * cell) / 2);
    const top = Math.floor((height - size * cell + 18) / 2);
    ctx.fillStyle = "#101b1b";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#182d29";
    ctx.fillRect(left, top, size * cell, size * cell);
    const fill = (part, color) => {
      ctx.fillStyle = color;
      ctx.fillRect(
        left + part.x * cell + 1,
        top + part.y * cell + 1,
        cell - 1,
        cell - 1,
      );
    };
    if (food) fill(food, "#ffc579");
    const color =
      { Aurora: "#58db96", Midnight: "#9b9aff", Ember: "#ff9367" }[
        settings.theme
      ] || "#58db96";
    snake.forEach((part, index) => fill(part, index ? color : "#ecfff4"));
    ctx.fillStyle = "#e7fff2";
    ctx.font = "600 14px system-ui";
    ctx.fillText((locale === "fr" ? "POINTS " : "SCORE ") + score, 12, 20);
  }

  function halt() {
    running = false;
    clearInterval(timer);
    touch = null;
  }

  function step() {
    if (deadline && Date.now() >= deadline - 700) {
      halt();
      finish(score);
      return;
    }
    const head = {
      x: snake[0].x + nextDirection.x,
      y: snake[0].y + nextDirection.y,
    };
    direction = nextDirection;
    const outside =
      head.x < 0 || head.y < 0 || head.x >= size || head.y >= size;
    if (outside && settings.wrapEdges) {
      head.x = (head.x + size) % size;
      head.y = (head.y + size) % size;
    }
    const eating = same(head, food);
    const body = eating ? snake : snake.slice(0, -1);
    if (
      (outside && !settings.wrapEdges) ||
      body.some((part) => same(part, head))
    ) {
      halt();
      finish(score);
      return;
    }
    snake.unshift(head);
    if (eating) {
      score += settings.points ?? 10;
      const free = [];
      for (let y = 0; y < size; y++)
        for (let x = 0; x < size; x++) {
          const cell = { x, y };
          if (!snake.some((part) => same(part, cell))) free.push(cell);
        }
      food = free[random(free.length)];
      if (!food) {
        halt();
        finish(score);
      }
    } else snake.pop();
    draw();
  }

  function turn(next) {
    if (
      !running ||
      !next ||
      (next.x === -direction.x && next.y === -direction.y)
    )
      return;
    nextDirection = next;
  }

  function keyboard(event) {
    if (!running || !directions[event.key]) return;
    event.preventDefault();
    turn(directions[event.key]);
  }

  function pointerDown(event) {
    if (!running || touch) return;
    touch = { x: event.clientX, y: event.clientY, id: event.pointerId };
    canvas.setPointerCapture(event.pointerId);
  }

  function pointerUp(event) {
    if (!touch || touch.id !== event.pointerId) return;
    const dx = event.clientX - touch.x;
    const dy = event.clientY - touch.y;
    touch = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 10) return;
    turn(
      Math.abs(dx) > Math.abs(dy)
        ? { x: Math.sign(dx), y: 0 }
        : { x: 0, y: Math.sign(dy) },
    );
  }

  function pointerCancel() {
    touch = null;
  }

  function start(input) {
    if (input?.deadlineAt) deadline = input.deadlineAt;
    if (running) return;
    running = true;
    timer = setInterval(step, 500 - 35 * (settings.difficulty ?? 4));
  }

  addEventListener("keydown", keyboard);
  canvas.addEventListener("pointerdown", pointerDown);
  canvas.addEventListener("pointerup", pointerUp);
  canvas.addEventListener("pointercancel", pointerCancel);
  return {
    start,
    pause: halt,
    resume: start,
    stop: halt,
    resize(dimensions) {
      ({ width, height } = dimensions);
      const ratio = dimensions.pixelRatio || 1;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw();
    },
    dispose() {
      halt();
      removeEventListener("keydown", keyboard);
      canvas.removeEventListener("pointerdown", pointerDown);
      canvas.removeEventListener("pointerup", pointerUp);
      canvas.removeEventListener("pointercancel", pointerCancel);
    },
  };
}
