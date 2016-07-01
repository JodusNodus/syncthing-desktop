import { notify } from './misc'
import { dialog, ipcMain, ipcRenderer } from 'electron'
import { connections } from './actions'

export function errorMiddleware(store){
  return next => action => {
    if(action.type == 'CONNECTION_ERROR' && store.getState().power == 'awake')
      notify('Connection Error', 'Could not connect to the Syncthing server.')

    next(action)
  }
}
