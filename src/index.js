const PIXI = require('pixi.js')

// ALIASES
const Application = PIXI.Application
const loader = PIXI.loader
const resources = PIXI.loader.resources
const Sprite = PIXI.Sprite
const utils = PIXI.utils

// Default: Use WebGL
let type = 'WebGL'

// If WebGL is not supported: use canvas
if (!utils.isWebGLSupported()) {
  type = 'canvas'
}

let app = new Application({
  width: 1000,
  height: 800,
  antialias: true,
  transparent: false,
  resolution: 1
})

app.renderer.view.style.position = 'absolute'
app.renderer.view.style.display = 'block'
app.renderer.autoResize = true
app.renderer.resize(window.innerWidth, window.innerHeight)

// Create a Sprite
PIXI.loader
  .add('./assets/player.png')
  .load(setup)

// Launched when PIXI load images
function setup () {
  let player = new Sprite(resources['./assets/player.png'].texture)
  // Display the sprite
  app.stage.addChild(player)
}

// Render the view
document.body.appendChild(app.view)