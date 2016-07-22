const initialState = {
  device: '',
  folder: '',
  folderLabel: '',
  accepted: false,
}

export default function folderRejected(state = initialState, {type, payload}) {
  switch (type){
    case 'FOLDER_REJECTED':
    return {
      ...payload,
    }
    case 'FOLDER_REJECTED_ACCEPT':
    return {
      ...state,
      accepted: true,
    }
    case 'FOLDER_REJECTED_CLEAR':
    return initialState
    default:
    return state
  }
}
