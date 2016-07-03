import React, { Component } from 'react'
import QrWebcam from 'react-qr-reader'
import h from 'react-hyperscript'
import { remote } from 'electron'

export default class QrReader extends Component {
  constructor(props){
    super(props)
    this.state = {
      result: null,
    }
  }
  handleScan(result){
    this.setState({ result })
  }
  handleError(e){
    console.error(e)
  }
  handleCancel(){
    this.setState({
      result: null,
    })
  }
  render(){
    const styles = {
      modal: {
        position: 'absolute',
        height: 100 + '%',
        width: 100 + '%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      text: {
        color: 'white',
      },
    }
    const { result } = this.state
    return h('div', [
      result && h('div', { style: styles.modal }, [
        h('h3', {style: styles.text}, result),
        //h('button', {onClick: this.handleAdd.bind(this)}, 'Add'),
        h('button', {onClick: this.handleCancel.bind(this)}, 'Cancel'),
      ]),
      h(QrWebcam, {
        width: 400,
        height: 225,
        handleScan: this.handleScan.bind(this),
        handleError: this.handleError.bind(this),
      }),
    ])
  }
}
