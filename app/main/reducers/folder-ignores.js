export default function(state={}, {type, payload, id}) {
  if(type == 'IGNORES_GET_SUCCESS' || type == 'IGNORES_SET_SUCCESS'){
    return {
      ...state,
      [id]: payload,
    }
  }else{
    return state
  }
}
