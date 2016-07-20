const logging = store => next => action => {
  console.log(action.type)
  next(action)
}

export default logging
