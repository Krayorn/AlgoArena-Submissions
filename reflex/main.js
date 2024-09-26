const canvas = document.getElementById('gameCanvas');
const levelSpan = document.getElementById('level');

const ctx = canvas.getContext('2d');
const reactionTimeSpan = document.getElementById('reactionTime');

const speeds = [1, 1.2, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
let level = 0;

levelSpan.textContent = "Level 1";

const ballRadius = 10;
let ballX = ballRadius;
let ballY = canvas.height / 2;
let angle = Math.random() * 90 - 45

const triggerLineX = canvas.width - 400;

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
    ctx.moveTo(triggerLineX, 0);
    ctx.lineTo(triggerLineX, canvas.height);
    ctx.strokeStyle = 'blue';
    ctx.stroke();
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawTriggerLine();
    drawBall();

    if (gameState === 'playing') {
        ballX += speeds[level];

        if (ballX > triggerLineX && !startTime) {
            startTime = Date.now();
        }

        if (ballX > canvas.width) {
            gameState = 'missed';
            reactionTimeSpan.textContent = 'Missed!';
            level = 0
        }
    }

    requestAnimationFrame(update);
}

function resetGame() {
    ballX = ballRadius;
    angle = Math.random() * 90 - 45
    gameState = 'playing';
    startTime = null;
    reactionTime = null;
    reactionTimeSpan.textContent = '-';
    levelSpan.textContent = `Level ${level + 1}` ;
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
                reactionTimeSpan.textContent = reactionTime;
                level++
            } else {
                level = 0
                reactionTimeSpan.textContent = 'Too early!';
            }
            gameState = 'waiting';
        }
    }
});

update();