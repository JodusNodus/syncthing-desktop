export default function folderDownloadProgress(state = {}, {type, payload, id}) {
  switch (type) {
    case 'DOWNLOAD_PROGRESS':
    return {
      ...state,
      [id]: payload,
    }
    default:
    return state
  }
}
