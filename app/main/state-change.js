import notify from './utils/notify'
import { config, connections, myID } from './actions/system'
import { folderStatus } from './actions/db'
import { deviceStats } from './actions/stats'
import buildMenu from './menu/index'
import _ from 'lodash'

export default function stateHandler({menu, store, st, tray, stConfig}){
  let previousState = store.getState()
  return () => {
    const newState = store.getState()

    if(!newState.connected && newState.power == 'awake'){
      setTimeout(() => store.dispatch(myID(st)), 1000)
    }

    if(!previousState.connected && newState.connected){
      store.dispatch(config(newState.myID, st))
      notify('Connection Established', `Connected to ${stConfig.hostname}:${stConfig.port}`)
    }

    if(previousState.myID !== newState.myID)
      store.dispatch(config(newState.myID, st))

    if(newState.folders && newState.folders.length > 0 && !newState.folders[0].status){
      store.dispatch(folderStatus(newState.folders, st))
    }

    if(previousState.devices.length !== newState.devices.length){
      store.dispatch(connections(st))
      store.dispatch(deviceStats(st))
    }

    if(!_.isEqual({
      ...newState,
      systemStatus: null,
    }, {
      ...previousState,
      systemStatus: null,
    })){
      menu = buildMenu({stConfig, st, state: newState})
      tray.setContextMenu(menu)
    }
    previousState = newState
  }
}
