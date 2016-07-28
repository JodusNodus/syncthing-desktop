import { createSelectorCreator, defaultMemoize } from 'reselect'
import { combineReducers } from 'redux'
import { isEqual } from 'lodash'

// create a "selector creator" that uses deep checking
const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  isEqual
)

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

const getDeviceDetails = ({devices}, id) => devices.devices[id]
const getDeviceConnections = ({devices}, id) => devices.connections[id]
const getDeviceStats = ({devices}, id) => devices.stats[id]

export const getDevice = createDeepEqualSelector(
  [getDeviceDetails, getDeviceConnections, getDeviceStats],
  (device, connections, stats) => ({
    ...device,
    ...connections,
    ...stats,
  })
)

const getDevicesById = state => state.devices.byId.map(id => getDevice(state, id))

export const getDevices = createDeepEqualSelector(
  [getDevicesById],
  devices => devices,
)
