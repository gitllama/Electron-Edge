# ElectronReact

babel-registerでトランスパイルしながら動かしているので、そんなに実行効率は良くない

## React

ライセンス形態でトラブルとなっていたReactですが、16.0.0以降からMITライセンスとなったので16.0.0以上を使用するのがいろいろすっきりします（React 15.6.2もMITライセンス）

## React 16.0.0以前/以後

気付いたものだけ...

- 16.0.0以前
  - 非推奨（移行前含） / 削除
    - componentWillMount
    - componentWillReceiveProps
    - componentWillUpdate
    - LinkedStateMixin, valueLink -> react-linked-input
    - React.createClass
    - React.findDOMNode -> ReactDOMへ
    - React.render -> ReactDOMへ
    - React.renderToString -> ReactDOMへ
    - React.renderToStaticMarkup -> ReactDOMへ
    - React.unmountComponentAtNode -> ReactDOMへ
    - batchedUpdates, cloneWithProps
    - setProps, replaceProps, getDOMNode
    - this.refs.div.props等
    - ReactPerf.printDOM() -> ReactPerf.printOperations()
    - ReactPerf.getMeasurementsSummaryMap() -> ReactPerf.getWasted()
- 新規
  - MITライセンス化


### React 16.2.0

- 空のJSXのタグ
  - childrenをグループ化```<><A/><B/><C/><>```
- renderから配列の返却
  - childrenをラップする代わりにrender() { return [] }
  - key属性必要
- React.Fragment

### React 16.3.0

- Context API
  - Redux is dead ? Not Dead Yet ?
  - ComponentのLocal State(setState)に使って共存するイメージかと
- createRef API
  - componentDidMountでrefコールバック型が使える
  - 文字列refは廃止の方針決定
- forwardRef API
  - Higher-Order Componentsでref引数に使える
- Component Lifecycle Changes
  - getDerivedStateFromProps
    - componentWillReceiveProps代用/更新時・マウント時呼び出し
    - staticなのでthis.setState()使えない、returnした値が新しいstateにマージ
    - 更新しない際はreturn null
    - 呼び出し後にcomponentDidUpdate
  - getSnapshotBeforeUpdate
    - componentWillUpdate代用/更新前に必ず一度だけ呼ばれる
  - componentDidUpdate、snapshot引数追加
