
function createElement(tag, attrs, ...children) {
  return {
    tag,
    attrs, 
    children
  }
}


class Component{
  constructor(props){
    this.props = props,
    this.states = {}//设置初始状态
  }
  //修改状态
  setStates(newStates){
    Object.assign(this.states,newStates)
  }
}

const React = {
  createElement,
  Component
}

export default React