# MapEditor

## Description

トランスパイルさせてるので別に早くはないです。

## future

- 左bin右クリックタブルでのmapエディター
- mono印刷用に記号切り替え機能
- 履歴との比較
- 座標方向、記号の意味、ノッチ方向の記述

## MapEditor


## Markdown

svg, mermaid.jpを使用しているので、GitlabのReadme.mdなどにそのまま転載可能

### mermaid gantt

```
gantt
  dateFormat YYYY-MM-DD
  title Adding GANTT diagram functionality to mermaid
  section Lot001
    A : done,         001_1, 2014-01-06, 2014-01-08
    B : done, active, 001_2, 2014-01-06, 2014-01-08
    C : done,         001_3, 2014-01-06, 2014-01-08
    C :               001_4, 2014-01-06, 2014-01-08
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


## プログラム構造

```
[src] ┬ main.js      : main process (entry point)
      ├ mainlogic.js : main process logic
      ├ index.html   : render process entry point
      ├ index.js     : render process
      ├ [action]     : only createActions only
      ├ [reducers]   : initialState / reducers(only 'REDUCER_CHANGE')
      ├ [sagas]      : Sagas
      ├ [components]
      ├ [logic]      : render process logic
      └ [img]
```

### init動作

```mermaid
sequenceDiagram
  Note right of main : config.json読込
  main ->>+ render     : render起動
  Note right of render : transpile
  render -->>- main    : (did-finish-load)
  main -->> render     : INIT_ASYNCLATEST(config)
  render -->>+ saga     : INIT_ASYNCLATEST(config)
  Note right of saga    : initialState<br/>初期化動作
  saga -->>- render     : REDUCER_CHANGE
```

INIT_ASYNCLATEST

- mapconfig
- busy
- 
