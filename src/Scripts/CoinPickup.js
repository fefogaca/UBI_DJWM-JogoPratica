import { destruirObjeto } from './Fisica.js';
import { Player } from './Player.js';
import { ScoreManager } from './ScoreManager.js';

export class CoinPickup {
    pointToAdd = 10;
    #coinPickupEffect;

    constructor(object) {
        this.object = object;
        this.object.userData.script = this;
        this.#coinPickupEffect = new Audio('assets/Sounds/TreasurePickup.mp3');
    }

    onTriggerEnter(other) {
        if (!(other.userData.script instanceof Player)) return;
        ScoreManager.addPoints(this.pointToAdd);
        this.#coinPickupEffect.play();
        destruirObjeto(this.object);
    }
}