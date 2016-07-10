import { Menu } from 'electron'

import menuActions from './actions'
import deviceItems from './devices'
import folderItems from './folders'

import { name, version } from '../../../package.json'

export default function buildMenu({
  st,
  state: {
    devices,
    folders,
    connected,
  }, 
}){
  let menu = null
  const actions = menuActions(st)

  const sharedItems = [
    { label: `${name} ${version}`, enabled: false },
    { label: 'Restart Syncthing', click: actions.restart, accelerator: 'CommandOrControl+R' },
    { label: 'Quit Syncthing', click: actions.quit, accelerator: 'CommandOrControl+Q' },
  ]

  if(connected){
    menu = Menu.buildFromTemplate([
      ...folderItems(folders),
      { type: 'separator' },
      ...deviceItems(devices),
      { type: 'separator' },
      { label: 'Preferences...', click: actions.editConfig, accelerator: 'CommandOrControl+,' },
      { type: 'separator' },
      ...sharedItems,
    ])
  }else{
    menu = Menu.buildFromTemplate([
      { label: 'Connection error', enabled: false },
      ...sharedItems,
    ])
  }

  return menu
}
