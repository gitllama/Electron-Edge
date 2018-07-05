import React from 'react';

import AceEditor from 'react-ace';
import brace from 'brace';

const languages = [
  'javascript',
  'java',
  'python',
  'xml',
  'ruby',
  'sass',
  'markdown',
  'mysql',
  'json',
  'html',
  'handlebars',
  'golang',
  'csharp',
  'elixir',
  'typescript',
  'css'
]

const themes = [
  'monokai',
  'github',
  'tomorrow',
  'kuroir',
  'twilight',
  'xcode',
  'textmate',
  'solarized_dark',
  'solarized_light',
  'terminal',
]
// import 'brace/mode/ruby';
// import 'brace/theme/monokai';
languages.forEach((lang) => {
  require(`brace/mode/${lang}`)
  require(`brace/snippets/${lang}`)
})

class Left extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      //value: "default",
      theme: 'monokai',
      mode: 'markdown',
      enableBasicAutocompletion: false,
      enableLiveAutocompletion: false,
      fontSize: 14,
      showGutter: true,
      showPrintMargin: true,
      highlightActiveLine: true,
      enableSnippets: false,
      showLineNumbers: true,
    };

    this.onChange = this.onChange.bind(this);
    this.onLoad = this.onLoad.bind(this);
  }
  onLoad(editor){
    //this.editor=editor;
    console.log('i\'ve loaded');
  }
  onChange(newValue){
    console.log('change', newValue);
    this.props.handleonChange(newValue);
  }
  onSelectionChange(newValue, event) {
    console.log('select-change', newValue);
    console.log('select-change-event', event);
  }
  onCursorChange(newValue, event) {
    console.log('cursor-change', newValue);
    console.log('cursor-change-event', event);
  }
  onValidate(annotations) {
    console.log('onValidate', annotations);
  }
  setTheme(e) {
    this.setState({
      theme: e.target.value
    })
  }
  setMode(e) {
    this.setState({
      mode: e.target.value
    })
  }
  setBoolean(name, value) {
    this.setState({
      [name]: value
    })
  }
  setFontSize(e) {
    this.setState({
      fontSize: parseInt(e.target.value,10)
    })
  }
  handleOnClick(){
    this.editor.insert("click!")
  }
  render() {
    return (
      <div style={this.props.style}>
        <AceEditor
          width="100%"
          height="100%"
          mode={this.state.mode}
          theme={this.state.theme}
          name="blah2"
          onLoad={this.onLoad}
          onChange={this.onChange}
          onSelectionChange={this.onSelectionChange}
          onCursorChange={this.onCursorChange}
          onValidate={this.onValidate}
          value={this.props.state.get('text')}
          fontSize={this.state.fontSize}
          showPrintMargin={this.state.showPrintMargin}
          showGutter={this.state.showGutter}
          highlightActiveLine={this.state.highlightActiveLine}
          setOptions={{
            enableBasicAutocompletion: this.state.enableBasicAutocompletion,
            enableLiveAutocompletion: this.state.enableLiveAutocompletion,
            enableSnippets: this.state.enableSnippets,
            showLineNumbers: this.state.showLineNumbers,
            tabSize: 2,
        }}/>
      </div>

    )
  }
}
export default Left;
