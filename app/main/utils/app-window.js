import { BrowserWindow } from 'electron'

export default function appWindow(){
  const win = new BrowserWindow({
    show: false,
    titleBarStyle: 'hidden-inset',
    minHeight: 400,
    minWidth: 600,
    height: 550,
    width: 800,
  })
  win.loadURL(`file://${__dirname}/../../../app/client/app.html`)
}
