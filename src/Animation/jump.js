import { criarAnimacao } from './animation.js';

// fica na última imagem até aterrar
export const jump = await criarAnimacao('assets/Imagens/Jogador/salto', 12, 16);
jump.loop = false;
