import { PropTypes } from 'react'
import h from 'react-hyperscript'

import { styles } from './styles.scss'

const MessageBar = ({visible=false, ptStyle='default', text=''}) =>
h('div.msg', {className: `${visible && 'visible'} ${styles} msg-${ptStyle}`}, text)

MessageBar.propTypes = {
  text: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  ptStyle: PropTypes.string,
}

export default MessageBar
