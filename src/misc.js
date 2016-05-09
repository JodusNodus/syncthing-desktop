import path from "path"
import notifier from "node-notifier"

export function buildMenu(tray, menu){
  let contextMenu = Menu.buildFromTemplate(menu)
  tray.setContextMenu(contextMenu)
}

export function notify(title, message){
  const options = {
    title,
    message,
    icon: path.join(__dirname, '../logo.png')
  }
  notifier.notify(options)
}
