import { criarSprite } from '../Materials/sprite.js';
import { Clouds } from '../Scripts/Clouds.js';
import { CloudSpawnBoxes } from '../Scripts/CloudSpawnBoxes.js';
import { criarCaixa } from './caixa.js';

// nuvem boa: mais pequena e mais rápida, larga caixas
export async function criarNuvemBoa(fisica, x, y) {
    const nuvem = await criarSprite('assets/Imagens/Objetos/nuvem1.png');
    nuvem.name = 'GoodCloud';
    nuvem.scale.set(0.16, 0.16, 1); // metade das outras
    nuvem.position.set(x, y, 0.5); // à frente do fundo e atrás das plataformas

    const clouds = new Clouds(nuvem);
    clouds.speed = 3;

    const spawnBoxes = new CloudSpawnBoxes(nuvem, fisica);
    spawnBoxes.boxPrefab = criarCaixa;

    return nuvem;
}
