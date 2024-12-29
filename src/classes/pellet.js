import { pelletRadius } from '../settings.js';

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

class Pellet {
    constructor({ position, color = 'yellow' }) {
        this.position = position
        this.radius = pelletRadius
        this.color = color
    }
    draw() {
        c.beginPath()
        c.arc(
            this.position.x,
            this.position.y,
            this.radius,
            0,
            Math.PI * 2
        )
        c.fillStyle = this.color
        c.fill()
        c.closePath()
    }
};

export { Pellet };