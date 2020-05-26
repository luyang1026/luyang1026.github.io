var scene, renderer, camera
init()
animate()

function init () {
  scene = new THREE.Scene();
  // scene.background = new THREE.Color( 0xa0a0a0 );
  // scene.fog = new THREE.Fog( 0xa0a0a0, 2, 100 );
  
  camera = new THREE.PerspectiveCamera( 85, 800 / 500, 0.1, 1000 );
  camera.position.set(0, 1, 4);
  
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize( 800 , 500 );
  document.getElementById('scene').appendChild( renderer.domElement );
  renderer.shadowMap.enabled = true;
  
  var helper = new THREE.AxesHelper(10);
  scene.add(helper);
  
  var light = new THREE.AmbientLight(0xffffff);
  light.position.set( 0, 10, 0 );
  scene.add( light );
  
  var controls = new THREE.OrbitControls( camera, renderer.domElement );
}

function animate() {
  requestAnimationFrame( animate );
  // controls.update();
  TWEEN.update()
  renderer.render( scene, camera );
}

var matStdObjects = new THREE.MeshStandardMaterial( { color: 0xF00000, roughness: 0, metalness: 0, transparent: true, opacity: 1, emissive: 0xffff00 } );
var geoBox = new THREE.BoxGeometry( Math.PI, Math.sqrt( 2 ), Math.E );
var mshStdBox = new THREE.Mesh( geoBox, matStdObjects );
mshStdBox.rotation.set( 0, Math.PI / 2.0, 0 );
scene.add( mshStdBox );

var spotLight = new THREE.PointLight(0xff0000, 1, 1000);
spotLight.position.set(0, 0, 0);
spotLight.castShadow = true;
// scene.add(spotLight);




    
