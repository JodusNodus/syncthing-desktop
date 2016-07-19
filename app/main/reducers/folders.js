import { combineReducers } from 'redux'
import status from './folder-status'
import completion from './folder-completion'

export default function folders(state = [], {type, payload}) {
  switch (type){
    case 'FOLDERS_GET_SUCCESS':
    return payload
    default:
    return state
  }
}

export default combineReducers({
  folders,
  status,
  completion,
})
