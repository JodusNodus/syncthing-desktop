import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'
import errorMiddleware from './middleware/error'
import { electronEnhancer } from 'redux-electron-store'

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(thunk, errorMiddleware),
      electronEnhancer()
    )
  )

  return store
}
