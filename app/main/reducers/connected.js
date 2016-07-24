export default function connected(state = false, {type}){
  if(type == 'CONNECTION_ERROR'){
    return false
  }else if(type == 'MYID_GET_SUCCESS'){
    return true
  }else{
    return state
  }
}
