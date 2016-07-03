import React, { PropTypes } from 'react'
import h from 'react-hyperscript'
import { Link } from 'react-router'

const NavGroupItem = ({text, glyph, link}) => h(Link, {
  to: link,
  className: 'nav-group-item',
  activeClassName: 'active',
}, [
  glyph && h('span', { className: `icon icon-text icon-${glyph}` }),
  text,
])

NavGroupItem.propTypes = {
  link: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  glyph: PropTypes.string,
}

export default NavGroupItem
