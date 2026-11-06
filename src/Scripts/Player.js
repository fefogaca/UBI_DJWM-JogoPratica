import { Input } from './Input.js';
import { SceneManager } from './SceneManager.js';
import { Time } from './Time.js';

const CORACAO_VAZIO = 'assets/Imagens/Objetos/coracaoVazio.svg';

export class Player {
    #playerRb;
    #horizontal = 0;
    #grounded;
    #canDoubleJump;
    #jumpPressed = false;
    #lastPlatform = null;
    #checkpoint = null;
    movementSpeed = 3;
    jumpPower = 40;
    lives = 3;
    lifeImages = [];

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
        this.#playerRb.lockRotations(true, true);
        this.#playerRb.setRotation(0, true);
    }

    update() {
        const jump = Input.getButton('Jump');

        // em pausa ignora o teclado, senão salta quando o jogo continua
        if (Time.timeScale === 0) {
            this.#horizontal = 0;
            this.#jumpPressed = jump;
            return;
        }

        this.#horizontal = Input.getAxis('Horizontal');

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
            this.#lastPlatform = other;
        } else if (other.userData.tag === 'limit') {
            this.#perderVida();
        }
    }

    onTriggerEnter(other) {
        if (other.userData.tag !== 'checkpoint') return;
        if (this.#checkpoint === other.position) return;

        this.#checkpoint = other.position;
        other.material.color.set(0x9dff9d); // fica verde quando é ativado
    }

    #perderVida() {
        this.lives -= 1;
        const imagem = this.lifeImages[this.lives];
        if (imagem) imagem.src = CORACAO_VAZIO;

        if (this.lives === 0) {
            SceneManager.loadScene('gameover');
            return;
        }

        this.#respawn();
    }

    #respawn() {
        // checkpoint primeiro, senão a última plataforma
        let destino = { x: 0, y: 0 };
        if (this.#checkpoint) {
            destino = { x: this.#checkpoint.x, y: this.#checkpoint.y + 1 };
        } else if (this.#lastPlatform) {
            const platPosition = this.#lastPlatform.position;
            destino = { x: platPosition.x, y: platPosition.y + 2 }; // +2 para não ficar dentro da plataforma
        }

        this.#playerRb.setTranslation(destino, true);
        this.#playerRb.setLinvel({ x: 0, y: 0 }, true);
        this.#grounded = false;
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
