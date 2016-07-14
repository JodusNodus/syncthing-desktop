import { app, BrowserWindow, powerMonitor, ipcMain } from 'electron'
import notify from './utils/notify'
import { getConnections, getMyID, getServiceConfig } from './actions/system'
import { getFolderStatus } from './actions/db'

export function mainEvents(store) {

  ipcMain.on('ready', (e, winId) => {
    const win = BrowserWindow.fromId(winId)
    win.show()
    win.focus()
    app.dock.show()
  })

  app.on('window-all-closed', () => {
    app.dock.hide()
    if (process.platform !== 'darwin')
      app.quit()
  })
  
  //Dispatch action on suspension changes
  powerMonitor.on('suspend', () => {
    store.dispatch({ type: 'SUSPEND' })
  })

  //Dispatch action on resumation changes
  powerMonitor.on('resume', () => {
    store.dispatch({ type: 'RESUME' })
  })

  if (process.env.NODE_ENV === 'development') {

    //Listen for hot reloads
    ipcMain.on('renderer-reload', event => {
      delete require.cache[require.resolve('./reducers/index')]
      store.replaceReducer(require('./reducers/index'))
      event.returnValue = true
    })
  }

}
export function stEvents(store){

  //Listen for devices connecting
  global.st.on('deviceConnected', ({ id, addr }) => {
    const { name } = store.getState().devices.filter(device => device.deviceID == id)[0]
    notify(`Connected to ${name}`, `on ${addr}`)
    store.dispatch(getConnections())
  })
  //Listen for devices disconnecting
  global.st.on('deviceDisconnected', ({id}) => {
    const { name } = store.getState().devices.filter(device => device.deviceID == id)[0]
    notify(`${name} disconnected`, 'Syncing to this device is paused')
    store.dispatch(getConnections())
  })
  //Listen for errors
  global.st.on('error', () => {
    store.dispatch({ type: 'CONNECTION_ERROR' })
  })
  //Listen for folder state changes
  global.st.on('stateChanged', ({ folder, to }) => {
    const state = store.getState()
    switch (to) {
    case 'syncing':
      notify('Syncthing', `${folder} is Syncing`)
      store.dispatch(getFolderStatus(state.folders))
      break
    case 'error':
      notify(`${folder} has an Error`, 'click to see the error in the dashboard.')
      break
    case 'idle':
      store.dispatch(getFolderStatus(state.folders))
      break
    }
  })

  //Listen for syncthing config changes
  global.st.on('configSaved', () => {
    const myID = store.getState().myID
    store.dispatch(getServiceConfig(myID))
  })

  //Check periodicaly for connections
  setInterval(() => {
    const state = store.getState()
    if(state.connected && state.power == 'awake'){
      store.dispatch(getConnections())
      store.dispatch(getMyID())
    }
  }, 2000)

}
