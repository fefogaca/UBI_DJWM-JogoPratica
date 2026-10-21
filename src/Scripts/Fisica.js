import * as THREE from 'three';
import RAPIER from '@dimforge/rapier2d-compat';

// Adiciona um Rigidbody (corpo dinâmico) ao objeto
export function adicionarRigidbody(fisica, objeto, massa = 1) {
    const descricao = RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(objeto.position.x, objeto.position.y)
        .setAdditionalMass(massa);

    const corpo = fisica.createRigidBody(descricao);
    objeto.userData.rigidBody = corpo; // guardamos o "componente" no próprio objeto
    return corpo;
}

// Copia a posição/rotação dos corpos físicos para os objetos gráficos
export function sincronizarFisica(scene) {
    scene.traverse((objeto) => {
        const corpo = objeto.userData.rigidBody;
        if (corpo) {
            const posicao = corpo.translation();
            objeto.position.x = posicao.x;
            objeto.position.y = posicao.y;
            objeto.rotation.z = corpo.rotation();
        }
    });
}

// Adiciona um Box Collider (caixa de colisão) ao objeto
// ajusteX / ajusteY: percentagem da imagem que a caixa ocupa (1 = 100%)
// deslocX / deslocY: quanto a caixa se desloca do centro da imagem,
//                    em percentagem da largura/altura (ex.: -0.2 = 20% para a esquerda)
export function adicionarBoxCollider(fisica, objeto, ajusteX = 1, ajusteY = 1, deslocX = 0, deslocY = 0) {
    const caixa = new THREE.Box3().setFromObject(objeto);
    const tamanho = caixa.getSize(new THREE.Vector3());
    const centro = caixa.getCenter(new THREE.Vector3());
    const dx = tamanho.x * deslocX;
    const dy = tamanho.y * deslocY;

    const descricao = RAPIER.ColliderDesc.cuboid(
        (tamanho.x / 2) * ajusteX, // o cuboid recebe METADE da largura
        (tamanho.y / 2) * ajusteY, // e METADE da altura
    );
    // Sensor (trigger) - ativar para testar e comentar no final:
    // descricao.setSensor(true).setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);

    const corpo = objeto.userData.rigidBody;
    let collider;
    if (corpo) {
        // tem Rigidbody: o collider acompanha o corpo (posição relativa ao corpo)
        descricao.setTranslation(dx, dy);
        collider = fisica.createCollider(descricao, corpo);
    } else {
        // sem Rigidbody: collider estático (fixo), no centro do objeto
        descricao.setTranslation(centro.x + dx, centro.y + dy);
        collider = fisica.createCollider(descricao);
    }
    objeto.userData.collider = collider;
    return collider;
}
