import { criarAnimacao } from './animation.js';

// morto1.png até morto8.png, não repete
export const dead = await criarAnimacao('assets/Imagens/Jogador/morto', 8);
dead.loop = false;
