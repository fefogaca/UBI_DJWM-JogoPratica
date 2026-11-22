export class Clouds {
    isMovingLeft = false;
    speed = 1;

    constructor(object) {
        this.object = object;
        this.object.userData.script = this;
    }

    fixedUpdate(dt) {
        const direction = this.isMovingLeft ? -1 : 1;
        this.object.position.x += direction * this.speed * dt;

        // quando sai do mapa volta pelo outro lado
        if (this.object.position.x > 20) this.object.position.x = -20;
        else if (this.object.position.x < -20) this.object.position.x = 20;
    }
}
