import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { hashHistory } from 'react-router'
import { routerMiddleware } from 'react-router-redux'
import rootReducer from '../reducers'
import electronMiddleware from 'electron-redux-actions'

const router = routerMiddleware(hashHistory)

const enhancer = applyMiddleware(thunk, router, electronMiddleware)

console.log("prod")

export default function configureStore(initialState) {
  return createStore(rootReducer, initialState, enhancer)
}
