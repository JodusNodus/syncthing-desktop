import React, { PropTypes, Component } from 'react'
import h from 'react-hyperscript'

import { styles } from './styles.scss'

const Disconnected = () =>
h('div', {className: styles}, [
  h('h1', 'Disconnected'),
])

export default Disconnected
