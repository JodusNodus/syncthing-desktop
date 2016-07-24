import { PropTypes } from 'react'
import h from 'react-hyperscript'
import { Button } from 'react-photonkit'

import { styles } from './styles.scss'

const Modal = ({ children, onCancel, onDone, visible, doneButton=true, cancelButton=true }) =>
h('div.modal-container', {className: `${styles} ${visible && 'visible'}`}, [
  h('div.overlay'),
  h('div.modal', [
    h('div.content', [
      children,
    ]),
    h('div.options', [
      cancelButton && h(Button, {text: 'Cancel', onClick: onCancel}),
      doneButton && h(Button, {text: 'Done', ptStyle: 'primary', onClick: onDone}),
    ]),
  ]),
])

Modal.propTypes = {
  children: PropTypes.any,
  onCancel: PropTypes.func,
  onDone: PropTypes.func,
  visible: PropTypes.bool.isRequired,
  cancelButton: PropTypes.bool,
  doneButton: PropTypes.bool,
}

export default Modal
