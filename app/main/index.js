import { app, BrowserWindow, ipcMain } from 'electron'
import process from 'process'
import Tray from './tray'
import configureStore from './store'
import appWindow from './appWindow'

app.dock.hide()

global.__base = `${__dirname}/`

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')() // eslint-disable-line global-require
}

app.on('window-all-closed', () => {
  app.dock.hide()
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('ready', (e, winId) => {
  const win = BrowserWindow.fromId(winId)
  win.show()
  win.focus()
  app.dock.show()
})

app.on('ready', () => {
  const store = configureStore()
  new Tray(store)

  //Open window
  appWindow()
})

