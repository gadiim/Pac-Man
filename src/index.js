import { Boundary } from './classes/boundary.js';
import { Pacman } from './classes/pacman.js';
import { Ghost } from './classes/ghost.js';
import { Pellet } from './classes/pellet.js';
import { PowerPellet } from './classes/powerPellet.js';
import {
    boundarySize,
    pacmanVelocity,
    ghostVelocity,
    powerEffectDuration
} from './settings.js';
import {
    pacmanStartPositionX,
    pacmanStartPositionY,
    rightWarpTunnelPositionX,
    rightWarpTunnelPositionY,
    leftWarpTunnelPositionX,
    leftWarpTunnelPositionY,
    map
} from './maze/mapOrigin.js';
import { 
    keys,
    handleKeyDown, 
    handleKeyUp
} from './keyboard/inputHandlers.js';
import { 
    circleColladesWithRectangle, 
    // pacmanColladesWithGhost, 
    pacmanColladesWithPellets, 
    pacmanColladesWithPowerPellets
} from './collisions/collisions.js';

const beginBeepSound = new Audio('./assets/sounds/begin-beep.wav');
const pluckSound = new Audio('./assets/sounds/pluck.wav');
const siren = new Audio('./assets/sounds/siren.mp3');
const winSound = new Audio('./assets/sounds/win.mp3');
const loseSound = new Audio('./assets/sounds/lose.mp3');

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

export let isGame = true;               // game state
export let isPaused = false;            // game state
export let isGameOver = false;          // game state

let animationId;
let lastKey = '';
let scoreCounter = 0;

const boundaries = [];
const pellets = [];
const powerPellets = [];


function drawGameMessage(message) {
    c.font = '48px Arial';                                      // text style
    c.fillStyle = 'yellow';                                     // color
    c.textAlign = 'center';                                     // position
    c.fillText(message, canvas.width / 4, canvas.height / 2);   // text display
}

// const keys = {
//     w: {
//         pressed: false
//     },
//     a: {
//         pressed: false
//     },
//     s: {
//         pressed: false
//     },
//     d: {
//         pressed: false
//     },
// };

function createImage(source) {
    const image = new Image()
    image.src = source
    return image
};

function pushBoundary(i, j, source) {
    boundaries.push(
        new Boundary({
            position: {
                x: Boundary.width * j,
                y: Boundary.height * i
            },
            image: createImage(source)
        })
    )
};

// create maze
map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        switch (symbol) {
            case '.':
                pellets.push(
                    new Pellet({
                        position: {
                            x: boundarySize * j + boundarySize / 2,
                            y: boundarySize * i + boundarySize / 2
                        }
                    })
                )
                break
            case 'p':
                powerPellets.push(
                    new PowerPellet({
                        position: {
                            x: boundarySize * j + boundarySize / 2,
                            y: boundarySize * i + boundarySize / 2
                        }
                    })
                )
                break
            case '-':
                pushBoundary(i, j, './assets/img/boundary/pipeHorizontal.png')
                // boundaries.push(
                //     new Boundary({
                //         position: {
                //             x: Boundary.width * j,
                //             y: Boundary.height * i
                //         },
                //         image: createImage('./assets/img/boundary/pipeHorizontal.png')
                //     })
                // )
                break
            case '|':
                pushBoundary(i, j, './assets/img/boundary/pipeVertical.png')
                break
            case '+':
                pushBoundary(i, j, './assets/img/boundary/pipeCross.png')
                break
            case '1':
                pushBoundary(i, j, './assets/img/boundary/pipeCorner1.png')
                break
            case '2':
                pushBoundary(i, j, './assets/img/boundary/pipeCorner2.png')
                break
            case '3':
                pushBoundary(i, j, './assets/img/boundary/pipeCorner3.png')
                break
            case '4':
                pushBoundary(i, j, './assets/img/boundary/pipeCorner4.png')
                break
            case 'capB':
                pushBoundary(i, j, './assets/img/boundary/capBottom.png')
                break
            case 'capT':
                pushBoundary(i, j, './assets/img/boundary/capTop.png')
                break
            case 'capR':
                pushBoundary(i, j, './assets/img/boundary/capRight.png')
                break
            case 'capL':
                pushBoundary(i, j, './assets/img/boundary/capLeft.png')
                break
            case 'conB':
                pushBoundary(i, j, './assets/img/boundary/pipeConnectorBottom.png')
                break
            case 'conT':
                pushBoundary(i, j, './assets/img/boundary/pipeConnectorTop.png')
                break
            case 'conR':
                pushBoundary(i, j, './assets/img/boundary/pipeConnectorRight.png')
                break
            case 'conL':
                pushBoundary(i, j, './assets/img/boundary/pipeConnectorLeft.png')
                break
        }
    })
});
//

