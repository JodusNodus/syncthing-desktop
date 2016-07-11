import { ipcRenderer, remote } from 'electron'
import h from 'react-hyperscript'
import { Component, PropTypes, cloneElement } from 'react'
import Sidebar from '../../components/Sidebar'
import { Window, Toolbar, Actionbar, Button, Content, Pane } from 'react-photonkit'
import { connect } from 'react-redux'
import _ from 'lodash'
import { bindActionCreators } from 'redux'
import QRCode from 'qrcode.react'
import Modal from '../../components/Modal'

import * as systemActionCreators from '../../../main/actions/system'
import * as configActionCreators from '../../../main/actions/config'
import * as qrCodeModalActionCreators from '../../actions/qr-code-modal'
import './global.scss'

class App extends Component {
  constructor(props){
    super(props)
    this.redirect = this.redirect.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleSubmitButton = this.handleSubmitButton.bind(this)
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
    this.refs.child.submit()
  }
  handleSubmit(form){
    const { location, setClientConfig, setServiceConfig} = this.props
    if(location.pathname == '/preferences/client'){
      setClientConfig(form)
    }else if(location.pathname == '/preferences/service'){
      setServiceConfig('options', form)
    }
  }
  redirect(nextProps={config: {isSuccess: false}}){
    const { history, config, connected, location } = this.props

    //Redirect when config was saved
    if(config.isFailed && nextProps.config.isSuccess && location.pathname == '/preferences/client'){
      history.push('/')
    }
    
    
    //Redirect if config was not found
    if(config.isFailed && location.pathname !== '/preferences/client'){
      history.push('/preferences/client')
    }else if(!connected && location.pathname !== '/disconnected'){
      history.push('/disconnected')
    }
  }
  render() {
    const { folders, devices, location, connected, config, children, qrCodeModal, hideQrCodeModal } = this.props

    const onPreferencePage = /\/preferences\/.*/.test(location.pathname)

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

        //Show popover modal for displaying qr codes
        h(Modal, {
          cancelButton: false,
          onDone: hideQrCodeModal,
          visible: qrCodeModal.show,
        }, [
          h(QRCode, {size: 250, value: qrCodeModal.qrCode}),
        ]),

        h(Pane, {className: 'main-pane'}, [
          //Clone element with new ref and onSubmit props for submitting forms from parent
          cloneElement(children, {ref: 'child', onSubmit: this.handleSubmit}),
        ]),
      ]),
      onPreferencePage && h(Toolbar, {ptType: 'footer'}, [
        h(Actionbar, [
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
}

export default connect(
  state => ({
    devices: state.devices,
    folders: state.folders,
    connected: state.connected,
    config: state.config,
    qrCodeModal: state.qrCodeModal,
  }),
  dispatch => bindActionCreators({
    ...configActionCreators,
    ...systemActionCreators,
    ...qrCodeModalActionCreators,
  }, dispatch)
)(App)
