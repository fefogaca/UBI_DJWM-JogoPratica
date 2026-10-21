import * as THREE from 'three';
import RAPIER from '@dimforge/rapier2d-compat';

// Para cada collider, guarda o objeto do Three.js a que pertence
const objetosPorCollider = new Map();

function registarCollider(fisica, objeto, collider) {
    objeto.userData.collider = collider;
    objeto.userData.physics = fisica;
    objetosPorCollider.set(collider.handle, objeto);
}

export function adicionarRigidbody(fisica, objeto, massa = 1) {
    const descricao = RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(objeto.position.x, objeto.position.y)
        .setAdditionalMass(massa);

    const corpo = fisica.createRigidBody(descricao);
    objeto.userData.rigidBody = corpo;
    return corpo;
}

export function adicionarBoxCollider(fisica, objeto, ajusteX = 1, ajusteY = 1, deslocX = 0, deslocY = 0) {
    const caixa = new THREE.Box3().setFromObject(objeto);
    const tamanho = caixa.getSize(new THREE.Vector3());
    const centro = caixa.getCenter(new THREE.Vector3());
    const dx = tamanho.x * deslocX;
    const dy = tamanho.y * deslocY;

    const descricao = RAPIER.ColliderDesc.cuboid(
        (tamanho.x / 2) * ajusteX,
        (tamanho.y / 2) * ajusteY,
    ).setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);

    const corpo = objeto.userData.rigidBody;
    let collider;
    if (corpo) {
        descricao.setTranslation(dx, dy);
        collider = fisica.createCollider(descricao, corpo);
    } else {
        descricao.setTranslation(centro.x + dx, centro.y + dy);
        collider = fisica.createCollider(descricao);
    }
    registarCollider(fisica, objeto, collider);
    return collider;
}

// isTrigger true = sensor: deteta o toque e não bloqueia o movimento
export function adicionarCircleCollider(fisica, objeto, isTrigger = false) {
    const caixa = new THREE.Box3().setFromObject(objeto);
    const tamanho = caixa.getSize(new THREE.Vector3());
    const centro = caixa.getCenter(new THREE.Vector3());

    const descricao = RAPIER.ColliderDesc.ball(tamanho.x / 2)
        .setTranslation(centro.x, centro.y)
        .setSensor(isTrigger)
        .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);

    const collider = fisica.createCollider(descricao);
    registarCollider(fisica, objeto, collider);
    return collider;
}

export function tratarColisoes(fisica, eventos) {
    eventos.drainCollisionEvents((handle1, handle2, started) => {
        if (!started) return;

        const collider1 = fisica.getCollider(handle1);
        const collider2 = fisica.getCollider(handle2);
        const objeto1 = objetosPorCollider.get(handle1);
        const objeto2 = objetosPorCollider.get(handle2);
        if (!collider1 || !collider2 || !objeto1 || !objeto2) return;

        if (collider1.isSensor() || collider2.isSensor()) {
            objeto1.userData.script?.onTriggerEnter?.(objeto2);
            objeto2.userData.script?.onTriggerEnter?.(objeto1);
        } else {
            objeto1.userData.script?.onCollisionEnter?.(objeto2);
            objeto2.userData.script?.onCollisionEnter?.(objeto1);
        }
    });
}

export function destruirObjeto(objeto) {
    const collider = objeto.userData.collider;
    if (collider) {
        objetosPorCollider.delete(collider.handle);
        objeto.userData.physics.removeCollider(collider, false);
        objeto.userData.collider = null;
    }
    objeto.removeFromParent();
}

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