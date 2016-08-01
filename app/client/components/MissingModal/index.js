import { PropTypes, Component } from 'react'
import h from 'react-hyperscript'
import { connect } from 'react-redux'
import randomString from 'randomstring'
import { capitalize, map } from 'lodash'

import { Button, ButtonGroup } from 'react-photonkit'
import Progress from 'react-progressbar'
import Modal from 'client/components/Modal'
import Size from 'client/components/Size'

import { getMissing } from 'main/actions/db'
import { hideMissingModal, setMissingPage } from 'client/actions/missing-modal'

import { styles } from './styles.scss'

const mapStateToProps = (state) => ({
  missingModal: state.missingModal,
})

@connect(
  mapStateToProps,
  {
    getMissing,
    hideMissingModal,
    setMissingPage,
  },
)
export default class MissingModal extends Component {
  static propTypes = {
    folder: PropTypes.object.isRequired,
    missingModal: PropTypes.object.isRequired,
    getMissing: PropTypes.func.isRequired,
    hideMissingModal: PropTypes.func.isRequired,
  }

  constructor(props){
    super(props)
    this.hideMissingModal = this.hideMissingModal.bind(this)
  }
  componentWillUpdate(newProps){
    const { missingModal, folder, getMissing } = newProps

    if(this.props.folder.missing && folder.missing && this.props.folder.missing.page != folder.missing.page){
      if(this.missingInterval){
        clearInterval(this.missingInterval)
      }
      // TODO: fix this interval
      this.missingInterval = setInterval(
        () => {
          console.log(folder.missing.page)
        },
        // getMissing(folder.id, folder.missing.page, folder.missing.perpage),
        2000
      )
    }

    if(!this.props.missingModal.show && missingModal.show){
      //Initial request
      getMissing(folder.id, 1, 10)

    }else if(this.props.missingModal.show && !missingModal.show){
      if(this.missingInterval){
        clearInterval(this.missingInterval)
      }
    }else if(this.props.folder && this.props.folder.missing && this.props.folder.missing.total > 0 && folder && folder.missing && folder.missing.total < 1){
      this.hideMissingModal()
    }
  }
  componentWillUnmount(){
    if(this.missingInterval){
      clearInterval(this.missingInterval)
    }
  }
  hideMissingModal(){
    clearInterval(this.missingInterval)
    this.props.hideMissingModal()
  }
  render(){
    const {
      missingModal,
      getMissing,
      setMissingPage,
      folder: {
        missing,
      },
      folder,
    } = this.props

    return h(Modal, {
      visible: missingModal.show,
      cancelButton: false,
      doneButton: false,
      className: styles,
    }, [
      h('table.table-striped', [
        h('thead', [
          h('tr', [
            h('th', 'Name'),
            h('th', 'Status'),
            h('th', 'Size'),
          ]),
        ]),
        h('tbody', missing && missing.missing.map(({name, status, progress, size }) => {
          const percent = progress && Math.round((progress.bytesDone / progress.bytesTotal) * 100)

          //Not optimal should be replaced by index based key
          const key = randomString.generate(16)
          return h('tr', {key}, [
            h('td', name),
            h('td', [
              status == 'progress' && progress ?
              h(Progress, {completed: percent})
              : parseFileStatus(status),
            ]),
            h('td', [
              h(Size, {value: size}),
            ]),
          ])
        })),
      ]),
      missing && h(ButtonGroup, map(
        new Array(missing.pages),
        (x, i) => {
          const page  = i + 1
          const isCurrent = missing.page == page
          return h(Button, {
            text: page,
            ptStyle: isCurrent ? 'primary' : 'default',
            onClick: () => {
              setMissingPage(folder.id, page)
              getMissing(folder.id, page, missing.perpage)
            },
          })
        }
      )),
      h(Button, {
        text: 'Done',
        ptStyle: 'primary',
        pullRight: true,
        onClick: this.hideMissingModal,
      }),
    ])
  }
}

const parseFileStatus = status => {
  switch (status) {
    case 'progress':
    return 'In progress'
    case 'rest':
    return 'Waiting'
    default:
    return capitalize(status)
  }
}
