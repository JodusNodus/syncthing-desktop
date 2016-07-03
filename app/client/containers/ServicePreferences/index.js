import React, { Component } from 'react'
import h from 'react-hyperscript'
import {
  Input,
  TextArea,
  CheckBox,
  Options,
  RadioGroup,
  Radio,
  Button,
} from 'react-photonkit'

export default class ServicePreferences extends Component {
  render(){
    //return h('div', [
      //h('h1', 'Preferences Page')
    //])
    return h('form', [
      h(Input, {label: 'Device Name'}),
      h(Input, {label: 'Sync Protocol Listen Addresses'}),
      h(Input, {label: 'Incoming Rate Limit (KiB/s)', type: 'number'}),
      h(Input, {label: 'Outgoing Rate Limit (KiB/s)', type: 'number'}),

      h(CheckBox, {label: 'Enable NAT traversal'}),
      h(CheckBox, {label: 'Global Discovery'}),
      h(CheckBox, {label: 'Local Discovery'}),
      h(CheckBox, {label: 'Enable Relaying'}),

      h(Input, {label: 'Global Discovery Servers'}),

      h(CheckBox, {label: 'Anonymous Usage Reporting'}),
    ])
  }
}
