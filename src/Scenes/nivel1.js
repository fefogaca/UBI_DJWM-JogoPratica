import * as THREE from 'three';
import RAPIER from '@dimforge/rapier2d-compat';
import GUI from 'lil-gui';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { criarSprite } from '../Materials/sprite.js';
import { criarPlataforma } from '../Prefabs/plataforma.js';
import { criarBackground } from '../Prefabs/background.js';
import { adicionarRigidbody, sincronizarFisica, adicionarBoxCollider } from '../Scripts/Fisica.js';
import { DebugFisica } from '../Scripts/DebugFisica.js';
import { Player } from '../Scripts/Player.js';

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
scene.background = new THREE.Color(0x314d79);

await RAPIER.init();
const fisica = new RAPIER.World({ x: 0, y: -9.81 });

const mundo = new THREE.Group();
mundo.name = 'World';
scene.add(mundo);

const bgFundos = await criarBackground(0, 0);
bgFundos.name = 'Background';
mundo.add(bgFundos);

const chao = new THREE.Group();
chao.name = 'Ground';
mundo.add(chao);

const plat1 = await criarPlataforma('Plat1', 0, -3.5);
const plat2 = await criarPlataforma('Plat2', -5.5, 0.8);
const plat3 = await criarPlataforma('Plat3', 5.5, 0.8);
const plat4 = await criarPlataforma('Plat4', 0, 3.2);
chao.add(plat1, plat2, plat3, plat4);

for (const plataforma of chao.children) {
    adicionarBoxCollider(fisica, plataforma);
}

const player = await criarSprite('assets/Sprites/Player/Idle (1).png');
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
const scripts = [new DebugFisica(scene, fisica), playerScript];

const gui = new GUI({ title: 'Inspector' });
gui.add(playerScript, 'movementSpeed', 0, 10, 0.1).name('Velocidade');

const PASSO_FIXO = 1 / 50; 
fisica.timestep = PASSO_FIXO;
let acumulador = 0;
let tempoAnterior = performance.now();

for (const script of scripts) script.start?.();


renderer.setAnimationLoop((agora) => {
    const dt = Math.min((agora - tempoAnterior) / 1000, 0.1);
    tempoAnterior = agora;

    for (const script of scripts) script.update?.(dt);

    acumulador += dt;
    while (acumulador >= PASSO_FIXO) {
        for (const script of scripts) script.fixedUpdate?.();
        fisica.step();
        acumulador -= PASSO_FIXO;
    }

    sincronizarFisica(scene);
    renderer.render(scene, camera);
});
