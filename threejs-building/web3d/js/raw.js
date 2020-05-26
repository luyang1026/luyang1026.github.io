const gl = document.getElementById('can').getContext('webgl')

const vertexSource = `
void main () {
  gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
  gl_PointSize = 10.0;
}
`

const fragmentSource = `
precision mediump float;
uniform vec4 color;
void main () {
  gl_FragColor = color;
}
`

var frag_shader = gl.createShader(gl.FRAGMENT_SHADER)
var vert_shader = gl.createShader(gl.VERTEX_SHADER)

gl.shaderSource(frag_shader, fragmentSource)
gl.shaderSource(vert_shader, vertexSource)
gl.compileShader(frag_shader)
gl.compileShader(vert_shader)
console.log(
  gl.getShaderInfoLog(frag_shader),
  gl.getShaderInfoLog(vert_shader)
)

var program = gl.createProgram();
gl.attachShader(program, frag_shader);
gl.attachShader(program, vert_shader);
gl.linkProgram(program);

var error = gl.getProgramInfoLog(program);
console.log(gl.getProgramParameter(program, gl.LINK_STATUS), error)
gl.useProgram(program);

var color = gl.getUniformLocation(program, 'color')
gl.uniform4f(color, 0.0, 0.0, 0.0, 1.0)
gl.drawArrays(gl.POINTS, 0, 1)