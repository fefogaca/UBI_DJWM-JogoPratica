import * as THREE from 'three';

const loader = new THREE.TextureLoader();

// carrega as imagens numeradas: "prefixo1.png", "prefixo2.png", ..., "prefixoN.png"
export async function criarAnimacao(prefixo, numImagens, imagesPerSecond = 12) {
    const images = [];

    for (let i = 1; i <= numImagens; i++) {
        const textura = await loader.loadAsync(`${prefixo}${i}.png`);
        textura.colorSpace = THREE.SRGBColorSpace;
        images.push(textura);
    }

    return { images, imagesPerSecond, loop: true };
}
