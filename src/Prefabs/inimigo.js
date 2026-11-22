import { criarSprite } from '../Materials/sprite.js';
import { Enemy } from '../Scripts/Enemy.js';
import { adicionarBoxCollider, adicionarRigidbodyCinematico } from '../Scripts/Fisica.js';

export async function criarInimigo(fisica, x, y) {
    const inimigo = await criarSprite('assets/Imagens/Objetos/esqueleto.png');
    inimigo.name = 'Enemy';
    inimigo.userData.tag = 'enemy';
    inimigo.position.set(x, y, 1.5); // à frente do fundo e das plataformas

    adicionarRigidbodyCinematico(fisica, inimigo);
    adicionarBoxCollider(fisica, inimigo);

    new Enemy(inimigo);

    return inimigo;
}