// create pac-man
const pacman = new Pacman({
    position: {
        x: boundarySize * pacmanStartPositionX + boundarySize / 2, // point of emergence (attention to the map size) 
        y: boundarySize * pacmanStartPositionY + boundarySize / 2  // point of emergence (attention to the map size)
    },
    velocity: {
        x: 0,
        y: 0
    }
});
//

// create ghosts
const ghosts = [
    new Ghost({
        position: {
            x: boundarySize * 11 + boundarySize / 2,    // point of emergence (attention to the map size) 
            y: boundarySize * 8 + boundarySize / 2      // point of emergence (attention to the map size)
        },
        velocity: {
            x: ghostVelocity,
            y: 0
        },
        color: 'red'
    }),
    new Ghost({
        position: {
            x: boundarySize * 9 + boundarySize / 2,    // point of emergence (attention to the map size) 
            y: boundarySize * 10 + boundarySize / 2     // point of emergence (attention to the map size)
        },
        velocity: {
            x: ghostVelocity,
            y: 0
        },
        color: 'pink'
    }),
    new Ghost({
        position: {
            x: boundarySize * 11 + boundarySize / 2,    // point of emergence (attention to the map size) 
            y: boundarySize * 10 + boundarySize / 2     // point of emergence (attention to the map size)
        },
        velocity: {
            x: ghostVelocity,
            y: 0
        },
        color: 'lightblue'
    }),
    new Ghost({
        position: {
            x: boundarySize * 12 + boundarySize / 2,    // point of emergence (attention to the map size) 
            y: boundarySize * 10 + boundarySize / 2     // point of emergence (attention to the map size)
        },
        velocity: {
            x: ghostVelocity,
            y: 0
        },
        color: 'orange'
    }),
    new Ghost({
        position: {
            x: boundarySize * 12 + boundarySize / 2,    // point of emergence (attention to the map size) 
            y: boundarySize * 10 + boundarySize / 2     // point of emergence (attention to the map size)
        },
        velocity: {
            x: ghostVelocity,
            y: 0
        },
        color: 'green'
    }),
    new Ghost({
        position: {
            x: boundarySize * 12 + boundarySize / 2, // point of emergence (attention to the map size) 
            y: boundarySize * 10 + boundarySize / 2  // point of emergence (attention to the map size)
        },
        velocity: {
            x: ghostVelocity,
            y: 0
        },
        color: 'purple'
    })

];
//

// collides between objects
// function circleColladesWithRectangle({
//     circle,
//     rectangle
// }) {
//     const padding = Boundary.width / 2 - circle.radius - 1
//     return (
//         circle.position.y - circle.radius + circle.velocity.y
//         <=
//         rectangle.position.y + rectangle.height + padding
//         &&
//         circle.position.x + circle.radius + circle.velocity.x
//         >=
//         rectangle.position.x - padding
//         &&
//         circle.position.y + circle.radius + circle.velocity.y
//         >=
//         rectangle.position.y - padding
//         &&
//         circle.position.x - circle.radius + circle.velocity.x
//         <=
//         rectangle.position.x + rectangle.width + padding
//     )
// };
//

