let balls = [];
let boxWidth = 400;
let boxHeight = 300;
let ballCount = 10; // Changed from 5 to 10
let ballSpeed = 2;  // Reduced the speed by half from 4 to 2
let redBalls = []; // Changed from single redBall to an array of red balls

let startTime; // Variable to store the start time
let allRed = false; // New variable to track if all balls are red

function setup() {
    createCanvas(boxWidth + 20, boxHeight + 40); // Increased height to accommodate timer
    let initialRedBall = new Ball(true); // Create the first red ball
    balls.push(initialRedBall);
    redBalls.push(initialRedBall); // Add to redBalls array
    for (let i = 1; i < ballCount; i++) {
        balls.push(new Ball());
    }
    startTime = millis(); // Initialize start time
}

function draw() {
    background(255);
    drawBox();
    for (let ball of balls) {
        ball.move();
        ball.display();
    }

    // Handle collisions between all pairs of balls
    handleBallCollisions();

    // Check collisions between all red balls and other balls
    let newRedBalls = [];
    for (let redBall of redBalls) {
        for (let ball of balls) {
            if (!ball.isRed && isColliding(redBall, ball)) {
                ball.color = color(255, 0, 0);
                ball.isRed = true;
                newRedBalls.push(ball);
            }
        }
    }
    redBalls.push(...newRedBalls); // Update the list of red balls

    // Check if all balls are red using 'every' method
    if (balls.every(ball => ball.isRed) && !allRed) {
        allRed = true;
        // noLoop(); // Removed to keep the motion running
    }

    // Update timer only if not all balls are red
    if (!allRed) {
        updateTimer();
    }
}

function handleBallCollisions() {
    for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
            let ball1 = balls[i];
            let ball2 = balls[j];

            if (isColliding(ball1, ball2)) {
                // Calculate the normal vector
                let dx = ball2.x - ball1.x;
                let dy = ball2.y - ball1.y;
                let distance = sqrt(dx * dx + dy * dy);
                let nx = dx / distance;
                let ny = dy / distance;

                // Calculate relative velocity
                let dvx = ball1.xSpeed - ball2.xSpeed;
                let dvy = ball1.ySpeed - ball2.ySpeed;
                let relVel = dvx * nx + dvy * ny;

                // Do not resolve if velocities are separating
                if (relVel > 0) continue;

                // Calculate impulse scalar
                let impulse = -2 * relVel / 2; // mass = 1 for both balls

                // Apply impulse to the balls
                ball1.xSpeed += impulse * nx;
                ball1.ySpeed += impulse * ny;
                ball2.xSpeed -= impulse * nx;
                ball2.ySpeed -= impulse * ny;

                // Optional: Prevent overlapping
                let overlap = 0.5 * (ball1.diameter / 2 + ball2.diameter / 2 - distance + 1);
                ball1.x -= overlap * nx;
                ball1.y -= overlap * ny;
                ball2.x += overlap * nx;
                ball2.y += overlap * ny;
            }
        }
    }
}

function drawBox() {
    noFill();
    strokeWeight(10);
    stroke(0);
    rect(5, 5, boxWidth + 10, boxHeight + 10);
}

class Ball {
    constructor(isRed = false) { // Existing parameter
        this.x = random(15, boxWidth + 5);
        this.y = random(15, boxHeight + 5);
        this.diameter = 20;
        this.xSpeed = random(-ballSpeed, ballSpeed);
        this.ySpeed = random(-ballSpeed, ballSpeed);
        this.isRed = isRed; // Existing property to track if the ball is red
        this.color = isRed ? color(255, 0, 0) : color(0, 0, 0); // Changed from green to black
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