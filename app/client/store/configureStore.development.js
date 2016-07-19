import { createStore, applyMiddleware, compose } from 'redux'
import { persistState } from 'redux-devtools'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import { hashHistory } from 'react-router'
import { routerMiddleware } from 'react-router-redux'
import rootReducer from 'client/reducers'
import DevTools from 'client/containers/DevTools'
import { electronEnhancer } from 'redux-electron-store'
import { ipcRenderer } from 'electron'
import messageBarMiddleware from 'client/middleware/message-bar'

const logger = createLogger({
  level: 'info',
  collapsed: true,
})

const router = routerMiddleware(hashHistory)

const enhancer = compose(
  applyMiddleware(thunk, router, messageBarMiddleware, logger),
  electronEnhancer(true),
  DevTools.instrument(),
  persistState(
    window.location.href.match(
      /[?&]debug_session=([^&]+)\b/
    )
  )
)

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, enhancer)

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      ipcRenderer.sendSync('renderer-reload')
      store.replaceReducer(require('../reducers')) // eslint-disable-line global-require
    })
  }

  return store
}
