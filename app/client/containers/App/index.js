import { ipcRenderer, remote } from 'electron'
const dialog = remote.dialog
import h from 'react-hyperscript'
import { Component, PropTypes, cloneElement } from 'react'
import Sidebar from '../../components/Sidebar'
import { Window, Toolbar, Actionbar, Button, Content, Pane } from 'react-photonkit'
import { connect } from 'react-redux'
import _ from 'lodash'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import QRCode from 'qrcode.react'
import Modal from '../../components/Modal'
import MessageBar from '../../components/MessageBar'
import Disconnected from '../../components/Disconnected'
import QrReader from 'react-qr-reader'

import * as systemActionCreators from '../../../main/actions/system'
import * as configActionCreators from '../../../main/actions/config'
import * as qrCodeModalActionCreators from '../../actions/qr-code-modal'
import * as qrCodeScanModalActionCreators from '../../actions/qr-code-scan-modal'
import './global.scss'

const partOf = x => y => x.indexOf(y) >= 0

class App extends Component {
  constructor(props){
    super(props)
    this.redirect = this.redirect.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleSubmitButton = this.handleSubmitButton.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }
  componentDidMount(){
    //Let main proccess know that the window is ready
    ipcRenderer.send('ready', remote.getCurrentWindow().id)

    this.redirect()
  }
  shouldComponentUpdate(nextProps){
    return !_.isEqual(nextProps, this.props)
  }
  componentWillUpdate(nextProps){
    this.redirect(nextProps)
  }
  handleSubmitButton(){
    if(this.refs.child.submit){
      this.refs.child.submit()
    }else{
      this.refs.child.getWrappedInstance().refs.form.submit()
    }
  }
  handleSubmit(form){
    const { location: { pathname }, setClientConfig, setServiceConfig, folders, devices, params } = this.props

    if(pathname == '/preferences/client'){
      setClientConfig(form)
    }else if(pathname == '/preferences/service'){
      setServiceConfig('options', form)
    }else if(pathname == `/folder/${params.id}/edit`){

      const updatedFolders = folders.map(folder => {
        if(folder.id == params.id){
          return {
            ...folder,
            ...form,
          }
        }
        return folder
      })

      setServiceConfig('folders', updatedFolders)

    }else if(pathname == `/device/${params.id}/edit`){

      const updatedDevices = devices.map(device => {
        if(device.deviceID == params.id){
          return {
            ...device,
            ...form,
          }
        }
        return device
      })

      setServiceConfig('devices', updatedDevices)

    }else if(pathname == '/device-add'){
      const updatedDevices = [
        ...devices,
        form,
      ]

      setServiceConfig('devices', updatedDevices)
    }
  }
  handleDelete(){
    const { params: { id }, location: { pathname }, devices, folders, setServiceConfig } = this.props

    const type = pathname == `/device/${id}/edit` ? 'devices' : 'folders' 

    const object = type == 'devices' ? devices : folders

    const item = object.filter(x => x.deviceID == id || x.id == id)[0]

    const buttons = ['Cancel', 'Delete']

    dialog.showMessageBox({
      browserWindow: remote.getCurrentWindow(),
      type: 'warning',
      buttons,
      message: `Are you sure you want to delete ${item.label || item.name} from ${type}?`,
    }, i => {
      if(buttons[i] == 'Delete'){
        const updatedItems = this.props[type].filter(x => x.deviceID != id && x.id != id)
        setServiceConfig(type, updatedItems)
      }
    })
  }
  redirect(nextProps={config: {isSuccess: false}}){
    const { config, location } = this.props
 
    //Redirect when config was saved
    if(config.isFailed && nextProps.config.isSuccess && location.pathname == '/preferences/client'){
      push('/')
    }
    
    //Redirect if config was not found
    if(config.isFailed && location.pathname !== '/preferences/client'){
      push('/preferences/client')
    }
  }
  render() {
    const {
      folders,
      devices,
      location: {
        pathname,
      },
      connected,
      config,
      children,
      qrCodeModal,
      hideQrCodeModal,
      messageBar,
      qrCodeScanModal,
      hideQrCodeScanModal,
      scanQrCode,
      params: {
        id,
      },
    } = this.props


    const onPreferencePage = partOf(pathname)('/preferences') || partOf(pathname)('/edit') || partOf(pathname)('/device-add')
    const onEditPage = pathname == `/device/${id}/edit` || pathname == `/folder/${id}/edit`

    //An object defining all sections and items in the sidebar
    const sections = {
      folders: folders.map(({id, label}) => ({
        glyph: 'folder',
        text: label || id,
        key: id,
      })),
      devices: devices.map(({name, deviceID, online}) => ({
        glyph: 'monitor',
        text: name,
        key: deviceID,
        online,
      })),
      preferences: [
        { text: 'Service', glyph: 'cog', key: 'service' },
        { text: 'Client', glyph: 'cog', key: 'client' },
      ],
    }

    return h(Window, [
      h(Content, [
        connected && config.isSuccess && h(Sidebar, sections),

        //Modal for displaying qr codes
        h(Modal, {
          cancelButton: false,
          onDone: hideQrCodeModal,
          visible: qrCodeModal.show,
        }, [
          h(QRCode, {size: 250, value: qrCodeModal.qrCode}),
        ]),

        //Modal for scanning qr codes
        h(Modal, {
          cancelButton: false,
          onDone: hideQrCodeScanModal,
          visible: qrCodeScanModal.show,
        }, [
          qrCodeScanModal.show && h(QrReader, {handleScan: myID => {
            scanQrCode(myID)
            hideQrCodeScanModal()
          }}),
        ]),

        h(Pane, [
          h(MessageBar, {
            text: messageBar.msg,
            ptStyle: messageBar.ptStyle,
            visible: messageBar.show,
          }),

          h('div.main-pane', connected ? [

            //Clone element with new ref and onSubmit props for submitting forms from parent
            cloneElement(children, {ref: 'child', onSubmit: this.handleSubmit}),
          ] : [
            h(Disconnected),
          ]),
        ]),

      ]),
      onPreferencePage && h(Toolbar, {ptType: 'footer'}, [
        h(Actionbar, [
          onEditPage && h(Button, {
            text: 'delete',
            ptStyle: 'negative',
            onClick: this.handleDelete,
          }),
          h(Button, {
            text: 'save',
            ptStyle: 'primary',
            pullRight: true,
            onClick: this.handleSubmitButton,
          }),
        ]),
      ]),
    ])
    //return (
      //{
        //(() => {
          //if (process.env.NODE_ENV !== 'production') {
            //const DevTools = require('./DevTools') // eslint-disable-line global-require
            //return <DevTools />
          //}
        //})()
      //}
    //);
  }
}

App.propTypes = {
  children: PropTypes.element.isRequired,
  devices: PropTypes.array.isRequired,
  folders: PropTypes.array.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  connected: PropTypes.bool.isRequired,
  config: PropTypes.object.isRequired,
  setClientConfig: PropTypes.func.isRequired,
  setServiceConfig: PropTypes.func.isRequired,
  qrCodeModal: PropTypes.object.isRequired,
  hideQrCodeModal: PropTypes.func.isRequired,
  messageBar: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  qrCodeScanModal: PropTypes.object.isRequired,
  hideQrCodeScanModal: PropTypes.func.isRequired,
  scanQrCode: PropTypes.func.isRequired,
}

export default connect(
  state => ({
    devices: state.devices,
    folders: state.folders,
    connected: state.connected,
    config: state.config,
    qrCodeModal: state.qrCodeModal,
    form: state.form,
    messageBar: state.messageBar,
    qrCodeScanModal: state.qrCodeScanModal,
  }),
  dispatch => bindActionCreators({
    ...configActionCreators,
    ...systemActionCreators,
    ...qrCodeModalActionCreators,
    ...qrCodeScanModalActionCreators,
  }, dispatch)
)(App)
