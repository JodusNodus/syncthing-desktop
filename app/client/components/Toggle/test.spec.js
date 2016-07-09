import { mount } from 'enzyme'
import { default as chai, expect } from 'chai'
import sinonChai from 'sinon-chai'
import sinon from 'sinon'
import h from 'react-hyperscript'
import Toggle from './index.js'

chai.use(sinonChai)

describe('h(Toggle)', () => {
  let wrapper
  let props

  it('should have the props for state, onToggle, trueChild, falseChild', function() {
    wrapper = mount(h(Toggle, {state: true, onToggle: x => x}))
    expect(wrapper.props().state).to.be.defined
    expect(wrapper.props().onToggle).to.be.defined
    expect(wrapper.props().trueChild).to.be.defined
    expect(wrapper.props().falseChild).to.be.defined
  })

  it('should call an onToggle function when clicked', function() {
    props = {
      state: true,
      onToggle: sinon.spy()
    }
    wrapper = mount(h(Toggle, props))

    wrapper.find('.handle').simulate('click')

    expect(props.onToggle).to.have.been.called
  })
})
