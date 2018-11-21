const PIXI = require('pixi.js')

let type = 'WebGL'

if (!PIXI.utils.isWebGLSupported()) {
  type = 'canvas'
}

PIXI.utils.sayHello(type)