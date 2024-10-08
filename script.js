let balls = [];
let boxWidth = window.innerWidth * 0.9; // 80% of the window's width
let boxHeight = window.innerHeight * 0.6; // 80% of the window's height
let ballCountOptions = [10, 20, 50, 100]; // Updated array
let ballCount = ballCountOptions[Math.floor(Math.random() * ballCountOptions.length)]; // Randomly select ballCount
let ballSpeedOptions = [2, 3, 5, 10]; // Updated array
let ballSpeed = ballSpeedOptions[Math.floor(Math.random() * ballSpeedOptions.length)]; // Randomly select ballSpeed
let redBalls = []; // Array to track red balls
let greenBalls = []; // Array to track green balls

let startTime; // Variable to store the start time
let allRed = false; // New variable to track if all balls are red

let initialRedCount = 2; // Number of initial red balls
let initialGreenCount = 2; // Number of initial green balls

// Variables to keep track of counts
let redCount = initialRedCount;
let greenCount = initialGreenCount;
let blackCount = ballCount - (initialRedCount + initialGreenCount);

function setup() {
    let canvas = createCanvas(boxWidth + 20, boxHeight + 40); // Increased height to accommodate timer
    canvas.parent('canvas-container'); // Append canvas to the container
    
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
        setTimeout(() => {
            noLoop();
            showTimer(); // Show the timer with a transition
        }, 200); // Stop the draw loop after 200 ms
    }

    // Update timer only if not all balls are red or green
    if (!allRed) {
        updateTimer();
    }

    // Display counts of red, green, and black balls
    displayCounts();
}

function showTimer() {
    let timerDiv = select('#timer');
    if (timerDiv) {
        timerDiv.addClass('show');
    }
}

function displayCounts() {
    // Update the text content of each counter to show only the number
    select('.red-counter').html(redCount);
    select('.green-counter').html(greenCount);
    select('.black-counter').html(blackCount);
}

function updateTimer() {
    let elapsed = millis() - startTime;
    let totalSeconds = floor(elapsed / 1000);
    let minutes = floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    let timeString = nf(minutes, 2) + ":" + nf(seconds, 2);
    let timeSpan = select('#time');
    if (timeSpan) {
        timeSpan.html(timeString);
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
        this.diameter = 15; // Reduced diameter to make the balls smaller
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