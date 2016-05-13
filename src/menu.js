import { app, Tray, Menu, shell } from "electron"
import path from "path"
import process from "process"
import Syncthing from "node-syncthing"
import { notify, formatBytes } from "./misc"
import { myID } from "./actions"
const { name, version } = require("../package.json")

const folder = ({ id, status, path }) => ({
  label: `${id} ${status ? "(" + formatBytes(status.inSyncBytes) + "/" + formatBytes(status.globalBytes) + ") ("+ status.state +")": ""}`,
  id,
  path, 
  click: ({path}) => shell.showItemInFolder(path)
})

const device = ({ deviceID, name, online, address }) => ({
  label: `${name} ${online ? "("+address+")" : "(disconnected)"}`,
  id: deviceID,
  enabled: online ? true : false,
  address,
  click: ({address}) => shell.openExternal("http://"+address)
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

export default function buildMenu({stConfig, st, dir, hasKey, devices, folders, connected}){
  let menu = null
  const actions = menuActions({st, stConfig, hasKey, dir})

  const sharedItems = [
    { label: name+" "+version },
    { label: 'Restart Syncthing', click: actions.restart, accelerator: "CommandOrControl+R", visible: hasKey},
    { label: 'Quit Syncthing', click: actions.quit, accelerator: "CommandOrControl+Q" }
  ]

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
        { label: stConfig.apiKey ? `API key: ${stConfig.apiKey}` : "No API key was found", enabled: false },
        { label: "Edit...", click: actions.editConfig }
      ]},
      { type: "separator" },
      ...sharedItems
    ])
  }else{
    menu = Menu.buildFromTemplate([
      { label: "Connection error", enabled: false },
      ...sharedItems
    ])
  }
  return menu
}

const menuActions = ({stConfig, st, hasKey, dir}) => ({
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
  },
  editConfig(){
    shell.openItem(dir)
  }
})
