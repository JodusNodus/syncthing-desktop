import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { hashHistory } from 'react-router'
import { routerMiddleware } from 'react-router-redux'
import rootReducer from '../reducers'
import { electronEnhancer } from 'redux-electron-store'

const router = routerMiddleware(hashHistory)

const enhancer = compose(
  applyMiddleware(thunk, router),
  electronEnhancer(true)
)

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, enhancer)

  return store
}
