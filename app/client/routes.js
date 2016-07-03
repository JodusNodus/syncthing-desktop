import React from 'react'
import { Route, IndexRoute } from 'react-router'
import h from 'react-hyperscript'
import App from './containers/App'
import QrReader from './containers/QrReader'
import Preferences from './containers/Preferences'
import Device from './containers/Device'
import Folder from './containers/Folder'

export default h(Route, {path: '/', component: App}, [
  h(IndexRoute, {component: Preferences}),
  h(Route, {path: 'device/:id', component: Device}),
  h(Route, {path: 'folder/:id', component: Folder}),
  h(Route, {path: 'preferences/:id', component: Preferences}),
  h(Route, {path: 'qr-reader', component: QrReader}),
])
