export default function systemStatus(state = {}, {type, payload}) {
  switch (type) {
    case 'SYSTEM_STATUS_GET_SUCCESS':
    return payload
    default:
    return state
  }
}
