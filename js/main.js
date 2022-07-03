//----------------------------------------------------------------------
// DOM references
//----------------------------------------------------------------------

// Allows us to render graphics on the <canvas> element
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

//----------------------------------------------------------------------
// Constant Variables
//----------------------------------------------------------------------
const width = canvas.width;
const height = canvas.height;
const ballRadius = 10;
// Paddle variables
const paddleHeight = 10;
const paddleWidth = 75;
// Brick variables
const brickRowCount = 8;
const brickColumnCount = 4;
const brickWidth = 45;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
// Starting position of the paddle
const paddleXStart = (width - paddleWidth) / 2;
const PI2 = Math.PI * 2;
// Game colours
const ballColor = "orange";
const bricksColor = "blue";
const paddleColor = "white";
const livesColor = "white";
const scoreColor = "white";

//----------------------------------------------------------------------
// Let Variables
//----------------------------------------------------------------------

let ball = {
  x: 0,
  y: 0,
  dx: 0,
  dy: 0,
};

let paddleX;
resetBallAndPaddle();
let score = 0;
let lives = 5;
// Button control variables
let rightPressed = false;
let leftPressed = false;

//----------------------------------------------------------------------
// Setup Bricks Array
//----------------------------------------------------------------------

//2d array containing columns and rows that will contain the x and y positions to paint each brick
const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    // Status parameter to indicate whether I want to paint each brick on the screen or not
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

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

// Looping through all the bricks and compare brick's position with the ball's coordinates
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let brick = bricks[c][r];
      // If the brick status is equal to 1 then we will do the collision check
      if (brick.status == 1) {
        // For the center of the ball to be inside the brick, all these statements need to be true
        if (
          ball.x > brick.x &&
          ball.x < brick.x + brickWidth &&
          ball.y > brick.y &&
          ball.y < brick.y + brickHeight
        ) {
          // Once brick has been hit redirect the ball in the opposite direction
          ball.dy = -ball.dy;
          brick.status = 0;
          score++;
          // If all bricks have been destroyed then you win
          if (score == brickRowCount * brickColumnCount) {
            alert("YOU WIN, CONGRATS!");
            document.location.reload();
          }
        }
      }
    }
  }
}
// Drawing the ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ballRadius, 0, PI2);
  ctx.fillStyle = ballColor;
  ctx.fill();
  ctx.closePath();
}

// Drawing the paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = paddleColor;
  ctx.fill();
  ctx.closePath();
}

// Drawing the bricks
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      // If brick status is 1 then draw it - else it's been hit
      if (bricks[c][r].status == 1) {
        // Work out the x and y positions of each brick for each loop iteration to draw the bricks
        let brickX = r * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = c * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = bricksColor;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
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
  if (ball.x + ball.dx > width - ballRadius || ball.x + ball.dx < ballRadius) {
    ball.dx = -ball.dx;
  }
  // Ball bouncing off the top
  if (ball.y + ball.dy < ballRadius) {
    ball.dy = -ball.dy;
  } else if (ball.y + ball.dy > height - ballRadius) {
    // Collision detection between the ball and the paddle
    if (ball.x > paddleX && ball.x < paddleX + paddleWidth) {
      ball.dy = -ball.dy;
    } else {
      lives--;
      // If there are no lives left, the game is over
      if (!lives) {
        alert("GAME OVER");
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
  drawBricks();
  drawBall();
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

draw();
