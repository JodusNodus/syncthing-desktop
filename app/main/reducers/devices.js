import { combineReducers } from 'redux'

export default function devices(state = [], {type, payload}) {
  switch (type){
    case 'DEVICES_GET_SUCCESS':
    return payload
    default:
    return state
  }
}

import connections from './connections'
import stats from './device-stats'

export default combineReducers({
  devices,
  connections,
  stats,
})
