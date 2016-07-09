import React, { PropTypes } from 'react'
import h from 'react-hyperscript'

import { styles } from './styles.scss'

const Toggle = ({ state, onToggle, trueChild='ON', falseChild='OFF' }) =>
h('div', {className: `${state ? 'on' : 'off'} ${styles}`, onClick: () => onToggle(!state)}, [
  h('div.text.on', [ trueChild ]),
  h('div.handle'),
  h('div.text.off', [ falseChild ]),
])

Toggle.propTypes = {
  state: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
}

export default Toggle
