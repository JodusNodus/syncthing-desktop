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

export const getDeviceWithConnections = createDeepEqualSelector(
  [getDeviceDetails, getDeviceConnections],
  (device, connections) => ({
    ...device,
    ...connections,
  })
)

export const getDevice = createDeepEqualSelector(
  [getDeviceWithConnections, getDeviceStats],
  (device, stats) => ({
    ...device,
    ...stats,
  })
)

const getDevicesById = selector => state => state.devices.byId.map(id => selector(state, id))

export const getDevicesWithConnections = createDeepEqualSelector(
  [getDevicesById(getDeviceWithConnections)],
  devices => devices,
)

export const getDevices = createDeepEqualSelector(
  [getDevicesById(getDevice)],
  devices => devices,
)
