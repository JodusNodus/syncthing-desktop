import { PropTypes } from 'react'
import h from 'react-hyperscript'

import { styles } from './styles.scss'

const MessageBar = ({visible=false, staticMsg=false, ptStyle='default', text=''}) =>
h('div.msg', {className: `${staticMsg ? 'static' : visible && 'visible'} ${styles} msg-${ptStyle}`}, text)

MessageBar.propTypes = {
  text: PropTypes.string.isRequired,
  visible: PropTypes.bool,
  static: PropTypes.bool,
  ptStyle: PropTypes.string,
}

export default MessageBar
