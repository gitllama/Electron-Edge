import React from 'react';
import marked from 'marked';
import mermaid from 'mermaid';

mermaid.mermaidAPI.initialize({
  startOnLoad: false,
  gantt: {
    axisFormat: '%m-%d'
  }
});

class Right extends React.Component {
  constructor(props) {
    super(props);
  }
  rawMarkup(e) {
    let rawMarkup = marked(
      e.toString(),
      {
        sanitize: true,
        gfm: true,
        tables: true,
        breaks: true,
        pedantic: false,
        sanitize: true,
        smartLists: true,
        smartypants: true,
        highlight: (code, lang)=>{
          let dst;
          switch(lang){
            case "mermaid":
              try {
                mermaid.mermaidAPI.render(
                  `mermaid-${Date.now()}`,
                  code,
                  (svgCode)=>( dst = svgCode )
                )
              } catch(error) {
                dst = code;
              }
              return dst;
            default:
              break;
          }
        }
      }
    );
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
