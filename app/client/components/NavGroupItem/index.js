import { PropTypes } from 'react'
import h from 'react-hyperscript'
import { Link } from 'react-router'

import { styles } from './styles.scss'

const NavGroupItem = ({text, glyph, link, indicator=false, indicatorStyle='default'}) => h(Link, {
  to: link,
  className: `nav-group-item ${styles} ${indicator && 'indicator'}`,
  activeClassName: 'active',
}, [
  indicator && h('span.icon.icon-record', {className: indicatorStyle}),
  glyph && h('span', { className: `icon icon-text icon-${glyph}` }),
  text,
])

NavGroupItem.propTypes = {
  link: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  glyph: PropTypes.string,
  indicator: PropTypes.bool,
  indicatorStyle: PropTypes.string,
}

export default NavGroupItem
