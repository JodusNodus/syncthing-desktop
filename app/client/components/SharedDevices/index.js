import { PropTypes, Component } from 'react'
import h from 'react-hyperscript'
import { Table } from 'react-photonkit'

export default class SharedDevices extends Component {
  render(){
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
          h('tbody', devices.map(({name, deviceID}) => h('tr', [
            h('td', name),
            h('td', `${0}%`),
          ]))),
        ]),
      ]),
      h('div.right'),
    ])
  }
}

SharedDevices.propTypes = {
  devices: PropTypes.array.isRequired,
}
