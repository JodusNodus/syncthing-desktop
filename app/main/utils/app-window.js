import { BrowserWindow } from 'electron'

export default function appWindow(){
  const win = new BrowserWindow({
    show: false,
    titleBarStyle: 'hidden-inset',
  })
  win.loadURL(`file://${__dirname}/../../../app/client/app.html`)
}
