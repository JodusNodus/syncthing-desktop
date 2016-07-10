import { app } from 'electron'
import process from 'process'
import Tray from './tray'
import configureStore from './store'
import appWindow from './utils/app-window'
import { notificationWindow } from './utils/notify'

app.dock.hide()

global.__base = `${__dirname}/`

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')() // eslint-disable-line global-require
}

app.on('ready', () => {
  const store = configureStore()
  new Tray(store)

  //Open notification window
  notificationWindow()

  //Open window
  appWindow()
})

