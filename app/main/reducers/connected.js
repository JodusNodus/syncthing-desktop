export default function connected(state = true, {type}){
  if(type == 'CONNECTION_ERROR'){
    return false
  }else if(/.*\_SUCCESS/.test(type)){
    return true
  }else{
    return state
  }
}
