  var cube, scene, camera, render, controls,raycaster,mouse,canvasTexture, cursor, sprite, spriteLine,context
  init()
  var canvasDOM = document.getElementById('scene').querySelector('canvas')
  function tween(from, target, fn) {
    new TWEEN.Tween(from)
        .to(target, 1800)
        .onUpdate(function(){
          fn && fn()
        })
        .start()
  }
  
  function initDatGUI () {
    var datGui = new dat.GUI()
    var gui = {
      phi: Math.PI / 2,
      distance () {
        // console.log(controls.object.position.distanceTo(controls.target)) // distance between camera and camera's target
        console.log(camera.getWorldPosition(), camera.position)
      },
      fromHigh: false,
      target: 'sphere',
      initCamera () {
        initCamera()
      }
    }
    datGui.add(gui, 'phi', -Math.PI, Math.PI).onChange(function (){})
    datGui.add(gui, 'initCamera')
    datGui.add(gui, 'fromHigh').onChange(function (){
      if (gui.fromHigh) {
        camera.position.y = 300
      } else {
        camera.position.y = 100
      }
      camera.lookAt(0, 0, 0)
      renderer.render(scene, camera)
    })
    datGui.add(gui, 'target', ['cube', 'sphere']).onChange(function (e) {
      var cameraPosition = camera.position.clone()
      switch (e) {
        case 'sphere':
          // controls.target = sphere.position
          // tween(cameraPosition, sphere.position.clone().addScalar(10), () => {
          //   camera.position.copy(cameraPosition)
          //   camera.lookAt(sphere.position)
          // })
          break
        case 'cube':
          controls.target = cube.position
          tween(cameraPosition, cube.position.clone().addScalar(20), () => {
            camera.position.copy(cameraPosition)
            camera.lookAt(cube.position)
          })
          break
      }
    })
  }

  function init () {
    var windowWidth = window.innerWidth
    var windowHeight = window.innerHeight
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xa0a0a0 );
    
    camera = new THREE.PerspectiveCamera( 85, windowWidth / windowHeight, 0.1, 1000 );
    camera.position.set(-30, 300, 40 );
  
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize( windowWidth , windowHeight );
    document.getElementById('scene').appendChild( renderer.domElement );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    var helper = new THREE.AxesHelper(30);
    scene.add(helper);

    initLight()
    initDatGUI()
    initBase()
    initBuilding()
    initElevator()
    initPoint()

    // initFonts()
    initEvent()
    initControl()
    // initCamera()

    setTimeout(function(){
      var cameraPosition = camera.position.clone()
      controls.target = cube.position
      tween(cameraPosition, cube.position.clone().addScalar(20), () => {
        camera.position.copy(cameraPosition)
        camera.lookAt(cube.position)
      })
    },1000)
  }
  function initCamera() {
    camera.position.set(20, 50, 1 );
    camera.lookAt(0, 0, 0)
    controls.update();
    renderer.render(scene, camera)
  }
  function initLight () {
    var light = new THREE.AmbientLight( 0x555555);
    light.position.set( 0, 10, 0 );
    scene.add( light );
  
    var spotLight = new THREE.SpotLight(0x999999);
    spotLight.position.set(50, 50, 100);
    spotLight.castShadow = true;
    scene.add(spotLight);

    var spotLightHelper = new THREE.SpotLightHelper( spotLight);
    scene.add( spotLightHelper );
  }


  var rectLight = new THREE.RectAreaLight( 0xffff00, 1, 10, 15 );
  rectLight.position.set( 0, 0, -30 );
  rectLight.lookAt(0, 0, 1)
  // scene.add( rectLight );
  var rectLightMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial(0xff0000) );
  rectLightMesh.scale.x = rectLight.width;
  rectLightMesh.scale.y = rectLight.height;
  rectLight.add( rectLightMesh );
  var rectLightMeshBack = new THREE.Mesh( new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial(0xff0000) );
  rectLightMeshBack.rotation.y = Math.PI;
  rectLightMesh.add( rectLightMeshBack );


  // Cube
  function initBase(){
    var geometry = new THREE.BoxGeometry( 40, 6, 30 );
    var cubeMaterial = new THREE.MeshStandardMaterial( {color: 0x61faff, roughness: 0, 	opacity: 0.4, transparent: true} );
    var edges = new THREE.EdgesGeometry( geometry );
    cube = new THREE.Mesh( geometry, cubeMaterial );
    cube.translateY(3)
    var line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x999999 } ) );
    cube.add(line)
    // scene.add( line );
    for (var i = 0; i < 21; i ++) {
      let geometry  = new THREE.PlaneGeometry( 20, 16, 1 );
      var edges = new THREE.EdgesGeometry( geometry );
      var plane = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x61ffff } ) );
      plane.rotation.x = Math.PI / 2
      plane.translateZ(-i * 2 )
      cube.add(plane)
    }
    scene.add( cube );
  }
  function initBuilding () {
    var geometry = new THREE.BoxGeometry( 26, 40, 20 );
    var cubeMaterial = new THREE.MeshStandardMaterial( {color: 0x61faff, roughness: 0, 	opacity: 0.2, transparent: true} );
    var edges = new THREE.EdgesGeometry( geometry );
    var cube = new THREE.Mesh( geometry, cubeMaterial );
    var line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x999999 } ) );
    cube.add(line)
    cube.translateY(26)
    scene.add(cube)
  }

  function initElevator (count) {
    for (let i = -2; i < (count || 2); i ++ ) {
      let geometry = new THREE.BoxGeometry( 3, 7, 3 );
      let cubeMaterial = new THREE.MeshStandardMaterial( {color: 0xffffff, roughness: 0, 	transparent: false, emissive: 0xffff00} );
      let elevator = new THREE.Mesh( geometry, cubeMaterial );
      elevator.position.y = 10
      elevator.position.x = -4 * i
      let position = {y: 10}
      scene.add(elevator)
      
      new TWEEN.Tween(position)
        .to({y: Math.floor(Math.random() * 20) + 20}, 5000)
        .delay(5000 * Math.random() * Math.abs(i))
        .repeat(Infinity)
        .yoyo(true)
        .onUpdate(function (){
          elevator.position.y = position.y
        })
        .start()

      let geometry2 = new THREE.Geometry();
      geometry2.vertices.push(
        new THREE.Vector3( -4 * i, 6, 0 ),
        new THREE.Vector3( -4 * i, 43, 0 )
      );
      let material2 = new THREE.LineBasicMaterial( {
        color: 0xea7903,
        linewidth: 2
      } );
      let line = new THREE.LineSegments(geometry2, material2)
      scene.add(line)
    }

    //   .chain(downward)
    // var downward = new TWEEN.Tween(position)
    //   .yoyo({y: 10}, 5000)
    //   .onUpdate(function (){
    //     elevator.position.y = position.y
    //   })
    //   .start()
    //   .chain(upward)
  }
  function initPoint () {
    context = document.getElementById('text').getContext('2d')
    context.fillStyle = '#1e2d3f'
    context.fillRect(0, 0, 400, 150)
    context.font = '20px';
    context.fillStyle = '#ffffff'
    context.fillText('电梯门故障', 24, 20);

    var img = new Image()
    img.src = './textures/sxt.jpg'
    img.onload = function() {
      context.drawImage(img,0, 0, 513, 416, 30, 30,  200, 100)
      canvasTexture = new THREE.CanvasTexture(
        document.querySelector("#text")
      )
      var spriteMaterial = new THREE.SpriteMaterial( { map: canvasTexture, color: 0xffffff } );
      sprite = new THREE.Sprite( spriteMaterial );

      sprite.position.set(4 , 28, 25)
      sprite.scale.set( 10, 8, 1 );
      scene.add( sprite );
    }
    
      let geometry = new THREE.SphereGeometry( 1, 16, 8 );
      let material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
      let sphere = new THREE.Mesh( geometry, material );
      sphere.position.set(4, 18, 9)
      sphere.userData.noticePoint = true
      scene.add( sphere );
      let geometry2 = new THREE.Geometry();
      geometry2.vertices.push(
        new THREE.Vector3( 4 , 18, 10.7 ),
        new THREE.Vector3( 4 , 28, 15 ),
        new THREE.Vector3( 4 , 28, 25 )
      );
      let material2 = new THREE.LineBasicMaterial( {
        color: 0xff0000,
        linewidth: 2
      } );
      spriteLine = new THREE.Line(geometry2, material2)
      scene.add(spriteLine)

  }
  function initEvent () {
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2(-10,-10);
    var canvas = document.getElementById('scene').querySelector('canvas')
    function onMouseClick( event ) {
      // 计算物体和射线的焦点    
      mouse.x = ( event.offsetX / canvas.width ) * 2 - 1;
      mouse.y = - ( event.offsetY / canvas.height ) * 2 + 1;
      var intersects = raycaster.intersectObjects( scene.children );
      for ( var i = 0; i < intersects.length; i++ ) {
        if(intersects[ i ].object.userData.noticePoint) {
          if (intersects[ i ].object.material.color.g) {
            intersects[ i ].object.material.color.set( 0xff0000 );
            spriteLine.visible = true
            sprite.visible = true
          } else {
            intersects[ i ].object.material.color.set( 0x00ff00 );
            spriteLine.visible = false
            sprite.visible = false
          }
        }
      }
    }

    canvas.addEventListener('click', onMouseClick, false)
  }
  //底部平面
  var textureLoader = new THREE.TextureLoader();
  var texture = textureLoader.load( "textures/water.jpg" );
  texture.repeat.set( 20, 10 );
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.format = THREE.RGBFormat;

  var planeGeometry = new THREE.PlaneGeometry(300, 300);
  var planeMaterial = new THREE.MeshLambertMaterial({
    color: 0xaaaaaa,
    // map: texture
  });
  plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -0.5 * Math.PI;
  plane.receiveShadow = true;
  scene.add(plane);

  function initControl (){
    //控制器
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 1;
    controls.minDistance = 1;
  }
  function initFonts () {
    var loader = new THREE.FontLoader();

    loader.load( './fonts/gentilis_regular.typeface.json', function ( font ) {
      var geometry = new THREE.TextGeometry( 'W', {
        font: font,
        size: 0.1,
        height: 0.1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 10,
        bevelSize: 8,
        bevelSegments: 5
      } );
      geometry.computeBoundingBox();
      geometry.computeVertexNormals();
      var material = new THREE.MeshStandardMaterial( {color: 0x61faff} );
      var mesh = new THREE.Mesh(geometry, material)
      mesh.rotation.x = Math.PI / 2
      mesh.position.z = 20
      scene.add(mesh)
    } );
  }
  // controls.maxDistance = 20;
  // controls.enablePan = false;
  function animate() {
    requestAnimationFrame( animate );
    TWEEN.update()
    {
      // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
      raycaster.setFromCamera( mouse, camera );
    }
      renderer.render( scene, camera );
    // controls.update();
  }

  var go = document.getElementById('go')
  
  go.addEventListener('click', function () {
    var value = document.getElementById('input').value
    // camera.fov = 35
    // camera.lookAt(controls.object.up)
    // camera.updateProjectionMatrix();
    context.clearRect(0, 10, 2000, 16)
    context.save()
    context.fillStyle = '#1e2d3f'
    context.fillRect(0, 10, 2000, 16)
    context.restore()
    context.fillText(value, 24, 20)
    // canvasTexture = new THREE.CanvasTexture(
    //   document.querySelector("#text")
    // )
    sprite.material.map.needsUpdate = true
    renderer.render( scene, camera );
  }, false)

  animate();