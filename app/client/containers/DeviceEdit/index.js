import { PropTypes, Component } from 'react'
import h from 'react-hyperscript'
import { reduxForm } from 'redux-form'
import Input from '../../components/Input'
import { CheckBox } from 'react-photonkit'
import * as messageBarActionCreators from '../../actions/message-bar'
import * as qrCodeScanModalActionCreators from '../../actions/qr-code-scan-modal'
import { bindActionCreators } from 'redux'
import validationErrorMessage from '../../utils/validation-error-message'

const fields = [
  'deviceID',
  'name',
  'addresses',
  'compression',
  'introducer',
]

const deviceIDFormat = /([A-Z0-9]{7}\-?){8}/


const compressionOptions = [
  {value: 'always', text: 'All Data'},
  {value: 'metadata', text: 'Only Metadata'},
  {value: 'never', text: 'No Data'},
]

function validate({
  deviceID='',
  name='',
  addresses=[],
}) {
  const errors = {}

  //Device ID
  if(deviceID.length < 1){
    errors.deviceID = 'Device ID should have at least one character.'
  }else if(!deviceIDFormat.test(deviceID)){
    //Test if deviceID is correctly formatted
    errors.deviceID = 'Device ID should conform to the official format.'
  }

  
  //Name
  if(name.length < 1){
    errors.name = 'Name should have at least one character.'
  }

  //Addresses
  if(addresses.length < 1){
    errors.addresses = 'Addresses should have at least one address.'
  }

  return errors
}

class DeviceEdit extends Component {
  componentWillUpdate(newProps){
    validationErrorMessage(newProps)

    if(!this.props.qrCodeScanModal.qrCode && newProps.qrCodeScanModal.qrCode){
      this.props.fields.deviceID.onChange(newProps.qrCodeScanModal.qrCode)
    }
  }
  componentDidUpdate(){
    validationErrorMessage(this.props)
  }
  handleQrCodeClick(){
    const { showQrCodeScanModal } = this.props
    showQrCodeScanModal()
  }
  render(){
    const {
      fields: {
        deviceID,
        name,
        addresses,
        compression,
        introducer,
      },
    } = this.props

    const isNewDevice = deviceID.initialValue.length < 1

    return h('form', [
      isNewDevice && h(Input, {
        label: 'Device ID',
        placeholder: 'Click to scan QR-Code using webcam.',
        onClick: this.handleQrCodeClick.bind(this),
        ...deviceID,
      }),
      h(Input, {label: 'Name', placeholder: 'e.g. Phone', ...name}),
      h(Input, {label: 'Addresses', placeholder: 'e.g. tcp://192.168.1.18:22000', ...addresses}),
      h(CheckBox, {label: 'Introducer', ...introducer}),
      h('div.form-group', [
        h('label', 'Compression'),
        h('select.form-control', {...compression}, compressionOptions.map(
          ({value, text}) => h('option', {value}, text)
        )),
      ]),
    ])
  }
}

DeviceEdit.propTypes = {
  fields: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  showMessageBar: PropTypes.func.isRequired,
  hideMessageBar: PropTypes.func.isRequired,
  showQrCodeScanModal: PropTypes.func.isRequired,
  qrCodeScanModal: PropTypes.object.isRequired,
}

export default reduxForm(
  {
    form: 'deviceEdit',
    fields,
    validate,
  },
  state => ({qrCodeScanModal: state.qrCodeScanModal}),
  dispatch => bindActionCreators({
    ...messageBarActionCreators,
    ...qrCodeScanModalActionCreators,
  }, dispatch)
)(DeviceEdit)
