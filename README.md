# 今天就手写一个简单的React
造轮子能让我们更加深入理解React及其思想.
## JSX
>是JavaScript语法的扩展,用于形象的描述一段DOM结构

- 众所周知,react使用jsx,大多数的 React 开发者使用了一种名为 “JSX” 的特殊语法，`<div />`会被编译成` React.createElement('div')`
- 在 JSX 中你可以任意使用 JavaScript 表达式，只需要用一个大括号把表达式括起来。每一个 React 元素事实上都是一个 JavaScript 对象，你可以在你的程序中把它当保存在变量中或者作为参数传递。---来自官网

```javascript
//转换前
let div = <div className="header">hello</div>;
console.log(div);
```
```javascript
//转换后
let div = React.createElement("div", {
  className: "header"
}, "hello");
console.log(div);
```
### 但是上面的代码不能直接被浏览器识别,因此我们需要
- 配置环境实现JSX的转换
- 预定义React.createElement的功能

## 搭建设置React环境，Webpack和Babel
先通过npm初始化项目
```javascript
npm init -y //全自动yes
```
### 设置Webpack
```javascript
npm i webpack webpack-cli --save-dev
```
在package.json的script中配置命令
```javascript
"build": "webpack --mode production"
```
配置webpack.config.js

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
 entry: './src/index.js',
 module: {
 rules: [
 {
 test: /\.(js|jsx)$/, 
 exclude: /node_modules/,
 use: ['babel-loader']
 }
 ]
 },
 plugins: [ new HtmlWebpackPlugin() ],//自动生成html文件插件
 output: {
 filename: '[name].[hash:5].bundle.js',
 path: path.resolve(__dirname, 'dist')
 },
 devtool: 'inline-source-map',
 devServer: { contentBase: './dist' }
}
```
### 设置Babel解释JSX

Babel用于把js转换成旧版本js,利于适配,让更多浏览器能够运行你的代码
- babel-loader是负责与Babel对话的 webpack loader,同时 Babel必须配置预设（preset，预先配置好的一组插件）：
- @babel/preset-env 用于将现代JavaScript编译为ES5
- @babel/preset-react 可将JSX和其他内容编译为JavaScript
- @babel/core 转换代码的核心
然后新建一个`.bablerc`文件,用于配置他的插件,但是插件太多了,官方提供了直接打包的插件,就是上面说的preset,预设

```javascript
{
 "presets": [
 "@babel/preset-env",
 "@babel/preset-react"
 ]
}
```
最后别忘了装`webpack-dev-server`和`html-webpack-plugin`

 <img src="https://img-blog.csdnimg.cn/20201130140226957.png"   width="60%">

### 测试环境是否能用
运行npm start ,因为JSX被转换了,但是React和createElement暂时都没定义,先定义一下看看效果.
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201130151412741.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L01TNjMyNF9aQUtV,size_16,color_FFFFFF,t_70)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201130151359273.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L01TNjMyNF9aQUtV,size_16,color_FFFFFF,t_70)
好了成功了,jsx转换成功

## 虚拟DOM

把JSX转换成的片段输出为对象形式
因为JSX转换成的形式是这样的:

```javascript
let div = /*#__PURE__*/React.createElement("div", {
  className: "header"
}, "hello");
console.log(div);
```
我们可以自定义**React和createElement**,让他return生成一个**虚拟DOM对象**
```javascript
const React = {
  createElement(tags,attrs,...childern){
    return {
      tags,
      attrs,
      childern
    }
  }
}
```
 <img src="https://img-blog.csdnimg.cn/20201130154343455.png"   width="80%">
可以看到,标签里面的标签,在jsx转换后,就成了套娃的函数.因此这里把孩子转换成数组
得到虚拟DOM后,需要将这个对象渲染到网页上,那么怎么渲染呢?
### 渲染在网页上
- 在预设虚拟DOM的对象格式后
- 设置一个渲染函数,
- 虚拟DOM的标签上的文本都在对象上的childern那块,因为标签里面还有标签,所以要用到递归
- 即在父标签渲染到网页上后再继续渲染子标签,直到只剩下文本,不再渲染标签,直接把字符串写网页上

```javascript
const React = {
  createElement(tags, attrs, ...childern) {
    return {
      tags,
      attrs,
      childern
    }
  }
}

function render(vDOM,container){
  let node
  if(typeof vDOM === 'string'){
    node=document.createTextNode(vDOM)// 子元素如果是字符串，直接拼接字符串
  }if(typeof vDOM === 'object'){
    node=document.createElement(vDOM.tags)
    setAttribute(node, attrs)//对标签上加属性
    vDOM.childern.forEach(childDom => render(childDom,node))
  }//对于子元素,继续遍历,分别执行render函数,文本就直接渲染,对象就把标签渲染到网页上,直到渲染成只有文本
  container.appendChild(node)
}

const ReactDom = {
  render(vDOM, container) {
    container.innerHtml = ''
    render(vDOM, container)
  }
}
let div = (<h1 className="hello">
  <span> hello </span>
  <span> world </span>
  你好
</h1>)
console.log(div);
ReactDom.render(div,document.body)
```
 <img src="https://img-blog.csdnimg.cn/20201130161428426.png"   width="60%">
成功渲染

### 渲染属性
属性无非那么几种
- id
- className
- onclick之类的
- style

```javascript
function setAttribute(node, attrs) {
 if(!attrs) return;
 for(let key in attrs) {
 if(key.startsWith('on')) {
 node[key.toLocaleLowerCase()] = attrs[key];
 } else if(key === 'style') {
 Object.assign(node.style, attrs[key]);//有的话新增
 } else {
 node[key] = attrs[key];//否则直接赋值
	 }
  }
}
```
成功
## 引入组件
就像vue一样,当我们使用路由组件时,一般会将组件标签名称首字母大写,那么在JSX中如果使用大写开头标签会怎么样呢?
- 如图所见,标签名不再是字符串(之前是'div')
- 那么我们就可以通过判断他是不是字符串的方式来解决组件的问题
- 而且可以看出来这个Div是个变量或者对象?那么久可以使用构造函数来表示他
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201201113015933.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L01TNjMyNF9aQUtV,size_16,color_FFFFFF,t_70)

```javascript
//定义组件名为App,要用到这个组件的时候new以下变为对象
class App extends React.Component{
//初始状态和方法继承于React.Component
  handle(){
  }
  //当我需要渲染页面时,调用new App().render()即可返回标签
  render(){
    return (
      <div>
        <sapn onClick={}>hello</sapn>
      </div>
    )
  }
}
```
然后我们可以增加一条逻辑,判断是否是组件,如果不是字符串那就是组件
![在这里插入图片描述](https://img-blog.csdnimg.cn/2020120112031987.png)
那么接下来就是在这个逻辑中,把虚拟dom渲染成dom,接下来要做的就是这个.自始至终目的就是将虚拟dom 渲染成 dom.

那么怎么做呢?再理一遍思路
- 我们判断vDOM是否为构造函数的目的是什么?
- 目的就是拿到组件对象中的**标签**
- 那么拿到了标签,即vNode,下一步我们就回到了在引入组件前的渲染逻辑.把拿到的虚拟dom转成dom,那么就需要修改现有函数,把vdom一次性转换成dom,再渲染到container上
![在这里插入图片描述](https://img-blog.csdnimg.cn/20201201123509855.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L01TNjMyNF9aQUtV,size_16,color_FFFFFF,t_70)

![在这里插入图片描述](https://img-blog.csdnimg.cn/20201201141225347.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L01TNjMyNF9aQUtV,size_16,color_FFFFFF,t_70)
成功