// warpTunnel position and actions
function warpTunnel({ unit, rightPosition, leftPosition }) {
    let wrapActive = true;

    if (
        // startPosition 
        wrapActive &&
        // Math.abs(unit.position.x - startPosition.x) < unit.radius &&
        // Math.abs(unit.position.y - startPosition.y) < unit.radius
        unit.position.x === rightPosition.x &&
        unit.position.y === rightPosition.y
    ) {
        // teleport
        unit.position.x = leftPosition.x;
        unit.position.y = leftPosition.y;
        wrapActive = false;
        if (unit.position.x !== leftPosition.x &&
            unit.position.y !== leftPosition.y
        ) {
            wrapActive = true;
        }
    };
    if (
        wrapActive &&
        unit.position.x === leftPosition.x &&
        unit.position.y === leftPosition.y
    ) {
        unit.position.x = rightPosition.x;
        unit.position.y = rightPosition.y;
        wrapActive = false;
        if (unit.position.x !== rightPosition.x &&
            unit.position.y !== rightPosition.y
        ) {
            wrapActive = true;
        }
    }
}
//
export function soundReduce(sound, duration, volume, loop) {   // for sound effects
    sound.currentTime = 0;                              // start playing from the beginning
    sound.volume = volume;                              // sound volume | 0 - 1
    sound.loop = loop;                                  // sound is played loop | true / false
    sound.play().then(() => {
        return setTimeout(() => {
            sound.pause();                              // pause playback after
        }, duration);                                   // duration milsec
    })
}

function soundLoop(sound, volume) {                     // for endless music theme
    sound.play();                                       // sound play
    sound.volume = volume;                              // sound volume | 0 - 1 
    sound.loop = false;                                 // ensure the music does not loop automatically
    sound.addEventListener('ended', () => {
        sound.currentTime = 0;                          // reset to the start
        sound.play();                                   // sound play again
    })
};

