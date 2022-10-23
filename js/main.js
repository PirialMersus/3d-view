
var cubeMapArr1 = "../img/image_2021-06-02_10-07-23.png";

var cubeMapArr2 = "../img/image_2021-06-02_10-07-39.png";;

var equirectangularOne =
  "../img/image_2021-06-02_10-07-09.png";

var trimBtnOne = document.querySelector(".switch-trim-1");
var trimBtnTwo = document.querySelector(".switch-trim-2");
var trimBtnThree = document.querySelector(".switch-trim-3");
var leftBtn = document.querySelector(".left");
var rightBtn = document.querySelector(".right");
var upBtn = document.querySelector(".up");
var downBtn = document.querySelector(".down");
var zoomInBtn = document.querySelector(".in");
var zoomOutBtn = document.querySelector(".out");
var container = document.querySelector(".viewer-container");

var panorama, viewer, camera, texture;

var showBBD = true;

function setPanorama(assets) {
    panorama = new PANOLENS.ImagePanorama(assets);
  // panorama.addEventListener( 'onLoad', () => {
  //   texture = panorama.getTexture();
  // });
}

function addViewer() {
  viewer = new PANOLENS.Viewer({
    container: container,
    controlBar: false,
  });
  viewer.OrbitControls.maxFov = 80;
  viewer.OrbitControls.minFov = 50;
  viewer.camera.position.set(0, 0.12, -0.5);
}

function updatePanorama(arr) {
  viewer.animate();
  viewer.remove(panorama);
  panorama.dispose();
  setPanorama(arr);
  viewer.add(panorama);
  if (showBBD) {
    viewer.camera.position.set(0, 0.12, -0.5);
  } else {
    viewer.camera.position.set(0.96, 0.23, 0.14);
  }
  // panorama.material.map = NEW_TEXUTRE;
  // texture = panorama.getTexture();
  // texture.minFilter = THREE.minFilter;
}

function clickOne() {
  showBBD = true;
  updatePanorama(cubeMapArr1);
}

function clickTwo() {
  showBBD = true;
  updatePanorama(cubeMapArr2);
}

function clickThree() {
  if (showBBD) {
    showBBD = false;
    updatePanorama(equirectangularOne);
  } else {
    showBBD = true;
    updatePanorama(cubeMapArr2);
  }
}

function zoom(direction) {
  var currentZoom = viewer.camera.fov;
  var newZoom = 0;
  switch (direction) {
    case "in":
      newZoom = currentZoom - 10;
      if (newZoom < 30) newZoom = 30;
      break;
    case "out":
      newZoom = currentZoom + 10;
      if (newZoom > 90) newZoom = 90;
      break;
  }
  viewer.setCameraFov(newZoom);
}

var ROTATION_POSITION = 0.01;
var rotating = false,
  rotationInterval;

function rotateLeftRigth(direction) {
  if (rotating) {
    let rp = direction === "left" ? -ROTATION_POSITION : ROTATION_POSITION;
    rotationInterval = setInterval(() => {
      viewer.OrbitControls.rotateLeft(rp);
    }, 15);
  }
}

function rotateUpDown(direction) {
  if (rotating) {
    let rp = direction === "up" ? -ROTATION_POSITION : ROTATION_POSITION;
    rotationInterval = setInterval(() => {
      viewer.OrbitControls.rotateUp(rp);
    }, 15);
  }
}

function startRotation(dir) {
  clearInterval(rotationInterval);
  if (!rotating) {
    rotating = true;
    if (dir === "left" || dir === "right") {
      rotateLeftRigth(dir);
    }
    if (dir === "up" || dir === "down") {
      rotateUpDown(dir);
    }
  }
}

function stopRotation() {
  if (rotating) {
    rotating = false;
    clearInterval(rotationInterval);
  }
}

setPanorama(cubeMapArr2);
addViewer();
viewer.add(panorama);

trimBtnOne.onclick = clickOne;
trimBtnTwo.onclick = clickTwo;
trimBtnThree.onclick = clickThree;

leftBtn.addEventListener("mousedown", () => startRotation("left"));
leftBtn.addEventListener("mouseup", stopRotation);
rightBtn.addEventListener("mousedown", () => startRotation("right"));
rightBtn.addEventListener("mouseup", stopRotation);
upBtn.addEventListener("mousedown", () => startRotation("up"));
upBtn.addEventListener("mouseup", stopRotation);
downBtn.addEventListener("mousedown", () => startRotation("down"));
downBtn.addEventListener("mouseup", stopRotation);
zoomInBtn.onclick = () => zoom("in");
zoomOutBtn.onclick = () => zoom("out");
