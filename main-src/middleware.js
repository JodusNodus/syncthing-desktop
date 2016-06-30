import { notify } from './misc'
import { dialog, ipcMain, ipcRenderer } from 'electron'

export function errorMiddleware(store){
  return next => action => {
    if(action.type == 'CONNECTION_ERROR'){
      notify('Connection Error', 'Could not connect to the Syncthing server.')
    }
    next(action)
  }
}
