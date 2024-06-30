const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const spriteSheet = new Image();
spriteSheet.src = './Walk.png';

const focusSprite = new Image();
focusSprite.src = './Magic_sphere.png';

const idleSprite = new Image();
idleSprite.src = './Idle.png';

const cloud = new Image();
cloud.src = './cloud.png';

const cloud2 = new Image();
cloud2.src = './cloud2.png';

const cloud3 = new Image();
cloud3.src = './cloud3.png';

let clouds = [cloud, cloud2, cloud3];
let currentCloud = 0

const sky = new Image();
sky.src = './1.png';

let focus = false;
let idle = true;

let character = {
    x: 1,
    y: canvas.height - 158,
    speed: 1,
};

let stairs = [];
const numSteps = 20;
const stepWidth = 60;
const stepHeight = 30;
const stepGap = 0;

for (let i = 0; i < numSteps; i++) {
    stairs.push({
        x: i * (stepWidth + stepGap),
        y: canvas.height - (i + 1) * stepHeight,
        width: stepWidth,
        height: stepHeight,
        color: 'gray',
    });
}

let rightPressed = false;

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
    if (idle) {
        ctx.drawImage(idleSprite, 128 * currentFrame, 0, 100, 200, character.x - 50, character.y, 100, 200);
        count++
        if (count === 10) {
            count = 0
            currentFrame = (currentFrame + 1) % 7; 
        }
    } else if (focus) {
        ctx.drawImage(focusSprite, 128 * 12, 0, 100, 200, character.x - 50, character.y, 100, 200);
        resetSprite()
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
        idleChar(false)
        const currentStep = Math.ceil(character.x / stepWidth) - 1
        
        if (stairs[currentStep].y > stairs[currentStep+1].y && !(character.x <= stairs[currentStep].x + (stepWidth / 2) - 10)) {
            stairs[currentStep].y -= 0.5
            character.y -= 0.5
            focusChar(true)
        } else {
            character.x += character.speed
            focusChar(false)
            if (character.x > canvas.width) {
                currentCloud = (currentCloud + 1) % clouds.length
                character = {
                    x: 1,
                    y: canvas.height - 158,
                    speed: 1,
                };

                stairs = [];
                for (let i = 0; i < numSteps; i++) {
                    stairs.push({
                        x: i * (stepWidth + stepGap),
                        y: canvas.height - (i + 1) * stepHeight,
                        width: stepWidth,
                        height: stepHeight,
                        color: 'gray',
                    });
                }
            }
        }
    } else {
        idleChar(true)
    }
}

function idleChar(state) {
    if (idle !== state) {
        resetSprite()
    }
    if (state) {
        focus = !state
    }
    idle = state
}

function focusChar(state) {
    if (focus !== state) {
        resetSprite()
    }
    if (state) {
        idle = !state
    }
    focus = state
}

function resetSprite() {
    count = 0
    currentFrame = 0
}

function drawBackground() {
    ctx.drawImage(sky, 0, 0, 800, 600);
    ctx.drawImage(clouds[currentCloud], 0, 0, 800, 600);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawBackground()
    updateCharacter();
    drawStairs();
    drawCharacter();
    requestAnimationFrame(gameLoop);
}

gameLoop();
