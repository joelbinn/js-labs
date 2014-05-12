(function (undefined) {
  function initWebGL(canvas) {

    var gl = null;
    var msg = "Your browser does not support WebGL, " +
      "or it is not enabled by default.";
    try {
      gl = canvas.getContext("experimental-webgl");
    }
    catch (e) {
      msg = "Error creating WebGL Context!: " + e.toString();
    }

    if (!gl) {
      alert(msg);
      throw new Error(msg);
    }

    return gl;
  }

  function initViewport(gl, canvas) {
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  function initMatrices(canvas) {
    // Create a model view matrix with object at 0, 0, -8
    var modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -8]);

    // Create a project matrix with 45 degree field of view
    var projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 10000);

    var rotationAxis = vec3.create();
    vec3.normalize(rotationAxis, [1, 1, 1]);

    return {
      projectionMatrix: projectionMatrix,
      modelViewMatrix: modelViewMatrix,
      rotationAxis: rotationAxis
    };
  }

  // Create the vertex, color and index data for a multi-colored cube
  function createCube(gl) {

    // Vertex Data
    var vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    var verts = [
      // Front face
      -1.0, -1.0, 1.0,
      1.0, -1.0, 1.0,
      1.0, 1.0, 1.0,
      -1.0, 1.0, 1.0,

      // Back face
      -1.0, -1.0, -1.0,
      -1.0, 1.0, -1.0,
      1.0, 1.0, -1.0,
      1.0, -1.0, -1.0,

      // Top face
      -1.0, 1.0, -1.0,
      -1.0, 1.0, 1.0,
      1.0, 1.0, 1.0,
      1.0, 1.0, -1.0,

      // Bottom face
      -1.0, -1.0, -1.0,
      1.0, -1.0, -1.0,
      1.0, -1.0, 1.0,
      -1.0, -1.0, 1.0,

      // Right face
      1.0, -1.0, -1.0,
      1.0, 1.0, -1.0,
      1.0, 1.0, 1.0,
      1.0, -1.0, 1.0,

      // Left face
      -1.0, -1.0, -1.0,
      -1.0, -1.0, 1.0,
      -1.0, 1.0, 1.0,
      -1.0, 1.0, -1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    var faceColors = [
      [1.0, 0.0, 0.0, 1.0], // Front face
      [0.0, 1.0, 0.0, 1.0], // Back face
      [0.0, 0.0, 1.0, 1.0], // Top face
      [1.0, 1.0, 0.0, 1.0], // Bottom face
      [1.0, 0.0, 1.0, 1.0], // Right face
      [0.0, 1.0, 1.0, 1.0]  // Left face
    ];
    var vertexColors = [];
    for (var i in faceColors) {
      var color = faceColors[i];
      for (var j = 0; j < 4; j++) {
        vertexColors = vertexColors.concat(color);
      }
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn)
    var cubeIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);
    var cubeIndices = [
      0, 1, 2, 0, 2, 3,    // Front face
      4, 5, 6, 4, 6, 7,    // Back face
      8, 9, 10, 8, 10, 11,  // Top face
      12, 13, 14, 12, 14, 15, // Bottom face
      16, 17, 18, 16, 18, 19, // Right face
      20, 21, 22, 20, 22, 23  // Left face
    ];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);

    return {
      buffer: vertexBuffer,
      colorBuffer: colorBuffer,
      indices: cubeIndexBuffer,
      vertSize: 3,
      nVerts: 24,
      colorSize: 4,
      nColors: 24,
      nIndices: 36,
      primtype: gl.TRIANGLES
    };
  }

  function createShader(gl, str, type) {
    var shader;
    if (type == "fragment") {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (type == "vertex") {
      shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
      return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(shader));
      return null;
    }

    return shader;
  }

  function initShader(gl) {
    var vertexShaderSource =

      "    attribute vec3 vertexPos;\n" +
      "    attribute vec4 vertexColor;\n" +
      "    uniform mat4 modelViewMatrix;\n" +
      "    uniform mat4 projectionMatrix;\n" +
      "    varying vec4 vColor;\n" +
      "    void main(void) {\n" +
      "		     // Return the transformed and projected vertex value\n" +
      "        gl_Position = projectionMatrix * modelViewMatrix * \n" +
      "            vec4(vertexPos, 1.0);\n" +
      "        // Output the vertexColor in vColor\n" +
      "        vColor = vertexColor;\n" +
      "    }\n";

    var fragmentShaderSource =
      "    precision mediump float;\n" +
      "    varying vec4 vColor;\n" +
      "    void main(void) {\n" +
      "      // Return the pixel color: always output white\n" +
      "      gl_FragColor = vColor;\n" +
      "    }\n";

    // load and compile the fragment and vertex shader
    //var fragmentShader = getShader(gl, "fragmentShader");
    //var vertexShader = getShader(gl, "vertexShader");
    var fragmentShader = createShader(gl, fragmentShaderSource, "fragment");
    var vertexShader = createShader(gl, vertexShaderSource, "vertex");

    // link them together into a new program
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // get pointers to the shader params
    var shaderVertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPos");
    gl.enableVertexAttribArray(shaderVertexPositionAttribute);

    var shaderVertexColorAttribute = gl.getAttribLocation(shaderProgram, "vertexColor");
    gl.enableVertexAttribArray(shaderVertexColorAttribute);

    var shaderProjectionMatrixUniform = gl.getUniformLocation(shaderProgram, "projectionMatrix");
    var shaderModelViewMatrixUniform = gl.getUniformLocation(shaderProgram, "modelViewMatrix");


    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert("Could not initialise shaders");
    }

    return {
      shaderProgram: shaderProgram,
      shaderVertexPositionAttribute: shaderVertexPositionAttribute,
      shaderVertexColorAttribute: shaderVertexColorAttribute,
      shaderProjectionMatrixUniform: shaderProjectionMatrixUniform,
      shaderModelViewMatrixUniform: shaderModelViewMatrixUniform
    }
  }

  function draw(gl, obj, matrices, shaderSystem) {

    // clear the background (with black)
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // set the shader to use
    gl.useProgram(shaderSystem.shaderProgram);

    // connect up the shader parameters: vertex position, color and projection/model matrices
    // set up the buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);
    gl.vertexAttribPointer(shaderSystem.shaderVertexPositionAttribute, obj.vertSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.colorBuffer);
    gl.vertexAttribPointer(shaderSystem.shaderVertexColorAttribute, obj.colorSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indices);

    gl.uniformMatrix4fv(shaderSystem.shaderProjectionMatrixUniform, false, matrices.projectionMatrix);
    gl.uniformMatrix4fv(shaderSystem.shaderModelViewMatrixUniform, false, matrices.modelViewMatrix);

    // draw the object
    gl.drawElements(obj.primtype, obj.nIndices, gl.UNSIGNED_SHORT, 0);
  }

  var duration = 5000; // ms
  var currentTime = Date.now();

  function animate(matrices) {
    var now = Date.now();
    var deltat = now - currentTime;
    currentTime = now;
    var fract = deltat / duration;
    var angle = Math.PI * 2 * fract;
    mat4.rotate(matrices.modelViewMatrix, matrices.modelViewMatrix, angle, matrices.rotationAxis);
  }

  function run(gl, cube, matrices, shader) {

    requestAnimationFrame(function () {
      run(gl, cube, matrices, shader);
    });
    draw(gl, cube, matrices, shader);
    animate(matrices);
  }

  $(document).ready(
    function () {
      var canvas = document.getElementById("webglcanvas");
      var gl = initWebGL(canvas);
      initViewport(gl, canvas);
      var matrices = initMatrices(canvas);
      var cube = createCube(gl);
      var shaderSystem = initShader(gl);
      run(gl, cube, matrices, shaderSystem);
    }
  );
}());
