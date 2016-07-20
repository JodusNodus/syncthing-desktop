import notify from './utils/notify'
import { getServiceConfig, getConnections, getMyID, getVersion } from './actions/system'
import { getFolderStatus } from './actions/db'
import { getDeviceStats } from './actions/stats'
import buildMenu from './menu/index'
import _ from 'lodash'
import Syncthing from 'node-syncthing'
import { stEvents } from './events'
import { getFolders } from './reducers/folders'

export default function stateHandler({store, tray}){
  let previousState = store.getState()
  return () => {
    const newState = store.getState()

    //Check if config was loaded
    if((!previousState.config.isSuccess && newState.config.isSuccess) || !_.isEqual(previousState.config.config, newState.config.config)){
      //Initialize syncthing connection
      global.st = new Syncthing({
        ...newState.config.config,
        eventListener: true,
      })

      //Start listening for syncthing events
      stEvents(store)

      store.dispatch(getMyID())
    }

    if(!previousState.connected && newState.connected){
      store.dispatch(getServiceConfig(newState.myID))
      notify('Connection Established', 'Connected to Syncthing instance')
    }

    if(previousState.myID !== newState.myID){
      store.dispatch(getServiceConfig(newState.myID))
      store.dispatch(getVersion())
    }

    //Check if devices were added or removed
    if(previousState.devices.byId.length !== newState.devices.byId.length){
      store.dispatch(getConnections())
      store.dispatch(getDeviceStats())
      store.dispatch(getFolderStatus(getFolders(newState)))
    }

    const StateIsDifferent = !_.isEqual({
      ...newState,
      systemStatus: null,
    }, {
      ...previousState,
      systemStatus: null,
    })

    if(StateIsDifferent){
      //Build and replace old menu
      const menu = buildMenu({state: newState})
      tray.setContextMenu(menu)
    }
    previousState = newState
  }
}
