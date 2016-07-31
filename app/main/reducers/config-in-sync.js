export default function configInSync(state = true, {type, payload}) {
  switch (type) {
    case 'CONFIG_IN_SYNC_GET_SUCCESS':
    return payload.configInSync
    default:
    return state
  }
}
