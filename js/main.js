/*
  Develop powered by Viewy SAS

  Developers: Sergio Morales & Santiago Arguelles
  Design: Juan Camilo Maz

  visit viewy.com.co for more information
*/

import * as THREE from '../build/three.module.js';
import { GLTFLoader } from '../lib/GLTFLoader.js';

let scene, camera, renderer, clock, deltaTime, totalTime;

let arToolkitSource, arToolkitContext;

let markerRoot1, markerRoot2;


let audioLoader;
let listener;

//arbol
let mixerArbol, mixerArbolText;
let soundArbol;
let audioArbol = true;
let Arbol, ArbolText;
let arbolActive = false;
//

//queso
let mixerQueso;
let soundQueso;
let audioQueso = true;
let Queso;
let quesoActive = false;
let end = false;
//

//loads
let audio1 = false;
let audio2 = false;

let loader = new GLTFLoader();

initialize();
animate();

function initialize() {
  scene = new THREE.Scene();

  let dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.color.setHSL(0.1, 1, 0.95);
  dirLight.position.set(- 1, 1.75, 1);
  dirLight.position.multiplyScalar(30);
  scene.add(dirLight);

  let ambientLight = new THREE.AmbientLight(0xcccccc, 0.8);
  scene.add(ambientLight);

  camera = new THREE.Camera();
  scene.add(camera);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  renderer.setClearColor(new THREE.Color('lightgrey'), 0)
  renderer.setSize(640, 480);
  renderer.domElement.style.position = 'absolute'
  renderer.domElement.style.top = '0px'
  renderer.domElement.style.left = '0px'
  document.body.appendChild(renderer.domElement);

  clock = new THREE.Clock();
  deltaTime = 0;
  totalTime = 0;

  ////////////////////////////////////////////////////////////
  // setup arToolkitSource
  ////////////////////////////////////////////////////////////

  arToolkitSource = new THREEx.ArToolkitSource({
    sourceType: 'webcam',
  });

  function onResize() {
    arToolkitSource.onResize()
    arToolkitSource.copySizeTo(renderer.domElement)
    if (arToolkitContext.arController !== null) {
      arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)
    }
  }

  arToolkitSource.init(function onReady() {
    onResize()
  });

  // handle resize event
  window.addEventListener('resize', function () {
    onResize()
  });

  ////////////////////////////////////////////////////////////
  // setup arToolkitContext
  ////////////////////////////////////////////////////////////	

  // create atToolkitContext
  arToolkitContext = new THREEx.ArToolkitContext({
    cameraParametersUrl: 'data/camera_para.dat',
    detectionMode: 'mono'
  });

  // copy projection matrix to camera when initialization complete
  arToolkitContext.init(function onCompleted() {
    camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
  });

  ////////////////////////////////////////////////////////////
  // setup markerRoots
  ////////////////////////////////////////////////////////////

  listener = new THREE.AudioListener();
  camera.add(listener);
  audioLoader = new THREE.AudioLoader();
  // build markerControls

  //Alpina Arbol

  soundArbol = new THREE.Audio(listener);

  audioLoader.load('./sounds/AlpinaArbol.wav', function (buffer) {
    soundArbol.setBuffer(buffer);
    soundArbol.setLoop(false);
    soundArbol.setVolume(1);
    // soundArbol.play();
  },
    function (xhr) {
      if ((xhr.loaded / xhr.total * 100) == 100) {
        audio1 = true;
        // console.log('audio1: ' + audio1);
      }
    },
    function (error) {
      console.log('An error happened');
    });

  markerRoot1 = new THREE.Group();
  scene.add(markerRoot1);
  let markerControls1 = new THREEx.ArMarkerControls(arToolkitContext, markerRoot1, {
    type: 'pattern', patternUrl: "data/StickerAlpina.patt",
  })

  Arbol = new THREE.Object3D();
  loader.load('./models/arbol/ArbolFull.glb', function (gltf) {
    const model = gltf.scene;
    Arbol.add(model);
    mixerArbol = new THREE.AnimationMixer(model);
    gltf.animations.forEach((clip) => {
      mixerArbol.clipAction(clip).setLoop(1, 1);
      mixerArbol.clipAction(clip).clampWhenFinished = true;
      // mixerArbol.clipAction(clip).startAt(1);
      mixerArbol.clipAction(clip).play();
    });
  });

  ArbolText = new THREE.Object3D();
  loader.load('./models/arbol/ArbolTexto.glb', function (gltf) {
    const model = gltf.scene;
    ArbolText.add(model);
    mixerArbolText = new THREE.AnimationMixer(model);
    gltf.animations.forEach((clip) => {
      mixerArbolText.clipAction(clip).setLoop(1, 1);
      // mixerArbolText.clipAction(clip).startAt(1);
      mixerArbolText.clipAction(clip).clampWhenFinished = true;
      mixerArbolText.clipAction(clip).play();
    });
    mixerArbolText.addEventListener('finished', function (e) {
      // console.log('Termino arbol');
      audioArbol = false;
    });
  });
  //

  ArbolText.position.x = 2.26;
  Arbol.add(ArbolText);
  Arbol.scale.set(0.2, 0.2, 0.2);
  markerRoot1.add(Arbol);

  //Alpina queso

  soundQueso = new THREE.Audio(listener);

  audioLoader.load('./sounds/AlpinaQueso.wav', function (buffer) {
    soundQueso.setBuffer(buffer);
    soundQueso.setLoop(false);
    soundQueso.setVolume(1);
    // soundQueso.play();
  },
    function (xhr) {
      if ((xhr.loaded / xhr.total * 100) == 100) {
        audio2 = true;
        // console.log('audio2: ' + audio2);
      }
    },
    function (error) {
      console.log('An error happened');
    });

  markerRoot2 = new THREE.Group();
  scene.add(markerRoot2);
  let markerControls2 = new THREEx.ArMarkerControls(arToolkitContext, markerRoot2, {
    type: 'pattern', patternUrl: "data/StickerQueso.patt",
  })

  Queso = new THREE.Object3D();
  loader.load('./models/queso/Queso.glb', function (gltf) {
    const model = gltf.scene;
    Queso.add(model);
    mixerQueso = new THREE.AnimationMixer(model);
    gltf.animations.forEach((clip) => {
      mixerQueso.clipAction(clip).setLoop(1, 1);
      mixerQueso.clipAction(clip).clampWhenFinished = true;
      // mixerQueso.clipAction(clip).startAt(1);
      mixerQueso.clipAction(clip).play();
    });
    mixerQueso.addEventListener('finished', function (e) {
      // console.log('Termino queso');
      if (end) {
        audioQueso = false;
      }
      end = true;
    });
  });

  Queso.scale.set(0.2, 0.2, 0.2);
  markerRoot2.add(Queso);
  //
}

