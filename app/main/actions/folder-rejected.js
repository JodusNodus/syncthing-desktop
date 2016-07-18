
export const showFolderRejected = payload => ({
  type: 'FOLDER_REJECTED',
  payload,
})

export const acceptFolderRejected = () => ({
  type: 'FOLDER_REJECTED_ACCEPT',
})

export const clearFolderRejected = () => ({
  type: 'FOLDER_REJECTED_CLEAR',
})
