export function folderStatus(folders){
  return dispatch => folders.forEach(({id}) => {
    global.st.db.status(id).then(payload => {
      dispatch({ type: 'FOLDER_STATUS_SUCCESS', id, payload })
    }).catch(error => {
      dispatch({ type: 'CONNECTION_ERROR', error })
    })
  })
}
