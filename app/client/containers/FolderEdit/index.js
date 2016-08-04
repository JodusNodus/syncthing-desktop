import { PropTypes, Component } from 'react'
import h from 'react-hyperscript'
import { reduxForm } from 'redux-form'
import { remote } from 'electron'
import _ from 'lodash'
const dialog = remote.dialog
import validationErrorMessage from 'client/utils/validation-error-message'

import Input from 'client/components/Input'
import { CheckBox } from 'react-photonkit'

import { getDevices } from 'main/reducers/devices'
import { showMessageBar, hideMessageBar } from 'client/actions/message-bar'
import validate from './validate'

import { styles } from './styles.scss'

const fields = [
  'id',
  'label',
  'rescanIntervalS',
  'ignorePerms',
  'order',
  'path',
  'type',
  'fileVersioningSelector',
  'minDiskFreePct',
  'autoNormalize',
  'devices',
  'maxConflicts',
  'simpleKeep',
  'staggeredCleanInterval',
  'staggeredMaxAge',
  'staggeredVersionsPath',
  'trashcanClean',
]

const typeOptions = [
  {value: 'readwrite', text: 'Normal'},
  {value: 'write', text: 'Master'},
]

const orderOptions = [
  {value: 'random', text: 'Random'},
  {value: 'alphabetic', text: 'Alphabetic'},
  {value: 'smallestFirst', text: 'Smallest First'},
  {value: 'largestFirst', text: 'Largest First'},
  {value: 'oldestFirst', text: 'Oldest First'},
]

const versioningOptions = [
  {value: 'none', text: 'None'},
  {value: 'trashcan', text: 'Trashcan'},
  {value: 'simple', text: 'Simple'},
  {value: 'staggered', text: 'Staggered'},
  {value: 'external', text: 'External'},
]

class FolderEdit extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    initialValues: PropTypes.object.isRequired,
    showMessageBar: PropTypes.func.isRequired,
    hideMessageBar: PropTypes.func.isRequired,
    devices: PropTypes.array.isRequired,
  }

  shouldComponentUpdate(newProps){
    //Don't update when devices has changed (wich happens periodicaly)
    return !_.isEqual(this.props.fields, newProps.fields)
  }
  componentDidUpdate(){
    validationErrorMessage(this.props)
  }
  handlePath(){
    const options = {
      title: 'Select folder for Syncthing',
      properties: ['openDirectory'],
    }

    const handleOpen = paths => {
      //Use onChange event handler to force change value of the Path input.
      this.props.fields.path.onChange(paths[0])
    }

    dialog.showOpenDialog(remote.getCurrentWindow(), options, handleOpen)
  }
  render(){
    const {
      fields: {
        id,
        label,
        rescanIntervalS,
        ignorePerms,
        order,
        path,
        type,
        fileVersioningSelector,
        minDiskFreePct,
      },
      devices,
    } = this.props

    const isNewFolder = id.initialValue.length < 1 || label.initialValue.length < 1 || path.initialValue.length < 1

    return h('form', {className: styles}, [
      isNewFolder && h(Input, {label: 'Folder ID', placeholder: 'e.g. GXWxf-3zgnU', ...id}),
      h(Input, {label: 'Label', placeholder: 'e.g. Personal Documents', ...label}),
      isNewFolder && h(Input, {
        label: [
          'Path',
          h('a', {onClick: this.handlePath.bind(this)}, 'Open Select Dialog'),
        ],
        placeholder: 'e.g /Users/jodus/Documents',
        ...path,
      }),
      h(SharedDevices, {devices, devicesField: this.props.fields.devices}),
      isNewFolder && h('div.form-group', [
        h('label', 'Type'),
        h('select.form-control', {...type}, typeOptions.map(
          ({value, text}) => h('option', {value}, text)
        )),
      ]),
      h(Input, {label: 'Rescan Interval (in seconds)', type: 'number', ...rescanIntervalS}),
      h(CheckBox, {label: 'Ignore Permissions', ...ignorePerms}),
      h('div.form-group', [
        h('label', 'File Pull Order'),
        h('select.form-control', {...order}, orderOptions.map(
          ({value, text}) => h('option', {value}, text)
        )),
      ]),
      h('div.form-group', [
        h('label', 'File Versioning'),
        h('select.form-control', {...fileVersioningSelector}, versioningOptions.map(
          ({value, text}) => h('option', {value}, text)
        )),
      ]),
      h(Input, {label: 'Minimum Disk Free (in percent)', type: 'number', ...minDiskFreePct}),
    ])
  }
}

const mapStateToProps = (state, {params, initialValues}) => ({
  devices: getDevices(state),
  initialValues: initialValues || state.folders.folders[params.id],
})

export default reduxForm(
  {
    form: 'folderEdit',
    fields,
    validate,
  },
  mapStateToProps,
  {showMessageBar, hideMessageBar},
)(FolderEdit)


const SharedDevices = ({devices, devicesField}) => {

  const onChange = e => {
    const deviceID = e.target.id
    const checked = e.target.checked

    const updatedDevices = checked ? [
      ...devicesField.value,
      {deviceID},
    ] : devicesField.value.filter(device => device.deviceID !== deviceID)

    devicesField.onChange(updatedDevices)
  }

  return h('div.form-group', [
    h('label', 'Shared Devices'),
    h('div.shared-devices', devices.map(({name, deviceID}) => {
      return h(CheckBox, {
        label: name,
        id: deviceID,
        onChange,
        checked: devicesField.value.filter(device => device.deviceID == deviceID).length > 0,
      })
    })),
  ])
}
