import * as THREE from 'three';

// marca uma posição para os inimigos (o checkpoint.js já é a placa do respawn)
export function criarPontoPatrulha(nome, x, y) {
    const ponto = new THREE.Mesh(
        new THREE.CircleGeometry(0.1),
        new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    );
    ponto.name = nome;
    ponto.position.set(x, y, 1);
    ponto.visible = false; // o nível já está montado

    return ponto;
}
