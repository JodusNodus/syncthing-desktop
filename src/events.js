import { notify } from "./misc"
import { myID, config, connections, folderStatus } from "./actions"

//State change subscribsion

export function stateHandler(menu, store, st, tray, buildTray){
  let previousState = store.getState()
  return () => {
    const newState = store.getState()

    if(previousState.myID !== newState.myID)
      store.dispatch(config(newState.myID, st))

    if(previousState.folders.length !== newState.folders.length)
      store.dispatch(folderStatus(newState.folders, st))

    if(previousState.devices.length !== newState.devices.length)
      store.dispatch(connections(st))

    menu = buildTray(newState)
    tray.setContextMenu(menu)
    previousState = newState
  }
}

//Events from Syncthing API
export function events(st, store){
  //Listen for devices connecting
  st.on("deviceConnected", ({ id, addr }) => {
    const { name } = store.getState().devices.filter(device => device.deviceID == id)[0]
    notify(`Connected to ${name}`, `on ${addr}`)
    store.dispatch(connections(st))
  })
  //Listen for devices disconnecting
  st.on("deviceDisconnected", ({id}) => {
    const { name } = store.getState().devices.filter(device => device.deviceID == id)[0]
    notify(`${name} disconnected`, "Syncing to this device is paused")
    store.dispatch(connections(st))
  })
  //Listen for folder state changes
  st.on("stateChanged", ({ folder, to }) => {
    const state = store.getState()
    switch (to) {
      case 'syncing':
        notify(`${folder} is Syncing`)
      store.dispatch(folderStatus(state.folders, st))
      break;
      case 'error':
        notify(`${folder} has an Error`, 'click to see the error in the dashboard.')
      break;
      case 'idle':
        store.dispatch(folderStatus(state.folders, st))
      break;
    }
  })
  //Check for devices in an interval
  setInterval(() => {
    //store.dispatch(connections(st))
  }, 1000)
}
