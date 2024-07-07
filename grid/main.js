const gridContainer = document.getElementById('grid');

const data = [
    {
        name: 'Rock',
        drillDown: [
            {
                name: 'The Beatles',
                drillDown: [
                    {
                        name: 'Abbey Road',
                        releaseDate: '1969',
                        drillDown: ['Come Together', 'Something', 'Here Comes the Sun']
                    },
                    {
                        name: 'Sgt. Pepper\'s Lonely Hearts Club Band',
                        releaseDate: '1967',
                        drillDown: ['Lucy in the Sky with Diamonds', 'With a Little Help from My Friends']
                    }
                ]
            },
            {
                name: 'Led Zeppelin',
                drillDown: [
                    {
                        name: 'Led Zeppelin IV',
                        releaseDate: '1971',
                        drillDown: ['Stairway to Heaven', 'Black Dog', 'Rock and Roll']
                    },
                    {
                        name: 'Houses of the Holy',
                        releaseDate: '1973',
                        drillDown: ['The Song Remains the Same', 'No Quarter']
                    }
                ]
            }
        ]
    },
    {
        name: 'Pop',
        drillDown: [
            {
                name: 'Michael Jackson',
                drillDown: [
                    {
                        name: 'Thriller',
                        releaseDate: '1982',
                        drillDown: ['Thriller', 'Billie Jean', 'Beat It']
                    },
                    {
                        name: 'Bad',
                        releaseDate: '1987',
                        drillDown: ['Bad', 'Smooth Criminal', 'Man in the Mirror']
                    }
                ]
            },
            {
                name: 'Madonna',
                drillDown: [
                    {
                        name: 'Like a Virgin',
                        releaseDate: '1984',
                        drillDown: ['Like a Virgin', 'Material Girl']
                    },
                    {
                        name: 'Ray of Light',
                        releaseDate: '1998',
                        drillDown: ['Ray of Light', 'Frozen']
                    }
                ]
            }
        ]
    },
    {
        name: 'Classical',
        drillDown: [
            {
                name: 'Ludwig van Beethoven',
                drillDown: [
                    {
                        name: 'Symphony No. 9',
                        releaseDate: '1824',
                        drillDown: ['Ode to Joy']
                    },
                    {
                        name: 'Symphony No. 5',
                        releaseDate: '1808',
                        drillDown: ['Allegro con brio']
                    }
                ]
            },
            {
                name: 'Wolfgang Amadeus Mozart',
                drillDown: [
                    {
                        name: 'Requiem',
                        releaseDate: '1791',
                        drillDown: ['Lacrimosa']
                    },
                    {
                        name: 'The Magic Flute',
                        releaseDate: '1791',
                        drillDown: ['Queen of the Night Aria']
                    }
                ]
            }
        ]
    },
    {
        name: 'Jazz',
        drillDown: [
            {
                name: 'Miles Davis',
                drillDown: [
                    {
                        name: 'Kind of Blue',
                        releaseDate: '1959',
                        drillDown: ['So What', 'Freddie Freeloader']
                    },
                    {
                        name: 'Bitches Brew',
                        releaseDate: '1970',
                        drillDown: ['Pharaoh\'s Dance', 'Bitches Brew']
                    }
                ]
            },
            {
                name: 'John Coltrane',
                drillDown: [
                    {
                        name: 'A Love Supreme',
                        releaseDate: '1965',
                        drillDown: ['Acknowledgement', 'Resolution']
                    },
                    {
                        name: 'Blue Train',
                        releaseDate: '1958',
                        drillDown: ['Blue Train', 'Moment\'s Notice']
                    }
                ]
            }
        ]
    },
    {
        name: 'Hip-Hop',
        drillDown: [
            {
                name: 'Tupac Shakur',
                drillDown: [
                    {
                        name: 'All Eyez on Me',
                        releaseDate: '1996',
                        drillDown: ['California Love', '2 of Amerikaz Most Wanted']
                    },
                    {
                        name: 'Me Against the World',
                        releaseDate: '1995',
                        drillDown: ['Dear Mama', 'So Many Tears']
                    }
                ]
            },
            {
                name: 'The Notorious B.I.G.',
                drillDown: [
                    {
                        name: 'Ready to Die',
                        releaseDate: '1994',
                        drillDown: ['Juicy', 'Big Poppa']
                    },
                    {
                        name: 'Life After Death',
                        releaseDate: '1997',
                        drillDown: ['Hypnotize', 'Mo Money Mo Problems']
                    }
                ]
            }
        ]
    },
    {
        name: 'Country',
        drillDown: [
            {
                name: 'Johnny Cash',
                drillDown: [
                    {
                        name: 'At Folsom Prison',
                        releaseDate: '1968',
                        drillDown: ['Folsom Prison Blues', 'I Still Miss Someone']
                    },
                    {
                        name: 'American IV: The Man Comes Around',
                        releaseDate: '2002',
                        drillDown: ['Hurt', 'Personal Jesus']
                    }
                ]
            },
            {
                name: 'Dolly Parton',
                drillDown: [
                    {
                        name: 'Jolene',
                        releaseDate: '1974',
                        drillDown: ['Jolene', 'I Will Always Love You']
                    },
                    {
                        name: 'Coat of Many Colors',
                        releaseDate: '1971',
                        drillDown: ['Coat of Many Colors', 'Traveling Man']
                    }
                ]
            }
        ]
    },
    {
        name: 'Electronic',
        drillDown: [
            {
                name: 'Daft Punk',
                drillDown: [
                    {
                        name: 'Random Access Memories',
                        releaseDate: '2013',
                        drillDown: ['Get Lucky', 'Instant Crush']
                    },
                    {
                        name: 'Discovery',
                        releaseDate: '2001',
                        drillDown: ['One More Time', 'Digital Love']
                    }
                ]
            },
            {
                name: 'Deadmau5',
                drillDown: [
                    {
                        name: 'For Lack of a Better Name',
                        releaseDate: '2009',
                        drillDown: ['Ghosts \'n\' Stuff', 'Strobe']
                    },
                    {
                        name: 'Album name Goes Here',
                        releaseDate: '2012',
                        drillDown: ['Professional Griefers', 'The Veldt']
                    }
                ]
            }
        ]
    },
    {
        name: 'Reggae',
        drillDown: [
            {
                name: 'Bob Marley',
                drillDown: [
                    {
                        name: 'Legend',
                        releaseDate: '1984',
                        drillDown: ['No Woman, No Cry', 'Three Little Birds']
                    },
                    {
                        name: 'Exodus',
                        releaseDate: '1977',
                        drillDown: ['Jamming', 'One Love']
                    }
                ]
            },
            {
                name: 'Peter Tosh',
                drillDown: [
                    {
                        name: 'Legalize It',
                        releaseDate: '1976',
                        drillDown: ['Legalize It', 'Why Must I Cry']
                    },
                    {
                        name: 'Bush Doctor',
                        releaseDate: '1978',
                        drillDown: ['Bush Doctor', 'I\'m the Toughest']
                    }
                ]
            }
        ]
    },
    {
        name: 'Blues',
        drillDown: [
            {
                name: 'B.B. King',
                drillDown: [
                    {
                        name: 'Live at the Regal',
                        releaseDate: '1965',
                        drillDown: ['Every Day I Have the Blues', 'Sweet Little Angel']
                    },
                    {
                        name: 'Riding with the King',
                        releaseDate: '2000',
                        drillDown: ['Riding with the King', 'Ten Long Years']
                    }
                ]
            },
            {
                name: 'Muddy Waters',
                drillDown: [
                    {
                        name: 'Hard Again',
                        releaseDate: '1977',
                        drillDown: ['Mannish Boy', 'I Want to Be Loved']
                    },
                    {
                        name: 'Folk Singer',
                        releaseDate: '1964',
                        drillDown: ['Good Morning Little School Girl', 'My Captain']
                    }
                ]
            }
        ]
    },
    {
        name: 'Metal',
        drillDown: [
            {
                name: 'Metallica',
                drillDown: [
                    {
                        name: 'Master of Puppets',
                        releaseDate: '1986',
                        drillDown: ['Battery', 'Master of Puppets']
                    },
                    {
                        name: 'Ride the Lightning',
                        releaseDate: '1984',
                        drillDown: ['Fade to Black', 'Creeping Death']
                    }
                ]
            },
            {
                name: 'Iron Maiden',
                drillDown: [
                    {
                        name: 'The Number of the Beast',
                        releaseDate: '1982',
                        drillDown: ['Run to the Hills', 'Hallowed Be Thy Name']
                    },
                    {
                        name: 'Powerslave',
                        releaseDate: '1984',
                        drillDown: ['Aces High', '2 Minutes to Midnight']
                    }
                ]
            }
        ]
    },
    {
        name: 'Indie',
        drillDown: [
            {
                name: 'Arctic Monkeys',
                drillDown: [
                    {
                        name: 'AM',
                        releaseDate: '2013',
                        drillDown: ['Do I Wanna Know?', 'R U Mine?']
                    },
                    {
                        name: 'Whatever People Say I Am, That\'s What I\'m Not',
                        releaseDate: '2006',
                        drillDown: ['I Bet You Look Good on the Dancefloor', 'When the Sun Goes Down']
                    }
                ]
            },
            {
                name: 'The Strokes',
                drillDown: [
                    {
                        name: 'Is This It',
                        releaseDate: '2001',
                        drillDown: ['Last Nite', 'Someday']
                    },
                    {
                        name: 'Room on Fire',
                        releaseDate: '2003',
                        drillDown: ['Reptilia', '12:51']
                    }
                ]
            }
        ]
    },
    {
        name: 'R&B',
        drillDown: [
            {
                name: 'Beyoncé',
                drillDown: [
                    {
                        name: 'Lemonade',
                        releaseDate: '2016',
                        drillDown: ['Formation', 'Hold Up']
                    },
                    {
                        name: 'Dangerously in Love',
                        releaseDate: '2003',
                        drillDown: ['Crazy in Love', 'Baby Boy']
                    }
                ]
            },
            {
                name: 'Usher',
                drillDown: [
                    {
                        name: 'Confessions',
                        releaseDate: '2004',
                        drillDown: ['Yeah!', 'Burn']
                    },
                    {
                        name: '8701',
                        releaseDate: '2001',
                        drillDown: ['U Got It Bad', 'U Remind Me']
                    }
                ]
            }
        ]
    },
    {
        name: 'Soul',
        drillDown: [
            {
                name: 'Aretha Franklin',
                drillDown: [
                    {
                        name: 'I Never Loved a Man the Way I Love You',
                        releaseDate: '1967',
                        drillDown: ['Respect', 'Do Right Woman, Do Right Man']
                    },
                    {
                        name: 'Lady Soul',
                        releaseDate: '1968',
                        drillDown: ['(You Make Me Feel Like) A Natural Woman', 'Chain of Fools']
                    }
                ]
            },
            {
                name: 'Marvin Gaye',
                drillDown: [
                    {
                        name: 'What\'s Going On',
                        releaseDate: '1971',
                        drillDown: ['What\'s Going On', 'Mercy Mercy Me']
                    },
                    {
                        name: 'Let\'s Get It On',
                        releaseDate: '1973',
                        drillDown: ['Let\'s Get It On', 'Distant Lover']
                    }
                ]
            }
        ]
    },
    {
        name: 'Funk',
        drillDown: [
            {
                name: 'James Brown',
                drillDown: [
                    {
                        name: 'Live at the Apollo',
                        releaseDate: '1963',
                        drillDown: ['I Got You (I Feel Good)', 'Please, Please, Please']
                    },
                    {
                        name: 'Sex Machine',
                        releaseDate: '1970',
                        drillDown: ['Get Up (I Feel Like Being a) Sex Machine', 'Super Bad']
                    }
                ]
            },
            {
                name: 'Parliament-Funkadelic',
                drillDown: [
                    {
                        name: 'Mothership Connection',
                        releaseDate: '1975',
                        drillDown: ['Give Up the Funk', 'Mothership Connection (Star Child)']
                    },
                    {
                        name: 'One Nation Under a Groove',
                        releaseDate: '1978',
                        drillDown: ['One Nation Under a Groove', 'Groovallegiance']
                    }
                ]
            }
        ]
    },
    {
        name: 'Punk',
        drillDown: [
            {
                name: 'The Ramones',
                drillDown: [
                    {
                        name: 'Ramones',
                        releaseDate: '1976',
                        drillDown: ['Blitzkrieg Bop', 'Judy Is a Punk']
                    },
                    {
                        name: 'Rocket to Russia',
                        releaseDate: '1977',
                        drillDown: ['Sheena Is a Punk Rocker', 'Teenage Lobotomy']
                    }
                ]
            },
            {
                name: 'The Clash',
                drillDown: [
                    {
                        name: 'London Calling',
                        releaseDate: '1979',
                        drillDown: ['London Calling', 'Train in Vain']
                    },
                    {
                        name: 'Combat Rock',
                        releaseDate: '1982',
                        drillDown: ['Should I Stay or Should I Go', 'Rock the Casbah']
                    }
                ]
            }
        ]
    },
    {
        name: 'Folk',
        drillDown: [
            {
                name: 'Bob Dylan',
                drillDown: [
                    {
                        name: 'The Freewheelin\' Bob Dylan',
                        releaseDate: '1963',
                        drillDown: ['Blowin\' in the Wind', 'A Hard Rain\'s a-Gonna Fall']
                    },
                    {
                        name: 'Highway 61 Revisited',
                        releaseDate: '1965',
                        drillDown: ['Like a Rolling Stone', 'Desolation Row']
                    }
                ]
            },
            {
                name: 'Joni Mitchell',
                drillDown: [
                    {
                        name: 'Blue',
                        releaseDate: '1971',
                        drillDown: ['A Case of You', 'River']
                    },
                    {
                        name: 'Court and Spark',
                        releaseDate: '1974',
                        drillDown: ['Help Me', 'Free Man in Paris']
                    }
                ]
            }
        ]
    }
];

const stringToColour = (str) => {
    let hash = 0;
    str.split('').forEach(char => {
      hash = char.charCodeAt(0) + ((hash << 5) - hash)
    })
    let colour = '#'
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff
      colour += value.toString(16).padStart(2, '0')
    }
    return colour
  }

function deeper(elem, container, color) {
    const gridElem = document.createElement('div');
    gridElem.classList = 'grid_item';
    gridElem.textContent = elem.name ? elem.name : elem;
    gridElem.style.backgroundColor = color;
    container.appendChild(gridElem);

    const subGrid = document.createElement('div');
    subGrid.id = container.id + '-' + elem.name
    subGrid.classList = 'hidden grid'
    gridElem.appendChild(subGrid);

    elem.drillDown?.forEach(child => {
        deeper(child, subGrid, stringToColour(container.id + '-' + elem.name))
    })

    gridElem.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        console.log('yeassss', elem.name)
        gridElem.classList.add('active')
        subGrid.classList.remove('hidden')
    });
}

document.addEventListener('DOMContentLoaded', () => {
    data.forEach(elem => {
       deeper(elem, gridContainer, 'white')
    })
});

