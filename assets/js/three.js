import * as THREE from "three";
const heroElement = document.getElementById("hero");

if (heroElement) {
  let scene, camera, renderer;
  let geometry, material, sphere;
  let lineGeometry, lineMaterial, lineSegments;
  let vertices = [];
  let highlightVertices = [];
  let controls = {
    totalPoints: 50,
    distributionConstant: (1 + Math.sqrt(5)) / 2 - 1,
    pointSize: 3,
    rotationSpeed: 0.002,
    pointColor: 0x9400d3,
    highlightPercentage: 7,
    offset: 0,
    highlightEnabled: false,
    lineColor: 0x44444444,
    lineOpacity: 0.1,
  };

  function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 500;
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setClearColor(0x000000, 0); // Set clear color to transparent
    renderer.setSize(window.innerWidth, window.innerHeight);
    heroElement.appendChild(renderer.domElement);

    geometry = new THREE.BufferGeometry();
    material = new THREE.PointsMaterial({
      color: controls.pointColor,
      size: controls.pointSize,
    });
    sphere = new THREE.Points(geometry, material);
    scene.add(sphere);

    createSphere(controls.totalPoints, controls.distributionConstant);
    createLines();
    highlightPoints();
    animate();
  }

  function createSphere(totalPoints, phi) {
    vertices = [];
    highlightVertices = [];
    for (let i = 0; i < totalPoints; i++) {
      let theta = 2 * Math.PI * i * phi;
      let y = 1 - (i / (totalPoints - 1)) * 2;
      let radius = Math.sqrt(1 - y * y);
      let x = Math.cos(theta) * radius;
      let z = Math.sin(theta) * radius;
      vertices.push(x * 200, y * 200, z * 200);
    }
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    geometry.attributes.position.needsUpdate = true;
    createLines();
    highlightPoints();
  }

  function createLines() {
    if (lineSegments) scene.remove(lineSegments);

    const indices = [];
    for (let i = 0; i < controls.totalPoints; i++) {
      for (let j = i + 1; j < controls.totalPoints; j++) {
        indices.push(i, j);
      }
    }

    lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setIndex(indices);
    lineGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );

    lineMaterial = new THREE.LineBasicMaterial({
      color: controls.lineColor,
      transparent: true,
      opacity: controls.lineOpacity,
    });

    lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineSegments);
  }

  function highlightPoints() {
    highlightVertices = [];
    for (let i = 0; i < controls.totalPoints; i++) {
      if ((i + controls.offset) % controls.highlightPercentage === 0) {
        highlightVertices.push(
          vertices[i * 3],
          vertices[i * 3 + 1],
          vertices[i * 3 + 2]
        );
      }
    }
    updateHighlight();
  }

  function updateHighlight() {
    const existingHighlightPoints = scene.getObjectByName("highlightPoints");
    if (existingHighlightPoints) {
      scene.remove(existingHighlightPoints);
    }

    if (controls.highlightEnabled && highlightVertices.length > 0) {
      const highlightGeometry = new THREE.BufferGeometry();
      highlightGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(highlightVertices, 3)
      );
      const highlightMaterial = new THREE.PointsMaterial({
        color: 0xffd700,
        size: controls.pointSize * 1.1,
      });
      const highlightPoints = new THREE.Points(
        highlightGeometry,
        highlightMaterial
      );
      highlightPoints.name = "highlightPoints";
      scene.add(highlightPoints);
    }
  }

  function toggleHighlight() {
    updateHighlight();
  }

  function updateSphere() {
    createSphere(controls.totalPoints, controls.distributionConstant);
    updateHighlight();
  }

  function updatePointSize() {
    material.size = controls.pointSize;
    material.needsUpdate = true;
    updateHighlight();
  }

  function updatePointColor() {
    material.color.set(controls.pointColor);
  }

  function animate() {
    requestAnimationFrame(animate);
    scene.rotation.y += controls.rotationSpeed;
    if (lineSegments) lineSegments.rotation.y = sphere.rotation.y;
    renderer.render(scene, camera);
  }

  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  init();
}
