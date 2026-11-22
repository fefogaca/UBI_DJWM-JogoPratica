import { criarAnimacao } from './animation.js';

export const dead = await criarAnimacao('assets/Imagens/Jogador/morto', 8);
dead.loop = false;
