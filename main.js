var container;
var camera, scene, renderer, particles, geometry, materials = [],
  params, i, h, color, size;
var mouseX = 0,
  mouseY = 0;

var middleWidth = window.innerWidth / 2;
var middleHeight = window.innerHeight / 2;

init();
animate();

function buildCanvasMat(col, size) {
  var matCanvas = document.createElement('canvas');
  matCanvas.width = matCanvas.height = size;
  var matCtx = matCanvas.getContext('2d');
  var texture = new THREE.Texture(matCanvas);
  var center = size / 2;
  matCtx.beginPath();
  matCtx.arc(center, center, size / 2, 0, 2 * Math.PI, false);
  matCtx.closePath();
  matCtx.fillStyle = col;
  matCtx.fill();
  texture.needsUpdate = true;
  return texture;
}

function init() {

  container = document.createElement('div');
  container.style.position = "fixed";
  container.style.zIndex = -1;
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.z = 1000;

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.0007);

  geometry = new THREE.Geometry();

  for (i = 0; i < 100; i++) {

    var vertex = new THREE.Vector3();
    vertex.x = Math.random() * 2000 - 1000;
    vertex.y = Math.random() * 2000 - 1000;
    vertex.z = Math.random() * 2000 - 1000;

    geometry.vertices.push(vertex);

  }

  params = [
    [
      [1, 1, 0.5], 0.5
    ],
    [
      [0.95, 1, 0.5], 0.4
    ],
    [
      [0.0, 0.5, 0.9], 0.3
    ],
    [
      [0.85, 0.5, 0.0], 0.2
    ],
    [
      [0.1, 0.8, 0.3], 0.7
    ],
    [
      [0.90, 0.3, 0.3], 0.1
    ]
  ];

  for (i = 0; i < params.length; i++) {

    color = params[i][0];
    size = params[i][1];

    var hexadecimalColor = new THREE.Color(color[0], color[1], color[2]).getHexString();

    materials[i] = new THREE.PointsMaterial({
      size: 20,
      map: buildCanvasMat('#' + hexadecimalColor, 256),
      transparent: true,
      depthWrite: false
    });

    particles = new THREE.Points(geometry, materials[i]);

    particles.rotation.x = Math.random() * 6;
    particles.rotation.y = Math.random() * 6;
    particles.rotation.z = Math.random() * 6;

    scene.add(particles);

  }

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  document.addEventListener('touchmove', onDocumentTouchMove, false);
  document.addEventListener('touchstart', onDocumentTouchStart, false);
  document.addEventListener('mousemove', onDocumentMouseMove, false);
  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {

  middleWidth = window.innerWidth / 2;
  middleHeight = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}

function onDocumentMouseMove(event) {
  mouseX = event.clientX - middleWidth;
  mouseY = event.clientY - middleHeight;
}

function onDocumentTouchStart(event) {
  if (event.touches.length === 1) { // unico clique
    event.preventDefault();
    mouseX = event.touches[0].pageX - middleWidth;
    mouseY = event.touches[0].pageY - middleHeight;
  }
}

function onDocumentTouchMove(event) {
  if (event.touches.length === 1) {
    event.preventDefault();
    mouseX = event.touches[0].pageX - middleWidth;
    mouseY = event.touches[0].pageY - middleHeight;

  }

}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  var time = Date.now() * 0.0001;

  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (-mouseY - camera.position.y) * 0.05;

  camera.lookAt(scene.position);

  for (i = 0; i < scene.children.length; i++) {
    var object = scene.children[i];
    if (object instanceof THREE.Points) {
      object.rotation.y = time * (i < 4 ? i + 1 : -(i + 1));
    }
  }

  renderer.render(scene, camera);
}
