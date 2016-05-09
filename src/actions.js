import { notify } from "./misc"

export function myID(st) {
  return dispatch => st.system.status().then(status => {
    dispatch({
      type: "MYID",
      payload: status.myID
    })
  }).catch(error => {
    dispatch({ type: 'CONNECTION_ERROR', error })
  })
}

export function connections(st){
  return dispatch => st.system.connections().then(({connections}) => {
    dispatch({ type: 'CONNECTIONS', payload: connections})
  }).catch(error => {
    dispatch({ type: "CONNECTION_ERROR", error })
  })
}

export function config(myID="", st){
  return dispatch => st.system.getConfig().then(({devices, folders}) => {
    dispatch({ type: "FOLDERS", payload: folders })
    dispatch({ type: "DEVICES", payload: devices.filter(({deviceID}) => deviceID != myID) })
  }).catch(error => {
    dispatch({ type: "CONNECTION_ERROR", error })
  })
}
