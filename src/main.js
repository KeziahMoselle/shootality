const { app, BrowserWindow } = require('electron')
const path = require('path')

let window

app.on('ready', () => {
  window = new BrowserWindow({
    width: 800,
    height: 400,
    backgroundColor: '#eeeeee',
    title: 'GitHub Game Off 2018',
    icon: path.join(__dirname, 'assets', 'player.png')
  })
  window.loadFile(path.join(__dirname, 'index.html'))
  window.webContents.openDevTools()

  window.on('closed', () => {
    window = null
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})