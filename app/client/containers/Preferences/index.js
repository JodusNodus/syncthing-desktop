import React, { Component } from 'react'
import h from 'react-hyperscript'

export default class Preferences extends Component {
  constructor(props){
    super(props)
    this.state = {
      result: null,
    }
  }
  render(){
    return h('div', [
      h('h1', 'Preferences Page')
    ])
  }
}
