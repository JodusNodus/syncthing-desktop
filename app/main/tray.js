import { Tray } from 'electron'
import path from 'path'
import buildMenu from './menu'

let tray = null

export default function TrayWrapper(store){
  tray = new Tray(path.join(__dirname, '../../resources/trayTemplate@4x.png'))

  const menu = buildMenu({state: store.getState()})

  tray.setContextMenu(menu)

  return tray
}
