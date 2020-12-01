
import ReactDom from './lib/react-dom.js'
import React from './lib/react.js'


class App extends React.Component{
  handle(){
    console.log(1);
  }
  render() {
    return (
      <div className="wrap">
        <span onClick={this.handle.bind(this)}>hi</span>
      </div>
    )
  }
}

let div = 

ReactDom.render((<App>hello</App>), document.body);