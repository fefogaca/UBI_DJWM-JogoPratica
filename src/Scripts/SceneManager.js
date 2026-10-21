// Cada cena do jogo corresponde a uma página HTML.
export const SceneManager = {
    loadScene(name) {
        window.location.href = `${name}.html`;
    },
};
