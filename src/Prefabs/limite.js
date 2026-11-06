import { criarSprite } from '../Materials/sprite.js';
import { adicionarBoxCollider } from '../Scripts/Fisica.js';

// limite invisível no fundo do ecrã, comprimento = quanto estica a imagem
export async function criarLimite(fisica, x, y, comprimento = 40) {
    const limite = await criarSprite('assets/Imagens/Objetos/blocoDePedra.png');
    limite.name = 'ScreenLimit';
    limite.userData.tag = 'limit';
    limite.scale.set(comprimento, 0.45, 1);
    limite.position.set(x, y, 1);
    limite.visible = false;

    adicionarBoxCollider(fisica, limite);

    return limite;
}
