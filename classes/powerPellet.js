import { powerPelletRadius } from '../settings.js';

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

class PowerPellet {
    constructor({ position, color = 'peachpuff' }) {
        this.position = position
        this.radius = powerPelletRadius
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

export { PowerPellet };