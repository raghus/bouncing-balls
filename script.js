let balls = [];
let boxWidth = 600; // Reduced width of the bounding box
let boxHeight = 400; // Reduced height of the bounding box
let ballCount = 30; // Total number of balls
let ballSpeed = 1;  // Reduced the speed to 1
let redBalls = []; // Array to track red balls
let greenBalls = []; // Array to track green balls

let startTime; // Variable to store the start time
let allRed = false; // New variable to track if all balls are red

let initialRedCount = 1; // Number of initial red balls
let initialGreenCount = 1; // Number of initial green balls

// Variables to keep track of counts
let redCount = initialRedCount;
let greenCount = initialGreenCount;
let blackCount = ballCount - (initialRedCount + initialGreenCount);

function setup() {
    createCanvas(boxWidth + 20, boxHeight + 40); // Increased height to accommodate timer
    
    // Initialize multiple red balls
    for (let i = 0; i < initialRedCount; i++) {
        let initialRedBall = new Ball('red'); // Create a red ball
        balls.push(initialRedBall);
        redBalls.push(initialRedBall); // Add to redBalls array
    }
    
    // Initialize multiple green balls
    for (let i = 0; i < initialGreenCount; i++) {
        let initialGreenBall = new Ball('green'); // Create a green ball
        balls.push(initialGreenBall);
        greenBalls.push(initialGreenBall); // Add to greenBalls array
    }
    
    // Initialize remaining black balls
    for (let i = initialRedCount + initialGreenCount; i < ballCount; i++) {
        balls.push(new Ball('black'));
    }
    
    startTime = millis(); // Initialize start time
}

function draw() {
    background(255);
    drawBox(); // Draw the bounding box
    for (let ball of balls) {
        ball.move();
        ball.display();
    }

    // Check collisions between all red balls and other balls
    let newRedBalls = [];
    let newGreenBalls = [];
    for (let redBall of redBalls) {
        for (let ball of balls) {
            if (!ball.isRed && !ball.isGreen && isColliding(redBall, ball)) {
                ball.color = color(255, 0, 0);
                ball.isRed = true;
                newRedBalls.push(ball);
                redCount++; // Increment red count
                blackCount--; // Decrement black count
            }
        }
    }
    redBalls.push(...newRedBalls); // Update the list of red balls

    // Check collisions between all green balls and other balls
    for (let greenBall of greenBalls) {
        for (let ball of balls) {
            if (!ball.isRed && !ball.isGreen && isColliding(greenBall, ball)) {
                ball.color = color(0, 255, 0);
                ball.isGreen = true;
                newGreenBalls.push(ball);
                greenCount++; // Increment green count
                blackCount--; // Decrement black count
            }
        }
    }
    greenBalls.push(...newGreenBalls); // Update the list of green balls

    // Check if all balls are red or green using 'every' method
    if (balls.every(ball => ball.isRed || ball.isGreen) && !allRed) {
        allRed = true;
        setTimeout(noLoop, 200); // Stop the draw loop after 200 ms
    }

    // Update timer only if not all balls are red or green
    if (!allRed) {
        updateTimer();
    }

    // Display counts of red, green, and black balls
    displayCounts();
}

function displayCounts() {
    fill(0); // Set text color to black
    textSize(16);
    textAlign(LEFT);
    text(`Red: ${redCount} | Green: ${greenCount} | Black: ${blackCount}`, 10, boxHeight + 30); // Display counts in a single line
}

function updateTimer() {
    let elapsed = millis() - startTime;
    let totalSeconds = floor(elapsed / 1000);
    let minutes = floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    let timeString = nf(minutes, 2) + ":" + nf(seconds, 2);
    let timerDiv = select('#timer');
    if (timerDiv) {
        timerDiv.html(timeString);
    }
}

function isColliding(ball1, ball2) {
    let distance = dist(ball1.x, ball1.y, ball2.x, ball2.y);
    return distance < (ball1.diameter / 2 + ball2.diameter / 2);
}

function drawBox() {
    noFill();
    strokeWeight(1); // Set stroke weight to 1px
    stroke(210, 210, 210); // Set stroke color to #d2d2d2
    rect(5, 5, boxWidth + 10, boxHeight + 10); // Draw the bounding box
}

class Ball {
    constructor(type = 'black') { // Added parameter for ball type
        this.diameter = 20; // Set diameter first to use in position calculations
        // Adjusted initial position to ensure balls stay entirely within the bounding box
        this.x = random(15 + this.diameter / 2, boxWidth + 5 - this.diameter / 2);
        this.y = random(15 + this.diameter / 2, boxHeight + 5 - this.diameter / 2);
        this.xSpeed = random(-ballSpeed, ballSpeed);
        this.ySpeed = random(-ballSpeed, ballSpeed);
        this.isRed = type === 'red'; // Track if the ball is red
        this.isGreen = type === 'green'; // Track if the ball is green
        this.color = this.isRed ? color(255, 0, 0) : this.isGreen ? color(0, 255, 0) : color(0, 0, 0); // Set color based on type
    }

    move() {
        this.x += this.xSpeed;
        this.y += this.ySpeed;

        if (this.x - this.diameter / 2 < 15 || this.x + this.diameter / 2 > boxWidth + 5) {
            this.xSpeed *= -1;
        }
        if (this.y - this.diameter / 2 < 15 || this.y + this.diameter / 2 > boxHeight + 5) {
            this.ySpeed *= -1;
        }
    }

    display() {
        fill(this.color);
        noStroke();
        ellipse(this.x, this.y, this.diameter);
    }
}