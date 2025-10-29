import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.1/three.module.min.js';
import { MathUtils } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.1/three.module.min.js';

// Global variables for Three.js
let camera, scene, renderer;

// Mouse/trackpad interaction variables
let mouseDownX = 0, mouseDownY = 0;
let lon = -90, mouseDownLon = 0;
let lat = 0, mouseDownLat = 0;
let isUserInteracting = false;

// Initialize the 3D scene and camera controls
function init() {
    // Create HTML container
    initHTML();
    
    // Initialize 3D scene
    init3D();
    
    // Set up camera controls
    initCameraControls();
    
    // Start animation loop
    animate();
}

function initHTML() {
    // Create container for Three.js canvas
    const THREEcontainer = document.createElement("div");
    THREEcontainer.setAttribute("id", "THREEcontainer");
    document.body.appendChild(THREEcontainer);
    THREEcontainer.style.position = "absolute";
    THREEcontainer.style.top = "0";
    THREEcontainer.style.left = "0";
    THREEcontainer.style.width = "100%";
    THREEcontainer.style.height = "100%";
    THREEcontainer.style.zIndex = "1";
}

function init3D() {
    // Create scene
    scene = new THREE.Scene();
    
    // Create camera
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.target = new THREE.Vector3(0, 0, 0);  // Camera looks at this point
    camera.position.z = 0;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Add renderer to the HTML container
    document.getElementById('THREEcontainer').appendChild(renderer.domElement);
    
    // Optional: Add a simple background sphere (you can remove this if not needed)
    createBackground();
}

function createBackground() {
    // Create a simple background sphere
    let bgGeometry = new THREE.SphereGeometry(1000, 60, 40);
    bgGeometry.scale(-1, 1, 1); // Flip inside out
    
    // Simple colored background (you can replace with texture if needed)
    let backMaterial = new THREE.MeshBasicMaterial({ color: 0x404040 });
    let background = new THREE.Mesh(bgGeometry, backMaterial);
    scene.add(background);
}

function initCameraControls() {
    const div3D = document.getElementById('THREEcontainer');
    
    // Mouse/trackpad event listeners
    div3D.addEventListener('mousedown', onMouseDown, false);
    div3D.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('mouseup', onMouseUp, false);
    
    // TRACKPAD ZOOMING - This is the zoom functionality you wanted!
    div3D.addEventListener('wheel', onMouseWheel, { passive: true });
    
    // Window resize handler
    window.addEventListener('resize', onWindowResize, false);
}

// PANNING INTERACTION - Mouse down event
function onMouseDown(event) {
    isUserInteracting = true;
    mouseDownX = event.clientX;
    mouseDownY = event.clientY;
    mouseDownLon = lon;
    mouseDownLat = lat;
}

// PANNING INTERACTION - Mouse move event (camera panning)
function onMouseMove(event) {
    if (isUserInteracting) {
        // Calculate how much the mouse moved
        lon = (mouseDownX - event.clientX) * 0.1 + mouseDownLon;
        lat = (event.clientY - mouseDownY) * 0.1 + mouseDownLat;
        
        // Update camera orientation based on mouse movement
        updateCameraOrientation();
    }
}

// PANNING INTERACTION - Mouse up event
function onMouseUp(event) {
    isUserInteracting = false;
}

// TRACKPAD ZOOMING - Mouse wheel/trackpad scroll event
function onMouseWheel(event) {
    // Adjust camera field of view based on scroll/pinch
    camera.fov += event.deltaY * 0.05;
    
    // Limit zoom range (5 = zoomed in, 100 = zoomed out)
    camera.fov = Math.max(5, Math.min(100, camera.fov));
    
    // Update the camera with new zoom level
    camera.updateProjectionMatrix();
}

// Update camera orientation based on mouse movement
function updateCameraOrientation() {
    // Restrict vertical movement
    lat = Math.max(-30, Math.min(30, lat));
    
    // Convert to radians
    let phi = MathUtils.degToRad(90 - lat);
    let theta = MathUtils.degToRad(lon);
    
    // Calculate new camera target position
    camera.target.x = 100 * Math.sin(phi) * Math.cos(theta);
    camera.target.y = 100 * Math.cos(phi);
    camera.target.z = 100 * Math.sin(phi) * Math.sin(theta);
    
    // Make camera look at the target
    camera.lookAt(camera.target);
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// Start the application
init();

// Export functions if you need to use them in other files
export { camera, scene, renderer, init };