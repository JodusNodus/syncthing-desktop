import React, { PropTypes } from 'react'
import h from 'react-hyperscript'

const Size = ({value}) => h('span', formatBytes(value))

Size.propTypes = {
  value: PropTypes.number.isRequired,
}

export default Size

function formatBytes(bytes, decimals=0) {
  if(bytes == 0) return '0 Byte'
  let k = 1000 // or 1024 for binary
  let dm = decimals + 1 || 3
  let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
