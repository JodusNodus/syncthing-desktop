import { combineReducers } from 'redux'

import connections from './connections'
import stats from './stats'

function byId(state = [], {type, payload}) {
  switch (type){
    case 'DEVICES_GET_SUCCESS':
    return payload.map(device => device.deviceID)
    default:
    return state
  }
}

function devices(state = [], {type, payload}) {
  switch (type){
    case 'DEVICES_GET_SUCCESS':
    return payload.reduce((x, device) => ({
      ...x,
      [device.deviceID]: device,
    }), {})
    default:
    return state
  }
}

export default combineReducers({
  byId,
  devices,
  connections,
  stats,
})

export const getDevice = ({devices}, id) => {
  const device = devices.devices[id]
  return {
    ...device,
    ...devices.connections[id],
    ...devices.stats[id],
  }
}

export const getDevices = ({devices}) => devices.byId.map(id => getDevice({devices}, id))
