import { criarSprite } from '../Materials/sprite.js';
import { VerticalEnemy } from '../Scripts/VerticalEnemy.js';
import { adicionarBoxCollider, adicionarRigidbodyCinematico } from '../Scripts/Fisica.js';

// espinho que sobe e desce entre duas plataformas (não dá para o pisar)
export async function criarEspinho(fisica, x, y) {
    const espinho = await criarSprite('assets/Imagens/Objetos/espinho.png');
    espinho.name = 'Spike';
    espinho.userData.tag = 'trap';
    espinho.scale.set(0.7, 0.7, 1);
    espinho.position.set(x, y, 1.5);

    adicionarRigidbodyCinematico(fisica, espinho);
    adicionarBoxCollider(fisica, espinho);

    new VerticalEnemy(espinho);

    return espinho;
}
