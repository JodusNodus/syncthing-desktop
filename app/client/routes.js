import React from 'react'
import { Route, IndexRoute, IndexRedirect } from 'react-router'
import h from 'react-hyperscript'
import App from './containers/App'
import ServicePreferences from './containers/ServicePreferences'
import Device from './containers/Device'
import Folder from './containers/Folder'
import Overview from './containers/Overview'
import ClientPreferences from './containers/ClientPreferences'
import FolderOverview from './containers/FolderOverview'
import FolderEdit from './containers/FolderEdit'
import DeviceOverview from './containers/DeviceOverview'
import DeviceEdit from './containers/DeviceEdit'

export default h(Route, {path: '/', component: App}, [
  h(IndexRedirect, {to: 'overview'}),
  h(Route, {path: 'overview', component: Overview}),
  h(Route, {path: 'device/:id', component: Device}, [
    h(IndexRedirect, {to: 'overview'}),
    h(Route, {path: 'overview', component: DeviceOverview}),
    h(Route, {path: 'edit', component: DeviceEdit}),
  ]),
  h(Route, {path: 'folder/:id', component: Folder}, [
    h(IndexRedirect, {to: 'overview'}),
    h(Route, {path: 'overview', component: FolderOverview}),
    h(Route, {path: 'edit', component: FolderEdit}),
  ]),
  h(Route, {path: 'preferences/service', component: ServicePreferences}),
  h(Route, {path: 'preferences/client', component: ClientPreferences}),
])
