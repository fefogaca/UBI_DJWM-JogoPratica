import * as THREE from 'three';
import { DebugFisica } from './DebugFisica.js';
import { raycast } from './Fisica.js';

// larga uma caixa quando passa por cima do jogador
export class CloudSpawnBoxes {
    boxPrefab = null;
    #hasTargetedPlayer = false;

    constructor(object, physics) {
        this.object = object;
        this.object.userData.spawnBoxes = this; // o userData.script já é do Clouds
        this.physics = physics;
    }

    fixedUpdate() {
        const down = new THREE.Vector3(0, -10, 0);
        DebugFisica.desenharRaio(this.object.position, down);

        this.#raycastCheckCollision();
    }

    async #raycastCheckCollision() {
        if (this.#hasTargetedPlayer) return; // só larga uma caixa

        const down = new THREE.Vector3(0, -1, 0);
        const hit = raycast(this.physics, this.object.position, down, 10);

        // o raio para no primeiro objeto, se houver uma plataforma pelo meio não vê o jogador
        if (hit !== null && hit.userData.tag === 'player') {
            this.#hasTargetedPlayer = true;

            const position = this.object.position;
            const box = await this.boxPrefab(this.physics, position.x, position.y);
            this.object.parent.add(box);
        }
    }
}
