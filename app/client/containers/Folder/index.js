import { PropTypes, Component, cloneElement } from 'react'
import h from 'react-hyperscript'
import { connect } from 'react-redux'

import { styles } from './styles.scss'
import SegmentedControl from '../../components/SegmentedControl'
import { getFolder } from '../../selectors/folders'

class Folder extends Component {
  render(){
    const { folder, params, children, onSubmit, history } = this.props

    if(folder){
      return h('div.padded-more', {className: styles}, [
        h('header.page-header', [
          h('h2', folder.label || folder.id),
          folder.status && h(HeaderStateIcon, {state: folder.status.state}),
        ]),
        h(SegmentedControl, {buttons: [
          {text: 'Overview', link: `/folder/${params.id}/overview`},
          {text: 'Edit', link: `/folder/${params.id}/edit`},
        ]}, [
          cloneElement(children, {ref: 'form', initialValues: folder, onSubmit}),
        ]),
      ])
    }else{
      history.push('/')
      return h('div')
    }
  }
}

Folder.propTypes = {
  params: PropTypes.object.isRequired,
  folder: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
  onSubmit: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
}

const mapStateToProps = (state, { params }) => ({
  folder: getFolder(state, params.id),
})

export default connect(
  mapStateToProps,
  undefined,
  undefined,
  {withRef: true},
)(Folder)

const HeaderStateIcon = ({state}) => h('h3.text-muted', state)
