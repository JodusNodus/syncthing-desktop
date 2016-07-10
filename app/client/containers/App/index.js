import { ipcRenderer, remote } from 'electron'
import h from 'react-hyperscript'
import React, { Component, PropTypes } from 'react'
import Sidebar from '../../components/Sidebar'
import { Window, Toolbar, Actionbar, ButtonGroup, Button, Content, Pane } from 'react-photonkit'
import { connect } from 'react-redux'
import _ from 'lodash'

import './global.scss'

class App extends Component {
  componentDidMount(){
    ipcRenderer.send('ready', remote.getCurrentWindow().id)
    if(!this.props.connected) this.props.history.push('/disconnected')
  }
  shouldComponentUpdate(nextProps){
    return !_.isEqual(nextProps, this.props)
  }
  render() {
    const { folders, devices, location, connected } = this.props
    const onPreferencePage = /\/preferences\/.*/.test(location.pathname)

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
        connected && h(Sidebar, sections),
        h(Pane, {className: 'main-pane'}, [
          this.props.children,
        ]),
      ]),
      onPreferencePage && h(Toolbar, {ptType: 'footer'}, [
        h(Actionbar, [
          h(Button, {text: 'cancel'}),
          h(Button, {text: 'save', ptStyle: 'primary', pullRight: true}),
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
}

export default connect(
  state => ({
    devices: state.devices,
    folders: state.folders,
    connected: state.connected,
  })
)(App)
