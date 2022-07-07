//----------------------------------------------------------------------
// DOM references
//----------------------------------------------------------------------
const startGameButton = document.querySelector(".btn-start");

// Render graphics on the canvas element
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

//----------------------------------------------------------------------
// Audio references
//----------------------------------------------------------------------
const breakSound = document.getElementById("breakingBrick");
const lostALifeSound = document.getElementById("losingLives");

//----------------------------------------------------------------------
// Constant Variables
//----------------------------------------------------------------------
const width = canvas.width;
const height = canvas.height;
const ballRadius = 10;
// Paddle variables
const paddleHeight = 10;
const paddleWidth = 120;
// Brick variables
const brickRowCount = 8;
const brickColumnCount = 8;
const brickWidth = 45;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
// Starting position of the paddle
const paddleXStart = (width - paddleWidth) / 2;
const PI2 = Math.PI * 2;
const gameOverMessage = "Game Over!";
const gameWonMessage = "YOU WIN, CONGRATS!";
// Game colours
const ballColor = "yellow";
const paddleColor = "white";
const livesColor = "white";
const scoreColor = "white";
const brickColors = [
  "#284FB6",
  "#DE3163",
  "#901FD8",
  "#32CD32",
  "#FFBF00",
  "#CCCCFF",
  "#40E0D0",
  "#D81F1F",
];

//----------------------------------------------------------------------
// Classes
//----------------------------------------------------------------------
class Ball {
  x = 0;
  y = 0;
  dx = 2;
  dy = -2;
  radius = 10;
  color;
  constructor(x, y, dx, dy, radius, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.raduis = radius;
    this.color = color;
  }
  drawBall(ctx) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, PI2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}
let ball = new Ball(0, 0, 2, -2, 10, ballColor);

class Brick {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.status = 1;
    this.width = width;
    this.height = height;
    this.color = color;
  }
  drawBrick(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

class Bricks {
  constructor(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.bricks = [];
    this.initialise();
  }

  initialise() {
    for (let c = 0; c < this.cols; c++) {
      this.bricks[c] = [];
      for (let r = 0; r < this.rows; r++) {
        // Work out the x and y positions of each brick for each loop iteration to draw the bricks
        let brickX = r * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = c * (brickHeight + brickPadding) + brickOffsetTop;
        // Status parameter to indicate whether I want to paint each brick on the screen or not
        this.bricks[c][r] = new Brick(
          brickX,
          brickY,
          brickWidth,
          brickHeight,
          brickColors[c]
        );
      }
    }
  }

  drawBricks() {
    for (let c = 0; c < this.cols; c++) {
      for (let r = 0; r < this.rows; r++) {
        const brick = this.bricks[c][r];
        // If brick status is 1 then draw it - else it's been hit
        if (brick.status == 1) {
          brick.drawBrick(ctx);
        }
      }
    }
  }
}

const bricks = new Bricks(brickColumnCount, brickRowCount);

//----------------------------------------------------------------------
// Let Variables
//----------------------------------------------------------------------

let paddleX;
resetBallAndPaddle();
let score = 0;
let lives = 5;
// Button control variables
let rightPressed = false;
let leftPressed = false;

//----------------------------------------------------------------------
// Event listeners
//----------------------------------------------------------------------

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("mousemove", mouseMoveHandler);

function keyDownHandler(e) {
  if (e.keyCode === 39) {
    rightPressed = true;
  } else if (e.keyCode === 37) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode === 39) {
    rightPressed = false;
  } else if (e.keyCode === 37) {
    leftPressed = false;
  }
}
// Track mouse movement
function mouseMoveHandler(e) {
  // Distance between the canvas left edge and the mouse pointer
  let relativeX = e.clientX - canvas.offsetLeft;
  // If x is greater than 0 and lower than canvas width then the pointer is within canvas boundaries
  if (relativeX > 0 && relativeX < width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

//----------------------------------------------------------------------
// Functions
//----------------------------------------------------------------------

// Drawing the paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = paddleColor;
  ctx.fill();
  ctx.closePath();
}

// Create and update score display
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = scoreColor;
  ctx.fillText("Score: " + score, 8, 20);
}

// Drawing the life counter
function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = livesColor;
  ctx.fillText("Lives: " + lives, width - 65, 20);
}

function resetBallAndPaddle() {
  // Position of the ball
  ball.x = width / 2;
  ball.y = height - 30;
  // Movement of the ball
  ball.dx = 3;
  ball.dy = -3;
  // Position of the paddle
  paddleX = paddleXStart;
}

// Looping through all the bricks and compare brick's position with the ball's coordinates
function collisionDetection() {
  for (let c = 0; c < bricks.cols; c++) {
    for (let r = 0; r < bricks.rows; r++) {
      let brick = bricks.bricks[c][r];
      // If the brick status is equal to 1 then we will do the collision check
      if (brick.status == 1) {
        // For the center of the ball to be inside the brick, all these statements need to be true
        if (
          ball.x > brick.x &&
          ball.x < brick.x + brickWidth &&
          ball.y > brick.y &&
          ball.y < brick.y + brickHeight
        ) {
          breakSound.volume = 0.2;
          breakSound.play();
          // Once brick has been hit redirect the ball in the opposite direction
          ball.dy = -ball.dy;
          brick.status = 0;
          score++;
          // If all bricks have been destroyed then you win
          if (score == brickRowCount * brickColumnCount) {
            alert(gameWonMessage);
            document.location.reload();
          }
        }
      }
    }
  }
}

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
}

function movePaddle() {
  // Check for arrow keys
  if (rightPressed && paddleX < width - paddleWidth) {
    paddleX += 5;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 5;
  }
}

function collisionsWithCanvasAndPaddle() {
  // Ball bouncing off the left and right of the canvas
  if (
    ball.x + ball.dx > width - ball.radius ||
    ball.x + ball.dx < ball.radius
  ) {
    ball.dx = -ball.dx;
  }
  // Ball bouncing off the top
  if (ball.y + ball.dy < ball.radius) {
    ball.dy = -ball.dy;
  } else if (ball.y + ball.dy > height - ball.radius) {
    // Collision detection between the ball and the paddle
    if (ball.x > paddleX && ball.x < paddleX + paddleWidth) {
      ball.dy = -ball.dy;
    } else {
      lostALifeSound.volume = 0.2;
      lostALifeSound.play();
      lives--;
      // If there are no lives left, the game is over
      if (!lives) {
        alert(gameOverMessage);
        document.location.reload();
      } else {
        // Reset the position of the ball and paddle - along with the movement of the ball
        resetBallAndPaddle();
      }
    }
  }
}

//----------------------------------------------------------------------
// Game Loop - Handles the animation
//----------------------------------------------------------------------

function draw() {
  // Clearing the canvas
  ctx.clearRect(0, 0, width, height);
  // Calling helper functions
  bricks.drawBricks(ctx);
  ball.drawBall(ctx);
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();
  moveBall();
  movePaddle();
  collisionsWithCanvasAndPaddle();

  // Draw the screen again
  requestAnimationFrame(draw);
}

// **************************************************
// Starts program
// **************************************************

startGameButton.addEventListener("click", () => {
  startGameButton.classList.add("btn-hide");
  const audio = document.querySelector("#background");
  audio.volume = 0.2;
  audio.play();
  draw();
});
