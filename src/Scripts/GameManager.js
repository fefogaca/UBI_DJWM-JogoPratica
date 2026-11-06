import { Input } from './Input.js';
import { Time } from './Time.js';

export class GameManager {
    isPaused = false;
    pauseMenu = null;
    music = null;
    #pausePressed = false;

    start() {
        if (!this.music) return;
        this.music.loop = true;
        this.#tocarMusica();
    }

    update() {
        const pause = Input.getButton('Pause');
        if (pause && !this.#pausePressed) {
            if (this.isPaused) this.resumeGame();
            else this.pauseGame();
        }
        this.#pausePressed = pause;
    }

    pauseGame() {
        this.isPaused = true;
        Time.timeScale = 0;
        if (this.pauseMenu) this.pauseMenu.hidden = false;
        this.music?.pause();
    }

    resumeGame() {
        this.isPaused = false;
        Time.timeScale = 1;
        if (this.pauseMenu) this.pauseMenu.hidden = true;
        this.#tocarMusica();
    }

    #tocarMusica() {
        if (!this.music || this.isPaused) return;

        // o browser só deixa tocar som depois de interagir com a página
        this.music.play().catch(() => {
            const tentarDeNovo = () => this.#tocarMusica();
            window.addEventListener('keydown', tentarDeNovo, { once: true });
            window.addEventListener('pointerdown', tentarDeNovo, { once: true });
        });
    }
}
