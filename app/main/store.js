import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers/index'
import errorMiddleware from './middleware/error'
import { electronEnhancer } from 'redux-electron-store'
import loggingMiddleware from './middleware/logging'

const middleware = [thunk, errorMiddleware]

if (process.env.NODE_ENV === 'development') {
  middleware.push(loggingMiddleware)
}

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(...middleware),
      electronEnhancer()
    )
  )

  return store
}
