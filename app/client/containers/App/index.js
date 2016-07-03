import { ipcRenderer, remote } from "electron"
import h from 'react-hyperscript'
import React, { Component, PropTypes } from 'react'
import Sidebar from '../components/Sidebar'
import { Window, Toolbar, Actionbar, ButtonGroup, Button, Content, Pane } from 'react-photonkit'
import { connect } from "react-redux"

class App extends Component {
  componentDidMount(){
    ipcRenderer.send('ready', remote.getCurrentWindow().id)
  }
  render() {
    const { folders, devices } = this.props
    const sections = {
      folders: folders.map(({id}) => ({
        glyph: 'folder',
        text: id,
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
      h(Toolbar, {title: 'Syncthing'}, [
        h(Actionbar, [
          h(ButtonGroup, [
            h(Button, {glyph: 'left-open-big'}),
            h(Button, {glyph: 'right-open-big'}),
          ]),
          h(Button, {glyph: 'home', text: 'home'}),
        ]),
      ]),
      h(Content, [
        h(Sidebar, sections),
        h(Pane, [
          this.props.children,
        ]),
      ]),
      h(Toolbar, {ptType: 'footer'}, [
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
}

export default connect(
  state => ({
    devices: state.devices,
    folders: state.folders,
  })
)(App)
