// Ficheiro de apoio: guarda as teclas que estão premidas.
const teclas = new Set();

window.addEventListener('keydown', (evento) => teclas.add(evento.code));
window.addEventListener('keyup', (evento) => teclas.delete(evento.code));
window.addEventListener('blur', () => teclas.clear());

function premida(...codigos) {
    return codigos.some((codigo) => teclas.has(codigo));
}

export const Input = {
    // Devolve -1, 0 ou 1 para o eixo pedido.
    getAxis(eixo) {
        let valor = 0;

        if (eixo === 'Horizontal') {
            if (premida('KeyA', 'ArrowLeft')) valor -= 1;
            if (premida('KeyD', 'ArrowRight')) valor += 1;
        } else if (eixo === 'Vertical') {
            if (premida('KeyS', 'ArrowDown')) valor -= 1;
            if (premida('KeyW', 'ArrowUp')) valor += 1;
        }

        return valor;
    },

    // devolve true enquanto o botão estiver pressionado
    getButton(button) {
        if (button === 'Jump') return premida('Space');
        return false;
    },
};
