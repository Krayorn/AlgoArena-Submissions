const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const spriteSheet = new Image();
spriteSheet.src = './Walk.png';

const focusSprite = new Image();
focusSprite.src = './Attack_1.png';



let focus = false;
let idle = true;

const character = {
    x: 1,
    y: canvas.height - 158,
    width: 20,
    height: 20,
    color: 'blue',
    speed: 1,
};

let stairs = [];
const numSteps = 20;
const stepWidth = 60;
const stepHeight = 30;
const stepGap = 0;

// Generate stairs
for (let i = 0; i < numSteps; i++) {
    stairs.push({
        x: i * (stepWidth + stepGap),
        y: canvas.height - (i + 1) * stepHeight,
        width: stepWidth,
        height: stepHeight,
        color: `rgba(${100 + i * 15}, ${100 + i * 10}, 200, 0.8)`,
    });
}

let rightPressed = false;

// Event listeners for key presses
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
        rightPressed = true;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowRight') {
        rightPressed = false;
    }
});

let currentFrame = 0;
let count = 0

function drawCharacter() {
    if (focus) {

        ctx.drawImage(focusSprite, 128 * 3, 0, 100, 200, character.x - 50, character.y, 100, 200);
        count = 0
        currentFrame = 0
    } else {   
        ctx.drawImage(spriteSheet, 128 * currentFrame, 0, 100, 200, character.x - 50, character.y, 100, 200);
        count++
        if (count === 10) {
            count = 0
            currentFrame = (currentFrame + 1) % 7; 
        }
    }
}

function drawStairs() {
    stairs.forEach(step => {
        ctx.fillStyle = step.color;
        ctx.fillRect(step.x, step.y, step.width, step.height);
    });
}

function updateCharacter() {
    if (rightPressed) {
        idle = false
        const currentStep = Math.ceil(character.x / stepWidth) - 1
        console.log(stairs[currentStep],stairs[currentStep+1])
        
        if (character.x <= stairs[currentStep].x + (stepWidth / 2) - (character.width / 2)) {
            character.x += character.speed
            focus = false
        }
        else if (stairs[currentStep].y > stairs[currentStep+1].y) {
            stairs[currentStep].y -= 0.5
            character.y -= 0.5
            focus = true
        } else {
            character.x += character.speed
            focus = false
        }
    } else {
        idle = true
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    updateCharacter();
    drawStairs();
    drawCharacter();
    requestAnimationFrame(gameLoop);
}

gameLoop();
