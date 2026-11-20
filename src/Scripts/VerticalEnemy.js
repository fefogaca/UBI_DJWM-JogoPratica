import * as THREE from 'three';

// igual ao Enemy mas sobe e desce entre o checkpoint1 (baixo) e o checkpoint2 (cima)
export class VerticalEnemy {
    checkpoint1 = null;
    checkpoint2 = null;
    speed = 2;
    isMovingUp = true;

    constructor(object) {
        this.object = object;
        this.object.userData.script = this;
    }

    start() {
        if (this.#positionY(this.checkpoint1) > this.#positionY(this.checkpoint2)) {
            const aux = this.checkpoint2;
            this.checkpoint2 = this.checkpoint1;
            this.checkpoint1 = aux;
        }
    }

    fixedUpdate(dt) {
        if (this.isMovingUp && this.object.position.y > this.#positionY(this.checkpoint2)) {
            this.isMovingUp = false;
        } else if (!this.isMovingUp && this.object.position.y < this.#positionY(this.checkpoint1)) {
            this.isMovingUp = true;
        }

        const direction = this.isMovingUp ? 1 : -1;
        this.object.position.y += direction * this.speed * dt;

        this.object.userData.rigidBody?.setNextKinematicTranslation({
            x: this.object.position.x,
            y: this.object.position.y,
        });
    }

    #positionY(checkpoint) {
        return checkpoint.getWorldPosition(new THREE.Vector3()).y;
    }
}
