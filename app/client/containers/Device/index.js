import { PropTypes, Component, cloneElement } from 'react'
import h from 'react-hyperscript'
import { connect } from 'react-redux'

import Toggle from 'client/components/Toggle'
import SegmentedControl from 'client/components/SegmentedControl'

import { resumeDevice, pauseDevice } from 'main/actions/system'
import { getDevice } from 'main/reducers/devices'

import { styles } from './styles.scss'

const mapStateToProps = (state, { params }) => ({
  device: getDevice(state, params.id),
})

@connect(
  mapStateToProps,
  {resumeDevice, pauseDevice},
  undefined,
  {withRef: true},
)
export default class Device extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    device: PropTypes.object.isRequired,
    resumeDevice: PropTypes.func.isRequired,
    pauseDevice: PropTypes.func.isRequired,
    children: PropTypes.element.isRequired,
    onSubmit: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  }

  constructor(props){
    super(props)
    this.componentDidUpdate = this.componentDidMount = this.redirect.bind(this)
  }
  redirect(){
    if(!this.props.device) this.props.history.push('/')
  }
  handleToggle(){
    const { device, resumeDevice, pauseDevice } = this.props
    if(device.paused){
      resumeDevice(device.deviceID)
    }else{
      pauseDevice(device.deviceID)
    }
  }
  render(){
    const { device, params, children, onSubmit } = this.props

    if(device) {
      return h('div.padded-more', {className: styles}, [
        h('header.page-header', [
          h('h2', device.name),
          h(Toggle, {state: !device.paused, onToggle: this.handleToggle.bind(this)}),
        ]),
        h(SegmentedControl, {buttons: [
          {text: 'Overview', link: `/device/${params.id}/overview`},
          {text: 'Edit', link: `/device/${params.id}/edit`},
        ]}, [
          cloneElement(children, {ref: 'form', onSubmit}),
        ]),
      ])
    }else {
      return h('div')
    }
  }
}
