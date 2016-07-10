export default function version(state = null, {type, payload}) {
  switch (type) {
    case 'VERSION_SUCCESS':
      return payload;
    default:
      return state 
  }
}
