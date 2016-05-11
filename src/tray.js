import { app, Tray, Menu } from "electron"
import path from "path"
import Syncthing from "node-syncthing"
import { notify, formatBytes } from "./misc"
import { myID, config, connections, folderStatus } from "./actions"

const st = new Syncthing({
  hostname: "localhost",
  port: 8384,
  apiKey: "19A5pMYGNr0SOqzL9xoyJp7JuRbwzZq2",
  eventListener: false
})

const actions = {
  restart(){
    st.system.restart().then(() => {
      notify('Restarting', 'Syncthing is Restarting.');
    })
  },
  quit(){
    st.system.shutdown().then(() => {})
    app.quit()
  }
}

function buildTray(tray, {devices, folders, connected}){
  const folderItems = folders.length > 0 ? [
    { label: "Folders", enabled: false  },
    ...folders.map(({ id, status }) => {
      return {
        label: `${id} ${status ? "(" + formatBytes(status.inSyncBytes) + "/" + formatBytes(status.globalBytes) + ")" : ""}`
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
      { label: 'Restart', click: actions.restart },
      { label: 'Quit', click: actions.quit }
    ])
  }else{
    menu = Menu.buildFromTemplate([
      { label: "Connection error", enabled: false },
      { label: 'Quit', click: actions.quit }
    ])
  }

  tray.setContextMenu(menu)
}

let tray = null;
export default function TrayWrapper(store){
  tray = new Tray(path.join(__dirname, "../icon@4x.png"))

  let previousState = store.getState()
  store.subscribe(() => {
    const newState = store.getState()
    if(previousState.devices.length !== newState.devices.length)
      store.dispatch(connections(st))

    if(!previousState.myID && newState.myID)
      store.dispatch(config(newState.myID, st))

    if(previousState.folders.length !== newState.folders.length)
      store.dispatch(folderStatus(newState.folders, st))

    buildTray(tray, newState)
    previousState = newState
  })

  buildTray(tray, store.getState())
  store.dispatch(myID(st))
}
