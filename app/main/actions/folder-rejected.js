
export function showFolderRejected(payload) {
  return {
    type: 'FOLDER_REJECTED',
    payload,
  }
}

export function acceptFolderRejected(){
  return {
    type: 'FOLDER_REJECTED_ACCEPT',
  }
}

export function clearFolderRejected(){
  return {
    type: 'FOLDER_REJECTED_CLEAR',
  }
}
