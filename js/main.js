//allows us to render graphics on the <canvas> element
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d"); // paint the canvas

//radius of the ball
let ballRadius = 10;
//position of the ball
let x = canvas.width / 2;
let y = canvas.height - 30;
//variables to help with the movement of the ball
let dx = 2;
let dy = -2;
//paddle variables
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
//brick variables
let brickRowCount = 8;
let brickColumnCount = 4;
let brickWidth = 45;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
//score count
let score = 0;
//lives count
let lives = 5;
//button control variables
let rightPressed = false;
let leftPressed = false;

//2d array containing columns and rows that will contain the x and y positions to paint each brick
let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    //status parameter to indicate whether I want to paint each brick on the screen or not
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

//event listeners for button presses
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("mousemove", mouseMoveHandler);

//paddle movement using key presses
function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

//changes variables based on key presses
function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}
//track mouse movement
function mouseMoveHandler(e) {
  //distance between the canvas left edge and the mouse pointer
  let relativeX = e.clientX - canvas.offsetLeft;
  //if x is greater than 0 and lower than canvas width then the pointer is within canvas boundaries
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

//this function that will loop through all the bricks and compare every single brick's position with the ball's coordinates as each frame is drawn
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      //if the brick status is equal to 1 then we will do the collision check
      if (b.status == 1) {
        //for the center of the ball to be inside the brick, all these statements need to be true
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          //once brick has been hit redirect the ball in the opposite direction
          dy = -dy;
          b.status = 0;
          score++;
          //if all bricks have been destroyed then you win
          if (score == brickRowCount * brickColumnCount) {
            alert("YOU WIN, CONGRATS!");
            document.location.reload();
          }
        }
      }
    }
  }
}
//drawing the ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "orange";
  ctx.fill();
  ctx.closePath();
}

//drawing the paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();
}

//drawing the bricks
function drawBricks() {
  //looping through all the bricks in the array and drawing them on the screen
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      //if brick status is 1 then draw it - else it's been hit
      if (bricks[c][r].status == 1) {
        //work out the x and y positions of each brick for each loop iteration to draw the bricks
        let brickX = r * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = c * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "blue";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}
//create and update score display
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, 8, 20);
}
//drawing the life counter
function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

//handles the animation
function draw() {
  //clearing the canvas before each frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //the drawing calls
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  //ball bouncing off the left and right
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  //ball bouncing off the top
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    //collision detection between the ball and the paddle
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      lives--;
      //if there are no lives left, the game is over
      if (!lives) {
        alert("GAME OVER");
        document.location.reload();
      } else {
        //else reset the position of the ball and paddle - along with the movement of the ball
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 3;
        dy = -3;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  //moves paddle
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 5;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 5;
  }
  // updates position
  x += dx;
  y += dy;

  //helps the browser render the game better than the fixed frame rate implemented with setInterval
  //the draw function will call itself over and over again
  requestAnimationFrame(draw);
}

draw();
