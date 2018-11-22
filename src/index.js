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
  width: 800,
  height: 400,
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
let playerHit = false
let spacebarPressed = false

// Launched when PIXI load images
function setup () {
  console.log('Loaded !')
  // Create the player sprite
  player = new Sprite(resources['./assets/player.png'].texture)
  player.x = 10
  player.y = 200
  app.stage.addChild(player)
  // Generate enemies
  generateEnemies(randomInt(4, 10))
  // Generate text
  text = new PIXI.Text('Press Enter to play', {
    fontFamily: 'Arial',
    fontSize: 24,
    fill: 0xffffff
  })
  text.x = 300
  app.stage.addChild(text)
  // Keyboard
  const spacebar = keyboard(' ')
  const enter = keyboard('Enter')
  spacebar.press = () => {
    spacebarPressed = true
    // Show SpaceBar icon
  }
  spacebar.release = () => {
    spacebarPressed = false
    // Hide SpaceBar icon
  }
  enter.press = () => {
    // Define the default state of the game
    state = play
    // Game Loop
    app.ticker.add(delta => gameLoop(delta))
  }
}

function gameLoop (delta) {
  // Switch between play and end
  state(delta)
}

function play (delta) {
  playerHit = false

  enemies.forEach(enemy => {
    // Move the enemies
    enemy.x += -2
    // Collisions
    if (hit(player, enemy) && spacebarPressed) {
      // Kill the enemy
      enemy.alpha = 0
      text.text = ''
    }
    
    if (hit(player, enemy)) {
      // The player has been hitted
      playerHit = true
    } else {
      playerHit = false
    }
    // If the enemy hit the player
    if (playerHit) {
      player.alpha = 0.5
    } else {
      player.alpha = 1
    }
  })
}

function end () {
  // End scene when enemies.length === 0
}

function generateEnemies (numberOfEnemies) {
  const spacing = 100
  for (let i = 0; i < numberOfEnemies; i++) {
    let enemy = new Sprite(resources['./assets/enemy.png'].texture)
    let x = (spacing * i * 1.5) + 150
    let y = 200

    enemy.x = x
    enemy.y = y
    enemies.push(enemy)
    app.stage.addChild(enemy)
  }
}

function randomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Render the view
document.body.appendChild(app.view)