const { app, BrowserWindow } = require('electron')
const path = require('path')

let window

app.on('ready', () => {
  window = new BrowserWindow({
    width: 600,
    height: 200,
    backgroundColor: '#eeeeee',
    title: 'GitHub Game Off 2018'
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