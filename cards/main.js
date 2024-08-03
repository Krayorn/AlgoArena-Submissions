const background = ['Comic Blue', 'Comic Orange', 'Matrix', 'CPU'];
const borders = ['Purple Cadre', 'Green Cadre', 'Purple no corner'];

const prevBtnBg = document.getElementById('prev-btn-bg');
const nextBtnBg = document.getElementById('next-btn-bg');
const currentBg = document.getElementById('current-bg');


const prevBtnBorder = document.getElementById('prev-btn-border');
const nextBtnBorder = document.getElementById('next-btn-border');
const currentBorder = document.getElementById('current-border');


const r = new rive.Rive({
    src: "./superdev_cards.riv",
    // OR the path to a discoverable and public Rive asset
    // src: '/public/example.riv',
    canvas: document.getElementById("canvas"),
    autoplay: true,
    stateMachines: "State Machine 1",
    onLoad: () => {
        const inputs = r.stateMachineInputs('State Machine 1');

        let contourNumber = inputs.find(i => i.name === 'Contour');
        let bgNumber = inputs.find(i => i.name === 'Bg');

        prevBtnBg.addEventListener('click', () => {
            bgNumber.value = (bgNumber.value - 1 + background.length) % background.length;
            updateBg(bgNumber.value);
        });
        
        nextBtnBg.addEventListener('click', () => {
            bgNumber.value = (bgNumber.value + 1) % background.length;
            updateBg(bgNumber.value);
        });


        prevBtnBorder.addEventListener('click', () => {
            contourNumber.value = (contourNumber.value - 1 + borders.length) % borders.length;
            updateBorder(contourNumber.value);
        });
        
        nextBtnBorder.addEventListener('click', () => {
            contourNumber.value = (contourNumber.value + 1) % borders.length;
            updateBorder(contourNumber.value);
        });

    },
});



function updateBg(index) {
    currentBg.textContent = background[index];
}
function updateBorder(index) {
    currentBorder.textContent = borders[index];
}

updateBg(2);
updateBorder(2);