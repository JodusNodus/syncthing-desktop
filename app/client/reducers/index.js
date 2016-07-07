import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import { connected, myID, devices, folders, power, preferences, systemStatus, guiPreferences, version } from '../../main/reducers.js'
import { reducer as form } from 'redux-form'

const rootReducer = combineReducers({
  routing,
  connected,
  myID,
  devices,
  folders,
  power,
  preferences,
  form,
  systemStatus,
  guiPreferences,
  version,
})

export default rootReducer
