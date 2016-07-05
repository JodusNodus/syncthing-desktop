import React, { PropTypes } from 'react'
import h from 'react-hyperscript'
import { Table } from 'react-photonkit'

const FolderExplorer = ({files}) => h(Table, [
  h('thead', [
    h('tr', [
      h('th', 'Name'),
      h('th', 'Date'),
      h('th', 'Size'),
    ]),
  ]),
  h('tbody', files.map(({date, size, name}) => h('tr', [
    h('td', name),
    h('td', date),
    h('td', size),
  ]))),
])

FolderExplorer.propTypes = {
}

export default FolderExplorer
