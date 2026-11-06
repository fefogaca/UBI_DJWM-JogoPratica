export class Level1Manager {
    cloudPrefab1 = null;
    cloudPrefab2 = null;

    constructor(object, scene, scripts) {
        this.object = object;
        this.scene = scene;
        this.scripts = scripts;
    }

    async start() {
        const position = this.object.position;
        await this.#instantiate(this.cloudPrefab1, position);
        const c2 = await this.#instantiate(this.cloudPrefab2, position);

        c2.userData.script.isMovingLeft = true;
    }

    // cria o objeto do prefab e põe na cena
    async #instantiate(prefab, position) {
        const object = await prefab(position.x, position.y);
        this.scene.add(object);
        this.scripts.push(object.userData.script);
        return object;
    }
}
