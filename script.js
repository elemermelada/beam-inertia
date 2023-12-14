const gridSize = 20; // CHECK CSS

var mouseDown = false;
var gridValues = Array(gridSize * gridSize).fill(false);

function load() {
  // populate grid
  const gridContainer = document.getElementById("grid_container");
  for (let i = 0; i < gridSize * gridSize; i++) {
    gridContainer.innerHTML =
      gridContainer.innerHTML +
      '<div id="' +
      (i + 1) +
      '" class="grid_element"></div>';
  }

  // load event handlers
  document.body.onmousedown = function () {
    mouseDown = true;
  };
  document.body.onmouseup = function () {
    mouseDown = false;
  };

  [].forEach.call(
    document.getElementsByClassName("grid_element"),
    (element) => {
      const id = element.id;
      element.onmouseenter = function () {
        if (mouseDown) {
          updateGrid(id, element);
        }
      };
      element.onmousedown = function () {
        updateGrid(id, element);
      };
    }
  );

  setInterval(() => {
    const cm = getSurfaceCenter();
    if (isNaN(cm.x)) return;
    const id = getId(Math.round(cm.x), Math.round(cm.y));
    document.getElementById(id).style.border = "1px solid red";
    setTimeout(() => {
      document.getElementById(id).style.border = "";
    }, 500);
  }, 1000);
}

function getX(id) {
  return Math.floor((id - 1) / gridSize);
}

function getY(id) {
  return (id - 1) % gridSize;
}
function getId(x, y) {
  return x * gridSize + y + 1;
}

function updateGrid(id, element) {
  gridValues[id - 1] = !gridValues[id - 1];
  element.style.backgroundColor = gridValues[id - 1] ? "black" : "aqua";
  const cm = getSurfaceCenter();
  document.getElementById("info_surface_center").innerHTML =
    "Surface Center: " + JSON.stringify(cm);

  const I = getSurfaceInertia(cm);
  document.getElementById("info_surface_inertia").innerHTML =
    "Surface Inertia: " + JSON.stringify(I);
}

function getSurfaceCenter() {
  var totalSurface = 0;
  var totalX = 0;
  var totalY = 0;
  for (let i = 0; i < gridSize * gridSize; i++) {
    const id = i + 1;
    if (gridValues[i]) {
      totalSurface++;
      totalX += getX(id);
      totalY += getY(id);
    }
  }
  return { x: totalX / totalSurface, y: totalY / totalSurface };
}

function getSurfaceInertia(center) {
  const cx = center.x;
  const cy = center.y;
  var totalIx = 0;
  var totalIy = 0;
  for (let i = 0; i < gridSize * gridSize; i++) {
    const id = i + 1;
    if (gridValues[i]) {
      totalIx += (getX(id) - cx) ** 2;
      totalIy += (getY(id) - cy) ** 2;
    }
  }
  return { Ix: totalIx, Iy: totalIy };
}
