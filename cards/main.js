const contourButton = document.querySelector("#contour")
const bgButton = document.querySelector("#bg")


const r = new rive.Rive({
    src: "./superdev_cards.riv",
    // OR the path to a discoverable and public Rive asset
    // src: '/public/example.riv',
    canvas: document.getElementById("canvas"),
    autoplay: true,
    stateMachines: "State Machine 1",
    onLoad: () => {
        // Get the inputs via the name of the state machine
        const inputs = r.stateMachineInputs('State Machine 1');
        // Find the input you want to set a value for, or trigger
        let contourNumber = inputs.find(i => i.name === 'Contour');

        contourButton.onclick = () => {
            contourNumber.value++
            if (contourNumber.value > 2) {
                contourNumber.value = 0
            }
        }

        let bgNumber = inputs.find(i => i.name === 'Bg');

        bgButton.onclick = () => {
            bgNumber.value++
            if (bgNumber.value > 2) {
                bgNumber.value = 0
            }
        }
    },
});