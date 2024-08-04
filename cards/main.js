const background = ['Comic Blue', 'Comic Orange', 'Matrix', 'Matrix light', 'Space', 'Rocks'];
const borders = ['Purple Cadre', 'Green Cadre', 'Purple no corner'];
const txts = ['Back-end', 'Front-End'];

const prevBtnBg = document.getElementById('prev-btn-bg');
const nextBtnBg = document.getElementById('next-btn-bg');
const currentBg = document.getElementById('current-bg');


const prevBtnBorder = document.getElementById('prev-btn-border');
const nextBtnBorder = document.getElementById('next-btn-border');
const currentBorder = document.getElementById('current-border');

const prevBtnText = document.getElementById('prev-btn-txt');
const nextBtnText = document.getElementById('next-btn-txt');
const currentText = document.getElementById('current-txt');


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
        let txtNumber = inputs.find(i => i.name === 'Text');
        
        bgNumber.value = 3
        updateBg(3)

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


        prevBtnText.addEventListener('click', () => {
            txtNumber.value = (txtNumber.value - 1 + txts.length) % txts.length;
            updateText(txtNumber.value);
        });
        
        nextBtnText.addEventListener('click', () => {
            txtNumber.value = (txtNumber.value + 1) % txts.length;
            updateText(txtNumber.value);
        });

    },
});

console.log(currentText)

function updateBg(index) {
    currentBg.textContent = background[index];
}
function updateBorder(index) {
    currentBorder.textContent = borders[index];
}
function updateText(index) {
    currentText.textContent = txts[index];
}

updateBorder(2);
updateText(0);