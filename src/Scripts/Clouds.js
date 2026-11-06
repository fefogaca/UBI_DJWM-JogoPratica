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
    }
}
