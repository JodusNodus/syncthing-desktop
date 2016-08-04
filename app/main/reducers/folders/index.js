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
const getFolderDevices = ({folders, devices}, id) => {
  const folder = getFolderDetails({folders}, id)

  if(!folder){
    return []
  }

  return folder.devices.map(({deviceID}) => ({
    deviceID,
    name: devices.devices[deviceID] && devices.devices[deviceID].name,
  }))
}

const getFoldersById = selector => state => state.folders.byId.map(id => selector(state, id))

export const getFolderWithStatus = createDeepEqualSelector(
  [getFolderDetails, getFolderStatus],
  (folder, status) => {

    if(!folder){
      return {}
    }

    //Replace state with unshared if no more than 1 device was found (current device)
    let state = status ? status.state : 'default'

    if(folder.devices.length <= 1){
      state = 'unshared'
    }
    if(folder.type == 'readonly' && status && (status.globalFiles != status.localFiles)){
      state = 'outofsync'
    }

    return {
      ...folder,
      status: {
        ...status,
        state,
      },
    }
  }
)

export const getFoldersWithStatus = createDeepEqualSelector(
  [getFoldersById(getFolderWithStatus)],
  folders => folders,
)

export const getFolder = createDeepEqualSelector(
  [getFolderWithStatus, getFolderCompletion, getFolderStats, getFolderDevices],
  (folder, completion, stats, devices) => ({
    ...folder,
    stats,
    devices: devices.map(device => ({
      ...device,
      completion: completion && completion[device.deviceID],
    })),
  })
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

export const getFolders = createDeepEqualSelector(
  [getFoldersById(getFolder)],
  folders => folders,
)

const getIgnores = ({folders}, id) => folders.ignores[id]

export const getIgnoresInitialValues = createDeepEqualSelector(
  [getIgnores],
  ignores => ({
    ignores: (ignores && ignores.ignore) ? ignores.ignore.join('\n') : '',
  })
)
