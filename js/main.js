const ROWS = 15;
const COLS = 7;
let CELL_SIZE = calculateCellSize();
let GRID = Array(ROWS)
  .fill()
  .map(() => Array(COLS).fill(0));
let PLAYER = { x: 0, y: (ROWS - 1) * CELL_SIZE, speed: 1 };
let PLAYER_MOVED = false;

function calculateCellSize() {
  const maxWidth = Math.floor((window.innerWidth * 0.9) / COLS);
  const maxHeight = Math.floor((window.innerHeight * 0.8) / ROWS);
  return Math.min(maxWidth, maxHeight);
}

const canvas = document.getElementById("r3verse");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  CELL_SIZE = calculateCellSize();
  canvas.width = COLS * CELL_SIZE;
  canvas.height = ROWS * CELL_SIZE;

  drawGrid();
}

// Draw the initial grid with the player
function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      ctx.fillStyle = GRID[i][j] ? "#fff" : "#000";
      ctx.fillRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);

      // The grid
      ctx.strokeStyle = "gray";
      ctx.strokeRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
}

function drawPlayer() {
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      if (
        i >= PLAYER.y / CELL_SIZE &&
        i < (PLAYER.y + CELL_SIZE) / CELL_SIZE &&
        j >= PLAYER.x / CELL_SIZE &&
        j < (PLAYER.x + CELL_SIZE * 3) / CELL_SIZE
      ) {
        GRID[i][j] = 1;
      } else {
        GRID[i][j] = 0;
      }
    }
  }
}

function movePlayer() {
  if (!PLAYER_MOVED) {
    PLAYER.x += PLAYER.speed;
    if (PLAYER.x >= canvas.width - CELL_SIZE * 3) {
      PLAYER_MOVED = true;
    }
  } else {
    PLAYER.x -= PLAYER.speed;
    if (PLAYER.x <= -CELL_SIZE + 1) {
      PLAYER_MOVED = false;
    }
  }
}

// Here goes the game loop
function gameLoop() {
  drawGrid();
  drawPlayer();
  movePlayer();
  requestAnimationFrame(gameLoop);
}

// --------------- Event Listeners---------------
// On page load
window.addEventListener("load", () => {
  resizeCanvas();
  gameLoop();
});

// On page resize
window.addEventListener("resize", () => {
  resizeCanvas();
});
