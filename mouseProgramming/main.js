let gates = [{id: 0, inputs: [], type: "input1", output: false}, {id: 1, inputs: [], type: "input2", output: false}, {id: 2, type: "output", inputs: [null], output: null}]
let input1 = false;
let input2 = false;
const outputValueSpan = document.getElementById('outputValue');

calculateOutput(gates)
displayGates(gates)


document.getElementById('addOR').addEventListener('click', () => addGate('OR'));
document.getElementById('addAND').addEventListener('click', () => addGate('AND'));
document.getElementById('addNOT').addEventListener('click', () => addGate('NOT'));
document.getElementById('clear').addEventListener('click', clearCircuit);

let id = 3;

function addGate(type) {
    const gate = { id, type, inputs: [], output: null };
    id++
    if (type === 'NOT') {
        gate.inputs = [null];
    } else {
        gate.inputs = [null, null];
    }
    
    gates.push(gate);
    displayGates(gates)
}

function displayGates(gates) {
    const gatesDiv = document.getElementById('gates');
    gatesDiv.innerHTML = '';

    gates.forEach(gate => {
        const gateElement = document.createElement('div');
        gateElement.className = 'gate';

        let inputsText = gate.inputs.map((input, index) => `Input ${index}: ${input !== null ? input : 'None'}`).join(', ');
        let outputText = gate.output !== null ? gate.output.toString() : 'Not calculated';

        gateElement.innerHTML = `
            <h3>${gate.type.toUpperCase()} (ID: ${gate.id})</h3>
            <p>Inputs: ${inputsText}</p>
            <p>Output: ${outputText}</p>
        `;

        // Add toggle for input gates
        if (gate.type === 'input1' || gate.type === 'input2') {
            const toggleButton = document.createElement('button');
            toggleButton.textContent = gate.output ? 'Turn OFF' : 'Turn ON';
            toggleButton.addEventListener('click', () => {
                gate.output = !gate.output;
                calculateOutput();
                displayGates(gates);
            });
            gateElement.appendChild(toggleButton);
        }

        // Add link options for inputs (excluding input and output gates)
        if (gate.inputs.length > 0 && gate.type !== 'input1' && gate.type !== 'input2') {
            const linkForm = document.createElement('form');
            linkForm.className = 'link-form';

            gate.inputs.forEach((input, index) => {
                const select = document.createElement('select');
                select.id = `link-${gate.id}-${index}`;
                select.innerHTML = '<option value="">Select input</option>';

                gates.forEach(sourceGate => {
                    if (sourceGate.id !== gate.id && sourceGate.type !== 'output') {
                        select.innerHTML += `<option value="${sourceGate.id}">${sourceGate.type} (ID: ${sourceGate.id})</option>`;
                    }
                });

                const label = document.createElement('label');
                label.textContent = `Input ${index}: `;
                label.appendChild(select);

                linkForm.appendChild(label);

                select.addEventListener('change', (e) => {
                    const sourceId = parseInt(e.target.value);
                    link(sourceId, gate.id, index);
                    calculateOutput();
                    displayGates(gates);
                });
            });

            gateElement.appendChild(linkForm);
        }

        gatesDiv.appendChild(gateElement);
    });
}
function link(id1, id2, outputIdx) {
    const inputGate = gates.find(g => g.id === id2)

    inputGate.inputs[outputIdx] = id1
}

function calculateOutput() {
    gates.forEach(gate => {
        if (gate.type !== "input1" && gate.type !== "input2") {
            gate.output = null
        }
    });

    const output = gates.find(g => g.type === "output")
    if (output.inputs.some(v => v === null)) {
        outputValueSpan.textContent = 'Output not connected to any input';
        return
    }

    let breakNeeded = false
    let c = 0
    while(true) {
        console.log('newTurn')
        c++
        if (c == 2) {
            console.log('error')
            break
        }
        gates.forEach(gate => {
            if (gate.inputs.length === 0) {
                return
            }

            if (gate.output !== null) {
                return
            }

            if (gate.type === "output") {
                const input1Value = gates.find(g => g.id === gate.inputs[0])?.output
                if (input1Value !== null) {
                    breakNeeded = true
                    gate.output = input1Value
                }
                return
            }


            const input1Value = gates.find(g => g.id === gate.inputs[0])?.output
            const input2Value = gates.find(g => g.id === gate.inputs[1])?.output         

            if ((input1Value !== null && gate.type === "NOT") || (input1Value !== null && input2Value !== null) ) {
                switch (gate.type) {
                    case 'AND':
                        gate.output = input1Value && input2Value;
                        break;
                    case 'OR':
                        gate.output = input1Value || input2Value;
                        break;
                    case 'NOT':
                        gate.output = !input1Value;
                        break;
                }
                c = 0;
            }
        });
        if (breakNeeded) {
            break
        }
    }

    
    const outputGate = gates.find(g => g.id === 2)
    let result = outputGate.output;
    outputValueSpan.textContent = result ? 'ON' : 'OFF';
}

function getInputValue(input) {
    if (!input) return false;
    if (input.type === 'input1') return input1;
    if (input.type === 'input2') return input2;
    if (input.type === 'gate') return gates[input.index].output;
    return false;
}

function clearCircuit() {
    gates = [{id: 0, inputs: [], type: "input1", output: false}, {id: 1, inputs: [], type: "input2", output: false}, {id: 2, type: "output", inputs: [null], output: null}]
    input1 = false;
    input2 = false;
    displayGates(gates)
    calculateOutput()
}