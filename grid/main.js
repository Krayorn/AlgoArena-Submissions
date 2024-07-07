const gridContainer = document.getElementById('grid');

const data = [
    {
        name: 'meubles'
    },
    {
        name: 'décoration'
    },
    {
        name: 'rangements'
    },
    {
        name: 'lis et matelas'
    },
    {
        name: 'linge de maison et textiles'
    },
    {
        name: 'salle de bain'
    },
    {
        name: 'cuisine et éléctro ménager',
        drillDown: [
            {
                name: 'Solution cuisine équipée'
            },
            {
                name: 'electroménagers',
                drillDown: [
                    {
                        name: "plaques de cuissons"
                    },
                    {
                        name: "refrigirateurs"
                    },
                ]
            },
            {
                name: 'mitigeurs et eviers de cuisine'
            },
        ]
    },
]

function deeper(elem, container) {
    const gridElem = document.createElement('div');
    gridElem.classList = 'grid_item';
    gridElem.textContent = elem.name;
    container.appendChild(gridElem);

    const subGrid = document.createElement('div');
    subGrid.id = container.id + '-' + elem.name
    subGrid.classList = 'hidden grid'
    document.body.appendChild(subGrid);

    elem.drillDown?.forEach(child => {
        deeper(child, subGrid)
    })

    gridElem.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        console.log('yeassss', elem.name)
        const grids = document.querySelectorAll('.grid') 
        grids.forEach(g => g.classList.add('hidden'))
        
        subGrid.classList.remove('hidden')    
    });
}

document.addEventListener('DOMContentLoaded', () => {
    data.forEach(elem => {
       deeper(elem, gridContainer)
    })
});

