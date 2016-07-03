import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import { connected, myID, devices, folders, power } from '../../main/reducers.js'

const rootReducer = combineReducers({
  routing,
  connected,
  myID,
  devices,
  folders,
  power,
})

export default rootReducer
