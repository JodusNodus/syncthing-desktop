import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  connected,
  myID,
  devices,
  folders,
  systemStatus,
  power,
})

export default rootReducer

export function preferences(state = {}, {type, payload}) {
  switch (type) {
    case 'PREFERENCES_SUCCESS':
      return payload
    default:
      return state 
  }
}

export function connected(state = true, {type}){
  if(type == 'CONNECTION_ERROR'){
    return false
  }else if(/.*\_SUCCESS/.test(type)){
    return true
  }else{
    return state
  }
}

export function myID(state = false, {type, payload}) {
  switch (type){
  case 'MYID_SUCCESS':
    return payload
  default:
    return state
  }
}

export function devices(state = [], {type, payload}) {
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
        paused: connection && connection.paused,
      }
    })
    case 'DEVICE_STATS_SUCCESS':
      return state.map(device => {
      const stats = payload[device.deviceID]
      return {
        ...device,
        ...stats,
      }
    })
    default:
      return state
  }
}

export function folders(state = [], {type, payload, id}) {
  switch (type){
  case 'FOLDERS_SUCCESS':
    return payload
  case 'FOLDER_STATUS_SUCCESS':
    return state.map(folder => ({
      ...folder,
      status: id == folder.id ? payload : folder.status,
    }))
  default:
    return state
  }
}

export function power(state = 'awake', {type}) {
  switch (type){
  case 'SUSPEND':
    return 'suspended'
  case 'RESUME':
    return 'awake'
  default:
    return state
  }
}

export function systemStatus(state = {}, {type, payload}) {
  switch (type) {
    case 'SYSTEM_STATUS_SUCCESS':
      return payload;
    default:
      return state 
  }
}
