import { Route, IndexRedirect } from 'react-router'
import h from 'react-hyperscript'

import App from './containers/App'
import ServicePreferences from './containers/ServicePreferences'
import Overview from './containers/Overview'
import ClientPreferences from './containers/ClientPreferences'

import Folder from './containers/Folder'
import FolderOverview from './containers/FolderOverview'
import FolderEdit from './containers/FolderEdit'
import FolderIgnores from './containers/FolderIgnores'
import FolderAdd from './containers/FolderAdd'

import Device from './containers/Device'
import DeviceOverview from './containers/DeviceOverview'
import DeviceEdit from './containers/DeviceEdit'
import DeviceAdd from './containers/DeviceAdd'

export default h(Route, {path: '/', component: App}, [
  h(IndexRedirect, {to: 'overview'}),
  h(Route, {path: 'overview', component: Overview}),
  h(Route, {path: 'device/:id', component: Device}, [
    h(IndexRedirect, {to: 'overview'}),
    h(Route, {path: 'overview', component: DeviceOverview}),
    h(Route, {path: 'edit', component: DeviceEdit}),
  ]),
  h(Route, {path: 'device-add', component: DeviceAdd}),
  h(Route, {path: 'folder/:id', component: Folder}, [
    h(IndexRedirect, {to: 'overview'}),
    h(Route, {path: 'overview', component: FolderOverview}),
    h(Route, {path: 'edit', component: FolderEdit}),
    h(Route, {path: 'ignores', component: FolderIgnores}),
  ]),
  h(Route, {path: 'folder-add', component: FolderAdd}),
  h(Route, {path: 'preferences/service', component: ServicePreferences}),
  h(Route, {path: 'preferences/client', component: ClientPreferences}),
])
