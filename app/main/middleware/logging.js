const logging = store => next => action => {
  console.log(action.type)
  if(action.error) console.log(action.error)
  next(action)
}

export default logging
