import { ghostRadius } from '../settings.js';
// import { direction } from '../index.js';

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

class Ghost {
    constructor({ position, velocity, color, direction }) {
        this.position = position
        this.velocity = velocity
        this.direction = direction
        this.radius = ghostRadius
        this.color = color
        this.prevCollisions = []
        this.scared = false
    }

    draw() {

        // eyes position when ghost moving
        let scaleX = { leftEye: 2.5, leftPupil: 2.5, rightEye: 2.5, rightPupil: 2.5 };
        let scaleY = { leftEye: 5, leftPupil: 9, rightEye: 5, rightPupil: 9 };
        if (!this.scared) {
            switch (this.direction) {
                case 'stop':
                    scaleX = { leftEye: 2.5, leftPupil: 2.5, rightEye: 2.5, rightPupil: 2.5 };
                    scaleY = { leftEye: 5, leftPupil: 9, rightEye: 5, rightPupil: 9 };
                    break;
                case 'up':
                    scaleX = { leftEye: 2.5, leftPupil: 2.5, rightEye: 2.5, rightPupil: 2.5 };
                    scaleY = { leftEye: 2.5, leftPupil: 1.75, rightEye: 2.5, rightPupil: 1.75 };                    
                    break;
                case 'down':
                    scaleX = { leftEye: 2.5, leftPupil: 2.5, rightEye: 2.5, rightPupil: 2.5 };
                    scaleY = { leftEye: 7.5, leftPupil: -15, rightEye: 7.5, rightPupil: -15 };
                    break;
                case 'right':
                    scaleX = { leftEye: 3.5, leftPupil: 4.5, rightEye: 2, rightPupil: 1.75 };
                    scaleY = { leftEye: 5, leftPupil: 9, rightEye: 5, rightPupil: 9 };
                    break;
                case 'left':
                    scaleX = { leftEye: 2, leftPupil: 1.75, rightEye: 3.5, rightPupil: 4.5 };
                    scaleY = { leftEye: 5, leftPupil: 9, rightEye: 5, rightPupil: 9 };
                    break;
            }
        }
        
        // body
        c.beginPath()
        c.arc(
            this.position.x,
            this.position.y,
            this.radius,
            0,
            Math.PI * 2
        )
        c.fillStyle = this.scared ? 'blue' : this.color;
        c.fill()
        c.closePath()

        // tentacles
        c.beginPath();
        c.fillRect(
            this.position.x - this.radius,
            this.position.y,
            this.radius * 2,
            this.radius)
        c.fillStyle = this.scared ? 'blue' : this.color;
        c.fill();
        c.closePath();

        // tentacles (wavey bottom)
        c.beginPath();
        const waveCount = 3;                                        // number of tentacles
        const waveWidth = (this.radius * 2) / waveCount;            // tentacle width
        const startY = this.position.y + this.radius;               // upper edge of tentacle
        let currentX = this.position.x - this.radius;               // start position.x


        c.moveTo(currentX, startY);                                 // start of the drawline

        for (let i = 0; i < waveCount; i++) {
            const peakX = currentX + waveWidth / 2;                 // higher edge of tentacle
            const endX = currentX + waveWidth;                      // end of tentacle  
            c.quadraticCurveTo(                                     // draw the top of the tentacle (smooth curve)
                peakX, 
                startY + this.radius / 3, 
                endX, 
                startY);
            currentX = endX;                                        // moving to the next tentacle
        }
        c.closePath();

        c.fillStyle = this.scared ? 'blue' : this.color;
        c.fill();

        // draw left eye
        c.save();                                                   // save the current state of the context 
        c.beginPath();
        c.translate(
            this.position.x - this.radius / scaleX.leftEye,         // eye position left - right 2.5
            this.position.y - this.radius / scaleY.leftEye);        // eye position up - dawn 5 
        c.scale(1.2, 1.7);                                          // pull oval up
        c.arc(                                                      // oval 
            0,
            0,
            this.radius / 4,
            0,
            Math.PI * 2);
        c.fillStyle = this.scared ? 'transparent' : 'white';
        c.fill();
        c.closePath();
        c.restore();                                                // restore the context state

        // draw left eye pupil
        c.beginPath();
        c.arc(
            this.position.x - this.radius / scaleX.leftPupil,       // pupil position left - right 2.5 
            this.position.y - this.radius / scaleY.leftPupil,       // pupil position up - dawn 9
            this.radius / 5,                                        // pupil size 
            0,
            Math.PI * 2);
        c.fillStyle = this.scared ? 'violet' : 'blue';
        c.fill();
        c.closePath();

        // draw right eye
        c.save();                                                   // save the current state of the context 
        c.beginPath();
        c.translate(
            this.position.x + this.radius / scaleX.rightEye,        // eye position left - right
            this.position.y - this.radius / scaleY.rightEye);       // eye position up - dawn  
        c.scale(1.2, 1.7);                                          // pull oval up
        c.arc(                                                      // oval 
            0,
            0,
            this.radius / 4,
            0,
            Math.PI * 2);
        c.fillStyle = this.scared ? 'transparent' : 'white';
        c.fill();
        c.closePath();
        c.restore();                                                // restore the context state

        // draw right eye pupil
        c.beginPath();
        c.arc(
            this.position.x + this.radius / scaleX.rightPupil,      // pupil position left - right 
            this.position.y - this.radius / scaleY.rightPupil,      // pupil position up - dawn 
            this.radius / 5,                                        // pupil size 
            0,
            Math.PI * 2);
        c.fillStyle = this.scared ? 'violet' : 'blue';
        c.fill();
        c.closePath();
        // draw scared mouth (wavey)
        if (this.scared) {
            c.save();                                               // save the current state of the context 
            c.lineWidth = 3;                                        // line width
            c.strokeStyle = "violet";                               // line color
            c.setLineDash([3, 2]);                                  // dash pattern of line: 3 pixels solid line, 2 pixels space.
            c.beginPath();                                          // begim draw line
            c.moveTo(                                               // position begining
                this.position.x - this.radius / 2,
                this.position.y + this.radius / 2);
            c.lineTo(                                               // position ending
                this.position.x + this.radius / 2,
                this.position.y + this.radius / 2);
            c.stroke();                                             // draws an outline
            c.closePath();                                          // begim draw line
            c.restore();                                            // restore the context state
        }
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

    }
};

export { Ghost };