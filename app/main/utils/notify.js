import { BrowserWindow } from 'electron'

let win

export function notificationWindow(){
  win = new BrowserWindow({ show: false })
  win.loadURL(`file://${__dirname}/../../../app/notifier/index.html`)
}

const sendNotification = (title, body) => win.webContents.send('notification', {title, body})

export default function notify(...data){
  if(win != null && !win.webContents.isLoading()){
    sendNotification(...data)
  }else{
    win.once('ready-to-show', () => {
      sendNotification(...data)
    })
  }
}
