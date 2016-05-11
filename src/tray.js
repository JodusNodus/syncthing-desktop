import { app, Tray, Menu, shell } from "electron"
import path from "path"
import Syncthing from "node-syncthing"
import { notify, formatBytes } from "./misc"
import { myID, config, connections, folderStatus } from "./actions"

const stConfig = {
  hostname: "localhost",
  port: 8384,
  apiKey: "19A5pMYGNr0SOqzL9xoyJp7JuRbwzZq2",
  eventListener: true 
}

const st = new Syncthing(stConfig)

const actions = {
  restart(){
    st.system.restart().then(() => {
      notify('Restarting', 'Syncthing is Restarting.');
    })
  },
  quit(){
    st.system.shutdown().then(() => {})
    app.quit()
  },
  dashboard(){
    shell.openExternal(`${stConfig.https ? "https" : "http"}://${stConfig.hostname}:${stConfig.port}`) 
  }
}

function buildTray({devices, folders, connected}){
  const folderItems = folders.length > 0 ? [
    { label: "Folders", enabled: false  },
    ...folders.map(({ id, status, path }) => {
      return {
        label: `${id} ${status ? "(" + formatBytes(status.inSyncBytes) + "/" + formatBytes(status.globalBytes) + ")" : ""}`,
        path, 
        click: ({path}) => shell.showItemInFolder(path)
      }
    })
  ] : [
    { label: "No folders found", enabled: false }
  ]

  const devicesItems = devices.length > 0 ? [
    { label: "Devices", enabled: false },
    ...devices.map(({ name, online, address }) => ({
      label: `${name} ${online ? "("+address+")" : "(offline)"}`,
      type: "checkbox",
      enabled: online
    }))
  ] : [{ label: "No devices found", enabled: false }]

  let menu = null;
  if(connected){
    menu = Menu.buildFromTemplate([
      ...folderItems,
      { type: "separator" },
      ...devicesItems,
      { type: "separator" },
      { label: "Dashboard", click: actions.dashboard },
      { type: "separator" },
      { label: 'Restart', click: actions.restart },
      { label: 'Quit', click: actions.quit }
    ])
  }else{
    menu = Menu.buildFromTemplate([
      { label: "Connection error", enabled: false },
      { label: 'Quit', click: actions.quit }
    ])
  }
  return menu
}

let tray = null;
export default function TrayWrapper(store){
  tray = new Tray(path.join(__dirname, "../icon@4x.png"))

  let previousState = store.getState()

  //Subscribe to state changes
  store.subscribe(() => {
    const newState = store.getState()
    if(previousState.devices.length !== newState.devices.length)
      store.dispatch(connections(st))

    if(!previousState.myID && newState.myID)
      store.dispatch(config(newState.myID, st))

    if(previousState.folders.length !== newState.folders.length)
      store.dispatch(folderStatus(newState.folders, st))

    const menu = buildTray(newState)
    tray.setContextMenu(menu)
    previousState = newState
  })

  const menu = buildTray(store.getState())
  tray.setContextMenu(menu)
  store.dispatch(myID(st))

  //Listen
  eventListener(st, store)
}

function eventListener(st, store){
  st.on("deviceConnected", ({ id, addr }) => {
    const { name } = store.getState().devices.filter(device => device.deviceID == id)[0]
    notify(`Connected to ${name}`, `on ${addr}`)
    store.dispatch(connections(st))
  })
  st.on("deviceDisconnected", ({data: {id}}) => {
    const { name } = store.getState().devices.filter(device => device.deviceID == id)[0]
    notify(`${name} disconnected`)
    store.dispatch(connections(st))
  })
  st.on("stateChanged", ({ folder, from, to }) => {
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
}
