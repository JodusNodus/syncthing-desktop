import { ipcRenderer, remote } from 'electron'
const dialog = remote.dialog
import h from 'react-hyperscript'
import { Component, PropTypes, cloneElement } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { bindActionCreators } from 'redux'

import { Window, Toolbar, Actionbar, Button, Content } from 'react-photonkit'
import MessageBar from 'client/components/MessageBar'
import Disconnected from 'client/components/Disconnected'
import Sidebar from 'client/components/Sidebar'

import * as systemActionCreators from 'main/actions/system'
import * as configActionCreators from 'main/actions/config'
import * as dbActionCreators from 'main/actions/db'
import * as folderRejectedActionCreators from 'main/actions/folder-rejected'
import { getDevices } from 'main/reducers/devices'
import { getFolders } from 'main/reducers/folders'

import 'client/style/global.scss'

const partOf = x => y => x.indexOf(y) >= 0

const unCapitalize = str => str.charAt(0).toLowerCase() + str.slice(1)

const removeGuiPrefix = form => _.mapKeys(form, (val, key) => {
  if(partOf(key)('gui')){
    return unCapitalize(key.slice(3))
  }else{
    return key
  }
})

const mapStateToProps = state => ({
  devices: getDevices(state),
  folders: getFolders(state),
  connected: state.connected,
  config: state.config,
  form: state.form,
  messageBar: state.messageBar,
  folderRejected: state.folderRejected,
  configInSync: state.configInSync,
})

@connect(
  mapStateToProps,
  dispatch => bindActionCreators({
    ...configActionCreators,
    ...systemActionCreators,
    ...dbActionCreators,
    ...folderRejectedActionCreators,
  }, dispatch)
)
export default class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    devices: PropTypes.array.isRequired,
    folders: PropTypes.array.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    connected: PropTypes.bool.isRequired,
    config: PropTypes.object.isRequired,
    messageBar: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    folderRejected: PropTypes.object.isRequired,
    configInSync: PropTypes.bool.isRequired,
    setClientConfig: PropTypes.func.isRequired,
    setServiceConfig: PropTypes.func.isRequired,
    acceptFolderRejected: PropTypes.func.isRequired,
    setIgnores: PropTypes.func.isRequired,
  }

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

    const { devices, folderRejected, history, acceptFolderRejected } = nextProps

    if(folderRejected.folder && this.props.folderRejected.folder != folderRejected.folder){
      const deviceName = devices.filter(device => device.deviceID == folderRejected.device)[0].name

      new Notification(deviceName, {
        body: `wants to share the folder ${folderRejected.folderLabel || folderRejected.folder}.`,
      })

      const buttons = ['Accept', 'Decline']

      dialog.showMessageBox(remote.getCurrentWindow(), {
        type: 'warning',
        buttons,
        title: 'New Folder',
        message: `${deviceName} wants to share folder '${folderRejected.folderLabel || folderRejected.folder}' ?`,
        detail: `Would you like to add the folder with an ID of '${folderRejected.folder}' localy?`,
      }, i => {
        if(buttons[i] == 'Accept'){
          acceptFolderRejected()
          history.push('/folder-add')
        }
      })
    }

    if(!this.props.connected && nextProps.connected){
      global.st = remote.getGlobal('st')
    }

  }
  handleSubmitButton(){
    if(this.refs.child.submit){
      this.refs.child.submit()
    }else{
      this.refs.child.getWrappedInstance().refs.form.submit()
    }
  }
  handleSubmit(form){
    const { location: { pathname }, setClientConfig, setServiceConfig, folders, devices, params, setIgnores } = this.props

    if(pathname == '/preferences/client'){
      setClientConfig(form)
    }else if(pathname == '/preferences/service'){
      setServiceConfig('options', form)
      setServiceConfig('gui', removeGuiPrefix(form))
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
    }else if(pathname == '/folder-add'){
      const updatedFolders =  [
        ...folders,
        form,
      ]

      setServiceConfig('folders', updatedFolders)
    }else if(pathname == `/folder/${params.id}/ignores`){
      const ignores = {
        ignore: form.ignores.split('\n'),
      }
      setIgnores(params.id, ignores)
    }
  }
  handleDelete(){
    const { params: { id }, location: { pathname }, devices, folders, setServiceConfig } = this.props

    const type = pathname == `/device/${id}/edit` ? 'devices' : 'folders'

    const object = type == 'devices' ? devices : folders

    const item = object.filter(x => x.deviceID == id || x.id == id)[0]

    const buttons = ['Cancel', 'Delete']

    dialog.showMessageBox(remote.getCurrentWindow(), {
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
  redirect(nextProps=this.props){
    const { config, location, history } = this.props

    //Redirect when config was saved
    if(nextProps.config.isSuccess && location.pathname == '/setup'){
      history.push('/')
    }

    //Redirect if config was not found
    if(config.isFailure && location.pathname !== '/setup'){
      history.push('/setup')
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
      children,
      messageBar,
      params: {
        id,
      },
      configInSync,
    } = this.props


    const onSetupPage = pathname == '/setup'
    const onPreferencePage = partOf(pathname)('/preferences')
    const onEditPage = pathname == `/device/${id}/edit` || pathname == `/folder/${id}/edit`
    const onIgnoresPage = pathname == `/folder/${id}/ignores`
    const onAddPage = pathname == '/folder-add' || pathname == '/device-add'

    return h(Window, [
      h(Content, [
        connected && h(Sidebar, {folders, devices}),

        h('div.pane.container-pane', [

          ...messageBar.statics.map(msg => h(MessageBar, {text: msg.msg, staticMsg: true, ...msg})),

          h(MessageBar, {
            text: 'The configuration has been saved but not activated. Syncthing must restart to activate the new configuration.',
            ptStyle: 'warning',
            visible: !configInSync,
            staticMsg: true,
          }),

          h(MessageBar, {
            text: messageBar.msg,
            ptStyle: messageBar.ptStyle,
            visible: messageBar.show,
          }),

          h('div.main-pane', (connected || onSetupPage) ? [

            //Clone element with new ref and onSubmit props for submitting forms from parent
            cloneElement(children, {ref: 'child', onSubmit: this.handleSubmit}),
          ] : [
            h(Disconnected),
          ]),
        ]),

      ]),
      (onPreferencePage || onEditPage || onAddPage || onIgnoresPage) && h(Toolbar, {ptType: 'footer'}, [
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
      // (() => {
      //   if (process.env.NODE_ENV !== 'production') {
      //     const DevTools = require('client/containers/DevTools') // eslint-disable-line global-require
      //     return h(DevTools)
      //   }
      // })(),
    ])
  }
}
