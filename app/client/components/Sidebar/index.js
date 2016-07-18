import { PropTypes } from 'react'
import { Link } from 'react-router'
import h from 'react-hyperscript'
import { Pane, NavGroup, NavTitle } from 'react-photonkit'
import NavGroupItem from '../NavGroupItem'

import Dropdown from '../Dropdown'

const Sidebar = ({ folders, devices, preferences}) => {
  return h(Pane, {ptSize: 'sm', sidebar: true}, [
    h('div.toolbar-options', [
      h(AddItem),
    ]),
    h(NavGroup, [
      h(NavGroupItem, {glyph: 'home', text: 'Overview', link: '/overview'}),

      h(NavTitle, [
        'Folders',
        h(Link, {className: 'fa fa-plus pull-right', to: '/folder-add'}),
      ]),
      ...folders.map(({key, text, glyph}) => h(NavGroupItem, {glyph, text, link: `/folder/${key}`})),

      h(NavTitle, [
        'Devices',
        h(Link, {className: 'fa fa-plus pull-right', to: '/device-add'}),
      ]),
      ...devices.map(({key, text, glyph, online}) => h(NavGroupItem, {glyph, text, online, link: `/device/${key}`})),

      h(NavTitle, 'Preferences'),
      ...preferences.map(({key, text, glyph}) => h(NavGroupItem, {glyph, text, link: `/preferences/${key}`})),
    ]),
  ])
}

Sidebar.propTypes = {
  folders: PropTypes.array.isRequired,
  devices: PropTypes.array.isRequired,
  preferences: PropTypes.array.isRequired,
}

export default Sidebar


const options = [
  {text: 'New Folder', link: '/folder-add'},
  {text: 'New Device', link: '/device-add'},
]

const AddItem = () =>
h(Dropdown, {options}, [
  h('a.fa.fa-plus.fa-fw'),
])
