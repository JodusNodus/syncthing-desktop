import { combineReducers } from 'redux'
import status from './folder-status'
import completion from './folder-completion'


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
})

export const getFolder = ({folders}, id) => {
  const folder = folders.folders[id]
  const completion = folders.completion[id]
  return {
    ...folder,
    status: folders.status[id],
    devices: folder.devices.map(({deviceID}) => ({
      deviceID,
      completion: completion && completion[deviceID],
    })),
  }
}

export const getFolders = ({folders}) => folders.byId.map(id => getFolder({folders}, id))
