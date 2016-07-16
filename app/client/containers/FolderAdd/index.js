import { PropTypes, Component } from 'react'
import h from 'react-hyperscript'
import { connect } from 'react-redux'
import randomString from 'randomstring'

import FolderEdit from '../../containers/FolderEdit'

class FolderAdd extends Component {
  render(){
    const { onSubmit, myID } = this.props

    const randomID = randomString.generate(10)

    const formattedRandomID = [
      randomID.slice(0, 5),
      randomID.slice(5),
    ].join('-')

    const initialValues = {
      id: formattedRandomID,
      label: '',
      rescanIntervalS: 60,
      ignorePerms: false,
      order: 'random',
      path: '',
      type: 'readwrite',
      fileVersioningSelector: 'none',
      minDiskFreePct: 1,
      autoNormalize: true,
      devices: [
        {deviceID: myID},
      ],
      maxConflicts: 10,
      simpleKeep: 5,
      staggeredCleanInterval: 3600,
      staggeredMaxAge: 365,
      staggeredVersionsPath: '',
      trashcanClean: 0,
    }

    return h('div.padded-more', [ 
      h('header.page-header', [
        h('h2', 'Add Folder'),
      ]),
      h('hr'),
      h(FolderEdit, {ref: 'form', initialValues, onSubmit}),
    ])
  }
}

FolderAdd.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  myID: PropTypes.string.isRequired,
}

export default connect(
  state => ({myID: state.myID}),
  undefined,
  undefined,
  {withRef: true},
)(FolderAdd)
