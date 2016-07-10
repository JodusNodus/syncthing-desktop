import notify from './utils/notify'
import { config, connections, myID, version } from './actions/system'
import { folderStatus } from './actions/db'
import { deviceStats } from './actions/stats'
import buildMenu from './menu/index'
import _ from 'lodash'
import Syncthing from 'node-syncthing'
import { stEvents } from './events'

export default function stateHandler({store, tray}){
  let previousState = store.getState()
  return () => {
    const newState = store.getState()

    //Check if config was loaded
    if(!previousState.config.isSuccess && newState.config.isSuccess){
      //Initialize syncthing connection
      global.st = new Syncthing({
        ...newState.config.config,
        eventListener: true,
      })

      //Start listening for syncthing events
      stEvents(store)
     
      
      store.dispatch(myID())
    }

    if(!newState.connected && newState.power == 'awake'){
      setTimeout(() => store.dispatch(myID()), 1000)
    }

    if(!previousState.connected && newState.connected){
      store.dispatch(config(newState.myID))
      notify('Connection Established', 'Connected to Syncthing instance')
    }

    if(previousState.myID !== newState.myID){
      store.dispatch(config(newState.myID))
      store.dispatch(version())
    }

    //Check if present folders have a status
    if(newState.folders && newState.folders.length > 0 && !newState.folders[0].status){
      store.dispatch(folderStatus(newState.folders))
    }

    //Check if devices were added or removed
    if(previousState.devices.length !== newState.devices.length){
      store.dispatch(connections())
      store.dispatch(deviceStats())
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
