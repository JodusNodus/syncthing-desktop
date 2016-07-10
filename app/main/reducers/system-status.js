export default function systemStatus(state = {}, {type, payload}) {
  switch (type) {
    case 'SYSTEM_STATUS_SUCCESS':
      return payload;
    default:
      return state 
  }
}
