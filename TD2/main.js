import * as THREE from 'three';
import { GLTFLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setClearColor(0x111216, 1);
if ('outputColorSpace' in renderer) {
    renderer.outputColorSpace = THREE.SRGBColorSpace;
}
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const fallbackMaterial = new THREE.MeshStandardMaterial({ color: 0x3aa3ff, roughness: 0.6, metalness: 0.1 });
const cube = new THREE.Mesh(geometry, fallbackMaterial);
scene.add(cube);

const textureLoader = new THREE.TextureLoader();
textureLoader.load(
    'texture.jpg',
    (tex) => {
        if ('colorSpace' in tex) {
            tex.colorSpace = THREE.SRGBColorSpace;
        } else if ('encoding' in tex) {
            tex.encoding = THREE.sRGBEncoding;
        }
        cube.material.map = tex;
        cube.material.needsUpdate = true;
    },
    undefined,
    (err) => {
        console.warn('Impossible de charger texture.jpg — utilisation d\'une couleur de secours.', err);
    }
);

camera.position.z = 5;
camera.lookAt(0, 0, 0);

const axes = new THREE.AxesHelper(2);
scene.add(axes);

function animate() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
});

const gltfLoader = new GLTFLoader();
gltfLoader.load(
    'https://threejs.org/examples/models/gltf/Duck/glTF/Duck.gltf',
    (gltf) => {
        const duck = gltf.scene;
        console.log('Duck chargé:', duck);
        duck.scale.set(0.03, 0.03, 0.03);
        duck.position.set(0, -0.25, 0);
        duck.rotation.y = Math.PI * 0.25;
        scene.add(duck);
    },
    undefined,
    (error) => {
        console.error('Erreur de chargement du modèle Duck:', error);
    }
);
