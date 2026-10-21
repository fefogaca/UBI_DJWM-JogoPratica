import { SceneManager } from './SceneManager.js';

export class MainMenu {
    levelToLoad = 'nivel1';

    newGame() {
        localStorage.setItem('score', '0');
        SceneManager.loadScene(this.levelToLoad);
    }

    showCredits() {
        SceneManager.loadScene('creditos');
    }

    quitGame() {
        window.close();

        // Os browsers só permitem fechar janelas abertas por JavaScript.
        window.setTimeout(() => {
            document.body.classList.add('despedida-ativa');
            document.body.innerHTML = `
                <main class="despedida" role="status">
                    <h1>Obrigado por jogar!</h1>
                    <p>Pode fechar este separador em segurança.</p>
                </main>
            `;
        }, 100);
    }
}
