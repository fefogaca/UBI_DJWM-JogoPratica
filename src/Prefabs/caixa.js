import { criarSprite } from '../Materials/sprite.js';
import { adicionarBoxCollider, adicionarRigidbody } from '../Scripts/Fisica.js';

// caixa que cai da nuvem boa (trigger, atravessa tudo)
export async function criarCaixa(fisica, x, y) {
    const caixa = await criarSprite('assets/Imagens/Objetos/caixa.png');
    caixa.name = 'Box';
    caixa.userData.tag = 'box';
    caixa.scale.set(0.5, 0.5, 1);
    caixa.position.set(x, y, 1.5);

    adicionarRigidbody(fisica, caixa);
    const collider = adicionarBoxCollider(fisica, caixa);
    collider.setSensor(true); // is trigger

    return caixa;
}
