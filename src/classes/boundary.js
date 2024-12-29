const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

import { boundarySize } from '../settings.js';

class Boundary {
    static width = boundarySize
    static height = boundarySize
    constructor({ position, image}) {
        this.position = position
        this.width = boundarySize
        this.height = boundarySize
        this.image = image
    }
    draw() {
        // c.fillStyle = 'blue'
        // c.fillRect(
        //     this.position.x,
        //     this.position.y,
        //     this.width,
        //     this.height,
        // )
        c.drawImage(
            this.image,
            this.position.x,
            this.position.y
        )
    }
};

export { Boundary };
