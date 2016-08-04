import { createSelectorCreator, defaultMemoize } from 'reselect'
import { isEqual } from 'lodash'

import { getDevicesWithConnections } from 'main/reducers/devices/index'
import { getFoldersWithStatus } from 'main/reducers/folders/index'

// create a "selector creator" that uses deep checking
const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  isEqual
)

const getIndicatorStyle = state => {
  switch (state) {
    case 'idle':
    return 'positive'
    case 'scanning':
    return 'primary'
    case 'error':
    return 'negative'
    case 'outofsync':
    return 'negative'
    case 'syncing':
    return 'primary'
    case 'unshared':
    return 'warning'
    default:
    return 'default'
  }
}

const getRouting = state => state.routing

export const getSidebarItems = createDeepEqualSelector(
  [getDevicesWithConnections, getFoldersWithStatus, getRouting],
  (devices, folders) => {
    return {
      folders: folders.map(({id, label, status}) => ({
        text: label || id,
        key: id,
        indicatorStyle: status && getIndicatorStyle(status.state),
      })),
      devices: devices.map(({name, deviceID, connected}) => ({
        text: name,
        key: deviceID,
        connected,
      })),
      preferences: [
        { text: 'Service', key: 'service' },
        { text: 'Client', key: 'client' },
      ],
    }
  }
)
