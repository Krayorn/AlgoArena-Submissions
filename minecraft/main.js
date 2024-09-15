// Get the necessary elements
const bar = document.querySelector('.bar');
const scene = document.querySelector('.scene');
let selectedCube = null;
let activeCube = null;

// Add click event listeners to the cubes in the bar
bar.querySelectorAll('.demo.cube').forEach(cube => {
    cube.addEventListener('click', () => {
        selectedCube = cube.cloneNode(true);
        selectedCube.classList.remove('demo');
        selectedCube.style.setProperty('--x', '1em');
        selectedCube.style.setProperty('--y', '1em');
        selectedCube.style.setProperty('--z', '1em');
    });
});

// Add click event listener to the scene for placing or selecting cubes
scene.addEventListener('click', (e) => {
    const clickedCube = e.target.closest('.cube');
    if (clickedCube && clickedCube.parentElement === scene) {
        // If clicked on an existing cube, select it
        setActiveCube(clickedCube);
    } else if (selectedCube) {
        // If clicked on empty space and a cube is selected from the bar, place new cube
        const newCube = selectedCube.cloneNode(true);
        newCube.style.translate = '0em 0em 0em';
        newCube.dataset.x = '0';
        newCube.dataset.y = '0';
        newCube.dataset.z = '0';
        
        scene.appendChild(newCube);
        setActiveCube(newCube);
    }
});

function setActiveCube(cube) {
    if (activeCube) {
        activeCube.style.outline = 'none';
    }
    activeCube = cube;
    activeCube.style.outline = '2px solid white';
}

// Add keydown event listener for arrow key controls and delete
document.addEventListener('keydown', (e) => {
    if (!activeCube) return;

    if (e.key === 'Backspace') {
        activeCube.remove();
        activeCube = null;
        return;
    }

    const step = 1;
    let x = parseInt(activeCube.dataset.x) || 0;
    let y = parseInt(activeCube.dataset.y) || 0;
    let z = parseInt(activeCube.dataset.z) || 0;

    switch (e.key) {
        case 'ArrowRight':
            x += step;
            break;
        case 'ArrowLeft':
            x -= step;
            break;
        case 'ArrowUp':
            y -= step;
            break;
        case 'ArrowDown':
            y += step;
            break;
        case 'Alt':
            z += step;
            break;
        case 'Control':
            z -= step;
            break;
    }

    activeCube.dataset.x = x;
    activeCube.dataset.y = y;
    activeCube.dataset.z = z;
    activeCube.style.translate = `${x}em ${y}em ${z}em`;
});

// Existing code...

// Add these variables at the top of your script
let cameraRotateX = 65;
let cameraRotateZ = 45;

// Add this function to update the camera angle
function updateCameraAngle() {
  scene.style.transform = `rotateX(${cameraRotateX}deg) rotateZ(${cameraRotateZ}deg)`;
}

document.querySelectorAll('.camera-controls .arrow').forEach(arrow => {
  console.log(arrow)
    arrow.addEventListener('click', (e) => {
    const direction = e.target.classList[1]; // up, down, left, or right
    const step = 5; // Rotation step in degrees
    console.log('direction', direction)
    switch (direction) {
      case 'up':
        cameraRotateX = Math.max(0, cameraRotateX - step);
        break;
      case 'down':
        cameraRotateX = Math.min(90, cameraRotateX + step);
        break;
      case 'left':
        cameraRotateZ = (cameraRotateZ - step) % 360;
        break;
      case 'right':
        cameraRotateZ = (cameraRotateZ + step) % 360;
        break;
    }

    updateCameraAngle();
  });
});

updateCameraAngle();