import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { hashHistory } from 'react-router'
import { routerMiddleware } from 'react-router-redux'
import rootReducer from 'client/reducers'
import { electronEnhancer } from 'redux-electron-store'
import messageBarMiddleware from 'client/middleware/message-bar'

const router = routerMiddleware(hashHistory)

const enhancer = compose(
  applyMiddleware(thunk, router, messageBarMiddleware),
  electronEnhancer({
    connected: true,
    myID: true,
    devices: true,
    folders: true,
    systemStatus: true,
    preferences: true,
    guiPreferences: true,
    version: true,
    config: true,
    folderRejected: true,
    errors: true,
    configInSync: true,
  })
)

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, enhancer)

  return store
}
