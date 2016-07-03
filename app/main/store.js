import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'
import { errorMiddleware } from './middleware'
import electronMiddleware from 'electron-redux-actions'

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(thunk, electronMiddleware, errorMiddleware)
    )
  )

  return store
}
