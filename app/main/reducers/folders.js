import { combineReducers } from 'redux'
import status from './folder-status'
import completion from './folder-completion'
import stats from './folder-stats'
import ignores from './folder-ignores'
import missing from './folder-missing'
import downloadProgress from './folder-download-progress'

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

export const getFolder = ({folders, devices}, id) => {
  const folder = folders.folders[id]
  const completion = folders.completion[id]

  const state = folder.devices.length <= 1
  ? 'unshared'
  : folders.status[id] && folders.status[id].state

  return {
    ...folder,
    status: {
      ...folders.status[id],
      state,
    },
    devices: folder.devices.map(({deviceID}) => ({
      deviceID,
      name: devices.devices[deviceID] && devices.devices[deviceID].name,
      completion: completion && completion[deviceID],
    })),
    stats: folders.stats[id],
  }
}

export const getFolderWithMissing = ({folders, devices}, id) => {
  const folder = getFolder({folders, devices}, id)
  const downloadProgress = folders.downloadProgress[id]
  const missing = folders.missing[id]

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

export const getFolders = ({folders, ...state}) => folders.byId.map(id => getFolder({folders, ...state}, id))

export const getIgnoresInitialValues = ({folders}, id) => {
  const ignores = folders.ignores[id]
  return {
    ignores: (ignores && ignores.ignore) ? ignores.ignore.join('\n') : '',
  }
}
