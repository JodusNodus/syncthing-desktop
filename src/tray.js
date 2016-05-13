import { app, Tray, Menu, shell } from "electron"
import path from "path"
import Syncthing from "node-syncthing"
import { notify, formatBytes } from "./misc"
import { myID } from "./actions"
import { stateHandler, events } from "./events"
import Config from "./config.js"

const config = new Config

const stConfig = {
  ...config.get(),
  eventListener: true 
}

const hasKey = stConfig.apiKey != null && stConfig.apiKey.length > 0

const st = new Syncthing(stConfig)

const actions = {
  restart(){
    st.system.restart().then(() => {
      notify('Restarting', 'Syncthing is Restarting.');
    })
  },
  quit(){
    if(hasKey)
      st.system.shutdown().then(() => app.quit())
    else
      app.quit()
  },
  dashboard(){
    shell.openExternal(`${stConfig.https ? "https" : "http"}://${stConfig.hostname}:${stConfig.port}`) 
  }
}

const folder = ({ id, status, path }) => ({
  label: `${id} ${status ? "(" + formatBytes(status.inSyncBytes) + "/" + formatBytes(status.globalBytes) + ") ("+ status.state +")": ""}`,
  id,
  path, 
  click: ({path}) => shell.showItemInFolder(path)
})

const device = ({ deviceID, name, online, address }) => ({
  label: `${name} ${online ? "("+address+")" : "(disconnected)"}`,
  id: deviceID,
  type: "checkbox",
  enabled: online ? true : false
})

const folderItems = folders => folders.length > 0 ? [
  { label: "Folders", enabled: false  },
  ...folders.map(folder)
] : [
  { label: "No folders found", enabled: false }
]

const devicesItems = devices => devices.length > 0 ? [
  { label: "Devices", enabled: false },
  ...devices.map(device)
] : [{ label: "No devices found", enabled: false }]

function buildTray({devices, folders, connected}){
  let menu = null;

  if(connected){
    menu = Menu.buildFromTemplate([
      ...folderItems(folders),
      { type: "separator" },
      ...devicesItems(devices),
      { type: "separator" },
      { label: "Dashboard...", click: actions.dashboard, accelerator: "CommandOrControl+D" },
      { label: "Preferences", submenu: [
        { label: `hostname: ${stConfig.hostname}`, enabled: false },
        { label: `port: ${stConfig.port}`, enabled: false },
        { label: stConfig.apiKey ? `API key: ${stConfig.apiKey}` : "No API key was found", enabled: false }
      ]},
      { type: "separator" },
      { label: 'Restart Syncthing', click: actions.restart, accelerator: "CommandOrControl+R", visible: hasKey},
      { label: 'Quit', click: actions.quit, accelerator: "CommandOrControl+Q" }
    ])
  }else{
    menu = Menu.buildFromTemplate([
      { label: "Connection error", enabled: false },
      { label: 'Quit Syncthing', click: actions.quit, accelerator: "CommandOrControl+Q" }
    ])
  }
  return menu
}

let tray = null;
export default function TrayWrapper(store){
  tray = new Tray(path.join(__dirname, "../trayTemplate@2x.png"))

  const menu = buildTray(store.getState())
  //Subscribe to state changes
  store.subscribe(stateHandler(menu, store, st, tray, buildTray))

  //Notify if no apiKey was found 
  if(!hasKey)
    notify("No API key was found", "Some actions will not be possible.")
  
  tray.setContextMenu(menu)

  store.dispatch(myID(st))

  //Listen
  events(st, store)
}
