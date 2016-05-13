import { app, Tray, shell } from "electron"
import path from "path"
import Syncthing from "node-syncthing"
import { notify, formatBytes } from "./misc"
import { myID } from "./actions"
import { stateHandler, events } from "./events"
import config from "./config"
import buildMenu from "./menu"

let tray = null
let stConfig = {}

export default function TrayWrapper(store){
  config(config => {
    stConfig = {
      ...config.get(),
      eventListener: true 
    }

    const hasKey = stConfig.apiKey != null && stConfig.apiKey.length > 0

    const st = new Syncthing(stConfig)

    tray = new Tray(path.join(__dirname, "../trayTemplate@4x.png"))

    const menu = buildMenu({stConfig, hasKey, st, dir: config.dir(), ...store.getState()})
    
    //Subscribe to state changes
    store.subscribe(stateHandler({menu, store, st, tray, buildMenu, dir: config.dir(), hasKey, stConfig}))

    //Notify if no apiKey was found 
    if(!hasKey)
      notify("No API key was found", "Some actions will not be possible.")

    tray.setContextMenu(menu)

    store.dispatch(myID(st))

    //Listen
    events(st, store)
  })
}
