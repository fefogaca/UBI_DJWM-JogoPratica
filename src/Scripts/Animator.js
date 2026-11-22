// Mostra a animação do estado atual e muda de estado quando uma transição se verifica
export class Animator {
    currentState = '';
    parameters = {};
    #controller;
    #image = 0;
    #time = 0;

    constructor(object, controller) {
        this.object = object;
        this.object.userData.animator = this;
        this.#controller = controller;
        this.parameters = { ...controller.parameters };
        this.#changeState(Object.keys(controller.states)[0]);
    }

    setFloat(name, value) {
        this.parameters[name] = value;
    }

    update(dt) {
        // 1) há alguma transição a sair do estado atual que se verifique?
        for (const transition of this.#controller.transitions ?? []) {
            if (transition.from === this.currentState && this.#check(transition)) {
                this.#changeState(transition.to);
                break;
            }
        }

        // 2) passa à imagem seguinte quando chega a altura
        const animation = this.#controller.states[this.currentState];
        this.#time += dt;

        while (this.#time >= 1 / animation.imagesPerSecond) {
            this.#time -= 1 / animation.imagesPerSecond;
            this.#image++;

            if (this.#image >= animation.images.length) {
                // no fim recomeça (loop) ou fica na última imagem
                this.#image = animation.loop ? 0 : animation.images.length - 1;
            }
        }

        this.object.material.map = animation.images[this.#image];
    }

    #check(transition) {
        const value = this.parameters[transition.parameter];
        if (transition.condition === 'greater') return value > transition.value;
        if (transition.condition === 'less') return value < transition.value;
        if (transition.condition === 'equals') return value === transition.value;
        return false;
    }

    #changeState(name) {
        this.currentState = name;
        this.#image = 0;
        this.#time = 0;
        this.object.material.map = this.#controller.states[name].images[0];
    }
}
