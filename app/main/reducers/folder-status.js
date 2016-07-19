export default function folderStatus(state = {}, {type, payload, id, ...action}) {
  switch (type){
    case 'FOLDER_STATUS_GET_SUCCESS':
    return {
      ...state,
      [id]: payload,
    }
    case 'FOLDER_STATE_CHANGE':
    return {
      ...state,
      [id]: {
        ...state[id],
        state: payload,
      },
    }
    default:
    return state
  }
}
