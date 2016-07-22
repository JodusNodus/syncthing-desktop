import { PropTypes, Component } from 'react'
import h from 'react-hyperscript'
import { connect } from 'react-redux'

import DeviceEdit from 'client/containers/DeviceEdit'

const initialValues = {
  deviceID: '',
  name: '',
  addresses: ['dynamic'],
  compression: 'metadata',
  introducer: false,
}

@connect(
  undefined,
  undefined,
  undefined,
  {withRef: true},
)
export default class DeviceAdd extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
  }

  render(){
    const { onSubmit } = this.props

    return h('div.padded-more', [
      h('header.page-header', [
        h('h2', 'Add Device'),
      ]),
      h('hr'),
      h(DeviceEdit, {ref: 'form', initialValues, onSubmit}),
    ])
  }
}
