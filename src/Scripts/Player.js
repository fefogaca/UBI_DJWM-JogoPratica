import { Input } from './Input.js';

export class Player {
    #playerRb;
    #horizontal = 0;

    movementSpeed = 3;

    constructor(object) {
        this.object = object;
    }

    start() {
        this.#playerRb = this.object.userData.rigidBody;

        if (!this.#playerRb) {
            throw new Error('O Player precisa de um Rigidbody antes de iniciar o script.');
        }
    }

    update() {
        this.#horizontal = Input.getAxis('Horizontal');
    }

    fixedUpdate() {
        this.#handleMovement();
    }

    #handleMovement() {
        const velocidadeAtual = this.#playerRb.linvel();
        this.#playerRb.setLinvel(
            {
                x: this.#horizontal * this.movementSpeed,
                y: velocidadeAtual.y,
            },
            true,
        );
    }
}
