import { combineReducers } from 'redux'
import { notify } from './misc'

const rootReducer = combineReducers({
  connected,
  myID,
  devices,
  folders,
})

export default rootReducer

function connected(state = true, {type}){
  if(type == 'CONNECTION_ERROR'){
    return false
  }else if(/.*\_SUCCESS/.test(type)){
    return true
  }else{
    return state
  }
}

function myID(state = false, {type, payload}) {
  switch (type){
  case 'MYID_SUCCESS':
    return payload
  default:
    return state
  }
}

function devices(state = [], {type, payload}) {
  switch (type){
  case 'DEVICES_SUCCESS':
    return payload
  case 'CONNECTIONS_SUCCESS':
    return state.map(device => {
      const connection = payload[device.deviceID]
      return {
        ...device,
        online: connection && connection.connected,
        address: connection ? connection.address : false,
      }
    })
  default:
    return state
  }
}

function folders(state = [], {type, payload, id}) {
  switch (type){
  case 'FOLDERS_SUCCESS':
    return payload
  case 'FOLDER_STATUS_SUCCESS':
    return state.map(folder => ({
      ...folder,
      status: id == folder.id ? payload : null,
    }))
  default:
    return state
  }
}
