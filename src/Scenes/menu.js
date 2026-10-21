import './menu.css';
import { MainMenu } from '../Scripts/MainMenu.js';

const menu = new MainMenu();
menu.levelToLoad = 'nivel1';

document.querySelector('#btnPlay').addEventListener('click', () => menu.newGame());
document.querySelector('#btnCredits').addEventListener('click', () => menu.showCredits());
document.querySelector('#btnQuit').addEventListener('click', () => menu.quitGame());
