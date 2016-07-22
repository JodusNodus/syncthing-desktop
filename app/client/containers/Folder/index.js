import { PropTypes, Component, cloneElement } from 'react'
import h from 'react-hyperscript'
import { connect } from 'react-redux'
import _ from 'lodash'

import { getFolder } from 'main/reducers/folders'

import SegmentedControl from 'client/components/SegmentedControl'

import { styles } from './styles.scss'

const mapStateToProps = (state, {params}) => ({
  folder: getFolder(state, params.id),
})

@connect(
  mapStateToProps,
  undefined,
  undefined,
  {withRef: true},
)
export default class Folder extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    folder: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired,
    onSubmit: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  }

  constructor(props){
    super(props)
    this.componentDidUpdate = this.componentDidMount = this.redirect.bind(this)
  }
  redirect(){
    if(!this.props.folder || !this.props.folder.id) this.props.history.push('/')
  }
  render(){
    const { folder, params, children, onSubmit } = this.props

    if(folder){
      return h('div.padded-more', {className: styles}, [
        h('header.page-header', [
          h('h2', folder.label || folder.id),
          folder.status && h(HeaderStateIcon, folder.status),
        ]),
        h(SegmentedControl, {buttons: [
          {text: 'Overview', link: `/folder/${params.id}/overview`},
          {text: 'Edit', link: `/folder/${params.id}/edit`},
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
    return 'stopped'
    case 'unshared':
    return 'Not Shared'
    default:
    return _.capitalize(state)
  }
}

const HeaderStateIcon = ({state}) =>
  h('h3.text-muted', stateText(state))
