import React, { PropTypes, Component } from 'react'
import h from 'react-hyperscript'
import { connect } from 'react-redux'
import { shell } from 'electron'
import Chart from 'chart.js'

import Size from '../../components/Size'

class Folder extends Component {
  render(){
    const { folders, params, status } = this.props
    const folder = folders.filter(x => x.id == params.id)[0]

    if(folder){
      return h('div.padded-more', [
        h('header.page-header', [
          h('h2', folder.label || folder.id),
        ]),
        h('hr'),
        h(Path, {path: folder.path, home: status.tilde}),
        h(GlobalState, folder.status),
        h(InSyncState, folder.status),
      ])
    }else{
      return h('div', [
        h('h1', 'Folder not available'),
      ])
    }
  }
}

Folder.propTypes = {
  params: PropTypes.object.isRequired,
  folders: PropTypes.array.isRequired,
  status: PropTypes.object.isRequired,
}

export default connect(
  state => ({
    folders: state.folders,
    status: state.systemStatus,
  })
)(Folder)

const Path = ({path, home}) => h('div.section-item', [
  h('p.left', 'Path:'),
  h('p.center', path.replace(home, '~')),
  h('a.right', {
    onClick: () => shell.showItemInFolder(path),
  }, 'Open'),
])

const GlobalState = ({globalFiles, globalBytes}) => h('div.section-item', [
  h('p.left', 'Global State:'),
  h('p.center', [
    `${globalFiles} files`,
    ' (',
    h(Size, {value: globalBytes}),
    ')',
  ]),
  h('p.right'),
])

const InSyncState = ({inSyncFiles, inSyncBytes}) => h('div.section-item', [
  h('p.left', 'Synchronized State:'),
  h('p.center', [
    `${inSyncFiles} files`,
    ' (',
    h(Size, {value: inSyncBytes}),
    ')',
  ]),
  h('p.right'),
])
