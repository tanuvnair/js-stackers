// Game Configuration
const CONFIG = {
  ROWS: 15,
  COLS: 7,
  CELL_SIZE: 70,
  INITIAL_WIDTH: 3,
  PLAYER_SPEED: 1,
  MOVE_INTERVAL: 100,
  PLAYER_COLOR: "red",
  GRID_COLOR: "#000",
  GRID_LINE_COLOR: "gray",
};

// Game State
const state = {
  grid: Array(CONFIG.ROWS)
    .fill()
    .map(() => Array(CONFIG.COLS).fill(0)),
  player: {
    row: CONFIG.ROWS - 1,
    col: Math.floor((CONFIG.COLS - CONFIG.INITIAL_WIDTH) / 2),
    width: CONFIG.INITIAL_WIDTH,
    movingRight: true,
    speed: CONFIG.PLAYER_SPEED,
    lastMoveTime: 0,
  },
  gameActive: true,
};

// Canvas Setup
const canvas = document.getElementById("stacker");
const ctx = canvas.getContext("2d");
canvas.height = CONFIG.ROWS * CONFIG.CELL_SIZE;
canvas.width = CONFIG.COLS * CONFIG.CELL_SIZE;

// Drawing Functions
function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < CONFIG.ROWS; row++) {
    for (let col = 0; col < CONFIG.COLS; col++) {
      // Draw cell
      ctx.fillStyle = state.grid[row][col]
        ? CONFIG.PLAYER_COLOR
        : CONFIG.GRID_COLOR;
      ctx.fillRect(
        col * CONFIG.CELL_SIZE,
        row * CONFIG.CELL_SIZE,
        CONFIG.CELL_SIZE,
        CONFIG.CELL_SIZE
      );

      // Draw grid lines
      ctx.strokeStyle = CONFIG.GRID_LINE_COLOR;
      ctx.strokeRect(
        col * CONFIG.CELL_SIZE,
        row * CONFIG.CELL_SIZE,
        CONFIG.CELL_SIZE,
        CONFIG.CELL_SIZE
      );
    }
  }
}

function updatePlayer(timestamp) {
  if (
    !state.gameActive ||
    timestamp - state.player.lastMoveTime < CONFIG.MOVE_INTERVAL
  )
    return;
  state.player.lastMoveTime = timestamp;

  // Clear previous position
  clearPlayerPosition();

  // Update position
  if (state.player.movingRight) {
    state.player.col += state.player.speed;
    if (state.player.col + state.player.width > CONFIG.COLS) {
      state.player.col = CONFIG.COLS - state.player.width;
      state.player.movingRight = false;
    }
  } else {
    state.player.col -= state.player.speed;
    if (state.player.col < 0) {
      state.player.col = 0;
      state.player.movingRight = true;
    }
  }

  // Set new position
  drawPlayerPosition();
}

function clearPlayerPosition() {
  for (let col = 0; col < CONFIG.COLS; col++) {
    state.grid[state.player.row][col] = 0;
  }
}

function drawPlayerPosition() {
  const roundedCol = Math.round(state.player.col);
  for (let i = 0; i < state.player.width; i++) {
    if (roundedCol + i < CONFIG.COLS) {
      state.grid[state.player.row][roundedCol + i] = 1;
    }
  }
}

function gravity() {
            for (let col = 0; col < CONFIG.COLS; col++) {
                for (let row = CONFIG.ROWS - 1; row >= 0; row--) {
                    if (state.grid[row][col] === 0) {
                        for (let i = row - 1; i >= 0; i--) {
                            if (state.grid[i][col] === 1) {
                                if (row === CONFIG.ROWS - 1) {
                                    state.grid[i][col] = 0;
                                    state.player.width -= 1;
                                } else {
                                    state.grid[row][col] = 1;
                                    state.grid[i][col] = 0;
                                    state.player.width -= 1;
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }

// Game Logic
function lockBlock() {
  if (!state.gameActive) return;
  // Move player up one row
  state.player.row--;

  // Check for game over or win conditions
  if (state.player.row < 0) {
    endGame(true); // Player won
  }
}

function endGame(win = false) {
  state.gameActive = false;
  alert(win ? "You Win!" : "Game Over!");
}

// Game Loop
function gameLoop(timestamp) {
  updatePlayer(timestamp);
  drawGrid();
  requestAnimationFrame(gameLoop);
}

// Event Listeners
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    lockBlock();
    gravity();
  }
});
canvas.addEventListener("click", lockBlock);

// Start Game
gameLoop();
