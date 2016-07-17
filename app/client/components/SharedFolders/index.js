import { PropTypes, Component } from 'react'
import h from 'react-hyperscript'
import { Table } from 'react-photonkit'
import Size from '../Size'

export default class SharedFolders extends Component {
  render(){
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
          h('tbody', folders.map(({label, id, status}) => h('tr', [
            h('td', label || id),
            h('td', [
              h(Size, {value: status ? status.globalBytes : 0}),
            ]),
          ]))),
        ]),
      ]),
      h('div.right'),
    ])
  }
}

SharedFolders.propTypes = {
  folders: PropTypes.array.isRequired,
}
