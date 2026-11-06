import { criarSprite } from '../Materials/sprite.js';
import { Clouds } from '../Scripts/Clouds.js';

export async function criarNuvem2(x, y) {
    const nuvem = await criarSprite('assets/Imagens/Objetos/nuvem2.png');
    nuvem.name = 'Cloud2';
    nuvem.scale.set(0.28, 0.28, 1);
    nuvem.position.set(x, y, 0.5); // à frente do fundo e atrás das plataformas

    new Clouds(nuvem);

    return nuvem;
}
