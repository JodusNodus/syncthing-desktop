export default function folders(state = [], {type, payload, id}) {
  switch (type){
    case 'FOLDERS_SUCCESS':
      return payload
    case 'FOLDER_STATUS_SUCCESS':
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
