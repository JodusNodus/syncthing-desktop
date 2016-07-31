import notify from './utils/notify'
import _ from 'lodash'

import { getConnections, getMyID, getServiceConfig, getErrors, getConfigInSync } from './actions/system'
import { showFolderRejected } from './actions/folder-rejected'
import { getFolderStats } from './actions/stats'
import { getSingleFolderStatus } from './actions/db'
import { getDevice } from './reducers/devices'
import { ipcMain, app, powerMonitor, BrowserWindow } from 'electron'

let interval

export function clearEventListeners() {
  //Clear interval
  if(interval) clearInterval(interval)

  //Clear all previous syncthing listeners
  if(global.st){
    global.st.removeAllListeners('deviceConnected')
    global.st.removeAllListeners('deviceDisconnected')
    global.st.removeAllListeners('error')
    global.st.removeAllListeners('stateChanged')
    global.st.removeAllListeners('configSaved')
    global.st.removeAllListeners('folderSummary')
    global.st.removeAllListeners('folderCompletion')
    global.st.removeAllListeners('folderRejected')
    global.st.removeAllListeners('ping')
    global.st.removeAllListeners('localIndexUpdated')
    global.st.removeAllListeners('downloadProgress')
  }
}

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

    //Remove event listeners
    clearEventListeners()
    console.log('stopped listening')
  })

  //Dispatch action on resumation changes
  powerMonitor.on('resume', () => {
    store.dispatch({ type: 'RESUME' })

    //Start listening again
    stEvents(store)
    console.log('resumed listening')
  })

  // if (process.env.NODE_ENV === 'development') {
  //
  //   //Listen for hot reloads
  //   ipcMain.on('renderer-reload', event => {
  //     delete require.cache[require.resolve('./reducers/index')]
  //     store.replaceReducer(require('./reducers/index'))
  //     event.returnValue = true
  //   })
  // }

}

export function stEvents(store){
  clearEventListeners()
  if(!global.st) return

  //Listen for devices connecting
  global.st.on('deviceConnected', ({ id, addr }) => {
    const { name } = getDevice(store.getState(), id)
    notify(`Connected to ${name}`, `on ${addr}`)
    store.dispatch(getConnections())
  })

  //Listen for devices disconnecting
  global.st.on('deviceDisconnected', ({id}) => {
    const { name } = getDevice(store.getState(), id)
    notify(`${name} disconnected`, 'Syncing to this device is paused')
    store.dispatch(getConnections())
  })

  //Listen for connection errors
  global.st.on('error', (error) => {
    store.dispatch({ type: 'CONNECTION_ERROR', error })
  })

  //Listen for folder state changes
  global.st.on('stateChanged', ({ folder, from, to }) => {
    if(from == 'scanning'){
      store.dispatch(getFolderStats())
    }

    store.dispatch({
      type: 'FOLDER_STATE_CHANGE',
      payload: to,
      id: folder,
    })
  })

  //Listen for syncthing config changes
  global.st.on('configSaved', () => {
    const myID = store.getState().myID
    store.dispatch(getServiceConfig(myID))
    store.dispatch(getConfigInSync())
  })


  //Listen for local status changes to folder
  global.st.on('folderSummary', ({folder, summary}) => {
    const state = store.getState()
    const folderState = state.folders.folders[folder]
    const statusState = state.folders.status[folder]

    if(statusState && statusState.needBytes > 0 && summary.needBytes < 1){
      console.log('completed syncing')
      notify(folderState.label || folder, 'has completed syncing.')
    }

    store.dispatch({
      type: 'FOLDER_STATUS_GET_SUCCESS',
      id: folder,
      payload: summary,
    })
  })

  //Listen for changes in completion
  global.st.on('folderCompletion', ({completion, folder, device}) => {
    store.dispatch({
      type: 'DEVICE_FOLDER_COMPLETION_GET_SUCCESS',
      payload: completion,
      folder,
      device,
    })
  })

  //Listen for new folders shared with the current device
  global.st.on('folderRejected', payload => {
    store.dispatch(showFolderRejected(payload))
  })

  global.st.on('localIndexUpdated', ({folder}) => {
    store.dispatch(getSingleFolderStatus(folder))
  })

  global.st.on('downloadProgress', folders => {
    _.mapValues(folders, (payload, id) => {
      store.dispatch({
        type: 'DOWNLOAD_PROGRESS',
        id,
        payload,
      })
    })
  })

  //Check periodicaly for system status & errors
  interval = setInterval(() => {
    const state = store.getState()
    if(state.power == 'awake'){
      store.dispatch(getMyID())
      store.dispatch(getErrors())
    }

  }, 3000)

}
