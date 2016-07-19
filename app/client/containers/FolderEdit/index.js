import { PropTypes, Component } from 'react'
import h from 'react-hyperscript'
import { reduxForm } from 'redux-form'
import Input from '../../components/Input'
import { CheckBox } from 'react-photonkit'
import { showMessageBar, hideMessageBar } from '../../actions/message-bar'
import validationErrorMessage from '../../utils/validation-error-message'
import { remote } from 'electron'
import _ from 'lodash'
const dialog = remote.dialog

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

function validate({
  id='',
  label='',
  path='',
  rescanIntervalS='',
  minDiskFreePct='',
}) {
  const errors = {}
  //Path
  if(path.length < 1){
    errors.path = 'Path should be a valid directory.'
  }

  //Folder ID
  if(id.length < 1){
    errors.id = 'Folder ID should have at least one character.'
  }

  //Label
  if(label.length < 1) {
    errors.label = 'Label should have at least one character.'
  }

  //Rescan Interval
  if(isNaN(parseInt(rescanIntervalS))){
    errors.rescanIntervalS = 'Rescan Interval should be a number.'
  }else if(parseInt(rescanIntervalS) < 1){
    errors.rescanIntervalS = 'Rescan Interval should be larger than 0.'
  }

  //Minimum Disk Free
  if(isNaN(parseInt(minDiskFreePct))){
    errors.minDiskFreePct = 'Minimum Disk Free should be a number.'
  }else if(parseInt(minDiskFreePct) > 100 || parseInt(minDiskFreePct) < 0){
    errors.minDiskFreePct = 'Minimum Disk Free should be percent value between 0 and 100.'
  }

  return errors
}

class FolderEdit extends Component {
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
        label: 'Path',
        placeholder: 'Click to open dialog.',
        onClick: this.handlePath.bind(this),
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

FolderEdit.propTypes = {
  fields: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  showMessageBar: PropTypes.func.isRequired,
  hideMessageBar: PropTypes.func.isRequired,
  devices: PropTypes.array.isRequired,
}

const mapStateToProps = state => ({
  devices: state.devices.devices,
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
