export default function preferences(state = {}, {type, payload}) {
  switch (type) {
    case 'PREFERENCES_SUCCESS':
      return payload
    default:
      return state 
  }
}
