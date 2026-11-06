import { criarSprite } from '../Materials/sprite.js';
import { adicionarCircleCollider } from '../Scripts/Fisica.js';

// placa do checkpoint (trigger)
export async function criarCheckpoint(fisica, x, y) {
    const placa = await criarSprite('assets/Imagens/Objetos/placa.png');
    placa.name = 'Checkpoint';
    placa.userData.tag = 'checkpoint';
    placa.position.set(x, y, 1.2);

    adicionarCircleCollider(fisica, placa, true);

    return placa;
}
