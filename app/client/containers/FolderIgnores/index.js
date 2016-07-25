import { PropTypes, Component } from 'react'
import h from 'react-hyperscript'
import { reduxForm } from 'redux-form'
import { shell } from 'electron'
import { TextArea } from 'react-photonkit'

import { getIgnores } from 'main/actions/db'
import { getIgnoresInitialValues } from 'main/reducers/folders'

import { styles } from './styles.scss'

const fields = ['ignores']

export default class FolderIgnores extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    fields: PropTypes.object.isRequired,
    ignores: PropTypes.object.isRequired,
    getIgnores: PropTypes.func.isRequired,
  }

  componentDidMount(){
    this.newDevice.apply(this)
  }
  componentWillUpdate(newProps){
    const { params } = this.props
    const isNewFolder = params.id !== newProps.params.id

    if(isNewFolder){
      this.newDevice.call(this, newProps)
    }
  }
  newDevice(props=this.props){
    const { params, getIgnores } = props
    getIgnores(params.id)
  }
  handleDocumentationClick(){
    shell.openExternal('https://docs.syncthing.net/users/ignoring.html')
  }
  render(){
    const { fields } = this.props

    return h('div', {className: styles}, [
      h(TextArea, {label: 'Enter ignore patterns, one per line.', ...fields.ignores}),
      h('div.pattern-overview', [
        h('p', [
          'Quick overview of supported patterns ',
          '(', h('a', {onClick: this.handleDocumentationClick}, 'full documentation'), ')',
        ]),
        h('p', [
          h('code', '!'),
          'Inversion of the given condition (i.e. do not exclude)',
        ]),
        h('p', [
          h('code', '*'),
          'Single level wildcard (matches within a directory only)',
        ]),
        h('p', [
          h('code', '**'),
          'Multi level wildcard (matches multiple directory levels)',
        ]),
        h('p', [
          h('code', '//'),
          'Comment, when used at the start of a line',
        ]),
      ]),
    ])
  }
}

const mapStateToProps = (state, {params}) => ({
  status: state.systemStatus,
  ignores: state.folders.ignores[params.id],
  initialValues: getIgnoresInitialValues(state, params.id),
})


export default reduxForm(
  {
    form: 'folderIgnores',
    fields,
  },
  mapStateToProps,
  {getIgnores},
)(FolderIgnores)
