import { dialog } from "electron"

export function errorMiddleware(store){
  return next => action => {
    if(action.type == "CONNECTION_ERROR"){
      dialog.showErrorBox("Connection Error", "Could not connect to the Syncthing server.")
    }
    next(action)
  }
}
