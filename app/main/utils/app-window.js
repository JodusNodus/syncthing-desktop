import { app, BrowserWindow } from 'electron'

export let win

export default function appWindow(){
  if(win){
    if(win.isMinimized())
      win.restore()
    if(win.isFullScreen())
      win.setFullscreen(false)
    win.focus()
  }else{
    win = new BrowserWindow({
      show: false,
      titleBarStyle: 'hidden-inset',
      minHeight: 300,
      minWidth: 500,
      height: 550,
      width: 800,
    })
    win.loadURL(`file://${__dirname}/../../../app/client/app.html`)

    win.on('close', () => {
      app.dock.hide()
      win = null
    })

  }
}
