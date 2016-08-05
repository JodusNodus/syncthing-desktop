import notify from './utils/notify'
import isEqual from 'lodash/isEqual'
import syncthing from 'node-syncthing'

import { getServiceConfig, getConnections, getMyID, getVersion, getConfigInSync } from './actions/system'
import { getFolderStatus } from './actions/db'
import { getDeviceStats } from './actions/stats'
import { getAutoLaunch } from './actions/auto-launch'

import buildMenu from './menu/index'
import { stEvents, clearEventListeners } from './events'
import { getFoldersWithStatus } from './reducers/folders'

export default function stateHandler({store, tray}){
  let previousState = store.getState()
  return () => {
    const newState = store.getState()

    //Check if config was loaded or changed
    const configIsNowSuccesfull = !previousState.config.isSuccess && newState.config.isSuccess
    const configHasChanged = !isEqual(
      //Ignore autoLaunch changes
      {...previousState.config.config, autoLaunch: false},
      {...newState.config.config, autoLaunch: false}
    )

    if(configIsNowSuccesfull || configHasChanged){

      //Remove all listeners from previous Syncthing instance
      if(global.st){
        clearEventListeners()
      }

      //Initialize syncthing connection
      global.st = syncthing({
        ...newState.config.config,
        eventListener: true,
        retries: 10 ** 10,
      })

      if(global.st){
        store.dispatch(getMyID())
      }

      //Check if app is auto launched
      store.dispatch(getAutoLaunch())
    }

    if(!previousState.connected && newState.connected || previousState.myID != newState.myID){
      store.dispatch(getServiceConfig(newState.myID))
      store.dispatch(getVersion())
      store.dispatch(getConfigInSync())
      notify('Connection Established', 'Connected to Syncthing instance')

      //Start listening for syncthing events
      stEvents(store)
    }

    //Check if devices were added or removed
    if(!isEqual(previousState.devices.byId, newState.devices.byId)){
      store.dispatch(getConnections())
      store.dispatch(getDeviceStats())
      store.dispatch(getFolderStatus(getFoldersWithStatus(newState)))
    }

    if(!isEqual(getMenuState(previousState), getMenuState(newState))){
      //Build and replace old menu
      const menu = buildMenu({state: newState})
      tray.setContextMenu(menu)
    }
    previousState = newState
  }
}

//Filter out all unimportant state for dispalying menu
const getMenuState = ({
  connected,
  devices: {
    devices,
    connections,
  },
  folders: {
    folders,
    status,
  },
}) => ({
  connected,
  devices,
  folders,
  connections,
  status,
})
