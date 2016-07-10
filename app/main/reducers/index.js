import { combineReducers } from 'redux'

import devices from './devices'
import folders from './folders'
import connected from './connected'
import myID from './my-id'
import systemStatus from './system-status'
import power from './power'
import preferences from './preferences'
import guiPreferences from './gui-preferences'
import version from './version'

export const reducers = {
  connected,
  myID,
  devices,
  folders,
  systemStatus,
  power,
  preferences,
  guiPreferences,
  version,
}

const rootReducer = combineReducers(reducers)

export default rootReducer
