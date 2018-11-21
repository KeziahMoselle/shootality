const PIXI = require('pixi.js')

// Default: Use WebGL
let type = 'WebGL'

// If WebGL is not supported: use canvas
if (!PIXI.utils.isWebGLSupported()) {
  type = 'canvas'
}

let app = new PIXI.Application({
  width: 256,
  height: 256
})

app.renderer.view.style.position = 'absolute'
app.renderer.view.style.display = 'block'
app.renderer.autoResize = true
app.renderer.resize(window.innerWidth, window.innerHeight)

// Render the view
document.body.appendChild(app.view)