window.addEventListener('touchstart', function () {

  // create empty buffer
  var buffer = myContext.createBuffer(1, 1, 22050);
  var source = myContext.createBufferSource();
  source.buffer = buffer;

  // connect to output (your speakers)
  source.connect(myContext.destination);

  // play the file
  source.noteOn(0);

}, false);

function update() {
  if (arToolkitSource.ready !== false) arToolkitContext.update(arToolkitSource.domElement);

  if (markerRoot1.visible) {
    arbolActive = true;
    if (!soundArbol.isPlaying && audioArbol) {
      soundArbol.play();
    }
  } else {
    arbolActive = false;
    if (soundArbol.isPlaying) {
      soundArbol.pause();
    }
  }

  if (markerRoot2.visible) {
    quesoActive = true;
    if (!soundQueso.isPlaying && audioQueso) {
      soundQueso.play();
    }
  } else {
    quesoActive = false;
    if (soundQueso.isPlaying) {
      soundQueso.pause();
    }
  }

  if (!soundArbol.isPlaying && !audioArbol) {
    document.getElementById('boton').style.display = 'block';
  }
  if (!soundQueso.isPlaying && !audioQueso) {
    document.getElementById('boton2').style.display = 'block';
  }
}

function render() {
  if (arbolActive) {
    if (mixerArbol != null) {
      mixerArbol.update(deltaTime);
    };

    if (mixerArbolText != null) {
      mixerArbolText.update(deltaTime);
    };
  }

  if (quesoActive) {
    if (mixerQueso != null) {
      mixerQueso.update(deltaTime);
    };
  }
  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);
  deltaTime = clock.getDelta();
  totalTime += deltaTime;

  if (audio1 && audio2) {
    update();
    render();
  }
}