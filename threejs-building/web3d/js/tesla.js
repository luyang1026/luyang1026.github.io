var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(75, 900/600, 0.1, 6000)
let tesla
camera.position.z = 600;
// camera.position.x = 5;
camera.position.y = 100;


var render = new THREE.WebGLRenderer({ antialias: true})
render.setSize(900, 600)
render.setClearColor(0xefefef);
render.shadowMap.enabled = true
render.shadowMap.type = THREE.PCFSoftShadowMap
document.getElementById('canvas').appendChild(render.domElement)

var loader = new THREE.GLTFLoader()

// var size = 100;
// var divisions = 10;

// var gridHelper = new THREE.GridHelper( size, divisions );
// scene.add( gridHelper );

// var g_cube = new THREE.BoxGeometry(100, 100, 100)
// var cubeMaterial = new THREE.MeshStandardMaterial({color: 0xff0000})
// var cube = new THREE.Mesh(g_cube, cubeMaterial)
// cube.castShadow = true
// cube.position.x = -300
// scene.add(cube)


var geometry = new THREE.PlaneGeometry( 5000, 5000 );
var material = new THREE.MeshStandardMaterial( {color: 0xaaaaaa, roughness: 1} );
var plane = new THREE.Mesh( geometry, material );

plane.receiveShadow = true
plane.rotateX(-Math.PI / 2)
plane.position.y = -60
scene.add( plane );


var controls = new THREE.OrbitControls( camera, render.domElement );
controls.autoRotate  = true
controls.maxDistance = 800
controls.minDistance = 400

var axesHelper = new THREE.AxesHelper( 500 );
// scene.add( axesHelper );

loader.load('./model/tesla_model_3/scene.gltf', function(gltf) {
  let n = 0
  
  scene.add(gltf.scene)
  render.render( scene, camera );
  tesla = gltf.scene
  tesla.castShadow = true
  const windows = /Capot013_Material017_0/
  tesla.position.z = 100
  tesla.traverse(function (obj) {
    // console.log(obj.name)
    if (obj.isMesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
    }
    if (obj.isMesh && obj.name.match(windows)) {
      obj.material.transparent = true
      obj.material.opacity = 0.88
      // obj.material.color = 0x999999
      console.log(obj.material.type)
    }
  })
}, function ( xhr ) {
  // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
}, function(err) { console.log(err) })

function paintColor (car, color) {
  const m = {
    white:  new THREE.MeshStandardMaterial({ color: 0xffffff }),
    red:  new THREE.MeshStandardMaterial({ color: 0x911a19 }),
    silver:  new THREE.MeshStandardMaterial({ color: 0x666c76 }),
    blue:  new THREE.MeshStandardMaterial({ color: 0x2950a9 }),
  }
  const paint = /Capot001_CAR_PAINT_0/
  car.traverse(function (obj) {
    if (obj.isMesh && obj.name.match(paint) && color && car) {
      obj.material = m[color]
      // console.log(obj.material.color)
    }
  })
}

var SpotLight = new THREE.SpotLight( 0xffffff, 5, 1400, Math.PI/5, 1, 1.2 );
SpotLight.position.set( 200, 1000, 100 );
SpotLight.castShadow = true
scene.add( SpotLight );
var SpotLightHelper = new THREE.SpotLightHelper( SpotLight, 10 );
// scene.add( SpotLightHelper );

var light = new THREE.AmbientLight( 0xffffff ); // soft white light
light.position.set(800, 800, 800);
scene.add( light );


var animate = function () {
  requestAnimationFrame( animate );
  render.render( scene, camera );
  controls.update()
};

animate();
const colors = Array.from(document.querySelectorAll('.color-item')) 
for (let c of colors) {
  c.addEventListener('click', function(e){
    paintColor(tesla, this.dataset.color)
    colors.forEach((c)=> {
      c.classList.remove('active')
    })
    c.classList.add('active')
  }, false)
}