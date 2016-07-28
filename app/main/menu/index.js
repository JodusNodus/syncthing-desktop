import { Menu } from 'electron'

import menuActions from './actions'
import deviceItems from './devices'
import folderItems from './folders'
import { getDevicesWithConnections } from '../reducers/devices'
import { getFoldersWithStatus } from '../reducers/folders'

import { name, version } from '../../../package.json'

export default function buildMenu({
  st,
  state,
  state: {
    connected,
    config,
  },
}){
  const devices = getDevicesWithConnections(state)
  const folders = getFoldersWithStatus(state)

  let menu = null
  const actions = menuActions(st)

  const sharedItems = [
    { label: `${name} ${version}`, enabled: false },
    { label: 'Restart Syncthing', click: actions.restart, accelerator: 'CommandOrControl+R' },
    { label: 'Quit Syncthing', click: actions.quit, accelerator: 'CommandOrControl+Q' },
  ]

  if(connected && config.isSuccess){
    menu = Menu.buildFromTemplate([
      ...folderItems(folders),
      { type: 'separator' },
      ...deviceItems(devices),
      { type: 'separator' },
      { label: 'Open...', click: actions.editConfig, accelerator: 'CommandOrControl+,' },
      { type: 'separator' },
      ...sharedItems,
    ])
  }else{
    menu = Menu.buildFromTemplate([
      { label: config.isFailed ? 'No config available' : 'Connection error', enabled: false },
      ...sharedItems,
    ])
  }

  return menu
}