function animate() {

    animationId = requestAnimationFrame(animate);

    c.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    )

    if (keys.w.pressed && lastKey === 'w') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                circleColladesWithRectangle({
                    circle: {
                        ...pacman,
                        velocity: {
                            x: 0,
                            y: -pacmanVelocity
                        }
                    },
                    rectangle: boundary
                })
            ) {
                pacman.velocity.y = 0
                break
            }
            else {
                pacman.velocity.y = -pacmanVelocity
            }
        }
    }
    else if (keys.a.pressed && lastKey === 'a') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                circleColladesWithRectangle({
                    circle: {
                        ...pacman,
                        velocity: {
                            x: -pacmanVelocity,
                            y: 0
                        }
                    },
                    rectangle: boundary
                })
            ) {
                pacman.velocity.x = 0
                break
            }
            else {
                pacman.velocity.x = -pacmanVelocity
            }
        }
    }
    else if (keys.s.pressed && lastKey === 's') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                circleColladesWithRectangle({
                    circle: {
                        ...pacman,
                        velocity: {
                            x: 0,
                            y: pacmanVelocity
                        }
                    },
                    rectangle: boundary
                })
            ) {
                pacman.velocity.y = 0
                break
            }
            else {
                pacman.velocity.y = pacmanVelocity
            }
        }
    }
    else if (keys.d.pressed && lastKey === 'd') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (
                circleColladesWithRectangle({
                    circle: {
                        ...pacman,
                        velocity: {
                            x: pacmanVelocity,
                            y: 0
                        }
                    },
                    rectangle: boundary
                })
            ) {
                pacman.velocity.x = 0
                break
            }
            else {
                pacman.velocity.x = pacmanVelocity
            }
        }
    }
    // pac-man touches pallets
    pacmanColladesWithPellets(pacman, pellets, pluckSound);
    // for (let i = pellets.length - 1; i >= 0; i--) {
    //     const pellet = pellets[i]

    //     pellet.draw()
    //     if (Math.hypot(
    //         pellet.position.x - pacman.position.x,
    //         pellet.position.y - pacman.position.y
    //     )
    //         <
    //         pellet.radius + (pacman.radius - pacman.radius / 1.5)) { // distance between pacman & pallet
    //         pellets.splice(i, 1)
    //         scoreCounter += 10                              // 10 pts for every pallet
    //         pluckSound.play()                               // pluck sound
    //         const score = document.getElementById('score')
    //         score.innerText = scoreCounter
    //     }
    // }
    //

    // pac-man touches powerPellets
    pacmanColladesWithPowerPellets(pacman, powerPellets, pluckSound, ghosts, siren, powerEffectDuration, 0.5, true);
    // for (let i = powerPellets.length - 1; i >= 0; i--) {
    //     const powerPellet = powerPellets[i]

    //     powerPellet.draw()
    //     if (Math.hypot(
    //         powerPellet.position.x - pacman.position.x,
    //         powerPellet.position.y - pacman.position.y
    //     )
    //         <
    //         powerPellet.radius + (pacman.radius - pacman.radius / 1.5)) { // distance between pacman & pallet
    //         powerPellets.splice(i, 1)
    //         scoreCounter += 50                                      // 50 pts for every power pallet
    //         pluckSound.play()                                       // pluck sound
    //         soundReduce(siren, powerEffectDuration, 0.5, true)      // siren sound           
    //         const score = document.getElementById('score')
    //         score.innerText = scoreCounter
    //         // make ghosts scary
    //         ghosts.forEach(ghost => {
    //             ghost.scared = true
    //             setTimeout(() => {
    //                 ghost.scared = false
    //             }, powerEffectDuration);
    //         })
    //         //
    //     }
    // }
    //
    // detect collision between ghost & pac-man
    pacmanColladesWithGhost(pacman, ghosts, loseSound, animationId);
    // for (let i = ghosts.length - 1; i >= 0; i--) {
    //     const ghost = ghosts[i]
    //     // ghost touches pac-man
    //     if (Math.hypot(                             // calculates distance between (0,0) and (x,y)
    //         ghost.position.x - pacman.position.x,
    //         ghost.position.y - pacman.position.y
    //     ) < ghost.radius + pacman.radius
    //     ) {
    //         if (ghost.scared) {
    //             ghosts.splice(i, 1);
    //             scoreCounter += 200;                // 200 pts for every power ghost
    //             const score = document.getElementById('score')
    //             score.innerText = scoreCounter
    //         }
    //         else {
    //             isGame = false;
    //             loseSound.play()                    // sound           
    //             cancelAnimationFrame(animationId)   // stop animation  
    //         }
    //     }
    // }
    //
    if (!isGame) return;
    // draw boundaries
    boundaries.forEach((boundary) => {
        boundary.draw()

        if (
            circleColladesWithRectangle({
                circle: pacman,
                rectangle: boundary
            })
        ) {
            pacman.velocity.x = 0
            pacman.velocity.y = 0
        }
    });
    //
    // update pac-man position
    pacman.update();
    //
    // warpTunnel position and actions for pac-man
    warpTunnel({
        unit: pacman,
        rightPosition: {
            x: boundarySize * rightWarpTunnelPositionX + boundarySize / 2,
            y: boundarySize * rightWarpTunnelPositionY + boundarySize / 2
        },
        leftPosition: {
            x: boundarySize * leftWarpTunnelPositionX + boundarySize / 2,
            y: boundarySize * leftWarpTunnelPositionY + boundarySize / 2
        }
    });
    //
    ghosts.forEach(ghost => {
        // update pac-man position        
        ghost.update();
        //  
        // warpTunnel position and actions for ghost
        warpTunnel({
            unit: ghost,
            rightPosition: {
                x: boundarySize * rightWarpTunnelPositionX + boundarySize / 2,
                y: boundarySize * rightWarpTunnelPositionY + boundarySize / 2
            },
            leftPosition: {
                x: boundarySize * leftWarpTunnelPositionX + boundarySize / 2,
                y: boundarySize * leftWarpTunnelPositionY + boundarySize / 2
            }
        })
        //

        // ghost move direction logic
        const collisions = []
        boundaries.forEach((boundary) => {
            if (
                !collisions.includes('right') &&
                circleColladesWithRectangle({
                    circle: {
                        ...ghost,
                        velocity: {
                            x: ghostVelocity,
                            y: 0
                        }
                    },
                    rectangle: boundary
                })
            ) {
                collisions.push('right')
            }
            if (
                !collisions.includes('left') &&
                circleColladesWithRectangle({
                    circle: {
                        ...ghost,
                        velocity: {
                            x: -ghostVelocity,
                            y: 0
                        }
                    },
                    rectangle: boundary
                })
            ) {
                collisions.push('left')
            }
            if (
                !collisions.includes('up') &&
                circleColladesWithRectangle({
                    circle: {
                        ...ghost,
                        velocity: {
                            x: 0,
                            y: -ghostVelocity
                        }
                    },
                    rectangle: boundary
                })
            ) {
                collisions.push('up')
            }
            if (
                !collisions.includes('down') &&
                circleColladesWithRectangle({
                    circle: {
                        ...ghost,
                        velocity: {
                            x: 0,
                            y: ghostVelocity
                        }
                    },
                    rectangle: boundary
                })
            ) {
                collisions.push('down')
            }
        })

        if (collisions.length > ghost.prevCollisions.length) {
            ghost.prevCollisions = collisions
        }

        if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {

            if (ghost.velocity.x > 0) {
                ghost.prevCollisions.push('right')
            }
            else if (ghost.velocity.x < 0) {
                ghost.prevCollisions.push('left')
            }
            else if (ghost.velocity.y < 0) {
                ghost.prevCollisions.push('up')
            }
            else if (ghost.velocity.y > 0) {
                ghost.prevCollisions.push('down')
            }
            // possible routes
            const pathways = ghost.prevCollisions.filter((collision) => {
                return !collisions.includes(collision)
            })
            //
            // determining direction
            const currentDirection = pathways[Math.floor(Math.random() * pathways.length)]

            switch (currentDirection) {
                case 'right':
                    ghost.velocity.x = ghostVelocity
                    ghost.velocity.y = 0
                    break
                case 'left':
                    ghost.velocity.x = -ghostVelocity
                    ghost.velocity.y = 0
                    break
                case 'up':
                    ghost.velocity.x = 0
                    ghost.velocity.y = -ghostVelocity
                    break
                case 'down':
                    ghost.velocity.x = 0
                    ghost.velocity.y = ghostVelocity
                    break
            };

            ghost.direction = currentDirection;
                        // 
            ghost.prevCollisions = []
        }
    })
    
    // pacman rotation
    pacman.pacmanRotation()
    //

    // win condition
    if (isGame && pellets.length === 0 && powerPellets.length === 0) {
        winSound.play();
        drawGameMessage('Win!!!');
        cancelAnimationFrame(animationId);
    }
    //

    if (!isGame) {
        drawGameMessage('Game Over!!!')
    }

};

animate();

// window.addEventListener('keydown', ({ key }) => {
//     switch (key) {
//         case 'w':
//             keys.w.pressed = true
//             lastKey = 'w'
//             break
//         case 'a':
//             keys.a.pressed = true
//             lastKey = 'a'
//             break
//         case 's':
//             keys.s.pressed = true
//             lastKey = 's'
//             break
//         case 'd':
//             keys.d.pressed = true
//             lastKey = 'd'
//             break
//     }
// });

// window.addEventListener('keyup', ({ key }) => {
//     switch (key) {
//         case 'w':
//             keys.w.pressed = false
//             break
//         case 'a':
//             keys.a.pressed = false
//             break
//         case 's':
//             keys.s.pressed = false
//             break
//         case 'd':
//             keys.d.pressed = false
//             break
//     }
// });

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);

