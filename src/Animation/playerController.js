import { idle } from './idle.js';
import { walk } from './walk.js';
import { run } from './run.js';
import { jump } from './jump.js';
import { dead } from './dead.js';

// estados, parâmetros e transições das animações do Player
export const playerController = {
    // o primeiro estado é o inicial
    states: { idle, walk, run, jump, dead },

    parameters: { speed: 0, verticalSpeed: 0, isDead: 0 },

    // a ordem conta: a primeira transição que se verificar é a que acontece
    transitions: [
        { from: 'idle', to: 'dead', parameter: 'isDead', condition: 'equals', value: 1 },
        { from: 'walk', to: 'dead', parameter: 'isDead', condition: 'equals', value: 1 },
        { from: 'run', to: 'dead', parameter: 'isDead', condition: 'equals', value: 1 },
        { from: 'jump', to: 'dead', parameter: 'isDead', condition: 'equals', value: 1 },
        { from: 'dead', to: 'idle', parameter: 'isDead', condition: 'equals', value: 0 },

        { from: 'idle', to: 'jump', parameter: 'verticalSpeed', condition: 'greater', value: 0.01 },
        { from: 'walk', to: 'jump', parameter: 'verticalSpeed', condition: 'greater', value: 0.01 },
        { from: 'run', to: 'jump', parameter: 'verticalSpeed', condition: 'greater', value: 0.01 },
        { from: 'jump', to: 'idle', parameter: 'verticalSpeed', condition: 'equals', value: 0 },

        { from: 'idle', to: 'run', parameter: 'speed', condition: 'greater', value: 0.5 },
        { from: 'idle', to: 'walk', parameter: 'speed', condition: 'greater', value: 0.01 },
        { from: 'walk', to: 'run', parameter: 'speed', condition: 'greater', value: 0.5 },
        { from: 'walk', to: 'idle', parameter: 'speed', condition: 'less', value: 0.01 },
        { from: 'run', to: 'idle', parameter: 'speed', condition: 'less', value: 0.01 },
        { from: 'run', to: 'walk', parameter: 'speed', condition: 'less', value: 0.6 },
    ],
};
