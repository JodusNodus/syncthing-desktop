export default function myID(state = false, {type, payload}) {
  switch (type){
  case 'MYID_SUCCESS':
    return payload
  default:
    return state
  }
}
