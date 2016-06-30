import path from 'path'
import notifier from 'node-notifier'
import { Menu } from 'electron'

export function buildMenu(tray, menu){
  let contextMenu = Menu.buildFromTemplate(menu)
  tray.setContextMenu(contextMenu)
}

export function notify(title, message){
  const options = {
    title,
    message,
    icon: path.join(__dirname, '../logo.png'),
  }
  notifier.notify(options)
}

export function formatBytes(bytes, decimals=0) {
  if(bytes == 0) return '0 Byte'
  var k = 1000 // or 1024 for binary
  var dm = decimals + 1 || 3
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  var i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
