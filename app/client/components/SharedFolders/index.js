import React, { PropTypes, Component } from 'react'
import h from 'react-hyperscript'
import { Table, ButtonGroup, Button } from 'react-photonkit'

export default class SharedFolders extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeItem: null,
    }
  }
  render(){
    const { activeItem } = this.state
    const { folders } = this.props

    return h('div.section-item.shared-folders', [
      h('p.left', 'Shared Folders:'),
      h('div.center', [
        h(Table, [
          h('thead', [
            h('tr', [
              h('th', 'Name'),
              h('th', 'Size'),
            ]),
          ]),
          h('tbody', folders.map(({label, id, status}) => h('tr', {
            className: activeItem == id ? 'active' : '',
            onClick: () => this.setState({ activeItem: id }),
          }, [
            h('td', label || id),
            h('td', status ? status.globalBytes : 0),
          ]))),
        ]),
        h(ButtonGroup, [
          h(Button, {ptStyle: 'default', glyph: 'plus'}),
          h(Button, {ptStyle: 'default', glyph: 'minus'}),    
        ]),
      ]),
      h('div.right'),
    ])
  }
}

SharedFolders.propTypes = {
  folders: PropTypes.array.isRequired,
}
