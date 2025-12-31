// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Create pink heart geometry (using parametric equations for a heart shape)
const heartShape = new THREE.Shape();
heartShape.moveTo(0, 0);
heartShape.bezierCurveTo(5, 5, 10, 0, 0, -10);
heartShape.bezierCurveTo(-10, 0, -5, 5, 0, 0);

const extrudeSettings = {
    steps: 2,
    depth: 2,
    bevelEnabled: true,
    bevelThickness: 1,
    bevelSize: 1,
    bevelSegments: 2
};

const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
const material = new THREE.MeshPhongMaterial({ color: 0xff69b4 }); // Hot pink color
const heart = new THREE.Mesh(geometry, material);
heart.scale.set(0.5, 0.5, 0.5); // Scale down for visibility
scene.add(heart);

camera.position.z = 20;

// Rotation and animation
let pulseScale = 1;
let pulseDirection = 1;
function animate() {
    requestAnimationFrame(animate);
    heart.rotation.x += 0.01;
    heart.rotation.y += 0.01;

    // Pulse animation (heartbeat effect)
    pulseScale += 0.005 * pulseDirection;
    if (pulseScale > 1.2) pulseDirection = -1;
    if (pulseScale < 0.8) pulseDirection = 1;
    heart.scale.set(pulseScale * 0.5, pulseScale * 0.5, pulseScale * 0.5);

    renderer.render(scene, camera);
}
animate();

// Interaction: Click to trigger bigger pulse
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([heart]);

    if (intersects.length > 0) {
        // Trigger a color change or bigger pulse as "game" interaction
        material.color.setHex(Math.random() * 0xffffff); // Random color on click
        pulseScale = 1.5; // Big pulse
    }
}

window.addEventListener('click', onClick);

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
