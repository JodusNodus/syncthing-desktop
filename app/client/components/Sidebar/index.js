import { PropTypes } from 'react'
import { Link } from 'react-router'
import h from 'react-hyperscript'

import { NavGroup, NavTitle } from 'react-photonkit'
import NavGroupItem from 'client/components/NavGroupItem'

import { styles } from './styles.scss'

const getIndicatorStyle = (state) => {
  switch (state) {
    case 'idle':
    return 'positive'
    case 'scanning':
    return 'primary'
    case 'error':
    return 'negative'
    case 'syncing':
    return 'primary'
    case 'unshared':
    return 'warning'
    default:
    return 'default'
  }
}

const Folders = ({folders}) =>
h('div.folders', folders.map(({key, text, glyph, state}) =>
h(NavGroupItem, {
  indicator: state ? true : false,
  indicatorStyle: getIndicatorStyle(state),
  link: `/folder/${key}`,
  glyph: 'folder',
  text,
  key,
})))

const Devices = ({devices}) =>
h('div.devices', devices.map(({key, text, connected}) =>
h(NavGroupItem, {
  indicator: connected,
  indicatorStyle: 'positive',
  link: `/device/${key}`,
  glyph: 'monitor',
  text,
  key,
})))

const Preferences = ({preferences}) =>
h('div.preferences', preferences.map(({key, text}) =>
h(NavGroupItem, {
  link: `/preferences/${key}`,
  glyph: 'cog',
  text,
})))

const Sidebar = props => {
  const folders = props.folders.map(({id, label, status}) => ({
    text: label || id,
    key: id,
    state: status && status.state,
  }))

  const devices = props.devices.map(({name, deviceID, connected}) => ({
    text: name,
    key: deviceID,
    connected,
  }))
  
  const preferences = [
    { text: 'Service', key: 'service' },
    { text: 'Client', key: 'client' },
  ]

  return h('div.pane.sidebar', {className: styles}, [
    h(NavGroup, [
      h(NavGroupItem, {glyph: 'home', text: 'Overview', link: '/overview'}),

      h(NavTitle, [
        'Folders',
        h(Link, {className: 'fa fa-plus pull-right', to: '/folder-add'}),
      ]),
      h(Folders, {folders}),

      h(NavTitle, [
        'Devices',
        h(Link, {className: 'fa fa-plus pull-right', to: '/device-add'}),
      ]),
      h(Devices, {devices}),

      h(NavTitle, 'Preferences'),
      h(Preferences, {preferences}),
    ]),
  ])
}

Sidebar.propTypes = {
  folders: PropTypes.array.isRequired,
  devices: PropTypes.array.isRequired,
  preferences: PropTypes.array.isRequired,
}

export default Sidebar
