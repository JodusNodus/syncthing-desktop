import React, { PropTypes } from 'react'
import h from 'react-hyperscript'

import { styles } from './styles.scss'

const Switch = ({ on, onClick }) => h('div', {className: `${on ? 'on' : 'off'} ${styles}`, onClick}, [
  h('div.text.on', 'ON'),
  h('div.handle'),
  h('div.text.off', 'OFF'),
])

Switch.propTypes = {
  on: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default Switch
