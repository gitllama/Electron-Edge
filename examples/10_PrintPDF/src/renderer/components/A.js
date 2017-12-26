import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import actions from '../../actions';

// CSS Grid Layout
// 210mm x296mm
/*
gridTemplateRows 行のトラックの高さ
gridTemplateColumns 列のトラックの幅
 px, %, em, vh, vw, mm, cm, in, pt, pc, ch, rem, vmin, vmax
 fr 残りの幅（fr複数の場合は）
 max-content コンテンツ内のアイテムの最大幅
 auto
 fit-content(長さ)
 minmax(min, max)
*/
const container = {
  display: 'grid',
  gridTemplateRows: '10mm 10mm 50mm 15mm 201mm 10mm ',
  gridTemplateColumns: '2% 8% 8% 8% 8% 8% 8% 8% 8% 8% 8% 8% 8% 1fr',
  gridRowGap: '0mm',
};
const header = {
  gridRow: '1',
  gridColumn: '2/14',
  textAlign: 'right',
};
const footer = {
  gridRow: '6',
  gridColumn: '1/15',
  background: '#f88',
};
const title = {
  gridRow: '2',
  gridColumn: '1/15',
  fontSize: '5mm',
  fontWeight: 'bold',
  textAlign: 'center',
  textDecoration: 'underline',
};
const addr = {
  gridRow: '3',
  gridColumn: '2/6',
  background: '#f88',
};
const company = {
  gridRow: '3',
  gridColumn: '9/14',
  background: '#f88',
};
const c1 = {
  fontSize: '3mm',
  gridRow: '4',
  gridColumn: '2/6',
  background: '#88f',
};
const c2 = {
  fontSize: '3mm',
  gridRow: '4',
  gridColumn: '9/14',
  background: '#88f',
};
const tables = {
  fontSize: '3mm',
  gridRow: '5',
  gridColumn: '1/15',
};

const outline = {
  margin: '0mm',
  width: '100%',
  border: '0.5mm solid #000000',
};
const outlineth = {
  fontSize: '3mm',
  background: '#eeeeee',
  border: '1px solid #000000',
};
const outlinetd = {
  border: '1px solid #000000',
  textAlign: 'center',
};


class App extends React.Component {
  render() {
    return (
      <div style={container}>
        <div style={header}>2017-12-26</div>
        <div style={title}>請求書</div>
        <div style={footer}>footer</div>
        <div style={addr}>
            〒xxx-xxxx<br />
            xx県xx市xx x-xx-X<br /><br />
            株式会社 xxxx 御中<br /><br />
            TEL xxx-xxx-xxxx<br />
            FAX xxx-xxx-xxxx
        </div>
        <div style={company}>
          <em>株式会社 XXXX</em><br />
          xx xx<br /><br />
          〒xxx-xxxx xx県xx市xx x-xx-X<br />
          TEL xxx-Xxx-xxxx FAX xxx-xxx-xxxx<br />
        </div>
        <div style={c1}>
          いつもありがとうございます。<br />
          下記の通りご請求申し上げます。<br />
        </div>
        <div style={c2}>
          振込は下記口座までお願い致します<br />
          xx銀行 xx支店 普通 xxxxxxxx<br />
          xx信用金庫 xx支店 普通 xxxxxxxx<br />
        </div>

        <div style={tables}>
          <table style={outline}>
            <tr>
              <th style={outlineth} width="14%">今回御入金額</th>
              <th style={outlineth} width="14%">繰越金額</th>
              <th style={outlineth} width="14%">前回御請求額</th>
              <th style={outlineth} width="14%">御買上額</th>
              <th style={outlineth} width="14%">消費税額</th>
              <th style={outlineth} width="14%">御買上額計</th>
              <th style={outlineth} width="14%">今回御請求額</th>
            </tr>
            <tr>
              <td style={outlinetd} >394,275</td>
              <td style={outlinetd}>394,275</td>
              <td style={outlinetd}>0</td>
              <td style={outlinetd}>210,800</td>
              <td style={outlinetd}>10,540</td>
              <td style={outlinetd}>221,340</td>
              <td style={outlinetd}>221,340</td>
            </tr>
          </table>
        </div>

      </div>
    );
  }
}

export default connect(
  state => ({ state }),
  dispatch => ({ actions: bindActionCreators(actions, dispatch) }),
)(App);
