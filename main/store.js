import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'
import { errorMiddleware } from './middleware'
import electronShare from '../app/middleware/electron-share.js'

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(thunk, errorMiddleware, electronShare)
    )
  )

  return store
}
