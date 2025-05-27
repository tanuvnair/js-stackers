const ROWS = 15;
const COLS = 7;
let GRID = Array(ROWS)
  .fill()
  .map(() => Array(COLS).fill(0));
let CELL_SIZE = 70;

let player = {
  row: ROWS - 1,
  col: 2,
  width: 3,
  movingRight: true,
  speed: 0.05,
  lastMoveTime: 0,
  moveInterval: 100
};

const canvas = document.getElementById("stacker");
const ctx = canvas.getContext("2d");

canvas.height = ROWS * CELL_SIZE;
canvas.width = COLS * CELL_SIZE;

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      ctx.fillStyle = GRID[i][j] > 0 ? "red" : "#000";
      ctx.fillRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);

      // The grid
      ctx.strokeStyle = "gray";
      ctx.strokeRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
}

let frameCount = 0;
const framesPerMove = 20;

function drawPlayer(timestamp) {
  // Only move if enough time has passed
  if (timestamp - player.lastMoveTime < player.moveInterval) return;
  player.lastMoveTime = timestamp;

  // Clear previous position
  for (let i = 0; i < COLS; i++) {
    GRID[player.row][i] = 0;
  }

  // Update position with fractional speed
  if (player.movingRight) {
    player.col += player.speed;
    if (player.col + player.width > COLS) {
      player.col = COLS - player.width;
      player.movingRight = false;
    }
  } else {
    player.col -= player.speed;
    if (player.col < 0) {
      player.col = 0;
      player.movingRight = true;
    }
  }

  // Set new position (round to nearest column)
  const roundedCol = Math.round(player.col);
  for (let i = 0; i < player.width; i++) {
    if (roundedCol + i < COLS) {
      GRID[player.row][roundedCol + i] = 1;
    }
  }
}

function lockBlock() {
  player.row -= 1;
}

function gameLoop() {
  drawGrid();
  drawPlayer();
  requestAnimationFrame(gameLoop);
}
gameLoop();

// --------------- Event Listeners---------------
document.addEventListener('keydown', (e) => {
  switch(e.code) {
    case 'Space':
      lockBlock();
      break;
  }
});
