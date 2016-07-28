import { PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import h from 'react-hyperscript'

import { NavGroup, NavTitle } from 'react-photonkit'
import NavGroupItem from 'client/components/NavGroupItem'

import { getSidebarItems }  from './selectors'
import { styles } from './styles.scss'

const Folders = ({folders}) =>
h('div.folders', folders.map(({key, text, indicatorStyle}) =>
h(NavGroupItem, {
  indicator: indicatorStyle ? true : false,
  indicatorStyle,
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

const Sidebar = ({folders, devices, preferences}) => {
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

export default connect(
  state => getSidebarItems(state),
)(Sidebar)
