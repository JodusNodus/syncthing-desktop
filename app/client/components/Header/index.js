import { PropTypes } from 'react'
import h from 'react-hyperscript'

import { styles } from './styles.scss'

const Header = ({children}) => h('header', {className: styles}, [
  children,
])

Header.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Header
