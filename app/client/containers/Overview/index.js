import React, { Component } from 'react'
import h from 'react-hyperscript'

export default class Overview extends Component {
  constructor(props){
    super(props)
    this.state = {
      result: null,
    }
  }
  render(){
    return h('div', [
      h('h1', 'Overview Page')
    ])
  }
}
