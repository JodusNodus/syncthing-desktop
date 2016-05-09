import electron, { app } from "electron"
import electronDebug from "electron-debug"

import Tray from "./tray"
import configureStore from "./store"
import { notify } from "./misc"

electronDebug()

app.on("ready", () => {
  const store = configureStore()
  const tray = new Tray(store)
})
