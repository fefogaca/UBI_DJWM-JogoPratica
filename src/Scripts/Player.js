import { Input } from './Input.js';
import { SceneManager } from './SceneManager.js';

export class Player {
    #playerRb;
    #horizontal = 0;
    #grounded;
    #canDoubleJump;
    #jumpPressed = false;
    #lifeImages = [];
    movementSpeed = 3;
    jumpPower = 40;
    lives = 3;
    
    constructor(object) {
        this.object = object;
        this.object.userData.script = this;
    }

    start() {
        this.#playerRb = this.object.userData.rigidBody;

        if (!this.#playerRb) {
            throw new Error('O Player precisa de um Rigidbody antes de iniciar o script.');
        }

        this.#grounded = true;
        this.#canDoubleJump = false;
        this.#lifeImages = [...document.querySelectorAll('#lives .life')];
        this.#playerRb.lockRotations(true, true);
        this.#playerRb.setRotation(0, true);
    }

    update() {
        this.#horizontal = Input.getAxis('Horizontal');
    
        const jump = Input.getButton('Jump');
        if (jump && !this.#jumpPressed) {
            if (this.#grounded) {
                this.#playerRb.applyImpulse({ x: 0, y: this.jumpPower }, true);
                this.#canDoubleJump = true;
                this.#grounded = false;
            } else if (this.#canDoubleJump) {
                this.#canDoubleJump = false;
                this.#playerRb.setLinvel({ x: this.#playerRb.linvel().x, y: 0 }, true);
                this.#playerRb.applyImpulse({ x: 0, y: this.jumpPower / 1.75 }, true);
            }
        }
        this.#jumpPressed = jump;
    }

    fixedUpdate() {
        this.#handleMovement();
    }
    
    onCollisionEnter(other) {
        if (other.userData.tag === 'platform') {
            this.#grounded = true;
            this.#canDoubleJump = false;
        }

        if (other.userData.tag === 'limit') {
            this.#perderVida();
        }
    }

    #perderVida() {
        this.lives -= 1;
        const imagem = this.#lifeImages[this.lives];
        if (imagem) imagem.hidden = true;

        if (this.lives === 0) {
            SceneManager.loadScene('gameover');
            return;
        }

        this.#playerRb.setTranslation({ x: 0, y: 0 }, true);
        this.#playerRb.setLinvel({ x: 0, y: 0 }, true);
        this.#playerRb.setRotation(0, true);
        this.#grounded = true;
        this.#canDoubleJump = false;
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
