import { createSelectorCreator, defaultMemoize } from 'reselect'
import { combineReducers } from 'redux'
import { isEqual } from 'lodash'

// create a "selector creator" that uses deep checking
const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  isEqual
)

import status from './status'
import completion from './completion'
import stats from './stats'
import ignores from './ignores'
import missing from './missing'
import downloadProgress from './download-progress'

function byId(state = [], {type, payload}) {
  switch (type){
    case 'FOLDERS_GET_SUCCESS':
    return payload.map(folder => folder.id)
    default:
    return state
  }
}

function folders(state = [], {type, payload}) {
  switch (type){
    case 'FOLDERS_GET_SUCCESS':
    return payload.reduce((x, folder) => ({
      ...x,
      [folder.id]: folder,
    }), {})
    default:
    return state
  }
}

export default combineReducers({
  byId,
  folders,
  status,
  completion,
  stats,
  ignores,
  missing,
  downloadProgress,
})

const getFolderDetails = ({folders}, id) => folders.folders[id]
const getFolderStatus = ({folders}, id) => folders.status[id]
const getFolderCompletion = ({folders}, id) => folders.completion[id]
const getFolderStats = ({folders}, id) => folders.stats[id]
const getFolderDevices = ({folders, devices}, id) => (
  getFolderDetails({folders}, id).devices.map(({deviceID}) => ({
    deviceID,
    name: devices.devices[deviceID] && devices.devices[deviceID].name,
  }))
)

export const getFolder = createDeepEqualSelector(
  [getFolderDetails, getFolderStatus, getFolderCompletion, getFolderStats, getFolderDevices],
  (folder, status, completion, stats, devices) => {

    //Replace state with unshared if no more than 1 device was found (current device)
    const state = devices.length <= 1 ? 'unshared' : status && status.state

    return {
      ...folder,
      status: {
        ...status,
        state,
      },
      devices: devices.map(device => ({
        ...device,
        completion: completion && completion[device.deviceID],
      })),
      stats,
    }
  }
)

const getFolderMissing = ({folders}, id) => folders.missing[id]
const getFolderDownloadProgress = ({folders}, id) => folders.downloadProgress[id]

export const getFolderWithMissing = createDeepEqualSelector(
  [getFolder, getFolderMissing, getFolderDownloadProgress],
  (folder, missing, downloadProgress) => {

    return {
      ...folder,
      missing: missing && {
        ...missing,
        pages: Math.ceil(missing.total / missing.perpage),
        missing: missing.missing.map(file => ({
          ...file,
          progress: downloadProgress && downloadProgress[file.name],
        })),
      },
    }
  }
)

const getFoldersById = state => state.folders.byId.map(id => getFolder(state, id))

export const getFolders = createDeepEqualSelector(
  [getFoldersById],
  folders => folders,
)

const getIgnores = ({folders}, id) => folders.ignores[id]

export const getIgnoresInitialValues = createDeepEqualSelector(
  [getIgnores],
  ignores => ({
    ignores: (ignores && ignores.ignore) ? ignores.ignore.join('\n') : '',
  })
)
