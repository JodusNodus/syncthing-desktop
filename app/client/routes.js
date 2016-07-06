import React from 'react'
import { Route, IndexRoute, IndexRedirect } from 'react-router'
import h from 'react-hyperscript'
import App from './containers/App'
import ServicePreferences from './containers/ServicePreferences'
import Device from './containers/Device'
import Folder from './containers/Folder'
import Overview from './containers/Overview'

export default h(Route, {path: '/', component: App}, [
  h(IndexRedirect, {to: 'overview'}),
  h(Route, {path: 'overview', component: Overview}),
  h(Route, {path: 'device/:id', component: Device}),
  h(Route, {path: 'folder/:id', component: Folder}),
  h(Route, {path: 'preferences/service', component: ServicePreferences}),
])
