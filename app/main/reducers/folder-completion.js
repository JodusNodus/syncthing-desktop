export default function folderCompletion(state = {}, {type, payload, folder, device}) {
  switch (type){
    case 'DEVICE_FOLDER_COMPLETION_GET_SUCCESS':
    return {
      ...state,
      [folder]: {
        ...state[folder],
        [device]: payload.completion,
      },
    }
    default:
    return state
  }
}
