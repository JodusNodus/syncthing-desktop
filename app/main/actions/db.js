export function folderStatus(folders, st){
  return dispatch => folders.forEach(({id}) => {
    st.db.status(id).then(payload => {
      dispatch({ type: 'FOLDER_STATUS_SUCCESS', id, payload })
    }).catch(error => {
      dispatch({ type: 'CONNECTION_ERROR', error })
    })
  })
}
