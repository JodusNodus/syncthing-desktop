export default function folderStats(state = {}, {type, payload}) {
  switch (type){
    case 'FOLDER_STATS_GET_SUCCESS':
    return payload
    default:
    return state
  }
}
