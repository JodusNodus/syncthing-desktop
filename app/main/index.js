import { app } from 'electron'
import process from 'process'
import Tray from './tray'
import configureStore from './store'
import appWindow from './utils/app-window'
import { notificationWindow } from './utils/notify'
import { getClientConfig } from './actions/config'
import stateHandler from './state-change'
import { mainEvents } from './events'

// app.dock.hide()

global.__base = `${__dirname}/`

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')() // eslint-disable-line global-require
}

app.on('ready', () => {
  //Configure and assign the redux store
  const store = configureStore()

  //Initialize tray menu
  const tray = new Tray(store)

  //Subscribe to state changes
  store.subscribe(stateHandler({store, tray}))

  //Listen for events
  mainEvents(store)

  //Open hidden notification window
  notificationWindow()

  //Retrieve the config from local storage
  store.dispatch(getClientConfig())

  //Open app window
  appWindow()

})
