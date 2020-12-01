function render(vdom, container) {
  let node = createDom(vdom)
  container.appendChild(node);
}


function createDom(vdom) {
  let node;
  if (typeof vdom === 'string') {
    node = document.createTextNode(vdom);
    return node
  }

  if (typeof vdom === 'object') {
    if (typeof vdom.tag === 'function') {
      let component = new vdom.tag(vdom.attrs)
      let vnode = component.render()
      node = createDom(vnode)
    }else{
      node = document.createElement(vdom.tag);
      setAttribute(node, vdom.attrs);
      vdom.children.forEach(childVdom => render(childVdom, node));
    }
  }
  return node
}




function setAttribute(node, attrs) {
  if (!attrs) return;
  for (let key in attrs) {
    if (key.startsWith('on')) {
      node[key.toLocaleLowerCase()] = attrs[key];
    } else if (key === 'style') {
      Object.assign(node.style, attrs[key]);
    } else {
      node[key] = attrs[key];
    }
  }
}

const ReactDom = {
  render(vdom, container) {
    container.innerHTML = '';
    render(vdom, container);
  }
};

export default ReactDom