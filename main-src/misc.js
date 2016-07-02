import path from 'path'
import notifier from 'node-notifier'
import { Menu, BrowserWindow, app } from 'electron'

let notificationWindow
app.once('ready', function(){
  notificationWindow = new BrowserWindow({ show: false })
  notificationWindow.loadURL(`file://${__dirname}/../notifier/index.html`)
})

export function buildMenu(tray, menu){
  let contextMenu = Menu.buildFromTemplate(menu)
  tray.setContextMenu(contextMenu)
}

const sendNotification = (title, body) => notificationWindow.webContents.send('notification', {title, body})
export function notify(...data){
  if(notificationWindow != null && !notificationWindow.webContents.isLoading()){
    sendNotification(...data)
  }else{
    notificationWindow.once('ready-to-show', () => {
      sendNotification(...data)
    })
  }
}

export function formatBytes(bytes, decimals=0) {
  if(bytes == 0) return '0 Byte'
  var k = 1000 // or 1024 for binary
  var dm = decimals + 1 || 3
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  var i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
