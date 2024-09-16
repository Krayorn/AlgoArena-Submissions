const bar = document.querySelector('.bar');
const scene = document.querySelector('.scene');
let selectedCube = null;
let activeCube = null;


// Add click event listeners to the cubes in the bar
bar.querySelectorAll('.demo.cube').forEach(cube => {
    cube.addEventListener('click', () => {
        bar.querySelectorAll('.demo.cube').forEach(c => c.classList.remove('selected'));
        
        cube.classList.add('selected');
        selectedCube = cube.cloneNode(true);
        selectedCube.classList.remove('demo', 'selected');
        selectedCube.style.setProperty('--x', '1em');
        selectedCube.style.setProperty('--y', '1em');
        selectedCube.style.setProperty('--z', '1em');
    });
});

scene.addEventListener('click', (e) => {
    const clickedCube = e.target.closest('.cube');
    if (clickedCube && clickedCube.parentElement === scene) {
        // If clicked on an existing cube, select it
        setActiveCube(clickedCube);
    } else if (selectedCube) {
        const newCube = selectedCube.cloneNode(true);
        
        const rect = scene.getBoundingClientRect();
        const x = (e.clientX - rect.left) / 30; 
        const y = (e.clientY - rect.top) / 30;
        
        newCube.style.translate = `${x}em ${y}em 0em`;
        newCube.dataset.x = x;
        newCube.dataset.y = y;
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

// Add deselect functionality
const deselectAllButton = document.getElementById('deselectAll');
deselectAllButton.addEventListener('click', () => {
    bar.querySelectorAll('.demo.cube').forEach(c => c.classList.remove('selected'));
    selectedCube = null;
    
    if (activeCube) {
        activeCube.style.outline = 'none';
        activeCube = null;
    }
});

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

let cameraRotateX = 65;
let cameraRotateZ = 45;

function updateCameraAngle() {
  scene.style.transform = `rotateX(${cameraRotateX}deg) rotateZ(${cameraRotateZ}deg)`;
}

document.querySelectorAll('.camera-controls .arrow').forEach(arrow => {
    arrow.addEventListener('click', (e) => {
    const direction = e.target.classList[1];
    const step = 5;
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