import { PropTypes, Component } from 'react'
import h from 'react-hyperscript'
import { reduxForm } from 'redux-form'

import Input from 'client/components/Input'
import { CheckBox } from 'react-photonkit'

import { showMessageBar, hideMessageBar } from 'client/actions/message-bar'
import { showQrCodeScanModal } from 'client/actions/qr-code-scan-modal'
import validationErrorMessage from 'client/utils/validation-error-message'
import validate from './validate'

const fields = [
  'deviceID',
  'name',
  'addresses',
  'compression',
  'introducer',
]

const compressionOptions = [
  {value: 'always', text: 'All Data'},
  {value: 'metadata', text: 'Only Metadata'},
  {value: 'never', text: 'No Data'},
]

class DeviceEdit extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    initialValues: PropTypes.object.isRequired,
    showMessageBar: PropTypes.func.isRequired,
    hideMessageBar: PropTypes.func.isRequired,
    showQrCodeScanModal: PropTypes.func.isRequired,
    qrCodeScanModal: PropTypes.object.isRequired,
  }

  componentWillUpdate(newProps){
    validationErrorMessage(this.props)

    if(!this.props.qrCodeScanModal.qrCode && newProps.qrCodeScanModal.qrCode){
      this.props.fields.deviceID.onChange(newProps.qrCodeScanModal.qrCode)
    }
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
        label: [
          'Device ID',
          h('a', {onClick: this.handleQrCodeClick.bind(this)}, 'Scan QR-Code'),
        ],
        placeholder: 'e.g. P56IOI7-MZJNU2Y-IQGDREY-DM2MGTI-MGL3BXN-PQ6W5BM-TBBZ4TJ-XZWICQ2',
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

const mapStateToProps = (state, {params, initialValues}) => ({
  qrCodeScanModal: state.qrCodeScanModal,
  initialValues: initialValues || state.devices.devices[params.id],
})

export default reduxForm(
  {
    form: 'deviceEdit',
    fields,
    validate,
  },
  mapStateToProps,
  {showMessageBar, hideMessageBar, showQrCodeScanModal}
)(DeviceEdit)
