// src/collisions/collisions.js

import { soundReduce } from '../index.js';
import { Boundary } from '../classes/boundary.js';

// collides between objects
function circleColladesWithRectangle({
    circle,
    rectangle
}) {
    const padding = Boundary.width / 2 - circle.radius - 1
    return (
        circle.position.y - circle.radius + circle.velocity.y
        <=
        rectangle.position.y + rectangle.height + padding
        &&
        circle.position.x + circle.radius + circle.velocity.x
        >=
        rectangle.position.x - padding
        &&
        circle.position.y + circle.radius + circle.velocity.y
        >=
        rectangle.position.y - padding
        &&
        circle.position.x - circle.radius + circle.velocity.x
        <=
        rectangle.position.x + rectangle.width + padding
    )
};
//
// detect collision between ghost & pac-man
function pacmanColladesWithGhost(pacman, ghosts, loseSound, animationId) {
    for (let i = ghosts.length - 1; i >= 0; i--) {
        const ghost = ghosts[i]
        // ghost touches pac-man
        if (Math.hypot(                             // calculates distance between (0,0) and (x,y)
            ghost.position.x - pacman.position.x,
            ghost.position.y - pacman.position.y
        ) < ghost.radius + pacman.radius
        ) {
            if (ghost.scared) {
                ghosts.splice(i, 1);
                scoreCounter += 200;                // 200 pts for every power ghost
                const score = document.getElementById('score')
                score.innerText = scoreCounter
            }
            else {
                isGame = false;
                loseSound.play()                    // sound           
                cancelAnimationFrame(animationId)   // stop animation  
            }
        }
    }
}
//
// pac-man touches pallets
function pacmanColladesWithPellets(pacman, pellets, pluckSound) {
    for (let i = pellets.length - 1; i >= 0; i--) {
        const pellet = pellets[i]

        pellet.draw()
        if (Math.hypot(
            pellet.position.x - pacman.position.x,
            pellet.position.y - pacman.position.y
        )
            <
            pellet.radius + (pacman.radius - pacman.radius / 1.5)) { // distance between pacman & pallet
            pellets.splice(i, 1)
            scoreCounter += 10                              // 10 pts for every pallet
            pluckSound.play()                               // pluck sound
            const score = document.getElementById('score')
            score.innerText = scoreCounter
        }
    }
}
//
// pac-man touches powerPellets
function pacmanColladesWithPowerPellets(pacman, powerPellets, pluckSound, ghosts, sound, duration, volume, loop) {
// function pacmanColladesWithPowerPellets(pacman, powerPellets, pluckSound, ghosts, {soundReduce}) {
    for (let i = powerPellets.length - 1; i >= 0; i--) {
        const powerPellet = powerPellets[i]

        powerPellet.draw()
        if (Math.hypot(
            powerPellet.position.x - pacman.position.x,
            powerPellet.position.y - pacman.position.y
        )
            <
            powerPellet.radius + (pacman.radius - pacman.radius / 1.5)) { // distance between pacman & pallet
            powerPellets.splice(i, 1)
            scoreCounter += 50                                      // 50 pts for every power pallet
            pluckSound.play()                                       // pluck sound
            soundReduce(sound, duration, volume, loop)      // siren sound           
            const score = document.getElementById('score')
            score.innerText = scoreCounter
            // make ghosts scary
            ghosts.forEach(ghost => {
                ghost.scared = true
                setTimeout(() => {
                    ghost.scared = false
                }, duration);
            })
            //
        }
    }
}
export { 
    circleColladesWithRectangle, 
    pacmanColladesWithGhost, 
    pacmanColladesWithPellets, 
    pacmanColladesWithPowerPellets 
};