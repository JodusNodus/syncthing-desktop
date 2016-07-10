import appWindow from '../utils/app-window'
import notify from '../utils/notify'
import { app, shell } from 'electron'

export default function actions({stConfig, st}) {
  return {
    restart(){
      st.system.restart().then(() => {
        notify('Restarting', 'Syncthing is Restarting.')
      })
    },
    quit(){
      st.system.shutdown().then(() => app.quit())
    },
    dashboard(){
      shell.openExternal(`${stConfig.https ? 'https' : 'http'}://${stConfig.hostname}:${stConfig.port}`) 
    },
    editConfig(){
      appWindow()
    },
  }
}
