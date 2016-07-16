import { Link } from 'react-router'
import h from 'react-hyperscript'

import { styles } from './styles.scss'

const Disconnected = () =>
h('div', {className: styles}, [
  h('h1', 'Disconnected'),
  h(Link, {to: '/preferences/client'}, 'Change preferences'),
])

export default Disconnected
