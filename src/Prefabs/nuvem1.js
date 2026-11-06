import { criarSprite } from '../Materials/sprite.js';
import { Clouds } from '../Scripts/Clouds.js';

export async function criarNuvem1(x, y) {
    const nuvem = await criarSprite('assets/Imagens/Objetos/nuvem1.png');
    nuvem.name = 'Cloud1';
    nuvem.scale.set(0.32, 0.32, 1);
    nuvem.position.set(x, y, 0.5); // à frente do fundo e atrás das plataformas

    new Clouds(nuvem);

    return nuvem;
}
