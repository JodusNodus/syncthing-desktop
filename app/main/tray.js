import { Tray } from 'electron'
import path from 'path'
import Syncthing from 'node-syncthing'
import { myID, version } from './actions/system'
import stateHandler from './state-change'
import events from './events'
import config from './config'
import buildMenu from './menu'

let tray = null
let stConfig = {}

export default function TrayWrapper(store){
  config(config => {
    stConfig = {
      ...config.get(),
      eventListener: true, 
    }

    const st = new Syncthing(stConfig)
    global.st = st

    tray = new Tray(path.join(__dirname, '../../resources/trayTemplate@4x.png'))

    const menu = buildMenu({stConfig, st, state: store.getState()})
    
    //Subscribe to state changes
    store.subscribe(stateHandler({menu, store, st, tray, stConfig}))

    tray.setContextMenu(menu)

    store.dispatch(myID(st))
    store.dispatch(version(st))

    //Listen
    events(st, store)
  })
}
