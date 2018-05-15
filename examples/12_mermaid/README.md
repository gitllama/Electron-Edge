# ElectronMermaid

## Description

mermaid.jpを使用しているので、GitlabのReadme.mdなどにそのまま転載可能

## WfMap



## mermaid gantt

```
gantt
  dateFormat YYYY-MM-DD
  title Adding GANTT diagram functionality to mermaid
  section Lot001
    A : done,         001_1, 2014-01-06, 2014-01-08
    B    : done, active, 001_2, 2014-01-06, 2014-01-08
    C   : done,         001_3, 2014-01-06, 2014-01-08
    C   :               001_4, 2014-01-06, 2014-01-08
  ```
- ForegroundColor : done, active, [null]
- LineColor : crit, [null]
- id :
- StartDate : after [id], date
- EndDate : xxD, date

## SQL

sqlite3を使用していますが、node-sqlite3ではなくsql.jsを使用しています。

https://github.com/kripken/sql.js/

node-sqlite3は electron-rebuildしたりなど、依存関係やマルチプラットフォームでの動作の不安が多いですが、sql.jsはピュアjavascriptなので比較的安心です。

# MapEditor


## Description

200CT組立用

svg, mermaid.jpを使用しているので、GitlabのReadme.mdなどにそのまま転載可能

# future

- 左bin右クリックタブルでのmapエディター
- mono印刷用に記号切り替え機能
- 履歴との比較
- 座標方向、記号の意味、ノッチ方向の記述
