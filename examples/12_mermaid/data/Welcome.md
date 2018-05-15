# WELCOME

- [ ] A
- [x] B
- [ ] C

```mermai
 OTT
```

```wavedrom
{ signal: [
  { name: "clk",  wave: "P......" },
  { name: "bus",  wave: "x.==.=x", data: ["head", "body", "tail", "data"] },
  { name: "wire", wave: "0.1..0." }
]}
```

```wfmap
{
  "title" : "TEST",
  "wfsize" : 200,
  "offsetX" : 12.2,
  "offsetY" : 4.0,
  "chipSizeX" : 24.8,
  "chipSizeY" : 17.2,
  "countX" : 9,
  "countY" : 12,
  "edge" : 5,
  "notch" : 9,
  "notchside" : 0,
  "chip": [
    {"y" : 1, "x": 3, "text": 22},
    {"y" : 1, "x": 4, "text": 23},
    {"y" : 1, "x": 5, "text": 42, "background" : "black"},
    {"y" : 2, "x": 2, "text": 43},
    {"y" : 2, "x": 3, "text": 41},
    {"y" : 2, "x": 4, "text": 24},
    {"y" : 2, "x": 5, "text": 21},
    {"y" : 2, "x": 6, "text": 5},
    {"y" : 3, "x": 2, "text": 6},
    {"y" : 3, "x": 3, "text": 20},
    {"y" : 3, "x": 4, "text": 25},
    {"y" : 3, "x": 5, "text": 40},
    {"y" : 3, "x": 6, "text": 44},
    {"y" : 4, "x": 7, "text": 54},
    {"y" : 4, "x": 6, "text": 45},
    {"y" : 4, "x": 5, "text": 39}
  ]
}
```

```mermaid
gantt
  dateFormat YYYY-MM-DD
  title Adding GANTT diagram functionality to mermaid
  section Lot001
    A : 001_1, 2014-01-06, 2014-01-08
    B    : 001_2, 2014-01-10, 2014-01-12
    C   : 001_3, 2014-01-13, 2014-01-15
  section Lot001-01
    C   : 001_4, 2014-01-14, 2014-01-16
  section Lot001-02
    C   :               001_5, 2014-01-15, 2014-01-17
  section ★Lot002
      A : crit, 002_1, 2014-01-06, 2014-01-08
      B    : crit, 002_2, 2014-01-10, 2014-01-12
      C   : crit, 002_3, 2014-01-13, 2014-01-15
  section ★Lot002-01
      C   : crit, 002_4, 2014-01-14, 2014-01-16
  section Lot003
  section Lot003-00
      TPSCo : 003_1, 2014-01-06, 2014-01-08
      B    : 003_2, 2014-01-10, 2014-01-12
      C   : 003_3, 2014-01-13, 2014-01-15
  section Lot003-01
      C   : 003_4, 2014-01-14, 2014-01-16
  section Lot003-02
      C   : 003_5, 2014-01-15, 2014-01-17
```
