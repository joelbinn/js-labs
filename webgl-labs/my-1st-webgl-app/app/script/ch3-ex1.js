(function () {

  var renderer = null,
    scene = null,
    camera = null,
    cube = null;

  var duration = 5000; // ms
  var currentTime = Date.now();

  function animate() {

    var now = Date.now();
    var deltat = now - currentTime;
    currentTime = now;
    var fract = deltat / duration;
    var angle = Math.PI * 2 * fract * 0.1;
    cube.rotation.y += angle;
  }

  function run() {
    requestAnimationFrame(function () {
      run();
    });

    // Render the scene
    renderer.render(scene, camera);

    // Spin the cube for next frame
    animate();

  }

  $(document).ready(
    function () {

      var canvas = document.getElementById("ch3ex1canvas");

      // Create the Three.js renderer and attach it to our canvas
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });

      // Set the viewport size
      renderer.setSize(canvas.width, canvas.height);

      // Create a new Three.js scene
      scene = new THREE.Scene();

      // Add  a camera so we can view the scene
      camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 4000);
      scene.add(camera);

      // Add a directional light to show off the object
      var light = new THREE.DirectionalLight(0xffffdd, 1.5);

      // Position the light out from the scene, pointing at the origin
      light.position.set(3, 1, 5);
      scene.add(light);

      // Create a shaded, texture-mapped cube and add it to the scene
      // First, create the texture map
      var mapUrl = "images/earth_atmos_2048.jpg";
      var map = THREE.ImageUtils.loadTexture(mapUrl);

      // Now, create a Phong material to show shading; pass in the map
      var material = new THREE.MeshPhongMaterial({ map: map,
        color: 0xffffff });

      // Create the cube geometry
      var geometry = new THREE.SphereGeometry(2, 64, 64);

      // And put the geometry and material together into a mesh
      cube = new THREE.Mesh(geometry, material);

      // Move the mesh back from the camera and tilt it toward the viewer
      cube.position.z = -8;
      cube.rotation.x = Math.PI / 5;
      cube.rotation.y = Math.PI / 5;

      // Finally, add the mesh to our scene
      scene.add(cube);

      // Run the run loop
      run();
    }
  );

}());