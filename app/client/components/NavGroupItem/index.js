import { PropTypes } from 'react'
import h from 'react-hyperscript'
import { Link } from 'react-router'

import { styles } from './styles.scss'

const NavGroupItem = ({text, glyph, link, connected}) => h(Link, {
  to: link,
  className: `nav-group-item ${styles} ${connected && 'online'}`,
  activeClassName: 'active',
}, [
  connected && h('span.icon.icon-record.online'),
  glyph && h('span', { className: `icon icon-text icon-${glyph}` }),
  text,
])

NavGroupItem.propTypes = {
  link: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  glyph: PropTypes.string,
  connected: PropTypes.bool,
}

export default NavGroupItem
