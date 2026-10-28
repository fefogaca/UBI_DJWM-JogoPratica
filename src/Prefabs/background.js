import * as THREE from 'three';
import { criarSprite } from '../Materials/sprite.js';

export async function criarBackground(x, y) {
    const fundos = new THREE.Group();

    const bg = await criarSprite('assets/Imagens/Objetos/fundo.png');
    bg.name = 'BG_0';

    const bgEsquerda = bg.clone();
    bgEsquerda.name = 'BG_1';
    bgEsquerda.position.x = -12.80;

    const bgDireita = bg.clone();
    bgDireita.name = 'BG_2';
    bgDireita.position.x = 12.80;

    fundos.add(bg, bgEsquerda, bgDireita);
    fundos.position.set(x, y, 0);

    return fundos;
}
