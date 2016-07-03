import React, {Component, PropTypes} from 'react'
import { Link } from 'react-router'
import h from 'react-hyperscript'
import { Pane, NavGroup, NavTitle } from 'react-photonkit'
import NavGroupItem from '../../components/NavGroupItem'

const Sidebar = ({ folders, devices, preferences}) => {
  return h(Pane, {ptSize: 'sm', sidebar: true}, [
    h(NavGroup, [
      h(NavTitle, 'Folders'),
      ...folders.map(({key, text, glyph}) => h(NavGroupItem, {glyph, text, link: `/folder/${key}`})),

      h(NavTitle, 'Devices'),
      ...devices.map(({key, text, glyph}) => h(NavGroupItem, {glyph, text, link: `/device/${key}`})),

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
