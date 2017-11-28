import React from 'react';

import AceEditor from 'react-ace';
import brace from 'brace';
import 'brace/mode/csharp';
import 'brace/theme/github';

class Left extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      //value: "default",
      theme: 'github',
      mode: 'csharp',
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
  }
  onChange(newValue){
    this.props.actions.changetext(newValue);
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
          onChange={this.onChange}
          value={this.props.state.get('input')}
          fontSize={this.state.fontSize}
          showPrintMargin={this.state.showPrintMargin}
          showGutter={this.state.showGutter}
          highlightActiveLine={this.state.highlightActiveLine}
          editorProps={{$blockScrolling: true}}
          setOptions={{
            //enableBasicAutocompletion: this.state.enableBasicAutocompletion,
            //enableLiveAutocompletion: this.state.enableLiveAutocompletion,
            //enableSnippets: this.state.enableSnippets,
            showLineNumbers: this.state.showLineNumbers,
            tabSize: 2,
        }}/>
      </div>

    )
  }
}
export default Left;
