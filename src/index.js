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
  .add('./assets/space.png')
  .add('./assets/enter.png')
  .on('progress', progressHandler)
  .load(setup)

// Progress
function progressHandler (loader, resource) {
  console.log(`Loading : ${resource.url} [${loader.progress}%]`)
}


// Entities
let player
let enemies = []
let enterBtn
let scoreText
let state
let playerHit = false
let spacebarPressed = false
let score = 0

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

  // Generate "Press enter to begin"
  enterBtn = new Sprite(resources['./assets/enter.png'].texture)
  enterBtn.x = 250
  enterBtn.y = 20
  app.stage.addChild(enterBtn)

  setInterval(() => {
    if (enterBtn.alpha === 1) {
      enterBtn.alpha = 0.5
    } else {
      enterBtn.alpha = 1
    }
  }, 1000);

  // Generate space button
  space = new Sprite(resources['./assets/space.png'].texture)
  space.x = 10
  space.y = 20
  space.alpha = 0.5
  app.stage.addChild(space)

  // Generate text
  scoreText = new PIXI.Text('Awaiting score...', {
    fontFamily: 'Arial',
    fontSize: 24,
    fill: 0xffffff
  })
  scoreText.x = 570
  scoreText.y = 35
  app.stage.addChild(scoreText)

  // Define the default state of the game
  state = play

  // Keyboard
  const spacebar = keyboard(' ')
  const enter = keyboard('Enter')
  spacebar.press = () => {
    spacebarPressed = true
    setInterval(() => {
      spacebarPressed = false
    }, 50);
    // Show SpaceBar icon
    space.alpha = 1
  }
  spacebar.release = () => {
    spacebarPressed = false
    // Hide SpaceBar icon
    space.alpha = 0.5
  }
  // When Enter is pressed, begin the game
  enter.press = () => {
    enterBtn.visible = false
    scoreText.text = `[SCORE] ${score} points`
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
    enemy.x += -6
    // Collisions
    if (hit(player, enemy) && spacebarPressed) {
      // Hide the enemy
      enemy.visible = 0
      // Remove it from the array
      const enemyId = enemies.indexOf(enemy)
      enemies.splice(enemyId, 1)
      // Increment the score
      score += 1
      scoreText.text = `[SCORE] ${score} points`
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