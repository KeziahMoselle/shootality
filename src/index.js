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
  width: 600,
  height: 200,
  antialias: true,
  transparent: false,
  resolution: 1
})

app.renderer.view.style.position = 'absolute'
app.renderer.view.style.display = 'block'
app.renderer.autoResize = true
app.renderer.resize(window.innerWidth, window.innerHeight)

// Load images
PIXI.loader
  .add('./assets/player.png')
  .add('./assets/enemy.png')
  .on('progress', progressHandler)
  .load(setup)

// Progress
function progressHandler (loader, resource) {
  console.log(`Loading : ${resource.url} [${loader.progress}%]`)
}

// Launched when PIXI load images
function setup () {
  console.log('Loaded !')
  // Create the Sprite
  let player = new Sprite(resources['./assets/player.png'].texture)
  
  // Player position
  player.x = 10
  player.y = 40
  // Display the sprite
  app.stage.addChild(player)

  // Generate enemies
  const numberOfEnemies = 5
  const spacing = 64
  for(let i = 0; i < numberOfEnemies; i++) {
    let enemy = new Sprite(resources['./assets/enemy.png'].texture)
    let x = (spacing * i * 1.5) + 150
    let y = 40

    enemy.x = x
    enemy.y = y

    app.stage.addChild(enemy)
    app.ticker.add(delta => EnemyMove(delta))
    function EnemyMove(delta) {
      enemy.x += -2
    }
  }
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Render the view
document.body.appendChild(app.view)