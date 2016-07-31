import { combineReducers } from 'redux'

import devices from './devices/index'
import folders from './folders/index'
import connected from './connected'
import myID from './my-id'
import systemStatus from './system-status'
import power from './power'
import preferences from './preferences'
import guiPreferences from './gui-preferences'
import version from './version'
import config from './config'
import folderRejected from './folder-rejected'
import errors from './errors'
import configInSync from './config-in-sync'

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
  config,
  folderRejected,
  errors,
  configInSync,
}

const rootReducer = combineReducers(reducers)

export default rootReducer
