import * as THREE from 'three';
import { criarSprite } from '../Materials/sprite.js';

export async function criarPlataforma(nome, x, y) {
    const plataforma = new THREE.Group();
    plataforma.name = nome;
    plataforma.userData.tag = 'platform';

    const esquerda = await criarSprite('assets/Imagens/Pecas/peca1.png');
    const centro = await criarSprite('assets/Imagens/Pecas/peca2.png');
    const direita = await criarSprite('assets/Imagens/Pecas/peca3.png');

    esquerda.position.set(-1.28, 0, 0);
    centro.position.set(0, 0, 0);
    direita.position.set(1.28, 0, 0);

    plataforma.add(esquerda, centro, direita);
    plataforma.position.set(x, y, 1);

    return plataforma;
}
