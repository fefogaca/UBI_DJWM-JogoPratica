export class Level1Manager {
    cloudPrefab1 = null;
    cloudPrefab2 = null;
    goodCloudPrefab = null;

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

        // a nuvem boa tem dois scripts, o segundo também vai para a lista
        const c3 = await this.#instantiate(this.goodCloudPrefab, position);
        this.scripts.push(c3.userData.spawnBoxes);
    }

    // cria o objeto do prefab e põe na cena
    async #instantiate(prefab, position) {
        const object = await prefab(position.x, position.y);
        this.scene.add(object);
        this.scripts.push(object.userData.script);
        return object;
    }
}
