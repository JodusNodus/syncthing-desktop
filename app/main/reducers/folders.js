export default function folders(state = [], {type, payload, id}) {
  switch (type){
    case 'FOLDERS_GET_SUCCESS':
      return payload
    case 'FOLDER_STATUS_GET_SUCCESS':
      return state.map(folder => {
      if(id == folder.id){
        return { ...folder, status: payload }
      }else{
        return folder
      }
    })
    default:
      return state
  }
}
