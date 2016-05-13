import { notify } from "./misc"
import { dialog } from "electron"

export function errorMiddleware(store){
  return next => action => {
    if(action.type == "CONNECTION_ERROR"){
      //notify("Error", action.error)
      dialog.showErrorBox("Connection Error", "Could not connect to the Syncthing server.")
    }
    next(action)
  }
}
