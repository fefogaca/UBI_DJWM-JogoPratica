import * as THREE from 'three';
import { criarSprite } from '../Materials/sprite.js';
import { adicionarCircleCollider } from '../Scripts/Fisica.js';
import { CoinPickup } from '../Scripts/CoinPickup.js';

export async function criarMoeda(fisica, x, y) {
    const moeda = new THREE.Group();
    moeda.name = 'Coin';
    moeda.position.set(x, y, 0);

    const imagem = await criarSprite('assets/Imagens/Objetos/moeda.png');
    imagem.name = 'CoinImage';
    imagem.position.set(0, 0, 1.5);
    // ajuste das moedas para o tamanho correto
    imagem.scale.set(0.16, 0.16, 1);
    moeda.add(imagem);

    adicionarCircleCollider(fisica, moeda, true);
    new CoinPickup(moeda);
    return moeda;
}