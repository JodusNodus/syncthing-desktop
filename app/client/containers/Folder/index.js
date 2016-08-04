import { PropTypes, Component, cloneElement } from 'react'
import h from 'react-hyperscript'
import { connect } from 'react-redux'
import _ from 'lodash'

import { getFolder } from 'main/reducers/folders'
import { overrideChanges } from 'main/actions/db'

import { Button } from 'react-photonkit'
import Header from 'client/components/Header'
import SegmentedControl from 'client/components/SegmentedControl'

import { styles } from './styles.scss'

const mapStateToProps = (state, {params}) => ({
  folder: getFolder(state, params.id),
})

@connect(
  mapStateToProps,
  {overrideChanges},
  undefined,
  {withRef: true},
)
export default class Folder extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    folder: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired,
    history: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    overrideChanges: PropTypes.func.isRequired,
  }

  constructor(props){
    super(props)
    this.componentDidUpdate = this.componentDidMount = this.redirect.bind(this)
    this.handleOverride = this.handleOverride.bind(this)
  }
  redirect(){
    if(!this.props.folder || !this.props.folder.id) this.props.history.push('/')
  }
  handleOverride(){
    this.props.overrideChanges(this.props.folder.id)
  }
  render(){
    const { folder, params, children, onSubmit} = this.props

    if(folder){
      return h('div.padded-more', {className: styles}, [
        h(Header, [
          h('h2', folder.label || folder.id),
          folder.status && h(HeaderStateIcon, {handleOverride: this.handleOverride, ...folder.status}),
        ]),
        h(SegmentedControl, {buttons: [
          {text: 'Overview', link: `/folder/${params.id}/overview`},
          {text: 'Edit', link: `/folder/${params.id}/edit`},
          {text: 'Ignores', link: `/folder/${params.id}/ignores`},
        ]}, [
          cloneElement(children, {ref: 'form', onSubmit}),
        ]),
      ])
    }else{
      return h('div')
    }
  }
}

const stateText = state => {
  switch (state) {
    case 'idle':
    return 'Up to Date'
    case 'error':
    return 'Stopped'
    case 'unshared':
    return 'Not Shared'
    case 'outofsync':
    return 'Out of Sync'
    default:
    return _.capitalize(state)
  }
}

const HeaderStateIcon = ({state, handleOverride}) =>
state == 'outofsync' ? h(Button, {
  text: 'Override Changes',
  ptStyle: 'negative',
  ptSize: 'large',
  onClick: handleOverride,
}) : h('h3.text-muted', stateText(state))
