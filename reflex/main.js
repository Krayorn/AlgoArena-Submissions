const canvas = document.getElementById('gameCanvas');
const levelSpan = document.getElementById('level');
const scoreSpan = document.getElementById('score');
const ctx = canvas.getContext('2d');
const reactionTimeSpan = document.getElementById('reactionTime');
const announcementZone = document.getElementById('announcement');

const difficulties = [
    [1, 400],
    [1.2, 400],
    [1.5, 400],
    [2, 400],
    [2.2, 300],
    [2.4, 250],
    [2.5, 250],
    [2.5, 200],
    [3, 200],
    [3, 190],
    [3.1, 180],
    [3.3, 170],
    [3.5, 160],
    [3.7, 150],
    [4, 150],
]
let level = 0;
levelSpan.textContent = "Level 1";

let score = 0;

const ballRadius = 10;
let ballX = ballRadius;
let ballY = canvas.height / 2;
let angle = Math.random() * 10 - 5

let gameState = 'waiting';
let startTime;
let reactionTime;

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

function drawTriggerLine() {
    ctx.beginPath();
    ctx.moveTo(canvas.width - difficulties[level][1], 0);
    ctx.lineTo(canvas.width - difficulties[level][1], canvas.height);
    ctx.strokeStyle = 'blue';
    ctx.stroke();
}

function drawBaseballField() {
    // Draw the infield dirt
    ctx.fillStyle = '#C4A484';  // Light brown color
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2 - 100);
    ctx.lineTo(canvas.width, canvas.height / 2 + 100);
    ctx.closePath();
    ctx.fill();

    // Draw the pitcher's mound
    ctx.beginPath();
    ctx.arc(ballRadius, canvas.height / 2, 20, 0, Math.PI * 2);
    ctx.fillStyle = '#C4A484';
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.stroke();

    // Draw home plate
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(canvas.width - 20, canvas.height / 2);
    ctx.lineTo(canvas.width - 30, canvas.height / 2 - 10);
    ctx.lineTo(canvas.width - 40, canvas.height / 2);
    ctx.lineTo(canvas.width - 30, canvas.height / 2 + 10);
    ctx.closePath();
    ctx.fill();

    // Draw the foul lines
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2 - 100);
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2 + 100);
    ctx.strokeStyle = 'white';
    ctx.stroke();
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawBaseballField();
    drawTriggerLine();
    drawBall();

    if (gameState === 'playing') {
        const radians = angle * Math.PI / 180;
        const deltaX = difficulties[level][0] * Math.cos(radians);
        const deltaY = difficulties[level][0] * Math.sin(radians);
        
        ballX += deltaX;
        ballY += deltaY;

        if (ballX > canvas.width - difficulties[level][1] && !startTime) {
            startTime = Date.now();
        }

        if (ballX > canvas.width) {
            gameState = 'missed';
            reactionTimeSpan.textContent = 'Missed!';
            announcementZone.textContent = `You lost! Your final score is ${score}! Click to try again.`
            level = 0
            score = 0
        }
    }

    requestAnimationFrame(update);
}

function resetGame() {
    ballX = ballRadius
    ballY = canvas.height / 2
    angle = Math.random() * 10 - 5
    gameState = 'playing';
    startTime = null;
    reactionTime = null;
    reactionTimeSpan.textContent = '-';
    levelSpan.textContent = `Level ${level + 1}`;
    scoreSpan.textContent = `Score: ${score}`;

}

canvas.addEventListener('click', function(event) {
    if (gameState === 'waiting' || gameState == 'missed') {
        resetGame();
    } else if (gameState === 'playing') {
        const rect = canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;
        
        const distance = Math.sqrt(Math.pow(clickX - ballX, 2) + Math.pow(clickY - ballY, 2));

        if (distance < ballRadius) {
            if (startTime) {
                reactionTime = Date.now() - startTime;
                reactionTimeSpan.textContent = `${reactionTime} ms`;
                score += (2000 - reactionTime) * level
                level++
                if (level == 15) {
                    level = 0
                    score = 0
                    announcementZone.textContent = `You won congratulations, your final score is ${score}! Click to try again.`
                }
            } else {
                level = 0
                score = 0
                reactionTimeSpan.textContent = 'Too early!';
                announcementZone.textContent = `You lost! Your final score is ${score}! Click to try again.`
            
            }
            gameState = 'waiting';
        }
    }
});

update();