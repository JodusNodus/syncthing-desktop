import React, { PropTypes, Component } from 'react'
import h from 'react-hyperscript'
import { connect } from 'react-redux'

class Folder extends Component {
  render(){
    const { folders, params, files } = this.props
    const folder = folders.filter(x => x.id == params.id)[0]

    if(folder){
      return h('div.padded-more', [
        h('header.page-header', [
          h('h1', folder.label || folder.id),
        ]),
        h('hr'),
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
  files: PropTypes.object.isRequired,
}

export default connect(
  state => ({
    folders: state.folders,
    files: state.folderFiles,
  })
)(Folder)
