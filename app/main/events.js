import { app, BrowserWindow, powerMonitor, ipcMain } from 'electron'
import notify from './utils/notify'
import { connections, myID } from './actions/system'
import { folderStatus } from './actions/db'

export default function events(st, store){
  ipcMain.on('ready', (e, winId) => {
    const win = BrowserWindow.fromId(winId)
    win.show()
    win.focus()
    app.dock.show()
  })

  app.on('window-all-closed', () => {
    app.dock.hide()
    if (process.platform !== 'darwin') app.quit()
  })

  //Listen for devices connecting
  st.on('deviceConnected', ({ id, addr }) => {
    const { name } = store.getState().devices.filter(device => device.deviceID == id)[0]
    notify(`Connected to ${name}`, `on ${addr}`)
    store.dispatch(connections(st))
  })
  //Listen for devices disconnecting
  st.on('deviceDisconnected', ({id}) => {
    const { name } = store.getState().devices.filter(device => device.deviceID == id)[0]
    notify(`${name} disconnected`, 'Syncing to this device is paused')
    store.dispatch(connections(st))
  })
  //Listen for errors
  st.on('error', () => {
    store.dispatch({ type: 'CONNECTION_ERROR' })
  })
  //Listen for folder state changes
  st.on('stateChanged', ({ folder, to }) => {
    const state = store.getState()
    switch (to) {
    case 'syncing':
      notify('Syncthing', `${folder} is Syncing`)
      store.dispatch(folderStatus(state.folders, st))
      break
    case 'error':
      notify(`${folder} has an Error`, 'click to see the error in the dashboard.')
      break
    case 'idle':
      store.dispatch(folderStatus(state.folders, st))
      break
    }
  })

  //Check periodicaly for connections
  setInterval(() => {
    const state = store.getState()
    if(state.connected && state.power == 'awake'){
      store.dispatch(connections(st))
      store.dispatch(myID(st))
    }
  }, 2000)

  //Dispatch action on suspension changes
  powerMonitor.on('suspend', () => {
    store.dispatch({ type: 'SUSPEND' })
  })
  //
  //Dispatch action on resumation changes
  powerMonitor.on('resume', () => {
    store.dispatch({ type: 'RESUME' })
  })

  ipcMain.on('renderer-reload', (event, action) => {
    delete require.cache[require.resolve('./reducers')]
    store.replaceReducer(require('./reducers'))
    event.returnValue = true
  })
}
