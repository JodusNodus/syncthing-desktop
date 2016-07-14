import { PropTypes } from 'react'
import h from 'react-hyperscript'
import { ButtonGroup } from 'react-photonkit'
import { Link } from 'react-router'

import { styles } from './styles.scss'

const SegmentedControl = ({children, buttons}) => h('div.segmented-container', {className: styles}, [
  h('div.segmented-controls', [
    h(ButtonGroup, buttons.map(({link, text}) => {
      return h(Link, {to: link, className: 'btn btn-default', activeClassName: 'btn-primary'}, text)
    })),
    h('hr'),
  ]),
  h('div.segmented-content', [
    children,
  ]),
])

SegmentedControl.propTypes = {
  children: PropTypes.node.isRequired,
  buttons: PropTypes.array.isRequired,
}

export default SegmentedControl
