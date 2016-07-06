import React, { PropTypes, Component } from 'react'
import h from 'react-hyperscript'
import { connect } from 'react-redux'
import { shell } from 'electron'

import Size from '../../components/Size'
import SharedDevices from '../../components/SharedDevices'

class Folder extends Component {
  render(){
    const { folders, params, status, devices } = this.props
    const folder = folders.filter(x => x.id == params.id)[0]

    const sharedDevices = folder.devices.map(({deviceID}) => {
      return devices.filter(device => device.deviceID == deviceID)[0]
    }).filter(x => x)

    if(folder){
      return h('div.padded-more', [
        h('header.page-header', [
          h('h2', folder.label || folder.id),
          h('h3', folder.status.state),
        ]),
        h('hr'),
        h(Path, {path: folder.path, home: status.tilde}),
        h(State, folder.status),
        h(SharedDevices, {devices: sharedDevices}),
      ])
    }else{
      return h('div', [
        h('h1', 'Folder not available'),
      ])
    }
  }
}

Folder.propTypes = {
  params: PropTypes.object.isRequired,
  folders: PropTypes.array.isRequired,
  status: PropTypes.object.isRequired,
  devices: PropTypes.array.isRequired,
}

export default connect(
  state => ({
    folders: state.folders,
    status: state.systemStatus,
    devices: state.devices,
  })
)(Folder)

const Path = ({path, home}) => h('div.section-item', [
  h('p.left', 'Path:'),
  h('p.center', path.replace(home, '~')),
  h('a.right', {
    onClick: () => shell.showItemInFolder(path),
  }, 'Open'),
])

const State = ({globalFiles, globalBytes, inSyncBytes, inSyncFiles, needBytes}) =>
h('div.section-item', [
  h('p.left', 'State:'),
  h('div.center', [
    h('p', [
      'Global ',
      `${globalFiles} files`,
      ' (',
      h(Size, {value: globalBytes}),
      ')',
    ]),
    h('p', [
      'Local ',
      `${inSyncFiles} files`,
      ' (',
      h(Size, {value: inSyncBytes}),
      ')',
    ]),
  ]),
  h('p.right', [
    h(InSyncChart, {inSyncBytes, needBytes, globalBytes}),
  ]),
])

import Chart from '../../components/Chart'

const InSyncChart = ({inSyncBytes, needBytes, globalBytes}) => {
  const renderTooltip = ({index}, {datasets: [ { data } ]}) => {
    return Math.round(data[index] > 0 ? (globalBytes / data[index]) * 100 : 0) + '%'
  }

  return h(Chart, {
    type: 'pie',
    data: {
      labels: [
        "Complete",
        "Missing",
      ],
      datasets: [
        {
          data: [inSyncBytes, needBytes],
          backgroundColor: [
            "#48dc6c",
            "#fe4a65",
          ],
        }]
    },
    options: {
      legend: {
        display: false,
      },
      tooltips: {
        callbacks: {
          label: renderTooltip,
        },
      },
    },
    height: 10,
    width: 10,
  })
}

