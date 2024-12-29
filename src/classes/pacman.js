import { pacmanRadius } from '../settings.js';

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

class Pacman {
    constructor({ position, velocity, speed = 1, color = 'yellow' }) {
        this.position = position
        this.velocity = velocity
        this.speed = speed  
        this.radius = pacmanRadius
        this.color = color
        this.radians = 0.75
        this.openRate = 0.05
        this.rotation = 0
        this.isHorizontal = false;
    }
    draw() {

// body
        c.save();                                           // save the current state of the context 

        c.translate(this.position.x, this.position.y);
        if (this.isHorizontal) {                            // using scale only for horizontal pacman rotate 
            c.scale(-1, 1); 
        } else {                                            // using rotate for pacman rotate 
            c.rotate(this.rotation); 
        }
        c.translate(-this.position.x, -this.position.y);
        
        c.beginPath()
        c.arc(
            this.position.x,
            this.position.y,
            this.radius,
            this.radians,
            Math.PI * 2 - this.radians
        )
        c.lineTo(this.position.x, this.position.y)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
          
// eye

        c.beginPath() 
        c.arc( 
            this.position.x,                                // eye position left - right
            this.position.y - this.radius / 2,              // eye position up - dawn
            this.radius / 8,                                // eye size 
            0, 
            Math.PI * 2 
        ) 
            c.fillStyle = 'black' 
            c.fill() 
            c.closePath()
            c.restore();                                    // restore the context state       
    }

    pacmanRotation() {
        if (this.velocity.x > 0) {
            this.rotation = 0;
            this.isHorizontal = false;
        }
        else if (this.velocity.x < 0) {
            // this.rotation = Math.PI; 
            this.isHorizontal = true;
        }
        else if (this.velocity.y > 0) {
            this.rotation = Math.PI / 2;
            this.isHorizontal = false;
        }
        else if (this.velocity.y < 0) {
            this.rotation = Math.PI * 1.5;
            this.isHorizontal = false;
        }
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x * this.speed
        this.position.y += this.velocity.y * this.speed
        // mouth animation
        if(this.radians < 0 || this.radians > 0.75) {
            this.openRate = -this.openRate
        }
        this.radians += this.openRate
    }
};


export { Pacman };