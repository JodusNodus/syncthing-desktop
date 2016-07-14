import { PropTypes, Component, cloneElement } from 'react'
import h from 'react-hyperscript'
import { connect } from 'react-redux'

import { styles } from './styles.scss'
import SegmentedControl from '../../components/SegmentedControl'

class Folder extends Component {
  render(){
    const { folders, params, children } = this.props
    const folder = folders.filter(x => x.id == params.id)[0]

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
          cloneElement(children, {initialValues: folder}),
        ]),
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
  children: PropTypes.element.isRequired,
}

export default connect(
  state => ({
    folders: state.folders,
  })
)(Folder)

const HeaderStateIcon = ({state}) => h('h3.text-muted', state)
