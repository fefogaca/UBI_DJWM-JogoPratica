import { ScoreManager } from '../Scripts/ScoreManager.js';
import './hud.css';
import * as THREE from 'three';
import RAPIER from '@dimforge/rapier2d-compat';
import GUI from 'lil-gui';
import { criarMoeda } from '../Prefabs/coin.js';

// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { criarSprite } from '../Materials/sprite.js';
import { criarPlataforma } from '../Prefabs/plataforma.js';
import { criarDecoracao } from '../Prefabs/decoracao.js';
import { criarBackground } from '../Prefabs/background.js';
import { adicionarRigidbody, sincronizarFisica, adicionarBoxCollider, tratarColisoes } from '../Scripts/Fisica.js';
import { DebugFisica } from '../Scripts/DebugFisica.js';
import { Player } from '../Scripts/Player.js';
import { MainCamera } from '../Scripts/MainCamera.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const TAMANHO_CAMERA = 5;
const camera = new THREE.OrthographicCamera();
camera.position.z = 10;

function ajustarEcra() {
    const aspeto = window.innerWidth / window.innerHeight;
    camera.left = -TAMANHO_CAMERA * aspeto;
    camera.right = TAMANHO_CAMERA * aspeto;
    camera.top = TAMANHO_CAMERA;
    camera.bottom = -TAMANHO_CAMERA;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
ajustarEcra();
window.addEventListener('resize', ajustarEcra);


const scene = new THREE.Scene();
scene.background = new THREE.Color(0xb9dcfe);

await RAPIER.init();
const fisica = new RAPIER.World({ x: 0, y: -9.81 });

const mundo = new THREE.Group();
mundo.name = 'World';
scene.add(mundo);

const bgFundos = await criarBackground(0, 0);
bgFundos.name = 'Background';
bgFundos.scale.y = 1.18;
mundo.add(bgFundos);

const chao = new THREE.Group();
chao.name = 'Ground';
mundo.add(chao);

const plataformas = [
    await criarPlataforma('Plat1', 0, -3.5),
    await criarPlataforma('Plat2', -6.2, -1.2),
    await criarPlataforma('Plat3', 6.2, -1.2),
    await criarPlataforma('Plat4', -10.8, 1.4),
    await criarPlataforma('Plat5', 10.8, 1.4),
    await criarPlataforma('Plat6', 0, 3.2),
];
chao.add(...plataformas);

for (const plataforma of chao.children) {
    adicionarBoxCollider(fisica, plataforma);
}

const limite = await criarSprite('assets/Imagens/Objetos/blocoDePedra.png');
limite.name = 'Limit';
limite.userData.tag = 'limit';
limite.position.set(0, -7.2, 1);
limite.scale.set(40, 0.45, 1);
limite.visible = false;
mundo.add(limite);
adicionarBoxCollider(fisica, limite);

const moedas = [
    [0, -2.15],
    [-6.2, 0.15],
    [6.2, 0.15],
    [-10.8, 2.75],
    [10.8, 2.75],
    [0, 4.55],
];
for (const [x, y] of moedas) {
    mundo.add(await criarMoeda(fisica, x, y));
}

function sobrePlataforma(y, altura, escala = 1) {
    return y + 0.64 + (altura * escala) / 2;
}

const decoracoes = [
    await criarDecoracao('assets/Imagens/Objetos/cacto1.png', 'Cacto', -7.35, sobrePlataforma(-1.2, 1.11, 0.7), 0.7, 1.2),
    await criarDecoracao('assets/Imagens/Objetos/arbusto1.png', 'Arbusto', 1.45, sobrePlataforma(-3.5, 0.88, 0.6), 0.6, 1.2),
    await criarDecoracao('assets/Imagens/Objetos/arvore.png', 'Arvore', -3.6, sobrePlataforma(-3.5, 2.6, 0.5), 0.5, 0.4),
    await criarDecoracao('assets/Imagens/Objetos/relva1.png', 'RelvaEsquerda', -5.15, sobrePlataforma(-1.2, 0.5, 0.8), 0.8, 1.2),
    await criarDecoracao('assets/Imagens/Objetos/relva2.png', 'RelvaDireita', 7.4, sobrePlataforma(-1.2, 0.5, 0.8), 0.8, 1.2),
    await criarDecoracao('assets/Imagens/Objetos/pedra.png', 'Pedra', -11.7, sobrePlataforma(1.4, 0.73, 0.6), 0.6, 1.2),
    await criarDecoracao('assets/Imagens/Objetos/esqueleto.png', 'Esqueleto', 1.35, sobrePlataforma(3.2, 0.51, 0.85), 0.85, 1.2),
    await criarDecoracao('assets/Imagens/Objetos/seta.png', 'Seta', 5, sobrePlataforma(-1.2, 0.87, 0.55), 0.55, 1.2),
    await criarDecoracao('assets/Imagens/Objetos/nuvem1.png', 'Nuvem1', -9, 6.4, 0.32, 0.2),
    await criarDecoracao('assets/Imagens/Objetos/nuvem2.png', 'Nuvem2', 8, 4.4, 0.28, 0.2),
];
mundo.add(...decoracoes);

const player = await criarSprite('assets/Imagens/Jogador/parado1.png');
player.name = 'Player';
player.scale.set(0.5, 0.5, 1);
player.position.set(0, 0, 2);
scene.add(player);

adicionarRigidbody(fisica, player);
adicionarBoxCollider(fisica, player, 0.54, 0.83, -0.22, 0.02);

function mostrarHierarquia(objeto, nivel = 0) {
    console.log('  '.repeat(nivel) + (objeto.name || objeto.type));
    for (const filho of objeto.children) {
        mostrarHierarquia(filho, nivel + 1);
    }
}
mostrarHierarquia(scene);


const playerScript = new Player(player);
const scripts = [
    new DebugFisica(scene, fisica),
    playerScript,
    new ScoreManager(document.querySelector('#scoreValue')),
    new MainCamera(camera, scene),
];

// inspector gui
const gui = new GUI({ title: 'Inspector' });
gui.add(playerScript, 'movementSpeed', 0, 10, 0.1).name('Velocidade');
gui.add(playerScript, 'jumpPower', 0, 100, 1).name('Força do salto');

const PASSO_FIXO = 1 / 50; 
fisica.timestep = PASSO_FIXO;
let acumulador = 0;
let tempoAnterior = performance.now();

for (const script of scripts) script.start?.();

const eventos = new RAPIER.EventQueue(true);
renderer.setAnimationLoop((agora) => {
    const dt = Math.min((agora - tempoAnterior) / 1000, 0.1);
    tempoAnterior = agora;

    for (const script of scripts) script.update?.(dt);

    acumulador += dt;
    while (acumulador >= PASSO_FIXO) {
        for (const script of scripts) script.fixedUpdate?.();
        fisica.step(eventos);
        tratarColisoes(fisica, eventos);
        acumulador -= PASSO_FIXO;
    }

    sincronizarFisica(scene);
    for (const script of scripts) script.lateUpdate?.();
    renderer.render(scene, camera);
});
