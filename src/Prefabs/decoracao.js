import { criarSprite } from '../Materials/sprite.js';

export async function criarDecoracao(caminho, nome, x, y, escala = 1, z = 0.5) {
    const objeto = await criarSprite(caminho);
    objeto.name = nome;
    objeto.scale.set(escala, escala, 1);
    objeto.position.set(x, y, z);
    return objeto;
}
