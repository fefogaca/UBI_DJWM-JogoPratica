import './menu.css';
import './gameover.css';
import { SceneManager } from '../Scripts/SceneManager.js';

const pontos = Number(localStorage.getItem('score'));
document.querySelector('#scoreFinal').textContent = `Score: ${Number.isFinite(pontos) ? pontos : 0}`;

document.querySelector('#btnMenu').addEventListener('click', () => {
    SceneManager.loadScene('index');
});
