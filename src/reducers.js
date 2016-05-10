import { combineReducers } from 'redux'
import { notify } from "./misc"

const rootReducer = combineReducers({
  connected,
  myID,
  devices,
  folders
})

export default rootReducer

function connected(state = true, {type}){
  switch (type){
    case 'CONNECTION_ERROR':
      return false
    default:
      return state
  }
}

function myID(state = false, {type, payload}) {
  switch (type){
    case 'MYID':
      return payload
    default:
      return state
  }
}

function devices(state = [], {type, payload}) {
  switch (type){
    case 'DEVICES':
      return payload
    case 'CONNECTIONS':
      return state.map(device => {
      const connection = payload[device.deviceID]
      return {
        ...device,
        online: connection && connection.connected,
        address: connection ? connection.address : false
      }
    })
    default:
      return state
  }
}

function folders(state = [], {type, payload, id}) {
  switch (type){
    case 'FOLDERS':
      return payload
    case 'FOLDER_STATUS':
      return state.map(folder => ({
      ...folder,
      status: id == folder.id ? payload : null
    }))
    default:
      return state
  }
}
