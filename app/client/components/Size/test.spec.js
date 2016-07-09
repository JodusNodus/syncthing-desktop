import { mount, shallow } from 'enzyme'
import { default as chai, expect } from 'chai'
import sinonChai from 'sinon-chai'
import sinon from 'sinon'
import h from 'react-hyperscript'
import Size from './index.js'

chai.use(sinonChai)

describe('h(Size)', function() {
  const wrapper = mount(h(Size, {value: 1024}))

  it('should have the prop for value', function() {
    expect(wrapper.props().value).to.be.defined
    expect(wrapper.props().value).to.equal(1024)
  })

  it('should convert and format the value correctly', function() {
    expect(wrapper.text()).to.equal('1 KB')
  })
})
