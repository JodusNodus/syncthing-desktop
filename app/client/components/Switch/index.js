import React, { PropTypes } from 'react'
import h from 'react-hyperscript'

import { styles } from './styles.scss'

const Switch = ({ on, onClick, onChild='ON', offChild='OFF' }) => h('div', {className: `${on ? 'on' : 'off'} ${styles}`, onClick}, [
  h('div.text.on', [ onChild ]),
  h('div.handle'),
  h('div.text.off', [ offChild ]),
])

Switch.propTypes = {
  on: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default Switch
