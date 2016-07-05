import _ from 'lodash'

export function folderFiles(state = {}, {type, payload, id }) {
  switch (type){
    case 'BROWSE_FOLDER_SUCCESS':
      return {
      ...state,
      [id]: filterFiles(payload),
    }
    default:
      return state
  }
}

const filterFiles = files =>
_.flattenDeep(_.toArray(_.mapValues(files, (val, key) => {
  if(_.isArray(val)){
    const [date, size] = val
    return { date, size, name: key }
  }else{
    return filterFiles(val)
  }
})))
