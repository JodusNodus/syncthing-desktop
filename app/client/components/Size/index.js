import { PropTypes } from 'react'
import h from 'react-hyperscript'
import { formatBytes } from 'main/utils/misc'

const Size = ({value}) => h('span', formatBytes(value))

Size.propTypes = {
  value: PropTypes.number.isRequired,
}

export default Size
