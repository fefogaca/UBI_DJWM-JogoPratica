import { criarAnimacao } from './animation.js';

// salto1.png até salto12.png, fica na última imagem até aterrar
export const jump = await criarAnimacao('assets/Imagens/Jogador/salto', 12, 16);
jump.loop = false;
