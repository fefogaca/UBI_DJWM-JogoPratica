export class ScoreManager {
    static #score;
    static #scoreText;

    constructor(element) {
        this.element = element;
    }

    start() {
        ScoreManager.#scoreText = this.element;
        ScoreManager.#score = Number(localStorage.getItem('score'));
        if (ScoreManager.#score < 0) {
            ScoreManager.#score = 0;
        }
        ScoreManager.#scoreText.textContent = '' + ScoreManager.#score;
    }

    static addPoints(points) {
        ScoreManager.#score += points;
        localStorage.setItem('score', ScoreManager.#score);
        ScoreManager.#scoreText.textContent = '' + ScoreManager.#score;
    }

    static getPoints() {
        return ScoreManager.#score;
    }

    static reset() {
        ScoreManager.#score = 0;
        localStorage.setItem('score', ScoreManager.#score);
        ScoreManager.#scoreText.textContent = '' + ScoreManager.#score;
    }
}