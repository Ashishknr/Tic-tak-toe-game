const player = document.getElementById("player");
const goal = document.getElementById("goal");
const game = document.getElementById("game");
const info = document.getElementById("info");

let pos = { x: 5, y: 5 }; // percentages
let speed = 2;

const gameState = {
  glitchLevel: 0,
  controls: "normal" // normal | swapped | inverted
};

/* KEYBOARD CONTROL */
document.addEventListener("keydown", (e) => {
  if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {
    e.preventDefault();
  }
  handleMove(e.key);
});

/* TOUCH CONTROL */
document.querySelectorAll("#controls button").forEach(btn => {
  btn.addEventListener("click", () => {
    handleMove(btn.dataset.dir);
  });
});

function handleMove(key) {
  let dx = 0, dy = 0;

  if (gameState.controls === "swapped") {
    if (key === "ArrowLeft" || key === "left") dx = speed;
    if (key === "ArrowRight" || key === "right") dx = -speed;
  }
  else if (gameState.controls === "inverted") {
    if (key === "ArrowUp" || key === "up") dy = speed;
    if (key === "ArrowDown" || key === "down") dy = -speed;
  }
  else {
    if (key === "ArrowLeft" || key === "left") dx = -speed;
    if (key === "ArrowRight" || key === "right") dx = speed;
    if (key === "ArrowUp" || key === "up") dy = -speed;
    if (key === "ArrowDown" || key === "down") dy = speed;
  }

  pos.x += dx;
  pos.y += dy;

  pos.x = Math.max(0, Math.min(95, pos.x));
  pos.y = Math.max(0, Math.min(95, pos.y));

  updatePlayer();
  checkWin();
}

function updatePlayer() {
  player.style.left = pos.x + "%";
  player.style.top = pos.y + "%";
}

function checkWin() {
  const p = player.getBoundingClientRect();
  const g = goal.getBoundingClientRect();

  if (
    p.left < g.right &&
    p.right > g.left &&
    p.top < g.bottom &&
    p.bottom > g.top
  ) {
    nextLevel();
  }
}

function nextLevel() {
  gameState.glitchLevel++;
  pos = { x: 5, y: 5 };
  updatePlayer();
  applyGlitch();
}

function applyGlitch() {
  document.body.className = "";
  gameState.controls = "normal";

  info.innerText = `Glitch Level ${gameState.glitchLevel}`;

  if (gameState.glitchLevel === 1) {
    document.body.classList.add("glitch-invert");
  }

  if (gameState.glitchLevel === 2) {
    gameState.controls = "swapped";
    info.innerText = "Something feels wrong...";
  }

  if (gameState.glitchLevel >= 3) {
    gameState.controls = "inverted";
    document.body.classList.add("glitch-shake");
    speed = 3;
    info.innerText = "Trust nothing.";
  }
}

// Start background music