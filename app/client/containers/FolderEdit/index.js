import { PropTypes, Component } from 'react'
import h from 'react-hyperscript'
import { connect } from 'react-redux'

import { styles } from './styles.scss'

class FolderEdit extends Component {
  render(){
    const { folders, params } = this.props
    const folder = folders.filter(x => x.id == params.id)[0]

    return h('div', {className: styles}, [
    ])
  }
}

FolderEdit.propTypes = {
  params: PropTypes.object.isRequired,
  folders: PropTypes.array.isRequired,
  status: PropTypes.object.isRequired,
  devices: PropTypes.array.isRequired,
}

export default connect(
  state => ({
    folders: state.folders,
    status: state.systemStatus,
    devices: state.devices,
  })
)(FolderEdit)
