import appWindow from '../utils/app-window'
import notify from '../utils/notify'
import { app } from 'electron'

export default function actions() {
  return {
    restart(){
      global.st.system.restart().then(() => {
        notify('Restarting', 'Syncthing is Restarting.')
      })
    },
    quit(){
      global.st.system.shutdown().then(() => app.quit())
    },
    editConfig(){
      appWindow()
    },
  }
}
