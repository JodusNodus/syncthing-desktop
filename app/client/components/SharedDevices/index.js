import React, { PropTypes, Component } from 'react'
import h from 'react-hyperscript'
import { Table, ButtonGroup, Button } from 'react-photonkit'
import Size from '../Size'

export default class SharedDevices extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeItem: null,
    }
  }
  render(){
    const { activeItem } = this.state
    const { devices } = this.props

    return h('div.section-item.shared-devices', [
      h('p.left', 'Shared Devices:'),
      h('div.center', [
        h(Table, [
          h('thead', [
            h('tr', [
              h('th', 'Name'),
              h('th', 'Sync'),
            ]),
          ]),
          h('tbody', devices.map(({name, deviceID}) => h('tr', {
            className: activeItem == deviceID ? 'active' : '',
            onClick: () => this.setState({ activeItem: deviceID }),
          }, [
            h('td', name),
            h('td', `${0}%`),
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

SharedDevices.propTypes = {
  devices: PropTypes.array.isRequired,
}
