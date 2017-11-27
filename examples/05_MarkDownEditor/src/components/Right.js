import React from 'react';
import marked from 'marked';

class Right extends React.Component {
  constructor(props) {
    super(props);
  }
  rawMarkup(e) {
    let rawMarkup = marked(e.toString(),
    {
      sanitize: true,
      gfm: true,
      tables: true,
      breaks: true,
      pedantic: false,
      sanitize: true,
      smartLists: true,
      smartypants: true,
    });
    return { __html: rawMarkup };
  }
  render() {
    return (
      <div style={this.props.style}>
        <div
          className="preview-area markdown-body"
          dangerouslySetInnerHTML={this.rawMarkup(this.props.state.get('text'))}
        />
      </div>
    );
  }
}
export default Right;
