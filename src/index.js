const PIXI = require('pixi.js')
const keyboard = require('./libs/keyboard')
const hit = require('./libs/hit')

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


// Entities

let player
let enemies = []
let state
let message

// Launched when PIXI load images
function setup () {
  console.log('Loaded !')
  // Create the player sprite
  player = new Sprite(resources['./assets/player.png'].texture)
  player.x = 10
  player.y = 40
  app.stage.addChild(player)
  // Generate enemies
  generateEnemies(randomInt(4, 10))
  // Keyboard
  const spacebar = keyboard(' ')
  spacebar.press = () => {
    console.log('SpaceBar pressed')
  }
  // Define the default state of the game
  state = play
  // Game Loop
  app.ticker.add(delta => gameLoop(delta))
}

function gameLoop (delta) {
  state(delta)
}

function play (delta) {
  enemies.forEach(enemy => {
    if (hit(player, enemy)) {
      console.log('Hit')
    } else {
      console.log('No collision')
    }
  })
}

function generateEnemies (numberOfEnemies) {
  const spacing = 100
  for (let i = 0; i < numberOfEnemies; i++) {
    let enemy = new Sprite(resources['./assets/enemy.png'].texture)
    let x = (spacing * i * 1.5) + 150
    let y = 40

    enemy.x = x
    enemy.y = y
    enemies.push(enemy)
    app.stage.addChild(enemy)
    app.ticker.add(delta => EnemyMove(delta, enemy))
  }
  function EnemyMove (delta, enemy) {
    enemy.x += -2
  }
}

function randomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Render the view
document.body.appendChild(app.view)