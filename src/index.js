import electron, { app } from "electron"
import electronDebug from "electron-debug"

import Tray from "./tray"
import configureStore from "./store"

electronDebug()

app.on("ready", () => {
  const store = configureStore()
  new Tray(store)
})
