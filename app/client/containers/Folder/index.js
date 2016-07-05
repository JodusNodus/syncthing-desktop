import React, { PropTypes, Component } from 'react'
import h from 'react-hyperscript'
import { connect } from 'react-redux'

import FolderExplorer from '../../components/FolderExplorer'

class Folder extends Component {
  render(){
    const { folders, params, files } = this.props
    const folder = folders.filter(x => x.id == params.id)[0]

    return folder ? h('div', [ 
      files[folder.id] && h(FolderExplorer, {files: files[folder.id]}),
    ]) : h('div', [
      h('h1', 'Folder not available'),
    ])
  }
}

Folder.propTypes = {
  params: PropTypes.object.isRequired,
  folders: PropTypes.array.isRequired,
  files: PropTypes.object.isRequired,
}

export default connect(
  state => ({
    folders: state.folders,
    files: state.folderFiles,
  })
)(Folder)
