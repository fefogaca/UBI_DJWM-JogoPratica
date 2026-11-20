import { Input } from './Input.js';
import { SceneManager } from './SceneManager.js';
import { Time } from './Time.js';
import { destruirObjeto } from './Fisica.js';
import { ScoreManager } from './ScoreManager.js';

const CORACAO_VAZIO = 'assets/Imagens/Objetos/coracaoVazio.svg';
const TEMPO_MORTE = 1.2; // segundos da animação de morrer antes do respawn

export class Player {
    #playerRb;
    #horizontal = 0;
    #grounded;
    #canDoubleJump;
    #jumpPressed = false;
    #lastPlatform = null;
    #checkpoint = null;
    #myAnimation;
    #isDead = false;
    #deadTime = 0;
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
        this.#myAnimation = this.object.userData.animator;
    }

    update(dt) {
        const jump = Input.getButton('Jump');

        // em pausa ignora o teclado, senão salta quando o jogo continua
        if (Time.timeScale === 0) {
            this.#horizontal = 0;
            this.#jumpPressed = jump;
            return;
        }

        if (this.#isDead) {
            this.#horizontal = 0;
            this.#jumpPressed = jump;
            this.#deadTime += dt;
            if (this.#deadTime >= TEMPO_MORTE) this.#voltarAVida();
            return;
        }

        // com o Shift anda mais devagar
        const andar = Input.getButton('Walk') ? 0.5 : 1;
        this.#horizontal = Input.getAxis('Horizontal') * andar;

        // vira a imagem para o lado para onde anda
        if (this.#horizontal !== 0) {
            this.object.scale.x = Math.abs(this.object.scale.x) * Math.sign(this.#horizontal);
        }

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
        } else if (other.userData.tag === 'limit' || other.userData.tag === 'trap') {
            this.#perderVida();
        } else if (other.userData.tag === 'enemy' && !this.#isDead) {
            if (this.#caiuEmCima(other)) this.#pisarInimigo(other);
            else this.#perderVida();
        }
    }

    onTriggerEnter(other) {
        if (other.userData.tag === 'box') {
            destruirObjeto(other);
        } else if (other.userData.tag === 'checkpoint' && this.#checkpoint !== other.position) {
            this.#checkpoint = other.position;
            other.material.color.set(0x9dff9d); // fica verde quando é ativado
        }
    }

    // compara os pés do jogador com o topo do inimigo
    #caiuEmCima(inimigo) {
        const meu = this.object.userData.collider;
        const dele = inimigo.userData.collider;
        const pes = meu.translation().y - meu.halfExtents().y;
        const topo = dele.translation().y + dele.halfExtents().y;
        return pes >= topo - 0.15;
    }

    #pisarInimigo(inimigo) {
        destruirObjeto(inimigo);
        ScoreManager.addPoints(20);

        // pequeno salto por cima do inimigo
        this.#playerRb.setLinvel({ x: this.#playerRb.linvel().x, y: 0 }, true);
        this.#playerRb.applyImpulse({ x: 0, y: this.jumpPower / 2 }, true);
        this.#grounded = false;
        this.#canDoubleJump = true;
    }

    #perderVida() {
        if (this.#isDead) return;

        this.lives -= 1;
        const imagem = this.lifeImages[this.lives];
        if (imagem) imagem.src = CORACAO_VAZIO;

        // primeiro mostra a animação de morrer, o respawn fica para o update
        this.#isDead = true;
        this.#deadTime = 0;
        this.#myAnimation.setFloat('isDead', 1);
    }

    #voltarAVida() {
        this.#isDead = false;
        this.#myAnimation.setFloat('isDead', 0);

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

        // se está a cair já não está no chão (ex.: saiu da plataforma a andar)
        if (velocidadeAtual.y < -1) this.#grounded = false;

        this.#myAnimation.setFloat('speed', Math.abs(this.#horizontal));
        this.#myAnimation.setFloat('verticalSpeed', this.#grounded ? 0 : Math.abs(velocidadeAtual.y));
    }
}
