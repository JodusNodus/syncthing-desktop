import { PropTypes, Component } from 'react'
import h from 'react-hyperscript'
import { connect } from 'react-redux'

import DeviceEdit from '../../containers/DeviceEdit'

const initialValues = {
  deviceID: '',
  name: '',
  addresses: ['dynamic'],
  compression: 'metadata',
  introducer: false,
}

class DeviceAdd extends Component {
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

DeviceAdd.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}

export default connect(
  undefined,
  undefined,
  undefined,
  {withRef: true},
)(DeviceAdd)
